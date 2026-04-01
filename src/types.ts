export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  currency: string;
  category: string;
  description: string;
  date: string;       // ISO 8601 date string (YYYY-MM-DD)
  createdAt: string;  // ISO 8601 full timestamp
}

export const INCOME_CATEGORIES = ['Maaş', 'Freelance', 'Yatırım', 'Diğer'] as const;

export const EXPENSE_CATEGORIES = [
  'Kira', 'Market', 'Ulaşım', 'Faturalar',
  'Eğlence', 'Sağlık', 'Giyim', 'Eğitim', 'Diğer',
] as const;

export const CATEGORY_COLORS: Record<string, string> = {
  Kira:       '#6366F1',
  Market:     '#8B5CF6',
  Ulaşım:     '#EC4899',
  Faturalar:  '#F97316',
  Eğlence:    '#14B8A6',
  Sağlık:     '#EF4444',
  Giyim:      '#F59E0B',
  Eğitim:     '#3B82F6',
  Maaş:       '#10B981',
  Freelance:  '#06B6D4',
  Yatırım:    '#A855F7',
  Diğer:      '#64748B',
};
