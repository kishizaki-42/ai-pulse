import type { ArticleCategory, Importance } from '../constants/categories';

export interface NewsArticle {
  id: string;              // YYYYMMDD-NNN
  title: string;
  url: string;
  sourceName: string;
  category: ArticleCategory;
  publishedAt: string;     // ISO 8601
  summary: string;         // 100 文字程度
  importance: Importance;
}

export interface NewsData {
  lastUpdated: string;  // ISO 8601
  news: NewsArticle[];
}

export interface WhitelistEntry {
  url: string;
  sourceName: string;
}

export interface Whitelist {
  sources: WhitelistEntry[];
}
