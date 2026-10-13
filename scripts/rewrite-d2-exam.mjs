import fs from 'fs';
import { createHash } from 'crypto';
import { examLengths } from './audit-exam-question-review.mjs';

const hash = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');

const seedPath = 'content/gh300/2026-08-07/questions/seed.json';
const examRepPath = 'reports/exam-question-quality-review.json';
const diffRepPath = 'content/gh300/2026-08-07/questions/difficulty-review.json';
const qualRepPath = 'content/gh300/2026-08-07/questions/quality-review.json';
const classRepPath = 'reports/question-objective-classification-review.json';
const addsRepPath = 'content/gh300/2026-08-07/questions/additions-review.json';

const seed = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
const examRep = JSON.parse(fs.readFileSync(examRepPath, 'utf8'));
const diffRep = JSON.parse(fs.readFileSync(diffRepPath, 'utf8'));
const qualRep = JSON.parse(fs.readFileSync(qualRepPath, 'utf8'));
const classRep = JSON.parse(fs.readFileSync(classRepPath, 'utf8'));
const addsRep = JSON.parse(fs.readFileSync(addsRepPath, 'utf8'));

// D2のリライト定義 (14問)
const d2Rewrites = {
  'q-d2-e02': {
    question: 'GitHub Copilotが参照する社内ナレッジの応答キャッシュ機構を設計しています。契約は担当変更を直ちに反映し、再利用判定は25ms以下であることが必須要件です。各候補を評価したところ、Pは現在の権限と更新版を照合し20ms、Qは利用者別キーだけ、Rは時間キャッシュ、Sは全員共通という仕様でした。これらの要件を確実に満たす方式として最も適切なものはどれですか？',
    choices: [
      { id: 'A', text: '方式Pを採用し、権限照合の正確性と20msでの高速な再利用判定を検証する' },
      { id: 'B', text: '方式Qを採用し、利用者別キーによる分離とキャッシュ再利用の有効性を検証する' },
      { id: 'C', text: '方式Rを採用し、有効期限（TTL）に基づく時間キャッシュの再利用を検証する' },
      { id: 'D', text: '方式Sを採用し、全員共通キャッシュによるオーバーヘッド削減と再利用を検証する' }
    ],
    explanation: '担当変更を即座に反映するには、キャッシュ取得時に利用者の最新の権限とナレッジの更新版を照合する必要があります。方式Pは最新権限の照合を行いながら判定時間も20msと目標（25ms以下）をクリアしています。Qは担当変更に追従できず、RはTTL切れまで古い権限を保持し、Sはアクセス制御が破綻します。',
    choiceExplanations: {
      A: '正解です。担当変更を即時反映するための最新権限・更新版照合を行い、かつ判定時間20msで要求（25ms以下）を満たす方式Pを採用する検証です。',
      B: '方式Qは利用者ごとのキー分離を行うのみで、同一利用者の担当変更や組織権限の更新を即時に反映する仕組みを持ちません。',
      C: '方式Rは時間ベースの有効期限（TTL）を用いるため、有効期限が切れるまで担当変更前の古い権限でキャッシュが再利用されてしまいます。',
      D: '方式Sは全利用者でキャッシュを共通化するため、利用者の権限に応じたアクセス制御が完全に破綻して機密漏洩の原因となります。'
    }
  },
  'q-d2-e06': {
    question: 'GitHub Copilot CLIの権限管理ポリシーの演習です。セッションPはshellツールが利用可能で、Git操作を許可しgit pushだけ拒否しています。セッションQは利用可能ツールを読取系だけに制限し、Git操作の許可も指定しています。システム規則では、denyはallowより優先し、許可指定は利用可能ツールを増やさない規則です。この設定において、セッションPおよびQでgit commitとgit pushの実行を試みた場合の結果として最も適切なものはどれですか？',
    choices: [
      { id: 'A', text: 'Pではcommitが許可されpushは拒否されるが、Qでは実行ツール制限によりcommitもpushも拒否される' },
      { id: 'B', text: 'Pではcommitもpushも両方許可され、Qでは実行ツールの制限によりcommitもpushも拒否される' },
      { id: 'C', text: 'Pではcommitが許可されpushは拒否され、QではGit操作許可によりcommitもpushも許可される' },
      { id: 'D', text: 'Pでは個別拒否によりcommitもpushも拒否され、QではGit許可によりcommit可・push不可となる' }
    ],
    explanation: 'セッションPではshellツールが利用可能でGit操作が許可されていますが、「denyはallowより優先」されるため、個別拒否されたgit pushのみが拒否され、git commitは許可されます。セッションQではGit操作の許可が指定されていても、「許可指定は利用可能ツールを増やさない」ため、実行ツール（shell等）が使えず、commitもpushも実行できません。',
    choiceExplanations: {
      A: '正解です。Pでは優先されるdenyによりpushのみ拒否されてcommitは成功し、Qではツール制限によりそもそも実行自体が不可となります。',
      B: 'Pにおいて明示的に設定されたgit pushの拒否（deny）設定を無視しており、不適切な許可判定を行っています。',
      C: 'Qにおいて「許可指定は利用可能ツールを増やさない」という大原則を見落とし、読取専用環境でGit更新操作を誤って許可しています。',
      D: 'Pにおけるgit push拒否をGit操作全体（commit含む）への拒否へと拡大解釈してしまっています。'
    }
  },
  'q-d2-e11': {
    question: '社内ナレッジ検索用のModel Context Protocol（MCP）サーバーにおいて、文書本文の取得時には利用者の閲覧権限を厳密に検証しています。しかし検証において、一般社員の検索結果には閲覧可能な2文書だけ表示されますが、totalCountは7、候補タイトルには人事文書名が含まれています。本文アクセスは拒否されます。文書の存在自体の情報漏洩を防ぎ、セキュリティ要件を満たすための返却設計の見直しとして最も適切なものはどれですか？',
    choices: [
      { id: 'A', text: '検索結果の総件数（totalCount）および候補タイトル一覧を、本文取得時と同一の認可済み文書集合から生成する' },
      { id: 'B', text: '文書本文取得時の認可ロジックを見直し、閲覧権限を持たない一般社員に対しても本文の返却を許可する' },
      { id: 'C', text: '検索結果の全タイトルを要約テキストに集約して返却データ量を削減し、個別の文書名表示を避ける' },
      { id: 'D', text: '検索ツールの操作を読み取り専用に限定し、更新系APIを外部クライアントへ一切公開しない設計にする' }
    ],
    explanation: '本文取得で403拒否しても、検索結果のヒット総件数（totalCount=7）や候補タイトルに機密文書名が含まれていれば、「機密文書が存在すること」自体が漏洩してしまいます。情報漏洩を完全に防ぐためには、検索メタデータ（件数やタイトル一覧）も本文と同じ認可フィルターを適用した文書集合から生成する必要があります。',
    choiceExplanations: {
      A: '正解です。本文取得時と同じ認可済み集合から検索件数やタイトルを生成することで、権限外の文書の存在そのものを隠蔽し漏洩を防ぎます。',
      B: '本文取得時の認可を緩和して機密文書を閲覧可能にしてしまうことは、重大な権限昇格・情報漏洩インシデントを引き起こします。',
      C: 'タイトルを要約文に集約しても、要約内に機密文書の話題が含まれるリスクが残り、権限外データの存在漏洩の根本解決になりません。',
      D: '読み取り専用化はデータの改ざん防止には有効ですが、検索結果からの機密メタデータ漏洩の防止とは無関係です。'
    }
  },
  'q-d2-e19': {
    question: '開発中のModel Context Protocol（MCP）サーバーにおいて、AIクライアントから2種類の呼び出しエラーが発生しました。①登録済みqueryツールへの形式上有効な呼出しでSQL構文エラーが発生した場合、②未登録のquery_v2というツールへの呼出しが発生した場合です。①ではAIにエラー内容を理解させてSQLを修正して再試行させたいと考えています。MCP仕様のエラーハンドリング区分に合致する適切な返却方式はどれですか？',
    choices: [
      { id: 'A', text: '①はCallToolResultのisErrorをtrueにしてエラー内容を返し、②はJSON-RPCレベルのProtocolエラーとして返す' },
      { id: 'B', text: '①はJSON-RPCレベルのエラーとして返却し、②はCallToolResultのisErrorをtrueにしてエラー内容を返す' },
      { id: 'C', text: '①および②の両方について、CallToolResultのisErrorをtrueに設定し、それぞれの失敗内容を返却する' },
      { id: 'D', text: '①および②の両方について、ツール実行結果ではなくJSON-RPCプロトコルレベルのエラー応答として返却する' }
    ],
    explanation: 'MCP仕様では、ツールの実行自体は試行されたがビジネスロジックや入力内容（SQL等）により失敗した場合は、CallToolResultオブジェクトのisError=trueとしてエラーメッセージを返すことで、AIが内容を理解して入力を修正・再試行できます。一方、存在しないツールの呼び出しはMCPプロトコル自体の規約違反であるため、JSON-RPCプロトコルレベルのエラーコードで返却するのが仕様通りの正しい区分です。',
    choiceExplanations: {
      A: '正解です。ツール実行の論理エラー（修正可能なSQL構文エラー）はisError=trueでAIへフィードバックし、プロトコル違反（未登録ツール）はJSON-RPCエラーで返します。',
      B: 'エラー区分の返却が逆になっています。ツール実行失敗をJSON-RPCエラーにするとクライアントとの対話が停止し再試行できなくなります。',
      C: '未登録のツール呼び出しはサーバー側でCallToolResultを生成する以前のプロトコルエラーであり、isErrorでは返せません。',
      D: 'SQL構文エラーまでプロトコルエラーにしてしまうと、AIが構文を修正して再試行する機会が失われてしまいます。'
    }
  },
  'q-d6-e02': {
    question: 'Enterprise内の組織Org-AにおけるGitHub Copilotの利用量が14:00 JSTから急減しました。監査ログを調査したところ、イベントE1は04:50 UTCのポリシー変更で対象A、E2は05:10 UTCのシート変更で対象Bでした。利用量集計はAだけで、ログ時刻はUTC（JSTはUTC+9）で記録されています。「利用減少の発生時刻より前に発生」かつ「対象組織が一致」という因果関係調査の必要条件を満たす最優先の調査候補として最も適切なものはどれですか？（因果の確定は別途検証します）',
    choices: [
      { id: 'A', text: 'イベントE1のみが必要条件を満たす調査候補であり、E1を対象として詳細な影響を検証する' },
      { id: 'B', text: 'イベントE2のみが必要条件を満たす調査候補であり、E2を対象として詳細な影響を検証する' },
      { id: 'C', text: 'イベントE1とE2の両方が必要条件を満たす調査候補であり、双方の詳細な因果関係を検証する' },
      { id: 'D', text: 'E1およびE2のいずれも必要条件を満たさないため、他の外部要因や監査ログを調査する' }
    ],
    explanation: '時刻を変換すると、14:00 JSTは 05:00 UTCに相当します。イベントE1（04:50 UTC）は利用減少（05:00 UTC）の10分前に発生しており、対象もOrg-Aで一致するため、因果関係の必要条件を満たします。一方、イベントE2（05:10 UTC）は利用減少の後に発生した事後イベントであり、かつ対象もOrg-Bであるため候補から除外されます。',
    choiceExplanations: {
      A: '正解です。UTCへの時刻変換（14:00 JST = 05:00 UTC）によりE1のみが発生前かつ対象Org-A一致という必要条件を満たします。',
      B: 'E2は利用減少より後の05:10 UTCに発生しており、かつ対象も無関係なOrg-Bであるため調査候補になり得ません。',
      C: '時差計算を見誤り、利用減少後に発生したE2や別組織向けのE2まで同列の調査候補に含めてしまっています。',
      D: 'E1が減少時刻の直前にOrg-Aに対して発生している事実を計算ミスにより見落としてしまっています。'
    }
  },
  'q-d6-e05': {
    question: '組織のGitHub Copilotシート（ライセンス）回収基準は「割当から30日超、確認できる最終活動から30日超の人を候補にする。nullは別確認」と定められています。API集計の結果、従業員Aは割当60日前・活動45日前、Bは割当5日前・活動null、Cは割当90日前・活動昨日、Dは割当90日前・活動nullでした。社内基準に基づき、ライセンス回収の対象者および保留者の判定として最も適切なものはどれですか？',
    choices: [
      { id: 'A', text: 'Aのみを回収確認の候補とし、活動日がnullであるBとDは安易に失効させず別ルートで確認する' },
      { id: 'B', text: 'AとDの両方を回収候補とし、割当期間が短いBは不明値として扱い、Cは最近の活動ありとする' },
      { id: 'C', text: 'AとBとDの3名を一括で回収候補とし、直近に活動があるCのみを継続利用対象として扱う' },
      { id: 'D', text: 'Dのみを回収候補とし、AとBは不明値として扱い、Cは最近の活動があるため除外する' }
    ],
    explanation: '回収基準は「割当30日超」かつ「最終活動30日超」の2条件を満たすことです。Aは割当60日・活動45日で両条件を満たす唯一の回収候補です。Bは割当5日でそもそも30日未満です。Cは昨日活動しているため対象外です。Dは割当90日ですが活動日がnull（一度も活動していないか記録なし）であり、規約上「nullは別確認」と定められているため、直接の自動回収候補とせず別途ヒアリング等で確認します。',
    choiceExplanations: {
      A: '正解です。2つの日数条件を満たすAのみを回収候補とし、規約通り活動日nullのBとDを別確認に回す適切な判定です。',
      B: 'Dの活動日nullを「長期間活動なし」と勝手に解釈して回収候補に含めており、「nullは別確認」という明示ルールに反します。',
      C: '割当から5日しか経過していないBまで回収候補に含めており、30日超という割当期間の基準を完全に無視しています。',
      D: '両条件を正当に満たしているAを除外してしまい、確認が必要なDを誤って即時回収候補に指定しています。'
    }
  },
  'q-sc01-3': {
    question: '【AnyCompany Tech事例】Enterprise管理において、ポリシーPをEnterpriseで強制禁止、QをOrganizationへ委任しています。傘下のOrganization Aから「PとQの両方を自組織で許可したい」との申請がありました。経営陣は検討の結果、Pの全社禁止は維持し、Qだけ例外を認めますとの決定を下しました。この決定を反映し、期待通りの実効ポリシーを実現するための最小限の設定変更として最も適切なものはどれですか？',
    choices: [
      { id: 'A', text: 'Enterprise全体の設定はそのまま維持し、Organization Aの設定で委任されているQのみを許可する' },
      { id: 'B', text: 'EnterpriseでPの委任設定を解除して許可に変更し、Organization AでPとQの両方を許可する' },
      { id: 'C', text: 'EnterpriseでポリシーQも強制禁止に変更した上で、Organization A側でQの個別許可を設定する' },
      { id: 'D', text: 'Enterpriseの強制禁止設定は維持し、Organization A内の指示ファイル（Prompt File）でQを許可する' }
    ],
    explanation: 'Enterpriseで強制（Enforced）されたポリシーは下位のOrganizationやリポジトリで上書きできません。一方、Organizationへ委任（No policy）されているポリシーは各組織で独自に許可または禁止を設定できます。Pは全社禁止を維持するためEnterprise設定を変更せず、Qは既に委任されているためOrganization Aの設定画面でQのみを許可することで、最小限の手順で要件を達成できます。',
    choiceExplanations: {
      A: '正解です。EnterpriseでPを強制禁止・Qを委任したまま、組織A側で委任済みのQのみを許可する最小かつ正確な設定変更です。',
      B: 'Pの全社強制禁止を維持するという決定に違反し、EnterpriseレベルでPの制限を緩和してしまいます。',
      C: 'EnterpriseでQを強制禁止にしてしまうと、Organization側で個別許可を設定しても上位の強制が優先され許可できなくなります。',
      D: 'Prompt Fileなどのリポジトリ指示ファイルは組織管理ポリシーを上書き・設定する権限を持ちません。'
    }
  },
  'q-sc03-2': {
    question: '社内Model Context Protocol（MCP）サーバーへの接続テストを実施しました。テスト結果として、エンジニアBは入力変数が空で401、Cは本人認証成功だが担当外DBを照会して403でした。なお、接続先URLとサーバー起動は全員同じ設定です。この2名に発生している障害原因を的確に切り分け、それぞれ復旧するための対応として最も適切なものはどれですか？',
    choices: [
      { id: 'A', text: 'Bには不足している本人認証資格情報を設定させ、Cには照会先DBの変更または担当業務の認可権限を確認する' },
      { id: 'B', text: 'BとCの両名に対して、本人認証資格情報の入力環境変数のみを追加設定させて再接続を試行させる' },
      { id: 'C', text: 'BとCの両名に対して、照会先データベースのアクセス権限および担当業務の認可設定のみを確認する' },
      { id: 'D', text: '共有MCPサーバーの接続URLと起動コマンドを修正し、開発者全員のネットワーク疎通を一括で検証する' }
    ],
    explanation: 'HTTPステータスコード401（Unauthorized）は「本人認証の失敗または資格情報の欠落」を示し、403（Forbidden）は「認証は成功しているが、要求されたリソースに対する認可・アクセス権限の不足」を示します。Bは認証資格情報（環境変数等）の設定が必要であり、Cは認証済みであるため照会対象DBのアクセス権認可の確認が必要です。両者の障害レイヤーを明確に区別して対処します。',
    choiceExplanations: {
      A: '正解です。401であるBには認証資格情報の補完、403であるCには対象リソースに対する認可権限の確認という、それぞれの障害境界に応じた適切な対応です。',
      B: 'Cは本人認証自体はすでに成功しており、認証資格情報を追加しても403（認可不足）エラーは解消しません。',
      C: 'Bは入力変数が空で認証情報すら送信できておらず、DB認可を確認する前段階の認証設定で失敗しています。',
      D: 'サーバーURLや起動コマンドは共通で動作確認済みであり、ネットワークや起動障害ではなく個々の認証・認可の問題です。'
    }
  },
  'q-sc07-2': {
    question: '【CyberShield Systems事例】組織では厳格な統制のもと、承認済みMCPサーバーへのみAIの接続を許可しています。ドキュメント検索機能では、検索は利用者のACLで絞られますが、getDocument(id)は接続トークンだけを検証します。一般社員が既知の人事文書IDを渡すと本文が返りました。この認可不備（BOLA/IDOR）の脆弱性を根本的に解消するための最小限の修正箇所として最も適切なものはどれですか？',
    choices: [
      { id: 'A', text: 'getDocumentツール内で、要求された文書IDに対する呼び出し元ユーザー自身の閲覧権限を検証する' },
      { id: 'B', text: '検索ツールの利用者ACLフィルターを強化し、getDocumentツールの既存トークン検証ロジックは維持する' },
      { id: 'C', text: '承認済みMCPサーバーの接続先構成を再登録し、既存の文書取得認証プロトコルをそのまま維持する' },
      { id: 'D', text: '検索結果のレスポンスから文書IDフィールドを非表示にし、getDocumentの呼び出し認証方式を保つ' }
    ],
    explanation: '検索結果をACLで絞り込んでも、直接取得APIであるgetDocument(id)が接続トークン（サーバー認証）しか見ておらず、呼び出し元ユーザーの対象文書に対する認可を検証していなければ、IDを推測・既知された場合に不正取得されます（BOLA/IDOR）。検索での隠蔽ではなく、リソース取得処理そのものにおいて「対象文書に対するユーザーの認可」を厳密に検証することが根本対策です。',
    choiceExplanations: {
      A: '正解です。直接取得ツールgetDocument内で対象リソースに対するユーザーの閲覧権限を検証することで、認可バイパスを根本から防止します。',
      B: '検索で絞り込んでも、既知のIDを直接指定された場合の直接取得経路における認可漏れを防ぐことはできません。',
      C: 'MCPサーバーの再登録や接続認証を行っても、アプリケーション層における文書IDの認可不備は解消されません。',
      D: 'IDを非表示にするだけの「隠蔽によるセキュリティ」は、既知のIDや推測されたIDによる直接攻撃を防げません。'
    }
  },
  'q-d2-e21': {
    question: 'GitHub Copilot Spaceにリポジトリrepo-Rとアップロード資料Uが登録されています。ユーザーAは全て閲覧可能です。しかし、BはSpaceとUを閲覧でき、Rを直接開くと403で回答にもRがない状態です。一方、CはSpaceが403だがRを直接閲覧できる状態です。全員同じSpaceリンクを使用し、403は対象への閲覧拒否とログで確認済みです。BとCが正常に利用できるようにするための修正対象の組み合わせとして最も適切なものはどれですか？',
    choices: [
      { id: 'A', text: 'ユーザーBにはSpace自体の共有権限を付与し、ユーザーCにはリポジトリrepo-Rの閲覧権限を付与する' },
      { id: 'B', text: 'ユーザーBにはリポジトリrepo-Rの閲覧権限を付与し、ユーザーCにはSpace自体の共有権限を付与する' },
      { id: 'C', text: 'ユーザーBとCの両名に対して、リポジトリrepo-Rの閲覧権限を付与してアクセスを許可する' },
      { id: 'D', text: 'ユーザーBとCの両名に対して、Space自体の共有アクセス権限を付与して参加を許可する' }
    ],
    explanation: 'BはSpace自体と資料UにアクセスできているためSpaceの共有権限は持っていますが、repo-Rで403が出ているためRのアクセス権限が不足しています。一方、Cはrepo-R自体は閲覧できますがSpaceで403が出ているため、Spaceの共有アクセス権限が不足しています。したがって、Bにはrepo-Rの権限、CにはSpaceの権限を付与する必要があります。',
    choiceExplanations: {
      A: 'ユーザーBとCに必要な権限を完全に取り違えており、すでに持っている権限を重ねて付与しようとしています。',
      B: '正解です。Spaceは使えるがRが読めないBにはrepo-R権限を、Rは読めるがSpaceに入れないCにはSpace共有権限を付与します。',
      C: 'Cはすでにrepo-Rを直接閲覧できており、不足しているのはSpaceへの参加アクセス権限です。',
      D: 'BはすでにSpaceと資料Uを閲覧できており、不足しているのは参照リポジトリrepo-Rへのアクセス権限です。'
    }
  },
  'q-d2-e22': {
    question: '外部コントリビューターからのPRをGitHub Copilot CLIで自動分析するCIパイプラインを設計しています。パイプラインの要件は修正案の回収で、生成コードの実行と機密変数の読取は不要です。承認済み入力は読取専用マウント、機密変数は全案で除去済みです。今回の成果物は/tmp/patchへ保存し、その場所だけ書込可という制約です。最小権限と隔離の原則を満たすサンドボックス設計として最も適切なものはどれですか？',
    choices: [
      { id: 'A', text: '入力・出力ディレクトリをすべて読取専用に設定し、CIランナー内でのコード実行を禁止する' },
      { id: 'B', text: '入力ワークスペースへの書き込みを許可し、成果物出力先を/tmp/patchとし、コード実行を禁止する' },
      { id: 'C', text: '入力ワークスペースを読取専用にし、/tmp/patchのみを書込可能とし、コード実行を禁止する' },
      { id: 'D', text: '入力ワークスペースを読取専用にし、/tmp/patchのみを書込可能とし、テストコードの実行を許可する' }
    ],
    explanation: '外部PRを分析する際は悪意あるコードの混入リスクを想定し最小権限で隔離します。入力ワークスペースは改ざんを防ぐため「読取専用」、成果物であるパッチファイルの保存先「/tmp/patchのみ書込可能」とし、外部コードの自動実行を防ぐため「コード実行不可」に設定するのが要件を満たす最小権限の設計です。',
    choiceExplanations: {
      A: '出力先まで読取専用にしてしまうと、分析結果である修正案（パッチ）を/tmp/patchへ保存できなくなります。',
      B: '入力ワークスペースを書込可能にすると、悪意あるPR分析時にリポジトリ内の既存ファイルが書き換えられるリスクが生じます。',
      C: '正解です。入力は読取専用、成果物保存先（/tmp/patch）のみ書込可能、コード実行は禁止という3制約をすべて満たす構成です。',
      D: '外部PR分析においてコード実行を許可すると、未知の悪意あるスクリプトがCI環境内で実行される重大な危険があります。'
    }
  },
  'q-d2-e23': {
    question: 'リポジトリの共通コーディング指示ではany型の使用が禁止されています。承認済み例外はprototype/**かつ内部専用の試作だけに限定されています。Prompt Fileによりprototype/a.tsとb.tsにanyを含むコード例が生成されました。両方の型検査は成功しましたが、aは公開API、bは内部専用で、両方prototype配下です。規約に適合した例を維持しつつ、必要な例だけ直す方針として最も適切なものはどれですか？',
    choices: [
      { id: 'A', text: 'a.tsとb.tsの両方に含まれるany型のコード例をそのまま維持する' },
      { id: 'B', text: 'a.tsとb.tsの両方を厳格な型定義付きコードへ修正する' },
      { id: 'C', text: 'a.tsのany例を維持し、内部専用であるb.tsのみを型付きへ修正する' },
      { id: 'D', text: '公開APIであるa.tsを型付きへ修正し、内部試作であるb.tsのany例は維持する' }
    ],
    explanation: '例外の承認条件は「prototype/**配下」かつ「内部専用の試作」の2つの条件を同時に満たすことです。b.tsは両方を満たすため規約上の正当な例外としてanyの維持が認められます。一方、a.tsはprototype配下であっても公開APIであるため例外条件を満たさず、型定義付きコードへの修正が必須です。適合しているbの例を無駄に直さず、違反しているaのみを修正します。',
    choiceExplanations: {
      A: 'a.tsが公開APIであるという重大な制約を見落とし、規約違反のコード例をそのまま放置してしまっています。',
      B: '規約で正当に承認されている内部専用の試作コードb.tsまで過剰に修正してしまっています。',
      C: '修正対象の判定を完全に逆にしてしまっており、公開APIの違反を放置して内部試作を修正しています。',
      D: '正解です。例外条件を満たさない公開APIのa.tsのみを修正し、承認済み例外である内部専用b.tsは維持する的確な対応です。'
    }
  },
  'q-d2-e24': {
    question: '社内で運用していたGitHub App型の社内Copilot Extensionが2025年11月10日の廃止後に停止しました。同じGitHub AppのIssue連携は動作する。接続ログは廃止を示し、新しい認証失敗はない状態です。移行先として認可付きMCP検索を準備済みですが接続承認は未完了です。今回のログおよび廃止事象に対応した機能復旧・サービス再開の手順として最も適切なものはどれですか？',
    choices: [
      { id: 'A', text: '準備済みMCPサーバーの接続承認および検索認可手続きを完了させ、Chat機能の連携経路をMCPへ置換する' },
      { id: 'B', text: '存続している通常GitHub AppのIssue連携用資格情報を更新し、Extension APIの再疎通を検証する' },
      { id: 'C', text: 'MCPサーバーの検索引数スキーマを修正し、廃止されたExtension形式との後方互換性を再検証する' },
      { id: 'D', text: 'CLIのシート割り当てと利用権限ポリシーを再確認し、ローカル端末からの直接接続を検証する' }
    ],
    explanation: 'GitHub App型のCopilot Extensionは2025年11月10日をもって公式に廃止されました。ただし同じAppの通常機能（Issue連携等）は存続して正常動作しています。Extensionの停止は廃止によるものであるため、同じAppの資格情報更新等では復活しません。準備されている後継のModel Context Protocol（MCP）サーバーの承認・認可手続きを完了し、Chatの拡張機能をMCPへ正式に切り替える必要があります。',
    choiceExplanations: {
      A: '正解です。廃止されたGitHub App型Extensionの復旧を試みるのではなく、準備済みのMCPの接続承認を完了して移行・再開する正しい手順です。',
      B: 'GitHub App型Extension機能自体がサービス終了（廃止）しているため、Issue連携用資格情報を更新してもExtensionは動作しません。',
      C: 'プロトコル自体がMCPへ刷新されているため、廃止された古いExtension形式との互換性をスキーマレベルで維持しようとしても解決になりません。',
      D: '今回の問題は社内Extensionの廃止に伴うChat連携の停止であり、CLIのシート割り当てや端末接続の問題ではありません。'
    }
  },
  'q-d6-e06': {
    question: '公開コード一致ポリシー（Suggestions matching public code）の設定演習です。Enterpriseの実効設定は強制Blockで、Org-Aの保存値はAllow、Org-BはBlock。反映は確認済みです。ポリシーがEnterpriseで強制された場合は個人設定で解除できません。社内セキュリティ委員会はOrg-AについてのみAllowとする例外を承認しましたが、Enterprise設定の変更承認はまだない状態です。この時点におけるOrganization AおよびBの実効ポリシー状態として最も適切なものはどれですか？',
    choices: [
      { id: 'A', text: 'Organization Aの実効設定はAllowであり、Organization Bの実効設定はBlockである' },
      { id: 'B', text: 'Organization Aの実効設定はAllowであり、Organization Bの実効設定もAllowである' },
      { id: 'C', text: 'Organization Aの実効設定はBlockであり、Organization Bの実効設定もBlockである' },
      { id: 'D', text: 'Organization Aの実効設定はBlockであり、Organization Bの実効設定はAllowである' }
    ],
    explanation: 'GitHubのポリシー階層構造において、Enterpriseレベルで「強制（Enforced）」された設定は、下位のOrganizationの保存値に関係なく絶対的に優先されます。社内委員会が例外を認めても、技術的なEnterprise設定（強制Block）が変更または委任（No policy）されない限り、Org-AのAllowは有効化されず実効設定はBlockのままとなります。Org-Bも当然Blockであるため、両組織ともBlockが実効状態です。',
    choiceExplanations: {
      A: '社内承認のみでEnterpriseの技術的強制が上書きされると誤解しており、下位Org-Aの保存値が有効になると誤判定しています。',
      B: 'Org-Bは組織の保存値もBlockであり、両組織ともAllowになることはあり得ません。',
      C: '正解です。Enterpriseの強制Blockが有効である限り、組織側の保存値や社内例外承認にかかわらず、両組織の実効状態はBlockとなります。',
      D: 'Org-AとOrg-Bの実効状態を逆にしてしまっており、ポリシー継承のルールを誤って解釈しています。'
    }
  }
};

