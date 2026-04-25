import AgoraRTC, { IAgoraRTCClient, IMicrophoneAudioTrack, IRemoteAudioTrack } from "agora-rtc-sdk-ng";

export class AgoraManager {
  private client: IAgoraRTCClient;
  private localAudioTrack: IMicrophoneAudioTrack | null = null;

  constructor() {
    this.client = AgoraRTC.createClient({
      mode: "rtc",
      codec: "vp8"
    });
  }

  async join(appId: string, channel: string, token: string, uid: number) {
    try {
      await this.client.join(appId, channel, token, uid);
      console.log("✅ [Agora] Entrou no canal com sucesso.");
    } catch (error) {
      console.error("❌ [Agora] Erro ao entrar no canal:", error);
      throw error;
    }
  }

  async publish() {
    try {
      if (!this.localAudioTrack) {
        this.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      }
      await this.client.publish([this.localAudioTrack]);
      console.log("🎙️ [Agora] Áudio local publicado.");
      return this.localAudioTrack;
    } catch (error) {
      console.error("❌ [Agora] Erro ao publicar áudio:", error);
      throw error;
    }
  }

  onUserPublished(callback: (user: any, mediaType: "audio" | "video") => void) {
    this.client.on("user-published", callback);
  }

  onVolumeIndicator(callback: (volumes: { uid: string | number; level: number }[]) => void) {
    this.client.enableAudioVolumeIndicator();
    this.client.on("volume-indicator", callback);
  }

  async leave() {
    this.localAudioTrack?.stop();
    this.localAudioTrack?.close();
    await this.client.leave();
    console.log("🛑 [Agora] Saiu do canal.");
  }

  async toggleMute(muted: boolean) {
    if (this.localAudioTrack) {
      await this.localAudioTrack.setEnabled(!muted);
    }
  }

  getClient() {
    return this.client;
  }
}

export const agoraManager = new AgoraManager();
