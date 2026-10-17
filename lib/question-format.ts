export const multiSelectPatterns = ['benefits', 'characteristics', 'best_practices', 'scenario_judgment', 'scenario_actions'] as const;
export type MultiSelectPattern = (typeof multiSelectPatterns)[number];
export type QuestionType = 'single_select' | 'multi_select';
type Selectable = {type:string; requiredSelections?:number; choices:{id:string}[]; answer:string[]};
export const isMultiSelect = (q:{type:string}) => q.type === 'multi_select' || q.type === 'multiple-select';
export const questionType = (q:{type:string}):QuestionType => isMultiSelect(q)?'multi_select':'single_select';
export const requiredSelectionCount = (q:{type:string;requiredSelections?:number}) => q.requiredSelections ?? (isMultiSelect(q)?2:1);
export const multiSelectKind = (pattern?:MultiSelectPattern) => pattern?.startsWith('scenario_')?'scenario':'knowledge';
export function validSelection(q:Selectable,ids:string[]) {
 return ids.length===requiredSelectionCount(q)&&new Set(ids).size===ids.length&&ids.every(id=>q.choices.some(c=>c.id===id));
}
export function toggleSelection(q:Selectable,selected:string[],id:string) {
 if(!q.choices.some(c=>c.id===id))return selected;
 if(!isMultiSelect(q))return [id];
 if(selected.includes(id))return selected.filter(v=>v!==id);
 return selected.length<requiredSelectionCount(q)?[...selected,id]:selected;
}
export function answerDetails(correctChoiceIds:string[],selectedChoiceIds:string[]) {
 const selected=[...new Set(selectedChoiceIds)],correct=[...new Set(correctChoiceIds)];
 const correctSelected=selected.filter(id=>correct.includes(id));
 return {selectedChoiceIds:selected,correctChoiceIds:correct,correctSelectedChoiceIds:correctSelected,
  missingCorrectChoiceIds:correct.filter(id=>!selected.includes(id)),selectedWrongChoiceIds:selected.filter(id=>!correct.includes(id)),
  partialMatch:correct.length?correctSelected.length/correct.length:0};
}
