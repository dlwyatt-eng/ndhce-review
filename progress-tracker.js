(function(){
  const HISTORY_KEY='ndhce_attempt_history_v1';
  const SESSION_KEY='ndhce_session_history_v1';
  const MAX_ATTEMPTS=5000;
  const MAX_SESSIONS=1000;

  function read(key,fallback){
    try{
      const value=JSON.parse(localStorage.getItem(key));
      return Array.isArray(value)?value:fallback;
    }catch(e){return fallback;}
  }
  function write(key,value){localStorage.setItem(key,JSON.stringify(value));}
  function uid(prefix){
    return prefix+'_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,8);
  }
  function now(){return new Date().toISOString();}
  function cleanText(value){
    const div=document.createElement('div');
    div.innerHTML=String(value||'');
    return (div.textContent||div.innerText||'').trim();
  }
  function recordAttempt(data){
    const rows=read(HISTORY_KEY,[]);
    rows.push({
      attemptId:uid('attempt'),
      timestamp:data.timestamp||now(),
      sessionId:data.sessionId||'',
      module:data.module||'Unknown',
      section:data.section||'practice',
      questionId:String(data.questionId??''),
      concept:data.concept||'Mixed',
      visual:Boolean(data.visual),
      correct:Boolean(data.correct),
      selectedIndex:Number.isInteger(data.selectedIndex)?data.selectedIndex:null,
      correctIndex:Number.isInteger(data.correctIndex)?data.correctIndex:null,
      stem:cleanText(data.stem||''),
      firstAttempt:data.firstAttempt!==false
    });
    if(rows.length>MAX_ATTEMPTS)rows.splice(0,rows.length-MAX_ATTEMPTS);
    write(HISTORY_KEY,rows);
  }
  function recordSession(data){
    const rows=read(SESSION_KEY,[]);
    rows.push({
      sessionId:data.sessionId||uid('session'),
      timestamp:data.timestamp||now(),
      module:data.module||'Unknown',
      section:data.section||'practice',
      mode:data.mode||'',
      total:Number(data.total)||0,
      correct:Number(data.correct)||0,
      percent:Number(data.total)?Math.round(Number(data.correct)/Number(data.total)*100):0,
      durationSeconds:Number(data.durationSeconds)||0
    });
    if(rows.length>MAX_SESSIONS)rows.splice(0,rows.length-MAX_SESSIONS);
    write(SESSION_KEY,rows);
  }
  function getAttempts(){return read(HISTORY_KEY,[]);}
  function getSessions(){return read(SESSION_KEY,[]);}
  function download(name,text,type){
    const blob=new Blob([text],{type:type||'text/plain;charset=utf-8'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  function exportJSON(){
    const payload={
      version:1,
      exportedAt:now(),
      attempts:getAttempts(),
      sessions:getSessions()
    };
    download('ndhce-progress-backup.json',JSON.stringify(payload,null,2),'application/json');
  }
  function csvEscape(v){
    const s=String(v??'');
    return /[",\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s;
  }
  function exportCSV(){
    const headers=['timestamp','module','section','sessionId','questionId','concept','visual','correct','selectedIndex','correctIndex','firstAttempt','stem'];
    const lines=[headers.join(',')];
    getAttempts().forEach(row=>{
      lines.push(headers.map(h=>csvEscape(row[h])).join(','));
    });
    download('ndhce-attempt-history.csv',lines.join('\n'),'text/csv;charset=utf-8');
  }
  function clearAll(){
    localStorage.removeItem(HISTORY_KEY);
    localStorage.removeItem(SESSION_KEY);
  }
  window.NDHCE_TRACKER={
    HISTORY_KEY,SESSION_KEY,uid,recordAttempt,recordSession,getAttempts,getSessions,
    exportJSON,exportCSV,clearAll
  };
})();
