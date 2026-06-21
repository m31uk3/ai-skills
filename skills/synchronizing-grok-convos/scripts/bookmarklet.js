// Updated bookmarklet for better 6-stream extraction on current x.com/grok.com
// Usage: Create a bookmark with the code below (copy from the minified version if needed)

javascript:(function(){
  try {
    // Find the main chat content area
    let chatContainer = 
      document.querySelector('[data-testid="primaryColumn"]') ||  // x.com best
      document.querySelector('[data-testid="chat-messages"]') ||
      document.querySelector('[data-testid="conversation"]') ||
      document.querySelector('main') || 
      document.querySelector('.chat-messages') || 
      document.body;

    if (!chatContainer) {
      alert('Could not find chat container. Make sure you are on a Grok conversation page.');
      return;
    }

    // Collect potential message blocks (more inclusive for current UI)
    let candidates = Array.from(
      chatContainer.querySelectorAll(
        '[data-testid*="message"], [data-testid*="cell"], [role="article"], ' +
        'div[class*="message"], div[class*="grok"], div[class*="conversation-turn"], ' +
        'div:has(> div[class*="flex"])'
      )
    );

    if (candidates.length < 3) {
      // Fallback to large text containers
      candidates = Array.from(chatContainer.querySelectorAll('div, p, section, li'))
        .filter(el => (el.innerText || '').trim().length > 30);
    }

    const streams = {
      user_prompts: [],
      grok_replies: [],
      x_sources: [],
      web_sources: [],
      thinking: [],
      tool_calls: []
    };

    let lastWasUser = false;

    candidates.forEach((el, i) => {
      let text = (el.innerText || '').trim();
      if (text.length < 20) return;

      const html = el.outerHTML;
      const lower = text.toLowerCase();

      // Clean speaker prefixes
      text = text.replace(/^(You|Grok|Human|Assistant)\s*[:\-]\s*/i, '').trim();
      if (!text) return;

      const isUser = 
        el.getAttribute('data-testid')?.toLowerCase().includes('user') ||
        lower.startsWith('you ') ||
        (lower.match(/^(i |can you|please |what |how |why )/i) && text.length < 600 && !lower.includes('i think'));

      const hasThinking = 
        lower.includes('thinking') || lower.includes('reasoned') || 
        lower.includes('let me think') || lower.includes('thought process') ||
        !!el.querySelector('[class*="think"], details, [data-think]');

      const hasX = 
        text.includes('x.com') || text.includes('twitter.com') ||
        lower.includes('x source') || lower.includes('post from @');

      const hasWeb = 
        text.match(/\[\d+\]/) || 
        lower.includes('web source') || lower.includes('search result') ||
        lower.includes('according to') || lower.includes('based on search');

      const hasTool = 
        lower.includes('tool') || lower.includes('function call') || 
        lower.includes('i called') || lower.includes('i used the');

      const entry = { index: i, text, html };

      if (isUser) {
        streams.user_prompts.push(entry);
        lastWasUser = true;
      } else if (hasThinking) {
        streams.thinking.push(entry);
        lastWasUser = false;
      } else if (hasX) {
        streams.x_sources.push(entry);
        lastWasUser = false;
      } else if (hasWeb) {
        streams.web_sources.push(entry);
        lastWasUser = false;
      } else if (hasTool) {
        streams.tool_calls.push(entry);
        lastWasUser = false;
      } else {
        if (lastWasUser && text.length < 400) {
          streams.user_prompts.push(entry); // avoid leaking short user text
        } else {
          streams.grok_replies.push(entry);
        }
        lastWasUser = false;
      }
    });

    // Strong fallback
    const hasStreams = Object.values(streams).some(a => a.length > 0);
    if (!hasStreams) {
      const full = (chatContainer.innerText || '').trim();
      if (full.length > 100) streams.grok_replies.push({ text: full });
    }

    const fullHtml = chatContainer.outerHTML;
    let title = document.title || 'Grok Conversation';
    const titleEl = chatContainer.querySelector('h1, h2, [data-testid*="title"]');
    if (titleEl && titleEl.innerText) title = titleEl.innerText.trim();

    const url = location.href;
    const idMatch = url.match(/\/(?:c|chat)\/([a-z0-9-]+)/i) || url.match(/[?&]conversation=([a-z0-9-]+)/i);
    const id = idMatch ? idMatch[1] : 'unknown-' + Date.now();

    const dump = {
      id, url, title,
      extracted_at: new Date().toISOString(),
      streams,
      full_chat_html: fullHtml
    };

    // Download JSON (preferred for CLI)
    const jsonBlob = new Blob([JSON.stringify(dump, null, 2)], {type: 'application/json'});
    const jurl = URL.createObjectURL(jsonBlob);
    const ja = document.createElement('a');
    ja.href = jurl; ja.download = `grok-${id}.json`;
    document.body.appendChild(ja); ja.click(); document.body.removeChild(ja);
    URL.revokeObjectURL(jurl);

    // Also download a basic markdown preview
    let md = `# ${title}\n\nSource: ${url}\nCaptured: ${dump.extracted_at}\n\n`;
    md += '## User Prompts\n\n' + (streams.user_prompts.map(p => `- ${p.text}`).join('\n\n') || '(none)') + '\n\n';
    md += '## Grok Replies\n\n' + (streams.grok_replies.map(r => `> ${r.text}`).join('\n\n') || '(none)') + '\n\n';
    md += '## Grok X Sources\n\n' + (streams.x_sources.map(s => s.text).join('\n') || '(none)') + '\n\n';
    md += '## Grok Web Sources\n\n' + (streams.web_sources.map(s => s.text).join('\n') || '(none)') + '\n\n';
    md += '## Thinking / Reasoning\n\n' + (streams.thinking.map(t => t.text).join('\n\n') || '(none detected)') + '\n\n';
    md += '## Tool Calls & Hooks\n\n' + (streams.tool_calls.map(t => t.text).join('\n') || '(phase 2)') + '\n';

    const mblob = new Blob([md], {type:'text/markdown'});
    const murl = URL.createObjectURL(mblob);
    const ma = document.createElement('a');
    ma.href = murl; ma.download = `grok-${id}-basic.md`;
    document.body.appendChild(ma); ma.click(); document.body.removeChild(ma);
    URL.revokeObjectURL(murl);

    console.log('Grok bookmarklet done. JSON + basic.md downloaded.');
    alert('Downloaded grok-' + id + '.json and -basic.md');
  } catch(e) {
    console.error(e);
    alert('Bookmarklet error: ' + e.message);
  }
})();