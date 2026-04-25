import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VoiceOrbProps {
  isSpeaking: boolean;
  volume: number; // Volume real de 0 a 100
  color: string;
  label: string;
  avatarUrl?: string;
}

export const VoiceOrb: React.FC<VoiceOrbProps> = ({ isSpeaking, volume, color, label, avatarUrl }) => {
  const auraColor = color === '#3b82f6' ? 'rgba(59, 130, 246, 0.4)' : 'rgba(16, 185, 129, 0.4)';
  const coreColor = color === '#3b82f6' ? 'rgba(59, 130, 246, 0.8)' : 'rgba(16, 185, 129, 0.8)';

  // Normaliza o volume para escala (mínimo 1, máximo 1.8)
  const scale = 1 + (volume / 120);
  const opacity = 0.2 + (volume / 150);

  return (
    <div className="flex flex-col items-center gap-12 relative group">
      <div className="relative w-48 h-48 flex items-center justify-center">

        {/* EXTERNAL NEBULA - VAD Real */}
        <motion.div
          animate={{
            scale: isSpeaking ? scale * 1.2 : 1.1,
            opacity: isSpeaking ? opacity : 0.3,
          }}
          transition={{ duration: 0.1 }}
          className="absolute inset-0 rounded-full blur-[60px]"
          style={{ backgroundColor: auraColor }}
        />

        {/* INNER GLOW */}
        <motion.div
          animate={{
            scale: isSpeaking ? scale : 1,
            opacity: isSpeaking ? 0.6 : 0,
          }}
          transition={{ duration: 0.1 }}
          className="absolute inset-4 rounded-full blur-[30px]"
          style={{ backgroundColor: coreColor }}
        />

        {/* THE CORE (Glassmorphism) */}
        <motion.div
          animate={{
            scale: isSpeaking ? 1.05 : 1,
            boxShadow: isSpeaking
              ? `0 0 ${20 + volume}px ${auraColor}`
              : `0 0 20px rgba(255,255,255,0.05)`,
          }}
          className="w-24 h-24 rounded-full bg-slate-900/40 backdrop-blur-3xl relative z-10 flex items-center justify-center border border-white/10 overflow-hidden"
        >
          {avatarUrl ? (
            <motion.img
              animate={{ filter: isSpeaking ? 'grayscale(0%)' : 'grayscale(50%)' }}
              src={avatarUrl}
              alt={label}
              className="w-full h-full object-cover opacity-80"
            />
          ) : (
            <div className="text-white/20 font-black text-3xl tracking-tighter select-none">{label[0]}</div>
          )}
        </motion.div>

        {/* SCANNER RINGS */}
        <motion.div
          animate={{
            scale: [1, 1.4, 1.8],
            opacity: isSpeaking ? [0.2, 0.4, 0] : [0.1, 0.2, 0]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border border-white/5 rounded-full z-0"
        />
      </div>

      {/* LABEL DESIGN */}
      <div className="flex flex-col items-center gap-2 z-20">
        <span className={`text-[10px] font-semibold uppercase tracking-[0.5em] transition-all duration-700 ${isSpeaking ? 'opacity-100' : 'opacity-20'}`}>
          {label === 'Stacy' ? 'STACY Engine' : 'User Terminal'}
        </span>
        <div className={`h-[1px] w-8 transition-all duration-700 ${isSpeaking ? 'bg-white/40' : 'bg-white/5'}`} />
      </div>
    </div>
  );
};
