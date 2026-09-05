import React, { useState } from 'react';
import {
  FileText, Pill, CheckSquare, Heart, Sparkles, Send, Copy,
  CheckCircle2, Eye, EyeOff, Loader2, ShieldCheck
} from 'lucide-react';
import { DischargeSummary } from '../types/clinical';
import { MedicalEdnTab } from './tabs/MedicalEdnTab';
import { MedRecTab } from './tabs/MedRecTab';
import { GpActionTab } from './tabs/GpActionTab';
import { PatientLeafletTab } from './tabs/PatientLeafletTab';
import { EhrExportModal } from './modals/EhrExportModal';
import { DispatchSuccessModal } from './modals/DispatchSuccessModal';

interface SynthesizerCockpitProps {
  summary: DischargeSummary;
  onUpdateSummary: (updated: DischargeSummary) => void;
  isSynthesizing: boolean;
  synthesisStep: number;
  onCitationClick: (citationId: string) => void;
}

export const SynthesizerCockpit: React.FC<SynthesizerCockpitProps> = ({
  summary,
  onUpdateSummary,
  isSynthesizing,
  synthesisStep,
  onCitationClick,
}) => {
  const [activeTab, setActiveTab] = useState<'medical' | 'medrec' | 'gpaction' | 'patient'>('medical');
  const [showCitations, setShowCitations] = useState(true);
  const [isEhrModalOpen, setIsEhrModalOpen] = useState(false);
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);

  const synthesisSteps = [
    'Parsing multi-day ward round notes, nurse logs & lab results...',
    'Reconciling pre-admission drugs against inpatient TTO changes...',
    'Cross-referencing NICE guidelines & SNOMED CT terminology...',
    'Formulating PRSB Electronic Discharge Notification & Patient Leaflet...',
  ];

  const handleToggleGpAction = (actionId: string) => {
    const newActions = summary.gpActions.map((a) =>
      a.id === actionId ? { ...a, completed: !a.completed } : a
    );
    onUpdateSummary({ ...summary, gpActions: newActions });
  };

  return (
    <div className="h-full min-h-0 flex flex-col space-y-4">
      {/* Static Top Section: Command Bar + Tabs Bar (Never scrolls away) */}
      <div className="flex-shrink-0 space-y-3">
        {/* Top Command Bar (Liquid Glass) */}
        <div className="liquid-glass-card rounded-2xl p-5 border border-white/80 flex flex-wrap items-center justify-between gap-4">
          {/* Left: Status Badge & Citations Toggle */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg liquid-glass-badge bg-emerald-50/70 border border-emerald-300/80 text-xs shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0" />
              <div className="flex items-center space-x-1.5 font-medium">
                <span className="font-semibold text-slate-900 tracking-tight">NHS eDN</span>
                <span className="text-slate-300">|</span>
                <span className="text-emerald-800 font-semibold">Verified Draft</span>
              </div>
            </div>

            <button
              onClick={() => setShowCitations(!showCitations)}
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${showCitations
                  ? 'liquid-glass-badge bg-blue-50/80 text-blue-900 border border-blue-200/90 shadow-xs'
                  : 'liquid-glass-subtle text-slate-600 border border-white/80 hover:bg-white/90'
                }`}
              title="Toggle source reference citations"
            >
              {showCitations ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>Source Citations: <strong className={showCitations ? 'text-blue-900' : 'text-slate-500'}>{showCitations ? 'ON' : 'OFF'}</strong></span>
            </button>
          </div>

          {/* Right: Actions (Copy to EHR & Sign Off) */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsEhrModalOpen(true)}
              className="liquid-glass-button inline-flex items-center space-x-2 px-4 py-2 rounded-xl border border-white/80 text-slate-700 text-xs font-medium shadow-xs transition-colors"
            >
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span>Copy to EHR</span>
            </button>

            <button
              onClick={() => setIsDispatchModalOpen(true)}
              className="inline-flex items-center space-x-2 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-semibold shadow-md shadow-emerald-600/25 hover:shadow-lg hover:shadow-emerald-600/35 border border-white/20 transition-all active:scale-98"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Sign Off & Dispatch</span>
            </button>
          </div>
        </div>

        {/* Segmented Tabs Bar (Liquid Glass) */}
        {!isSynthesizing && (
          <div className="liquid-glass-subtle p-1.5 rounded-xl flex flex-wrap items-center gap-1.5 border border-white/80 shadow-xs">
            <button
              onClick={() => setActiveTab('medical')}
              className={`flex items-center space-x-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${activeTab === 'medical'
                  ? 'liquid-glass text-blue-700 shadow-xs border border-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
            >
              <FileText className="w-4 h-4" />
              <span>1. Medical eDN (PRSB)</span>
            </button>

            <button
              onClick={() => setActiveTab('medrec')}
              className={`flex items-center space-x-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${activeTab === 'medrec'
                  ? 'liquid-glass text-blue-700 shadow-xs border border-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
            >
              <Pill className="w-4 h-4 text-amber-600" />
              <span>2. Med Reconciliation ({summary.medications.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('gpaction')}
              className={`flex items-center space-x-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${activeTab === 'gpaction'
                  ? 'liquid-glass text-blue-700 shadow-xs border border-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
            >
              <CheckSquare className="w-4 h-4 text-emerald-600" />
              <span>3. GP Action Plan ({summary.gpActions.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('patient')}
              className={`flex items-center space-x-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${activeTab === 'patient'
                  ? 'liquid-glass text-blue-700 shadow-xs border border-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
            >
              <Heart className="w-4 h-4 text-rose-500" />
              <span>4. Patient Leaflet</span>
            </button>
          </div>
        )}
      </div>

      {/* Part Underneath: Independently Scrollable Active Tab Content */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-1 pb-16 space-y-4 custom-scrollbar">
        {isSynthesizing ? (
          <div className="liquid-glass-card rounded-2xl border border-white/80 p-10 text-center animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-blue-50/80 border border-blue-200/80 text-blue-600 flex items-center justify-center mx-auto mb-4 shadow-xs">
              <Loader2 className="w-7 h-7 animate-spin" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 tracking-tight">
              Synthesizing Clinical Discharge Package...
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Extracting observations, cross-referencing timeline evidence, and constructing structured PRSB sections.
            </p>

            <div className="max-w-xl mx-auto mt-6 space-y-3 text-left">
              {synthesisSteps.map((step, idx) => {
                const isDone = synthesisStep > idx;
                const isCurrent = synthesisStep === idx;

                return (
                  <div
                    key={idx}
                    className={`flex items-center space-x-3 p-3.5 rounded-xl border text-xs transition-all ${isDone
                        ? 'bg-emerald-50/60 border-emerald-200/80 text-emerald-800 font-medium'
                        : isCurrent
                          ? 'liquid-glass-badge bg-blue-50/80 border-blue-200 text-blue-900 font-semibold shadow-xs'
                          : 'bg-white/40 border-slate-200/60 text-slate-400'
                      }`}
                  >
                    <div className="flex-shrink-0">
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : isCurrent ? (
                        <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[10px] text-slate-400">
                          {idx + 1}
                        </div>
                      )}
                    </div>
                    <span className="truncate">{step}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Active Tab Panel with Liquid Glass */
          <div className="liquid-glass-card rounded-2xl border border-white/80 p-6 lg:p-8">
            {activeTab === 'medical' && (
              <MedicalEdnTab
                summary={summary}
                onUpdateSummary={onUpdateSummary}
                onCitationClick={onCitationClick}
                showCitations={showCitations}
              />
            )}

            {activeTab === 'medrec' && (
              <MedRecTab
                medications={summary.medications}
                onCitationClick={onCitationClick}
                showCitations={showCitations}
              />
            )}

            {activeTab === 'gpaction' && (
              <GpActionTab
                actions={summary.gpActions}
                onToggleAction={handleToggleGpAction}
                onCitationClick={onCitationClick}
                showCitations={showCitations}
              />
            )}

            {activeTab === 'patient' && (
              <PatientLeafletTab
                leaflet={summary.patientLeaflet}
                patientName="Arthur Pendelton"
              />
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <EhrExportModal
        isOpen={isEhrModalOpen}
        onClose={() => setIsEhrModalOpen(false)}
        summary={summary}
      />

      <DispatchSuccessModal
        isOpen={isDispatchModalOpen}
        onClose={() => setIsDispatchModalOpen(false)}
        patient={{ name: 'Arthur Pendelton', nhsNumber: '943 201 8842', ward: 'Acute Frailty Ward 4' }}
      />
    </div>
  );
};
