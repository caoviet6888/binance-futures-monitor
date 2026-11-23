/* Integrated CVD as fourth pane of the original candle/volume/MACD SVG. */
(()=>{'use strict';
const NS='http://www.w3.org/2000/svg';
const css=document.createElement('style');css.textContent='#radarStandalone20 .cvdFix29{display:none!important}#radarStandalone20 .plot96>svg[data-ruler275]{height:auto!important}';document.head.append(css);
function update(){
 for(const plot of document.querySelectorAll('#radarStandalone20 .plot96')){
  const main=plot.querySelector(':scope > svg[data-ruler275]');const panel=plot.querySelector('.cvdFix29 .cvdFixBody29 svg');if(!main||!panel)continue;
  const source=panel.outerHTML,old=main.querySelector(':scope > .integratedCVD29');
  if(old?.dataset.source===source)continue;
  const vb=(main.getAttribute('viewBox')||'0 0 420 400').split(/\s+/).map(Number);if(vb.length!==4||!vb.every(Number.isFinite))continue;
  const originalHeight=400,extra=137;
  main.setAttribute('viewBox',vb[0]+' '+vb[1]+' '+vb[2]+' '+(originalHeight+extra));
  const group=document.createElementNS(NS,'g');group.setAttribute('class','integratedCVD29');group.dataset.source=source;
  const divider=document.createElementNS(NS,'line');divider.setAttribute('x1','10');divider.setAttribute('x2','408');divider.setAttribute('y1','401');divider.setAttribute('y2','401');divider.setAttribute('stroke','#344b66');group.append(divider);
  const title=document.createElementNS(NS,'text');title.setAttribute('x','12');title.setAttribute('y','416');title.setAttribute('fill','#57e3c4');title.setAttribute('font-size','11');title.textContent='CVD · DÒNG TIỀN TÍCH LŨY (USDT)';group.append(title);
  const nested=document.createElementNS(NS,'svg');nested.setAttribute('x','0');nested.setAttribute('y','420');nested.setAttribute('width','420');nested.setAttribute('height','110');nested.setAttribute('viewBox','0 0 420 118');nested.setAttribute('preserveAspectRatio','none');
  for(const child of [...panel.children])nested.append(child.cloneNode(true));group.append(nested);
  old?.remove();main.append(group);
 }
}
setInterval(update,800);document.addEventListener('click',()=>requestAnimationFrame(update),true);update();
})();