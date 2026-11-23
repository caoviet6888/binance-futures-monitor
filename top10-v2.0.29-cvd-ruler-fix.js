/* v2.0.29 native CVD renderer: generated with every candle SVG; no DOM polling. */
(()=>{'use strict';
const style=document.createElement('style');
style.textContent='#radarStandalone20 [data-toggle219="VWAP"],#radarStandalone20 [data-toggle219="CVD"],#radarStandalone20 .cvd2195{display:none!important}';
document.head.append(style);
window.cvdInline29=function(rows){
 const k=rows.slice(-100),n=k.length;if(n<2)return '';
 let sum=0,valid=0;const v=k.map(a=>{const total=Number(a[7]),buy=Number(a[10]);if(a[7]==null||a[10]==null||!Number.isFinite(total)||!Number.isFinite(buy)||total<0||buy<0||buy>total)return null;valid++;return sum+=2*buy-total});
 const nums=v.filter(x=>x!==null),lo=Math.min(0,...nums),hi=Math.max(0,...nums),span=hi-lo||1;
 const X=i=>10+i*397/(n-1),Y=a=>522-(a-lo)/span*90;
 let path='',connected=false;v.forEach((a,i)=>{if(a===null){connected=false;return}path+=(connected?'L':'M')+X(i).toFixed(2)+' '+Y(a).toFixed(2)+' ';connected=true});
 const last=nums.at(-1)||0,color=last>=0?'#4de1a7':'#ff858c';
 return '<g class="cvdNative29"><path d="M10 402H408" stroke="#344b66"/><text x="10" y="419" fill="#57e3c4" font-size="11">CVD · DÒNG TIỀN TÍCH LŨY (USDT)</text><path d="M10 '+Y(0)+'H408" stroke="#64748b" stroke-dasharray="3 3"/><path d="'+path+'" stroke="'+color+'" stroke-width="1.7" fill="none"/><text x="408" y="428" text-anchor="end" font-size="11" fill="'+color+'">'+Math.round(last).toLocaleString('en-US')+' USDT</text><text x="10" y="535" font-size="9" fill="#afc1d8">Taker buy/sell · '+valid+'/'+n+' nến có dữ liệu</text></g>';
};
})();