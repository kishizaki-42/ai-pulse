import { useState, useMemo, useCallback } from 'react';
import type { NewsArticle } from '../types/news';
import { categoryFilters, type CategoryFilter } from '../constants/categories';
import { NewsCard } from './NewsCard';
import { NewsModal } from './NewsModal';

interface NewsListProps {
  news: NewsArticle[];
}

export function NewsList({ news }: NewsListProps) {
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('All');

  // Memoized filtered news
  const filteredNews = useMemo(() => {
    if (activeCategory === 'All') return news;
    return news.filter((article) => article.category === activeCategory);
  }, [news, activeCategory]);

  // Memoized sorted news
  const sortedNews = useMemo(() => {
    return [...filteredNews].sort((a, b) => {
      if (a.importance === 'high' && b.importance !== 'high') return -1;
      if (a.importance !== 'high' && b.importance === 'high') return 1;
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
  }, [filteredNews]);

  const handleCloseModal = useCallback(() => {
    setSelectedArticle(null);
  }, []);

  return (
    <>
      {/* Category Filter */}
      <div className="flex flex-wrap gap-3 mb-10" role="group" aria-label="カテゴリフィルター">
        {categoryFilters.map(({ key, label, icon: Icon }) => {
          const isActive = activeCategory === key;
          const count = key === 'All'
            ? news.length
            : news.filter(a => a.category === key).length;

          return (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              aria-pressed={isActive}
              className={`
                inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium
                border transition-all duration-200 focus-ring
                ${isActive
                  ? 'bg-[var(--ink)] text-white border-[var(--ink)]'
                  : 'bg-transparent text-[var(--warm-gray)] border-[var(--border)] hover:text-[var(--ink)] hover:border-[var(--ink)]'
                }
              `}
            >
              <Icon className="w-4 h-4" aria-hidden="true" />
              {label}
              <span
                className={`
                  ml-1 px-2 py-0.5 rounded-full text-[10px] font-bold
                  ${isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-[var(--border-light)] text-[var(--warm-gray)]'
                  }
                `}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* News Grid */}
      {sortedNews.length > 0 ? (
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          role="feed"
          aria-label="ニュース一覧"
        >
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
          <p className="text-[var(--warm-gray)] text-lg">ニュースが見つかりません</p>
          <button
            onClick={() => setActiveCategory('All')}
            className="mt-4 text-[var(--accent-coral)] text-sm font-medium hover:underline focus-ring"
          >
            フィルターをリセット
          </button>
        </div>
      )}

      {/* Modal */}
      {selectedArticle && (
        <NewsModal
          article={selectedArticle}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}
