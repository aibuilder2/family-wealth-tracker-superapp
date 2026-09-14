"use client";

interface SRLineProps {
  label: string;
  type: "support" | "resistance";
}

export default function SupportResistanceLine({ label, type }: SRLineProps) {
  return (
    <div className="w-full flex items-center gap-2 my-2">
      <div className={`flex-1 border-t-2 border-dashed ${type === "support" ? "border-green-400" : "border-red-400"}`}></div>
      <span className={`text-[10px] font-bold uppercase ${type === "support" ? "text-green-600" : "text-red-600"}`}>{label}</span>
    </div>
  );
}