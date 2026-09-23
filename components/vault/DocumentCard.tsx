import React from 'react';
import { DocumentItem } from '@/types';
import { Car, ShieldCheck, FileText, ChevronRight, Share2, Trash2, ExternalLink, User, Folder } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface DocumentCardProps {
  doc: DocumentItem;
  onDelete?: (id: string) => void;
}

export function DocumentCard({ doc, onDelete }: DocumentCardProps) {
  const getIcon = () => {
    switch (doc.category) {
      case 'vehicle': return Car;
      case 'insurance': return ShieldCheck;
      default: return FileText;
    }
  };

  const Icon = getIcon();

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareText = `📄 *${doc.title}*\nसदस्य: ${doc.member_name || 'Common'}\nफ़ोल्डर: ${doc.folder_name || 'General'}\nएक्सपायरी: ${doc.expiry_date || 'N/A'}\nनोट: ${doc.notes || ''}`;
    
    if (navigator.share) {
      navigator.share({
        title: doc.title,
        text: shareText,
        url: doc.file_url !== '#' ? doc.file_url : window.location.href,
      }).catch(() => {});
    } else {
      // WhatsApp share fallback
      const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
      window.open(waUrl, '_blank');
    }
  };

  const handleOpenDoc = () => {
    if (doc.file_url && doc.file_url !== '#') {
      const win = window.open();
      if (win) {
        win.document.write(
          `<iframe src="${doc.file_url}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`
        );
      }
    }
  };

  return (
    <div
      onClick={handleOpenDoc}
      className="flex items-center gap-3 px-4 py-3 hover:bg-paper-dim/30 transition-colors cursor-pointer group"
    >
      <div
        className={cn(
          'w-9 h-9 rounded-full flex items-center justify-center shrink-0',
          doc.alert ? 'bg-coral/15 text-coral' : 'bg-paper-dim text-navy'
        )}
      >
        <Icon size={16} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <p className="text-sm text-ink font-semibold truncate">{doc.title}</p>
          {doc.member_name && (
            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-navy/10 text-navy flex items-center gap-0.5">
              <User size={9} /> {doc.member_name}
            </span>
          )}
          {doc.folder_name && (
            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-gold/15 text-gold flex items-center gap-0.5">
              <Folder size={9} /> {doc.folder_name}
            </span>
          )}
        </div>

        <p
          className={cn(
            'text-[11px] mt-0.5',
            doc.alert ? 'text-coral font-medium' : 'text-ink-muted'
          )}
        >
          {doc.notes || 'Surakshit Saved'}
        </p>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {/* Share Button */}
        <button
          onClick={handleShare}
          title="WhatsApp ya kisi ko bhejein"
          className="p-1.5 rounded-lg text-ink-muted hover:text-green hover:bg-green/10 transition-colors"
        >
          <Share2 size={14} />
        </button>

        {/* Delete button if provided */}
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm(`Kya aap "${doc.title}" ko hatana chahte hain?`)) {
                onDelete(doc.id);
              }
            }}
            title="Delete Document"
            className="p-1.5 rounded-lg text-ink-muted hover:text-coral hover:bg-coral/10 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        )}

        <ChevronRight size={14} className="text-ink-muted group-hover:text-ink transition-colors" />
      </div>
    </div>
  );
}
