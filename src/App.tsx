/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  LabelList
} from 'recharts';
import { Dice6, Play, RotateCcw, Info, BarChart3, Table as TableIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface RollResult {
  face: number;
  count: number;
  percentage: number;
  theoretical: number;
}

const DieFace = ({ value, className }: { value: number; className?: string }) => {
  const dotPositions = useMemo(() => {
    switch (value) {
      case 1: return [4];
      case 2: return [2, 6];
      case 3: return [2, 4, 6];
      case 4: return [0, 2, 6, 8];
      case 5: return [0, 2, 4, 6, 8];
      case 6: return [0, 2, 3, 5, 6, 8];
      default: return [];
    }
  }, [value]);

  return (
    <div className={cn("grid grid-cols-3 grid-rows-3 gap-3 p-5", className)}>
      {[...Array(9)].map((_, i) => (
        <div key={i} className="flex items-center justify-center">
          {dotPositions.includes(i) && (
            <div className="w-full h-full bg-white rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]" />
          )}
        </div>
      ))}
    </div>
  );
};

export default function App() {
  const [rollCount, setRollCount] = useState<number>(10);
  const [results, setResults] = useState<RollResult[] | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentDieValue, setCurrentDieValue] = useState(1);

  const simulationDuration = useMemo(() => {
    // Scale duration between 600ms and 2500ms based on roll count
    return Math.min(2500, 600 + Math.log10(rollCount) * 300);
  }, [rollCount]);

  const runSimulation = () => {
    setIsSimulating(true);
    
    // Dice rolling visual effect
    const interval = setInterval(() => {
      setCurrentDieValue(Math.floor(Math.random() * 6) + 1);
    }, 80);

    // Simulation logic
    setTimeout(() => {
      clearInterval(interval);
      const counts = new Array(6).fill(0);
      for (let i = 0; i < rollCount; i++) {
        const roll = Math.floor(Math.random() * 6);
        counts[roll]++;
      }

      const theoreticalProb = (1 / 6) * 100;
      const newResults: RollResult[] = counts.map((count, index) => ({
        face: index + 1,
        count,
        percentage: (count / rollCount) * 100,
        theoretical: theoreticalProb
      }));

      setResults(newResults);
      setIsSimulating(false);
    }, simulationDuration);
  };

  const reset = () => {
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-slate-900 font-sans p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Dice6 className="w-8 h-8 text-rose-600" />
              <h1 className="text-3xl font-bold tracking-tight">Noppasimulaattori</h1>
            </div>
            <p className="text-slate-500 max-w-md">
              Tutki miten heittojen lukumäärä vaikuttaa eri silmälukujen todennäköisyyteen
            </p>
          </div>
          
          <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
            <div className="px-3">
              <label htmlFor="rolls" className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Heittojen määrä
              </label>
              <input
                id="rolls"
                type="number"
                min="1"
                max="1000000"
                value={rollCount}
                onChange={(e) => setRollCount(Math.max(1, parseInt(e.target.value) || 0))}
                className="w-32 text-xl font-mono focus:outline-none"
              />
            </div>
            <button
              onClick={runSimulation}
              disabled={isSimulating}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all min-w-[180px] justify-center",
                isSimulating 
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                  : "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 shadow-lg shadow-indigo-200"
              )}
            >
              {isSimulating ? (
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.4, ease: "linear" }}
                  >
                    <Dice6 className="w-5 h-5" />
                  </motion.div>
                  <span>Heitetään...</span>
                </div>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  <span>Heitä noppaa</span>
                </>
              )}
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {isSimulating ? (
            <motion.div
              key="simulating"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="bg-white rounded-3xl p-20 flex flex-col items-center justify-center text-center border border-slate-200 shadow-sm"
            >
              <motion.div
                animate={{ 
                  rotate: [0, 90, 180, 270, 360],
                  y: [0, -20, 0, -20, 0],
                  scale: [1, 1.1, 1, 1.1, 1]
                }}
                transition={{ repeat: Infinity, duration: 0.6 }}
                className="w-32 h-32 rounded-md flex items-center justify-center shadow-2xl shadow-red-900/40 mb-8 overflow-hidden border-2 border-white/40 relative"
                style={{
                  background: 'radial-gradient(circle at 30% 30%, rgba(244, 63, 94, 0.85), rgba(159, 18, 57, 0.95))'
                }}
              >
                {/* Glass highlight */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
                <div className="absolute top-2 left-4 w-12 h-6 bg-white/20 rounded-full blur-md -rotate-12 pointer-events-none" />
                
                <DieFace value={currentDieValue} className="w-full h-full relative z-10" />
              </motion.div>
              <h2 className="text-2xl font-bold mb-2">Simuloidaan {rollCount.toLocaleString()} heittoa</h2>
              <p className="text-slate-400 font-mono">Kesto: {(simulationDuration / 1000).toFixed(1)}s</p>
            </motion.div>
          ) : !results ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-12 flex flex-col items-center justify-center text-center border border-slate-200 shadow-sm"
            >
              <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-6">
                <Dice6 className="w-10 h-10 text-rose-400" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Valmiina simuloimaan</h2>
              <p className="text-slate-500 max-w-xs mx-auto">
                Valitse heittojen määrä ylhäältä ja paina nappia nähdäksesi tilastollisen jakauman.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              {/* Chart Section */}
              <section className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-indigo-600" />
                    <h2 className="font-bold">Jakauma (%)</h2>
                  </div>
                  <div className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-indigo-500" />
                      Toteutunut
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-slate-200" />
                      Teoreettinen (16.67%)
                    </div>
                  </div>
                </div>
                
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={results} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="face" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                        label={{ value: 'Silmäluku', position: 'insideBottom', offset: -5, fontSize: 10, fill: '#94a3b8' }}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#64748b', fontSize: 11 }}
                        unit="%"
                      />
                      <Tooltip 
                        cursor={{ fill: '#f8fafc' }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload as RollResult;
                            return (
                              <div className="bg-white p-3 border border-slate-200 shadow-xl rounded-xl">
                                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Silmäluku {data.face}</p>
                                <p className="text-lg font-bold text-indigo-600">{data.percentage.toFixed(2)}%</p>
                                <p className="text-[10px] text-slate-500">Heittoja: {data.count.toLocaleString()}</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar 
                        dataKey="percentage" 
                        radius={[6, 6, 0, 0]} 
                        barSize={40}
                        isAnimationActive={true}
                        animationDuration={1000}
                        animationEasing="ease-out"
                      >
                        {results.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill="#6366f1" />
                        ))}
                        <LabelList 
                          dataKey="percentage" 
                          position="top" 
                          formatter={(v: number) => `${v.toFixed(1)}%`}
                          style={{ fontSize: 10, fontWeight: 700, fill: '#6366f1' }}
                        />
                        <LabelList 
                          dataKey="count" 
                          position="insideTop" 
                          offset={10}
                          formatter={(v: number) => v.toLocaleString()}
                          style={{ fontSize: 9, fontWeight: 600, fill: '#ffffff' }}
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </section>

              {/* Table Section */}
              <section className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <TableIcon className="w-5 h-5 text-indigo-600" />
                    <h2 className="font-bold">Tulostaulukko</h2>
                  </div>
                  <button 
                    onClick={reset}
                    className="text-[11px] font-bold uppercase tracking-wider text-slate-400 hover:text-indigo-600 flex items-center gap-1 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Tyhjennä
                  </button>
                </div>

                <div className="flex-1 overflow-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="text-left py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Silmäluku</th>
                        <th className="text-right py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Lukumäärä</th>
                        <th className="text-right py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Osuus (%)</th>
                        <th className="text-right py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Poikkeama</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {results.map((res) => {
                        const diff = res.percentage - res.theoretical;
                        return (
                          <tr key={res.face} className="group hover:bg-slate-50 transition-colors">
                            <td className="py-1">
                              <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center font-bold text-indigo-600 text-xs">
                                  {res.face}
                                </div>
                              </div>
                            </td>
                            <td className="py-1 text-right font-mono font-medium text-xs">
                              {res.count.toLocaleString()}
                            </td>
                            <td className="py-1 text-right font-mono font-medium text-xs">
                              {res.percentage.toFixed(2)}%
                            </td>
                            <td className={cn(
                              "py-1 text-right font-mono font-bold text-[10px]",
                              diff > 0 ? "text-emerald-500" : "text-rose-500"
                            )}>
                              {diff > 0 ? '+' : ''}{diff.toFixed(2)}%
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-slate-100">
                        <td className="py-2 font-bold text-xs">Yhteensä</td>
                        <td className="py-2 text-right font-mono font-bold text-xs">{rollCount.toLocaleString()}</td>
                        <td className="py-2 text-right font-mono font-bold text-xs">100.00%</td>
                        <td className="py-2 text-right font-mono font-bold text-slate-400 text-xs">±0.00%</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <div className="mt-4 p-4 bg-slate-50 rounded-2xl flex gap-3 items-start">
                  <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-500 leading-relaxed">
                    <strong>Suurten lukujen laki:</strong> Mitä enemmän toistoja teet, sitä varmemmin kunkin silmäluvun osuus lähestyy teoreettista arvoa (1/6 ≈ 16,67 %). Kokeile kasvattaa heittojen määrää nähdäksesi poikkeaman pienenevän.
                  </p>
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer info */}
        <footer className="text-center py-8">
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-300">
            Tilastollinen Simulaatio &bull; 2026
          </p>
        </footer>
      </div>
    </div>
  );
}
