-- etim: execute integralmente no SQL Editor do projeto existente, antes do frontend.
-- Mantém club_members, join_club, chat_messages, Realtime privado e TURN existentes.
begin;

-- Falha de forma atômica se não for o esquema esperado do etim.
do $$ begin
  if to_regclass('public.club_members') is null or to_regclass('public.chat_messages') is null then
    raise exception 'O banco existente do etim (club_members/chat_messages) é obrigatório';
  end if;
end $$;

create table public.etim_channels (
  id text primary key check (id ~ '^[a-z0-9][a-z0-9_-]{0,63}$'),
  kind text not null check (kind in ('text','voice')),
  name text not null check (name = btrim(name) and char_length(name) between 2 and 40 and name !~ '[[:cntrl:]]'),
  description text not null default '' check (char_length(description) <= 180 and description !~ '[[:cntrl:]]'),
  protected boolean not null default false,
  archived_at timestamptz,
  sort_order integer not null default 100,
  updated_at timestamptz not null default now()
);
create unique index etim_channels_active_name on public.etim_channels(kind,lower(name)) where archived_at is null;
insert into public.etim_channels(id,kind,name,description,protected,sort_order) values
 ('geral','text','geral','Nosso cantinho de sempre',true,1),
 ('jogos','text','jogos','Partiu mais uma?',true,2),
 ('memes','text','memes-e-aleatoriedades','Zero contexto, 100% entretenimento',true,3),
 ('links','text','links-legais','Compartilha o que achou',true,4),
 ('ideias','text','ideias','E se a gente...',true,5),
 ('resenha','voice','resenha','',true,6),
 ('jogatina','voice','jogatina','',true,7),
 ('cantinho','voice','cantinho chill','',true,8);

-- Preserva também canais presentes no histórico que não estejam na lista padrão.
insert into public.etim_channels(id,kind,name,protected,sort_order)
 select distinct channel,'text',channel,true,50 from public.chat_messages
 where channel not in (select id from public.etim_channels);

create table public.etim_group_settings (
  id boolean primary key default true check (id),
  name text not null default 'etim' check (name = btrim(name) and char_length(name) between 2 and 40 and name !~ '[[:cntrl:]]'),
  description text not null default 'Para conversar, jogar e ficar de boa.' check (char_length(description) <= 180 and description !~ '[[:cntrl:]]'),
  updated_at timestamptz not null default now()
);
insert into public.etim_group_settings(id) values (true);

