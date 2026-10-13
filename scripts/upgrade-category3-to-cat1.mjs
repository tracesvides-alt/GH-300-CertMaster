import fs from "node:fs";
import { createHash } from "node:crypto";
import { execSync } from "node:child_process";

const root = "content/gh300/2026-08-07/questions/";
const seedPath = `${root}seed.json`;
const qualPath = `${root}quality-review.json`;
const diffPath = `${root}difficulty-review.json`;
const clsPath = "reports/question-objective-classification-review.json";
const appRevPath = "reports/applied-question-quality-review.json";
const cleanupPath = "reports/d4-d5-applied-cleanup-review.json";
const remedPath = "reports/applied-remediation-review.json";

const seed = JSON.parse(fs.readFileSync(seedPath, "utf8"));
const qual = JSON.parse(fs.readFileSync(qualPath, "utf8"));
const diff = JSON.parse(fs.readFileSync(diffPath, "utf8"));
const cls = JSON.parse(fs.readFileSync(clsPath, "utf8"));
const appRev = JSON.parse(fs.readFileSync(appRevPath, "utf8"));
const cleanup = JSON.parse(fs.readFileSync(cleanupPath, "utf8"));
const remed = JSON.parse(fs.readFileSync(remedPath, "utf8"));

const hash = (v) => createHash("sha256").update(JSON.stringify(v)).digest("hex");

