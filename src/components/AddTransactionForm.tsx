import { useState, useEffect } from 'react'
import { Calendar, TrendingUp, TrendingDown, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import type { Transaction } from '@/types'
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '@/types'

interface AddTransactionFormProps {
  onAdd: (data: Omit<Transaction, 'id' | 'createdAt' | 'currency'>) => void
}

const today = () => new Date().toISOString().slice(0, 10)

export default function AddTransactionForm({ onAdd }: AddTransactionFormProps) {
  const [type, setType] = useState<'income' | 'expense'>('expense')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(today())
  const [error, setError] = useState('')

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  useEffect(() => {
    setCategory(categories[0])
  }, [type])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const parsed = parseFloat(amount.replace(',', '.'))
    if (!parsed || parsed <= 0) { setError('Geçerli bir tutar giriniz.'); return }
    if (!category) { setError('Kategori seçiniz.'); return }
    if (!description.trim()) { setError('Açıklama giriniz.'); return }
    setError('')
    onAdd({ type, amount: parsed, category, description: description.trim(), date })
    setAmount('')
    setDescription('')
    setDate(today())
  }

  return (
    <div className="w-full">
      <div className="bg-card rounded-xl border border-border/50 shadow-lg overflow-hidden">
        <div className="p-6 space-y-5">
          <div className="flex items-center gap-2 mb-1">
            <Plus className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Yeni İşlem Ekle
            </h3>
          </div>

          {/* Type Toggle */}
          <div className="flex gap-2 p-1 bg-muted rounded-lg">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-sm font-medium transition-all',
                type === 'expense'
                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <TrendingDown className="w-4 h-4" /> Gider
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-sm font-medium transition-all',
                type === 'income'
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <TrendingUp className="w-4 h-4" /> Gelir
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount">Tutar (₺)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">₺</span>
                  <Input
                    id="amount"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-8 bg-background"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  />
                </div>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Kategori</Label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm text-foreground shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 pr-8"
                >
                  {categories.map((c) => (
                    <option key={c} value={c} className="bg-card">{c}</option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="description">Açıklama</Label>
                <Input
                  id="description"
                  type="text"
                  placeholder="İşlem açıklaması..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-background"
                />
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label htmlFor="date">Tarih</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="pl-9 bg-background"
                    style={{ colorScheme: 'dark' }}
                  />
                </div>
              </div>
            </div>

            {error && (
              <p className="text-xs px-3 py-2 rounded-lg text-red-400 bg-red-500/10 border border-red-500/20">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className={cn(
                'w-full h-11 text-base font-semibold shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]',
                type === 'income'
                  ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
                  : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white'
              )}
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {type === 'income' ? 'Gelir Ekle' : 'Gider Ekle'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
