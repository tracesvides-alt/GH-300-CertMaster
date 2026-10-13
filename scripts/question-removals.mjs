import fs from 'node:fs';
const root=new URL('../',import.meta.url);
export const questionRemovals=JSON.parse(fs.readFileSync(new URL('content/gh300/2026-08-07/questions/removals.json',root),'utf8'));
export const removedQuestionIds=new Set(questionRemovals.questions.map(q=>q.id));
