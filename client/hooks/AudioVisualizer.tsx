import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
    analyser: AnalyserNode | null;
    isSpeaking: boolean;
    color?: string;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ analyser, isSpeaking, color = '#3b82f6' }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!analyser || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        let animationId: number;

        const draw = () => {
            animationId = requestAnimationFrame(draw);
            analyser.getByteFrequencyData(dataArray);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const barWidth = (canvas.width / bufferLength) * 1.5;
            let barHeight;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                // Aumenta a sensibilidade visual
                barHeight = (dataArray[i] / 255) * canvas.height * 0.8;

                const height = isSpeaking ? Math.max(barHeight, 2) : 2;

                ctx.fillStyle = color;
                ctx.fillRect(x, (canvas.height - height) / 2, barWidth, height);
                x += barWidth + 1;
            }
        };

        draw();
        return () => cancelAnimationFrame(animationId);
    }, [analyser, isSpeaking, color]);

    return <canvas ref={canvasRef} className="w-full h-16 opacity-80" width={300} height={64} />;
};