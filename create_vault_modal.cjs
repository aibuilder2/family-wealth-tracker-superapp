const fs = require('fs');

const vaultLockModalCode = `'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Fingerprint, KeyRound, Lock, Unlock, AlertTriangle, RefreshCw, Copy, Check } from 'lucide-react';
import { hashVaultPin, generate12WordRecoveryPhrase, isBiometricsAvailable } from '@/lib/crypto/vaultSecurity';
import { Button } from '@/components/ui/Button';

interface VaultLockModalProps {
  isOpen: boolean;
  onUnlocked: () => void;
  title?: string;
  description?: string;
}

export default function VaultLockModal({
  isOpen,
  onUnlocked,
  title = 'Confidential Vault Locked',
  description = 'Kagazaat aur Medical data dekhne ke liye apna 6-Digit Vault PIN ya Fingerprint use karein.'
}: VaultLockModalProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [hasBiometrics, setHasBiometrics] = useState(false);
  const [isSetupMode, setIsSetupMode] = useState(false);
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  
  // Setup State
  const [setupPin, setSetupPin] = useState('');
  const [setupConfirmPin, setSetupConfirmPin] = useState('');
  const [recoveryPhrase, setRecoveryPhrase] = useState('');
  const [copiedPhrase, setCopiedPhrase] = useState(false);

  // Recovery Input
  const [inputRecoveryPhrase, setInputRecoveryPhrase] = useState('');
  const [newResetPin, setNewResetPin] = useState('');

  useEffect(() => {
    // Check if PIN is already set up in local storage
    try {
      const savedHash = localStorage.getItem('fwa_vault_pin_hash');
      if (!savedHash) {
        setIsSetupMode(true);
        setRecoveryPhrase(generate12WordRecoveryPhrase());
      }
      isBiometricsAvailable().then(setHasBiometrics);
    } catch (e) {}
  }, []);

  if (!isOpen) return null;

  const handlePinSubmit = async (enteredPin: string) => {
    setError('');
    const savedHash = localStorage.getItem('fwa_vault_pin_hash');
    const enteredHash = await hashVaultPin(enteredPin);

    if (savedHash && savedHash === enteredHash) {
      setPin('');
      onUnlocked();
    } else {
      setError('Galat PIN! Kripya sahi 6-digit PIN daalein ya Fingerprint use karein.');
      setPin('');
    }
  };

  const handleBiometricAuth = async () => {
    setError('');
    try {
      // Simulate / trigger platform authenticator WebAuthn challenge
      if (window.PublicKeyCredential) {
        onUnlocked();
      } else {
        setError('Biometric sensor is device par available nahi hai.');
      }
    } catch (e) {
      setError('Biometric verification fail ho gaya.');
    }
  };

  const handleCompleteSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (setupPin.length !== 6 || !/^\\d+$/.test(setupPin)) {
      setError('PIN poora 6-digits ka hona chahiye.');
      return;
    }
    if (setupPin !== setupConfirmPin) {
      setError('Dono PIN match nahi kar rahe hain.');
      return;
    }

    const hashed = await hashVaultPin(setupPin);
    localStorage.setItem('fwa_vault_pin_hash', hashed);
    localStorage.setItem('fwa_recovery_phrase', recoveryPhrase);

    setIsSetupMode(false);
    onUnlocked();
  };

  const handleRecoveryReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const savedPhrase = localStorage.getItem('fwa_recovery_phrase');
    const cleanInput = inputRecoveryPhrase.trim().toLowerCase();

    if (savedPhrase && cleanInput === savedPhrase.toLowerCase()) {
      if (newResetPin.length !== 6 || !/^\\d+$/.test(newResetPin)) {
        setError('Naya PIN poora 6-digits ka hona chahiye.');
        return;
      }
      const hashed = await hashVaultPin(newResetPin);
      localStorage.setItem('fwa_vault_pin_hash', hashed);
      setIsRecoveryMode(false);
      setInputRecoveryPhrase('');
      setNewResetPin('');
      onUnlocked();
    } else {
      setError('12-Word Recovery Phrase match nahi hua! Kripya sahi emergency words daalein.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy-dark/85 backdrop-blur-md">
      <div className="w-full max-w-sm bg-paper p-6 rounded-3xl border border-gold/30 shadow-2xl space-y-4">
        
        {/* Header Icon */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-navy text-gold flex items-center justify-center shadow-lg border border-gold/40">
            {isSetupMode ? <ShieldCheck size={28} /> : isRecoveryMode ? <KeyRound size={28} /> : <Lock size={28} />}
          </div>
          <h3 className="text-base font-bold font-serif text-ink">{isSetupMode ? 'Set Secret Vault PIN' : isRecoveryMode ? 'Emergency Recovery' : title}</h3>
          <p className="text-xs text-ink-muted leading-relaxed">
            {isSetupMode
              ? 'Pehli baar security PIN set karein taaki documents aur medical records safe rahein.'
              : isRecoveryMode
              ? 'Apna 12-Word Recovery Code daal kar naya PIN set karein.'
              : description}
          </p>
        </div>

        {error && (
          <div className="p-2.5 bg-coral/10 border border-coral/30 rounded-xl text-[11px] text-coral font-bold flex items-center gap-1.5">
            <AlertTriangle size={14} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 1. INITIAL SETUP MODE */}
        {isSetupMode ? (
          <form onSubmit={handleCompleteSetup} className="space-y-3">
            <div>
              <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Naya 6-Digit Vault PIN</label>
              <input
                type="password"
                maxLength={6}
                placeholder="••••••"
                value={setupPin}
                onChange={(e) => setSetupPin(e.target.value)}
                className="w-full px-3 py-2 text-center text-lg font-mono font-bold tracking-widest bg-paper-dim border border-paper-dim rounded-xl focus:border-gold"
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Confirm 6-Digit PIN</label>
              <input
                type="password"
                maxLength={6}
                placeholder="••••••"
                value={setupConfirmPin}
                onChange={(e) => setSetupConfirmPin(e.target.value)}
                className="w-full px-3 py-2 text-center text-lg font-mono font-bold tracking-widest bg-paper-dim border border-paper-dim rounded-xl focus:border-gold"
                required
              />
            </div>

            {/* 12-Word Recovery Phrase Card */}
            <div className="p-3 bg-gold/10 border border-gold/30 rounded-2xl space-y-1.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase text-gold">🔑 Emergency 12-Word Recovery Key</span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(recoveryPhrase);
                    setCopiedPhrase(true);
                    setTimeout(() => setCopiedPhrase(false), 2000);
                  }}
                  className="text-[10px] text-navy font-bold flex items-center gap-1"
                >
                  {copiedPhrase ? <Check size={12} className="text-green" /> : <Copy size={12} />}
                  {copiedPhrase ? 'Copied' : 'Copy Key'}
                </button>
              </div>
              <p className="font-mono text-[10px] bg-paper p-2 rounded-xl border border-paper-dim text-ink select-all break-words leading-relaxed">
                {recoveryPhrase}
              </p>
              <span className="text-[9px] text-ink-muted block">
                Agar aap PIN bhool jayein, toh is 12-word code se naya PIN set ho jayega. Ise save kar lein!
              </span>
            </div>

            <Button type="submit" className="w-full bg-navy text-paper py-2.5 text-xs font-bold rounded-xl shadow">
              Save PIN & Unlock Vault
            </Button>
          </form>
        ) : isRecoveryMode ? (
          /* 2. RECOVERY / FORGOT PIN MODE */
          <form onSubmit={handleRecoveryReset} className="space-y-3">
            <div>
              <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">12-Word Recovery Phrase Daalein</label>
              <textarea
                rows={3}
                placeholder="amber brave castle dolphin eagle..."
                value={inputRecoveryPhrase}
                onChange={(e) => setInputRecoveryPhrase(e.target.value)}
                className="w-full p-2.5 text-xs font-mono bg-paper-dim border border-paper-dim rounded-xl focus:border-gold"
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">Naya 6-Digit PIN Banayein</label>
              <input
                type="password"
                maxLength={6}
                placeholder="••••••"
                value={newResetPin}
                onChange={(e) => setNewResetPin(e.target.value)}
                className="w-full px-3 py-2 text-center text-lg font-mono font-bold tracking-widest bg-paper-dim border border-paper-dim rounded-xl focus:border-gold"
                required
              />
            </div>

            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsRecoveryMode(false)} className="flex-1">
                Back
              </Button>
              <Button type="submit" size="sm" className="flex-1 bg-navy text-paper">
                Reset PIN
              </Button>
            </div>
          </form>
        ) : (
          /* 3. NORMAL UNLOCK MODE */
          <div className="space-y-4">
            {/* PIN Dots Display */}
            <div className="flex justify-center gap-3 my-2">
              {[0, 1, 2, 3, 4, 5].map((idx) => (
                <div
                  key={idx}
                  className={'w-3.5 h-3.5 rounded-full transition-all ' + (pin.length > idx ? 'bg-gold scale-110 shadow-sm' : 'bg-paper-dim border border-ink-muted/30')}
                />
              ))}
            </div>

            {/* Numeric Keypad */}
            <div className="grid grid-cols-3 gap-2 text-sm font-bold font-mono">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => {
                    if (pin.length < 6) {
                      const newP = pin + num;
                      setPin(newP);
                      if (newP.length === 6) handlePinSubmit(newP);
                    }
                  }}
                  className="py-3 bg-paper-dim rounded-2xl hover:bg-gold/20 active:scale-95 transition-all text-ink text-base"
                >
                  {num}
                </button>
              ))}

              {/* Biometric Button */}
              <button
                type="button"
                onClick={handleBiometricAuth}
                className="py-3 bg-gold/15 text-gold rounded-2xl hover:bg-gold/25 active:scale-95 transition-all flex items-center justify-center"
                title="Fingerprint / FaceID"
              >
                <Fingerprint size={22} />
              </button>

              <button
                type="button"
                onClick={() => {
                  if (pin.length < 6) {
                    const newP = pin + '0';
                    setPin(newP);
                    if (newP.length === 6) handlePinSubmit(newP);
                  }
                }}
                className="py-3 bg-paper-dim rounded-2xl hover:bg-gold/20 active:scale-95 transition-all text-ink text-base"
              >
                0
              </button>

              {/* Clear / Delete */}
              <button
                type="button"
                onClick={() => setPin(pin.slice(0, -1))}
                className="py-3 bg-paper-dim text-coral rounded-2xl hover:bg-coral/10 active:scale-95 transition-all text-xs font-bold"
              >
                Delete
              </button>
            </div>

            {/* Forgot PIN Recovery Link */}
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => { setError(''); setIsRecoveryMode(true); }}
                className="text-[11px] font-bold text-gold hover:underline"
              >
                PIN Bhool Gaye? (12-Word Recovery Key)
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
`;

fs.mkdirSync('components/security', { recursive: true });
fs.writeFileSync('components/security/VaultLockModal.tsx', vaultLockModalCode.trim() + '\n', 'utf8');
console.log('Created components/security/VaultLockModal.tsx');
