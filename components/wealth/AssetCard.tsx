import React from 'react';
import { Asset } from '@/types';
import { Mono } from '@/components/ui/Mono';
import { Landmark, Coins, Sprout, Home, Car, Shield, Calendar, User, Phone, CheckCircle2 } from 'lucide-react';
import { useFamilyStore } from '@/lib/store/familyStore';

interface AssetCardProps {
  asset: Asset;
}

export function AssetCard({ asset }: AssetCardProps) {
  const { members } = useFamilyStore();

  const getIcon = () => {
    switch (asset.type) {
      case 'bank_deposit': return Landmark;
      case 'gold':
      case 'silver': return Coins;
      case 'shares':
      case 'mutual_funds': return Sprout;
      case 'land':
      case 'property': return Home;
      case 'vehicle': return Car;
      default: return Shield;
    }
  };

  const Icon = getIcon();
  const color = asset.color || '#B98B2A';
  const member = members.find(m => m.id === asset.member_id);

  return (
    <div className="rounded-2xl p-4 bg-paper border border-paper-dim shadow-xs hover:border-gold/40 transition-all space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-2xs"
          style={{ backgroundColor: color + '22' }}
        >
          <Icon size={18} style={{ color }} />
        </div>

        {member && (
          <span className="text-[10px] font-bold bg-paper-dim px-2 py-0.5 rounded-full text-ink-muted truncate max-w-[120px]">
            👤 {member.name}
          </span>
        )}
      </div>

      <div>
        <p className="text-xs font-bold text-ink truncate">{asset.label}</p>
        <Mono className="text-base font-black text-ink block mt-0.5">
          ₹{Number(asset.value).toLocaleString('en-IN')}
        </Mono>
      </div>

      {/* Vehicle Image Preview Banner */}
      {asset.type === 'vehicle' && asset.vehicle_image_url && (
        <div className="relative w-full h-32 rounded-xl overflow-hidden bg-paper-dim/40 border border-paper-dim my-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset.vehicle_image_url}
            alt={asset.label}
            className="w-full h-full object-cover"
          />
          {asset.vehicle_number && (
            <span className="absolute bottom-1.5 right-1.5 bg-navy/85 backdrop-blur-xs text-gold text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border border-gold/30">
              {asset.vehicle_number}
            </span>
          )}
        </div>
      )}

      {/* Vehicle Number tag if no photo */}
      {asset.type === 'vehicle' && asset.vehicle_number && !asset.vehicle_image_url && (
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-ink-muted">
          <Car size={13} className="text-gold" />
          <span>नं: <strong className="text-ink font-bold">{asset.vehicle_number}</strong></span>
        </div>
      )}

      {/* SIP / RD Monthly Installment */}
      {asset.monthly_installment && asset.monthly_installment > 0 && (
        <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md">
          <span>मासिक किश्त: ₹{Number(asset.monthly_installment).toLocaleString('en-IN')}/माह</span>
          {asset.sip_or_rd_due_day && <span>({asset.sip_or_rd_due_day} तारीख)</span>}
        </div>
      )}

      {/* RD / Deposit Metadata (Start Date, Agent, Channel) */}
      {(asset.start_date || asset.opened_by || asset.agent_name || asset.maturity_date) && (
        <div className="pt-1.5 border-t border-paper-dim/60 space-y-1 text-[10px] text-ink-muted">
          {asset.start_date && (
            <div className="flex items-center gap-1">
              <Calendar size={11} className="text-gold" />
              <span>आरंभ: <strong className="font-mono text-ink">{asset.start_date}</strong></span>
              {asset.maturity_date && (
                <span> | परिपक्वता: <strong className="font-mono text-ink">{asset.maturity_date}</strong></span>
              )}
            </div>
          )}

          {asset.opened_by && (
            <div className="flex items-center gap-1">
              <User size={11} className="text-blue-500" />
              <span>
                माध्यम: <strong>{asset.opened_by === 'direct_bank' ? 'डायरेक्ट बैंक' : 'एजेंट के ज़रिए'}</strong>
                {asset.agent_name && ` (${asset.agent_name}${asset.agent_phone ? ` - ${asset.agent_phone}` : ''})`}
              </span>
            </div>
          )}
        </div>
      )}

      {asset.notes && (
        <span className="inline-block text-[10px] font-bold text-green bg-green/10 px-2 py-0.5 rounded-md truncate max-w-full">
          {asset.notes}
        </span>
      )}
    </div>
  );
}
