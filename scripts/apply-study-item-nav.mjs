import fs from 'node:fs';

const filePath = 'app/page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add import for StudyItemNav
const importTarget = `import { LessonFooterNav } from './components/lesson-footer-nav';`;
const importReplacement = `import { LessonFooterNav } from './components/lesson-footer-nav';
import { StudyItemNav } from './components/study-item-nav';`;

if (!content.includes(importTarget)) {
  console.error('Import target not found in page.tsx');
  process.exit(1);
}
content = content.replace(importTarget, importReplacement);

// 2. Add StudyItemNav to Glossary detail
const glossaryTarget = `                                   {/* 双方向リンク: 用語の関連問題3問 (要件4) */}
                                   <div className="glossary-check-box mt-4">
                                     <button
                                       className="primary"
                                       onClick={() => {
                                         const checkQuestions = getQuestionsForGlossary(term.id, 3, attempts.map((a) => a.questionId));
                                         startCheckQuestions(checkQuestions);
                                       }}
                                     >
                                       <ListChecks size={16} /> この用語の関連問題を3問解く <ArrowRight size={16} />
                                     </button>
                                   </div>
                                 </article>`;

const glossaryReplacement = `                                   {/* 双方向リンク: 用語の関連問題3問 (要件4) */}
                                   <div className="glossary-check-box mt-4">
                                     <button
                                       className="primary"
                                       onClick={() => {
                                         const checkQuestions = getQuestionsForGlossary(term.id, 3, attempts.map((a) => a.questionId));
                                         startCheckQuestions(checkQuestions);
                                       }}
                                     >
                                       <ListChecks size={16} /> この用語の関連問題を3問解く <ArrowRight size={16} />
                                     </button>
                                   </div>

                                   {/* 用語集の前後の項目ナビゲーション */}
                                   {(() => {
                                     const termIndex = glossaryTerms.findIndex((g) => g.id === term.id);
                                     const prevTerm = termIndex > 0 ? glossaryTerms[termIndex - 1] : null;
                                     const nextTerm = termIndex >= 0 && termIndex < glossaryTerms.length - 1 ? glossaryTerms[termIndex + 1] : null;
                                     return (
                                       <StudyItemNav
                                         itemTypeLabel="用語"
                                         currentIndex={termIndex + 1}
                                         totalCount={glossaryTerms.length}
                                         badgeLabel={term.category}
                                         prev={prevTerm ? { id: prevTerm.id, title: prevTerm.term } : null}
                                         next={nextTerm ? { id: nextTerm.id, title: nextTerm.term } : null}
                                         onSelect={(id) => setGlossaryTermId(id)}
                                       />
                                     );
                                   })()}
                                 </article>`;

// Normalize line endings
const normalize = (str) => str.replace(/\r\n/g, '\n');
let normContent = normalize(content);
const normGlossaryTarget = normalize(glossaryTarget);

if (!normContent.includes(normGlossaryTarget)) {
  console.error('Glossary target not found in page.tsx');
  process.exit(1);
}
normContent = normContent.replace(normGlossaryTarget, normalize(glossaryReplacement));

// 3. Add StudyItemNav to Comparison detail
const compareTarget = `                                   {/* 双方向リンク: 比較の関連問題3問 (要件4) */}
                                   <div className="comparison-check-box mt-4">
                                     <button
                                       className="primary"
                                       onClick={() => {
                                         const checkQuestions = getQuestionsForComparison(cmp.id, 3, attempts.map((a) => a.questionId));
                                         startCheckQuestions(checkQuestions);
                                       }}
                                     >
                                       <ListChecks size={16} /> この違いを3問で確認 <ArrowRight size={16} />
                                     </button>
                                   </div>
                                 </article>`;

const compareReplacement = `                                   {/* 双方向リンク: 比較の関連問題3問 (要件4) */}
                                   <div className="comparison-check-box mt-4">
                                     <button
                                       className="primary"
                                       onClick={() => {
                                         const checkQuestions = getQuestionsForComparison(cmp.id, 3, attempts.map((a) => a.questionId));
                                         startCheckQuestions(checkQuestions);
                                       }}
                                     >
                                       <ListChecks size={16} /> この違いを3問で確認 <ArrowRight size={16} />
                                     </button>
                                   </div>

                                   {/* 比較ガイドの前後の項目ナビゲーション */}
                                   {(() => {
                                     const cmpIndex = comparisonGuides.findIndex((c) => c.id === cmp.id);
                                     const prevCmp = cmpIndex > 0 ? comparisonGuides[cmpIndex - 1] : null;
                                     const nextCmp = cmpIndex >= 0 && cmpIndex < comparisonGuides.length - 1 ? comparisonGuides[cmpIndex + 1] : null;
                                     return (
                                       <StudyItemNav
                                         itemTypeLabel="比較ガイド"
                                         currentIndex={cmpIndex + 1}
                                         totalCount={comparisonGuides.length}
                                         badgeLabel="比較ガイド"
                                         prev={prevCmp ? { id: prevCmp.id, title: prevCmp.title } : null}
                                         next={nextCmp ? { id: nextCmp.id, title: nextCmp.title } : null}
                                         onSelect={(id) => setComparisonId(id)}
                                       />
                                     );
                                   })()}
                                 </article>`;

const normCompareTarget = normalize(compareTarget);
if (!normContent.includes(normCompareTarget)) {
  console.error('Compare target not found in page.tsx');
  process.exit(1);
}
normContent = normContent.replace(normCompareTarget, normalize(compareReplacement));

fs.writeFileSync(filePath, normContent, 'utf8');
console.log('Successfully updated page.tsx with StudyItemNav for Glossary and Comparison');
