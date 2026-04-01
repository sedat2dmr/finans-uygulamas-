import { useState, useCallback } from 'react';
import type { Transaction } from '../types';
import { SEED_TRANSACTIONS } from '../seedData';

const STORAGE_KEY = 'finance_transactions';

function loadFromStorage(): Transaction[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Transaction[];
  } catch {}
  // First load — seed data
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_TRANSACTIONS));
  return SEED_TRANSACTIONS;
}

function saveToStorage(transactions: Transaction[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

function makeId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>(loadFromStorage);

  const addTransaction = useCallback(
    (data: Omit<Transaction, 'id' | 'createdAt' | 'currency'>) => {
      const newTx: Transaction = {
        ...data,
        id: makeId(),
        currency: 'TRY',
        createdAt: new Date().toISOString(),
      };
      setTransactions((prev) => {
        const next = [newTx, ...prev];
        saveToStorage(next);
        return next;
      });
    },
    []
  );

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => {
      const next = prev.filter((t) => t.id !== id);
      saveToStorage(next);
      return next;
    });
  }, []);

  return { transactions, addTransaction, deleteTransaction };
}
