
import React from 'react';
import { Simulation, Choice } from '../types';

interface AnalysisViewProps {
  simulation: Simulation;
  onReset: () => void;
  onUndo: () => void;
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ simulation, onReset, onUndo }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-16 md:space-y-24 animate-in fade-in slide-in-from-bottom-8 duration-1000 px-4 md:px-0">
      <header className="text-center space-y-6">
        <h2 className="text-4xl md:text-6xl font-bold serif-header text-white leading-tight">
          {simulation.title}
        </h2>
        <div className="inline-flex items-center gap-3 px-6 py-2 bg-green-500/5 text-green-400 rounded-lg text-[10px] md:text-xs font-black uppercase tracking-[0.3em] border border-green-500/20 shadow-lg">
          <i className="fa-solid fa-check-circle animate-pulse"></i>
          Analysis Sequence Complete
        </div>
      </header>

      {/* Outcome Section */}
      <section className="space-y-10 readable-width">
        <div className="flex items-center gap-6">
          <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-zinc-600 whitespace-nowrap">The Outcome</span>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-zinc-800 to-transparent"></div>
        </div>
        <div className="glass rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-16 border-l-8 border-blue-600 shadow-2xl shadow-blue-900/10 transition-all hover:border-l-[12px] duration-500">
          <div className="space-y-8">
            {simulation.outcome?.split('\n\n').map((para, idx) => (
              <p key={idx} className="text-xl md:text-3xl leading-[1.7] md:leading-[1.8] text-zinc-100 font-light italic">
                {para}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Masterclass Analysis */}
      <section className="space-y-10 readable-width">
        <div className="flex items-center gap-6">
          <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-zinc-600 whitespace-nowrap">Masterclass Analysis</span>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-zinc-800 to-transparent"></div>
        </div>
        <div className="glass rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-20 border border-white/5 shadow-inner">
          <div className="prose prose-invert max-w-none">
             <div className="space-y-10 text-lg md:text-2xl leading-[1.8] md:leading-[1.9] text-zinc-400 font-light">
               {/* 
                  The content is expected to be returned with bold headers and lists from the AI. 
                  We split and render thoughtfully.
               */}
               {simulation.analysis?.split('\n\n').map((block, i) => {
                 const isHeader = block.trim().startsWith('**');
                 return (
                   <div key={i} className={isHeader ? "mt-12 mb-4" : ""}>
                     {block.split('\n').map((line, li) => {
                       if (line.trim().startsWith('-')) {
                         return (
                           <div key={li} className="flex gap-4 mb-4 items-start">
                             <span className="w-2 h-2 mt-3 rounded-full bg-blue-500/50 flex-shrink-0"></span>
                             <span className="text-zinc-300">{line.replace('-', '').trim()}</span>
                           </div>
                         );
                       }
                       if (line.trim().startsWith('**')) {
                          return <h4 key={li} className="text-blue-400 font-black uppercase tracking-[0.2em] text-xs md:text-sm mb-6">{line.replaceAll('**', '')}</h4>;
                       }
                       return <p key={li} className="mb-6">{line}</p>;
                     })}
                   </div>
                 );
               })}
             </div>
          </div>
        </div>
      </section>

      {/* Simulation Log */}
      {simulation.log && (
        <section className="space-y-10 readable-width">
          <div className="flex items-center gap-6">
            <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-zinc-600 whitespace-nowrap">Session Metadata</span>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-zinc-800 to-transparent"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
            <div className="glass p-8 rounded-3xl space-y-3 border border-white/5 transition-all hover:bg-white/[0.02]">
              <span className="text-[9px] uppercase text-zinc-500 font-black tracking-[0.2em]">Primary Language</span>
              <p className="text-xl md:text-2xl text-white font-bold">{simulation.log.language}</p>
            </div>
            <div className="glass p-8 rounded-3xl space-y-3 border border-white/5 transition-all hover:bg-white/[0.02]">
              <span className="text-[9px] uppercase text-zinc-500 font-black tracking-[0.2em]">Conflict Domain</span>
              <p className="text-xl md:text-2xl text-white font-bold">{simulation.log.conflictType}</p>
            </div>
            <div className="glass p-8 rounded-3xl space-y-6 border border-white/5 sm:col-span-2">
              <div className="flex justify-between items-center">
                <span className="text-[9px] uppercase text-zinc-500 font-black tracking-[0.2em]">Pressure Intensity</span>
                <span className="text-xs font-black text-blue-500">LEVEL {simulation.log.intensityLevel}/5</span>
              </div>
              <div className="flex gap-3 h-2">
                {[1, 2, 3, 4, 5].map(lvl => (
                  <div 
                    key={lvl} 
                    className={`flex-1 rounded-full transition-all duration-1000 ease-out ${lvl <= simulation.log!.intensityLevel ? 'bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.6)]' : 'bg-zinc-800'}`}
                  ></div>
                ))}
              </div>
            </div>
            <div className="glass p-8 rounded-3xl space-y-3 border border-blue-500/20 bg-blue-600/[0.02] sm:col-span-2">
              <span className="text-[9px] uppercase text-blue-500/50 font-black tracking-[0.2em]">Trained Core Competency</span>
              <p className="text-2xl md:text-4xl font-black text-blue-400 tracking-tight">{simulation.log.coreSkill}</p>
            </div>
            <div className="glass p-10 md:p-14 rounded-[3rem] space-y-6 md:col-span-2 border border-white/5 bg-gradient-to-br from-white/[0.01] to-transparent">
              <span className="text-[9px] uppercase text-zinc-600 font-black tracking-[0.4em] text-center block">Strategic Essence</span>
              <p className="text-2xl md:text-4xl text-zinc-200 font-light leading-tight italic text-center max-w-2xl mx-auto">
                "{simulation.log.strategicEssence}"
              </p>
            </div>
          </div>
        </section>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-8 pt-20 pb-40">
        <button
          onClick={onUndo}
          className="w-full sm:w-auto px-10 py-5 md:px-14 md:py-6 bg-white/5 text-zinc-400 font-black rounded-2xl border border-white/10 hover:bg-white/10 hover:text-white transition-all duration-300 flex items-center justify-center gap-4 text-[11px] md:text-xs uppercase tracking-[0.3em]"
        >
          <i className="fa-solid fa-arrow-rotate-left"></i>
          Undo Strategy
        </button>
        <button
          onClick={onReset}
          className="w-full sm:w-auto px-10 py-5 md:px-14 md:py-6 bg-white text-zinc-950 font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(59,130,246,0.3)] flex items-center justify-center gap-4 text-[11px] md:text-xs uppercase tracking-[0.3em]"
        >
          <i className="fa-solid fa-plus-circle"></i>
          Next Simulation
        </button>
      </div>
    </div>
  );
};

export default AnalysisView;
