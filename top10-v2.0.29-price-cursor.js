/* v2.0.29: transient horizontal price cursor on the price pane only. */
(()=>{'use strict';
const css=document.createElement('style');
css.textContent='#radarStandalone20 .plot96{position:relative}#radarStandalone20 .priceTouch29{position:absolute;left:0;top:0;width:100%;height:39.5%;z-index:5;touch-action:none;background:transparent;cursor:crosshair}#radarStandalone20 .priceTouch29[hidden]{display:none!important}';
document.head.append(css);
const NS='http://www.w3.org/2000/svg',instances=new WeakMap();
function element(tag,attrs){const e=document.createElementNS(NS,tag);for(const [k,v] of Object.entries(attrs))e.setAttribute(k,String(v));return e}
function setup(plot){
 const svg=plot.querySelector(':scope > svg[data-ruler275]');if(!svg)return;
 let state=instances.get(plot);
 if(!state){
  const overlay=document.createElement('div');overlay.className='priceTouch29';overlay.setAttribute('aria-label','Chạm và kéo để xem giá');
  const layer=element('g',{'class':'priceCursor29','pointer-events':'none',visibility:'hidden'});
  const line=element('line',{x1:10,x2:408,y1:100,y2:100,stroke:'#d8e7fb','stroke-width':'.8','stroke-dasharray':'4 3'});
  const bg=element('rect',{x:357,y:92,width:60,height:17,rx:3,fill:'#2866a2'});
  const label=element('text',{x:413,y:104,'text-anchor':'end','font-size':11,fill:'#ffffff'});
  layer.append(line,bg,label);
  state={overlay,layer,line,bg,label,svg:null,active:false,hideTimer:null};
  overlay.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button!==0)return;state.active=true;clearTimeout(state.hideTimer);try{overlay.setPointerCapture(e.pointerId)}catch{};draw(e);e.preventDefault()});
  overlay.addEventListener('pointermove',e=>{if(state.active)draw(e)});
  function finish(){if(!state.active)return;state.active=false;clearTimeout(state.hideTimer);state.hideTimer=setTimeout(()=>{state.layer.setAttribute('visibility','hidden')},1400)}
  overlay.addEventListener('pointerup',finish);overlay.addEventListener('pointercancel',finish);overlay.addEventListener('lostpointercapture',finish);
  function draw(e){
   const current=state.svg;if(!current)return;
   const meta=current.dataset.ruler275?.split('|');if(!meta||meta.length<7)return;
   const lo=Number(meta[0]),hi=Number(meta[1]),right=Number(meta[2]);if(!Number.isFinite(lo)||!Number.isFinite(hi)||hi<=lo)return;
   const box=state.overlay.getBoundingClientRect(),fraction=Math.max(0,Math.min(1,(e.clientY-box.top)/Math.max(box.height,1)));
   const y=12+fraction*200,price=hi-fraction*(hi-lo),dec=price>=1000?2:price>=1?4:price>=.01?6:8;
   state.line.setAttribute('y1',y);state.line.setAttribute('y2',y);state.line.setAttribute('x2',right);
   state.label.textContent=price.toFixed(dec);
   const width=Math.max(51,Math.min(100,state.label.textContent.length*6.5+10));
   state.bg.setAttribute('x',418-width);state.bg.setAttribute('width',width);
   state.bg.setAttribute('y',y-9);state.label.setAttribute('y',y+3.5);
   state.layer.setAttribute('visibility','visible');
  }
  instances.set(plot,state);
 }
 if(state.svg!==svg){state.layer.remove();svg.append(state.layer);state.svg=svg;state.layer.setAttribute('visibility','hidden')}
 if(state.overlay.parentElement!==plot)plot.append(state.overlay);
 const ruler=plot.closest('details')?.querySelector('.rulerBtn275');
 const enabled=ruler?.getAttribute('aria-pressed')==='true';
 state.overlay.hidden=enabled;
 if(enabled){state.active=false;state.layer.setAttribute('visibility','hidden')}
}
function sync(){for(const p of document.querySelectorAll('#radarStandalone20 .plot96'))setup(p)}
document.addEventListener('click',()=>requestAnimationFrame(sync),true);
setInterval(sync,1400);sync();
})();