create table public.etim_room_jams (
  room_id text primary key references public.etim_channels(id),
  url text check (url is null or (char_length(url) <= 512 and url ~ '^https://(spotify\.link/[A-Za-z0-9_-]+|open\.spotify\.com/jam/[A-Za-z0-9_-]+)(\?si=[A-Za-z0-9_-]+)?$')),
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

-- Login anônimo do Supabase sozinho não concede acesso: join_club deve ter admitido o usuário.
create function public.etim_is_member() returns boolean
language sql stable security definer set search_path = '' as $$
 select auth.uid() is not null and exists(select 1 from public.club_members where user_id=auth.uid());
$$;
revoke all on function public.etim_is_member() from public, anon;
grant execute on function public.etim_is_member() to authenticated;

alter table public.etim_channels enable row level security;
alter table public.etim_group_settings enable row level security;
alter table public.etim_room_jams enable row level security;
create policy etim_channels_read on public.etim_channels for select to authenticated using (public.etim_is_member());
create policy etim_group_read on public.etim_group_settings for select to authenticated using (public.etim_is_member());
create policy etim_jams_read on public.etim_room_jams for select to authenticated using (public.etim_is_member());
revoke all on public.etim_channels,public.etim_group_settings,public.etim_room_jams from public,anon,authenticated;
grant select on public.etim_channels,public.etim_group_settings,public.etim_room_jams to authenticated;

-- Escritas exclusivamente pelas RPCs: não há promoção de cargo, remoção de membros
-- nem alteração de IDs/kind/protected pelo cliente, mesmo fora da interface.
create function public.etim_save_channel(channel_id text, channel_kind text, channel_name text, channel_description text)
returns void language plpgsql security definer set search_path = '' as $$
begin
 if not public.etim_is_member() then raise exception 'Acesso não autorizado' using errcode='42501'; end if;
 if channel_id is null then
   insert into public.etim_channels(id,kind,name,description)
   values ('c-'||gen_random_uuid()::text,channel_kind,btrim(channel_name),btrim(channel_description));
 else
   update public.etim_channels set name=btrim(channel_name),description=btrim(channel_description),updated_at=now()
   where id=channel_id and kind=channel_kind and archived_at is null;
   if not found then raise exception 'Canal indisponível'; end if;
 end if;
end $$;
create function public.etim_archive_channel(channel_id text)
returns void language plpgsql security definer set search_path = '' as $$
begin
 if not public.etim_is_member() then raise exception 'Acesso não autorizado' using errcode='42501'; end if;
 update public.etim_channels set archived_at=now(),updated_at=now() where id=channel_id and not protected and archived_at is null;
 if not found then raise exception 'Canal protegido ou indisponível'; end if;
 -- A exclusão é lógica: mensagens e identificadores são preservados para recuperação.
 update public.etim_room_jams set url=null,updated_by=auth.uid(),updated_at=now() where room_id=channel_id;
end $$;
create function public.etim_save_group(group_name text, group_description text)
returns void language plpgsql security definer set search_path = '' as $$
begin
 if not public.etim_is_member() then raise exception 'Acesso não autorizado' using errcode='42501'; end if;
 update public.etim_group_settings set name=btrim(group_name),description=btrim(group_description),updated_at=now() where id=true;
end $$;
create function public.etim_share_jam(voice_room text, jam_url text)
returns void language plpgsql security definer set search_path = '' as $$
begin
 if not public.etim_is_member() then raise exception 'Acesso não autorizado' using errcode='42501'; end if;
 -- Bloqueio compartilhado serializa com a exclusão da sala, sem confiar em Presence.
 perform 1 from public.etim_channels where id=voice_room and kind='voice' and archived_at is null for share;
 if not found then raise exception 'Sala de voz indisponível'; end if;
 insert into public.etim_room_jams(room_id,url,updated_by) values(voice_room,jam_url,auth.uid())
 on conflict(room_id) do update set url=excluded.url,updated_by=excluded.updated_by,updated_at=now();
end $$;
revoke all on function public.etim_save_channel(text,text,text,text),public.etim_archive_channel(text),public.etim_save_group(text,text),public.etim_share_jam(text,text) from public,anon;
grant execute on function public.etim_save_channel(text,text,text,text),public.etim_archive_channel(text),public.etim_save_group(text,text),public.etim_share_jam(text,text) to authenticated;

-- Substitui apenas CHECKs que restringem exclusivamente chat_messages.channel.
-- Regras de corpo/autoria/RLS existentes não são removidas.
do $$ declare c record; channel_att smallint; begin
 select attnum into channel_att from pg_attribute where attrelid='public.chat_messages'::regclass and attname='channel' and not attisdropped;
 for c in select conname from pg_constraint where conrelid='public.chat_messages'::regclass and contype='c' and conkey=array[channel_att] loop
   execute format('alter table public.chat_messages drop constraint %I',c.conname);
 end loop;
end $$;
create function public.etim_check_message_channel() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
 perform 1 from public.etim_channels where id=new.channel and kind='text' and archived_at is null for share;
 if not found then raise exception 'Canal de texto indisponível' using errcode='23514'; end if;
 return new;
end $$;
revoke all on function public.etim_check_message_channel() from public,anon,authenticated;
create trigger etim_message_channel before insert or update of channel on public.chat_messages for each row execute function public.etim_check_message_channel();

-- Eventos persistentes; refresh em reconexão cobre eventos perdidos.
do $$ declare t text; begin
 if exists(select 1 from pg_publication where pubname='supabase_realtime') then
   foreach t in array array['etim_channels','etim_group_settings','etim_room_jams'] loop
     if not exists(select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename=t) then
       execute format('alter publication supabase_realtime add table public.%I',t);
     end if;
   end loop;
 end if;
end $$;
commit;
