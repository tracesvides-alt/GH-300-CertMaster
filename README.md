# GH-300 CertMaster

GitHub Copilot Certification「**GH-300**」のための、知的な開発者ワークスペース型・日本語学習Webアプリケーション（PWA対応）です。Next.js 16 (Turbopack) / TypeScript / Vanilla CSS + Tailwind CSS v4 で実装されています。

基準シラバスは **Skills measured as of August 7, 2026**。Microsoft LearnのGH-300 Study GuideおよびGitHub公式ドキュメントを唯一の**Source of Truth**として構築されています。非公式ブログや試験ダンプ等の信頼性のない情報は一切含みません。

---

## 🌟 主な特徴

### 1. 「AI・開発者ツール・知的なワークスペース」デザインシステム
単なる一般的な問題集アプリではなく、洗練された開発環境のような上質さと学習効率を両立したUIを提供します。
- **トーンの黄金比**: `70% clean and minimal` / `20% technical and intelligent` / `10% futuristic accent`
- **Color System**: 深みのあるダークグラファイト（`#0b0f14`, `#131922`）を基調とし、知的なクールAIシアン（`#00d4e6`）をアクセントに採用。
- **Background Treatment**: 文字可読性を100%維持した微小ソフトビネットと極小テクニカルパターンテクスチャ。
- **Typography**: 本文には極上の可読性を誇る `Inter` / システムフォント、数字・スコア・バッジ・コードには `JetBrains Mono`（等幅フォント）を適用。
- **Mobile First**: 片手操作に最適化された48px以上のタップ領域と、ブラー効果を備えた洗練されたボトムナビゲーション。

### 2. 包括的な教材Knowledge Base（2026-08-07シラバス完全網羅）
GH-300の全6 Domain / 14 Objectiveを隙間なくカバーする高品質な教材データベースを内蔵。
- **構造化レッスン 28本**:
  - 1本あたり平均8.0分で読めるマイクロラーニング形式。
  - `Core Concepts`（概念解説）、`How It Works`（動作メカニズム）、`Scenario Application`（実務・試験シナリオ）、`30-Second Check`（理解度確認）、`Official Sources`（公式出典リンク）を完全完備。
- **用語集（Glossary）110件**:
  - 重要度別: **Essential（必須）57件**, **Important（重要）50件**, **Supplementary（補助）3件**。
  - 日英対訳、定義、`Exam Tips`（試験対策ポイント）、`Common Pitfalls`（よくある落とし穴）、関連用語・レッスンへの相互リンクを保持。
- **多軸比較ガイド 12本**:
  - 試験で最も混同しやすい技術概念（Copilot Free vs Pro vs Business vs Enterprise、Content Exclusion vs Policy、Embeddings vs RAG等）を徹底整理。
  - `Comparison Table`（多軸比較表）、`Decision Guide`（選択決定フロー）、`Common Traps`（共通トラップ）、`Exam Tips`を収録。
- **公式出典台帳 19件**:
  - Microsoft LearnおよびGitHub Docsの公式ドキュメントURL、確認日、関連Objectiveを一元管理。

### 3. 多彩な学習・演習モード
- **Dashboard（AI学習コックピット）**:
  - **Exam Readiness ヒーローカード**: 合格目標ライン（700点 / 70%）への到達度を示す知的なテクニカルリングプログレス。
  - **Domain Mastery**: 6分野の出題重み比率と習熟度バーを即座に可視化。
  - **Weak Point Focus**: 苦手なObjectiveをシャープにサジェスト。
- **Practice（問題演習）**:
  - 出題数: 5 / 10 / 25 / 50問から選択（CountPicker）。
  - 出題モード: ランダム出題 / シラバス重み準拠 / 苦手分野集中（Weak Points）。
  - **AI INSIGHT 解説**: 「Why this is correct（正解の根拠）」「選択肢ごとの詳細分析」を構造化して表示。
- **Mock（模擬試験）**:
  - 50問（または5/10/25問）の本番想定模試。
  - 試験時間カウントダウンタイマー（問題数×90秒）、中断保存・再開、終了後の総合レポート。
