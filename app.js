/* etim v1 | site estático + demo offline + Supabase + WebRTC (experimental)
   Não cole segredos neste arquivo. Leia o README.md. */
(() => {
  'use strict';
  const ICONS = {
    'hash':'<path d="M4 9h16M4 15h16M11 3 7 21M17 3l-4 18"/>',
    'gamepad-2':'<line x1="6" x2="10" y1="12" y2="12"/><line x1="8" x2="8" y1="10" y2="14"/><path d="M15 13h.01M18 11h.01M17.32 5H6.68a4 4 0 0 0-3.96 3.44L2 16.34a3 3 0 0 0 5.07 2.48l2.07-2.07h5.72l2.07 2.07A3 3 0 0 0 22 16.34l-.72-7.9A4 4 0 0 0 17.32 5Z"/>',
    'laugh':'<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>',
    'link':'<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
    'lightbulb':'<path d="M9 18h6m-5 4h4m-4-4c0-2-5-3.5-5-9a7 7 0 1 1 14 0c0 5.5-5 7-5 9"/>',
    'volume-2':'<path d="m11 5-6 4H2v6h3l6 4V5ZM15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/>',
    'headphones':'<path d="M3 14v-3a9 9 0 0 1 18 0v3M3 14h4v7H5a2 2 0 0 1-2-2v-5ZM21 14h-4v7h2a2 2 0 0 0 2-2v-5Z"/>',
    'users':'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M16 3.2a4 4 0 0 1 0 7.6M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/>',
    'chevron-down':'<path d="m6 9 6 6 6-6"/>',
    'help-circle':'<circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 2.1-3 4M12 17h.01"/>',
    'settings':'<path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"/><path d="M19.4 15a2 2 0 0 0 .4 2.2l-1.6 1.6A2 2 0 0 0 16 18.4a2 2 0 0 0-2 1.3L13.5 22h-3l-.5-2.3a2 2 0 0 0-2-1.3 2 2 0 0 0-2.2.4l-1.6-1.6A2 2 0 0 0 4.6 15 2 2 0 0 0 3.3 13l-2.3-.5v-3l2.3-.5a2 2 0 0 0 1.3-2 2 2 0 0 0-.4-2.2l1.6-1.6A2 2 0 0 0 8 3.6a2 2 0 0 0 2-1.3L10.5 0h3l.5 2.3a2 2 0 0 0 2 1.3 2 2 0 0 0 2.2-.4l1.6 1.6A2 2 0 0 0 19.4 7a2 2 0 0 0 1.3 2L23 9.5v3l-2.3.5a2 2 0 0 0-1.3 2Z"/>',
    'search':'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.4-4.4"/>',
    'user-plus':'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM20 8v6M17 11h6"/>',
    'sparkles':'<path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3ZM5 17l.8 2.2L8 20l-2.2.8L5 23l-.8-2.2L2 20l2.2-.8L5 17ZM19 2l.7 2.3L22 5l-2.3.7L19 8l-.7-2.3L16 5l2.3-.7L19 2Z"/>',
    'arrow-up-right':'<path d="M7 17 17 7M7 7h10v10"/>','x':'<path d="M18 6 6 18M6 6l12 12"/>',
    'arrow-up':'<path d="m5 12 7-7 7 7M12 19V5"/>',
    'mic':'<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 17v5M8 22h8"/>',
    'mic-off':'<path d="m2 2 20 20M9 9v2a3 3 0 0 0 5.3 1.9M15 9V5a3 3 0 0 0-5.7-1.3M5 10a7 7 0 0 0 12.6 4.2M19 10a7 7 0 0 1-.2 1.7M12 17v5M8 22h8"/>',
    'monitor-up':'<rect width="20" height="14" x="2" y="3" rx="2"/><path d="M8 21h8M12 17v4M9 10l3-3 3 3M12 7v7"/>',
    'monitor-off':'<path d="m2 2 20 20M10 3h10a2 2 0 0 1 2 2v9M2 6v9a2 2 0 0 0 2 2h13M8 21h8M12 17v4"/>',
    'phone-off':'<path d="M10.7 13.3a16 16 0 0 0 2.9 0M8.4 4.9a16 16 0 0 1 7.2 0M2 15.3a2 2 0 0 0 2 2.4h3l1.8-3.6A15 15 0 0 1 12 13.7c1.1 0 2.2.1 3.3.4l1.8 3.6h3a2 2 0 0 0 2-2.4 10.5 10.5 0 0 0-3.2-6.3M2 2l20 20"/>',
    'menu':'<path d="M4 6h16M4 12h16M4 18h16"/>',
    'copy':'<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
    'image':'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>',
    'eye':'<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
    'arrow-right':'<path d="M5 12h14M13 6l6 6-6 6"/>',
    'video':'<rect x="2" y="5" width="15" height="14" rx="2"/><path d="m17 10 5-3v10l-5-3"/>',
    'video-off':'<path d="m2 2 20 20M10 5H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-2m0-5 5-3v10l-5-3M14 5h1a2 2 0 0 1 2 2v1"/>',
    'radio':'<circle cx="12" cy="12" r="2"/><path d="M16 8a6 6 0 0 1 0 8M8 8a6 6 0 0 0 0 8M19 5a10 10 0 0 1 0 14M5 5a10 10 0 0 0 0 14"/>'
  };
  const icon = (name) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ICONS.hash}</svg>`;
  const $ = (s, base=document) => base.querySelector(s);
  const $$ = (s, base=document) => Array.from(base.querySelectorAll(s));
  const esc = (s='') => String(s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const channels = [
    {id:'geral',name:'geral',icon:'hash',desc:'Nosso cantinho de sempre',welcome:'O começo de tudo. Conversa boa é por aqui.'},
    {id:'jogos',name:'jogos',icon:'gamepad-2',desc:'Partiu mais uma?',welcome:'Call, partida, rage e aquele GG de respeito.'},
    {id:'memes',name:'memes-e-aleatoriedades',icon:'laugh',desc:'Zero contexto, 100% entretenimento',welcome:'O lugar dos memes duvidosos e das conversas sem sentido.'},
    {id:'links',name:'links-legais',icon:'link',desc:'Compartilha o que achou',welcome:'Vídeos, sites, notícias e outras descobertas.'},
    {id:'ideias',name:'ideias',icon:'lightbulb',desc:'E se a gente...',welcome:'Joga suas ideias aqui. As boas e as péssimas.'}
  ];
  const voiceChannels = [{id:'resenha',name:'resenha',icon:'volume-2'},{id:'jogatina',name:'jogatina',icon:'gamepad-2'},{id:'cantinho',name:'cantinho chill',icon:'headphones'}];
  const colors = ['#7469d8','#db8b78','#5b9f9b','#947bc8','#c29465','#6d98d0','#b779a5','#78a67a'];
  const mockMembers = [
    {id:'demo-1',nickname:'Lia',color:'#d78d80',status:'ouvindo música',online:true},
    {id:'demo-2',nickname:'Rafa',color:'#6b93c7',status:'jogando alguma coisa',online:true},
    {id:'demo-3',nickname:'Dudu',color:'#8a76be',status:'só de boa',online:true},
    {id:'demo-4',nickname:'Bia',color:'#659c90',status:'na resenha',online:true}
  ];
  const sampleChat = {
    geral:[
      {id:1,author:'Lia',color:'#d78d80',body:'finalmente um lugar só nosso!! ✨',time:'18:42'},
      {id:2,author:'Rafa',color:'#6b93c7',body:'tá MUITO bonito isso aqui kkkkk',time:'18:43'},
      {id:3,author:'Dudu',color:'#8a76be',body:'e aí, bora jogar alguma coisa hoje?',time:'18:45'},
      {id:4,author:'Bia',color:'#659c90',body:'boraaaa! mas hoje sem me deixar pra trás 😂',time:'18:46'},
      {id:5,author:'Lia',color:'#d78d80',body:'o canal de memes vai ser o mais movimentado, certeza',time:'18:47'},
    ],
    jogos:[{id:10,author:'Rafa',color:'#6b93c7',body:'Qual vai ser o jogo da noite? 🎮',time:'19:12'},{id:11,author:'Dudu',color:'#8a76be',body:'voto no de sempre, mas aceito sugestões',time:'19:13'}],
    memes:[{id:20,author:'Bia',color:'#659c90',body:'inaugurando oficialmente o canal do caos 😂',time:'18:52'}],
    links:[{id:30,author:'Lia',color:'#d78d80',body:'joguem aqui aqueles links que vocês sempre perdem!',time:'18:55'}],
    ideias:[{id:40,author:'Dudu',color:'#8a76be',body:'a primeira ideia: ter uma IA que entre na call com a gente 🤖',time:'19:04'}]
  };
  const safeJSON = (k,fallback) => {try{return JSON.parse(localStorage.getItem(k))??fallback}catch{return fallback}};
  const safeStore = (key, value) => {try{localStorage.setItem(key,JSON.stringify(value))}catch(e){console.warn('Armazenamento local indisponível:', e)}};
  const config = window.ETIM_CONFIG || window.NEXO_CONFIG || {};
  const configured = !!(config.supabaseUrl && config.supabaseAnonKey);
  const sharedPassword = String(config.sharedPassword || '');
  let entryCode = '';
  let entryPhoto = '';
  const state = {
    live:false, sb:null,user:null, memberMap:new Map(), members:[], presence:[], channel:null, activeChannel:'geral',
    demoChat:safeJSON('etim_demo_chat',safeJSON('nexo_demo_chat',{})), profile:safeJSON('etim_demo_profile',safeJSON('nexo_demo_profile',{nickname:'Você',color:'#897df1',photo:''})),
    liveChat:{}, search:'', muted:false, voiceRoom:null, microphone:null, screen:null, camera:null, peers:new Map(), remoteVideos:new Map(), remoteCameras:new Map(),
    noticeClosed:false, loading:false, audioPromptAt:0,
    voiceSession:null,voiceWatchdog:null,signalTasks:new Map(),earlyIce:new Map(),
    voiceDepartures:new Map(),voicePresenceHeartbeat:0,
    videoHealth:new Map(),videoDiagnosticsBusy:false,mediaOpen:false,speaking:new Map(),audioMonitors:new Map(),speechTimer:null,
    micRepairInProgress:false,micRepairTimer:null,voiceDiagnostics:new Map(),
    voiceSounds:safeJSON('etim_voice_sounds',true)
  };
  let voiceAudioContext=null;
  function voiceCue(type){
    if(!state.voiceSounds)return;
    try{
      const AudioCtx=window.AudioContext||window.webkitAudioContext;if(!AudioCtx)return;
      if(!voiceAudioContext)voiceAudioContext=new AudioCtx();
      if(voiceAudioContext.state==='suspended')voiceAudioContext.resume().catch(()=>{});
      if(voiceAudioContext.state==='closed')return;
      const ctx=voiceAudioContext,now=ctx.currentTime+.012;
      const notes=type==='join'?[480,650]:[610,400];
      notes.forEach((frequency,i)=>{
        const oscillator=ctx.createOscillator(),gain=ctx.createGain();
        oscillator.type='sine';oscillator.frequency.setValueAtTime(frequency,now+i*.075);
        gain.gain.setValueAtTime(.0001,now+i*.075);
        gain.gain.exponentialRampToValueAtTime(.045,now+i*.075+.014);
        gain.gain.exponentialRampToValueAtTime(.0001,now+i*.075+.115);
        oscillator.connect(gain);gain.connect(ctx.destination);
        oscillator.start(now+i*.075);oscillator.stop(now+i*.075+.12);
      });
    }catch(err){console.warn('Aviso sonoro indisponível',err)}
  }
  const debounceToast = (s, error=false) => {const n=document.createElement('div');n.className='toast'+(error?' error':'');n.textContent=s;$('#toasts').appendChild(n);setTimeout(()=>n.remove(),4300)};
  const channelOf = id=>channels.find(x=>x.id===id)||channels[0];
  const voiceName = id=>voiceChannels.find(v=>v.id===id)?.name||'Sala de voz';
  const myId = ()=>state.user?.id || 'demo-me';
  const initials = name=>String(name||'?').split(/\s+/).slice(0,2).map(w=>w[0]).join('').toUpperCase();
  // Fotos ficam neste navegador até a implementação futura de armazenamento e sincronização de avatares.
  const safePhoto = (photo) => typeof photo === 'string' && /^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(photo) ? photo : '';
  const ownPhoto = (id) => id === myId() ? safePhoto(state.profile.photo) : safePhoto(state.presence.find(p=>p.id===id)?.photo);
  const avatar = (name,color,extra='',photo='') => {
    const src=safePhoto(photo);
    return `<div class="avatar ${extra}${src?' has-photo':''}" style="background:${esc(color||'#7469d8')}">${src?`<img alt="" src="${esc(src)}" />`:esc(initials(name))}</div>`;
  };
  const timestamp = v => {if(!v)return '';if(/^\d\d:\d\d$/.test(v))return v;try{return new Date(v).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}catch{return ''}};
  const getMessages = id => state.live ? (state.liveChat[id]||[]) : (sampleChat[id]||[]).concat(state.demoChat[id]||[]);
  function loadIcons(root=document){$$('[data-icon]',root).forEach(el=>{el.innerHTML=icon(el.dataset.icon)})}
  const isTalking=id=>!!state.speaking.get(id);
  function openMedia(){if(!state.voiceRoom)return;state.mediaOpen=true;renderMediaView();renderVoiceStage();closeMobile()}
  function backToChat(){state.mediaOpen=false;renderMediaView()}
  function renderMediaView(){
    const active=!!state.voiceRoom,open=active&&state.mediaOpen;
    $('#mediaView').classList.toggle('hidden',!open);
    $('#chatScroll').classList.toggle('hidden',open);
    $('.composer-wrap').classList.toggle('hidden',open);
    $('#chatVoiceBanner').classList.toggle('hidden',!active||open);
    if(active){
      $('#mediaViewTitle').textContent=voiceName(state.voiceRoom);
      const live=state.presence.filter(p=>p.voiceRoom===state.voiceRoom&&(p.isCameraOn||p.isStreaming)).length;
      $('#chatVoiceBanner').innerHTML=`<strong>🎧 ${esc(voiceName(state.voiceRoom))}</strong><button type="button" id="openMediaBanner">${live?live+' ao vivo · ':''} Abrir chamada ↗</button>`;
      if(!open)$('#openMediaBanner').onclick=openMedia;
    }
  }
  function monitorTrack(id,track){
    const prev=state.audioMonitors.get(id);if(prev){prev.source.disconnect();state.audioMonitors.delete(id)}
    if(!track)return;
    try{
      const AudioCtx=window.AudioContext||window.webkitAudioContext;if(!AudioCtx)return;
      if(!voiceAudioContext)voiceAudioContext=new AudioCtx();
      const source=voiceAudioContext.createMediaStreamSource(new MediaStream([track]));
      const analyser=voiceAudioContext.createAnalyser();analyser.fftSize=512;source.connect(analyser);
      state.audioMonitors.set(id,{source,analyser,samples:new Uint8Array(512),last:0});
      if(voiceAudioContext.state==='suspended')voiceAudioContext.resume().catch(()=>{});
      if(!state.speechTimer)state.speechTimer=setInterval(()=>{
        if(!state.voiceRoom)return;
        const now=Date.now();
        for(const [who,m] of state.audioMonitors){
          m.analyser.getByteTimeDomainData(m.samples);let sum=0;
          for(const v of m.samples){const s=(v-128)/128;sum+=s*s}
          if(Math.sqrt(sum/m.samples.length)>.035)m.last=now;
          const on=now-m.last<380&&(who!==myId()||!state.muted);
          if(on!==isTalking(who)){
            state.speaking.set(who,on);
            document.querySelectorAll('[data-speaker-id]').forEach(el=>{
              if(el.dataset.speakerId===who)el.classList.toggle('is-speaking',on);
            });
            if(who===myId())$('#myAvatar').classList.toggle('is-speaking',on);
          }
        }
      },110);
    }catch(err){console.warn('Indicador de fala:',err)}
  }
  function stopMonitor(id){const m=state.audioMonitors.get(id);if(m){m.source.disconnect();state.audioMonitors.delete(id)}state.speaking.delete(id)}
  function renderChannels(){
    $('#textChannels').innerHTML=channels.map(ch=>`<button class="channel-button ${ch.id===state.activeChannel?'active':''}" data-text="${ch.id}" aria-current="${ch.id===state.activeChannel?'page':'false'}">${icon(ch.icon)}<span>${esc(ch.name)}</span></button>`).join('');
    $('#voiceChannels').innerHTML=voiceChannels.map(ch=>{
      const users=state.live?state.presence.filter(p=>p.voiceRoom===ch.id):state.voiceRoom===ch.id?[{id:myId(),nickname:state.profile.nickname,color:state.profile.color,isMuted:state.muted}]:[];
      return `<div><button class="channel-button ${state.voiceRoom===ch.id?'voice-active':''}" data-voice="${ch.id}" title="Entrar na sala ${esc(ch.name)}">${icon(ch.icon)}<span>${esc(ch.name)}</span>${users.length?`<small style="margin-left:auto;color:#7ad6ac">${users.length}</small>`:''}</button>${users.map(p=>`<div class="voice-person ${isTalking(p.id)?'is-speaking':''}" data-speaker-id="${esc(p.id)}">${avatar(p.nickname,p.color,'voice-mini',ownPhoto(p.id))}<span>${esc(p.nickname)}${p.isMuted?' (mudo)':''}</span>${p.isStreaming?`<button class="watch-media" data-watch="${esc(p.id)}">● Ao vivo</button>`:p.isCameraOn?`<button class="watch-media" data-watch="${esc(p.id)}">Câmera</button>`:''}</div>`).join('')}</div>`;
    }).join('');
  }
  function renderHeader(){const ch=channelOf(state.activeChannel);$('#currentChannelLabel').textContent=ch.name;$('#currentChannelTagline').textContent=ch.desc;$('#topChannelIcon').innerHTML=icon(ch.icon);$('#messageInput').placeholder=`Mensagem em #${ch.name}`;}
  function renderMessages(){
    const ch=channelOf(state.activeChannel),msgs=getMessages(ch.id);let filtered=msgs;
    if(state.search.trim()){const q=state.search.toLocaleLowerCase();filtered=msgs.filter(m=>(m.body+' '+(m.nickname||m.author||'')).toLocaleLowerCase().includes(q))}
    const welcome=`<div class="channel-welcome"><div class="welcome-icon">${icon(ch.icon)}</div><h1>Boas-vindas ao #${esc(ch.name)}!</h1><p>${esc(ch.welcome)}</p></div>`;
    const day=`<div class="date-divider">${state.live?'MENSAGENS RECENTES':'CONVERSAS DE EXEMPLO'}</div>`;
    const list=filtered.map(m=>{
      const author=state.live ? (state.memberMap.get(m.user_id)?.nickname||(m.user_id===myId()?state.user?.nickname:'Amigo')) : m.author;
      const color=state.live ? (state.memberMap.get(m.user_id)?.color||'#7973c7') : m.color;
      const mine=state.live ? m.user_id===myId() : m.mine;
      const content=esc(m.body).replace(/(https?:\/\/[^\s&<>]+)/g,s=>`<a target="_blank" rel="noopener noreferrer" href="${s}">${s}</a>`);
      return `<article class="message ${mine?'mine':''}">${avatar(author,color,'',mine?ownPhoto(myId()):'')}<div class="message-body"><div class="message-meta"><b>${esc(author||'Amigo')}${mine?' (você)':''}</b><time>${timestamp(m.created_at||m.time)}</time></div><div class="message-content">${content}</div></div><div class="message-action"><button data-react="${esc(m.id)}" title="Reagir com coração">♥</button></div></article>`
    }).join('');
    $('#chatMessages').innerHTML=welcome+day+(list||`<div class="message" style="color:#8989a0;font-size:12px;padding:12px">${state.search?'Nenhuma mensagem encontrada.':'Seja o primeiro a mandar uma mensagem! ✨'}</div>`);
    const sc=$('#chatScroll');requestAnimationFrame(()=>sc.scrollTop=sc.scrollHeight);
  }
  function renderMembers(){
    let members=[];
    if(state.live){members=state.members.map(m=>{
      const p=state.presence.find(p=>p.id===m.user_id);return{id:m.user_id,nickname:m.nickname,color:m.color,online:!!p,status:p?.voiceRoom?'em '+voiceName(p.voiceRoom):p?'online':'offline'}
    });}
    else members=[{id:'demo-me',...state.profile,online:true,status:'explorando o etim'},...mockMembers];
    const online=members.filter(m=>m.online),offline=members.filter(m=>!m.online);
    $('#memberCount').textContent=String(members.length).padStart(2,'0');$('#onlineCount').textContent=online.length;$('#offlineCount').textContent=offline.length;
    const render=m=>`<div class="member-row ${m.online?'':'offline'}">${avatar(m.nickname,m.color,m.online?'':'offline',ownPhoto(m.id))}<div class="member-info"><b class="${m.id===myId()?'me':''}">${esc(m.nickname)}${m.id===myId()?' (você)':''}</b><small>${esc(m.status||'online')}</small></div></div>`;
    $('#onlineMembers').innerHTML=online.map(render).join('');$('#offlineMembers').innerHTML=offline.map(render).join('');$('#offlineTitle').classList.toggle('hidden',offline.length===0);
  }
  function renderProfile(){
    const p=state.user||state.profile;$('#myName').textContent=p.nickname;$('#myAvatar').style.background=p.color||'#897df1';
    const myPhoto=ownPhoto(myId());$('#myAvatar').classList.toggle('has-photo',!!myPhoto);
    $('#myAvatar').innerHTML=myPhoto?`<img alt="" src="${esc(myPhoto)}" />`:esc(initials(p.nickname));
    $('#myStatus').innerHTML=`<span class="online-indicator"></span> ${state.live?'Online':'Modo demo'}`;
    $('#modePill').className='mode-pill'+(state.live?' live':'');$('#modePill').innerHTML=`<span class="small-dot"></span> ${state.live?'AO VIVO':'DEMO'}`;
    $('#demoNotice').classList.toggle('hidden',state.live||state.noticeClosed);
  }
  function renderAll(){renderProfile();renderHeader();renderChannels();renderMembers();renderMessages();renderVoiceStage();}
  function closeMobile(){ $('#sidebar').classList.remove('open');$('#membersPanel').classList.remove('open');$('#mobileScrim').classList.add('hidden');}
  function toggleMobile(id){let node=$(id);const opening=!node.classList.contains('open');closeMobile();if(opening){node.classList.add('open');$('#mobileScrim').classList.remove('hidden')}}
  async function switchChannel(id){if(!channels.some(c=>c.id===id))return;state.activeChannel=id;state.search='';$('#searchInput').value='';$('#searchDrawer').classList.add('hidden');renderHeader();renderChannels();renderMessages();closeMobile();if(state.live)await fetchMessages(id)}
  function showModal(body, closable=true){$('#modalContent').innerHTML=body;$('#modalOverlay').classList.remove('hidden');$('#modalClose').classList.toggle('hidden',!closable);}
  function closeModal(){ $('#modalOverlay').classList.add('hidden') }
  function showHowTo(){showModal(`<div class="modal-mark">✦</div><h2>Coloque o etim online.</h2><p>O visual já funciona. Para conversar com a galera, é só conectar um projeto Supabase gratuito.</p><ol><li>Crie um projeto em <b>supabase.com</b>.</li><li>Ative o login anônimo em <b>Authentication → Providers → Anonymous</b>.</li><li>No SQL Editor, execute <code>supabase.sql</code> com o convite definido como <b>a mesma senha geral</b>, sem publicar o código no repositório.</li><li>Em <b>config.js</b>, preencha a URL e a chave <i>publishable</i> / <i>anon</i> (pública).</li><li>Publique os arquivos no GitHub Pages e compartilhe o link.</li></ol><p class="note">Consulte o README.md incluso no projeto. Nunca insira a chave service_role no site.</p><button class="primary" id="modalOk">Entendi!</button>`);$('#modalOk').onclick=closeModal}
  function showAbout(){showModal(`<div class="modal-mark">✳</div><h2>Bem-vindo ao etim.</h2><p>O seu espaço para ficar perto da galera. Uma primeira versão feita para experimentar canais de texto, salas de voz, câmera e transmissão de tela.</p><p><b>Modo demo:</b> as mensagens são locais deste navegador; ninguém mais as recebe.<br><b>Modo online:</b> use Supabase para conversar em tempo real com seus amigos.</p><button class="primary" id="modalOk">Bora explorar</button>`);$('#modalOk').onclick=closeModal}
  function showInvite(){
    showModal(`<div class="modal-mark">${icon('user-plus')}</div><h2>Chama a galera!</h2><p>${state.live?'Compartilhe o endereço do site e o código de convite que você configurou no banco de dados.':'Você está na demonstração. O link só vai colocar seus amigos na própria demo, sem compartilhar mensagens.'}</p><label>LINK DO etim</label><input id="inviteLink" readonly value="${esc(location.href.split('#')[0])}"/><button class="primary" id="copyInvite">${icon('copy')} Copiar link</button><p class="note">${state.live?'O código de acesso é solicitado separadamente ao entrar.':'Para conversarem juntos, primeiro ative o modo online.'}</p>`);
    $('#copyInvite').onclick=async()=>{try{await navigator.clipboard.writeText($('#inviteLink').value);debounceToast('Link copiado! ✨')}catch{ $('#inviteLink').select();debounceToast('Selecione e copie o endereço.')}};
  }
  // Reduz fotos para uma miniatura quadrada, impedindo arquivos grandes no localStorage.
  function resizeProfilePhoto(file){
    return new Promise((resolve,reject)=>{
      if(!file?.type.startsWith('image/')){reject(new Error('Escolha uma imagem JPG, PNG ou WebP.'));return}
      if(file.size > 10*1024*1024){reject(new Error('A foto deve ter até 10 MB.'));return}
      const img = new Image();
      const url=URL.createObjectURL(file);
      img.onload=()=>{
        try{
          const canvas=document.createElement('canvas');canvas.width=180;canvas.height=180;
          const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Navegador não suporta o editor de imagem.');
          const side=Math.min(img.naturalWidth,img.naturalHeight),x=(img.naturalWidth-side)/2,y=(img.naturalHeight-side)/2;
          ctx.drawImage(img,x,y,side,side,0,0,180,180);
          resolve(canvas.toDataURL('image/jpeg',.8));
        }catch(e){reject(e)}finally{URL.revokeObjectURL(url)}
      };
      img.onerror=()=>{URL.revokeObjectURL(url);reject(new Error('Não consegui abrir essa imagem.'))};
      img.src=url;
    });
  }
  function setupEntry(){
    const gate=$('#entryGate');
    const form=$('#gateForm'), name=$('#entryNickname'), prev=$('#entryAvatarPreview');
    const password=$('#gatePassword');
    const draw=()=>{
      const nick=name.value.trim()||'Você';
      prev.innerHTML='';
      const picture=avatar(nick,state.profile.color,'entry-avatar-inner',entryPhoto);
      prev.innerHTML=picture;
      prev.style.background=state.profile.color||'#897df1';
    };
    entryPhoto=safePhoto(state.profile.photo);
    name.value=state.profile.nickname==='Você'?'':state.profile.nickname;
    draw();
    $('#togglePassword').onclick=()=>{
      const shown=password.type==='text';password.type=shown?'password':'text';
      $('#togglePassword').setAttribute('aria-label',shown?'Mostrar senha':'Ocultar senha');
    };
    form.onsubmit=e=>{
      e.preventDefault();
      if(!password.value || (!configured && password.value!==sharedPassword)){$('#gateError').textContent='Senha incorreta. Peça a senha do grupo a um amigo.';password.focus();return}
      entryCode=password.value;
      $('#gateError').textContent='';
      $('#entryPasswordStep').classList.add('hidden');
      $('#entryProfileStep').classList.remove('hidden');
      name.focus();
    };
    $('#entryChoosePhoto').onclick=()=>$('#entryPhotoInput').click();
    $('#entryPhotoInput').onchange=async e=>{
      const file=e.target.files?.[0];if(!file)return;
      try{entryPhoto=await resizeProfilePhoto(file);$('#entryProfileError').textContent='';draw()}
      catch(err){$('#entryProfileError').textContent=err.message||'Não foi possível carregar a foto.'}
    };
    $('#entryRemovePhoto').onclick=()=>{entryPhoto='';$('#entryPhotoInput').value='';draw()};
    name.addEventListener('input',draw);
    $('#entryBack').onclick=()=>{
      $('#entryPasswordStep').classList.remove('hidden');
      $('#entryProfileStep').classList.add('hidden');password.focus();
    };
    $('#entryProfileForm').onsubmit=async e=>{
      e.preventDefault();
      const nickname=name.value.trim();
      if(nickname.length<2){$('#entryProfileError').textContent='Escolha um apelido de pelo menos duas letras.';name.focus();return}
      state.profile={...state.profile,nickname,photo:entryPhoto};safeStore('etim_demo_profile',state.profile);
      const submit=$('#entryProfileForm .entry-primary');submit.disabled=true;submit.textContent=configured?'Conectando ao grupo...':'Entrando...';
      try{
        if(configured)await bootLive(entryCode);
        else debounceToast(`Bem-vindo, ${nickname}! ✦`);
        if(!configured){try{sessionStorage.setItem('etim_entered','yes')}catch{}}
        gate.classList.add('hidden');$('#app').classList.remove('hidden');renderAll();
        password.value='';
      }catch(err){console.error(err);$('#entryProfileError').textContent=err.message||'Não foi possível entrar no etim.'}
      finally{submit.disabled=false;submit.innerHTML='Entrar no etim '+icon('arrow-right')}
    };
    let reopened=false;try{reopened=sessionStorage.getItem('etim_entered')==='yes'}catch{}
    // No modo online a senha sempre passa pela validação do servidor a cada acesso.
    if(!configured&&reopened&&state.profile.nickname&&state.profile.nickname!=='Você'){
      gate.classList.add('hidden');$('#app').classList.remove('hidden');renderAll();
    }else{password.focus()}
  }
  function showSettings(){
    const p=state.user||state.profile;
    let selected=p.color||colors[0],selectedPhoto=safePhoto(state.profile.photo);
    const photoMarkup=()=>avatar($('#newNickname')?.value.trim()||p.nickname,selected,'settings-avatar',selectedPhoto);
    showModal(`<div class="modal-mark">${icon('settings')}</div><h2>Seu perfil</h2><p>Escolha como sua foto e seu apelido aparecem no etim.</p>
      <div class="settings-photo-row"><div id="settingsPhotoPreview">${avatar(p.nickname,selected,'settings-avatar',selectedPhoto)}</div><div class="settings-photo-actions"><button type="button" id="choosePhoto" class="settings-photo-button">${icon('image')} Escolher foto</button><button type="button" id="removePhoto" class="settings-remove-photo">Remover foto</button><small>A foto é salva só neste navegador, por enquanto.</small></div></div>
      <input id="profileFile" type="file" accept="image/jpeg,image/png,image/webp" hidden />
      <label>SEU APELIDO</label><input id="newNickname" maxlength="28" value="${esc(p.nickname)}" placeholder="Como você quer ser chamado?"/>
      <label>COR DO SEU AVATAR</label><div id="swatches" style="display:flex;gap:8px;flex-wrap:wrap">${colors.map(c=>`<button type="button" class="swatch" data-color="${c}" style="width:31px;height:31px;background:${c};border-radius:9px;border:2px solid ${p.color===c?'#fff':'transparent'}" aria-label="Cor ${c}"></button>`).join('')}</div>
      <button class="primary" id="saveSettings">Salvar alterações</button><button class="secondary" id="settingsClose">Cancelar</button>`);
    function updatePreview(){$('#settingsPhotoPreview').innerHTML=photoMarkup()}
    $$('.swatch').forEach(el=>el.onclick=()=>{selected=el.dataset.color;$$('.swatch').forEach(s=>s.style.borderColor=s.dataset.color===selected?'white':'transparent');updatePreview()});
    $('#newNickname').addEventListener('input',updatePreview);
    $('#choosePhoto').onclick=()=>$('#profileFile').click();
    $('#removePhoto').onclick=()=>{selectedPhoto='';$('#profileFile').value='';updatePreview()};
    $('#profileFile').onchange=async e=>{
      const file=e.target.files?.[0];if(!file)return;
      try{selectedPhoto=await resizeProfilePhoto(file);updatePreview()}
      catch(err){debounceToast(err.message||'Não foi possível usar a foto.',true)}
    };
    $('#settingsClose').onclick=closeModal;
    $('#saveSettings').onclick=async()=>{
      const nickname=$('#newNickname').value.trim();if(nickname.length<2){debounceToast('Escolha um nome com pelo menos duas letras.',true);return}
      if(state.live){const {error}=await state.sb.from('club_members').update({nickname,color:selected}).eq('user_id',myId());if(error){debounceToast(error.message,true);return}state.user.nickname=nickname;state.user.color=selected;await fetchMembers();await updatePresence()}
      state.profile={...state.profile,nickname,color:selected,photo:selectedPhoto};safeStore('etim_demo_profile',state.profile);if(state.live)await updatePresence();
      closeModal();renderAll();debounceToast('Perfil atualizado!');
    };
  }
  // A senha online é verificada no Supabase, no banco, por join_club.
  // Não confie no bloqueio visual feito apenas em HTML/JS.
  async function bootLive(code=entryCode){
    if(!window.supabase?.createClient)throw new Error('Biblioteca do Supabase indisponível. Confira sua conexão.');
    if(!code)throw new Error('Digite a senha do grupo.');
    if(!state.sb)state.sb=window.supabase.createClient(config.supabaseUrl,config.supabaseAnonKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}});
    const response=await state.sb.auth.getSession();if(response.error)throw response.error;
    if(!response.data.session){const sign=await state.sb.auth.signInAnonymously();if(sign.error)throw sign.error}
    // Verifica a senha até mesmo se o usuário anônimo já estiver cadastrado.
    // No banco join_club faz UPSERT do nome/cor.
    const joined=await state.sb.rpc('join_club',{invite_code:code,chosen_name:state.profile.nickname,chosen_color:state.profile.color});
    if(joined.error)throw new Error('Não foi possível entrar. Verifique a senha do grupo e o Supabase. '+joined.error.message);
    try{await startLive()}
    catch(err){state.live=false;throw err}
    entryCode='';
    debounceToast('Bem-vindo ao etim online! ✦');
  }
  async function startLive(){
    const sess=await state.sb.auth.getSession();if(!sess.data.session)throw new Error('Faça login primeiro');
    const uid=sess.data.session.user.id;
    const m=await state.sb.from('club_members').select('user_id,nickname,color').eq('user_id',uid).single();if(m.error)throw m.error;
    state.user={id:uid,nickname:m.data.nickname,color:m.data.color};state.live=true;
    await fetchMembers();await fetchMessages(state.activeChannel);
    await state.sb.realtime.setAuth(sess.data.session.access_token);
    if(state.channel)await state.sb.removeChannel(state.channel);
    state.channel=state.sb.channel('etim:lobby',{config:{private:true,broadcast:{ack:true},presence:{key:uid}}});
    state.channel.on('presence',{event:'sync'},()=>{refreshPresence();syncPeers()})
      .on('broadcast',{event:'signal'},({payload})=>queueSignal(payload))
      .on('broadcast',{event:'voice-presence'},({payload})=>handleVoicePresenceEvent(payload))
      .on('postgres_changes',{event:'INSERT',schema:'public',table:'chat_messages'},({new:row})=>{
        if(!state.liveChat[row.channel])state.liveChat[row.channel]=[];
        if(!state.liveChat[row.channel].some(m=>m.id===row.id))state.liveChat[row.channel].push(row);
        if(row.channel===state.activeChannel)renderMessages();
      }).subscribe(async status=>{
        if(status==='SUBSCRIBED')await updatePresence();
        if(['CHANNEL_ERROR','TIMED_OUT'].includes(status))debounceToast('Canal em tempo real indisponível. Verifique as políticas do Supabase.',true);
      });
    renderAll();
  }
  async function fetchMembers(){if(!state.sb)return;const {data,error}=await state.sb.from('club_members').select('user_id,nickname,color').order('joined_at',{ascending:true});if(error){console.warn(error);return}state.members=data||[];state.memberMap=new Map(state.members.map(m=>[m.user_id,m]));renderMembers()}
  async function fetchMessages(ch){
    if(!state.sb)return;
    const {data,error}=await state.sb.from('chat_messages').select('id,user_id,channel,body,created_at').eq('channel',ch).order('created_at',{ascending:false}).limit(100);
    if(error){debounceToast('Não foi possível buscar mensagens: '+error.message,true);return}
    state.liveChat[ch]=(data||[]).reverse();if(state.activeChannel===ch)renderMessages();
  }
  async function sendMessage(e){
    e.preventDefault();const input=$('#messageInput'),body=input.value.trim();if(!body)return;if(body.length>2000)return debounceToast('Mensagem muito longa.',true);
    input.value='';$('#emojiPicker').classList.add('hidden');
    if(!state.live){
      (state.demoChat[state.activeChannel] ||= []).push({id:'local-'+Date.now(),author:state.profile.nickname,color:state.profile.color,body,mine:true,time:new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})});
      safeStore('etim_demo_chat',state.demoChat);renderMessages();return;
    }
    if(!state.user){input.value=body;return debounceToast('Aguarde a conexão online terminar.',true)}
    const channel=state.activeChannel;const {data,error}=await state.sb.from('chat_messages').insert({channel,body,user_id:myId()}).select('id,user_id,channel,body,created_at').single();
    if(error){input.value=body;debounceToast('Não foi possível enviar: '+error.message,true);return}
    if(!state.liveChat[channel])state.liveChat[channel]=[];
    if(!state.liveChat[channel].some(m=>m.id===data.id))state.liveChat[channel].push(data);
    if(state.activeChannel===channel)renderMessages();
  }
  // Reconciliar estados duplicados de abas/sessoes, dando prioridade ao registro mais recente.
  // Uma saida explicita vence um snapshot antigo de Presence ate uma nova sessao entrar.
  function reconcilePresence(records, departures, now=Date.now()){
    const latest=new Map();
    for(const record of records){
      if(!record||!record.id)continue;
      const previous=latest.get(record.id);
      const fresh=Date.parse(record.at||'')||0;
      const old=Date.parse(previous?.at||'')||0;
      if(!previous||fresh>=old)latest.set(record.id,{...record});
    }
    for(const [id,exit] of departures){
      if(now-exit.when>120000)departures.delete(id);
    }
    for(const person of latest.values()){
      const exit=departures.get(person.id);
      if(!exit)continue;
      // Uma nova sessao/novo canal cancela a supressao do estado antigo.
      if(person.voiceRoom && (person.voiceRoom!==exit.room ||
        (person.voiceSession&&person.voiceSession!==exit.session))){
        departures.delete(person.id);
      }else if(person.voiceRoom===exit.room &&
        (!exit.session||person.voiceSession===exit.session)){
        person.voiceRoom=null;person.isMuted=true;
        person.isCameraOn=false;person.isStreaming=false;
      }
    }
    return [...latest.values()];
  }
  function refreshPresence(){
    if(!state.channel)return;
    const previous=state.presence;
    const observed=Object.values(state.channel.presenceState()).flat();
    state.presence=reconcilePresence(observed,state.voiceDepartures);
    if(state.voiceRoom){
      const oldIds=new Set(previous.filter(p=>p.id!==myId()&&p.voiceRoom===state.voiceRoom).map(p=>p.id));
      const newIds=new Set(state.presence.filter(p=>p.id!==myId()&&p.voiceRoom===state.voiceRoom).map(p=>p.id));
      if([...newIds].some(id=>!oldIds.has(id)))voiceCue('join');
      else if([...oldIds].some(id=>!newIds.has(id)))voiceCue('leave');
    }
    renderChannels();renderMembers();renderMediaView();renderVoiceStage();
    const knownIds=new Set(state.members.map(m=>m.user_id));
    if(state.presence.some(p=>!knownIds.has(p.id)))fetchMembers();
  }
  function handleVoicePresenceEvent(payload){
    if(!payload||payload.kind!=='leave'||!payload.from||payload.from===myId()||!payload.room)return;
    const record=state.presence.find(p=>p.id===payload.from);
    if(record?.voiceSession&&payload.session&&record.voiceSession!==payload.session)return;
    state.voiceDepartures.set(payload.from,{
      room:payload.room,session:payload.session||null,when:Date.now()
    });
    const wasHere=record?.voiceRoom===payload.room;
    state.presence=reconcilePresence(state.presence,state.voiceDepartures);
    closePeer(payload.from);
    renderChannels();renderMembers();renderVoiceStage();
    if(wasHere&&state.voiceRoom===payload.room)voiceCue('leave');
  }
  function announceVoiceExit(room,session){
    if(!state.channel||!state.live||!room)return Promise.resolve();
    return Promise.resolve(state.channel.send({
      type:'broadcast',event:'voice-presence',
      payload:{kind:'leave',from:myId(),room,session}
    })).catch(err=>console.warn('Saida da sala nao anunciada:',err));
  }
  async function updatePresence(){if(!state.channel||!state.user)return;try{await state.channel.track({id:myId(),nickname:state.user.nickname,color:state.user.color,voiceRoom:state.voiceRoom,isMuted:state.muted,isStreaming:!!state.screen,isCameraOn:!!state.camera,photo:safePhoto(state.profile.photo),voiceSession:state.voiceSession,at:new Date().toISOString()})}catch(e){console.warn('Presence',e)}}

  // WebRTC P2P: quem tem ID menor inicia a oferta. ICE precoce é guardado até a descrição remota.
  // Cada renegociação recebe um ID próprio; sinais antigos de tentativas anteriores são ignorados.
  // TURN pode ser acrescentado posteriormente para redes que bloqueiam conexões diretas.
  const stunServers=[{urls:'stun:stun.l.google.com:19302'},{urls:'stun:stun1.l.google.com:19302'}];
  let turnServers=[],turnExpiresAt=0,turnLoading=null;
  async function loadTurnServers(){
    if(!state.live||!state.sb)return stunServers;
    if(turnServers.length&&Date.now()<turnExpiresAt)return [...stunServers,...turnServers];
    if(turnLoading)return turnLoading;
    turnLoading=(async()=>{
      try{
        const {data,error}=await state.sb.functions.invoke('etim-turn',{body:{}});
        if(error)throw error;
        if(!Array.isArray(data?.iceServers)||!data.iceServers.length)throw new Error('Lista TURN vazia');
        const servers=data.iceServers.filter(s=>s&&s.urls&&typeof s.credential==='string'&&typeof s.username==='string');
        if(!servers.length)throw new Error('Credenciais TURN invalidas');
        turnServers=servers;
        turnExpiresAt=Date.now()+Math.min(Number(data.ttl)||3600,3600)*1000;
        console.info('etim: TURN disponivel');
      }catch(err){
        console.warn('etim TURN indisponivel, usando STUN:',err);
        turnServers=[];turnExpiresAt=0;
        debounceToast('TURN ainda nao esta ativo; usando conexao direta STUN.',true);
      }finally{turnLoading=null}
      return [...stunServers,...turnServers];
    })();
    return turnLoading;
  }
  const newVoiceId=()=>window.crypto?.randomUUID?.() || Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);
  function roomRemoteIds(){
    return new Set(state.presence.filter(p=>p.id!==myId()&&p.voiceRoom===state.voiceRoom).map(p=>p.id));
  }
  function beginVoiceWatch(){
    clearInterval(state.voiceWatchdog);
    state.voiceWatchdog=setInterval(()=>{
      if(!state.live||!state.voiceRoom)return;
      // Atualiza o ultimo registro da sala para corrigir presenca em reconexoes lentas.
      if(Date.now()-state.voicePresenceHeartbeat>12000){
        state.voicePresenceHeartbeat=Date.now();
        updatePresence();
      }
      refreshPresence();
      syncPeers();
      inspectRemoteVideo().catch(e=>console.warn('Diagnóstico de vídeo:',e));
      verifyMicrophone().catch(e=>console.warn('Microfone:',e));
      const now=Date.now();
      for(const peer of [...state.peers.values()]){
        if(peer.pc.connectionState==='connected')continue;
        if(now-peer.lastAttempt<12000)continue;
        if(peer.attempts>=4){
          if(!peer.warned){peer.warned=true;debounceToast('Não consegui conectar a voz. Algumas redes exigem servidor TURN.',true)}
          continue;
        }
        recoverPeer(peer.id,'tempo de espera');
      }
    },5000);
  }
  async function joinVoice(room){
    if(state.voiceRoom===room){openMedia();return}
    if(state.voiceRoom)await leaveVoice(true);
    // Criar/retomar o AudioContext no clique ajuda o Safari a reproduzir os sons e a voz.
    voiceCue('join');
    state.voiceRoom=room;state.voiceSession=newVoiceId();state.muted=true;
    const joiningSession=state.voiceSession;
    state.voicePresenceHeartbeat=Date.now();
    renderChannels();renderVoiceStage();closeMobile();
    if(!navigator.mediaDevices?.getUserMedia){
      debounceToast('Microfone e câmera exigem HTTPS ou localhost.',true);
      await updatePresence();return;
    }
    let stream;
    try{
      stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true},video:false});
      state.muted=false;
    }catch(err){
      console.warn('Microfone não autorizado',err);
      stream=new MediaStream();state.muted=true;
      debounceToast('Microfone indisponível. Você entrou apenas para ouvir.',true);
    }
    if(state.voiceRoom!==room||state.voiceSession!==joiningSession){stream.getTracks().forEach(t=>t.stop());return}
    state.microphone=stream;monitorTrack(myId(),stream.getAudioTracks()[0]);
    attachMicrophoneWatch(stream.getAudioTracks()[0]);
    await updatePresence();
    renderChannels();renderVoiceStage();
    if(state.live){await loadTurnServers();if(state.voiceRoom===room&&state.voiceSession===joiningSession){syncPeers();beginVoiceWatch()}}
    else debounceToast('Prévia local: ninguém recebe sua voz na demo.');
  }
  async function leaveVoice(silent=false){
    if(!state.voiceRoom)return;
    const oldRoom=state.voiceRoom,oldSession=state.voiceSession;
    if(silent!==true)voiceCue('leave');
    clearInterval(state.voiceWatchdog);state.voiceWatchdog=null;
    // Anuncia a saida antes do Presence se atualizar; protege contra snapshots atrasados.
    const notice=announceVoiceExit(oldRoom,oldSession);
    state.voiceRoom=null;state.voiceSession=null;state.voicePresenceHeartbeat=0;state.mediaOpen=false;
    for(const id of [...state.peers.keys()])closePeer(id);
    state.earlyIce.clear();state.signalTasks.clear();
    const mic=state.microphone;state.microphone=null;
    clearTimeout(state.micRepairTimer);state.micRepairTimer=null;
    if(mic)mic.getTracks().forEach(t=>t.stop());stopMonitor(myId());
    renderChannels();renderVoiceStage();
    await stopScreen();await stopCamera();
    state.muted=false;
    await updatePresence();
    await Promise.race([notice,new Promise(resolve=>setTimeout(resolve,350))]);
    renderChannels();renderVoiceStage();
  }
  function closePeer(id){
    const peer=state.peers.get(id);
    if(peer){
      peer.pc.onicecandidate=null;peer.pc.ontrack=null;
      peer.pc.onconnectionstatechange=null;peer.pc.oniceconnectionstatechange=null;
      if(peer.audio){peer.audio.pause();peer.audio.srcObject=null;peer.audio.remove()}
      peer.pc.close();state.peers.delete(id);
    }
    state.remoteVideos.delete(id);state.remoteCameras.delete(id);stopMonitor(id);
    state.videoHealth.delete('cam:'+id);state.videoHealth.delete('screen:'+id);
  }
  function syncPeers(){
    if(!state.live||!state.voiceRoom||!state.microphone)return;
    const active=roomRemoteIds();
    for(const id of [...state.peers.keys()])if(!active.has(id))closePeer(id);
    for(const id of active){
      const peer=ensurePeer(id);
      if(myId()<id)offerPeer(peer).catch(e=>console.warn('Oferta WebRTC:',e));
      else if(!peer.helloSent){
        peer.helloSent=true;
        signal(id,{kind:'hello'}).catch(e=>console.warn('Sinal hello:',e));
      }
    }
    renderVoiceStage();
  }
  async function signal(to,data){
    if(!state.channel||!state.voiceRoom)return;
    const target=state.presence.find(p=>p.id===to);
    const payload={...data,to,from:myId(),room:state.voiceRoom,
      session:state.voiceSession,toSession:target?.voiceSession||null};
    const result=await state.channel.send({type:'broadcast',event:'signal',payload});
    if(result==='error'||result==='timed out')console.warn('etim: sinal WebRTC não entregue:',result,data.kind);
  }
  function ensurePeer(id){
    if(state.peers.has(id))return state.peers.get(id);
    const pc=new RTCPeerConnection({iceServers:[...stunServers,...turnServers]});
    const audioTrans=pc.addTransceiver('audio',{direction:'sendrecv'});
    const cameraTrans=pc.addTransceiver('video',{direction:'sendrecv'});
    const screenTrans=pc.addTransceiver('video',{direction:'sendrecv'});
    const peer={
      id,pc,audioSender:audioTrans.sender,cameraSender:cameraTrans.sender,
      screenSender:screenTrans.sender,screenTrans,
      audio:null,callId:null,offering:false,offerSent:false,helloSent:false,
      lastAttempt:Date.now(),attempts:0,warned:false,responded:false,ready:null,
      pendingMediaOffer:false,renegotiating:false
    };
    state.peers.set(id,peer); // Registra antes do primeiro await: impede conexões duplicadas.
    peer.ready=Promise.all([
      peer.audioSender.replaceTrack(state.microphone?.getAudioTracks()[0]||null),
      peer.cameraSender.replaceTrack(state.camera?.getVideoTracks()[0]||null),
      peer.screenSender.replaceTrack(state.screen?.getVideoTracks()[0]||null)
    ]);
    pc.onicecandidate=ev=>{
      if(ev.candidate&&peer.callId&&state.peers.get(id)===peer)
        signal(id,{kind:'ice',connectionId:peer.callId,candidate:ev.candidate.toJSON()}).catch(console.warn);
    };
    pc.ontrack=ev=>{
      if(state.peers.get(id)!==peer)return;
      const track=ev.track;
      if(track.kind==='audio'){
        const audio=peer.audio||document.createElement('audio');
        if(!peer.audio){
          audio.autoplay=true;audio.playsInline=true;audio.setAttribute('playsinline','');
          audio.style.display='none';audio.preload='auto';document.body.appendChild(audio);peer.audio=audio;
        }
        audio.srcObject=new MediaStream([track]);audio.muted=false;audio.volume=1;monitorTrack(id,track);
        function playIncoming(){
          if(state.peers.get(id)!==peer)return;
          audio.play().catch(err=>{
            console.warn('etim: áudio remoto bloqueado',err);
            if(Date.now()-state.audioPromptAt>8000){
              state.audioPromptAt=Date.now();
              debounceToast('Clique em "Ativar som" para liberar o áudio dos amigos.',true);
            }
          });
        }
        playIncoming();
        track.addEventListener('unmute',playIncoming);
      }else if(track.kind==='video'){
        const isScreen=ev.transceiver===screenTrans ||
          (screenTrans.mid!==null&&ev.transceiver.mid===screenTrans.mid);
        const info={stream:new MediaStream([track]),track,active:!track.muted,mid:ev.transceiver?.mid};
        (isScreen?state.remoteVideos:state.remoteCameras).set(id,info);
        const prefix=isScreen?'screen:':'cam:';
        track.onunmute=()=>{
          if(state.peers.get(id)!==peer)return;
          info.active=true;state.videoHealth.delete(prefix+id);
          renderVoiceStage();
        };
        track.onmute=()=>{
          if(state.peers.get(id)!==peer)return;
          info.active=false;renderVoiceStage();
        };
        track.onended=()=>{
          if(state.peers.get(id)!==peer)return;
          info.active=false;renderVoiceStage();
        };
        renderVoiceStage();
      }
    };
    pc.onconnectionstatechange=()=>{
      if(state.peers.get(id)!==peer)return;
      console.info('etim WebRTC',id,pc.connectionState,pc.iceConnectionState);
      if(pc.connectionState==='connected'){
        peer.attempts=0;
        if(peer.audio?.paused)peer.audio.play().catch(()=>{});
      }else if(pc.connectionState==='failed'){
        debounceToast('Conexão de voz falhou. Tentando reconectar...',true);
        recoverPeer(id,'conexão falhou');
      }
    };
    pc.oniceconnectionstatechange=()=>{
      if(state.peers.get(id)!==peer)return;
      if(pc.iceConnectionState==='failed')recoverPeer(id,'ICE falhou');
    };
    return peer;
  }
  async function offerPeer(peer,force=false){
    if(!peer||state.peers.get(peer.id)!==peer||myId()>=peer.id)return;
    if(peer.offering||peer.pc.signalingState!=='stable'){
      if(force)peer.pendingMediaOffer=true;
      return;
    }
    if(peer.offerSent&&!force)return;
    peer.offering=true;
    peer.pendingMediaOffer=false;
    try{
      await peer.ready;
      if(state.peers.get(peer.id)!==peer||!state.voiceRoom)return;
      peer.callId=newVoiceId();
      peer.lastAttempt=Date.now();peer.attempts++;
      const offer=await peer.pc.createOffer();
      await peer.pc.setLocalDescription(offer);
      peer.offerSent=true;
      await signal(peer.id,{kind:'offer',connectionId:peer.callId,description:peer.pc.localDescription.toJSON()});
    }catch(err){
      peer.offerSent=false;
      console.warn('Erro ao fazer oferta:',err);
    }finally{peer.offering=false}
  }
  function addEarlyIce(from,connectionId,candidate){
    if(!connectionId)return;
    const key=from+':'+connectionId;
    const list=state.earlyIce.get(key)||[];
    if(list.length<64)list.push(candidate);
    state.earlyIce.set(key,list);
    // Evita crescimento infinito se um participante cair antes da oferta.
    if(state.earlyIce.size>40)state.earlyIce.delete(state.earlyIce.keys().next().value);
  }
  async function flushEarlyIce(peer){
    if(!peer.callId||!peer.pc.remoteDescription)return;
    const key=peer.id+':'+peer.callId;
    const list=state.earlyIce.get(key)||[];
    state.earlyIce.delete(key);
    for(const candidate of list){
      try{await peer.pc.addIceCandidate(candidate)}
      catch(err){console.warn('ICE pendente ignorado:',err)}
    }
  }
  function queueSignal(p){
    if(!p||p.to!==myId()||p.from===myId()||!state.voiceRoom||p.room!==state.voiceRoom)return;
    if(p.toSession&&p.toSession!==state.voiceSession)return;
    const previous=state.signalTasks.get(p.from)||Promise.resolve();
    const task=previous.catch(()=>{}).then(()=>handleSignal(p)).catch(err=>console.warn('etim WebRTC sinal:',err));
    state.signalTasks.set(p.from,task);
    task.finally(()=>{if(state.signalTasks.get(p.from)===task)state.signalTasks.delete(p.from)});
  }
  async function handleSignal(p){
    if(!state.live||!state.voiceRoom||!state.microphone)return;
    if(p.kind==='media-update'){
      if(myId()>=p.from)return;
      const peer=ensurePeer(p.from);
      await offerPeer(peer,true);
      return;
    }
    if(p.kind==='hello'){
      if(myId()>=p.from)return; // Só o lado eleito como iniciador oferece.
      let peer=ensurePeer(p.from);
      if(p.reset&&(p.force||Date.now()-peer.lastAttempt>3500)){
        closePeer(p.from);peer=ensurePeer(p.from);
      }
      await offerPeer(peer);
      return;
    }
    if(p.kind==='ice'){
      const peer=state.peers.get(p.from);
      if(peer&&peer.callId===p.connectionId&&peer.pc.remoteDescription){
        try{await peer.pc.addIceCandidate(p.candidate)}
        catch(err){console.warn('ICE candidato recusado:',err)}
      }else if(!peer||!peer.callId||peer.callId===p.connectionId){
        addEarlyIce(p.from,p.connectionId,p.candidate);
      }
      return;
    }
    if(p.kind==='offer'){
      if(myId()<p.from){console.warn('Oferta fora da ordem esperada, ignorada');return}
      let peer=state.peers.get(p.from);
      if(!peer)peer=ensurePeer(p.from);
      if(peer.responded&&peer.callId===p.connectionId)return;
      // Uma nova oferta no mesmo par representa renegociação de mídia,
      // não uma razão para destruir áudio, câmera e ICE estabelecidos.
      if(peer.pc.signalingState!=='stable'&&peer.pc.signalingState!=='have-remote-offer'){
        console.warn('etim: oferta fora da ordem',peer.pc.signalingState);
        return;
      }
      peer.callId=p.connectionId;
      peer.responded=false;
      peer.lastAttempt=Date.now();
      await peer.ready;
      await peer.pc.setRemoteDescription(p.description);
      await flushEarlyIce(peer);
      const answer=await peer.pc.createAnswer();
      await peer.pc.setLocalDescription(answer);
      peer.responded=true;
      await signal(p.from,{kind:'answer',connectionId:peer.callId,description:peer.pc.localDescription.toJSON()});
      return;
    }
    if(p.kind==='answer'){
      const peer=state.peers.get(p.from);
      if(!peer||peer.callId!==p.connectionId||peer.pc.signalingState!=='have-local-offer')return;
      await peer.pc.setRemoteDescription(p.description);
      await flushEarlyIce(peer);
      if(peer.pendingMediaOffer){
        peer.pendingMediaOffer=false;
        await offerPeer(peer,true);
      }
    }
  }
  // Troca fonte mantendo conexão e em seguida atualiza SDP para navegadores
  // que não iniciam o envio de vídeo depois de replaceTrack(null -> track).
  function requestMediaRenegotiation(){
    if(!state.live||!state.voiceRoom)return;
    for(const id of roomRemoteIds()){
      const peer=state.peers.get(id);
      if(!peer)continue;
      if(myId()<id)offerPeer(peer,true).catch(err=>console.warn('Renegociar:',err));
      else signal(id,{kind:'media-update'}).catch(err=>console.warn('Avisar mídia:',err));
    }
  }
  async function refreshMediaConnections(kind,track){
    if(!state.live||!state.voiceRoom)return;
    const senderName=kind==='camera'?'cameraSender':'screenSender';
    const activePeers=[...state.peers.values()];
    const results=await Promise.allSettled(activePeers.map(async peer=>{
      await peer.ready;
      if(state.peers.get(peer.id)!==peer)return;
      await peer[senderName].replaceTrack(track);
    }));
    const failed=results.filter(r=>r.status==='rejected');
    if(failed.length){
      console.warn('etim: falha ao transmitir '+kind,failed.map(x=>x.reason));
      debounceToast('Falha ao enviar '+(kind==='camera'?'a câmera':'a tela')+' para alguém. Tente Reconectar.',true);
    }
    // O emissor renegocia as faixas existentes, sem reiniciar a conexão.
    if(track)requestMediaRenegotiation();
  }
  // Indicadores locais, sem enviar videos ou informações pessoais ao servidor.
  // Distingue player bloqueado de ausência de quadros WebRTC.
  async function inspectRemoteVideo(){
    if(state.videoDiagnosticsBusy||!state.voiceRoom||!state.live)return;
    state.videoDiagnosticsBusy=true;
    try{
      for(const [kind,map] of [['cam',state.remoteCameras],['screen',state.remoteVideos]]){
        for(const [id,info] of map){
          if(!info.active||!state.peers.has(id))continue;
          const peer=state.peers.get(id);
          const key=kind+':'+id, now=Date.now();
          const current=state.videoHealth.get(key)||{lastFrames:-1,lastProgress:now,status:'Aguardando imagem'};
          const tileId=(kind==='cam'?'cam-':'remote-')+id;
          const element=document.getElementById(tileId);
          let frames=null;
          try{
            const receiver=peer.pc.getReceivers().find(receiver=>receiver.track===info.track);
            if(receiver&&typeof receiver.getStats==='function'){
              const reports=await receiver.getStats();
              reports.forEach(stat=>{
                if(stat.type==='inbound-rtp'&&(stat.kind==='video'||stat.mediaType==='video'))
                  frames=Number(stat.framesDecoded??stat.framesReceived??0);
              });
            }
          }catch(e){console.debug('Sem estatísticas de vídeo',e)}
          const sizeOk=!!(element?.videoWidth&&element?.videoHeight);
          if(frames!==null){
            if(frames>current.lastFrames){current.lastFrames=frames;current.lastProgress=now}
            const waiting=frames===0 || now-current.lastProgress>11000;
            current.status=waiting?'Sem quadros de vídeo recebidos':'';
          }else if(sizeOk){
            current.status='';
          }else if(now-current.lastProgress>9000){
            current.status='Aguardando quadros de vídeo';
          }
          state.videoHealth.set(key,current);
          const tile=element?.closest('.video-tile');
          const note=tile?.querySelector('[data-video-health]');
          if(note){
            note.textContent=current.status;
            note.classList.toggle('hidden',!current.status);
          }
        }
      }
    }finally{state.videoDiagnosticsBusy=false}
  }
  function recoverPeer(id,reason){
    if(!state.live||!state.voiceRoom||!roomRemoteIds().has(id))return;
    const peer=state.peers.get(id);
    if(peer&&Date.now()-peer.lastAttempt<4500)return;
    console.info('etim recuperando conexão:',id,reason);
    if(myId()<id){
      const attempts=peer?.attempts||0;
      if(attempts>=4)return;
      closePeer(id);
      const next=ensurePeer(id);next.attempts=attempts;
      offerPeer(next).catch(console.warn);
    }else{
      if(peer)peer.lastAttempt=Date.now();
      signal(id,{kind:'hello',reset:true}).catch(console.warn);
    }
  }
  // Diagnostico local de WebRTC, sem IPs, IDs de conta, chaves ou tokens.
  // Compara duas amostras RTP para ver se os pacotes/frames estao de fato fluindo.
  async function rtpCount(transceiverPart, direction){
    const result={packets:0,bytes:0,frames:0,available:false};
    if(!transceiverPart||typeof transceiverPart.getStats!=='function')return result;
    try{
      const reports=await transceiverPart.getStats();
      reports.forEach(stat=>{
        if(stat.type!==(direction+'-rtp')||stat.isRemote)return;
        result.available=true;
        result.packets+=Number(stat.packetsSent??stat.packetsReceived??0);
        result.bytes+=Number(stat.bytesSent??stat.bytesReceived??0);
        result.frames+=Number(stat.framesEncoded??stat.framesDecoded??0);
      });
    }catch(err){console.warn('Estatistica RTP nao disponivel:',err)}
    return result;
  }
  async function readVoiceStatistics(){
    const local=state.microphone?.getAudioTracks()[0];
    const camera=state.camera?.getVideoTracks()[0];
    const screen=state.screen?.getVideoTracks()[0];
    const report={
      browser:/CriOS/i.test(navigator.userAgent)?'Chrome iOS':
        /Chrome|Chromium|Edg/i.test(navigator.userAgent)?'Chrome/Chromium':
        /Safari/i.test(navigator.userAgent)?'Safari':'Outro',
      room:state.voiceRoom||'fora da sala',
      microphone:local?{ready:local.readyState,enabled:local.enabled,muted:local.muted}:'ausente',
      camera:camera?{ready:camera.readyState,enabled:camera.enabled,muted:camera.muted}:'desligada',
      screen:screen?{ready:screen.readyState,enabled:screen.enabled,muted:screen.muted}:'desligada',
      turnConfigured:turnServers.length>0,
      peers:[]
    };
    for(const [id,peer] of state.peers){
      const transceivers=peer.pc.getTransceivers();
      const audio=transceivers.find(t=>t.sender===peer.audioSender);
      const cam=transceivers.find(t=>t.sender===peer.cameraSender);
      const scr=transceivers.find(t=>t.sender===peer.screenSender);
      const [audioOut,audioIn,camOut,camIn,screenOut,screenIn]=await Promise.all([
        rtpCount(peer.audioSender,'outbound'),rtpCount(audio?.receiver,'inbound'),
        rtpCount(peer.cameraSender,'outbound'),rtpCount(cam?.receiver,'inbound'),
        rtpCount(peer.screenSender,'outbound'),rtpCount(scr?.receiver,'inbound')
      ]);
      let route='nao detectada';
      try{
        const all=await peer.pc.getStats();
        let pair=null;
        all.forEach(row=>{
          if(row.type==='transport'&&row.selectedCandidatePairId)pair=all.get(row.selectedCandidatePairId);
          else if(row.type==='candidate-pair'&&row.selected&&!pair)pair=row;
        });
        if(pair){
          const localCandidate=all.get(pair.localCandidateId);
          route=localCandidate?.candidateType||'conectada (tipo desconhecido)';
        }
      }catch(err){console.debug('ICE stats indisponiveis',err)}
      report.peers.push({
        friend:state.memberMap.get(id)?.nickname||'Amigo',
        connection:peer.pc.connectionState,
        ice:peer.pc.iceConnectionState,signaling:peer.pc.signalingState,
        route,
        senderTrack:peer.audioSender.track?{
          ready:peer.audioSender.track.readyState,
          enabled:peer.audioSender.track.enabled,muted:peer.audioSender.track.muted
        }:'nenhuma',
        directions:{audio:audio?.currentDirection||null,camera:cam?.currentDirection||null,screen:scr?.currentDirection||null},
        remoteAudioPaused:!!peer.audio?.paused,
        audioOut,audioIn,camOut,camIn,screenOut,screenIn
      });
    }
    return report;
  }
  function deltaStat(before,after,key){
    if(!before||!after)return 'n/d';
    const last=before[key],current=after[key];
    if(!last?.available||!current?.available)return 'sem estatisticas';
    return String(Math.max(0,current.packets-last.packets))+' pacotes, '+
      String(Math.max(0,current.frames-last.frames))+' quadros';
  }
  async function showVoiceDiagnostics(){
    if(!state.voiceRoom)return;
    showModal('<div class="modal-mark">◉</div><h2>Diagnóstico da chamada</h2><p>Medindo pacotes enviados e recebidos durante 2 segundos...</p>');
    try{
      const first=await readVoiceStatistics();
      await new Promise(resolve=>setTimeout(resolve,2100));
      const second=await readVoiceStatistics();
      const lines=[
        'etim · diagnostico WebRTC',
        'Navegador: '+second.browser,
        'Microfone local: '+JSON.stringify(second.microphone),
        'Camera local: '+JSON.stringify(second.camera),
        'Tela local: '+JSON.stringify(second.screen),
        'Credenciais TURN carregadas: '+(second.turnConfigured?'sim':'nao'),
        'Participantes conectados: '+second.peers.length
      ];
      for(let i=0;i<second.peers.length;i++){
        const p=second.peers[i],previous=first.peers[i];
        lines.push(
          '',
          'Participante '+(i+1)+' ('+p.friend+')',
          'Conexao: '+p.connection+' | ICE: '+p.ice+' | caminho: '+p.route,
          'Sinalizacao: '+p.signaling+' | direcoes: '+JSON.stringify(p.directions),
          'Faixa do microfone enviada: '+JSON.stringify(p.senderTrack),
          'Audio ENVIADO (2s): '+deltaStat(previous,p,'audioOut'),
          'Audio RECEBIDO (2s): '+deltaStat(previous,p,'audioIn'),
          'Camera ENVIADA (2s): '+deltaStat(previous,p,'camOut'),
          'Camera RECEBIDA (2s): '+deltaStat(previous,p,'camIn'),
          'Tela ENVIADA (2s): '+deltaStat(previous,p,'screenOut'),
          'Tela RECEBIDA (2s): '+deltaStat(previous,p,'screenIn'),
          'Reproducao remota pausada: '+(p.remoteAudioPaused?'sim':'nao')
        );
      }
      const result=lines.join('\n');
      showModal('<div class="modal-mark">◉</div><h2>Diagnóstico WebRTC</h2>'+
        '<p>Os valores representam o tráfego dos últimos 2 segundos. Zero pacotes de áudio enviado, enquanto você fala, indica problema no envio. Pacotes recebidos com silêncio indicam problema de reprodução ou conteúdo.</p>'+
        '<pre id="voiceReport" class="voice-report">'+esc(result)+'</pre>'+
        '<button class="primary" type="button" id="copyVoiceReport">Copiar diagnóstico</button>');
      $('#copyVoiceReport').onclick=()=>{
        if(navigator.clipboard?.writeText)navigator.clipboard.writeText(result).then(()=>debounceToast('Diagnóstico copiado!')).catch(()=>debounceToast('Não foi possível copiar.',true));
        else debounceToast('Selecione e copie o texto do diagnóstico.',true);
      };
    }catch(error){
      console.warn('Diagnóstico WebRTC:',error);
      showModal('<h2>Diagnóstico indisponível</h2><p>Seu navegador não forneceu todas as estatísticas desta chamada.</p>');
    }
  }
  async function activateRemoteAudio(){
    if(!state.voiceRoom)return;
    // O clique desbloqueia reprodução no Safari e reativa o contexto de avisos.
    if(voiceAudioContext?.state==='suspended')voiceAudioContext.resume().catch(()=>{});
    const audios=[...state.peers.values()].map(p=>p.audio).filter(Boolean);
    if(!audios.length){debounceToast('Ainda não chegou áudio dos amigos. Tente "Reconectar".',true);return}
    const results=await Promise.allSettled(audios.map(a=>{a.muted=false;a.volume=1;return a.play()}));
    if(results.some(r=>r.status==='rejected'))debounceToast('Confira as permissões de áudio e a saída de som.',true);
    else debounceToast('Som dos amigos ativado!');
  }
  async function reconnectVoice(){
    if(!state.voiceRoom)return;
    const room=state.voiceRoom;debounceToast('Reconectando sua chamada...');
    await leaveVoice(true);await joinVoice(room);
  }
  function toggleVoiceSounds(){
    state.voiceSounds=!state.voiceSounds;
    safeStore('etim_voice_sounds',state.voiceSounds);
    if(state.voiceSounds)voiceCue('join');
    renderVoiceStage();
  }
  function attachMicrophoneWatch(track){
    if(!track)return;
    track.onended=()=>{
      if(state.voiceRoom&&!state.muted){
        debounceToast('O microfone foi desconectado. Tentando recuperar...',true);
        repairMicrophone();
      }
    };
    track.onmute=()=>{
      if(state.voiceRoom&&!state.muted){
        clearTimeout(state.micRepairTimer);
        state.micRepairTimer=setTimeout(()=>{
          if(track.muted&&track.readyState==='live'&&state.voiceRoom&&!state.muted)
            repairMicrophone();
        },3500);
      }
    };
    track.onunmute=()=>{clearTimeout(state.micRepairTimer);state.micRepairTimer=null};
  }
  async function verifyMicrophone(){
    if(!state.live||!state.voiceRoom||state.muted)return;
    const track=state.microphone?.getAudioTracks()[0];
    if(!track||track.readyState!=='live'||track.muted){
      await repairMicrophone();
      return;
    }
    for(const peer of state.peers.values()){
      if(peer.audioSender.track!==track){
        try{await peer.audioSender.replaceTrack(track)}
        catch(e){console.warn('Reanexar áudio ao participante:',e)}
      }
    }
  }
  async function repairMicrophone(){
    if(state.micRepairInProgress||!state.voiceRoom||state.muted||!navigator.mediaDevices?.getUserMedia)return;
    state.micRepairInProgress=true;
    const oldStream=state.microphone,session=state.voiceSession;
    try{
      const next=await navigator.mediaDevices.getUserMedia({
        audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true},video:false
      });
      if(state.voiceSession!==session||!state.voiceRoom){next.getTracks().forEach(t=>t.stop());return}
      const newTrack=next.getAudioTracks()[0];
      if(!newTrack)throw new Error('Nenhum microfone disponível');
      state.microphone=next;
      monitorTrack(myId(),newTrack);
      attachMicrophoneWatch(newTrack);
      await Promise.allSettled([...state.peers.values()].map(p=>p.audioSender.replaceTrack(newTrack)));
      oldStream?.getTracks().forEach(t=>{t.onended=null;t.onmute=null;t.stop()});
      requestMediaRenegotiation();
      debounceToast('Microfone reconectado.');
    }catch(e){console.warn('Não foi possível recuperar o microfone',e)}
    finally{state.micRepairInProgress=false}
  }
  async function toggleMute(){
    if(!state.voiceRoom)return;
    state.muted=!state.muted;
    const local=state.microphone?.getAudioTracks()[0];
    if(!state.muted&&(!local||local.readyState!=='live')){
      await repairMicrophone();
    }else{
      state.microphone?.getAudioTracks().forEach(t=>t.enabled=!state.muted);
      for(const peer of state.peers.values()){
        if(peer.audioSender.track!==local&&local){
          try{await peer.audioSender.replaceTrack(local)}catch(e){console.warn('Reativar envio de áudio:',e)}
        }
      }
    }
    await updatePresence();renderVoiceStage();
  }
  async function startCamera(){
    if(!state.voiceRoom){debounceToast('Entre em uma sala de voz antes de ligar a câmera.',true);return}
    if(!navigator.mediaDevices?.getUserMedia){debounceToast('A câmera requer HTTPS/localhost e um navegador compatível.',true);return}
    try{
      const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user',width:{ideal:640},height:{ideal:480},frameRate:{ideal:20,max:24}},audio:false});
      if(!state.voiceRoom){stream.getTracks().forEach(t=>t.stop());return}
      state.camera=stream;const track=stream.getVideoTracks()[0];track.onended=()=>stopCamera();
      await refreshMediaConnections('camera',track);
      await updatePresence();openMedia();
      if(!state.live)debounceToast('Prévia local: na demonstração, ninguém recebe sua câmera.');
    }catch(err){if(err.name!=='NotAllowedError')debounceToast('Não foi possível ligar a câmera: '+err.message,true);else debounceToast('Permissão de câmera não concedida.',true)}
  }
  async function stopCamera(){
    if(!state.camera)return;
    const old=state.camera;state.camera=null;
    await refreshMediaConnections('camera',null);
    old.getTracks().forEach(t=>{t.onended=null;t.stop()});
    await updatePresence();renderVoiceStage();
  }
  async function startScreen(){
    if(!state.voiceRoom){debounceToast('Entre em uma sala de voz antes de transmitir.',true);return}
    if(!navigator.mediaDevices?.getDisplayMedia){debounceToast('Compartilhamento de tela não disponível neste navegador.',true);return}
    try{
      const screen=await navigator.mediaDevices.getDisplayMedia({video:{frameRate:15},audio:false});
      state.screen=screen;const track=screen.getVideoTracks()[0];track.onended=()=>stopScreen();
      await refreshMediaConnections('screen',track);
      await updatePresence();openMedia();
      if(!state.live)debounceToast('Prévia local: seus amigos não recebem a tela na demonstração.');
    }catch(e){if(e.name!=='NotAllowedError')debounceToast('Não foi possível compartilhar a tela: '+e.message,true)}
  }
  async function stopScreen(){
    if(!state.screen)return;
    const old=state.screen;state.screen=null;
    await refreshMediaConnections('screen',null);
    old.getTracks().forEach(t=>{t.onended=null;t.stop()});await updatePresence();renderVoiceStage();
  }
  // Mantem os players montados. Recriar <video> em toda atualizacao do Presence
  // interrompia streams WebRTC e podia deixar tela preta no Safari/iPhone.
  function renderVoiceStage(){
    const stage=$('#voiceStage'),connected=!!state.voiceRoom;
    stage.classList.toggle('hidden',!connected);$('#voiceTray').classList.toggle('hidden',!connected);renderMediaView();if(!connected)return;
    $('#voiceTrayRoom').textContent=voiceName(state.voiceRoom);
    const me=state.user||state.profile,mePhoto=ownPhoto(myId());
    $('#voiceTrayAvatar').style.background=me.color||'#897df1';
    $('#voiceTrayAvatar').classList.toggle('has-photo',!!mePhoto);
    $('#voiceTrayAvatar').innerHTML=mePhoto?`<img alt="" src="${esc(mePhoto)}" />`:esc(initials(me.nickname));
    const people=state.live?state.presence.filter(p=>p.voiceRoom===state.voiceRoom):[];
    const participants=state.live?people:[{id:myId(),nickname:state.profile.nickname,color:state.profile.color,isMuted:state.muted,isCameraOn:!!state.camera}];
    const remoteScreens=[...state.remoteVideos.entries()].filter(([id,s])=>s.active&&state.peers.has(id));
    const remoteCameras=[...state.remoteCameras.entries()].filter(([id,s])=>s.active&&state.peers.has(id));
    const cameraTiles=(state.camera?`<div class="video-tile is-camera"><video id="myCameraPreview" autoplay muted playsinline></video><button type="button" class="video-retry hidden" data-video-retry>Toque para assistir</button><span class="video-tile-label">Sua câmera · ${state.live?'ao vivo':'prévia local'}</span></div>`:'')+
      remoteCameras.map(([id])=>`<div class="video-tile is-camera is-remote-camera"><video autoplay muted playsinline id="cam-${esc(id)}"></video><button type="button" class="video-retry hidden" data-video-retry>Toque para assistir</button><span class="video-health hidden" data-video-health></span><span class="video-tile-label">Câmera de ${esc(state.memberMap.get(id)?.nickname||'Amigo')}</span></div>`).join('');
    const screenTiles=(state.screen?`<div class="video-tile is-screen"><video id="myScreenPreview" autoplay muted playsinline></video><button type="button" class="video-retry hidden" data-video-retry>Toque para assistir</button><span class="video-tile-label">Sua tela · ${state.live?'transmitindo':'prévia local'}</span></div>`:'')+
      remoteScreens.map(([id])=>`<div class="video-tile is-screen"><video autoplay muted playsinline id="remote-${esc(id)}"></video><button type="button" class="video-retry hidden" data-video-retry>Toque para assistir</button><span class="video-health hidden" data-video-health></span><span class="video-tile-label">Tela de ${esc(state.memberMap.get(id)?.nickname||'Amigo')}</span></div>`).join('');
    const nextMarkup=`<div class="voice-stage-header"><div class="stage-icon">${icon('radio')}</div><div><h3>Você está na ${esc(voiceName(state.voiceRoom))}</h3><p>${state.live?'Áudio, câmera e tela em WebRTC · experimental':'Modo demonstração · prévia local de microfone, câmera e tela'}</p></div><span class="mode-pill ${state.live?'live':''}">${state.live?'AO VIVO':'DEMO'}</span></div>
      <div class="stage-participants">${participants.map(p=>`<div class="stage-person ${isTalking(p.id)?'is-speaking':''}" data-speaker-id="${esc(p.id)}">${avatar(p.nickname,p.color,'voice-participant-avatar',ownPhoto(p.id))}<span class="voice-person-name">${esc(p.nickname||'Você')}${p.id===myId()?' (você)':''}</span><span class="voice-person-status" title="${p.isMuted?'Microfone silenciado':'Microfone ativo'}">${icon(p.isMuted?'mic-off':'mic')}</span>${p.isCameraOn?`<span title="Câmera ligada" class="voice-person-status">${icon('video')}</span>`:''}</div>`).join('')||'<span style="color:#9e98b9">Conectando...</span>'}</div>
      <div class="stage-controls"><button id="muteVoice" class="${state.muted?'negative':''}">${icon(state.muted?'mic-off':'mic')}${state.muted?'Ativar mic':'Silenciar'}</button><button id="activateAudio">${icon('volume-2')}Ativar som</button><button id="reconnectVoice">${icon('radio')}Reconectar</button><button id="diagnoseVoice">${icon('activity')}Diagnóstico</button><button id="voiceSounds">${icon('volume-2')}Sons ${state.voiceSounds?'ligados':'desligados'}</button><button id="toggleCamera" class="${state.camera?'camera-on':''}">${icon(state.camera?'video-off':'video')}${state.camera?'Desligar câmera':'Ligar câmera'}</button><button id="shareScreen" ${!state.screen&&!navigator.mediaDevices?.getDisplayMedia?'disabled title="Neste navegador, você pode assistir à tela compartilhada pelos amigos"':''}>${icon(state.screen?'monitor-off':'monitor-up')}${state.screen?'Parar transmissão':'Compartilhar tela'}</button><button class="danger" id="leaveVoice">${icon('phone-off')}Sair da sala</button></div>
      <div class="video-grid">${cameraTiles}${screenTiles}</div>`;
    // Atualiza somente cabeçalho, pessoas e controles. A grade e os elementos
    // de vídeo continuam vivos, sem recriar srcObject a cada heartbeat.
    const candidate=document.createElement('div');
    candidate.innerHTML=nextMarkup;
    if(stage.dataset.room!==state.voiceRoom||!stage.querySelector('.video-grid')){
      stage.innerHTML=nextMarkup;
      stage.dataset.room=state.voiceRoom;
    }else{
      for(const selector of ['.voice-stage-header','.stage-participants','.stage-controls']){
        const prev=stage.querySelector(selector),next=candidate.querySelector(selector);
        if(prev&&next)prev.replaceWith(next);
      }
      const previousGrid=stage.querySelector('.video-grid');
      const incomingGrid=candidate.querySelector('.video-grid');
      const desired=new Set();
      for(const incomingTile of Array.from(incomingGrid.children)){
        const video=incomingTile.querySelector('video');
        if(!video?.id)continue;
        desired.add(video.id);
        const existing=Array.from(previousGrid.children).find(el=>el.querySelector('video')?.id===video.id);
        if(existing){
          // Mantém o player para não interromper a decodificação WebRTC.
          const label=existing.querySelector('.video-tile-label');
          const incomingLabel=incomingTile.querySelector('.video-tile-label');
          if(label&&incomingLabel)label.textContent=incomingLabel.textContent;
        }else previousGrid.appendChild(incomingTile);
      }
      for(const tile of Array.from(previousGrid.children)){
        if(!desired.has(tile.querySelector('video')?.id))tile.remove();
      }
    }
    $('#muteVoice').onclick=toggleMute;
    $('#activateAudio').onclick=activateRemoteAudio;
    $('#reconnectVoice').onclick=reconnectVoice;
    $('#diagnoseVoice').onclick=showVoiceDiagnostics;
    $('#voiceSounds').onclick=toggleVoiceSounds;
    $('#toggleCamera').onclick=()=>state.camera?stopCamera():startCamera();
    $('#shareScreen').onclick=()=>state.screen?stopScreen():startScreen();
    $('#leaveVoice').onclick=leaveVoice;
    const attach=(video,stream)=>{
      if(!video||!stream)return;
      // Fluxos de vídeo não devem reproduzir som: o áudio é controlado separadamente.
      video.muted=true;video.playsInline=true;video.setAttribute('playsinline','');
      if(video.srcObject!==stream)video.srcObject=stream;
      const retry=video.closest('.video-tile')?.querySelector('[data-video-retry]');
      // Tentar sem substituir o player, e oferecer um botão se o Safari bloquear.
      if(!video.paused&&!retry?.classList.contains('hidden'))retry.classList.add('hidden');
      if(video.paused)video.play().then(()=>{
        retry?.classList.add('hidden');
      }).catch(err=>{
        console.warn('etim: vídeo aguardando toque para reproduzir',err);
        retry?.classList.remove('hidden');
      });
    };
    attach($('#myCameraPreview'),state.camera);
    attach($('#myScreenPreview'),state.screen);
    for(const [id,info] of remoteScreens)attach(document.getElementById('remote-'+id),info.stream);
    for(const [id,info] of remoteCameras)attach(document.getElementById('cam-'+id),info.stream);
    for(const [kind,map] of [['cam',remoteCameras],['screen',remoteScreens]]){
      for(const [id] of map){
        const video=document.getElementById((kind==='cam'?'cam-':'remote-')+id);
        const note=video?.closest('.video-tile')?.querySelector('[data-video-health]');
        const status=state.videoHealth.get(kind+':'+id)?.status||'';
        if(note){note.textContent=status;note.classList.toggle('hidden',!status)}
      }
    }
  }
  function setupEvents(){
    $('#textChannels').addEventListener('click',e=>{const btn=e.target.closest('[data-text]');if(btn)switchChannel(btn.dataset.text)});
    $('#voiceChannels').addEventListener('click',e=>{const watch=e.target.closest('[data-watch]');if(watch){openMedia();return}const btn=e.target.closest('[data-voice]');if(btn)joinVoice(btn.dataset.voice)});
    $('#backToChat').onclick=backToChat;
    $('#voiceStage').addEventListener('click',e=>{
      const btn=e.target.closest('[data-video-retry]');
      if(!btn)return;
      const video=btn.closest('.video-tile')?.querySelector('video');
      if(!video)return;
      video.muted=true;
      video.play().then(()=>btn.classList.add('hidden'))
        .catch(()=>debounceToast('O navegador bloqueou o vídeo. Tente novamente.',true));
    });
    $('#messageForm').addEventListener('submit',sendMessage);
    $('#searchToggle').onclick=()=>{$('#searchDrawer').classList.toggle('hidden');if(!$('#searchDrawer').classList.contains('hidden'))$('#searchInput').focus();else{state.search='';renderMessages()}};
    $('#searchInput').oninput=e=>{state.search=e.target.value;renderMessages()};
    $('#closeSearch').onclick=()=>{state.search='';$('#searchInput').value='';$('#searchDrawer').classList.add('hidden');renderMessages()};
    $('#demoNotice').classList.remove('hidden');$('#connectBtn').onclick=showHowTo;$('#closeNotice').onclick=()=>{state.noticeClosed=true;$('#demoNotice').classList.add('hidden')};
    $('#inviteBtn').onclick=showInvite;$('#settingsBtn').onclick=showSettings;$('#railHelp').onclick=showAbout;
    $('#addSpaceBtn').onclick=()=>debounceToast('Nesta versão, cada grupo tem um espaço. ✦');
    $('#addChannel').onclick=()=>debounceToast('Os cinco canais já vêm configurados na versão 1.');
    $('#leaveVoiceSmall').onclick=leaveVoice;
    $('#attachBtn').onclick=()=>debounceToast('Envio de arquivos ficará para a próxima versão.');
    const emojis=['😎','😂','❤️','✨','🎮','👀','🔥','🚀','🎉','💜','😭','🤝','🥳','💀','🤖','🍕','🫶','😴','⭐','🙌','👏'];
    $('#emojiPicker').innerHTML=emojis.map(x=>`<button type="button" aria-label="Emoji ${x}">${x}</button>`).join('');
    $$('#emojiPicker button').forEach(b=>b.onclick=()=>{const inp=$('#messageInput');inp.value+=b.textContent;inp.focus();$('#emojiPicker').classList.add('hidden')});
    $('#emojiBtn').onclick=e=>{e.stopPropagation();$('#emojiPicker').classList.toggle('hidden')};
    document.addEventListener('click',e=>{if(!e.target.closest('#emojiPicker')&&!e.target.closest('#emojiBtn'))$('#emojiPicker').classList.add('hidden')});
    $('#chatMessages').addEventListener('click',e=>{if(e.target.closest('[data-react]'))debounceToast('♥ Reações compartilhadas vêm em uma próxima versão!')});
    $('#modalClose').onclick=closeModal;$('#modalOverlay').addEventListener('click',e=>{if(e.target.id==='modalOverlay'&&!$('#modalClose').classList.contains('hidden'))closeModal()});
    $('#mobileMenu').onclick=()=>toggleMobile('#sidebar');$('#memberToggle').onclick=()=>toggleMobile('#membersPanel');$('#closeMembers').onclick=closeMobile;$('#mobileScrim').onclick=closeMobile;
    window.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMobile();$('#emojiPicker').classList.add('hidden');if(!$('#modalClose').classList.contains('hidden'))closeModal()}});
    window.addEventListener('pagehide',()=>{
      // Em especial no iOS/Safari: avisar a sala mesmo se a pagina for fechada
      // sem clicar em Sair. O envio e best effort; Presence corrige o restante.
      if(state.voiceRoom){
        announceVoiceExit(state.voiceRoom,state.voiceSession);
        state.voiceRoom=null;state.voiceSession=null;
        clearInterval(state.voiceWatchdog);state.voiceWatchdog=null;
        for(const id of [...state.peers.keys()])closePeer(id);
        updatePresence();
      }
      state.microphone?.getTracks().forEach(t=>t.stop());
      state.screen?.getTracks().forEach(t=>t.stop());
      state.camera?.getTracks().forEach(t=>t.stop());
      state.microphone=null;state.screen=null;state.camera=null;
    });
    // Safari pode suspender a decodificação ao alternar entre aplicativos no celular.
    document.addEventListener('visibilitychange',()=>{
      if(!document.hidden&&state.voiceRoom){
        renderVoiceStage();
        for(const video of $('#voiceStage video')){
          if(video.srcObject&&video.paused)video.play().catch(()=>{});
        }
      }
    });
    window.addEventListener('pageshow',event=>{
      if(event.persisted&&state.live){
        updatePresence();renderAll();
      }
    });
  }
  loadIcons();setupEvents();setupEntry();
})();
