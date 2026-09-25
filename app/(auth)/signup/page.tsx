'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { setActiveUser } from '@/lib/storage/userScopedStorage';

export default function SignupPage() {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [adminName, setAdminName] = useState('');

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = emailOrPhone.trim().toLowerCase();
    if (!cleanUser) return;

    // Set as the active isolated user
    setActiveUser(cleanUser);

    // Initialize custom family profile for this new user
    const newFamily = {
      id: `fam-${Date.now()}`,
      name: familyName.trim() || 'Mera Parivar Vault',
      currency: 'INR',
      invite_code: `PARIVAR${Math.floor(100 + Math.random() * 900)}`,
    };

    const newMember = {
      id: 'm-owner',
      family_id: newFamily.id,
      name: adminName.trim() || 'Head of Family',
      role: 'owner',
      color: '#B98B2A',
      initials: (adminName.trim() || 'H').charAt(0).toUpperCase(),
    };

    try {
      localStorage.setItem('fwa_family', JSON.stringify(newFamily));
      localStorage.setItem('fwa_members', JSON.stringify([newMember]));
      // Clean slate for all other fields
      localStorage.setItem('fwa_transactions', JSON.stringify([]));
      localStorage.setItem('fwa_assets', JSON.stringify([]));
      localStorage.setItem('fwa_goals', JSON.stringify([]));
      localStorage.setItem('fwa_reminders', JSON.stringify([]));
      localStorage.setItem('fwa_documents', JSON.stringify([]));
      localStorage.setItem('fwa_medical_records', JSON.stringify([]));
    } catch (err) {}

    // Hard redirect to load fresh scoped state
    window.location.href = '/home';
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#E7E1D2]">
      <div className="w-full max-w-sm bg-paper p-6 rounded-3xl border border-paper-dim shadow-xl text-center space-y-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-ink">नया परिवार / खाता शुरू करें</h1>
          <p className="text-xs text-ink-muted mt-1">100% फ्रेश व सुरक्षित प्राइवेट वेल्थ वॉल्ट</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-3.5 text-left">
          <div>
            <label className="text-xs font-semibold text-ink-muted block mb-1">
              Gmail ID या Mobile Number
            </label>
            <input
              type="text"
              placeholder="e.g. rajesh@gmail.com या 9876543210"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-paper-dim/40 border border-paper-dim rounded-xl focus:outline-none focus:border-gold"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-ink-muted block mb-1">
              परिवार / बिज़नेस का नाम
            </label>
            <input
              type="text"
              placeholder="e.g. शर्मा परिवार"
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-paper-dim/40 border border-paper-dim rounded-xl focus:outline-none focus:border-gold"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-ink-muted block mb-1">
              आपका नाम (Admin / मुखिया)
            </label>
            <input
              type="text"
              placeholder="e.g. राजेश शर्मा"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-paper-dim/40 border border-paper-dim rounded-xl focus:outline-none focus:border-gold"
              required
            />
          </div>

          <Button type="submit" className="w-full py-2.5 bg-navy text-paper font-semibold mt-2">
            नया परिवार बनाएं (Start Fresh)
          </Button>
        </form>

        <p className="text-xs text-ink-muted pt-1">
          पहले से खाता है?{' '}
          <Link href="/login" className="text-gold font-semibold hover:underline">
            Login करें
          </Link>
        </p>
      </div>
    </div>
  );
}
