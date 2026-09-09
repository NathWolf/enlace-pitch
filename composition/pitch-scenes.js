/* Persistent scene artwork and deterministic motion on the deck's GSAP clock. */
(function(){
  const E=(glyph,x,y,size=124)=>`<text class="scene-emoji" x="${x}" y="${y}" style="font-size:${size}px" data-layout-ignore>${glyph}</text>`;
  const T=(text,x,y,cls='')=>`<text class="${cls}" x="${x}" y="${y}">${text}</text>`;
  const svg=body=>`<svg class="scene-art" viewBox="0 0 1920 1080" aria-hidden="true">${body}</svg>`;
  const logo=(cls='',style='')=>`<span class="scene-logo enlace-wordmark ${cls}" style="${style}">Enlace</span>`;
  const brandText=text=>text.replace(/\bEnlace\b/g,'<span class="enlace-inline">Enlace</span>');
  const title=text=>`<h1 class="scene-title">${brandText(text)}</h1>`;
  const units=(count,x,y,cls,filled=false)=>Array.from({length:count},(_,i)=>`<g class="${cls} unit-${i}" data-layout-allow-overlap><rect x="${x+i*43}" y="${y}" width="36" height="34" rx="6" class="${filled?'solid-unit':'empty-unit'}"/>${filled?T('A',x+i*43+18,y+25,'unit-letter'):''}</g>`).join('');
  const resourceTypes=[['🚛','Transport'],['🏭','Warehouses'],['🚢','Shipping'],['📦','Containers']];
  const resourceEmoji=(g,x,y,i,size=112)=>E(g,x,y,size);
  const artwork={
    S02:`<div class="problem-phase problem-truck"><div class="problem-stat truck-metrics"><div><strong>21.6%</strong><p>of EU road-freight vehicle-km<br>run empty</p></div><div><strong>~50%</strong><p>average urban freight<br>vehicle load factor<br><small>21 major European cities</small></p></div></div><div class="truck-road"><span class="problem-depot">🏭</span><span class="problem-depot right">🏬</span><div class="problem-moving-truck"><span>🚛</span><div class="truck-load">📦 📦</div></div><div class="truck-trip loaded-trip">Loaded</div><div class="truck-trip empty-trip">Empty return</div></div><p class="problem-source">Eurostat · 2024 &nbsp; | &nbsp; European Commission NMP study, 2021–22 data; Cartolano et al., 2025</p></div><div class="problem-phase problem-container"><div class="problem-stat"><strong>$15–20B <small>/ year</small></strong><p>spent repositioning empty containers</p></div><div class="container-ports"><div class="port-label port-a">Surplus port</div><div class="port-label port-b">Containers needed</div><span class="port-crane crane-a">🏗️</span><span class="port-crane crane-b">🏗️</span>${Array.from({length:6},(_,i)=>`<div class="empty-container ec-${i}" style="left:${110+(i%3)*116}px;top:${160-Math.floor(i/3)*72}px" data-layout-allow-overlap role="img" aria-label="Container">📦</div>`).join('')}<div class="container-demand">${Array.from({length:2},()=>'<i></i>').join('')}</div><span class="reposition-ship" data-layout-allow-overlap data-layout-allow-occlusion>🚢</span></div><p class="problem-source">Industry estimate cited in JMSE (2026) · Empty-container repositioning</p></div><div class="problem-phase problem-ecosystem"><div class="ecosystem-networks">${[['🚛','Trucks'],['📦','Containers'],['🏭','Warehouses'],['🚢','Ships']].map(([g,l],i)=>`<div class="ecosystem-network en-${i}"><p>Network ${String.fromCharCode(65+i)}</p><span>${g}</span><h2>${l}</h2><div class="ecosystem-capacity">${Array.from({length:5},(_,j)=>`<i class="${(i+j)%3?'filled':''}"></i>`).join('')}</div></div>`).join('')}</div><p class="problem-final">The resources exist.<br>There is no mechanism to coordinate them across organizations.</p></div>`,
    S03:title('Enlace clears the market.')+`
      <div class="clearing-stage">
        <p class="clearing-side supply-label">SUPPLY</p><p class="clearing-side demand-label">DEMAND</p>
        <svg class="clearing-paths" viewBox="0 0 1920 1080" aria-hidden="true">
          <g class="clearing-candidates"><path d="M460 463C700 463 750 535 800 535"/><path d="M460 713C700 713 745 560 800 560"/><path d="M1120 535C1200 535 1180 479 1250 479"/><path d="M1120 560C1200 560 1180 729 1250 729"/></g>
          <g class="clearing-approved"><path d="M460 463C700 463 750 535 800 535"/><path d="M460 713C700 713 745 560 800 560"/><path d="M1120 535C1200 535 1180 479 1250 479"/><path d="M1120 560C1200 560 1180 729 1250 729"/></g>
        </svg>
        ${[['a','🚛','Carrier A',230,395],['d','🚛','Carrier D',230,645],['b','🏭','Shipper B',1460,395],['c','🏬','Shipper C',1460,645]].map(([k,g,n,x,y])=>`<div class="clearing-party party-${k}" style="left:${x}px;top:${y}px"><span>${g}</span><p>${n}</p></div>`).join('')}
        <div class="clearing-core"><span class="enlace-wordmark">Enlace</span><p>Mathematical optimization<br>+ market design</p></div>
        <div class="clearing-rules">${[['🕒','Operations'],['📄','Contracts'],['⚙️','Market rules']].map(([g,n])=>`<div><span>${g}</span><p>${n}</p><b class="rule-passed">✓</b></div>`).join('')}</div>
        ${[0,1].map(row=>`<div class="clearing-slots slots-${row}" style="top:${463+row*250}px">${[0,1,2].map(()=>'<i></i>').join('')}</div>`).join('')}
        ${[0,1,2,3,4,5].map(i=>`<i class="clear-unit cu-${i} ${i>3?'from-d':'from-a'}" data-source="${i>3?'D':'A'}" data-state="offered" data-layout-allow-overlap></i>`).join('')}
        <div class="clearing-price price-b"><span>€</span> <b>✓</b></div><div class="clearing-price price-c"><span>€</span> <b>✓</b></div>
        <p class="clearing-result">Allocation + prices + terms <span>✓</span></p>
      </div>`,
    S04:title('Who pays for Enlace and why?')+`<div class="buyer-types">${[['🏭','Enterprise','Lower logistics cost'],['🚛','3PL / operator','New service revenue'],['🤝','Consortium','Shared savings'],['🏗️','Public / infrastructure','Better capacity use']].map(([icon,buyer,motive])=>`<div class="buyer-type"><span class="html-emoji">${icon}</span><h2>${buyer}</h2><span class="buyer-down">↓</span><p>${motive}</p></div>`).join('')}</div><svg class="buyer-converge" viewBox="0 0 1920 1080" aria-hidden="true"><path d="M330 650V715H1590V650M750 650V715M1170 650V715M960 715V780"/><path d="m948 766 12 14 12-14"/></svg><div class="buyer-network"><h2>Runs its own logistics market</h2><p>Powered by <span class="enlace-inline">Enlace</span></p></div>`,
    S11:title('Who controls each network?')+`<div class="main-competition"><div class="competition-intro">A market operator’s control surface</div>${window.ENLACE_COMPETITION_TABLE}<p class="competition-note">Enlace gives the network owner control over participation, rules and the exchange mechanism.</p></div>`,
    S05:title('An annual platform fee per private logistics market.')+`<div class="price-hero"><div class="price-amount">€200k<span>+</span></div><p class="per-year">Initial annual platform fee per private logistics market</p><p class="deployment">+ deployment / integration</p></div>`+svg(`
      <g class="scope-people">${T('Participants',1370,375,'growth-label')}${[0,1,2,3,4].map((_,i)=>`<g class="scope-person sp-${i}">${E('🏢',1155+i*110,465,78)}</g>`).join('')}</g>
      <g class="scope-resources">${T('Resources',1370,591,'growth-label')}${resourceTypes.slice(0,4).map(([g],i)=>`<g class="scope-resource sr-${i}">${E(g,1205+i*110,683,82)}</g>`).join('')}</g>
      <g class="scope-growth"><path d="M1120 870C1310 870 1500 828 1620 767" class="growth-line"/><path d="m1587 764 39-5-10 37" class="growth-line"/>${T('Fee scales with participants and resource types',1370,954,'growth-caption')}</g>`),
    S06:title('Start with 2–3 shippers and their carriers.')+`<div class="gtm-plan"><section class="gtm-step gtm-partner"><p class="gtm-step-label">AGREED</p><span class="html-emoji">🤝</span><h2>Design partner</h2><p>Agreed to start working together.</p></section><section class="gtm-step gtm-pilot"><p class="gtm-step-label">NOW</p><div class="gtm-emoji-row"><span>🏭</span><span>🚛</span><span>🏬</span><span>🚛</span></div><h2>2–3 shippers</h2><ul class="gtm-bullets"><li>Start with compatible freight lanes.</li><li>Their existing carriers.</li><li>Test exchanges across shared lanes.</li></ul></section><section class="gtm-step gtm-scale"><p class="gtm-step-label">THEN</p><div class="gtm-emoji-row"><span>🚛</span><span>🏭</span><span>🚢</span></div><h2>Expand the market</h2><p>More clients.<br>More lanes.<br>More participants.<br>More resource types.<br>New markets.</p></section></div>`,
    S07:title('Transport is the starting point.')+`<div class="market-figures"><div class="market-road"><strong>≈$3.8T</strong><p>Global road freight</p></div><div class="market-total"><strong>≈$12.29T</strong><p>Global logistics costs</p></div></div>`+svg(`${resourceTypes.map(([g,label],i)=>`<g class="market-resource mr-${i}">${resourceEmoji(g,420+i*360,689,i,112)}${T(label,420+i*360,771,'resource-caption')}</g>`).join('')}<g class="market-platform-line"><path d="M420 810V836H1500V810M960 836V874"/></g>`)+logo('market-platform'),
    S08:title('Logistics, market design and optimization.')+`<div class="founder-pair"><div class="founder"><img class="founder-photo" src="assets/team/nathalia.png" alt="Nathalia Wolf"/><div class="founder-info"><h2>Nathalia Wolf</h2><p class="founder-role">CEO · Co-founder</p><p class="founder-expertise">Logistics + optimization</p><p class="founder-degree">PhD in computer science<br>MSc Industrial Engineering</p></div></div><div class="founder"><img class="founder-photo" src="assets/team/juan.jpg" alt="Juan Sepúlveda"/><div class="founder-info"><h2>Juan Sepúlveda</h2><p class="founder-role">CTO · Co-founder</p><p class="founder-expertise">Market design + optimization</p><p class="founder-degree">PhD in computer science<br>MSc Electrical Engineering</p></div></div></div><div class="inria"><span>Supported by Inria</span><img src="assets/team/inria.png" alt="Inria"/></div>`,
    S10:`<h1 class="ask-amount">€2M Seed</h1><p class="ask-thesis">24 months to productize the technology,<br>deploy live markets and validate willingness to pay.</p><div class="milestones">${[['Core technology','✓ Complete'],['First live markets','In progress · design partners'],['Company creation','March 2027'],['Repeatable deployment','Multiple paying markets']].map(([t,d],i)=>`<div class="milestone m-${i}"><i></i><span>${t}</span><small>${d}</small></div>`).join('')}<div class="milestone-line"></div></div>`,
    S09:logo('closing-logo')+`<h1 class="vision-title">Infrastructure for logistics markets.</h1>`+svg(`<g class="vision-lines"><path d="M420 480V550H1500V480"/>${[780,1140].map(x=>`<path d="M${x} 480V550"/>`).join('')}</g>${resourceTypes.map(([g],i)=>`<g class="vision-resource">${resourceEmoji(g,420+i*360,448,i,120)}</g>`).join('')}`),
  };
  window.ENLACE_PITCH_ART=artwork;
  window.buildPitchScenes=function(tl,scenes){
    scenes.filter(s=>s.id!=='S01').forEach(s=>{
      const root=document.getElementById('scene-'+s.id),t=s.start;
      const all=q=>root.querySelectorAll(q);
      const set=(q,v,at=0)=>tl.set(all(q),v,t+at);
      const to=(q,v,at)=>tl.to(all(q),{ease:'power2.inOut',...v},t+at);
      const show=(q,at,d=.5)=>to(q,{opacity:1,duration:d},at);
      const hide=(q,at,d=.35)=>to(q,{opacity:0,duration:d},at);
      const enter=(q,at,stagger=.12)=>tl.fromTo(all(q),{opacity:0,y:14},{opacity:1,y:0,duration:.6,stagger,ease:'power2.out',immediateRender:false},t+at);
      if(s.id==='S02'){
        set('.problem-phase,.empty-trip',{opacity:0});show('.problem-truck',.4,.3);
        set('.problem-moving-truck',{x:0});set('.problem-moving-truck>span',{scaleX:-1});
        to('.problem-moving-truck',{x:880,duration:2.5,ease:'power1.inOut'},1.1);
        hide('.truck-load,.loaded-trip',3.7,.2);set('.problem-moving-truck>span',{scaleX:1},4);show('.empty-trip',4,.2);
        to('.problem-moving-truck',{x:0,duration:2.5,ease:'power1.inOut'},4.3);
        hide('.problem-truck',8.05,.2);show('.problem-container',8.35,.3);
        set('.empty-container',{opacity:0});to('.empty-container',{opacity:1,duration:.35,stagger:.18},8.7);
        // The same two containers lift, travel with the ship, then fill the destination slots.
        set('.reposition-ship',{x:0});
        to('.ec-4',{x:274,y:52,scale:.65,duration:.8},10);
        to('.ec-5',{x:238,y:52,scale:.65,duration:.8},10.15);
        to('.reposition-ship',{x:360,duration:1.8,ease:'power1.inOut'},11.1);
        to('.ec-4',{x:634,duration:1.8,ease:'power1.inOut'},11.1);
        to('.ec-5',{x:598,duration:1.8,ease:'power1.inOut'},11.1);
        to('.ec-4',{x:814,y:72,scale:1,duration:.8},13.05);
        to('.ec-5',{x:814,y:72,scale:1,duration:.8},13.2);
        hide('.container-demand',13.8,.2);
        hide('.problem-container',15.05,.2);show('.problem-ecosystem',15.35,.3);
        set('.ecosystem-networks',{scale:1.6,transformOrigin:'50% 50%'});
        to('.ecosystem-networks',{scale:1,duration:1.7,ease:'power2.out'},15.35);
      }
      if(s.id==='S03'){
        set('.clearing-stage,.clearing-core,.clearing-rules,.clearing-paths,.clearing-approved,.rule-passed,.clearing-price,.clearing-result',{opacity:0});
        show('.clearing-stage',.3,.35);
        set('.clearing-party,.clear-unit,.clearing-slots',{opacity:0});
        show('.clearing-party',.7,.45);show('.clearing-slots',1.2,.4);
        for(let i=0;i<6;i++){
          set('.cu-'+i,{x:i<4?475+i*42:475+(i-4)*42,y:i<4?447:697,attr:{'data-state':'offered'}});
          show('.cu-'+i,1.25+i*.1,.25);
        }
        show('.clearing-core,.clearing-rules',5.35,.5);show('.clearing-paths',6.1,.45);
        for(let i=0;i<6;i++){
          to('.cu-'+i,{x:862+(i%3)*82,y:380+Math.floor(i/3)*44,duration:1.1,attr:{'data-state':'candidate'}},6.6+i*.1);
        }
        show('.rule-passed',10.5,.3);hide('.clearing-candidates',11,.3);show('.clearing-approved',11,.35);
        for(let i=0;i<6;i++){
          to('.cu-'+i,{x:1280+(i%3)*50,y:i<3?463:713,duration:1.6,attr:{'data-state':'allocated'}},12.5+i*.15);
        }
        hide('.clearing-slots',14.9,.25);show('.clearing-price',15.3,.4);
        set('.clear-unit',{attr:{'data-state':'agreed'}},15.7);show('.clearing-result',16,.5);
      }
      if(s.id==='S04'){set('.buyer-converge,.buyer-network',{opacity:0});show('.buyer-converge,.buyer-network',2.4,.3);}
      if(s.id==='S11'){set('.main-competition',{opacity:0});show('.main-competition',.35,.55);}
      if(s.id==='S05'){
        enter('.price-hero',.4);set('.scope-person,.scope-resource,.scope-growth',{opacity:0});
        show('.sp-0,.sp-1,.sr-0',.8);show('.sp-2',2.9);show('.sp-3',3.35);show('.sp-4',3.8);
        show('.sr-1',4.2);show('.sr-2',4.7);show('.sr-3',5.2);show('.scope-growth',5.6);
      }
      if(s.id==='S06'){
        set('.gtm-step',{opacity:0});
        show('.gtm-partner',.4,.25);show('.gtm-pilot',2.4,.25);show('.gtm-scale',8.4,.25);
      }
      if(s.id==='S07'){
        set('.market-total,.market-platform,.market-platform-line,.market-resource:not(.mr-0)',{opacity:0});enter('.market-road,.mr-0',.5,.05);
        set('.mr-0',{x:600});hide('.market-road',2.8,.55);show('.market-total',3.25,.6);to('.mr-0',{x:0,duration:1.3},3);
        enter('.market-resource:not(.mr-0)',4.35,.22);show('.market-platform-line,.market-platform',5.25);
      }
      if(s.id==='S08'){
        enter('.founder',.5,.25);enter('.inria',1.25);
      }
      if(s.id==='S10'){
        // Keep the first Ask hold focused on the funding request. The roadmap
        // arrives on the next click as a clean fade, without the old vertical drift.
        set('.milestones',{opacity:0});
        show('.milestones',2.5,.35);
      }
      if(s.id==='S09'){
        // Close with one calm visual progression: resources, the connective
        // layer, then the Enlace mark and its statement. Keep the elements in
        // place and use soft fades rather than staggered vertical movement.
        set('.vision-resource,.closing-logo,.vision-title,.vision-lines',{opacity:0});
        tl.fromTo(all('.vision-resource'),
          {opacity:0,scale:.96},
          {opacity:1,scale:1,duration:.7,stagger:.12,ease:'power2.out',transformOrigin:'50% 50%',immediateRender:false},
          t+.25);
        show('.vision-lines',1.05,.65);
        tl.fromTo(all('.closing-logo'),
          {opacity:0,scale:.985},
          {opacity:1,scale:1,duration:.8,ease:'power2.out',transformOrigin:'50% 50%',immediateRender:false},
          t+1.45);
        tl.fromTo(all('.vision-title'),
          {opacity:0},
          {opacity:1,duration:.8,ease:'power2.out',immediateRender:false},
          t+2.35);
      }
    });
  };
})();
