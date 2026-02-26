import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useSetCommissionRate } from '../hooks/useQueries';
import { Loader2, Percent } from 'lucide-react';
import { toast } from 'sonner';

interface CommissionRateEditorProps {
  currentRate: number;
}

export default function CommissionRateEditor({ currentRate }: CommissionRateEditorProps) {
  const [rate, setRate] = useState(String((currentRate * 100).toFixed(1)));
  const setCommissionRate = useSetCommissionRate();

  useEffect(() => {
    setRate(String((currentRate * 100).toFixed(1)));
  }, [currentRate]);

  const handleSave = async () => {
    const numRate = parseFloat(rate) / 100;
    if (isNaN(numRate) || numRate < 0 || numRate > 1) {
      toast.error('Commission rate must be between 0% and 100%');
      return;
    }
    try {
      await setCommissionRate.mutateAsync(numRate);
      toast.success(`Commission rate updated to ${rate}%`);
    } catch {
      toast.error('Failed to update commission rate');
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-card p-4">
      <h3 className="font-serif font-semibold text-sm text-foreground mb-3">Commission Rate</h3>
      <div className="flex items-end gap-3">
        <div className="flex-1 space-y-1.5">
          <Label htmlFor="commissionRate">Platform Commission (%)</Label>
          <div className="relative">
            <Input
              id="commissionRate"
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="pr-8"
            />
            <Percent className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          </div>
        </div>
        <Button
          onClick={handleSave}
          disabled={setCommissionRate.isPending}
          className="mb-0.5"
        >
          {setCommissionRate.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            'Save'
          )}
        </Button>
      </div>
    </div>
  );
}
