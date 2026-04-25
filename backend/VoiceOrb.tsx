import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VoiceOrbProps {
    isSpeaking: boolean;
    label: string;
    color: 'purple' | 'green';
}

export function VoiceOrb({ isSpeaking, label, color }: VoiceOrbProps) {
    const baseColor = color === 'purple' ? 'from-violet-600 to-indigo-600' : 'from-emerald-500 to-teal-500';
    const glowColor = color === 'purple' ? 'rgba(139, 92, 246, 0.5)' : 'rgba(16, 185, 129, 0.5)';

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative">
                <AnimatePresence>
                    {isSpeaking && (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1.5, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
                            className="absolute inset-0 rounded-full blur-xl"
                            style={{ backgroundColor: glowColor }}
                        />
                    )}
                </AnimatePresence>

                <motion.div
                    animate={{ scale: isSpeaking ? [1, 1.12, 1] : 1 }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className={`w-32 h-32 rounded-full bg-gradient-to-br ${baseColor} shadow-2xl flex items-center justify-center z-10 relative border border-white/20`}
                >
                    {isSpeaking && (
                        <div className="flex gap-1">
                            {[1, 2, 3].map(i => (
                                <motion.div
                                    key={i}
                                    animate={{ height: [10, 30, 10] }}
                                    transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                                    className="w-1 bg-white rounded-full"
                                />
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
            <span className={`text-xs font-black tracking-widest uppercase ${isSpeaking ? 'text-white' : 'text-gray-500'}`}>
                {label}
            </span>
        </div>
    );
}