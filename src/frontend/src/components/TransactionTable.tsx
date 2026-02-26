import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Transaction } from '../backend';

interface TransactionTableProps {
  transactions: Transaction[];
}

export default function TransactionTable({ transactions }: TransactionTableProps) {
  if (transactions.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border shadow-card p-6 text-center">
        <p className="text-sm text-muted-foreground">No transactions yet</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
      <div className="p-4 border-b border-border">
        <h3 className="font-serif font-semibold text-sm text-foreground">Transaction History</h3>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">Date</TableHead>
              <TableHead className="text-xs">Subject</TableHead>
              <TableHead className="text-xs text-right">Gross</TableHead>
              <TableHead className="text-xs text-right">Commission</TableHead>
              <TableHead className="text-xs text-right">Net</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx, i) => {
              const date = new Date(Number(tx.date) / 1_000_000);
              const commission = tx.amount * tx.commissionRate;
              return (
                <TableRow key={i}>
                  <TableCell className="text-xs">
                    {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </TableCell>
                  <TableCell className="text-xs font-medium">{tx.subject}</TableCell>
                  <TableCell className="text-xs text-right">${tx.amount.toFixed(2)}</TableCell>
                  <TableCell className="text-xs text-right text-destructive">
                    -${commission.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-xs text-right font-semibold text-primary">
                    ${tx.netPayout.toFixed(2)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
