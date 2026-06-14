import React from 'react';
import { useEditorStore, RevealMode } from '../store/useEditorStore';
import { Sliders, Volume2, VolumeX, Eye, Zap, Trash2, X } from 'lucide-react';
import useSound from '../hooks/useSound';

interface SettingsPanelProps {
  onClose: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ onClose }) => {
  const {
    revealMode,
    setRevealMode,
    autoTypeSpeed,
    setAutoTypeSpeed,
    soundEnabled,
    setSoundEnabled,
    resetWorkspace
  } = useEditorStore();
  const { playClick } = useSound();

  const handleModeChange = (mode: RevealMode) => {
    playClick(' ');
    setRevealMode(mode);
  };

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setAutoTypeSpeed(val);
  };

  const handleSoundToggle = () => {
    setSoundEnabled(!soundEnabled);
    if (!soundEnabled) {
      setTimeout(() => playClick(' '), 10);
    }
  };

  const handleReset = () => {
    playClick(' ');
    resetWorkspace();
  };

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-sm w-full z-30 p-1">
      <div className="glass-panel p-6 shadow-2xl relative flex flex-col border border-white/10 rounded-xl bg-slate-950/95 backdrop-blur-xl">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2 font-mono text-sm font-bold text-violet-400">
            <Sliders className="w-4 h-4 flex items-center justify-center" />
            <span>WORKSPACE SETTINGS</span>
          </div>
          <button 
            onClick={() => { playClick(' '); onClose(); }}
            className="p-1 rounded-md text-slate-500 hover:text-slate-300 hover:bg-white/5 cursor-pointer transition-colors border-none bg-transparent flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Options */}
        <div className="space-y-6 text-sm">
          
          {/* Reveal Mode */}
          <div className="flex flex-col gap-2">
            <label className="text-slate-400 text-xs font-mono font-bold flex items-center gap-1.5 uppercase">
              <Eye className="w-3.5 h-3.5 flex items-center justify-center" />
              Keystroke Reveal Mode
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['char', 'word', 'line'] as RevealMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => handleModeChange(mode)}
                  className={`py-2 px-3 rounded-lg border font-mono text-xs cursor-pointer transition-all ${
                    revealMode === mode
                      ? 'border-violet-500 bg-violet-500/10 text-violet-300 font-bold'
                      : 'border-white/5 bg-white/3 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {mode === 'char' ? 'Char' : mode === 'word' ? 'Word' : 'Line'}
                </button>
              ))}
            </div>
          </div>

          {/* Typing Speed Slider */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs font-mono font-bold text-slate-400">
              <span className="flex items-center gap-1.5 uppercase">
                <Zap className="w-3.5 h-3.5 flex items-center justify-center" />
                Reveal Speed
              </span>
              <span className="text-violet-400 font-mono">{autoTypeSpeed} chars/press</span>
            </div>
            <input
              type="range"
              min="1"
              max="15"
              value={autoTypeSpeed}
              onChange={handleSpeedChange}
              className="w-full accent-violet-500 bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Sound Toggle */}
          <div className="flex justify-between items-center py-4 border-t border-b border-white/5">
            <span className="text-slate-400 text-xs font-mono font-bold flex items-center gap-1.5 uppercase">
              {soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5 text-cyan-400 flex items-center justify-center" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-rose-400 flex items-center justify-center" />
              )}
              Keystroke Sound Click
            </span>
            <button
              onClick={handleSoundToggle}
              className={`py-1.5 px-3 rounded-md font-mono text-xs cursor-pointer transition-all border ${
                soundEnabled
                  ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300 font-bold'
                  : 'bg-white/3 border-white/5 text-slate-400'
              }`}
            >
              {soundEnabled ? 'ENABLED' : 'MUTED'}
            </button>
          </div>

          {/* Reset Workspace */}
          <div className="pt-2">
            <button
              onClick={handleReset}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-red-500/20 bg-red-950/20 hover:bg-red-950/40 text-red-400 hover:text-red-300 font-semibold cursor-pointer transition-all"
            >
              <Trash2 className="w-4 h-4 flex items-center justify-center" />
              Reset Workspace
            </button>
          </div>

        </div>

      </div>
      
      <style jsx>{`
        /* Center container manually via absolute translate */
        .absolute {
          position: absolute;
        }
        .top-1\/2 { top: 50%; }
        .left-1\/2 { left: 50%; }
        .-translate-x-1\/2 { transform: translate(-50%, -50%); }
      `}</style>
    </div>
  );
};

export default SettingsPanel;
