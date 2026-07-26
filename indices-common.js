
const KEY='ndhce_indices_progress_v2';
function getProgress(){
  try{return JSON.parse(localStorage.getItem(KEY))||{academy:0,calculation:{done:0,correct:0},clinical:{done:0,correct:0},challenge:{done:0,correct:0}}}
  catch(e){return {academy:0,calculation:{done:0,correct:0},clinical:{done:0,correct:0},challenge:{done:0,correct:0}}}
}
function saveProgress(p){localStorage.setItem(KEY,JSON.stringify(p))}
function record(section,correct){
  const p=getProgress();
  p[section]=p[section]||{done:0,correct:0};
  p[section].done++; if(correct)p[section].correct++;
  saveProgress(p); return p;
}
function pct(n,d){return d?Math.round(n/d*100):0}
function renderMiniStats(id){
  const p=getProgress(), el=document.getElementById(id); if(!el)return;
  const parts=['calculation','clinical','challenge'].map(k=>({k,...p[k]}));
  el.innerHTML=parts.map(x=>`<div class="stat"><span>${x.k[0].toUpperCase()+x.k.slice(1)}</span><strong>${x.done||0}</strong><small>${pct(x.correct||0,x.done||0)}% correct</small></div>`).join('');
}
function resetIndicesProgress(){
  if(confirm('Reset all Indices progress? / 重置所有指数进度？')){localStorage.removeItem(KEY);location.reload()}
}
function shuffle(a){return [...a].sort(()=>Math.random()-.5)}
function startQuiz(bank,section,title){
  let order=shuffle(bank), i=0, score=0, locked=false;
  const stem=document.getElementById('stem'), choices=document.getElementById('choices'),
        feedback=document.getElementById('feedback'), next=document.getElementById('next'),
        counter=document.getElementById('counter'), bar=document.getElementById('bar'),
        level=document.getElementById('level'), data=document.getElementById('data'),
        workspace=document.getElementById('workspace');
  function load(){
    locked=false; feedback.classList.add('hidden'); next.classList.add('hidden');
    const q=order[i]; counter.textContent=`Question ${i+1} of ${order.length}`;
    bar.style.width=`${i/order.length*100}%`; stem.innerHTML=q.stem;
    level.textContent=q.level||title; data.innerHTML=q.data||''; choices.innerHTML='';
    if(workspace)workspace.value='';
    q.choices.forEach((c,idx)=>{
      const b=document.createElement('button'); b.className='choice'; b.innerHTML=`${String.fromCharCode(65+idx)}. ${c}`;
      b.onclick=()=>answer(idx,b); choices.appendChild(b);
    });
  }
  function answer(idx,btn){
    if(locked)return; locked=true; const q=order[i], correct=idx===q.answer;
    if(correct)score++; record(section,correct);
    [...choices.children].forEach((b,j)=>{b.disabled=true;if(j===q.answer)b.classList.add('correct');else if(j===idx)b.classList.add('wrong')});
    let html=`<h3>${correct?'✅ Correct / 正确':'❌ Review this one / 复习此题'}</h3>`;
    html+=`<div class="rationale correct"><b>Why the correct answer is right / 正确答案解析</b><br>${q.why}<span class="zh">${q.zh}</span></div>`;
    q.choices.forEach((c,j)=>{
      if(j!==q.answer){
        const r=(q.rationales&&q.rationales[j])||{en:'This option does not best match the data or index definition.',zh:'此选项与题目数据或指数定义不最相符。'};
        html+=`<div class="rationale wrong"><b>${String.fromCharCode(65+j)}. ${c}</b><br>${r.en}<span class="zh">${r.zh}</span></div>`;
      }
    });
    if(q.steps)html+=`<div class="fact"><b>Worked steps / 解题步骤</b>${q.steps.map((s,n)=>`<div class="step">${n+1}. ${s}</div>`).join('')}</div>`;
    feedback.innerHTML=html; feedback.classList.remove('hidden'); next.classList.remove('hidden');
  }
  next.onclick=()=>{i++;if(i<order.length)load();else finish()};
  function finish(){
    bar.style.width='100%'; document.getElementById('quiz').innerHTML=`<div class="card center"><div class="score-big">${score}/${order.length}</div><h2>${title} complete</h2><p>${pct(score,order.length)}% correct</p><button class="primary" onclick="location.reload()">Practice again</button> <a class="button secondary" href="indices.html">Back to hub</a></div>`;
  }
  load();
}
