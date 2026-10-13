// These legacy scripts used to overwrite reviewed text and retain stale PASS decisions.
// New edits belong in draft packs, followed by an actual editorial review.
import {removedQuestionIds} from './question-removals.mjs';
export function assertLegacyRewriteScope(bank, drafts) {
  const deletedIds=Object.keys(drafts).filter(id=>removedQuestionIds.has(id));
  if(deletedIds.length)throw Error('削除済み問題の再登録は禁止されています: '+deletedIds.join(', '));
  const reviewedIds=Object.keys(drafts).filter(id=>bank.some(q=>q.id===id&&q.status==='verified'));
  if(reviewedIds.length)throw Error('レビュー済み問題の直接上書きは禁止されています。未レビューの草案を作成し、本文・正答・解説を再評価してください: '+reviewedIds.join(', '));
  for(const [id,draft] of Object.entries(drafts)){
    if(!draft.correctChoiceId||!draft.choices?.[draft.correctChoiceId])throw Error('草案には正しい選択肢のIDを明示してください: '+id);
    const q=bank.find(q=>q.id===id);
    if(q&&(!q.answer?.includes(draft.correctChoiceId)||draft.choiceExplanations?.[draft.correctChoiceId]!==draft.explanation))throw Error('草案の正答ID・本文・解説を一致させてください: '+id);
  }
}
