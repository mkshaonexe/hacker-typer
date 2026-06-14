import React, { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { useEditorStore } from '../store/useEditorStore';
import { Sparkles, Terminal } from 'lucide-react';

export const EditorArea: React.FC = () => {
  const { activeFile, files, revealProgress, typingCompleted } = useEditorStore();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorRef = useRef<any>(null);

  const getLanguage = (path: string) => {
    const ext = path.split('.').pop()?.toLowerCase();
    if (ext === 'js' || ext === 'jsx') return 'javascript';
    if (ext === 'ts' || ext === 'tsx') return 'typescript';
    if (ext === 'html') return 'html';
    if (ext === 'css') return 'css';
    if (ext === 'json') return 'json';
    if (ext === 'md') return 'markdown';
    return 'plaintext';
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEditorMount = (editor: any) => {
    editorRef.current = editor;
  };

  const currentContent = activeFile ? files[activeFile] || '' : '';
  const progress = activeFile ? revealProgress[activeFile] ?? 0 : 0;
  const isCompleted = activeFile ? typingCompleted[activeFile] ?? false : false;

  // Slice content up to the current reveal progress index
  const revealedCode = currentContent.slice(0, progress);

  // Auto-scroll Monaco editor to make newly revealed text visible
  useEffect(() => {
    if (editorRef.current && revealedCode) {
      const model = editorRef.current.getModel();
      if (model) {
        const lineCount = model.getLineCount();
        const lastLineLength = model.getLineContent(lineCount).length;
        editorRef.current.revealPosition({
          lineNumber: lineCount,
          column: lastLineLength + 1
        });
      }
    }
  }, [revealedCode]);

  if (!activeFile) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center bg-[#1e1e1e] text-slate-500 font-mono text-sm p-8 h-full">
        <Terminal className="w-12 h-12 text-slate-700 mb-4" />
        <p>No Active File Open</p>
        <p className="text-xs text-slate-600 mt-2">Select a file from the explorer sidebar or start typing</p>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col h-full bg-[#1e1e1e] relative">
      {/* Completion Overlay Banner */}
      {isCompleted && (
        <div className="absolute top-12 right-6 z-20 flex items-center gap-2 bg-emerald-950/90 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-lg text-xs font-semibold shadow-xl animate-bounce backdrop-blur">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>File Completed!</span>
        </div>
      )}

      {/* Editor Instance */}
      <div className="flex-grow w-full h-full relative overflow-hidden">
        <Editor
          height="100%"
          language={getLanguage(activeFile)}
          theme="vs-dark"
          value={revealedCode}
          onMount={handleEditorMount}
          options={{
            readOnly: true,
            fontSize: 14,
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            minimap: { enabled: true },
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            cursorBlinking: 'blink',
            cursorStyle: 'line',
            automaticLayout: true,
            scrollbar: {
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
            },
          }}
        />
      </div>
    </div>
  );
};

export default EditorArea;
