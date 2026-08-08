const PERSONAS=[
  {name:'Romantic Sae',slug:'romantic',icon:'❤️',desc:'Warm, expressive, gentlemanly and lightly seductive.'},
  {name:'Flirtatious Sae',slug:'flirtatious',icon:'🔥',desc:'Confident observation, playful heat and zero chasing.'},
  {name:'Business Sae',slug:'business',icon:'💼',desc:'Strategic, persuasive and professional without sounding robotic.'},
  {name:'Listener Sae',slug:'listener',icon:'💬',desc:'Patient, validating and present before trying to fix anything.'},
  {name:'Frustrated Sae',slug:'frustrated',icon:'🌫️',desc:'Honest irritation with composure and clean boundaries.'},
  {name:'Logical Angry Sae',slug:'logical-angry',icon:'💢',desc:'Firm, factual and controlled when disrespect enters the room.'},
  {name:'Toxic Sae',slug:'toxic',icon:'😈',desc:'Playful danger, witty pettiness and a disciplined smirk — never abusive.'},
  {name:'Motivator Sae',slug:'motivator',icon:'💡',desc:'Real encouragement without motivational-speaker corniness.'},
  {name:'Comedian Sae',slug:'comedian',icon:'🎤',desc:'Timing, room reading, quick recovery and heckler composure.'},
  {name:'Advisor Sae',slug:'advisor',icon:'🧠',desc:'Balanced analysis, honest patterns and practical next moves.'},
  {name:'Negotiator Sae',slug:'negotiator',icon:'🤝',desc:'Calm leverage, clear value and mutually useful terms.'},
  {name:'Grounded Sae',slug:'grounded',icon:'🧘🏾',desc:'Mature, peaceful, accountable and centered.'}
];

const REL_GROUPS={
  'PERSONAL':['New interest','Dating','Partner','Spouse','Ex','Friend','Best friend / close friend','Family','My child','Co-parent','Acquaintance','Stranger'],
  'WORK + MONEY':['Coworker','Employer / manager','Dispatcher','Client / customer','Business partner','Contractor','Recruiter','Landlord / property manager','Customer service'],
  'FORMAL':['Authority / legal professional']
};

const SITUATION_GROUPS={
  'OPENING + CONNECTION':['First message','Starting a conversation','Checking in','They complimented me','They flirted','They opened up','Good news','Just vibing / normal conversation'],
  'TENSION + DISTANCE':['They seem distant','They left me on read','Late reply','They cancelled','We argued','They misunderstood me','They are upset','I am upset','They crossed a boundary','They came back after distance','They apologized','I need to apologize'],
  'DECISIONS + LOGISTICS':['Making plans','Rescheduling','Asking for a favor','They asked me for something','They asked for money','Payment issue','Schedule issue','Work disagreement','Business negotiation','Legal / formal matter','Bad news'],
  'OTHER':['Something else / let the conversation explain it']
};

const GOAL_GROUPS={
  'ATTRACTION + CHEMISTRY':['Start the conversation','Keep the conversation going','Build attraction','Flirt without forcing it','Tease them','Make them laugh','Show interest without thirsting','Show affection','Show appreciation','Compliment them'],
  'CARE + SUPPORT':['Check on them','Reassure them','Let them feel heard','Comfort them','Motivate them','Celebrate them'],
  'CLARITY + REPAIR':['Apologize','Explain myself','Clear up a misunderstanding','De-escalate tension','Repair the connection','Reconnect after distance','Respond to a late reply','Respond after being left on read','Ask where we stand','Get clarity','Ask for honesty'],
  'BOUNDARIES + SELF-RESPECT':['Call something out','Address disrespect','Set a boundary','Say no','Ask for space','Give them space','Stand my ground','Decline respectfully','End the conversation respectfully','End the conversation completely'],
  'PLANS + BUSINESS':['Make a request','Ask for a favor','Follow up','Confirm plans','Reschedule','Negotiate an agreement','Negotiate pay','Ask about payment','Resolve a business issue','Respond professionally','Make a strong first impression']
};

const QUICK_STYLES=['More slang','Less slang','Shorter','More detailed','More playful','More serious','More flirty','More direct','More compassionate','Add humor','Remove emotion','Voice-message style'];
const MORE_STYLES=['More confident','More assertive','More respectful','More vulnerable','More affectionate','More romantic','More smooth','More mysterious','More reassuring','More supportive','More chill','More casual','More polished','More professional','More persuasive','More protective','More detached','More emotionally controlled','More blunt','More thoughtful','More heartfelt','More mature','Hold my frame','Don’t sound thirsty','Don’t over-explain','Match their energy','Keep my dignity','Say it without chasing','Apply pressure','Play it cool','Read between the lines','Keep my wording','Text-message style','One-liner','Paragraph style'];
const ALL_STYLES=[...QUICK_STYLES,...MORE_STYLES];
const LEVELS=['Soft','Calm Sae','Confident Sae','Bold','Unfiltered Sae'];
const SIGNS=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];

