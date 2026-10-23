const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {createLab,poll}=require('./harness.cjs');
const {createDatabase,member,friend}=require('./database.cjs');

// Synthetic receiver events isolate DOM lifecycle from the local UDP policy.
// Elements, streams and peer objects are native; RTP is tested separately below.
async function addVideo(p,id,kind='cam',announced=true){
 await p.evaluate(async({id,kind,announced})=>{
   const s=audit.state;clearInterval(s.voiceWatchdog);s.voiceWatchdog=null;
   let person=s.presence.find(p=>p.id===id);
   if(!person){person={id,nickname:id,color:'#897df1',voiceRoom:s.voiceRoom,voiceSession:'session-'+id};s.presence.push(person);s.memberMap.set(id,{nickname:id})}
   person[kind==='cam'?'isCameraOn':'isStreaming']=announced;
   const peer=audit.ensurePeer(id);peer.mediaMids={camera:'1',screen:'2'};
   const stream=await navigator.mediaDevices.getDisplayMedia();
   peer.pc.ontrack({track:stream.getVideoTracks()[0],transceiver:{mid:kind==='cam'?'1':'2'}});audit.openMedia();
 },{id,kind,announced});
}
test('negotiated inactive video slots never render players',async t=>{
 const lab=await createLab(t);await lab.join('a');await lab.join('b');await lab.negotiated();
 for(const p of lab.pages.values())assert.equal(await p.locator('.video-tile').count(),0);
 assert.deepEqual(lab.errors,[]);
});
test('presence off removes frozen frames without mute; mute/unmute/ended and sessions reconcile',async t=>{
 const lab=await createLab(t,['a']);await lab.join('a');const p=lab.pages.get('a');
 await addVideo(p,'b','cam',false);await addVideo(p,'b','screen',false);assert.equal(await p.locator('.video-tile').count(),0);
 await p.evaluate(()=>{const b=audit.state.presence.find(p=>p.id==='b');b.isCameraOn=true;b.isStreaming=true;audit.renderVoiceStage()});
 await p.locator('#cam-b').waitFor({state:'visible'});await p.locator('#remote-b').waitFor({state:'visible'});
 await p.evaluate(()=>{window.oldVideo=document.querySelector('#cam-b');window.savedPeer=audit.state.peers.get('b');audit.state.presence.find(p=>p.id==='b').isCameraOn=false;audit.renderVoiceStage()});
 assert.equal(await p.locator('#cam-b').count(),0);assert.equal(await p.evaluate(()=>oldVideo.srcObject),null);assert.equal(await p.locator('#remote-b').count(),1);
 await p.evaluate(()=>{audit.state.presence.find(p=>p.id==='b').isCameraOn=true;audit.renderVoiceStage()});await p.locator('#cam-b').waitFor({state:'visible'});
 await p.evaluate(()=>audit.state.remoteCameras.get('b').track.onmute());assert.equal(await p.locator('#cam-b').count(),0);
 await p.evaluate(()=>audit.state.remoteCameras.get('b').track.onunmute());await p.locator('#cam-b').waitFor({state:'visible'});
 await p.evaluate(()=>{audit.state.remoteCameras.get('b').track.onended();audit.state.presence.find(p=>p.id==='b').isStreaming=false;audit.renderVoiceStage()});assert.equal(await p.locator('.video-tile').count(),0);
 assert.equal(await p.evaluate(()=>savedPeer===audit.state.peers.get('b')),true);
 await p.evaluate(()=>{const b=audit.state.presence.find(p=>p.id==='b');b.isCameraOn=true;b.voiceSession='new-session';audit.state.remoteCameras.get('b').track.onunmute()});assert.equal(await p.locator('.video-tile').count(),0);
 assert.deepEqual(lab.errors,[]);
});
test('focus/grid preserve proportional players on desktop/mobile; no frames stays hidden',async t=>{
 const lab=await createLab(t,['a']);await lab.join('a');const p=lab.pages.get('a');
 for(const id of ['b','c','d','e'])await addVideo(p,id);await addVideo(p,'b','screen');
 await p.waitForFunction(()=>document.querySelectorAll('.video-tile:not(.awaiting-frame)').length===5);
 for(const width of [1440,390]){
   await p.setViewportSize({width,height:900});await p.locator('[data-focus-video="cam-b"]').click();
   const measured=await p.evaluate(()=>{const big=document.querySelector('.is-focused video'),small=document.querySelector('#cam-c');window.savedVideo=big;return {big:big.getBoundingClientRect().width,small:small.getBoundingClientRect().width,fit:getComputedStyle(big).objectFit,overflow:document.documentElement.scrollWidth>innerWidth}});
   assert.ok(measured.big>measured.small);assert.equal(measured.fit,'contain');assert.equal(measured.overflow,false);
   await p.evaluate(()=>audit.renderVoiceStage());assert.equal(await p.evaluate(()=>savedVideo===document.querySelector('#cam-b')),true);
   await p.locator('[data-focus-video="remote-b"]').click();assert.equal(await p.locator('.is-focused #remote-b').count(),1);
   const dir=path.join(__dirname,'results');fs.mkdirSync(dir,{recursive:true});await p.screenshot({path:path.join(dir,`call-focus-${width}.png`),animations:"disabled"});
   await p.locator('#returnGrid').click();assert.equal(await p.locator('.is-focused').count(),0);
 }
 await p.locator('[data-focus-video="cam-b"]').click();await p.evaluate(()=>{audit.state.presence.find(p=>p.id==='b').isCameraOn=false;audit.renderVoiceStage()});assert.equal(await p.locator('.is-focused').count(),0);
 await p.evaluate(()=>{const s=audit.state;s.presence.push({id:'z',nickname:'z',voiceRoom:s.voiceRoom,voiceSession:'z',isCameraOn:true});const peer=audit.ensurePeer('z');peer.mediaMids={camera:'1',screen:'2'};const pc=new RTCPeerConnection();const track=pc.addTransceiver('video').receiver.track;peer.pc.ontrack({track,transceiver:{mid:'1'}});s.remoteCameras.get('z').active=true;Object.defineProperty(track,'muted',{value:false});audit.renderVoiceStage();window.emptyPc=pc});
 assert.equal(await p.locator('#cam-z').isVisible(),false);await p.evaluate(()=>emptyPc.close());assert.deepEqual(lab.errors,[]);
});
test('duration survives media/chat/rerenders and clears its single timer on leave',async t=>{
 const lab=await createLab(t,['a']);const p=lab.pages.get('a');await lab.join('a');
 await p.evaluate(()=>{window.timer=audit.state.callTimer;window.started=audit.state.callStartedAt;audit.state.callStartedAt-=1432000;audit.openMedia()});
 assert.match(await p.locator('[data-call-duration]').first().textContent(),/Conectado há 00:23:5/);
 await p.evaluate(()=>audit.startCamera());await p.evaluate(()=>audit.stopCamera());await p.evaluate(()=>audit.startScreen());await p.evaluate(()=>audit.stopScreen());
 await p.evaluate(()=>{for(let i=0;i<20;i++)audit.renderVoiceStage();audit.backToChat()});assert.equal(await p.evaluate(()=>timer===audit.state.callTimer),true);
 await p.setViewportSize({width:390,height:844});assert.equal(await p.locator('#chatVoiceBanner [data-call-duration]').isVisible(),true);
 const before=await p.locator('#chatVoiceBanner [data-call-duration]').textContent();await p.waitForFunction(old=>document.querySelector('#chatVoiceBanner [data-call-duration]').textContent!==old,before);
 assert.equal(await p.evaluate(()=>audit.formatCallDuration(0,3661000)),'01:01:01');await lab.leave('a');
 assert.deepEqual(await p.evaluate(()=>[audit.state.callTimer,audit.state.callStartedAt,audit.state.speechTimer]),[null,null,null]);assert.equal(await p.locator('#voiceStage video').count(),0);
 await lab.join('a');assert.ok(await p.evaluate(()=>audit.state.callStartedAt>started));assert.deepEqual(lab.errors,[]);
});
test('native RTP repeated camera/screen cycles keep audio and peer connection',{timeout:60000},async t=>{
 const lab=await createLab(t);if(!await lab.requireTransport())return;await lab.join('a');await lab.join('b');await lab.connected();const a=lab.pages.get('a'),b=lab.pages.get('b');
 await a.evaluate(()=>window.originalPeer=audit.state.peers.get('b'));
 for(let i=0;i<3;i++){
   await b.evaluate(()=>audit.startCamera());await a.locator('#cam-b').waitFor({state:'visible'});await b.evaluate(()=>audit.startScreen());await a.locator('#remote-b').waitFor({state:'visible'});
   await b.evaluate(()=>audit.stopCamera());await a.locator('#cam-b').waitFor({state:'detached'});assert.equal(await a.locator('#remote-b').isVisible(),true);
   await b.evaluate(()=>audit.stopScreen());await a.locator('#remote-b').waitFor({state:'detached'});assert.equal(await a.evaluate(()=>originalPeer===audit.state.peers.get('b')),true);
 }
 const packets=async()=>{const s=await lab.snapshot('a');return s.peers[0].stats.filter(r=>r.type==='inbound-rtp'&&r.kind==='audio').reduce((n,r)=>n+(r.packets||0),0)};
 const before=await packets(),after=await poll(packets,n=>n>before+10);assert.ok(after>before+10);assert.deepEqual(lab.errors,[]);
});
async function attachDatabase(lab,t){
 const {db,as}=await createDatabase();t.after(()=>db.close());
 for(const [id,p] of lab.pages){const uid=id==='a'?member:friend;
   await p.exposeBinding('sharedQuery',async(_,query)=>{try{
     if(query.operation){
       const signatures={etim_save_channel:['channel_id','channel_kind','channel_name','channel_description'],etim_archive_channel:['channel_id'],etim_save_group:['group_name','group_description'],etim_share_jam:['voice_room','jam_url']};
       const names=signatures[query.operation];if(!names)throw Error('Unknown RPC');
       await as(uid,`select ${query.operation}(${names.map((_,i)=>'$'+(i+1)).join(',')})`,names.map(n=>query.args[n]));
       setTimeout(()=>{for(const page of lab.pages.values())page.evaluate(()=>audit.fetchSharedSettings()).catch(()=>{})},10);return {data:null};
     }
     if(!['etim_channels','etim_group_settings','etim_room_jams','chat_messages'].includes(query.table))throw Error('Unexpected table');
     const {rows}=await as(uid,`select * from ${query.table}`),data=rows.filter(r=>query.filters.every(([k,v])=>r[k]===v));return {data:query.single?data[0]:data};
   }catch(error){return {error:{message:error.message,code:error.code}}}});
   await p.evaluate(()=>{const s=audit.state;s.sb.from=table=>{const q={table,filters:[],single:false};const chain={select:()=>chain,order:()=>chain,limit:()=>chain,eq:(k,v)=>{q.filters.push([k,v]);return chain},single:()=>{q.single=true;return chain},then:(resolve,reject)=>sharedQuery(q).then(resolve,reject)};return chain};s.sb.rpc=(operation,args)=>sharedQuery({operation,args});return audit.fetchSharedSettings()});
 }return {db,as};
}
test('admin and Jam persist and sync across two SQL-backed clients, including errors and deletion',{timeout:45000},async t=>{
 const lab=await createLab(t);const {db}=await attachDatabase(lab,t);const a=lab.pages.get('a'),b=lab.pages.get('b');
 await a.locator('[data-edit-channel="geral"]').click();assert.equal(await a.locator('#deleteChannel').count(),0);
 await a.locator('#channelName').fill('conversa');await a.locator('#channelDescription').fill('Nossa descrição');await a.locator('#channelEditor button').click();
 await b.waitForFunction(()=>document.querySelector('[data-text="geral"]').textContent.includes('conversa'));
 await a.locator('#workspaceSettings').click();await a.locator('#groupName').fill('Amigos');await a.locator('#groupEditor button').click();await b.waitForFunction(()=>document.querySelector('#groupDisplayName').textContent==='Amigos');assert.equal(await b.title(),'etim — seu lugar, sua galera');
 await a.locator('#addChannel').click();await a.locator('#channelName').fill('cinema');await a.locator('#channelEditor button').click();await b.waitForFunction(()=>[...document.querySelectorAll('[data-text]')].some(b=>b.textContent.includes('cinema')));
 const id=(await db.query("select id from etim_channels where name='cinema'")).rows[0].id;await b.locator(`[data-text="${id}"]`).click();
 await a.locator(`[data-edit-channel="${id}"]`).click();await a.locator('#deleteChannel').click();await a.locator('#cancelDelete').click();assert.equal((await db.query('select archived_at from etim_channels where id=$1',[id])).rows[0].archived_at,null);
 await a.locator('#deleteChannel').click();await a.locator('#confirmDelete').click();await b.waitForFunction(()=>audit.state.activeChannel==='geral');
 await a.locator('#addVoiceChannel').click();await a.locator('#channelName').fill('música');await a.locator('#channelEditor button').click();await b.waitForFunction(()=>[...document.querySelectorAll('[data-voice]')].some(b=>b.textContent.includes('música')));
 await lab.join('a');await lab.join('b');await a.evaluate(()=>audit.openMedia());await b.evaluate(()=>audit.openMedia());
 await a.locator('#listenTogether').click();await a.locator('#jamUrl').fill('https://evil.test/invite');await a.locator('#jamForm button').click();assert.equal((await db.query('select * from etim_room_jams')).rows.length,0);
 await a.locator('#jamUrl').fill('https://spotify.link/abc123');await a.locator('#jamForm button').click();await b.waitForFunction(()=>document.querySelector('#listenTogether').textContent.includes('Jam compartilhada'));
 await b.locator('#listenTogether').click();const link=b.locator('#jamSharedStatus a');assert.equal(await link.getAttribute('href'),'https://spotify.link/abc123');assert.equal(await link.getAttribute('rel'),'noopener noreferrer');
 const popupPromise=b.waitForEvent('popup');await link.click();const popup=await popupPromise;await popup.close();
 await b.locator('#removeJam').click();await a.waitForFunction(()=>document.querySelector('#jamSharedStatus').textContent.includes('Nenhuma Jam'));
 await db.exec("update etim_group_settings set name='Persistido' where id=true");await a.evaluate(()=>audit.fetchSharedSettings());assert.equal(await a.locator('#groupDisplayName').textContent(),'Persistido');
 await a.locator('#modalClose').click();await a.evaluate(()=>{audit.state.sb.rpc=async()=>({error:{message:'offline'}});audit.showGroupEditor()});await a.locator('#groupName').fill('Não salvo');await a.locator('#groupEditor button').click();
 assert.equal(await a.locator('#groupName').inputValue(),'Não salvo');assert.equal(await a.locator('#groupEditor button').isEnabled(),true);assert.equal((await db.query('select name from etim_group_settings')).rows[0].name,'Persistido');assert.deepEqual(lab.errors,[]);
});
test('Jam frontend URL allowlist rejects malicious URLs and non-invites',async t=>{
 const lab=await createLab(t,['a']);const p=lab.pages.get('a');const result=await p.evaluate(()=>({good:['https://spotify.link/abc','https://open.spotify.com/jam/abc?si=123'].map(audit.validateJamUrl),bad:['javascript:alert(1)','http://spotify.link/abc','https://spotify.link.evil.test/a','https://spotify.link@evil.test/a','https://spotify.link:443/a','https://open.spotify.com/track/a','https://spotify.link/a?url=https://evil.test','https://spotify.link/a#b','https://spotify.link/a/../b'].map(audit.validateJamUrl)}));assert.ok(result.good.every(Boolean));assert.ok(result.bad.every(x=>x===null));
});

