'use client';

import React, { memo } from 'react';

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

function TradingViewWidgetComponent({
  symbol = 'NSE:NIFTY',
  height = 480,
  theme = 'light',
  aiBreakout
}: TradingViewWidgetProps) {
  // Normalize symbol for TradingView
  const cleanSymbol = (() => {
    let s = (symbol || 'NSE:NIFTY').toUpperCase().trim();
    if (s.includes('NIFTY 50') || s === '^NSEI' || s === 'NIFTY') return 'NSE:NIFTY';
    if (s.includes('BANKNIFTY') || s.includes('NIFTY BANK') || s === '^NSEBANK') return 'NSE:BANKNIFTY';
    if (s.includes('SENSEX') || s === '^BSESN') return 'BSE:SENSEX';
    if (s.includes('BANKEX')) return 'BSE:BANKEX';
    if (s.includes('TATAMOTORS') || s.includes('TATA MOTORS')) return 'NSE:TATAMOTORS';
    if (s.startsWith('NSE:') || s.startsWith('BSE:')) return s;
    return `NSE:${s}`;
  })();

  const heightStyle = typeof height === 'number' ? `${height}px` : height;
  const iframeUrl = `https://s.tradingview.com/widgetembed/?symbol=${encodeURIComponent(cleanSymbol)}&interval=D&symboledit=1&saveimage=1&toolbarbg=f1f3f6&studies=%5B%22RSI%40tv-basicstudies%22%2C%22MACD%40tv-basicstudies%22%5D&theme=${theme}&style=1&timezone=Asia%2FKolkata&locale=in`;

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-paper-dim bg-paper shadow-sm space-y-0">
      {/* 1. Header with Symbol & Live Status */}
      <div className="px-3.5 py-2.5 bg-paper-subtle border-b border-paper-dim flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-bold text-ink flex items-center gap-1.5">
            <span>📈 लाइव कैंडलस्टिक चार्ट:</span>
            <span className="px-2 py-0.5 rounded-md bg-blue-600/15 text-blue-700 dark:text-blue-300 font-mono text-[11px] font-bold">
              {cleanSymbol}
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
            href={`https://in.tradingview.com/symbols/${cleanSymbol.replace(':', '-')}/`}
            target="_blank" 
            rel="noreferrer"
            className="text-[10px] font-bold text-blue-600 hover:underline"
          >
            TradingView फुलस्क्रीन ↗
          </a>
        </div>
      </div>

      {/* 2. AI Breakout & Technical HUD Ribbon (Overlaid directly above chart) */}
      {aiBreakout && (
        <div className="bg-navy text-paper px-3.5 py-2.5 border-b border-white/10 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] font-extrabold text-gold flex items-center gap-1">
              <span>🤖 श्री वेल्थ AI चार्ट ब्रेकआउट लेवल्स (Live Levels for Chart Overlay)</span>
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
                <span className="text-[9px] text-emerald-400 block font-semibold uppercase">🚀 ब्रेकआउट ट्रिगर लाइन</span>
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
                <span className="text-[8px] text-rose-300">सुरक्षा फ्लोर रेखा</span>
              </div>
            )}

            {/* Target 1 */}
            {aiBreakout.target1 && (
              <div className="bg-white/5 border border-blue-500/30 rounded-lg p-1.5 text-center">
                <span className="text-[9px] text-blue-400 block font-semibold uppercase">🎯 AI लक्ष्य (Target 1)</span>
                <span className="font-mono font-black text-xs text-paper block mt-0.5">
                  ₹{aiBreakout.target1.toLocaleString('en-IN')}
                </span>
                <span className="text-[8px] text-blue-300">पहला मुनाफा स्तर</span>
              </div>
            )}

            {/* Target 2 */}
            {aiBreakout.target2 && (
              <div className="bg-white/5 border border-purple-500/30 rounded-lg p-1.5 text-center">
                <span className="text-[9px] text-purple-400 block font-semibold uppercase">🚀 महा लक्ष्य (Target 2)</span>
                <span className="font-mono font-black text-xs text-paper block mt-0.5">
                  ₹{aiBreakout.target2.toLocaleString('en-IN')}
                </span>
                <span className="text-[8px] text-purple-300">ब्रेकआउट एक्सटेंशन</span>
              </div>
            )}

            {/* Fibonacci 0.618 Golden Zone */}
            {aiBreakout.fibGoldenZone && (
              <div className="bg-white/5 border border-amber-500/30 rounded-lg p-1.5 text-center">
                <span className="text-[9px] text-amber-400 block font-semibold uppercase">📐 फाइबोनैचि 0.618 गोल्डन जोन</span>
                <span className="font-mono font-black text-xs text-paper block mt-0.5">
                  ₹{aiBreakout.fibGoldenZone.toLocaleString('en-IN')}
                </span>
                <span className="text-[8px] text-amber-300">सटीक रिवर्सल बाउंस स्तर</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. Direct TradingView Chart Iframe (Always Loads 100% Reliably) */}
      <div 
        style={{ height: heightStyle }}
        className="w-full relative bg-paper-dim/10"
      >
        <iframe
          src={iframeUrl}
          style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
          title={`TradingView Chart - ${cleanSymbol}`}
          loading="lazy"
          allowFullScreen
        />
      </div>
    </div>
  );
}

export const TradingViewWidget = memo(TradingViewWidgetComponent);
