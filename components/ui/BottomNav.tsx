'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Wallet, PiggyBank, Calendar, Menu, FileText, Users, Scale, HeartPulse, Sparkles, Settings, Sprout, Car, Truck, Building2, Target, X, Coins } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export function BottomNav() {
  const pathname = usePathname();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const mainTabs = [
    { key: 'home', href: '/home', label: 'Home', icon: Home },
    { key: 'money', href: '/money', label: 'Money', icon: Wallet },
    { key: 'wealth', href: '/wealth', label: 'Wealth', icon: PiggyBank },
    { key: 'calendar', href: '/calendar', label: 'Calendar', icon: Calendar },
  ];

  const moreItems = [
    { href: '/gold-loans', label: '🥇 Sona Girvi & Gold Loans', icon: Coins, desc: '75% LTV, Karat calc, Barcode seal pouch, Byaaj & OTP NOC' },
    { href: '/family/hisab', label: '🤝 Member Aapsi Hisab-Kitab', icon: Users, desc: 'Samaan lana, cash len-den, running balance & WhatsApp receipt' },
    { href: '/wealth/goals', label: '🎯 Family Goals & Lakshya Hub', icon: Target, desc: 'Education, Shadi, Home & Retirement progress' },
    { href: '/stocks', label: '📈 Stocks & AI Trading Hub', icon: Sparkles, desc: 'AI Top 5 Picks, F&O Heatmap, Academy & Paper Trading' },
    { href: '/rentals', label: '🏠 Rentals, PG & Hostel Manager', icon: Building2, desc: 'Flats, Shops, PG Rooms, Bed Matrix, Sub-meter & Mess' },
    { href: '/firms', label: '🏢 Business Firms & GST', icon: Building2, desc: 'Registered firms, GST, TDS & Family Drawings' },
    { href: '/fleet', label: '🚛 Fleet & Transport Business', icon: Truck, desc: 'Trucks, School Bus, Cabs, Toll/Diesel & ROI' },
    { href: '/agriculture', label: '🌾 Krishi & Agri Land', icon: Sprout, desc: 'Kheti, Theka/Adhiya & Mandi Fasal' },
    { href: '/vehicles', label: '🚗 Personal Garage', icon: Car, desc: 'Car/Bike details, Service & PUC' },
    { href: '/vault', label: 'Documents Vault', icon: FileText, desc: 'Digital insurance & papers' },
    { href: '/family', label: 'Family & Tree', icon: Users, desc: 'Members & vansh hierarchy' },
    { href: '/staff', label: 'Household Staff', icon: Users, desc: 'Maid & Driver attendance/pay' },
    { href: '/cases', label: 'Court Case Tracker', icon: Scale, desc: 'Hearing dates & Wakil fees' },
    { href: '/medical', label: 'Medical Records', icon: HeartPulse, desc: 'Blood group & emergency meds' },
    { href: '/advisor', label: 'AI Advisor', icon: Sparkles, desc: 'Smart savings tips' },
    { href: '/settings/members', label: 'Permissions & Roles', icon: Settings, desc: 'Access control' },
  ];

  return (
    <>
      <nav className="flex items-center justify-around px-2 py-2 bg-paper border-t border-paper-dim shrink-0 z-20">
        {mainTabs.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;

          return (
            <Link
              key={tab.key}
              href={tab.href}
              className="flex flex-col items-center gap-0.5 px-3 py-1 transition-all rounded-lg hover:bg-paper-dim/40"
            >
              <Icon
                size={19}
                className={cn('transition-colors', isActive ? 'text-gold' : 'text-ink-muted')}
                strokeWidth={isActive ? 2.4 : 2}
              />
              <span className={cn('text-[10px] font-medium font-sans', isActive ? 'text-gold font-semibold' : 'text-ink-muted')}>
                {tab.label}
              </span>
            </Link>
          );
        })}

        <button
          type="button"
          onClick={() => setIsMoreOpen(true)}
          className="flex flex-col items-center gap-0.5 px-3 py-1 transition-all rounded-lg hover:bg-paper-dim/40"
        >
          <Menu size={19} className="text-ink-muted" strokeWidth={2} />
          <span className="text-[10px] font-medium font-sans text-ink-muted">More</span>
        </button>
      </nav>

      {isMoreOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-navy-dark/60 backdrop-blur-sm">
          <div className="w-full max-w-[430px] bg-paper rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 border border-paper-dim space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-paper-dim pb-3">
              <h3 className="text-base font-serif font-bold text-ink">All Family Modules</h3>
              <button onClick={() => setIsMoreOpen(false)} className="p-1 rounded-full text-ink-muted hover:text-ink">
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {moreItems.map((it) => {
                const Icon = it.icon;
                return (
                  <Link
                    key={it.href}
                    href={it.href}
                    onClick={() => setIsMoreOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-xl bg-paper-dim/40 hover:bg-paper-dim transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-navy text-gold-soft flex items-center justify-center shrink-0">
                      <Icon size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-ink">{it.label}</p>
                      <p className="text-[10px] text-ink-muted">{it.desc}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
