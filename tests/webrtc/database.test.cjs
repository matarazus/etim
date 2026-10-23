const test=require('node:test');
const assert=require('node:assert/strict');
const {createDatabase,member,friend,stranger}=require('./database.cjs');
test('SQL migration enforces membership, validation, protection and preserves messages',async t=>{
 const {db,as}=await createDatabase();t.after(()=>db.close());
 assert.equal((await db.query('select body from chat_messages')).rows[0].body,'Mensagem existente');
 assert.equal((await as(member,'select * from etim_channels')).rows.length,8);
 for(const table of ['etim_channels','etim_group_settings','etim_room_jams']){
   assert.equal((await as(stranger,`select * from ${table}`)).rows.length,0);
   await assert.rejects(as(null,`select * from ${table}`,[],'anon'),/permission denied/);
 }
 for(const call of ["etim_save_channel(null,'text','novo','')","etim_save_group('Teste','')","etim_archive_channel('geral')","etim_share_jam('resenha','https://spotify.link/abc')"]){
   await assert.rejects(as(stranger,'select '+call),/não autorizado/);
   await assert.rejects(as(null,'select '+call,[],'anon'),/permission denied/);
 }
 await assert.rejects(as(member,"update etim_channels set protected=false where id='geral'"),/permission denied/);
 await assert.rejects(as(member,"delete from etim_channels where id='geral'"),/permission denied/);
 await assert.rejects(as(member,"select etim_archive_channel('geral')"),/protegido/);
 await as(member,"select etim_save_channel('geral','text','conversa','Nova descrição')");
 assert.equal((await as(friend,"select name from etim_channels where id='geral'")).rows[0].name,'conversa');
 assert.equal((await db.query('select channel from chat_messages')).rows[0].channel,'geral');
 await as(friend,"select etim_save_channel(null,'text','novo','Descrição')");
 const channel=(await as(member,"select id from etim_channels where name='novo'")).rows[0].id;
 await assert.rejects(as(member,"select etim_save_channel(null,'text','NOVO','')"),/duplicate/);
 await assert.rejects(as(member,"select etim_save_channel(null,'text','x','')"),/check constraint/);
 await assert.rejects(as(member,"select etim_save_channel(null,'admin','nome','')"),/check constraint/);
 await as(member,'insert into chat_messages(user_id,channel,body) values($1,$2,$3)',[member,channel,'preservar']);
 await assert.rejects(as(member,'insert into chat_messages(channel,body) values($1,$2)',[channel,'x'.repeat(2001)]),/check constraint/);
 await assert.rejects(as(member,"insert into chat_messages(channel,body) values('resenha','x')"),/indisponível/);
 await as(friend,'select etim_archive_channel($1)',[channel]);
 assert.equal((await db.query('select body from chat_messages where channel=$1',[channel])).rows[0].body,'preservar');
 await assert.rejects(as(member,'insert into chat_messages(channel,body) values($1,$2)',[channel,'bloqueada']),/indisponível/);
 await as(friend,"select etim_save_group('Nossa galera','Um lugar nosso')");
 assert.equal((await as(member,'select name from etim_group_settings')).rows[0].name,'Nossa galera');
});
test('SQL Jam URL allowlist and all-member update/removal',async t=>{
 const {db,as}=await createDatabase();t.after(()=>db.close());
 const allowed=['https://spotify.link/abc123','https://open.spotify.com/jam/abc_123-456?si=abc-123'];
 const denied=['javascript:alert(1)','http://spotify.link/a','https://spotify.link.evil.test/a','https://spotify.link@evil.test/a','https://evil.test','https://open.spotify.com/track/abc','https://spotify.link/a?redirect=https://evil.test','https://spotify.link/a#x','https://spotify.link:443/a','https://spotify.link/a\nb','https://spotify.link/a/../b'];
 for(const url of allowed){await as(member,'select etim_share_jam($1,$2)',['resenha',url]);assert.equal((await as(friend,"select url from etim_room_jams where room_id='resenha'")).rows[0].url,url)}
 for(const url of denied)await assert.rejects(as(friend,'select etim_share_jam($1,$2)',['resenha',url]),/check constraint/);
 await assert.rejects(as(member,"select etim_share_jam('geral','https://spotify.link/a')"),/indisponível/);
 await as(friend,"select etim_share_jam('resenha',null)");
 assert.equal((await as(member,"select url from etim_room_jams where room_id='resenha'")).rows[0].url,null);
 await as(friend,"select etim_save_channel(null,'voice','Sala nova','')");
 const id=(await as(member,"select id from etim_channels where name='Sala nova'")).rows[0].id;
 await as(member,'select etim_share_jam($1,$2)',[id,allowed[0]]);
 await as(friend,'select etim_archive_channel($1)',[id]);
 assert.equal((await as(member,'select url from etim_room_jams where room_id=$1',[id])).rows[0].url,null);
 await assert.rejects(as(member,'select etim_share_jam($1,$2)',[id,allowed[0]]),/indisponível/);
});
