import React from 'react';

const RiskMatrix = () => {
  const grid = Array.from({ length: 5 }, (_, y) => 
    Array.from({ length: 5 }, (_, x) => {
      const likelihood = 5 - y;
      const impact = x + 1;
      const score = likelihood * impact;
      let colorClass = 'bg-[#39FF14] text-bg'; // Low
      let borderColor = 'border-bg';

      if (score >= 16) {
        colorClass = 'bg-danger text-bg'; // High
      } else if (score >= 6) {
        colorClass = 'bg-warning text-bg'; // Medium
      }

      return { likelihood, impact, score, colorClass, borderColor };
    })
  );

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-[11px] font-bold text-primary mb-3 uppercase tracking-widest border-b border-border pb-1 w-full">Risk Severity Matrix (5x5)</h3>
      <div className="flex flex-1 min-h-0 mt-2">
        {/* Y Axis Label */}
        <div className="flex flex-col justify-center items-center mr-2 w-4">
          <span className="text-accent -rotate-90 whitespace-nowrap tracking-widest uppercase text-[8px] font-bold">Likelihood</span>
        </div>

        <div className="flex-1 flex flex-col min-h-0">
          <div className="grid grid-cols-5 gap-0 border-t border-l border-border flex-1 min-h-0">
            {grid.map((row, y) => 
              row.map((cell, x) => (
                <div 
                  key={`${x}-${y}`} 
                  className={`flex items-center justify-center font-bold text-[10px] ${cell.colorClass} border-r border-b ${cell.borderColor} hover:opacity-80 transition-opacity cursor-crosshair h-full`}
                  title={`Likelihood: ${cell.likelihood}, Impact: ${cell.impact}, Score: ${cell.score}`}
                >
                  {cell.score}
                </div>
              ))
            )}
          </div>
          {/* X Axis Label */}
          <div className="text-center mt-2 text-accent tracking-widest uppercase text-[8px] font-bold">
            Impact
          </div>
        </div>
      </div>
      <div className="flex gap-4 mt-3 text-[9px] justify-center font-bold uppercase tracking-widest border-t border-border pt-2 shrink-0">
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-[#39FF14] border border-bg"></span> Low (1-5)</div>
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-warning border border-bg"></span> Medium (6-15)</div>
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-danger border border-bg"></span> High (16-25)</div>
      </div>
    </div>
  );
};

export default RiskMatrix;
