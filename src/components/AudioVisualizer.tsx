import React, { useRef, useEffect, useCallback } from 'react';

interface AudioVisualizerProps {
  analyserNode: AnalyserNode | null;
  isActive: boolean;
  className?: string;
  color?: string;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  analyserNode,
  isActive,
  className = '',
  color = '#8b5cf6'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  const updateGlow = useCallback(() => {
    if (!analyserNode || !containerRef.current) return;

    const bufferLength = analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const animate = () => {
      if (!containerRef.current || !analyserNode) return;
      
      analyserNode.getByteFrequencyData(dataArray);
      
      // Calcula a intensidade média
      const average = dataArray.reduce((a, b) => a + b) / bufferLength;
      const intensity = average / 128; // 0 a 2
      
      // Aplica o efeito de luz dinâmica
      const scale = isActive ? 1 + (intensity * 0.4) : 1;
      const glowOpacity = isActive ? 0.4 + (intensity * 0.6) : 0.1;
      const blur = isActive ? 15 + (intensity * 40) : 10;

      containerRef.current.style.transform = `scale(${scale})`;
      containerRef.current.style.boxShadow = `0 0 ${blur}px ${blur/2}px ${color}${Math.floor(glowOpacity * 255).toString(16).padStart(2, '0')}`;
      containerRef.current.style.borderColor = isActive ? `${color}aa` : 'rgba(255,255,255,0.1)';

      rafRef.current = requestAnimationFrame(animate);
    };

    animate();
  }, [analyserNode, isActive, color]);

  useEffect(() => {
    updateGlow();
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [updateGlow]);

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Camada Externa de Brilho (O movimento de luz) */}
      <div
        ref={containerRef}
        className="w-24 h-24 rounded-full border-2 transition-all duration-75 flex items-center justify-center bg-transparent relative"
        style={{ transitionTimingFunction: 'cubic-bezier(0.2, 0.8, 0.2, 1)' }}
      >
        {/* Orbe Central */}
        <div 
            className="w-20 h-20 rounded-full bg-white/5 backdrop-blur-3xl border border-white/10 flex items-center justify-center overflow-hidden shadow-inner"
        >
             {/* Micro-animação interna para dar profundidade */}
             <div className={`absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent animate-pulse`} />
        </div>
      </div>
    </div>
  );
};
