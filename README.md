# Language Switcher Web / 言語切り替えくん

サイトに多言語切り替え機能を、たった1行のコードで追加するサービス。

## 特徴

- 🔌 1行のscriptタグで導入可能
- 🌐 100以上の言語に対応（Google翻訳エンジン）
- 💰 翻訳費用は訪問者負担（クライアントサイド実行）
- 📊 翻訳使用量のインサイトを確認可能
- 🎨 ウィジェットのカスタマイズが可能

## 技術スタック

- **フレームワーク**: Next.js 14 (App Router)
- **UI**: Tailwind CSS + shadcn/ui
- **認証**: Supabase Auth
- **データベース**: Supabase PostgreSQL
- **ホスティング**: Vercel

## セットアップ

### 1. Supabaseプロジェクト作成

1. [Supabase](https://supabase.com)でアカウント作成
2. 新規プロジェクト作成
3. Project URLとAPI Keyを取得

### 2. データベース設定

SupabaseダッシュボードのSQL Editorで `supabase/migrations/001_initial_schema.sql` を実行。

### 3. 環境変数設定

```bash
cp .env.example .env.local
```

`.env.local` を編集:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. 開発サーバー起動

```bash
npm run dev
```

http://localhost:3000 でアクセス可能。

## デプロイ

### Vercelへデプロイ

1. GitHubにリポジトリをプッシュ
2. [Vercel](https://vercel.com)でインポート
3. 環境変数を設定
4. デプロイ

## Widgetの使い方

### 1. サイトを登録

ダッシュボードでサイトのドメインを登録。

### 2. コードをコピー

登録後、以下の形式のコードが生成されます:
```html
<script src="https://your-app.vercel.app/widget/your-api-key.js"></script>
```

### 3. サイトに貼り付け

HTMLの `<head>` タグ内に貼り付け:
```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <script src="https://your-app.vercel.app/widget/your-api-key.js"></script>
</head>
<body>
  <!-- コンテンツ -->
</body>
</html>
```

## Widgetの動作

1. 訪問者がサイトにアクセス
2. Widgetがサイトの言語を自動検出
3. ソース言語アイコン（左）とターゲット言語アイコン（右）を表示
4. ターゲット言語アイコンをクリックすると翻訳実行

## カスタマイズ

ダッシュボードの設定画面で以下の項目を変更可能:

- **表示位置**: 右下、左下、右上、左上
- **テーマ**: ライト、ダーク、自動
- **サイズ**: 小、中、大
- **対応言語**: 許可する言語を選択
- **デフォルト言語**: 初期表示のターゲット言語

## ディレクトリ構成

```
language-switcher/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # 認証ページ
│   │   ├── api/                # API Routes
│   │   ├── dashboard/          # ダッシュボード
│   │   └── page.tsx            # ランディングページ
│   ├── components/             # Reactコンポーネント
│   │   ├── dashboard/          # ダッシュボード用
│   │   └── ui/                 # UIコンポーネント
│   └── lib/                    # ユーティリティ
│       └── supabase/           # Supabase設定
├── widget/                     # Widgetソースコード
└── supabase/
    └── migrations/             # DBマイグレーション
```

## ライセンス

MIT License
