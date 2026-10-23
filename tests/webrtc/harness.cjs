const { chromium } = require('playwright');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '../..');

// Test-only observability. The production file is served unchanged except for
// exposing its closure immediately before normal initialization; no RTC logic
// is replaced. Supabase transport/auth are fixtures, native Chromium RTC is real.
const hook = `window.audit = { state, joinVoice, leaveVoice, startCamera, stopCamera,
  startScreen, stopScreen, toggleMute, ensurePeer, offerPeer, queueSignal,
  handleSignal, handleVoicePresenceEvent, syncPeers, refreshPresence, readVoiceStatistics, recoverPeer,
  repairMicrophone, requestMediaRenegotiation, renderVoiceStage, openMedia,
  snapshot: async () => ({room:state.voiceRoom, session:state.voiceSession,
    camera:state.camera?.getVideoTracks().map(t=>({id:t.id,ready:t.readyState})),
    screen:state.screen?.getVideoTracks().map(t=>({id:t.id,ready:t.readyState})),
    remoteCameras:[...state.remoteCameras].map(([id,x])=>({id,mid:x.mid,active:x.active,track:x.track.id})),
    remoteScreens:[...state.remoteVideos].map(([id,x])=>({id,mid:x.mid,active:x.active,track:x.track.id})),
    peers:await Promise.all([...state.peers].map(async([id,p])=>({id,
      callId:p.callId,connection:p.pc.connectionState,signaling:p.pc.signalingState,
      transceivers:p.pc.getTransceivers().map(t=>({mid:t.mid,kind:t.receiver.track.kind,
        direction:t.direction,current:t.currentDirection,senderTrack:t.sender.track?.id,
        senderReady:t.sender.track?.readyState,receiverTrack:t.receiver.track.id,
        role:t.sender===p.audioSender?'audio':t.sender===p.cameraSender?'camera':t.sender===p.screenSender?'screen':'unbound'})),
      stats:[...(await p.pc.getStats()).values()].filter(s=>['inbound-rtp','outbound-rtp'].includes(s.type)).map(s=>({
        type:s.type,kind:s.kind,mid:s.mid,packets:s.packetsSent??s.packetsReceived,
        bytes:s.bytesSent??s.bytesReceived,frames:s.framesEncoded??s.framesDecoded,
        totalAudioEnergy:s.totalAudioEnergy})),
      answerDirections:(p.pc.remoteDescription?.sdp||'').split('\\r\\n').filter(s=>/^a=(sendrecv|sendonly|recvonly|inactive)$/.test(s))
    })))}) };`;

