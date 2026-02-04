
import React from 'react';
import { Simulation, Choice } from '../types';

interface SimulationSceneProps {
  simulation: Simulation;
  onChoiceSelect: (choice: Choice) => void;
  isLoading: boolean;
}

const SimulationScene: React.FC<SimulationSceneProps> = ({ simulation, onChoiceSelect, isLoading }) => {
  return (
    <div className="max-w-5xl mx-auto space-y-10 md:space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="text-center space-y-4 px-4">
        <h2 className="text-3xl md:text-5xl font-bold serif-header text-white leading-tight">
          {simulation.title}
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 text-[10px] md:text-xs font-bold tracking-[0.2em] text-blue-400/80 uppercase">
          <span className="bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
            Role: {simulation.role}
          </span>
          <span className="hidden sm:inline w-1.5 h-1.5 bg-zinc-800 rounded-full"></span>
          <span className="text-zinc-500">Phase 1: The Setup</span>
        </div>
      </header>

      <section className="glass rounded-[2rem] md:rounded-[3rem] p-6 md:p-14 space-y-10 shadow-2xl shadow-black/50 overflow-hidden">
        <div className="readable-width space-y-6 md:space-y-8">
          {simulation.scene.split('\n\n').map((para, i) => (
            <p key={i} className="text-base md:text-xl leading-[1.75] md:leading-[1.85] text-zinc-300 font-light tracking-wide">
              {para}
            </p>
          ))}
        </div>

        <div className="pt-8 md:pt-12 border-t border-white/5 readable-width">
          <h3 className="text-[10px] md:text-xs font-black uppercase tracking-[0.25em] text-zinc-500 mb-6 flex items-center gap-3">
            <span className="w-6 md:w-8 h-[1px] bg-blue-500/30"></span>
            <i className="fa-solid fa-eye text-blue-500"></i>
            Behavioural Nuances
            <span className="w-6 md:w-8 h-[1px] bg-blue-500/30"></span>
          </h3>
          <div className="bg-blue-500/5 p-5 md:p-8 rounded-2xl border border-blue-500/10 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
            <p className="text-zinc-300 italic text-base md:text-lg leading-relaxed md:leading-loose">
              {simulation.microExpressions}
            </p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:gap-6 readable-width px-2">
        <h3 className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-zinc-600 text-center mb-2">
          Choose your response strategy
        </h3>
        {simulation.choices.map((choice) => (
          <button
            key={choice.id}
            disabled={isLoading}
            onClick={() => onChoiceSelect(choice)}
            className="group relative flex items-start gap-4 md:gap-6 text-left p-5 md:p-8 glass rounded-2xl border border-white/5 hover:border-blue-500/40 hover:bg-white/[0.04] transition-all duration-500 disabled:opacity-50"
          >
            <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-zinc-800/50 text-zinc-400 font-bold text-xs md:text-sm border border-white/5 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-500 transition-all duration-300">
              {choice.id}
            </span>
            <div className="flex-1 space-y-1 md:space-y-2">
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-blue-400/60 group-hover:text-blue-400 transition-colors">
                {choice.label}
              </span>
              <p className="text-base md:text-xl text-zinc-300 group-hover:text-white font-medium leading-snug transition-colors">
                {choice.text}
              </p>
            </div>
            <i className="fa-solid fa-arrow-right-long text-zinc-800 group-hover:text-blue-500 self-center transition-all duration-500 group-hover:translate-x-2"></i>
          </button>
        ))}
      </section>
    </div>
  );
};

export default SimulationScene;
