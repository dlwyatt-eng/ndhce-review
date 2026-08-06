import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {dirname,join} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import vm from 'node:vm';
import {JSDOM,ResourceLoader,VirtualConsole} from 'jsdom';

const root=dirname(dirname(fileURLToPath(import.meta.url)));

const context={window:{}};
vm.createContext(context);
vm.runInContext(await readFile(join(root,'pharm-medications.js'),'utf8'),context,{filename:'pharm-medications.js'});
const groups=context.window.PHARM_MEDICATION_GROUPS;
assert.ok(Array.isArray(groups)&&groups.length>=40,'Medication library should contain at least 40 class-based study groups');
const uniqueNames=new Set(groups.flatMap(group=>group.drugs.map(drug=>drug.name.toLowerCase())));
assert.ok(uniqueNames.size>=190,`Medication library should contain at least 190 unique named agents; found ${uniqueNames.size}`);
for(const group of groups){
  assert.ok(group.id&&group.category&&group.categoryZh&&group.title&&group.titleZh,`${group.id||'Unknown group'} needs bilingual identity fields`);
  assert.ok(group.drugs.length,`${group.id} needs medications`);
  assert.ok(group.use&&group.useZh&&group.key&&group.keyZh&&group.dental&&group.dentalZh,`${group.id} needs bilingual study facts`);
  assert.ok(group.page,`${group.id} needs a source reference`);
}

class LocalLoader extends ResourceLoader{
  fetch(url){const parsed=new URL(url);return parsed.protocol==='file:'?readFile(fileURLToPath(parsed)):null;}
}
const errors=[];
const consoleCapture=new VirtualConsole();
consoleCapture.on('jsdomError',error=>errors.push(error));
consoleCapture.on('error',error=>errors.push(error));
const storage=new Map();
const dom=await JSDOM.fromFile(join(root,'pharm-learn.html'),{
  url:pathToFileURL(join(root,'pharm-learn.html')).href,
  runScripts:'dangerously',resources:new LocalLoader(),virtualConsole:consoleCapture,
  beforeParse(window){
    Object.defineProperty(window,'localStorage',{value:{getItem:key=>storage.get(key)??null,setItem:(key,value)=>storage.set(key,String(value)),removeItem:key=>storage.delete(key),key:index=>[...storage.keys()][index]??null,get length(){return storage.size;}}});
  }
});
await new Promise(resolve=>dom.window.addEventListener('load',resolve,{once:true}));
await new Promise(resolve=>setTimeout(resolve,20));
assert.deepEqual(errors,[],`Medication study page emitted browser errors: ${errors.map(error=>error.message).join('; ')}`);
const document=dom.window.document;
assert.equal(Number(document.querySelector('#drugCount').textContent),uniqueNames.size,'Page count should match the unique medication data');
assert.equal(document.querySelectorAll('.med-group').length,groups.length,'Browse view should render every study group');

const search=document.querySelector('#medSearch');
search.value='Coumadin';search.dispatchEvent(new dom.window.Event('input',{bubbles:true}));
assert.match(document.querySelector('#resultCount').textContent,/Showing 1 of/,'Brand-name search should find warfarin');
assert.match(document.querySelector('#medicationGroups').textContent,/Warfarin/,'Brand-name search should reveal the generic drug');

search.value='';search.dispatchEvent(new dom.window.Event('input',{bubbles:true}));
const reviewButton=document.querySelector('.med-group [data-status="review"]');
reviewButton.click();
const savedStatus=JSON.parse(storage.get('ndhce_pharm_medication_study_v1'));
assert.equal(Object.values(savedStatus).filter(value=>value==='review').length,1,'Review status should persist');
const progress=JSON.parse(storage.get('ndhce_progress_v2'));
assert.equal(progress.activities.at(-1).type,'medication-study','Medication study should feed unified progress tracking');

document.querySelector('[data-view="cards"]').click();
assert.equal(document.querySelector('#cardsView').classList.contains('hidden'),false,'Flashcard view should open');
assert.equal(document.querySelector('#cardBack').classList.contains('hidden'),true,'Flashcard answer should begin hidden');
document.querySelector('#studyCard').click();
assert.equal(document.querySelector('#cardBack').classList.contains('hidden'),false,'Flashcard should reveal on activation');

const hub=await readFile(join(root,'pharmacology.html'),'utf8');
assert.match(hub,/href="pharm-learn\.html"/,'Pharmacology hub should link to Medication Study');
dom.window.close();

console.log(`Medication study suite passed: ${groups.length} groups, ${uniqueNames.size} named agents, search, flashcards, and progress tracking.`);