const ZODIAC={
  Aries:{symbol:'♈',headline:'Keep it direct and alive',cue:'Aries archetypes often appreciate clear energy, movement and a response that does not circle the point.',watch:'Do not confuse directness with permission to rush them.'},
  Taurus:{symbol:'♉',headline:'Steady beats flashy',cue:'Taurus archetypes are often framed around consistency, comfort and trust built through actions more than pressure.',watch:'Avoid turning patience into stubborn assumptions.'},
  Gemini:{symbol:'♊',headline:'Give the mind something to play with',cue:'Gemini archetypes are often framed as curious, verbal and responsive to wit, variety and conversational rhythm.',watch:'Do not label normal changes of mood as being “two-faced.”'},
  Cancer:{symbol:'♋',headline:'Safety before pressure',cue:'Cancer archetypes are often framed around emotional security, memory, care and feeling understood before being pushed.',watch:'Sensitivity is not weakness and should never be used as leverage.'},
  Leo:{symbol:'♌',headline:'Warmth with real recognition',cue:'Leo archetypes are often framed around confidence, loyalty and responding well when appreciation feels specific rather than generic.',watch:'Do not assume they need constant praise or ego feeding.'},
  Virgo:{symbol:'♍',headline:'Details matter',cue:'Virgo archetypes are often framed around observation, consistency and noticing whether words line up with behavior.',watch:'Do not interpret thoughtfulness or questions as automatic criticism.'},
  Libra:{symbol:'♎',headline:'Protect the vibe without dodging the truth',cue:'Libra archetypes are often framed around balance, social awareness and wanting communication that feels fair and mutually respectful.',watch:'Do not weaponize their preference for peace to avoid necessary honesty.'},
  Scorpio:{symbol:'♏',headline:'Depth recognizes depth',cue:'Scorpio archetypes are often framed around privacy, loyalty, intensity and wanting substance underneath surface-level words.',watch:'Do not turn intensity into tests, jealousy or control.'},
  Sagittarius:{symbol:'♐',headline:'Be real and leave room to breathe',cue:'Sagittarius archetypes are often framed around freedom, humor, candor and resisting communication that feels boxed in.',watch:'Space does not automatically mean lack of care.'},
  Capricorn:{symbol:'♑',headline:'Respect the mission',cue:'Capricorn archetypes are often framed around competence, consistency, responsibility and respecting communication with a clear point.',watch:'Do not mistake focus or restraint for emotional coldness.'},
  Aquarius:{symbol:'♒',headline:'Connect without crowding',cue:'Aquarius archetypes are often framed around independence, ideas and appreciating a connection that lets them remain fully themselves.',watch:'Do not reduce emotional distance to a zodiac explanation.'},
  Pisces:{symbol:'♓',headline:'Lead with empathy, stay grounded',cue:'Pisces archetypes are often framed around imagination, empathy and picking up emotional atmosphere quickly.',watch:'Do not assume they are fragile, psychic or incapable of directness.'}
};

const PRINCIPLES=[
  ['Confident Observation','Make an intelligent observation and give the other person room to confirm it. Feeling seen is stronger than feeling chased.'],
  ['Controlled Heat','Acknowledge attraction, add one clean dose of sexual humor only when welcomed, then return to grounded intention.'],
  ['Match Investment','Do not send five paragraphs to somebody giving five-word replies unless the moment genuinely calls for depth.'],
  ['Listener Before Fixer','Figure out whether they want comfort, advice, a solution or simply somebody present.'],
  ['Comedian’s Composure','Read the room, handle tension without losing character, then keep the interaction moving.'],
  ['Exit With Dignity','Not every conversation needs to be rescued. Sometimes composure means no longer forcing it.'],
  ['Same Brain. Different Room.','Your voice stays recognizable, but the delivery changes for dating, family, work, business, co-parenting and formal situations.'],
  ['Zodiac Is a Lens, Not Evidence','Use sign archetypes to inspire questions and pacing. Never treat a sign as proof of motives, compatibility, honesty or character.']
];

const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const safeParse=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key)||'')}catch{return fallback}};
const store={
  persona:localStorage.sm_persona||'Grounded Sae',
  styles:new Set(safeParse('sm_styles',[])),
  generations:+(localStorage.sm_generations||0),
  usage:safeParse('sm_usage',{}),
  ratings:safeParse('sm_ratings',{}),
  saved:safeParse('sm_saved',[]),
  signUsage:safeParse('sm_sign_usage',{}),
  zodiacEnabled:localStorage.sm_zodiac_enabled==='true',
  targetSign:localStorage.sm_target_sign||'Gemini',
  last:null
};

