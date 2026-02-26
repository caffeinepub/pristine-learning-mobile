import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Dispute, DisputeStatus } from '../backend';
import { AlertTriangle } from 'lucide-react';

interface DisputesListProps {
  disputes: Dispute[];
}

const statusColors: Record<string, string> = {
  open: 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400',
  resolved: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400',
  rejected: 'bg-destructive/10 text-destructive border-destructive/20',
};

export default function DisputesList({ disputes }: DisputesListProps) {
  if (disputes.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border shadow-card p-6 text-center">
        <p className="text-sm text-muted-foreground">No disputes filed</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
      <div className="p-4 border-b border-border">
        <h3 className="font-serif font-semibold text-sm text-foreground">Disputes</h3>
      </div>
      <div className="divide-y divide-border">
        {disputes.map((dispute, i) => (
          <div key={i} className="p-4 flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <AlertTriangle className="w-3.5 h-3.5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <p className="text-xs font-medium text-foreground">Session #{Number(dispute.session)}</p>
                <Badge
                  variant="outline"
                  className={`text-[10px] capitalize ${statusColors[dispute.status] || ''}`}
                >
                  {dispute.status}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">{dispute.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
