import { useState, useMemo } from 'react'
import './index.css'
import Header from './components/Header'
import SummaryCards from './components/SummaryCards'
import ChartsSection from './components/ChartsSection'
import AddTransactionForm from './components/AddTransactionForm'
import TransactionList from './components/TransactionList'
import { useTransactions } from './hooks/useTransactions'

export default function App() {
  const { transactions, addTransaction, deleteTransaction } = useTransactions()

  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())

  function handlePrev() {
    if (month === 0) { setMonth(11); setYear((y) => y - 1) }
    else setMonth((m) => m - 1)
  }

  function handleNext() {
    if (month === 11) { setMonth(0); setYear((y) => y + 1) }
    else setMonth((m) => m + 1)
  }

  const filtered = useMemo(
    () => transactions.filter((tx) => {
      const d = new Date(tx.date + 'T00:00:00')
      return d.getFullYear() === year && d.getMonth() === month
    }),
    [transactions, year, month]
  )

  const totalIncome = useMemo(
    () => filtered.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0),
    [filtered]
  )
  const totalExpense = useMemo(
    () => filtered.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
    [filtered]
  )

  return (
    <div className="dark min-h-screen bg-background">
      <Header year={year} month={month} onPrev={handlePrev} onNext={handleNext} />
      <main className="max-w-5xl mx-auto px-4 py-6 flex flex-col gap-6">
        <SummaryCards totalIncome={totalIncome} totalExpense={totalExpense} />
        <ChartsSection transactions={filtered} />
        <AddTransactionForm onAdd={addTransaction} />
        <TransactionList transactions={filtered} onDelete={deleteTransaction} />
      </main>
    </div>
  )
}
