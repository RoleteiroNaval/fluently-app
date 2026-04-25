import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PhoneOff, Mic, MicOff } from 'lucide-react';
import { useAgoraVoice } from '../hooks/useAgoraVoice';
import { useAliceStore } from '../store/useAliceStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function PracticeRoom() {
  const navigate = useNavigate();
  const { 
    isJoined, isMuted, isUserSpeaking, isAiSpeaking,
    joinSession, leaveSession, toggleMute 
  } = useAgoraVoice();
  
  const { 
    assessmentSeconds, addAssessmentSecond, setAssessmentComplete, 
    isAssessmentComplete, setMetrics 
  } = useAliceStore();

  const [sessionTime, setSessionTime] = useState(0);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setSessionTime(s => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isJoined && isUserSpeaking && assessmentSeconds < 30) {
      interval = setInterval(() => addAssessmentSecond(), 1000);
    }
    return () => clearInterval(interval);
  }, [isJoined, isUserSpeaking, assessmentSeconds, addAssessmentSecond]);

  useEffect(() => {
    if (assessmentSeconds >= 30 && !isAssessmentComplete) {
      setAssessmentComplete(true);
      setTimeout(() => navigate('/results'), 1500);
    }
  }, [assessmentSeconds, isAssessmentComplete, setAssessmentComplete, navigate]);

  useEffect(() => {
    const startSession = async () => {
      try {
        ws.current = new WebSocket('ws://localhost:8000/ws/chat');
        ws.current.onmessage = async (event) => {
           if (!(event.data instanceof Blob)) {
             try {
               const data = JSON.parse(event.data);
               if (data.metrics) setMetrics(data.metrics);
             } catch (e) {}
           }
        };

        const res = await fetch('http://localhost:8000/api/agora/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_uid: Math.floor(Math.random() * 10000), channel_name: "alice_assessment" })
        });
        const data = await res.json();
        await joinSession(data.appId, data.channel, data.token, data.uid);
      } catch (err) { console.error(err); }
    };
    startSession();
    return () => { ws.current?.close(); leaveSession(); };
  }, []);

  return (
    <div className="fixed inset-0 bg-[#020205] text-white flex flex-col items-center justify-between overflow-hidden">
      <div className="bg-blobs" />
      
      {/* HEADER PILL (Fixed size to avoid the giant avatar bug) */}
      <div className="w-full max-w-lg px-6 mt-8 z-50">
        <div className="glass-panel w-full p-2 pr-4 rounded-full flex items-center justify-between h-16">
          <div className="flex items-center gap-3 h-full">
            <div className="w-12 h-12 flex-shrink-0 rounded-full overflow-hidden border border-white/10 relative">
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alice&backgroundColor=b6e3f4" 
                className="w-full h-full object-cover" 
                alt="ALICE"
              />
              {isAiSpeaking && (
                <div className="absolute inset-0 rounded-full border-2 border-blue-500 animate-pulse" />
              )}
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-[11px] font-black uppercase tracking-wider text-white/90">Chamada de avaliação</span>
              <span className="text-[10px] font-medium text-white/40">{formatTime(sessionTime)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={toggleMute} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all active:scale-95">
              {isMuted ? <MicOff size={16} className="text-red-400" /> : <Mic size={16} className="text-white/60" />}
            </button>
            <button onClick={() => navigate('/')} className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600 transition-all active:scale-95 shadow-lg shadow-red-500/20">
              <PhoneOff size={16} className="text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* TRANSCRIPTION AREA */}
      <div className="flex-1 w-full max-w-xl px-10 flex flex-col items-center justify-center text-center gap-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={isUserSpeaking ? 'user' : 'ai'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <h2 className="text-2xl md:text-3xl font-bold leading-tight text-white/90 tracking-tight">
              {isAiSpeaking ? "ALICE is analyzing your pronunciation..." : "Please describe your daily routine at work."}
            </h2>
            <p className="text-sm font-medium text-white/20 uppercase tracking-[0.2em]">
              {isUserSpeaking ? "Gravando sua voz..." : "Aguardando sua fala"}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ASSESSMENT PROGRESS PILL */}
      <div className="w-full flex justify-center mb-12 z-50 px-6">
        <div className="glass-panel px-5 py-3 rounded-full flex items-center gap-4 border-white/5 shadow-2xl">
          <div className="relative w-7 h-7">
             <svg className="w-full h-full transform -rotate-90">
               <circle cx="14" cy="14" r="12" stroke="currentColor" strokeWidth="2.5" fill="transparent" className="text-white/5" />
               <motion.circle 
                 cx="14" cy="14" r="12" stroke="currentColor" strokeWidth="2.5" fill="transparent" 
                 className="text-blue-500"
                 strokeDasharray={75}
                 animate={{ strokeDashoffset: 75 - (75 * assessmentSeconds) / 30 }}
                 transition={{ type: 'spring', stiffness: 50 }}
               />
             </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/30">Progresso</span>
            <span className="text-[11px] font-bold tracking-tight">Avaliação: {assessmentSeconds}s de 30s</span>
          </div>
        </div>
      </div>
    </div>
  );
}
