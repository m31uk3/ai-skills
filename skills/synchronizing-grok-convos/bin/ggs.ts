#!/usr/bin/env bun
/**
 * ggs — Grok Global Sync
 *
 * Robust, reliable global/continuous sync of private Grok conversations
 * from both grok.com and x.com into a local Obsidian vault.
 *
 * Default target: ~/.grok/conversations/  (single folder, surface in frontmatter)
 *
 * Usage:
 *   bun run bin/ggs.ts --sync
 *   bun run bin/ggs.ts "https://x.com/i/grok?conversation=..." --target ...
 *   ggs --sync                    (after bun build --compile)
 *
 * Build the binary:
 *   bun build ./bin/ggs.ts --compile --outfile bin/ggs
 *
 * This is the production implementation of the architecture validated in
 * egc--grok-export-defuddle-26May26 (Playwright for discovery + hybrid capture,
 * Defuddle required, 6-stream maximizer, incremental index).
 */

import { chromium, BrowserContext, Page } from 'playwright';
import { execSync } from 'child_process';
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

interface ConvMeta {
  id: string;
  url: string;
  title?: string;
  last_updated?: string;
}

interface LocalIndex {
  [id: string]: {
    local_path: string;
    last_message_count: number;
    captured: string;
    surface?: string;
  };
}

interface Stream {
  text: string;
  html?: string;
}

interface SixStreams {
  user_prompts: Stream[];
  grok_replies: Stream[];
  x_sources: Stream[];
  web_sources: Stream[];
  thinking: Stream[];
  tool_calls: Stream[];
}

const DEFAULT_TARGET = join(homedir(), '.grok', 'conversations');

function parseArgs() {
  const args = process.argv.slice(2);
  const options: any = { target: null, sync: false, headed: false };
  let session: string | null = null;

  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--target' || a === '-t') options.target = args[++i];
    else if (a === '--sync') options.sync = true;
    else if (a === '--headed') options.headed = true;
    else if (a === '--html') options.html = args[++i];
    else if (!a.startsWith('--')) session = a;
  }
  return { options, session };
}

function getTarget(options: any): string {
  const t = options.target || process.env.GGS_TARGET || DEFAULT_TARGET;
  return t;
}

async function getBrowserContext(headed: boolean): Promise<BrowserContext> {
  const userDataDir = join(homedir(), '.grok-playwright');
  const ctx = await chromium.launchPersistentContext(userDataDir, {
    headless: !headed,
    args: ['--disable-blink-features=AutomationControlled'],
  });
  return ctx;
}

function detectSurface(url: string): 'grok.com' | 'x.com' {
  if (url.includes('x.com') || url.includes('twitter.com')) return 'x.com';
  return 'grok.com';
}

async function discoverConversations(ctx: BrowserContext): Promise<ConvMeta[]> {
  const page = await ctx.newPage();
  const urlsToCheck = ['https://grok.com', 'https://x.com/i/grok'];
  const all: ConvMeta[] = [];

  for (const base of urlsToCheck) {
    try {
      // Use domcontentloaded + manual wait - networkidle times out too easily on x.com
      await page.goto(base, { waitUntil: 'domcontentloaded', timeout: 45000 });
      await page.waitForTimeout(2000);

      // Scroll to load history (tunable)
      for (let s = 0; s < 12; s++) {
        await page.evaluate(() => window.scrollBy(0, 900));
        await page.waitForTimeout(550);
      }

      const links = await page.$$eval('a[href*="/c/"], a[href*="/chat/"], a[href*="conversation="]', (els) =>
        els.map((el) => ({
          url: (el as HTMLAnchorElement).href,
          title: el.textContent?.trim() || 'untitled',
        }))
      );

      for (const l of links) {
        let id = '';
        const cMatch = l.url.match(/\/(?:c|chat)\/([a-z0-9-]+)/i);
        const convMatch = l.url.match(/[?&]conversation=([a-z0-9-]+)/i);
        if (cMatch) id = cMatch[1];
        else if (convMatch) id = convMatch[1];

        if (id) {
          all.push({ id, url: l.url, title: l.title });
        }
      }
    } catch (e) {
      console.warn(`Could not discover on ${base}:`, (e as Error).message);
    }
  }

  await page.close();

  const seen = new Set<string>();
  return all.filter((c) => {
    if (seen.has(c.id)) return false;
    seen.add(c.id);
    return true;
  });
}

