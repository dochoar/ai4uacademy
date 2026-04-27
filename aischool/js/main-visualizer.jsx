import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import LLMSimulation from '../visualizadores/LLM_Simulation.jsx';
import AlucinacionesLab from '../visualizadores/Alucinaciones_Lab.jsx';
import MitosRealidadLab from '../visualizadores/Mitos_Realidad_Lab.jsx';
import '../css/tailwind.css';

const LABS = [
  { id: 'simulation', name: '🧠 LLM Simulator', component: LLMSimulation },
  { id: 'hallucinations', name: '❌ Hallucinations Lab', component: AlucinacionesLab },
  { id: 'myths', name: '🧐 Myths vs Reality', component: MitosRealidadLab },
];

function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const initialLabId = urlParams.get('lab');
  const initialLab = LABS.some(l => l.id === initialLabId) ? initialLabId : LABS[0].id;

  const [activeLab, setActiveLab] = useState(initialLab);

  const active = LABS.find(l => l.id === activeLab);
  const Component = active.component;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Lab Selector Header */}
      <nav className="bg-[#0B1647] p-3 text-white flex flex-wrap gap-2 items-center px-6 sticky top-0 z-50 shadow-lg">
        <div className="font-bold text-lg mr-4 border-r border-white/20 pr-4 hidden md:block">AI4U LABS</div>
        <div className="flex gap-2 items-center">
          {LABS.map(lab => (
            <button
              key={lab.id}
              onClick={() => setActiveLab(lab.id)}
              className={`px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-semibold transition-all whitespace-nowrap ${
                activeLab === lab.id 
                ? "bg-[#48E5E5] text-[#0B1647] shadow-inner" 
                : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              {lab.name}
            </button>
          ))}
        </div>
      </nav>

      {/* Lab Content */}
      <div className="flex-1 bg-white overflow-y-auto">
        <Component />
      </div>

      {/* Shared Footer for Visualizers */}
      <footer className="bg-gray-50 border-t py-4 text-center text-xs text-gray-400">
        &copy; 2024 AI4U Academy — AI Simulation Labs
      </footer>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
