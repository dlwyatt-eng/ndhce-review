
const KEY='ndhce_indices_progress_v4';
const BOOKMARK_KEY='ndhce_indices_bookmarks_v4';

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
function getBookmarks(){
  try{return JSON.parse(localStorage.getItem(BOOKMARK_KEY))||[]}
  catch(e){return []}
}
function saveBookmarks(ids){localStorage.setItem(BOOKMARK_KEY,JSON.stringify(ids))}
function isBookmarked(id){return getBookmarks().includes(id)}
function toggleBookmark(id){
  const ids=getBookmarks(), i=ids.indexOf(id);
  if(i>=0)ids.splice(i,1); else ids.push(id);
  saveBookmarks(ids);
  return ids.includes(id);
}
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
function resetIndicesProgress(){
  if(confirm('Reset all Indices progress and bookmarks? / 重置所有指数进度和书签？')){
    localStorage.removeItem(KEY);
    localStorage.removeItem(BOOKMARK_KEY);
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
  const bookmarks=getBookmarks();
  if(mode==='bookmarks')return bank.filter(q=>bookmarks.includes(q.id));
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
  let order=bank, i=0, score=0, locked=false;
  const stem=document.getElementById('stem'), choices=document.getElementById('choices'),
    feedback=document.getElementById('feedback'), next=document.getElementById('next'),
    counter=document.getElementById('counter'), bar=document.getElementById('bar'),
    level=document.getElementById('level'), data=document.getElementById('data'),
    workspace=document.getElementById('workspace'), conceptTag=document.getElementById('concept'),
    bookmark=document.getElementById('bookmark');
  if(!order.length){
    document.getElementById('quiz').innerHTML=`<div class="card center"><h2>No questions found</h2><p>Try another practice option or bookmark a question first.</p><a class="button primary" href="indices-practice.html">Back to Practice</a></div>`;
    return;
  }
  function paintBookmark(q){
    if(!bookmark)return;
    bookmark.textContent=isBookmarked(q.id)?'★ Bookmarked':'☆ Bookmark';
    bookmark.onclick=()=>{const on=toggleBookmark(q.id);bookmark.textContent=on?'★ Bookmarked':'☆ Bookmark'};
  }
  function load(){
    locked=false; feedback.classList.add('hidden'); next.classList.add('hidden');
    const q=order[i];
    counter.textContent=`Question ${i+1} of ${order.length}`;
    bar.style.width=`${i/order.length*100}%`;
    stem.innerHTML=q.stem; level.textContent=q.level||title;
    data.innerHTML=q.data||''; if(conceptTag)conceptTag.textContent=q.concept||'Mixed';
    choices.innerHTML=''; if(workspace)workspace.value='';
    paintBookmark(q);
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
    bar.style.width='100%';
    document.getElementById('quiz').innerHTML=`<div class="card center">
      <div class="score-big">${score}/${order.length}</div><h2>${title} complete</h2>
      <p>${pct(score,order.length)}% correct</p>
      <a class="button primary" href="indices-dashboard.html">View dashboard</a>
      <a class="button secondary" href="indices-practice.html">Choose another practice</a>
      <a class="button secondary" href="indices.html">Back to hub</a></div>`;
  }
  load();
}
function startExam(bank,minutes=20){
  let order=shuffle(bank).slice(0,20), i=0, answers={}, remaining=minutes*60, timerId;
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
    });
    const review=order.map((q,n)=>{
      const user=answers[q.id];
      return `<div class="review-card"><h3>${n+1}. ${q.stem}</h3>
      <p><b>Your answer:</b> ${user===undefined?'Not answered':String.fromCharCode(65+user)+'. '+q.choices[user]}</p>
      <p><b>Correct answer:</b> ${String.fromCharCode(65+q.answer)}. ${q.choices[q.answer]}</p>
      <p>${q.why}</p><span class="zh">${q.zh}</span></div>`;
    }).join('');
    document.getElementById('exam').innerHTML=`<div class="card center"><div class="score-big">${correct}/${order.length}</div>
    <h2>Mock Exam Complete</h2><p>${pct(correct,order.length)}% correct</p>
    <a class="button primary" href="indices-dashboard.html">View dashboard</a></div>
    <section class="card"><h2>Answer Review</h2>${review}</section>`;
  }
  timer.textContent=`${minutes}:00`; timerId=setInterval(tick,1000); load();
}
