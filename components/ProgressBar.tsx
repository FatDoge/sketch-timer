import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 1
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  // Clamp progress between 0 and 1
  const clampedProgress = Math.max(0, Math.min(1, progress));
  
  return (
    <div className="w-full h-6 border-2 border-black rounded-full p-1 bg-white overflow-hidden relative">
      <div 
        className="h-full bg-black rounded-full transition-all duration-500 ease-out"
        style={{ width: `${clampedProgress * 100}%` }}
      />
      <div className="absolute inset-0 flex items-center justify-center text-xs font-bold mix-blend-difference text-white pointer-events-none">
        {Math.round(clampedProgress * 100)}%
      </div>
    </div>
  );
};