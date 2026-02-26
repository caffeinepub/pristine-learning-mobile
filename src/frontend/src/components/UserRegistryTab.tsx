import React, { useState } from 'react';
import type { Principal } from '@icp-sdk/core/principal';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  useGetAllUserRecords,
  useToggleUserSuspension,
  useGetUserActivity,
  useGetUserPerformanceRecords,
} from '../hooks/useQueries';
import type { UserRecord } from '../backend';
import { toast } from 'sonner';
import { Search, User, ShieldOff, ShieldCheck, Loader2, ActivityIcon, BookOpen, Download } from 'lucide-react';
import { downloadCSV } from '../utils/csvExport';

function nanoToDate(ns: bigint): string {
  return new Date(Number(ns) / 1_000_000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function nanoToDateTime(ns: bigint): string {
  return new Date(Number(ns) / 1_000_000).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

interface UserDetailModalProps {
  user: UserRecord | null;
  open: boolean;
  onClose: () => void;
}

function UserDetailModal({ user, open, onClose }: UserDetailModalProps) {
  const principal: Principal | null = user ? user.principal : null;
  const { data: activities, isLoading: activitiesLoading } = useGetUserActivity(principal);
  const { data: performance, isLoading: perfLoading } = useGetUserPerformanceRecords(
    user?.role === 'student' ? principal : null
  );

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-serif text-base flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-primary text-xs font-bold">
              {user.name.charAt(0).toUpperCase() || '?'}
            </div>
            {user.name || 'Unknown User'}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="space-y-4 pr-2">
            {/* Profile Info */}
            <div className="bg-muted/40 rounded-lg p-3 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Principal</span>
                <span className="font-mono text-[10px] text-foreground truncate max-w-[160px]">
                  {user.principal.toString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Role</span>
                <Badge variant="secondary" className="text-[10px] capitalize h-4">
                  {user.role}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge
                  variant={user.isSuspended ? 'destructive' : 'default'}
                  className="text-[10px] h-4"
                >
                  {user.isSuspended ? 'Suspended' : 'Active'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Joined</span>
                <span className="text-foreground">{nanoToDate(user.joinTimestamp)}</span>
              </div>
            </div>

            <Separator />

            {/* Activity Log */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <ActivityIcon className="w-3.5 h-3.5 text-primary" />
                <h4 className="text-xs font-semibold text-foreground">Activity Log</h4>
              </div>
              {activitiesLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-10 rounded-lg" />
                  ))}
                </div>
              ) : activities && activities.length > 0 ? (
                <div className="space-y-1.5">
                  {activities.map((activity, i) => (
                    <div key={`activity-${i}-${Number(activity.timestamp)}`} className="bg-muted/30 rounded-lg p-2.5 text-xs">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <span className="font-medium text-foreground">{activity.action}</span>
                          {activity.detail && (
                            <p className="text-muted-foreground mt-0.5">{activity.detail}</p>
                          )}
                        </div>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0">
                          {nanoToDateTime(activity.timestamp)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground text-center py-3">No activity recorded</p>
              )}
            </div>

            {/* Performance Records (students only) */}
            {user.role === 'student' && (
              <>
                <Separator />
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <BookOpen className="w-3.5 h-3.5 text-primary" />
                    <h4 className="text-xs font-semibold text-foreground">Performance Records</h4>
                  </div>
                  {perfLoading ? (
                    <div className="space-y-2">
                      {[1, 2].map((i) => (
                        <Skeleton key={i} className="h-10 rounded-lg" />
                      ))}
                    </div>
                  ) : performance && performance.length > 0 ? (
                    <div className="space-y-1.5">
                  {performance.map((rec, i) => (
                    <div key={`perf-${i}-${Number(rec.sessionId)}`} className="bg-muted/30 rounded-lg p-2.5 text-xs">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="font-medium text-foreground">{rec.subject}</span>
                              <span className="text-muted-foreground ml-1">· Grade {rec.grade}</span>
                              <p className="text-muted-foreground mt-0.5">
                                {rec.attended ? '✓ Attended' : '✗ Absent'} · Rating: {rec.ratingGiven}/5
                              </p>
                            </div>
                            <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0">
                              {nanoToDate(rec.date)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground text-center py-3">No performance records</p>
                  )}
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default function UserRegistryTab() {
  const { data: users, isLoading } = useGetAllUserRecords();
  const toggleSuspension = useToggleUserSuspension();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const handleToggleSuspension = async (e: React.MouseEvent, user: UserRecord) => {
    e.stopPropagation();
    try {
      await toggleSuspension.mutateAsync(user.principal);
      toast.success(
        user.isSuspended ? `${user.name} has been unsuspended` : `${user.name} has been suspended`
      );
    } catch {
      toast.error('Failed to update user suspension status');
    }
  };

  const filteredUsers = (users ?? []).filter((u) => {
    const matchSearch =
      !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.principal.toString().includes(search);
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const matchStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && !u.isSuspended) ||
      (statusFilter === 'suspended' && u.isSuspended);
    return matchSearch && matchRole && matchStatus;
  });

  if (isLoading) {
    return (
      <div className="space-y-3 pt-2">
        <Skeleton className="h-9 rounded-lg" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-3 pt-2">
      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[140px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-xs"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="h-8 text-xs w-[110px]">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="teacher">Teacher</SelectItem>
            <SelectItem value="student">Student</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-8 text-xs w-[110px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs gap-1.5 shrink-0"
          onClick={() => {
            const headers = ['Name', 'Role', 'Status', 'Joined', 'Principal'];
            const rows = filteredUsers.map((u) => [
              u.name || 'Unknown',
              u.role,
              u.isSuspended ? 'Suspended' : 'Active',
              nanoToDate(u.joinTimestamp),
              u.principal.toString(),
            ]);
            downloadCSV('users.csv', headers, rows);
          }}
        >
          <Download className="w-3.5 h-3.5" />
          Export CSV
        </Button>
      </div>

      {/* Stats row */}
      <div className="flex gap-2 text-xs text-muted-foreground">
        <span>
          <strong className="text-foreground">{filteredUsers.length}</strong> users shown
        </span>
        {search || roleFilter !== 'all' || statusFilter !== 'all' ? (
          <span>· {users?.length ?? 0} total</span>
        ) : null}
      </div>

      {/* Table */}
      {filteredUsers.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-8 text-center">
          <User className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No users match your filters</p>
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Name</TableHead>
                  <TableHead className="text-xs">Role</TableHead>
                  <TableHead className="text-xs hidden sm:table-cell">Joined</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="text-xs text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow
                    key={user.principal.toString()}
                    className="cursor-pointer hover:bg-muted/40 transition-colors"
                    onClick={() => {
                      setSelectedUser(user);
                      setDetailOpen(true);
                    }}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center text-primary text-[10px] font-bold shrink-0">
                          {user.name.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div>
                          <p className="text-xs font-medium text-foreground leading-tight">
                            {user.name || 'Unknown'}
                          </p>
                          <p className="text-[10px] text-muted-foreground font-mono">
                            {user.principal.toString().slice(0, 10)}…
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] capitalize h-4 px-1.5">
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground hidden sm:table-cell">
                      {nanoToDate(user.joinTimestamp)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={user.isSuspended ? 'destructive' : 'default'}
                        className="text-[10px] h-4 px-1.5"
                      >
                        {user.isSuspended ? 'Suspended' : 'Active'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant={user.isSuspended ? 'outline' : 'destructive'}
                        className="h-6 text-[10px] px-2 gap-1"
                        onClick={(e) => handleToggleSuspension(e, user)}
                        disabled={toggleSuspension.isPending}
                      >
                        {toggleSuspension.isPending ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : user.isSuspended ? (
                          <>
                            <ShieldCheck className="w-3 h-3" />
                            Unsuspend
                          </>
                        ) : (
                          <>
                            <ShieldOff className="w-3 h-3" />
                            Suspend
                          </>
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* User Detail Modal */}
      <UserDetailModal
        user={selectedUser}
        open={detailOpen}
        onClose={() => {
          setDetailOpen(false);
          setTimeout(() => setSelectedUser(null), 200);
        }}
      />
    </div>
  );
}
