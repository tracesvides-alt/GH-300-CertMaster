// Editorial actions. These locate answer content without reading answer IDs.
export const remediationDecisions: Array<[string, RegExp]> = [
 ['q-d2-a23',/^stdio接続としてcommandとargs/],['q-d2-a24',/規約は共通指示、ノート手順は.github\/prompts/],
 ['q-d2-a26',/依存更新を分け.*既存依存で検証/],
 ['q-d3-a13',/Copilot Seat一覧.*GitHubアカウント/],
 ['q-d3-a15',/出力文字列.*二桁.*書式/],['q-d3-a16',/コード・型・依頼と提示された提案/],
 ['q-d3-a19',/選択モデルの入力制約.*会話履歴・指示・添付資料/],
 ['q-d5-a12',/99→99と100→80/],['q-d5-a15',/整数17は拒否、整数18は許可、文字列「18」は拒否/],
 ['q-d6-a11',/^Copilotの除外対象はsecrets配下の全階層の.keyになる$/],
 ['q-d6-a12',/^BのIDEを再読み込みし、同じファイルの除外表示と補完を確認する$/],
 ['q-d6-a14',/^組織側でconfig\/\*\*の除外ルールを変更する$/],
];
