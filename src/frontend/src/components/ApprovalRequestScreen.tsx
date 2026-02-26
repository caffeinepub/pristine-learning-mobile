import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, CheckCircle, Loader2, GraduationCap } from 'lucide-react';
import { useRequestApproval } from '../hooks/useQueries';
import { toast } from 'sonner';

interface ApprovalRequestScreenProps {
  userName: string;
}

export default function ApprovalRequestScreen({ userName }: ApprovalRequestScreenProps) {
  const requestApproval = useRequestApproval();
  const [requested, setRequested] = React.useState(false);

  const handleRequest = async () => {
    try {
      await requestApproval.mutateAsync();
      setRequested(true);
      toast.success('Approval request submitted! An admin will review your account shortly.');
    } catch {
      toast.error('Failed to submit approval request. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-sm w-full shadow-card">
        <CardContent className="pt-8 pb-8 text-center space-y-5">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <GraduationCap className="w-8 h-8 text-primary" />
            </div>
          </div>

          <div>
            <h2 className="font-serif text-xl font-semibold text-foreground mb-1">
              Welcome, {userName}!
            </h2>
            <p className="text-sm text-muted-foreground">
              Your account is pending approval from an administrator before you can access the teacher dashboard.
            </p>
          </div>

          {requested ? (
            <div className="flex items-center justify-center gap-2 text-primary bg-primary/10 rounded-lg py-3 px-4">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Request submitted — pending review</span>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2 text-muted-foreground bg-muted rounded-lg py-3 px-4">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Awaiting admin approval</span>
              </div>
              <Button
                onClick={handleRequest}
                disabled={requestApproval.isPending}
                className="w-full"
              >
                {requestApproval.isPending ? (
                  <><Loader2 className="w-4 h-4 animate-spin mr-2" />Submitting...</>
                ) : (
                  'Request Approval'
                )}
              </Button>
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            You'll be notified once your account is approved.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