test('mobile channel editor, keyboard dialog focus and markup escaping',async t=>{
 const lab=await createLab(t,['a']);const p=lab.pages.get('a');await attachDatabase(lab,t);
 await p.setViewportSize({width:390,height:844});await p.locator('#mobileMenu').click();
 await p.locator('[data-edit-channel="geral"]').click();
 await p.locator('#channelName').fill('<img src=x onerror=alert(1)>');await p.locator('#channelEditor button').click();
 await p.waitForFunction(()=>document.querySelector('#modalOverlay').classList.contains('hidden'));
 assert.equal(await p.locator('[data-text="geral"] img').count(),0);
 await p.locator('[data-edit-channel="geral"]').click();await p.keyboard.press('Escape');
 assert.equal(await p.locator('#modalOverlay').isVisible(),false);
 await p.locator('#mobileMenu').click();await p.locator('#workspaceSettings').click();
 await p.locator('#modalClose').focus();await p.keyboard.press('Shift+Tab');
 assert.equal(await p.evaluate(()=>document.activeElement===document.querySelector('#groupEditor button')),true);
 assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 assert.deepEqual(lab.errors,[]);
});

test('autoplay denial offers retry without displaying a blank video',async t=>{
 const lab=await createLab(t,['a']);await lab.join('a');const p=lab.pages.get('a');
 await p.evaluate(()=>{window.originalSource=Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype,'srcObject');Object.defineProperty(HTMLMediaElement.prototype,'srcObject',{...originalSource,set(value){this.autoplay=false;originalSource.set.call(this,value)}});window.originalPlay=HTMLVideoElement.prototype.play;HTMLVideoElement.prototype.play=function(){return Promise.reject(new DOMException('Test autoplay block','NotAllowedError'))}});
 await addVideo(p,'b');await p.locator('.video-retry').waitFor({state:'visible'});
 assert.equal(await p.locator('#cam-b').isVisible(),false);
 await p.evaluate(()=>{HTMLVideoElement.prototype.play=originalPlay;Object.defineProperty(HTMLMediaElement.prototype,'srcObject',originalSource)});await p.locator('.video-retry').click();await p.locator('#cam-b').waitFor({state:'visible'});
 assert.deepEqual(lab.errors,[]);
});
