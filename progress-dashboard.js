(function(){
  const attempts=NDHCE_TRACKER.getAttempts();
  const sessions=NDHCE_TRACKER.getSessions();
  const pct=(c,t)=>t?Math.round(c/t*100):0;
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const group=(rows,keyFn)=>{
    const out={};
    rows.forEach(r=>{const key=keyFn(r);(out[key]||(out[key]=[])).push(r)});
    return out;
  };

  function renderSummary(){
    const total=attempts.length;
    const correct=attempts.filter(a=>a.correct).length;
    const visual=attempts.filter(a=>a.visual);
    const unique=new Set(attempts.map(a=>a.module+'|'+a.questionId)).size;
    document.getElementById('summary').innerHTML=[
      ['Attempts',total,'Total answers saved'],
      ['Accuracy',pct(correct,total)+'%',correct+' correct'],
      ['Questions seen',unique,'Unique question IDs'],
      ['Visual accuracy',pct(visual.filter(a=>a.correct).length,visual.length)+'%',visual.length+' visual attempts']
    ].map(x=>`<div class="progress-card"><h3>${x[0]}</h3><div class="big">${x[1]}</div><small>${x[2]}</small></div>`).join('');
  }

  function renderModules(){
    if(!attempts.length){
      document.getElementById('modules').innerHTML='<p>No detailed attempts recorded yet. New practice and exam answers will appear here.</p>';
      return;
    }
    const groups=group(attempts,a=>a.module);
    const rows=Object.entries(groups).map(([name,items])=>{
      const correct=items.filter(x=>x.correct).length;
      const visual=items.filter(x=>x.visual);
      return {name,total:items.length,accuracy:pct(correct,items.length),visual:pct(visual.filter(x=>x.correct).length,visual.length),visualCount:visual.length};
    }).sort((a,b)=>b.total-a.total);
    document.getElementById('modules').innerHTML=`<table class="progress-table"><thead><tr><th>Module</th><th>Attempts</th><th>Accuracy</th><th>Visual</th></tr></thead><tbody>${
      rows.map(r=>`<tr><td>${esc(r.name)}</td><td>${r.total}</td><td><div>${r.accuracy}%</div><div class="bar-track"><div class="bar-fill" style="width:${r.accuracy}%"></div></div></td><td>${r.visualCount?r.visual+'%':'—'}</td></tr>`).join('')
    }</tbody></table>`;
  }

  function renderWeak(){
    const groups=group(attempts,a=>a.module+'|||'+a.concept);
    const rows=Object.entries(groups).map(([key,items])=>{
      const [module,concept]=key.split('|||');
      const correct=items.filter(x=>x.correct).length;
      return {module,concept,total:items.length,accuracy:pct(correct,items.length)};
    }).filter(x=>x.total>=2).sort((a,b)=>a.accuracy-b.accuracy||b.total-a.total).slice(0,12);
    document.getElementById('weakAreas').innerHTML=rows.length
      ? `<table class="progress-table"><thead><tr><th>Module</th><th>Concept</th><th>Attempts</th><th>Accuracy</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${esc(r.module)}</td><td>${esc(r.concept)}</td><td>${r.total}</td><td>${r.accuracy}%</td></tr>`).join('')}</tbody></table>`
      : '<p>Weak areas will appear after at least two attempts in a concept.</p>';
  }

  function renderSessions(){
    const recent=[...sessions].sort((a,b)=>String(b.timestamp).localeCompare(String(a.timestamp))).slice(0,15);
    document.getElementById('sessions').innerHTML=recent.length
      ? `<table class="progress-table"><thead><tr><th>Date</th><th>Module</th><th>Type</th><th>Score</th></tr></thead><tbody>${recent.map(s=>`<tr><td>${new Date(s.timestamp).toLocaleString()}</td><td>${esc(s.module)}</td><td>${esc(s.section)}</td><td>${s.correct}/${s.total} (${s.percent}%)</td></tr>`).join('')}</tbody></table>`
      : '<p>No completed tracked sessions yet.</p>';
  }

  document.getElementById('exportJson').addEventListener('click',()=>NDHCE_TRACKER.exportJSON());
  document.getElementById('exportCsv').addEventListener('click',()=>NDHCE_TRACKER.exportCSV());
  document.getElementById('clearHistory').addEventListener('click',()=>{
    if(confirm('Clear detailed attempt and session history? Existing module summary counters will remain.')){
      NDHCE_TRACKER.clearAll();location.reload();
    }
  });

  renderSummary();renderModules();renderWeak();renderSessions();
})();
