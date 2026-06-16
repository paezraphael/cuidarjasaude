/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ARCH_MODULES, APIS_BRAZIL } from '../data';
import { 
  Server, 
  Database, 
  Cpu, 
  Layers, 
  Globe, 
  ShieldCheck, 
  ArrowRight, 
  Network, 
  Info,
  CheckCircle2,
  Workflow
} from 'lucide-react';

export default function ArchitectureView() {
  const [activeTab, setActiveTab] = useState<'diagram' | 'modules' | 'apis' | 'scale'>('diagram');
  const [selectedModule, setSelectedModule] = useState<string>('arch-1');

  const activeModData = ARCH_MODULES.find(m => m.id === selectedModule) || ARCH_MODULES[0];

  return (
    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-xs" id="arch-view-root">
      {/* Tab select row */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-200 pb-4">
        <button
          onClick={() => setActiveTab('diagram')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
            activeTab === 'diagram'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
          id="btn-arch-tab-diagram"
        >
          <Workflow size={16} />
          Visão Geral & Diagrama
        </button>
        <button
          onClick={() => setActiveTab('modules')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
            activeTab === 'modules'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
          id="btn-arch-tab-modules"
        >
          <Layers size={16} />
          Módulos do Sistema ({ARCH_MODULES.length})
        </button>
        <button
          onClick={() => setActiveTab('apis')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
            activeTab === 'apis'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
          id="btn-arch-tab-apis"
        >
          <Globe size={16} />
          APIs e Integrações (Brasil)
        </button>
        <button
          onClick={() => setActiveTab('scale')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
            activeTab === 'scale'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
          id="btn-arch-tab-scale"
        >
          <Cpu size={16} />
          Padrões & Escalabilidade
        </button>
      </div>

      {/* Diagram Tab */}
      {activeTab === 'diagram' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-2 flex items-center gap-2">
              <Network className="text-emerald-500" size={20} />
              Arquitetura Geral: Monolito Modular Limpo (Clean Modular Monolith)
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              Para o <strong>Cuidar Já Saúde</strong>, optou-se por um <strong>Monolito Modular</strong> no backend e 
              <strong> Clean Architecture</strong> encapsulado no frontend (Vue.js + TypeScript). Essa escolha garante 
              baixo custo operacional na nuvem, deploy rápido, desacoplamento e facilidade para que equipes pequenas separem os módulos em microservices no futuro, se houver alta escala nacional.
            </p>

            {/* Interactive ASCII Blueprint Diagram */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-900 p-6 rounded-lg text-slate-300 font-mono text-xs overflow-x-auto relative">
              <div className="absolute top-2 right-2 flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
              </div>

              {/* Col 1: CLIENT LAYER */}
              <div className="border border-slate-700 rounded p-3 bg-slate-800 space-y-2">
                <div className="text-purple-400 font-bold text-center border-b border-slate-700 pb-1">CLIENT LAYER</div>
                <div className="bg-slate-950 p-2 text-center rounded ring-1 ring-purple-500/30">
                  <div className="text-white font-semibold">Vue 3 App</div>
                  <div className="text-[10px] text-slate-400">TypeScript</div>
                </div>
                <div className="bg-slate-950 p-1.5 text-center rounded">
                  <div className="text-emerald-400 font-medium">Acessibilidade</div>
                  <div className="text-[9px] text-slate-400">Font scaling / High Contrast</div>
                </div>
                <div className="text-center text-slate-500">⬇️ HTTP/WS</div>
              </div>

              {/* Col 2: API GATEWAY */}
              <div className="border border-slate-700 rounded p-3 bg-slate-800 flex flex-col justify-between">
                <div>
                  <div className="text-blue-400 font-bold text-center border-b border-slate-700 pb-1">GATEWAY & AUTH</div>
                  <div className="bg-slate-950 p-2 text-center rounded mt-2 ring-1 ring-blue-500/30">
                    <div className="text-yellow-400">Firebase Auth</div>
                    <div className="text-[9px] text-slate-400">SMS OTP Sem Senha</div>
                  </div>
                  <div className="bg-slate-950 p-1.5 text-center rounded mt-2 text-[10px] text-slate-400">
                    Express Router / Proxy
                  </div>
                </div>
                <div className="text-center text-slate-500 font-bold">➡️ Routing</div>
              </div>

              {/* Col 3: BUSINESS MODULES */}
              <div className="border border-slate-700 rounded p-3 bg-slate-800 space-y-2 col-span-1 md:col-span-2">
                <div className="text-emerald-400 font-bold text-center border-b border-slate-700 pb-1">MODULAR CORES (Backend)</div>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="bg-slate-950 p-1.5 rounded border border-emerald-900/50">
                    <span className="text-white font-medium">Módulo Saúde</span>
                    <p className="text-slate-500 text-[9px]">UBS & Roteamento</p>
                  </div>
                  <div className="bg-slate-950 p-1.5 rounded border border-emerald-900/50">
                    <span className="text-white font-medium">Módulo Trânsito</span>
                    <p className="text-slate-500 text-[9px]">Frotas SPTrans GTFS</p>
                  </div>
                  <div className="bg-slate-950 p-1.5 rounded border border-emerald-900/50">
                    <span className="text-white font-medium">Módulo Ride Link</span>
                    <p className="text-slate-500 text-[9px]">Agendamento ATENDE</p>
                  </div>
                  <div className="bg-slate-950 p-1.5 rounded border border-emerald-900/50">
                    <span className="text-white font-medium">Notificações</span>
                    <p className="text-slate-500 text-[9px]">Sinalizador de Emergência</p>
                  </div>
                </div>
                <div className="bg-slate-950 p-1.5 rounded text-center text-cyan-400 text-[10px] border border-blue-900/40">
                  ☁️ Firestore DB + Redis Cache
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <span className="font-semibold text-emerald-800 text-sm block mb-1">Por que Monolito Modular?</span>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Evita o overhead de latência de rede e a complexidade de gerenciar múltiplos deployments no início. O código fica organizado em namespaces isolados que refletem o domínio do negócio.
                </p>
              </div>
              <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
                <span className="font-semibold text-teal-800 text-sm block mb-1">Segurança de Dados</span>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Com o Firebase, aproveitamos as <strong>Firestore Security Rules</strong> para validar permissões hierárquicas diretamente do cliente, blindando o banco de dados contra leituras maliciosas.
                </p>
              </div>
              <div className="p-4 bg-sky-50 rounded-lg border border-sky-200">
                <span className="font-semibold text-sky-800 text-sm block mb-1">Princípios Solid no Frontend</span>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Uso de Composition API + Custom Hooks em Vue (ou similar em React) isolando regras de negócio puros de visualizadores (UI components).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modules Tab */}
      {activeTab === 'modules' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Module list */}
          <div className="md:col-span-1 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">Selecione para detalhar</span>
            {ARCH_MODULES.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedModule(m.id)}
                className={`w-full text-left p-4 rounded-xl transition-all border flex items-center justify-between ${
                  selectedModule === m.id
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
                id={`btn-module-${m.id}`}
              >
                <div>
                  <span className="text-xs opacity-80 block font-mono">ID: {m.id}</span>
                  <span className="font-semibold text-sm line-clamp-1">{m.name}</span>
                </div>
                <ArrowRight size={16} className={selectedModule === m.id ? 'translate-x-1' : ''} />
              </button>
            ))}
          </div>

          {/* Module detail view */}
          <div className="md:col-span-2 bg-white p-6 rounded-xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <Layers size={22} />
              </span>
              <div>
                <span className="text-xs text-slate-400 font-mono tracking-wider block uppercase">Modulo Blueprint</span>
                <h4 className="text-lg font-bold text-slate-800">{activeModData.name}</h4>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-xs font-bold text-slate-400 block uppercase">Descrição Funcional</span>
                <p className="text-slate-700 text-sm mt-0.5 leading-relaxed">{activeModData.description}</p>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-400 block uppercase mb-1.5">Sub-sistemas & Componentes de Código</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeModData.subsystems.map((sub, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-50 rounded-lg flex items-start gap-2 border border-slate-150">
                      <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                      <span className="text-slate-600 text-xs">{sub}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-teal-50/50 rounded-lg border border-teal-200/50">
                <span className="text-xs font-bold text-teal-800 block uppercase">Plano de Escala Técnica</span>
                <p className="text-slate-600 text-xs mt-1 leading-relaxed">{activeModData.scalability}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* APIs Tab */}
      {activeTab === 'apis' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-2 flex items-center gap-2">
              <Globe className="text-emerald-500" size={20} />
              APIs Viáveis & Integração no Cenário Brasileiro
            </h3>
            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
              Mapeamos as melhores combinações de APIs gratuitas e governamentais para fornecer dados oficiais de saúde e transporte público com baixo ou zero custo.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {APIS_BRAZIL.map((api, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white transition-all space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">{api.provider}</span>
                      <h4 className="text-base font-bold text-slate-800 mt-0.5">{api.name}</h4>
                    </div>
                    <span className={`px-2.5 py-0.5 font-sans font-bold text-[10px] rounded-full uppercase ${
                      api.type === 'free' 
                        ? 'bg-green-100 text-green-700' 
                        : api.type === 'paid' 
                          ? 'bg-red-100 text-red-700' 
                          : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {api.type === 'free' ? 'Gratuita' : api.type === 'paid' ? 'Paga com Cota' : 'Misto'}
                    </span>
                  </div>

                  <p className="text-slate-600 text-xs leading-relaxed">{api.purpose}</p>

                  <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-white p-2 rounded border border-slate-100 font-mono">
                    <Info size={12} className="text-emerald-500 hover:scale-115 transition-transform" />
                    <span className="text-[10px]">{api.details}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Scale Tab */}
      {activeTab === 'scale' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-2 flex items-center gap-2">
            <Cpu className="text-emerald-500" size={20} />
            Estratégia Backend Express, Vue & Firebase
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Como Product Architect, recomendo a divisão escalável do stack de forma ágil para garantir conformidades regulatórias e alta disponibilidade:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-2">
              <ShieldCheck className="text-emerald-600" size={24} />
              <span className="font-bold text-slate-800 text-sm block">Segurança e LGPD</span>
              <p className="text-slate-600 text-xs leading-relaxed">
                Dados de saúde e localização de idosos são protegidos sob a LGPD. 
                Utilização de encriptação AES-256 em trânsito e anonimização de histórico de sintomas no módulo de &quot;Onde Dói&quot; quando enviado para analytics ou dashboards médicos municipais.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <Database className="text-slate-600" size={24} />
              <span className="font-bold text-slate-800 text-sm block">Estratégia Offline-First</span>
              <p className="text-slate-600 text-xs leading-relaxed">
                IDosos podem perder conexão em túneis ou ônibus. O banco Firestore possui persistência offline padrão habilitada de 1 clique, cacheando pontos de ônibus e telefones das UPAs locais no IndexedDB para uso em emergências.
              </p>
            </div>

            <div className="p-4 bg-orange-50/50 rounded-xl border border-orange-100 space-y-2">
              <Server className="text-orange-600" size={24} />
              <span className="font-bold text-slate-800 text-sm block">Vantagens do Firebase Serverless</span>
              <p className="text-slate-600 text-xs leading-relaxed">
                Custos praticamente nulos de infraestrutura para o MVP. O banco escala automaticamente para milhões de consultas diárias sem necessidade de configurar firewalls, balanceadores ou servidores virtuais manualmente.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
