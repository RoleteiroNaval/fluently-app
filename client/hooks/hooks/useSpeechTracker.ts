import { useState, useEffect, useRef, useCallback } from 'react';
import { useVibe } from '../context/VibeContext';

export function useSpeechTracker() {
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [timeSpoken, setTimeSpoken] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState('');
  const [fullTranscript, setFullTranscript] = useState('');
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [volume, setVolume] = useState(0);

  const { setEmotion } = useVibe();

  const isRecordingRef = useRef(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastSpeakingStateRef = useRef(false); // Para evitar spam de log do VAD
  const timeSpokenRef = useRef(0);
  const lastTickRef = useRef<number>(0);
  const framesAboveThreshold = useRef(0);
  const framesBelowThreshold = useRef(0);

  const stopRecording = useCallback(() => {
    console.log("🛑 [SpeechTracker] Resetando sistema de áudio...");
    isRecordingRef.current = false;
    setIsRecording(false);
    setIsSpeaking(false);
    framesAboveThreshold.current = 0;
    framesBelowThreshold.current = 0;

    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);

    if (recognitionRef.current) {
      recognitionRef.current.onend = null;
      try { recognitionRef.current.stop(); } catch (e) { }
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      try { audioContextRef.current.close(); } catch (e) { }
      audioContextRef.current = null;
    }
    setAnalyser(null);
  }, []);

  const startRecording = useCallback(async () => {
    try {
      // Limpa qualquer resquício de sessão anterior
      if (isRecordingRef.current) stopRecording();

      console.log("🎤 [SpeechTracker] Solicitando permissão de microfone...");
      setFullTranscript(''); // Limpa o transcript completo ao iniciar nova gravação
      setError(null);

      // FORÇA O PEDIDO DE MICROFONE
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      isRecordingRef.current = true;
      setIsRecording(true);
      console.log("✅ [SpeechTracker] Microfone acessado com sucesso! Stream obtido.");

      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioCtx;

      const analyserNode = audioCtx.createAnalyser();
      analyserNode.fftSize = 256;
      analyserRef.current = analyserNode;
      setAnalyser(analyserNode);

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyserNode);

      // Inicia o Reconhecimento de Fala
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        // Configurações para detecção de idioma (se necessário, pode ser dinâmico)
        // recognition.lang = 'pt-BR'; // Exemplo: para testar em português
        recognition.lang = 'en-US'; // Padrão: inglês

        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event: any) => {
          let interim = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const t = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              setFullTranscript(prev => prev + " " + t.trim());
              window.dispatchEvent(new CustomEvent('speech-final', { detail: t.trim() }));
            } else {
              interim += t;
            }
          }
          setTranscript(interim);
        };

        recognition.onstart = () => {
          console.log("▶️ [SpeechTracker] SpeechRecognition iniciado.");
        };

        recognition.onend = () => {
          console.log("⏹️ [SpeechTracker] SpeechRecognition encerrado.");
          if (isRecordingRef.current) {
            // Tenta reiniciar a cada parada, para manter a gravação contínua
            try { recognition.start(); } catch (e) { console.error("❌ [SpeechTracker] Erro ao reiniciar SpeechRecognition:", e); }
          }
        };
        recognition.onerror = (event: any) => {
          console.error("❌ [SpeechTracker] Erro no SpeechRecognition:", event.error, event);
        };

        recognitionRef.current = recognition;
        recognition.start();
        console.log("✅ [SpeechTracker] Reconhecimento ativado.");
      }

      // Loop do Visualizador e VAD
      lastTickRef.current = performance.now();
      const checkAudio = () => {
        if (!isRecordingRef.current || !analyserNode) return;

        const data = new Uint8Array(analyserNode.frequencyBinCount);
        analyserNode.getByteFrequencyData(data);
        const average = data.reduce((a, b) => a + b) / data.length;

        // Atualiza o volume para animações externas (0-100)
        setVolume(Math.min(100, average * 4));

        // --- AJUSTE DE PARÂMETROS VAD ---
        const ENERGY_THRESHOLD = 5;    // Tornando mais sensível para captar sussurros
        const MIN_SPEECH_FRAMES = 4;   // Duração mínima para validar fala (~60ms)
        const MIN_SILENCE_FRAMES = 25; // Duração mínima para declarar silêncio (~400ms)

        const isAboveThreshold = average > ENERGY_THRESHOLD;

        if (isAboveThreshold) {
          framesAboveThreshold.current++;
          framesBelowThreshold.current = 0;

          if (framesAboveThreshold.current >= MIN_SPEECH_FRAMES) {
            if (!lastSpeakingStateRef.current) {
              setIsSpeaking(true);
              lastSpeakingStateRef.current = true;
              console.log("🔊 [VAD] FALA ATIVA detectada.");
            }
          }
        } else {
          framesBelowThreshold.current++;
          framesAboveThreshold.current = 0;

          if (framesBelowThreshold.current >= MIN_SILENCE_FRAMES) {
            if (lastSpeakingStateRef.current) {
              setIsSpeaking(false);
              lastSpeakingStateRef.current = false;
              console.log("🔇 [VAD] SILÊNCIO detectado.");
            }
          }
        }

        const now = performance.now();
        if (lastSpeakingStateRef.current) {
          timeSpokenRef.current += (now - lastTickRef.current) / 1000;
          setTimeSpoken(timeSpokenRef.current);
        }
        lastTickRef.current = now;
        animationFrameRef.current = requestAnimationFrame(checkAudio);
      };
      checkAudio();

    } catch (err: any) {
      setError("Permissão negada ou erro de microfone.");
      setIsRecording(false);
      isRecordingRef.current = false;
      console.error("❌ [SpeechTracker] Falha crítica:", err);
    }
  }, [stopRecording]);

  useEffect(() => {
    return () => stopRecording();
  }, [stopRecording]);

  return {
    isRecording,
    isSpeaking,
    timeSpoken,
    error,
    transcript,
    fullTranscript,
    startRecording,
    stopRecording,
    analyser,
    volume
  };
}
