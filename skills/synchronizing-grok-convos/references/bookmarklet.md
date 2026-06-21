# Grok Conversation Dump Bookmarklet

**The error "Unexpected end of input" means the code you pasted was truncated — the browser didn't receive the full text up to the very last `})();`**

This is extremely common with long bookmarklets when copying from Markdown or when the bookmark field mangles the paste.

### Correct way to install (do this exactly)

1. **Delete your current broken bookmark completely.**

2. Open the file `grok-export-bookmarklet.js` (the .js file, not the .md).

3. Select **from the first character `j` of `javascript:` all the way to the absolute last character `;` **. Make sure you include the final `})();`

4. Copy.

5. Create a **new** bookmark (do not edit the old one).

6. Paste **only** what you copied into the **URL** field. It must start with `javascript:` and end with `;`

7. Save.

Here is the current clean single-line version for easy copy-paste (use this if the file copy is still giving you trouble):

```javascript
javascript:(function(){try{let chatContainer=document.querySelector('[data-testid="chat-messages"]')||document.querySelector('.chat-messages')||document.querySelector('main')||document.body;if(!chatContainer){alert('Could not find chat container. Make sure you are on a Grok conversation page.');return}if(location.href.includes('x.com')||location.href.includes('twitter.com')){const primary=document.querySelector('[data-testid="primaryColumn"]');if(primary){chatContainer=primary}}const messages=Array.from(chatContainer.querySelectorAll('.message,[role="article"],.user-message,.assistant-message,[data-role]'));const streams={user_prompts:[],grok_replies:[],x_sources:[],web_sources:[],thinking:[],tool_calls:[]};messages.forEach((el,i)=>{const text=(el.innerText||'').trim();const html=el.outerHTML;const lower=text.toLowerCase();if(el.getAttribute('data-role')==='user'||lower.startsWith('you:')||el.classList.contains('user')){streams.user_prompts.push({index:i,text,html})}else if(lower.includes('thinking')||lower.includes('reasoned')||el.querySelector('[data-thinking]')){streams.thinking.push({index:i,text,html})}else if(lower.includes('source')||lower.includes('http')&&(lower.includes('x.com')||lower.includes('twitter'))){streams.x_sources.push({index:i,text,html})}else if(text.match(/\[?\d+\]?\s*https?:\/\//)||lower.includes('web search')||lower.includes('source:')){streams.web_sources.push({index:i,text,html})}else if(lower.includes('tool')||lower.includes('function')||lower.includes('called')){streams.tool_calls.push({index:i,text,html})}else{streams.grok_replies.push({index:i,text,html})}});const hasStreams=Object.values(streams).some(arr=>arr.length>0);if(!hasStreams){const fullText=chatContainer.innerText||'';if(fullText.trim().length>100){streams.grok_replies.push({text:fullText.trim()})}}const fullHtml=chatContainer.outerHTML;let title=document.title||'grok-convo';const titleEl=chatContainer.querySelector('h1,h2,[data-testid*="title"]');if(titleEl&&titleEl.innerText){title=titleEl.innerText.trim()}const url=location.href;const idMatch=url.match(/\/(?:c|chat)\/([a-z0-9-]+)/i)||url.match(/[?&]conversation=([a-z0-9-]+)/i);const id=idMatch?idMatch[1]:'unknown-'+Date.now();const dump={id,url,title,extracted_at:new Date().toISOString(),streams,full_chat_html:fullHtml};const jsonBlob=new Blob([JSON.stringify(dump,null,2)],{type:'application/json'});const jsonUrl=URL.createObjectURL(jsonBlob);const jsonA=document.createElement('a');jsonA.href=jsonUrl;jsonA.download=`grok-${id}.json`;document.body.appendChild(jsonA);jsonA.click();document.body.removeChild(jsonA);URL.revokeObjectURL(jsonUrl);let md=`# ${title}\n\nSource: ${url}\nCaptured: ${dump.extracted_at}\n\n`;md+='## User Prompts\n\n'+streams.user_prompts.map(p=>`- ${p.text}`).join('\n\n')+'\n\n';md+='## Grok Replies\n\n'+streams.grok_replies.map(r=>`> ${r.text}`).join('\n\n')+'\n\n';md+='## Grok X Sources\n\n'+(streams.x_sources.length?streams.x_sources.map(s=>s.text).join('\n'):'(none extracted in basic pass)')+'\n\n';md+='## Grok Web Sources\n\n'+(streams.web_sources.length?streams.web_sources.map(s=>s.text).join('\n'):'(none)')+'\n\n';md+='## Thinking / Reasoning\n\n'+(streams.thinking.length?streams.thinking.map(t=>t.text).join('\n\n'):'(collapsed or not detected)')+'\n\n';md+='## Tool Calls & Hooks\n\n'+(streams.tool_calls.length?streams.tool_calls.map(t=>t.text).join('\n'):'(phase 2)')+'\n';const mdBlob=new Blob([md],{type:'text/markdown'});const mdUrl=URL.createObjectURL(mdBlob);const mdA=document.createElement('a');mdA.href=mdUrl;mdA.download=`grok-${id}-basic.md`;document.body.appendChild(mdA);mdA.click();document.body.removeChild(mdA);URL.revokeObjectURL(mdUrl);console.log('Grok dump complete. Use grok-'+id+'.json with the CLI.');alert('Downloaded grok-'+id+'.json (full HTML) and basic .md')}catch(err){console.error('Bookmarklet error:',err);alert('Bookmarklet error: '+(err&&err.message?err.message:err))}})();
```

**For console testing (to see the real error):**

On the Grok page, open DevTools Console and paste **starting from `(function(){` all the way to the last `})();`** (omit the `javascript:` part for console).

If you still get "end of input", you did not select/copy the complete string to the very last character.

Safari is especially bad with long bookmarklets. If possible, create the bookmark in Chrome first.

**Critical instructions for creating the bookmark (this is why it keeps breaking):**

1. Completely delete your current "Grok" bookmark.
2. Create a **new** bookmark.
3. Copy the **single long line** above (the entire content of the code block).
4. Paste it **exactly** into the **URL / Location / Address** field of the new bookmark. Do not add anything else.
5. Name it and save it to your bookmarks bar.

If you are on Safari, creating long bookmarklets can be flaky. Try creating it in Chrome first, then it should sync or you can export/import the bookmark.

To test the code without the bookmark:
- Go to a Grok conversation page.
- Open DevTools Console.
- Paste the code **starting from `(function(){` all the way to the final `})();`** (do not include the `javascript:` part when testing in console).
- Press Enter.

If you still get "Unexpected end of input", you are not copying the full string to the very last character.

The minified single-line version above is the safest for the actual bookmark URL field.

**How to install / update the bookmarklet**

1. Delete your current bookmarklet.
2. Create a new bookmark.
3. Paste the code above (the entire `javascript:(function()...`) into the **URL** field.
4. Name it and save (ideally to your bookmarks bar).

The version above includes:
- Support for x.com `?conversation=ID` URLs (ID is now correct).
- Better container targeting for x.com.
- Fallback so that on x.com the full conversation text ends up in the "Grok Replies" section (so the basic.md will actually contain the content). 

This should give much better basic.md output on x.com pages. 

For the full high-quality output (with Defuddle cleaning and proper 6-stream structure), use the .json with the main `grok-export.ts` CLI (it now supports the bookmarklet JSON format directly). 

Let me know how the next run goes!