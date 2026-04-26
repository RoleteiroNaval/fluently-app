import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScreenContainer } from '@/components/ScreenContainer';
import { AIChatBubble } from '@/components/AIChatBubble';
import { SelectableCard } from '@/components/SelectableCard';
import { FluentlyButton } from '@/components/FluentlyButton';
import { AIAvatar } from '@/components/AIAvatar';

type OnboardingStep = 'level' | 'aspects' | 'motivation' | 'impediments' | 'profession' | 'method' | 'assessment' | 'call-intro';

export default function Index() {
  const navigate = useNavigate();
  const [step, setStep] = useState<OnboardingStep>('level');
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [selectedAspects, setSelectedAspects] = useState<string[]>([]);
  const [selectedMotivation, setSelectedMotivation] = useState<string | null>(null);
  const [selectedImpediments, setSelectedImpediments] = useState<string[]>([]);
  const [selectedProfession, setSelectedProfession] = useState<string | null>(null);

  const handleNext = () => {
    const steps: OnboardingStep[] = [
      'level',
      'aspects',
      'motivation',
      'impediments',
      'profession',
      'method',
      'assessment',
      'call-intro',
    ];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const steps: OnboardingStep[] = [
      'level',
      'aspects',
      'motivation',
      'impediments',
      'profession',
      'method',
      'assessment',
      'call-intro',
    ];
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1]);
    }
  };

  const toggleAspect = (aspect: string) => {
    setSelectedAspects((prev) =>
      prev.includes(aspect)
        ? prev.filter((a) => a !== aspect)
        : [...prev, aspect]
    );
  };

  const toggleImpediment = (impediment: string) => {
    setSelectedImpediments((prev) =>
      prev.includes(impediment)
        ? prev.filter((i) => i !== impediment)
        : [...prev, impediment]
    );
  };

  // Step: Level Selection
  if (step === 'level') {
    return (
      <ScreenContainer onBack={() => {}} showBackButton={false}>
        <div className="w-full max-w-md">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-center leading-tight">
            Comece a falar inglês
            <span className="text-gradient-fluently ml-2">fluentamente</span> com o AI Tutor.
          </h1>

          <div className="mt-8 mb-12 flex gap-4 justify-center flex-wrap text-xs md:text-sm">
            <div className="flex items-center gap-1">
              <span>🍎 APP STORE</span>
              <span className="ml-1">4.8 ⭐ 23K+</span>
            </div>
            <div className="flex items-center gap-1">
              <span>▶️ GOOGLE PLAY</span>
              <span className="ml-1">4.8 ⭐ 15K+</span>
            </div>
            <div className="flex items-center gap-1">
              <span>✔️ TRUSTPILOT</span>
              <span className="ml-1">4.7 ⭐ 1K+</span>
            </div>
          </div>

          <AIChatBubble
            message="Ei! Cadê você com o inglês? 👋"
            avatar={<AIAvatar size="medium" />}
          />

          <div className="space-y-3">
            <SelectableCard
              title="Apenas começando"
              description="Quero começar a falar"
              isSelected={selectedLevel === 'beginner'}
              onSelect={() => setSelectedLevel('beginner')}
            />
            <SelectableCard
              title="Eu posso falar, mas fico preso"
              description="Eu entendo mais do que posso dizer"
              isSelected={selectedLevel === 'intermediate'}
              onSelect={() => setSelectedLevel('intermediate')}
            />
            <SelectableCard
              title="Quero soar natural"
              description="Menos erros, melhores expressões"
              isSelected={selectedLevel === 'advanced'}
              onSelect={() => setSelectedLevel('advanced')}
            />
          </div>

          <div className="mt-8 text-center text-sm text-gray-400">
            ✨ Avaliação gratuita — leva apenas <span className="text-cyan-400 font-semibold">4 min</span>
          </div>

          <FluentlyButton
            fullWidth
            size="lg"
            className="mt-8"
            onClick={handleNext}
            disabled={!selectedLevel}
          >
            Continuar
          </FluentlyButton>
        </div>
      </ScreenContainer>
    );
  }

  // Step: Aspects Selection
  if (step === 'aspects') {
    return (
      <ScreenContainer onBack={handleBack}>
        <div className="w-full max-w-md">
          <div className="h-1 bg-gray-700 rounded-full mb-8">
            <div className="h-full bg-cyan-400 rounded-full" style={{ width: '14%' }} />
          </div>

          <AIChatBubble
            message="Qual aspecto do seu inglês você mais quer melhorar?"
            avatar={<AIAvatar size="medium" />}
          />

          <div className="grid grid-cols-2 gap-3 mb-8">
            <SelectableCard
              icon="🎤"
              title="Falar com confiança"
              variant="compact"
              isSelected={selectedAspects.includes('confidence')}
              onSelect={() => toggleAspect('confidence')}
            />
            <SelectableCard
              icon="📢"
              title="Melhorar a pronúncia"
              variant="compact"
              isSelected={selectedAspects.includes('pronunciation')}
              onSelect={() => toggleAspect('pronunciation')}
            />
            <SelectableCard
              icon="💬"
              title="Ampliar o vocabulário"
              variant="compact"
              isSelected={selectedAspects.includes('vocabulary')}
              onSelect={() => toggleAspect('vocabulary')}
            />
            <SelectableCard
              icon="🎓"
              title="Usar a gramática corretamente"
              variant="compact"
              isSelected={selectedAspects.includes('grammar')}
              onSelect={() => toggleAspect('grammar')}
            />
            <SelectableCard
              icon="🎧"
              title="Entender falantes nativos"
              variant="compact"
              isSelected={selectedAspects.includes('listening')}
              onSelect={() => toggleAspect('listening')}
            />
            <SelectableCard
              icon="✍️"
              title="Escrever com mais fluência"
              variant="compact"
              isSelected={selectedAspects.includes('writing')}
              onSelect={() => toggleAspect('writing')}
            />
          </div>

          <FluentlyButton
            fullWidth
            size="lg"
            onClick={handleNext}
            disabled={selectedAspects.length === 0}
          >
            Continuar
          </FluentlyButton>
        </div>
      </ScreenContainer>
    );
  }

  // Step: Motivation
  if (step === 'motivation') {
    return (
      <ScreenContainer onBack={handleBack}>
        <div className="w-full max-w-md">
          <div className="h-1 bg-gray-700 rounded-full mb-8">
            <div className="h-full bg-cyan-400 rounded-full" style={{ width: '28%' }} />
          </div>

          <AIChatBubble
            message="Por que você quer melhorar seu inglês?"
            avatar={<AIAvatar size="medium" />}
          />

          <div className="space-y-3 mb-8">
            <SelectableCard
              icon="🎯"
              title="Falar com segurança no trabalho"
              isSelected={selectedMotivation === 'work'}
              onSelect={() => setSelectedMotivation('work')}
            />
            <SelectableCard
              icon="💼"
              title="Conseguir um novo emprego"
              isSelected={selectedMotivation === 'job'}
              onSelect={() => setSelectedMotivation('job')}
            />
            <SelectableCard
              icon="🌍"
              title="Viver tranquilo no exterior"
              isSelected={selectedMotivation === 'travel'}
              onSelect={() => setSelectedMotivation('travel')}
            />
            <SelectableCard
              icon="✈️"
              title="Viajar sem dificuldade"
              isSelected={selectedMotivation === 'vacation'}
              onSelect={() => setSelectedMotivation('vacation')}
            />
            <SelectableCard
              icon="📚"
              title="Ampliar minhas habilidades"
              isSelected={selectedMotivation === 'skills'}
              onSelect={() => setSelectedMotivation('skills')}
            />
            <SelectableCard
              icon="👨‍👩‍👧"
              title="Conversar com família e amigos"
              isSelected={selectedMotivation === 'family'}
              onSelect={() => setSelectedMotivation('family')}
            />
          </div>

          <FluentlyButton
            fullWidth
            size="lg"
            onClick={handleNext}
            disabled={!selectedMotivation}
          >
            Continuar
          </FluentlyButton>
        </div>
      </ScreenContainer>
    );
  }

  // Step: Impediments
  if (step === 'impediments') {
    return (
      <ScreenContainer onBack={handleBack}>
        <div className="w-full max-w-md">
          <div className="h-1 bg-gray-700 rounded-full mb-8">
            <div className="h-full bg-cyan-400 rounded-full" style={{ width: '42%' }} />
          </div>

          <AIChatBubble
            message="O que te impede de falar inglês? (Selecione todos que se aplicam)"
            avatar={<AIAvatar size="medium" />}
          />

          <div className="space-y-3 mb-8">
            <SelectableCard
              icon="😳"
              title="Eu travo quando falo"
              isSelected={selectedImpediments.includes('stutter')}
              onSelect={() => toggleImpediment('stutter')}
            />
            <SelectableCard
              icon="🎯"
              title="Não consigo me expressar"
              isSelected={selectedImpediments.includes('express')}
              onSelect={() => toggleImpediment('express')}
            />
            <SelectableCard
              icon="🗣️"
              title="Meu sotaque não é claro"
              isSelected={selectedImpediments.includes('accent')}
              onSelect={() => toggleImpediment('accent')}
            />
            <SelectableCard
              icon="🤔"
              title="Cometo erros de gramática"
              isSelected={selectedImpediments.includes('grammar')}
              onSelect={() => toggleImpediment('grammar')}
            />
            <SelectableCard
              icon="⚡"
              title="Não consigo responder rápido"
              isSelected={selectedImpediments.includes('speed')}
              onSelect={() => toggleImpediment('speed')}
            />
            <SelectableCard
              icon="🚫"
              title="Nenhuma das opções"
              isSelected={selectedImpediments.includes('none')}
              onSelect={() => toggleImpediment('none')}
            />
          </div>

          <FluentlyButton
            fullWidth
            size="lg"
            onClick={handleNext}
            disabled={selectedImpediments.length === 0}
          >
            Continuar
          </FluentlyButton>
        </div>
      </ScreenContainer>
    );
  }

  // Step: Profession
  if (step === 'profession') {
    return (
      <ScreenContainer onBack={handleBack}>
        <div className="w-full max-w-md">
          <div className="h-1 bg-gray-700 rounded-full mb-8">
            <div className="h-full bg-cyan-400 rounded-full" style={{ width: '56%' }} />
          </div>

          <AIChatBubble
            message="Em que área você trabalha?"
            avatar={<AIAvatar size="medium" />}
          />

          <div className="space-y-3 mb-8">
            <SelectableCard
              icon="💻"
              title="Tecnologia e Engenharia"
              isSelected={selectedProfession === 'tech'}
              onSelect={() => setSelectedProfession('tech')}
            />
            <SelectableCard
              icon="📊"
              title="Negócios e Finanças"
              isSelected={selectedProfession === 'finance'}
              onSelect={() => setSelectedProfession('finance')}
            />
            <SelectableCard
              icon="📚"
              title="Estudantes e Educação"
              isSelected={selectedProfession === 'education'}
              onSelect={() => setSelectedProfession('education')}
            />
            <SelectableCard
              icon="🎨"
              title="Criação e Mídia"
              isSelected={selectedProfession === 'creative'}
              onSelect={() => setSelectedProfession('creative')}
            />
            <SelectableCard
              icon="🔧"
              title="Serviços especializados e Ofícios"
              isSelected={selectedProfession === 'services'}
              onSelect={() => setSelectedProfession('services')}
            />
            <SelectableCard
              icon="📈"
              title="Marketing e Vendas"
              isSelected={selectedProfession === 'marketing'}
              onSelect={() => setSelectedProfession('marketing')}
            />
            <SelectableCard
              icon="⚕️"
              title="Saúde e Ciência"
              isSelected={selectedProfession === 'health'}
              onSelect={() => setSelectedProfession('health')}
            />
            <SelectableCard
              icon="🔍"
              title="Sem trabalho no momento"
              isSelected={selectedProfession === 'unemployed'}
              onSelect={() => setSelectedProfession('unemployed')}
            />
            <SelectableCard
              icon="🌐"
              title="Outras áreas"
              isSelected={selectedProfession === 'other'}
              onSelect={() => setSelectedProfession('other')}
            />
          </div>

          <FluentlyButton
            fullWidth
            size="lg"
            onClick={handleNext}
            disabled={!selectedProfession}
          >
            Continuar
          </FluentlyButton>
        </div>
      </ScreenContainer>
    );
  }

  // Step: Method Explanation
  if (step === 'method') {
    return (
      <ScreenContainer onBack={handleBack}>
        <div className="w-full max-w-md">
          <div className="h-1 bg-gray-700 rounded-full mb-8">
            <div className="h-full bg-cyan-400 rounded-full" style={{ width: '70%' }} />
          </div>

          <h2 className="text-2xl font-bold mb-4 text-center">Por que Fluently funciona</h2>
          <p className="text-gray-300 text-center mb-8">
            Pesquisa mostra fortes ganhos a longo prazo com o feedback interativo
          </p>

          <div className="bg-purple-900 bg-opacity-30 border border-purple-700 border-opacity-50 rounded-2xl p-8 mb-8">
            <div className="flex justify-center gap-4 mb-8">
              <div className="flex flex-col items-center">
                <div className="text-3xl mb-2">👂</div>
                <p className="text-white text-sm font-semibold">Você ouve</p>
              </div>
              <div className="flex items-center">
                <div className="text-2xl text-cyan-400">⟫</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-3xl mb-2">🗣️</div>
                <p className="text-white text-sm font-semibold">Você fala</p>
              </div>
              <div className="flex items-center">
                <div className="text-2xl text-cyan-400">⟫</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-3xl mb-2">💬</div>
                <p className="text-white text-sm font-semibold">Cada Fluently conversa</p>
              </div>
              <div className="flex items-center">
                <div className="text-2xl text-cyan-400">⟫</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-3xl mb-2">✅</div>
                <p className="text-white text-sm font-semibold">Você recebe feedback</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 text-center">
              FONTES: KRASHEN (1985), SWAIN (1985), MACKEY & GOO (2007)
            </p>
          </div>

          <FluentlyButton fullWidth size="lg" onClick={handleNext}>
            Continuar
          </FluentlyButton>
        </div>
      </ScreenContainer>
    );
  }

  // Step: Assessment with Radar Chart
  if (step === 'assessment') {
    return (
      <ScreenContainer onBack={handleBack}>
        <div className="w-full max-w-md">
          <div className="h-1 bg-gray-700 rounded-full mb-8">
            <div className="h-full bg-cyan-400 rounded-full" style={{ width: '84%' }} />
          </div>

          <h2 className="text-2xl font-bold mb-2 text-center">Vamos analisar seu inglês</h2>
          <p className="text-gray-300 text-center mb-8">
            Faça uma chamada rápida com nosso tutor IA para descobrir seu nível de inglês e receber um plano de melhorias personalizado.
          </p>

          <div className="bg-purple-900 bg-opacity-40 border border-purple-700 border-opacity-50 rounded-2xl p-6 mb-8">
            <div className="flex justify-center mb-6">
              {/* CEFR Levels */}
              <div className="flex gap-1 flex-wrap justify-center mb-4">
                {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((level, idx) => (
                  <div
                    key={level}
                    className={`px-3 py-1 rounded-full font-semibold text-xs transition-all ${
                      idx === 3
                        ? 'bg-gradient-fluently text-white'
                        : 'bg-gray-700 bg-opacity-40 text-gray-400'
                    }`}
                  >
                    {level}
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center mb-6">
              <p className="text-2xl font-bold text-white mb-2">Upper-Intermediate B2</p>
              <p className="text-cyan-400 font-semibold text-sm">85%</p>
              <p className="text-gray-400 text-xs mt-1">Pronunciation</p>
            </div>

            {/* Simplified Radar representation */}
            <svg width="200" height="200" className="mx-auto mb-4">
              <defs>
                <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(268 87% 43% / 0.6)" />
                  <stop offset="100%" stopColor="hsl(268 87% 43% / 0.2)" />
                </linearGradient>
              </defs>
              {/* Pentagon shape */}
              <polygon
                points="100,20 170,70 145,155 55,155 30,70"
                fill="url(#radarGradient)"
                stroke="hsl(268 87% 43%)"
                strokeWidth="2"
              />
              {/* Center circle */}
              <circle cx="100" cy="100" r="30" fill="hsl(261 100% 10%)" opacity="0.8" />
              <text
                x="100"
                y="105"
                textAnchor="middle"
                className="fill-cyan-400"
                fontSize="20"
                fontWeight="bold"
              >
                B2
              </text>
            </svg>

            <p className="text-xs text-gray-400 text-center">
              Mais de 1 milhão de avaliações personalizadas realizadas
            </p>
          </div>

          <FluentlyButton fullWidth size="lg" onClick={handleNext}>
            Começar
          </FluentlyButton>
        </div>
      </ScreenContainer>
    );
  }

  // Step: Call Introduction
  if (step === 'call-intro') {
    return (
      <ScreenContainer onBack={handleBack} showBackButton={false}>
        <div className="w-full max-w-md text-center">
          <AIAvatar size="large" />
          <h2 className="text-3xl font-bold mt-6 mb-2">Chamada de introdução com ALICE</h2>
          <p className="text-gray-300 mb-6">Avalie seu inglês e descubra em que área focar</p>

          <div className="bg-gray-800 bg-opacity-50 border border-gray-700 rounded-xl p-6 mb-8 space-y-4">
            <div className="flex gap-3 items-start">
              <div className="text-xl">⏱️</div>
              <p className="text-white text-sm text-left">
                <strong>Cerca de 4 minutos</strong> • pare a qualquer momento
              </p>
            </div>
            <div className="flex gap-3 items-start">
              <div className="text-xl">❓</div>
              <p className="text-white text-sm text-left">
                <strong>Algumas perguntas simples</strong> sobre você
              </p>
            </div>
            <div className="flex gap-3 items-start">
              <div className="text-xl">🛡️</div>
              <p className="text-white text-sm text-left">
                <strong>Amigável e sem julgamentos</strong>
              </p>
            </div>
            <div className="flex gap-3 items-start">
              <div className="text-xl">🎤</div>
              <p className="text-white text-sm text-left">
                <strong>Fale por pelo menos 30s</strong> para melhores resultados
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mb-8 text-sm text-green-400">
            <div className="w-2 h-2 bg-green-400 rounded-full" />
            <p>4.901 chamadas concluídas hoje</p>
          </div>

          <div className="flex gap-3">
            <FluentlyButton variant="secondary" fullWidth size="lg">
              Pular por enquanto
            </FluentlyButton>
            <FluentlyButton 
              fullWidth 
              size="lg" 
              icon="🎤"
              onClick={() => navigate('/practice')}
            >
              Iniciar chamada
            </FluentlyButton>
          </div>
        </div>
      </ScreenContainer>
    );
  }

  return null;
}
