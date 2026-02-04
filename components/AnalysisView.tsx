
import React from 'react';
import { Simulation, Choice } from '../types';

interface AnalysisViewProps {
  simulation: Simulation;
  onReset: () => void;
  onUndo: () => void;
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ simulation, onReset, onUndo }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <header className="text-center space-y-4">
        <h2 className="text-4xl md:text-5xl font-bold serif-header text-white leading-tight">{simulation.title}</h2>
        <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-green-500/5 text-green-400 rounded-full text-xs font-black uppercase tracking-[0.2em] border border-green-500/10">
          <i className="fa-solid fa-shield-halved"></i>
          Phase 2: Tactical Reveal
        </div>
      </header>

      {/* Outcome Section */}
      <section className="space-y-6 readable-width">
        <div className="flex items-center gap-4">
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-500 whitespace-nowrap">The Outcome</h3>
          <div className="h-[1px] w-full bg-white/5"></div>
        </div>
        <div className="glass rounded-3xl p-8 md:p-12 border-l-4 border-blue-600 shadow-xl shadow-blue-900/10">
          <p className="text-xl md:text-2xl leading-[1.8] text-zinc-100 font-light italic">
            {simulation.outcome}
          </p>
        </div>
      </section>

      {/* Masterclass Analysis */}
      <section className="space-y-8 readable-width">
        <div className="flex items-center gap-4">
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-500 whitespace-nowrap">Masterclass Analysis</h3>
          <div className="h-[1px] w-full bg-white/5"></div>
        </div>
        <div className="glass rounded-3xl p-8 md:p-14 space-y-10 border border-white/5 shadow-inner">
          <div className="prose prose-invert max-w-none">
             <div className="space-y-8 text-lg md:text-xl leading-[1.9] text-zinc-400 font-light whitespace-pre-wrap">
               {simulation.analysis}
             </div>
          </div>
        </div>
      </section>

      {/* Simulation Log */}
      {simulation.log && (
        <section className="space-y-8 readable-width">
          <div className="flex items-center gap-4">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-500 whitespace-nowrap">Post-Action Log</h3>
            <div className="h-[1px] w-full bg-white/5"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass p-6 rounded-2xl space-y-2 border border-white/5">
              <span className="text-[10px] uppercase text-zinc-600 font-black tracking-[0.1em]">Linguistic Context</span>
              <p className="text-lg text-zinc-200 font-medium">{simulation.log.language}</p>
            </div>
            <div className="glass p-6 rounded-2xl space-y-2 border border-white/5">
              <span className="text-[10px] uppercase text-zinc-600 font-black tracking-[0.1em]">Conflict Classification</span>
              <p className="text-lg text-zinc-200 font-medium">{simulation.log.conflictType}</p>
            </div>
            <div className="glass p-6 rounded-2xl space-y-4 border border-white/5">
              <span className="text-[10px] uppercase text-zinc-600 font-black tracking-[0.1em]">Pressure Intensity</span>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(lvl => (
                  <div 
                    key={lvl} 
                    className={`h-2 flex-1 rounded-full transition-all duration-1000 ${lvl <= simulation.log!.intensityLevel ? 'bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.3)]' : 'bg-zinc-800'}`}
                  ></div>
                ))}
              </div>
            </div>
            <div className="glass p-6 rounded-2xl space-y-2 border border-white/5">
              <span className="text-[10px] uppercase text-zinc-600 font-black tracking-[0.1em]">Core Competency</span>
              <p className="text-lg font-bold text-blue-400 tracking-wide">{simulation.log.coreSkill}</p>
            </div>
            <div className="glass p-8 rounded-2xl space-y-3 md:col-span-2 border border-blue-500/10 bg-blue-500/[0.02]">
              <span className="text-[10px] uppercase text-zinc-600 font-black tracking-[0.1em]">Strategic Essence</span>
              <p className="text-xl text-zinc-200 font-light leading-relaxed italic">
                "{simulation.log.strategicEssence}"
              </p>
            </div>
          </div>
        </section>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-12 pb-24">
        <button
          onClick={onUndo}
          className="w-full sm:w-auto px-10 py-5 bg-white/5 text-zinc-400 font-bold rounded-2xl border border-white/10 hover:bg-white/10 hover:text-white transition-all duration-300 flex items-center justify-center gap-3 text-sm uppercase tracking-widest"
        >
          <i className="fa-solid fa-arrow-rotate-left"></i>
          Undo Choice
        </button>
        <button
          onClick={onReset}
          className="w-full sm:w-auto px-10 py-5 bg-zinc-100 text-zinc-900 font-black rounded-2xl hover:bg-white transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-blue-500/20 flex items-center justify-center gap-3 text-sm uppercase tracking-widest"
        >
          <i className="fa-solid fa-plus-circle"></i>
          Initiate New Simulation
        </button>
      </div>
    </div>
  );
};

export default AnalysisView;
