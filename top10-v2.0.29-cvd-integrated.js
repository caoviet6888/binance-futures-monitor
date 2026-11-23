/* Stable CVD pane: preserve it inside incoming SVG before chart DOM diff, no timed repaint. */
(()=>{'use strict';
const NS='http://www.w3.org/2000/svg';
const style=document.createElement('style');style.textContent='#radarStandalone20 .cvdFix29{display:none!important}';document.head.append(style);
function decorate(svg,plot){
 if(!svg)return;
 const source=plot.querySelector('.cvdFix29 .cvdFixBody29 svg');
 if(!source)return;
 const vb=(svg.getAttribute('viewBox')||'0 0 420 400').split(/\s+/).map(Number);
 if(vb.length!==4||!vb.every(Number.isFinite))return;
 svg.setAttribute('viewBox',vb[0]+' '+vb[1]+' '+vb[2]+' 537');
 let group=svg.querySelector(':scope > .integratedCVD29');
 if(!group){group=document.createElementNS(NS,'g');group.setAttribute('class','integratedCVD29');svg.append(group)}
 const signature=source.outerHTML;
 if(group.dataset.signature===signature)return;
 group.dataset.signature=signature;
 group.replaceChildren();
 const line=document.createElementNS(NS,'line');Object.entries({x1:10,x2:408,y1:401,y2:401,stroke:'#344b66'}).forEach(([k,v])=>line.setAttribute(k,v));group.append(line);
 const label=document.createElementNS(NS,'text');Object.entries({x:12,y:416,fill:'#57e3c4','font-size':11}).forEach(([k,v])=>label.setAttribute(k,v));label.textContent='CVD · DÒNG TIỀN TÍCH LŨY (USDT)';group.append(label);
 const pane=document.createElementNS(NS,'svg');Object.entries({x:0,y:420,width:420,height:110,viewBox:'0 0 420 118',preserveAspectRatio:'none'}).forEach(([k,v])=>pane.setAttribute(k,v));for(const child of source.children)pane.append(child.cloneNode(true));group.append(pane);
}
const previous=window.mergeChart267;
if(typeof previous==='function')window.mergeChart267=function(plot,html){
 const existing=plot.querySelector(':scope > svg[data-ruler275]');
 if(!existing)return previous.call(this,plot,html);
 const template=document.createElement('template');template.innerHTML=html;
 const fresh=template.content.querySelector(':scope > svg[data-ruler275]');
 if(fresh){
  const pane=existing.querySelector(':scope > .integratedCVD29');
  if(pane){fresh.setAttribute('viewBox','0 0 420 537');fresh.append(pane.cloneNode(true))}
 }
 return previous.call(this,plot,template.innerHTML);
};
function init(){for(const plot of document.querySelectorAll('#radarStandalone20 .plot96')){const svg=plot.querySelector(':scope > svg[data-ruler275]');if(svg)decorate(svg,plot)}}
document.addEventListener('click',()=>requestAnimationFrame(init),true);
let ticks=0;const timer=setInterval(()=>{init();if(++ticks>120)clearInterval(timer)},1500);
init();
})();