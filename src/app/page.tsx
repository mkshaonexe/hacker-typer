"use client";

import { useEditorStore } from '../store/useEditorStore';
import LandingScreen from '../components/LandingScreen';
import EditorShell from '../components/EditorShell';

export default function Home() {
  const files = useEditorStore((state) => state.files);
  const isLoaded = Object.keys(files).length > 0;

  return (
    <main className="w-full min-h-screen">
      {isLoaded ? <EditorShell /> : <LandingScreen />}
    </main>
  );
}
