import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useGetWeeklySnapshots, useRecordWeeklySnapshot, useGenerateWeeklySnapshot } from '../hooks/useQueries';
import type { WeeklySnapshot } from '../backend';
import { toast } from 'sonner';
import { PlusCircle, Loader2, TrendingUp, BarChart2, Download, Zap } from 'lucide-react';
import { downloadCSV } from '../utils/csvExport';

function nanoToWeekLabel(ns: bigint): string {
  return new Date(Number(ns) / 1_000_000).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function nanoToFullDate(ns: bigint): string {
  return new Date(Number(ns) / 1_000_000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

interface SnapshotFormData {
  weekStart: string;
  totalUsers: string;
  activeSessions: string;
  totalEarnings: string;
  topSubjects: string;
}

const defaultForm: SnapshotFormData = {
  weekStart: new Date().toISOString().split('T')[0],
  totalUsers: '',
  activeSessions: '',
  totalEarnings: '',
  topSubjects: '',
};

interface RecordSnapshotModalProps {
  open: boolean;
  onClose: () => void;
}

function RecordSnapshotModal({ open, onClose }: RecordSnapshotModalProps) {
  const [form, setForm] = useState<SnapshotFormData>(defaultForm);
  const recordSnapshot = useRecordWeeklySnapshot();

  const handleChange = (field: keyof SnapshotFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.weekStart || !form.totalUsers || !form.activeSessions || !form.totalEarnings) {
      toast.error('Please fill in all required fields');
      return;
    }
    try {
      const weekStartMs = new Date(form.weekStart).getTime();
      const snapshot: WeeklySnapshot = {
        weekStart: BigInt(weekStartMs * 1_000_000),
        totalUsers: BigInt(parseInt(form.totalUsers, 10) || 0),
        activeSessions: BigInt(parseInt(form.activeSessions, 10) || 0),
        totalEarnings: parseFloat(form.totalEarnings) || 0,
        topSubjects: form.topSubjects
          ? form.topSubjects.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
      };
      await recordSnapshot.mutateAsync(snapshot);
      toast.success('Weekly snapshot recorded successfully');
      setForm(defaultForm);
      onClose();
    } catch {
      toast.error('Failed to record snapshot');
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-serif text-base">Record Weekly Snapshot</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Week Start Date *</Label>
            <Input
              type="date"
              value={form.weekStart}
              onChange={(e) => handleChange('weekStart', e.target.value)}
              className="h-8 text-xs"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Total Users *</Label>
              <Input
                type="number"
                min="0"
                placeholder="e.g. 1250"
                value={form.totalUsers}
                onChange={(e) => handleChange('totalUsers', e.target.value)}
                className="h-8 text-xs"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Active Sessions *</Label>
              <Input
                type="number"
                min="0"
                placeholder="e.g. 340"
                value={form.activeSessions}
                onChange={(e) => handleChange('activeSessions', e.target.value)}
                className="h-8 text-xs"
                required
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Total Earnings (USD) *</Label>
            <Input
              type="number"
              min="0"
              step="0.01"
              placeholder="e.g. 4500.00"
              value={form.totalEarnings}
              onChange={(e) => handleChange('totalEarnings', e.target.value)}
              className="h-8 text-xs"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Top Subjects (comma-separated)</Label>
            <Textarea
              placeholder="e.g. Mathematics, English, Science"
              value={form.topSubjects}
              onChange={(e) => handleChange('topSubjects', e.target.value)}
              className="text-xs resize-none h-16"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs">
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={recordSnapshot.isPending} className="text-xs">
              {recordSnapshot.isPending ? (
                <>
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  Saving…
                </>
              ) : (
                'Record Snapshot'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function WeeklyAnalyticsTab() {
  const { data: snapshots, isLoading } = useGetWeeklySnapshots();
  const [modalOpen, setModalOpen] = useState(false);
  const generateSnapshot = useGenerateWeeklySnapshot();

  const handleAutoGenerate = async () => {
    try {
      await generateSnapshot.mutateAsync();
      toast.success('Weekly snapshot auto-generated from live data');
    } catch {
      toast.error('Failed to generate snapshot');
    }
  };

  const sorted = [...(snapshots ?? [])].sort(
    (a, b) => Number(a.weekStart) - Number(b.weekStart)
  );

  const chartData = sorted.map((snap) => ({
    week: nanoToWeekLabel(snap.weekStart),
    users: Number(snap.totalUsers),
    sessions: Number(snap.activeSessions),
    earnings: snap.totalEarnings,
  }));

  if (isLoading) {
    return (
      <div className="space-y-4 pt-2">
        <Skeleton className="h-48 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-4 pt-2">
      {/* Header row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <BarChart2 className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Week-over-Week Trends</h3>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs gap-1"
            onClick={() => {
              const headers = [
                'Week Of',
                'Total Users',
                'Active Sessions',
                'Total Earnings (USD)',
                'Top Subjects',
              ];
              const rows = (snapshots ?? []).map((snap) => [
                nanoToFullDate(snap.weekStart),
                String(Number(snap.totalUsers)),
                String(Number(snap.activeSessions)),
                snap.totalEarnings.toFixed(2),
                snap.topSubjects.join('; '),
              ]);
              downloadCSV('weekly-analytics.csv', headers, rows);
            }}
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="h-7 text-xs gap-1"
            onClick={handleAutoGenerate}
            disabled={generateSnapshot.isPending}
          >
            {generateSnapshot.isPending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Generating…
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5" />
                Auto-Generate
              </>
            )}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs gap-1"
            onClick={() => setModalOpen(true)}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Manual Entry
          </Button>
        </div>
      </div>

      {snapshots && snapshots.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-8 text-center">
          <TrendingUp className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No weekly snapshots recorded yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            Click "Auto-Generate" to pull live data or use "Manual Entry" to enter values
          </p>
        </div>
      ) : (
        <>
          {/* Chart */}
          <div className="bg-card rounded-xl border border-border shadow-card p-3">
            <h4 className="text-xs font-semibold text-muted-foreground mb-3">Users & Sessions</h4>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis
                  dataKey="week"
                  tick={{ fontSize: 10 }}
                  className="text-muted-foreground"
                />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    fontSize: 11,
                    borderRadius: 8,
                    border: '1px solid var(--border)',
                    background: 'var(--card)',
                    color: 'var(--foreground)',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Line
                  type="monotone"
                  dataKey="users"
                  name="Total Users"
                  stroke="oklch(0.48 0.09 155)"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="sessions"
                  name="Active Sessions"
                  stroke="oklch(0.62 0.12 145)"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card rounded-xl border border-border shadow-card p-3">
            <h4 className="text-xs font-semibold text-muted-foreground mb-3">Earnings (USD)</h4>
            <ResponsiveContainer width="100%" height={140}>
              <LineChart data={chartData} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="week" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    fontSize: 11,
                    borderRadius: 8,
                    border: '1px solid var(--border)',
                    background: 'var(--card)',
                    color: 'var(--foreground)',
                  }}
                  formatter={(val: number) => [`$${val.toLocaleString()}`, 'Earnings']}
                />
                <Line
                  type="monotone"
                  dataKey="earnings"
                  name="Earnings"
                  stroke="oklch(0.72 0.14 85)"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Snapshots table */}
          <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
            <div className="p-3 border-b border-border">
              <h4 className="text-xs font-semibold text-foreground">All Snapshots</h4>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Week of</TableHead>
                    <TableHead className="text-xs text-right">Users</TableHead>
                    <TableHead className="text-xs text-right">Sessions</TableHead>
                    <TableHead className="text-xs text-right">Earnings</TableHead>
                    <TableHead className="text-xs hidden md:table-cell">Top Subjects</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...sorted].reverse().map((snap) => (
                    <TableRow key={Number(snap.weekStart)}>
                      <TableCell className="text-xs text-foreground font-medium">
                        {nanoToFullDate(snap.weekStart)}
                      </TableCell>
                      <TableCell className="text-xs text-right">
                        {Number(snap.totalUsers).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-xs text-right">
                        {Number(snap.activeSessions).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-xs text-right">
                        ${snap.totalEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {snap.topSubjects.slice(0, 3).map((subj) => (
                            <Badge key={subj} variant="secondary" className="text-[10px] h-4 px-1.5">
                              {subj}
                            </Badge>
                          ))}
                          {snap.topSubjects.length > 3 && (
                            <Badge variant="outline" className="text-[10px] h-4 px-1.5">
                              +{snap.topSubjects.length - 3}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </>
      )}

      <RecordSnapshotModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
