import type { Transaction } from './types';

function makeId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

const raw = [
  { type: 'income',  amount: 25000, category: 'Maaş',      description: 'Mart 2026 maaşı',           date: '2026-03-01' },
  { type: 'income',  amount: 5000,  category: 'Freelance',  description: 'Web sitesi projesi',         date: '2026-03-10' },
  { type: 'expense', amount: 6000,  category: 'Kira',       description: 'Mart ayı kira',              date: '2026-03-01' },
  { type: 'expense', amount: 3500,  category: 'Market',     description: 'Haftalık alışveriş',         date: '2026-03-05' },
  { type: 'expense', amount: 1200,  category: 'Ulaşım',     description: 'Akbil + benzin',             date: '2026-03-03' },
  { type: 'expense', amount: 2800,  category: 'Faturalar',  description: 'Elektrik + su + internet',   date: '2026-03-07' },
  { type: 'expense', amount: 1500,  category: 'Eğlence',    description: 'Restoran + sinema',          date: '2026-03-12' },
  { type: 'expense', amount: 800,   category: 'Sağlık',     description: 'Eczane',                     date: '2026-03-15' },
  { type: 'expense', amount: 2000,  category: 'Giyim',      description: 'Bahar alışverişi',           date: '2026-03-18' },
  { type: 'expense', amount: 500,   category: 'Eğitim',     description: 'Udemy kurs',                 date: '2026-03-20' },
] as const;

export const SEED_TRANSACTIONS: Transaction[] = raw.map((t) => ({
  ...t,
  id: makeId(),
  currency: 'TRY',
  createdAt: new Date(t.date).toISOString(),
}));
