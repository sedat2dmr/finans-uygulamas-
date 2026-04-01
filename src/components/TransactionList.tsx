import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Trash2, ShoppingCart, Home, Car, Zap, Music, Heart,
  Shirt, BookOpen, Briefcase, Code, TrendingUp, HelpCircle, Receipt
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Transaction } from '@/types'
import { CATEGORY_COLORS } from '@/types'

interface TransactionListProps {
  transactions: Transaction[]
  onDelete: (id: string) => void
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

function formatDate(dateStr: string) {
  const months = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık']
  const d = new Date(dateStr + 'T00:00:00')
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
}

function getCategoryIcon(category: string) {
  const p = { size: 16, strokeWidth: 2 }
  switch (category) {
    case 'Kira':      return <Home {...p} />
    case 'Market':    return <ShoppingCart {...p} />
    case 'Ulaşım':    return <Car {...p} />
    case 'Faturalar': return <Zap {...p} />
    case 'Eğlence':   return <Music {...p} />
    case 'Sağlık':    return <Heart {...p} />
    case 'Giyim':     return <Shirt {...p} />
    case 'Eğitim':    return <BookOpen {...p} />
    case 'Maaş':      return <Briefcase {...p} />
    case 'Freelance': return <Code {...p} />
    case 'Yatırım':   return <TrendingUp {...p} />
    default:          return <HelpCircle {...p} />
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
  exit:    { opacity: 0, x: -80, scale: 0.95, transition: { duration: 0.2 } },
}

interface ItemProps {
  tx: Transaction
  onDelete: (id: string) => void
}

function TransactionItem({ tx, onDelete }: ItemProps) {
  const color = CATEGORY_COLORS[tx.category] ?? '#64748B'
  const isIncome = tx.type === 'income'

  return (
    <motion.div
      layout
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex items-center gap-3 rounded-lg border border-border bg-card/50 p-3.5 hover:bg-accent/30 transition-colors group"
    >
      {/* Icon */}
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
        style={{ backgroundColor: color + '20', color }}
      >
        {getCategoryIcon(tx.category)}
      </div>

      {/* Description + Category */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{tx.description}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{tx.category}</p>
      </div>

      {/* Amount + Date */}
      <div className="text-right flex-shrink-0">
        <p
          className={cn('text-sm font-bold', isIncome ? 'text-green-500' : 'text-red-500')}
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          {isIncome ? '+' : '-'}₺{formatCurrency(tx.amount)}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">{formatDate(tx.date)}</p>
      </div>

      {/* Delete */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onDelete(tx.id)}
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-transparent text-muted-foreground hover:bg-destructive hover:text-white transition-colors"
        title="Sil"
      >
        <Trash2 size={14} />
      </motion.button>
    </motion.div>
  )
}

export default function TransactionList({ transactions, onDelete }: TransactionListProps) {
  const [localIds, setLocalIds] = useState<Set<string>>(new Set())

  function handleDelete(id: string) {
    setLocalIds((prev) => new Set([...prev, id]))
    setTimeout(() => {
      onDelete(id)
      setLocalIds((prev) => { const n = new Set(prev); n.delete(id); return n })
    }, 220)
  }

  const sorted = [...transactions]
    .filter((t) => !localIds.has(t.id))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return (
    <div className="w-full rounded-xl border border-border/50 bg-card shadow-lg p-5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Receipt className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Son İşlemler
          </h3>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground border border-border">
          {transactions.length} işlem
        </span>
      </div>

      {sorted.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-14 gap-3"
        >
          <div className="rounded-2xl bg-muted p-5">
            <ShoppingCart className="w-10 h-10 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground">Bu ay henüz işlem yok</p>
          <p className="text-xs text-muted-foreground">Yukarıdaki formu kullanarak işlem ekleyebilirsiniz.</p>
        </motion.div>
      ) : (
        <div className="flex flex-col gap-2">
          <AnimatePresence mode="popLayout">
            {sorted.map((tx) => (
              <TransactionItem key={tx.id} tx={tx} onDelete={handleDelete} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
