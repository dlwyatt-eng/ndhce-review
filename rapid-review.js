(function () {
  const data = window.RAPID_REVIEW_DATA || {};
  const keys = Object.keys(data);
  const STORE_KEY = "ndhce_rapid_review_v1";
  const $ = (id) => document.getElementById(id);
  const esc = (value) =>
    String(value ?? "").replace(
      /[&<>"']/g,
      (char) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[char],
    );
  const read = () => {
    try {
      return JSON.parse(localStorage.getItem(STORE_KEY)) || {};
    } catch (error) {
      return {};
    }
  };
  let store = read(),
    activeKey = "",
    answers = [];

  function validKey(value) {
    return Object.hasOwn(data, value) ? value : keys[0];
  }
  function queryKey() {
    return validKey(new URLSearchParams(location.search).get("subject"));
  }
  function save() {
    localStorage.setItem(STORE_KEY, JSON.stringify(store));
  }
  function subjectState() {
    return (
      store[activeKey] ||
      (store[activeKey] = {
        reviewedAt: "",
        bestScore: null,
        lastScore: null,
        recallAttempts: 0,
      })
    );
  }
  function subjectUrl(key) {
    return `rapid-review.html?subject=${encodeURIComponent(key)}`;
  }
  function practiceUrl(subject, concept) {
    return `${subject.practice.split("?")[0]}?mode=concept&concept=${encodeURIComponent(concept)}`;
  }

  function renderNavigation() {
    $("subjectSelect").innerHTML = keys
      .map(
        (key) =>
          `<option value="${esc(key)}">${esc(data[key].icon)} ${esc(data[key].title)}</option>`,
      )
      .join("");
    $("subjectSelect").value = activeKey;
    $("subjectPills").innerHTML = keys
      .map(
        (key) =>
          `<button class="subject-pill ${key === activeKey ? "active" : ""}" data-subject="${esc(key)}" title="${esc(data[key].title)}">${esc(data[key].icon)} ${esc(data[key].title.replace("Community Oral Health & Research", "Community").replace("Medical Conditions & Special Needs", "Special Needs"))}</button>`,
      )
      .join("");
    document
      .querySelectorAll("[data-subject]")
      .forEach((button) =>
        button.addEventListener("click", () =>
          switchSubject(button.dataset.subject),
        ),
      );
  }

  function renderHeader() {
    const subject = data[activeKey];
    document.title = `${subject.title} Rapid Review`;
    $("subjectIcon").textContent = subject.icon;
    $("subjectTitle").textContent = `${subject.title} Rapid Review`;
    $("subjectTitleZh").textContent = `${subject.titleZh}快速复习`;
    $("hubLink").href = subject.hub;
    $("hubLink").textContent = `← ${subject.title} hub`;
    $("practiceLink").href = subject.practice;
    $("sourceNote").textContent =
      `Paraphrased high-yield review based on the uploaded ${subject.source}. It is designed for exam recall and does not replace current clinical, legal, emergency, or regulatory guidance.`;
  }

  function renderProgress() {
    const state = subjectState();
    $("subjectCount").textContent = keys.length;
    $("reviewedCount").textContent = keys.filter(
      (key) => store[key]?.reviewedAt,
    ).length;
    $("bestScore").textContent = Number.isInteger(state.bestScore)
      ? `${state.bestScore}/5`
      : "—";
    $("lastReviewed").textContent = state.reviewedAt
      ? new Date(state.reviewedAt).toLocaleDateString()
      : "Not yet";
    $("markReviewed").textContent = state.reviewedAt
      ? "✓ Reviewed — mark again"
      : "✓ Mark reviewed / 标记已复习";
  }

  function renderEssentials() {
    $("essentialsList").innerHTML = data[activeKey].essentials
      .map(
        (item, index) =>
          `<article class="essential-card"><span class="essential-number">${index + 1}</span><div><p>${esc(item[0])}</p><span class="zh">${esc(item[1])}</span></div></article>`,
      )
      .join("");
  }

  function renderSections() {
    $("sectionList").innerHTML = data[activeKey].sections
      .map(
        (section, index) =>
          `<details class="review-section" ${index === 0 ? "open" : ""}><summary><div><span class="level">${index + 1} of 6</span><h3>${esc(section.title)}</h3><span class="zh">${esc(section.titleZh)}</span></div></summary><div class="review-section-body"><ul>${section.bullets.map((bullet) => `<li>${esc(bullet)}</li>`).join("")}</ul><div class="section-actions"><a class="button secondary" href="${esc(practiceUrl(data[activeKey], section.concept))}">Test ${esc(section.concept)} →</a></div></div></details>`,
      )
      .join("");
  }

  function renderConfusions() {
    $("confusionRows").innerHTML = data[activeKey].confusions
      .map(
        (row) =>
          `<tr><td><b>${esc(row[0])}</b></td><td><b>${esc(row[1])}</b></td><td>${esc(row[2])}</td></tr>`,
      )
      .join("");
  }

  function renderMemory() {
    $("memoryList").innerHTML = data[activeKey].memory
      .map(
        (item) =>
          `<article class="memory-card"><h3>${esc(item[0])}</h3><p>${esc(item[1])}</p><span class="zh">${esc(item[2])}</span></article>`,
      )
      .join("");
  }

  function renderRecall() {
    answers = Array(data[activeKey].recall.length).fill(null);
    $("recallResult").classList.add("hidden");
    $("recallResult").innerHTML = "";
    $("recallList").innerHTML = data[activeKey].recall
      .map(
        (question, index) =>
          `<article class="recall-card" data-question="${index}"><h3>${index + 1}. ${esc(question[0])}</h3><div class="recall-choices">${question[1].map((choice, choiceIndex) => `<button class="choice" data-choice="${choiceIndex}">${String.fromCharCode(65 + choiceIndex)}. ${esc(choice)}</button>`).join("")}</div><div class="feedback hidden"></div></article>`,
      )
      .join("");
    document
      .querySelectorAll(".recall-card")
      .forEach((card) =>
        card
          .querySelectorAll("[data-choice]")
          .forEach((button) =>
            button.addEventListener("click", () =>
              answerRecall(
                Number(card.dataset.question),
                Number(button.dataset.choice),
              ),
            ),
          ),
      );
  }

  function answerRecall(index, selected) {
    if (answers[index] !== null) return;
    answers[index] = selected;
    const question = data[activeKey].recall[index],
      card = document.querySelector(`[data-question="${index}"]`),
      correct = selected === question[2];
    card.classList.add("locked");
    card.querySelectorAll("[data-choice]").forEach((button) => {
      button.disabled = true;
      const choice = Number(button.dataset.choice);
      if (choice === question[2]) button.classList.add("correct");
      else if (choice === selected) button.classList.add("wrong");
    });
    const feedback = card.querySelector(".feedback");
    feedback.innerHTML = `<b>${correct ? "✅ Correct / 正确" : "❌ Review / 复习"}</b><br>${esc(question[3])}<span class="zh">${esc(question[4])}</span>`;
    feedback.classList.remove("hidden");
    if (answers.every((answer) => answer !== null)) finishRecall();
  }

  function finishRecall() {
    const score = answers.reduce(
        (sum, answer, index) =>
          sum + (answer === data[activeKey].recall[index][2] ? 1 : 0),
        0,
      ),
      state = subjectState();
    state.lastScore = score;
    state.bestScore = Math.max(
      Number.isInteger(state.bestScore) ? state.bestScore : 0,
      score,
    );
    state.recallAttempts = (state.recallAttempts || 0) + 1;
    state.lastRecallAt = new Date().toISOString();
    save();
    renderProgress();
    if (window.NDHCE_TRACKER)
      NDHCE_TRACKER.recordActivity({
        module: data[activeKey].title,
        type: "rapid-recall",
        mode: "Quick recall",
        total: 5,
        correct: score,
        attempts: 5,
        percent: score * 20,
        details: { subject: activeKey, source: data[activeKey].source },
      });
    $("recallResult").innerHTML =
      `<div class="score-big">${score}/5</div><h2>${score === 5 ? "Ready to move on" : "Use the missed explanations once, then retest"}</h2><p>${score * 20}% recall • Best ${state.bestScore}/5</p><div class="nav"><button id="retryRecall" class="secondary">Try again</button><a class="button primary" href="${esc(data[activeKey].practice)}">Practice weak areas →</a></div>`;
    $("recallResult").classList.remove("hidden");
    $("retryRecall").addEventListener("click", renderRecall);
  }

  function switchSubject(key) {
    activeKey = validKey(key);
    try {
      history.replaceState(null, "", subjectUrl(activeKey));
    } catch (error) {
      // Local file previews can reject relative history updates; the review can still switch normally.
    }
    renderAll();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function setView(view) {
    document.querySelectorAll(".review-tab").forEach((button) => {
      const active = button.dataset.view === view;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    document
      .querySelectorAll(".review-view")
      .forEach((section) => section.classList.add("hidden"));
    $(`${view}View`).classList.remove("hidden");
  }

  function renderAll() {
    renderNavigation();
    renderHeader();
    renderProgress();
    renderEssentials();
    renderSections();
    renderConfusions();
    renderMemory();
    renderRecall();
    setView("essentials");
  }

  $("subjectSelect").addEventListener("change", (event) =>
    switchSubject(event.target.value),
  );
  document
    .querySelectorAll(".review-tab")
    .forEach((button) =>
      button.addEventListener("click", () => setView(button.dataset.view)),
    );
  $("markReviewed").addEventListener("click", () => {
    const state = subjectState();
    state.reviewedAt = new Date().toISOString();
    save();
    renderProgress();
    if (window.NDHCE_TRACKER)
      NDHCE_TRACKER.recordActivity({
        module: data[activeKey].title,
        type: "rapid-review",
        mode: "Marked reviewed",
        total: 1,
        correct: 1,
        attempts: 1,
        percent: 100,
        details: { subject: activeKey, source: data[activeKey].source },
      });
  });
  activeKey = queryKey();
  renderAll();
})();
