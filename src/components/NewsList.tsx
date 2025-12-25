import { useState } from 'react';
import { Rocket, Zap, Layers } from 'lucide-react';
import type { NewsArticle } from '../types/news';
import { NewsCard } from './NewsCard';
import { NewsModal } from './NewsModal';

type CategoryFilter = 'All' | 'Model' | 'Service' | 'Other';

const categories: { key: CategoryFilter; label: string; icon: typeof Rocket }[] = [
  { key: 'All', label: 'すべて', icon: Layers },
  { key: 'Model', label: 'モデル', icon: Rocket },
  { key: 'Service', label: 'サービス', icon: Zap },
  { key: 'Other', label: 'その他', icon: Layers },
];

const categoryStyles: Record<CategoryFilter, string> = {
  All: 'bg-white/10 text-white border-white/20',
  Model: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  Service: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  Other: 'bg-zinc-500/20 text-zinc-300 border-zinc-500/30',
};

interface NewsListProps {
  news: NewsArticle[];
}

export function NewsList({ news }: NewsListProps) {
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('All');

  const filteredNews = activeCategory === 'All'
    ? news
    : news.filter((article) => article.category === activeCategory);

  // Sort by importance (high first) then by date
  const sortedNews = [...filteredNews].sort((a, b) => {
    if (a.importance === 'high' && b.importance !== 'high') return -1;
    if (a.importance !== 'high' && b.importance === 'high') return 1;
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });

  return (
    <>
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map(({ key, label, icon: Icon }) => {
          const isActive = activeCategory === key;
          return (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`
                inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
                border transition-all duration-200
                ${isActive
                  ? categoryStyles[key]
                  : 'bg-transparent text-zinc-500 border-zinc-800 hover:text-zinc-300 hover:border-zinc-700'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              {label}
              {isActive && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-black/20 text-[10px] font-bold">
                  {filteredNews.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* News Grid */}
      {sortedNews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {sortedNews.map((article, index) => (
            <NewsCard
              key={article.id}
              article={article}
              onClick={() => setSelectedArticle(article)}
              index={index}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-zinc-500 text-lg">ニュースが見つかりません</p>
        </div>
      )}

      {/* Modal */}
      {selectedArticle && (
        <NewsModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
        />
      )}
    </>
  );
}
