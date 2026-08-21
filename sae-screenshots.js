(()=>{
  'use strict';

  const MAX_IMAGES=4;
  const MAX_FILE_BYTES=12*1024*1024;
  let images=[];
  let transcriptCache='';
  let transcriptKey='';

  const css=`
    .saeShotPanel{margin:14px 0 16px;padding:14px;border:1px solid rgba(214,174,86,.32);border-radius:16px;background:linear-gradient(180deg,rgba(214,174,86,.07),rgba(255,255,255,.018));}
    .saeShotHead{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:10px}
    .saeShotHead strong{display:block;font-size:13px;color:#f4ddb0;letter-spacing:.03em}.saeShotHead span{display:block;margin-top:3px;font-size:11px;line-height:1.35;color:#9e9688}
    .saeShotBadge{flex:0 0 auto;font-size:9px;font-weight:900;letter-spacing:.12em;color:#151008;background:#d6ae56;border-radius:999px;padding:5px 8px}
    .saeShotGrid{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:10px}.saeShotGrid label{font-size:10px;color:#b6ad9d;text-transform:uppercase;letter-spacing:.08em}.saeShotGrid select,.saeShotGrid textarea{width:100%;margin-top:5px;border:1px solid rgba(214,174,86,.24);border-radius:11px;background:#0d0b08;color:#f4efe5;padding:10px;font:inherit;box-sizing:border-box}.saeShotGrid textarea{min-height:64px;resize:vertical}
    .saeShotActions{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:10px}.saeShotUpload{cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;min-height:38px;padding:0 12px;border-radius:11px;background:linear-gradient(180deg,#e1bd6a,#9c6d22);color:#120d05;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:.055em}.saeShotUpload input{display:none}.saeShotClear{border:1px solid rgba(255,255,255,.14);background:transparent;color:#c8c0b2;border-radius:11px;min-height:38px;padding:0 12px;font-weight:800}.saeShotCount{margin-left:auto;font-size:10px;color:#8f877b}
    .saeShotThumbs{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px;margin-top:10px}.saeShotThumb{position:relative;aspect-ratio:.72;border-radius:10px;overflow:hidden;border:1px solid rgba(214,174,86,.28);background:#090806}.saeShotThumb img{width:100%;height:100%;object-fit:cover}.saeShotThumb b{position:absolute;left:5px;top:5px;width:20px;height:20px;display:grid;place-items:center;border-radius:999px;background:rgba(0,0,0,.78);color:#f0c96d;font-size:10px}.saeShotThumb button{position:absolute;right:4px;top:4px;width:22px;height:22px;border:0;border-radius:999px;background:rgba(120,20,20,.88);color:#fff;font-size:13px;font-weight:900}
    .saeShotStatus{margin-top:9px;font-size:10px;line-height:1.4;color:#8f877b}.saeShotStatus.ready{color:#75d99a}.saeShotStatus.busy{color:#e8c870}
    @media(max-width:520px){.saeShotGrid{grid-template-columns:1fr}.saeShotThumbs{grid-template-columns:repeat(4,minmax(58px,1fr));overflow-x:auto}.saeShotCount{width:100%;margin-left:0}}
  `;

  function toast(message){if(typeof window.toast==='function')window.toast(message);else console.info(message);}
  function injectStyle(){if(document.getElementById('saeShotStyle'))return;const s=document.createElement('style');s.id='saeShotStyle';s.textContent=css;document.head.appendChild(s);}
  function status(message,kind=''){const el=document.getElementById('saeShotStatus');if(!el)return;el.textContent=message;el.className='saeShotStatus'+(kind?' '+kind:'');}
  function fingerprint(){return images.map(x=>`${x.name}:${x.data.length}`).join('|')+'|'+(document.getElementById('saeMySide')?.value||'infer')+'|'+(document.getElementById('saeShotNote')?.value||'').trim();}

  function renderThumbs(){
    const box=document.getElementById('saeShotThumbs'),count=document.getElementById('saeShotCount');
    if(!box)return;
    box.innerHTML='';
    images.forEach((item,index)=>{
      const tile=document.createElement('div');tile.className='saeShotThumb';
      tile.innerHTML=`<img alt="Screenshot ${index+1}"><b>${index+1}</b><button type="button" aria-label="Remove screenshot ${index+1}">×</button>`;
      tile.querySelector('img').src=item.data;
      tile.querySelector('button').onclick=()=>{images.splice(index,1);transcriptCache='';transcriptKey='';renderThumbs();status(images.length?`${images.length} screenshot${images.length===1?'':'s'} ready. They will be read in numbered order.`:'No screenshots attached. You can still paste or type the conversation.',images.length?'ready':'');};
      box.appendChild(tile);
    });
    if(count)count.textContent=`${images.length}/${MAX_IMAGES} attached`;
  }

  function readFile(file){return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onerror=()=>reject(new Error('Could not read image'));reader.onload=()=>resolve(reader.result);reader.readAsDataURL(file);});}
  function loadImage(src){return new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(new Error('Could not decode image'));img.src=src;});}
  async function compress(file,maxDim=1600,quality=.84){
    if(!file||!/^image\//i.test(file.type||''))throw new Error('Choose an image or screenshot.');
    if(file.size>MAX_FILE_BYTES)throw new Error('Screenshot is too large. Use an image under 12 MB.');
    const src=await readFile(file),img=await loadImage(src);
    const scale=Math.min(1,maxDim/Math.max(img.naturalWidth||1,img.naturalHeight||1));
    const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(img.naturalWidth*scale));canvas.height=Math.max(1,Math.round(img.naturalHeight*scale));
    const ctx=canvas.getContext('2d',{alpha:false});ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(img,0,0,canvas.width,canvas.height);
    let out=canvas.toDataURL('image/jpeg',quality);
    if(out.length>1_100_000&&maxDim>1200)return compress(file,1200,.74);
    if(out.length>1_100_000)throw new Error('That screenshot is still too large after compression. Crop it and try again.');
    return out;
  }

  async function addFiles(list){
    const incoming=[...list];
    if(!incoming.length)return;
    const room=MAX_IMAGES-images.length;
    if(room<=0){toast(`Maximum ${MAX_IMAGES} screenshots`);return;}
    status('Preparing screenshots…','busy');
    for(const file of incoming.slice(0,room)){
      try{images.push({name:String(file.name||`screenshot-${images.length+1}`).slice(0,100),data:await compress(file)});}catch(error){toast(error.message||'Could not prepare screenshot');}
    }
    transcriptCache='';transcriptKey='';renderThumbs();status(images.length?`${images.length} screenshot${images.length===1?'':'s'} ready. They will be read in numbered order.`:'No readable screenshots were added.',images.length?'ready':'');
  }

  async function readScreenshots(){
    const key=fingerprint();
    if(transcriptCache&&transcriptKey===key)return transcriptCache;
    status('SHIN is reading the screenshots and checking who said what…','busy');
    const response=await fetch('/api/read-screenshots',{
      method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        images:images.map(x=>x.data),
        my_side:document.getElementById('saeMySide')?.value||'infer',
        context_note:(document.getElementById('saeShotNote')?.value||'').trim()
      })
    });
    const data=await response.json().catch(()=>({}));
    if(!response.ok)throw new Error(data.error||'SHIN could not read those screenshots.');
    transcriptCache=String(data.transcript||'').trim();transcriptKey=key;
    if(!transcriptCache)throw new Error('SHIN could not find readable conversation text in those screenshots.');
    status(`Read ${data.meta?.screenshot_count||images.length} screenshot${images.length===1?'':'s'} · ${data.message_count||0} visible message${data.message_count===1?'':'s'}. ${data.confidence_note||''}`,'ready');
    return transcriptCache;
  }

  function installPanel(){
    if(document.getElementById('saeShotPanel'))return;
    const message=document.getElementById('message');if(!message)return;
    const panel=document.createElement('div');panel.id='saeShotPanel';panel.className='saeShotPanel';
    panel.innerHTML=`
      <div class="saeShotHead"><div><strong>📸 Conversation screenshots</strong><span>Attach up to 4 screenshots in conversation order. SHIN will turn them into editable evidence before SaeMackin reads the room.</span></div><span class="saeShotBadge">V4.1</span></div>
      <div class="saeShotGrid">
        <label>Which side is you?<select id="saeMySide"><option value="infer">Let SHIN infer / names visible</option><option value="right">My messages are on the RIGHT</option><option value="left">My messages are on the LEFT</option></select></label>
        <label>Screenshot context note<textarea id="saeShotNote" maxlength="500" placeholder="Optional — e.g. This is Instagram. I’m the blue/right messages. Screenshot 2 continues screenshot 1."></textarea></label>
      </div>
      <div class="saeShotActions"><label class="saeShotUpload">＋ Add screenshots<input id="saeShotInput" type="file" accept="image/*" multiple></label><button id="saeShotClear" class="saeShotClear" type="button">Clear images</button><span id="saeShotCount" class="saeShotCount">0/${MAX_IMAGES} attached</span></div>
      <div id="saeShotThumbs" class="saeShotThumbs"></div>
      <div id="saeShotStatus" class="saeShotStatus">No screenshots attached. You can still paste or type the conversation.</div>`;
    message.insertAdjacentElement('afterend',panel);
    document.getElementById('saeShotInput').addEventListener('change',e=>{addFiles(e.target.files);e.target.value='';});
    document.getElementById('saeShotClear').onclick=()=>{images=[];transcriptCache='';transcriptKey='';renderThumbs();status('Screenshots cleared.');};
    document.getElementById('saeMySide').onchange=()=>{transcriptCache='';transcriptKey='';};
    document.getElementById('saeShotNote').oninput=()=>{transcriptCache='';transcriptKey='';};
  }

  function wrapAnalyze(){
    const button=document.getElementById('analyzeBtn'),message=document.getElementById('message');
    if(!button||!message||button.dataset.saeShotsWrapped==='1')return;
    const original=button.onclick;
    if(typeof original!=='function')return;
    button.dataset.saeShotsWrapped='1';
    button.onclick=async function(event){
      if(!images.length)return original.call(this,event);
      const typed=message.value.trim();
      const buttonHTML=button.innerHTML;
      try{
        button.disabled=true;button.innerHTML='SHIN is reading screenshots <span class="thinkingDots">•••</span>';
        const transcript=await readScreenshots();
        const note=(document.getElementById('saeShotNote')?.value||'').trim();
        const evidence=[typed?`USER CONTEXT / DRAFT:\n${typed}`:'',note?`SCREENSHOT NOTE:\n${note}`:'',`SCREENSHOT CONVERSATION EVIDENCE:\n${transcript}`].filter(Boolean).join('\n\n');
        message.value=evidence;
        button.disabled=false;button.innerHTML=buttonHTML;
        await original.call(this,event);
      }catch(error){
        console.warn('Screenshot reading failed',error);toast(error.message||'Could not read screenshots');status(error.message||'Could not read screenshots');
      }finally{
        message.value=typed;
        button.disabled=false;
        if(button.innerHTML.includes('SHIN is reading screenshots'))button.innerHTML=buttonHTML;
      }
    };
  }

  function init(){injectStyle();installPanel();wrapAnalyze();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
