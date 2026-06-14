import React, { useState, useEffect } from 'react';
import { useEditorStore } from '../store/useEditorStore';
import { Volume2, VolumeX, Play, Pause, Home, Maximize, Minimize, Settings } from 'lucide-react';
import useSound from '../hooks/useSound';

interface StatusBarProps {
  onToggleSettings: () => void;
  showSettings: boolean;
}

export const StatusBar: React.FC<StatusBarProps> = ({ onToggleSettings, showSettings }) => {
  const { 
    activeFile, 
    files, 
    revealProgress, 
    revealMode, 
    isAutoTyping, 
    toggleAutoType, 
    soundEnabled, 
    setSoundEnabled, 
    resetWorkspace 
  } = useEditorStore();
  const { playClick } = useSound();
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleToggleFullscreen = () => {
    playClick(' ');
    if (typeof document === 'undefined') return;
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.error(err));
    } else {
      document.exitFullscreen();
    }
  };

  const handleReset = () => {
    playClick(' ');
    resetWorkspace();
  };

  const getLanguage = (path: string | null) => {
    if (!path) return 'Plain Text';
    const ext = path.split('.').pop()?.toLowerCase();
    if (ext === 'js' || ext === 'jsx') return 'JavaScript';
    if (ext === 'ts' || ext === 'tsx') return 'TypeScript';
    if (ext === 'html') return 'HTML';
    if (ext === 'css') return 'CSS';
    if (ext === 'json') return 'JSON';
    if (ext === 'md') return 'Markdown';
    return 'Plain Text';
  };

  const currentContent = activeFile ? files[activeFile] || '' : '';
  const progress = activeFile ? revealProgress[activeFile] ?? 0 : 0;
  const percentage = currentContent.length > 0 
    ? Math.min(100, Math.round((progress / currentContent.length) * 100)) 
    : 0;

  return (
    <div className="h-6 bg-slate-900 border-t border-white/5 text-slate-400 flex items-center justify-between px-3 text-xs font-mono select-none z-10 w-full flex-shrink-0">
      
      {/* Left items */}
      <div className="flex items-center gap-4">
        {/* Reset Workspace button */}
        <button 
          onClick={handleReset}
          className="flex items-center gap-1 hover:bg-white/5 hover:text-white px-2 py-0.5 rounded cursor-pointer border-none bg-transparent text-slate-400 transition-colors"
          title="Back to Landing Page"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Exit Workspace</span>
        </button>

        {activeFile && (
          <>
            <span className="text-white/10">|</span>
            <span>File: <strong className="text-slate-200">{activeFile.split('/').pop()}</strong></span>
            <span className="text-white/10">|</span>
            <span>Language: <strong className="text-slate-200">{getLanguage(activeFile)}</strong></span>
            <span className="text-white/10">|</span>
            <span>Revealed: <strong className="text-slate-200">{percentage}%</strong> ({progress}/{currentContent.length} chars)</span>
          </>
        )}
      </div>

      {/* Right items */}
      <div className="flex items-center gap-4">
        {/* Mode info */}
        <span>Mode: <strong className="text-cyan-400 uppercase">{revealMode}</strong></span>
        <span className="text-white/10">|</span>

        {/* Auto typing */}
        <button 
          onClick={() => { playClick(' '); toggleAutoType(); }}
          className={`flex items-center gap-1 px-2 py-0.5 rounded cursor-pointer border-none bg-transparent hover:bg-white/5 hover:text-white transition-colors ${
            isAutoTyping ? 'text-green-400 font-semibold' : 'text-slate-400'
          }`}
          title={isAutoTyping ? "Pause Autotype" : "Start Autotype"}
        >
          {isAutoTyping ? (
            <>
              <Pause className="w-3.5 h-3.5 text-green-400 animate-pulse" />
              <span>Autotyping</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5" />
              <span>Autotype</span>
            </>
          )}
        </button>
        <span className="text-white/10">|</span>

        {/* Sound toggle */}
        <button 
          onClick={() => { setSoundEnabled(!soundEnabled); playClick(' '); }}
          className="flex items-center gap-1 hover:bg-white/5 hover:text-white px-2 py-0.5 rounded cursor-pointer border-none bg-transparent text-slate-400 transition-colors"
          title={soundEnabled ? "Mute Click Sound" : "Unmute Click Sound"}
        >
          {soundEnabled ? (
            <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
          ) : (
            <VolumeX className="w-3.5 h-3.5 text-rose-400" />
          )}
        </button>
        <span className="text-white/10">|</span>

        {/* Settings Panel Toggle */}
        <button 
          onClick={() => { playClick(' '); onToggleSettings(); }}
          className={`flex items-center gap-1 hover:bg-white/5 hover:text-white px-2 py-0.5 rounded cursor-pointer border-none bg-transparent text-slate-400 transition-colors ${
            showSettings ? 'bg-white/10 text-white' : ''
          }`}
          title="Adjust Settings"
        >
          <Settings className="w-3.5 h-3.5" />
        </button>
        <span className="text-white/10">|</span>

        {/* Fullscreen toggle */}
        <button 
          onClick={handleToggleFullscreen}
          className="flex items-center gap-1 hover:bg-white/5 hover:text-white px-2 py-0.5 rounded cursor-pointer border-none bg-transparent text-slate-400 transition-colors"
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Mode"}
        >
          {isFullscreen ? <Minimize className="w-3.5 h-3.5 text-cyan-400" /> : <Maximize className="w-3.5 h-3.5" />}
        </button>
      </div>

      <style jsx>{`
        .h-6 {
          height: 24px;
        }
      `}</style>
    </div>
  );
};

export default StatusBar;
