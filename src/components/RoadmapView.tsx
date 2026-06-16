/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MVP_ROADMAP_7_DAYS } from '../data';
import { 
  CalendarDays, 
  CheckCircle2, 
  HelpCircle, 
  Clock, 
  TrendingUp, 
  Play, 
  ArrowRight,
  Sparkles,
  Award
} from 'lucide-react';

export default function RoadmapView() {
  const [selectedDayNum, setSelectedDayNum] = useState<number>(1);

  const activeDay = MVP_ROADMAP_7_DAYS.find(d => d.day === selectedDayNum) || MVP_ROADMAP_7_DAYS[0];

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-6" id="roadmap-root-parent">
      {/* Top Description bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <CalendarDays className="text-emerald-600" size={18} />
            Cronograma de MVP Técnico em 7 Dias
          </h3>
          <p className="text-slate-600 text-xs">
            Uma divisão implacável estruturada de forma ágil para lançar o aplicativo funcional, testado e validado em uma única semana.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 bg-white px-3 py-1.5 rounded-lg border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-bold text-emerald-800 font-mono">100% Executável</span>
        </div>
      </div>

      {/* Days track timeline picker */}
      <div className="relative pb-2 overflow-x-auto">
        <div className="flex gap-2 min-w-[600px] sm:min-w-0" id="roadmap-days-picker-row">
          {MVP_ROADMAP_7_DAYS.map((d) => {
            const isSelected = d.day === selectedDayNum;
            return (
              <button
                key={d.day}
                onClick={() => setSelectedDayNum(d.day)}
                className={`flex-1 min-h-[70px] rounded-xl p-3 border transition-all text-left flex flex-col justify-between cursor-pointer select-none ${
                  isSelected
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-md scale-[1.02]'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-150'
                }`}
                id={`btn-roadmap-day-${d.day}`}
              >
                <span className={`text-[10px] font-bold uppercase font-mono ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
                  Dia {d.day}
                </span>
                <span className="font-extrabold text-xs line-clamp-1 mt-1 leading-tight">
                  {d.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Highlighted Day details card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        
        {/* Core Day objectives & Validation (Leads 1 column) */}
        <div className="md:col-span-1 space-y-4">
          <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Progresso Focado</span>
              <h4 className="text-base font-extrabold text-slate-800 tracking-tight mt-0.5">Dia {activeDay.day}: {activeDay.title}</h4>
            </div>

            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Objetivos Macro do Dia</span>
              <ul className="space-y-1.5">
                {activeDay.objectives.map((obj, idx) => (
                  <li key={idx} className="text-slate-600 text-xs flex items-start gap-2 leading-relaxed">
                    <CheckCircle2 size={13} className="text-emerald-500 mt-0.5 shrink-0" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Validation card */}
          <div className="p-5 bg-teal-50 border border-teal-200 rounded-xl space-y-2">
            <span className="text-[10px] font-bold text-teal-800 uppercase font-mono block flex items-center gap-1">
              <Award size={12} />
              Critério Homologação (Validation)
            </span>
            <p className="text-slate-700 text-xs leading-relaxed font-semibold">
              {activeDay.validationMethod}
            </p>
          </div>
        </div>

        {/* Deliverables checklists (Leads 2 columns) */}
        <div className="md:col-span-2 bg-slate-50 p-5 rounded-xl border border-slate-250/70 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide font-mono">Checklist de Engenharia e UX</span>
            <span className="text-[10px] bg-slate-200 text-slate-600 font-bold px-2 py-0.5 rounded-full font-mono">
              {activeDay.tasks.length} Tarefa(s)
            </span>
          </div>

          <div className="space-y-3">
            {activeDay.tasks.map((task, idx) => {
              const taskTypeColors = {
                frontend: 'bg-blue-100 text-blue-800 border-blue-200',
                backend: 'bg-orange-100 text-orange-850 border-orange-200',
                ux: 'bg-purple-100 text-purple-800 border-purple-200',
                infra: 'bg-teal-100 text-teal-800 border-teal-200'
              };

              return (
                <div key={idx} className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                  <div className="flex gap-2.5 items-start">
                    <div className="pt-0.5 shrink-0">
                      <div className="w-4 h-4 rounded-full border-2 border-slate-300 flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      </div>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-800 text-xs leading-snug block">
                        {task.title}
                      </span>
                      <div className="flex gap-1.5 mt-1.5">
                        <span className={`px-1.5 py-0.2 text-[9px] font-bold rounded uppercase border ${taskTypeColors[task.type]}`}>
                          {task.type}
                        </span>
                        {task.mandatory ? (
                          <span className="px-1.5 py-0.2 bg-red-100 text-red-800 text-[9px] font-bold rounded uppercase border border-red-200">
                            Mandatório
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.2 bg-slate-100 text-slate-600 text-[9px] font-bold rounded uppercase border border-slate-200">
                            Opcional
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="self-end sm:self-auto">
                    <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                      <Clock size={10} />
                      Concluir no Dia
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
