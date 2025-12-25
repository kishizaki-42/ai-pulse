import { Rocket, Zap, Layers, type LucideIcon } from 'lucide-react';

export type ArticleCategory = 'Model' | 'Service' | 'Other';
export type CategoryFilter = 'All' | ArticleCategory;
export type Importance = 'high' | 'normal';

export interface CategoryConfig {
  label: string;
  labelJa: string;
  icon: LucideIcon;
  cssClass: string;
  textColor: string;
  borderColor: string;
}

export const categoryConfig: Record<ArticleCategory, CategoryConfig> = {
  Model: {
    label: 'MODEL',
    labelJa: 'モデル',
    icon: Rocket,
    cssClass: 'category-model',
    textColor: 'text-white',
    borderColor: 'border-[#E85D4C]',
  },
  Service: {
    label: 'SERVICE',
    labelJa: 'サービス',
    icon: Zap,
    cssClass: 'category-service',
    textColor: 'text-white',
    borderColor: 'border-[#C4A052]',
  },
  Other: {
    label: 'OTHER',
    labelJa: 'その他',
    icon: Layers,
    cssClass: 'category-other',
    textColor: 'text-white',
    borderColor: 'border-[#6B6560]',
  },
};

export const categoryFilters: { key: CategoryFilter; label: string; icon: LucideIcon }[] = [
  { key: 'All', label: 'すべて', icon: Layers },
  { key: 'Model', label: 'モデル', icon: Rocket },
  { key: 'Service', label: 'サービス', icon: Zap },
  { key: 'Other', label: 'その他', icon: Layers },
];