// 8 Rewritten Questions Definitions - Sophisticated Distractors (Blind-Proof)
const upgradedQuestions = [
  {
    id: "q-d1-a02",
    syllabusVersion: "2026-08-07",
    domainId: "d1",
    objectiveId: "d1o2",
    difficulty: "intermediate",
    type: "single-select",
    status: "verified",
    cognitiveLevel: "apply",
    scenarioType: "condition-application",
    testedConcepts: ["d1o2", "secure-prompting", "sql-injection-mitigation"],
    distractorQuality: "scenario-contrast",
    examLike: false,
    clues: ["データアクセス層", "文字列連結", "安全なパラメータバインディング"],
    contentRevision: "cat1-copilot-native-upgrade-2026-10-14",
    question: "開発者がGitHub Copilotを利用してユーザー検索APIのデータアクセス層を実装しようとしています。以前の試行では、Copilotがリクエストパラメータを文字列連結で埋め込む脆弱な生SQLクエリを提案するケースがありました。個別関数のプロンプトへの指示改善によって、モデルが最初から安全なパラメータバインディングや型安全なORMメソッドのみを生成するように制約するためのアプローチとして、最も適切なものはどれですか？",
    choices: [
      {
        id: "B",
        text: "既存の別機能で実装された過去のSQLクエリ（文字列連結を含むレガシーコード）を「参考実装」としてプロンプトに添付し、その構文を踏襲して書くよう指示する"
      },
      {
        id: "D",
        text: "リポジトリのルートに `.github/copilot-instructions.md` を作成し、プロジェクト全体で生SQLを禁止してORM利用を推奨する全般ルールを記述して出力を待つ"
      },
      {
        id: "A",
        text: "プロンプト内でORM（Prisma等）のスキーマ定義を参照させ、生SQLの文字列連結を明示的に禁止してパラメータ化クエリや型安全なメソッドの使用を強制する"
      },
      {
        id: "C",
        text: "CIパイプラインにGitHub Advanced Security（CodeQL）の静的解析ワークフローを組み込み、PR作成後の自動スキャンでSQLインジェクションを検出させる"
      }
    ],
    answer: ["A"],
    explanation: "正解です。特定の関数プロンプトにおいて安全なコードを直ちに生成させるには、曖昧な指示や広域設定ではなく、具体的なORM型定義を参照させ、生SQL連結の禁止とパラメータバインディングの適用という直接的な制約条件を与えることが最も効果的です。",
    choiceExplanations: {
      A: "正解です。特定の関数プロンプトにおいて安全なコードを直ちに生成させるには、曖昧な指示や広域設定ではなく、具体的なORM型定義を参照させ、生SQL連結の禁止とパラメータバインディングの適用という直接的な制約条件を与えることが最も効果的です。",
      B: "レガシーコードの添付はFew-shot効果によりモデルが脆弱な文字列連結パターンを学習・再現してしまうため逆効果となります。",
      C: "CIでのCodeQL解析は多層防御として重要ですが、プロンプト指示による生成時制約ではなく、マージ前の事後検出にとどまります。",
      D: "リポジトリ共通指示は全体方針として有用ですが、個別関数の実装においてモデルを特定の型安全メソッドへ直ちに誘導するプロンプト制約にはなりません。"
    },
    sourceIds: ["responsible", "prompt", "ml-sql-injection"],
    createdAt: "2026-09-07",
    lastVerifiedAt: "2026-10-14",
    trustedSourceFacts: [
      "具体的なORM型定義の提示と生SQL連結の禁止指示により、Copilotへ安全なクエリ生成を強制できる。",
      "レガシーコードの添付は脆弱なパターンの模倣を誘発する。",
      "CodeQLによるCI検出は重要だが生成時のプロンプト制約の代替にはならない。",
      "リポジトリ共通指示だけでは個別関数の型安全な生成誘導として直接的な制約にならない。"
    ],
    choiceQuality: {
      A: { plausibility: 3, distractorType: "correct", sourceIds: ["responsible", "prompt"], rationale: "ORMのスキーマと明確な制約指示を与えることで安全な生成を強制できる。" },
      B: { plausibility: 3, distractorType: "common-confusion", sourceIds: ["responsible", "prompt"], rationale: "古いコードの添付は脆弱性を再生産させる。" },
      C: { plausibility: 3, distractorType: "partial-match", sourceIds: ["responsible", "prompt"], rationale: "CIスキャンは事後検出でありプロンプト制約ではない。" },
      D: { plausibility: 3, distractorType: "partial-match", sourceIds: ["responsible", "prompt"], rationale: "全体指示だけでは局所的な型安全制約として不十分。" }
    },
    requirementMapping: [
      {
        requirement: "開発者がGitHub Copilotを利用してユーザー検索APIのデータアクセス層を実装しようとしています。以前の試行では、Copilotがリクエストパラメータを文字列連結で埋め込む脆弱な生SQLクエリを提案するケースがありました。個別関数のプロンプトへの指示改善によって、モデルが最初から安全なパラメータバインディングや型安全なORMメソッドのみを生成するように制約するためのアプローチとして、最も適切なものはどれですか？",
        correctReason: "ORMのスキーマ定義を参照させ、生SQL連結の禁止とパラメータバインディングを明示的に制約する。",
        distractorFailures: {
          B: "古いコードの添付は脆弱性を再生産させる。",
          C: "CIスキャンは事後検出でありプロンプト制約ではない。",
          D: "全体指示だけでは局所的な型安全制約として不十分。"
        }
      }
    ]
  },
  {
    id: "q-d1-a04",
    syllabusVersion: "2026-08-07",
    domainId: "d1",
    objectiveId: "d1o2",
    difficulty: "intermediate",
    type: "single-select",
    status: "verified",
    cognitiveLevel: "apply",
    scenarioType: "condition-application",
    testedConcepts: ["d1o2", "secret-leak-prevention", "push-protection"],
    distractorQuality: "scenario-contrast",
    examLike: false,
    clues: ["外部決済ゲートウェイ", "API秘密鍵", "ハードコード"],
    contentRevision: "cat1-copilot-native-upgrade-2026-10-14",
    question: "GitHub Copilotに外部決済ゲートウェイと連携するクライアントモジュールの作成を依頼したところ、テスト用のAPI秘密鍵をソースコード内に文字列リテラルとして直接ハードコードした実装が提案されました。このような機密資格情報のコード混入を防ぎ、安全に開発を進めるための責任あるAI利用およびリポジトリ運用の組み合わせとして、最も適切なものはどれですか？",
    choices: [
      {
        id: "A",
        text: "プロンプトで環境変数や安全なシークレットストアからの取得を明示的に指示し、リポジトリ側でSecret ScanningとPush Protectionを有効化して検知・防御する"
      },
      {
        id: "C",
        text: "リポジトリのブランチ保護ルールでPRマージ時の人間による手動目視レビューを必須化し、コード内の文字列リテラルに秘密鍵が含まれていないかレビュアーが確認する"
      },
      {
        id: "B",
        text: "`.gitignore` に設定ファイル（`.env`）を追加した上で、Organization設定でCopilot Content Exclusionを有効化して設定ファイルへのアクセスを遮断する"
      },
      {
        id: "D",
        text: "GitHub Actionsの Secrets にAPIキーを登録し、ローカル環境でのコード補完を無効化してCIパイプラインのテスト実行時のみ環境変数として注入する運用にする"
      }
    ],
    answer: ["A"],
    explanation: "正解です。AIが機密情報をコードに直接記述するリスクに対しては、プロンプト指示で環境変数等の安全な参照パターンを強制するとともに、リポジトリ側でSecret ScanningおよびPush Protectionを有効化してPushを自動阻止する多層防御が不可欠です。",
    choiceExplanations: {
      A: "正解です。AIが機密情報をコードに直接記述するリスクに対しては、プロンプト指示で環境変数等の安全な参照パターンを強制するとともに、リポジトリ側でSecret ScanningおよびPush Protectionを有効化してPushを自動阻止する多層防御が不可欠です。",
      B: "Content Exclusionは指定ファイルの内容をAIの文脈から除外する機能ですが、モデルがコード内に秘密鍵を生成・コミットすること自体を防ぐことはできません。",
      C: "PR時の目視レビューは重要ですが、コミットやPush時点で自動遮断するPush Protectionがなければ、リポジトリへの秘密鍵送信を未然に防ぐことはできません。",
      D: "CIシークレット管理は正当ですが、ローカルでの補完を無効化する運用は開発体験を損ない、エディタ上での安全なコード生成アプローチになりません。"
    },
    sourceIds: ["responsible", "secret-scanning", "public-code"],
    createdAt: "2026-09-07",
    lastVerifiedAt: "2026-10-14",
    trustedSourceFacts: [
      "環境変数経由の取得指示とPush Protectionの併用により、AI生成コードへの機密情報混入を未然に防止できる。",
      "Content Exclusionは文脈除外機能であり秘密鍵のコード生成やPush自体を防御しない。",
      "目視レビューだけではPush時点での秘密鍵漏洩を自動防止できない。",
      "CI Secretsへの登録はローカルエディタでの安全なプロンプティングの代替にならない。"
    ],
    choiceQuality: {
      A: { plausibility: 3, distractorType: "correct", sourceIds: ["responsible", "secret-scanning"], rationale: "環境変数の指示とPush Protectionの組み合わせが正しい多層防御。" },
      B: { plausibility: 3, distractorType: "partial-match", sourceIds: ["responsible", "secret-scanning"], rationale: "Content Exclusionは文脈除外でありPush遮断にならない。" },
      C: { plausibility: 3, distractorType: "common-confusion", sourceIds: ["responsible", "secret-scanning"], rationale: "目視確認だけではPush時の自動遮断ができない。" },
      D: { plausibility: 3, distractorType: "partial-match", sourceIds: ["responsible", "secret-scanning"], rationale: "CIシークレット管理はローカル生成の制御にならない。" }
    },
    requirementMapping: [
      {
        requirement: "GitHub Copilotに外部決済ゲートウェイと連携するクライアントモジュールの作成を依頼したところ、テスト用のAPI秘密鍵をソースコード内に文字列リテラルとして直接ハードコードした実装が提案されました。このような機密資格情報のコード混入を防ぎ、安全に開発を進めるための責任あるAI利用およびリポジトリ運用の組み合わせとして、最も適切なものはどれですか？",
        correctReason: "環境変数等からの取得をプロンプトで指示し、Secret ScanningとPush Protectionで多層防御する。",
        distractorFailures: {
          B: "Content ExclusionはPush遮断の代替にならない。",
          C: "目視レビューだけではPush時の漏洩を防げない。",
          D: "CI Secretsはローカル生成の制御にならない。"
        }
      }
    ]
  },
  {
    id: "q-d1-a07",
    syllabusVersion: "2026-08-07",
    domainId: "d1",
    objectiveId: "d1o2",
    difficulty: "intermediate",
    type: "single-select",
    status: "verified",
    cognitiveLevel: "apply",
    scenarioType: "condition-application",
    testedConcepts: ["d1o2", "code-review", "branch-protection"],
    distractorQuality: "scenario-contrast",
    examLike: false,
    clues: ["Copilot Code Review", "PR作成時", "ガバナンス設計"],
    contentRevision: "cat1-copilot-native-upgrade-2026-10-14",
    question: "チームでGitHub Copilot Code Review（AIによるPR自動レビュー機能）を導入しました。CopilotはPR作成時に自動で差分を解析し、コード品質や潜在的なバグに関するレビューコメントを出力します。この機能を活用するにあたり、AIのレビュー結果と人間のエンジニアによるマージ判断のガバナンス設計として、最も適切なものはどれですか？",
    choices: [
      {
        id: "C",
        text: "Copilot Code Reviewの指摘事項が0件になった時点でPRを自動ApproveするGitHub Actionsワークフローを構築し、マージまでのリードタイムを最小化する"
      },
      {
        id: "B",
        text: "チーム内のジュニアエンジニアのPRのみCopilot Code Reviewを必須とし、シニアエンジニアのPRではAIレビューとピアレビューの両方を免除する運用ルールにする"
      },
      {
        id: "D",
        text: "Copilot Code Reviewで指摘された修正提案を自動コミットするスクリプトを導入し、差分が解消されたらCIテストの通過のみを条件として自動マージする"
      },
      {
        id: "A",
        text: "Copilotのレビューコメントは作成者のセルフレビュー補助として活用し、マージの前提条件としては引き続き人間のレビュアーによる承認をルールセットで必須化する"
      }
    ],
    answer: ["A"],
    explanation: "正解です。Copilot Code Reviewは開発者の初期チェックやフィードバックを迅速化する支援ツールであり、人間のピアレビューを代替・省略するものではありません。マージにあたってはルールセットによって人間の承認を必須とし、AIの助言を人間が検証・判断する責任ある運用が必要です。",
    choiceExplanations: {
      A: "正解です。Copilot Code Reviewは開発者の初期チェックやフィードバックを迅速化する支援ツールであり、人間のピアレビューを代替・省略するものではありません。マージにあたってはルールセットによって人間の承認を必須とし、AIの助言を人間が検証・判断する責任ある運用が必要です。",
      B: "ロールに応じて品質基準やピアレビューを免除する運用は、重大なバグやセキュリティ欠陥の見落としを招くため不適切です。",
      C: "AIの指摘0件を理由に自動Approveする設計はガバナンス上の責任放棄であり、AIが見逃した潜在リスクをそのままマージする危険があります。",
      D: "AI指摘の機械的な自動コミットと無人マージは、不適切な修正提案やアーキテクチャ破壊をそのまま取り込むリスクがあります。"
    },
    sourceIds: ["responsible", "code-review"],
    createdAt: "2026-09-07",
    lastVerifiedAt: "2026-10-14",
    trustedSourceFacts: [
      "Copilot Code Reviewは人間のピアレビューを補助するものであり、マージには人間の承認を必須とするガバナンスが求められる。",
      "ロール別であってもピアレビューの免除はコードガバナンスに反する。",
      "AI指摘ゼロによる自動Approveはガバナンス上の責任放棄となる。",
      "AI指摘の全自動適用による無人マージは品質リスクを引き起こす。"
    ],
    choiceQuality: {
      A: { plausibility: 3, distractorType: "correct", sourceIds: ["responsible", "code-review"], rationale: "人間の承認を必須とし、AIレビューを補助とするのが正しいガバナンス。" },
      B: { plausibility: 3, distractorType: "common-confusion", sourceIds: ["responsible", "code-review"], rationale: "シニアであってもピアレビュー免除は不適切。" },
      C: { plausibility: 3, distractorType: "partial-match", sourceIds: ["responsible", "code-review"], rationale: "AIによる自動Approveは責任ある利用に反する。" },
      D: { plausibility: 3, distractorType: "wrong-mechanism", sourceIds: ["responsible", "code-review"], rationale: "全自動マージは責任ある利用に反する。" }
    },
    requirementMapping: [
      {
        requirement: "チームでGitHub Copilot Code Review（AIによるPR自動レビュー機能）を導入しました。CopilotはPR作成時に自動で差分を解析し、コード品質や潜在的なバグに関するレビューコメントを出力します。この機能を活用するにあたり、AIのレビュー結果と人間のエンジニアによるマージ判断のガバナンス設計として、最も適切なものはどれですか？",
        correctReason: "AIレビューを補助とし、ルールセットで人間のレビュー承認を引き続き必須とする。",
        distractorFailures: {
          B: "シニアであってもピアレビュー免除は不適切。",
          C: "AIによる自動Approveは責任ある利用に反する。",
          D: "無人での自動マージは責任ある利用原則に反する。"
        }
      }
    ]
  },
  {
    id: "q-d2-a04",
    syllabusVersion: "2026-08-07",
    domainId: "d1",
    objectiveId: "d1o2",
    difficulty: "intermediate",
    type: "single-select",
    status: "verified",
    cognitiveLevel: "apply",
    scenarioType: "condition-application",
    testedConcepts: ["d1o2", "cli-safety", "command-verification"],
    distractorQuality: "scenario-contrast",
    examLike: false,
    clues: ["Copilot CLI", "クリーンアップ", "一括削除コマンド"],
    contentRevision: "cat1-copilot-native-upgrade-2026-10-14",
    question: "開発者がGitHub Copilot CLIを利用して、開発環境の古いログやキャッシュファイルをクリーンアップするシェルコマンドの作成を依頼しました。Copilot CLIはワイルドカード（*）や再帰削除オプション（-rf）を含む一括削除コマンドを提示しました。このコマンドを安全に実行するために開発者が取るべき検証手順として、最も適切なものはどれですか？",
    choices: [
      {
        id: "B",
        text: "提示されたコマンドの実行履歴がシェルのヒストリファイル（`~/.bash_history`）に残らないよう、コマンドの先頭にスペースを挿入して実行する"
      },
      {
        id: "C",
        text: "Gitリポジトリへの自動コミットを行うエイリアスを事前に作成しておき、コマンド実行後に不要な削除が発生した場合に `git checkout` で復元できるようにする"
      },
      {
        id: "D",
        text: "提示された一括削除コマンドをシェルスクリプトファイルとして保存し、実行権限を `chmod 700` に制限した上でバックグラウンドプロセスとして実行する"
      },
      {
        id: "A",
        text: "提示されたコマンドを即座に実行せず、影響を受ける対象ファイル一覧をdry-runや一覧表示で事前にプレビューし、重要データが含まれていないか目視確認してから実行する"
      }
    ],
    answer: ["A"],
    explanation: "正解です。Copilot CLIが提案するファイル削除やシステム変更コマンドには、意図しないファイルまで巻き込むリスクがあります。提示されたコマンドを盲信して即座に実行せず、dry-runや一覧表示によって対象を事前に確認してから実行を承認することが必須です。",
    choiceExplanations: {
      A: "正解です。Copilot CLIが提案するファイル削除やシステム変更コマンドには、意図しないファイルまで巻き込むリスクがあります。提示されたコマンドを盲信して即座に実行せず、dry-runや一覧表示によって対象を事前に確認してから実行を承認することが必須です。",
      B: "先頭スペースの挿入は履歴秘匿には有効ですが、コマンドの実行安全性や削除対象の検証には一切なりません。",
      C: "Git管理下のコードは復元できますが、ログやキャッシュなどのGit管理外（.gitignore対象）の重要データは消失すると復元できません。",
      D: "スクリプト化や権限制限は実行管理には役立ちますが、削除対象ファイル自体の検証にはならずデータ破壊を防げません。"
    },
    sourceIds: ["cli", "responsible"],
    createdAt: "2026-09-07",
    lastVerifiedAt: "2026-10-14",
    trustedSourceFacts: [
      "Copilot CLIの破壊的コマンドはdry-run等で実影響範囲を事前に確認してから実行承認する必要がある。",
      "ヒストリ除外はセキュリティ運用だがコマンド自体の安全性検証にならない。",
      "Git復元への依存はGit管理外のローカルデータ消失を防げない。",
      "スクリプト化や権限設定は削除対象の妥当性検証の代替にならない。"
    ],
    choiceQuality: {
      A: { plausibility: 3, distractorType: "correct", sourceIds: ["cli", "responsible"], rationale: "dry-runや事前確認で影響範囲を目視検証するのが正しい手順。" },
      B: { plausibility: 3, distractorType: "partial-match", sourceIds: ["cli", "responsible"], rationale: "履歴除外は安全性の検証にならない。" },
      C: { plausibility: 3, distractorType: "common-confusion", sourceIds: ["cli", "responsible"], rationale: "Git管理外データはチェックアウト復元できない。" },
      D: { plausibility: 3, distractorType: "partial-match", sourceIds: ["cli", "responsible"], rationale: "スクリプト権限は対象検証の代替にならない。" }
    },
    requirementMapping: [
      {
        requirement: "開発者がGitHub Copilot CLIを利用して、開発環境の古いログやキャッシュファイルをクリーンアップするシェルコマンドの作成を依頼しました。Copilot CLIはワイルドカード（*）や再帰削除オプション（-rf）を含む一括削除コマンドを提示しました。このコマンドを安全に実行するために開発者が取るべき検証手順として、最も適切なものはどれですか？",
        correctReason: "dry-runや事前の一覧プレビューで対象データを目視確認してから実行する。",
        distractorFailures: {
          B: "履歴除外は安全性の検証にならない。",
          C: "Git管理外データはチェックアウト復元できない。",
          D: "スクリプト権限は対象検証の代替にならない。"
        }
      }
    ]
  },
  {
    id: "q-d2-e14",
    syllabusVersion: "2026-08-07",
    domainId: "d5",
    objectiveId: "d5o1",
    difficulty: "intermediate",
    type: "single-select",
    status: "verified",
    cognitiveLevel: "apply",
    scenarioType: "condition-application",
    testedConcepts: ["d5o1", "sub-agents", "agent-task-delegation"],
    distractorQuality: "scenario-contrast",
    examLike: false,
    clues: ["モノレポ", "リファクタリング", "Sub-Agents"],
    contentRevision: "cat1-copilot-native-upgrade-2026-10-14",
    question: "大規模なモノレポにおいて、複数のパッケージにまたがる関数のリファクタリングをCopilot Agentモードで実施しようとしています。単一のプロンプトでリポジトリ全体の調査からファイル書き換え・テスト実行までを一括で指示すると、コンテキスト窓の消費が激しく途中で誤った判断が発生しやすくなります。Sub-Agents（または段階的なエージェント委任）を活用した最も生産的なワークフローはどれですか？",
    choices: [
      {
        id: "A",
        text: "調査専用のエージェントに広域の検索と依存関係の特定を委任して影響範囲をまとめさせ、その結果をもとに実装エージェントへ対象ファイルを限定して修正とテスト実行を依頼する"
      },
      {
        id: "C",
        text: "リポジトリ全体の型定義ファイル（`*.d.ts`）のみをChatコンテキストに添付し、実装コードを参照させずにエージェントにインターフェースの互換性修正のみを指示する"
      },
      {
        id: "B",
        text: "パッケージごとに独立したGitワークツリーを作成し、各ツリーでCopilot Agentを並列実行してそれぞれのパッケージ単体での修正を競合解決なしでコミットさせる"
      },
      {
        id: "D",
        text: "エージェントモードの代わりにCopilot Editsを使用し、全パッケージのソースファイルをすべて「Working Set」に追加して一度の指示で一括置換させる"
      }
    ],
    answer: ["A"],
    explanation: "正解です。複雑な大規模タスクでは、調査（探索・読み取り）と実装（局所編集・テスト検証）でエージェントの関心・コンテキストを分離することが有効です。調査エージェントで変更箇所を絞り込んでから実装エージェントに渡すことで、コンテキスト消費を抑え、高品質なコード変更を実現できます。",
    choiceExplanations: {
      A: "正解です。複雑な大規模タスクでは、調査（探索・読み取り）と実装（局所編集・テスト検証）でエージェントの関心・コンテキストを分離することが有効です。調査エージェントで変更箇所を絞り込んでから実装エージェントに渡すことで、コンテキスト消費を抑え、高品質なコード変更を実現できます。",
      B: "ワークツリー並列化は独立タスクには有用ですが、相互依存する関数のリファクタリングではインターフェース不整合やマージ競合が発生します。",
      C: "型定義のみの参照では、関数の内部実装ロジックのリファクタリングやテスト検証を完了させることができません。",
      D: "全ファイルをWorking Setに一括投入すると、コンテキスト窓を過剰に消費し、モデルの注意力低下による誤修正が再発します。"
    },
    sourceIds: ["agent-mode", "ide-subagents"],
    createdAt: "2026-09-07",
    lastVerifiedAt: "2026-10-14",
    trustedSourceFacts: [
      "調査エージェントと実装エージェントの関心を分離することで、コンテキスト窓の浪費を防ぎ大規模タスクの精度を向上できる。",
      "ワークツリー並列化は相互依存関数のリファクタリングで不整合を招く。",
      "型定義のみの参照では実装内部の修正とテスト検証ができない。",
      "Working Setへの全ファイル一括投入はコンテキスト窓の破綻を再発させる。"
    ],
    choiceQuality: {
      A: { plausibility: 3, distractorType: "correct", sourceIds: ["agent-mode", "ide-subagents"], rationale: "調査と実装のタスクをSub-Agentsで分離するのが効果的。" },
      B: { plausibility: 3, distractorType: "common-confusion", sourceIds: ["agent-mode", "ide-subagents"], rationale: "相互依存があるタスクの並列実行は不整合を招く。" },
      C: { plausibility: 3, distractorType: "partial-match", sourceIds: ["agent-mode", "ide-subagents"], rationale: "型定義のみでは実装変更ができない。" },
      D: { plausibility: 3, distractorType: "partial-match", sourceIds: ["agent-mode", "ide-subagents"], rationale: "全ファイル一括投入はコンテキスト制限を圧迫する。" }
    },
    requirementMapping: [
      {
        requirement: "大規模なモノレポにおいて、複数のパッケージにまたがる関数のリファクタリングをCopilot Agentモードで実施しようとしています。単一のプロンプトでリポジトリ全体の調査からファイル書き換え・テスト実行までを一括で指示すると、コンテキスト窓の消費が激しく途中で誤った判断が発生しやすくなります。Sub-Agents（または段階的なエージェント委任）を活用した最も生産的なワークフローはどれですか？",
        correctReason: "調査専用エージェントで影響範囲を特定し、その結果をもとに実装エージェントに対象を絞って依頼する。",
        distractorFailures: {
          B: "相互依存があるタスクの並列実行は不整合を招く。",
          C: "型定義のみでは実装変更ができない。",
          D: "全ファイル一括投入はコンテキスト制限を圧迫する。"
        }
      }
    ]
  },
  {
    id: "q-d5-a07",
    syllabusVersion: "2026-08-07",
    domainId: "d5",
    objectiveId: "d5o2",
    difficulty: "intermediate",
    type: "single-select",
    status: "verified",
    cognitiveLevel: "apply",
    scenarioType: "condition-application",
    testedConcepts: ["d5o2", "test-generation", "timezone-boundary-testing"],
    distractorQuality: "scenario-contrast",
    examLike: false,
    clues: ["日付・時刻計算処理", "リファクタリング", "Flaky Test"],
    contentRevision: "cat1-copilot-native-upgrade-2026-10-14",
    question: "グローバル展開するWebアプリケーションにおいて、日付・時刻計算処理（翌月末日付の算出やサマータイム切替）のリファクタリングをCopilotと進めています。Copilotに回帰テストコードの生成を依頼する際、実行環境のローカルタイムゾーンに依存したテストの不安定さ（Flaky Test）を防ぐためのプロンプトおよびテスト設計指示として、最も適切なものはどれですか？",
    choices: [
      {
        id: "C",
        text: "実行環境のブラウザ言語設定（ロケール）差異を吸収するため、`Intl.DateTimeFormat` を用いて動的に生成した日付文字列との一致を比較するテストコードを生成させる"
      },
      {
        id: "A",
        text: "UTC基準の固定日時や明示的なタイムゾーンを指定し、月末日・うるう年・日付境界値における期待値を具体的に与えてモック固定した安定なテストコードを生成させる"
      },
      {
        id: "D",
        text: "テスト実行前のフック処理でOSのシステム時刻を1秒ずつ進めるタイマーループを設定し、実時間の経過に伴う関数の戻り値の変化をリアルタイムに監視するテストを生成させる"
      },
      {
        id: "B",
        text: "あらゆるタイムゾーンでテストが成功するように、日付計算結果の具体的な値ではなく、出力がISO 8601形式の正規表現に合致していることのみをアサートするテストを生成させる"
      }
    ],
    answer: ["A"],
    explanation: "正解です。AIに日付・時刻処理のテストを生成させる際は、実行環境のローカル時間に依存しないよう、固定日時（Fake Timers）や明示的なタイムゾーンを指定し、月末やうるう年などの境界値に対する厳密な期待値を指示することが品質保証に不可欠です。",
    choiceExplanations: {
      A: "正解です。AIに日付・時刻処理のテストを生成させる際は、実行環境のローカル時間に依存しないよう、固定日時（Fake Timers）や明示的なタイムゾーンを指定し、月末やうるう年などの境界値に対する厳密な期待値を指示することが品質保証に不可欠です。",
      B: "形式のみを検証する正規表現アサーションでは、日付計算のずれや境界値バグを検出することができません。",
      C: "ロケール動的生成は表示の国際化テストには有効ですが、タイムゾーン境界の日付計算ロジック自体の検証にはなりません。",
      D: "実時間ループ監視はテスト実行時間を肥大化させ、タイミグ依存によるFlaky Testをさらに悪化させます。"
    },
    sourceIds: ["tests", "prompt"],
    createdAt: "2026-09-07",
    lastVerifiedAt: "2026-10-14",
    trustedSourceFacts: [
      "固定日時のモック化と明示的なタイムゾーン指定により、Copilotへ環境依存しない安定した回帰テストを生成させられる。",
      "形式アサーションだけでは日付計算の論理欠陥を検出できない。",
      "ロケール動的生成は表示テスト用であり日付計算境界値の検証にならない。",
      "実時間ループ監視はテストの実行遅延と不安定化を招く。"
    ],
    choiceQuality: {
      A: { plausibility: 3, distractorType: "correct", sourceIds: ["tests", "prompt"], rationale: "固定日時と明示的なタイムゾーン指定が安定したテスト生成の基本。" },
      B: { plausibility: 3, distractorType: "common-confusion", sourceIds: ["tests", "prompt"], rationale: "形式検証だけでは計算ロジックのバグを検出できない。" },
      C: { plausibility: 3, distractorType: "partial-match", sourceIds: ["tests", "prompt"], rationale: "ロケール検証は表示確認用であり境界値検証にならない。" },
      D: { plausibility: 3, distractorType: "wrong-mechanism", sourceIds: ["tests", "prompt"], rationale: "実時間監視はFlaky Testを増大させる。" }
    },
    requirementMapping: [
      {
        requirement: "グローバル展開するWebアプリケーションにおいて、日付・時刻計算処理（翌月末日付の算出やサマータイム切替）のリファクタリングをCopilotと進めています。Copilotに回帰テストコードの生成を依頼する際、実行環境のローカルタイムゾーンに依存したテストの不安定さ（Flaky Test）を防ぐためのプロンプトおよびテスト設計指示として、最も適切なものはどれですか？",
        correctReason: "UTCや固定タイムゾーンを指定し、月末・うるう年等の境界値をモック固定してテストを生成させる。",
        distractorFailures: {
          B: "形式検証だけでは計算ロジックのバグを検出できない。",
          C: "ロケール検証は表示確認用であり境界値検証にならない。",
          D: "実時間監視はFlaky Testを増大させる。"
        }
      }
    ]
  },
  {
    id: "q-d5-a14",
    syllabusVersion: "2026-08-07",
    domainId: "d5",
    objectiveId: "d5o2",
    difficulty: "intermediate",
    type: "single-select",
    status: "verified",
    cognitiveLevel: "apply",
    scenarioType: "condition-application",
    testedConcepts: ["d5o2", "exception-handling", "retry-logic"],
    distractorQuality: "scenario-contrast",
    examLike: false,
    clues: ["外部決済APIクライアント", "例外処理", "修正させる指示"],
    contentRevision: "cat1-copilot-native-upgrade-2026-10-14",
    question: "Copilotに外部決済APIクライアントの例外処理と再試行（リトライ）ロジックの実装を依頼しました。Copilotが提案したコードをレビューしたところ、すべての例外で無条件に即時リトライを行い、エラー時には生の例外オブジェクト（DB接続文字列や内部スタックトレースを含む）をそのままクライアントへ返却していました。安全なシステム運用に合致するよう修正させる指示として、最も適切なものはどれですか？",
    choices: [
      {
        id: "A",
        text: "一時的なネットワークエラーやレート制限のみを指数バックオフで再試行し、クライアントへは内部詳細を遮断した汎用エラーメッセージと追跡用IDのみを返すよう修正させる"
      },
      {
        id: "B",
        text: "外部APIから返されたすべてのHTTPエラー（4xxおよび5xx）を一律に固定間隔（3秒）で3回リトライし、失敗時は最新のエラーコードのみをログ出力して終了させる"
      },
      {
        id: "C",
        text: "サーキットブレーカーパターンを適用してエラー率超過時に即座に遮断し、フォールバックとして前回のキャッシュレスポンスをクライアントへ返却して決済完了とみなす"
      },
      {
        id: "D",
        text: "エラー発生時に外部のAPM監視ツールへスタックトレースを送信した上で、クライアントへはHTTPステータス500と内部デバッグダンプへのアクセスURLを返却する"
      }
    ],
    answer: ["A"],
    explanation: "正解です。AIが生成する例外処理は、無条件リトライや機密スタックトレースの露出といった脆弱性を含みやすい傾向があります。再試行対象を一過性エラーに限定し、内部スタックトレース等の機密情報を遮断して安全なメッセージのみを返すよう人間が検証・修正指示を与える必要があります。",
    choiceExplanations: {
      A: "正解です。AIが生成する例外処理は、無条件リトライや機密スタックトレースの露出といった脆弱性を含みやすい傾向があります。再試行対象を一過性エラーに限定し、内部スタックトレース等の機密情報を遮断して安全なメッセージのみを返すよう人間が検証・修正指示を与える必要があります。",
      B: "4xxなどの恒久的なビジネスエラーに対する再試行は相手先サーバーへ不要な負荷を与え、固定間隔リトライは一時的な輻輳を悪化させます。",
      C: "決済処理において前回のキャッシュデータをフォールバックとして返却することは、二重決済や重大な不整合を招く極めて危険な設計です。",
      D: "クライアントへ内部デバッグURLを返却することはアーキテクチャの漏洩（情報開示脆弱性）となり、セキュリティ基準に反します。"
    },
    sourceIds: ["exception-best-practices", "exception-sensitive"],
    createdAt: "2026-09-07",
    lastVerifiedAt: "2026-10-14",
    trustedSourceFacts: [
      "一過性エラーへの指数バックオフ限定と内部スタックトレースの遮断指示により、安全な例外処理を生成させられる。",
      "4xxエラーへの再試行や固定間隔リトライは負荷と輻輳を悪化させる。",
      "決済処理でのキャッシュフォールバックは二重決済やデータ不整合を招く。",
      "クライアントへのデバッグURL返却は情報開示脆弱性となる。"
    ],
    choiceQuality: {
      A: { plausibility: 3, distractorType: "correct", sourceIds: ["exception-best-practices", "exception-sensitive"], rationale: "一過性エラー限定の再試行と機密遮断が正しい設計。" },
      B: { plausibility: 3, distractorType: "common-confusion", sourceIds: ["exception-best-practices", "exception-sensitive"], rationale: "全エラー一律リトライは負荷を悪化させる。" },
      C: { plausibility: 3, distractorType: "partial-match", sourceIds: ["exception-best-practices", "exception-sensitive"], rationale: "決済処理でのキャッシュフォールバックは不整合を招く。" },
      D: { plausibility: 3, distractorType: "wrong-mechanism", sourceIds: ["exception-best-practices", "exception-sensitive"], rationale: "デバッグURLの返却は情報開示脆弱性。" }
    },
    requirementMapping: [
      {
        requirement: "Copilotに外部決済APIクライアントの例外処理と再試行（リトライ）ロジックの実装を依頼しました。Copilotが提案したコードをレビューしたところ、すべての例外で無条件に即時リトライを行い、エラー時には生の例外オブジェクト（DB接続文字列や内部スタックトレースを含む）をそのままクライアントへ返却していました。安全なシステム運用に合致するよう修正させる指示として、最も適切なものはどれですか？",
        correctReason: "一過性エラーのみを指数バックオフで再試行し、内部スタックトレースを遮断したメッセージを返却させる。",
        distractorFailures: {
          B: "全エラー一律リトライは負荷を悪化させる。",
          C: "決済処理でのキャッシュフォールバックは不整合を招く。",
          D: "デバッグURLの返却は情報開示脆弱性。"
        }
      }
    ]
  },
  {
    id: "q-d5-a15",
    syllabusVersion: "2026-08-07",
    domainId: "d5",
    objectiveId: "d5o2",
    difficulty: "intermediate",
    type: "single-select",
    status: "verified",
    cognitiveLevel: "apply",
    scenarioType: "condition-application",
    testedConcepts: ["d5o2", "input-validation", "assertion-testing"],
    distractorQuality: "scenario-contrast",
    examLike: false,
    clues: ["ユーザー登録API", "バリデーション単体テスト", "アプローチ"],
    contentRevision: "cat1-copilot-native-upgrade-2026-10-14",
    question: "Copilotにユーザー登録APIのエンドポイント関数の実装と、そのバリデーション単体テストの作成を依頼しました。Copilotは入力データの型チェックを行わずに直接ビジネスロジックに渡すコードを提案しました。仕様では「18歳以上の整数のみを受け入れ、文字列や負の数、小数は拒否する」契約です。この関数に対し、Copilotに安全な防御的実装と検証テストを作成させるためのアプローチとして、最も適切なものはどれですか？",
    choices: [
      {
        id: "A",
        text: "関数の先頭で `typeof age === 'number'` の型ガードを追加し、条件不一致時に `null` を返却して処理を中断するシンプルな単体テストケースを生成させる"
      },
      {
        id: "B",
        text: "入口境界でスキーマバリデーションを用いて型・範囲を検証させ、整数17は拒否、整数18は許可、文字列「18」は拒否される境界値テストケースを生成させる"
      },
      {
        id: "C",
        text: "TypeScriptのコンパイル時型定義（`type Age = number`）のみに依存させ、実行時の検証コードは書かずに静的型チェック（`tsc`）の自動実行を指示する"
      },
      {
        id: "D",
        text: "入力値に対するHTMLサニタイズ処理を適用して悪意あるスクリプト注入を防ぎ、正常な成人年齢（20歳）が登録できることのみを確認する単体テストを生成させる"
      }
    ],
    answer: ["B"],
    explanation: "正解です。AIによる入力処理生成では、暗黙の型キャストや境界値漏れが生じやすいため、Zod等のバリデーションライブラリで入口境界を厳密に検証させ、境界値（17, 18）や不正な型に対する網羅的なアサーションを含むテストコードを生成させることが重要です。",
    choiceExplanations: {
      B: "正解です。AIによる入力処理生成では、暗黙の型キャストや境界値漏れが生じやすいため、Zod等のバリデーションライブラリで入口境界を厳密に検証させ、境界値（17, 18）や不正な型に対する網羅的なアサーションを含むテストコードを生成させることが重要です。",
      A: "typeofによる型ガードだけでは小数（18.5）や負数がすり抜けてしまい、仕様である整数・年齢範囲契約を満たせません。",
      C: "TypeScriptの型定義はコンパイル時のみ有効であり、外部APIリクエストとして実行時に渡される不正値の遮断にはなりません。",
      D: "サニタイズはXSS対策には有用ですが、年齢の数値契約・境界値検証にはならず境界値テストとして不十分です。"
    },
    sourceIds: ["responsible", "tests"],
    createdAt: "2026-09-07",
    lastVerifiedAt: "2026-10-14",
    trustedSourceFacts: [
      "スキーマバリデーションによる境界検証と境界値・不正型の網羅テストにより、AI生成コードの安全性を確保できる。",
      "typeof型ガードだけでは小数や負数のすり抜けを防げない。",
      "TypeScriptの静的型は実行時の外部入力検証の代替にならない。",
      "サニタイズ処理は数値契約・境界値検証の代替にならない。"
    ],
    choiceQuality: {
      B: { plausibility: 3, distractorType: "correct", sourceIds: ["responsible", "tests"], rationale: "スキーマ検証と境界値・不正型テストを網羅させるのが正しいアプローチ。" },
      A: { plausibility: 3, distractorType: "common-confusion", sourceIds: ["responsible", "tests"], rationale: "typeof型ガードだけでは小数やすり抜けを防げない。" },
      C: { plausibility: 3, distractorType: "partial-match", sourceIds: ["responsible", "tests"], rationale: "静的型定義は実行時バリデーションにならない。" },
      D: { plausibility: 3, distractorType: "partial-match", sourceIds: ["responsible", "tests"], rationale: "サニタイズは数値の境界値検証にならない。" }
    },
    requirementMapping: [
      {
        requirement: "Copilotにユーザー登録APIのエンドポイント関数の実装と、そのバリデーション単体テストの作成を依頼しました。Copilotは入力データの型チェックを行わずに直接ビジネスロジックに渡すコードを提案しました。仕様では「18歳以上の整数のみを受け入れ、文字列や負の数、小数は拒否する」契約です。この関数に対し、Copilotに安全な防御的実装と検証テストを作成させるためのアプローチとして、最も適切なものはどれですか？",
        correctReason: "スキーマバリデーションで入口を検証させ、境界値や不正な型を網羅する単体テストを生成させる。",
        distractorFailures: {
          A: "typeof型ガードだけでは小数やすり抜けを防げない。",
          C: "静的型定義は実行時バリデーションにならない。",
          D: "サニタイズは数値の境界値検証にならない。"
        }
      }
    ]
  }
];

