/** Storage IDs identify choices; letters identify their current display positions. */
export function choiceLabel(question: { choices: { id: string }[] }, id: string) {
  const index = question.choices.findIndex(c => c.id === id);
  return index < 0 ? '不明' : String.fromCharCode(65 + index);
}
export function answerLabels(question: { choices: { id: string }[] }, ids: string[]) {
  return question.choices.filter(c => ids.includes(c.id)).map(c => choiceLabel(question, c.id)).join(', ');
}
