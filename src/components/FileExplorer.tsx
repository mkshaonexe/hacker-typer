import React, { useState } from 'react';
import { useEditorStore, FileNode } from '../store/useEditorStore';
import { ChevronRight, ChevronDown, Folder, FolderOpen, FileCode, FileJson, File } from 'lucide-react';
import useSound from '../hooks/useSound';

interface NodeProps {
  node: FileNode;
  depth: number;
}

export const FileNodeItem: React.FC<NodeProps> = ({ node, depth }) => {
  const { activeFile, openFile } = useEditorStore();
  const [isOpen, setIsOpen] = useState(true);
  const { playClick } = useSound();

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    playClick(' ');
    setIsOpen(!isOpen);
  };

  const handleSelect = () => {
    if (!node.isFolder) {
      playClick(' ');
      openFile(node.path);
    }
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    const style = "w-4 h-4 flex-shrink-0";
    if (['json', 'lock'].includes(ext || '')) return <FileJson className={`${style} text-yellow-500/80`} />;
    if (['html', 'css', 'js', 'ts', 'tsx', 'jsx'].includes(ext || '')) return <FileCode className={`${style} text-cyan-400/80`} />;
    return <File className={`${style} text-slate-400/80`} />;
  };

  const isActive = activeFile === node.path;

  return (
    <div className="select-none font-mono text-sm">
      {/* Node Row */}
      <div 
        onClick={node.isFolder ? handleToggle : handleSelect}
        className={`flex items-center gap-1.5 py-1.5 px-3 rounded-md cursor-pointer transition-colors duration-150 group ${
          isActive 
            ? 'active-file-item' 
            : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
        }`}
        style={{ paddingLeft: `${Math.max(12, depth * 16)}px` }}
      >
        {node.isFolder ? (
          <>
            <span className="text-slate-500 hover:text-slate-300 flex items-center">
              {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </span>
            <span className="text-violet-400/80 group-hover:text-violet-300 flex items-center">
              {isOpen ? <FolderOpen className="w-4 h-4" /> : <Folder className="w-4 h-4" />}
            </span>
          </>
        ) : (
          <span className="pl-5 flex items-center">
            {getFileIcon(node.name)}
          </span>
        )}
        <span className="truncate flex-grow">{node.name}</span>
      </div>

      {/* Children rendering */}
      {node.isFolder && isOpen && node.children && (
        <div className="mt-0.5">
          {node.children.map((child) => (
            <FileNodeItem key={child.path} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export const FileExplorer: React.FC = () => {
  const fileTree = useEditorStore((state) => state.fileTree);

  return (
    <div className="w-full h-full flex flex-col overflow-y-auto p-4">
      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2 select-none">
        Workspace Explorer
      </div>
      {fileTree.length === 0 ? (
        <div className="text-xs text-slate-600 italic px-2 py-4 select-none">
          No files loaded.
        </div>
      ) : (
        <div className="space-y-0.5">
          {fileTree.map((node) => (
            <FileNodeItem key={node.path} node={node} depth={0} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FileExplorer;
