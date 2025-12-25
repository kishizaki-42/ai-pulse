import { query } from "@anthropic-ai/claude-code";
import * as fs from "fs";
import * as path from "path";

const SESSION_FILE = path.join(process.cwd(), "data", "session.json");

interface SessionState {
  sessionId: string;
  lastRun: string;
}

function loadSession(): SessionState | null {
  try {
    if (fs.existsSync(SESSION_FILE)) {
      const data = fs.readFileSync(SESSION_FILE, "utf-8");
      const state = JSON.parse(data) as SessionState;
      console.log(`📂 前回セッション読み込み: ${state.sessionId}`);
      console.log(`   最終実行: ${state.lastRun}`);
      return state;
    }
  } catch (error) {
    console.error("⚠️ セッション読み込みエラー:", error);
  }
  return null;
}

function saveSession(sessionId: string): void {
  try {
    const state: SessionState = {
      sessionId,
      lastRun: new Date().toISOString(),
    };
    fs.writeFileSync(SESSION_FILE, JSON.stringify(state, null, 2));
    console.log(`💾 セッション保存完了: ${sessionId}`);
  } catch (error) {
    console.error("⚠️ セッション保存エラー:", error);
  }
}

async function runAgent() {
  console.log("🚀 AI Pulse Agent 起動中...");
  const startTime = new Date().toISOString();

  // 前回セッションを読み込み
  const previousSession = loadSession();
  let currentSessionId: string | undefined;

  // クエリオプションを構築
  const queryOptions: {
    allowedTools: string[];
    settingSources: ("project" | "user" | "local")[];
    permissionMode: "default" | "acceptEdits" | "bypassPermissions" | "plan";
    cwd: string;
    model: string;
    resume?: string;
  } = {
    allowedTools: ["WebFetch", "Read", "Write"],
    settingSources: ["project"],
    permissionMode: "acceptEdits",
    cwd: process.cwd(),
    model: "claude-haiku-4-5-20251001",
  };

  // 前回セッションがあれば resume オプションを追加
  if (previousSession?.sessionId) {
    queryOptions.resume = previousSession.sessionId;
    console.log(`🔄 セッション再開: ${previousSession.sessionId}`);
  } else {
    console.log("🆕 新規セッション開始");
  }

  for await (const message of query({
    prompt: `
AI ニュースを収集して data/current.json に保存してください。

## 手順

1. config/whitelist.json からソース一覧を読み込む
2. 各ソース URL に対して WebFetch を実行してコンテンツを取得
3. 各記事について以下のメタデータを抽出:
   - title: 記事タイトル
   - url: 記事 URL
   - publishedAt: 公開日時（ISO 8601 形式）
   - sourceName: ソース名（whitelist.json から取得）
4. カテゴリ分類（CLAUDE.md のルールに従う）:
   - Model: LLM、基盤モデル、学習手法
   - Service: API、製品、サービス
   - Other: その他
5. 重要度判定（CLAUDE.md のルールに従う）:
   - high: 新モデル発表、大型発表
   - normal: その他
6. 各記事に日本語で概要（100 文字程度）を生成
7. 各記事に一意の ID を付与（形式: YYYYMMDD-NNN）
8. data/current.json に保存:
   - lastUpdated を現在時刻（ISO 8601）に更新
   - news 配列に全記事を追加

## 重複回避
- 前回のセッションで収集済みの記事（URL ベース）はスキップする
- 重複を検出した場合はログに記録する
- data/current.json に既に存在する URL もスキップする

## 注意事項
- URL アクセス失敗時はログを記録してスキップ
- 全ソースを処理すること
`,
    options: queryOptions,
  })) {
    // セッション ID を取得
    if (message.type === "system" && "subtype" in message && message.subtype === "init") {
      currentSessionId = (message as { session_id?: string }).session_id;
      if (currentSessionId) {
        console.log(`📍 セッション ID: ${currentSessionId}`);
      }
    }

    if (message.type === "assistant" && message.message?.content) {
      for (const block of message.message.content) {
        if ("text" in block) {
          console.log(block.text);
        } else if ("name" in block) {
          console.log(`🔧 Tool: ${block.name}`);
        }
      }
    } else if (message.type === "result") {
      console.log(`✅ 完了: ${message.subtype}`);
    }
  }

  // セッションを保存
  if (currentSessionId) {
    saveSession(currentSessionId);
  }

  const endTime = new Date().toISOString();
  console.log(`🏁 AI Pulse Agent 終了 (開始: ${startTime}, 終了: ${endTime})`);
}

runAgent().catch((error) => {
  console.error("❌ エラー:", error);
  process.exit(1);
});
