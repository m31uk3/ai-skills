# synchronizing-grok-convos (ggs)

Global sync for Grok conversations across grok.com + x.com → clean Obsidian Markdown.

**Default location:** `~/.grok/conversations/`

**CLI binary name:** `ggs`

## Quick Start

```bash
cd /path/to/synchronizing-grok-convos
bun install
bunx playwright install chromium

# Build the single binary (recommended)
bun build ./bin/ggs.ts --compile --outfile bin/ggs

# One convo
./bin/ggs "https://x.com/i/grok?conversation=2068028429640024253" --headed

# Global sync
./bin/ggs --sync --headed
```

## Bookmarklet (first-class for --html)

The best way to feed private convos (especially on x.com) is the bookmarklet.

**Updated version (recommended):**

Create a bookmark and paste this as the URL:

```javascript
javascript:(function(){try{let c=document.querySelector('[data-testid="primaryColumn"]')||document.querySelector('[data-testid="chat-messages"]')||document.querySelector('main')||document.body;if(!c){alert('No chat container');return;}let b=Array.from(c.querySelectorAll('[data-testid*="message"],[data-testid*="cell"],[role="article"],div[class*="message"],div[class*="grok"]'));if(b.length<3)b=Array.from(c.querySelectorAll('div,p,section')).filter(e=>(e.innerText||'').trim().length>30);const s={user_prompts:[],grok_replies:[],x_sources:[],web_sources:[],thinking:[],tool_calls:[]};let lu=false;b.forEach((e,i)=>{let t=(e.innerText||'').trim();if(t.length<20)return;const h=e.outerHTML;const l=t.toLowerCase();t=t.replace(/^(You|Grok)\s*[:\-]\s*/i,'').trim();if(!t)return;const u=e.getAttribute('data-testid')?.toLowerCase().includes('user')||l.startsWith('you ');const th=l.includes('thinking')||l.includes('reasoned')||l.includes('let me think')||!!e.querySelector('[class*="think"],details');const xs=t.includes('x.com')||l.includes('x source');const ws=t.match(/\[\d+\]/)||l.includes('web source')||l.includes('according to');const tl=l.includes('tool')||l.includes('function call');const en={index:i,text:t,html:h};if(u){s.user_prompts.push(en);lu=true;}else if(th){s.thinking.push(en);lu=false;}else if(xs){s.x_sources.push(en);lu=false;}else if(ws){s.web_sources.push(en);lu=false;}else if(tl){s.tool_calls.push(en);lu=false;}else{if(lu&&t.length<400)s.user_prompts.push(en);else s.grok_replies.push(en);lu=false;}});if(!Object.values(s).some(a=>a.length>0)){const f=(c.innerText||'').trim();if(f.length>100)s.grok_replies.push({text:f});}const fh=c.outerHTML;let ti=document.title||'Grok Conversation';const te=c.querySelector('h1,h2,[data-testid*="title"]');if(te&&te.innerText)ti=te.innerText.trim();const u=location.href;const m=u.match(/\/(?:c|chat)\/([a-z0-9-]+)/i)||u.match(/[?&]conversation=([a-z0-9-]+)/i);const id=m?m[1]:'unknown-'+Date.now();const d={id,url:u,title:ti,extracted_at:new Date().toISOString(),streams:s,full_chat_html:fh};const jb=new Blob([JSON.stringify(d,null,2)],{type:'application/json'});const ju=URL.createObjectURL(jb);const ja=document.createElement('a');ja.href=ju;ja.download=`grok-${id}.json`;document.body.appendChild(ja);ja.click();document.body.removeChild(ja);URL.revokeObjectURL(ju);let md=`# ${ti}\n\nSource: ${u}\nCaptured: ${d.extracted_at}\n\n## User Prompts\n\n`+(s.user_prompts.map(p=>`- ${p.text}`).join('\n\n')||'(none)')+'\n\n## Grok Replies\n\n'+(s.grok_replies.map(r=>`> ${r.text}`).join('\n\n')||'(none)')+'\n\n## Grok X Sources\n\n'+(s.x_sources.map(x=>x.text).join('\n')||'(none)')+'\n\n## Grok Web Sources\n\n'+(s.web_sources.map(w=>w.text).join('\n')||'(none)')+'\n\n## Thinking / Reasoning\n\n'+(s.thinking.map(th=>th.text).join('\n\n')||'(none)')+'\n\n## Tool Calls & Hooks\n\n'+(s.tool_calls.map(t=>t.text).join('\n')||'(phase 2)')+'\n';const mb=new Blob([md],{type:'text/markdown'});const mu=URL.createObjectURL(mb);const ma=document.createElement('a');ma.href=mu;ma.download=`grok-${id}-basic.md`;document.body.appendChild(ma);ma.click();document.body.removeChild(ma);URL.revokeObjectURL(mu);alert('Downloaded grok-'+id+'.json + basic.md');}catch(e){alert('Error: '+e.message);}})();
```

(Readable source is in `scripts/bookmarklet.js` and `assets/grok-export-bookmarklet.js`)

**How to use:**
1. Open the Grok conversation.
2. Click the bookmark.
3. Feed the resulting `.json` to the CLI:
   ```bash
   ./bin/ggs --html /path/to/grok-xxx.json
   ```

## Why we updated the bookmarklet

The version you were using produced very weak streams on the test convo (user_prompts empty, everything mashed into grok_replies).

The clipper result you shared (`Clippings/Grok.md`) is a great example of the style we want as output (good frontmatter + full conversation).

The new bookmarklet does a better job collecting message blocks and classifying the 6 streams while still giving us `full_chat_html` for Defuddle.

## Using the helper files you gave

- `Clippings/Grok.md` → target style reference
- `grok-2068028429640024253 (2).json` + basic .md → test data

Re-generate with the updated bookmarklet and run:
```bash
bun run bin/ggs.ts --html "/path/to/new-grok-2068028429640024253.json"
```

The CLI will now prefer good streams from the bookmarklet JSON, or fall back to processing `full_chat_html`.

## Output format (matches your clipper + requirements)

- Frontmatter: title, id, source, **surface**, captured, word_count, status:"to-be-reviewed", type:"grok-conversation"
- 6 headed sections in priority order
- Clean Defuddled reference section at the bottom
- Single folder `~/.grok/conversations/`

## Development

Source of truth for the skill is in this folder.

The research + old prototype lives in the egc project.

## References

See `references/` for architecture, sources, harness examples, and the full research trail (including the June 2026 feature request thread to Grok).