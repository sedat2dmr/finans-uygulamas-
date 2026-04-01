import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import type { Transaction } from '../types';
import { CATEGORY_COLORS } from '../types';

interface ChartsSectionProps {
  transactions: Transaction[];
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('tr-TR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

interface ChartDataItem {
  name: string;
  value: number;
  color: string;
}

function buildChartData(transactions: Transaction[], type: 'income' | 'expense'): ChartDataItem[] {
  const map: Record<string, number> = {};
  for (const tx of transactions) {
    if (tx.type !== type) continue;
    map[tx.category] = (map[tx.category] ?? 0) + tx.amount;
  }
  return Object.entries(map).map(([name, value]) => ({
    name,
    value,
    color: CATEGORY_COLORS[name] ?? '#64748B',
  }));
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: ChartDataItem }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div
      className="px-3 py-2 rounded-lg text-sm"
      style={{
        backgroundColor: '#1F2937',
        border: '1px solid #374151',
        color: '#F8FAFC',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <p className="font-semibold">{item.name}</p>
      <p style={{ color: item.payload.color, fontFamily: "'JetBrains Mono', monospace" }}>
        ₺{formatCurrency(item.value)}
      </p>
    </div>
  );
}

interface PieCardProps {
  title: string;
  data: ChartDataItem[];
  total: number;
  emptyColor: string;
  centerLabel: string;
}

function PieCard({ title, data, total, emptyColor, centerLabel }: PieCardProps) {
  const isEmpty = data.length === 0;

  return (
    <div
      className="rounded-2xl p-5 flex flex-col"
      style={{
        backgroundColor: '#111827',
        border: '1px solid #1E293B',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      }}
    >
      <h3
        className="text-sm font-semibold mb-4"
        style={{ color: '#F8FAFC', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        {title}
      </h3>

      {isEmpty ? (
        <div className="flex-1 flex flex-col items-center justify-center py-10 gap-2">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
            style={{ backgroundColor: emptyColor + '20' }}
          >
            📊
          </div>
          <p className="text-sm" style={{ color: '#64748B' }}>
            Bu ay veri yok
          </p>
        </div>
      ) : (
        <>
          <div className="relative" style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={62}
                  outerRadius={110}
                  paddingAngle={2}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
                  label={({ percent }: { percent?: number }) =>
                    (percent ?? 0) > 0.07 ? `${((percent ?? 0) * 100).toFixed(0)}%` : ''
                  }
                  labelLine={false}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label overlay */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
            >
              <span className="text-xs" style={{ color: '#94A3B8' }}>
                {centerLabel}
              </span>
              <span
                className="text-base font-bold"
                style={{ color: '#F8FAFC', fontFamily: "'JetBrains Mono', monospace" }}
              >
                ₺{formatCurrency(total)}
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-3 grid grid-cols-2 gap-1.5">
            {data.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5 min-w-0">
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs truncate" style={{ color: '#94A3B8' }}>
                  {item.name}
                </span>
                <span
                  className="text-xs ml-auto flex-shrink-0"
                  style={{ color: item.color, fontFamily: "'JetBrains Mono', monospace" }}
                >
                  ₺{formatCurrency(item.value)}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function ChartsSection({ transactions }: ChartsSectionProps) {
  const expenseData = buildChartData(transactions, 'expense');
  const incomeData = buildChartData(transactions, 'income');

  const totalExpense = expenseData.reduce((s, d) => s + d.value, 0);
  const totalIncome = incomeData.reduce((s, d) => s + d.value, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <PieCard
        title="Gider Dağılımı"
        data={expenseData}
        total={totalExpense}
        emptyColor="#EF4444"
        centerLabel="Toplam Gider"
      />
      <PieCard
        title="Gelir Dağılımı"
        data={incomeData}
        total={totalIncome}
        emptyColor="#10B981"
        centerLabel="Toplam Gelir"
      />
    </div>
  );
}