- **Study（教材・用語・比較）**:
  - レッスン、用語集、比較ガイドの3大サブタブと、全体を横断検索できる**Global Search**を搭載。
- **Review（復習ノート）**:
  - 過去の回答履歴、ブックマークした問題、要復習項目の確認。

### 4. 統計的・科学的な習熟度アルゴリズム
- **Weak Point Selection**:
  - ベータ分布 $\text{Beta}(2,2)$ によるベイズ平滑化スコアを算出し、1〜2回の偶発的なミスでスコアが極端に変動するのを防止。
- **Question Selection Engine**:
  - 重複回避、未回答優先ボーナス、直近回答ペナルティ、反復ペナルティを組み合わせたDB非依存の抽選エンジン。

---

## 🚀 起動方法

### 前提環境
- Node.js 20以上（推奨: Node.js 22+）
- npm

### 開発サーバーの起動
```bash
npm ci
npm run dev
```
ブラウザで [http://localhost:3000](http://localhost:3000)（または表示されたポート）を開いてください。

### 本番ビルドと起動
```bash
npm run build
npm run start
```

---

## 📁 ディレクトリ構成

```text
app/
  layout.tsx                     ルートレイアウト、PWAメタデータ、Viewport設定
  page.tsx                       メインSPA（Home / Study / Practice / Mock / Review）
  globals.css                    デザインシステム（Tokens, Surfaces, Components）
  components/
    practice-setup.tsx           問題数ピッカー（CountPicker）と出題設定
    practice-result.tsx          演習結果サマリー、改善Objective分析、AI Insight
  api/
    tutor/route.ts               AIチューター用サーバーエンドポイント
content/gh300/2026-08-07/
  syllabus.json                  GH-300シラバス（6 Domain / 14 Objective / トピック一覧）
  sources.json                   19件の公式ドキュメント出典台帳
  lessons/
    seed.json                    28本の構造化レッスン（全Objective網羅）
  glossary/
    terms.json                   110件の用語集（Essential / Important / Supplementary）
  comparisons/
    guides.json                  12本の多軸比較ガイド
  questions/
    seed.json                    根拠付きVerified固定問題
lib/
  content.ts                     教材読み込み、スキーマ定義、グローバル検索
  knowledge.ts                   Knowledge Baseの整合性検証（双方向リンク監査等）
  learning.ts                    採点ロジック、Readiness計算、Streak計測
  selection.ts                   DB非依存のQuestion Selection Engine
  practice-session.ts            セッション管理とObjective改善集計
  db.ts                          Dexie (IndexedDB) ローカルファースト永続化
public/
  manifest.webmanifest           PWAマニフェスト
  sw.js                          Service Worker（オフラインキャッシュ対応）
  icon.svg                       アプリアイコン
snapshots/
  gh300.json                     公式Study GuideのSHA-256ハッシュ
  gh300.txt                      公式シラバス本文スナップショット
tests/
  core.test.ts                   Knowledge Base・スキーマ・リンク・IndexedDB検証
  selection.test.ts              抽選アルゴリズム・分布シミュレーション検証
```

---

## 🧪 テストと品質検証

本プロジェクトは厳密な自動テストとスキーマ検証を行っています。

```bash
# TypeScript 型チェック
npx tsc --noEmit

# Vitest 単体・結合テスト（83テスト全件パス）
npm test

# プロダクションビルド（Turbopack）
npm run build

# シラバス更新監視（公式Study Guideのハッシュ検証）
npm run syllabus:check
```

---

## 📚 公式 Source of Truth

- [Microsoft Learn: GH-300 Study Guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)
- [GitHub Docs: GitHub Copilot Documentation](https://docs.github.com/en/copilot)
- [GitHub Docs: Responsible use of GitHub Copilot](https://docs.github.com/en/copilot/responsible-use)
- [GitHub Trust Center: Privacy and Data Protection](https://resources.github.com/copilot-trust-center/)

---

## 📄 ライセンス・免責事項

本アプリはGitHubおよびMicrosoftの公式アプリケーションではありません。公式の試験問題を漏洩・転載したものではなく、公式ドキュメントおよび公開シラバスに基づき独自に作成された試験対策学習アプリです。
