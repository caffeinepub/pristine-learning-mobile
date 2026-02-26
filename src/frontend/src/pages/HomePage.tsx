import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  CalendarDays,
  Wallet,
  Sparkles,
  BarChart3,
  User,
  TrendingUp,
  BookOpen,
  Clock,
} from 'lucide-react';
import { useGetWalletSummary, useListSessions, useGetCallerUserProfile } from '../hooks/useQueries';
import { SessionStatus } from '../backend';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const { data: wallet, isLoading: walletLoading } = useGetWalletSummary();
  const { data: sessions, isLoading: sessionsLoading } = useListSessions();
  const { data: userProfile } = useGetCallerUserProfile();

  const upcomingSessions =
    sessions?.filter(([, s]) => s.status === SessionStatus.scheduled).length ?? 0;

  const now = new Date();
  const greeting =
    now.getHours() < 12
      ? 'Good morning'
      : now.getHours() < 17
      ? 'Good afternoon'
      : 'Good evening';

  const quickActions = [
    {
      label: 'Sessions',
      icon: <CalendarDays className="w-5 h-5" />,
      path: '/sessions',
      color: 'bg-primary/10 text-primary',
    },
    {
      label: 'Wallet',
      icon: <Wallet className="w-5 h-5" />,
      path: '/wallet',
      color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-500',
    },
    {
      label: 'AI Tools',
      icon: <Sparkles className="w-5 h-5" />,
      path: '/ai-assistant',
      color: 'bg-chart-2/20 text-chart-2',
    },
    {
      label: 'Analytics',
      icon: <BarChart3 className="w-5 h-5" />,
      path: '/analytics',
      color: 'bg-chart-4/20 text-chart-4',
    },
    {
      label: 'Profile',
      icon: <User className="w-5 h-5" />,
      path: '/profile',
      color: 'bg-chart-5/20 text-chart-5',
    },
  ];

  return (
    <div className="p-4 space-y-5 animate-fade-in">
      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(/assets/generated/dashboard-hero-bg.dim_1200x400.png)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40" />
        <div className="relative p-5 text-primary-foreground">
          <p className="text-sm opacity-90 mb-0.5">{greeting},</p>
          <h2 className="font-serif text-xl font-semibold mb-1">
            {userProfile?.name || 'Teacher'} 👋
          </h2>
          <p className="text-xs opacity-80">Ready to inspire minds today?</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="shadow-card">
          <CardContent className="p-3 text-center">
            {sessionsLoading ? (
              <Skeleton className="h-6 w-8 mx-auto mb-1" />
            ) : (
              <p className="text-xl font-bold text-primary">{upcomingSessions}</p>
            )}
            <p className="text-[10px] text-muted-foreground leading-tight">
              Upcoming Sessions
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-3 text-center">
            {walletLoading ? (
              <Skeleton className="h-6 w-12 mx-auto mb-1" />
            ) : (
              <p className="text-xl font-bold text-primary">
                ${wallet?.availableBalance?.toFixed(0) ?? '0'}
              </p>
            )}
            <p className="text-[10px] text-muted-foreground leading-tight">
              Available Balance
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-3 text-center">
            {walletLoading ? (
              <Skeleton className="h-6 w-12 mx-auto mb-1" />
            ) : (
              <p className="text-xl font-bold text-primary">
                ${wallet?.totalEarnings?.toFixed(0) ?? '0'}
              </p>
            )}
            <p className="text-[10px] text-muted-foreground leading-tight">
              Total Earned
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="font-serif font-semibold text-sm text-foreground mb-3">
          Quick Actions
        </h3>
        <div className="grid grid-cols-5 gap-2">
          {quickActions.map((action) => (
            <button
              key={action.path}
              onClick={() => onNavigate(action.path)}
              className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-muted transition-colors"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${action.color}`}
              >
                {action.icon}
              </div>
              <span className="text-[10px] text-muted-foreground font-medium">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Sessions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-serif font-semibold text-sm text-foreground">
            Upcoming Sessions
          </h3>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={() => onNavigate('/sessions')}
          >
            View all
          </Button>
        </div>

        {sessionsLoading ? (
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-16 rounded-xl" />
            ))}
          </div>
        ) : upcomingSessions === 0 ? (
          <Card className="shadow-card">
            <CardContent className="p-5 text-center">
              <BookOpen className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No upcoming sessions</p>
              <Button
                size="sm"
                className="mt-3"
                onClick={() => onNavigate('/sessions')}
              >
                Schedule a Session
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {sessions
              ?.filter(([, s]) => s.status === SessionStatus.scheduled)
              .slice(0, 2)
              .map(([id, session]) => {
                const date = new Date(
                  Number(session.scheduledTime) / 1_000_000
                );
                return (
                  <Card key={String(id)} className="shadow-card">
                    <CardContent className="p-3 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {session.subject}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>
                            {date.toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs text-primary font-medium">
                        Grade {session.grade}
                      </span>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        )}
      </div>

      {/* Tips Card */}
      <Card className="shadow-card bg-primary/5 border-primary/20">
        <CardContent className="p-4 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground mb-0.5">
              Grow your teaching business
            </p>
            <p className="text-xs text-muted-foreground">
              Use the AI Assistant to create engaging worksheets and lesson plans
              that keep students coming back.
            </p>
            <Button
              size="sm"
              variant="link"
              className="h-auto p-0 mt-1 text-xs text-primary"
              onClick={() => onNavigate('/ai-assistant')}
            >
              Try AI Tools →
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-muted-foreground">
        <p>
          © {new Date().getFullYear()} Built with{' '}
          <span className="text-red-400">♥</span> using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              window.location.hostname || 'pristine-learning'
            )}`}
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
