const MIXED_KEY='ndhce_mixed_progress_v2';
const SUBJECTS=(window.MIXED_SOURCES||[]);
function shuffle(a){return [...a].sort(()=>Math.random()-.5)}
function pct(n,d){return d?Math.round(n/d*100):0}
function answerKey(q){return `${q.subjectKey}:${q.id}`}
function getMixedProgress(){try{return JSON.parse(localStorage.getItem(MIXED_KEY))||{attempts:[],subjects:{}}}catch(e){return {attempts:[],subjects:{}}}}
function saveMixedAttempt(result){
  const p=getMixedProgress();p.attempts.unshift(result);p.attempts=p.attempts.slice(0,20);
  for(const [k,v] of Object.entries(result.subjects)){p.subjects[k]=p.subjects[k]||{done:0,correct:0,name:v.name};p.subjects[k].done+=v.done;p.subjects[k].correct+=v.correct}
  localStorage.setItem(MIXED_KEY,JSON.stringify(p));
}
function balancedExam(count){
  const groups=SUBJECTS.map(s=>({name:s.name,key:s.key,bank:shuffle(s.bank)})),out=[];let cursor=0;
  while(out.length<count&&groups.some(g=>g.bank.length)){const g=groups[cursor%groups.length];if(g.bank.length)out.push(g.bank.pop());cursor++;}
  return NDHCE_CHOICES.balanceBank(shuffle(out));
}
function startMixedExam(){
  const count=Number(document.getElementById('examLength')?.value||30);
  let order=balancedExam(count),i=0,answers={},remaining=Math.max(25,Math.round(count*1.25))*60,timerId;
  const trackingStartedAt=Date.now(),trackingSession=window.NDHCE_TRACKER?NDHCE_TRACKER.uid('mixed_exam'):'mixed_'+Date.now();
  const stem=document.getElementById('stem'),choices=document.getElementById('choices'),counter=document.getElementById('counter'),bar=document.getElementById('bar'),concept=document.getElementById('concept'),subject=document.getElementById('subject'),timer=document.getElementById('timer'),next=document.getElementById('next'),prev=document.getElementById('prev'),finish=document.getElementById('finish'),map=document.getElementById('questionMap');
  function drawMap(){map.innerHTML=order.map((q,n)=>`<button class="${n===i?'current ':''}${answers[answerKey(q)]!==undefined?'answered':''}" data-n="${n}">${n+1}</button>`).join('');map.querySelectorAll('button').forEach(b=>b.onclick=()=>{i=Number(b.dataset.n);load()});}
  function load(){const q=order[i],key=answerKey(q);counter.textContent=`Question ${i+1} of ${order.length}`;bar.style.width=`${(i+1)/order.length*100}%`;stem.innerHTML=q.stem;concept.textContent=q.concept||'Mixed';subject.textContent=q.subject;choices.innerHTML='';q.choices.forEach((c,idx)=>{const b=document.createElement('button');b.className='choice'+(answers[key]===idx?' selected':'');b.innerHTML=`${String.fromCharCode(65+idx)}. ${c}`;b.onclick=()=>{answers[key]=idx;load()};choices.appendChild(b)});prev.disabled=i===0;next.disabled=i===order.length-1;drawMap();}
  function tick(){remaining--;const m=Math.floor(remaining/60),s=remaining%60;timer.textContent=`${m}:${String(s).padStart(2,'0')}`;if(remaining<=0)submit();}
  function submit(){
    clearInterval(timerId);let correct=0;const by={};
    order.forEach(q=>{const selected=answers[answerKey(q)],ok=selected===q.answer;if(ok)correct++;by[q.subjectKey]=by[q.subjectKey]||{name:q.subject,done:0,correct:0};by[q.subjectKey].done++;if(ok)by[q.subjectKey].correct++;if(window.NDHCE_TRACKER)NDHCE_TRACKER.recordAttempt({module:q.subject,section:'mixed-exam',sessionId:trackingSession,questionId:q.id,concept:q.concept||'Mixed',visual:Boolean(q.image),correct:ok,selectedIndex:selected,correctIndex:q.answer,stem:q.stem});});
    const result={schemaVersion:2,sessionId:trackingSession,date:new Date().toISOString(),done:order.length,correct,subjects:by};saveMixedAttempt(result);
    if(window.NDHCE_TRACKER)NDHCE_TRACKER.recordSession({sessionId:trackingSession,module:'Mixed NDHCE',section:'mixed-exam',mode:'Mixed Mock Exam',total:order.length,correct,durationSeconds:Math.max(0,Math.round((Date.now()-trackingStartedAt)/1000))});
    const subjectRows=Object.values(by).sort((a,b)=>pct(a.correct,a.done)-pct(b.correct,b.done)).map(x=>`<div class="subject-result"><span>${x.name}</span><strong>${x.correct}/${x.done} · ${pct(x.correct,x.done)}%</strong></div>`).join('');
    const review=order.map((q,n)=>{const selected=answers[answerKey(q)];const html=window.NDHCE_TRACKER?NDHCE_TRACKER.renderQuestionReview(q,selected,n+1,q.subject):`<div class="review-card"><h3>${n+1}. ${q.stem}</h3><p>${q.why||''}</p></div>`;return html.replace('<div class="review-card">',`<div class="review-card"><span class="subject-pill">${q.subject}</span>`);}).join('');
    document.getElementById('exam').innerHTML=`<section class="card center"><div class="score-big">${correct}/${order.length}</div><h2>Mixed Mock Complete</h2><p>${pct(correct,order.length)}% correct</p><div class="hero-actions"><a class="button primary" href="overall-dashboard.html">Overall dashboard</a><a class="button secondary" href="mixed-exam.html">New exam</a><a class="button secondary" href="index.html">Home</a></div></section><section class="card"><h2>Results by subject</h2>${subjectRows}</section><section class="card"><h2>Answer review</h2>${review}</section>`;
  }
  prev.onclick=()=>{if(i>0){i--;load();}};next.onclick=()=>{if(i<order.length-1){i++;load();}};finish.onclick=()=>{if(confirm('Submit this mixed mock exam? / 提交综合模拟考试？'))submit();};timer.textContent=`${Math.max(25,Math.round(count*1.25))}:00`;timerId=setInterval(tick,1000);load();
}