async function extractStreamsFromPage(page: Page): Promise<SixStreams> {
  return await page.evaluate(() => {
    const root = document.querySelector('main') || document.body;
    const primary = root.querySelector('[data-testid="primaryColumn"]') || root;

    const streams: any = {
      user_prompts: [], grok_replies: [], x_sources: [], web_sources: [], thinking: [], tool_calls: []
    };

    // User messages using the structure from the example XPath/element
    // The user message containers have class pattern like r-1habvwh r-18u37iz
    const userContainers = Array.from(primary.querySelectorAll('div.r-1habvwh.r-18u37iz'));
    userContainers.forEach((container: any) => {
      const text = container.innerText.trim();
      if (text.length > 10) {
        streams.user_prompts.push({ text, html: container.outerHTML });
      }
    });

    // Grok replies and sub-streams: find containers with long structured text or "Thoughts"
    const grokContainers = Array.from(primary.querySelectorAll('div')).filter((el: any) => {
      const t = el.innerText.trim();
      return t.length > 200 && (t.includes('Thoughts') || t.includes('Converged Optimal') || t.includes('Dimensions') || t.includes('recommendation engine'));
    });

    grokContainers.forEach((container: any) => {
      let text = container.innerText.trim();
      if (text.includes('Thoughts')) {
        const parts = text.split(/Thoughts/i);
        if (parts[0] && parts[0].trim()) streams.grok_replies.push({ text: parts[0].trim(), html: container.outerHTML });
        if (parts[1] && parts[1].trim()) streams.thinking.push({ text: 'Thoughts' + parts[1].trim(), html: container.outerHTML });
      } else if (text.includes('http') && (text.includes('x.com') || text.includes('twitter'))) {
        streams.x_sources.push({ text, html: container.outerHTML });
      } else if (text.match(/\[\d+\]/) || text.includes('according to') || text.includes('web source')) {
        streams.web_sources.push({ text, html: container.outerHTML });
      } else if (text.includes('tool') || text.includes('function call')) {
        streams.tool_calls.push({ text, html: container.outerHTML });
      } else {
        streams.grok_replies.push({ text, html: container.outerHTML });
      }
    });

    // Fallback to improved text blocks if needed
    if (streams.user_prompts.length === 0 && streams.grok_replies.length === 0) {
      let candidates = Array.from(
        root.querySelectorAll(
          '[data-testid*="message"], [data-testid*="cell"], [role="article"], ' +
          'div[class*="message"], div[class*="grok"], div[class*="conversation-turn"], ' +
          'div:has(> div > div[class*="flex"])'
        )
      );
      if (candidates.length < 3) {
        candidates = Array.from(root.querySelectorAll('div, p, section, li'))
          .filter((el: any) => (el.innerText || '').trim().length > 50);
      }
      const seen = new Set<string>();
      let consecutiveUser = 0;
      candidates.forEach((el: any) => {
        let txt = (el.innerText || '').trim();
        if (txt.length < 25) return;
        const lower = txt.toLowerCase();
        if (txt.length < 25) return;
        const norm = txt.toLowerCase().replace(/\s+/g, ' ').slice(0, 120);
        if (seen.has(norm)) return;
        seen.add(norm);
        const isUser = el.getAttribute('data-testid')?.toLowerCase().includes('user') || lower.startsWith('you ');
        const hasThinking = lower.includes('thinking') || lower.includes('reasoning') || lower.includes('let me think') || !!el.querySelector('[class*="think"], details');
        const hasX = txt.includes('x.com') || lower.includes('x source');
        const hasWeb = txt.match(/\[\d+\]/) || lower.includes('web source') || lower.includes('according to');
        const hasTool = lower.includes('tool') || lower.includes('function call');
        if (isUser) {
          streams.user_prompts.push({ text: txt });
          consecutiveUser++;
        } else if (hasThinking) {
          streams.thinking.push({ text: txt });
          consecutiveUser = 0;
        } else if (hasX) {
          streams.x_sources.push({ text: txt });
          consecutiveUser = 0;
        } else if (hasWeb) {
          streams.web_sources.push({ text: txt });
          consecutiveUser = 0;
        } else if (hasTool) {
          streams.tool_calls.push({ text: txt });
          consecutiveUser = 0;
        } else {
          if (consecutiveUser > 0 && txt.length < 300) {
            streams.user_prompts.push({ text: txt });
          } else {
            streams.grok_replies.push({ text: txt });
          }
          consecutiveUser = 0;
        }
      });
    }

    return streams;
  });
}