function escapeHTML(value=''){return String(value).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
function show(v){$$('.view').forEach(x=>x.classList.toggle('active',x.dataset.view===v));$$('[data-nav]').forEach(x=>x.classList.toggle('active',x.dataset.nav===v));scrollTo({top:0,behavior:'smooth'});}
$$('[data-nav]').forEach(b=>b.onclick=()=>show(b.dataset.nav));
$$('[data-go]').forEach(b=>b.onclick=()=>show(b.dataset.go));
$('#backToStudio').onclick=()=>show('studio');

function renderPersonas(){
  const box=$('#personas'); box.innerHTML='';
  PERSONAS.forEach(p=>{
    const b=document.createElement('button');
    b.className='persona'+(p.name===store.persona?' active':'');
    b.style.backgroundImage=`linear-gradient(180deg,transparent 42%,rgba(0,0,0,.96)),url("assets/persona-${p.slug}.jpg")`;
    b.innerHTML=`<span class="emoji">${p.icon}</span><span class="pname">${escapeHTML(p.name)}</span>`;
    b.onclick=()=>{store.persona=p.name;localStorage.sm_persona=p.name;renderPersonas();renderMode();};
    box.appendChild(b);
  });
}
function renderMode(){
  const p=PERSONAS.find(x=>x.name===store.persona)||PERSONAS.at(-1);
  $('#modeIcon').textContent=p.icon; $('#modeName').textContent=p.name; $('#modeDesc').textContent=p.desc;
  $('#meter').style.height=`${20+(+$('#intensity').value*14)}%`;
}
function fillGrouped(el,groups){
  el.innerHTML='';
  Object.entries(groups).forEach(([label,items])=>{
    const group=document.createElement('optgroup');group.label=label;
    items.forEach(item=>{const o=document.createElement('option');o.value=item;o.textContent=item;group.appendChild(o)});
    el.appendChild(group);
  });
}
function restoreSelect(el,key,fallback){const wanted=localStorage.getItem(key)||fallback;if([...el.options].some(o=>o.value===wanted))el.value=wanted;}
fillGrouped($('#relationship'),REL_GROUPS);fillGrouped($('#situation'),SITUATION_GROUPS);fillGrouped($('#goal'),GOAL_GROUPS);
restoreSelect($('#relationship'),'sm_relationship','Dating');
restoreSelect($('#situation'),'sm_situation','Something else / let the conversation explain it');
restoreSelect($('#goal'),'sm_goal','Let them feel heard');
[['#relationship','sm_relationship'],['#situation','sm_situation'],['#goal','sm_goal']].forEach(([id,key])=>$(id).onchange=e=>localStorage.setItem(key,e.target.value));

function renderChipSet(target,styles){
  const box=$(target);box.innerHTML='';
  styles.forEach(s=>{
    const b=document.createElement('button');b.type='button';b.className='chip'+(store.styles.has(s)?' active':'');b.textContent=s;
    b.onclick=()=>{store.styles.has(s)?store.styles.delete(s):store.styles.add(s);localStorage.sm_styles=JSON.stringify([...store.styles]);renderChips();};box.appendChild(b);
  });
}
function renderChips(){renderChipSet('#chips',QUICK_STYLES);renderChipSet('#moreChips',MORE_STYLES);}

const savedIntensity=Math.max(1,Math.min(5,+(localStorage.sm_intensity||3)));
$('#intensity').value=savedIntensity;$('#intensityText').textContent=LEVELS[savedIntensity-1];
$('#intensity').oninput=e=>{localStorage.sm_intensity=e.target.value;$('#intensityText').textContent=LEVELS[e.target.value-1];renderMode();};

function renderZodiac(){
  const toggle=$('#zodiacToggle'),controls=$('#zodiacControls');
  toggle.classList.toggle('on',store.zodiacEnabled);toggle.setAttribute('aria-checked',String(store.zodiacEnabled));controls.classList.toggle('hidden',!store.zodiacEnabled);
  $('#targetSign').value=store.targetSign;
  const z=ZODIAC[store.targetSign];
  $('#zodiacHeadline').textContent=`${z.symbol} ${store.targetSign}: ${z.headline}`;
  $('#zodiacHintText').textContent=`${z.cue} ${z.watch}`;
}
$('#targetSign').innerHTML=SIGNS.map(s=>`<option value="${s}">${ZODIAC[s].symbol} ${s}</option>`).join('');
$('#zodiacToggle').onclick=()=>{store.zodiacEnabled=!store.zodiacEnabled;localStorage.sm_zodiac_enabled=String(store.zodiacEnabled);renderZodiac();toast(store.zodiacEnabled?'Zodiac Cheat Code on — archetype lens only':'Zodiac Cheat Code off');};
$('#targetSign').onchange=e=>{store.targetSign=e.target.value;localStorage.sm_target_sign=store.targetSign;renderZodiac();};

function inferTone(text){
  const t=text.toLowerCase();
  if(/[?]{2,}|why|confused|what do you mean/.test(t))return['Seeking clarity','They may be testing whether you understand the real issue.','Answer the question before adding personality.'];
  if(/sorry|hurt|sad|tired|overwhelmed|stress|cry/.test(t))return['Emotionally open','The message carries vulnerability or fatigue.','Lead with presence; advice comes second.'];
  if(/lol|😂|lmao|haha|play/.test(t))return['Playful and receptive','They are giving you room to joke and build rhythm.','Match the humor without trying to perform too hard.'];
  if(/no|stop|leave|done|mad|angry|disrespect/.test(t))return['Defensive or firm','The temperature is elevated and the wrong line could escalate it.','Keep the point sharp and the ego quiet.'];
  if(/thank|appreciate|love|glad|yes|would love/.test(t))return['Warm and open','They are rewarding the tone and showing willingness to continue.','Receive the warmth and leave space for another exchange.'];
  return['Neutral but readable','There is enough information to respond, but not enough to over-assume.','Stay natural, ask one useful question and avoid overexplaining.'];
}

function opener(p){return {
  'Romantic Sae':'I appreciate you being real with me. That means more than somebody just saying the right thing.',
  'Flirtatious Sae':'See, that right there just told me a little more about you 😏',
  'Business Sae':'Thank you for the update. I want to make sure we handle this clearly and efficiently.',
  'Listener Sae':'I’m listening. You don’t have to clean it up or make it sound easier than it is.',
  'Frustrated Sae':'I’m not trying to argue, but I do need to be honest about what bothered me.',
  'Logical Angry Sae':'I’m going to keep this direct and focused on the facts.',
  'Toxic Sae':'Oh, so that’s the energy we bringing today? Bet 😂',
  'Motivator Sae':'You’ve already survived the part that was supposed to break you.',
  'Comedian Sae':'See, now you done gave me material 😂',
  'Advisor Sae':'Let’s separate what happened from the assumptions we could make about it.',
  'Negotiator Sae':'I believe there’s a fair outcome here that respects both sides.',
  'Grounded Sae':'I understand where you’re coming from, and I want to answer without reacting carelessly.'
}[p]||'I hear you.';}

const GOAL_COPY={
  'Start the conversation':'I wanted to tap in without forcing a whole production. How’s your day really going?',
  'Keep the conversation going':'I’m curious about the part you almost skipped over — tell me more about that.',
  'Build attraction':'I like learning the real you, so I’m not rushing the vibe or forcing an outcome. Attraction is obvious; chemistry is the part worth paying attention to.',
  'Flirt without forcing it':'I can let you know I’m feeling you without turning every sentence into a sales pitch.',
  'Tease them':'I’m definitely keeping that little piece of information in my pocket for later 😂',
  'Make them laugh':'I’m keeping my composure, but you definitely walked into that one and I would be disrespecting the moment if I didn’t laugh.',
  'Show interest without thirsting':'I’m interested, but I’m cool letting the energy be mutual instead of chasing a reaction.',
  'Show affection':'I care about you, and I don’t mind letting that be known without making it heavier than it needs to be.',
  'Show appreciation':'I notice what you do and how you show up. I don’t want that going unspoken.',
  'Compliment them':'It’s not just how you look — it’s the way you carry yourself that caught my attention.',
  'Check on them':'I’m not trying to pry. I just wanted to make sure you’re good for real.',
  'Reassure them':'You don’t have to have everything figured out in one moment. I’m hearing you.',
  'Let them feel heard':'I’m not trying to fix you before I fully understand you. Tell me the part that has been sitting heaviest on you.',
  'Comfort them':'You can be frustrated, tired or unsure without having to perform strength for me right now.',
  'Motivate them':'Handle the next move in front of you. Progress does not need to be loud to be real.',
  'Celebrate them':'Nah, give yourself credit for that. You earned the right to enjoy this one.',
  'Apologize':'I can own my part without adding excuses to it. I should have handled that better.',
  'Explain myself':'I want to explain what I meant without using the explanation to dismiss how it landed.',
  'Clear up a misunderstanding':'I think we may be reacting to two different meanings, so I want to clear mine up directly.',
  'De-escalate tension':'I’m not interested in making the temperature hotter just because we disagree.',
  'Repair the connection':'I care more about understanding each other than proving who was right in one moment.',
  'Reconnect after distance':'I’m not trying to pretend the distance never happened. I’m just open to a better conversation now.',
  'Respond to a late reply':'You good 😂 I’m not keeping a stopwatch on you. I just match consistency with consistency.',
  'Respond after being left on read':'No pressure. I’m not going to force a conversation, but the door is open if the energy is mutual.',
  'Ask where we stand':'I’d rather know what this is than build expectations off guesses. Where are you with us right now?',
  'Get clarity':'I would rather ask directly than build a conclusion from assumptions. What did you mean when you said that?',
  'Ask for honesty':'You don’t have to tell me what sounds good. I’d rather hear the truth and move accordingly.',
  'Call something out':'I noticed the shift, and I’d rather address it directly than act like I didn’t.',
  'Address disrespect':'I can have a difficult conversation, but I’m not going to normalize disrespect to keep one going.',
  'Set a boundary':'I can understand your perspective without accepting something that keeps disturbing my peace.',
  'Say no':'I respect the ask, but that’s not something I can agree to.',
  'Ask for space':'I need a little room to process this correctly instead of answering from pure emotion.',
  'Give them space':'I hear you. I’m going to respect the space you asked for instead of crowding it.',
  'Stand my ground':'I’m willing to listen, but my position on this part is not changing.',
  'Decline respectfully':'I appreciate you thinking of me, but I’m going to pass on this one.',
  'Make a request':'I want to ask directly so there’s no guessing about what I need.',
  'Ask for a favor':'If you’re able to help with this, I’d appreciate it. If not, no pressure — just let me know.',
  'Follow up':'Just following up so this doesn’t get lost. What’s the current status?',
  'Confirm plans':'I’m confirming we’re still locked in so we both know what to expect.',
  'Reschedule':'I need to move the timing, but I still want to follow through. What works next?',
  'Negotiate an agreement':'The best move is one that protects the relationship while making the expectations and value clear.',
  'Negotiate pay':'I want the compensation to reflect the workload, consistency and value I’m bringing.',
  'Ask about payment':'I’m following up on payment and need the amount and expected deposit date confirmed.',
  'Resolve a business issue':'Let’s separate the problem, the responsible next step and the deadline so we can close this cleanly.',
  'Respond professionally':'Please confirm the next step, responsible party and expected timeline so we can move forward cleanly.',
  'Make a strong first impression':'I’m keeping it simple: clear energy, good conversation and no need to oversell myself.',
  'End the conversation respectfully':'I respect what was shared, but I’m going to leave the conversation here without dragging it out.',
  'End the conversation completely':'I’ve said what I needed to say, and I’m not reopening this conversation. Take care.'
};
function core(g){return GOAL_COPY[g]||'I want to handle this clearly, respectfully and without forcing a reaction.';}

function close(r){return {
  'New interest':'We can take it day by day and let the chemistry tell the truth.',
  'Dating':'I’m open to seeing where this grows as long as we both stay honest.',
  'Partner':'We’re on the same team, even when the moment feels off.',
  'Spouse':'We’re on the same team, and I want the conversation to reflect that.',
  'Ex':'I’m keeping this respectful without pretending we’re still in the same relationship.',
  'Friend':'I’m here as your friend, not as somebody waiting to judge you.',
  'Best friend / close friend':'You know I’m going to keep it real with you and still respect where you’re coming from.',
  'Family':'Family does not mean avoiding hard conversations; it means handling them with care.',
  'My child':'I want you to feel safe talking to me and know I’m listening before I respond.',
  'Co-parent':'The children and a respectful working relationship need to stay at the center.',
  'Coworker':'I want us to keep the working relationship clear and respectful.',
  'Employer / manager':'I’m ready to perform; I just need the terms and expectations to be clear.',
  'Dispatcher':'I’m ready to move; I just need the route, rate and expectations confirmed.',
  'Client / customer':'I value the opportunity and want the final agreement to work cleanly for everyone.',
  'Business partner':'Let’s protect the relationship and the business by keeping expectations clear.',
  'Contractor':'I want scope, timing and payment expectations documented cleanly.',
  'Recruiter':'I’m interested in the opportunity and want to understand the role and next step clearly.',
  'Landlord / property manager':'I want the request and timeline documented so we both have a clear record.',
  'Customer service':'I’m looking for a clear resolution and confirmation of the next step.',
  'Authority / legal professional':'I want the record to be accurate, respectful and supported by the relevant facts.',
  'Acquaintance':'No pressure either way. I’m just keeping the energy clear.',
  'Stranger':'No pressure either way. I’m just matching the energy respectfully.'
}[r]||'I’m keeping it clear and respectful.';}

function craft(temp='authentic'){
  let p=store.persona,r=$('#relationship').value,g=$('#goal').value,l=+$('#intensity').value,s=[...store.styles];
  if(temp==='safe'){p='Grounded Sae';l=2;s=[...new Set([...s,'Shorter','More respectful'])];}
  if(temp==='turned'){l=5;s=[...new Set([...s,'More direct','More confident'])];}
  let a=opener(p),b=core(g),c=close(r),x=[];
  if(s.includes('More flirty')||p==='Flirtatious Sae')x.push('Don’t get it confused though—I’m definitely feeling the vibe; I just know mutual energy matters more than forcing it.');
  if(s.includes('Add humor')||p==='Comedian Sae')x.push('And yes, I’m laughing, but I’m still paying attention.');
  if(s.includes('More compassionate'))x.push('I know there may be more underneath this than what fits in one message.');
  if(s.includes('More direct')||s.includes('More blunt'))x.push('So I’m saying it plainly instead of dressing it up.');
  if(s.includes('More serious'))x.push('I’m taking the situation seriously and I don’t want the main point getting lost.');
  if(s.includes('More detached')||s.includes('Play it cool'))x.push('I’m not forcing the outcome; I’m letting the response tell me what I need to know.');
  if(s.includes('Don’t sound thirsty')||s.includes('Say it without chasing'))x.push('I’m interested in mutual energy, not convincing somebody to choose me.');
  if(s.includes('Hold my frame')||s.includes('Keep my dignity'))x.push('I can care about the outcome without abandoning my standards to get it.');
  if(l>=4)x.push('I’m not scared to say what I mean, but I’m not here to pressure you either.');
  if(l===5)x.push('That’s the unfiltered truth—still respectful, still composed.');
  if(s.includes('More slang'))x.push('That’s just me keeping it a buck.');
  let out=`${a}\n\n${b}${x.length?' '+x.join(' '):''}\n\n${c}`;
  if(s.includes('Shorter')||s.includes('One-liner'))out=`${a} ${b}`;
  if(s.includes('Voice-message style'))out='Look, '+out.charAt(0).toLowerCase()+out.slice(1);
  return out;
}

function getPreferenceProfile(){
  const ratings=store.ratings||{},approved=[],rejected=[];
  if((ratings['Nailed it']||0)>0)approved.push('approved replies should preserve the selected persona and natural cadence');
  if(store.styles.has('More slang'))approved.push('natural slang');
  if(store.styles.has('More direct'))approved.push('directness');
  if(store.styles.has('More flirty'))approved.push('controlled flirtation');
  if(store.styles.has('Add humor'))approved.push('observational humor');
  if((ratings['That ain\'t me']||0)>0)rejected.push('phrasing that does not sound like Sae');
  if((ratings['Too polished']||0)>0||(ratings['Too professional']||0)>0)rejected.push('overly polished or corporate wording');
  if((ratings['Too thirsty']||0)>0)rejected.push('thirstiness or overpursuit');
  if((ratings['Too robotic']||0)>0)rejected.push('robotic AI-sounding phrasing');
  if((ratings['Too long']||0)>0)rejected.push('unnecessary length');
  if((ratings['Too soft']||0)>0)approved.push('a little more firmness when context supports it');
  if((ratings['Too aggressive']||0)>0)rejected.push('unnecessary aggression');
  return{approved_traits:approved,rejected_traits:rejected};
}

function localZodiacLens(){
  if(!store.zodiacEnabled)return{applied:false,framing:'Zodiac Cheat Code was not used.',useful_tendency:'',caution:'Actual communication always outranks astrology.'};
  const z=ZODIAC[store.targetSign];
  return{applied:true,framing:`Scorpio × ${store.targetSign}: ${z.headline}`,useful_tendency:z.cue,caution:z.watch+' Actual behavior and the conversation outrank the sign.'};
}
function localFallback(text){
  const tone=inferTone(text),alts={safe:craft('safe'),authentic:craft('authentic'),turned:craft('turned')};
  return{
    room_read:{their_energy:tone[0],what_it_may_mean:tone[1],best_move:tone[2],risk:'Local fallback cannot deeply infer context, so avoid treating its interpretation as fact.'},
    zodiac_lens:localZodiacLens(),
    reply:alts.authentic,
    alternates:{safe:alts.safe,authentic:alts.authentic,turned_up:alts.turned},
    composure_check:{thirsty:false,too_professional:false,too_long:false,too_aggressive:false,notes:'Generated by the offline Sae engine.'},
    reasoning_summary:'The secure SHIN API was unavailable, so the app used its built-in local response engine.',
    meta:{engine:'Local Sae fallback'}
  };
}

function applyResult(data,text){
  const alts={safe:data.alternates.safe,authentic:data.alternates.authentic,turned:data.alternates.turned_up};
  const tone=[data.room_read.their_energy,data.room_read.what_it_may_mean,data.room_read.best_move];
  store.last={
    reply:data.reply,alts,tone,persona:store.persona,goal:$('#goal').value,relationship:$('#relationship').value,situation:$('#situation').value,
    source:text,date:new Date().toISOString(),engine:data.meta?.engine||'SHIN Intelligence',analysis:data,
    zodiac:store.zodiacEnabled?{self:'Scorpio',target:store.targetSign}:null
  };
  store.generations++;store.usage[store.persona]=(store.usage[store.persona]||0)+1;
  if(store.zodiacEnabled)store.signUsage[store.targetSign]=(store.signUsage[store.targetSign]||0)+1;
  localStorage.sm_generations=store.generations;localStorage.sm_usage=JSON.stringify(store.usage);localStorage.sm_sign_usage=JSON.stringify(store.signUsage);
  $('#resultTitle').textContent=`${store.persona} response ready`;
  $('#replyText').textContent=data.reply;
  $('#roomRead').innerHTML=[
    ['Their energy',data.room_read.their_energy],
    ['What it may mean',data.room_read.what_it_may_mean],
    ['Best move',data.room_read.best_move],
    ['Risk to watch',data.room_read.risk],
    ['Composure check',data.composure_check.notes],
    ['SHIN summary',data.reasoning_summary]
  ].map(x=>`<div class="readRow"><strong>${escapeHTML(x[0])}</strong><span>${escapeHTML(x[1])}</span></div>`).join('');

  const zl=data.zodiac_lens||{applied:false};
  $('#zodiacResultCard').classList.toggle('hidden',!zl.applied);
  if(zl.applied){
    $('#zodiacResultTitle').textContent=zl.framing||`Scorpio × ${store.targetSign}`;
    $('#zodiacResult').innerHTML=[['Useful lens',zl.useful_tendency],['Reality check',zl.caution]].map(x=>`<div class="readRow"><strong>${escapeHTML(x[0])}</strong><span>${escapeHTML(x[1]||'')}</span></div>`).join('');
  }
  $('#alternateText').textContent=alts.safe;
  $$('.altTabs button').forEach((x,i)=>x.classList.toggle('active',i===0));
  show('results');renderStats();
  toast(data.meta?.engine==='Local Sae fallback'?'Offline fallback used':'SHIN Intelligence complete');
}

async function analyze(){
  const text=$('#message').value.trim();
  if(!text){toast('Drop the message first');$('#message').focus();return;}
  const button=$('#analyzeBtn'),original=button.innerHTML;
  button.disabled=true;button.innerHTML='SHIN is reading the room <span class="thinkingDots">•••</span>';
  try{
    const response=await fetch('/api/generate',{
      method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        persona:store.persona,
        relationship:$('#relationship').value,
        situation:$('#situation').value,
        goal:$('#goal').value,
        intensity:+$('#intensity').value,
        styles:[...store.styles],
        conversation:text,
        zodiac:{enabled:store.zodiacEnabled,self_sign:'Scorpio',target_sign:store.zodiacEnabled?store.targetSign:''},
        preference_profile:getPreferenceProfile()
      })
    });
    const data=await response.json().catch(()=>({}));
    if(!response.ok)throw new Error(data.error||'SHIN Intelligence is unavailable.');
    applyResult(data,text);
  }catch(error){
    console.warn('SHIN API unavailable; using local fallback.',error);
    applyResult(localFallback(text),text);toast(error.message||'Local fallback used');
  }finally{button.disabled=false;button.innerHTML=original;}
}

