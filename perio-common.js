
const KEY='ndhce_perio_progress_v1';

const TRACKING_MODULE="Periodontology";
function trackingSessionId(section){return window.NDHCE_TRACKER?NDHCE_TRACKER.uid(section):section+'_'+Date.now();}
function trackAttempt(section,q,selectedIndex,correct,sessionId){
  if(!window.NDHCE_TRACKER)return;
  NDHCE_TRACKER.recordAttempt({
    module:TRACKING_MODULE,section,sessionId,
    questionId:q.id,concept:q.concept||'Mixed',visual:Boolean(q.image),
    correct,selectedIndex,correctIndex:q.answer,stem:q.stem,firstAttempt:true
  });
}
function trackSession(section,mode,total,correct,sessionId,startedAt){
  if(!window.NDHCE_TRACKER)return;
  NDHCE_TRACKER.recordSession({
    module:TRACKING_MODULE,section,mode,total,correct,sessionId,
    durationSeconds:Math.max(0,Math.round((Date.now()-startedAt)/1000))
  });
}

function emptyProgress(){
  return {
    sections:{
      practice:{done:0,correct:0},
      exam:{done:0,correct:0}
    },
    concepts:{},
    lastMode:'random'
  };
}
function getProgress(){
  try{return JSON.parse(localStorage.getItem(KEY))||emptyProgress()}
  catch(e){return emptyProgress()}
}
function saveProgress(p){localStorage.setItem(KEY,JSON.stringify(p))}
function pct(n,d){return d?Math.round(n/d*100):0}
function record(section,correct,concept){
  const p=getProgress();
  p.sections=p.sections||emptyProgress().sections;
  p.sections[section]=p.sections[section]||{done:0,correct:0};
  p.sections[section].done++;
  if(correct)p.sections[section].correct++;
  if(concept){
    p.concepts=p.concepts||{};
    p.concepts[concept]=p.concepts[concept]||{done:0,correct:0};
    p.concepts[concept].done++;
    if(correct)p.concepts[concept].correct++;
  }
  saveProgress(p);
  return p;
}
function resetPerioProgress(){
  if(confirm('Reset all Periodontology progress? / 重置所有牙周病学进度？')){
    localStorage.removeItem(KEY);
    location.reload();
  }
}
function shuffle(a){return [...a].sort(()=>Math.random()-.5)}
function weakestConcepts(limit=4){
  const p=getProgress(), entries=Object.entries(p.concepts||{});
  if(!entries.length)return [];
  return entries
    .map(([name,x])=>({name,score:pct(x.correct,x.done),done:x.done}))
    .sort((a,b)=>(a.score-b.score)||(b.done-a.done))
    .slice(0,limit)
    .map(x=>x.name);
}
function selectPracticeBank(bank,mode,concept){
  if(mode==='concept')return bank.filter(q=>q.concept===concept);
  if(mode==='weak'){
    const weak=weakestConcepts(4);
    if(!weak.length)return shuffle(bank).slice(0,12);
    const selected=bank.filter(q=>weak.includes(q.concept));
    return shuffle(selected.length?selected:bank).slice(0,18);
  }
  return shuffle(bank).slice(0,18);
}
function renderMiniStats(id){
  const p=getProgress(), el=document.getElementById(id); if(!el)return;
  const labels={practice:'Practice',exam:'Mock exam'};
  el.innerHTML=Object.keys(labels).map(k=>{
    const x=(p.sections&&p.sections[k])||{done:0,correct:0};
    return `<div class="stat"><span>${labels[k]}</span><strong>${x.done}</strong><small>${pct(x.correct,x.done)}% correct</small></div>`;
  }).join('');
}
function startPractice(bank,title='Practice'){
  let order=NDHCE_CHOICES.balanceBank(bank), i=0, score=0, locked=false;
  const trackingStartedAt=Date.now(), trackingSession=trackingSessionId('practice');
  const stem=document.getElementById('stem'), choices=document.getElementById('choices'),
    feedback=document.getElementById('feedback'), next=document.getElementById('next'),
    counter=document.getElementById('counter'), bar=document.getElementById('bar'),
    level=document.getElementById('level'), data=document.getElementById('data'),
    conceptTag=document.getElementById('concept');
  if(!order.length){
    document.getElementById('quiz').innerHTML=`<div class="card center"><h2>No questions found</h2><p>Try another practice option.</p><a class="button primary" href="perio-practice.html">Back to Practice</a></div>`;
    return;
  }
  function load(){
    locked=false; feedback.classList.add('hidden'); next.classList.add('hidden');
    const q=order[i];
    counter.textContent=`Question ${i+1} of ${order.length}`;
    bar.style.width=`${i/order.length*100}%`;
    stem.innerHTML=q.stem; level.textContent=q.level||title;
    data.innerHTML=q.data||''; if(conceptTag)conceptTag.textContent=q.concept||'Mixed';
    choices.innerHTML='';
    q.choices.forEach((c,idx)=>{
      const b=document.createElement('button'); b.className='choice';
      b.innerHTML=`${String.fromCharCode(65+idx)}. ${c}`;
      b.onclick=()=>answer(idx); choices.appendChild(b);
    });
  }
  function answer(idx){
    if(locked)return; locked=true;
    const q=order[i], correct=idx===q.answer;
    if(correct)score++; record('practice',correct,q.concept||'Mixed');
    trackAttempt('practice',q,idx,correct,trackingSession);
    [...choices.children].forEach((b,j)=>{
      b.disabled=true;
      if(j===q.answer)b.classList.add('correct');
      else if(j===idx)b.classList.add('wrong');
    });
    let html=`<h3>${correct?'✅ Correct / 正确':'❌ Review this one / 复习此题'}</h3>`;
    html+=`<div class="rationale correct"><b>Why the correct answer is right / 正确答案解析</b><br>${q.why}<span class="zh">${q.zh}</span></div>`;
    q.choices.forEach((c,j)=>{
      if(j!==q.answer){
        const raw=(q.rationales&&q.rationales[j])||{};
        const r={
          en:raw.en||'This option does not match the required calculation or interpretation.',
          zh:raw.zh||'此选项不符合题目要求的计算或解读。'
        };
        html+=`<div class="rationale wrong"><b>${String.fromCharCode(65+j)}. ${c}</b><br>${r.en}<span class="zh">${r.zh}</span></div>`;
      }
    });
    if(q.steps)html+=`<div class="fact"><b>Worked steps / 解题步骤</b>${q.steps.map((s,n)=>`<div class="step">${n+1}. ${s}</div>`).join('')}</div>`;
    html+=`<div class="pearl"><b>NDHCE Pearl</b><br>${q.pearl||'Focus on the exact index definition and denominator.'}</div>`;
    html+=`<button class="secondary" onclick="practiceSimilar('${q.concept.replace(/'/g,"\\'")}')">Try another like this</button>`;
    feedback.innerHTML=html; feedback.classList.remove('hidden'); next.classList.remove('hidden');
  }
  window.practiceSimilar=function(concept){
    const matches=shuffle(window.FULL_BANK.filter(q=>q.concept===concept && q.id!==order[i].id));
    if(matches.length){order.splice(i+1,0,matches[0]); next.click();}
  }
  next.onclick=()=>{i++;if(i<order.length)load();else finish()};
  function finish(){
    trackSession('practice',title,order.length,score,trackingSession,trackingStartedAt);
    bar.style.width='100%';
    document.getElementById('quiz').innerHTML=`<div class="card center">
      <div class="score-big">${score}/${order.length}</div><h2>${title} complete</h2>
      <p>${pct(score,order.length)}% correct</p>
      <a class="button primary" href="perio-dashboard.html">View dashboard</a>
      <a class="button secondary" href="perio-practice.html">Choose another practice</a>
      <a class="button secondary" href="periodontology.html">Back to hub</a></div>`;
  }
  load();
}
function startExam(bank,minutes=20){
  let order=NDHCE_CHOICES.balanceBank(shuffle(bank).slice(0,Math.min(30,bank.length))), i=0, answers={}, remaining=minutes*60, timerId;
  const trackingStartedAt=Date.now(), trackingSession=trackingSessionId('exam');
  const stem=document.getElementById('stem'), choices=document.getElementById('choices'),
    counter=document.getElementById('counter'), bar=document.getElementById('bar'),
    level=document.getElementById('level'), data=document.getElementById('data'),
    concept=document.getElementById('concept'), timer=document.getElementById('timer'),
    next=document.getElementById('next'), prev=document.getElementById('prev'), finish=document.getElementById('finish');
  function tick(){
    remaining--; const m=Math.floor(remaining/60),s=remaining%60;
    timer.textContent=`${m}:${String(s).padStart(2,'0')}`;
    if(remaining<=0)submitExam();
  }
  function load(){
    const q=order[i]; counter.textContent=`Question ${i+1} of ${order.length}`;
    bar.style.width=`${i/order.length*100}%`; stem.innerHTML=q.stem;
    level.textContent=q.level||'Mock Exam'; data.innerHTML=q.data||''; concept.textContent=q.concept||'Mixed';
    choices.innerHTML='';
    q.choices.forEach((c,idx)=>{
      const b=document.createElement('button'); b.className='choice';
      if(answers[q.id]===idx)b.classList.add('selected');
      b.innerHTML=`${String.fromCharCode(65+idx)}. ${c}`;
      b.onclick=()=>{answers[q.id]=idx;load()}; choices.appendChild(b);
    });
    prev.disabled=i===0; next.disabled=i===order.length-1;
  }
  prev.onclick=()=>{if(i>0){i--;load()}};
  next.onclick=()=>{if(i<order.length-1){i++;load()}};
  finish.onclick=submitExam;
  function submitExam(){
    clearInterval(timerId);
    let correct=0;
    order.forEach(q=>{
      const ok=answers[q.id]===q.answer;
      if(ok)correct++;
      record('exam',ok,q.concept||'Mixed');
      trackAttempt('exam',q,answers[q.id],ok,trackingSession);
    });
    trackSession('exam','Mock Exam',order.length,correct,trackingSession,trackingStartedAt);
    const review=order.map((q,n)=>{
      const user=answers[q.id];
      return `<div class="review-card"><h3>${n+1}. ${q.stem}</h3>
      <p><b>Your answer:</b> ${user===undefined?'Not answered':String.fromCharCode(65+user)+'. '+q.choices[user]}</p>
      <p><b>Correct answer:</b> ${String.fromCharCode(65+q.answer)}. ${q.choices[q.answer]}</p>
      <p>${q.why}</p><span class="zh">${q.zh}</span></div>`;
    }).join('');
    document.getElementById('exam').innerHTML=`<div class="card center"><div class="score-big">${correct}/${order.length}</div>
    <h2>Mock Exam Complete</h2><p>${pct(correct,order.length)}% correct</p>
    <a class="button primary" href="perio-dashboard.html">View dashboard</a></div>
    <section class="card"><h2>Answer Review</h2>${review}</section>`;
  }
  timer.textContent=`${minutes}:00`; timerId=setInterval(tick,1000); load();
}
