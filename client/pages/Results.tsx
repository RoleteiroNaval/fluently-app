import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { useAliceStore } from '@/store/useAliceStore';
import { motion } from 'framer-motion';
import { Mic, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const RadarReport: React.FC = () => {
  const { metrics } = useAliceStore();
  const navigate = useNavigate();

  const cefrLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const currentLevel = metrics?.cefr_level || 'B2';

  const data = metrics ? [
    { subject: 'Pronunciation', A: metrics.pronunciation },
    { subject: 'Vocabulary', A: metrics.vocabulary },
    { subject: 'Grammar', A: metrics.grammar },
    { subject: 'Fluency', A: metrics.fluency },
    { subject: 'Filler Words', A: metrics.filler_words },
  ] : [
    { subject: 'Pronunciation', A: 85 },
    { subject: 'Vocabulary', A: 65 },
    { subject: 'Grammar', A: 70 },
    { subject: 'Fluency', A: 45 },
    { subject: 'Filler Words', A: 75 },
  ];

  return (
    <div className="w-full min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center py-12 px-6">
      <div className="bg-blobs" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg flex flex-col items-center gap-10"
      >
        <h1 className="text-3xl font-bold tracking-tight text-center">Vamos analisar seu inglês</h1>
        
        <p className="text-center text-white/60 text-sm leading-relaxed max-w-[280px]">
          Faça uma chamada rápida com nosso tutor IA para descobrir seu nível e receber um plano.
        </p>

        {/* CEFR BAR - Estilo Fluently (Imagem 2) */}
        <div className="w-full glass-panel p-6 rounded-[32px] flex flex-col items-center gap-6 border-white/5">
          <div className="w-full flex justify-between px-2">
            {cefrLevels.map((lvl) => (
              <div 
                key={lvl}
                className={`text-[10px] font-black w-8 h-8 flex items-center justify-center rounded-full transition-all ${
                  lvl === currentLevel 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]' 
                  : 'text-white/20'
                }`}
              >
                {lvl}
              </div>
            ))}
          </div>
          
          <div className="flex flex-col items-center">
            <span className="text-xl font-bold text-white/90">
              {currentLevel === 'B2' ? 'Upper - Intermediate' : 'Analyzing Proficiency'}
              <span className="text-blue-400 ml-2">{currentLevel}</span>
            </span>
          </div>

          {/* RADAR CHART - Minimalista */}
          <div className="w-full aspect-square relative mt-4">
             <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                  <PolarGrid stroke="#ffffff05" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#ffffff40', fontSize: 9, fontWeight: 700 }} />
                  <Radar
                    name="ALICE"
                    dataKey="A"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.3}
                  />
                </RadarChart>
             </ResponsiveContainer>
             
             {/* Percentuais Flutuantes */}
             <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-blue-500/5 blur-2xl" />
             </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-white/40 text-[11px] font-medium">
           <div className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center">
             <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
           </div>
           Mais de 1 milhão de avaliações personalizadas realizadas
        </div>

        <button 
          onClick={() => navigate('/practice')}
          className="w-full max-w-sm py-5 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center gap-3 shadow-xl active:scale-[0.98] transition-all group"
        >
          <Mic size={20} />
          <span className="font-bold tracking-tight">Começar</span>
        </button>
      </motion.div>
    </div>
  );
};
