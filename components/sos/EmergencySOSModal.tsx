'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, Volume2, VolumeX, MapPin, Phone, MessageSquare, ShieldCheck, X, Navigation, AlertOctagon, Heart, Pill } from 'lucide-react';
import { useFamilyStore } from '@/lib/store/familyStore';

interface EmergencySOSModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EmergencySOSModal({ isOpen, onClose }: EmergencySOSModalProps) {
  const { currentUser, medicalRecords, family } = useFamilyStore();

  const [coords, setCoords] = useState<{ lat: number; lng: number; accuracy?: number } | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(true);
  const [isSirenPlaying, setIsSirenPlaying] = useState(true);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const sirenIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const vibrationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Find user's medical record
  const userMed = medicalRecords.find(m => m.member_id === currentUser.id) || {
    blood_group: 'O+ Positive',
    allergies: ['None reported'],
    emergency_contact: { name: 'Family Head (Papa Ji)', phone: '+91 98765 43210' }
  };

  // Start siren oscillator using Web Audio API
  const startSiren = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }

      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(750, ctx.currentTime);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      oscRef.current = osc;
      gainRef.current = gain;

      let high = false;
      sirenIntervalRef.current = setInterval(() => {
        if (oscRef.current && audioCtxRef.current) {
          const now = audioCtxRef.current.currentTime;
          const targetFreq = high ? 700 : 960;
          oscRef.current.frequency.exponentialRampToValueAtTime(targetFreq, now + 0.25);
          high = !high;
        }
      }, 350);

      setIsSirenPlaying(true);
    } catch (e) {
      console.warn('Audio Siren Note:', e);
    }
  };

  const stopSiren = () => {
    if (sirenIntervalRef.current) {
      clearInterval(sirenIntervalRef.current);
      sirenIntervalRef.current = null;
    }
    if (oscRef.current) {
      try {
        oscRef.current.stop();
        oscRef.current.disconnect();
      } catch (e) {}
      oscRef.current = null;
    }
    setIsSirenPlaying(false);
  };

  // Haptic vibration
  const triggerHaptic = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([400, 150, 400, 150, 800, 300]);
    }
  };

  // On mount or open
  useEffect(() => {
    if (!isOpen) {
      stopSiren();
      if (vibrationIntervalRef.current) clearInterval(vibrationIntervalRef.current);
      return;
    }

    // 1. Fetch GPS coordinates
    setIsLocating(true);
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: Math.round(pos.coords.accuracy)
          });
          setIsLocating(false);
        },
        (err) => {
          console.warn('GPS error:', err);
          setCoords({ lat: 28.6139, lng: 77.2090, accuracy: 50 });
          setGpsError('GPS permission timeout. Default coordinates use ho rahe hain.');
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setCoords({ lat: 28.6139, lng: 77.2090, accuracy: 50 });
      setIsLocating(false);
    }

    // 2. Start sound siren
    startSiren();

    // 3. Start haptic loop
    triggerHaptic();
    vibrationIntervalRef.current = setInterval(() => {
      triggerHaptic();
    }, 2500);

    return () => {
      stopSiren();
      if (vibrationIntervalRef.current) clearInterval(vibrationIntervalRef.current);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const mapsUrl = coords ? ('https://maps.google.com/?q=' + coords.lat + ',' + coords.lng) : '';

  // WhatsApp broadcast template
  const getWhatsAppMessage = () => {
    const latLngStr = coords ? (coords.lat.toFixed(6) + ', ' + coords.lng.toFixed(6)) : 'Location fetching...';
    const linkStr = mapsUrl || 'Location not available';
    const bloodStr = userMed.blood_group || 'O+';
    const allergyStr = Array.isArray(userMed.allergies) ? userMed.allergies.join(', ') : 'None';

    const text = '🚨 *EMERGENCY SOS ALERT!* 🚨\n\n' +
      '👤 *Name:* ' + currentUser.name + ' (' + currentUser.role + ')\n' +
      '🏠 *Family:* ' + family.name + '\n' +
      '📍 *LIVE GPS Location:* ' + linkStr + '\n' +
      '🌐 *Coordinates:* ' + latLngStr + ' (Accuracy: ~' + (coords ? coords.accuracy : 15) + 'm)\n\n' +
      '🩸 *Blood Group:* ' + bloodStr + '\n' +
      '💊 *Emergency Info:* ' + allergyStr + '\n\n' +
      '⚠️ *Mera turant emergency sampark karein! I need urgent help!*';

    return encodeURIComponent(text);
  };

  const handleSafeAndClose = () => {
    stopSiren();
    if (vibrationIntervalRef.current) clearInterval(vibrationIntervalRef.current);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-[420px] bg-gradient-to-b from-[#1c0808] via-[#150b0b] to-[#0d0909] border-2 border-red-600/60 rounded-3xl shadow-[0_0_50px_rgba(239,68,68,0.4)] text-white overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Emergency Header */}
        <div className="p-4 bg-gradient-to-r from-red-700 via-red-600 to-red-800 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white text-red-700 flex items-center justify-center animate-bounce shadow">
              <AlertTriangle size={18} strokeWidth={2.8} />
            </div>
            <div>
              <h2 className="text-base font-black tracking-wider uppercase flex items-center gap-1.5">
                EMERGENCY SOS
              </h2>
              <p className="text-[10px] text-red-100 font-medium">
                Live Siren & GPS Location Active
              </p>
            </div>
          </div>

          <button
            onClick={handleSafeAndClose}
            className="p-1.5 rounded-full bg-red-900/60 hover:bg-red-900 text-white transition-colors"
            title="Close SOS"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          
          {/* Siren Status & Audio Control Box */}
          <div className="rounded-2xl p-3.5 bg-red-950/60 border border-red-700/40 flex items-center justify-between shadow-inner">
            <div className="flex items-center gap-3">
              <div className={'w-10 h-10 rounded-xl flex items-center justify-center font-bold ' + (isSirenPlaying ? 'bg-red-600 text-white animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.8)]' : 'bg-slate-800 text-slate-400')}>
                {isSirenPlaying ? <Volume2 size={20} className="animate-spin" /> : <VolumeX size={20} />}
              </div>
              <div>
                <p className="text-xs font-bold text-red-200">
                  {isSirenPlaying ? '🔊 Siren Alarm Baj Raha Hai' : '🔇 Siren Audio Muted'}
                </p>
                <p className="text-[10px] text-red-300/80">
                  {isSirenPlaying ? 'Speaker & Vibration Continuous Active' : 'Sound band hai, location active hai'}
                </p>
              </div>
            </div>

            <button
              onClick={() => isSirenPlaying ? stopSiren() : startSiren()}
              className={'px-3 py-1.5 text-xs font-bold rounded-xl transition-all ' + (isSirenPlaying ? 'bg-slate-800 text-red-300 hover:bg-slate-700' : 'bg-red-600 text-white hover:bg-red-500 shadow')}
            >
              {isSirenPlaying ? 'Mute Sound' : 'Play Siren'}
            </button>
          </div>

          {/* Live GPS Location Card */}
          <div className="rounded-2xl p-4 bg-navy/90 border border-amber-500/30 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <MapPin size={14} className="animate-bounce" /> Live GPS Coordinates
              </span>
              {isLocating ? (
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full animate-pulse">
                  Acquiring GPS...
                </span>
              ) : (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-mono">
                  Accuracy: ±{coords?.accuracy || 10}m
                </span>
              )}
            </div>

            {coords ? (
              <div className="space-y-1.5">
                <div className="p-2 rounded-xl bg-slate-900/80 font-mono text-xs text-slate-200 flex items-center justify-between border border-slate-800">
                  <span>Lat: {coords.lat.toFixed(6)}</span>
                  <span>Lng: {coords.lng.toFixed(6)}</span>
                </div>

                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-navy font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow"
                >
                  <Navigation size={14} /> Open Live Pin on Google Maps
                </a>
              </div>
            ) : (
              <p className="text-xs text-red-300 italic">GPS location fetch ho rahi hai...</p>
            )}

            {gpsError && (
              <p className="text-[10px] text-amber-300/80">{gpsError}</p>
            )}
          </div>

          {/* Member & Emergency Medical Snapshot */}
          <div className="rounded-2xl p-3.5 bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-red-600/20 text-red-400 flex items-center justify-center font-bold text-xs">
                  {currentUser.name.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-bold text-white">{currentUser.name}</p>
                  <p className="text-[10px] text-slate-400">{currentUser.role} • {family.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-red-500/15 border border-red-500/30 px-2 py-1 rounded-lg text-red-400 text-xs font-bold">
                <Heart size={12} fill="currentColor" /> {userMed.blood_group || 'O+'}
              </div>
            </div>

            <div className="text-[11px] text-slate-300 flex items-center gap-1.5">
              <Pill size={12} className="text-gold" />
              <span>Emergency Info: {Array.isArray(userMed.allergies) && userMed.allergies.length > 0 ? userMed.allergies.join(', ') : 'Koi serious allergy record nahi'}</span>
            </div>
          </div>

          {/* 1-Click WhatsApp Family Broadcast Button */}
          <a
            href={'https://api.whatsapp.com/send?text=' + getWhatsAppMessage()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40 transition-all hover:scale-[1.02]"
          >
            <MessageSquare size={18} />
            <span>1-Click WhatsApp Par Family Ko Alert Bhejo</span>
          </a>

          {/* Direct Emergency Call Grid */}
          <div className="grid grid-cols-2 gap-2">
            <a
              href="tel:112"
              className="py-2.5 px-3 bg-red-700/80 hover:bg-red-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 border border-red-500/40 transition-colors shadow"
            >
              <Phone size={14} /> Dial 112 (Police)
            </a>
            <a
              href="tel:108"
              className="py-2.5 px-3 bg-amber-700/80 hover:bg-amber-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 border border-amber-500/40 transition-colors shadow"
            >
              <AlertOctagon size={14} /> Dial 108 (Ambulance)
            </a>
          </div>

        </div>

        {/* Bottom Safety Dismiss Button */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <p className="text-[10px] text-slate-400">Sab theek hone par band karein</p>
          <button
            onClick={handleSafeAndClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            <ShieldCheck size={14} className="text-emerald-400" /> I Am Safe Now
          </button>
        </div>

      </div>
    </div>
  );
}
