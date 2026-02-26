import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Wallet, TrendingUp, Clock, ArrowDownToLine, Info } from 'lucide-react';
import { useGetWalletSummary, useListTransactions } from '../hooks/useQueries';
import EarningsChart from '../components/EarningsChart';
import TransactionTable from '../components/TransactionTable';
import WithdrawModal from '../components/WithdrawModal';

export default function WalletPage() {
  const [showWithdraw, setShowWithdraw] = useState(false);
  const { data: wallet, isLoading: walletLoading } = useGetWalletSummary();
  const { data: transactions, isLoading: txLoading } = useListTransactions();

  // Build mock monthly earnings from transactions for chart
  const monthlyEarnings = React.useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return [0, 0, 0, 0, 0, 0];
    }
    const now = new Date();
    const months: number[] = Array(6).fill(0);
    transactions.forEach((tx) => {
      const date = new Date(Number(tx.date) / 1_000_000);
      const monthsAgo = (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth());
      if (monthsAgo >= 0 && monthsAgo < 6) {
        months[5 - monthsAgo] += tx.netPayout;
      }
    });
    return months;
  }, [transactions]);

  const summaryCards = [
    {
      label: 'Total Earnings',
      value: wallet?.totalEarnings ?? 0,
      icon: <TrendingUp className="w-4 h-4" />,
      color: 'bg-primary/10 text-primary',
    },
    {
      label: 'Available Balance',
      value: wallet?.availableBalance ?? 0,
      icon: <Wallet className="w-4 h-4" />,
      color: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
    },
    {
      label: 'Pending Payments',
      value: wallet?.pendingPayments ?? 0,
      icon: <Clock className="w-4 h-4" />,
      color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
    },
  ];

  return (
    <div className="p-4 space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-xl font-semibold text-foreground">Wallet</h2>
          <p className="text-xs text-muted-foreground">Track your earnings and payments</p>
        </div>
        <Button
          size="sm"
          onClick={() => setShowWithdraw(true)}
          disabled={!wallet || wallet.availableBalance <= 0}
          className="gap-1.5"
        >
          <ArrowDownToLine className="w-4 h-4" />
          Withdraw
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        {summaryCards.map((card) => (
          <Card key={card.label} className="shadow-card">
            <CardContent className="p-3">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center mb-2 ${card.color}`}>
                {card.icon}
              </div>
              {walletLoading ? (
                <Skeleton className="h-5 w-14 mb-1" />
              ) : (
                <p className="text-base font-bold text-foreground">${card.value.toFixed(2)}</p>
              )}
              <p className="text-[10px] text-muted-foreground leading-tight">{card.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Commission Info */}
      <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-xl border border-border">
        <Info className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground">
          A <span className="font-semibold text-foreground">10% platform commission</span> is deducted from each session. Your net payout is shown in the transaction history.
        </p>
      </div>

      {/* Earnings Chart */}
      <EarningsChart data={monthlyEarnings} title="Earnings (Last 6 Months)" />

      {/* Transaction History */}
      {txLoading ? (
        <Skeleton className="h-48 rounded-xl" />
      ) : (
        <TransactionTable transactions={transactions ?? []} />
      )}

      {/* Withdraw Modal */}
      <WithdrawModal
        open={showWithdraw}
        onClose={() => setShowWithdraw(false)}
        availableBalance={wallet?.availableBalance ?? 0}
      />
    </div>
  );
}
