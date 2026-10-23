const test = require('node:test');
const assert = require('node:assert/strict');
const {createLab,poll}=require('./harness.cjs');

function received(snapshot,peer,kind) {
  return snapshot.peers.find(p=>p.id===peer)?.stats.filter(s=>s.type==='inbound-rtp'&&s.kind===kind)||[];
}
function packets(rows){return rows.reduce((n,s)=>n+(s.packets||0),0)}

for(const order of [['a','b'],['b','a']])test(`two-way audio join ${order.join('-')}`,{timeout:30000},async t=>{
  const lab=await createLab(t);
  if(!await lab.requireTransport())return;
  for(const id of order)await lab.join(id);
  await lab.connected();
  const snapshots=await poll(async()=>[await lab.snapshot('a'),await lab.snapshot('b')],
    ([a,b])=>packets(received(a,'b','audio'))>10&&packets(received(b,'a','audio'))>10);
  const [a,b]=snapshots;
  assert.ok(packets(received(a,'b','audio'))>10&&packets(received(b,'a','audio'))>10,
    `bidirectional audio required; a receives ${packets(received(a,'b','audio'))}, b receives ${packets(received(b,'a','audio'))}`);
  assert.deepEqual(lab.errors,[]);
});

test('answerer binds exactly three sendrecv transceivers',{timeout:25000},async t=>{
  const lab=await createLab(t);await lab.join('a');await lab.join('b');await lab.negotiated();
  for(const id of ['b','a']){
    const p=(await lab.snapshot(id)).peers[0];
    assert.equal(p.transceivers.length,3,`${id}: extra orphan transceivers`);
    assert.ok(p.transceivers.every(t=>t.mid!==null&&t.current==='sendrecv'),JSON.stringify(p.transceivers));
  }
});

test('camera started by answerer delivers decoded frames',{timeout:30000},async t=>{
  const lab=await createLab(t);if(!await lab.requireTransport())return;
  await lab.join('a');await lab.join('b');await lab.connected();
  await lab.pages.get('b').evaluate(()=>audit.startCamera());
  const a=await poll(()=>lab.snapshot('a'),s=>received(s,'b','video').some(r=>r.frames>5));
  assert.ok(received(a,'b','video').some(r=>r.frames>5),'answerer camera must produce remote decoded frames');
});

test('offerer camera and screen have distinct correctly mapped receivers',{timeout:30000},async t=>{
  const lab=await createLab(t);if(!await lab.requireTransport())return;
  await lab.join('a');await lab.join('b');await lab.connected();
  await lab.pages.get('a').evaluate(()=>audit.startCamera());
  await lab.pages.get('a').evaluate(()=>audit.startScreen());
  const b=await poll(()=>lab.snapshot('b'),s=>received(s,'a','video').filter(r=>r.frames>5).length===2);
  assert.equal(received(b,'a','video').filter(r=>r.frames>5).length,2,'both native RTP streams must decode');
  assert.equal(b.remoteScreens.filter(x=>x.active).length,1,'screen must not overwrite camera slot');
  assert.equal(b.remoteCameras.filter(x=>x.active).length,1);
  assert.notEqual(b.remoteScreens[0].mid,b.remoteCameras[0].mid);
});

test('three participants receive audio from both other participants',{timeout:35000},async t=>{
  const lab=await createLab(t,['a','b','c']);
  if(!await lab.requireTransport())return;
  for(const id of ['b','c','a'])await lab.join(id);
  await lab.connected();
  const snapshots=await poll(async()=>Promise.all(['a','b','c'].map(id=>lab.snapshot(id))),
    rows=>rows.every(s=>s.peers.length===2&&s.peers.every(p=>p.stats.some(r=>r.type==='inbound-rtp'&&r.kind==='audio'&&r.packets>10))));
  for(let i=0;i<snapshots.length;i++)assert.equal(snapshots[i].peers.filter(p=>p.stats.some(r=>r.type==='inbound-rtp'&&r.kind==='audio'&&r.packets>10)).length,2,`${['a','b','c'][i]} must hear two peers`);
});

