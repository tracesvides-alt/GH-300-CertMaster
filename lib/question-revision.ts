import revisions from '@/content/gh300/2026-08-07/questions/official-alignment-revisions.json';
import adminRevisions from '@/content/gh300/2026-08-07/questions/admin-content-revisions.json';
import foundationRevisions from '@/content/gh300/2026-08-07/questions/foundation-cli-admin-revisions.json';

type RevisionRecord = {
  id: string;
  question?: string;
  choices?: unknown;
  answer?: unknown;
  difficulty?: string;
  type?: string;
  status?: string;
  domainId?: string;
  objectiveId?: string;
  explanation?: string;
  choiceExplanations?: unknown;
  sourceIds?: unknown;
  contentRevision?: string;
};

/** Include short analyses too: a correction must not leak into an old snapshot. */
export function questionRevisionContract(q: RevisionRecord): string {
  return JSON.stringify({ id:q.id, question:q.question, choices:q.choices, answer:q.answer,
    difficulty:q.difficulty, type:q.type, status:q.status, domainId:q.domainId,
    objectiveId:q.objectiveId, explanation:q.explanation, choiceExplanations:q.choiceExplanations,
    sourceIds:q.sourceIds, contentRevision:q.contentRevision });
}

type Revision = { id:string; beforeContract:string; afterContract:string;
  after:RevisionRecord; displayedExplanation:string; invalidatePreviousSnapshots:boolean };
const rows = [...revisions.questions, ...adminRevisions.questions, ...foundationRevisions.questions] as Revision[];
const byId = new Map(rows.map(row=>[row.id,row]));
const quarantined = new Set<string>(revisions.quarantinedQuestionIds);
const versionedAttemptIds = new Set(foundationRevisions.questions.filter(row=>row.requiresAttemptRevision).map(row=>row.id));

/** These editions change meaning even when the correct choice ID is unchanged. */
export function requiresAttemptRevision(id:string):boolean {
  return versionedAttemptIds.has(id);
}

/** Apply only to the exact seed edition, never silently to a saved question. */
export function applyQuestionRevision<T extends RevisionRecord>(question:T):T {
  const row=byId.get(question.id);
  return row && questionRevisionContract(question)===row.beforeContract
    ? {...question,...row.after} as T : question;
}

export function revisedAnswerExplanation(question:RevisionRecord):string|undefined {
  const row=byId.get(question.id);
  return row && questionRevisionContract(question)===row.afterContract ? row.displayedExplanation : undefined;
}

export function isQuestionRevisionUnavailable(question:RevisionRecord):boolean {
  if (quarantined.has(question.id)) return true;
  const row=byId.get(question.id);
  // ID-only activity checks do not contain a saved question edition to compare.
  return !!row?.invalidatePreviousSnapshots && question.question!==undefined && questionRevisionContract(question)!==row.afterContract;
}
