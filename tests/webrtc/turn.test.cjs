const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const {stripTypeScriptTypes}=require('node:module');

// Execute the actual function body. Authentication, database and Cloudflare
// are boundary fixtures: these tests do NOT validate deployed JWT/RLS/CORS.
function handler(options={}) {
  const source=fs.readFileSync(path.resolve(__dirname,'../../supabase/functions/etim-turn/index.ts'),'utf8');
  const js=stripTypeScriptTypes(source).replace(/import \{ withSupabase \} from [^;]+;/,'').replace('export default','globalThis.endpoint =');
  let authMode, calls=[];
  const sandbox={Response,AbortSignal,console:{error(){}},
    Deno:{env:{get:name=>options.noSecrets?undefined:({CLOUDFLARE_TURN_KEY_ID:'test-key-id',CLOUDFLARE_TURN_API_TOKEN:'test-token'})[name]}},
    withSupabase:(config,fn)=>{authMode=config.auth;return fn},
    fetch:async(url,init)=>{calls.push({url,init});if(options.fetchError)throw options.fetchError;
      return Response.json(options.upstream||{iceServers:[{urls:'turn:relay.example:3478',username:'test-user',credential:'test-password'}]},{status:options.status||200})}
  };
  vm.runInNewContext(js,sandbox);
  return {calls,get authMode(){return authMode},run:()=>sandbox.endpoint.fetch(
    {method:options.method||'POST'},
    {userClaims:options.noUser?null:{id:'test-user'},supabase:{from:()=>({select:()=>({eq:()=>({maybeSingle:async()=>({data:options.noMember?null:{user_id:'test-user'},error:options.dbError||null})})})})}})};
}

for(const [name,options,status] of [
  ['rejects GET',{method:'GET'},405],
  ['requires user claim',{noUser:true},401],
  ['requires club membership',{noMember:true},403],
  ['fails closed on membership query error',{dbError:{message:'test'}},500],
  ['reports missing hosted secrets',{noSecrets:true},503],
  ['handles upstream failure',{status:429},502],
  ['handles upstream timeout',{fetchError:new DOMException('fixture timeout','TimeoutError')},502],
  ['rejects empty server list',{upstream:{iceServers:[]}},502],
  ['rejects missing TURN credentials',{upstream:{iceServers:[{urls:'stun:relay.example'}]}},502]
])test('TURN '+name,async()=>{
  const h=handler(options);const response=await h.run();assert.equal(response.status,status);assert.equal(h.authMode,'user');
  if(status!==502)assert.equal(h.calls.length,0,'must not request TURN before authorization/config validation');
});

test('TURN returns temporary servers without caching and preserves TTL',async()=>{
  const h=handler();const response=await h.run();assert.equal(response.status,200);
  const body=await response.json();assert.equal(body.ttl,86400);assert.equal(body.iceServers.length,1);
  assert.equal(response.headers.get('Cache-Control'),'no-store');
  assert.equal(h.calls.length,1);assert.equal(h.calls[0].init.method,'POST');
  assert.equal(JSON.parse(h.calls[0].init.body).ttl,86400);
  assert.equal(new URL(h.calls[0].url).hostname,'rtc.live.cloudflare.com');
});
