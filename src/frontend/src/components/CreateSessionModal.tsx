import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCreateSession } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { SessionType, SessionStatus } from '../backend';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface CreateSessionModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateSessionModal({ open, onClose }: CreateSessionModalProps) {
  const { identity } = useInternetIdentity();
  const createSession = useCreateSession();

  const [form, setForm] = useState({
    sessionType: 'oneToOne' as 'oneToOne' | 'group',
    subject: '',
    grade: '',
    scheduledTime: '',
    duration: '60',
    meetingLink: '',
    studentCount: '1',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity) return;

    const scheduledMs = new Date(form.scheduledTime).getTime();
    const scheduledNs = BigInt(scheduledMs) * BigInt(1_000_000);

    try {
      await createSession.mutateAsync({
        sessionType: form.sessionType === 'oneToOne' ? SessionType.oneToOne : SessionType.group,
        subject: form.subject,
        grade: form.grade,
        scheduledTime: scheduledNs,
        duration: BigInt(parseInt(form.duration)),
        meetingLink: form.meetingLink,
        status: SessionStatus.scheduled,
        teacher: identity.getPrincipal(),
        studentCount: BigInt(parseInt(form.studentCount)),
        notes: form.notes,
      });
      toast.success('Session created successfully!');
      onClose();
      setForm({
        sessionType: 'oneToOne',
        subject: '',
        grade: '',
        scheduledTime: '',
        duration: '60',
        meetingLink: '',
        studentCount: '1',
        notes: '',
      });
    } catch {
      toast.error('Failed to create session. Please try again.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif">Create New Session</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label>Session Type</Label>
            <Select
              value={form.sessionType}
              onValueChange={(v) => setForm((f) => ({ ...f, sessionType: v as 'oneToOne' | 'group' }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="oneToOne">1:1 Session</SelectItem>
                <SelectItem value="group">Group Session</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="e.g. Mathematics"
                value={form.subject}
                onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="grade">Grade</Label>
              <Input
                id="grade"
                placeholder="e.g. Grade 8"
                value={form.grade}
                onChange={(e) => setForm((f) => ({ ...f, grade: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="scheduledTime">Date & Time</Label>
            <Input
              id="scheduledTime"
              type="datetime-local"
              value={form.scheduledTime}
              onChange={(e) => setForm((f) => ({ ...f, scheduledTime: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="duration">Duration (min)</Label>
              <Input
                id="duration"
                type="number"
                min="15"
                max="240"
                value={form.duration}
                onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
                required
              />
            </div>
            {form.sessionType === 'group' && (
              <div className="space-y-1.5">
                <Label htmlFor="studentCount">Students</Label>
                <Input
                  id="studentCount"
                  type="number"
                  min="2"
                  value={form.studentCount}
                  onChange={(e) => setForm((f) => ({ ...f, studentCount: e.target.value }))}
                />
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="meetingLink">Meeting Link</Label>
            <Input
              id="meetingLink"
              type="url"
              placeholder="https://zoom.us/j/..."
              value={form.meetingLink}
              onChange={(e) => setForm((f) => ({ ...f, meetingLink: e.target.value }))}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Session notes..."
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              rows={2}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={createSession.isPending} className="flex-1">
              {createSession.isPending ? (
                <><Loader2 className="w-4 h-4 animate-spin mr-2" />Creating...</>
              ) : (
                'Create Session'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
