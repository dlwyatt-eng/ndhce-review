import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {readFile, readdir} from 'node:fs/promises';
import {dirname, join} from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import vm from 'node:vm';
import {JSDOM, ResourceLoader, VirtualConsole} from 'jsdom';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dataFiles = [
  ['pharm-data.js', 'PHARM_BANK'],
  ['poc-data.js', 'POC_BANK'],
  ['med-data.js', 'MED_BANK'],
  ['sn-data.js', 'FULL_BANK'],
  ['path-data.js', 'FULL_BANK'],
  ['perio-data.js', 'FULL_BANK'],
  ['law-data.js', 'FULL_BANK'],
  ['community-data.js', 'FULL_BANK'],
  ['radiology-data.js', 'FULL_BANK']
];

function loadBank(file, globalName) {
  const context = {window: {}};
  vm.createContext(context);
  return readFile(join(root, file), 'utf8').then(source => {
    vm.runInContext(source, context, {filename: file});
    return context.window[globalName];
  });
}

async function loadChoiceBalancer() {
  const context = {window: {}};
  vm.createContext(context);
  vm.runInContext(await readFile(join(root, 'question-choices.js'), 'utf8'), context);
  return context.window.NDHCE_CHOICES.balanceBank;
}

async function checkQuestionBanks() {
  const balanceBank = await loadChoiceBalancer();
  let total = 0;
  for (const [file, globalName] of dataFiles) {
    const bank = await loadBank(file, globalName);
    assert.ok(Array.isArray(bank) && bank.length, `${file} should expose a question bank`);
    const balanced = balanceBank(bank);
    const counts = [0, 0, 0, 0];

    balanced.forEach((question, index) => {
      assert.equal(question.choices.length, 4, `${file} question ${index + 1} should have four choices`);
      assert.equal(new Set(question.choices).size, 4, `${file} question ${index + 1} should not repeat a choice`);
      assert.ok(question.answer >= 0 && question.answer < 4, `${file} question ${index + 1} needs a valid answer`);
      assert.equal(question.choices[question.answer], bank[index].choices[bank[index].answer], `${file} answer text changed during balancing`);
      assert.deepEqual(question.rationales[question.answer], bank[index].rationales[bank[index].answer], `${file} rationale became detached from its choice`);
      counts[question.answer]++;
    });

    assert.ok(Math.max(...counts) - Math.min(...counts) <= 1, `${file} answer positions should be balanced: ${counts}`);
    total += bank.length;
  }
  assert.equal(total, 556, 'The principal banks should contain 556 questions');
}

async function checkLocalLinks() {
  const files = await readdir(root);
  const htmlFiles = files.filter(file => file.endsWith('.html'));
  const missing = [];
  for (const file of htmlFiles) {
    const source = await readFile(join(root, file), 'utf8');
    for (const match of source.matchAll(/(?:href|src)="([^"#?]+)(?:[?#][^"]*)?"/g)) {
      const target = match[1];
      if (/^(?:https?:|data:|mailto:)/.test(target)) continue;
      if (!existsSync(join(root, target))) missing.push(`${file} -> ${target}`);
    }
  }
  assert.deepEqual(missing, [], `Broken local links:\n${missing.join('\n')}`);
}

class LocalLoader extends ResourceLoader {
  fetch(url) {
    const parsed = new URL(url);
    if (parsed.protocol !== 'file:') return null;
    return readFile(fileURLToPath(parsed));
  }
}

async function openPage(file, query = '') {
  const errors = [];
  const console = new VirtualConsole();
  console.on('jsdomError', error => errors.push(error));
  console.on('error', error => errors.push(error));
  const storage = new Map();
  const url = `${pathToFileURL(join(root, file)).href}${query}`;
  const dom = await JSDOM.fromFile(join(root, file), {
    url,
    runScripts: 'dangerously',
    resources: new LocalLoader(),
    virtualConsole: console,
    beforeParse(window) {
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: key => storage.has(key) ? storage.get(key) : null,
          setItem: (key, value) => storage.set(key, String(value)),
          removeItem: key => storage.delete(key),
          clear: () => storage.clear()
        }
      });
      window.confirm = () => true;
      window.setInterval = () => 1;
      window.clearInterval = () => {};
    }
  });
  await new Promise(resolve => dom.window.addEventListener('load', resolve, {once: true}));
  await new Promise(resolve => setTimeout(resolve, 10));
  assert.deepEqual(errors, [], `${file} emitted browser errors: ${errors.map(error => error.message).join('; ')}`);
  return {dom, storage, errors};
}

