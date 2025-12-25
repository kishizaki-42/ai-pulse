import { ExternalLink, Rocket, Zap, Layers, Sparkles } from 'lucide-react';
import type { NewsArticle } from '../types/news';

const categoryConfig = {
  Model: {
    label: 'MODEL',
    icon: Rocket,
    bg: 'bg-rose-500/10',
    text: 'text-rose-400',
    border: 'border-rose-500/30',
    glow: 'shadow-rose-500/20'
  },
  Service: {
    label: 'SERVICE',
    icon: Zap,
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    glow: 'shadow-amber-500/20'
  },
  Other: {
    label: 'OTHER',
    icon: Layers,
    bg: 'bg-zinc-500/10',
    text: 'text-zinc-400',
    border: 'border-zinc-500/30',
    glow: 'shadow-zinc-500/20'
  },
};

interface NewsCardProps {
  article: NewsArticle;
  onClick: () => void;
  index: number;
}

export function NewsCard({ article, onClick, index }: NewsCardProps) {
  const config = categoryConfig[article.category];
  const Icon = config.icon;
  const isHighImportance = article.importance === 'high';

  const formattedDate = new Date(article.publishedAt).toLocaleDateString('ja-JP', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <article
      onClick={onClick}
      style={{ animationDelay: `${index * 50}ms` }}
      className={`
        group relative cursor-pointer
        bg-zinc-900/50 backdrop-blur-sm
        border rounded-lg overflow-hidden
        transition-all duration-300 ease-out
        hover:scale-[1.02] hover:bg-zinc-800/60
        animate-fade-in-up
        ${isHighImportance
          ? 'border-amber-500/50 shadow-lg shadow-amber-500/10'
          : 'border-zinc-800 hover:border-zinc-700'
        }
      `}
    >
      {/* High importance indicator */}
      {isHighImportance && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500" />
      )}

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-center justify-between mb-4">
          <div className={`
            inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest
            ${config.bg} ${config.text} ${config.border} border
          `}>
            <Icon className="w-3 h-3" />
            {config.label}
          </div>

          <div className="flex items-center gap-2">
            {isHighImportance && (
              <span className="flex items-center gap-1 text-amber-400 text-[10px] font-semibold uppercase tracking-wider">
                <Sparkles className="w-3 h-3" />
                重要
              </span>
            )}
            <time className="text-zinc-500 text-xs font-mono">{formattedDate}</time>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-zinc-100 leading-tight mb-3 group-hover:text-white transition-colors line-clamp-2">
          {article.title}
        </h3>

        {/* Summary */}
        <p className="text-zinc-400 text-sm leading-relaxed mb-4 line-clamp-2">
          {article.summary}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-zinc-800/50">
          <span className="text-zinc-500 text-xs font-medium">
            {article.sourceName}
          </span>
          <span className="flex items-center gap-1 text-zinc-400 text-xs font-medium group-hover:text-white transition-colors">
            詳細
            <ExternalLink className="w-3 h-3 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </article>
  );
}
