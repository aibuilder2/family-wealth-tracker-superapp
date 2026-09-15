"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, TrendingUp, Cpu, Briefcase, Bitcoin, BookOpen, Newspaper, PieChart, Landmark, Layers, Flame, Filter, Bell, Menu, X, Lightbulb, Eye, Award, Target } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Ek chota NavItem component taaki active tab automatically highlight ho jaye
  const NavItem = ({ path, label, Icon, activeColor = "text-blue-400" }: { path: string, label: string, Icon: any, activeColor?: string }) => {
    const isActive = pathname === path;
    return (
      <Link 
        href={path} 
        onClick={() => setIsOpen(false)}
        className={`group flex items-center gap-3 p-3 rounded-xl transition-all ${
          isActive 
            ? 'text-slate-100 bg-blue-500/10 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.15)]' 
            : 'hover:text-slate-100 hover:bg-slate-800/50 hover:translate-x-1'
        }`}
      >
        <Icon className={`w-5 h-5 transition-colors ${isActive ? activeColor : 'text-slate-400 group-hover:text-slate-300'}`} />
        <span className={`${isActive ? 'text-slate-100 font-semibold tracking-wide' : 'text-slate-400 group-hover:text-slate-100 font-medium tracking-wide'}`}>{label}</span>
      </Link>
    );
  };

  const SidebarContent = () => (
    <>
      <div className="p-2 mb-6 mt-2 flex items-center justify-between">
        <h2 className="text-2xl font-black bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent tracking-tight">StockAI Pro</h2>
        <button onClick={() => setIsOpen(false)} className="md:hidden p-1 text-slate-400 hover:text-white transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>
      
      {/* Headings ko zyada visible banane ke liye text-slate-400 lagaya hai */}
      <div className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider px-2">Main Menu</div>
      <nav className="space-y-1.5 flex-1 pb-20 md:pb-0">
        <NavItem path="/dashboard" label="Dashboard" Icon={Home} />
        <NavItem path="/markets" label="Top 30 Stocks" Icon={TrendingUp} activeColor="text-emerald-400" />
        <NavItem path="/screener" label="Screener" Icon={Filter} activeColor="text-cyan-400" />
        <NavItem path="/predictions" label="Top 5 AI Picks" Icon={Cpu} activeColor="text-blue-400" />
        <NavItem path="/paper-trading" label="Paper Trading" Icon={Briefcase} activeColor="text-amber-400" />
        <NavItem path="/crypto" label="Crypto & Altcoins" Icon={Bitcoin} activeColor="text-orange-400" />
        
        <div className="text-xs font-bold text-slate-400 mb-3 mt-8 uppercase tracking-wider pt-6 border-t border-slate-800/80 px-2">
          Research & Tools
        </div>
        
        <NavItem path="/portfolio" label="My Portfolio" Icon={PieChart} activeColor="text-purple-400" />
        <NavItem path="/wealth/goals" label="Goals & Lakshya Hub" Icon={Target} activeColor="text-yellow-400" />
        <NavItem path="/family/hisab" label="Member Aapsi Hisab" Icon={Briefcase} activeColor="text-emerald-400" />
        <NavItem path="/rentals" label="Rentals & PG Hostel" Icon={Landmark} activeColor="text-amber-400" />
        <NavItem path="/watchlist" label="My Watchlist" Icon={Eye} activeColor="text-yellow-400" />
        <NavItem path="/mutual-funds" label="Mutual Funds" Icon={Landmark} activeColor="text-emerald-400" />
        <NavItem path="/news" label="News & Events" Icon={Newspaper} activeColor="text-sky-400" />
        <NavItem path="/sector-analysis" label="Sector Analysis" Icon={Layers} activeColor="text-pink-400" />
        <NavItem path="/trending" label="Trending" Icon={Flame} activeColor="text-orange-500" />
        <NavItem path="/alerts" label="Alerts" Icon={Bell} activeColor="text-red-400" />

        <div className="mt-6 border-t border-slate-800/80 pt-6 space-y-1.5">
          <NavItem path="/learn" label="Learn & Education" Icon={BookOpen} activeColor="text-green-400" />
          <NavItem path="/sebi-exams" label="SEBI & NISM Exams" Icon={Award} activeColor="text-amber-400" />
        </div>
      </nav>
    </>
  );

  return (
    <>
      {/* Mobile Hamburger Button */}
      {/* Is button ko humne Navbar me shift kar diya hai visually, par logic yahi rahega */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed top-9 left-4 z-50 p-1.5 rounded bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700 transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`fixed inset-y-0 left-0 z-[70] w-64 bg-[#0B0F19] shadow-[4px_0_24px_rgba(0,0,0,0.5)] text-slate-400 border-r border-slate-800 h-screen p-4 flex flex-col overflow-y-auto font-sans transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </aside>

      {/* Global Bottom Navigation (Visible on all pages) */}
      <div className="fixed bottom-0 left-0 right-0 z-[90] bg-[#0B0F19]/98 backdrop-blur-xl border-t border-slate-800 flex justify-between items-center px-1 pb-safe w-full">
        <Link href="/dashboard" className={`flex flex-col items-center justify-center flex-1 py-2.5 ${pathname === '/dashboard' ? 'text-blue-500' : 'text-slate-400 hover:text-slate-200 transition-colors'}`}>
          <Home className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-semibold">Home</span>
        </Link>
        <Link href="/markets" className={`flex flex-col items-center justify-center flex-1 py-2.5 ${pathname === '/markets' ? 'text-blue-500' : 'text-slate-400 hover:text-slate-200 transition-colors'}`}>
          <TrendingUp className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-semibold">Markets</span>
        </Link>
        <Link href="/watchlist" className={`flex flex-col items-center justify-center flex-1 py-2.5 ${pathname === '/watchlist' ? 'text-blue-500' : 'text-slate-400 hover:text-slate-200 transition-colors'}`}>
          <Eye className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-semibold">Watchlist</span>
        </Link>
        <Link href="/screener" className={`flex flex-col items-center justify-center flex-1 py-2.5 ${pathname === '/screener' ? 'text-blue-500' : 'text-slate-400 hover:text-slate-200 transition-colors'}`}>
          <Filter className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-semibold">Screener</span>
        </Link>
        <Link href="/predictions" className={`flex flex-col items-center justify-center flex-1 py-2.5 ${pathname === '/predictions' ? 'text-blue-500' : 'text-slate-400 hover:text-slate-200 transition-colors'}`}>
          <Lightbulb className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-semibold">Ideas</span>
        </Link>
        <Link href="/portfolio" className={`flex flex-col items-center justify-center flex-1 py-2.5 ${pathname === '/portfolio' ? 'text-blue-500' : 'text-slate-400 hover:text-slate-200 transition-colors'}`}>
          <PieChart className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-semibold">Portfolio</span>
        </Link>
      </div>
    </>
  );
}