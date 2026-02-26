import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Users, BookOpen, ExternalLink, Video } from 'lucide-react';
import { Session, SessionStatus, SessionType } from '../backend';

interface SessionCardProps {
  id: bigint;
  session: Session;
  onUpdateStatus?: (id: bigint, status: SessionStatus) => void;
}

const statusColors: Record<string, string> = {
  scheduled: 'bg-primary/10 text-primary border-primary/20',
  completed: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400',
  cancelled: 'bg-destructive/10 text-destructive border-destructive/20',
};

export default function SessionCard({ id, session, onUpdateStatus }: SessionCardProps) {
  const scheduledDate = new Date(Number(session.scheduledTime) / 1_000_000);
  const isUpcoming = session.status === SessionStatus.scheduled;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className="shadow-card card-hover animate-fade-in">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-sm text-foreground">{session.subject}</p>
              <p className="text-xs text-muted-foreground">Grade {session.grade}</p>
            </div>
          </div>
          <Badge
            variant="outline"
            className={`text-xs capitalize ${statusColors[session.status] || ''}`}
          >
            {session.status}
          </Badge>
        </div>

        <div className="space-y-1.5 mb-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatDate(scheduledDate)}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span>{Number(session.duration)} minutes</span>
            <span className="mx-1">·</span>
            <Users className="w-3.5 h-3.5" />
            <span>
              {session.sessionType === SessionType.oneToOne ? '1:1 Session' : `Group (${Number(session.studentCount)} students)`}
            </span>
          </div>
        </div>

        {isUpcoming && session.meetingLink && (
          <div className="flex gap-2">
            <Button
              size="sm"
              className="flex-1 h-8 text-xs gap-1.5"
              onClick={() => window.open(session.meetingLink, '_blank')}
            >
              <Video className="w-3.5 h-3.5" />
              Join Session
              <ExternalLink className="w-3 h-3" />
            </Button>
            {onUpdateStatus && (
              <Button
                size="sm"
                variant="outline"
                className="h-8 text-xs"
                onClick={() => onUpdateStatus(id, SessionStatus.completed)}
              >
                Mark Done
              </Button>
            )}
          </div>
        )}

        {session.notes && (
          <p className="text-xs text-muted-foreground mt-2 italic truncate">{session.notes}</p>
        )}
      </CardContent>
    </Card>
  );
}
