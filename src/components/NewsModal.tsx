import { useEffect } from 'react';
import { X, ExternalLink, Rocket, Zap, Layers, Calendar, Globe2, Sparkles } from 'lucide-react';
import type { NewsArticle } from '../types/news';

const categoryConfig = {
  Model: {
    label: 'MODEL',
    icon: Rocket,
    gradient: 'from-rose-500 to-pink-600',
    bg: 'bg-rose-500/10',
    text: 'text-rose-400',
  },
  Service: {
    label: 'SERVICE',
    icon: Zap,
    gradient: 'from-amber-500 to-orange-600',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
  },
  Other: {
    label: 'OTHER',
    icon: Layers,
    gradient: 'from-zinc-400 to-zinc-600',
    bg: 'bg-zinc-500/10',
    text: 'text-zinc-400',
  },
};

interface NewsModalProps {
  article: NewsArticle;
  onClose: () => void;
}

export function NewsModal({ article, onClose }: NewsModalProps) {
  const config = categoryConfig[article.category];
  const Icon = config.icon;
  const isHighImportance = article.importance === 'high';

  const formattedDate = new Date(article.publishedAt).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-fade-in" />

      {/* Modal */}
      <div
        className="relative w-full max-w-2xl max-h-[85vh] bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gradient accent bar */}
        <div className={`h-1 bg-gradient-to-r ${config.gradient}`} />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable content */}
        <div className="overflow-y-auto max-h-[calc(85vh-4px)] custom-scrollbar">
          {/* Header */}
          <div className="p-6 md:p-8 pb-4">
            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className={`
                inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest
                ${config.bg} ${config.text}
              `}>
                <Icon className="w-3.5 h-3.5" />
                {config.label}
              </div>

              {isHighImportance && (
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold">
                  <Sparkles className="w-3 h-3" />
                  重要ニュース
                </span>
              )}

              <span className="flex items-center gap-1.5 text-zinc-500 text-sm">
                <Calendar className="w-3.5 h-3.5" />
                {formattedDate}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-4">
              {article.title}
            </h2>

            {/* Summary */}
            <p className="text-lg text-zinc-300 leading-relaxed">
              {article.summary}
            </p>
          </div>

          {/* Divider */}
          <div className="mx-6 md:mx-8 border-t border-zinc-800" />

          {/* Source section */}
          <div className="p-6 md:p-8 pt-6">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">
              <Globe2 className="w-4 h-4" />
              ソース
            </h3>

            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-4 py-3 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 hover:border-zinc-600 rounded-xl text-zinc-200 hover:text-white transition-all group"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center">
                <Globe2 className="w-5 h-5 text-zinc-400" />
              </div>
              <div className="flex-grow min-w-0">
                <div className="font-medium truncate">{article.sourceName}</div>
                <div className="text-xs text-zinc-500 truncate">{article.url}</div>
              </div>
              <ExternalLink className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors flex-shrink-0" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