$('#analyzeBtn').onclick=analyze;
$('#pasteBtn').onclick=async()=>{try{$('#message').value=await navigator.clipboard.readText();toast('Pasted');}catch{toast('Press and hold inside the box to paste');}};
$('#copyReply').onclick=async()=>{await navigator.clipboard.writeText($('#replyText').textContent);toast('Reply copied');};
$$('.altTabs button').forEach(b=>b.onclick=()=>{$$('.altTabs button').forEach(x=>x.classList.remove('active'));b.classList.add('active');$('#alternateText').textContent=store.last?.alts?.[b.dataset.alt]||'';});
$('#useAlternate').onclick=()=>{$('#replyText').textContent=$('#alternateText').textContent;if(store.last)store.last.reply=$('#replyText').textContent;toast('Version selected');};
$$('[data-rate]').forEach(b=>b.onclick=()=>{store.ratings[b.dataset.rate]=(store.ratings[b.dataset.rate]||0)+1;localStorage.sm_ratings=JSON.stringify(store.ratings);toast(`${b.dataset.rate} saved`);renderStats();});
$('#savePlaybook').onclick=()=>{if(!store.last)return;store.saved.unshift({...store.last,reply:$('#replyText').textContent});store.saved=store.saved.slice(0,60);localStorage.sm_saved=JSON.stringify(store.saved);renderSaved();renderStats();toast('Saved to Playbook');};

