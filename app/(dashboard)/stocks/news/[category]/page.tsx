"use client";

import NewsFeed from "@/components/news/NewsFeed";
import { Newspaper } from "lucide-react";

export default function NewsCategoryPage({ params }: { params: { category: string } }) {
  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-100 rounded-lg">
          <Newspaper className="h-6 w-6 text-blue-700" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white capitalize">{params.category} News</h1>
          <p className="text-sm text-slate-400">Latest updates and articles for {params.category}</p>
        </div>
      </div>

      <NewsFeed category={params.category} />
    </div>
  );
}
