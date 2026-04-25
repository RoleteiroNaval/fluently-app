import React, { useEffect } from 'react';
import { useAgoraVoice } from '../hooks/useAgoraVoice';
import { VoiceOrb } from '../components/VoiceOrb';
import { Mic, MicOff, PhoneOff, Shield, Activity, Wifi } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function PracticeRoom() {
    const { isConnected, isMuted, isUserSpeaking, isAiSpeaking, init, leave, toggleMute } = useAgoraVoice();
    const navigate = useNavigate();

    useEffect(() => {
        const startSession = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/agora/session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user_uid: 0, channel_name: "practice_room" })
                });
                const data = await response.json();
                if (data.token) {
                    await init(data.channel, data.token, data.uid);
                }
            } catch (err) {
                console.error("Erro ao conectar com o servidor:", err);
            }
        };
        startSession();
    }, [init]);

    const handleEndSession = async () => {
        await leave();
        navigate('/');
    };

    return (
        <div className="fixed inset-0 bg-[#0a0a0a] text-white flex flex-col overflow-hidden">
            <header className="p-6 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                        <Shield size={14} className="text-violet-500" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Sessão Segura</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-500">
                        <Activity size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-wider italic">Stacy Online</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                    <Wifi size={16} />
                    <span className="text-xs font-mono">Realtime</span>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center gap-16">
                <VoiceOrb
                    isSpeaking={isAiSpeaking}
                    label={isAiSpeaking ? "Stacy is speaking..." : "Stacy is listening"}
                    color="purple"
                />

                <div className="flex items-center gap-8">
                    <button
                        onClick={toggleMute}
                        className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${isMuted ? 'bg-red-500 shadow-lg' : 'bg-white/10 hover:bg-white/20'
                            }`}
                    >
                        {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                    </button>

                    <button
                        onClick={handleEndSession}
                        className="w-16 h-16 rounded-full bg-red-600/20 text-red-500 border border-red-500/50 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                    >
                        <PhoneOff size={24} />
                    </button>
                </div>

                <VoiceOrb isSpeaking={isUserSpeaking} label="You" color="green" />
            </main>

            <footer className="p-8 grid grid-cols-4 gap-4 bg-gradient-to-t from-black/50 to-transparent text-center">
                <StatBox label="Practice Time" value="Connected" />
                <StatBox label="Accuracy" value="--" />
                <StatBox label="Words Today" value="--" />
                <StatBox label="Fluency" value="Active" />
            </footer>
        </div>
    );
}

function StatBox({ label, value }: { label: string, value: string }) {
    return (
        <div>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest">{label}</span>
            <div className="text-lg font-bold text-violet-400">{value}</div>
        </div>
    );
}