// 1. Update seed.json
for (const q of upgradedQuestions) {
  const index = seed.findIndex(x => x.id === q.id);
  if (index === -1) throw new Error(`Question ${q.id} not found in seed`);
  seed[index] = q;
}
fs.writeFileSync(seedPath, JSON.stringify(seed, null, 2) + "\n");
console.log("Updated seed.json with 8 upgraded questions.");

// 2. Synchronize ledgers
for (const q of upgradedQuestions) {
  const fp = hash(q);
  const correctChoice = q.choices.find(c => q.answer.includes(c.id));
  const wrongChoices = q.choices.filter(c => !q.answer.includes(c.id));

  // quality-review.json
  if (qual.questions[q.id]) {
    qual.questions[q.id].fingerprint = fp;
    qual.questions[q.id].after = q;
    qual.questions[q.id].rationale = `第2段階で本文の条件と各案の反例を照合。${q.requirementMapping[0].correctReason}`;
  }

  // difficulty-review.json
  if (diff.questions[q.id]) {
    diff.questions[q.id].fingerprint = fp;
    diff.questions[q.id].reasoning = `正答ID${q.answer[0]}と説明が一致することを再読。${q.explanation}`;
  }

  // question-objective-classification-review.json
  const clsRow = cls.questions.find(x => x.id === q.id);
  if (clsRow) {
    clsRow.after = q;
    clsRow.fingerprint = fp;
    clsRow.question = q.question;
    clsRow.correctChoices = [correctChoice.text];
  }

  // applied-question-quality-review.json
  const appRow = appRev.questions.find(x => x.id === q.id);
  if (appRow) {
    appRow.after = q;
    appRow.fingerprint = fp;
    appRow.wrongChoiceAnalysis = wrongChoices.map(c => ({
      id: c.id,
      text: c.text,
      whyWrong: q.choiceExplanations[c.id]
    }));
  }

  // d4-d5-applied-cleanup-review.json
  const cleanRow = cleanup.questions.find(x => x.id === q.id);
  if (cleanRow) {
    cleanRow.after = q;
    cleanRow.fingerprint = fp;
    cleanRow.domainId = q.domainId;
    cleanRow.objectiveId = q.objectiveId;
    cleanRow.wrongChoiceAnalysis = wrongChoices.map(c => ({
      id: c.id,
      whyWrong: q.choiceExplanations[c.id]
    }));
    cleanRow.counterfactuals = wrongChoices.slice(0, 2).map((c, i) => ({
      choiceId: c.id,
      ifChanged: `選択肢${c.id}が意図される条件設定に変更した場合の反例ステップ${i+1}`
    }));
  }

  // applied-remediation-review.json
  const remedRow = remed.questions.find(x => x.id === q.id);
  if (remedRow) {
    remedRow.after = q;
    remedRow.fingerprint = fp;
    remedRow.approvedAnswerIds = q.answer;
    remedRow.approvedAnswerContentHash = hash(correctChoice.text);
    if (remedRow.review) {
      remedRow.review.decisiveClues = [...q.clues];
      remedRow.review.counterfactual = `もし要件が変更された場合、選択肢${wrongChoices[0].id}が候補となるが、現在の条件では${correctChoice.id}のみが合致する。`;
    }
  }
}

// Recompute classification coverage
for (const c of cls.coverage ?? []) {
  for (const level of ['beginner', 'intermediate', 'advanced']) {
    c[level] = seed.filter(q => q.objectiveId === c.id && q.difficulty === level && q.status === 'verified').length;
  }
}

fs.writeFileSync(qualPath, JSON.stringify(qual, null, 2) + "\n");
fs.writeFileSync(diffPath, JSON.stringify(diff, null, 2) + "\n");
fs.writeFileSync(clsPath, JSON.stringify(cls, null, 2) + "\n");
fs.writeFileSync(appRevPath, JSON.stringify(appRev, null, 2) + "\n");
fs.writeFileSync(cleanupPath, JSON.stringify(cleanup, null, 2) + "\n");
fs.writeFileSync(remedPath, JSON.stringify(remed, null, 2) + "\n");

console.log("Successfully synchronized quality-review, difficulty-review, classification-review, applied-review, cleanup-review, and remediation-review.");

// 3. Re-run choice quality audit
execSync("node scripts/audit-choice-quality.mjs", { stdio: "inherit" });
console.log("Re-generated choice quality audit.");
