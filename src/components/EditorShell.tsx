import React, { useEffect, useState } from 'react';
import { useEditorStore } from '../store/useEditorStore';
import FileExplorer from './FileExplorer';
import TabBar from './TabBar';
import EditorArea from './EditorArea';
import StatusBar from './StatusBar';
import SettingsPanel from './SettingsPanel';
import useSound from '../hooks/useSound';
import { PanelLeftClose, PanelLeft } from 'lucide-react';

export const EditorShell: React.FC = () => {
  const { 
    advanceReveal, 
    isAutoTyping 
  } = useEditorStore();
  const { playClick, initAudio } = useSound();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  // 1. Keyboard Keystroke Capture
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore modifier keys to allow system shortcuts
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      
      // Escape toggles settings panel
      if (e.key === 'Escape') {
        setShowSettings(prev => !prev);
        return;
      }
      
      // Ignore functional controls that don't represent letters/typing
      const ignoredKeys = [
        'Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab',
        'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
        'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'
      ];
      if (ignoredKeys.includes(e.key)) return;

      // Prevent browser default scroll/behavior for spacebar or backspace
      if (e.key === ' ' || e.key === 'Backspace') {
        e.preventDefault();
      }

      initAudio();
      advanceReveal();
      playClick(e.key);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [advanceReveal, playClick, initAudio]);

  // 2. Auto-Typing Simulation Loop
  useEffect(() => {
    if (!isAutoTyping) return;

    // Speed mapping: higher speed = shorter interval
    const interval = setInterval(() => {
      advanceReveal();
      // 15% probability of spacebar to simulate realistic rhythm
      const simulatedKey = Math.random() > 0.15 ? 'a' : ' ';
      playClick(simulatedKey);
    }, 70); // ~14 key strikes per second

    return () => clearInterval(interval);
  }, [isAutoTyping, advanceReveal, playClick]);

  const toggleSidebar = () => {
    playClick(' ');
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="w-full h-screen flex flex-col bg-[#1e1e1e] relative text-slate-200 overflow-hidden select-none">
      
      {/* Settings Panel Overlay */}
      {showSettings && (
        <div className="absolute inset-0 bg-black/60 z-20 backdrop-blur-sm">
          <SettingsPanel onClose={() => setShowSettings(false)} />
        </div>
      )}

      {/* Main Workspace Frame */}
      <div className="flex-grow flex w-full overflow-hidden relative">
        
        {/* Sidebar Panel */}
        <div 
          className={`flex-shrink-0 bg-[#171939] border-r border-white/5 flex flex-col transition-all duration-300 ${
            sidebarOpen ? 'w-60' : 'w-0'
          } overflow-hidden`}
        >
          <div className="flex-grow">
            <FileExplorer />
          </div>
        </div>

        {/* Sidebar Toggle Handle (Floats on left) */}
        <button
          onClick={toggleSidebar}
          className="absolute bottom-10 left-4 z-10 w-9 h-9 rounded-full bg-slate-900/80 border border-white/10 hover:border-violet-500/30 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer shadow-lg backdrop-blur transition-all duration-150 border-none"
          title={sidebarOpen ? "Hide Explorer" : "Show Explorer"}
        >
          {sidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
        </button>

        {/* Main Editor Console */}
        <div className="flex-grow flex flex-col overflow-hidden relative h-full">
          <TabBar />
          <div className="flex-grow w-full overflow-hidden">
            <EditorArea />
          </div>
        </div>

      </div>

      {/* Bottom Status Bar */}
      <StatusBar onToggleSettings={() => setShowSettings(!showSettings)} showSettings={showSettings} />

      <style jsx>{`
        .h-screen {
          height: 100vh;
        }
        .w-60 {
          width: 240px;
        }
        .w-0 {
          width: 0px;
        }
        .bottom-10 {
          bottom: 40px;
        }
        .left-4 {
          left: 16px;
        }
        .z-20 {
          z-index: 20;
        }
        .backdrop-blur-sm {
          backdrop-filter: blur(4px);
        }
      `}</style>
    </div>
  );
};

export default EditorShell;
