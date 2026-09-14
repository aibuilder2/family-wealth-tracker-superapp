"use client";

import { PlayCircle, CheckCircle } from "lucide-react";
import Link from "next/link";

interface LessonCardProps {
  title: string;
  description: string;
  duration?: string;
  isCompleted?: boolean;
  href?: string;
  onClick?: () => void;
}

export default function LessonCard({ title, description, duration = "10 Min", isCompleted = false, href, onClick }: LessonCardProps) {
  const content = (
    <>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          {isCompleted ? <CheckCircle className="h-5 w-5 text-green-500" /> : <PlayCircle className="h-5 w-5 text-blue-500" />}
          <h3 className={`font-bold text-lg ${isCompleted ? "text-green-900" : "text-white"}`}>{title}</h3>
        </div>
        <span className="text-xs font-medium text-slate-400 bg-slate-800/50 px-2 py-1 rounded">{duration}</span>
      </div>
      <p className="text-sm text-slate-400 mb-4">{description}</p>
      {isCompleted ? (
        <div className="text-xs font-bold text-green-600 flex items-center gap-1">Completed</div>
      ) : (
        <div className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline">{onClick ? "Start Lesson" : "View Lesson"}</div>
      )}
    </>
  );

  const baseClass = `block w-full text-left p-5 border rounded-xl transition hover:shadow-md ${isCompleted ? "bg-green-50/50 border-green-100" : "bg-[#111827] hover:bg-slate-800 border-slate-800"}`;

  if (onClick) {
    return <button onClick={onClick} className={baseClass}>{content}</button>;
  }

  return (
    <Link href={href || "#"} className={baseClass}>
      {content}
    </Link>
  );
}