test('normal leave stops local media and removes remote peer',{timeout:25000},async t=>{
  const lab=await createLab(t);await lab.join('a');await lab.join('b');await lab.negotiated();
  await lab.pages.get('b').evaluate(()=>{window.savedMic=audit.state.microphone.getAudioTracks()[0]});
  await lab.leave('b');
  assert.equal((await lab.snapshot('a')).peers.length,0);
  assert.equal((await lab.snapshot('b')).room,null);
  assert.equal(await lab.pages.get('b').evaluate(()=>savedMic.readyState),'ended');
  assert.deepEqual(lab.errors,[]);
});

test('leave and rejoin establishes a new session and negotiated peer',{timeout:30000},async t=>{
  const lab=await createLab(t);await lab.join('a');await lab.join('b');await lab.negotiated();
  const old=(await lab.snapshot('b')).session;
  await lab.leave('b');await lab.join('b');await lab.negotiated();
  assert.notEqual((await lab.snapshot('b')).session,old);
  assert.equal((await lab.snapshot('a')).peers.length,1);
  assert.deepEqual(lab.errors,[]);
});

test('screen permission resolving after leave must stop capture',{timeout:15000},async t=>{
  const lab=await createLab(t,['a']);await lab.join('a');const p=lab.pages.get('a');
  await p.evaluate(()=>{
    const native=navigator.mediaDevices.getDisplayMedia;
    navigator.mediaDevices.getDisplayMedia=async()=>{const stream=await native();window.delayedScreen=stream;await new Promise(r=>window.releaseScreen=r);return stream};
    window.screenTask=audit.startScreen();
  });
  await p.waitForFunction(()=>!!window.releaseScreen);await lab.leave('a');
  await p.evaluate(async()=>{releaseScreen();await screenTask});
  assert.equal(await p.evaluate(()=>delayedScreen.getVideoTracks()[0].readyState),'ended','capture must not survive leaving');
  assert.equal((await lab.snapshot('a')).screen,undefined);
});

test('camera permission from old room must not publish in new room',{timeout:15000},async t=>{
  const lab=await createLab(t,['a']);await lab.join('a');const p=lab.pages.get('a');
  await p.evaluate(()=>{
    const native=navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
    navigator.mediaDevices.getUserMedia=async constraints=>{const stream=await native(constraints);if(constraints.video){window.delayedCamera=stream;await new Promise(r=>window.releaseCamera=r)}return stream};
    window.cameraTask=audit.startCamera();
  });
  await p.waitForFunction(()=>!!window.releaseCamera);await lab.leave('a');await lab.join('a','jogatina');
  await p.evaluate(async()=>{releaseCamera();await cameraTask});
  assert.equal(await p.evaluate(()=>delayedCamera.getVideoTracks()[0].readyState),'ended','old request must be cancelled');
  assert.equal((await lab.snapshot('a')).camera,undefined);
});

test('queued signal must be revalidated after room session changes',{timeout:15000},async t=>{
  const lab=await createLab(t,['b']);await lab.join('b');const p=lab.pages.get('b');
  await p.evaluate(async()=>{
    const s=audit.state;
    const blocker=new Promise(r=>window.releaseSignal=r);s.signalTasks.set('a',blocker);
    const remote=new RTCPeerConnection();remote.addTransceiver('audio');
    await remote.setLocalDescription(await remote.createOffer());
    audit.queueSignal({to:'b',from:'a',room:s.voiceRoom,toSession:s.voiceSession,session:'old-remote',kind:'offer',connectionId:'old-call',description:remote.localDescription.toJSON()});
    window.pendingSignal=s.signalTasks.get('a');remote.close();
  });
  await lab.leave('b');await lab.join('b','jogatina');
  const result=await p.evaluate(async()=>{releaseSignal();await pendingSignal;return {created:audit.state.peers.has('a')}});
  assert.equal(result.created,false,'old queued offer must not create a peer in a new session');
});

test('presence must not create peer connections before TURN resolves',{timeout:20000},async t=>{
  const lab=await createLab(t);await lab.join('a');const p=lab.pages.get('b');
  await p.evaluate(()=>{
    audit.state.sb.functions.invoke=()=>new Promise(r=>window.resolveTurn=r);
    window.joinTask=audit.joinVoice('resenha');
  });
  await p.waitForFunction(()=>!!window.resolveTurn);
  const count=await p.evaluate(()=>auditRtcConfigs.length);
  await p.evaluate(async()=>{resolveTurn({data:{iceServers:[{urls:'turn:turn.invalid:3478',username:'fixture',credential:'fixture'}],ttl:3600}});await joinTask});
  assert.equal(count,0,'presence sync created a STUN-only PC while TURN loading');
});

