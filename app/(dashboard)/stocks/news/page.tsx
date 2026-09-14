import NewsFeed from "@/components/news/NewsFeed";
import { Newspaper } from "lucide-react";

export const metadata = {
  title: "Stock Market News & Alerts | StockAI",
};

export default function NewsPage() {
  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-100 rounded-lg">
          <Newspaper className="h-6 w-6 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-white">Latest Market News & Alerts</h1>
      </div>
      
      <NewsFeed category="all" />
    </div>
  );
}