// Scores a set of answers against the full question bank.
//
// For rating/slider questions, the answer is normalized to [0,1] across the
// question's scale, then that fraction of each listed category's weight is
// added to that category's raw score.
//
// For multiple-choice questions, the chosen option's category weights are
// added directly (full weight, since picking an option is an all-or-nothing
// signal, unlike a scale).
//
// Each category's final score is the raw score divided by the maximum score
// achievable for that category across ALL questions (not just answered
// ones) — every taker sees the same fixed question set, so this max is
// well-defined and gives a stable 0–100 scale.
function scoreQuiz(allQuestions, answers) {
  const questionsById = new Map(allQuestions.map((q) => [String(q._id), q]));
  const raw = {};
  const maxPossible = {};

  function addWeight(bucket, category, weight) {
    bucket[category] = (bucket[category] || 0) + weight;
  }

  // Max possible: sum, over every question, of the largest contribution it
  // could make to each category. For multiple-choice, that's the best
  // option *within that question* — summed across questions, not maxed
  // across questions (each question is an independent opportunity to score).
  for (const q of allQuestions) {
    if (q.type === 'multiple-choice') {
      const bestPerCategory = {};
      for (const opt of q.options || []) {
        for (const [category, weight] of opt.categoryWeights || new Map()) {
          bestPerCategory[category] = Math.max(bestPerCategory[category] || 0, weight);
        }
      }
      for (const [category, weight] of Object.entries(bestPerCategory)) {
        addWeight(maxPossible, category, weight);
      }
    } else {
      for (const [category, weight] of q.categoryWeights || new Map()) {
        addWeight(maxPossible, category, weight);
      }
    }
  }

  for (const answer of answers) {
    const q = questionsById.get(String(answer.question));
    if (!q) continue; // ignore answers for unknown/stale question ids

    if (q.type === 'multiple-choice') {
      const option = (q.options || []).find((o) => o.value === answer.value);
      if (!option) continue;
      for (const [category, weight] of option.categoryWeights || new Map()) {
        addWeight(raw, category, weight);
      }
    } else {
      const value = Number(answer.value);
      if (Number.isNaN(value)) continue;
      const clamped = Math.min(q.scaleMax, Math.max(q.scaleMin, value));
      const normalized = (clamped - q.scaleMin) / (q.scaleMax - q.scaleMin || 1);
      for (const [category, weight] of q.categoryWeights || new Map()) {
        addWeight(raw, category, normalized * weight);
      }
    }
  }

  const scores = {};
  for (const category of Object.keys(maxPossible)) {
    if (maxPossible[category] <= 0) continue;
    const pct = ((raw[category] || 0) / maxPossible[category]) * 100;
    scores[category] = Math.round(Math.min(100, Math.max(0, pct)));
  }

  const topCategories = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .filter(([, score]) => score > 0)
    .slice(0, 3)
    .map(([category]) => category);

  return { scores, topCategories };
}

module.exports = scoreQuiz;
