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
  Info,
  Monitor
} from 'lucide-react';

import { MapContainer, TileLayer, Marker, Popup, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { latLngToCell, cellToBoundary } from 'h3-js';

// Fix Leaflet icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function WebView() {
  // Navigation state
  const [currentScreen, setCurrentScreen] = useState<'onboarding' | 'home' | 'onde-doi' | 'onibus' | 'atende' | 'voz'>('onboarding');
  
  // Accessibility state
  const [highContrast, setHighContrast] = useState(false);
  const [fontMultiplier, setFontMultiplier] = useState<number>(1.0); 
  
  // Business logic state
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isOnboarded, setIsOnboarded] = useState(false);
  
  // Backend data state
  const [healthUnits, setHealthUnits] = useState<HealthUnit[]>([]);
  const [transitLines, setTransitLines] = useState<TransitLine[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<HealthUnit | null>(null);
  const [routeStep, setRouteStep] = useState<string | null>(null);
  
  // Symptom matches
  const [symptomMatch, setSymptomMatch] = useState<string | null>(null);
  const [matchedUnit, setMatchedUnit] = useState<HealthUnit | null>(null);

  // ATENDE Reservation
  const [bookingDate, setBookingDate] = useState('2026-06-18');
  const [bookingDest, setBookingDest] = useState('Hospital das Clínicas');
  const [bookingPurpose, setBookingPurpose] = useState('Consulta com Cardiologista');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Voice Assistant
  const [voiceInput, setVoiceInput] = useState<string>('');
  const [voiceReply, setVoiceReply] = useState<string>('Olá! Sou o assistente virtual do Cuidar Já Saúde. Em que posso te ajudar hoje?');

  const [userLocation, setUserLocation] = useState<[number, number]>([-22.3145, -49.0587]); // Bauru default

  // H3 Hexagon Boundary
  const h3Index = latLngToCell(userLocation[0], userLocation[1], 8); // Resolution 8
  const hexBoundary = cellToBoundary(h3Index, true).map(coords => [coords[1], coords[0]] as [number, number]); // h3-js returns [lng, lat], Leaflet wants [lat, lng]

  const fetchUnits = (coords: [number, number]) => {
    fetch(`/api/health-units?lat=${coords[0]}&lng=${coords[1]}`)
      .then(res => res.json())
      .then(data => {
        setHealthUnits(data);
        if (data.length > 0) setSelectedUnit(data[0]);
      })
      .catch(console.error);
  };

  // Load Data from Backend
  React.useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserLocation(coords);
        fetchUnits(coords);
      }, () => {
        fetchUnits(userLocation);
      });
    } else {
      fetchUnits(userLocation);
    }

    fetch('/api/transit-lines')
      .then(res => res.json())
      .then(setTransitLines)
      .catch(console.error);
  }, []);

  const handleOnboardingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneNumber })
      });
      const data = await res.json();
      if (data.success) {
        setIsOnboarded(true);
        setCurrentScreen('home');
      } else {
        alert(data.error || 'Erro ao realizar login.');
      }
    } catch (err) {
      alert('Erro de conexão.');
    }
  };

  const handleSelectSymptom = (symptom: string) => {
    setSymptomMatch(symptom);
    if (symptom === 'Coração / Dor no Peito') {
      const match = healthUnits.find(u => u.type === 'Hospital SUS') || healthUnits[0];
      setMatchedUnit(match);
      setSelectedUnit(match);
      setVoiceReply(`🚨 IMPORTANTE: Dor no peito requer atenção emergencial. Recomendo seguir direto para o ${match?.name}. É o hospital de pronto atendimento SUS mais próximo de você. Gostaria de ver a rota acessível?`);
    } else if (symptom === 'Gripe / Febre / Tosse') {
      const match = healthUnits.find(u => u.type === 'UBS') || healthUnits[1];
      setMatchedUnit(match);
      setSelectedUnit(match);
      setVoiceReply(`Fique calmo(a). Para gripe ou tosse, a ${match?.name} é a unidade ideal para exames leves e vacinação. Fica a apenas 340 metros de você. Calçadas amplas no caminho!`);
    } else if (symptom === 'Dor de Cabeça / Tontura') {
      const match = healthUnits.find(u => u.type === 'UPA') || healthUnits[2];
      setMatchedUnit(match);
      setSelectedUnit(match);
      setVoiceReply(`Para tontura ou dor de cabeça aguda, a ${match?.name} possui triagem em tempo real e médicos clínicos disponíveis. Deseja ver a rota?`);
    } else {
      const match = healthUnits.find(u => u.type === 'Farmácia Popular') || healthUnits[3];
      setMatchedUnit(match);
      setSelectedUnit(match);
      setVoiceReply(`Se precisa apenas de medicamentos gratuitos da Farmácia Popular, a ${match?.name} está bem próxima, a 150 metros. Atenção: há uma escadaria lenta na entrada, se tiver cadeira de rodas, recomendo solicitar a rampa lateral.`);
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: bookingDate, destination: bookingDest, purpose: bookingPurpose })
      });
      const data = await res.json();
      if (data.success) {
        setBookingSuccess(true);
      }
    } catch (err) {
      alert('Erro ao realizar agendamento.');
    }
  };

  const sendChatMessage = async (msg: string) => {
    setVoiceInput(msg);
    setVoiceReply('Pensando...');
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg })
      });
      const data = await res.json();
      setVoiceReply(data.reply);
    } catch (err) {
      setVoiceReply('Desculpe, não consegui conectar à internet.');
    }
  };

  // Accent and UI dynamic classes defined by High Contrast state
  const bgTheme = highContrast ? 'bg-black text-white' : 'bg-slate-50 text-slate-900';
  const cardTheme = highContrast ? 'bg-black border-4 border-yellow-400 text-white' : 'bg-white border border-slate-200 text-slate-800';
  const textPrimary = highContrast ? 'text-yellow-400 font-extrabold' : 'text-emerald-700 font-extrabold';
  const textMuted = highContrast ? 'text-white/80' : 'text-slate-500';
  const btnPrimary = highContrast ? 'bg-yellow-400 text-black border-2 border-white hover:bg-yellow-400 font-black' : 'bg-emerald-600 text-white hover:bg-emerald-700';

  return (
    <div className={`rounded-2xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col min-h-[700px] ${bgTheme}`} style={{ fontSize: `${fontMultiplier}rem` }}>
      
      {/* Top Header */}
      <header className={`p-4 flex justify-between items-center ${highContrast ? 'bg-black border-b-2 border-yellow-400' : 'bg-emerald-700 text-white'}`}>
        <div className="flex items-center gap-3">
          <HeartPulse size={28} className={highContrast ? 'text-yellow-400' : 'text-white'} />
          <h1 className="text-xl font-extrabold tracking-tight">Cuidar Já Saúde Web</h1>
        </div>

        {/* Accessibility Controls */}
        <div className="flex items-center gap-4 bg-black/20 p-2 rounded-xl">
          <button 
            onClick={() => setHighContrast(!highContrast)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm font-bold transition-all ${
              highContrast ? 'bg-yellow-400 text-black' : 'bg-white text-emerald-800 hover:bg-emerald-50'
            }`}
          >
            <Eye size={18} /> Alto Contraste
          </button>
          <div className="flex items-center gap-2">
            <button onClick={() => setFontMultiplier(p => Math.max(0.8, p - 0.1))} className="px-3 py-1.5 bg-white text-emerald-800 font-bold rounded hover:bg-emerald-50">A-</button>
            <button onClick={() => setFontMultiplier(p => Math.min(1.5, p + 0.1))} className="px-3 py-1.5 bg-white text-emerald-800 font-bold rounded hover:bg-emerald-50">A+</button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar Navigation (only show if onboarded) */}
        {isOnboarded && (
          <aside className={`w-64 border-r flex flex-col p-4 gap-2 ${highContrast ? 'border-yellow-400' : 'border-slate-200 bg-white'}`}>
            <button
              onClick={() => setCurrentScreen('home')}
              className={`flex items-center gap-3 p-3 rounded-xl font-bold transition-all ${currentScreen === 'home' ? btnPrimary : 'hover:bg-slate-100 text-slate-700'}`}
            >
              <MapPin size={20} /> Localizador Geral
            </button>
            <button
              onClick={() => setCurrentScreen('onde-doi')}
              className={`flex items-center gap-3 p-3 rounded-xl font-bold transition-all ${currentScreen === 'onde-doi' ? btnPrimary : 'hover:bg-slate-100 text-slate-700'}`}
            >
              <Activity size={20} /> Triagem (Onde Dói)
            </button>
            <button
              onClick={() => setCurrentScreen('onibus')}
              className={`flex items-center gap-3 p-3 rounded-xl font-bold transition-all ${currentScreen === 'onibus' ? btnPrimary : 'hover:bg-slate-100 text-slate-700'}`}
            >
              <Bus size={20} /> Transporte Acessível
            </button>
            <button
              onClick={() => setCurrentScreen('atende')}
              className={`flex items-center gap-3 p-3 rounded-xl font-bold transition-all ${currentScreen === 'atende' ? btnPrimary : 'hover:bg-slate-100 text-slate-700'}`}
            >
              <Calendar size={20} /> Solicitar Van ATENDE
            </button>
            <div className="my-2 border-t border-slate-200"></div>
            <button
              onClick={() => setCurrentScreen('voz')}
              className={`flex items-center gap-3 p-3 rounded-xl font-bold transition-all ${currentScreen === 'voz' ? btnPrimary : 'hover:bg-slate-100 text-slate-700'}`}
            >
              <Volume2 size={20} /> Assistente Virtual
            </button>
          </aside>
        )}

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 relative">
          
          {/* ONBOARDING */}
          {currentScreen === 'onboarding' && (
            <div className="max-w-md mx-auto mt-20 p-8 bg-white border border-slate-200 rounded-2xl shadow-xl space-y-6 text-center">
              <div className="inline-flex p-4 rounded-full bg-emerald-100 text-emerald-700">
                <Monitor size={48} />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-slate-800">Bem-vindo ao Portal Web</h2>
                <p className="text-slate-500 mt-2">Acesso simplificado e seguro para gestão de saúde.</p>
              </div>
              <form onSubmit={handleOnboardingSubmit} className="space-y-4 text-left">
                <div>
                  <label className="font-bold text-slate-700 uppercase block mb-2">Telefone Celular / Identificação</label>
                  <input
                    type="tel"
                    required
                    placeholder="Ex: 11 98877 6655"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl text-lg font-bold text-slate-800 focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
                <button type="submit" className={`w-full py-4 rounded-xl font-extrabold text-lg flex items-center justify-center gap-2 ${btnPrimary}`}>
                  Acessar Plataforma <ArrowRight size={20} />
                </button>
              </form>
            </div>
          )}

          {/* HOME / MAP */}
          {currentScreen === 'home' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
              <div className={`lg:col-span-2 rounded-2xl border-2 flex flex-col relative overflow-hidden ${highContrast ? 'border-yellow-400 bg-black' : 'border-slate-300 bg-slate-200'}`}>
                {/* Real Map Layer */}
                <div className="absolute inset-0 z-0">
                  <MapContainer center={userLocation} zoom={14} style={{ height: '100%', width: '100%' }}>
                    <TileLayer 
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
                    />
                    <Marker position={userLocation}>
                      <Popup>Seu Local Atual</Popup>
                    </Marker>
                    <Polygon 
                      positions={hexBoundary} 
                      pathOptions={{ color: 'emerald', fillColor: 'emerald', fillOpacity: 0.2, weight: 2 }} 
                    />
                    {healthUnits.map((unit) => (
                      <Marker 
                        key={unit.id} 
                        position={[unit.lat, unit.lng]}
                        eventHandlers={{ click: () => setSelectedUnit(unit) }}
                      >
                        <Popup>
                          <strong>{unit.name}</strong><br />{unit.type}
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                </div>

                {/* Route Step Floating Box */}
                {routeStep && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[80%] max-w-lg p-4 bg-emerald-50 border-4 border-emerald-500 text-emerald-900 font-bold rounded-2xl shadow-2xl flex justify-between items-center z-50">
                    <div className="flex items-center gap-4">
                      <Accessibility size={32} />
                      <p className="text-lg">{routeStep}</p>
                    </div>
                    <button onClick={() => setRouteStep(null)} className="p-2 hover:bg-emerald-200 rounded-full">
                      <X size={24} />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-4">
                <h3 className="font-bold text-xl uppercase tracking-wide">Unidades Próximas</h3>
                <div className="space-y-3 overflow-y-auto pr-2 pb-4">
                  {healthUnits.map(unit => (
                    <div 
                      key={unit.id}
                      onClick={() => setSelectedUnit(unit)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-colors ${
                        selectedUnit?.id === unit.id ? 'border-emerald-500 bg-emerald-50/50' : cardTheme
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-extrabold text-lg">{unit.name}</h4>
                          <span className={`text-sm ${textMuted} font-bold`}>{unit.type}</span>
                        </div>
                        <span className="text-emerald-600 font-black">{unit.distance}</span>
                      </div>
                      
                      {selectedUnit?.id === unit.id && (
                        <div className="mt-4 pt-4 border-t border-slate-200 space-y-3">
                          <p className="text-sm font-medium">{unit.address}</p>
                          <div className="flex flex-wrap gap-2">
                            {unit.accessibleEntrance && <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold border border-green-200">Acessível</span>}
                            {unit.adaptedToilets && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold border border-blue-200">Banheiro Adaptado</span>}
                          </div>
                          <button
                            onClick={() => setRouteStep(`Iniciando navegação para ${unit.name}. Siga as calçadas acessíveis mapeadas.`)}
                            className={`w-full mt-2 py-3 rounded-xl font-bold flex items-center justify-center gap-2 ${btnPrimary}`}
                          >
                            <MapPin size={18} /> Iniciar Navegação
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ONDE DOI */}
          {currentScreen === 'onde-doi' && (
            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-extrabold flex items-center justify-center gap-3">
                  <Activity className="text-red-500" size={36} /> O que você está sentindo?
                </h2>
                <p className="text-lg opacity-80">Selecione uma opção abaixo para encontrarmos o melhor atendimento</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
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
                    className={`p-8 rounded-3xl border-4 text-xl font-extrabold flex flex-col items-center gap-4 transition-all hover:-translate-y-1 ${
                      symptomMatch === sym.label
                        ? 'bg-red-600 border-red-700 text-white shadow-xl'
                        : cardTheme
                    }`}
                  >
                    <span className="text-5xl">{sym.icon}</span>
                    <span>{sym.label}</span>
                  </button>
                ))}
              </div>

              {symptomMatch && matchedUnit && (
                <div className="bg-red-50 border-4 border-red-500 p-6 rounded-2xl flex justify-between items-center mt-8">
                  <div>
                    <h3 className="text-red-800 font-extrabold text-2xl uppercase">Recomendação</h3>
                    <p className="text-red-900 text-lg mt-2 font-medium">{voiceReply}</p>
                    <p className="font-extrabold text-red-700 mt-2 text-xl">Siga para: {matchedUnit.name}</p>
                  </div>
                  <button 
                    onClick={() => {
                      setCurrentScreen('home');
                      setSymptomMatch(null);
                      setSelectedUnit(matchedUnit);
                      setRouteStep(`DIRECIONAMENTO: Rota médica acionada para ${matchedUnit.name}.`);
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white font-black px-8 py-4 rounded-xl text-lg shadow-lg flex items-center gap-2"
                  >
                    Confirmar Rota <ChevronRight size={24} />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ÔNIBUS */}
          {currentScreen === 'onibus' && (
            <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in">
              <h2 className="text-2xl font-extrabold flex items-center gap-3">
                <Bus className="text-purple-600" size={32} /> Acompanhamento de Frota Acessível (SPTrans)
              </h2>
              
              <div className="grid gap-4">
                {transitLines.map((line) => (
                  <div key={line.id} className={`p-6 rounded-2xl border-2 flex items-center justify-between ${cardTheme}`}>
                    <div className="flex items-center gap-6">
                      <div className="bg-slate-900 text-white text-2xl font-black px-4 py-2 rounded-xl">
                        {line.code}
                      </div>
                      <div>
                        <h4 className="text-xl font-extrabold">{line.name}</h4>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="flex items-center gap-1 font-bold text-emerald-600">
                            <Clock size={16} /> Chega em {line.etaMinutes} min
                          </span>
                          {line.accessibleRamp ? (
                            <span className="flex items-center gap-1 font-bold bg-green-100 text-green-800 px-2 py-1 rounded">
                              <Accessibility size={16} /> Rampa OK
                            </span>
                          ) : (
                            <span className="font-bold bg-red-100 text-red-800 px-2 py-1 rounded">Sem Rampa</span>
                          )}
                          <span className="font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {line.wheelchairSpaces} Vagas Livres
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ATENDE */}
          {currentScreen === 'atende' && (
            <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-extrabold text-purple-700 flex items-center justify-center gap-2">
                  <Calendar size={36} /> Solicitação de Van ATENDE
                </h2>
                <p className="text-lg opacity-80">Agendamento portal-a-portal gratuito da prefeitura.</p>
              </div>

              {bookingSuccess ? (
                <div className="bg-emerald-50 border-4 border-emerald-500 rounded-3xl p-8 text-center space-y-6">
                  <Check size={64} className="mx-auto text-emerald-600" />
                  <h3 className="text-3xl font-black text-slate-800">Agendamento Confirmado!</h3>
                  
                  <div className="bg-white p-6 rounded-xl border border-slate-200 text-left mx-auto max-w-sm space-y-2 text-lg shadow-inner">
                    <div><span className="font-bold text-slate-500 text-sm">DATA</span><br/><strong>{bookingDate}</strong></div>
                    <div><span className="font-bold text-slate-500 text-sm">DESTINO</span><br/><strong>{bookingDest}</strong></div>
                    <div><span className="font-bold text-slate-500 text-sm">TIPO</span><br/><strong>{bookingPurpose}</strong></div>
                  </div>

                  <button 
                    onClick={() => setBookingSuccess(false)}
                    className="bg-slate-900 text-white font-bold py-3 px-8 rounded-xl hover:bg-slate-800"
                  >
                    Fazer Novo Agendamento
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className={`p-8 rounded-3xl border-2 space-y-6 ${cardTheme}`}>
                  <div>
                    <label className="font-bold text-lg block mb-2">Data da Viagem</label>
                    <input
                      type="date"
                      required
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl text-lg font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-lg block mb-2">Unidade de Destino</label>
                    <input
                      type="text"
                      required
                      value={bookingDest}
                      onChange={(e) => setBookingDest(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl text-lg font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-lg block mb-2">Finalidade</label>
                    <select
                      value={bookingPurpose}
                      onChange={(e) => setBookingPurpose(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl text-lg font-bold"
                    >
                      <option value="Consulta com Cardiologista">Consulta Especialista</option>
                      <option value="Fisioterapia Geral">Fisioterapia</option>
                      <option value="Exame de Sangue ou Imagem">Exames de Imagem</option>
                    </select>
                  </div>
                  <button type="submit" className={`w-full py-4 rounded-xl text-xl font-black ${btnPrimary}`}>
                    CONFIRMAR RESERVA
                  </button>
                </form>
              )}
            </div>
          )}

          {/* VOZ */}
          {currentScreen === 'voz' && (
            <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in flex flex-col h-full">
              <h2 className="text-3xl font-extrabold flex items-center gap-3">
                <Volume2 className="text-sky-500" size={36} /> Assistente Inteligente em Tela Larga
              </h2>

              <div className="flex-1 bg-slate-900 rounded-3xl p-6 border-4 border-slate-800 flex flex-col justify-end space-y-6">
                
                {voiceInput && (
                  <div className="bg-slate-800 p-4 rounded-2xl rounded-tr-none self-end max-w-[70%] border border-slate-700">
                    <p className="text-white text-xl font-medium">{voiceInput}</p>
                  </div>
                )}
                
                <div className="bg-emerald-950 p-6 rounded-2xl rounded-tl-none self-start max-w-[80%] border-2 border-emerald-800 flex gap-4 items-start">
                  <div className="bg-emerald-800 p-3 rounded-full mt-1">
                    <Volume2 className="text-emerald-200 animate-pulse" size={24} />
                  </div>
                  <div>
                    <p className="text-emerald-100 text-2xl font-extrabold leading-snug">{voiceReply}</p>
                  </div>
                </div>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { query: 'Quero ir ao médico hoje', reply: 'Identifiquei a UBS Pinheiros a 340 metros. O caminho é plano e possui faixa para idosos.' },
                  { query: 'Como faço para pedir a van gratuita?', reply: 'Para agendar o veículo ATENDE com rampas integradas para exames, clique na aba "Solicitar Van ATENDE" no menu ao lado.' },
                  { query: 'Qual ônibus com rampa passa aqui?', reply: 'A linha 702U Pinheiros em trânsito possui rampa ativa mecânica. Chegará em 4 minutos!' }
                ].map((vo, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setVoiceInput(vo.query);
                      setVoiceReply(vo.reply);
                    }}
                    className={`p-4 text-left font-bold rounded-xl border-2 text-lg hover:-translate-y-1 transition-all flex justify-between items-center ${cardTheme}`}
                  >
                    <span>🎙️ "{vo.query}"</span>
                  </button>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
