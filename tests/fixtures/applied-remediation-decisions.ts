// Human-adjudicated actions. These locate answer content without reading answer IDs.
export const remediationDecisions: Array<[string, RegExp]> = [
 ['q-d2-a23',/ポートを8770/],['q-d2-a24',/ノート手順だけをPrompt File/],
 ['q-d2-a26',/依存更新を分け.*既存依存で検証/],
 ['q-d3-a13',/8秒以上待って.*同時実行数を抑える/],
 ['q-d3-a15',/数値は達成・書式は未達/],['q-d3-a16',/入力、返されたコード、生成時の条件/],
 ['q-d3-a19',/^前置き＋本文Yを送信し、前置き＋本文Xは送信しない$/],
 ['q-d5-a12',/価格>=100で0.8倍/],['q-d5-a15',/整数17は拒否、整数18は許可、文字列「18」は拒否/],
 ['q-d6-a11',/^secrets\/\*\*\/\*\.keyを除外する$/],
 ['q-d6-a12',/^BのIDEを再読み込みし、同じファイルの除外表示と補完を確認する$/],
 ['q-d6-a14',/^組織側でconfig\/\*\*の除外ルールを変更する$/],
];
