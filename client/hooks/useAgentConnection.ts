import { useState, useCallback, useRef, useEffect } from 'react';

export function useAgentConnection() {
  const [isConnected, setIsConnected] = useState(false);
  const [agentSpeaking, setAgentSpeaking] = useState(false);
  const [agentMessages, setAgentMessages] = useState<string[]>([]);
  
  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const lastTextReceivedRef = useRef<string>("");
  const fallbackTimerRef = useRef<any>(null);

  const ensureAudioContext = useCallback(async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContextRef.current.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
    }
    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }
    return { ctx: audioContextRef.current, analyser: analyserRef.current };
  }, []);

  const playFallbackTTS = useCallback((text: string) => {
    if (!text || agentSpeaking) return;
    console.warn("🚨 [EMERGÊNCIA] Áudio do servidor não chegou. Usando voz do navegador.");
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1.0;
    
    utterance.onstart = () => setAgentSpeaking(true);
    utterance.onend = () => setAgentSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  }, [agentSpeaking]);

  const connect = useCallback(() => {
    if (wsRef.current) return;
    const ws = new WebSocket('ws://127.0.0.1:8000/ws/chat');
    wsRef.current = ws;

    ws.onopen = () => setIsConnected(true);
    
    ws.onmessage = async (event) => {
      if (typeof event.data === 'string') {
        // RECEBEU TEXTO
        console.log("📩 Texto recebido:", event.data);
        lastTextReceivedRef.current = event.data;
        setAgentMessages(prev => [...prev, event.data]);

        // LIMPA TIMER ANTERIOR E INICIA NOVO TIMER DE EMERGÊNCIA (1.5s)
        if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
        fallbackTimerRef.current = setTimeout(() => {
            if (!agentSpeaking) {
                playFallbackTTS(lastTextReceivedRef.current);
            }
        }, 3000);

      } else {
        // RECEBEU ÁUDIO (Sucesso do Servidor)
        console.log("🎵 Áudio recebido do servidor. Cancelando timer de emergência.");
        if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
        
        setAgentSpeaking(true);
        const setup = await ensureAudioContext();
        
        try {
          const arrayBuffer = event.data instanceof Blob ? await event.data.arrayBuffer() : event.data;
          setup.ctx.decodeAudioData(
            arrayBuffer,
            (buffer) => {
              const source = setup.ctx.createBufferSource();
              source.buffer = buffer;
              source.connect(setup.analyser!);
              setup.analyser!.connect(setup.ctx.destination);
              source.onended = () => setAgentSpeaking(false);
              source.start(0);
            },
            () => playFallbackTTS(lastTextReceivedRef.current)
          );
        } catch (err) {
          playFallbackTTS(lastTextReceivedRef.current);
        }
      }
    };
    
    ws.onclose = () => {
      setIsConnected(false);
      wsRef.current = null;
    };
  }, [ensureAudioContext, playFallbackTTS, agentSpeaking]);

  const sendMessage = useCallback((text: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(text);
    }
  }, []);

  return {
    isConnected,
    agentSpeaking,
    agentMessages,
    connect,
    sendMessage,
    ensureAudioContext,
    agentAnalyserNode: analyserRef.current
  };
}
