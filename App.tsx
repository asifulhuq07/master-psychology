
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Simulation, Choice, ArchiveEntry, ConflictType } from './types';
import { generateSimulation, generateReveal } from './services/geminiService';
import SimulationScene from './components/SimulationScene';
import AnalysisView from './components/AnalysisView';

const App: React.FC = () => {
  const [currentSim, setCurrentSim] = useState<Simulation | null>(null);
  const [archive, setArchive] = useState<ArchiveEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');
  
  const progressIntervalRef = useRef<number | null>(null);

  const REVEAL_MESSAGES = [
    "Syncing Neural-Link...",
    "Scanning Social Patterns...",
    "Calculating Status Flux...",
    "Extracting Motives...",
    "Rendering Outcomes...",
    "Finalizing Masterclass..."
  ];

  // Optimized progress logic for faster "Perceived" feel without losing realism
  const startProgress = (isReveal = false) => {
    setLoadingProgress(0);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    
    progressIntervalRef.current = window.setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 98) return prev; 
        
        const remaining = 100 - prev;
        // Faster initial ramp-up, smoother end
        const isBurst = Math.random() > 0.85;
        const burst = isBurst ? (Math.random() * 8) : 0;
        const increment = (Math.random() * (remaining * 0.15)) + 0.5 + burst;
        const next = Math.min(98, prev + increment);
        
        if (isReveal) {
          const msgIdx = Math.floor((next / 100) * REVEAL_MESSAGES.length);
          setLoadingStatus(REVEAL_MESSAGES[msgIdx] || REVEAL_MESSAGES[REVEAL_MESSAGES.length - 1]);
        }
        
        return next;
      });
    }, 50); // Faster tick rate for smoother and quicker progression
  };

  const completeProgress = () => {
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    setLoadingProgress(100);
    // Reduced finish delay from 400ms to 200ms for snappier transition
    setTimeout(() => {
      setIsLoading(false);
      setLoadingProgress(0);
      setLoadingStatus('');
    }, 200); 
  };

  const startNewSimulation = useCallback(async (input?: string) => {
    setIsLoading(true);
    setLoadingStatus('Awakening Engine...');
    startProgress();
    try {
      const data = await generateSimulation(input || '');
      const newSim: Simulation = {
        id: Date.now().toString(),
        title: data.title || 'Unknown Simulation',
        role: data.role || 'Participant',
        scene: data.scene || '',
        microExpressions: data.microExpressions || '',
        choices: data.choices || [],
      };
      setCurrentSim(newSim);
      setUserInput('');
    } catch (error) {
      console.error(error);
      alert('The engine encountered a friction point. Please retry.');
      setIsLoading(false);
    } finally {
      completeProgress();
    }
  }, []);

  const handleChoiceSelect = async (choice: Choice) => {
    if (!currentSim) return;
    setIsLoading(true);
    startProgress(true);
    try {
      const { outcome, analysis, log } = await generateReveal(currentSim, choice);
      const updatedSim: Simulation = {
        ...currentSim,
        selectedChoiceId: choice.id,
        outcome,
        analysis,
        log
      };
      setCurrentSim(updatedSim);
      
      setArchive(prev => {
        const lang = log.language || 'English';
        const type = log.conflictType || ConflictType.SOCIAL;
        
        const filteredArchive = prev.map(category => ({
          ...category,
          simulations: category.simulations.filter(s => s.id !== updatedSim.id)
        })).filter(category => category.simulations.length > 0);

        const categoryIndex = filteredArchive.findIndex(e => e.language === lang && e.conflictType === type);
        
        if (categoryIndex > -1) {
          const newArchive = [...filteredArchive];
          newArchive[categoryIndex] = {
            ...newArchive[categoryIndex],
            simulations: [updatedSim, ...newArchive[categoryIndex].simulations]
          };
          return newArchive;
        } else {
          return [...filteredArchive, { language: lang, conflictType: type, simulations: [updatedSim] }];
        }
      });
    } catch (error) {
      console.error(error);
      alert('The reveal phase encountered an error.');
      setIsLoading(false);
    } finally {
      completeProgress();
    }
  };

  const handleUndo = () => {
    if (currentSim) {
      setCurrentSim({
        ...currentSim,
        selectedChoiceId: undefined,
        outcome: undefined,
        analysis: undefined,
        log: undefined
      });
    }
  };

  const reset = () => {
    setCurrentSim(null);
  };

  const loadFromArchive = (sim: Simulation) => {
    setCurrentSim(sim);
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-zinc-100 flex flex-col md:flex-row font-inter selection:bg-blue-500/30">
      {/* Sidebar - Archives */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 md:w-80 glass border-r border-white/5 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-500 overflow-y-auto`}>
        <div className="p-6 md:p-8 space-y-8 md:space-y-10">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500">Archive Vault</h3>
            <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-zinc-400 p-2 hover:bg-white/5 rounded-full">
              <i className="fa-solid fa-times"></i>
            </button>
          </div>
          
          {archive.length === 0 ? (
            <div className="space-y-4 pt-10 text-center px-4">
              <div className="w-12 h-12 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-database text-zinc-700"></i>
              </div>
              <p className="text-[13px] text-zinc-600 font-medium leading-relaxed italic">The simulation ledger is empty.</p>
            </div>
          ) : (
            <div className="space-y-8 md:space-y-10">
              {archive.map((entry, idx) => (
                <div key={idx} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded-md border border-blue-500/20 uppercase font-black tracking-widest">
                      {entry.language}
                    </span>
                    <span className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider">{entry.conflictType}</span>
                  </div>
                  <div className="space-y-3">
                    {entry.simulations.map(sim => (
                      <button
                        key={sim.id}
                        onClick={() => loadFromArchive(sim)}
                        className={`w-full text-left p-4 rounded-xl border transition-all duration-300 group ${currentSim?.id === sim.id ? 'bg-blue-600/[0.08] border-blue-500/50 text-white' : 'border-white/5 text-zinc-500 hover:bg-white/5 hover:border-white/10'}`}
                      >
                        <div className="font-bold text-sm truncate group-hover:text-zinc-200 transition-colors">{sim.title}</div>
                        <div className="text-[10px] opacity-40 mt-1 uppercase tracking-wider group-hover:opacity-60 transition-opacity">{sim.log?.strategicEssence || 'Strategic Record'}</div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative overflow-y-auto h-screen scroll-smooth">
        <header className="sticky top-0 z-40 glass p-4 md:p-8 border-b border-white/5 flex items-center justify-between shadow-2xl shadow-black/20">
          <div className="flex items-center gap-4 md:gap-6">
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden text-zinc-400 p-3 hover:bg-white/5 rounded-xl border border-white/5">
              <i className="fa-solid fa-bars-staggered"></i>
            </button>
            <div className="space-y-0.5 md:space-y-1">
              <h1 className="text-base md:text-2xl font-black tracking-tight text-white uppercase flex items-center gap-2 md:gap-3">
                Master Psychology <span className="bg-blue-600 text-[8px] md:text-[10px] px-1.5 md:px-2 py-0.5 rounded-md font-black tracking-widest align-middle">V5.0</span>
              </h1>
              <p className="text-[8px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] text-zinc-500 font-bold">Behavioural Engine Protocol</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
             <div className="hidden sm:flex flex-col items-end mr-2">
               <span className="text-[10px] uppercase tracking-widest font-black text-zinc-500">System Status</span>
               <span className="text-[11px] font-bold text-zinc-400">{isLoading ? 'Processing' : 'Optimized'}</span>
             </div>
             <div className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full shadow-lg ${isLoading ? 'bg-blue-500 animate-pulse shadow-blue-500/50' : 'bg-green-500 shadow-green-500/50'}`}></div>
          </div>
        </header>

        <div className="px-4 md:px-14 lg:px-20 py-10 md:py-16 max-w-7xl mx-auto">
          {!currentSim ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] md:min-h-[65vh] text-center space-y-10 md:space-y-16 py-6 md:py-10">
              <div className="space-y-6 md:space-y-8 max-w-3xl">
                <h2 className="text-3xl md:text-7xl font-bold serif-header highlight-accent leading-[1.15] animate-in fade-in slide-in-from-bottom-8 duration-1000">
                  The Arena of Strategic Influence
                </h2>
                <p className="text-zinc-400 text-base md:text-2xl font-light leading-relaxed md:leading-[1.7] max-w-2xl mx-auto px-4 md:px-0">
                  Master complex human dynamics. Sharpen your tactical empathy through hyper-realistic behavioral simulations.
                </p>
              </div>

              <div className="w-full max-w-2xl space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200 px-2">
                <div className="relative group p-0.5 md:p-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 rounded-[1.5rem] md:rounded-[2rem]">
                  <div className="relative bg-[#0a0a0b] rounded-[1.4rem] md:rounded-[1.9rem] overflow-hidden">
                    <input
                      type="text"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder="Prompt the engine (e.g., 'Crisis at the boardroom')..."
                      className="w-full bg-transparent py-5 md:py-7 px-6 md:px-8 text-zinc-100 focus:outline-none text-base md:text-xl placeholder:text-zinc-700 font-light"
                      onKeyDown={(e) => e.key === 'Enter' && userInput && startNewSimulation(userInput)}
                    />
                    <button
                      onClick={() => startNewSimulation(userInput)}
                      disabled={isLoading}
                      className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-14 md:h-14 bg-white text-zinc-950 rounded-xl md:rounded-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center disabled:opacity-50 disabled:grayscale shadow-xl"
                    >
                      <i className="fa-solid fa-arrow-right-long text-base md:text-xl"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-2 md:py-6">
              {!currentSim.selectedChoiceId ? (
                <SimulationScene
                  simulation={currentSim}
                  onChoiceSelect={handleChoiceSelect}
                  isLoading={isLoading}
                />
              ) : (
                <AnalysisView
                  simulation={currentSim}
                  onReset={reset}
                  onUndo={handleUndo}
                />
              )}
            </div>
          )}
        </div>

        {/* Cinematic Animated Reveal Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center glass animate-in fade-in duration-700 px-6 overflow-hidden">
            {/* Background Synapse Effect (Subtle pulse) */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_70%)] animate-pulse"></div>

            <div className="max-w-md w-full flex flex-col items-center space-y-12 md:space-y-16 relative">
              {/* Central Progress Core */}
              <div className="relative">
                {/* Rotating Rings */}
                <div className="absolute -inset-10 border-[1px] border-blue-500/10 rounded-full animate-spin duration-[10s]"></div>
                <div className="absolute -inset-16 border-[1px] border-purple-500/10 rounded-full animate-spin-reverse duration-[15s]"></div>
                
                <div className="relative w-32 h-32 md:w-44 md:h-44 flex items-center justify-center">
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle
                      cx="50%"
                      cy="50%"
                      r="48%"
                      fill="none"
                      stroke="rgba(255,255,255,0.05)"
                      strokeWidth="2"
                    />
                    <circle
                      cx="50%"
                      cy="50%"
                      r="48%"
                      fill="none"
                      stroke="url(#progressGradient)"
                      strokeWidth="3"
                      strokeDasharray="100"
                      strokeDashoffset={100 - loadingProgress}
                      strokeLinecap="round"
                      className="transition-all duration-300 ease-out"
                      style={{ strokeDasharray: '276', strokeDashoffset: 276 - (276 * loadingProgress) / 100 }}
                    />
                    <defs>
                      <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#a855f7" />
                      </linearGradient>
                    </defs>
                  </svg>
                  
                  <div className="text-center">
                    <span className="text-4xl md:text-6xl font-black text-white tabular-nums tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                      {Math.round(loadingProgress)}
                    </span>
                    <span className="text-[10px] md:text-xs block font-black text-blue-400 mt-1 uppercase tracking-[0.4em]">Percent</span>
                  </div>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></span>
                  <h3 className="text-lg md:text-2xl font-black uppercase tracking-[0.3em] text-white">
                    {currentSim?.selectedChoiceId ? 'Processing Choice' : 'Synthesis Initiated'}
                  </h3>
                </div>
                <p className="text-zinc-500 text-[10px] md:text-xs font-black uppercase tracking-[0.4em] h-4 animate-pulse">
                  {loadingStatus}
                </p>
              </div>

              {/* Minimal Progress Line */}
              <div className="w-64 h-0.5 bg-white/5 rounded-full overflow-hidden relative">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-purple-500 shadow-[0_0_20px_rgba(59,130,246,0.6)] transition-all duration-300"
                  style={{ width: `${loadingProgress}%` }}
                ></div>
              </div>

              {/* Neural Tag */}
              <div className="opacity-20 flex items-center gap-3">
                 <div className="h-[1px] w-8 bg-zinc-600"></div>
                 <span className="text-[8px] md:text-[10px] uppercase font-black tracking-widest text-zinc-400">Behavioural Engine V5.0 Neural Array</span>
                 <div className="h-[1px] w-8 bg-zinc-600"></div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Global CSS for custom animations */}
      <style>{`
        @keyframes scan-fast {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(500%); }
        }
        .animate-scan-fast {
          animation: scan-fast 1s infinite linear;
        }
        @keyframes spin-reverse {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        .animate-spin-reverse {
          animation: spin-reverse 20s linear infinite;
        }
        .animate-spin {
          animation: spin 15s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default App;