const originalChoiceOrder = {
  'q-d2-e02': ['B', 'C', 'D', 'A'],
  'q-d2-e06': ['A', 'B', 'C', 'D'],
  'q-d2-e11': ['C', 'A', 'B', 'D'],
  'q-d2-e19': ['B', 'D', 'C', 'A'],
  'q-d6-e02': ['C', 'A', 'B', 'D'],
  'q-d6-e05': ['D', 'C', 'B', 'A'],
  'q-sc01-3': ['D', 'C', 'A', 'B'],
  'q-sc03-2': ['A', 'B', 'D', 'C'],
  'q-sc07-2': ['D', 'C', 'A', 'B'],
  'q-d2-e21': ['A', 'B', 'C', 'D'],
  'q-d2-e22': ['A', 'B', 'C', 'D'],
  'q-d2-e23': ['A', 'B', 'C', 'D'],
  'q-d2-e24': ['A', 'B', 'C', 'D'],
  'q-d6-e06': ['A', 'B', 'C', 'D']
};

// 実行処理
let modifiedCount = 0;
for (const [id, rw] of Object.entries(d2Rewrites)) {
  const q = seed.find(x => x.id === id);
  if (!q) {
    console.error(`Question ${id} not found in seed`);
    continue;
  }
  
  // 1. seed更新
  q.question = rw.question;
  const order = originalChoiceOrder[id] || ['A', 'B', 'C', 'D'];
  q.choices = order.map(cid => rw.choices.find(c => c.id === cid));
  q.explanation = rw.explanation;
  q.choiceExplanations = rw.choiceExplanations;

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
  
  // cluesチェック
  for (const c of q.clues) {
    if (!q.question.includes(c)) {
      throw new Error(`[${id}] Question does not include clue: "${c}"`);
    }
  }

  // 2. examRep更新
  const repRow = examRep.questions.find(r => r.id === id);
  if (!repRow) throw new Error(`[${id}] Not found in exam review repo`);
  
  const cf = repRow.counterfactual;
  if (!q.question.includes(cf.from)) {
    throw new Error(`[${id}] Question does not include cf.from: "${cf.from}"`);
  }
  const splitCount = q.question.split(cf.from).length;
  if (splitCount !== 2) {
    throw new Error(`[${id}] cf.from appeared ${splitCount - 1} times, must be exactly 1`);
  }
  cf.question = q.question.replace(cf.from, cf.to);
  
  const lengths = examLengths(q);
  repRow.lengths = lengths;
  repRow.after = JSON.parse(JSON.stringify(q));
  repRow.fingerprint = hash(repRow.after);
  
  // distractors更新
  const wrongChoices = q.choices.filter(c => !q.answer.includes(c.id));
  repRow.distractors = wrongChoices.map(wc => {
    const prevDist = repRow.distractors.find(d => d.id === wc.id);
    return {
      id: wc.id,
      text: wc.text,
      whyWrong: q.choiceExplanations[wc.id],
      temptation: prevDist?.temptation || '一般的な誤解に基づく選択肢'
    };
  });

  // 3. diffRep更新
  if (diffRep.questions && diffRep.questions[id]) {
    diffRep.questions[id].fingerprint = hash(q);
    diffRep.questions[id].textRewritten = true;
  }

  // 4. qualRep更新
  if (qualRep.questions && qualRep.questions[id]) {
    qualRep.questions[id].fingerprint = hash(q);
    qualRep.questions[id].after = JSON.parse(JSON.stringify(q));
    qualRep.questions[id].rationale = rw.explanation;
  }

  // 5. classRep更新
  const classRow = classRep.questions?.find((r) => r.id === id);
  if (classRow) {
    classRow.fingerprint = hash(q);
    classRow.after = JSON.parse(JSON.stringify(q));
  }

  // 6. addsRep更新
  const addRow = addsRep.questions?.find((r) => r.id === id);
  if (addRow) {
    addRow.fingerprint = hash(q);
    addRow.after = JSON.parse(JSON.stringify(q));
  }

  modifiedCount++;
  console.log(`[PASS] ${id} rewritten. Length ratio: ${lengths.ratio.toFixed(2)} (pos: ${lengths.position})`);
}

// ファイル書き込み
fs.writeFileSync(seedPath, JSON.stringify(seed, null, 2) + '\n');
fs.writeFileSync(examRepPath, JSON.stringify(examRep, null, 2) + '\n');
fs.writeFileSync(diffRepPath, JSON.stringify(diffRep, null, 2) + '\n');
fs.writeFileSync(qualRepPath, JSON.stringify(qualRep, null, 2) + '\n');
fs.writeFileSync(classRepPath, JSON.stringify(classRep, null, 2) + '\n');
fs.writeFileSync(addsRepPath, JSON.stringify(addsRep, null, 2) + '\n');

console.log(`\nSuccessfully rewritten and synced ${modifiedCount} questions in D2!`);
