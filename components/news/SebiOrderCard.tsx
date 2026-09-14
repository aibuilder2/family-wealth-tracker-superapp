import { ShieldAlert, ExternalLink } from "lucide-react";

export default function SebiOrderCard({ order }: { order: any }) {
  // Fallback for missing props
  const { companyName, type, date, title, link } = order || { companyName: "Unknown Entity", type: "Adjudication Order", date: new Date().toISOString(), title: "Order in the matter of...", link: "#" };

  return (
    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 hover:shadow-[0_0_15px_rgba(239,68,68,0.15)] transition">
      <div className="flex items-center gap-2 mb-3">
        <ShieldAlert className="h-5 w-5 text-red-400" />
        <span className="text-xs font-bold uppercase tracking-wider text-red-400 bg-red-500/20 px-2 py-1 rounded">{type}</span>
        <span className="text-xs text-slate-400 ml-auto">{new Date(date).toLocaleDateString()}</span>
      </div>
      <h4 className="font-bold text-white mb-1">{companyName}</h4>
      <p className="text-sm text-slate-300 mb-4 line-clamp-2">{title}</p>
      <a href={link} target="_blank" className="inline-flex items-center gap-1 text-sm font-medium text-red-400 hover:text-red-300 bg-[#111827] border border-red-500/30 px-3 py-1.5 rounded-md hover:bg-red-500/20 transition-colors">
        View Full Order <ExternalLink className="h-3 w-3" />
      </a>
    </div>
  );
}
