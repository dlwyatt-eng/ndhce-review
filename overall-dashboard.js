
const MODULE_KEYS=[
 {name:'Pharmacology',key:'ndhce_pharm_progress_v1',href:'pharm-dashboard.html'},
 {name:'Process of Care',key:'ndhce_poc_progress_v1',href:'poc-dashboard.html'},
 {name:'Medical Emergencies',key:'ndhce_med_progress_v1',href:'med-dashboard.html'},
 {name:'Special Needs',key:'ndhce_sn_progress_v1',href:'sn-dashboard.html'},
 {name:'Oral Pathology',key:'ndhce_path_progress_v1',href:'path-dashboard.html'},
 {name:'Periodontology',key:'ndhce_perio_progress_v1',href:'perio-dashboard.html'},
 {name:'Law & Ethics',key:'ndhce_law_progress_v1',href:'law-dashboard.html'},
 {name:'Community Oral Health & Research',key:'ndhce_community_progress_v1',href:'community-dashboard.html'},
 {name:'Radiology',key:'ndhce_radiology_progress_v1',href:'radiology-dashboard.html'},
 {name:'Indices',key:'ndhce_indices_progress_v4',href:'indices-dashboard.html'}
];
function read(k){try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}}
function percent(c,d){return d?Math.round(c/d*100):0}
function renderOverall(){const cards=MODULE_KEYS.map(m=>{const p=read(m.key)||{};const sections=p.sections||{};let done=0,correct=0;Object.values(sections).forEach(x=>{done+=Number(x.done||0);correct+=Number(x.correct||0)});const sc=percent(correct,done);return {m,done,correct,sc}});const attempted=cards.filter(x=>x.done);const totalDone=attempted.reduce((s,x)=>s+x.done,0),totalCorrect=attempted.reduce((s,x)=>s+x.correct,0);document.getElementById('summary').innerHTML=`<div class="stat"><span>Total attempts</span><strong>${totalDone}</strong><small>Across all modules</small></div><div class="stat"><span>Overall accuracy</span><strong>${percent(totalCorrect,totalDone)}%</strong><small>${totalCorrect} correct</small></div><div class="stat"><span>Subjects practiced</span><strong>${attempted.length}</strong><small>of ${MODULE_KEYS.length}</small></div>`;document.getElementById('modules').innerHTML=cards.map(x=>`<a class="overall-card" href="${x.m.href}"><h3>${x.m.name}</h3><p><b>${x.done}</b> answered · <b>${x.sc}%</b> correct</p><div class="meter"><span style="width:${x.sc}%"></span></div></a>`).join('');const mix=read('ndhce_mixed_progress_v1')||{attempts:[],subjects:{}};document.getElementById('mixed').innerHTML=mix.attempts.length?mix.attempts.slice(0,5).map((a,i)=>`<div class="subject-result"><span>${new Date(a.date).toLocaleDateString()} · ${a.done} questions</span><strong>${a.correct}/${a.done} · ${percent(a.correct,a.done)}%</strong></div>`).join(''):'<p class="muted">No mixed exams completed yet.</p>';const weak=Object.values(mix.subjects||{}).filter(x=>x.done>=2).sort((a,b)=>percent(a.correct,a.done)-percent(b.correct,b.done)).slice(0,4);document.getElementById('weak').innerHTML=weak.length?weak.map(x=>`<div class="subject-result"><span>${x.name}</span><strong>${percent(x.correct,x.done)}%</strong></div>`).join(''):'<p class="muted">Complete a mixed exam to identify cross-subject weak areas.</p>'}
