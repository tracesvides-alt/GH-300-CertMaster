'use client';
import { ArrowRight, Shuffle, Target, Scale, Layers, BookOpen, Flame } from 'lucide-react';
import { domains, objectives } from '@/lib/content';
import { questionCounts, type SelectionOptions } from '@/lib/selection';
export function CountPicker({
  value,
  onChange,
  label = '問題数',
}: {
  value: number;
  onChange: (count: SelectionOptions['count']) => void;
  label?: string;
}) {
  return (
    <fieldset className="count-picker">
      <legend>{label}</legend>
      <div className="count-buttons">
        {questionCounts.map((n) => (
          <button
            type="button"
            aria-label={`${n}問`}
            aria-pressed={value === n}
            className={value === n ? 'chosen' : ''}
            key={n}
            onClick={() => onChange(n)}
          >
            {n}
            <small>{n === 50 ? '本番想定' : '問'}</small>
          </button>
        ))}
      </div>
      <p className="caption">
        {value <= 10
          ? '移動時間や隙間時間に。'
          : value < 50
            ? 'いつもの学習を、もう少しじっくり。'
            : '本番を意識した長時間演習。公式試験の問題数が50問固定という意味ではありません。'}
      </p>
    </fieldset>
  );
}
export default function PracticeSetup({
  options,
  onChange,
  onStart,
  ready,
  verifiedCount,
  loading,
  notice,
}: {
  options: SelectionOptions;
  onChange: (options: SelectionOptions) => void;
  onStart: () => void;
  ready: boolean;
  verifiedCount: number;
  loading?: string;
  notice?: string;
}) {
  const patch = (value: Partial<SelectionOptions>) => onChange({ ...options, ...value });
  return (
    <section className="panel practice-setup">
      <div className="section-title">
        <div>
          <span className="eyebrow">SESSION CONFIGURATION</span>
          <h2>問題演習の設定</h2>
        </div>
        <span className="verified">{verifiedCount} Verified Questions</span>
      </div>
      <CountPicker value={options.count} onChange={(count) => patch({ count })} />
      <fieldset className="selection-modes">
        <legend>出題モード</legend>
        {[
          {
            id: 'Random',
            title: 'ランダム',
            text: '全範囲からランダム出題。Objectiveの偏りを抑えます。',
            icon: Shuffle,
          },
          {
            id: 'Syllabus Weighted',
            title: 'シラバス準拠',
            text: 'GH-300公式Domain比率を考慮。',
            icon: Scale,
          },
          {
            id: 'Weak Points',
            title: '苦手分野',
            text: '回答履歴から、Masteryの低いObjectiveを優先。',
            icon: Target,
          },
        ].map(({ id, title, text, icon: Icon }) => (
          <label className={`selection-mode ${options.mode === id ? 'chosen' : ''}`} key={id}>
            <input
              name="selection-mode"
              type="radio"
              checked={options.mode === id}
              onChange={() => patch({ mode: id as SelectionOptions['mode'] })}
            />
            <Icon size={20} />
            <span>
              <strong>{title}</strong>
              <small>{text}</small>
            </span>
          </label>
        ))}
      </fieldset>
      <fieldset className="selection-modes">
        <legend>難易度バランス</legend>
        {[
          {
            id: 'balanced',
            title: 'バランス（標準）',
            text: '基礎20% · 応用40% · 本番40%。知識定着と実戦力を両立。',
            icon: Layers,
          },
          {
            id: 'foundation',
            title: '基礎中心',
            text: '基礎60% · 応用35% · 本番5%。教材学習直後の用語・概念確認。',
            icon: BookOpen,
          },
          {
            id: 'exam',
            title: '本番レベル',
            text: '本番シナリオ70〜80% · 応用20〜30%。試験直前の高負荷演習。',
            icon: Flame,
          },
        ].map(({ id, title, text, icon: Icon }) => (
          <label
            className={`selection-mode ${options.difficultyMode === id ? 'chosen' : ''}`}
            key={id}
          >
            <input
              name="difficulty-mode"
              type="radio"
              checked={options.difficultyMode === id}
              onChange={() => patch({ difficultyMode: id as SelectionOptions['difficultyMode'] })}
            />
            <Icon size={20} />
            <span>
              <strong>{title}</strong>
              <small>{text}</small>
            </span>
          </label>
        ))}
      </fieldset>
      <fieldset className="practice-options">
        <legend>OPTIONS</legend>
        <label>
          <input
            type="checkbox"
            checked={options.preferUnanswered}
            onChange={(e) => patch({ preferUnanswered: e.target.checked })}
          />
          未回答問題を優先
        </label>
        <label>
          <input
            type="checkbox"
            checked={options.avoidRecent}
            onChange={(e) => patch({ avoidRecent: e.target.checked })}
          />
          最近解いた問題を避ける
        </label>
        <label>
          <input
            type="checkbox"
            checked={options.verifiedOnly}
            onChange={(e) =>
              patch({ verifiedOnly: e.target.checked, includeAI: !e.target.checked })
            }
          />
          Verifiedのみ
        </label>
        <label>
          <input
            type="checkbox"
            checked={options.includeAI}
            onChange={(e) =>
              patch({ includeAI: e.target.checked, verifiedOnly: !e.target.checked })
            }
          />
          AI問題を含める
        </label>
        <p className="caption">AI問題を含める場合もVerifiedを優先。AI Generatedは未検証です。</p>
      </fieldset>
      <details className="advanced-filters">
        <summary>Domain・Objective・復習対象を絞る</summary>
        <div className="filterline">
          <label>
            Domain
            <select
              value={options.domainId}
              onChange={(e) => patch({ domainId: e.target.value, objectiveId: 'all' })}
            >
              <option value="all">すべての分野</option>
              {domains.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Objective
            <select
              value={options.objectiveId}
              onChange={(e) => patch({ objectiveId: e.target.value })}
            >
              <option value="all">すべてのObjective</option>
              {objectives
                .filter((o) => options.domainId === 'all' || o.domainId === options.domainId)
                .map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.title}
                  </option>
                ))}
            </select>
          </label>
          <label>
            復習対象
            <select
              value={options.scope}
              onChange={(e) => patch({ scope: e.target.value as SelectionOptions['scope'] })}
            >
              <option value="all">すべて</option>
              <option value="incorrect">間違えた問題</option>
              <option value="bookmarked">ブックマーク</option>
            </select>
          </label>
        </div>
      </details>
      <button type="button" className="primary answerbutton" onClick={onStart} disabled={!ready} aria-busy={!!loading}>
        {loading ?? '演習を開始する'} <ArrowRight size={18} />
      </button>
      {notice && <p className="notice" role="status">{notice}</p>}
      <p className="caption setup-note">
        問題不足時は出題数を調整して開始します。同じセッションで同じ問題は出題しません。
      </p>
    </section>
  );
}
