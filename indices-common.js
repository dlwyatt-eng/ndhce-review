
const KEY='ndhce_indices_progress_v3';

function emptyProgress(){
  return {
    academy:0,
    sections:{
      calculation:{done:0,correct:0},
      clinical:{done:0,correct:0},
      challenge:{done:0,correct:0}
    },
    concepts:{}
  };
}
function getProgress(){
  try{
    const raw=JSON.parse(localStorage.getItem(KEY));
    return raw||emptyProgress();
  }catch(e){return emptyProgress()}
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
function renderMiniStats(id){
  const p=getProgress(), el=document.getElementById(id); if(!el)return;
  const labels={calculation:'Calculation',clinical:'Clinical',challenge:'Challenge'};
  el.innerHTML=Object.keys(labels).map(k=>{
    const x=(p.sections&&p.sections[k])||{done:0,correct:0};
    return `<div class="stat"><span>${labels[k]}</span><strong>${x.done}</strong><small>${pct(x.correct,x.done)}% correct</small></div>`;
  }).join('');
}
function resetIndicesProgress(){
  if(confirm('Reset all Indices progress? / 重置所有指数进度？')){
    localStorage.removeItem(KEY);location.reload()
  }
}
function shuffle(a){return [...a].sort(()=>Math.random()-.5)}
function startQuiz(bank,section,title){
  let order=shuffle(bank), i=0, score=0, locked=false;
  const stem=document.getElementById('stem'), choices=document.getElementById('choices'),
        feedback=document.getElementById('feedback'), next=document.getElementById('next'),
        counter=document.getElementById('counter'), bar=document.getElementById('bar'),
        level=document.getElementById('level'), data=document.getElementById('data'),
        workspace=document.getElementById('workspace'), conceptTag=document.getElementById('concept');
  function load(){
    locked=false; feedback.classList.add('hidden'); next.classList.add('hidden');
    const q=order[i]; counter.textContent=`Question ${i+1} of ${order.length}`;
    bar.style.width=`${i/order.length*100}%`; stem.innerHTML=q.stem;
    level.textContent=q.level||title; data.innerHTML=q.data||'';
    if(conceptTag)conceptTag.textContent=q.concept||'Mixed';
    choices.innerHTML='';
    if(workspace)workspace.value='';
    q.choices.forEach((c,idx)=>{
      const b=document.createElement('button'); b.className='choice';
      b.innerHTML=`${String.fromCharCode(65+idx)}. ${c}`;
      b.onclick=()=>answer(idx,b); choices.appendChild(b);
    });
  }
  function answer(idx,btn){
    if(locked)return; locked=true; const q=order[i], correct=idx===q.answer;
    if(correct)score++; record(section,correct,q.concept||'Mixed');
    [...choices.children].forEach((b,j)=>{
      b.disabled=true;
      if(j===q.answer)b.classList.add('correct');
      else if(j===idx)b.classList.add('wrong')
    });
    let html=`<h3>${correct?'✅ Correct / 正确':'❌ Review this one / 复习此题'}</h3>`;
    html+=`<div class="rationale correct"><b>Why the correct answer is right / 正确答案解析</b><br>${q.why}<span class="zh">${q.zh}</span></div>`;
    q.choices.forEach((c,j)=>{
      if(j!==q.answer){
        const raw=(q.rationales&&q.rationales[j])||{};
        const r={
          en: raw.en || 'This option is incorrect because it does not match the calculation, index definition, or clinical interpretation required by the question.',
          zh: raw.zh || '此选项不正确，因为它不符合题目所要求的计算、指数定义或临床解读。'
        };
        html+=`<div class="rationale wrong"><b>${String.fromCharCode(65+j)}. ${c}</b><br>${r.en}<span class="zh">${r.zh}</span></div>`;
      }
    });
    if(q.steps){
      html+=`<div class="fact"><b>Worked steps / 解题步骤</b>${q.steps.map((s,n)=>`<div class="step">${n+1}. ${s}</div>`).join('')}</div>`;
    }
    feedback.innerHTML=html; feedback.classList.remove('hidden'); next.classList.remove('hidden');
  }
  next.onclick=()=>{i++;if(i<order.length)load();else finish()};
  function finish(){
    bar.style.width='100%';
    document.getElementById('quiz').innerHTML=`<div class="card center">
      <div class="score-big">${score}/${order.length}</div>
      <h2>${title} complete</h2><p>${pct(score,order.length)}% correct</p>
      <a class="button primary" href="indices-dashboard.html">View mastery dashboard</a>
      <button class="secondary" onclick="location.reload()">Practice again</button>
      <a class="button secondary" href="indices.html">Back to hub</a>
    </div>`;
  }
  load();
}
