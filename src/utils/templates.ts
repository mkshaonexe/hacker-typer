export interface Template {
  id: string;
  name: string;
  description: string;
  language: string;
  files: Record<string, string>;
}

const PORTFOLIO_TEMPLATE: Record<string, string> = {
  'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Aether / Creative Portfolio</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <!-- Ambient Liquid Background -->
  <div class="glow-orb orb-1"></div>
  <div class="glow-orb orb-2"></div>
  
  <header class="navbar">
    <div class="logo">ÆTHER</div>
    <nav class="nav-links">
      <a href="#work" class="active">Work</a>
      <a href="#about">About</a>
      <a href="#contact">Contact</a>
    </nav>
  </header>

  <main class="hero-section">
    <div class="hero-content">
      <h1 class="title">Crafting Digital <span class="highlight">Masterpieces</span></h1>
      <p class="subtitle">A design engineer exploring the boundary between aesthetics and code.</p>
      <div class="cta-group">
        <button class="btn btn-primary">View My Work</button>
        <button class="btn btn-secondary">Get In Touch</button>
      </div>
    </div>
  </main>

  <section id="work" class="grid-section">
    <div class="card" data-tilt>
      <div class="card-glow"></div>
      <span class="card-tag">SaaS / Web App</span>
      <h3>Nebula Engine</h3>
      <p>A high-performance cloud compilation pipeline with real-time feedback.</p>
    </div>
    
    <div class="card" data-tilt>
      <div class="card-glow"></div>
      <span class="card-tag">Brand Identity</span>
      <h3>Synapse Labs</h3>
      <p>Designing the branding, website, and design systems for a generative AI agent network.</p>
    </div>

    <div class="card" data-tilt>
      <div class="card-glow"></div>
      <span class="card-tag">Creative Dev</span>
      <h3>Fluid Dynamics</h3>
      <p>Interactive WebGL fluid simulation running at 120fps on mobile browsers.</p>
    </div>
  </section>

  <script src="app.js"></script>
</body>
</html>`,

  'style.css': `@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');

:root {
  --primary: #7C3AED;
  --accent: #0891B2;
  --bg: #030712;
  --fg: #F3F4F6;
  --glass: rgba(255, 255, 255, 0.03);
  --border: rgba(255, 255, 255, 0.08);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background-color: var(--bg);
  color: var(--fg);
  font-family: 'Outfit', sans-serif;
  min-height: 100vh;
  overflow-x: hidden;
  position: relative;
}

/* Ambient Background Orbs */
.glow-orb {
  position: absolute;
  width: 50vw;
  height: 50vw;
  border-radius: 50%;
  filter: blur(120px);
  z-index: -1;
  opacity: 0.15;
  pointer-events: none;
}

.orb-1 {
  background: radial-gradient(circle, var(--primary) 0%, transparent 70%);
  top: -10%;
  left: -10%;
}

.orb-2 {
  background: radial-gradient(circle, var(--accent) 0%, transparent 70%);
  bottom: -10%;
  right: -10%;
}

/* Header */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 8%;
  border-bottom: 1px solid var(--border);
  backdrop-filter: blur(12px);
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo {
  font-size: 24px;
  font-weight: 800;
  letter-spacing: 2px;
  background: linear-gradient(135deg, #FFF 0%, #AAA 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav-links a {
  color: #9CA3AF;
  text-decoration: none;
  margin-left: 32px;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-links a:hover, .nav-links a.active {
  color: #FFF;
}

/* Hero Section */
.hero-section {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  padding: 0 8%;
  text-align: center;
}

.title {
  font-size: 64px;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 24px;
}

.highlight {
  background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  font-size: 20px;
  color: #9CA3AF;
  max-width: 600px;
  margin: 0 auto 40px;
  font-weight: 300;
}

/* Buttons */
.btn {
  padding: 14px 28px;
  border-radius: 99px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  margin: 0 10px;
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
  color: white;
  box-shadow: 0 4px 20px rgba(124, 58, 237, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(124, 58, 237, 0.5);
}

.btn-secondary {
  background: var(--glass);
  color: white;
  border: 1px solid var(--border);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-2px);
}

/* Cards Grid */
.grid-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
  padding: 64px 8%;
}

.card {
  background: var(--glass);
  border: 1px solid var(--border);
  padding: 32px;
  border-radius: 16px;
  backdrop-filter: blur(8px);
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.card:hover {
  transform: translateY(-5px);
  border-color: rgba(255, 255, 255, 0.2);
}

.card-tag {
  font-size: 12px;
  text-transform: uppercase;
  color: var(--accent);
  font-weight: 600;
  letter-spacing: 1px;
  margin-bottom: 16px;
  display: inline-block;
}

.card h3 {
  font-size: 22px;
  margin-bottom: 12px;
}

.card p {
  color: #9CA3AF;
  line-height: 1.6;
  font-weight: 300;
}`,

  'app.js': `// Premium Portfolio Interactions
document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.card');

  // Interactive 3D Card Tilt Effect
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const xc = rect.width / 2;
      const yc = rect.height / 2;

      const tiltX = (yc - y) / 10;
      const tiltY = (x - xc) / 10;

      card.style.transform = \`perspective(1000px) rotateX(\${tiltX}deg) rotateY(\${tiltY}deg) translateY(-5px)\`;
      
      // Update background glow coordinates
      const glow = card.querySelector('.card-glow');
      if (glow) {
        glow.style.background = \`radial-gradient(circle 120px at \${x}px \${y}px, rgba(255,255,255,0.06), transparent)\`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
      const glow = card.querySelector('.card-glow');
      if (glow) {
        glow.style.background = 'transparent';
      }
    });
  });

  // Smooth Scrolling for Nav Links
  document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Remove active states
      document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
      this.classList.add('active');

      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});`
};

const DASHBOARD_TEMPLATE: Record<string, string> = {
  'src/components/Dashboard.tsx': `import React, { useState } from 'react';
import { useData } from '../hooks/useData';
import { Metrics, Project } from '../types';

export const Dashboard: React.FC = () => {
  const { metrics, projects, loading, refreshData } = useData();
  const [activeTab, setActiveTab] = useState<'overview' | 'projects'>('overview');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Console</h1>
          <p className="text-slate-400 mt-1">Real-time system health and analytics control center.</p>
        </div>
        <button 
          onClick={refreshData}
          className="bg-violet-600 hover:bg-violet-500 text-white font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
        >
          Refresh Data
        </button>
      </header>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <MetricCard title="System CPU" value={\`\${metrics.cpuUsage}%\`} status="Optimal" />
        <MetricCard title="Active Connections" value={metrics.activeConnections.toLocaleString()} status="Rising" />
        <MetricCard title="Memory Usage" value={\`\${metrics.memoryFree}GB / \${metrics.memoryTotal}GB\`} status="Healthy" />
        <MetricCard title="API Requests" value={\`\${metrics.requestsPerSecond}/s\`} status="Stable" />
      </div>

      {/* Project Status Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
          <h3 className="font-semibold text-lg">Active Deployment Pipelines</h3>
          <span className="bg-slate-800 text-slate-300 text-xs px-2.5 py-1 rounded-full font-medium">
            {projects.length} Total
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase bg-slate-900/50">
                <th className="px-6 py-4">Pipeline</th>
                <th className="px-6 py-4">Branch</th>
                <th className="px-6 py-4">Commit Hash</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {projects.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-medium">{p.name}</td>
                  <td className="px-6 py-4 text-slate-400 font-mono text-sm">{p.branch}</td>
                  <td className="px-6 py-4 text-slate-400 font-mono text-sm">{p.lastCommit}</td>
                  <td className="px-6 py-4">
                    <span className={\`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium \${
                      p.status === 'success' ? 'bg-emerald-500/10 text-emerald-400' :
                      p.status === 'running' ? 'bg-violet-500/10 text-violet-400 animate-pulse' :
                      'bg-rose-500/10 text-rose-400'
                    }\`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const MetricCard: React.FC<{ title: string; value: string; status: string }> = ({ title, value, status }) => (
  <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
    <div>
      <span className="text-slate-400 text-sm font-medium">{title}</span>
      <h3 className="text-2xl font-bold mt-2">{value}</h3>
    </div>
    <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
      <span>Status: <span className="text-slate-300 font-medium">{status}</span></span>
    </div>
  </div>
);`,

  'src/hooks/useData.ts': `import { useState, useEffect, useCallback } from 'react';
import { Metrics, Project } from '../types';

export function useData() {
  const [metrics, setMetrics] = useState<Metrics>({
    cpuUsage: 24,
    activeConnections: 1250,
    memoryTotal: 16,
    memoryFree: 11.2,
    requestsPerSecond: 48,
  });
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const generateMockData = useCallback(() => {
    setProjects([
      { id: '1', name: 'Identity Service', branch: 'main', lastCommit: 'fa39d2c', status: 'success' },
      { id: '2', name: 'Payment Gateway', branch: 'release-1.4', lastCommit: 'd48e021', status: 'running' },
      { id: '3', name: 'Search Indexer', branch: 'master', lastCommit: '75bc0ad', status: 'failed' },
      { id: '4', name: 'Frontend Application', branch: 'preview-landing', lastCommit: 'bcda321', status: 'success' },
    ]);
    setLoading(false);
  }, []);

  const refreshData = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setMetrics({
        cpuUsage: Math.floor(15 + Math.random() * 40),
        activeConnections: Math.floor(1000 + Math.random() * 500),
        memoryTotal: 16,
        memoryFree: parseFloat((8 + Math.random() * 5).toFixed(1)),
        requestsPerSecond: Math.floor(30 + Math.random() * 60),
      });
      generateMockData();
    }, 800);
  }, [generateMockData]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return { metrics, projects, loading, refreshData };
}`,

  'src/types.ts': `export interface Metrics {
  cpuUsage: number;
  activeConnections: number;
  memoryTotal: number;
  memoryFree: number;
  requestsPerSecond: number;
}

export interface Project {
  id: string;
  name: string;
  branch: string;
  lastCommit: string;
  status: 'success' | 'running' | 'failed';
}
`,

  'package.json': `{
  "name": "react-admin-dashboard",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.244.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "typescript": "^5.0.0"
  }
}`
};

export const TEMPLATES: Template[] = [
  {
    id: 'portfolio',
    name: 'Interactive Portfolio',
    description: 'A beautiful personal portfolio containing landing pages, 3D card tilts, and smooth transitions in clean HTML/CSS/JS.',
    language: 'HTML / CSS / JS',
    files: PORTFOLIO_TEMPLATE
  },
  {
    id: 'react-dashboard',
    name: 'React Admin Dashboard',
    description: 'A premium system console dashboard constructed in React with hooks, metrics, pipelines, and full TypeScript support.',
    language: 'React / TS',
    files: DASHBOARD_TEMPLATE
  }
];
