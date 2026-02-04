
import React from 'react';
import { Simulation, Choice } from '../types';

interface SimulationSceneProps {
  simulation: Simulation;
  onChoiceSelect: (choice: Choice) => void;
  isLoading: boolean;
}

const SimulationScene: React.FC<SimulationSceneProps> = ({ simulation, onChoiceSelect, isLoading }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 md:space-y-20 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <header className="text-center space-y-6 px-4">
        <h2 className="text-4xl md:text-6xl font-bold serif-header text-white leading-[1.1] tracking-tight">
          {simulation.title}
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-4 text-[10px] md:text-[11px] font-black tracking-[0.3em] text-blue-400 uppercase">
          <span className="bg-blue-500/10 px-4 py-1.5 rounded-md border border-blue-500/20 shadow-sm">
            Role: {simulation.role}
          </span>
          <span className="hidden sm:inline w-1 h-1 bg-zinc-800 rounded-full"></span>
          <span className="text-zinc-500 opacity-80">Phase 1: The Setup</span>
        </div>
      </header>

      <section className="glass rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-20 space-y-12 shadow-2xl shadow-black/60 relative border border-white/5">
        <div className="readable-width space-y-8 md:space-y-10">
          {simulation.scene.split('\n\n').map((para, i) => (
            <p key={i} className="text-lg md:text-2xl leading-[1.8] md:leading-[1.9] text-zinc-300 font-light tracking-wide first-letter:text-3xl first-letter:font-serif first-letter:text-blue-400 first-letter:mr-1">
              {para}
            </p>
          ))}
        </div>

        <div className="pt-12 md:pt-16 border-t border-white/5 readable-width">
          <h3 className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-zinc-600 mb-8 flex items-center justify-center gap-4">
            <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-blue-500/20"></span>
            <span className="flex items-center gap-2">
              <i className="fa-solid fa-eye text-blue-500/50"></i>
              Behavioural Nuances
            </span>
            <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-blue-500/20"></span>
          </h3>
          <div className="bg-blue-600/[0.03] p-6 md:p-10 rounded-3xl border border-blue-500/10 shadow-inner group transition-all duration-700 hover:border-blue-500/30">
            <p className="text-zinc-300 italic text-lg md:text-2xl leading-relaxed md:leading-[1.9] text-center max-w-2xl mx-auto">
              {simulation.microExpressions}
            </p>
          </div>
        </div>
      </section>

      <section className="readable-width space-y-8 px-4">
        <div className="text-center space-y-2">
          <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-500">
            Available Protocols
          </h3>
          <div className="w-12 h-1 bg-blue-500/30 mx-auto rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 gap-5 md:gap-8">
          {simulation.choices.map((choice) => (
            <button
              key={choice.id}
              disabled={isLoading}
              onClick={() => onChoiceSelect(choice)}
              className="group relative flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left p-8 md:p-10 glass rounded-[2rem] border border-white/5 hover:border-blue-500/50 hover:bg-white/[0.04] transition-all duration-500 disabled:opacity-50 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]"
            >
              <span className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-2xl bg-zinc-900 text-zinc-500 font-black text-sm border border-white/5 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-500 transition-all duration-300 group-hover:scale-110">
                0{choice.id}
              </span>
              <div className="flex-1 space-y-3 md:space-y-4">
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.25em] text-blue-500/60 group-hover:text-blue-400 transition-colors">
                  {choice.label}
                </span>
                <p className="text-lg md:text-2xl text-zinc-100 group-hover:text-white font-medium leading-relaxed transition-colors">
                  {choice.text}
                </p>
              </div>
              <div className="md:self-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0 hidden md:block">
                <i className="fa-solid fa-chevron-right text-blue-500 text-xl"></i>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default SimulationScene;
