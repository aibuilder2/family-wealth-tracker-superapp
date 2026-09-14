"use client";

export default function VolumeChart() {
  // Mock bars to represent volume
  const bars = [40, 60, 30, 80, 100, 50, 45, 75, 90, 40];
  
  return (
    <div className="w-full h-24 bg-[#0B0F19] border-t flex items-end justify-between px-2 pt-4 relative">
      <span className="absolute top-1 left-2 text-[10px] font-bold text-gray-400">Volume</span>
      {bars.map((height, i) => (
        <div 
          key={i} 
          className={`w-full mx-0.5 rounded-t-sm ${height > 70 ? "bg-blue-400" : "bg-gray-300"}`} 
          style={{ height: `${height}%` }}
          title={`Vol: ${height}k`}
        ></div>
      ))}
    </div>
  );
}