'use client';

import React, { useEffect, useState } from 'react';
import { Download, X, Sparkles, Smartphone, Check } from 'lucide-react';

export default function PWAProvider({ children }: { children: React.ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // 1. Register Service Worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('PWA ServiceWorker registered with scope:', reg.scope);
        })
        .catch((err) => {
          console.warn('PWA ServiceWorker registration failed:', err);
        });
    }

    // 2. Check if already installed
    if (typeof window !== 'undefined') {
      if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true) {
        setIsInstalled(true);
      }
    }

    // 3. Listen for PWA Install Prompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Check if user dismissed banner recently
      const dismissed = localStorage.getItem('pwa_banner_dismissed');
      if (!dismissed) {
        setShowInstallBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowInstallBanner(false);
      setDeferredPrompt(null);
      console.log('SuperApp PWA installed successfully!');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Manual instruction for iOS / Safari
      alert('Mobile me Install karne ke liye:\n1. Safari/Browser me "Share" icon (↑) dabayein.\n2. "Add to Home Screen" (+) select karein!');
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log('User response to install prompt:', outcome);
    setDeferredPrompt(null);
    setShowInstallBanner(false);
  };

  const handleDismiss = () => {
    setShowInstallBanner(false);
    localStorage.setItem('pwa_banner_dismissed', 'true');
  };

  return (
    <>
      {children}

      {/* Floating Install App Banner for Mobile & Desktop */}
      {showInstallBanner && !isInstalled && (
        <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:max-w-sm z-50 animate-in slide-in-from-bottom-5 duration-500">
          <div className="bg-[#10263A] border-2 border-[#B98B2A] rounded-2xl p-4 shadow-2xl backdrop-blur-xl relative overflow-hidden flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#B98B2A] to-[#E5C378] p-0.5 shrink-0 shadow-md">
                <div className="w-full h-full bg-[#10263A] rounded-[10px] flex items-center justify-center text-xl font-black text-[#E5C378]">
                  ₹
                </div>
              </div>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  Install SuperApp <Sparkles className="w-3 h-3 text-[#E5C378]" />
                </h4>
                <p className="text-[11px] text-slate-300">
                  Apne phone ya laptop par direct app download karein!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handleInstallClick}
                className="px-3.5 py-2 rounded-xl bg-[#B98B2A] hover:bg-[#c59a35] text-slate-950 font-black text-xs flex items-center gap-1 shadow-md transition-all active:scale-95"
              >
                <Download className="w-3.5 h-3.5" /> Install
              </button>
              <button
                onClick={handleDismiss}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