async function processConversation(ctx: BrowserContext, conv: ConvMeta, target: string, htmlPath?: string) {
  const outDir = target;
  mkdirSync(outDir, { recursive: true });

  let htmlForDefuddle = '';
  let page: Page | null = null;
  let bookmarkletHints: any = null;
  let jsonUrl: string | null = null;

  if (htmlPath) {
    if (htmlPath.endsWith('.json')) {
      const json = JSON.parse(readFileSync(htmlPath, 'utf8'));
      htmlForDefuddle = json.full_chat_html || json.html || '';
      if (json.streams) bookmarkletHints = json.streams;
      if (json.url) jsonUrl = json.url;
      if (json.title && (!conv.title || conv.title === conv.id)) conv.title = json.title;
    } else {
      htmlForDefuddle = readFileSync(htmlPath, 'utf8');
    }
  } else {
    page = await ctx.newPage();
    
    // More robust navigation - networkidle is too strict on x.com
    await page.goto(conv.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    try {
      await page.waitForSelector(
        'main, [data-testid="primaryColumn"], [data-testid="cellInnerDiv"], div[role="article"], [class*="grok"], [class*="message"]', 
        { timeout: 25000 }
      );
    } catch {
      console.log('Warning: Chat content selectors not found yet, waiting a bit longer...');
      await page.waitForTimeout(3000);
    }
    
    await page.waitForTimeout(2000);
    htmlForDefuddle = await page.content();
  }

  // Wrap fragment if necessary for Defuddle (bookmarklet often gives subtree only)
  if (htmlForDefuddle && !htmlForDefuddle.trim().startsWith('<!') && !htmlForDefuddle.trim().startsWith('<html')) {
    htmlForDefuddle = `<!DOCTYPE html><html><head></head><body>${htmlForDefuddle}</body></html>`;
  }

  // Wrap fragment if necessary for Defuddle (bookmarklet often gives subtree only)
  if (htmlForDefuddle && !htmlForDefuddle.trim().startsWith('<!') && !htmlForDefuddle.trim().startsWith('<html')) {
    htmlForDefuddle = `<!DOCTYPE html><html><head></head><body>${htmlForDefuddle}</body></html>`;
  }

  // Determine surface from best available URL
  const effectiveUrl = jsonUrl || conv.url;
  const surface = detectSurface(effectiveUrl);

  const rawPath = join(outDir, `${conv.id}.raw.html`);
  writeFileSync(rawPath, htmlForDefuddle);

  // === ALWAYS run Defuddle ===
  let defuddled = '';
  let wordCount = 0;
  try {
    const defuddleOut = execSync(`npx defuddle parse "${rawPath}" --markdown --json`, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore'],
    });
    const parsed = JSON.parse(defuddleOut);
    defuddled = parsed.content || parsed.contentMarkdown || '';
    wordCount = parsed.wordCount || (defuddled.split(/\s+/).length);
  } catch (e) {
    console.warn('Defuddle failed, falling back:', (e as Error).message);
    defuddled = htmlForDefuddle.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    wordCount = defuddled.split(/\s+/).length;
  }

  // === ALWAYS run Maximizer ===
  // Pass Defuddled content as primary, raw HTML for structural hints, bookmarklet as optional hints only
  let streams: SixStreams = await maximizeStreams(defuddled, htmlForDefuddle, bookmarkletHints);

  if (page) {
    await page.close();
  }

  const frontmatter = `---
title: "${(conv.title || conv.id).replace(/"/g, '\\"')}"
id: "${conv.id}"
source: "${effectiveUrl}"
surface: "${surface}"
captured: "${new Date().toISOString()}"
word_count: ${wordCount}
status: "to-be-reviewed"
type: "grok-conversation"
tags: [grok, chat]
---
`;

  let body = `# ${conv.title || 'Grok Conversation'}\n\n`;
  body += `Source: [${effectiveUrl}](${effectiveUrl})\n`;
  body += `Surface: ${surface}\n\n`;

  body += `## Conversation\n\n`;

  // Linear back-and-forth turns so the conversation is readable and the
  // outline view shows the natural User / Grok alternation.
  // We approximate interleaving from the two main lists.
  const maxTurns = Math.max(
    streams.user_prompts.length,
    streams.grok_replies.length
  );

  for (let i = 0; i < maxTurns; i++) {
    if (i < streams.user_prompts.length) {
      const item = streams.user_prompts[i];
      body += `### User\n\n${item.text}\n\n`;
    }
    if (i < streams.grok_replies.length) {
      const item = streams.grok_replies[i];
      body += `### Grok\n\n${item.text}\n\n`;
    }
  }

  // Other streams collected at the end as their own top-level H2 sections.
  // Order: X Sources, Web Sources, Thinking, Tool Calls (as requested).
  if (streams.x_sources.length > 0) {
    body += `\n## Grok X Sources\n\n`;
    streams.x_sources.forEach(item => { body += `${item.text}\n\n`; });
  }
  if (streams.web_sources.length > 0) {
    body += `\n## Grok Web Sources\n\n`;
    streams.web_sources.forEach(item => { body += `${item.text}\n\n`; });
  }
  if (streams.thinking.length > 0) {
    body += `\n## Grok Thinking / Reasoning\n\n`;
    streams.thinking.forEach(item => { body += `${item.text}\n\n`; });
  }
  if (streams.tool_calls.length > 0) {
    body += `\n## Tool Calls & Hooks\n\n`;
    streams.tool_calls.forEach(item => { body += `${item.text}\n\n`; });
  }

  const outPath = join(outDir, `${conv.id}.md`);
  writeFileSync(outPath, frontmatter + body);

  console.log(`Exported: ${outPath} (surface=${surface}, words=${wordCount})`);
  return { path: outPath, word_count: wordCount, surface };
}

