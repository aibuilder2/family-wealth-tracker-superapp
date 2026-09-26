import React from 'react';
import { Asset } from '@/types';
import { Mono } from '@/components/ui/Mono';
import { Landmark, Coins, Sprout, Home, Car, Shield } from 'lucide-react';

interface AssetCardProps {
  asset: Asset;
}

export function AssetCard({ asset }: AssetCardProps) {
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

  return (
    <div className="rounded-xl p-4 bg-paper border border-paper-dim shadow-sm">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center mb-2"
        style={{ backgroundColor: color + '22' }}
      >
        <Icon size={16} style={{ color }} />
      </div>
      <p className="text-[11px] text-ink-muted">{asset.label}</p>
      <Mono className="text-[15px] font-semibold text-ink block mt-0.5">
        ₹{Number(asset.value).toLocaleString('en-IN')}
      </Mono>
      {asset.notes && (
        <span className="inline-block mt-1.5 text-[10px] font-bold text-green bg-green/10 px-2 py-0.5 rounded-md truncate max-w-full">
          {asset.notes}
        </span>
      )}
    </div>
  );
}
