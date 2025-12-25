import { useState, useEffect } from 'react';
import { Activity, RefreshCw, AlertCircle } from 'lucide-react';
import type { NewsData } from './types/news';
import { NewsList } from './components/NewsList';
import { formatDate } from './utils/formatDate';

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

  return (
    <div className="min-h-screen">
      {/* Paper texture overlay */}
      <div className="fixed inset-0 paper-texture pointer-events-none" />

      {/* Content */}
      <div className="relative">
        {/* Header */}
        <header className="border-b border-[var(--border)]">
          <div className="max-w-6xl mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              {/* Logo & Title */}
              <div>
                <p className="text-[var(--warm-gray)] text-xs tracking-[0.3em] uppercase mb-2">
                  Daily Intelligence
                </p>
                <h1 className="font-editorial text-4xl md:text-5xl font-bold tracking-tight text-[var(--ink)]">
                  AI Pulse
                </h1>
                <p className="text-[var(--warm-gray)] mt-2 text-sm">
                  Curated AI Industry News & Analysis
                </p>
              </div>

              {/* Last updated */}
              {data?.lastUpdated && (
                <div className="flex items-center gap-2 text-[var(--warm-gray)] text-sm">
                  <RefreshCw className="w-4 h-4" aria-hidden="true" />
                  <span>最終更新: {formatDate(data.lastUpdated, 'full')}</span>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Decorative divider */}
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-4 py-4">
            <div className="h-px flex-1 bg-[var(--border)]" />
            <span className="text-[var(--accent-coral)] text-lg" aria-hidden="true">◆</span>
            <div className="h-px flex-1 bg-[var(--border)]" />
          </div>
        </div>

        {/* Main content */}
        <main className="max-w-6xl mx-auto px-6 py-8">
          {loading ? (
            <div
              className="flex flex-col items-center justify-center py-24"
              role="status"
              aria-live="polite"
              aria-busy="true"
            >
              <div
                className="w-8 h-8 border-2 border-[var(--border)] border-t-[var(--accent-coral)] rounded-full animate-spin mb-4"
                aria-hidden="true"
              />
              <p className="text-[var(--warm-gray)]">読み込み中...</p>
            </div>
          ) : error ? (
            <div
              className="flex flex-col items-center justify-center py-24 text-center"
              role="alert"
            >
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-[var(--accent-coral)]" aria-hidden="true" />
              </div>
              <h2 className="text-xl font-bold text-[var(--ink)] mb-2">読み込みエラー</h2>
              <p className="text-[var(--warm-gray)] mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2.5 bg-[var(--ink)] text-white hover:bg-[var(--warm-gray)] rounded-lg text-sm font-medium transition-colors focus-ring"
              >
                再読み込み
              </button>
            </div>
          ) : data && data.news.length > 0 ? (
            <>
              {/* Stats bar */}
              <div className="flex items-center gap-8 mb-10 pb-6 border-b border-[var(--border)]">
                <div className="flex items-baseline gap-2">
                  <span className="font-editorial text-4xl font-bold text-[var(--ink)]">
                    {data.news.length}
                  </span>
                  <span className="text-[var(--warm-gray)] text-sm">件のニュース</span>
                </div>
                <div className="w-px h-8 bg-[var(--border)]" aria-hidden="true" />
                <div className="flex items-baseline gap-2">
                  <span className="font-editorial text-2xl font-semibold text-[var(--accent-coral)]">
                    {data.news.filter(n => n.importance === 'high').length}
                  </span>
                  <span className="text-[var(--warm-gray)] text-sm">件の重要ニュース</span>
                </div>
              </div>

              <NewsList news={data.news} />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 rounded-full bg-[var(--border-light)] flex items-center justify-center mb-4">
                <Activity className="w-8 h-8 text-[var(--warm-gray)]" aria-hidden="true" />
              </div>
              <h2 className="text-xl font-bold text-[var(--ink)] mb-2">ニュースがありません</h2>
              <p className="text-[var(--warm-gray)]">新しいニュースが収集されるまでお待ちください</p>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-[var(--border)] mt-16">
          <div className="max-w-6xl mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-[var(--warm-gray)] text-sm">
              <p>Powered by Claude Agent SDK</p>
              <p className="font-editorial">AI Pulse — Daily Intelligence</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
