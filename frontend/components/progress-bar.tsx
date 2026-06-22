'use client';

interface ProgressBarProps {
  percentage: number;
  label?: string;
}

export function ProgressBar({ percentage, label }: ProgressBarProps) {
  const displayPercentage = Math.min(100, Math.max(0, percentage));

  return (
    <div className="space-y-2">
      {label && <p className="text-sm text-gray-300">{label}</p>}
      <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
        <div
          className="bg-gradient-to-r from-red-600 to-red-500 h-full transition-all duration-300"
          style={{ width: `${displayPercentage}%` }}
        />
      </div>
      <p className="text-xs text-gray-400 text-right">{Math.round(displayPercentage)}%</p>
    </div>
  );
}
