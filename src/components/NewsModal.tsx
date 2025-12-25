import { useEffect, useRef, useCallback } from 'react';
import { X, ExternalLink, Calendar, Globe2, Sparkles } from 'lucide-react';
import type { NewsArticle } from '../types/news';
import { categoryConfig } from '../constants/categories';
import { formatDate } from '../utils/formatDate';

interface NewsModalProps {
  article: NewsArticle;
  onClose: () => void;
}

export function NewsModal({ article, onClose }: NewsModalProps) {
  const config = categoryConfig[article.category];
  const Icon = config.icon;
  const isHighImportance = article.importance === 'high';

  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousActiveElement = useRef<Element | null>(null);

  // Focus trap and keyboard handling
  useEffect(() => {
    // Store previously focused element
    previousActiveElement.current = document.activeElement;

    // Focus close button on mount
    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      // Focus trap
      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
      // Restore focus to previously focused element
      if (previousActiveElement.current instanceof HTMLElement) {
        previousActiveElement.current.focus();
      }
    };
  }, [onClose]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[var(--ink)]/60 backdrop-blur-sm animate-fade-in"
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative w-full max-w-2xl max-h-[85vh] bg-[var(--paper)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Accent bar */}
        <div
          className={`h-1 ${config.cssClass}`}
          aria-hidden="true"
        />

        {/* Close button */}
        <button
          ref={closeButtonRef}
          onClick={onClose}
          aria-label="閉じる"
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-[var(--border-light)] hover:bg-[var(--border)] text-[var(--warm-gray)] hover:text-[var(--ink)] transition-all focus-ring"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        {/* Scrollable content */}
        <div className="overflow-y-auto max-h-[calc(85vh-4px)] custom-scrollbar">
          {/* Header */}
          <div className="p-6 md:p-8 pb-4">
            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div
                className={`
                  inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                  text-xs font-bold uppercase tracking-widest
                  ${config.cssClass} ${config.textColor}
                `}
              >
                <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                {config.label}
              </div>

              {isHighImportance && (
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--accent-coral)]/10 text-[var(--accent-coral)] text-xs font-semibold">
                  <Sparkles className="w-3 h-3" aria-hidden="true" />
                  重要ニュース
                </span>
              )}

              <span className="flex items-center gap-1.5 text-[var(--warm-gray)] text-sm">
                <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                <time dateTime={article.publishedAt}>
                  {formatDate(article.publishedAt, 'long')}
                </time>
              </span>
            </div>

            {/* Title */}
            <h2
              id="modal-title"
              className="font-editorial text-2xl md:text-3xl font-bold text-[var(--ink)] leading-tight mb-4"
            >
              {article.title}
            </h2>

            {/* Summary */}
            <p className="text-lg text-[var(--warm-gray)] leading-relaxed">
              {article.summary}
            </p>
          </div>

          {/* Divider */}
          <div className="mx-6 md:mx-8 border-t border-[var(--border)]" aria-hidden="true" />

          {/* Source section */}
          <div className="p-6 md:p-8 pt-6">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-[var(--warm-gray)] uppercase tracking-wider mb-4">
              <Globe2 className="w-4 h-4" aria-hidden="true" />
              ソース
            </h3>

            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-4 py-3 bg-[var(--cream)] hover:bg-[var(--border-light)] border border-[var(--border)] hover:border-[var(--warm-gray)] rounded-xl text-[var(--ink)] transition-all group focus-ring"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[var(--border-light)] flex items-center justify-center">
                <Globe2 className="w-5 h-5 text-[var(--warm-gray)]" aria-hidden="true" />
              </div>
              <div className="flex-grow min-w-0">
                <div className="font-medium truncate">{article.sourceName}</div>
                <div className="text-xs text-[var(--warm-gray)] truncate">{article.url}</div>
              </div>
              <ExternalLink
                className="w-4 h-4 text-[var(--warm-gray)] group-hover:text-[var(--accent-coral)] transition-colors flex-shrink-0"
                aria-hidden="true"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