/**
 * Maximizer: Always operates on Defuddled content (clean text) + raw HTML hints.
 * Bookmarklet streams are used only as optional hints, never as primary source.
 */
async function maximizeStreams(
  defuddled: string,
  rawHtml: string,
  bookmarkletHints: any | null
): Promise<SixStreams> {
  // Start with empty streams
  const streams: SixStreams = { user_prompts: [], grok_replies: [], x_sources: [], web_sources: [], thinking: [], tool_calls: [] };

  // 1. Use Defuddled clean text as the primary source for splitting
  //    (this is the key improvement: work on cleaned content, not raw DOM)
  const cleanBlocks = splitIntoBlocks(defuddled);

  // 2. Optional hints from bookmarklet (treated as weak signals only)
  const hintMap: any = {};
  if (bookmarkletHints) {
    for (const [k, arr] of Object.entries(bookmarkletHints)) {
      if (Array.isArray(arr)) {
        hintMap[k] = arr.map((x: any) => (x.text || x).trim()).filter(Boolean);
      }
    }
  }

  // 3. Classification + dedup on clean blocks (stronger logic on Defuddled content)
  const seen = new Set<string>();
  let lastWasUser = false;

  for (const block of cleanBlocks) {
    const text = block.trim();
    if (text.length < 25) continue;

    const norm = text.toLowerCase().replace(/\s+/g, ' ').slice(0, 120);
    if (seen.has(norm)) continue; // dedup
    seen.add(norm);

    const lower = text.toLowerCase();

    const isUser = 
      lower.startsWith('you ') ||
      (lower.match(/^(i |can you|please |what |how |why |tell me )/i) && text.length < 500 && !lower.includes('i think'));

    const hasThinking = 
      lower.includes('thinking') || 
      lower.includes('reasoning') ||
      lower.includes('let me think') ||
      lower.includes('thought process');

    const hasX = text.includes('x.com') || lower.includes('x source') || lower.includes('post from @');
    const hasWeb = text.match(/\[\d+\]/) || lower.includes('web source') || lower.includes('search result') || lower.includes('according to');
    const hasTool = lower.includes('tool') || lower.includes('function call') || lower.includes('i called');

    if (isUser) {
      streams.user_prompts.push({ text });
      lastWasUser = true;
    } else if (hasThinking) {
      streams.thinking.push({ text });
      lastWasUser = false;
    } else if (hasX) {
      streams.x_sources.push({ text });
      lastWasUser = false;
    } else if (hasWeb) {
      streams.web_sources.push({ text });
      lastWasUser = false;
    } else if (hasTool) {
      streams.tool_calls.push({ text });
      lastWasUser = false;
    } else {
      if (lastWasUser && text.length < 350) {
        streams.user_prompts.push({ text });
      } else {
        streams.grok_replies.push({ text });
      }
      lastWasUser = false;
    }
  }

  // 4. If bookmarklet provided strong hints and we have very little, fall back lightly (hints only)
  if (bookmarkletHints) {
    if (streams.user_prompts.length === 0 && bookmarkletHints.user_prompts?.length) {
      streams.user_prompts = bookmarkletHints.user_prompts.map((t: string) => ({ text: t }));
    }
    // similar light merge for other streams can be added here if needed
  }

  return streams;
}