async function createLab(t, ids = ['a', 'b']) {
  const marker = '  loadIcons();setupEvents();setupEntry();';
  const source = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
  assert.equal(source.split(marker).length, 2, 'test hook must have one insertion site');
  const server = http.createServer((req, res) => {
    const file = new URL(req.url, 'http://localhost').pathname;
    const names = { '/':'index.html', '/index.html':'index.html', '/app.js':'app.js', '/styles.css':'styles.css', '/favicon.svg':'favicon.svg' };
    if(file === '/config.js') {res.setHeader('Content-Type','application/javascript');res.end('window.ETIM_CONFIG = {};');return;}
    if(!names[file]) {res.writeHead(404);res.end();return;}
    const name = names[file];
    res.setHeader('Content-Type', name.endsWith('.js')?'application/javascript':name.endsWith('.css')?'text/css':name.endsWith('.svg')?'image/svg+xml':'text/html');
    res.end(name==='app.js'?source.replace(marker,hook+'\n'+marker):fs.readFileSync(path.join(root,name)));
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const executablePath=process.env.CHROMIUM_PATH || (fs.existsSync(chromium.executablePath())?undefined:'/usr/bin/chromium');
  const browser = await chromium.launch({
    executablePath,
    headless:true,
    args:['--no-sandbox','--use-fake-device-for-media-stream','--use-fake-ui-for-media-stream','--autoplay-policy=no-user-gesture-required']
  });
  const pages = new Map(), records = new Map(), signals = [], errors = [], warnings = [];
  let drop = () => false;
  const broadcastPresence = async () => {
    const snapshot = Object.fromEntries([...records].map(([id,p])=>[id,[p]]));
    await Promise.all([...pages.values()].map(p=>p.evaluate(snapshot=>{
      window.auditPresence=snapshot; audit.refreshPresence(); audit.syncPeers();
    },snapshot)));
  };
  t.after(async()=>{
    const dir = path.join(__dirname,'results');fs.mkdirSync(dir,{recursive:true});
    const snapshots={};
    for(const [id,p] of pages)try{snapshots[id]=await p.evaluate(()=>audit.snapshot());}catch{}
    fs.writeFileSync(path.join(dir,t.name.replace(/[^a-z0-9-]/gi,'_')+'.json'),JSON.stringify({
      name:t.name,head:require('node:child_process').execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim(),
      browser:browser.version(),createdAt:new Date().toISOString(),snapshots,signals,errors,warnings
    },null,2));
    await browser.close(); await new Promise(resolve=>server.close(resolve));
  });
  for(const id of ids) {
    const context=await browser.newContext({permissions:['microphone','camera']});
    const page=await context.newPage();
    page.on('pageerror',e=>errors.push({id,message:e.message}));
    page.on('console',m=>{if(m.type()==='warning'||m.type()==='error')warnings.push({id,message:m.text()})});
    // Hermetic tests: never hit production, TURN, public STUN, SDK or fonts.
    await page.route('**/*',route=>new URL(route.request().url()).hostname==='127.0.0.1'?route.continue():route.abort());
    await page.addInitScript(()=>{
      const NativeRTC=window.RTCPeerConnection;
      window.auditRtcConfigs=[];
      window.RTCPeerConnection=class extends NativeRTC {
        constructor(config){window.auditRtcConfigs.push(structuredClone(config));super({...config,iceServers:[]});}
      };
      navigator.mediaDevices.getDisplayMedia=async()=>{
        const canvas=document.createElement('canvas');canvas.width=640;canvas.height=360;
        const ctx=canvas.getContext('2d');let frame=0;
        const draw=()=>{ctx.fillStyle='#d32f2f';ctx.fillRect(0,0,640,360);ctx.fillStyle='white';ctx.font='40px sans-serif';ctx.fillText('SCREEN '+frame++,40,100)};
        draw();const timer=setInterval(draw,50);const stream=canvas.captureStream(20);
        stream.getVideoTracks()[0].addEventListener('ended',()=>clearInterval(timer));return stream;
      };
    });
    await page.exposeBinding('auditTrack',async(_,record)=>{records.set(id,record);await broadcastPresence();return 'ok'});
    await page.exposeBinding('auditSend',async(_,message)=>{
      const payload=message.payload;
      signals.push({event:message.event,kind:payload.kind,from:payload.from,to:payload.to,
        connectionId:payload.connectionId,session:payload.session,toSession:payload.toSession,
        directions:payload.description?.sdp.split('\r\n').filter(s=>/^a=(sendrecv|sendonly|recvonly|inactive)$/.test(s))});
      if(drop(message))return 'ok'; // Server ack is not recipient delivery.
      const recipients=message.event==='signal'?[pages.get(payload.to)]:[...pages].filter(([other])=>other!==id).map(([,p])=>p);
      await Promise.all(recipients.filter(Boolean).map(p=>p.evaluate(({event,payload})=>{
        if(event==='signal')audit.queueSignal(payload);
        // Exit is followed by Presence track; model explicit leave as well.
        else if(event==='voice-presence')audit.handleVoicePresenceEvent(payload);
      },message)));
      return 'ok';
    });
    await page.goto(`http://127.0.0.1:${server.address().port}`);
    await page.evaluate(({id,ids})=>{
      const s=audit.state;
      s.live=true;s.user={id,nickname:id,color:'#897df1'};
      s.members=ids.map(id=>({user_id:id,nickname:id,color:'#897df1'}));
      s.memberMap=new Map(s.members.map(m=>[m.user_id,m]));
      s.channel={track:window.auditTrack,send:window.auditSend,presenceState:()=>window.auditPresence||{}};
      s.sb={functions:{invoke:async()=>({error:new Error('TURN intentionally disabled in local RTC tests')})}};
      document.querySelector('#entryGate').classList.add('hidden');
      document.querySelector('#app').classList.remove('hidden');
    },{id,ids});
    pages.set(id,page);
  }
  return {pages,errors,signals,records,broadcastPresence,drop:fn=>{drop=fn},
    requireTransport:async()=>{
      const available=await [...pages.values()][0].evaluate(async()=>{
        const pc=new RTCPeerConnection({iceServers:[]});pc.addTransceiver('audio');
        const gathering=new Promise(resolve=>{
          const timer=setTimeout(()=>resolve(false),2000);
          pc.onicecandidate=e=>{if(e.candidate){clearTimeout(timer);resolve(true)}else{clearTimeout(timer);resolve(false)}};
        });
        await pc.setLocalDescription(await pc.createOffer());
        const ok=await gathering;pc.close();return ok;
      });
      if(!available){
        const reason='ENVIRONMENT: no host ICE candidates; installed Chromium disables non-proxied UDP. RTP was NOT validated.';
        if(process.env.REQUIRE_WEBRTC_MEDIA==='1')throw new Error(reason);
        t.skip(reason);
      }
      return available;
    },
    join:async(id,room='resenha')=>pages.get(id).evaluate(room=>audit.joinVoice(room),room),
    leave:async id=>pages.get(id).evaluate(()=>audit.leaveVoice(true)),
    snapshot:async id=>pages.get(id).evaluate(()=>audit.snapshot()),
    negotiated:async()=>{for(const p of pages.values())await p.waitForFunction(()=>[...audit.state.peers.values()].length>0&&[...audit.state.peers.values()].every(p=>p.pc.remoteDescription&&p.pc.signalingState==='stable'),null,{timeout:10000})},
    connected:async()=>{for(const p of pages.values())await p.waitForFunction(()=>[...audit.state.peers.values()].length>0&&[...audit.state.peers.values()].every(p=>p.pc.connectionState==='connected'),null,{timeout:15000})}
  };
}

async function poll(fn, predicate, timeout=5000) {
  const deadline=Date.now()+timeout;let value;
  do {value=await fn();if(predicate(value))return value;await new Promise(r=>setTimeout(r,100))}while(Date.now()<deadline);
  return value;
}
module.exports={createLab,poll};
