const {PGlite}=require('@electric-sql/pglite');
const fs=require('node:fs');
const path=require('node:path');
const member='00000000-0000-4000-8000-000000000001';
const friend='00000000-0000-4000-8000-000000000002';
const stranger='00000000-0000-4000-8000-000000000003';
async function createDatabase(){
 const db=new PGlite();
 await db.exec(`
 create role anon; create role authenticated;
 create schema auth; create table auth.users(id uuid primary key);
 create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
 grant usage on schema auth to authenticated,anon;
 grant execute on function auth.uid() to authenticated,anon;
 create table public.club_members(user_id uuid primary key references auth.users(id),nickname text,color text,joined_at timestamptz default now());
 create table public.chat_messages(id serial primary key,user_id uuid,channel text not null check(channel in ('geral','jogos','memes','links','ideias')),body text check(char_length(body)<=2000),created_at timestamptz default now());
 insert into auth.users values('${member}'),('${friend}'),('${stranger}');
 insert into club_members(user_id,nickname) values('${member}','Ana'),('${friend}','Bia');
 insert into chat_messages(user_id,channel,body) values('${member}','geral','Mensagem existente');
 alter table club_members enable row level security;
 create policy members_read on club_members for select to authenticated using(true);
 grant select on club_members to authenticated;
 grant select,insert on chat_messages to authenticated;
 grant usage on sequence chat_messages_id_seq to authenticated;
 `);
 await db.exec(fs.readFileSync(path.resolve(__dirname,'../../supabase/migrations/20261023170000_group_channels_jam.sql'),'utf8'));
 const as=async(id,sql,params=[],role='authenticated')=>db.transaction(async tx=>{
   await tx.exec(`set local role ${role}`);
   await tx.query("select set_config('request.jwt.claim.sub',$1,true)",[id||'']);
   return tx.query(sql,params);
 });
 return {db,as};
}
module.exports={createDatabase,member,friend,stranger};