/** Split Defuddled markdown into reasonable blocks for classification */
function splitIntoBlocks(markdown: string): string[] {
  // Split on double newlines or obvious turn markers, while preserving some context
  return markdown
    .split(/\n\s*\n+|\n(?=You|Grok|Human|Assistant|Thoughts|Source:)/i)
    .map(b => b.trim())
    .filter(b => b.length > 0);
}

async function loadLocalIndex(target: string): Promise<LocalIndex> {
  const idxPath = join(target, '.grok-sync-index.json');
  if (existsSync(idxPath)) {
    return JSON.parse(readFileSync(idxPath, 'utf8'));
  }
  return {};
}

function saveLocalIndex(target: string, index: LocalIndex) {
  const idxPath = join(target, '.grok-sync-index.json');
  writeFileSync(idxPath, JSON.stringify(index, null, 2));
}

async function main() {
  const { options, session } = parseArgs();
  const target = getTarget(options);
  mkdirSync(target, { recursive: true });

  const index = await loadLocalIndex(target);

  if (options.sync || !session) {
    console.log('Discovering conversations across grok.com + x.com (scrolling history)...');
    const ctx = await getBrowserContext(options.headed);
    const remote = await discoverConversations(ctx);

    let processed = 0;
    for (const conv of remote) {
      const local = index[conv.id];
      const needs = !local;

      if (needs) {
        console.log(`Processing ${conv.id} (${detectSurface(conv.url)})...`);
        const res = await processConversation(ctx, conv, target);
        index[conv.id] = {
          local_path: res.path,
          last_message_count: 0,
          captured: new Date().toISOString(),
          surface: res.surface,
        };
        processed++;
      }
    }
    await ctx.close();
    saveLocalIndex(target, index);
    console.log(`Sync complete. Processed ${processed} new/updated conversations into ${target}`);
    return;
  }

  // Single ID / URL mode
  const ctx = await getBrowserContext(options.headed);
  const url = session!.startsWith('http') ? session! : `https://grok.com/c/${session}`;
  const conv: ConvMeta = {
    id: session!.includes('=') ? session!.split('=').pop()! : (session!.split('/').pop() || session!),
    url,
  };
  await processConversation(ctx, conv, target, options.html);
  await ctx.close();
}

main().catch(console.error);
