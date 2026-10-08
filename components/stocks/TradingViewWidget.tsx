'use client';

import React, { useEffect, useRef, memo } from 'react';

interface TradingViewWidgetProps {
  symbol?: string; // e.g. 'NSE:NIFTY', 'BSE:SENSEX', 'NSE:BANKNIFTY', 'NSE:RELIANCE'
  height?: number | string;
  theme?: 'light' | 'dark';
}

function TradingViewWidgetComponent({
  symbol = 'NSE:NIFTY',
  height = 480,
  theme = 'light'
}: TradingViewWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Normalize symbol for TradingView
  const cleanSymbol = (() => {
    const s = (symbol || 'NSE:NIFTY').toUpperCase().trim();
    if (s.includes('NIFTY 50') || s === '^NSEI' || s === 'NIFTY') return 'NSE:NIFTY';
    if (s.includes('BANKNIFTY') || s.includes('NIFTY BANK') || s === '^NSEBANK') return 'NSE:BANKNIFTY';
    if (s.includes('SENSEX') || s === '^BSESN') return 'BSE:SENSEX';
    if (s.includes('BANKEX')) return 'BSE:BANKEX';
    if (s.includes(':')) return s;
    return `NSE:${s}`;
  })();

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous widget
    containerRef.current.innerHTML = '';

    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'tradingview-widget-container__widget';
    widgetContainer.style.height = '100%';
    widgetContainer.style.width = '100%';
    containerRef.current.appendChild(widgetContainer);

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: cleanSymbol,
      interval: 'D',
      timezone: 'Asia/Kolkata',
      theme: theme,
      style: '1', // Candlestick style
      locale: 'in',
      enable_publishing: false,
      allow_symbol_change: true,
      calendar: false,
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: true,
      studies: [
        'RSI@tv-basicstudies',
        'MACD@tv-basicstudies',
        'MASimple@tv-basicstudies'
      ],
      support_host: 'https://www.tradingview.com'
    });

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [cleanSymbol, theme]);

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-paper-dim bg-paper shadow-sm">
      <div className="px-3.5 py-2 bg-paper-subtle border-b border-paper-dim flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-bold text-ink flex items-center gap-1.5">
            <span>📈 लाइव इंटरैक्टिव कैंडलस्टिक चार्ट:</span>
            <span className="px-2 py-0.5 rounded-md bg-blue-600/15 text-blue-700 dark:text-blue-300 font-mono text-[11px] font-bold">
              {cleanSymbol}
            </span>
          </span>
        </div>
        <span className="text-[10px] text-ink-muted hidden sm:inline">
          फिबोनाची (Fibonacci) • ब्रेकआउट ट्रेंडलाइन • RSI व MACD टूल्स उपलब्ध
        </span>
      </div>

      <div 
        ref={containerRef} 
        style={{ height: typeof height === 'number' ? `${height}px` : height }}
        className="w-full relative"
      />
    </div>
  );
}

export const TradingViewWidget = memo(TradingViewWidgetComponent);
