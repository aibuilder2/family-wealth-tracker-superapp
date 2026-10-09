'use client';

import React, { useEffect, useRef, useState, memo } from 'react';

export interface AiChartBreakoutOverlay {
  breakoutResistance?: number;
  demandSupport?: number;
  target1?: number;
  target2?: number;
  fibGoldenZone?: number;
  currentPrice?: number;
  signal?: string;
  verdict?: string;
}

interface TradingViewWidgetProps {
  symbol?: string; // e.g. 'NSE:NIFTY', 'BSE:SENSEX', 'NSE:BANKNIFTY', 'NSE:RELIANCE'
  height?: number | string;
  theme?: 'light' | 'dark';
  aiBreakout?: AiChartBreakoutOverlay;
}

const POPULAR_CHART_SYMBOLS = [
  { label: 'सेंसेक्स (SENSEX)', sym: 'BSE:SENSEX' },
  { label: 'निफ्टी 50 (NIFTY)', sym: 'NSE:NIFTY' },
  { label: 'बैंकनिफ्टी (BANKNIFTY)', sym: 'NSE:BANKNIFTY' },
  { label: 'HDFC बैंक', sym: 'NSE:HDFCBANK' },
  { label: 'रिलायंस', sym: 'NSE:RELIANCE' },
  { label: 'टाटा मोटर्स', sym: 'NSE:TATAMOTORS' },
  { label: 'ज़ोमैटो (ETERNAL)', sym: 'NSE:ETERNAL' },
  { label: 'सुजलॉन', sym: 'NSE:SUZLON' },
  { label: 'ITC', sym: 'NSE:ITC' },
];

function normalizeTvSymbol(sym: string): string {
  let s = (sym || 'BSE:SENSEX').toUpperCase().trim();
  if (s.includes('NIFTY 50') || s === '^NSEI' || s === 'NIFTY') return 'NSE:NIFTY';
  if (s.includes('BANKNIFTY') || s.includes('NIFTY BANK') || s === '^NSEBANK') return 'NSE:BANKNIFTY';
  if (s.includes('SENSEX') || s === '^BSESN') return 'BSE:SENSEX';
  if (s.includes('BANKEX')) return 'BSE:BANKEX';
  if (s.includes('TATAMOTORS') || s.includes('TATA MOTORS') || s.includes('TMCV')) return 'NSE:TATAMOTORS';
  if (s.includes('ZOMATO') || s.includes('ETERNAL')) return 'NSE:ETERNAL';
  if (s.includes('HDFC BANK') || s.includes('HDFCBANK')) return 'NSE:HDFCBANK';
  if (s.includes('SUZLON')) return 'NSE:SUZLON';
  if (s.includes('ITC')) return 'NSE:ITC';
  if (s.includes('RELIANCE')) return 'NSE:RELIANCE';
  if (s.startsWith('NSE:') || s.startsWith('BSE:')) return s.replace(/\s+/g, '');
  return `NSE:${s.replace(/\s+/g, '')}`;
}

