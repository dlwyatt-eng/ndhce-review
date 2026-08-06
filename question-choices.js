(function () {
  function balanceBank(bank) {
    return (bank || []).map((question, index) => {
      const choices = [...question.choices];
      const rationales = Array.isArray(question.rationales)
        ? [...question.rationales]
        : question.rationales;
      const target = index % choices.length;
      const current = question.answer;

      if (current !== target) {
        [choices[current], choices[target]] = [choices[target], choices[current]];
        if (Array.isArray(rationales)) {
          [rationales[current], rationales[target]] = [rationales[target], rationales[current]];
        }
      }

      return {...question, choices, rationales, answer: target};
    });
  }

  window.NDHCE_CHOICES = {balanceBank};
})();
