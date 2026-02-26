import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSubmitWithdrawalRequest } from '../hooks/useQueries';
import { Loader2, Wallet } from 'lucide-react';
import { toast } from 'sonner';

interface WithdrawModalProps {
  open: boolean;
  onClose: () => void;
  availableBalance: number;
}

export default function WithdrawModal({ open, onClose, availableBalance }: WithdrawModalProps) {
  const [amount, setAmount] = useState('');
  const withdraw = useSubmitWithdrawalRequest();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (numAmount > availableBalance) {
      toast.error('Amount exceeds available balance');
      return;
    }
    try {
      await withdraw.mutateAsync(numAmount);
      toast.success(`Withdrawal request of $${numAmount.toFixed(2)} submitted!`);
      setAmount('');
      onClose();
    } catch {
      toast.error('Failed to submit withdrawal request. Please try again.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm mx-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-primary" />
            </div>
            <DialogTitle className="font-serif">Withdraw Funds</DialogTitle>
          </div>
          <DialogDescription>
            Available balance: <span className="font-semibold text-foreground">${availableBalance.toFixed(2)}</span>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="amount">Withdrawal Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              min="1"
              max={availableBalance}
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={withdraw.isPending} className="flex-1">
              {withdraw.isPending ? (
                <><Loader2 className="w-4 h-4 animate-spin mr-2" />Processing...</>
              ) : (
                'Withdraw'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