function renderPrinciples(){$('#principles').innerHTML=PRINCIPLES.map(x=>`<div class="principle"><strong>${escapeHTML(x[0])}</strong><p>${escapeHTML(x[1])}</p></div>`).join('');}
function renderSaved(){
  $('#savedReplies').innerHTML=store.saved.length?store.saved.map((x,i)=>`<div class="savedItem"><strong>${escapeHTML(x.persona)} · ${escapeHTML(x.goal)}</strong><small>${escapeHTML(x.relationship||'')} ${x.zodiac?`· ♏ × ${escapeHTML(x.zodiac.target)}`:''}</small><p>${escapeHTML(x.reply)}</p><button class="text deleteSaved" data-i="${i}">Delete</button></div>`).join(''):`<div class="savedItem"><strong>No saved replies yet</strong><p>Approve a response and save it from the result screen.</p></div>`;
  $$('.deleteSaved').forEach(b=>b.onclick=()=>{store.saved.splice(+b.dataset.i,1);localStorage.sm_saved=JSON.stringify(store.saved);renderSaved();renderStats();});
}
$('#clearPlaybook').onclick=()=>{store.saved=[];localStorage.sm_saved='[]';renderSaved();renderStats();toast('Saved replies cleared');};

function renderZodiacGrid(){
  $('#zodiacGrid').innerHTML=SIGNS.map(s=>`<button type="button" data-sign="${s}"><span>${ZODIAC[s].symbol}</span><small>${s}</small></button>`).join('');
  $$('#zodiacGrid button').forEach(b=>b.onclick=()=>{
    const s=b.dataset.sign,z=ZODIAC[s];$$('#zodiacGrid button').forEach(x=>x.classList.toggle('active',x===b));
    $('#zodiacPlaybookRead').innerHTML=`<strong>${z.symbol} ${escapeHTML(s)} · ${escapeHTML(z.headline)}</strong><p>${escapeHTML(z.cue)}</p><small>${escapeHTML(z.watch)}</small>`;
  });
}
function renderStats(){
  const ratings=Object.values(store.ratings).reduce((a,b)=>a+b,0),favorite=Object.entries(store.usage).sort((a,b)=>b[1]-a[1])[0]?.[0]||'Not enough data';
  const favoriteSign=Object.entries(store.signUsage).sort((a,b)=>b[1]-a[1])[0]?.[0]||'Not used yet';
  $('#stats').innerHTML=`<div class="stat"><b>${store.generations}</b><span>Replies generated</span></div><div class="stat"><b>${store.saved.length}</b><span>Saved lessons</span></div><div class="stat"><b>${ratings}</b><span>Tone ratings</span></div><div class="stat"><b style="font-size:1rem">${escapeHTML(favorite)}</b><span>Most-used Sae</span></div><div class="stat"><b style="font-size:1rem">${escapeHTML(favoriteSign)}</b><span>Most-used sign lens</span></div>`;
}

