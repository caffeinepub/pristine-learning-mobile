import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, CalendarDays } from 'lucide-react';
import { useListSessions, useUpdateSession } from '../hooks/useQueries';
import SessionCard from '../components/SessionCard';
import SessionCalendar from '../components/SessionCalendar';
import CreateSessionModal from '../components/CreateSessionModal';
import { SessionStatus } from '../backend';
import { toast } from 'sonner';

export default function SessionsPage() {
  const [showCreate, setShowCreate] = useState(false);
  const { data: sessions, isLoading } = useListSessions();
  const updateSession = useUpdateSession();

  const upcoming = sessions?.filter(([, s]) => s.status === SessionStatus.scheduled) ?? [];
  const history = sessions?.filter(([, s]) => s.status !== SessionStatus.scheduled) ?? [];

  const handleUpdateStatus = async (id: bigint, status: SessionStatus) => {
    const session = sessions?.find(([sid]) => sid === id);
    if (!session) return;
    try {
      await updateSession.mutateAsync({ id, session: { ...session[1], status } });
      toast.success('Session updated');
    } catch {
      toast.error('Failed to update session');
    }
  };

  return (
    <div className="p-4 space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-xl font-semibold text-foreground">Sessions</h2>
          <p className="text-xs text-muted-foreground">Manage your teaching sessions</p>
        </div>
        <Button size="sm" onClick={() => setShowCreate(true)} className="gap-1.5">
          <Plus className="w-4 h-4" />
          New Session
        </Button>
      </div>

      {/* Calendar */}
      <SessionCalendar sessions={sessions ?? []} />

      {/* Tabs */}
      <Tabs defaultValue="upcoming">
        <TabsList className="w-full">
          <TabsTrigger value="upcoming" className="flex-1">
            Upcoming ({upcoming.length})
          </TabsTrigger>
          <TabsTrigger value="history" className="flex-1">
            History ({history.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-3 mt-3">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
            </div>
          ) : upcoming.length === 0 ? (
            <div className="text-center py-10">
              <CalendarDays className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-3">No upcoming sessions</p>
              <Button size="sm" onClick={() => setShowCreate(true)}>
                Schedule a Session
              </Button>
            </div>
          ) : (
            upcoming.map(([id, session]) => (
              <SessionCard
                key={String(id)}
                id={id}
                session={session}
                onUpdateStatus={handleUpdateStatus}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-3 mt-3">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-sm text-muted-foreground">No session history yet</p>
            </div>
          ) : (
            history.map(([id, session]) => (
              <SessionCard key={String(id)} id={id} session={session} />
            ))
          )}
        </TabsContent>
      </Tabs>

      <CreateSessionModal open={showCreate} onClose={() => setShowCreate(false)} />
    </div>
  );
}
