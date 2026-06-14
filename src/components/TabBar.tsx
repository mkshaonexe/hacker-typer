import React from 'react';
import { useEditorStore } from '../store/useEditorStore';
import { X, FileCode, FileJson, File } from 'lucide-react';
import useSound from '../hooks/useSound';

export const TabBar: React.FC = () => {
  const { tabs, activeFile, openFile, closeFile } = useEditorStore();
  const { playClick } = useSound();

  const handleTabClick = (path: string) => {
    playClick(' ');
    openFile(path);
  };

  const handleCloseTab = (e: React.MouseEvent, path: string) => {
    e.stopPropagation();
    playClick(' ');
    closeFile(path);
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    const style = "w-3.5 h-3.5 flex-shrink-0 flex items-center justify-center";
    if (['json', 'lock'].includes(ext || '')) return <FileJson className={`${style} text-yellow-500/80`} />;
    if (['html', 'css', 'js', 'ts', 'tsx', 'jsx'].includes(ext || '')) return <FileCode className={`${style} text-cyan-400/80`} />;
    return <File className={`${style} text-slate-400/80`} />;
  };

  const getFileName = (path: string) => {
    return path.split('/').pop() || path;
  };

  if (tabs.length === 0) {
    return <div className="h-9 border-b border-white/5 bg-slate-950/40 w-full"></div>;
  }

  return (
    <div className="h-9 border-b border-white/5 bg-slate-950/40 flex overflow-x-auto select-none w-full scrollbar-none">
      {tabs.map((tab) => {
        const isActive = activeFile === tab;
        return (
          <div
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={`flex items-center gap-2 px-4 h-full border-r border-white/5 cursor-pointer text-xs font-mono transition-colors duration-150 relative ${
              isActive 
                ? 'bg-slate-900 text-white border-t-2 border-t-violet-500' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            {getFileIcon(tab)}
            <span className="truncate max-w-[120px]">{getFileName(tab)}</span>
            <button
              onClick={(e) => handleCloseTab(e, tab)}
              className="p-0.5 rounded-sm hover:bg-white/10 text-slate-500 hover:text-slate-300 transition-colors flex items-center justify-center cursor-pointer border-none bg-transparent"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        );
      })}
      
      <style jsx>{`
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default TabBar;
