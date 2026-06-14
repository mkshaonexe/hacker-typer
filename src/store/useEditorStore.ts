import { create } from 'zustand';

export interface FileNode {
  name: string;
  path: string;
  isFolder: boolean;
  children?: FileNode[];
}

export type RevealMode = 'char' | 'word' | 'line';

interface EditorState {
  files: Record<string, string>;
  fileTree: FileNode[];
  activeFile: string | null;
  tabs: string[];
  revealProgress: Record<string, number>; // Maps file path to number of characters revealed
  revealMode: RevealMode;
  autoTypeSpeed: number; // Speed of autotyping (characters/words/lines per interval)
  isAutoTyping: boolean;
  soundEnabled: boolean;
  typingCompleted: Record<string, boolean>; // Maps file path to boolean completion state
  
  // Actions
  loadProject: (files: Record<string, string>) => void;
  openFile: (path: string) => void;
  closeFile: (path: string) => void;
  advanceReveal: () => void;
  setRevealMode: (mode: RevealMode) => void;
  setAutoTypeSpeed: (speed: number) => void;
  toggleAutoType: () => void;
  stopAutoType: () => void;
  setSoundEnabled: (enabled: boolean) => void;
  resetWorkspace: () => void;
}

// Helper: Build a nested tree from flat file paths
export function buildFileTree(files: Record<string, string>): FileNode[] {
  const root: FileNode[] = [];

  Object.keys(files).forEach((filePath) => {
    const parts = filePath.split('/');
    let currentLevel = root;

    parts.forEach((part, index) => {
      const isFolder = index < parts.length - 1;
      const currentPath = parts.slice(0, index + 1).join('/');

      let existingNode = currentLevel.find((node) => node.name === part);

      if (!existingNode) {
        existingNode = {
          name: part,
          path: currentPath,
          isFolder,
          children: isFolder ? [] : undefined,
        };
        currentLevel.push(existingNode);
      }

      if (isFolder && existingNode.children) {
        currentLevel = existingNode.children;
      }
    });
  });

  const sortTree = (nodes: FileNode[]) => {
    nodes.sort((a, b) => {
      if (a.isFolder && !b.isFolder) return -1;
      if (!a.isFolder && b.isFolder) return 1;
      return a.name.localeCompare(b.name);
    });
    nodes.forEach((node) => {
      if (node.children) {
        sortTree(node.children);
      }
    });
  };

  sortTree(root);
  return root;
}

// Helper: Determine next reveal index based on current position and mode
function getNextRevealIndex(content: string, current: number, mode: RevealMode, autoTypeSpeed: number): number {
  if (current >= content.length) return content.length;

  if (mode === 'char') {
    // Standard hacker typer typing size: average 3 chars per keystroke
    return Math.min(content.length, current + autoTypeSpeed);
  }

  if (mode === 'word') {
    let idx = current;
    // Skip initial whitespace
    while (idx < content.length && /\s/.test(content[idx])) {
      idx++;
    }
    // Skip word characters
    while (idx < content.length && !/\s/.test(content[idx])) {
      idx++;
    }
    // Capture trailing whitespace
    while (idx < content.length && /\s/.test(content[idx]) && content[idx] !== '\n') {
      idx++;
    }
    return Math.max(idx, current + 1);
  }

  if (mode === 'line') {
    const nextNewline = content.indexOf('\n', current);
    if (nextNewline === -1) {
      return content.length;
    }
    return nextNewline + 1; // Include the newline character itself
  }

  return current + 1;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  files: {},
  fileTree: [],
  activeFile: null,
  tabs: [],
  revealProgress: {},
  revealMode: 'char',
  autoTypeSpeed: 3,
  isAutoTyping: false,
  soundEnabled: true,
  typingCompleted: {},

  loadProject: (files) => {
    const fileTree = buildFileTree(files);
    // Find the first file to set as active (e.g. main/app files, or just the first alphabetical one)
    const filePaths = Object.keys(files);
    
    // Sort file paths to find a nice entry point
    const activeFile = filePaths.find(p => p.includes('page.tsx') || p.includes('App.tsx') || p.includes('index.html') || p.includes('main.js')) || filePaths[0] || null;
    
    const tabs = activeFile ? [activeFile] : [];
    const revealProgress: Record<string, number> = {};
    const typingCompleted: Record<string, boolean> = {};
    
    filePaths.forEach((path) => {
      revealProgress[path] = 0;
      typingCompleted[path] = false;
    });

    set({
      files,
      fileTree,
      activeFile,
      tabs,
      revealProgress,
      typingCompleted,
      isAutoTyping: false
    });
  },

  openFile: (path) => {
    const { tabs } = get();
    const newTabs = tabs.includes(path) ? tabs : [...tabs, path];
    set({
      tabs: newTabs,
      activeFile: path,
    });
  },

  closeFile: (path) => {
    const { tabs, activeFile } = get();
    const newTabs = tabs.filter((t) => t !== path);
    let newActive = activeFile;
    if (activeFile === path) {
      newActive = newTabs.length > 0 ? newTabs[newTabs.length - 1] : null;
    }
    set({
      tabs: newTabs,
      activeFile: newActive,
    });
  },

  advanceReveal: () => {
    const { activeFile, files, revealProgress, revealMode, autoTypeSpeed, typingCompleted } = get();
    if (!activeFile || !files[activeFile]) return;

    const content = files[activeFile];
    const currentProgress = revealProgress[activeFile] ?? 0;
    
    if (currentProgress >= content.length) {
      if (!typingCompleted[activeFile]) {
        set((state) => ({
          typingCompleted: {
            ...state.typingCompleted,
            [activeFile]: true,
          },
        }));
      }
      return;
    }

    const nextIndex = getNextRevealIndex(content, currentProgress, revealMode, autoTypeSpeed);
    
    set((state) => ({
      revealProgress: {
        ...state.revealProgress,
        [activeFile]: nextIndex,
      },
      typingCompleted: {
        ...state.typingCompleted,
        [activeFile]: nextIndex >= content.length,
      },
    }));
  },

  setRevealMode: (revealMode) => set({ revealMode }),
  
  setAutoTypeSpeed: (autoTypeSpeed) => set({ autoTypeSpeed }),

  toggleAutoType: () => set((state) => ({ isAutoTyping: !state.isAutoTyping })),

  stopAutoType: () => set({ isAutoTyping: false }),

  setSoundEnabled: (soundEnabled) => set({ soundEnabled }),

  resetWorkspace: () => set({
    files: {},
    fileTree: [],
    activeFile: null,
    tabs: [],
    revealProgress: {},
    typingCompleted: {},
    isAutoTyping: false
  }),
}));
