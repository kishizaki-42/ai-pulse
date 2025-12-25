import { useState, useEffect } from 'react';
import { Activity, RefreshCw, AlertCircle } from 'lucide-react';
import type { NewsData } from './types/news';
import { NewsList } from './components/NewsList';

function App() {
  const [data, setData] = useState<NewsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNews() {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}data/current.json`);
        if (!response.ok) {
          throw new Error(`Failed to load news: ${response.status}`);
        }
        const json = await response.json() as NewsData;
        setData(json);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load news');
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, []);

  const formatLastUpdated = (isoString: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Background texture */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-black pointer-events-none" />

      {/* Subtle grid pattern */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div className="relative">
        {/* Header */}
        <header className="border-b border-zinc-800/50">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              {/* Logo & Title */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-500 to-amber-500 rounded-xl blur-lg opacity-50" />
                  <div className="relative w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-rose-500 to-amber-500 rounded-xl flex items-center justify-center">
                    <Activity className="w-6 h-6 md:w-7 md:h-7 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-black tracking-tight">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-amber-400 to-rose-400">
                      AI PULSE
                    </span>
                  </h1>
                  <p className="text-zinc-500 text-sm font-medium tracking-wide">
                    AI Industry News Tracker
                  </p>
                </div>
              </div>

              {/* Last updated */}
              {data?.lastUpdated && (
                <div className="flex items-center gap-2 text-zinc-500 text-sm">
                  <RefreshCw className="w-4 h-4" />
                  <span>最終更新: {formatLastUpdated(data.lastUpdated)}</span>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="w-8 h-8 border-2 border-zinc-700 border-t-rose-500 rounded-full animate-spin mb-4" />
              <p className="text-zinc-500">読み込み中...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
              <h2 className="text-xl font-bold text-zinc-100 mb-2">読み込みエラー</h2>
              <p className="text-zinc-500 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm font-medium transition-colors"
              >
                再読み込み
              </button>
            </div>
          ) : data && data.news.length > 0 ? (
            <>
              {/* Stats bar */}
              <div className="flex items-center gap-6 mb-8 pb-6 border-b border-zinc-800/50">
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-black text-white">{data.news.length}</span>
                  <span className="text-zinc-500 text-sm">件のニュース</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-amber-400">
                    {data.news.filter(n => n.importance === 'high').length}
                  </span>
                  <span className="text-zinc-500 text-sm">件の重要ニュース</span>
                </div>
              </div>

              <NewsList news={data.news} />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
                <Activity className="w-8 h-8 text-zinc-600" />
              </div>
              <h2 className="text-xl font-bold text-zinc-100 mb-2">ニュースがありません</h2>
              <p className="text-zinc-500">新しいニュースが収集されるまでお待ちください</p>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-zinc-800/50 mt-12">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-zinc-600 text-sm">
              <p>Powered by Claude Agent SDK</p>
              <p>AI Pulse - AI 業界ニュース収集エージェント</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
