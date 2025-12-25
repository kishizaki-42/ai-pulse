import { memo, useCallback, type KeyboardEvent } from 'react';
import { ExternalLink, Sparkles } from 'lucide-react';
import type { NewsArticle } from '../types/news';
import { categoryConfig } from '../constants/categories';
import { formatDate } from '../utils/formatDate';

interface NewsCardProps {
  article: NewsArticle;
  onClick: () => void;
  index: number;
}

export const NewsCard = memo(function NewsCard({ article, onClick, index }: NewsCardProps) {
  const config = categoryConfig[article.category];
  const Icon = config.icon;
  const isHighImportance = article.importance === 'high';

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick();
      }
    },
    [onClick]
  );

  return (
    <article
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="article"
      aria-label={`${article.title} - ${config.labelJa}`}
      style={{ '--delay': `${index * 50}ms` } as React.CSSProperties}
      className={`
        group relative cursor-pointer
        bg-[var(--paper)] rounded-xl overflow-hidden
        card-shadow focus-ring
        transition-all duration-300 ease-out
        hover:-translate-y-1
        animate-fade-in-up [animation-delay:var(--delay)]
        ${isHighImportance
          ? 'ring-2 ring-[var(--accent-coral)]/30'
          : ''
        }
      `}
    >
      {/* High importance indicator */}
      {isHighImportance && (
        <div
          className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--accent-coral)] via-[var(--accent-gold)] to-[var(--accent-coral)]"
          aria-hidden="true"
        />
      )}

      <div className="p-6">
        {/* Header row */}
        <div className="flex items-center justify-between mb-4">
          <div
            className={`
              inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
              text-[10px] font-bold uppercase tracking-widest
              ${config.cssClass} ${config.textColor}
            `}
          >
            <Icon className="w-3 h-3" aria-hidden="true" />
            {config.label}
          </div>

          <div className="flex items-center gap-3">
            {isHighImportance && (
              <span className="flex items-center gap-1 text-[var(--accent-coral)] text-[10px] font-semibold uppercase tracking-wider">
                <Sparkles className="w-3 h-3" aria-hidden="true" />
                重要
              </span>
            )}
            <time
              dateTime={article.publishedAt}
              className="text-[var(--warm-gray)] text-xs"
            >
              {formatDate(article.publishedAt, 'short')}
            </time>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-editorial text-xl font-semibold text-[var(--ink)] leading-snug mb-3 group-hover:text-[var(--accent-coral)] transition-colors line-clamp-2">
          {article.title}
        </h3>

        {/* Summary */}
        <p className="text-[var(--warm-gray)] text-sm leading-relaxed mb-4 line-clamp-2">
          {article.summary}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
          <span className="text-[var(--warm-gray)] text-xs font-medium">
            {article.sourceName}
          </span>
          <span className="flex items-center gap-1 text-[var(--accent-coral)] text-xs font-medium group-hover:gap-1.5 transition-all">
            詳細
            <ExternalLink
              className="w-3 h-3 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
              aria-hidden="true"
            />
          </span>
        </div>
      </div>
    </article>
  );
});
