/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Eye, 
  Settings, 
  Activity, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  AlertCircle,
  TrendingDown,
  Volume2
} from 'lucide-react';

export default function DesignSystemView() {
  const [visionLoss, setVisionLoss] = useState(false);
  const [colorBlind, setColorBlind] = useState(false);
  const [handTremor, setHandTremor] = useState(false);
  const [fontScale, setFontScale] = useState<number>(1.25);

  const FIGMA_SCREENS = [
    { title: 'T-01 Onboarding Rápido', desc: 'Introdução, Input de Celular e Validação de SMS.', order: '1º Passo: Registro fundamental' },
    { title: 'T-02 Menu Principal (Mapa)', desc: 'Mapa focado em rota simplificada, sem excesso de camadas distrativas.', order: '2º Passo: Central de rotas' },
    { title: 'T-03 Busca Técnica: Saúde ("Onde Dói")', desc: 'Mapeamento visual do corpo humano e UPAs operadas em tempo real.', order: '3º Passo: Triagem visual' },
    { title: 'T-04 Central de Ônibus Acessível', desc: 'Lista de linhas locais indicando pneumáticos e rampas acessíveis.', order: '4º Passo: Mobilidade' },
    { title: 'T-05 Formulário de Transporte Adaptado (ATENDE)', desc: 'Agendamento de van gratuita com data, hora e finalidade.', order: '5º Passo: Serviço Social' }
  ];

  return (
    <div className="space-y-6" id="ds-view-root">
      {/* PRINCÍPIOS UX IDOSOS */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-4 space-y-4">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Sparkles size={20} />
            </span>
            <h4 className="text-sm font-bold text-slate-400 block uppercase font-mono tracking-wider">Diretrizes de Interface</h4>
          </div>
          <h3 className="text-xl font-bold text-slate-800 leading-tight">Princípios de Design Empático para o Idoso</h3>
          <p className="text-slate-600 text-xs leading-relaxed">
            Desenhar para idosos não significa apenas aumentar textos. Exige repensar densidade de informação, reduzir fricção cognitiva, remover submenus aninhados e garantir respostas táteis/auditivas imediatas.
          </p>

          <div className="space-y-3 pt-2">
            <div className="p-3 bg-indigo-50/50 rounded-xl flex items-start gap-2 border border-indigo-100">
              <CheckCircle2 size={16} className="text-indigo-600 mt-0.5 shrink-0" />
              <div>
                <span className="font-bold text-slate-800 text-xs block">Mínimo 48px para Toque (Zonas Estendidas)</span>
                <span className="text-[10px] text-slate-500 leading-normal">Mecanicamente calibrado para dedos fatigados ou com tremores em movimento.</span>
              </div>
            </div>

            <div className="p-3 bg-purple-50/50 rounded-xl flex items-start gap-2 border border-purple-100">
              <CheckCircle2 size={16} className="text-purple-600 mt-0.5 shrink-0" />
              <div>
                <span className="font-bold text-slate-800 text-xs block">Contraste WCAG AAA (Mínimo 7:1)</span>
                <span className="text-[10px] text-slate-500 leading-normal">Garanta leitura legível sob o sol direto, focando em botões pretos/azuis com textos pretos/brancos puros.</span>
              </div>
            </div>

            <div className="p-3 bg-teal-50/50 rounded-xl flex items-start gap-2 border border-teal-100">
              <CheckCircle2 size={16} className="text-teal-600 mt-0.5 shrink-0" />
              <div>
                <span className="font-bold text-slate-800 text-xs block">Interface Linear Sem Abas Escondidas</span>
                <span className="text-[10px] text-slate-500 leading-normal">Toda ação relevante deve estar visível e ser resolvida em menos de 3 cliques seguidos.</span>
              </div>
            </div>
          </div>
        </div>

        {/* INTERACTIVE ACCESSIBILITY SIMULATOR PLAYGROUND */}
        <div className="md:col-span-8 bg-slate-900 rounded-xl p-5 text-white border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-teal-400 font-bold block">Filtro Clínico Interativo</span>
              <h4 className="text-sm font-bold text-slate-200">Painel Simulador de Deficiência e Usabilidade</h4>
            </div>
            <div className="flex items-center gap-2 bg-slate-800 px-2.5 py-1 rounded text-xs font-bold text-yellow-500">
              <Activity size={12} />
              <span>Experimentar barreiras</span>
            </div>
          </div>

          <p className="text-slate-400 text-xs leading-relaxed">
            Ative as chaves abaixo para testar visualmente se o componente de card abaixo resiste às dificuldades comuns de idosos (presbiopia/catarata avançada, daltonismo hereditário e tremores decorrentes do Parkinson):
          </p>

          {/* Config switches panel */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-3 rounded-lg border border-slate-800">
            <div>
              <label className="text-[9px] text-slate-500 uppercase tracking-wide block mb-1">Catarata (Blur)</label>
              <button
                onClick={() => setVisionLoss(!visionLoss)}
                className={`w-full py-1.5 rounded-md text-xs font-bold transition-all ${
                  visionLoss ? 'bg-teal-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
                id="btn-sim-catarata"
              >
                {visionLoss ? 'Simulado' : 'Desligado'}
              </button>
            </div>

            <div>
              <label className="text-[9px] text-slate-500 uppercase tracking-wide block mb-1">Daltonismo</label>
              <button
                onClick={() => setColorBlind(!colorBlind)}
                className={`w-full py-1.5 rounded-md text-xs font-bold transition-all ${
                  colorBlind ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
                id="btn-sim-daltonismo"
              >
                {colorBlind ? 'Simulado' : 'Desligado'}
              </button>
            </div>

            <div>
              <label className="text-[9px] text-slate-500 uppercase tracking-wide block mb-1">Tremores (Tremor)</label>
              <button
                onClick={() => setHandTremor(!handTremor)}
                className={`w-full py-1.5 rounded-md text-xs font-bold transition-all ${
                  handTremor ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400 animate-pulse'
                }`}
                id="btn-sim-tremor"
              >
                {handTremor ? 'Simulado' : 'Desligado'}
              </button>
            </div>

            <div>
              <label className="text-[9px] text-slate-500 uppercase tracking-wide block mb-1">Tamanho da Letra</label>
              <select
                value={fontScale}
                onChange={(e) => setFontScale(Number(e.target.value))}
                className="w-full py-1 px-1 bg-slate-800 border-none text-slate-300 text-xs rounded-md focus:outline-hidden font-bold h-7"
                id="btn-sim-fontscale"
              >
                <option value="1">1.0x (Padrão)</option>
                <option value="1.25">1.25x (Grande)</option>
                <option value="1.5">1.50x (Gigante)</option>
                <option value="1.8">1.80x (Acessível AAA)</option>
              </select>
            </div>
          </div>

          {/* SIMULATED CARD DISPLAY PANEL */}
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-800 flex justify-center items-center h-52">
            
            {/* The responsive element controlled by state filters */}
            <div 
              style={{
                filter: `${visionLoss ? 'blur(2.5px)' : 'none'} ${colorBlind ? 'grayscale(90%)' : 'none'}`,
                fontSize: `${fontScale}rem`
              }}
              className={`bg-white text-slate-900 p-4 rounded-xl border-2 border-emerald-500 w-full max-w-sm shadow-xl transition-all ${
                handTremor ? 'simulate-tremor' : ''
              }`}
            >
              <div className="flex justify-between items-start gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 font-mono">Unidade Próxima</span>
                  <h4 className="font-extrabold text-slate-950 tracking-tight leading-tight mt-0.5">UBS Pinheiros Centro</h4>
                  <p className="text-[10px] text-slate-500 font-sans mt-0.5">Rua Cardeal Arcoverde, 1200</p>
                </div>
                <span className="shrink-0 px-2 py-0.5 bg-rose-100 text-rose-800 text-[10px] uppercase font-bold rounded-full">30min espera</span>
              </div>

              {/* Physical Touch obstacle check */}
              <div className="mt-4 flex gap-2">
                {/* A standard micro web button (very hard to click with tremor/vision blur) */}
                <button 
                  onClick={() => alert('Isso é muito pequeno! Idosos errariam o clique!')}
                  className="flex-1 text-[9px] bg-slate-200 text-slate-700 py-1 rounded hover:bg-slate-300"
                  id="btn-ds-small-btn"
                >
                  Ver Mapa (Pequeno)
                </button>

                {/* The recommended large touch target option */}
                <button 
                  onClick={() => alert('Excelente! Tamanho ideal e acessível!')}
                  className="flex-1 bg-emerald-600 text-white py-2.5 px-3 rounded-lg text-xs font-bold hover:bg-emerald-700 flex items-center justify-center gap-1 cursor-pointer select-none"
                  id="btn-ds-large-btn"
                >
                  <Volume2 size={12} />
                  IR ATÉ LÁ (Grande)
                </button>
              </div>
            </div>

          </div>

          <div className="flex gap-2 items-center text-[10px] text-slate-400 bg-slate-950 p-2.5 rounded border border-slate-800">
            <AlertCircle size={14} className="text-yellow-500 shrink-0" />
            <span>
              {handTremor 
                ? 'Aviso: Com tremor, o botão &quot;Pequeno&quot; oscila fora do cursor, gerando toques fantasmas prejudiciais ao idoso. O botão &quot;Grande&quot; de 48px+ amortece o desvio!' 
                : 'Dica: Altere os filtros acima para ver como o olho humano com catarata vê a tela reduzida em foco.'
              }
            </span>
          </div>
        </div>
      </div>

      {/* FIGMA FLOWS PLAN */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-2 mb-4">
          <span className="p-2 bg-pink-50 text-pink-600 rounded-lg">
            <Layers size={18} />
          </span>
          <div>
            <span className="text-xs text-slate-400 block uppercase font-mono tracking-wider font-bold">Arquivos Figma</span>
            <h3 className="text-lg font-bold text-slate-800">Estratégia de Criação de Wireframes no Figma</h3>
          </div>
        </div>

        <p className="text-slate-600 text-xs mb-6 max-w-3xl leading-relaxed">
          Para aprovação ágil de UX do MVP, recomendamos desenhar o protótipo de alta fidelidade no Figma seguindo de forma rigorosa as seguintes etapas sequenciais de design de produto:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {FIGMA_SCREENS.map((sc, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-150 bg-slate-50 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-pink-600 block mb-1 font-mono">{sc.order}</span>
                <span className="font-bold text-slate-800 text-sm leading-snug">{sc.title}</span>
                <p className="text-slate-500 text-xs leading-relaxed mt-1.5">{sc.desc}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200">
                <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Foco: 100% Contraste</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