test('lost renegotiation answer must not permanently wedge connected peer',{timeout:30000},async t=>{
  const lab=await createLab(t);if(!await lab.requireTransport())return;
  await lab.join('a');await lab.join('b');await lab.connected();
  lab.drop(message=>message.payload.kind==='answer');
  await lab.pages.get('a').evaluate(()=>audit.startCamera());
  await lab.pages.get('a').waitForFunction(()=>[...audit.state.peers.values()][0].pc.signalingState==='have-local-offer');
  lab.drop(()=>false);
  // The production watchdog runs every five seconds. Wait beyond its 12s retry threshold.
  await lab.pages.get('a').waitForTimeout(15500);
  assert.equal((await lab.snapshot('a')).peers[0].signaling,'stable','connected ICE is not proof of completed signaling');
});

for(const order of [['a','b'],['b','a']])test(`SDP must be bidirectional regardless of join order ${order.join('-')}`,{timeout:20000},async t=>{
  const lab=await createLab(t);for(const id of order)await lab.join(id);await lab.negotiated();
  const a=await lab.snapshot('a'),b=await lab.snapshot('b');
  assert.equal(a.peers[0].transceivers[0].current,'sendrecv','offerer audio became sendonly');
  assert.equal(b.peers[0].transceivers.find(t=>t.mid==='0').current,'sendrecv');
});

test('ontrack must retain both offered video MIDs before media begins',{timeout:20000},async t=>{
  const lab=await createLab(t);await lab.join('a');await lab.join('b');await lab.negotiated();
  const b=await lab.snapshot('b');
  assert.equal(b.remoteScreens.length,1,'offered screen receiver not classified as screen');
  assert.equal(b.remoteCameras.length,1);
  assert.notEqual(b.remoteScreens[0].mid,b.remoteCameras[0].mid);
});

test('control binding answerer to offered transceivers negotiates sendrecv',{timeout:15000},async t=>{
  const lab=await createLab(t,['control']);
  const result=await lab.pages.get('control').evaluate(async()=>{
    const caller=new RTCPeerConnection(),callee=new RTCPeerConnection();
    const mic=await navigator.mediaDevices.getUserMedia({audio:true});
    try{
      const audio=caller.addTransceiver('audio',{direction:'sendrecv'});
      caller.addTransceiver('video',{direction:'sendrecv'});caller.addTransceiver('video',{direction:'sendrecv'});
      await audio.sender.replaceTrack(mic.getAudioTracks()[0]);
      await caller.setLocalDescription(await caller.createOffer());
      await callee.setRemoteDescription(caller.localDescription);
      // Proposed design experiment, independent of production implementation.
      for(const transceiver of callee.getTransceivers())transceiver.direction='sendrecv';
      await callee.getTransceivers()[0].sender.replaceTrack(mic.getAudioTracks()[0]);
      await callee.setLocalDescription(await callee.createAnswer());
      await caller.setRemoteDescription(callee.localDescription);
      return [caller,callee].map(pc=>pc.getTransceivers().map(t=>({mid:t.mid,current:t.currentDirection})));
    }finally{caller.close();callee.close();mic.getTracks().forEach(t=>t.stop())}
  });
  for(const side of result){assert.equal(side.length,3);assert.ok(side.every(t=>t.mid!==null&&t.current==='sendrecv'))}
});

test('three participant SDP mesh must negotiate two-way audio on all pairs',{timeout:20000},async t=>{
  const lab=await createLab(t,['a','b','c']);
  for(const id of ['b','c','a'])await lab.join(id);await lab.negotiated();
  for(const id of ['a','b','c']){
    const s=await lab.snapshot(id);assert.equal(s.peers.length,2);
    assert.ok(s.peers.every(p=>p.transceivers.find(t=>t.mid==='0')?.current==='sendrecv'),`${id}: mesh contains one-way audio`);
  }
});

test('camera activated during call must bind to negotiated sender',{timeout:20000},async t=>{
  const lab=await createLab(t);await lab.join('a');await lab.join('b');await lab.negotiated();
  await Promise.all([...lab.pages.values()].map(p=>p.evaluate(()=>audit.startCamera())));
  await lab.negotiated();
  for(const id of ['a','b']){
    const camera=(await lab.snapshot(id)).peers[0].transceivers.find(t=>t.role==='camera');
    assert.ok(camera.senderTrack,'camera capture must exist');
    assert.ok(camera.mid!==null&&camera.current==='sendrecv',`${id}: live camera attached to unnegotiated sender`);
  }
});

