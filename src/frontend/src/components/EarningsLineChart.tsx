import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface EarningsLineChartProps {
  data: number[];
}

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function EarningsLineChart({ data }: EarningsLineChartProps) {
  const now = new Date();
  const currentMonth = now.getMonth();

  const chartData = data.map((value, index) => {
    const monthIndex = (currentMonth - (data.length - 1 - index) + 12) % 12;
    return {
      month: MONTH_LABELS[monthIndex],
      earnings: value,
    };
  });

  return (
    <div className="bg-card rounded-xl border border-border shadow-card p-4">
      <h3 className="font-serif font-semibold text-sm text-foreground mb-4">Earnings Over 12 Months</h3>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.015 80)" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 10, fill: 'oklch(0.52 0.02 70)' }}
            axisLine={false}
            tickLine={false}
            interval={1}
          />
          <YAxis
            tick={{ fontSize: 10, fill: 'oklch(0.52 0.02 70)' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${v}`}
          />
          <Tooltip
            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Earnings']}
            contentStyle={{
              background: 'oklch(0.99 0.005 80)',
              border: '1px solid oklch(0.88 0.015 80)',
              borderRadius: '8px',
              fontSize: '12px',
            }}
          />
          <Line
            type="monotone"
            dataKey="earnings"
            stroke="oklch(0.48 0.09 155)"
            strokeWidth={2}
            dot={{ fill: 'oklch(0.48 0.09 155)', r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
