import React from 'react';
import { Sparkles, RotateCcw, Activity, Building2, UserCheck, Search, ChevronDown, Presentation } from 'lucide-react';
import { ClinicalCase } from '../types/clinical';

interface HeaderProps {
  cases: ClinicalCase[];
  selectedCaseId: string;
  onSelectCase: (caseId: string) => void;
  onSynthesize: () => void;
  onReset: () => void;
  isSynthesizing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  cases,
  selectedCaseId,
  onSelectCase,
  onSynthesize,
  onReset,
  isSynthesizing,
}) => {
  const currentCase = cases.find((c) => c.id === selectedCaseId) || cases[0];

  return (
    <header className="sticky top-0 z-40 liquid-glass-header flex-shrink-0">
      <div className="w-full px-6 lg:px-10 xl:px-12 h-16 flex items-center justify-between gap-4">
        {/* Left: Minimalist Product Title with Liquid Glass Icon */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25 border border-white/20">
            <Activity className="w-5 h-5" />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-lg font-semibold text-slate-900 tracking-tight">Tandem</span>
            <span className="text-lg font-normal text-slate-500">Discharge</span>
          </div>
        </div>

        {/* Center: Case Switcher (Liquid Glass Refraction) */}
        <div className="flex-1 max-w-lg mx-4 hidden md:block">
          <div className="relative flex items-center liquid-glass-subtle hover:bg-white/90 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/30 focus-within:border-blue-500 border border-white/80 rounded-xl px-4 py-2 transition-all shadow-xs">
            <Search className="w-4 h-4 text-slate-500 mr-2.5 flex-shrink-0" />
            <select
              value={selectedCaseId}
              onChange={(e) => onSelectCase(e.target.value)}
              className="w-full bg-transparent text-sm font-medium text-slate-800 focus:outline-none cursor-pointer appearance-none pr-6"
              aria-label="Select Patient Case"
            >
              {cases.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.patient.name} — {c.specialty} ({c.patient.ward})
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 pointer-events-none" />
          </div>
        </div>

        {/* Right: Clinician Info & Actions */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          {/* Mobile Case Switcher */}
          <div className="md:hidden">
            <select
              value={selectedCaseId}
              onChange={(e) => onSelectCase(e.target.value)}
              className="text-xs font-medium liquid-glass-subtle text-slate-800 border border-white/80 rounded-xl px-3 py-1.5 focus:outline-none"
            >
              {cases.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.patient.name}
                </option>
              ))}
            </select>
          </div>

          {/* Specialty Tag */}
          <div className="hidden xl:inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg liquid-glass-badge bg-white/70 border border-white/80 text-xs font-medium text-slate-700">
            <Building2 className="w-3.5 h-3.5 text-blue-600" />
            <span>{currentCase.specialty}</span>
          </div>

          {/* Consultant Tag */}
          <div className="hidden lg:inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg liquid-glass-badge bg-white/70 border border-white/80 text-xs font-medium text-slate-700">
            <UserCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>{currentCase.patient.consultant}</span>
          </div>

          {/* Executive Pitch Deck */}
          <a
            href="/presentation.html"
            target="_blank"
            rel="noopener noreferrer"
            title="Launch Executive Pitch Deck"
            className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl liquid-glass-button text-xs font-semibold text-teal-800 hover:text-teal-950 bg-teal-500/10 hover:bg-teal-500/15 border border-teal-600/30 transition-all shadow-xs"
          >
            <Presentation className="w-3.5 h-3.5 text-teal-700" />
            <span>Pitch Deck</span>
          </a>

          {/* Reset Button */}
          <button
            onClick={onReset}
            title="Reset case data to initial state"
            className="liquid-glass-button p-2 text-slate-600 hover:text-slate-900 rounded-xl border border-white/80 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Synthesis CTA Button with Liquid Specular Glow */}
          <button
            onClick={onSynthesize}
            disabled={isSynthesizing}
            className="inline-flex items-center space-x-2 px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/35 border border-white/20 transition-all active:scale-98 disabled:opacity-50 disabled:pointer-events-none"
          >
            <Sparkles className={`w-4 h-4 ${isSynthesizing ? 'animate-spin' : ''}`} />
            <span>Re-Synthesize</span>
          </button>
        </div>
      </div>
    </header>
  );
};
