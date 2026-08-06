(function(){
  const attempts=NDHCE_TRACKER.getAttempts(),sessions=NDHCE_TRACKER.getSessions(),activities=NDHCE_TRACKER.getActivities();
  const pct=(c,t)=>t?Math.round(c/t*100):0;
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const group=(rows,keyFn)=>{const out={};rows.forEach(r=>{const key=keyFn(r);(out[key]||(out[key]=[])).push(r)});return out;};
  const first=attempts.filter(a=>a.firstAttempt);
  const insights=NDHCE_TRACKER.getInsights();

  function renderSummary(){
    const visual=first.filter(a=>a.visual),firstCorrect=first.filter(a=>a.correct).length;
    document.getElementById('summary').innerHTML=[
      ['Questions seen',insights.unique,'Unique questions'],
      ['First-try accuracy',pct(firstCorrect,first.length)+'%',first.length+' first attempts'],
      ['Mistakes corrected',insights.corrected,insights.unresolved+' still to revisit'],
      ['Visual first-try',visual.length?pct(visual.filter(a=>a.correct).length,visual.length)+'%':'—',visual.length+' visual questions']
    ].map(x=>`<div class="progress-card"><h3>${x[0]}</h3><div class="big">${x[1]}</div><small>${x[2]}</small></div>`).join('');
  }

  function trend(items){
    const rows=items.filter(a=>a.firstAttempt).sort((a,b)=>String(a.timestamp).localeCompare(String(b.timestamp)));
    if(rows.length<8)return {text:'Building baseline',delta:null};
    const recent=rows.slice(-Math.min(10,Math.floor(rows.length/2))),prior=rows.slice(-recent.length*2,-recent.length);
    const delta=pct(recent.filter(x=>x.correct).length,recent.length)-pct(prior.filter(x=>x.correct).length,prior.length);
    return {text:(delta>0?'+':'')+delta+' pts',delta};
  }
  function renderModules(){
    if(!attempts.length){document.getElementById('modules').innerHTML='<p>No question attempts yet. Start Random Practice to establish a baseline.</p>';return;}
    const rows=Object.entries(group(attempts,a=>a.module)).map(([name,items])=>{
      const firstRows=items.filter(x=>x.firstAttempt),unique=new Set(items.map(x=>x.questionId)).size,t=trend(items);
      return {name,total:items.length,unique,accuracy:pct(firstRows.filter(x=>x.correct).length,firstRows.length),sample:firstRows.length,trend:t.text};
    });
    const detailed=new Set(rows.map(r=>r.name));
    Object.entries(NDHCE_TRACKER.getData().legacySummaries||{}).forEach(([name,summary])=>{if(detailed.has(name))return;const sections=summary.sections||{},total=Object.values(sections).reduce((n,x)=>n+(Number(x.done)||0),0),correct=Object.values(sections).reduce((n,x)=>n+(Number(x.correct)||0),0);if(total)rows.push({name,total,unique:'—',accuracy:pct(correct,total),sample:0,trend:'Previous summary'});});
    rows.sort((a,b)=>b.total-a.total);
    document.getElementById('modules').innerHTML=`<table class="progress-table"><thead><tr><th>Module</th><th>Seen</th><th>First-try accuracy</th><th>Recent change</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${esc(r.name)}</td><td>${r.unique}</td><td><div>${r.sample?r.accuracy+'%':'—'} <small>(${r.sample})</small></div><div class="bar-track"><div class="bar-fill" style="width:${r.accuracy}%"></div></div></td><td>${r.trend}</td></tr>`).join('')}</tbody></table>`;
  }

  function conceptRows(){
    return Object.entries(group(attempts,a=>a.module+'|||'+a.concept)).map(([key,items])=>{
      const [module,concept]=key.split('|||'),firstRows=items.filter(x=>x.firstAttempt),unique=new Set(items.map(x=>x.questionId)).size;
      const byQuestion=group(items,x=>x.questionId);let unresolved=0;
      Object.values(byQuestion).forEach(rows=>{if(rows.some(x=>!x.correct)&&!rows[rows.length-1].correct)unresolved++;});
      const accuracy=pct(firstRows.filter(x=>x.correct).length,firstRows.length);
      const status=unique<3?'Building sample':unresolved?'Needs review':accuracy<70?'Developing':accuracy>=85&&unique>=5?'Strong':'Keep practising';
      return {module,concept,total:items.length,unique,first:firstRows.length,accuracy,unresolved,status};
    });
  }
  function renderRecommendation(rows){
    const ranked=rows.filter(r=>r.unresolved||r.unique<3||r.accuracy<75).sort((a,b)=>b.unresolved-a.unresolved||a.accuracy-b.accuracy||a.unique-b.unique);
    const el=document.getElementById('recommendation');
    if(!attempts.length){el.innerHTML='<h2>Study this next</h2><p>Start with Random Practice in a priority subject. After a few answers, this recommendation will use Meng’s own results.</p><a class="button primary" href="community-practice-session.html?mode=random">Start Community practice</a>';return;}
    const next=ranked[0];if(!next){el.innerHTML='<h2>Study this next</h2><p>No clear weak area yet. A mixed mock exam will broaden the sample.</p><a class="button primary" href="mixed-exam.html">Start mixed mock</a>';return;}
    const config=NDHCE_TRACKER.moduleConfig[next.module]||{};
    const why=next.unresolved?`${next.unresolved} missed question${next.unresolved===1?'':'s'} still need a correct revisit.`:next.unique<3?'The sample is still too small to judge mastery.':`First-try accuracy is ${next.accuracy}% across ${next.first} question${next.first===1?'':'s'}.`;
    el.innerHTML=`<h2>Study this next</h2><p><b>${esc(next.module)} — ${esc(next.concept)}</b></p><p>${why}</p><a class="button primary" href="${config.practice||'index.html'}">Start adaptive Weak Areas</a>`;
  }
  function renderWeak(){
    const rows=conceptRows();renderRecommendation(rows);
    const ranked=rows.filter(x=>x.unresolved||x.unique<3||x.accuracy<75).sort((a,b)=>b.unresolved-a.unresolved||a.accuracy-b.accuracy||a.unique-b.unique).slice(0,12);
    document.getElementById('weakAreas').innerHTML=ranked.length?`<table class="progress-table"><thead><tr><th>Module</th><th>Concept</th><th>Sample</th><th>First try</th><th>Status</th></tr></thead><tbody>${ranked.map(r=>`<tr><td>${esc(r.module)}</td><td>${esc(r.concept)}</td><td>${r.unique} unique</td><td>${r.first?r.accuracy+'%':'—'}</td><td>${r.status}${r.unresolved?` · ${r.unresolved} unresolved`:''}</td></tr>`).join('')}</tbody></table>`:'<p>Weak areas will appear as Meng answers questions.</p>';
  }

  function renderSessions(){
    const activitySessions=activities.map(a=>({timestamp:a.timestamp,module:a.module,section:a.type,mode:a.mode,total:a.total,correct:a.correct,percent:a.percent,attempts:a.attempts}));
    const recent=[...sessions,...activitySessions].sort((a,b)=>String(b.timestamp).localeCompare(String(a.timestamp))).slice(0,20);
    document.getElementById('sessions').innerHTML=recent.length?`<table class="progress-table"><thead><tr><th>Date</th><th>Module</th><th>Type</th><th>Score</th></tr></thead><tbody>${recent.map(s=>`<tr><td>${new Date(s.timestamp).toLocaleString()}</td><td>${esc(s.module)}</td><td>${esc(s.mode||s.section)}</td><td>${s.section==='matching'?`${s.percent}% across ${s.attempts} attempts`:s.total?`${s.correct}/${s.total} (${s.percent}%)`:'Completed'}</td></tr>`).join('')}</tbody></table>`:'<p>No completed sessions yet.</p>';
  }

  function setImportStatus(message,kind=''){const el=document.getElementById('importStatus');el.textContent=message;el.className='notice '+kind;}
  document.getElementById('exportJson').addEventListener('click',()=>NDHCE_TRACKER.exportJSON());
  document.getElementById('exportCsv').addEventListener('click',()=>NDHCE_TRACKER.exportCSV());
  document.getElementById('importJson').addEventListener('click',()=>document.getElementById('importFile').click());
  document.getElementById('importFile').addEventListener('change',event=>{
    const file=event.target.files&&event.target.files[0];if(!file)return;
    const reader=new FileReader();reader.onload=()=>{try{NDHCE_TRACKER.importJSON(reader.result);setImportStatus('Backup restored successfully. Reloading…','success');setTimeout(()=>location.reload(),500);}catch(error){setImportStatus(error.message||'Could not restore this backup.','error');}};reader.onerror=()=>setImportStatus('Could not read that file.','error');reader.readAsText(file);
  });
  document.getElementById('clearHistory').addEventListener('click',()=>{if(confirm('Clear all NDHCE progress on this device? This cannot be undone unless you exported a backup.')){NDHCE_TRACKER.clearAll();location.reload();}});

  renderSummary();renderModules();renderWeak();renderSessions();
})();
