import React, { useState } from 'react';

interface VisualizerProps {
  topicId: 'limits' | 'derivatives' | 'integrals';
}

export function MathVisualizer({ topicId }: VisualizerProps) {
  // Config state depending on which visualizer is loaded
  const [limitX, setLimitX] = useState<number>(1.5); // ranges from 1 to 2.9
  const [derivX, setDerivX] = useState<number>(2.5); // ranges from 1 to 5
  const [rectCount, setRectCount] = useState<number>(6); // ranges from 3 to 24

  // Width and height of SVG viewport
  const width = 450;
  const height = 240;

  // 1. LIMITS: Curve y = 2 + (x - 3)^2 * 0.5 (Vertex at x=3, y=2)
  const getLimitsY = (x: number) => {
    return height - 50 - Math.pow(x - 3, 2) * 20;
  };
  const scaleLimitsX = (x: number) => {
    return 60 + x * 90;
  };

  // 2. DERIVATIVES: Parabola y = f(x) = -0.15 * (x - 3)^2 + 6
  const getDerivY = (x: number) => {
    const mathY = -0.12 * Math.pow(x - 3, 2) + 4.5;
    return height - (mathY * 40);
  };
  const scaleDerivX = (x: number) => {
    return 60 + x * 65;
  };
  const getDerivSlope = (x: number) => {
    return -0.24 * (x - 3);
  };

  // 3. INTEGRALS: Parabola y = f(x) = -0.15 * x^2 + x + 1 (Interval x=1 to x=5)
  const getIntY = (mathX: number) => {
    const mathY = -0.18 * Math.pow(mathX - 3, 2) + 3.8;
    return height - (mathY * 50);
  };
  const scaleIntX = (mathX: number) => {
    return 70 + (mathX - 1) * (310 / 4); // maps [1, 5] to [70, 380]
  };

  // Compute Riemann Sum for Integrals
  const computeRiemannSum = (n: number) => {
    const start = 1.0;
    const end = 5.0;
    const dx = (end - start) / n;
    let sum = 0;
    for (let i = 0; i < n; i++) {
      const mid = start + i * dx + dx / 2;
      const mathY = -0.18 * Math.pow(mid - 3, 2) + 3.8;
      sum += mathY * dx;
    }
    return sum;
  };

  const exactIntegralValue = 12.56;

  return (
    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm">
      
      {/* 1. LIMITS VISUALIZER */}
      {topicId === 'limits' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              📐 Limits Interactive Demo: <span className="text-rose-500 font-mono">x → 3</span>
            </h4>
            <span className="text-xs bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-mono px-2 py-1 rounded">
              f(3) is undefined!
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400">
            Move the slider to see how <span className="font-semibold text-rose-500">x</span> approaches 3 from both left and right. The limit is the height we reach!
          </p>

          <div className="relative bg-white dark:bg-slate-955 rounded-xl border border-slate-200/50 dark:border-slate-850 overflow-hidden flex justify-center py-2">
            <svg width={width} height={height} className="overflow-visible">
              {/* grid lines */}
              <line x1={0} y1={height - 40} x2={width} y2={height - 40} stroke="#cbd5e1" strokeDasharray="3,3" />
              <line x1={scaleLimitsX(3)} y1={0} x2={scaleLimitsX(3)} y2={height} stroke="#cbd5e1" strokeDasharray="3,3" />

              {/* Curve path */}
              <path
                d={`M ${scaleLimitsX(0.5)},${getLimitsY(0.5)} Q ${scaleLimitsX(1.8)},${getLimitsY(1.5)} ${scaleLimitsX(2.8)},${getLimitsY(2.8)}`}
                fill="none"
                stroke="#64748b"
                strokeWidth="2"
              />
              <path
                d={`M ${scaleLimitsX(3.2)},${getLimitsY(3.2)} Q ${scaleLimitsX(3.8)},${getLimitsY(3.8)} ${scaleLimitsX(4.5)},${getLimitsY(4.5)}`}
                fill="none"
                stroke="#64748b"
                strokeWidth="2"
              />

              {/* Target limit hole (x=3) */}
              <circle cx={scaleLimitsX(3)} cy={getLimitsY(3)} r="6" fill="white" stroke="#f43f5e" strokeWidth="3" id="limits-target-hole" />
              <text x={scaleLimitsX(3) - 10} y={getLimitsY(3) - 14} className="text-xs font-semibold fill-rose-500">
                (3, 2.5) is empty!
              </text>

              {/* Left Approaching Point */}
              {limitX <= 2.85 && (
                <>
                  <circle cx={scaleLimitsX(limitX)} cy={getLimitsY(limitX)} r="5" fill="#f43f5e" />
                  <line x1={scaleLimitsX(limitX)} y1={getLimitsY(limitX)} x2={scaleLimitsX(3) - 10} y2={getLimitsY(3)} stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3,3" />
                  <path d={`M ${scaleLimitsX(limitX) + 8} ${getLimitsY(limitX) - 5} L ${scaleLimitsX(limitX) + 15} ${getLimitsY(limitX)} L ${scaleLimitsX(limitX) + 8} ${getLimitsY(limitX) + 5}`} fill="none" stroke="#f43f5e" strokeWidth="2" />
                </>
              )}

              {/* Right Approaching Point (Symmetrical) */}
              {limitX <= 2.85 && (
                <>
                  <circle cx={scaleLimitsX(6 - limitX)} cy={getLimitsY(6 - limitX)} r="5" fill="#3b82f6" />
                  <path d={`M ${scaleLimitsX(6 - limitX) - 8} ${getLimitsY(6 - limitX) - 5} L ${scaleLimitsX(6 - limitX) - 15} ${getLimitsY(6 - limitX)} L ${scaleLimitsX(6 - limitX) - 8} ${getLimitsY(6 - limitX) + 5}`} fill="none" stroke="#3b82f6" strokeWidth="2" />
                </>
              )}

              {/* Axis labels */}
              <text x={scaleLimitsX(3) - 20} y={height - 15} className="text-[10px] fill-slate-400 font-mono">x = 3.0</text>
              <text x={10} y={getLimitsY(3) + 4} className="text-[10px] fill-slate-400 font-mono">y = 2.5</text>
            </svg>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs font-mono text-slate-700 dark:text-slate-300">
              <span>Left x = {limitX.toFixed(2)}</span>
              <span className="font-semibold text-rose-500">Goal x → 3.0</span>
              <span>Right x = {(6 - limitX).toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="2.95"
              step="0.05"
              value={limitX}
              onChange={(e) => setLimitX(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-500 dark:bg-slate-700"
              id="limits-range-slider"
            />
            <div className="text-center p-2 rounded-lg bg-rose-50/50 dark:bg-rose-950/20 text-xs font-medium text-rose-800 dark:text-rose-300">
              {limitX >= 2.9
                ? '🎉 Limit verified! f(x) approaches exactly 2.5 from both sides.'
                : 'Move the slider right to see coordinates converge.'}
            </div>
          </div>
        </div>
      )}

      {/* 2. DERIVATIVES VISUALIZER */}
      {topicId === 'derivatives' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              📈 Tangent Slope (Derivative): <span className="text-indigo-500 font-mono">f'(x)</span>
            </h4>
            <span className="text-xs bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-mono px-2 py-1 rounded">
              Instantaneous Rate: {(-0.24 * (derivX - 3) * 10).toFixed(2)}
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400">
            Move the point on the graph. The <span className="font-semibold text-indigo-600">tangent line slope</span> shows the derivative value at that point.
          </p>

          <div className="relative bg-white dark:bg-slate-955 rounded-xl border border-slate-200/50 dark:border-slate-850 overflow-hidden flex justify-center py-2">
            <svg width={width} height={height} className="overflow-visible">
              {/* Grid axis */}
              <line x1={0} y1={height - 40} x2={width} y2={height - 40} stroke="#cbd5e1" strokeDasharray="3,3" />

              {/* Parabola path */}
              <path
                d={Array.from({ length: 41 }, (_, i) => {
                  const x = 0.5 + (i * 4) / 40;
                  return `${i === 0 ? 'M' : 'L'} ${scaleDerivX(x)} ${getDerivY(x)}`;
                }).join(' ')}
                fill="none"
                stroke="#64748b"
                strokeWidth="2.5"
              />

              {/* Tangent line at current derivX */}
              {(() => {
                const x0 = scaleDerivX(derivX);
                const y0 = getDerivY(derivX);
                const slopeMath = getDerivSlope(derivX);
                const screenSlope = -0.615 * slopeMath * 65; 
                const dxSeg = 80;
                const x1 = x0 - dxSeg;
                const y1 = y0 - (screenSlope * ( -dxSeg / 65));
                const x2 = x0 + dxSeg;
                const y2 = y0 - (screenSlope * ( dxSeg / 65));
                return (
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#6366f1"
                    strokeWidth="3"
                    id="derivatives-tangent-line"
                  />
                );
              })()}

              {/* Selected point */}
              <circle cx={scaleDerivX(derivX)} cy={getDerivY(derivX)} r="6" fill="#4f46e5" stroke="white" strokeWidth="2" id="derivatives-interactive-node" />

              {/* Triangle for visual rise/run representation */}
              {(() => {
                const x0 = scaleDerivX(derivX);
                const y0 = getDerivY(derivX);
                const slopeMath = getDerivSlope(derivX);
                const screenSlope = -0.615 * slopeMath * 65;
                const trigDx = 40;
                const trigDy = screenSlope * (trigDx / 65);
                return (
                  <g opacity="0.4">
                    <line x1={x0} y1={y0} x2={x0 + trigDx} y2={y0} stroke="#10b981" strokeWidth="1.5" />
                    <line x1={x0 + trigDx} y1={y0} x2={x0 + trigDx} y2={y0 - trigDy} stroke="#ef4444" strokeWidth="1.5" />
                    <text x={x0 + 10} y={y0 + 12} className="text-[9px] fill-emerald-600 font-mono">dx</text>
                    <text x={x0 + trigDx + 4} y={y0 - trigDy/2 + 3} className="text-[9px] fill-rose-600 font-mono">dy</text>
                  </g>
                );
              })()}
            </svg>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs font-mono text-slate-700 dark:text-slate-300">
              <span>Point x = {derivX.toFixed(2)}</span>
              <span className="font-semibold text-indigo-500">Slope = {getDerivSlope(derivX).toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="5.0"
              step="0.1"
              value={derivX}
              onChange={(e) => setDerivX(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-500 dark:bg-slate-700"
              id="derivatives-range-slider"
            />
            <div className="text-center p-2 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/20 text-xs font-medium text-indigo-800 dark:text-indigo-300">
              {getDerivSlope(derivX) === 0
                ? '🎯 Extremum (maximum) point! The slope here is exactly 0.'
                : getDerivSlope(derivX) > 0 
                ? '📈 Slope is positive (+) — function is increasing.' 
                : '📉 Slope is negative (-) — function is decreasing.'}
            </div>
          </div>
        </div>
      )}

      {/* 3. INTEGRALS VISUALIZER */}
      {topicId === 'integrals' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              🧱 Riemann Sum (Integral): <span className="text-emerald-500 font-mono">∫ f(x) dx</span>
            </h4>
            <span className="text-xs bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-mono px-2 py-1 rounded">
              Approx: {computeRiemannSum(rectCount).toFixed(2)} / Exact: {exactIntegralValue}
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400">
            An integral represents the <span className="font-semibold text-emerald-600">area</span> under the curve. Rectangles approximate this area. The more columns, the closer the sum is to the actual area!
          </p>

          <div className="relative bg-white dark:bg-slate-955 rounded-xl border border-slate-200/50 dark:border-slate-850 overflow-hidden flex justify-center py-2">
            <svg width={width} height={height} className="overflow-visible animate-pulse-slow">
              {/* grid axis */}
              <line x1={0} y1={height - 40} x2={width} y2={height - 40} stroke="#cbd5e1" strokeDasharray="3,3" />

              {/* Riemann Rectangles */}
              {(() => {
                const start = 1.0;
                const end = 5.0;
                const dx = (end - start) / rectCount;
                const rectWidthInPixels = (310 / 4) * dx;

                return Array.from({ length: rectCount }).map((_, i) => {
                  const mathX = start + i * dx;
                  const midX = mathX + dx/2;
                  const rectHeightInPixels = height - getIntY(midX) - 40;
                  const pixelX = scaleIntX(mathX);
                  const pixelY = getIntY(midX);

                  return (
                    <rect
                      key={i}
                      x={pixelX}
                      y={pixelY}
                      width={rectWidthInPixels}
                      height={Math.max(2, rectHeightInPixels)}
                      fill="#10b981"
                      fillOpacity="0.25"
                      stroke="#059669"
                      strokeWidth="1"
                    />
                  );
                });
              })()}

              {/* Exact Area Shading under curve */}
              <path
                d={(() => {
                  const points = [];
                  for (let x = 1; x <= 5; x += 0.1) {
                    points.push(`${scaleIntX(x)},${getIntY(x)}`);
                  }
                  return `M ${scaleIntX(1)},${height - 40} L ${points.join(' L ')} L ${scaleIntX(5)},${height - 40} Z`;
                })()}
                fill="#34d399"
                fillOpacity="0.08"
              />

              {/* Parabola path */}
              <path
                d={Array.from({ length: 41 }, (_, i) => {
                  const mathX = 1.0 + (i * 4) / 40;
                  return `${i === 0 ? 'M' : 'L'} ${scaleIntX(mathX)} ${getIntY(mathX)}`;
                }).join(' ')}
                fill="none"
                stroke="#64748b"
                strokeWidth="2.5"
              />

              {/* Labels */}
              <text x={scaleIntX(1) - 5} y={height - 15} className="text-[10px] fill-slate-400 font-mono">a=1</text>
              <text x={scaleIntX(5) - 5} y={height - 15} className="text-[10px] fill-slate-400 font-mono">b=5</text>
            </svg>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs font-mono text-slate-700 dark:text-slate-300">
              <span>Riemann Slices = {rectCount}</span>
              <span className="font-semibold text-emerald-500">Error = {Math.abs(computeRiemannSum(rectCount) - exactIntegralValue).toFixed(3)}</span>
            </div>
            <input
              type="range"
              min="3"
              max="24"
              step="1"
              value={rectCount}
              onChange={(e) => setRectCount(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500 dark:bg-slate-700"
              id="integrals-range-slider"
            />
            <div className="text-center p-2 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 text-xs font-medium text-emerald-800 dark:text-emerald-300">
              {rectCount >= 18
                ? '⚡ The thinner the slices, the closer the sum gets to the exact area. This is the fundamental idea of integration!'
                : 'Increase the slice count to see how voids are filled.'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
