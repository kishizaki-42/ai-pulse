# AI Pulse

Claude Agent SDK の技術検証を目的とした AI ニュース収集エージェント

## 概要

AI Pulse は、Claude Agent SDK の主要機能（Memory, Skills, Sessions）を活用し、AI 業界のニュースを毎朝自動収集・分析する単一エージェントシステムです。

## 検証する SDK 機能

| 機能 | 用途 | 設定 |
|------|------|------|
| Memory | プロジェクトルール定義 | `CLAUDE.md` |
| Skills | 収集ロジック分離 | `.claude/skills/news-collector/SKILL.md` |
| Sessions | 状態維持・重複回避 | `resume: sessionId` |
| Built-in Tools | WebFetch, Read, Write | `allowedTools` |

## アーキテクチャ

```
GitHub Actions (JST 6:00)
    │
    ▼
┌─────────────────────────────────────────┐
│          Single Agent                   │
│                                         │
│  ┌─────────────┐  ┌─────────────────┐  │
│  │ Memory      │  │ Skills          │  │
│  │ (CLAUDE.md) │  │ (SKILL.md)      │  │
│  └─────────────┘  └─────────────────┘  │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ Sessions                        │   │
│  │ 前回状態の維持・重複回避          │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Tools: WebFetch, Read, Write          │
└─────────────────────────────────────────┘
    │
    ▼
data/current.json → Build → GitHub Pages
```

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

GitHub リポジトリの Settings → Secrets and variables → Actions で以下を設定：

- `ANTHROPIC_API_KEY`: Anthropic API キー

### 3. GitHub Pages の有効化

Settings → Pages → Source で `GitHub Actions` を選択

## 使い方

### ローカル実行

```bash
# エージェント実行
npm run agent

# フロントエンド開発サーバー
npm run dev

# ビルド
npm run build
```

### GitHub Actions

- **自動実行**: 毎朝 JST 6:00（UTC 21:00）
- **手動実行**: Actions → Daily News Collection → Run workflow

## ファイル構成

```
ai-pulse/
├── CLAUDE.md                    # Memory: プロジェクトルール
├── .claude/skills/
│   └── news-collector/
│       └── SKILL.md             # Skills: 収集ロジック
├── agent/
│   └── index.ts                 # エージェント エントリーポイント
├── config/
│   └── whitelist.json           # 監視 URL リスト
├── data/
│   └── current.json             # ニュースデータ
├── src/                         # React Frontend
│   ├── App.tsx
│   ├── components/
│   │   ├── NewsCard.tsx
│   │   ├── NewsList.tsx
│   │   └── NewsModal.tsx
│   └── types/
│       └── news.ts
├── .github/workflows/
│   └── daily-collect.yml        # GitHub Actions
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## データ構造

### NewsArticle

```typescript
interface NewsArticle {
  id: string;              // YYYYMMDD-NNN
  title: string;
  url: string;
  sourceName: string;
  category: 'Model' | 'Service' | 'Other';
  publishedAt: string;     // ISO 8601
  summary: string;         // 100 文字程度
  importance: 'high' | 'normal';
}
```

### カテゴリ定義

| カテゴリ | 説明 | 色 |
|----------|------|-----|
| Model | LLM、基盤モデル、学習手法 | Rose |
| Service | API、製品、サービス | Amber |
| Other | 上記以外 | Gray |

### 重要度定義

| 重要度 | 説明 |
|--------|------|
| high | 新モデル発表、大型買収、重大発表 |
| normal | その他 |

## 技術スタック

| Layer | Technology |
|-------|------------|
| Agent Runtime | Claude Agent SDK TypeScript |
| Language | TypeScript 5.x |
| Runtime | Node.js 20 LTS |
| Frontend | React 18 + Vite 5 + Tailwind CSS 3 |
| Data Storage | JSON files in Git |
| CI/CD | GitHub Actions |
| Hosting | GitHub Pages |

## 将来の拡張

| 拡張 | 追加する機能 |
|------|-------------|
| 通知機能 | MCP（Slack MCP Server） |
| DB 移行 | MCP（Supabase MCP Server） |
| ガードレール | Hooks |
| マルチエージェント | Subagents |

## ライセンス

MIT
