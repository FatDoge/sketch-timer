import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';
import { SeasonalBackground } from './components/SeasonalBackground';
import { ProgressBar } from './components/ProgressBar';
import { playStartSound, playEndSound } from './services/soundService';
import { Season, TimerStatus } from './types';

const App: React.FC = () => {
  // State
  const [inputMinutes, setInputMinutes] = useState<string>('5');
  const [totalTime, setTotalTime] = useState<number>(300); // seconds
  const [timeLeft, setTimeLeft] = useState<number>(300);
  const [status, setStatus] = useState<TimerStatus>('idle');
  const [currentSeason, setCurrentSeason] = useState<Season>(Season.Spring);
  
  const timerRef = useRef<number | null>(null);

  // Calculate Progress (0 to 1)
  // If idle, show full; otherwise calculate based on timeLeft
  const progress = status === 'idle' ? 0 : 1 - (timeLeft / totalTime);

  // Determine Season based on Progress
  useEffect(() => {
    if (status === 'idle') {
      // Could be random or based on real date, let's default to Spring
      setCurrentSeason(Season.Spring);
      return;
    }
    
    if (status === 'completed') {
      setCurrentSeason(Season.Winter);
      return;
    }

    // Divide timeline into 4 seasons
    // 0% - 25%: Spring
    // 25% - 50%: Summer
    // 50% - 75%: Autumn
    // 75% - 100%: Winter
    if (progress < 0.25) setCurrentSeason(Season.Spring);
    else if (progress < 0.5) setCurrentSeason(Season.Summer);
    else if (progress < 0.75) setCurrentSeason(Season.Autumn);
    else setCurrentSeason(Season.Winter);
    
  }, [progress, status]);

  // Timer Logic
  useEffect(() => {
    if (status === 'running' && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Time is up
            setStatus('completed');
            playEndSound();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status, timeLeft]);

  // Handlers
  const handleStart = () => {
    let timeToSet = timeLeft;
    
    // If starting from idle, parse input
    if (status === 'idle' || status === 'completed') {
      const mins = parseInt(inputMinutes, 10);
      if (isNaN(mins) || mins <= 0) {
        alert("Please enter a valid number of minutes.");
        return;
      }
      timeToSet = mins * 60;
      setTotalTime(timeToSet);
      setTimeLeft(timeToSet);
    }
    
    setStatus('running');
    playStartSound();
  };

  const handlePause = () => {
    setStatus('paused');
  };

  const handleReset = () => {
    setStatus('idle');
    // Reset to input value
    const mins = parseInt(inputMinutes, 10) || 5;
    setTimeLeft(mins * 60);
    setTotalTime(mins * 60);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Allow empty string for typing
    if (val === '' || /^\d+$/.test(val)) {
      setInputMinutes(val);
    }
  };

  // Formatting
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center text-slate-800">
      
      {/* Background Layer */}
      <SeasonalBackground season={currentSeason} />

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-md p-8 bg-white/90 backdrop-blur-sm border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-2xl mx-4 transition-all duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-center mb-8">
          <h1 className="text-4xl font-bold tracking-wider uppercase border-b-4 border-black pb-2">
            {currentSeason} Time
          </h1>
        </div>

        {/* Timer Display */}
        <div className="text-center mb-8">
          <div className="text-8xl font-bold font-mono tracking-tighter" style={{ fontFamily: "'Patrick Hand', cursive" }}>
            {formatTime(timeLeft)}
          </div>
          <p className="text-xl opacity-60 mt-2">
            {status === 'idle' ? 'Ready to start' : 
             status === 'running' ? 'Time is flowing...' : 
             status === 'paused' ? 'Time paused' : 
             'Time is up!'}
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-6">
          
          {/* Input (only visible when not running) */}
          {(status === 'idle' || status === 'completed') && (
             <div className="flex items-center justify-center gap-2 text-xl">
                <Clock size={24} />
                <span>Set Minutes:</span>
                <input 
                  type="text" 
                  value={inputMinutes}
                  onChange={handleInputChange}
                  className="w-20 bg-transparent border-b-2 border-black text-center font-bold focus:outline-none focus:border-dashed"
                  maxLength={3}
                />
             </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center gap-6">
            {status === 'running' ? (
              <button 
                onClick={handlePause}
                className="group relative px-6 py-3 bg-white border-2 border-black rounded-lg hover:-translate-y-1 active:translate-y-0 transition-transform"
              >
                 <div className="absolute inset-0 bg-black translate-y-1 translate-x-1 rounded-lg -z-10 group-hover:translate-y-2 group-hover:translate-x-2 transition-transform"></div>
                 <Pause size={32} className="fill-black" />
              </button>
            ) : (
              <button 
                onClick={handleStart}
                className="group relative px-6 py-3 bg-black text-white border-2 border-black rounded-lg hover:-translate-y-1 active:translate-y-0 transition-transform"
              >
                 <div className="absolute inset-0 bg-gray-400 translate-y-1 translate-x-1 rounded-lg -z-10 group-hover:translate-y-2 group-hover:translate-x-2 transition-transform"></div>
                 <Play size={32} fill="currentColor" />
              </button>
            )}

            <button 
              onClick={handleReset}
              className="group relative px-6 py-3 bg-white border-2 border-black rounded-lg hover:-translate-y-1 active:translate-y-0 transition-transform"
              title="Reset"
            >
               <div className="absolute inset-0 bg-black translate-y-1 translate-x-1 rounded-lg -z-10 group-hover:translate-y-2 group-hover:translate-x-2 transition-transform"></div>
               <RotateCcw size={32} />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <ProgressBar progress={progress} />
          </div>
        </div>

      </div>

      {/* Footer / Attrib */}
      <div className="absolute bottom-4 text-sm font-bold opacity-50 mix-blend-multiply">
        Sketch Timer &copy; {new Date().getFullYear()}
      </div>

    </div>
  );
};

export default App;