import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import {
  useGetAllPerformanceRecords,
  useGetAllStudentProfiles,
} from '../hooks/useQueries';
import type { PerformanceRecord, StudentProfile } from '../backend';
import type { Principal } from '@icp-sdk/core/principal';
import { Search, ChevronDown, ChevronUp, Star, BookOpen, TrendingUp, Download } from 'lucide-react';
import { downloadCSV } from '../utils/csvExport';

function nanoToDate(ns: bigint): string {
  return new Date(Number(ns) / 1_000_000).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

interface StudentRowProps {
  principal: Principal;
  records: PerformanceRecord[];
  profile: StudentProfile | undefined;
}

function StudentRow({ principal, records, profile }: StudentRowProps) {
  const [expanded, setExpanded] = useState(false);

  const totalSessions = records.length;
  const attended = records.filter((r) => r.attended).length;
  const avgRating =
    totalSessions > 0
      ? (records.reduce((sum, r) => sum + r.ratingGiven, 0) / totalSessions).toFixed(1)
      : '—';
  const subjects = [...new Set(records.map((r) => r.subject))];
  const displayName = profile?.fullName || 'Unknown Student';
  const grade = profile?.grade || records[0]?.grade || '—';

  return (
    <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
      {/* Header row */}
      <button
        type="button"
        className="w-full p-3 flex items-center gap-3 hover:bg-muted/30 transition-colors text-left"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center text-primary text-sm font-bold shrink-0">
          {displayName.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground leading-tight">{displayName}</p>
          <p className="text-[10px] text-muted-foreground font-mono">
            {principal.toString().slice(0, 16)}…
          </p>
        </div>
        {/* Quick stats */}
        <div className="hidden sm:flex gap-3 shrink-0">
          <div className="text-center">
            <p className="text-xs font-bold text-foreground">{totalSessions}</p>
            <p className="text-[10px] text-muted-foreground">Sessions</p>
          </div>
          <div className="text-center">
            <p className="text-xs font-bold text-foreground">{attended}</p>
            <p className="text-[10px] text-muted-foreground">Attended</p>
          </div>
          <div className="text-center">
            <p className="text-xs font-bold text-foreground flex items-center gap-0.5">
              <Star className="w-2.5 h-2.5 text-yellow-500 fill-yellow-500" />
              {avgRating}
            </p>
            <p className="text-[10px] text-muted-foreground">Avg Rating</p>
          </div>
        </div>
        <div className="shrink-0 text-muted-foreground">
          {expanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </div>
      </button>

      {/* Subjects chips */}
      {!expanded && subjects.length > 0 && (
        <div className="px-3 pb-2.5 flex flex-wrap gap-1">
          {subjects.slice(0, 4).map((subj) => (
            <Badge key={subj} variant="secondary" className="text-[10px] h-4 px-1.5">
              {subj}
            </Badge>
          ))}
          {subjects.length > 4 && (
            <Badge variant="outline" className="text-[10px] h-4 px-1.5">
              +{subjects.length - 4}
            </Badge>
          )}
        </div>
      )}

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-border">
          {/* Mobile stats */}
          <div className="sm:hidden flex gap-4 px-3 py-2.5 bg-muted/20">
            <div className="text-center">
              <p className="text-xs font-bold text-foreground">{totalSessions}</p>
              <p className="text-[10px] text-muted-foreground">Sessions</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-bold text-foreground">{attended}</p>
              <p className="text-[10px] text-muted-foreground">Attended</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-bold text-foreground flex items-center gap-0.5">
                <Star className="w-2.5 h-2.5 text-yellow-500 fill-yellow-500" />
                {avgRating}
              </p>
              <p className="text-[10px] text-muted-foreground">Avg Rating</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-bold text-foreground">{grade}</p>
              <p className="text-[10px] text-muted-foreground">Grade</p>
            </div>
          </div>
          <div className="p-3 space-y-2">
            {records.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-2">No records found</p>
            ) : (
              <ScrollArea className="max-h-64">
                <div className="space-y-1.5 pr-2">
                  {records.map((rec, i) => (
                    <div
                      key={`rec-${i}-${Number(rec.sessionId)}`}
                      className="flex items-start justify-between gap-2 bg-muted/30 rounded-lg p-2 text-xs"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-medium text-foreground">{rec.subject}</span>
                          <Badge variant="outline" className="text-[10px] h-3.5 px-1">
                            Grade {rec.grade}
                          </Badge>
                          <Badge
                            variant={rec.attended ? 'default' : 'secondary'}
                            className="text-[10px] h-3.5 px-1"
                          >
                            {rec.attended ? 'Attended' : 'Absent'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                          <span className="flex items-center gap-0.5">
                            <Star className="w-2.5 h-2.5 text-yellow-500 fill-yellow-500" />
                            {rec.ratingGiven}/5
                          </span>
                          <span>· Session #{Number(rec.sessionId)}</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0">
                        {nanoToDate(rec.date)}
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function StudentPerformanceTab() {
  const { data: allPerf, isLoading: perfLoading } = useGetAllPerformanceRecords();
  const { data: allProfiles, isLoading: profilesLoading } = useGetAllStudentProfiles();

  const [search, setSearch] = useState('');

  const isLoading = perfLoading || profilesLoading;

  // Build a profile map for quick lookups
  const profileMap = new Map<string, StudentProfile>();
  (allProfiles ?? []).forEach(([principal, profile]) => {
    profileMap.set(principal.toString(), profile);
  });

  // Filter
  const filtered = (allPerf ?? []).filter(([principal, records]) => {
    if (!search) return true;
    const profile = profileMap.get(principal.toString());
    const name = profile?.fullName ?? '';
    return (
      name.toLowerCase().includes(search.toLowerCase()) ||
      principal.toString().includes(search) ||
      records.some((r) => r.subject.toLowerCase().includes(search.toLowerCase()))
    );
  });

  // Summary stats
  const totalStudents = (allPerf ?? []).length;
  const totalRecords = (allPerf ?? []).reduce((sum, [, recs]) => sum + recs.length, 0);
  const overallAvgRating =
    totalRecords > 0
      ? (
          (allPerf ?? []).reduce(
            (sum, [, recs]) => sum + recs.reduce((s, r) => s + r.ratingGiven, 0),
            0
          ) / totalRecords
        ).toFixed(1)
      : '—';

  if (isLoading) {
    return (
      <div className="space-y-3 pt-2">
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-14 rounded-xl" />
          ))}
        </div>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3 pt-2">
      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Students', value: String(totalStudents), icon: <BookOpen className="w-3.5 h-3.5" /> },
          { label: 'Sessions', value: String(totalRecords), icon: <TrendingUp className="w-3.5 h-3.5" /> },
          { label: 'Avg Rating', value: overallAvgRating, icon: <Star className="w-3.5 h-3.5 text-yellow-500" /> },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-card border border-border rounded-xl p-2.5 text-center shadow-card"
          >
            <div className="flex items-center justify-center gap-1 text-primary mb-1">
              {stat.icon}
            </div>
            <p className="text-sm font-bold text-foreground">{stat.value}</p>
            <p className="text-[10px] text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <Separator />

      {/* Search + Export */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Search by name, subject, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-xs"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs gap-1.5 shrink-0"
          onClick={() => {
            const headers = [
              'Student Name',
              'Principal',
              'Grade',
              'Subject',
              'Attended',
              'Rating',
              'Session ID',
              'Date',
            ];
            const rows: string[][] = [];
            (allPerf ?? []).forEach(([principal, records]) => {
              const studentName =
                profileMap.get(principal.toString())?.fullName ?? 'Unknown Student';
              records.forEach((rec) => {
                rows.push([
                  studentName,
                  principal.toString(),
                  rec.grade,
                  rec.subject,
                  rec.attended ? 'Yes' : 'No',
                  String(rec.ratingGiven),
                  String(Number(rec.sessionId)),
                  nanoToDate(rec.date),
                ]);
              });
            });
            downloadCSV('student-performance.csv', headers, rows);
          }}
        >
          <Download className="w-3.5 h-3.5" />
          Export CSV
        </Button>
      </div>

      {/* Student list */}
      {filtered.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-8 text-center">
          <BookOpen className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            {totalStudents === 0 ? 'No student performance data yet' : 'No students match your search'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(([principal, records]) => (
            <StudentRow
              key={principal.toString()}
              principal={principal}
              records={records}
              profile={profileMap.get(principal.toString())}
            />
          ))}
        </div>
      )}
    </div>
  );
}
