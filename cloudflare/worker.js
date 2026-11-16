export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const headers = {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "https://caoviet6888.github.io",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Vary": "Origin"
    };
    const json = (data, status = 200) => new Response(JSON.stringify(data, null, 2), {status, headers});
    if (request.method === "OPTIONS") return new Response(null, {status: 204, headers});
    if (url.pathname === "/" || url.pathname === "/health") {
      return json({app:"Binance Monitor",provider:"Nansen",status:"online",configured:Boolean(env.NANSEN_API_KEY),accessConfigured:Boolean(env.MONITOR_ACCESS_TOKEN),time:new Date().toISOString()});
    }
    if (!["/test","/flow","/holders","/exchanges"].includes(url.pathname)) return json({error:"Not found"},404);
    if (request.method !== "POST") return json({error:"POST required"},405);
    if (!env.MONITOR_ACCESS_TOKEN || request.headers.get("Authorization") !== "Bearer " + env.MONITOR_ACCESS_TOKEN) return json({error:"Unauthorized"},401);
    if (!env.NANSEN_API_KEY) return json({error:"Missing NANSEN_API_KEY"},503);
    try {
      let endpoint="flow-intelligence", payload={chain:"ethereum",token_address:"0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9",timeframe:"1d"};
      if(url.pathname!=="/test"){
        const b=await request.json().catch(()=>null);
        if(!b||!["ethereum","bnb","solana","base","arbitrum","polygon","optimism","avalanche"].includes(b.chain)||typeof b.token_address!=="string"||!(b.chain==="solana"?/^[1-9A-HJ-NP-Za-km-z]{32,44}$/:/^0x[a-fA-F0-9]{40}$/).test(b.token_address))return json({error:"Invalid chain or token address"},400);
        payload={chain:b.chain,token_address:b.token_address};
        if(url.pathname==="/flow")payload.timeframe=["5m","1h","6h","12h","1d","7d"].includes(b.timeframe)?b.timeframe:"1d";
        else {endpoint="holders";Object.assign(payload,{label_type:url.pathname==="/exchanges"?"exchange":"all_holders",aggregate_by_entity:false,pagination:{page:1,per_page:10},order_by:[{field:"token_amount",direction:"DESC"}]});}
      }
      const response = await fetch("https://api.nansen.ai/api/v1/tgm/"+endpoint, {
        method:"POST",
        headers:{"Content-Type":"application/json",apiKey:env.NANSEN_API_KEY},
        body:JSON.stringify(payload),
        signal:AbortSignal.timeout(20000)
      });
      const data = await response.json().catch(()=>null);
      if(response.status===429){
        const retry=response.headers.get("Retry-After");
        const raw=typeof data?.message==="string"?data.message:typeof data?.error==="string"?data.error:typeof data?.detail==="string"?data.detail:"";
        const reason=/credit|quota|balance|subscription/i.test(raw)?"quota_or_credits":/rate|too many|limit/i.test(raw)?"rate_limit":"unknown";
        return json({connected:false,provider:"Nansen",http_status:429,reason,retry_after:retry},429);
      }
      return json({connected:response.ok && data !== null,provider:"Nansen",http_status:response.status,data},response.ok && data === null ? 502 : response.status);
    } catch {
      return json({connected:false,error:"Nansen request failed"},502);
    }
  }
};
