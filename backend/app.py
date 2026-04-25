import os
import io
import time
import asyncio
import edge_tts
import google.generativeai as genai
import logging
import json
from pathlib import Path
from dotenv import load_dotenv
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Importação Agora
from agora_token_builder import RtcTokenBuilder

# Configuração de Logs
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger("ALICE_Engine")

# Carrega o .env
env_path = Path(__file__).parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

AGORA_APP_ID = os.getenv("AGORA_APP_ID", "")
AGORA_APP_CERTIFICATE = os.getenv("AGORA_APP_CERTIFICATE", "")
genai.configure(api_key=os.environ.get("GEMINI_API_KEY", ""))

# --- SYSTEM PROMPT: ALICE MASTER PROMPT (P0) ---
SYSTEM_PROMPT_ALICE = """
# ROLE
You are ALICE, a world-class AI English Tutor and Proficiency Evaluator.
Your goal is to help users overcome their fear of speaking through real-time conversation.

# CORE RULES
1. **Identity:** You are ALICE. Never mention any other name.
2. **Conciseness:** Keep responses under 2 short sentences. Users must talk more than you.
3. **Feedback:** If the user makes a mistake, respond naturally first, then add a brief correction.
   Ex: "That's great! Quick tip: say 'on the weekend' instead of 'in the weekend'. What else did you do?"

# OUTPUT FORMAT (Strict JSON)
You MUST always respond with this JSON structure:
{
  "reply": "Your natural spoken response",
  "coach_note": "Technical tip or correction",
  "metrics": {
    "cefr_level": "A1" | "A2" | "B1" | "B2" | "C1" | "C2",
    "scores": {
      "pronunciation": 0-100,
      "grammar": 0-100,
      "vocabulary": 0-100,
      "fluency": 0-100,
      "filler_words": 0-100
    }
  }
}

# EVALUATION CRITERIA
- Grammar: Penalize basic preposition or tense errors.
- Filler Words: Count "uh", "um", "like" and lower the score if they exceed 10% of total words.
- Vocabulary: Higher score for phrasal verbs, technical jargon, or idioms.
- Fluency: Base it on the coherence and the breaks in transcription.
"""

model_alice = genai.GenerativeModel(
    model_name='gemini-1.5-flash',
    system_instruction=SYSTEM_PROMPT_ALICE,
    generation_config={"response_mime_type": "application/json"}
)

app = FastAPI(title="ALICE Intelligence Platform", version="1.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

class AgoraSessionRequest(BaseModel):
    user_uid: int
    channel_name: str

@app.post("/api/agora/session")
async def create_agora_session(req: AgoraSessionRequest):
    try:
        role = 1 
        current_timestamp = int(time.time())
        privilege_expired_ts = current_timestamp + 3600
        token = RtcTokenBuilder.buildTokenWithUid(AGORA_APP_ID, AGORA_APP_CERTIFICATE, req.channel_name, req.user_uid, role, privilege_expired_ts)
        return {"appId": AGORA_APP_ID, "token": token, "channel": req.channel_name, "uid": req.user_uid}
    except Exception as e: return {"error": str(e)}

async def generate_tts_audio(text: str) -> bytes:
    try:
        if not text.strip(): return b""
        communicate = edge_tts.Communicate(text, "en-US-AriaNeural")
        audio_data = b""
        async for chunk in communicate.stream():
            if chunk["type"] == "audio": audio_data += chunk["data"]
        return audio_data
    except Exception as e: return b""

@app.websocket("/ws/chat")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    
    greeting = "Hi, I am ALICE, your personal English tutor. How are you today?"
    initial_data = {
        "reply": greeting,
        "coach_note": "Let's start our 30-second assessment.",
        "metrics": {"cefr_level": "A1", "scores": {"pronunciation": 0, "grammar": 0, "vocabulary": 0, "fluency": 0, "filler_words": 0}}
    }
    await websocket.send_text(json.dumps(initial_data))
    audio = await generate_tts_audio(greeting)
    if audio: await websocket.send_bytes(audio)

    chat = model_alice.start_chat(history=[])

    try:
        while True:
            message = await websocket.receive()
            if "bytes" in message:
                user_input = [{"mime_type": "audio/webm", "data": message["bytes"]}, "Evaluate my speech and respond."]
            else:
                user_input = message.get("text", "").strip()
                if not user_input: continue
            
            try:
                response = chat.send_message(user_input)
                data = json.loads(response.text)
                await websocket.send_text(json.dumps(data))
                audio_bytes = await generate_tts_audio(data["reply"])
                if audio_bytes: await websocket.send_bytes(audio_bytes)
            except Exception as e:
                logger.error(f"ALICE Processing Error: {e}")

    except Exception as e:
        logger.error(f"ALICE WS Error: {e}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
