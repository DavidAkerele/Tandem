import React from 'react';
import {
  Sparkles, RotateCcw, Activity, Building2, UserCheck, Search,
  ChevronDown, Stethoscope, Hospital
} from 'lucide-react';
import { ClinicalCase, CareSetting } from '../types/clinical';

interface HeaderProps {
  cases: ClinicalCase[];
  selectedCaseId: string;
  selectedCareSetting: 'all' | CareSetting;
  onSelectCase: (caseId: string) => void;
  onSelectCareSetting: (setting: 'all' | CareSetting) => void;
  onSynthesize: () => void;
  onReset: () => void;
  isSynthesizing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  cases,
  selectedCaseId,
  selectedCareSetting,
  onSelectCase,
  onSelectCareSetting,
  onSynthesize,
  onReset,
  isSynthesizing,
}) => {
  const currentCase = cases.find((c) => c.id === selectedCaseId) || cases[0];

  // Filter available cases based on care setting toggle
  const filteredCases = cases.filter((c) => {
    if (selectedCareSetting === 'all') return true;
    return c.careSetting === selectedCareSetting;
  });

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#dadce0] flex-shrink-0">
      <div className="w-full px-4 lg:px-8 xl:px-12 h-16 flex items-center justify-between gap-3">
        {/* Left: ClinBrief Brand Logo */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          <img
            src={`${(import.meta.env.BASE_URL || '/').replace(/\/$/, '')}/clinbrief_logo_blue.png`}
            alt="ClinBrief Logo"
            className="h-10 sm:h-11 md:h-12 w-auto object-contain cursor-pointer"
          />
        </div>

        {/* Center: Care Setting Switcher & Case Selector */}
        <div className="flex-1 max-w-2xl mx-2 hidden md:flex items-center space-x-2.5">
          {/* Care Setting Segmented Filter */}
          <div className="bg-[#f1f3f4] p-1 rounded-lg flex items-center gap-1 border border-[#dadce0] flex-shrink-0">
            <button
              onClick={() => onSelectCareSetting('all')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                selectedCareSetting === 'all'
                  ? 'bg-white text-[#202124] shadow-xs border border-[#dadce0]'
                  : 'text-[#5f6368] hover:text-[#202124]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => onSelectCareSetting('primary_care')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors flex items-center space-x-1.5 ${
                selectedCareSetting === 'primary_care'
                  ? 'bg-white text-[#202124] shadow-xs border border-[#dadce0]'
                  : 'text-[#5f6368] hover:text-[#202124]'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5 text-[#5f6368]" />
              <span>GP / Primary Care</span>
            </button>
            <button
              onClick={() => onSelectCareSetting('secondary_care')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors flex items-center space-x-1.5 ${
                selectedCareSetting === 'secondary_care'
                  ? 'bg-white text-[#202124] shadow-xs border border-[#dadce0]'
                  : 'text-[#5f6368] hover:text-[#202124]'
              }`}
            >
              <Hospital className="w-3.5 h-3.5 text-[#5f6368]" />
              <span>Hospital Acute</span>
            </button>
          </div>

          {/* Patient Case Dropdown */}
          <div className="relative flex-1 flex items-center bg-[#f1f3f4] hover:bg-[#e8eaed] focus-within:bg-white focus-within:ring-1 focus-within:ring-[#1a73e8] focus-within:border-[#1a73e8] border border-[#dadce0] rounded-lg px-3 py-1.5 transition-all">
            <Search className="w-3.5 h-3.5 text-[#5f6368] mr-2 flex-shrink-0" />
            <select
              value={selectedCaseId}
              onChange={(e) => onSelectCase(e.target.value)}
              className="w-full bg-transparent text-xs font-medium text-[#202124] focus:outline-none cursor-pointer appearance-none pr-6"
              aria-label="Select Patient Case"
            >
              {filteredCases.map((c) => {
                const hasConflict = c.dataContradictions && c.dataContradictions.some((x) => !x.isResolved);
                return (
                  <option key={c.id} value={c.id}>
                    {hasConflict
                      ? '⚠️ [SAFETY CONFLICT] '
                      : c.careSetting === 'primary_care'
                      ? '[GP] '
                      : '[Hospital] '}
                    {c.patient.name} — {c.subtitle}
                  </option>
                );
              })}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#5f6368] absolute right-3 pointer-events-none" />
          </div>
        </div>

        {/* Right: Clinician Info & Actions */}
        <div className="flex items-center space-x-2.5 flex-shrink-0">
          {/* Mobile Case Switcher */}
          <div className="md:hidden">
            <select
              value={selectedCaseId}
              onChange={(e) => onSelectCase(e.target.value)}
              className="text-xs font-medium bg-[#f1f3f4] text-[#202124] border border-[#dadce0] rounded-lg px-2.5 py-1.5 focus:outline-none"
            >
              {cases.map((c) => {
                const hasConflict = c.dataContradictions && c.dataContradictions.some((x) => !x.isResolved);
                return (
                  <option key={c.id} value={c.id}>
                    {hasConflict ? '⚠️ [SAFETY] ' : ''}
                    {c.patient.name}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Facility / Origin Badge */}
          <div className="hidden xl:inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-[#f1f3f4] border border-[#dadce0] text-xs font-medium text-[#3c4043]">
            <Building2 className="w-3.5 h-3.5 text-[#5f6368]" />
            <span>{currentCase.patient.systemOrigin}</span>
          </div>

          {/* Clinician Tag */}
          <div className="hidden lg:inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-[#f1f3f4] border border-[#dadce0] text-xs font-medium text-[#202124]">
            <UserCheck className="w-3.5 h-3.5 text-[#5f6368] flex-shrink-0" />
            <span className="whitespace-nowrap font-medium">{currentCase.patient.consultant}</span>
          </div>

          {/* Reset Button */}
          <button
            onClick={onReset}
            title="Reset case data to initial state"
            className="p-2 text-[#5f6368] hover:text-[#202124] hover:bg-[#f1f3f4] rounded-lg border border-[#dadce0] transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Synthesis CTA Button */}
          <button
            onClick={onSynthesize}
            disabled={isSynthesizing}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs sm:text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none"
          >
            <Sparkles className={`w-4 h-4 ${isSynthesizing ? 'animate-spin' : ''}`} />
            <span>Re-Synthesize</span>
          </button>
        </div>
      </div>
    </header>
  );
};
