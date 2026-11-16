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
    if (url.pathname !== "/test") return json({error:"Not found"},404);
    if (request.method !== "POST") return json({error:"POST required"},405);
    if (!env.MONITOR_ACCESS_TOKEN || request.headers.get("Authorization") !== "Bearer " + env.MONITOR_ACCESS_TOKEN) return json({error:"Unauthorized"},401);
    if (!env.NANSEN_API_KEY) return json({error:"Missing NANSEN_API_KEY"},503);
    try {
      const response = await fetch("https://api.nansen.ai/api/v1/tgm/flow-intelligence", {
        method:"POST",
        headers:{"Content-Type":"application/json",apiKey:env.NANSEN_API_KEY},
        body:JSON.stringify({chain:"ethereum",token_address:"0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9",timeframe:"1d"}),
        signal:AbortSignal.timeout(20000)
      });
      const data = await response.json().catch(()=>null);
      return json({connected:response.ok && data !== null,provider:"Nansen",http_status:response.status,data},response.ok && data === null ? 502 : response.status);
    } catch {
      return json({connected:false,error:"Nansen request failed"},502);
    }
  }
};
