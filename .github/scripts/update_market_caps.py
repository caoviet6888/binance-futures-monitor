import json, urllib.request, datetime, time
url='https://api.coinpaprika.com/v1/tickers?quotes=USD'
req=urllib.request.Request(url,headers={'User-Agent':'BinanceFuturesMonitor/2.0 (+github.com)'})
with urllib.request.urlopen(req,timeout=60) as resp:
    data=json.load(resp)
coins=[]
for c in data:
    usd=(c.get('quotes') or {}).get('USD') or {}
    cap=usd.get('market_cap')
    if isinstance(cap,(int,float)) and cap>0 and c.get('symbol'):
        coins.append({'id':c.get('id'),'symbol':c['symbol'],'market_cap':cap})
if len(coins)<1000:
    raise RuntimeError(f'Unexpectedly small market cap dataset: {len(coins)}')
with open('market-cap-cache.json','w',encoding='utf-8') as f:
    json.dump({'source':'CoinPaprika','updated_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'coins':coins},f,separators=(',',':'))
print('Saved',len(coins),'market caps')
