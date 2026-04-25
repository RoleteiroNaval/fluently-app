import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAliceStore } from '../store/useAliceStore';

export const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { setOnboardingData } = useAliceStore();

  const levels = [
    { id: 'beginner', title: 'Apenas começando', desc: 'Quero começar a falar' },
    { id: 'intermediate', title: 'Eu posso falar, mas fico preso', desc: 'Eu entendo mais do que posso dizer' },
    { id: 'advanced', title: 'Quero soar natural', desc: 'Menos erros, melhores expressões' },
  ];

  const handleSelect = (level: string) => {
    setOnboardingData({ perceivedLevel: level });
    navigate('/practice'); // Pula direto para a avaliação de 30s conforme P0
  };

  return (
    <div className="w-full min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center pb-12 overflow-x-hidden">
      <div className="bg-blobs" />

      {/* HEADER SECTION (Imagem 1) */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg pt-16 px-6 flex flex-col items-center gap-8"
      >
        <h1 className="text-4xl md:text-5xl font-black text-center leading-[1.1] tracking-tight">
          Comece a falar inglês <span className="text-blue-500">fluentemente</span> com o AI Tutor.
        </h1>

        {/* SOCIAL PROOF BADGES */}
        <div className="flex flex-wrap justify-center gap-4 opacity-70">
           <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/10">
              <Star size={12} className="text-yellow-500 fill-yellow-500" />
              <span className="text-[10px] font-bold uppercase tracking-wider">App Store 4.8</span>
           </div>
           <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/10">
              <Star size={12} className="text-green-500 fill-green-500" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Google Play 4.8</span>
           </div>
        </div>

        {/* ALICE BUBBLE (Imagem 1) */}
        <div className="w-full mt-8 flex flex-col gap-6">
          <div className="flex items-center gap-4 ml-4">
             <div className="w-14 h-14 rounded-full border-2 border-purple-500/30 overflow-hidden bg-purple-500/10">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alice" alt="ALICE" />
             </div>
             <div className="glass-panel px-6 py-4 rounded-3xl rounded-tl-none relative border-purple-500/20">
                <p className="text-sm font-semibold tracking-tight">Ei! Cadê você com o inglês? 👋</p>
                <div className="absolute left-[-8px] top-0 w-4 h-4 bg-purple-500/10 border-l border-t border-purple-500/20 transform -rotate-45" />
             </div>
          </div>

          {/* LEVEL CARDS */}
          <div className="flex flex-col gap-3 w-full px-2">
            {levels.map((lvl, idx) => (
              <motion.button
                key={lvl.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => handleSelect(lvl.id)}
                className="w-full p-6 glass-panel rounded-[24px] flex items-center justify-between group hover:bg-white/5 transition-all border-white/5"
              >
                <div className="flex flex-col items-start text-left gap-1">
                  <span className="text-sm font-bold text-white/90 tracking-tight">{lvl.title}</span>
                  <span className="text-xs text-white/30 font-medium">{lvl.desc}</span>
                </div>
                <ChevronRight size={20} className="text-white/20 group-hover:text-white transition-colors" />
              </motion.button>
            ))}
          </div>
        </div>

        <div className="mt-8 flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
           <span className="text-xs font-bold text-white/40">✨ Avaliação gratuita — leva apenas <span className="text-blue-400">4 min</span></span>
        </div>
      </motion.div>
    </div>
  );
};
