import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ShieldCheck,
  Users,
  BookOpen,
  DollarSign,
  BarChart3,
  GraduationCap,
  TrendingUp,
} from 'lucide-react';
import { useGetAdminPanel, useIsCallerAdmin } from '../hooks/useQueries';
import TeacherManagementTable from '../components/TeacherManagementTable';
import CommissionRateEditor from '../components/CommissionRateEditor';
import DisputesList from '../components/DisputesList';
import AccessDeniedScreen from '../components/AccessDeniedScreen';
import UserRegistryTab from '../components/UserRegistryTab';
import StudentPerformanceTab from '../components/StudentPerformanceTab';
import WeeklyAnalyticsTab from '../components/WeeklyAnalyticsTab';

interface AdminPanelPageProps {
  onNavigate: (path: string) => void;
}

export default function AdminPanelPage({ onNavigate }: AdminPanelPageProps) {
  const { data: isAdmin, isLoading: adminCheckLoading } = useIsCallerAdmin();
  const { data: adminPanel, isLoading } = useGetAdminPanel();
  const [activeTab, setActiveTab] = useState('overview');

  if (adminCheckLoading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 rounded-xl" />
      </div>
    );
  }

  if (!isAdmin) {
    return <AccessDeniedScreen onBack={() => onNavigate('/')} />;
  }

  const summaryCards = [
    {
      label: 'Total Teachers',
      value: String(adminPanel?.teachers.length ?? 0),
      icon: <Users className="w-4 h-4" />,
      color: 'bg-primary/10 text-primary',
    },
    {
      label: 'Commission Rate',
      value: adminPanel ? `${(adminPanel.commissionRate * 100).toFixed(0)}%` : '—',
      icon: <DollarSign className="w-4 h-4" />,
      color: 'bg-chart-3/20 text-chart-3',
    },
    {
      label: 'Open Disputes',
      value: String(adminPanel?.disputes.filter((d) => d.status === 'open').length ?? 0),
      icon: <BookOpen className="w-4 h-4" />,
      color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
    },
  ];

  return (
    <div className="p-4 space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <ShieldCheck className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h2 className="font-serif text-xl font-semibold text-foreground">Admin Panel</h2>
          <p className="text-xs text-muted-foreground">Platform management</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full h-auto flex flex-wrap gap-0.5 bg-muted/60 p-1 rounded-xl">
          <TabsTrigger value="overview" className="flex-1 text-xs py-1.5 gap-1 min-w-[70px]">
            <ShieldCheck className="w-3 h-3" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="users" className="flex-1 text-xs py-1.5 gap-1 min-w-[60px]">
            <Users className="w-3 h-3" />
            Users
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex-1 text-xs py-1.5 gap-1 min-w-[80px]">
            <GraduationCap className="w-3 h-3" />
            Students
          </TabsTrigger>
          <TabsTrigger value="weekly" className="flex-1 text-xs py-1.5 gap-1 min-w-[70px]">
            <TrendingUp className="w-3 h-3" />
            Weekly
          </TabsTrigger>
        </TabsList>

        {/* ── Overview Tab ─────────────────────────────────────── */}
        <TabsContent value="overview" className="space-y-5 mt-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-3">
            {summaryCards.map((card) => (
              <Card key={card.label} className="shadow-card">
                <CardContent className="p-3">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center mb-2 ${card.color}`}
                  >
                    {card.icon}
                  </div>
                  {isLoading ? (
                    <Skeleton className="h-5 w-10 mb-1" />
                  ) : (
                    <p className="text-base font-bold text-foreground">{card.value}</p>
                  )}
                  <p className="text-[10px] text-muted-foreground leading-tight">{card.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Commission Rate Editor */}
          {isLoading ? (
            <Skeleton className="h-24 rounded-xl" />
          ) : (
            <CommissionRateEditor currentRate={adminPanel?.commissionRate ?? 0.1} />
          )}

          {/* Teacher Management */}
          {isLoading ? (
            <Skeleton className="h-48 rounded-xl" />
          ) : (
            <TeacherManagementTable teachers={adminPanel?.teachers ?? []} />
          )}

          {/* Disputes */}
          {isLoading ? (
            <Skeleton className="h-32 rounded-xl" />
          ) : (
            <DisputesList disputes={adminPanel?.disputes ?? []} />
          )}
        </TabsContent>

        {/* ── Users Tab ─────────────────────────────────────────── */}
        <TabsContent value="users">
          <UserRegistryTab />
        </TabsContent>

        {/* ── Student Performance Tab ───────────────────────────── */}
        <TabsContent value="performance">
          <StudentPerformanceTab />
        </TabsContent>

        {/* ── Weekly Analytics Tab ──────────────────────────────── */}
        <TabsContent value="weekly">
          <WeeklyAnalyticsTab />
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-muted-foreground">
        <p>
          © {new Date().getFullYear()} Built with{' '}
          <span className="text-red-400">♥</span> using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || 'pristine-learning')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
