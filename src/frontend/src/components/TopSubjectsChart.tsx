import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface TopSubjectsChartProps {
  subjects: string[];
}

const COLORS = [
  'oklch(0.48 0.09 155)',
  'oklch(0.58 0.1 165)',
  'oklch(0.65 0.12 145)',
  'oklch(0.72 0.14 85)',
  'oklch(0.65 0.15 35)',
];

export default function TopSubjectsChart({ subjects }: TopSubjectsChartProps) {
  const chartData = subjects.map((subject, index) => ({
    subject: subject.length > 12 ? subject.slice(0, 12) + '…' : subject,
    sessions: Math.max(1, subjects.length - index) * 3,
  }));

  return (
    <div className="bg-card rounded-xl border border-border shadow-card p-4">
      <h3 className="font-serif font-semibold text-sm text-foreground mb-4">Top Subjects</h3>
      {chartData.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">No subject data yet</p>
      ) : (
        <ResponsiveContainer width="100%" height={160}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 0, right: 8, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.015 80)" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fontSize: 10, fill: 'oklch(0.52 0.02 70)' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="subject"
              tick={{ fontSize: 10, fill: 'oklch(0.52 0.02 70)' }}
              axisLine={false}
              tickLine={false}
              width={70}
            />
            <Tooltip
              formatter={(value: number) => [value, 'Sessions']}
              contentStyle={{
                background: 'oklch(0.99 0.005 80)',
                border: '1px solid oklch(0.88 0.015 80)',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Bar dataKey="sessions" radius={[0, 4, 4, 0]}>
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
