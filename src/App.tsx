/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import ArchitectureView from './components/ArchitectureView';
import BacklogView from './components/BacklogView';
import DesignSystemView from './components/DesignSystemView';
import RoadmapView from './components/RoadmapView';
import MobileSimulator from './components/MobileSimulator';
import { 
  Server, 
  Layers, 
  Globe, 
  Smartphone, 
  Compass, 
  UserPlus, 
  ChevronRight,
  BookOpen,
  Settings,
  HeartPulse,
  Activity,
  CheckCircle2,
  Phone,
  Cpu,
  Github
} from 'lucide-react';

export default function App() {
  // Master App Modes: 'engineering' vs 'mobile-full'
  const [appMode, setAppMode] = useState<'engineering' | 'mobile-full'>('engineering');
  
  // Tabs inside engineering panel: 'backlog' | 'architecture' | 'design-system' | 'roadmap'
  const [engineeringTab, setEngineeringTab] = useState<'backlog' | 'architecture' | 'design-system' | 'roadmap'>('backlog');

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans" id="app-root-container">
      {/* GLOBAL HUD NAVBAR */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-xs sticky top-0 z-40 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500 text-slate-950 rounded-xl shadow-xs">
            <HeartPulse size={24} className="hover:scale-110 transition-transform cursor-pointer" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight text-white font-sans">Cuidar Já Saúde</h1>
              <span className="text-[10px] bg-slate-800 text-slate-300 font-bold px-2 py-0.5 rounded-full uppercase border border-slate-700">
                Product Spec + Mobile MVP
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Arquitetura de Software Sênior, Design System Acessível e Kanban de Engenharia
            </p>
          </div>
        </div>

        {/* Global Mode Switch UI Toggle */}
        <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setAppMode('engineering')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              appMode === 'engineering'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
            id="btn-appmode-engineering"
          >
            <Layers size={14} />
            Central de Engenharia & Backlog
          </button>
          <button
            onClick={() => setAppMode('mobile-full')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              appMode === 'mobile-full'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
            id="btn-appmode-mobile"
          >
            <Smartphone size={14} />
            Simulador Mobile do Idoso
          </button>
        </div>
      </header>

      {/* CORE WORKBENCH STAGE CONTAINER */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* VIEW 1: ENGINEERING SPECS AND KANBAN PRODUCT BOARD */}
        {appMode === 'engineering' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header statistics block info */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-950 p-5 rounded-2xl border border-slate-800">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Cpu className="text-emerald-500" size={18} />
                  Painel de Controle e Homologação Técnica
                </h2>
                <p className="text-xs text-slate-400 leading-normal">
                  Navegue pela infraestrutura, acompanhe e modifique o backlog do GitHub Issues, estude as APIs brasileiras ou teste a régua de acessibilidade.
                </p>
              </div>

              {/* Sub tabs picker row */}
              <div className="flex flex-wrap gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                {[
                  { id: 'backlog', label: 'Quadro Kanban SPTrans' },
                  { id: 'architecture', label: 'Infras & Clean Architecture' },
                  { id: 'design-system', label: 'Figma Tokens & Acessibilidade' },
                  { id: 'roadmap', label: 'Roadmap MVP em 7 dias' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setEngineeringTab(tab.id as any)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      engineeringTab === tab.id
                        ? 'bg-slate-800 text-emerald-400 font-bold border border-emerald-950/20'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                    id={`btn-engtab-${tab.id}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Render selected technical views */}
            <div>
              {engineeringTab === 'backlog' && (
                <div className="space-y-4">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
                    <span className="text-xs text-slate-400 font-sans">
                      💡 <strong>Dica de Usabilidade:</strong> Clique nas setas (&larr; / &rarr;) dentro de cada card para arrastar as tarefas no fluxo entre as raias do Kanban!
                    </span>
                  </div>
                  <BacklogView />
                </div>
              )}
              {engineeringTab === 'architecture' && <ArchitectureView />}
              {engineeringTab === 'design-system' && <DesignSystemView />}
              {engineeringTab === 'roadmap' && <RoadmapView />}
            </div>
          </div>
        )}

        {/* VIEW 2: FULLY IMMERSIVE MOBILE PHONE MOCK EXPERIENCE */}
        {appMode === 'mobile-full' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Context introduction */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-8 space-y-3">
                <span className="text-xs font-mono text-emerald-400 block uppercase font-bold tracking-wider">Homologação de Produto</span>
                <h2 className="text-xl font-bold text-white leading-tight">Simulador de Acessibilidade &amp; Jornada Integral</h2>
                <p className="text-slate-400 text-xs leading-relaxed">
                  O idoso interage por meio de um fluxo guiado focado em clareza extrema. O app remove de forma intencional layouts em bento grid e inputs densos.
                </p>

                {/* Features list walkthrough */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="flex gap-2 items-start">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-200 block">1. Cadastro Sem Senha</strong>
                      <span className="text-slate-400 text-[11px]">Basta inserir o telefone público. Sem necessidade de lembrar ou renovar dados sigilosos.</span>
                    </div>
                  </div>
                  <div className="flex gap-2 items-start">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-200 block">2. Orientador &quot;Onde Dói&quot;</strong>
                      <span className="text-slate-400 text-[11px]">Substitui a pesquisa textual do Google Maps por um mapeamento autônomo baseado em sintomatologia simples.</span>
                    </div>
                  </div>
                  <div className="flex gap-2 items-start">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-200 block">3. Vans ATENDE Integradas</strong>
                      <span className="text-slate-400 text-[11px]">Formulário com 3 cliques para solicitar o agendamento de transporte pneumático gratuito para o hospital.</span>
                    </div>
                  </div>
                  <div className="flex gap-2 items-start">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-200 block">4. Assistente de Voz Ativo</strong>
                      <span className="text-slate-400 text-[11px]">O idoso pergunta de maneira informal e o app exibe a resposta em fonte de alto contraste gigante com aviso sonoro simulated.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tips block */}
              <div className="md:col-span-4 bg-slate-900 rounded-xl p-4.5 border border-slate-800 space-y-3.5 self-center">
                <div className="flex items-center gap-1.5 text-yellow-500">
                  <Settings size={16} />
                  <span className="font-extrabold text-xs uppercase tracking-wider font-mono">Modo de Avaliação</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Para uma melhor simulação, use a seção de <strong>&quot;A+ / A-&quot;</strong> ou o botão de <strong>Alto Contraste</strong> posicionados à esquerda do dispositivo móvel para mudar dinamicamente as fontes!
                </p>
                <div className="text-[10px] text-slate-500 font-mono">
                  Sinergia: Vue + Firebase Core + GPS Geolocators
                </div>
              </div>
            </div>

            {/* The physical rendered viewport block */}
            <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800">
              <MobileSimulator />
            </div>
          </div>
        )}

      </main>

      {/* FOOTER CREDITS */}
      <footer className="border-t border-slate-800 bg-slate-950 text-slate-500 text-xs py-8 px-6 mt-12 text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <div className="p-1 px-1.5 bg-slate-900 border border-slate-700 text-slate-300 font-bold rounded text-[10px] uppercase font-mono">
            Ambiente de Demonstração Cuidar Já Saúde
          </div>
        </div>
        <p className="font-sans">
          Projetado por Engenharia de Produto, arquitetando para Acessibilidade Urbana e Melhoria de Vida Sênior.
        </p>
        <p className="font-mono text-[10px] text-slate-600">
          Uso Sugerido: Registro por celular &rarr; Escolha de Hospitais &rarr; Traçado de calçadas de alto contraste.
        </p>
      </footer>
    </div>
  );
}
