'use client';

import React from 'react';
import Link from 'next/link';
import { 
  TrendingUp, Users, Building2, Target, ShieldCheck, 
  Sparkles, Smartphone, ArrowRight, CheckCircle2, 
  Briefcase, Landmark, BookOpen, Award, Flame, 
  Cpu, Lock, Database, Sprout, Truck, HeartPulse, 
  ChevronRight, BarChart3, Star, Download, Coins
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 font-sans selection:bg-gold/30 selection:text-white">
      {/* 1. Navigation Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0B0F19]/80 border-b border-slate-800/80 px-4 md:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 via-gold to-amber-600 flex items-center justify-center font-bold text-navy text-xl shadow-lg shadow-amber-500/20">
            ₹
          </div>
          <div>
            <span className="text-base md:text-lg font-black bg-gradient-to-r from-amber-200 via-gold to-emerald-400 bg-clip-text text-transparent tracking-tight">
              Family Wealth & Stock SuperApp
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              Bharat's #1 Vault
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-4">
          <Link
            href="/home"
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 rounded-xl hover:bg-slate-800/60 transition-colors"
          >
            Live Demo
          </Link>
          <Link
            href="/login"
            className="text-xs font-bold text-slate-200 hover:text-white px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-800/50 hover:bg-slate-800 transition-all"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="text-xs font-bold text-navy bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 px-4 py-2 rounded-xl shadow-md shadow-amber-400/20 transition-all active:scale-95 flex items-center gap-1.5"
          >
            <span>Shuru Karein</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-12 pb-20 px-4 md:px-8 max-w-6xl mx-auto text-center space-y-8 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-amber-500/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[250px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-xs font-medium text-slate-300 shadow-inner">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>All-in-One Parivar Finance, Rentals & Stock Market AI Vault</span>
        </div>

        {/* Main Headline */}
        <div className="space-y-4 max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.15]">
            Apne Parivar Ka Pura{' '}
            <span className="bg-gradient-to-r from-amber-300 via-gold to-emerald-400 bg-clip-text text-transparent">
              Hisab, Wealth & Share Market
            </span>{' '}
            Ek Hi Surakshit Jagah
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Samaan lana, cash len-den, flats/PG rent, bachat ke lakshya, zameen ke kagaz aur Share Market seekhne ka Bharat ka pehla complete smart platform.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2">
          <Link
            href="/signup"
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-navy font-black text-sm md:text-base shadow-xl shadow-amber-400/20 hover:shadow-amber-400/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Google Se Free Shuru Karein</span>
          </Link>
          <Link
            href="/home"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl border border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-slate-200 font-bold text-sm md:text-base transition-all flex items-center justify-center gap-2"
          >
            <span>Explore Live Demo App</span>
            <ChevronRight size={18} className="text-slate-400" />
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-xs text-slate-400">
          <div className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-slate-800/40 border border-slate-800">
            <Lock size={14} className="text-emerald-400" />
            <span>Bank-Grade 256-bit RLS</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-slate-800/40 border border-slate-800">
            <Sparkles size={14} className="text-amber-400" />
            <span>Zero-Cost ChatGPT Plugin</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-slate-800/40 border border-slate-800">
            <Smartphone size={14} className="text-blue-400" />
            <span>1-Click PWA Mobile Install</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-slate-800/40 border border-slate-800">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>100% Cloud Auto Backup</span>
          </div>
        </div>
      </section>

      {/* 3. Feature Showcase Section */}
      <section className="py-16 px-4 md:px-8 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
            All-in-One SuperApp Capabilities
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            Parivar Ke Har Zaroorat Ka Smart Solution
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Ghar ke chhote-mote hisab se lekar bade real estate aur stock market trading tak sab kuch ek jagah.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Aapsi Hisab */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
              <Users size={24} />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
              Member Aapsi Hisab-Kitab
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Mummy, Papa ya Bhai ke kehne par saman lana, advance cash dena, aur running balance ka automatic hisab. 1-click me WhatsApp bill receipt share karein.
            </p>
            <div className="pt-2 flex items-center gap-2 text-[11px] font-semibold text-amber-400">
              <Link href="/family/hisab" className="hover:underline flex items-center gap-1">
                Aapsi Hisab Kholein <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Card 2: Rental & PG Hostel */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
              <Building2 size={24} />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
              Rentals & PG Hostel Hub
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Flats, shops, PG rooms, bed matrix, bijli sub-meter calculation, tenant agreement vault aur monthly rent collection ka complete tracking.
            </p>
            <div className="pt-2 flex items-center gap-2 text-[11px] font-semibold text-emerald-400">
              <Link href="/rentals" className="hover:underline flex items-center gap-1">
                Rental Manager Dekhein <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Card 3: Goals Hub */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/40 transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
              <Target size={24} />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
              Family Goals & Lakshya Hub
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Bachhon ki higher education, beti ki shadi, naya ghar, aur retirement savings ko track karein. Milestone deposit aur compounding progress indicator ke sath.
            </p>
            <div className="pt-2 flex items-center gap-2 text-[11px] font-semibold text-blue-400">
              <Link href="/wealth/goals" className="hover:underline flex items-center gap-1">
                Goals Hub Kholein <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Card 4: Gold Loan & Girvi Hub */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-yellow-500/40 transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
              <Coins size={24} />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-yellow-300 transition-colors">
              🥇 Sona Girvi & Gold Loans
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Live Karat valuation (75% LTV), tamper-proof barcode seal pouch, ₹2 saikda byaaj engine, aur OTP-verified return NOC slips.
            </p>
            <div className="pt-2 flex items-center gap-2 text-[11px] font-semibold text-yellow-400">
              <Link href="/gold-loans" className="hover:underline flex items-center gap-1">
                Gold Loan Hub Kholein <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Dedicated Share Market & AI Stock Trading Hub Section */}
      <section className="py-16 px-4 md:px-8 max-w-6xl mx-auto">
        <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-[#111A2E] via-[#0D1527] to-[#0A101E] border border-blue-500/30 shadow-2xl relative overflow-hidden space-y-8">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase text-blue-400 tracking-wider bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                📈 Share Market Intelligence & Learning Hub
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
                Share Market Seekhein, Practice Karein & Grow Karein
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                Bina paise kho-e virtual trading se practice karein, F&O ke risk samjhein aur AI algorithm ki daily market analysis payein.
              </p>
            </div>

            <Link
              href="/stocks"
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-emerald-500 text-white font-bold text-xs md:text-sm shadow-lg shadow-blue-500/20 hover:scale-105 transition-all shrink-0 flex items-center gap-2"
            >
              <Sparkles size={16} />
              <span>Stock Hub Open Karein</span>
            </Link>
          </div>

          {/* Stock Market Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                <TrendingUp size={18} /> Top 30 Live Stocks
              </div>
              <p className="text-[11px] text-slate-400">
                Nifty 50, Sensex, Bank Nifty aur top Indian companies ke real-time rates aur performance.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <Cpu size={18} /> Top 5 AI Stock Picks
              </div>
              <p className="text-[11px] text-slate-400">
                Technical indicators aur valuation ke aadhar par AI curated momentum aur value stocks.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <Briefcase size={18} /> Virtual Paper Trading
              </div>
              <p className="text-[11px] text-slate-400">
                ₹10 Lakh virtual cash ke sath live market me bina risk ke buy & sell orders practice karein.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                <BookOpen size={18} /> F&O & SEBI Academy
              </div>
              <p className="text-[11px] text-slate-400">
                Futures & Options ke risks, SEBI guidelines, aur NISM exam preparation modules.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 8+ Multi-Business & Enterprise Management Suite */}
      <section className="py-16 px-4 md:px-8 max-w-6xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            🏢 Complete Multi-Business Ecosystem
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            8+ Family & Commercial Business Modules
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
            Chahe aapka transport ka kaam ho, kheti-badi ho, rental rooms/hostel ho ya registered firms — sabhi businesses ka profit-loss aur cashflow ek hi dashboard par.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Business 1: Rentals & Hostel */}
          <Link href="/rentals" className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 transition-all space-y-3 group block">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
              <Building2 size={20} />
            </div>
            <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
              1. Rentals, PG & Hostel
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Bed Matrix, Flats, Sub-meter bijli calculation, monthly rent receipt aur tenant background check.
            </p>
          </Link>

          {/* Business 2: Fleet & Transport */}
          <Link href="/fleet" className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 transition-all space-y-3 group block">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
              <Truck size={20} />
            </div>
            <h4 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
              2. Fleet & Transport Business
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Trucks, School Bus, Cabs ka diesel, toll kharcha, trip net profit aur vehicle lifetime ROI.
            </p>
          </Link>

          {/* Business 3: Business Firms & GST */}
          <Link href="/firms" className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/50 transition-all space-y-3 group block">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
              <Briefcase size={20} />
            </div>
            <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
              3. Registered Firms & GST
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Proprietorship, Partnership, GST collection, TDS deduction aur parivar ke members ki drawings.
            </p>
          </Link>

          {/* Business 4: Krishi & Agri Land */}
          <Link href="/agriculture" className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 transition-all space-y-3 group block">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
              <Sprout size={20} />
            </div>
            <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
              4. Krishi & Agri Land
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Kheti fasal cycles (Rabi/Kharif), Theka/Adhiya contract farming aur mandi rate selling calculation.
            </p>
          </Link>

          {/* Business 5: Court & Legal Cases */}
          <Link href="/cases" className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-rose-500/50 transition-all space-y-3 group block">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
              <Landmark size={20} />
            </div>
            <h4 className="text-sm font-bold text-white group-hover:text-rose-300 transition-colors">
              5. Court Case & Legal Tracker
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Zameen/Property court cases, hearing dates, order copies aur Vakil ki fee payment ledger.
            </p>
          </Link>

          {/* Business 6: Staff & Payroll */}
          <Link href="/staff" className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 transition-all space-y-3 group block">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
              <Users size={20} />
            </div>
            <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
              6. Household & Staff Payroll
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Driver, Maid, Cook, Security guard daily attendance, monthly salary aur advance payment tracking.
            </p>
          </Link>

          {/* Business 7: Personal Garage & Vehicles */}
          <Link href="/vehicles" className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-yellow-500/50 transition-all space-y-3 group block">
            <div className="w-10 h-10 rounded-2xl bg-yellow-500/10 text-yellow-400 flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
              <Sparkles size={20} />
            </div>
            <h4 className="text-sm font-bold text-white group-hover:text-yellow-300 transition-colors">
              7. Personal Garage & Vehicles
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Cars, Bikes service logs, insurance expiry, PUC renewal aur monthly maintenance cost.
            </p>
          </Link>

          {/* Business 8: Encrypted Digital Vault */}
          <Link href="/vault" className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-gold/50 transition-all space-y-3 group block">
            <div className="w-10 h-10 rounded-2xl bg-gold/10 text-gold flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
              <Lock size={20} />
            </div>
            <h4 className="text-sm font-bold text-white group-hover:text-gold transition-colors">
              8. Encrypted Digital Vault
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Zameen registry, Insurance policies, Gold purchase bills aur Wasiyat/Will ka secure digital vault.
            </p>
          </Link>
        </div>
      </section>

      {/* 6. PWA Mobile App Download & Final CTA */}
      <section className="py-16 px-4 md:px-8 max-w-4xl mx-auto text-center space-y-6">
        <div className="p-8 rounded-3xl bg-gradient-to-r from-amber-500/15 via-gold/20 to-emerald-500/15 border-2 border-gold/40 space-y-5">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gold/20 text-gold flex items-center justify-center font-bold text-2xl border border-gold/40">
            📱
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Apne Mobile Par 1 Click Me Install Karein
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
              Play Store ki zaroorat nahi hai. Apne phone browser me <b>"Add to Home Screen"</b> dabayein aur app ki tarah use karein.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/signup"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gold hover:bg-amber-300 text-navy font-bold text-sm shadow-xl shadow-amber-400/20 transition-all flex items-center justify-center gap-2"
            >
              <span>Get Started Free with Google</span>
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/home"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-slate-700 bg-slate-800/80 text-slate-200 font-semibold text-sm hover:bg-slate-800 transition-all"
            >
              Explore Demo Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="border-t border-slate-800/80 py-8 px-4 md:px-8 max-w-6xl mx-auto text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gold/20 text-gold flex items-center justify-center font-bold text-xs">
            ₹
          </div>
          <span className="font-semibold text-slate-400">Family Wealth & Stock SuperApp</span>
          <span>• Bharat</span>
        </div>

        <div className="flex items-center gap-4 flex-wrap justify-center">
          <Link href="/home" className="hover:text-slate-300">Dashboard</Link>
          <Link href="/family/hisab" className="hover:text-slate-300">Aapsi Hisab</Link>
          <Link href="/rentals" className="hover:text-slate-300">Rentals & PG</Link>
          <Link href="/wealth/goals" className="hover:text-slate-300">Goals Hub</Link>
          <Link href="/stocks" className="hover:text-slate-300">Stock Academy</Link>
          <Link href="/login" className="hover:text-slate-300">Login</Link>
        </div>

        <p className="text-[11px] text-slate-600">
          © {new Date().getFullYear()} Family Wealth SuperApp. 100% Encrypted & Secure.
        </p>
      </footer>
    </div>
  );
}
