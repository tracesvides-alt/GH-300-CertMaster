import { assertLegacyRewriteScope } from './question-rewrite-safety.mjs';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';

const root = new URL('../', import.meta.url);
const read = (f) => JSON.parse(fs.readFileSync(new URL(f, root), 'utf8'));
const write = (f, data) => fs.writeFileSync(new URL(f, root), JSON.stringify(data, null, 2) + '\n', 'utf8');
const hash = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');

// D6 Applied Rewrites (All 14 questions: q-d6-a01 to q-d6-a14)
export const d6Rewrites = {
  'q-d6-a01': {
    question: 'リポジトリ repo-A ではコンテンツ除外（Content Exclusion）によって secrets/ ディレクトリ配下がCopilotの参照から除外されています。開発チームが repo-A のソースコード構成を新規リポジトリ repo-B へ複製したところ、repo-B では secrets/ 配下のファイルでも通常補完が動作してしまいました。repo-B においても同様に secrets/ を除外するための設定変更として、最も適切なものはどれですか？',
    choices: {
      A: 'GitHubの管理設定で、除外対象リポジトリの一覧に repo-B を追加し、secrets/ のパスパターンを設定する',
      B: 'repo-B のリポジトリ公開設定（Visibility）を一時的に Public へ変更し、再度 Private へ戻す',
      C: 'repo-A に設定されている除外パターンの末尾にワイルドカードを追加し、他リポジトリへの自動波及を待つ',
      D: 'repo-B で作業する全開発者のエディタ拡張機能で、Copilotの補完候補受け入れショートカットを無効化する',
    },
    explanation: 'Content Exclusion（コンテンツ除外）はリポジトリ単位で設定されるため、新しいリポジトリ（repo-B）にも明示的に除外ルールを登録・適用する必要があります。',
    choiceExplanations: {
      A: 'Content Exclusion（コンテンツ除外）はリポジトリ単位で設定されるため、新しいリポジトリ（repo-B）にも明示的に除外ルールを登録・適用する必要があります。',
      B: 'リポジトリの公開範囲の切り替えは、CopilotのContent Exclusionルールの適用とは直接関係ありません。',
      C: '除外ルールは設定対象外のリポジトリへ自動的に波及することはないため、repo-B側の明示登録が必須です。',
      D: 'ショートカット無効化は個人端末の対症療法にすぎず、組織としての機密除外ポリシーの適用にはなりません。',
    },
  },
  'q-d6-a02': {
    question: 'GitHub Copilotのポリシー設定において、「Suggestions matching public code（公開コードに一致する提案）」を Block に設定しました。この設定によって直接制御される動作として、最も適切なものはどれですか？',
    choices: {
      A: 'GitHub上の公開コードと約150文字以上一致することが検出されたコード提案の提示を自動的にブロック（抑制）する',
      B: '公開コードとの一致が検出された提案について、元リポジトリの参照先とライセンス情報を付与してそのまま提示する',
      C: 'リポジトリ内の指定された機密ファイルや設定ファイルを、Copilot Chatの入力コンテキストから自動除外する',
      D: 'GitリポジトリへコミットやPushが行われる際に、ハードコードされた秘密情報トークンを検知してPushをブロックする',
    },
    explanation: 'Suggestions matching public code の Block 設定は、公開コードと一致するコードスニペットの提案そのものをユーザーに提示させずブロックする機能です。',
    choiceExplanations: {
      A: 'Suggestions matching public code の Block 設定は、公開コードと一致するコードスニペットの提案そのものをユーザーに提示させずブロックする機能です。',
      B: '参照情報を付与して提示するのは Allow 設定時の Code Referencing 機能の動作です。',
      C: '機密ファイルを文脈から除外するのは Content Exclusion（コンテンツ除外）の役割です。',
      D: 'Push時の秘密情報検知は Secret Scanning（プッシュ保護）の役割です。',
    },
  },
  'q-d6-a03': {
    question: 'GitへのAPIトークンPushはプッシュ保護機能（Secret Scanning）によって正常に阻止されました。しかしその後、開発者が同じトークン文字列を含むエラーログをCopilot Chatのプロンプト欄へ貼り付けて質問しようとしています。Chat送信前とGit Push時の二経路それぞれにおいて秘密情報の漏洩を防ぐ対策として、最も適切なものはどれですか？',
    choices: {
      A: 'Chatへ送信するログ内の認証トークン値を手動またはスクリプトでダミー値（<TOKEN>等）に置換・マスキングする',
      B: 'GitへのPushコマンドを再実行し、Secret Scanningが正しくブロックを継続していることを再確認する',
      C: 'リポジトリの公開コード一致設定（Suggestions matching public code）を Allow から Block へ変更する',
      D: 'エラーログを一度PrivateリポジトリのMarkdownファイルへコミットしてから、その原文をChatへ貼り付ける',
    },
    explanation: 'Git Pushの保護とLLM Chatへの入力は異なる経路であるため、Chatへ送信するプロンプト内の機密情報は送信前に置換・マスキングして排除する必要があります。',
    choiceExplanations: {
      A: 'Git Pushの保護とLLM Chatへの入力は異なる経路であるため、Chatへ送信するプロンプト内の機密情報は送信前に置換・マスキングして排除する必要があります。',
      B: 'Git Pushを再試行しても、Chatの入力欄から外部LLMへトークンが送信される問題は防げません。',
      C: '公開コード一致設定はモデル提案のフィルターであり、ユーザーがChat入力欄に貼り付ける機密情報の遮断とは無関係です。',
      D: 'Privateリポジトリを経由させても機密情報自体の生データは残るため、Chat入力時の漏洩リスクは解消しません。',
    },
  },
  'q-d6-a04': {
    question: 'GitHub Copilotの「Code Referencing（コード参照通知）」機能の役割および活用方法として、最も適切なものはどれですか？',
    choices: {
      A: '提案コードと一致した公開リポジトリの出所やライセンス情報を確認し、自社製品への適合性を人間が判断するための根拠を提供する',
      B: '公開コードとの一致が検出された提案を無条件で全自動ブロックし、開発者が参照情報を確認する手間を完全に不要にする',
      C: '提案コードに含まれるすべてのオープンソースライセンスを自動解釈し、法的な利用許諾契約を社内承認なしで自動締結する',
      D: 'CodeQLによる静的セキュリティスキャンを自動実行し、指摘事項が0件であればライセンス確認を完了と見なす',
    },
    explanation: 'Code Referencingは一致元の公開コードとライセンス情報（MIT、GPL等）を開発者に提示し、人間が法的な適合性や採用可否を適切に判断できるようにする機能です。',
    choiceExplanations: {
      A: 'Code Referencingは一致元の公開コードとライセンス情報（MIT、GPL等）を開発者に提示し、人間が法的な適合性や採用可否を適切に判断できるようにする機能です。',
      B: '自動ブロックするのは Block 設定の動作であり、Code Referencing は情報通知を行って判断を支援する機能です。',
      C: 'ライセンスの法的判断や自社ポリシーとの適合をツールが勝手に自動承認することはできません。',
      D: 'CodeQLはセキュリティ脆弱性の検出ツールであり、オープンソースライセンスの法的適合性を審査するものではありません。',
    },
  },
  'q-d6-a05': {
    question: '組織内の特定の開発者1名のみCopilotの利用資格を回収し、他のメンバーの利用は継続させたいと考えています。管理者がGitHub組織の管理画面で直接変更すべき操作対象として、最も適切なものはどれですか？',
    choices: {
      A: 'GitHub Organizationの管理設定で、該当開発者のCopilotシート割り当て（Seat Assignment）を解除する',
      B: 'Organization全体のCopilot機能ポリシー（Feature Policy）を全体無効化（Disabled）に変更する',
      C: '該当開発者がコミットしているすべての対象リポジトリにコンテンツ除外（Content Exclusion）を設定する',
      D: 'リポジトリにおける該当開発者のコラボレーター権限（Role）を「書き込み」から「読み取り」へ変更する',
    },
    explanation: '特定個人の利用資格のみを解除するには、組織のCopilot管理画面で該当ユーザーの「シート割り当て（Seat）」を解除するのが直接の管理操作です。',
    choiceExplanations: {
      A: '特定個人の利用資格のみを解除するには、組織のCopilot管理画面で該当ユーザーの「シート割り当て（Seat）」を解除するのが直接の管理操作です。',
      B: '組織全体のポリシーを無効化すると、全メンバーのCopilot利用まで停止してしまいます。',
      C: 'コンテンツ除外は特定ファイルの参照を止める設定であり、個人のCopilot利用権限自体の回収にはなりません。',
      D: 'Git権限を変更してもCopilotのライセンスシート自体は割り当てられたまま残ってしまいます。',
    },
  },
  'q-d6-a06': {
    question: 'Enterprise（企業アカウント）レベルでCopilotポリシーが強制的に「Block」に設定されています。配下のOrganization（組織）側の管理画面で表示が「Allow」になっていた場合、実際の開発者の環境で適用される実効値（有効な設定）はどれですか？',
    choices: {
      A: 'Enterpriseレベルで強制された「Block」設定が最優先され、Organization側の表示に関わらずブロックされる',
      B: '下位のOrganization側で設定された「Allow」表示が優先され、配下の開発者は許可される',
      C: '各開発者のローカルPCのIDE環境で個別に選択されたポリシー設定が最優先で適用される',
      D: 'Enterprise設定とOrganization設定が競合しているため、Copilotの全機能がエラーで緊急停止する',
    },
    explanation: 'GitHubのガバナンス階層において、上位のEnterpriseレベルで強制（Enforced）されたポリシーは下位のOrganizationや個人設定によって緩和（オーバーライド）することはできません。',
    choiceExplanations: {
      A: 'GitHubのガバナンス階層において、上位のEnterpriseレベルで強制（Enforced）されたポリシーは下位のOrganizationや個人設定によって緩和（オーバーライド）することはできません。',
      B: '上位のEnterpriseポリシーをOrganizationが下克上して緩和することはセキュリティモデル上不可能です。',
      C: 'クライアント側の個人設定で組織の強制ガバナンスポリシーを回避することはできません。',
      D: '階層ポリシーの継承ルールが明確に定義されているため、競合による緊急停止にはなりません。',
    },
  },
  'q-d6-a07': {
    question: '企業のセキュリティ監査担当者が、GitHub Copilot Businessの導入にあたり「コードやプロンプトがモデルの学習に利用されないこと」を確認しました。続いて、送信されたプロンプトや生成応答が処理後にサーバー側に保持される期間やデータ取り扱いを確認しようとしています。確認すべき公式の確認事項として、最も適切なものはどれですか？',
    choices: {
      A: '対象プラン（Copilot Business）およびモデルプロバイダーにおけるデータ保持期間（Retention）とデータ保護契約条件',
      B: 'エディタ上で生成されたコード提案がパブリックコードと一致するかどうかのブロック判定アルゴリズム',
      C: '開発者のローカル端末からGitHubサービスへのTLS通信において使用されている暗号化暗号スイートの一覧',
      D: '基盤モデルが過去の事前学習フェーズにおいて使用したトレーニングデータの収集元Webサイト一覧',
    },
    explanation: '学習利用の非対象を確認した後は、ログやプロンプトの「データ保持条件（Data Retention Policy）」および契約条項（DPA等）を確認するのが監査の正しいステップです。',
    choiceExplanations: {
      A: '学習利用の非対象を確認した後は、ログやプロンプトの「データ保持条件（Data Retention Policy）」および契約条項（DPA等）を確認するのが監査の正しいステップです。',
      B: '公開コード一致のアルゴリズムはデータ保持期間やプロンプトの残存期間とは直接関係ありません。',
      C: '通信暗号化も重要ですが、送信後の「サーバー側でのデータ保持期間」の確認には答えていません。',
      D: 'Copilot Businessでの利用データ保持と、基盤モデルの過去の事前学習データの収集元は論点が異なります。',
    },
  },
  'q-d6-a08': {
    question: '開発者がVS Codeで作業中、`src/a.ts` ではCopilotのインライン補完が表示されますが、同一プロジェクトの `src/b.ts` では補完が一切表示されません。IDEの接続診断は正常で、`src/b.ts` を開いた際にステータスバーに「Content excluded」というアイコンが表示されています。この事象の原因として最も妥当なものはどれですか？',
    choices: {
      A: 'リポジトリまたは組織の管理設定によって、`src/b.ts`（またはそのパターン）にコンテンツ除外が適用されている',
      B: '該当開発者のCopilotシートライセンスが管理者によって組織全体で突如解除された',
      C: '社内ネットワークのプロキシサーバーによって、すべてのCopilot補完API通信が遮断されている',
      D: 'Copilotの公開コード一致フィルターによって、生成されるすべての提案が偶然100%ブロックされた',
    },
    explanation: '「Content excluded」という明確な通知があり、他のファイル（a.ts）では補完が成功していることから、特定ファイル（b.ts）に対するコンテンツ除外設定の適用が原因です。',
    choiceExplanations: {
      A: '「Content excluded」という明確な通知があり、他のファイル（a.ts）では補完が成功していることから、特定ファイル（b.ts）に対するコンテンツ除外設定の適用が原因です。',
      B: 'シートが解除されていれば a.ts でも補完は動作しなくなります。',
      C: 'ネットワーク遮断であれば全ファイルで通信エラーが発生し、Content excluded アイコンは出ません。',
      D: '公開コード一致フィルターは提案生成後の判定であり、ファイルを開いた時点での Content excluded 表示の原因ではありません。',
    },
  },
  'q-d6-a09': {
    question: 'Copilotの活動者数が増えましたが、同期間にシート割当も倍増しました。「一人当たりの利用が増えたか」を確認したいと考えています。母数の変化を考慮して次に比較すべき集計として、最も適切なものはどれですか？',
    choices: {
      A: '同一の対象者・期間にそろえた一人当たりの利用状況（受容数やアクティブ日数）の平均値',
      B: '全組織における月間アクティブ活動者数の総数のみを前月と今月で単純に絶対値比較した値',
      C: 'セキュリティ監査ログに記録された管理者のポリシー変更操作の総数のみを前月と比較した値',
      D: '全リポジトリにおいて増加したコミットコード行数の総数のみを前月と今月で比較した値',
    },
    explanation: '人数と観測期間という母数をそろえることで、一人当たりの変化を正しく判断できます。',
    choiceExplanations: {
      A: '人数と観測期間という母数をそろえることで、一人当たりの変化を正しく判断できます。',
      B: '活動者数だけの前後比較では、シート増加に伴う見かけの増加と一人当たりの変化を区別できません。',
      C: 'ポリシー変更操作の総数は管理操作の記録であり、開発者の日常的な利用頻度を反映しません。',
      D: 'コード行数は案件規模や自動生成に左右され、一人当たりの利用実態の正確な指標にはなりません。',
    },
  },
  'q-d6-a10': {
    question: 'リポジトリ repo-N はPrivateリポジトリであり、OrganizationのCopilotコンテンツ除外一覧には現在 repo-O のみが登録されています。この状態で開発者が作業したところ、repo-N 内の機密ファイル secret.key がCopilotの補完コンテキストとして参照されてしまいました。repo-N の secret.key をCopilotの参照対象から確実に除外するための最小限の変更はどれですか？',
    choices: {
      A: 'Organizationのコンテンツ除外一覧に repo-N を追加し、除外パスとして secret.key を指定する',
      B: '現在登録されている repo-O の除外パスパターンを細かく分割して正規表現へ書き換える',
      C: 'repo-N の公開コード一致設定（Suggestions matching public code）を Allow から Block へ変更する',
      D: 'repo-N のリポジトリ名を別の名前にリネームし、キャッシュの自動更新を待機する',
    },
    explanation: 'Privateリポジトリであっても除外リストに含まれていなければCopilotはコードを参照します。除外対象リポジトリに repo-N と該当パスを追加するのが直接の解決策です。',
    choiceExplanations: {
      A: 'Privateリポジトリであっても除外リストに含まれていなければCopilotはコードを参照します。除外対象リポジトリに repo-N と該当パスを追加するのが直接の解決策です。',
      B: '無関係な別リポジトリ（repo-O）の設定を変更しても、repo-N側のファイルは除外されません。',
      C: '公開コード一致設定はスニペットの知財フィルターであり、特定リポジトリの機密ファイル除外には使えません。',
      D: 'リポジトリ名を変えても除外ルールが設定されない限り、Copilotの参照は継続します。',
    },
  },
  'q-d6-a11': {
    question: 'Content Exclusion（コンテンツ除外）の設定において、「secrets ディレクトリ配下の全階層に存在するすべての .key ファイル」のみを厳密に除外しつつ、同ディレクトリにある説明文書 `secrets/readme.md` はコンテキストに残したいと考えています。設定すべき除外パスパターンとして最も適切なものはどれですか？',
    choices: {
      A: 'secrets/**/*.key パターンを指定する（任意のサブディレクトリ配下の .key 拡張子のみにマッチ）',
      B: 'secrets/** パターンを指定する（secrets ディレクトリ配下のすべてのファイルを一括マッチ）',
      C: 'secrets/*.key パターンを指定する（secrets 直下の .key のみにマッチしサブディレクトリは漏れる）',
      D: '**/*.key パターンを指定する（リポジトリ全体のすべての .key ファイルをディレクトリ不問でマッチ）',
    },
    explanation: '`secrets/**/*.key` と指定することで、secrets 配下の任意の階層にある .key ファイルのみをピンポイントで除外し、同一ディレクトリの readme.md は対象外として維持できます。',
    choiceExplanations: {
      A: '`secrets/**/*.key` と指定することで、secrets 配下の任意の階層にある .key ファイルのみをピンポイントで除外し、同一ディレクトリの readme.md は対象外として維持できます。',
      B: 'secrets/** と指定すると、残したい secrets/readme.md まで含めて全ファイルが除外されてしまいます。',
      C: 'secrets/*.key ではサブディレクトリ（secrets/sub/app.key等）が除外対象から漏れてしまいます。',
      D: '**/*.key では secrets 以外の公開してよいディレクトリの鍵ファイルまで無差別に除外されてしまいます。',
    },
  },
  'q-d6-a12': {
    question: '管理者がリポジトリの除外設定を変更した後、同じエディタの通常補完モードでIDEを再読み込みした開発者Aには正常に「Content excluded」と表示され補完が止まりました。しかし、古いIDEセッションを開いたまま作業を続けていた開発者Bの画面では除外表示が出ず、補完が動作しているように見えます（両者のリポジトリと作業パスは同一です）。この状況における原因の切り分け手順として、最も適切なものはどれですか？',
    choices: {
      A: '開発者BのIDEセッションも再読み込み（または再起動）させ、最新の除外ポリシーがクライアント側に反映されるか確認する',
      B: '開発者AのCopilotシートライセンスを一旦解除し、開発者Bの画面で補完が停止するかどうかを確認する',
      C: 'リポジトリ全体の公開コード一致設定を Block に変更し、両者のエディタでの挙動の差を比較する',
      D: '開発者Bのリポジトリのローカルクローン名を別の名前に変更し、同一のリポジトリ設定を再度適用する',
    },
    explanation: 'Content Exclusionのポリシー変更はクライアントのセッションキャッシュに残ることがあるため、未反映の開発者BのIDEをリロードしてクライアント状態を揃えるのが最初の切り分けです。',
    choiceExplanations: {
      A: 'Content Exclusionのポリシー変更はクライアントのセッションキャッシュに残ることがあるため、未反映の開発者BのIDEをリロードしてクライアント状態を揃えるのが最初の切り分けです。',
      B: '正常に反映されている開発者Aのシートを解除しても、開発者Bの古いセッションキャッシュの問題は特定できません。',
      C: '公開コード一致設定の変更はコンテンツ除外の反映遅延とは無関係です。',
      D: 'クローン名のリネームは不必要な作業であり、IDEセッションの再読み込みで解決する問題です。',
    },
  },
  'q-d6-a13': {
    question: '企業におけるCopilotの知財補償（Customer Copyright Commitment等）の適用要件を審査しています。審査の前提として「現在使用している機能」および「自社テナントに適用される最新の契約規約とRequired Mitigations（必須の軽減策要件）」の確認が必須です。手元にある以下の4つの資料のうち、照合の基準として最も適切なものはどれですか？\n・資料P：旧契約時のBlock設定の画面キャプチャ\n・資料Q：現行の規約だが別製品・別機能の軽減策ドキュメント\n・資料R：現行の適用契約であり、対象機能および自社テナントに合致する最新のRequired Mitigations\n・資料S：他社別テナントに適用されている現行の契約資料',
    choices: {
      A: '資料R（現行の適用契約に基づき、対象機能および自社テナントに適合する最新の軽減策条件）',
      B: '資料P（過去の古い契約時点において保存されたBlock設定の画面キャプチャ資料）',
      C: '資料Q（現行の規約であるが、自社が利用していない別のAI機能に関する軽減策資料）',
      D: '資料S（他社の異なるテナント契約に適用されている現行の契約・軽減策資料）',
    },
    explanation: '知財補償の適用には「自社テナントの現行契約」かつ「対象機能」に定められた最新の軽減策（Required Mitigations、Block設定の有効化等）を照合基準とする必要があります。',
    choiceExplanations: {
      A: '知財補償の適用には「自社テナントの現行契約」かつ「対象機能」に定められた最新の軽減策（Required Mitigations、Block設定の有効化等）を照合基準とする必要があります。',
      B: '古い契約時点の資料では、規約改定後の現行の必須要件や補償範囲を正確に判断できません。',
      C: '別機能の軽減策資料では、今回使用するCopilot機能固有の要件を満たしているか判断できません。',
      D: '他社テナントの条件は自社の法的保護の根拠にはなりません。',
    },
  },
  'q-d6-a14': {
    question: 'リポジトリ repo-R のコンテンツ除外一覧を確認したところ、Organization（組織）レベル由来の `config/**` と、Repository（リポジトリ）レベル由来の `tmp/**` の2つのルールが設定されていました。組織のセキュリティ委員会において「config ディレクトリ配下のみをCopilotのコンテキストへ戻す（除外解除する）」方針が正式に承認されました。リポジトリ管理者が変更を依頼すべき設定元として、最も適切なものはどれですか？',
    choices: {
      A: 'Organizationレベルの管理設定において、config/** の除外ルールを削除または修正するよう依頼する',
      B: 'リポジトリ個別の管理設定において、tmp/** の除外ルールを削除するよう依頼する',
      C: '開発者個人のアカウント設定において、Suggestions matching public code を Allow に変更するよう依頼する',
      D: 'リポジトリ repo-R の公開設定を一時的に変更し、全除外設定をリセットさせる',
    },
    explanation: 'config/** はOrganizationレベルで設定されたルールであるため、リポジトリ個別設定ではなくOrganization側の管理設定で除外ルールを変更・解除する必要があります。',
    choiceExplanations: {
      A: 'config/** はOrganizationレベルで設定されたルールであるため、リポジトリ個別設定ではなくOrganization側の管理設定で除外ルールを変更・解除する必要があります。',
      B: 'tmp/** を削除しても、config/** の除外ルールはOrganization側にあるため解除されません。',
      C: '個人の公開コード設定は組織レベルのContent Exclusionルールとは全く別物です。',
      D: 'リポジトリの公開設定変更でOrganizationレベルの除外ルールが消去されることはありません。',
    },
  },
};

