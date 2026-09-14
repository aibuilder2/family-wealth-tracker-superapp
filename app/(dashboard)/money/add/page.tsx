'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { TransactionForm } from '@/components/money/TransactionForm';

export default function AddTransactionPage() {
  const router = useRouter();

  return (
    <div className="space-y-4">
      <ScreenHeader
        title="Naya Entry"
        subtitle="Kharch, income ya udhar enter karein"
      />
      <div className="px-4">
        <div className="bg-paper p-5 rounded-2xl border border-paper-dim shadow-sm">
          <TransactionForm
            onSuccess={() => {
              router.push('/money');
            }}
          />
        </div>
      </div>
    </div>
  );
}