function TradingViewWidgetComponent({
  symbol = 'BSE:SENSEX',
  height = 480,
  theme = 'light',
  aiBreakout
}: TradingViewWidgetProps) {
  const [activeSymbol, setActiveSymbol] = useState(() => normalizeTvSymbol(symbol));
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync when prop changes
  useEffect(() => {
    setActiveSymbol(normalizeTvSymbol(symbol));
  }, [symbol]);

  // Embed official TradingView Advanced Real-Time Chart widget
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = '';

    const widgetDiv = document.createElement('div');
    widgetDiv.className = 'tradingview-widget-container__widget';
    widgetDiv.style.height = '100%';
    widgetDiv.style.width = '100%';
    container.appendChild(widgetDiv);

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: activeSymbol,
      interval: 'D',
      timezone: 'Asia/Kolkata',
      theme: theme,
      style: '1',
      locale: 'in',
      enable_publishing: false,
      allow_symbol_change: true,
      calendar: false,
      support_host: 'https://www.tradingview.com'
    });

    container.appendChild(script);

    return () => {
      container.innerHTML = '';
    };
  }, [activeSymbol, theme]);

  const heightStyle = typeof height === 'number' ? `${height}px` : height;

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-paper-dim bg-paper shadow-sm space-y-0">
      {/* 1. Header with Symbol, Quick Switch Chips & Status */}
      <div className="px-3.5 py-2.5 bg-paper-subtle border-b border-paper-dim space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-bold text-ink flex items-center gap-1.5">
              <span>📈 लाइव कैंडलस्टिक चार्ट:</span>
              <span className="px-2 py-0.5 rounded-md bg-blue-600/15 text-blue-700 dark:text-blue-300 font-mono text-[11px] font-bold">
                {activeSymbol}
              </span>
            </span>
            {aiBreakout?.signal && (
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-bold text-[10px] border border-emerald-500/30">
                AI: {aiBreakout.signal}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <a 
              href={`https://in.tradingview.com/chart/?symbol=${encodeURIComponent(activeSymbol)}`}
              target="_blank" 
              rel="noreferrer"
              className="text-[10px] font-bold text-blue-600 hover:underline"
            >
              TradingView में बड़ा चार्ट ↗
            </a>
          </div>
        </div>

        {/* Quick 1-Click Chart Switcher Bar */}
        <div className="flex flex-wrap items-center gap-1 pt-1 border-t border-paper-dim/60">
          <span className="text-[10px] text-ink-muted font-medium mr-1">तुरंत चार्ट बदलें:</span>
          {POPULAR_CHART_SYMBOLS.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveSymbol(s.sym)}
              className={`text-[10px] px-2 py-0.5 rounded-md font-medium transition-all cursor-pointer ${
                activeSymbol === s.sym
                  ? 'bg-navy text-white font-bold shadow-xs'
                  : 'bg-paper text-ink-muted hover:text-ink hover:bg-emerald-500/10 border border-paper-dim'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. AI Breakout & Technical HUD Ribbon (Overlaid directly above chart) */}
      {aiBreakout && (
        <div className="bg-navy text-paper px-3.5 py-2.5 border-b border-white/10 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] font-extrabold text-gold flex items-center gap-1">
              <span>🤖 श्री वेल्थ AI चार्ट ब्रेकआउट लेवल्स (Live Chart Overlay)</span>
            </span>
            {aiBreakout.verdict && (
              <span className="text-[10px] text-paper-muted">
                विश्लेषण: <strong className="text-paper">{aiBreakout.verdict}</strong>
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px]">
            {/* Breakout Resistance */}
            {aiBreakout.breakoutResistance && (
              <div className="bg-white/5 border border-emerald-500/30 rounded-lg p-1.5 text-center">
                <span className="text-[9px] text-emerald-400 block font-semibold uppercase">🚀 ब्रेकआउट ट्रिगर</span>
                <span className="font-mono font-black text-xs text-paper block mt-0.5">
                  ₹{aiBreakout.breakoutResistance.toLocaleString('en-IN')}
                </span>
                <span className="text-[8px] text-emerald-300">इसके ऊपर फ्रेश तेजी</span>
              </div>
            )}

            {/* Demand Support / Stoploss */}
            {aiBreakout.demandSupport && (
              <div className="bg-white/5 border border-rose-500/30 rounded-lg p-1.5 text-center">
                <span className="text-[9px] text-rose-400 block font-semibold uppercase">🛡️ सपोर्ट / स्टॉपलॉस</span>
                <span className="font-mono font-black text-xs text-paper block mt-0.5">
                  ₹{aiBreakout.demandSupport.toLocaleString('en-IN')}
                </span>
                <span className="text-[8px] text-rose-300">सुरक्षा रेखा</span>
              </div>
            )}

            {/* Target 1 */}
            {aiBreakout.target1 && (
              <div className="bg-white/5 border border-blue-500/30 rounded-lg p-1.5 text-center">
                <span className="text-[9px] text-blue-400 block font-semibold uppercase">🎯 AI लक्ष्य (T1)</span>
                <span className="font-mono font-black text-xs text-paper block mt-0.5">
                  ₹{aiBreakout.target1.toLocaleString('en-IN')}
                </span>
                <span className="text-[8px] text-blue-300">पहला स्तर</span>
              </div>
            )}

            {/* Target 2 */}
            {aiBreakout.target2 && (
              <div className="bg-white/5 border border-purple-500/30 rounded-lg p-1.5 text-center">
                <span className="text-[9px] text-purple-400 block font-semibold uppercase">🚀 महा लक्ष्य (T2)</span>
                <span className="font-mono font-black text-xs text-paper block mt-0.5">
                  ₹{aiBreakout.target2.toLocaleString('en-IN')}
                </span>
                <span className="text-[8px] text-purple-300">एक्सटेंशन स्तर</span>
              </div>
            )}

            {/* Fibonacci 0.618 Golden Zone */}
            {aiBreakout.fibGoldenZone && (
              <div className="bg-white/5 border border-amber-500/30 rounded-lg p-1.5 text-center">
                <span className="text-[9px] text-amber-400 block font-semibold uppercase">📐 फिबोनाची 0.618</span>
                <span className="font-mono font-black text-xs text-paper block mt-0.5">
                  ₹{aiBreakout.fibGoldenZone.toLocaleString('en-IN')}
                </span>
                <span className="text-[8px] text-amber-300">गोल्डन रिवर्सल बेस</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. Official TradingView Advanced Real-Time Chart Container */}
      <div 
        style={{ height: heightStyle }}
        className="w-full relative bg-paper-dim/10"
        ref={containerRef}
      >
        <div className="w-full h-full flex items-center justify-center text-xs text-ink-muted">
          चार्ट लोड हो रहा है... ({activeSymbol})
        </div>
      </div>
    </div>
  );
}

export const TradingViewWidget = memo(TradingViewWidgetComponent);
