import type {formatAccuracy} from '@/lib/learning';
export default function FormatAnalytics({rows}:{rows:ReturnType<typeof formatAccuracy>}){
 return <section aria-label="出題形式別の成績"><h3>出題形式別の成績</h3>
  {rows.slice(0,4).map(r=><p className="result-row" key={r.id}><span>{r.label}</span><strong>{r.total?`${r.correct} / ${r.total} · ${Math.round(r.accuracy!)}%`:'未回答'}</strong></p>)}
  <details><summary>複数選択パターン別</summary>{rows.slice(4).map(r=><p className="result-row" key={r.id}><span>{r.label}</span><strong>{r.total?`${r.correct} / ${r.total} · ${Math.round(r.accuracy!)}%`:'未回答'}</strong></p>)}</details>
  <p className="caption">複数選択も完全一致のみ正解です。部分一致は得点に含めません。</p></section>;
}