test('muting while microphone repair awaits permission must keep new track disabled',{timeout:15000},async t=>{
  const lab=await createLab(t,['a']);await lab.join('a');const p=lab.pages.get('a');
  await p.evaluate(()=>{
    const native=navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
    navigator.mediaDevices.getUserMedia=async c=>{const next=await native(c);await new Promise(r=>window.releaseMic=r);return next};
    window.micRepair=audit.repairMicrophone();
  });
  await p.waitForFunction(()=>!!window.releaseMic);
  await p.evaluate(()=>audit.toggleMute());
  await p.evaluate(async()=>{releaseMic();await micRepair});
  const result=await p.evaluate(()=>({muted:audit.state.muted,enabled:audit.state.microphone.getAudioTracks()[0].enabled}));
  assert.equal(result.muted,true);assert.equal(result.enabled,false,'UI says muted but replacement microphone is enabled');
});

test('lost initial answer is retried without changing peer generation',{timeout:15000},async t=>{
  const lab=await createLab(t);let dropped=false;
  lab.drop(message=>{if(message.payload.kind==='answer'&&!dropped){dropped=true;return true}return false});
  await lab.join('a');await lab.join('b');await lab.negotiated();
  const offers=lab.signals.filter(x=>x.kind==='offer');
  assert.ok(dropped);assert.ok(offers.length>=2,'same offer should be retransmitted');
  assert.equal(new Set(offers.map(x=>x.connectionId)).size,1,'retry must not recreate the connection');
  assert.equal((await lab.snapshot('b')).peers[0].transceivers.length,3);
  assert.deepEqual(lab.errors,[]);
});

test('peer recovery replaces both generations without orphan transceivers',{timeout:20000},async t=>{
  const lab=await createLab(t);await lab.join('a');await lab.join('b');await lab.negotiated();
  const before=(await lab.snapshot('a')).peers[0].callId;
  await lab.pages.get('a').evaluate(()=>{audit.state.peers.get('b').lastAttempt=0;audit.recoverPeer('b','test recovery')});
  await lab.negotiated();
  assert.notEqual((await lab.snapshot('a')).peers[0].callId,before);
  for(const id of ['a','b']){
    const p=(await lab.snapshot(id)).peers[0];assert.equal(p.transceivers.length,3);
    assert.ok(p.transceivers.every(t=>t.current==='sendrecv'));
  }
  assert.deepEqual(lab.errors,[]);
});

test('concurrent room switches preserve the latest requested room',{timeout:15000},async t=>{
  const lab=await createLab(t,['a']);await lab.join('a');
  await lab.pages.get('a').evaluate(async()=>{
    await Promise.all([audit.joinVoice('jogatina'),audit.joinVoice('cantinho')]);
  });
  assert.equal((await lab.snapshot('a')).room,'cantinho');
  assert.deepEqual(lab.errors,[]);
});

test('diagnostics handles an answerer waiting for its first offer',{timeout:15000},async t=>{
  const lab=await createLab(t,['b']);await lab.join('b');
  const report=await lab.pages.get('b').evaluate(async()=>{audit.ensurePeer('a');return audit.readVoiceStatistics()});
  assert.equal(report.peers.length,1);assert.equal(report.peers[0].senderTrack,'nenhuma');
  assert.deepEqual(lab.errors,[]);
});

test('stopping camera while permission is pending cancels its capture',{timeout:15000},async t=>{
  const lab=await createLab(t,['a']);await lab.join('a');const p=lab.pages.get('a');
  await p.evaluate(()=>{
    const native=navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
    navigator.mediaDevices.getUserMedia=async c=>{const stream=await native(c);window.pendingCamera=stream;await new Promise(r=>window.resolveCamera=r);return stream};
    window.cameraStart=audit.startCamera();
  });
  await p.waitForFunction(()=>!!window.resolveCamera);
  await p.evaluate(async()=>{await audit.stopCamera();resolveCamera();await cameraStart});
  assert.equal(await p.evaluate(()=>pendingCamera.getVideoTracks()[0].readyState),'ended');
  assert.equal((await lab.snapshot('a')).camera,undefined);
});
