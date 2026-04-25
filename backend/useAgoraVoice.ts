import { useState, useEffect, useRef, useCallback } from 'react';
import AgoraRTC, { IAgoraRTCClient, IMicrophoneAudioTrack } from "agora-rtc-sdk-ng";

const APP_ID = import.meta.env.VITE_AGORA_APP_ID;

export function useAgoraVoice() {
    const [isConnected, setIsConnected] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isUserSpeaking, setIsUserSpeaking] = useState(false);
    const [isAiSpeaking, setIsAiSpeaking] = useState(false);
    const [volumeLevel, setVolume] = useState(0);

    const clientRef = useRef<IAgoraRTCClient | null>(null);
    const localTrackRef = useRef<IMicrophoneAudioTrack | null>(null);

    const init = useCallback(async (channelName: string, token: string, uid: number) => {
        if (!APP_ID) {
            console.error("Agora App ID não configurado no arquivo .env");
            return;
        }

        try {
            const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
            clientRef.current = client;

            // Ouvir a voz da Stacy
            client.on("user-published", async (user, mediaType) => {
                await client.subscribe(user, mediaType);
                if (mediaType === "audio") {
                    user.audioTrack?.play();
                    setIsAiSpeaking(true);
                }
            });

            client.on("user-unpublished", (user, mediaType) => {
                if (mediaType === "audio") setIsAiSpeaking(false);
            });

            // Detecção de Voz (VAD)
            client.enableAudioVolumeIndicator();
            client.on("volume-indicator", (volumes) => {
                volumes.forEach((volume) => {
                    if (volume.uid === uid) {
                        setIsUserSpeaking(volume.level > 5);
                        setVolume(volume.level);
                    } else {
                        setIsAiSpeaking(volume.level > 5);
                    }
                });
            });

            await client.join(APP_ID, channelName, token, uid);

            const localTrack = await AgoraRTC.createMicrophoneAudioTrack({
                AEC: true, // Cancelamento de Eco
                ANS: true, // Supressão de Ruído
                AGC: true  // Controle de Ganho Automático
            });

            localTrackRef.current = localTrack;
            await client.publish([localTrack]);

            setIsConnected(true);
        } catch (error) {
            console.error("Erro ao iniciar chamada:", error);
        }
    }, []);

    const leave = useCallback(async () => {
        localTrackRef.current?.stop();
        localTrackRef.current?.close();
        if (clientRef.current) {
            await clientRef.current.leave();
        }
        setIsConnected(false);
        setIsAiSpeaking(false);
        setIsUserSpeaking(false);
    }, []);

    const toggleMute = useCallback(async () => {
        if (localTrackRef.current) {
            const newState = !isMuted;
            await localTrackRef.current.setMuted(newState);
            setIsMuted(newState);
        }
    }, [isMuted]);

    useEffect(() => {
        return () => { leave(); };
    }, [leave]);

    return {
        isConnected,
        isMuted,
        isUserSpeaking,
        isAiSpeaking,
        volumeLevel,
        init,
        leave,
        toggleMute
    };
}