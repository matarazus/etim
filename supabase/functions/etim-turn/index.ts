// etim — Supabase Edge Function: credenciais temporarias TURN da Cloudflare.
// Chaves privadas ficam em Edge Functions > Secrets, nunca no GitHub.
import { withSupabase } from 'npm:@supabase/server@^1';

const TTL_SECONDS = 86400; // 24 horas

export default {
  fetch: withSupabase({ auth: 'user' }, async (req, ctx) => {
    if (req.method !== 'POST') {
      return Response.json({ error: 'Metodo nao permitido' }, { status: 405 });
    }
    const userId = ctx.userClaims?.id;
    if (!userId) return Response.json({ error: 'Sessao invalida' }, { status: 401 });

    // Exige que a pessoa tenha entrado no etim com a senha do grupo.
    const { data: member, error: membershipError } = await ctx.supabase
      .from('club_members')
      .select('user_id')
      .eq('user_id', userId)
      .maybeSingle();
    if (membershipError) {
      console.error('Verificacao de membro falhou:', membershipError.message);
      return Response.json({ error: 'Erro ao validar o acesso' }, { status: 500 });
    }
    if (!member) return Response.json({ error: 'Nao autorizado para o etim' }, { status: 403 });

    const keyId = Deno.env.get('CLOUDFLARE_TURN_KEY_ID');
    const apiToken = Deno.env.get('CLOUDFLARE_TURN_API_TOKEN');
    if (!keyId || !apiToken) {
      console.error('TURN: secrets nao cadastrados');
      return Response.json({ error: 'TURN nao configurado' }, { status: 503 });
    }

    try {
      const upstream = await fetch(
        'https://rtc.live.cloudflare.com/v1/turn/keys/' + encodeURIComponent(keyId) + '/credentials/generate-ice-servers',
        {
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + apiToken,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ttl: TTL_SECONDS }),
          signal: AbortSignal.timeout(10000),
        },
      );
      if (!upstream.ok) {
        console.error('Cloudflare TURN respondeu:', upstream.status);
        return Response.json({ error: 'Falha ao obter credenciais TURN' }, { status: 502 });
      }
      const body = await upstream.json();
      const servers = body?.iceServers;
      if (!Array.isArray(servers) || !servers.length ||
          !servers.some((s: { urls?: string | string[]; credential?: string }) => !!s.credential)) {
        console.error('Resposta inesperada do Cloudflare TURN');
        return Response.json({ error: 'Resposta TURN invalida' }, { status: 502 });
      }
      return Response.json(
        { iceServers: servers, ttl: TTL_SECONDS },
        { headers: { 'Cache-Control': 'no-store' } },
      );
    } catch (error) {
      console.error('Falha na obtencao TURN:', error instanceof Error ? error.message : error);
      return Response.json({ error: 'TURN temporariamente indisponivel' }, { status: 502 });
    }
  }),
};
