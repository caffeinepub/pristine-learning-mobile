import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AdminTeacherInfo, TeacherStatus, ApprovalStatus } from '../backend';
import { useSetApproval } from '../hooks/useQueries';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface TeacherManagementTableProps {
  teachers: AdminTeacherInfo[];
}

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  approved: 'default',
  pending: 'secondary',
  suspended: 'destructive',
};

export default function TeacherManagementTable({ teachers }: TeacherManagementTableProps) {
  const setApproval = useSetApproval();

  const handleApprove = async (teacher: AdminTeacherInfo) => {
    try {
      await setApproval.mutateAsync({
        user: teacher.principal,
        status: ApprovalStatus.approved,
      });
      toast.success(`${teacher.profile.fullName || 'Teacher'} approved`);
    } catch {
      toast.error('Failed to update approval status');
    }
  };

  const handleSuspend = async (teacher: AdminTeacherInfo) => {
    try {
      await setApproval.mutateAsync({
        user: teacher.principal,
        status: ApprovalStatus.rejected,
      });
      toast.success(`${teacher.profile.fullName || 'Teacher'} suspended`);
    } catch {
      toast.error('Failed to update approval status');
    }
  };

  if (teachers.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border shadow-card p-6 text-center">
        <p className="text-sm text-muted-foreground">No teachers registered yet</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
      <div className="p-4 border-b border-border">
        <h3 className="font-serif font-semibold text-sm text-foreground">Teacher Management</h3>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">Teacher</TableHead>
              <TableHead className="text-xs">Status</TableHead>
              <TableHead className="text-xs text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teachers.map((teacher, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div>
                    <p className="text-xs font-medium">{teacher.profile.fullName || 'Unnamed'}</p>
                    <p className="text-[10px] text-muted-foreground truncate max-w-[100px]">
                      {teacher.principal.toString().slice(0, 12)}...
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={statusVariant[teacher.status] || 'outline'}
                    className="text-[10px] capitalize"
                  >
                    {teacher.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-1 justify-end">
                    {teacher.status !== TeacherStatus.approved && (
                      <Button
                        size="sm"
                        className="h-6 text-[10px] px-2"
                        onClick={() => handleApprove(teacher)}
                        disabled={setApproval.isPending}
                      >
                        {setApproval.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Approve'}
                      </Button>
                    )}
                    {teacher.status !== TeacherStatus.suspended && (
                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-6 text-[10px] px-2"
                        onClick={() => handleSuspend(teacher)}
                        disabled={setApproval.isPending}
                      >
                        Suspend
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
