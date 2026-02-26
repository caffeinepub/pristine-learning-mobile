import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart3, Users, Star, TrendingUp, BookOpen } from 'lucide-react';
import { useGetAnalytics } from '../hooks/useQueries';
import EarningsLineChart from '../components/EarningsLineChart';
import TopSubjectsChart from '../components/TopSubjectsChart';

export default function AnalyticsPage() {
  const { data: analytics, isLoading } = useGetAnalytics();

  const kpiCards = [
    {
      label: 'Total Sessions',
      value: analytics ? String(Number(analytics.totalSessions)) : '—',
      icon: <BookOpen className="w-4 h-4" />,
      color: 'bg-primary/10 text-primary',
    },
    {
      label: 'Retention Rate',
      value: analytics ? `${(analytics.retentionRate * 100).toFixed(0)}%` : '—',
      icon: <Users className="w-4 h-4" />,
      color: 'bg-chart-2/20 text-chart-2',
    },
    {
      label: 'Avg. Rating',
      value: analytics ? analytics.averageRating.toFixed(1) : '—',
      icon: <Star className="w-4 h-4" />,
      color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
    },
    {
      label: 'Growth',
      value: analytics ? `${analytics.growthPercentage >= 0 ? '+' : ''}${analytics.growthPercentage.toFixed(0)}%` : '—',
      icon: <TrendingUp className="w-4 h-4" />,
      color: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
    },
  ];

  return (
    <div className="p-4 space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <BarChart3 className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h2 className="font-serif text-xl font-semibold text-foreground">Analytics</h2>
          <p className="text-xs text-muted-foreground">Track your teaching performance</p>
        </div>
      </div>

      {/* Hero Background */}
      <div className="relative rounded-2xl overflow-hidden h-24">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/assets/generated/dashboard-hero-bg.dim_1200x400.png)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/70 to-primary/30" />
        <div className="relative p-4 text-primary-foreground h-full flex flex-col justify-center">
          <p className="font-serif text-base font-semibold">Performance Overview</p>
          <p className="text-xs opacity-80">Your teaching metrics at a glance</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3">
        {kpiCards.map((card) => (
          <Card key={card.label} className="shadow-card">
            <CardContent className="p-4">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${card.color}`}>
                {card.icon}
              </div>
              {isLoading ? (
                <Skeleton className="h-6 w-16 mb-1" />
              ) : (
                <p className="text-xl font-bold text-foreground">{card.value}</p>
              )}
              <p className="text-xs text-muted-foreground">{card.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No data state */}
      {!isLoading && !analytics && (
        <div className="bg-card rounded-xl border border-border shadow-card p-6 text-center">
          <BarChart3 className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm font-medium text-foreground mb-1">No analytics data yet</p>
          <p className="text-xs text-muted-foreground">
            Analytics will appear once you've conducted sessions and earned from them.
          </p>
        </div>
      )}

      {/* Charts */}
      {analytics && (
        <>
          {analytics.earningsPerMonth.length > 0 && (
            <EarningsLineChart data={analytics.earningsPerMonth} />
          )}
          {analytics.topSubjects.length > 0 && (
            <TopSubjectsChart subjects={analytics.topSubjects} />
          )}
        </>
      )}

      {isLoading && (
        <div className="space-y-3">
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
        </div>
      )}
    </div>
  );
}
