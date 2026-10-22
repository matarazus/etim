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
  function renderChannels(){
    $('#textChannels').innerHTML=channels.map(ch=>`<button class="channel-button ${ch.id===state.activeChannel?'active':''}" data-text="${ch.id}" aria-current="${ch.id===state.activeChannel?'page':'false'}">${icon(ch.icon)}<span>${esc(ch.name)}</span></button>`).join('');
    $('#voiceChannels').innerHTML=voiceChannels.map(ch=>{
      const users=state.live?state.presence.filter(p=>p.voiceRoom===ch.id):state.voiceRoom===ch.id?[{id:myId(),nickname:state.profile.nickname,color:state.profile.color,isMuted:state.muted}]:[];
      return `<div><button class="channel-button ${state.voiceRoom===ch.id?'voice-active':''}" data-voice="${ch.id}" title="Entrar na sala ${esc(ch.name)}">${icon(ch.icon)}<span>${esc(ch.name)}</span>${users.length?`<small style="margin-left:auto;color:#7ad6ac">${users.length}</small>`:''}</button>${users.map(p=>`<div class="voice-person">${avatar(p.nickname,p.color,'voice-mini',ownPhoto(p.id))}<span>${esc(p.nickname)}${p.isMuted?' (mudo)':''}</span></div>`).join('')}</div>`;
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
  function refreshPresence(){
    if(!state.channel)return;
    const previous=state.presence;
    state.presence=Object.values(state.channel.presenceState()).flat().filter(p=>p&&p.id);
    const dedup=new Map();state.presence.forEach(p=>dedup.set(p.id,p));state.presence=[...dedup.values()];
    if(state.voiceRoom){
      const oldIds=new Set(previous.filter(p=>p.id!==myId()&&p.voiceRoom===state.voiceRoom).map(p=>p.id));
      const newIds=new Set(state.presence.filter(p=>p.id!==myId()&&p.voiceRoom===state.voiceRoom).map(p=>p.id));
      if([...newIds].some(id=>!oldIds.has(id)))voiceCue('join');
      else if([...oldIds].some(id=>!newIds.has(id)))voiceCue('leave');
    }
    renderChannels();renderMembers();renderVoiceStage();
    const knownIds=new Set(state.members.map(m=>m.user_id));if(state.presence.some(p=>!knownIds.has(p.id)))fetchMembers();
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
      syncPeers();
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
    if(state.voiceRoom===room){renderVoiceStage();closeMobile();return}
    if(state.voiceRoom)await leaveVoice(true);
    // Criar/retomar o AudioContext no clique ajuda o Safari a reproduzir os sons e a voz.
    voiceCue('join');
    state.voiceRoom=room;state.voiceSession=newVoiceId();state.muted=true;
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
    if(state.voiceRoom!==room){stream.getTracks().forEach(t=>t.stop());return}
    state.microphone=stream;
    await updatePresence();
    renderChannels();renderVoiceStage();
    if(state.live){await loadTurnServers();if(state.voiceRoom===room){syncPeers();beginVoiceWatch()}}
    else debounceToast('Prévia local: ninguém recebe sua voz na demo.');
  }
  async function leaveVoice(silent=false){
    if(!state.voiceRoom)return;
    if(silent!==true)voiceCue('leave');
    clearInterval(state.voiceWatchdog);state.voiceWatchdog=null;
    // Publica saída antes de destruir a conexão, para que os outros vejam a mudança.
    state.voiceRoom=null;state.voiceSession=null;
    for(const id of [...state.peers.keys()])closePeer(id);
    state.earlyIce.clear();state.signalTasks.clear();
    const mic=state.microphone;state.microphone=null;
    if(mic)mic.getTracks().forEach(t=>t.stop());
    await stopScreen();await stopCamera();
    state.muted=false;
    await updatePresence();renderChannels();renderVoiceStage();
  }
  function closePeer(id){
    const peer=state.peers.get(id);
    if(peer){
      peer.pc.onicecandidate=null;peer.pc.ontrack=null;
      peer.pc.onconnectionstatechange=null;peer.pc.oniceconnectionstatechange=null;
      if(peer.audio){peer.audio.pause();peer.audio.srcObject=null;peer.audio.remove()}
      peer.pc.close();state.peers.delete(id);
    }
    state.remoteVideos.delete(id);state.remoteCameras.delete(id);
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
      lastAttempt:Date.now(),attempts:0,warned:false,responded:false,ready:null
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
        audio.srcObject=new MediaStream([track]);audio.muted=false;audio.volume=1;
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
        const info={stream:new MediaStream([track]),active:!track.muted};
        (isScreen?state.remoteVideos:state.remoteCameras).set(id,info);
        track.onunmute=()=>{info.active=true;renderVoiceStage()};
        track.onmute=()=>{info.active=false;renderVoiceStage()};
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
  async function offerPeer(peer){
    if(!peer||state.peers.get(peer.id)!==peer||myId()>=peer.id)return;
    if(peer.offering||peer.offerSent||peer.pc.signalingState!=='stable')return;
    peer.offering=true;
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
    if(p.kind==='hello'){
      if(myId()>=p.from)return; // Só o lado eleito como iniciador oferece.
      let peer=ensurePeer(p.from);
      if(p.reset&&Date.now()-peer.lastAttempt>3500){
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
      if(peer&&peer.callId!==p.connectionId){closePeer(p.from);peer=null}
      if(!peer)peer=ensurePeer(p.from);
      if(peer.responded&&peer.callId===p.connectionId)return;
      peer.callId=p.connectionId;
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
    }
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
  async function toggleMute(){
    if(!state.voiceRoom)return;
    state.muted=!state.muted;state.microphone?.getAudioTracks().forEach(t=>t.enabled=!state.muted);await updatePresence();renderVoiceStage();
  }
  async function startCamera(){
    if(!state.voiceRoom){debounceToast('Entre em uma sala de voz antes de ligar a câmera.',true);return}
    if(!navigator.mediaDevices?.getUserMedia){debounceToast('A câmera requer HTTPS/localhost e um navegador compatível.',true);return}
    try{
      const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user',width:{ideal:640},height:{ideal:480},frameRate:{ideal:20,max:24}},audio:false});
      if(!state.voiceRoom){stream.getTracks().forEach(t=>t.stop());return}
      state.camera=stream;const track=stream.getVideoTracks()[0];track.onended=()=>stopCamera();
      for(const p of state.peers.values())await p.cameraSender.replaceTrack(track);
      await updatePresence();renderVoiceStage();
      if(!state.live)debounceToast('Prévia local: na demonstração, ninguém recebe sua câmera.');
    }catch(err){if(err.name!=='NotAllowedError')debounceToast('Não foi possível ligar a câmera: '+err.message,true);else debounceToast('Permissão de câmera não concedida.',true)}
  }
  async function stopCamera(){
    if(!state.camera)return;
    const old=state.camera;state.camera=null;
    for(const p of state.peers.values())try{await p.cameraSender.replaceTrack(null)}catch(err){console.warn(err)}
    old.getTracks().forEach(t=>{t.onended=null;t.stop()});
    await updatePresence();renderVoiceStage();
  }
  async function startScreen(){
    if(!state.voiceRoom){debounceToast('Entre em uma sala de voz antes de transmitir.',true);return}
    if(!navigator.mediaDevices?.getDisplayMedia){debounceToast('Compartilhamento de tela não disponível neste navegador.',true);return}
    try{
      const screen=await navigator.mediaDevices.getDisplayMedia({video:{frameRate:15},audio:false});
      state.screen=screen;const track=screen.getVideoTracks()[0];track.onended=()=>stopScreen();
      for(const p of state.peers.values())await p.screenSender.replaceTrack(track);
      await updatePresence();renderVoiceStage();
      if(!state.live)debounceToast('Prévia local: seus amigos não recebem a tela na demonstração.');
    }catch(e){if(e.name!=='NotAllowedError')debounceToast('Não foi possível compartilhar a tela: '+e.message,true)}
  }
  async function stopScreen(){
    if(!state.screen)return;
    const old=state.screen;state.screen=null;
    for(const p of state.peers.values())try{await p.screenSender.replaceTrack(null)}catch(e){console.warn(e)}
    old.getTracks().forEach(t=>{t.onended=null;t.stop()});await updatePresence();renderVoiceStage();
  }
  function renderVoiceStage(){
    const stage=$('#voiceStage'),connected=!!state.voiceRoom;
    stage.classList.toggle('hidden',!connected);$('#voiceTray').classList.toggle('hidden',!connected);if(!connected)return;
    $('#voiceTrayRoom').textContent=voiceName(state.voiceRoom);
    const me=state.user||state.profile,mePhoto=ownPhoto(myId());
    $('#voiceTrayAvatar').style.background=me.color||'#897df1';
    $('#voiceTrayAvatar').classList.toggle('has-photo',!!mePhoto);
    $('#voiceTrayAvatar').innerHTML=mePhoto?`<img alt="" src="${esc(mePhoto)}" />`:esc(initials(me.nickname));
    const people=state.live?state.presence.filter(p=>p.voiceRoom===state.voiceRoom):[];
    const participants=state.live?people:[{id:myId(),nickname:state.profile.nickname,color:state.profile.color,isMuted:state.muted,isCameraOn:!!state.camera}];
    const remoteScreens=[...state.remoteVideos.entries()].filter(([id,s])=>s.active&&state.peers.has(id));
    const remoteCameras=[...state.remoteCameras.entries()].filter(([id,s])=>s.active&&state.peers.has(id));
    const cameraTiles=(state.camera?`<div class="video-tile is-camera"><video id="myCameraPreview" autoplay muted playsinline></video><span class="video-tile-label">Sua câmera · ${state.live?'ao vivo':'prévia local'}</span></div>`:'')+
      remoteCameras.map(([id])=>`<div class="video-tile is-camera is-remote-camera"><video autoplay playsinline id="cam-${esc(id)}"></video><span class="video-tile-label">Câmera de ${esc(state.memberMap.get(id)?.nickname||'Amigo')}</span></div>`).join('');
    const screenTiles=(state.screen?`<div class="video-tile is-screen"><video id="myScreenPreview" autoplay muted playsinline></video><span class="video-tile-label">Sua tela · ${state.live?'transmitindo':'prévia local'}</span></div>`:'')+
      remoteScreens.map(([id])=>`<div class="video-tile is-screen"><video autoplay playsinline id="remote-${esc(id)}"></video><span class="video-tile-label">Tela de ${esc(state.memberMap.get(id)?.nickname||'Amigo')}</span></div>`).join('');
    stage.innerHTML=`<div class="voice-stage-header"><div class="stage-icon">${icon('radio')}</div><div><h3>Você está na ${esc(voiceName(state.voiceRoom))}</h3><p>${state.live?'Áudio, câmera e tela em WebRTC · experimental':'Modo demonstração · prévia local de microfone, câmera e tela'}</p></div><span class="mode-pill ${state.live?'live':''}">${state.live?'AO VIVO':'DEMO'}</span></div>
      <div class="stage-participants">${participants.map(p=>`<div class="stage-person">${avatar(p.nickname,p.color,'voice-participant-avatar',ownPhoto(p.id))}<span class="voice-person-name">${esc(p.nickname||'Você')}${p.id===myId()?' (você)':''}</span><span class="voice-person-status" title="${p.isMuted?'Microfone silenciado':'Microfone ativo'}">${icon(p.isMuted?'mic-off':'mic')}</span>${p.isCameraOn?`<span title="Câmera ligada" class="voice-person-status">${icon('video')}</span>`:''}</div>`).join('')||'<span style="color:#9e98b9">Conectando...</span>'}</div>
      <div class="stage-controls"><button id="muteVoice" class="${state.muted?'negative':''}">${icon(state.muted?'mic-off':'mic')}${state.muted?'Ativar mic':'Silenciar'}</button><button id="activateAudio">${icon('volume-2')}Ativar som</button><button id="reconnectVoice">${icon('radio')}Reconectar</button><button id="voiceSounds">${icon('volume-2')}Sons ${state.voiceSounds?'ligados':'desligados'}</button><button id="toggleCamera" class="${state.camera?'camera-on':''}">${icon(state.camera?'video-off':'video')}${state.camera?'Desligar câmera':'Ligar câmera'}</button><button id="shareScreen">${icon(state.screen?'monitor-off':'monitor-up')}${state.screen?'Parar transmissão':'Compartilhar tela'}</button><button class="danger" id="leaveVoice">${icon('phone-off')}Sair da sala</button></div>
      ${(cameraTiles||screenTiles)?`<div class="video-grid">${cameraTiles}${screenTiles}</div>`:''}`;
    $('#muteVoice').onclick=toggleMute;
    $('#activateAudio').onclick=activateRemoteAudio;
    $('#reconnectVoice').onclick=reconnectVoice;
    $('#voiceSounds').onclick=toggleVoiceSounds;
    $('#toggleCamera').onclick=()=>state.camera?stopCamera():startCamera();
    $('#shareScreen').onclick=()=>state.screen?stopScreen():startScreen();
    $('#leaveVoice').onclick=leaveVoice;
    if(state.camera){const video=$('#myCameraPreview');if(video){video.srcObject=state.camera;video.play().catch(()=>{})}}
    if(state.screen){const video=$('#myScreenPreview');if(video){video.srcObject=state.screen;video.play().catch(()=>{})}}
    for(const [id,info] of remoteScreens){const v=document.getElementById('remote-'+id);if(v){v.srcObject=info.stream;v.play().catch(()=>{})}}
    for(const [id,info] of remoteCameras){const v=document.getElementById('cam-'+id);if(v){v.srcObject=info.stream;v.play().catch(()=>{})}}
  }
  function setupEvents(){
    $('#textChannels').addEventListener('click',e=>{const btn=e.target.closest('[data-text]');if(btn)switchChannel(btn.dataset.text)});
    $('#voiceChannels').addEventListener('click',e=>{const btn=e.target.closest('[data-voice]');if(btn)joinVoice(btn.dataset.voice)});
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
    window.addEventListener('pagehide',()=>{state.microphone?.getTracks().forEach(t=>t.stop());state.screen?.getTracks().forEach(t=>t.stop());state.camera?.getTracks().forEach(t=>t.stop())});
  }
  loadIcons();setupEvents();setupEntry();
})();
