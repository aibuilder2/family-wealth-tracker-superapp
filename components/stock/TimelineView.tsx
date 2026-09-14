"use client";

import HistoricTimeline from "./HistoricTimeline";

export default function TimelineView() {
  // Simple wrapper for HistoricTimeline to maintain structure consistency if needed
  return (
    <div className="w-full">
      <HistoricTimeline />
    </div>
  );
}