import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Session, SessionStatus } from '../backend';

interface SessionCalendarProps {
  sessions: Array<[bigint, Session]>;
}

export default function SessionCalendar({ sessions }: SessionCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const sessionsByDay: Record<number, Session[]> = {};
  sessions.forEach(([, session]) => {
    const date = new Date(Number(session.scheduledTime) / 1_000_000);
    if (date.getFullYear() === year && date.getMonth() === month) {
      const day = date.getDate();
      if (!sessionsByDay[day]) sessionsByDay[day] = [];
      sessionsByDay[day].push(session);
    }
  });

  const today = new Date();
  const isToday = (day: number) =>
    today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return (
    <div className="bg-card rounded-xl border border-border shadow-card p-4">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="icon" onClick={prevMonth} className="h-7 w-7">
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <h3 className="font-serif font-semibold text-sm text-foreground">{monthName}</h3>
        <Button variant="ghost" size="icon" onClick={nextMonth} className="h-7 w-7">
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {days.map((d) => (
          <div key={d} className="text-center text-[10px] font-semibold text-muted-foreground py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const daySessions = sessionsByDay[day] || [];
          const hasScheduled = daySessions.some((s) => s.status === SessionStatus.scheduled);
          const hasCompleted = daySessions.some((s) => s.status === SessionStatus.completed);

          return (
            <div
              key={day}
              className={`relative flex flex-col items-center justify-center h-8 rounded-lg text-xs font-medium transition-all ${
                isToday(day)
                  ? 'bg-primary text-primary-foreground'
                  : daySessions.length > 0
                  ? 'bg-primary/10 text-primary'
                  : 'text-foreground hover:bg-muted'
              }`}
            >
              {day}
              {daySessions.length > 0 && !isToday(day) && (
                <div className="absolute bottom-0.5 flex gap-0.5">
                  {hasScheduled && (
                    <div className="w-1 h-1 rounded-full bg-primary" />
                  )}
                  {hasCompleted && (
                    <div className="w-1 h-1 rounded-full bg-green-500" />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
