export interface EmotionResponse {
  emotion: 'energetic' | 'neutral' | 'tired' | 'frustrated';
  confidence: number;
  features_extracted: any;
  suggested_target_seconds: number;
}

const API_URL = 'http://localhost:8000';

export async function analyzeEmotion(audioBlob: Blob): Promise<EmotionResponse | null> {
  const formData = new FormData();
  formData.append('audio_file', audioBlob, 'chunk.webm');

  try {
    const response = await fetch(`${API_URL}/analyze_emotion`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: EmotionResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error sending audio to emotion API:', error);
    return null;
  }
}
