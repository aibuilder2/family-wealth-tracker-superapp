import React from 'react';
import { DocumentItem } from '@/types';
import { Car, ShieldCheck, FileText, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface DocumentCardProps {
  doc: DocumentItem;
}

export function DocumentCard({ doc }: DocumentCardProps) {
  const getIcon = () => {
    switch (doc.category) {
      case 'vehicle': return Car;
      case 'insurance': return ShieldCheck;
      default: return FileText;
    }
  };

  const Icon = getIcon();

  return (
    <div className="flex items-center gap-3 px-4 py-3 hover:bg-paper-dim/30 transition-colors cursor-pointer group">
      <div
        className={cn(
          'w-9 h-9 rounded-full flex items-center justify-center shrink-0',
          doc.alert ? 'bg-coral/15 text-coral' : 'bg-paper-dim text-navy'
        )}
      >
        <Icon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-ink font-medium truncate">{doc.title}</p>
        <p
          className={cn(
            'text-[11px]',
            doc.alert ? 'text-coral font-medium' : 'text-ink-muted'
          )}
        >
          {doc.notes || 'Valid'}
        </p>
      </div>
      <ChevronRight size={16} className="text-ink-muted group-hover:text-ink transition-colors" />
    </div>
  );
}
