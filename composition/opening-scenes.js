/* One persistent exchange system. The deck owns playback; this module only
   declares artwork and deterministic poses on its registered GSAP timeline. */
(function () {
  const check = '<path d="m-9 0 6 6 13-14"/>';
  // Native Apple Color Emoji is intentional for this Mac-only presentation.
  const emoji = (glyph, small=false) => `<text class="market-emoji${small?' emoji-small':''}" x="0" y="${small?12:45}" data-layout-ignore>${glyph}</text>`;
  // The two artworks share a fixed wrapper. Style changes never touch GSAP poses.
  const participant = (glyph, name) => `<g class="participant-emoji">${emoji(glyph)}</g><g class="participant-vector" data-icon="${name}">${(window.ENLACE_PHOSPHOR?.[name] || '').replace('<svg ', '<svg x="-58" y="-49" width="116" height="116" ')}</g>`;
  window.setEnlaceIconStyle = function(style) {
    if (style !== 'emoji' && style !== 'phosphor') throw new TypeError('Unknown opening icon style: ' + style);
    window.ENLACE_ICON_STYLE = style;
    const root = document.getElementById('market-opening');
    if (root) root.dataset.iconStyle = style;
    return style;
  };
  // Shared columns and row rhythm keep each chapter on the same visual grid.
  const lanes = [490,680,870];
  const unitStep = 52;
  const rowStart = (center,count) => center-(count-1)*unitStep/2;
  const offers = [{id:'A',count:6,y:550,poolY:580}, {id:'D',count:4,y:810,poolY:710}].map(o=>({...o,left:rowStart(460,o.count),poolX:rowStart(960,o.count)}));
  const bids = [
    {id:'B',count:4,y:510,poolY:540,from:['A','A','A','A'],icon:'🏭'},
    {id:'C',count:3,y:690,poolY:680,from:['A','A','D'],icon:'🏬'},
    {id:'E',count:3,y:870,poolY:820,from:['D','D','D'],icon:'🏢'}
  ].map(b=>({...b,left:rowStart(1460,b.count),poolLeft:rowStart(980,b.count)}));
  // Every offered space has one persistent identity and exactly one recipient.
  const sourceCursor={A:0,D:0};
  const allocations=bids.flatMap(bid=>bid.from.map((source,slot)=>({source,unit:sourceCursor[source]++,bid,slot})));

  const art = `<div id="market-opening" aria-label="How Enlace enables logistics exchanges">
    <div class="market-logo logo-airbnb"><img src="assets/airbnb.svg" alt="Airbnb"/></div>
    <div class="market-logo logo-uber"><img src="assets/uber.svg" alt="Uber"/></div>
    <div class="market-logo logo-enlace"><span class="enlace-wordmark">Enlace</span></div>
    <div class="market-world">
      <div class="market-heading heading-airbnb">Spare rooms become bookable.</div>
      <div class="market-heading heading-uber">Available drivers. Rides in real time.</div>
      <div class="market-heading heading-enlace">Shared capacity. Combined demand.</div>
      <div class="market-heading heading-final">One market. Many allocations.</div>
      <div class="market-heading heading-handoff">Capacity is available while cargo waits.</div>
      
      <svg class="market-art" viewBox="0 0 1920 1080" aria-hidden="true">
        <g class="consumer-labels labels-airbnb"><text x="400" y="355">HOSTS</text><text x="1520" y="355">GUESTS</text></g>
        <g class="consumer-labels labels-uber"><text x="400" y="355">DRIVERS</text><text x="1520" y="355">RIDERS</text></g>
        ${lanes.map((y,i)=>`
          <g class="source-object source-${i}">
            <g class="source-variant source-airbnb">${emoji(['🏠','🏡','🏠'][i])}</g>
            <g class="source-variant source-uber" transform="scale(${i<2?-1:1} 1)">${emoji(['🚗','🚙','🚕'][i])}</g>
            <g class="source-variant source-enlace">${emoji(['🚛','🏭','🚢'][i])}</g>
            <text class="resource-label" x="0" y="103">${['Transport capacity','Warehouse space','Ship capacity'][i]}</text>
          </g>
          <g class="need-object need-${i}"><g class="need-consumer">${emoji(['🧍‍♀️','🧍‍♂️','🧍'][i])}<g class="tourist-bag" transform="translate(68 24)">${emoji('🧳',true)}</g></g><g class="need-business">${emoji('📦')}</g></g>
          ${[0,1,2].map(j=>`<g class="need-slot slot-${i}-${j}"><rect x="-27" y="-27" width="54" height="54" rx="12"/></g>
          <g id="capacity-${i}-${j}" class="capacity-unit unit-${i}-${j}" data-exchange-state="unused" data-layout-allow-overlap>
            <rect class="unit-surface" x="-27" y="-27" width="54" height="54" rx="12"/>
            <g class="unit-symbol symbol-airbnb">${emoji('🛏️',true)}</g>
            <g class="unit-symbol symbol-uber">${emoji('🚗',true)}</g>
            <g class="unit-symbol symbol-enlace">${emoji('📦',true)}</g>
            <g class="unit-check">${check}</g>
          </g>`).join('')}
          <text class="booking-status status-airbnb status-${i}" x="1280" y="${y+72}">Reserved</text>
          <text class="booking-status status-uber status-${i}" x="1280" y="${y+72}">Assigned</text>
        `).join('')}
        <text class="remaining" x="685" y="838">Still available</text>
        
        <g class="network-scene">
          <g class="network-headers">
            <text class="network-eyebrow" x="460" y="355">CAPACITY</text>
            <text class="network-eyebrow" x="1460" y="355">DEMAND</text>
          </g>
          <g class="network-links" fill="none">
            <path class="link-A" pathLength="1" d="M640 530C725 530 715 630 795 630"/>
            <path class="link-D" pathLength="1" d="M640 790C725 790 715 690 795 690"/>
            <path pathLength="1" d="M1125 635C1240 635 1230 510 1350 510"/>
            <path pathLength="1" d="M1125 660C1240 660 1250 690 1376 690"/>
            <path pathLength="1" d="M1125 685C1240 685 1230 870 1376 870"/>
          </g>
          <g class="network-arena"><rect x="720" y="450" width="480" height="460" rx="32"/></g>
          <g class="network-hub"><rect x="795" y="560" width="330" height="200" rx="32"/></g>
          ${offers.map(o=>`<g class="network-offer offer-${o.id}">
            <g class="participant-icon" transform="translate(240 ${o.y-60})">${participant('🚛','truck')}</g>
            <text class="participant-name" x="460" y="${o.y-65}">Carrier ${o.id}</text>
            ${Array.from({length:o.count},(_,j)=>`<rect class="offer-outline" x="${o.left+j*unitStep-22}" y="${o.y-18}" width="44" height="36" rx="7"/>`).join('')}
          </g>`).join('')}
          ${bids.map(b=>`<g class="network-bid bid-${b.id}">
            <g class="participant-icon" transform="translate(1680 ${b.y-60})">${participant(b.icon, {B:'factory',C:'storefront',E:'buildings'}[b.id])}</g>
            <text class="participant-name" x="1460" y="${b.y-65}">Shipper ${b.id}</text>
            ${Array.from({length:b.count},(_,j)=>`<rect class="bid-outline" x="${b.left+j*unitStep-22}" y="${b.y-18}" width="44" height="36" rx="7"/>`).join('')}
          </g>`).join('')}
          ${offers.map(o=>Array.from({length:o.count},(_,j)=>`<g id="network-${o.id}-${j}" class="network-space space-${o.id}" data-source="${o.id}" data-state="offered" data-layout-allow-overlap>
            <rect x="-22" y="-18" width="44" height="36" rx="7"/>
            <text x="0" y="7">${o.id}</text>
          </g>`).join('')).join('')}
          ${bids.map(b=>`<text class="pool-recipient recipient-${b.id}" x="815" y="${b.poolY+8}">${b.id}</text>`).join('')}
        </g>
        <g class="handoff-labels"><text x="400" y="720">Unused capacity</text><text x="1520" y="720">Unmet demand</text><text x="960" y="860">Inside separate company networks.</text></g>
      </svg>

    </div>
  </div>`;

  window.ENLACE_OPENING_MARKET = {offers,bids,allocations};
  window.ENLACE_OPENING_SCENES = {H01:'',H02:'',H03:'',H04:''};
  window.ENLACE_OPENING_CHAPTERS = {H01:5.5,H02:5.5,H03:15};
  window.buildEnlaceOpening = function(tl,times) {
    document.getElementById('pitch-states').insertAdjacentHTML('beforeend',art);
    const root=document.getElementById('market-opening');
    window.setEnlaceIconStyle(window.ENLACE_ICON_STYLE || 'emoji');
    const all=s=>root.querySelectorAll(s);
    const put=(s,v,t)=>tl.set(all(s),v,t);
    const move=(s,v,t)=>tl.to(all(s),{ease:'power2.inOut',...v},t);
    const show=(s,t,d=.3)=>move(s,{opacity:1,duration:d,ease:'power2.out'},t);
    const hide=(s,t,d=.25)=>move(s,{opacity:0,duration:d,ease:'power2.in'},t);
    const state=(s,value,t)=>put(s,{attr:{'data-exchange-state':value}},t);
    const starts=[times[0]+.05,times[1]+.05,times[2]+.05];
    tl.set(root,{autoAlpha:0},0);
    tl.set(root,{autoAlpha:1},starts[0]);
    tl.set(document.querySelector('#state-TITLE'),{autoAlpha:0},starts[0]);

    function reset(brand,t) {
      put('.market-logo',{opacity:0,x:0,y:0,scale:1},t);
      put('.market-world',{opacity:0},t);
      put('.source-object,.need-object,.capacity-unit,.need-slot',{opacity:0,x:0,y:0,scale:1},t);
      put('.source-variant,.unit-symbol,.unit-check,.resource-label,.consumer-labels,.booking-status,.remaining,.handoff-labels,.market-heading',{opacity:0},t);
      put('.network-scene,.network-arena,.network-hub,.network-links,.network-space,.pool-recipient',{opacity:0},t);
      put('.unit-surface',{opacity:brand==='enlace'?0:1},t);
      put('.tourist-bag',{opacity:brand==='airbnb'?1:0},t);
      put('.need-business',{opacity:brand==='enlace'?1:0},t);
      put('.need-consumer',{opacity:brand==='enlace'?0:1},t);
      put(`.source-${brand},.symbol-${brand},.heading-${brand}`,{opacity:1},t);
      put('.unit-surface',{fill:'#edf5ff',stroke:'#1677d2'},t);
      state('.capacity-unit','unused',t);
      show(`.logo-${brand}`,t,.22);
      move(`.logo-${brand}`,{y:-405,scale:brand==='airbnb'?.39:brand==='uber'?.47:.46,duration:.6},t+.8);
      show('.market-world',t+1.4,.3);
    }
    function reserve(i,j,x,y,t,d=.65,agreement=true) {
      const u=`.unit-${i}-${j}`;
      state(u,'allocated',t);
      move(u,{x,y,duration:d},t);
      move(`${u} .unit-surface`,{fill:'#0876df',stroke:'#0876df',duration:.24},t+d-.2);
      hide(`${u} .unit-symbol`,t+d-.2,.2);
      show(`${u} .unit-check`,t+d-.1,.2);
      if(agreement)state(u,'agreed',t+d);
    }
    ['airbnb','uber'].forEach((brand,b)=>{
      const t=starts[b];reset(brand,t);
      put(`.labels-${brand}`,{opacity:1},t);
      put('.remaining',{attr:{x:brand==='uber'?400:680,y:950}},t);
      if(brand==='uber') {
        // The car itself is the available resource; no duplicate capacity icon.
        lanes.forEach((y,i)=>{
          put(`.source-${i}`,{x:400,y,opacity:1},t);
          put(`.need-${i}`,{x:1520,y},t);
          if(i<2) {
            show(`.need-${i}`,t+2.05+i*.15,.3);
            move(`.source-${i}`,{x:1340,duration:1.12},t+2.65+i*.2);
          }
        });
        show('.remaining',t+4.05);
        return;
      }
      lanes.forEach((y,i)=>{
        put(`.source-${i}`,{x:400,y,opacity:1},t);
        put(`.need-${i}`,{x:1520,y},t);
        put(`.unit-${i}-0`,{x:400,y},t);
        put(`.slot-${i}-0`,{x:1280,y},t);
        show(`.unit-${i}-0`,t+1.52+i*.06,.2);
        move(`.unit-${i}-0`,{x:680,duration:.66},t+1.85+i*.07);
        state(`.unit-${i}-0`,'offered',t+1.85+i*.07);
        if(i<2)show(`.need-${i},.slot-${i}-0`,t+2.35+i*.09,.3);
      });
      [0,1].forEach(i=>{
        state(`.unit-${i}-0`,'candidate',t+2.65+i*.18);
        move(`.unit-${i}-0`,{x:930,y:lanes[i]-20,duration:.42},t+2.65+i*.18);
        reserve(i,0,1280,lanes[i],t+3.14+i*.19);
        show(`.status-${brand}.status-${i}`,t+3.9+i*.19,.3);
      });
      show('.remaining',t+4.05);
    });

    const t=starts[2];reset('enlace',t);
    // Multiple offers and priced requests enter the same decision process.
    show('.network-scene',t+1.5,.35);
    put('.network-links path',{strokeDasharray:1,strokeDashoffset:1},t);
    offers.forEach(o=>{
      for(let j=0;j<o.count;j++){
        const u=`#network-${o.id}-${j}`;
        put(u,{x:o.left+j*unitStep,y:o.y,attr:{'data-state':'offered','data-recipient':''}},t);
        show(u,t+1.8+j*.045,.24);
        move(u,{x:o.poolX+j*unitStep,y:o.poolY,duration:.95},t+3.2);
      }
    });
    show('.network-arena',t+2.8,.45);
    hide('.offer-outline',t+3.6,.35);
    // A's six spaces split into four for B and two for C. D contributes one
    // additional space to C and three to E: C combines two different offers.
    allocations.forEach(a=>{
      const u=`#network-${a.source}-${a.unit}`;
      put(u,{attr:{'data-state':'selected','data-recipient':a.bid.id}},t+5.85);
      move(u,{x:a.bid.poolLeft+a.slot*unitStep,y:a.bid.poolY,duration:1.1},t+5.85);
    });
    show('.pool-recipient',t+6.35,.4);
    // Distribute the three selected allocations together, retaining the
    // source letter and colour of every space all the way to its recipient.
    allocations.forEach(a=>{
      move(`#network-${a.source}-${a.unit}`,{x:a.bid.left+a.slot*unitStep,y:a.bid.y,duration:1.3},t+8.25);
      put(`#network-${a.source}-${a.unit}`,{attr:{'data-state':'allocated'}},t+9.55);
    });
    hide('.pool-recipient,.network-arena',t+8.35,.5);
    show('.network-links',t+9.15,.2);
    move('.network-links path',{strokeDashoffset:0,duration:.8,ease:'power2.out'},t+9.15);
    show('.network-hub',t+9.3,.45);
    // The original logo becomes the shared network node, not another party.
    move('.logo-enlace',{y:115,scale:.38,duration:.8},t+9.25);
    hide('.heading-enlace',t+9.05,.2);
    show('.heading-final',t+10.1,.4);

    // The next scene now owns the problem, without an extra explanatory slide.
    tl.to(root,{autoAlpha:0,duration:.23,ease:'power2.in'},times[3]+.05);
  };
})();
