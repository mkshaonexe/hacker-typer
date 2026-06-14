import React, { useState, useRef } from 'react';
import { useEditorStore } from '../store/useEditorStore';
import { TEMPLATES, Template } from '../utils/templates';
import { parseZipFile } from '../utils/zipHelper';
import { Folder, Upload, AlertCircle, FileCode } from 'lucide-react';
import useSound from '../hooks/useSound';

export const LandingScreen: React.FC = () => {
  const loadProject = useEditorStore((state) => state.loadProject);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { playClick, initAudio } = useSound();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = async (file: File) => {
    initAudio();
    playClick(' ');
    
    if (!file.name.endsWith('.zip')) {
      setError('Please upload a valid ZIP archive.');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      setError('File is too large. Maximum size is 5MB.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const files = await parseZipFile(file);
      loadProject(files);
    } catch (err: any) {
      setError(err?.message || 'Failed to parse the ZIP file.');
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    playClick(' ');
    fileInputRef.current?.click();
  };

  const selectTemplate = (template: Template) => {
    initAudio();
    playClick(' ');
    loadProject(template.files);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Background Liquid Effects */}
      <div className="liquid-bg"></div>
      <div className="liquid-orb-1"></div>
      <div className="liquid-orb-2"></div>

      {/* Main Container */}
      <div className="max-w-4xl w-full flex flex-col items-center z-10 text-center select-none">
        
        {/* Header Title */}
        <div className="mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-400 font-mono text-xs mb-4">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse"></span>
            v1.0.0 — PRE-DELIVERY PRODUCTION
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
            HACKER TYPER <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500">PRO MAX</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-xl mx-auto font-light">
            Reveal stunning source code structures with every keystroke. Use a template or upload your own project.
          </p>
        </div>

        {/* Display Error Message */}
        {error && (
          <div className="flex items-center gap-3 bg-red-950/40 border border-red-500/20 text-red-300 px-6 py-4 rounded-xl max-w-lg mb-8 animate-shake">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {/* Split Selection Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          
          {/* Card 1: Presets */}
          <div className="glass-panel p-8 flex flex-col justify-between text-left hover:border-violet-500/30 transition-all duration-300">
            <div>
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mb-6">
                <FileCode className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Preset Projects</h3>
              <p className="text-slate-400 text-sm font-light mb-6">
                Load high-fidelity pre-compiled configurations to start typing instantly.
              </p>

              {/* Template List */}
              <div className="space-y-4">
                {TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => selectTemplate(tmpl)}
                    className="w-full flex justify-between items-center p-4 rounded-xl border border-white/5 hover:border-violet-500/20 bg-white/3 hover:bg-violet-500/5 transition-all text-left group cursor-pointer"
                  >
                    <div>
                      <h4 className="font-semibold text-white group-hover:text-violet-400 transition-colors">
                        {tmpl.name}
                      </h4>
                      <p className="text-xs text-slate-400 font-light mt-1 max-w-[280px]">
                        {tmpl.description}
                      </p>
                    </div>
                    <span className="text-xs font-mono px-2.5 py-1 rounded bg-white/5 text-slate-400 border border-white/5 group-hover:border-violet-500/30 group-hover:text-violet-400 transition-colors">
                      {tmpl.language}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mt-8 text-xs text-slate-500 font-mono">
              Ready to type immediately on click.
            </div>
          </div>

          {/* Card 2: Custom ZIP Upload */}
          <div 
            className={`glass-panel p-8 flex flex-col justify-between items-stretch text-center border-dashed border-2 transition-all duration-300 relative ${
              dragActive ? 'border-cyan-500 bg-cyan-950/10' : 'border-white/10 hover:border-cyan-500/30'
            }`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".zip"
              onChange={handleFileInput}
              className="hidden"
              disabled={loading}
            />

            {loading ? (
              <div className="flex flex-col items-center justify-center my-auto">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mb-4"></div>
                <h4 className="font-semibold text-lg text-white">Extracting Repository...</h4>
                <p className="text-xs text-slate-400 font-light mt-1">
                  Parsing structure and indexing virtual workspace
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center my-auto">
                <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-6 animate-bounce">
                  <Upload className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Upload Custom Code</h3>
                <p className="text-slate-400 text-sm font-light max-w-[280px] mx-auto mb-6">
                  Drag and drop a <strong className="text-cyan-400">.zip</strong> archive of any folder to inject your own code.
                </p>

                <button 
                  onClick={onButtonClick}
                  className="btn-primary flex items-center gap-2 cursor-pointer"
                >
                  <Folder className="w-4 h-4" />
                  Select File
                </button>
              </div>
            )}

            <div className="mt-8 text-xs text-slate-500 font-mono">
              Max file size 5MB. Client-side only.
            </div>
          </div>

        </div>

        {/* Footer */}
        <footer className="mt-16 text-slate-600 text-xs font-mono">
          Interactive mechanical sounds synthesized via Web Audio API. 
          No server upload required.
        </footer>
      </div>

      {/* Tailwind utility mapping wrapper classes for non-Tailwind files in case they are needed */}
      <style jsx global>{`
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
};

export default LandingScreen;
