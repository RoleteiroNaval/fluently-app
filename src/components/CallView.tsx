import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { PhoneOff, Radio, Percent, Settings, ShieldCheck } from 'lucide-react';
import { useSpeechTracker } from '../hooks/useSpeechTracker';
import { useVibe } from '../context/VibeContext';
import { useAgentConnection } from '../hooks/useAgentConnection';
import { AudioVisualizer } from './AudioVisualizer';

export function CallView() {
  const { vibe } = useVibe();
  const { isConnected, agentSpeaking, agentMessages, connect, disconnect, sendMessage, ensureAudioContext, agentAnalyserNode } = useAgentConnection();
  const navigate = useNavigate();

  const {
    isRecording,
    isSpeaking,
    timeSpoken,
    transcript,
    fullTranscript,
    startRecording,
    stopRecording,
    analyser: userAnalyserNode
  } = useSpeechTracker();

  const [callState, setCallState] = useState<'intro' | 'active'>('intro');
  const [messages, setMessages] = useState<{ sender: 'ai' | 'user', text: string }[]>([]);

  const handleStart = async () => {
    await ensureAudioContext();
    await startRecording();
    connect();
    setCallState('active');
  };

  const handleEndCall = useCallback(() => {
    stopRecording();
    disconnect();
    navigate('/feedback', { state: { transcript: fullTranscript, timeSpoken: timeSpoken } });
  }, [stopRecording, disconnect, navigate, fullTranscript, timeSpoken]);

  useEffect(() => {
    const handleFinalSpeech = (e: any) => {
      const text = e.detail;
      if (text) {
        setMessages(prev => [...prev, { sender: 'user', text }]);
        sendMessage(text);
      }
    };
    window.addEventListener('speech-final', handleFinalSpeech);
    return () => window.removeEventListener('speech-final', handleFinalSpeech);
  }, [sendMessage]);

  useEffect(() => {
    if (agentMessages.length > 0) {
      const lastMsg = agentMessages[agentMessages.length - 1];
      setMessages(prev => {
        if (prev.length > 0 && prev[prev.length-1].text === lastMsg) return prev;
        return [...prev, { sender: 'ai', text: lastMsg }];
      });
    }
  }, [agentMessages]);

  return (
    <div className={`w-full h-full flex flex-col justify-between animate-fade-in relative overflow-hidden ${vibe.themeClass}`}>
      {/* BACKGROUND PREMIUM DYNAMIC */}
      <div className="absolute inset-0 bg-[#050505] -z-20" />
      <div className={`absolute inset-0 bg-gradient-to-br from-accent-primary/10 via-transparent to-accent-secondary/5 -z-10`} />
      <div className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-accent-primary/5 blur-[120px] animate-pulse`} />
      <div className={`absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent-secondary/5 blur-[120px] animate-pulse`} />

      {callState === 'intro' ? (
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="glass-panel p-12 flex flex-col items-center gap-10 text-center w-full max-w-lg shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/5 relative">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent-primary to-transparent opacity-40"></div>
            
            <div className="relative group">
                <div className="absolute inset-0 bg-accent-primary/20 rounded-full blur-2xl group-hover:bg-accent-primary/40 transition-all duration-500"></div>
                <div className="w-36 h-36 rounded-full bg-black flex items-center justify-center relative ring-2 ring-white/10">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Alice&backgroundColor=b6e3f4`} alt="ALICE" className="w-32 h-32 rounded-full" />
                </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-5xl font-black tracking-tighter text-white">ALICE <span className="text-accent-primary">AI</span></h2>
              <p className="text-accent-primary font-mono text-xs tracking-[0.4em] uppercase opacity-70">Professional English Coach</p>
            </div>

            <button className="btn btn-primary w-full py-5 text-xl font-bold rounded-2xl shadow-[0_20px_40px_rgba(var(--accent-primary-rgb),0.3)] hover:translate-y-[-4px] transition-all" onClick={handleStart}>
              INICIAR SESSÃO
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Active Header (Ultra Clean) */}
          <div className="flex items-center justify-between p-8 mx-4">
            <div className="flex gap-5 items-center">
              <div className="flex-col">
                <div className="flex items-center gap-2">
                    <ShieldCheck size={14} className="text-accent-primary" />
                    <span className="font-black text-xs tracking-[0.2em] text-white uppercase">Sessão Segura</span>
                </div>
                <span className="text-[10px] text-text-secondary font-mono opacity-50 uppercase">Encryption Active</span>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="bg-white/5 backdrop-blur-md p-2 rounded-full px-5 border border-white/5 flex items-center gap-3">
                 <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-success shadow-[0_0_8px_var(--success)]' : 'bg-red-500'}`} />
                 <span className="text-[9px] font-mono text-white/70 uppercase tracking-widest">{isConnected ? 'Online' : 'Offline'}</span>
              </div>
            </div>
          </div>

          {/* CHATGPT STYLE VISUALIZATION */}
          <div className="flex-1 flex flex-col items-center justify-center p-6 gap-16 relative">
            
            {/* STACY ORB (TOP) */}
            <div className="flex flex-col items-center gap-6 animate-fade-in">
                <AudioVisualizer analyserNode={agentAnalyserNode} isActive={agentSpeaking} color="#a855f7" />
                <div className="flex flex-col items-center">
                    <span className={`text-[10px] font-mono uppercase tracking-[0.4em] transition-all duration-500 ${agentSpeaking ? 'text-accent-primary' : 'opacity-20'}`}>Stacy speaking</span>
                    {agentSpeaking && <div className="w-1 h-1 bg-accent-primary rounded-full mt-2 animate-ping" />}
                </div>
            </div>

            {/* CHAT BUBBLES (CENTER - FLOATING) */}
            <div className="w-full max-w-2xl h-64 overflow-y-auto scrollbar-hide flex flex-col gap-6 p-4 perspective-1000">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}>
                  <div className={`max-w-[80%] p-5 rounded-3xl text-sm leading-relaxed ${msg.sender === 'user' ? 'bg-accent-primary/10 border border-accent-primary/30 text-white shadow-lg' : 'bg-white/5 border border-white/10 backdrop-blur-xl text-text-primary shadow-2xl'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {transcript && (
                <div className="flex justify-end opacity-30 italic text-[11px] px-6 animate-pulse">
                    {transcript}...
                </div>
              )}
            </div>

            {/* USER ORB (BOTTOM) */}
            <div className="flex flex-col items-center gap-6 animate-fade-in">
                <AudioVisualizer analyserNode={userAnalyserNode} isActive={isSpeaking} color="#10b981" />
                <div className="flex flex-col items-center">
                    <span className={`text-[10px] font-mono uppercase tracking-[0.4em] transition-all duration-500 ${isSpeaking ? 'text-success' : 'opacity-20'}`}>You speaking</span>
                    {isSpeaking && <div className="w-1 h-1 bg-success rounded-full mt-2 animate-ping" />}
                </div>
            </div>
          </div>

          {/* Minimal Footer */}
          <div className="p-10 flex justify-center items-center gap-12">
              <div className="text-center group cursor-help">
                  <div className="text-[9px] font-mono opacity-30 uppercase tracking-[0.4em] group-hover:opacity-100 transition-opacity">Practice Time</div>
                  <div className="text-2xl font-black text-white">{Math.floor(timeSpoken)}s</div>
              </div>
              <button className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-2xl active:scale-95" onClick={handleEndCall}>
                <PhoneOff size={28} />
              </button>
              <div className="text-center">
                  <div className="text-[9px] font-mono opacity-30 uppercase tracking-[0.4em]">Accuracy</div>
                  <div className="text-2xl font-black text-white">--%</div>
              </div>
          </div>
        </>
      )}
    </div>
  );
}
