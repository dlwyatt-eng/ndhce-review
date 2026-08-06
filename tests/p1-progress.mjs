import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {dirname,join} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {JSDOM,ResourceLoader,VirtualConsole} from 'jsdom';

const root=dirname(dirname(fileURLToPath(import.meta.url)));
const trackerSource=await readFile(join(root,'progress-tracker.js'),'utf8');

class LocalLoader extends ResourceLoader{fetch(url){const parsed=new URL(url);return parsed.protocol==='file:'?readFile(fileURLToPath(parsed)):null;}}

async function openDashboard(seed={}){
  const storage=new Map(Object.entries(seed).map(([k,v])=>[k,typeof v==='string'?v:JSON.stringify(v)])),errors=[],console=new VirtualConsole();
  console.on('jsdomError',e=>errors.push(e));console.on('error',e=>errors.push(e));
  const file=join(root,'overall-dashboard.html');
  const dom=await JSDOM.fromFile(file,{url:pathToFileURL(file).href,runScripts:'dangerously',resources:new LocalLoader(),virtualConsole:console,beforeParse(window){Object.defineProperty(window,'localStorage',{value:{getItem:k=>storage.has(k)?storage.get(k):null,setItem:(k,v)=>storage.set(k,String(v)),removeItem:k=>storage.delete(k),clear:()=>storage.clear(),key:i=>Array.from(storage.keys())[i]??null,get length(){return storage.size;}}});window.confirm=()=>true;window.URL.createObjectURL=()=> 'blob:test';window.URL.revokeObjectURL=()=>{};}});
  await new Promise(resolve=>dom.window.addEventListener('load',resolve,{once:true}));await new Promise(resolve=>setTimeout(resolve,10));return {dom,errors,storage};
}

function trackerWindow(seed={}){
  const dom=new JSDOM('<!doctype html><body></body>',{url:'https://ndhce.test/',runScripts:'outside-only'});
  Object.entries(seed).forEach(([key,value])=>dom.window.localStorage.setItem(key,typeof value==='string'?value:JSON.stringify(value)));
  dom.window.URL.createObjectURL=()=> 'blob:test';dom.window.URL.revokeObjectURL=()=>{};
  dom.window.HTMLAnchorElement.prototype.click=()=>{};
  dom.window.eval(trackerSource);
  return dom;
}

{
  const oldAttempts=[
    {timestamp:'2026-01-01T00:00:00.000Z',module:'Pharmacology',section:'practice',questionId:'p1',concept:'Drugs',correct:false,firstAttempt:true},
    {timestamp:'2026-01-02T00:00:00.000Z',module:'Pharmacology',section:'practice',questionId:'p1',concept:'Drugs',correct:true,firstAttempt:true}
  ];
  const dom=trackerWindow({ndhce_attempt_history_v1:oldAttempts,ndhce_session_history_v1:[]});
  const rows=dom.window.NDHCE_TRACKER.getAttempts();
  assert.equal(rows.length,2,'v1 attempts should migrate');
  assert.deepEqual(Array.from(rows,x=>x.firstAttempt),[true,false],'migration should repair first-attempt flags');
  dom.window.close();
}

{
  const {dom,errors}=await openDashboard();
  assert.deepEqual(errors,[],'overall dashboard should load without browser errors');
  assert.match(dom.window.document.querySelector('#recommendation').textContent,/Study this next/,'dashboard should give a next-study recommendation');
  assert.ok(dom.window.document.querySelector('#importFile'),'dashboard should offer backup restore');
  assert.match(dom.window.document.querySelector('#summary').textContent,/First-try accuracy/,'dashboard should distinguish first attempts');
  dom.window.close();
}

{
  const dom=trackerWindow(),tracker=dom.window.NDHCE_TRACKER;
  tracker.recordAttempt({module:'Radiology',questionId:'r1',concept:'Safety',correct:false,selectedIndex:0,correctIndex:1,stem:'Question'});
  tracker.recordAttempt({module:'Radiology',questionId:'r1',concept:'Safety',correct:true,selectedIndex:1,correctIndex:1,stem:'Question'});
  const rows=tracker.getAttempts();
  assert.deepEqual(Array.from(rows,x=>x.firstAttempt),[true,false],'new repeat attempts should not count as first attempts');
  assert.equal(tracker.getInsights().corrected,1,'a later correct answer should count as a corrected mistake');

  const bank=[
    {id:'r1',concept:'Safety'},{id:'r2',concept:'Safety'},{id:'r3',concept:'Physics'},{id:'r4',concept:'Physics'}
  ];
  tracker.recordAttempt({module:'Radiology',questionId:'r2',concept:'Safety',correct:false,stem:'Question'});
  const adaptive=tracker.selectAdaptiveBank('Radiology',bank,2);
  assert.ok(adaptive.some(q=>q.id==='r2'),'adaptive practice should prioritize an unresolved mistake');

  tracker.recordActivity({module:'Pharmacology',type:'matching',mode:'mixed',total:8,correct:8,attempts:10,percent:80});
  assert.equal(tracker.getActivities({type:'matching'}).length,1,'matching should share the unified progress record');

  const payload=tracker.exportJSON();
  assert.equal(payload.format,'ndhce-progress-backup');
  assert.ok(payload.storage.ndhce_progress_v2,'backup should contain unified progress');
  tracker.clearAll();
  assert.equal(tracker.getAttempts().length,0,'clear should remove progress');
  tracker.importJSON(payload);
  assert.equal(tracker.getAttempts().length,3,'restore should recover every attempt');
  assert.equal(tracker.getActivities().length,1,'restore should recover matching activity');
  dom.window.close();
}

{
  const indicesPractice=await readFile(join(root,'indices-practice-session.html'),'utf8');
  const indicesExam=await readFile(join(root,'indices-exam.html'),'utf8');
  const mixed=await readFile(join(root,'mixed-exam.html'),'utf8');
  const matching=await readFile(join(root,'pharm-matching.html'),'utf8');
  for(const [name,source] of [['indices practice',indicesPractice],['indices exam',indicesExam],['mixed exam',mixed],['matching',matching]]){
    assert.match(source,/progress-tracker\.js/,`${name} should load unified tracking`);
  }
}

console.log('P1 progress suite passed: migration, first attempts, adaptation, matching, and full backup/restore.');
