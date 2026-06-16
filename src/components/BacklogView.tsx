/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GITHUB_ISSUES_BACKLOG, EPICS } from '../data';
import { GitHubIssue, IssueStatus, IssueLabel, IssuePriority } from '../types';
import { 
  GitPullRequest, 
  Search, 
  PlusCircle, 
  Filter, 
  Trash2, 
  Check, 
  Calendar, 
  Layers, 
  Plus, 
  X,
  ChevronRight,
  TrendingUp,
  Flame,
  AlertTriangle,
  Github
} from 'lucide-react';

export default function BacklogView() {
  const [issues, setIssues] = useState<GitHubIssue[]>(GITHUB_ISSUES_BACKLOG);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEpic, setSelectedEpic] = useState<string>('all');
  const [selectedLabel, setSelectedLabel] = useState<string>('all');

  // New Issue Form inputs
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newEpic, setNewEpic] = useState(EPICS[0].id);
  const [newPriority, setNewPriority] = useState<IssuePriority>('medium');
  const [newLabels, setNewLabels] = useState<IssueLabel[]>(['MVP']);
  const [newEstDays, setNewEstDays] = useState(1);

  // Stats calculation
  const totalDays = issues.reduce((acc, issue) => acc + issue.estimatedDays, 0);
  const completedIssues = issues.filter(i => i.status === 'done').length;
  const progressPercent = Math.round((completedIssues / issues.length) * 100) || 0;

  // Move status handler
  const handleMoveStatus = (id: string, currentStatus: IssueStatus, direction: 'forward' | 'backward') => {
    const order: IssueStatus[] = ['backlog', 'in-progress', 'review', 'done'];
    const currentIndex = order.indexOf(currentStatus);
    let nextIndex = direction === 'forward' ? currentIndex + 1 : currentIndex - 1;
    
    if (nextIndex >= 0 && nextIndex < order.length) {
      setIssues(prev => prev.map(issue => {
        if (issue.id === id) {
          return { ...issue, status: order[nextIndex] };
        }
        return issue;
      }));
    }
  };

  // Add custom issue
  const handleAddIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const added: GitHubIssue = {
      id: `issue-custom-${Date.now()}`,
      number: 400 + Math.floor(Math.random() * 100),
      title: newTitle,
      description: newDesc,
      epic: newEpic,
      status: 'backlog',
      priority: newPriority,
      labels: newLabels,
      estimatedDays: Number(newEstDays) || 1
    };

    setIssues(prev => [added, ...prev]);
    // Reset form
    setNewTitle('');
    setNewDesc('');
    setShowAddForm(false);
  };

  // Create or remove label in form checkboxes
  const toggleFormLabel = (lbl: IssueLabel) => {
    if (newLabels.includes(lbl)) {
      setNewLabels(prev => prev.filter(l => l !== lbl));
    } else {
      setNewLabels(prev => [...prev, lbl]);
    }
  };

  // Filtered issues
  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          issue.number.toString().includes(searchTerm);
    const matchesEpic = selectedEpic === 'all' || issue.epic === selectedEpic;
    const matchesLabel = selectedLabel === 'all' || issue.labels.includes(selectedLabel as IssueLabel);
    return matchesSearch && matchesEpic && matchesLabel;
  });

  // Columns data helpers
  const getLanes = (status: IssueStatus) => filteredIssues.filter(i => i.status === status);

  const getPriorityBadge = (p: IssuePriority) => {
    switch (p) {
      case 'high': return <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded uppercase"><Flame size={10} /> alta</span>;
      case 'medium': return <span className="flex items-center gap-1 text-[10px] font-bold text-yellow-600 bg-yellow-50 px-1.5 py-0.5 rounded uppercase"><AlertTriangle size={10} /> média</span>;
      case 'low': return <span className="flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded uppercase">baixa</span>;
    }
  };

  const getLabelColor = (lbl: IssueLabel) => {
    switch (lbl) {
      case 'MVP': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'accessibility': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'UX': return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'frontend': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'backend': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'bug': return 'bg-red-50 text-red-700 border-red-200';
      case 'enhancement': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    }
  };

  return (
    <div className="space-y-6" id="backlog-root">
      
      {/* Product backlog statistics ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-white p-4 rounded-xl border border-slate-200">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-slate-100 rounded-lg text-slate-600 shrink-0">
            <Github size={20} />
          </div>
          <div>
            <span className="text-xs text-slate-400 block uppercase font-bold">Resumo Geral</span>
            <span className="text-xl font-bold text-slate-800 font-mono">{issues.length} Issues</span>
          </div>
        </div>

        <div className="flex items-center gap-3 border-l border-slate-100 pl-4">
          <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600 shrink-0">
            <Check size={20} />
          </div>
          <div>
            <span className="text-xs text-slate-400 block uppercase font-bold">Status MVP</span>
            <span className="text-xl font-bold text-slate-800 font-mono">{progressPercent}% Concluída</span>
          </div>
        </div>

        <div className="flex items-center gap-3 border-l border-slate-100 pl-4">
          <div className="p-3 bg-purple-50 rounded-lg text-purple-600 shrink-0">
            <Calendar size={20} />
          </div>
          <div>
            <span className="text-xs text-slate-400 block uppercase font-bold">Investimento</span>
            <span className="text-xl font-bold text-slate-800 font-mono">{totalDays} Mandays</span>
          </div>
        </div>

        <div className="flex items-center gap-3 border-l border-slate-100 pl-4">
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full h-11 bg-emerald-600 text-white font-medium text-sm rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
            id="btn-trigger-add-issue"
          >
            <Plus size={16} />
            Criar Issue / Story
          </button>
        </div>
      </div>

      {/* FILTER & CONTROL PANEL */}
      <div className="bg-slate-100 p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-72">
          <Search size={16} className="absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Pesquisar por título / número..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg py-2 pl-9 pr-4 text-xs text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
            id="backlog-input-search"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto items-center justify-end">
          {/* Epic selection */}
          <div className="flex items-center gap-1 bg-white px-2.5 py-1 text-xs border border-slate-200 rounded-lg text-slate-600">
            <Layers size={12} className="text-slate-400" />
            <span className="font-medium mr-1">Épico:</span>
            <select
              value={selectedEpic}
              onChange={(e) => setSelectedEpic(e.target.value)}
              className="bg-transparent focus:outline-hidden font-bold text-slate-800"
              id="backlog-select-epic"
            >
              <option value="all">Ver Todos</option>
              {EPICS.map(epic => (
                <option key={epic.id} value={epic.id}>{epic.title}</option>
              ))}
            </select>
          </div>

          {/* Label selector */}
          <div className="flex items-center gap-1 bg-white px-2.5 py-1 text-xs border border-slate-200 rounded-lg text-slate-600">
            <Filter size={12} className="text-slate-400" />
            <span className="font-medium mr-1">Label:</span>
            <select
              value={selectedLabel}
              onChange={(e) => setSelectedLabel(e.target.value)}
              className="bg-transparent focus:outline-hidden font-bold text-slate-800"
              id="backlog-select-label"
            >
              <option value="all">Ver Todas</option>
              <option value="MVP">MVP</option>
              <option value="accessibility">Acessibilidade</option>
              <option value="UX">UX</option>
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="bug">Bug</option>
              <option value="enhancement">Melhoria</option>
            </select>
          </div>

          {/* Reset Filters */}
          {(searchTerm !== '' || selectedEpic !== 'all' || selectedLabel !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedEpic('all');
                setSelectedLabel('all');
              }}
              className="text-xs text-slate-500 hover:text-emerald-600 underline font-medium px-2 py-1"
              id="btn-reset-filters"
            >
              Limpar Filtros
            </button>
          )}
        </div>
      </div>

      {/* CREATE NEW ISSUE MODAL OVERLAY */}
      {showAddForm && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 w-full max-w-lg shadow-2xl relative animate-in fade-in-50 zoom-in-95 duration-150">
            <button
              onClick={() => setShowAddForm(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
              id="btn-close-add-form"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
              <PlusCircle className="text-emerald-500" />
              Criar Nova Issue (GitHub Tracker)
            </h3>

            <form onSubmit={handleAddIssue} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Título da Issue / User Story</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Como idoso quero poder acionar o som do botão"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700"
                  id="form-issue-title"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Critérios de Aceite & Descrição</label>
                <textarea
                  placeholder="Detalhamento técnico ou fluxos de usabilidade..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 h-20"
                  id="form-issue-desc"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1 font-mono">Associação ao Épico</label>
                  <select
                    value={newEpic}
                    onChange={(e) => setNewEpic(e.target.value)}
                    className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-700 bg-white"
                    id="form-issue-epic"
                  >
                    {EPICS.map(e => (
                      <option key={e.id} value={e.id}>{e.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1 font-mono">Estimativa (Man-Days)</label>
                  <input
                    type="number"
                    min="0.5"
                    max="10"
                    step="0.5"
                    required
                    value={newEstDays}
                    onChange={(e) => setNewEstDays(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-700"
                    id="form-issue-estdays"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1 font-mono">Prioridade do backlog</label>
                <div className="flex gap-2">
                  {(['low', 'medium', 'high'] as IssuePriority[]).map((pr) => (
                    <button
                      key={pr}
                      type="button"
                      onClick={() => setNewPriority(pr)}
                      className={`flex-1 py-1 rounded-lg text-xs font-semibold uppercase border transition-all ${
                        newPriority === pr
                          ? 'bg-slate-900 border-slate-900 text-white'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                      id={`form-issue-priority-${pr}`}
                    >
                      {pr === 'low' ? 'Baixa' : pr === 'medium' ? 'Média' : 'Alta'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1 font-mono">Labels (Multi-seleção)</label>
                <div className="flex flex-wrap gap-1.5">
                  {(['MVP', 'frontend', 'backend', 'accessibility', 'UX', 'bug', 'enhancement'] as IssueLabel[]).map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => toggleFormLabel(l)}
                      className={`px-2.5 py-1 border rounded-lg text-[10px] uppercase font-bold transition-all ${
                        newLabels.includes(l)
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                          : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                      }`}
                      id={`form-issue-label-${l}`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 text-white font-bold py-2.5 rounded-lg hover:bg-emerald-700 transition-colors mt-2 text-xs"
                id="btn-form-submit"
              >
                Injetar no Backlog
              </button>
            </form>
          </div>
        </div>
      )}

      {/* KANBAN BOARD INTERFACE */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-12 overflow-x-auto min-w-[700px] md:min-w-0" id="kanban-grid-parent">
        {/* State lanes mappings */}
        {(['backlog', 'in-progress', 'review', 'done'] as IssueStatus[]).map((laneKey) => {
          const laneIssues = getLanes(laneKey);
          let labelText = 'A Fazer';
          let headerColor = 'border-slate-300 text-slate-500';
          if (laneKey === 'in-progress') { 
            labelText = 'Em Progresso'; 
            headerColor = 'border-yellow-500 text-yellow-600 bg-yellow-50/70'; 
          }
          if (laneKey === 'review') { 
            labelText = 'Em Revisão'; 
            headerColor = 'border-blue-500 text-blue-600 bg-blue-50/70'; 
          }
          if (laneKey === 'done') { 
            labelText = 'Finalizado'; 
            headerColor = 'border-emerald-500 text-emerald-600 bg-emerald-50/70'; 
          }

          return (
            <div key={laneKey} className="bg-slate-100 rounded-xl p-3 border border-slate-200 flex flex-col min-h-[500px]">
              {/* Lane Header */}
              <div className={`p-2.5 rounded-lg border-l-3 border-y border-r border-slate-200 mb-3 flex justify-between items-center ${headerColor}`}>
                <span className="font-bold text-xs uppercase tracking-wide">{labelText}</span>
                <span className="text-[10px] font-bold bg-white-50/30 px-2 py-0.5 rounded-full font-mono">{laneIssues.length}</span>
              </div>

              {/* Lane Cards Wrapper */}
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[500px]">
                {laneIssues.length === 0 ? (
                  <div className="h-32 rounded-lg border border-dashed border-slate-300 flex flex-center text-center items-center justify-center p-4">
                    <span className="text-slate-400 text-xs font-sans">Sem tarefas nesta coluna</span>
                  </div>
                ) : (
                  laneIssues.map((issue) => (
                    <div 
                      key={issue.id} 
                      className="bg-white p-3.5 rounded-lg border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-sm transition-all space-y-2.5 relative group"
                      id={`kanban-card-${issue.id}`}
                    >
                      {/* Top labels and Priority */}
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-[9px] text-slate-400 font-mono font-bold block bg-slate-100 px-1.5 py-0.5 rounded">
                          #{issue.number}
                        </span>
                        {getPriorityBadge(issue.priority)}
                      </div>

                      {/* Card Content */}
                      <div>
                        <h4 className="text-[12px] font-bold text-slate-800 line-clamp-2 leading-tight">
                          {issue.title}
                        </h4>
                        <p className="text-[11px] text-slate-400 font-sans mt-1 line-clamp-2 leading-relaxed">
                          {issue.description}
                        </p>
                      </div>

                      {/* Card Footer tags and moving controls */}
                      <div className="flex flex-wrap gap-1">
                        {issue.labels.map(l => (
                          <span 
                            key={l} 
                            className={`px-1.5 py-0.2 md:py-0.5 rounded text-[8px] uppercase font-bold border ${getLabelColor(l)}`}
                          >
                            {l}
                          </span>
                        ))}
                      </div>

                      <div className="border-t border-slate-100 pt-2.5 flex justify-between items-center">
                        <div className="flex items-center gap-1.5">
                          <TrendingUp size={11} className="text-slate-400" />
                          <span className="text-[9px] text-slate-500 font-bold font-mono">
                            {issue.estimatedDays} man-day{issue.estimatedDays > 1 ? 's' : ''}
                          </span>
                        </div>

                        {/* Interactive flow controller inside card */}
                        <div className="flex gap-1">
                          {laneKey !== 'backlog' && (
                            <button
                              onClick={() => handleMoveStatus(issue.id, laneKey, 'backward')}
                              title="Mover para esquerda"
                              className="p-1 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded cursor-pointer"
                              id={`btn-move-left-${issue.id}`}
                            >
                              &larr;
                            </button>
                          )}
                          {laneKey !== 'done' && (
                            <button
                              onClick={() => handleMoveStatus(issue.id, laneKey, 'forward')}
                              title="Mover para direita"
                              className="p-1 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded cursor-pointer flex items-center justify-center"
                              id={`btn-move-right-${issue.id}`}
                            >
                              <ChevronRight size={10} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