$('#randomPersona').onclick=()=>{store.persona=PERSONAS[Math.floor(Math.random()*PERSONAS.length)].name;localStorage.sm_persona=store.persona;renderPersonas();renderMode();toast(store.persona);};
$('#resetBtn').onclick=()=>{
  $('#relationship').value='Dating';$('#situation').value='Something else / let the conversation explain it';$('#goal').value='Let them feel heard';
  $('#intensity').value=3;$('#intensityText').textContent=LEVELS[2];localStorage.sm_intensity='3';
  store.styles.clear();localStorage.sm_styles='[]';store.zodiacEnabled=false;localStorage.sm_zodiac_enabled='false';
  localStorage.sm_relationship='Dating';localStorage.sm_situation='Something else / let the conversation explain it';localStorage.sm_goal='Let them feel heard';
  renderChips();renderMode();renderZodiac();toast('Studio reset');
};

function toast(t){const x=$('#toast');x.textContent=t;x.classList.add('show');setTimeout(()=>x.classList.remove('show'),1700);}
let deferred;
addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferred=e;$('#installBtn').classList.remove('hidden');});
$('#installBtn').onclick=async()=>{if(!deferred)return;deferred.prompt();await deferred.userChoice;deferred=null;$('#installBtn').classList.add('hidden');};
if('serviceWorker'in navigator)addEventListener('load',()=>navigator.serviceWorker.register('sw.js'));

renderPersonas();renderMode();renderChips();renderZodiac();renderPrinciples();renderSaved();renderZodiacGrid();renderStats();
