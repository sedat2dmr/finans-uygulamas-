import { TrendingUp, TrendingDown, Wallet, CreditCard, PiggyBank } from 'lucide-react'

interface SummaryCardsProps {
  totalIncome: number
  totalExpense: number
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export default function SummaryCards({ totalIncome, totalExpense }: SummaryCardsProps) {
  const net = totalIncome - totalExpense
  const isNetPositive = net >= 0

  const cards = [
    {
      id: 'income',
      label: 'Toplam Gelir',
      amount: totalIncome,
      icon: <Wallet className="w-6 h-6" />,
      trend: <TrendingUp className="w-4 h-4" />,
      color: '#10B981',
      borderColor: 'border-green-500/20',
      bgColor: 'bg-green-500/10',
      hoverBg: 'hover:bg-green-500/15',
      iconBg: 'bg-green-500/20',
      textColor: 'text-green-500',
    },
    {
      id: 'expense',
      label: 'Toplam Gider',
      amount: totalExpense,
      icon: <CreditCard className="w-6 h-6" />,
      trend: <TrendingDown className="w-4 h-4" />,
      color: '#EF4444',
      borderColor: 'border-red-500/20',
      bgColor: 'bg-red-500/10',
      hoverBg: 'hover:bg-red-500/15',
      iconBg: 'bg-red-500/20',
      textColor: 'text-red-500',
    },
    {
      id: 'net',
      label: 'Net Bakiye',
      amount: net,
      icon: <PiggyBank className="w-6 h-6" />,
      trend: isNetPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />,
      color: isNetPositive ? '#F59E0B' : '#EF4444',
      borderColor: isNetPositive ? 'border-amber-500/20' : 'border-red-500/20',
      bgColor: isNetPositive ? 'bg-amber-500/10' : 'bg-red-500/10',
      hoverBg: isNetPositive ? 'hover:bg-amber-500/15' : 'hover:bg-red-500/15',
      iconBg: isNetPositive ? 'bg-amber-500/20' : 'bg-red-500/20',
      textColor: isNetPositive ? 'text-amber-500' : 'text-red-500',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card, index) => (
        <div
          key={card.id}
          className={`relative overflow-hidden rounded-xl border ${card.borderColor} ${card.bgColor} transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-xl ${card.hoverBg} group cursor-default`}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {/* Radial glow on hover */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: `radial-gradient(circle at top right, ${card.color}20, transparent 70%)` }}
          />
          <div className="relative p-6">
            <div className="flex items-start justify-between mb-4">
              <div className={`${card.iconBg} ${card.textColor} p-3 rounded-lg transition-transform duration-300 group-hover:scale-110`}>
                {card.icon}
              </div>
              <div className={`${card.textColor} opacity-60`}>{card.trend}</div>
            </div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">{card.label}</h3>
            <p className="text-2xl font-bold" style={{ color: card.color, fontFamily: "'JetBrains Mono', monospace" }}>
              {formatCurrency(card.amount)}
            </p>
            <div
              className="mt-4 h-0.5 rounded-full transition-all duration-500 w-0 group-hover:w-full"
              style={{ backgroundColor: card.color }}
            />
          </div>
          <div
            className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full opacity-10 transition-transform duration-300 group-hover:scale-150"
            style={{ backgroundColor: card.color }}
          />
        </div>
      ))}
    </div>
  )
}
