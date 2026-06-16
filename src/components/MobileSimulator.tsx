/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SIM_HEALTH_UNITS, SIM_TRANSIT_LINES } from '../data';
import { HealthUnit, TransitLine } from '../types';
import { 
  Phone, 
  Clock, 
  MapPin, 
  Accessibility, 
  Activity, 
  Bus, 
  Calendar, 
  HeartPulse, 
  Volume2, 
  ChevronRight, 
  ArrowRight, 
  Check, 
  X, 
  AlertCircle, 
  UserCheck, 
  MessageSquare,
  Sparkles,
  RefreshCw,
  Eye,
  Info
} from 'lucide-react';

export default function MobileSimulator() {
  // Mobile app navigation state
  const [currentScreen, setCurrentScreen] = useState<'onboarding' | 'home' | 'onde-doi' | 'onibus' | 'atende' | 'voz'>('onboarding');
  
  // Accessibility state
  const [highContrast, setHighContrast] = useState(false);
  const [fontMultiplier, setFontMultiplier] = useState<number>(1.2); // 1.2x default for senior simulator
  
  // App business process states
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<HealthUnit | null>(SIM_HEALTH_UNITS[0]);
  const [routeStep, setRouteStep] = useState<string | null>(null);
  
  // Symptom matches
  const [symptomMatch, setSymptomMatch] = useState<string | null>(null);
  const [matchedUnit, setMatchedUnit] = useState<HealthUnit | null>(null);

  // ATENDE Reservation form state
  const [bookingDate, setBookingDate] = useState('2026-06-18');
  const [bookingDest, setBookingDest] = useState('Hospital das Clínicas');
  const [bookingPurpose, setBookingPurpose] = useState('Consulta com Cardiologista');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Voice Assistant state
  const [voiceInput, setVoiceInput] = useState<string>('');
  const [voiceReply, setVoiceReply] = useState<string>('Olá! Sou o assistente de voz do Cuidar Já Saúde. Em que posso te ajudar hoje? Pode falar ou clicar em um atalho abaixo.');

  // Handle onboarding click
  const handleOnboardingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length >= 8) {
      setIsOnboarded(true);
      setCurrentScreen('home');
    } else {
      alert('Por favor, insira um número válido com DDD (Ex: 11985443322) para receber o código SMS.');
    }
  };

  // Symptoms solver
  const handleSelectSymptom = (symptom: string) => {
    setSymptomMatch(symptom);
    if (symptom === 'Coração / Dor no Peito') {
      const match = SIM_HEALTH_UNITS.find(u => u.type === 'Hospital SUS') || SIM_HEALTH_UNITS[0];
      setMatchedUnit(match);
      setSelectedUnit(match);
      setVoiceReply(`🚨 IMPORTANTE: Dor no peito requer atenção emergencial. Recomendo seguir direto para o ${match.name}. É o hospital de pronto atendimento SUS mais próximo de você, com tempo de espera BAIXO. Gostaria que eu te mostrasse a rota acessível por voz?`);
    } else if (symptom === 'Gripe / Febre / Tosse') {
      const match = SIM_HEALTH_UNITS.find(u => u.type === 'UBS') || SIM_HEALTH_UNITS[1];
      setMatchedUnit(match);
      setSelectedUnit(match);
      setVoiceReply(`Fique calmo(a). Para gripe ou tosse, a ${match.name} é a unidade ideal para exames leves e vacinação. Fica a apenas 340 metros de você. Calçadas amplas no caminho!`);
    } else if (symptom === 'Dor de Cabeça / Tontura') {
      const match = SIM_HEALTH_UNITS.find(u => u.type === 'UPA') || SIM_HEALTH_UNITS[2];
      setMatchedUnit(match);
      setSelectedUnit(match);
      setVoiceReply(`Para tontura ou dor de cabeça aguda, a ${match.name} possui triagem em tempo real e médicos clínicos disponíveis. Deseja ver a rota?`);
    } else {
      const match = SIM_HEALTH_UNITS.find(u => u.type === 'Farmácia Popular') || SIM_HEALTH_UNITS[3];
      setMatchedUnit(match);
      setSelectedUnit(match);
      setVoiceReply(`Se precisa apenas de medicamentos gratuitos da Farmácia Popular, a ${match.name} está bem próxima, a 150 metros. Atenção: há uma escadaria lenta na entrada, se tiver cadeira de rodas, recomendo solicitar a rampa lateral.`);
    }
  };

  // ATENDE Reservation handler
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSuccess(true);
  };

  // Accent and UI dynamic classes defined by High Contrast state
  const bgTheme = highContrast ? 'bg-black text-white' : 'bg-slate-50 text-slate-900';
  const cardTheme = highContrast ? 'bg-black border-4 border-yellow-400 text-white' : 'bg-white border border-slate-200 text-slate-800';
  const textPrimary = highContrast ? 'text-yellow-400 font-extrabold' : 'text-emerald-700 font-extrabold';
  const textMuted = highContrast ? 'text-white/80' : 'text-slate-500';
  const btnPrimary = highContrast ? 'bg-yellow-400 text-black border-2 border-white hover:bg-yellow-400 font-black' : 'bg-emerald-600 text-white hover:bg-emerald-700';
  const btnSecondary = highContrast ? 'bg-black text-white border-2 border-yellow-400' : 'bg-slate-100 hover:bg-slate-200 text-slate-700';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start" id="mobile-sim-wrapper">
      
      {/* LEFT SIDE: CONTROLLERS & EXPLANATORY LEGENDS (Makes 4 columns) */}
      <div className="lg:col-span-4 space-y-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase font-mono block">Simulador Interativo</span>
          <h3 className="text-lg font-bold text-slate-800">Cuidar Já Saúde Mobile</h3>
          <p className="text-slate-600 text-xs leading-relaxed">
            Esta é a reprodução exata em alta fidelidade da experiência do idoso no aplicativo. Utilize os botões laterais de controle para ver como adaptamos a engenharia para o público sênior.
          </p>

          {/* Core controls for mobile preview */}
          <div className="border-t border-slate-150 pt-3 space-y-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase block font-mono">Moduladores de Acessibilidade Física</span>
            
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => setHighContrast(!highContrast)}
                className={`w-full py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-between border cursor-pointer select-none transition-all ${
                  highContrast 
                    ? 'bg-yellow-400 text-black border-yellow-400 shadow-sm' 
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
                id="btn-trigger-contrast"
              >
                <span className="flex items-center gap-2">
                  <Eye size={14} />
                  Modo Alto Contraste (Catarata/Baixa Visão)
                </span>
                <span className="font-mono text-[9px] uppercase font-bold">{highContrast ? 'ON' : 'OFF'}</span>
              </button>

              <div className="flex items-center justify-between gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <Volume2 size={14} className="text-emerald-500" />
                  Mecanismo Multiplicador de Letra
                </span>
                <div className="flex gap-1">
                  <button 
                    onClick={() => setFontMultiplier(prev => Math.max(0.9, prev - 0.1))}
                    className="w-8 h-8 bg-white border border-slate-200 rounded-md font-bold text-xs hover:bg-slate-100 flex items-center justify-center cursor-pointer"
                    title="Diminuir texto"
                    id="btn-font-dec"
                  >
                    A-
                  </button>
                  <button 
                    onClick={() => setFontMultiplier(prev => Math.min(1.8, prev + 0.1))}
                    className="w-8 h-8 bg-white border border-slate-200 rounded-md font-bold text-xs hover:bg-slate-100 flex items-center justify-center cursor-pointer"
                    title="Aumentar texto"
                    id="btn-font-inc"
                  >
                    A+
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Current status info legend */}
        <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl space-y-2">
          <span className="text-[10px] font-bold text-teal-800 uppercase block font-mono">Status da Sessão Simulada</span>
          <div className="space-y-1.5 text-xs text-slate-700">
            <div className="flex justify-between font-medium">
              <span>Sessão de Usuário:</span>
              <span className={isOnboarded ? 'text-emerald-600 font-bold' : 'text-amber-500 font-bold'}>
                {isOnboarded ? 'Autenticado (SMS)' : 'Não Registrado'}
              </span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Tamanho de Toque:</span>
              <span className="text-purple-600 font-bold">54px (Fórmula Sênior)</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Escalar Fonte Física:</span>
              <span className="text-slate-800 font-mono font-bold">{Math.round(fontMultiplier * 100)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: THE REAL PHONE FRAME WITH DYNAMIC SCREENS (Makes 8 columns) */}
      <div className="lg:col-span-8 flex justify-center items-center py-4 relative">
        
        {/* PHYSICAL SMARTPHONE VISUAL COVER FRAME */}
        <div className="w-full max-w-sm rounded-[40px] border-12 border-slate-800 shadow-2xl relative bg-slate-950 overflow-hidden min-h-[640px] flex flex-col justify-between">
          
          {/* CAMERA NOTCH MOCK */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-slate-800 w-32 h-5 rounded-b-2xl z-30 flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900 block border border-slate-700"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-900 block ml-3"></span>
          </div>

          {/* TOP APP METADATA BAR (Accessible colors) */}
          <div className={`pt-6 px-5 pb-3 ${highContrast ? 'bg-black border-b-2 border-yellow-400 text-white' : 'bg-emerald-700 text-white'} flex justify-between items-center z-13 relative`}>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-400 block animate-ping"></span>
              <span className="text-[10px] font-extrabold tracking-widest font-mono">CUIDAR JÁ GPS</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold font-mono">15:44 pm</span>
            </div>
          </div>

          {/* IN-APP SCREEN WRAPPER - INNER VIEWPORT */}
          <div 
            style={{ fontSize: `${fontMultiplier}rem` }}
            className={`flex-1 p-4 ${bgTheme} overflow-y-auto max-h-[480px] transition-all relative font-sans`}
            id="mobile-phone-viewport"
          >
            
            {/* SCREEN 1: ONBOARDING / LOGIN SMS METHOD */}
            {currentScreen === 'onboarding' && (
              <div className="space-y-5 py-2 animate-in fade-in duration-200">
                <div className="text-center space-y-1.5">
                  <div className="inline-flex p-3 rounded-full bg-emerald-100 text-emerald-700 justify-center">
                    <HeartPulse size={36} className={`${highContrast ? 'text-yellow-400' : 'text-emerald-700'}`} />
                  </div>
                  <h1 className="text-xl font-extrabold tracking-tight">Cuidar Já Saúde</h1>
                  <p className="text-xs opacity-80 leading-normal">
                    Seu aplicativo fácil para buscar hospitais e transporte da prefeitura.
                  </p>
                </div>

                <form onSubmit={handleOnboardingSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wide block">Digite o seu Celular (com DDD):</label>
                    <input
                      type="tel"
                      required
                      placeholder="Ex: 11 98877 6655"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className={`w-full px-4.5 py-4 border-2 rounded-xl text-center font-bold tracking-widest focus:outline-hidden ${
                        highContrast 
                          ? 'bg-black text-white border-yellow-400 focus:ring-yellow-400' 
                          : 'bg-white text-slate-800 border-slate-300 focus:ring-emerald-500'
                      }`}
                      style={{ fontSize: '1.1rem' }}
                      id="input-sim-phone"
                    />
                    <span className="text-[11px] opacity-75 block text-center leading-normal">
                      Enviaremos uma mensagem SMS com código grátis de confirmação.
                    </span>
                  </div>

                  <button
                    type="submit"
                    className={`w-full py-4.5 rounded-xl font-extrabold text-base transition-all uppercase flex items-center justify-center gap-2 cursor-pointer border-0 shadow-lg`}
                    style={{ fontSize: '1.2rem', minHeight: '56px' }}
                    id="btn-sim-onboarding-next"
                  >
                    <span>Entra Agora</span>
                    <ArrowRight size={20} />
                  </button>
                </form>

                <div className="p-3 bg-blue-50/10 border border-slate-300/30 rounded-lg text-[11px] leading-relaxed">
                  <span className="font-bold block text-sky-400 mb-0.5">🔒 Acesso Seguro Sem Senhas</span>
                  Nossos avós não precisam memorizar senhas complexas. Cadastrou o número, enviou o SMS de 4 números e já pode usar o mapa!
                </div>
              </div>
            )}

            {/* SCREEN 2: MAIN HOME & MAP LAYERS SCREEN */}
            {currentScreen === 'home' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                {/* EMERGENCY HEADER SENSOR */}
                <div 
                  onClick={() => {
                    setCurrentScreen('onde-doi');
                    setVoiceReply("Olá! Clique na dor que sente e eu mostrarei onde deve ir!");
                  }}
                  className="bg-red-600 text-white p-3 rounded-xl flex items-center justify-between cursor-pointer shadow-md border-2 border-white/20 animate-pulse"
                  id="btn-home-emergency-teclado"
                >
                  <div className="flex items-center gap-2">
                    <Activity size={18} />
                    <span className="font-bold text-xs uppercase tracking-wide">🚨 SENTINDO DOR HOJE? clique</span>
                  </div>
                  <ChevronRight size={16} />
                </div>

                {/* SIMULATED MAP PANEL */}
                <div className="rounded-xl border-2 border-slate-300 overflow-hidden relative bg-slate-200 h-44 shadow-inner" id="simulated-map-viewport">
                  {/* Visual simulated elements represent Google Map Layer */}
                  <div className="absolute inset-0 bg-teal-50 opacity-100 flex flex-center items-center justify-center">
                    {/* SVG graphic Mock representing map streets */}
                    <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                      <path d="M 0,50 L 350,50 M 120,0 L 120,400 M 0,110 L 350,220 M 240,0 L 240,400" stroke="#cbd5e1" strokeWidth="4" fill="none" />
                      <circle cx="120" cy="110" r="28" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
                    </svg>
                  </div>

                  {/* You are here marker */}
                  <div className="absolute top-[80px] left-[100px] z-10 flex flex-col items-center">
                    <span className="p-1 px-1.5 bg-blue-600 text-white rounded-lg text-[9px] font-bold shadow-md">Você está aqui</span>
                    <div className="w-3.5 h-3.5 bg-blue-500 border-2 border-white rounded-full animate-ping absolute top-4"></div>
                    <div className="w-3 h-3 bg-blue-600 border-2 border-white rounded-full"></div>
                  </div>

                  {/* Render simulated Health Units Pins on Map */}
                  {SIM_HEALTH_UNITS.map((unit, index) => {
                    const positions = [
                      { top: '35px', left: '190px' }, // Hospital
                      { top: '90px', left: '60px' },  // UBS
                      { top: '15px', left: '20px' },  // UPA
                      { top: '120px', left: '260px' }, // Farmácia
                    ];
                    const pos = positions[index] || positions[0];
                    const isSelected = selectedUnit?.id === unit.id;

                    return (
                      <div 
                        key={unit.id}
                        style={{ top: pos.top, left: pos.left }}
                        onClick={() => setSelectedUnit(unit)}
                        className={`absolute z-10 cursor-pointer p-1 rounded-md shadow-md transition-all flex items-center justify-center ${
                          isSelected 
                            ? 'bg-rose-600 text-white scale-110 border-2 border-white z-20' 
                            : 'bg-white text-rose-600 border border-slate-300 hover:scale-105'
                        }`}
                        id={`map-pin-${unit.id}`}
                      >
                        <MapPin size={12} />
                      </div>
                    );
                  })}

                  {/* Map Layer Zoom HUD */}
                  <div className="absolute bottom-2 right-2 flex flex-col gap-1 z-10">
                    <button className="w-7 h-7 bg-white/95 text-slate-800 rounded font-bold text-center flex items-center justify-center border border-slate-300 text-xs shadow-xs" onClick={() => alert('Simulação de Zoom de Mapas')}>+</button>
                    <button className="w-7 h-7 bg-white/95 text-slate-800 rounded font-bold text-center flex items-center justify-center border border-slate-300 text-xs shadow-xs" onClick={() => alert('Simulação de Zoom de Mapas')}>-</button>
                  </div>
                </div>

                {/* SELECTED UNIT MINI DETAIL */}
                {selectedUnit && (
                  <div className={`p-3.5 rounded-xl border-l-4 border-emerald-500 shadow-sm animate-in zoom-in-95 duration-100 ${cardTheme}`}>
                    <div className="flex justify-between items-start gap-1">
                      <div>
                        <span className="text-[10px] font-bold block uppercase tracking-wider text-rose-500 font-mono">Unidade Selecionada</span>
                        <h4 className="font-extrabold text-[13px] tracking-tight leading-tight mt-0.5">{selectedUnit.name}</h4>
                        <span className="text-[10px] block opacity-85 mt-0.5">{selectedUnit.address}</span>
                      </div>
                      <span className="shrink-0 text-right">
                        <span className="text-[10px] font-bold text-emerald-600 block">{selectedUnit.distance}</span>
                        <span className="text-[9px] font-mono opacity-75">{selectedUnit.waitingTime}</span>
                      </span>
                    </div>

                    {/* Accessibility badges of Unit */}
                    <div className="flex flex-wrap gap-1.5 mt-2.5 pt-2 border-t border-slate-150">
                      <span className={`text-[9px] font-bold uppercase rounded-md px-1.5 py-0.5 flex items-center gap-1 border ${
                        selectedUnit.accessibleEntrance ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'
                      }`}>
                        Rampa {selectedUnit.accessibleEntrance ? 'Acessível' : 'Ausente'}
                      </span>
                      {selectedUnit.adaptedToilets && (
                        <span className="text-[9px] font-sans font-bold uppercase rounded-md px-1.5 py-0.5 bg-blue-100 text-blue-800 border border-blue-200">
                          Banheiro Adaptado
                        </span>
                      )}
                    </div>

                    {/* Navigation step initiator */}
                    <div className="mt-3 flex gap-2">
                      <a 
                        href={`tel:${selectedUnit.phone}`}
                        className="p-3 bg-red-100 text-red-800 border border-red-200 rounded-lg flex items-center justify-center cursor-pointer hover:bg-red-200 transition-colors"
                        title="Ligar para unidade"
                        id="btn-call-unit"
                      >
                        <Phone size={14} />
                      </a>
                      <button
                        onClick={() => {
                          setRouteStep(`ROTA INICIADA: Siga em frente por 150 metros. Vire à direita na Rua das Camélias amigável para muletas.`);
                          setVoiceReply(`Rota Traçada! O trajeto até a ${selectedUnit.name} está desobstruído e possui rampas rebaixadas nas travessias. Siga em frente.`);
                        }}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-black flex items-center justify-center gap-1 border-0 shadow-xs cursor-pointer ${btnPrimary}`}
                        id="btn-start-route"
                      >
                        <MapPin size={12} />
                        IR ATÉ LÁ (Passo-a-passo)
                      </button>
                    </div>
                  </div>
                )}

                {/* ROUTE STEP DETAIL VIEW */}
                {routeStep && (
                  <div className="p-3 bg-yellow-50 text-yellow-950 rounded-lg border-2 border-yellow-400 font-bold text-xs space-y-1.5 flex justify-between items-start animate-in slide-in-from-top-3 duration-150">
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase tracking-wider text-yellow-800 block font-mono">Orientador Vocal Ativo</span>
                      <p>{routeStep}</p>
                    </div>
                    <button onClick={() => setRouteStep(null)} className="p-1 hover:bg-yellow-200/50 rounded-full">
                      <X size={14} />
                    </button>
                  </div>
                )}

                {/* BOTTOM MENU TABS SIMULATION */}
                <div className="pt-2">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase font-mono mb-2">Demais unidades por perto ({SIM_HEALTH_UNITS.length})</span>
                  <div className="space-y-1.5 max-h-[160px] overflow-y-auto">
                    {SIM_HEALTH_UNITS.map(unit => (
                      <div 
                        key={unit.id}
                        onClick={() => setSelectedUnit(unit)}
                        className={`p-2 rounded-xl flex justify-between items-center cursor-pointer border text-xs transition-colors ${
                          selectedUnit?.id === unit.id 
                            ? 'bg-emerald-50 border-emerald-500 font-bold' 
                            : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                        id={`list-unit-${unit.id}`}
                      >
                        <div className="flex gap-2 items-center">
                          <HeartPulse size={12} className="text-emerald-650" />
                          <div>
                            <span className="block font-bold">{unit.name}</span>
                            <span className="text-[10px] opacity-70 block">{unit.type}</span>
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-505 font-mono">{unit.distance}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SCREEN 3: ON-DEMAND SYMPTOMS BODILY GRID */}
            {currentScreen === 'onde-doi' && (
              <div className="space-y-4 animate-in fade-in duration-200 py-1">
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => {
                      setCurrentScreen('home');
                      setSymptomMatch(null);
                    }} 
                    className="p-1 px-1.5 bg-slate-100 rounded text-xs text-slate-600 border border-slate-200 cursor-pointer"
                    id="btn-back-symptom"
                  >
                    Voltar
                  </button>
                  <span className="text-xs text-slate-400 block ml-2">Teclado de Sintomas</span>
                </div>

                <div className="text-center">
                  <h3 className="text-sm font-bold block">🚨 O que você está sentindo?</h3>
                  <span className="text-[11px] text-slate-500 block">Clique no local mais próximo da sua queixa</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { label: 'Coração / Dor no Peito', icon: '❤️' },
                    { label: 'Gripe / Febre / Tosse', icon: '🤒' },
                    { label: 'Dor de Cabeça / Tontura', icon: '🧠' },
                    { label: 'Machucados / Tombo', icon: '🩹' },
                    { label: 'Dor Muscular', icon: '🚶' },
                    { label: 'Falta de Ar', icon: '💨' }
                  ].map((sym) => (
                    <button
                      key={sym.label}
                      onClick={() => handleSelectSymptom(sym.label)}
                      className={`p-4 rounded-xl border-2 font-extrabold text-[13px] flex flex-col items-center gap-1.5 text-center transition-all cursor-pointer select-none ${
                        symptomMatch === sym.label
                          ? 'bg-red-650 border-red-650 text-white shadow-md'
                          : 'bg-white border-slate-200 font-bold hover:bg-slate-50'
                      }`}
                      style={{ minHeight: '52px' }}
                      id={`btn-symptom-${sym.label.replace(/\s+/g, '-').toLowerCase()}`}
                    >
                      <span className="text-xl">{sym.icon}</span>
                      <span>{sym.label}</span>
                    </button>
                  ))}
                </div>

                {/* SYMPTOM REPORT DECISION */}
                {symptomMatch && matchedUnit && (
                  <div className={`p-4 rounded-xl border-2 border-red-500 space-y-2.5 bg-red-50 text-red-950 animate-in slide-in-from-bottom-2`}>
                    <div className="flex gap-2">
                      <AlertCircle className="text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider block font-mono text-red-800">Resultado Recomendado</span>
                        <h4 className="font-extrabold text-[13px] leading-tight mt-0.5">Siga para: {matchedUnit.name}</h4>
                        <p className="text-[11px] leading-normal">{voiceReply}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setCurrentScreen('home');
                        setSymptomMatch(null);
                        setSelectedUnit(matchedUnit);
                        setRouteStep(`DIRECIONAMENTO: Siga em direção à vaga prioritária mapeada do ${matchedUnit.name}.`);
                      }}
                      className="w-full py-3 bg-red-650 text-white rounded-lg font-black text-xs uppercase flex items-center justify-center gap-1 cursor-pointer"
                      id="btn-confirm-recommendation"
                    >
                      <span>CONFIRMAR ROTA ATÉ LOCAL</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* SCREEN 4: BUS ROUTES TRACKING */}
            {currentScreen === 'onibus' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-bold text-slate-800">🚏 Ônibus Acessíveis do Dia</h3>
                  <p className="text-[10px] text-slate-500 leading-normal">
                    Filtro em tempo real para veículos equipados com rampa de acesso, cinto integrado e espaços reservados.
                  </p>
                </div>

                <div className="space-y-3">
                  {SIM_TRANSIT_LINES.map((line) => (
                    <div key={line.id} className={`p-3.5 rounded-xl border flex flex-col justify-between ${cardTheme}`}>
                      <div className="flex justify-between items-start gap-1">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="bg-slate-900 text-white px-2 py-0.5 rounded-md font-mono font-bold text-xs">
                              {line.code}
                            </span>
                            <span className="font-extrabold text-[12px]">{line.name}</span>
                          </div>
                          <span className="text-[10px] block opacity-80 mt-1 flex items-center gap-1">
                            <Clock size={11} /> Estima-se chegada em: <strong className="text-purple-600 font-bold">{line.etaMinutes} min</strong>
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mt-2.5 pt-2 border-t border-slate-150">
                        {line.accessibleRamp ? (
                          <span className="text-[9px] font-bold uppercase rounded-md px-1.5 py-0.5 bg-green-100 text-green-800 border border-green-200 flex items-center gap-0.5">
                            <Accessibility size={10} /> Rampa Pneumática OK
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold uppercase rounded-md px-1.5 py-0.5 bg-red-100 text-red-800 border border-red-200">
                            Sem Elevador / Antigo
                          </span>
                        )}

                        {line.wheelchairSpaces > 0 ? (
                          <span className="text-[9px] font-bold uppercase rounded-md px-1.5 py-0.5 bg-blue-100 text-blue-800 border border-blue-200">
                            {line.wheelchairSpaces} vaga(s) cadeirante livre
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold uppercase rounded-md px-1.5 py-0.5 bg-slate-100 text-slate-500">
                            Sem espaço vago
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-yellow-50 text-slate-800 rounded-xl border border-yellow-200 text-[10px] leading-relaxed flex items-start gap-2">
                  <Info size={14} className="text-emerald-600 mt-0.5 shrink-0" />
                  <span>
                    <strong>Dica de Monitoramento:</strong> Nosso mapa se conecta diretamente aos dados oficiais do SPTrans Olho Vivo, garantindo que o idoso nunca fique esperando na chuva por um barramento indevido sem rampa.
                  </span>
                </div>
              </div>
            )}

            {/* SCREEN 5: SPECIALIZED ATENDE BOOKING FORM */}
            {currentScreen === 'atende' && (
              <div className="space-y-4 animate-in fade-in duration-200 py-1">
                <div className="space-y-0.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-purple-600 font-mono">Serviço ATENDE SP</h3>
                  <h2 className="text-base font-extrabold text-slate-800 leading-tight">Solicitar Van Adaptada</h2>
                  <p className="text-[10px] text-slate-500 leading-normal">
                    Cadastre agendamentos de transporte porta-a-porta exclusivo da prefeitura para consultas de saúde.
                  </p>
                </div>

                {bookingSuccess ? (
                  <div className="bg-emerald-50 border-2 border-emerald-500 rounded-xl p-4 text-center space-y-3 animate-in zoom-in-95 duration-120">
                    <div className="w-12 h-12 bg-emerald-150 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                      <Check size={28} className="font-extrabold" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">Agendamento Confirmado!</h4>
                      <p className="text-[10px] text-slate-500 font-sans mt-0.5">Sua solicitação foi aprovada pela prefeitura com prioridade sênior.</p>
                    </div>

                    {/* Simple confirmation card ticket */}
                    <div className="bg-white p-3 rounded-lg border border-slate-200 font-mono text-[9px] text-left space-y-1 text-slate-700 shadow-xs">
                      <div><strong className="text-slate-900 underline block uppercase">Passagem de Viagem Grátis</strong></div>
                      <div>PACIENTE: Raphael - Idoso</div>
                      <div>DATA: {bookingDate}</div>
                      <div>DESTINO: {bookingDest}</div>
                      <div>FINALIDADE: {bookingPurpose}</div>
                      <div className="bg-slate-100 p-2 rounded text-center font-bold text-emerald-800 text-[8px] tracking-widest uppercase mt-2">
                        COMPROVANTE REGISTRADO NO FIRESTORE
                      </div>
                    </div>

                    <button
                      onClick={() => setBookingSuccess(false)}
                      className="w-full py-2 bg-slate-800 text-white font-bold rounded-lg text-xs hover:bg-slate-900 transition-colors cursor-pointer"
                      id="btn-booking-reset"
                    >
                      Agendar Outra Viagem
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleBookingSubmit} className="space-y-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">Qual a Data da Consulta?</label>
                      <input
                        type="date"
                        required
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className={`w-full px-3 py-2 border-2 rounded-lg text-xs font-bold leading-normal focus:outline-hidden ${
                          highContrast ? 'bg-black text-white border-yellow-400' : 'bg-white text-slate-800 border-slate-200'
                        }`}
                        id="form-booking-date"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">Unidade de Destino:</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Hospital das Clínicas"
                        value={bookingDest}
                        onChange={(e) => setBookingDest(e.target.value)}
                        className={`w-full px-3 py-2 border-2 rounded-lg text-xs font-bold leading-normal focus:outline-hidden ${
                          highContrast ? 'bg-black text-white border-yellow-400' : 'bg-white text-slate-800 border-slate-200'
                        }`}
                        id="form-booking-dest"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">Qual a sua Especialidade / Finalidade?</label>
                      <select
                        value={bookingPurpose}
                        onChange={(e) => setBookingPurpose(e.target.value)}
                        className={`w-full px-2 py-2 border-2 rounded-lg text-xs font-bold leading-normal focus:outline-hidden ${
                          highContrast ? 'bg-black text-white border-yellow-400' : 'bg-white text-slate-800 border-slate-200'
                        }`}
                        id="form-booking-purpose"
                      >
                        <option value="Consulta com Cardiologista">Consulta com Cardiologista</option>
                        <option value="Fisioterapia Geral">Fisioterapia Geral</option>
                        <option value="Tratamento Multidisciplinar">Tratamento Multidisciplinar</option>
                        <option value="Exame de Sangue ou Imagem">Exame de Sangue ou Imagem</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 bg-emerald-600 text-white font-extrabold text-sm rounded-xl uppercase hover:bg-emerald-700 shadow-md cursor-pointer border-0 mt-2"
                      style={{ minHeight: '52px' }}
                      id="btn-form-booking-submit"
                    >
                      📅 CONFIRMAR RESERVA ATENDE
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* SCREEN 6: VOICE ASSISTANT DEMO */}
            {currentScreen === 'voz' && (
              <div className="space-y-4 animate-in fade-in duration-200 py-1">
                <div className="space-y-0.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-rose-500 font-mono">Assistente de Voz</h3>
                  <h2 className="text-base font-extrabold text-slate-800 leading-tight">Ajuda por Áudio e Fala</h2>
                  <p className="text-[10px] text-slate-500 leading-normal">
                    Fale em voz alta o que precisa e retornaremos com instruções ampliadas em fonte visível.
                  </p>
                </div>

                {/* Simulated conversations balloon */}
                <div className="space-y-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-white min-h-[160px] flex flex-col justify-end text-xs">
                  <div className="bg-slate-800 p-2 rounded-lg max-w-[85%] self-start border border-slate-700">
                    <span className="text-[8px] text-slate-400 uppercase font-bold block mb-0.5">Idoso (Comando de voz)</span>
                    {voiceInput || '...Clique em um dos botões rápidos de fala abaixo...'}
                  </div>

                  <div className="bg-emerald-950 border border-emerald-900 p-2.5 rounded-lg max-w-[90%] self-end text-slate-100">
                    <span className="text-[8px] text-emerald-400 uppercase font-bold block mb-0.5">Cuidar Já Saúde Inteligência</span>
                    <p style={{ fontSize: '12px' }} className="font-extrabold leading-normal">{voiceReply}</p>
                    <div className="mt-2.5 flex items-center gap-1.5 text-[9px] text-emerald-300 bg-emerald-900/50 p-1 rounded">
                      <Volume2 size={11} className="animate-bounce" />
                      <span>Reproduzindo áudio do celular em alta voz...</span>
                    </div>
                  </div>
                </div>

                {/* Voice presets trigger */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-[9px] font-bold text-slate-400 uppercase block font-mono">Diga frases prontas:</span>
                  
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { query: 'Quero ir ao médico hoje', reply: 'Disparando busca de geolocalização... Identifiquei a UBS Pinheiros a 340 metros. O caminho é plano e possui faixa para idosos.' },
                      { query: 'Como faço para pedir a van gratuita?', reply: 'Para agendar o veículo ATENDE com rampas integradas para exames, acione a aba &quot;AGENDAR VAN&quot; no menu inferior e indique a data da sua consulta.' },
                      { query: 'Este ônibus serve para cadeirante?', reply: 'A linha 702U Pinheiros em trânsito possui rampa ativa mecânica e espaço prioritário disponível livre. Chegará em 4 minutos!' }
                    ].map((vo, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setVoiceInput(`"${vo.query}"`);
                          setVoiceReply(vo.reply);
                        }}
                        className="py-2.5 px-3 bg-white text-left text-[11px] font-bold border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 leading-normal flex justify-between items-center cursor-pointer select-none"
                        id={`btn-voice-suggest-${idx}`}
                      >
                        <span>📢 &quot;{vo.query}&quot;</span>
                        <ChevronRight size={12} className="text-slate-400 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* APP BOTTOM NAVIGATION RAIL (Super accessible large targets - Min 48px) */}
          {isOnboarded && (
            <div className={`pt-2.5 pb-5 px-3 border-t flex justify-around items-center gap-1 shrink-0 ${
              highContrast ? 'bg-black border-yellow-400 text-white' : 'bg-white border-slate-200'
            }`} id="mobile-bottom-rail">
              
              <button
                onClick={() => setCurrentScreen('home')}
                className={`flex-1 flex flex-col items-center py-2.5 rounded-lg cursor-pointer transition-all ${
                  currentScreen === 'home' 
                    ? highContrast 
                      ? 'bg-yellow-400 text-black border-2 border-white' 
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold'
                    : 'opacity-70 text-slate-500'
                }`}
                title="Ir para Mapa"
                id="btn-nav-home"
              >
                <MapPin size={22} />
                <span className="text-[10px] mt-1 font-bold">Mapa</span>
              </button>

              <button
                onClick={() => setCurrentScreen('onibus')}
                className={`flex-1 flex flex-col items-center py-2.5 rounded-lg cursor-pointer transition-all ${
                  currentScreen === 'onibus' 
                    ? highContrast 
                      ? 'bg-yellow-400 text-black border-2 border-white font-bold' 
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold'
                    : 'opacity-70 text-slate-500'
                }`}
                title="Ônibus Acessível"
                id="btn-nav-bus"
              >
                <Bus size={22} />
                <span className="text-[10px] mt-1 font-bold">Ônibus</span>
              </button>

              <button
                onClick={() => setCurrentScreen('atende')}
                className={`flex-1 flex flex-col items-center py-2.5 rounded-lg cursor-pointer transition-all ${
                  currentScreen === 'atende' 
                    ? highContrast 
                      ? 'bg-yellow-400 text-black border-2 border-white font-bold' 
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold'
                    : 'opacity-70 text-slate-500'
                }`}
                title="Agendar Van ATENDE"
                id="btn-nav-atende"
              >
                <Calendar size={22} />
                <span className="text-[10px] mt-1 font-bold">Agendar</span>
              </button>

              <button
                onClick={() => setCurrentScreen('voz')}
                className={`flex-1 flex flex-col items-center py-2.5 rounded-lg cursor-pointer transition-all ${
                  currentScreen === 'voz' 
                    ? highContrast 
                      ? 'bg-yellow-400 text-black border-2 border-white font-bold' 
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold'
                    : 'opacity-70 text-slate-500'
                }`}
                title="Assistente de Voz"
                id="btn-nav-voice"
              >
                <MessageSquare size={22} />
                <span className="text-[10px] mt-1 font-bold">Voz</span>
              </button>

            </div>
          )}

        </div>
      </div>

    </div>
  );
}
