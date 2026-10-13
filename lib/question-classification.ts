import { allQuestions } from './content';

const currentById = new Map(allQuestions.map(q => [q.id, q]));
type Classification = { domainId: string; objectiveId: string; status?: string };

/** Project historical metadata onto the current bank without changing stored answers. */
export function withCurrentAttemptClassification<T extends Classification & { questionId: string }>(record: T): T {
  const current = record.status === 'ai-generated' ? undefined : currentById.get(record.questionId);
  if (!current || (record.domainId === current.domainId && record.objectiveId === current.objectiveId)) return record;
  return { ...record, domainId: current.domainId, objectiveId: current.objectiveId };
}

/** Resume a saved question with current labels while retaining its original text and answer. */
export function withCurrentQuestionClassification<T extends Classification & { id: string }>(record: T): T {
  const current = record.status === 'ai-generated' ? undefined : currentById.get(record.id);
  if (!current || (record.domainId === current.domainId && record.objectiveId === current.objectiveId)) return record;
  return { ...record, domainId: current.domainId, objectiveId: current.objectiveId };
}
