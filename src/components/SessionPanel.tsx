import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Target, MessageSquare, Zap } from 'lucide-react';

interface SessionPanelProps {
  timeSpoken: number;
  accuracy: number;
  wordsToday: number;
  fluencyScore: number;
}

export const SessionPanel: React.FC<SessionPanelProps> = ({ timeSpoken, accuracy, wordsToday, fluencyScore }) => {
  const metrics = [
    { label: 'Session Time', value: `${Math.floor(timeSpoken)}s`, icon: Clock },
    { label: 'Accuracy', value: `${accuracy}%`, icon: Target },
    { label: 'Vocabulary', value: wordsToday, icon: MessageSquare },
    { label: 'Fluency', value: fluencyScore, icon: Zap },
  ];

  return (
    <div className="w-full max-w-4xl px-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {metrics.map((item, idx) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex flex-col items-center lg:items-start gap-3 group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl glass-panel group-hover:border-white/20 transition-all">
                <item.icon size={14} className="text-white/40 group-hover:text-white transition-all" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 group-hover:text-white/40 transition-all">
                {item.label}
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black tracking-tight text-white group-hover:text-gradient transition-all">
                {item.value}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
