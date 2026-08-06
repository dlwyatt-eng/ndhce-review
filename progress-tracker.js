(function(){
  const STORE_KEY='ndhce_progress_v2';
  const LEGACY_ATTEMPTS_KEY='ndhce_attempt_history_v1';
  const LEGACY_SESSIONS_KEY='ndhce_session_history_v1';
  const MAX_ATTEMPTS=10000;
  const MAX_SESSIONS=2000;
  const MAX_ACTIVITIES=2000;
  const DAY=86400000;

  const MODULE_CONFIG={
    'Pharmacology':{practice:'pharm-practice-session.html?mode=weak',source:'Pharmacology course manual'},
    'Process of Care':{practice:'poc-practice-session.html?mode=weak',source:'Process of Care course manual'},
    'Medical Emergencies':{practice:'med-practice-session.html?mode=weak',source:'Medical Emergencies course manual'},
    'Special Needs':{practice:'sn-practice-session.html?mode=weak',source:'Special Needs course manual'},
    'Medical Conditions & Special Needs':{practice:'sn-practice-session.html?mode=weak',source:'Special Needs course manual'},
    'Oral Pathology':{practice:'path-practice-session.html?mode=weak',source:'Pathology course manual'},
    'Periodontology':{practice:'perio-practice-session.html?mode=weak',source:'Periodontology course manual'},
    'Law & Ethics':{practice:'law-practice-session.html?mode=weak',source:'Law and Ethics course manual'},
    'Community Oral Health & Research':{practice:'community-practice-session.html?mode=weak',source:'Community Oral Health and Research course manual'},
    'Radiology':{practice:'radiology-practice-session.html?mode=weak',source:'Radiology course manual'},
    'Indices':{practice:'indices-practice-session.html?mode=weak',source:'Community Oral Health and Research course manual'}
  };

  function blank(){return {version:2,createdAt:now(),updatedAt:now(),attempts:[],sessions:[],activities:[],legacySummaries:{},migration:{}};}
  function now(){return new Date().toISOString();}
  function uid(prefix){return prefix+'_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,8);}
  function parse(key,fallback){try{const v=JSON.parse(localStorage.getItem(key));return v==null?fallback:v;}catch(e){return fallback;}}
  function cleanText(value){
    const div=document.createElement('div');div.innerHTML=String(value||'');
    return (div.textContent||div.innerText||'').trim();
  }
  function normalizeModule(name){return name==='Medical Conditions & Special Needs'?'Special Needs':(name||'Unknown');}
  function questionKey(module,id){return normalizeModule(module)+'|'+String(id??'');}
  function validData(value){return value&&value.version===2&&Array.isArray(value.attempts)&&Array.isArray(value.sessions)&&Array.isArray(value.activities);}
  function write(data){data.updatedAt=now();localStorage.setItem(STORE_KEY,JSON.stringify(data));return data;}

  function migrate(){
    const existing=parse(STORE_KEY,null);
    if(validData(existing))return existing;
    const data=blank();
    const oldAttempts=parse(LEGACY_ATTEMPTS_KEY,[]);
    const oldSessions=parse(LEGACY_SESSIONS_KEY,[]);
    if(Array.isArray(oldAttempts)){
      const seen=new Set();
      oldAttempts.forEach((row,index)=>{
        const module=normalizeModule(row.module);
        const key=questionKey(module,row.questionId);
        const firstAttempt=!seen.has(key);seen.add(key);
        data.attempts.push({...row,attemptId:row.attemptId||uid('migrated'),module,questionKey:key,firstAttempt,timestamp:row.timestamp||now(),migrated:true,legacyOrder:index});
      });
    }
    if(Array.isArray(oldSessions))data.sessions=oldSessions.map(s=>({...s,module:normalizeModule(s.module),sessionId:s.sessionId||uid('migrated_session'),migrated:true}));
    const legacyKeys={
      ndhce_pharm_progress_v1:'Pharmacology',ndhce_poc_progress_v1:'Process of Care',ndhce_med_progress_v1:'Medical Emergencies',
      ndhce_sn_progress_v1:'Special Needs',ndhce_path_progress_v1:'Oral Pathology',ndhce_perio_progress_v1:'Periodontology',
      ndhce_law_progress_v1:'Law & Ethics',ndhce_community_progress_v1:'Community Oral Health & Research',
      ndhce_radiology_progress_v1:'Radiology',ndhce_indices_progress_v4:'Indices'
    };
    Object.entries(legacyKeys).forEach(([key,module])=>{const value=parse(key,null);if(value)data.legacySummaries[module]=value;});
    const mixed=parse('ndhce_mixed_progress_v2',null);
    if(mixed&&Array.isArray(mixed.attempts)){
      mixed.attempts.forEach(result=>{
        const sessionId=result.sessionId||uid('migrated_mixed');
        if(!data.sessions.some(s=>s.section==='mixed-exam'&&s.timestamp===result.date&&s.total===result.done)){
          data.sessions.push({sessionId,timestamp:result.date||now(),module:'Mixed NDHCE',section:'mixed-exam',mode:'Mixed Mock Exam',total:Number(result.done)||0,correct:Number(result.correct)||0,percent:Number(result.done)?Math.round(Number(result.correct)/Number(result.done)*100):0,durationSeconds:0,migrated:true});
        }
      });
    }
    data.migration={completedAt:now(),attemptsFromV1:data.attempts.length,sessionsFromV1:data.sessions.length};
    return write(data);
  }

  function getData(){const data=parse(STORE_KEY,null);return validData(data)?data:migrate();}
  function getAttempts(filters={}){
    return getData().attempts.filter(row=>(!filters.module||normalizeModule(row.module)===normalizeModule(filters.module))&&(!filters.section||row.section===filters.section));
  }
  function getSessions(filters={}){
    return getData().sessions.filter(row=>(!filters.module||normalizeModule(row.module)===normalizeModule(filters.module))&&(!filters.section||row.section===filters.section));
  }
  function getActivities(filters={}){
    return getData().activities.filter(row=>(!filters.module||normalizeModule(row.module)===normalizeModule(filters.module))&&(!filters.type||row.type===filters.type));
  }
  function recordAttempt(input){
    const data=getData(),module=normalizeModule(input.module),key=questionKey(module,input.questionId);
    const previous=data.attempts.filter(a=>a.questionKey===key||questionKey(a.module,a.questionId)===key);
    const row={
      attemptId:uid('attempt'),timestamp:input.timestamp||now(),sessionId:input.sessionId||'',module,
      section:input.section||'practice',questionId:String(input.questionId??''),questionKey:key,
      concept:input.concept||'Mixed',visual:Boolean(input.visual),correct:Boolean(input.correct),
      selectedIndex:Number.isInteger(input.selectedIndex)?input.selectedIndex:null,
      correctIndex:Number.isInteger(input.correctIndex)?input.correctIndex:null,
      stem:cleanText(input.stem||''),firstAttempt:previous.length===0,attemptNumber:previous.length+1
    };
    data.attempts.push(row);if(data.attempts.length>MAX_ATTEMPTS)data.attempts.splice(0,data.attempts.length-MAX_ATTEMPTS);write(data);return row;
  }
  function recordSession(input){
    const data=getData();
    const row={sessionId:input.sessionId||uid('session'),timestamp:input.timestamp||now(),module:normalizeModule(input.module),section:input.section||'practice',mode:input.mode||'',total:Number(input.total)||0,correct:Number(input.correct)||0,percent:Number(input.total)?Math.round(Number(input.correct)/Number(input.total)*100):0,durationSeconds:Number(input.durationSeconds)||0};
    const index=data.sessions.findIndex(s=>s.sessionId===row.sessionId);
    if(index>=0)data.sessions[index]=row;else data.sessions.push(row);
    if(data.sessions.length>MAX_SESSIONS)data.sessions.splice(0,data.sessions.length-MAX_SESSIONS);write(data);return row;
  }
  function recordActivity(input){
    const data=getData();const row={activityId:uid('activity'),timestamp:input.timestamp||now(),module:normalizeModule(input.module),type:input.type||'activity',mode:input.mode||'',total:Number(input.total)||0,correct:Number(input.correct)||0,attempts:Number(input.attempts)||0,percent:Number(input.percent)||0,details:input.details||{}};
    data.activities.push(row);if(data.activities.length>MAX_ACTIVITIES)data.activities.splice(0,data.activities.length-MAX_ACTIVITIES);write(data);return row;
  }

  function histories(module){
    const map={};getAttempts({module}).forEach(a=>{const key=String(a.questionId);(map[key]||(map[key]=[])).push(a);});
    Object.values(map).forEach(rows=>rows.sort((a,b)=>String(a.timestamp).localeCompare(String(b.timestamp))));return map;
  }
  function adaptiveScore(q,module,conceptCounts,history){
    const rows=history[String(q.id)]||[],latest=rows[rows.length-1],conceptSeen=conceptCounts[q.concept||'Mixed']||0;
    let score=Math.random()*3;
    if(!rows.length)score+=55;else{
      const everWrong=rows.some(r=>!r.correct),correctAfterLastWrong=(()=>{let lastWrong=-1;rows.forEach((r,i)=>{if(!r.correct)lastWrong=i;});return lastWrong<0||rows.slice(lastWrong+1).some(r=>r.correct);})();
      if(latest&&!latest.correct)score+=125;
      else if(everWrong&&!correctAfterLastWrong)score+=110;
      else if(everWrong)score+=38;
      const age=latest?Date.now()-new Date(latest.timestamp).getTime():0;
      if(age>21*DAY)score+=32;else if(age>7*DAY)score+=18;
      score-=Math.min(rows.length,5)*4;
    }
    score+=Math.max(0,36-conceptSeen*7);
    return score;
  }
  function selectAdaptiveBank(module,bank,limit=18){
    const normalized=normalizeModule(module),history=histories(normalized),conceptSets={};
    Object.entries(history).forEach(([id,rows])=>{if(!rows.length)return;const concept=rows[0].concept||'Mixed';(conceptSets[concept]||(conceptSets[concept]=new Set())).add(id);});
    const conceptCounts=Object.fromEntries(Object.entries(conceptSets).map(([concept,ids])=>[concept,ids.size]));
    return [...bank].map(q=>({q,score:adaptiveScore(q,normalized,conceptCounts,history)})).sort((a,b)=>b.score-a.score).slice(0,Math.min(limit,bank.length)).map(x=>x.q);
  }
  function getModuleProgress(module){
    const attempts=getAttempts({module}),sections={practice:{done:0,correct:0},exam:{done:0,correct:0}},concepts={};
    if(!attempts.length){const legacy=getData().legacySummaries[normalizeModule(module)];if(legacy)return legacy;}
    attempts.forEach(a=>{const section=a.section==='exam'||a.section==='mixed-exam'?'exam':'practice';sections[section].done++;if(a.correct)sections[section].correct++;const c=a.concept||'Mixed';concepts[c]=concepts[c]||{done:0,correct:0,unique:new Set()};concepts[c].done++;if(a.correct)concepts[c].correct++;concepts[c].unique.add(a.questionId);});
    Object.values(concepts).forEach(x=>x.unique=x.unique.size);return {sections,concepts,lastMode:'weak'};
  }
  function getInsights(){
    const attempts=getAttempts(),first=attempts.filter(a=>a.firstAttempt),byQuestion={};
    attempts.forEach(a=>(byQuestion[a.questionKey]||(byQuestion[a.questionKey]=[])).push(a));
    let corrected=0,unresolved=0;Object.values(byQuestion).forEach(rows=>{const wrong=rows.findIndex(r=>!r.correct);if(wrong>=0){if(rows.slice(wrong+1).some(r=>r.correct))corrected++;else unresolved++;}});
    return {attempts,first,unique:Object.keys(byQuestion).length,corrected,unresolved};
  }
  function sourceFor(module,q){return q.source||q.reference||(MODULE_CONFIG[normalizeModule(module)]||{}).source||'Course review manual';}
  function renderQuestionReview(q,user,n,module){
    const letter=i=>String.fromCharCode(65+i),rationales=q.rationales||[];
    const visual=q.image?`<img class="review-visual" src="${q.image}" alt="${q.imageAlt||'Question visual'}">`:'';
    const options=q.choices.map((choice,index)=>{const raw=rationales[index]||{};const correct=index===q.answer;const en=raw.en||(correct?q.why:'This option does not best match the scenario.');const zh=raw.zh||(correct?q.zh:'此选项不是最符合题目情境的答案。');return `<div class="rationale ${correct?'correct':'wrong'}"><b>${letter(index)}. ${choice}${correct?' ✓':''}</b><br>${en||''}<span class="zh">${zh||''}</span></div>`;}).join('');
    const steps=q.steps&&q.steps.length?`<div class="fact"><b>Worked steps / 解题步骤</b>${q.steps.map((s,i)=>`<div class="step">${i+1}. ${s}</div>`).join('')}</div>`:'';
    const pearl=q.pearl?`<div class="pearl"><b>NDHCE Pearl</b><br>${q.pearl}</div>`:'';
    return `<div class="review-card">${visual}<h3>${n}. ${q.stem}</h3><p><b>Your answer:</b> ${user===undefined?'Not answered':letter(user)+'. '+q.choices[user]}</p><p><b>Correct answer:</b> ${letter(q.answer)}. ${q.choices[q.answer]}</p>${options}${steps}${pearl}<p class="muted"><b>Review source:</b> ${sourceFor(module,q)}</p></div>`;
  }

  function storageSnapshot(){const values={};for(let i=0;i<localStorage.length;i++){const key=localStorage.key(i);if(key&&key.startsWith('ndhce_'))values[key]=localStorage.getItem(key);}return values;}
  function download(name,text,type){const blob=new Blob([text],{type:type||'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  function exportJSON(){const payload={format:'ndhce-progress-backup',version:2,exportedAt:now(),storage:storageSnapshot()};download('ndhce-progress-backup.json',JSON.stringify(payload,null,2),'application/json');return payload;}
  function importJSON(value){
    const payload=typeof value==='string'?JSON.parse(value):value;
    if(!payload||payload.format!=='ndhce-progress-backup'||payload.version!==2||!payload.storage||typeof payload.storage!=='object')throw new Error('This is not a valid NDHCE progress backup.');
    const incoming=JSON.parse(payload.storage[STORE_KEY]||'null');if(!validData(incoming))throw new Error('The backup does not contain valid unified progress data.');
    Object.entries(payload.storage).forEach(([key,val])=>{if(key.startsWith('ndhce_')&&typeof val==='string')localStorage.setItem(key,val);});
    return getData();
  }
  function csvEscape(v){const s=String(v??'');return /[",\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s;}
  function exportCSV(){const headers=['timestamp','module','section','sessionId','questionId','concept','visual','correct','selectedIndex','correctIndex','firstAttempt','attemptNumber','stem'];const lines=[headers.join(',')];getAttempts().forEach(row=>lines.push(headers.map(h=>csvEscape(row[h])).join(',')));download('ndhce-attempt-history.csv',lines.join('\n'),'text/csv;charset=utf-8');}
  function clearAll(){Object.keys(storageSnapshot()).forEach(key=>localStorage.removeItem(key));}
  function clearModule(module){const data=getData(),name=normalizeModule(module);data.attempts=data.attempts.filter(x=>normalizeModule(x.module)!==name);data.sessions=data.sessions.filter(x=>normalizeModule(x.module)!==name);data.activities=data.activities.filter(x=>normalizeModule(x.module)!==name);delete data.legacySummaries[name];write(data);}

  migrate();
  window.NDHCE_TRACKER={STORE_KEY,uid,questionKey,recordAttempt,recordSession,recordActivity,getData,getAttempts,getSessions,getActivities,getInsights,getModuleProgress,selectAdaptiveBank,renderQuestionReview,sourceFor,exportJSON,importJSON,exportCSV,clearAll,clearModule,moduleConfig:MODULE_CONFIG};
})();
