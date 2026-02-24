import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, CheckCircle, XCircle, Wallet } from 'lucide-react';
import { useGetCallerWithdrawalHistory } from '../hooks/useQueries';
import { Variant_pending_approved_rejected } from '../backend';

function formatDate(nanoseconds: bigint): string {
  const ms = Number(nanoseconds) / 1_000_000;
  return new Date(ms).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function StatusBadge({ status }: { status: Variant_pending_approved_rejected }) {
  if (status === Variant_pending_approved_rejected.pending) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold status-pending">
        <Clock className="w-3 h-3" />
        Pending
      </span>
    );
  }
  if (status === Variant_pending_approved_rejected.approved) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold status-approved">
        <CheckCircle className="w-3 h-3" />
        Approved
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold status-rejected">
      <XCircle className="w-3 h-3" />
      Rejected
    </span>
  );
}

export default function WithdrawalHistoryTable() {
  const { data: withdrawals, isLoading } = useGetCallerWithdrawalHistory();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-12 w-full bg-secondary" />
        ))}
      </div>
    );
  }

  if (!withdrawals || withdrawals.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <Wallet className="w-10 h-10 mx-auto mb-3 opacity-40" />
        <p className="font-medium">No withdrawal requests yet</p>
        <p className="text-sm mt-1">Your withdrawal history will appear here</p>
      </div>
    );
  }

  const sorted = [...withdrawals].sort(
    (a, b) => Number(b.requestDate) - Number(a.requestDate)
  );

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="text-muted-foreground font-semibold">Amount</TableHead>
            <TableHead className="text-muted-foreground font-semibold">Status</TableHead>
            <TableHead className="text-muted-foreground font-semibold">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((req, idx) => (
            <TableRow key={idx} className="border-border hover:bg-secondary/50">
              <TableCell className="font-bold text-primary text-lg">
                ${Number(req.amount).toLocaleString()}
              </TableCell>
              <TableCell>
                <StatusBadge status={req.status} />
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {formatDate(req.requestDate)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
