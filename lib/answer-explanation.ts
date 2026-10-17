import details from '@/content/gh300/2026-08-07/questions/answer-explanations.json';

type ExplanationQuestion = {
  id: string;
  question: string;
  choices: { id: string; text: string }[];
  answer: string[];
  difficulty: string;
  sourceIds: string[];
  status: string;
  explanation: string;
};

const byId = new Map(details.questions.map(row => [row.id, row]));

/** New prose is bound to the exact question, including saved-session snapshots. */
export function answerExplanation(q: ExplanationQuestion): string {
  const row = byId.get(q.id);
  if (!row) return q.explanation;
  const contract = JSON.stringify({ question: q.question, choices: q.choices, answer: q.answer,
    difficulty: q.difficulty, sourceIds: q.sourceIds, status: q.status });
  return contract === row.contract ? row.text : q.explanation;
}