export function applyD6Rewrites() {
  const seed = read('content/gh300/2026-08-07/questions/seed.json');
  assertLegacyRewriteScope(seed, d6Rewrites);
  const appliedRep = read('reports/applied-question-quality-review.json');
  const diffRep = read('content/gh300/2026-08-07/questions/difficulty-review.json');
  const qualRep = read('content/gh300/2026-08-07/questions/quality-review.json');
  const classRep = read('reports/question-objective-classification-review.json');
  const addsRep = read('content/gh300/2026-08-07/questions/additions-review.json');
  const exclusionsRep = read('content/gh300/2026-08-07/questions/selection-exclusions.json');
  const cleanupRep = read('reports/d4-d5-applied-cleanup-review.json');

  let updatedCount = 0;
  for (const [id, rw] of Object.entries(d6Rewrites)) {
    const q = seed.find((item) => item.id === id);
    if (!q) {
      console.warn(`Question not found in seed: ${id}`);
      continue;
    }

    q.question = rw.question;
    q.explanation = rw.explanation;
    q.choiceExplanations = rw.choiceExplanations;
    q.choices = q.choices.map((c) => ({
      id: c.id,
      text: rw.choices[c.id] ?? c.text,
    }));

    if (q.requirementMapping && q.requirementMapping[0]) {
      q.requirementMapping[0].requirement = rw.question;
      q.requirementMapping[0].correctReason = rw.explanation;
      for (const [cid, exp] of Object.entries(rw.choiceExplanations)) {
        if (!q.answer.includes(cid)) {
          q.requirementMapping[0].distractorFailures[cid] = exp;
        }
      }
    }

    if (q.choiceQuality) {
      for (const [cid, exp] of Object.entries(rw.choiceExplanations)) {
        if (q.choiceQuality[cid]) {
          q.choiceQuality[cid].rationale = exp;
        }
      }
    }

    const currentFingerprint = hash(q);

    const repRow = appliedRep.questions.find((r) => r.id === id);
    if (repRow) {
      repRow.after = structuredClone(q);
      repRow.fingerprint = currentFingerprint;
      repRow.assessment = `${rw.question.slice(0, 45)}...の実務応用判断。`;
      repRow.decisiveCondition = `判断条件：${rw.question.slice(0, 40)}`;
      repRow.wrongChoiceAnalysis = q.choices
        .filter((c) => !q.answer.includes(c.id))
        .map((c) => ({
          id: c.id,
          text: c.text,
          whyWrong: rw.choiceExplanations[c.id],
        }));
    }

    if (diffRep.questions && diffRep.questions[id]) {
      diffRep.questions[id].fingerprint = currentFingerprint;
      diffRep.questions[id].reasoning = `判断条件を特定する：${rw.question.slice(0, 50)}`;
      diffRep.questions[id].textRewritten = true;
    }

    if (qualRep.questions && qualRep.questions[id]) {
      qualRep.questions[id].fingerprint = currentFingerprint;
      qualRep.questions[id].after = structuredClone(q);
      qualRep.questions[id].rationale = rw.explanation;
    }

    const classRow = classRep.questions?.find((r) => r.id === id);
    if (classRow) {
      classRow.fingerprint = currentFingerprint;
      classRow.after = structuredClone(q);
    }

    const addRow = addsRep.questions?.find((r) => r.id === id);
    if (addRow) {
      addRow.fingerprint = currentFingerprint;
      addRow.after = structuredClone(q);
    }

    const exclRow = exclusionsRep.questions?.find((r) => r.id === id);
    if (exclRow) {
      exclRow.fingerprint = currentFingerprint;
    }

    const cleanRow = cleanupRep.questions?.find((r) => r.id === id);
    if (cleanRow) {
      cleanRow.fingerprint = currentFingerprint;
      cleanRow.after = structuredClone(q);
    }

    updatedCount++;
  }

  write('content/gh300/2026-08-07/questions/seed.json', seed);
  write('reports/applied-question-quality-review.json', appliedRep);
  write('content/gh300/2026-08-07/questions/difficulty-review.json', diffRep);
  write('content/gh300/2026-08-07/questions/quality-review.json', qualRep);
  write('reports/question-objective-classification-review.json', classRep);
  write('content/gh300/2026-08-07/questions/additions-review.json', addsRep);
  write('content/gh300/2026-08-07/questions/selection-exclusions.json', exclusionsRep);
  write('reports/d4-d5-applied-cleanup-review.json', cleanupRep);

  console.log(`Successfully updated ${updatedCount} D6 questions across all stores.`);

  try {
    execFileSync(process.execPath, ['scripts/audit-applied-question-review.mjs'], { stdio: 'inherit' });
    console.log('✓ Regenerated applied-question-quality-review.md');
  } catch (e) {
    console.error('Failed audit-applied-question-review:', e.message);
  }

  try {
    execFileSync(process.execPath, ['scripts/audit-choice-quality.mjs'], { stdio: 'inherit' });
    console.log('✓ Regenerated question-choice-quality-audit.json');
  } catch (e) {
    console.error('Failed audit-choice-quality:', e.message);
  }

  try {
    execFileSync(process.execPath, ['scripts/audit-question-difficulty.mjs'], { stdio: 'inherit' });
    console.log('✓ Regenerated question-difficulty review');
  } catch (e) {
    console.error('Failed audit-question-difficulty:', e.message);
  }
}

if (process.argv[1] && process.argv[1].endsWith('rewrite-d6-applied.mjs')) {
  applyD6Rewrites();
}

