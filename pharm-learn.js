(function(){
  const groups=window.PHARM_MEDICATION_GROUPS||[];
  const STATUS_KEY='ndhce_pharm_medication_study_v1';
  const $=id=>document.getElementById(id);
  const esc=value=>String(value??'').replace(/[&<>"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[char]));
  const readStatus=()=>{try{return JSON.parse(localStorage.getItem(STATUS_KEY))||{};}catch(error){return {};}};
  let status=readStatus(),activeView='library',cardOrder=[],cardIndex=0,revealed=false;

  function allDrugs(){
    const map=new Map();
    groups.forEach(group=>group.drugs.forEach(drug=>{const key=drug.name.toLowerCase();if(!map.has(key))map.set(key,drug);}));
    return [...map.values()];
  }

  function saveStatus(){localStorage.setItem(STATUS_KEY,JSON.stringify(status));updateSummary();}
  function setStatus(id,value){
    if(status[id]===value)delete status[id];else status[id]=value;
    saveStatus();
    const group=groups.find(item=>item.id===id);
    if(group&&window.NDHCE_TRACKER){
      NDHCE_TRACKER.recordActivity({module:'Pharmacology',type:'medication-study',mode:value==='known'?'Marked known':'Needs review',total:1,correct:value==='known'?1:0,attempts:1,percent:value==='known'?100:0,details:{groupId:id,groupTitle:group.title,status:status[id]||'unmarked'}});
    }
    renderLibrary();renderReview();buildCardOrder();renderCard();
  }

  function updateSummary(){
    const known=groups.filter(group=>status[group.id]==='known').length;
    const review=groups.filter(group=>status[group.id]==='review').length;
    $('drugCount').textContent=allDrugs().length;
    $('classCount').textContent=groups.length;
    $('knownCount').textContent=known;
    $('reviewCount').textContent=review;
    $('knownBar').style.width=`${groups.length?known/groups.length*100:0}%`;
  }

  function groupSearchText(group){
    return [group.category,group.categoryZh,group.title,group.titleZh,group.use,group.useZh,group.key,group.keyZh,group.dental,group.dentalZh,...group.drugs.flatMap(drug=>[drug.name,drug.brand])].join(' ').toLowerCase();
  }

  function actionButtons(group){
    return `<div class="med-actions"><button class="review-button ${status[group.id]==='review'?'active':''}" data-status="review" data-id="${esc(group.id)}" aria-pressed="${status[group.id]==='review'}">🔁 Review again / 再复习</button><button class="know-button ${status[group.id]==='known'?'active':''}" data-status="known" data-id="${esc(group.id)}" aria-pressed="${status[group.id]==='known'}">✓ I know this / 已掌握</button></div>`;
  }

  function groupHtml(group){
    const pills=group.drugs.map(drug=>`<span class="med-pill"><b>${esc(drug.name)}</b>${drug.brand?`<small>${esc(drug.brand)}</small>`:''}</span>`).join('');
    return `<article class="med-group" data-status="${esc(status[group.id]||'')}" data-group-id="${esc(group.id)}"><h3>${esc(group.title)}</h3><span class="zh">${esc(group.titleZh)}</span><div class="med-list">${pills}</div><div class="med-facts"><div class="med-fact"><b>Core use / 主要用途</b>${esc(group.use)}<span class="zh">${esc(group.useZh)}</span></div><div class="med-fact"><b>Must know / 必须掌握</b>${esc(group.key)}<span class="zh">${esc(group.keyZh)}</span></div><div class="med-fact"><b>Dental implications / 牙科注意事项</b>${esc(group.dental)}<span class="zh">${esc(group.dentalZh)}</span></div></div>${actionButtons(group)}<div class="source-ref">Source: Pharmacology course review, ${esc(group.page)}</div></article>`;
  }

  function bindStatusButtons(root){
    root.querySelectorAll('[data-status][data-id]').forEach(button=>button.addEventListener('click',event=>{event.stopPropagation();setStatus(button.dataset.id,button.dataset.status);}));
  }

  function renderLibrary(){
    const query=$('medSearch').value.trim().toLowerCase();
    const category=$('categoryFilter').value;
    const visible=groups.filter(group=>(category==='all'||group.category===category)&&(!query||groupSearchText(group).includes(query)));
    const byCategory={};visible.forEach(group=>(byCategory[group.category]||(byCategory[group.category]=[])).push(group));
    $('medicationGroups').innerHTML=Object.entries(byCategory).map(([name,items])=>`<section><div class="med-category"><div><h2>${esc(name)}</h2><span>${esc(items[0].categoryZh)}</span></div><span>${items.length} group${items.length===1?'':'s'}</span></div><div class="med-grid">${items.map(groupHtml).join('')}</div></section>`).join('')||'<div class="card center"><h2>No medication matches that search.</h2><p>Try a generic name, brand, class, adverse effect, or dental concern.<span class="zh">请尝试通用名、商品名、药物类别、不良反应或牙科注意事项。</span></p></div>';
    $('resultCount').textContent=`Showing ${visible.length} of ${groups.length} study groups / 显示 ${visible.length}/${groups.length} 个学习组`;
    bindStatusButtons($('medicationGroups'));
  }

  function renderReview(){
    const review=groups.filter(group=>status[group.id]==='review');
    $('reviewEmpty').classList.toggle('hidden',review.length>0);
    $('reviewGroups').innerHTML=review.length?`<div class="med-category"><div><h2>Needs review</h2><span>需要复习</span></div><span>${review.length} groups</span></div><div class="med-grid">${review.map(groupHtml).join('')}</div>`:'';
    bindStatusButtons($('reviewGroups'));
  }

  function buildCardOrder(){
    const current=cardOrder[cardIndex]?.id;
    cardOrder=[...groups].sort((a,b)=>{
      const rank={review:0,undefined:1,known:2};
      return (rank[status[a.id]]??1)-(rank[status[b.id]]??1)||a.title.localeCompare(b.title);
    });
    cardIndex=Math.max(0,current?cardOrder.findIndex(group=>group.id===current):Math.min(cardIndex,cardOrder.length-1));
  }

  function renderCard(){
    if(!cardOrder.length)return;
    const group=cardOrder[cardIndex];
    $('cardPosition').textContent=`${cardIndex+1} of ${cardOrder.length}`;
    $('cardCategory').textContent=`${group.category} / ${group.categoryZh}`;
    $('cardTitle').textContent=group.title;
    $('cardTitleZh').textContent=group.titleZh;
    $('cardPrompt').textContent='Recall the drug names, main use, must-know clue, and dental implication.';
    $('cardBack').innerHTML=`<h2>${esc(group.title)}</h2><span class="zh">${esc(group.titleZh)}</span><p class="flash-drugs">${group.drugs.map(drug=>`<b>${esc(drug.name)}</b>${drug.brand?` (${esc(drug.brand)})`:''}`).join(' • ')}</p><div class="med-facts"><div class="med-fact"><b>Core use / 主要用途</b>${esc(group.use)}<span class="zh">${esc(group.useZh)}</span></div><div class="med-fact"><b>Must know / 必须掌握</b>${esc(group.key)}<span class="zh">${esc(group.keyZh)}</span></div><div class="med-fact"><b>Dental implications / 牙科注意事项</b>${esc(group.dental)}<span class="zh">${esc(group.dentalZh)}</span></div></div>`;
    $('cardFront').classList.toggle('hidden',revealed);
    $('cardBack').classList.toggle('hidden',!revealed);
    $('reviewCard').classList.toggle('active',status[group.id]==='review');
    $('knowCard').classList.toggle('active',status[group.id]==='known');
    $('previousCard').disabled=cardIndex===0;
    $('nextCard').disabled=cardIndex===cardOrder.length-1;
  }

  function changeCard(delta){cardIndex=Math.max(0,Math.min(cardOrder.length-1,cardIndex+delta));revealed=false;renderCard();}
  function revealCard(){revealed=!revealed;renderCard();}
  function setView(view){
    activeView=view;
    document.querySelectorAll('.study-tab').forEach(button=>{const active=button.dataset.view===view;button.classList.toggle('active',active);button.setAttribute('aria-selected',String(active));});
    $('libraryView').classList.toggle('hidden',view!=='library');
    $('cardsView').classList.toggle('hidden',view!=='cards');
    $('reviewView').classList.toggle('hidden',view!=='review');
    $('libraryTools').classList.toggle('hidden',view!=='library');
    $('resultCount').classList.toggle('hidden',view!=='library');
    if(view==='cards'){buildCardOrder();revealed=false;renderCard();}
    if(view==='review')renderReview();
  }

  const categories=[...new Set(groups.map(group=>group.category))];
  $('categoryFilter').insertAdjacentHTML('beforeend',categories.map(name=>`<option value="${esc(name)}">${esc(name)}</option>`).join(''));
  $('medSearch').addEventListener('input',renderLibrary);
  $('categoryFilter').addEventListener('change',renderLibrary);
  $('clearFilters').addEventListener('click',()=>{$('medSearch').value='';$('categoryFilter').value='all';renderLibrary();$('medSearch').focus();});
  document.querySelectorAll('.study-tab').forEach(button=>button.addEventListener('click',()=>setView(button.dataset.view)));
  $('studyCard').addEventListener('click',revealCard);
  $('studyCard').addEventListener('keydown',event=>{if(event.key===' '||event.key==='Enter'){event.preventDefault();revealCard();}});
  $('previousCard').addEventListener('click',()=>changeCard(-1));
  $('nextCard').addEventListener('click',()=>changeCard(1));
  $('reviewCard').addEventListener('click',()=>setStatus(cardOrder[cardIndex].id,'review'));
  $('knowCard').addEventListener('click',()=>setStatus(cardOrder[cardIndex].id,'known'));

  updateSummary();renderLibrary();renderReview();buildCardOrder();renderCard();setView(activeView);
})();
