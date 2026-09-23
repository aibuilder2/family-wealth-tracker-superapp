'use client';

import React from 'react';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { useFamilyStore } from '@/lib/store/familyStore';
import { Mono } from '@/components/ui/Mono';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function AnalyticsPage() {
  const { totalIncomeThisMonth, totalExpenseThisMonth } = useFamilyStore();

  const monthlyComparison = [
    { month: 'Jun', income: 78000, expense: 52000 },
    { month: 'Jul', income: 82000, expense: 61000 },
    { month: 'Aug', income: totalIncomeThisMonth || 85000, expense: totalExpenseThisMonth || 58200 },
  ];

  const categoryBreakdown = [
    { cat: 'Ghar kharch', amt: 22000, color: '#10263A', pct: 38 },
    { cat: 'Bahar kharch', amt: 14200, color: '#B98B2A', pct: 24 },
    { cat: 'Education', amt: 12000, color: '#3E6E8E', pct: 21 },
    { cat: 'Shopping & Fuel', amt: 10000, color: '#C1502E', pct: 17 },
  ];

  return (
    <div className="space-y-4">
      <ScreenHeader
        title="Analytics and Trends"
        subtitle="Income vs Expense graph aur kharch analysis"
      />

      <div className="px-4">
        <div className="p-4 bg-paper rounded-2xl border border-paper-dim shadow-sm">
          <h3 className="text-xs font-semibold text-ink mb-3 font-serif">Income vs Expense (Pichle 3 Mahine)</h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyComparison} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" stroke="#6B7A80" fontSize={11} />
                <YAxis stroke="#6B7A80" fontSize={10} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FBF8F2', borderRadius: '10px', border: '1px solid #E9E2D0', fontSize: '11px' }}
                />
                <Bar dataKey="income" fill="#4C7A5E" name="Income" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" fill="#C1502E" name="Expense" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-2 text-xs">
            <span className="flex items-center gap-1 text-green font-medium">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#4C7A5E] inline-block" /> Income
            </span>
            <span className="flex items-center gap-1 text-coral font-medium">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#C1502E] inline-block" /> Expense
            </span>
          </div>
        </div>
      </div>

      <div className="px-4">
        <div className="p-4 bg-paper rounded-2xl border border-paper-dim shadow-sm space-y-3">
          <h3 className="text-xs font-semibold text-ink font-serif">Category-wise Kharch</h3>
          {categoryBreakdown.map((c) => (
            <div key={c.cat} className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-ink">{c.cat}</span>
                <Mono className="text-ink font-semibold">₹{c.amt.toLocaleString('en-IN')}</Mono>
              </div>
              <div className="h-1.5 rounded-full bg-paper-dim overflow-hidden">
                <div
                  className="h-1.5 rounded-full"
                  style={{ width: c.pct + '%', backgroundColor: c.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
