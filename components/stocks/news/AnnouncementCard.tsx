import { FileText, ExternalLink } from "lucide-react";

interface AnnouncementCardProps {
  announcement: {
    title: string;
    date: string;
    type: string;
    pdfUrl?: string;
    sourceUrl: string;
  };
  stockSymbol: string;
}

export default function AnnouncementCard({ announcement, stockSymbol }: AnnouncementCardProps) {
  return (
    <div className="bg-[#111827] border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#0B0F19] transition">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold bg-purple-100 text-purple-700 px-2 py-0.5 rounded">{announcement.type}</span>
          <span className="text-xs text-slate-400">{new Date(announcement.date).toLocaleString()}</span>
        </div>
        <h4 className="text-sm font-semibold text-white">{announcement.title}</h4>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {announcement.pdfUrl && (<a href={announcement.pdfUrl} target="_blank" className="flex items-center gap-1 text-sm bg-red-50 text-red-600 px-3 py-1.5 rounded border border-red-200 hover:bg-red-100 font-medium"><FileText className="h-4 w-4" /> PDF</a>)}
        <a href={announcement.sourceUrl} target="_blank" className="flex items-center gap-1 text-sm text-slate-400 hover:text-white font-medium">BSE <ExternalLink className="h-4 w-4" /></a>
      </div>
    </div>
  );
}
