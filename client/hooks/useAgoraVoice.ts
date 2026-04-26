import { useState, useEffect, useRef, useCallback } from 'react';
import AgoraRTC, { IAgoraRTCClient, IMicrophoneAudioTrack, IRemoteAudioTrack, UID } from 'agora-rtc-sdk-ng';
import { useAliceStore } from '../store/useAliceStore';

export function useAgoraVoice() {
  const [isJoined, setIsJoined] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [userVolume, setUserVolume] = useState(0);
  const [aiVolume, setAiVolume] = useState(0);
  const { setMetrics } = useAliceStore();

  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const localTrackRef = useRef<IMicrophoneAudioTrack | null>(null);
  const remoteTrackRef = useRef<IRemoteAudioTrack | null>(null);

  const joinSession = useCallback(async (appId: string, channel: string, token: string, uid: number) => {
    // Garantir que não existam clientes duplicados
    if (clientRef.current) {
      await clientRef.current.leave();
    }

    const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
    clientRef.current = client;

    try {
      // Listeners antes do Join (Padrão ALICE)
      client.on('user-published', async (user, mediaType) => {
        if (mediaType === 'audio') {
          await client.subscribe(user, mediaType);
          remoteTrackRef.current = user.audioTrack as IRemoteAudioTrack;
          remoteTrackRef.current.play();
        }
      });

      // VAD Real via Volume Indicator
      client.enableAudioVolumeIndicator();
      client.on('volume-indicator', (volumes) => {
        volumes.forEach(v => {
          if (v.uid === uid || v.uid === 0) { // 0 é o local em alguns casos
            setUserVolume(v.level);
          } else {
            setAiVolume(v.level);
          }
        });
      });

      await client.join(appId, channel, token, uid);

      // Captura Local Gerenciada com Supressão de Ruído (Inegociável P0)
      const localTrack = await AgoraRTC.createMicrophoneAudioTrack({
        AEC: true,
        ANS: true,
        AGC: true
      });

      localTrackRef.current = localTrack;
      await client.publish(localTrack);

      setIsJoined(true);
    } catch (err) {
      console.error("ALICE Engine Error:", err);
    }
  }, []);

  const leaveSession = useCallback(async () => {
    localTrackRef.current?.stop();
    localTrackRef.current?.close();
    await clientRef.current?.leave();
    clientRef.current = null;
    setIsJoined(false);
    setUserVolume(0);
    setAiVolume(0);
  }, []);

  const toggleMute = useCallback(async () => {
    if (localTrackRef.current) {
      const newState = !isMuted;
      await localTrackRef.current.setEnabled(!newState);
      setIsMuted(newState);
    }
  }, [isMuted]);

  return {
    isJoined,
    isMuted,
    isUserSpeaking: userVolume > 5,
    isAiSpeaking: aiVolume > 5,
    userVolume,
    aiVolume,
    joinSession,
    leaveSession,
    toggleMute
  };
}
