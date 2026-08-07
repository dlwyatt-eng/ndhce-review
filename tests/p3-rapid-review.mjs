import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import vm from "node:vm";
import { JSDOM, ResourceLoader, VirtualConsole } from "jsdom";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const context = { window: {} };
vm.createContext(context);
vm.runInContext(
  await readFile(join(root, "rapid-review-data.js"), "utf8"),
  context,
  { filename: "rapid-review-data.js" },
);
const data = context.window.RAPID_REVIEW_DATA;
assert.equal(
  Object.keys(data).length,
  9,
  "Rapid Review should cover all nine uploaded subject manuals",
);
for (const [key, subject] of Object.entries(data)) {
  assert.equal(
    subject.essentials.length,
    6,
    `${key} needs six five-minute essentials`,
  );
  assert.equal(
    subject.sections.length,
    6,
    `${key} needs six condensed sections`,
  );
  assert.equal(
    subject.confusions.length,
    5,
    `${key} needs five confusion pairs`,
  );
  assert.equal(subject.memory.length, 3, `${key} needs three memory cues`);
  assert.equal(subject.recall.length, 5, `${key} needs five recall questions`);
  assert.ok(
    subject.hub && subject.practice && subject.source,
    `${key} needs navigation and source metadata`,
  );
  for (const question of subject.recall) {
    assert.equal(question[1].length, 4, `${key} recall needs four choices`);
    assert.ok(
      question[2] >= 0 && question[2] < 4,
      `${key} recall needs a valid answer`,
    );
  }
}

const banks = {
  pharmacology: ["pharm-data.js", "PHARM_BANK"],
  community: ["community-data.js", "COMMUNITY_BANK"],
  pathology: ["path-data.js", "PATH_BANK"],
  emergencies: ["med-data.js", "MED_BANK"],
  special: ["sn-data.js", "SN_BANK"],
  periodontology: ["perio-data.js", "PERIO_BANK"],
  radiology: ["radiology-data.js", "RADIOLOGY_BANK"],
  process: ["poc-data.js", "POC_BANK"],
  law: ["law-data.js", "LAW_BANK"],
};
for (const [key, [file, variable]] of Object.entries(banks)) {
  const bankContext = { window: {} };
  vm.createContext(bankContext);
  vm.runInContext(await readFile(join(root, file), "utf8"), bankContext, {
    filename: file,
  });
  const bank =
    bankContext.window[variable] || vm.runInContext(variable, bankContext);
  const concepts = new Set(bank.map((q) => q.concept));
  for (const section of data[key].sections)
    assert.ok(
      concepts.has(section.concept),
      `${key} section ${section.title} should link to an existing practice concept`,
    );
}

class LocalLoader extends ResourceLoader {
  fetch(url) {
    const parsed = new URL(url);
    return parsed.protocol === "file:" ? readFile(fileURLToPath(parsed)) : null;
  }
}
const errors = [],
  virtualConsole = new VirtualConsole();
virtualConsole.on("jsdomError", (error) => errors.push(error));
virtualConsole.on("error", (error) => errors.push(error));
const storage = new Map();
const dom = await JSDOM.fromFile(join(root, "rapid-review.html"), {
  url:
    pathToFileURL(join(root, "rapid-review.html")).href +
    "?subject=pharmacology",
  runScripts: "dangerously",
  resources: new LocalLoader(),
  virtualConsole,
  beforeParse(window) {
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: (key) => storage.get(key) ?? null,
        setItem: (key, value) => storage.set(key, String(value)),
        removeItem: (key) => storage.delete(key),
        key: (index) => [...storage.keys()][index] ?? null,
        get length() {
          return storage.size;
        },
      },
    });
    window.scrollTo = () => {};
  },
});
await new Promise((resolve) =>
  dom.window.addEventListener("load", resolve, { once: true }),
);
await new Promise((resolve) => setTimeout(resolve, 30));
assert.deepEqual(
  errors,
  [],
  `Rapid Review emitted browser errors: ${errors.map((error) => error.message).join("; ")}`,
);
const document = dom.window.document;
assert.equal(
  document.querySelectorAll(".essential-card").length,
  6,
  "Five-minute view should render six essentials",
);
assert.equal(
  document.querySelectorAll(".review-section").length,
  6,
  "Condensed view should render six sections",
);
assert.equal(
  document.querySelectorAll("#confusionRows tr").length,
  5,
  "Confusion table should render five pairs",
);
assert.equal(
  document.querySelectorAll(".memory-card").length,
  3,
  "Memory view should render three cues",
);
assert.equal(
  document.querySelectorAll(".recall-card").length,
  5,
  "Recall view should render five questions",
);

document.querySelector('[data-view="recall"]').click();
for (const card of document.querySelectorAll(".recall-card"))
  card
    .querySelector(
      `[data-choice="${data.pharmacology.recall[Number(card.dataset.question)][2]}"]`,
    )
    .click();
assert.match(
  document.querySelector("#recallResult").textContent,
  /5\/5/,
  "Recall should score all five answers",
);
assert.equal(
  JSON.parse(storage.get("ndhce_rapid_review_v1")).pharmacology.bestScore,
  5,
  "Best recall score should persist",
);
assert.equal(
  JSON.parse(storage.get("ndhce_progress_v2")).activities.at(-1).type,
  "rapid-recall",
  "Recall should feed unified progress tracking",
);

document.querySelector("#markReviewed").click();
assert.ok(
  JSON.parse(storage.get("ndhce_rapid_review_v1")).pharmacology.reviewedAt,
  "Reviewed status should persist",
);
assert.equal(
  JSON.parse(storage.get("ndhce_progress_v2")).activities.at(-1).type,
  "rapid-review",
  "Review completion should feed unified tracking",
);

document.querySelector("#subjectSelect").value = "radiology";
document
  .querySelector("#subjectSelect")
  .dispatchEvent(new dom.window.Event("change", { bubbles: true }));
assert.match(
  document.querySelector("#subjectTitle").textContent,
  /Radiology/,
  "Subject switcher should rerender the selected manual",
);
assert.match(
  document.querySelector("#hubLink").getAttribute("href"),
  /radiology\.html/,
  "Subject hub link should update",
);

const hubs = {
  pharmacology: "pharmacology.html",
  community: "community-health.html",
  pathology: "pathology.html",
  emergencies: "medical-emergencies.html",
  special: "special-needs.html",
  periodontology: "periodontology.html",
  radiology: "radiology.html",
  process: "process-of-care.html",
  law: "law-ethics.html",
};
for (const [key, file] of Object.entries(hubs)) {
  const html = await readFile(join(root, file), "utf8");
  assert.match(
    html,
    new RegExp(`rapid-review\\.html\\?subject=${key}`),
    `${file} should link to its Rapid Review`,
  );
}
assert.match(
  await readFile(join(root, "index.html"), "utf8"),
  /rapid-review\.html\?subject=pharmacology/,
  "Homepage should link to Rapid Review",
);
dom.window.close();
console.log(
  "Rapid Review suite passed: 9 subjects, 54 sections, 45 recall questions, navigation, scoring, and progress tracking.",
);