async function checkSubjectExams() {
  const examPages = [
    ['pharm-exam.html', 30, 'pharm-dashboard.html'],
    ['poc-exam.html', 20, 'poc-dashboard.html'],
    ['med-exam.html', 30, 'med-dashboard.html'],
    ['sn-exam.html', 30, 'sn-dashboard.html'],
    ['path-exam.html', 30, 'path-dashboard.html'],
    ['perio-exam.html', 30, 'perio-dashboard.html'],
    ['law-exam.html', 30, 'law-dashboard.html'],
    ['community-exam.html', 30, 'community-dashboard.html'],
    ['radiology-exam.html', 30, 'radiology-dashboard.html'],
    ['indices-exam.html', 20, 'indices-dashboard.html']
  ];

  for (const [file, length, dashboard] of examPages) {
    const {dom, storage} = await openPage(file);
    const document = dom.window.document;
    assert.match(document.querySelector('#counter').textContent, new RegExp(`of ${length}$`), `${file} displayed the wrong exam length`);
    document.querySelector('#choices button').click();
    document.querySelector('#finish').click();
    assert.match(document.querySelector('#exam').textContent, /Mock Exam Complete/, `${file} did not submit`);
    assert.ok(document.querySelector(`#exam a[href="${dashboard}"]`), `${file} did not link to its own dashboard`);
    const unified = JSON.parse(storage.get('ndhce_progress_v2'));
    assert.equal(unified.attempts.length, length, `${file} should save every exam answer to unified progress`);
    assert.equal(unified.sessions.length, 1, `${file} should save one unified exam session`);
    dom.window.close();
  }
}

async function checkPracticeNavigation() {
  const pages = [
    ['pharm-practice-session.html', 'pharm-dashboard.html', 'pharmacology.html', 'Pharmacokinetics'],
    ['poc-practice-session.html', 'poc-dashboard.html', 'process-of-care.html', 'Assessment'],
    ['med-practice-session.html', 'med-dashboard.html', 'medical-emergencies.html', 'BLS'],
    ['sn-practice-session.html', 'sn-dashboard.html', 'special-needs.html', 'ASA Classification'],
    ['path-practice-session.html', 'path-dashboard.html', 'pathology.html', 'Lesion Description'],
    ['perio-practice-session.html', 'perio-dashboard.html', 'periodontology.html', 'Anatomy & Tissues'],
    ['law-practice-session.html', 'law-dashboard.html', 'law-ethics.html', 'Dental Records'],
    ['community-practice-session.html', 'community-dashboard.html', 'community-health.html', 'Prevention Levels'],
    ['radiology-practice-session.html', 'radiology-dashboard.html', 'radiology.html', 'Radiation Physics'],
    ['indices-practice-session.html', 'indices-dashboard.html', 'indices.html', 'DMFT']
  ];

  async function finishPractice(file, query, dashboard, hub) {
    const {dom} = await openPage(file, query);
    const document = dom.window.document;
    let answered = 0;
    while (document.querySelector('#choices button')) {
      document.querySelector('#choices button').click();
      document.querySelector('#next').click();
      answered++;
      assert.ok(answered < 100, `${file} practice did not finish`);
    }
    assert.match(document.querySelector('#quiz').textContent, /complete/i, `${file} did not show completion`);
    assert.ok(document.querySelector(`#quiz a[href="${dashboard}"]`), `${file} did not link to its dashboard`);
    assert.ok(document.querySelector(`#quiz a[href="${hub}"]`), `${file} did not link to its hub`);
    dom.window.close();
  }

  for (const [file, dashboard, hub, concept] of pages) {
    await finishPractice(file, '?mode=random', dashboard, hub);
    await finishPractice(file, '?mode=weak', dashboard, hub);
    await finishPractice(file, `?mode=concept&concept=${encodeURIComponent(concept)}`, dashboard, hub);
  }

  await finishPractice('path-practice-session.html', '?mode=visual', 'path-dashboard.html', 'pathology.html');
  await finishPractice('radiology-practice-session.html', '?mode=visual', 'radiology-dashboard.html', 'radiology.html');
}

async function checkMixedExamIdentity() {
  const {dom, storage} = await openPage('mixed-exam.html');
  const document = dom.window.document;
  document.querySelector('button.primary').click();
  assert.match(document.querySelector('#counter').textContent, /of 30$/, 'Mixed exam should start with 30 questions');

  document.querySelector('#choices button').click();
  const answeredBefore = document.querySelectorAll('#questionMap .answered').length;
  document.querySelector('#next').click();
  const selectedOnNext = document.querySelectorAll('#choices .selected').length;
  assert.equal(answeredBefore, 1, 'Answering one mixed question should mark exactly one map item');
  assert.equal(selectedOnNext, 0, 'A colliding numeric ID must not preselect another subject answer');

  document.querySelector('#finish').click();
  const saved = JSON.parse(storage.get('ndhce_mixed_progress_v2'));
  assert.equal(saved.attempts[0].schemaVersion, 2, 'Mixed results should use the collision-safe schema');
  assert.equal(saved.attempts[0].done, 30, 'Mixed result should store the complete exam length');
  const unified = JSON.parse(storage.get('ndhce_progress_v2'));
  assert.equal(unified.attempts.length, 30, 'Mixed exam should save question-level unified attempts');
  assert.equal(unified.sessions[0].section, 'mixed-exam', 'Mixed exam should save a unified session');
  dom.window.close();
}

await checkQuestionBanks();
await checkLocalLinks();
await checkSubjectExams();
await checkPracticeNavigation();
await checkMixedExamIdentity();

console.log('P0 regression suite passed: banks, links, subject exams, practice navigation, and mixed-exam identity.');
