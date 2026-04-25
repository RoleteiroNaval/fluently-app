import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Award, BookOpen, CheckCircle, ChevronLeft, Lightbulb, RefreshCw, Star, ArrowRight } from 'lucide-react';

interface LocationState {
  transcript: string;
  timeSpoken: number;
  targetSeconds: number;
}

interface EvaluationResult {
  fluency_score: number;
  grammar_score: number;
  feedback_summary: string;
  grammar_corrections: string[];
}

export function FeedbackDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!state?.transcript) {
      // Se não tiver transcrição (ex: navegação direta), usa mock ou volta pro inicio
      if (!state) {
        navigate('/');
        return;
      }
    }

    const evaluateSession = async () => {
      try {
        const response = await fetch('http://localhost:8000/evaluate_session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            transcript: state.transcript || 'No speech detected.',
            target_seconds: state.targetSeconds || 30,
            time_spoken: state.timeSpoken || 0
          })
        });

        if (!response.ok) throw new Error('Falha ao avaliar sessão');
        
        const data = await response.json();
        setResult(data);
      } catch (err) {
        console.error(err);
        setError('Não foi possível carregar a avaliação da IA.');
      } finally {
        setLoading(false);
      }
    };

    evaluateSession();
  }, [state, navigate]);

  if (loading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-6 animate-fade-in">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-white/10 rounded-full"></div>
          <div className="w-20 h-20 border-4 border-accent-primary rounded-full border-t-transparent animate-spin absolute inset-0"></div>
        </div>
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-accent-primary animate-pulse">
          Analisando sua Fluência...
        </h2>
        <p className="text-text-muted">A Stacy está processando sua gramática e vocabulário.</p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4 animate-fade-in">
        <div className="text-red-400 mb-4"><RefreshCw size={48} /></div>
        <h2 className="text-xl font-bold">Ops, algo deu errado.</h2>
        <p className="text-text-muted">{error}</p>
        <button className="btn btn-primary mt-4" onClick={() => navigate('/')}>Tentar Novamente</button>
      </div>
    );
  }

  const averageScore = Math.round((result.fluency_score + result.grammar_score) / 2);
  let grade = 'A';
  if (averageScore < 90) grade = 'B';
  if (averageScore < 75) grade = 'C';
  if (averageScore < 60) grade = 'D';

  return (
    <div className="w-full max-w-4xl h-full flex flex-col animate-fade-in py-8 px-4 overflow-y-auto">
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-text-muted hover:text-white transition-colors self-start mb-6"
      >
        <ChevronLeft size={20} /> Voltar para o Início
      </button>

      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2">Seu Relatório de Fluência</h1>
        <p className="text-text-secondary">Análise detalhada da sua conversa com a ALICE</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Overall Score */}
        <div className="glass-card p-6 flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="text-accent-primary mb-2"><Award size={32} /></div>
          <div className="text-5xl font-black mb-1">{averageScore}</div>
          <div className="text-sm tracking-widest text-text-muted uppercase">Pontuação Geral</div>
          <div className="absolute top-4 right-4 font-black text-3xl opacity-10 font-mono">{grade}</div>
        </div>

        {/* Fluency */}
        <div className="glass-card p-6 flex flex-col items-center justify-center">
          <div className="text-blue-400 mb-2"><Star size={32} /></div>
          <div className="text-4xl font-bold mb-1">{result.fluency_score}</div>
          <div className="text-sm tracking-widest text-text-muted uppercase">Fluência</div>
          <div className="w-full bg-white/5 h-2 rounded-full mt-4 overflow-hidden">
            <div className="h-full bg-blue-400 rounded-full" style={{ width: `${result.fluency_score}%` }}></div>
          </div>
        </div>

        {/* Grammar */}
        <div className="glass-card p-6 flex flex-col items-center justify-center">
          <div className="text-green-400 mb-2"><CheckCircle size={32} /></div>
          <div className="text-4xl font-bold mb-1">{result.grammar_score}</div>
          <div className="text-sm tracking-widest text-text-muted uppercase">Gramática</div>
          <div className="w-full bg-white/5 h-2 rounded-full mt-4 overflow-hidden">
            <div className="h-full bg-green-400 rounded-full" style={{ width: `${result.grammar_score}%` }}></div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Feedback Summary */}
        <div className="glass-card p-6 flex flex-col">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
            <Lightbulb className="text-accent-primary" size={20} /> Feedback da Stacy
          </h3>
          <p className="text-text-secondary leading-relaxed text-sm">
            {result.feedback_summary}
          </p>

          <h3 className="text-lg font-bold mt-8 mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
            <BookOpen className="text-orange-400" size={20} /> O que você disse
          </h3>
          <p className="text-text-muted leading-relaxed text-sm italic bg-black/20 p-4 rounded-lg border border-white/5">
            "{state?.transcript || 'Nenhuma fala capturada.'}"
          </p>
        </div>

        {/* Corrections */}
        <div className="glass-card p-6 flex flex-col">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
            <CheckCircle className="text-success" size={20} /> Correções Gramaticais
          </h3>
          <ul className="space-y-4">
            {result.grammar_corrections.length > 0 ? (
              result.grammar_corrections.map((correction, idx) => (
                <li key={idx} className="flex gap-3 text-sm text-text-secondary bg-white/5 p-3 rounded-lg">
                  <div className="mt-0.5 text-accent-primary"><ArrowRight size={16} /></div>
                  <span>{correction}</span>
                </li>
              ))
            ) : (
              <li className="text-text-muted italic">Nenhuma correção necessária. Mandou bem!</li>
            )}
          </ul>
        </div>
      </div>

    </div>
  );
}
