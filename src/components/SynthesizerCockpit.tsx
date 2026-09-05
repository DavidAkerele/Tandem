import React, { useState } from 'react';
import {
  FileText, Pill, Heart, Sparkles, Send, Copy,
  CheckCircle2, Eye, EyeOff, Loader2, ShieldCheck,
  Layers, ClipboardCheck, Stethoscope, Hospital, AlertTriangle, ShieldAlert
} from 'lucide-react';
import { DischargeSummary, PreConsultBriefing, RecordSummary, CareSetting, DataContradiction, AuditTrailEntry } from '../types/clinical';
import { PreConsultBriefingTab } from './tabs/PreConsultBriefingTab';
import { RecordSummaryTab } from './tabs/RecordSummaryTab';
import { MedicalEdnTab } from './tabs/MedicalEdnTab';
import { MedRecTab } from './tabs/MedRecTab';
import { PatientLeafletTab } from './tabs/PatientLeafletTab';
import { EhrExportModal } from './modals/EhrExportModal';
import { DispatchSuccessModal } from './modals/DispatchSuccessModal';
import { ClinicalSafetyAlertBanner } from './ClinicalSafetyAlertBanner';
import { ContradictionResolutionModal } from './modals/ContradictionResolutionModal';

interface SynthesizerCockpitProps {
  summary: DischargeSummary;
  briefing: PreConsultBriefing;
  recordSummary: RecordSummary;
  careSetting: CareSetting;
  contradictions?: DataContradiction[];
  auditTrail?: AuditTrailEntry[];
  onUpdateSummary: (updated: DischargeSummary) => void;
  onResolveContradiction?: (contradictionId: string, resolutionId: string, notes?: string) => void;
  onResolveAllContradictions?: () => void;
  isSynthesizing: boolean;
  synthesisStep: number;
  onCitationClick: (citationId: string) => void;
  onJumpToTimelineEvent?: (eventId: string) => void;
  isContradictionModalOpen?: boolean;
  onToggleContradictionModal?: (open: boolean) => void;
}

export const SynthesizerCockpit: React.FC<SynthesizerCockpitProps> = ({
  summary,
  briefing,
  recordSummary,
  careSetting,
  contradictions,
  auditTrail,
  onUpdateSummary,
  onResolveContradiction,
  onResolveAllContradictions,
  isSynthesizing,
  synthesisStep,
  onCitationClick,
  onJumpToTimelineEvent,
  isContradictionModalOpen,
  onToggleContradictionModal,
}) => {
  const [activeTab, setActiveTab] = useState<'preconsult' | 'record' | 'medrec' | 'medical' | 'patient'>('preconsult');
  const [showCitations, setShowCitations] = useState(true);
  const [isEhrModalOpen, setIsEhrModalOpen] = useState(false);
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [internalModalOpen, setInternalModalOpen] = useState(false);

  const isConflictModalOpen = isContradictionModalOpen !== undefined ? isContradictionModalOpen : internalModalOpen;
  const setIsConflictModalOpen = (open: boolean) => {
    if (onToggleContradictionModal) onToggleContradictionModal(open);
    setInternalModalOpen(open);
  };

  const unresolvedContradictions = (contradictions || []).filter((c) => !c.isResolved);
  const hasUnresolvedContradictions = unresolvedContradictions.length > 0;

  const isPrimaryCare = careSetting === 'primary_care';

  const synthesisSteps = isPrimaryCare
    ? [
        'Parsing longitudinal EMIS/SystmOne record, consultation notes & pathology labs...',
        'Screening QOF chronic disease registers & checking overdue preventative screenings...',
        'Cross-referencing NICE NG28/CG173 guidelines & evaluating anticholinergic burden...',
        'Synthesizing 30-second Pre-Consultation Briefing, Systems Summary & Management Plan...',
      ]
    : [
        'Parsing multi-day ward round notes, nurse logs & lab results...',
        'Reconciling pre-admission drugs against inpatient TTO changes...',
        'Cross-referencing NICE guidelines & SNOMED CT terminology...',
        'Formulating PRSB Electronic Discharge Notification & Patient Leaflet...',
      ];

  return (
    <div className="h-full min-h-0 flex flex-col space-y-3.5">
      {/* Static Top Section: Command Bar + Tabs Bar */}
      <div className="flex-shrink-0 space-y-2">
        {/* Top Command Bar */}
        <div className="bg-white rounded-xl p-3 border border-[#dadce0] shadow-xs flex flex-wrap items-center justify-between gap-3">
          {/* Left: Status & Citations Toggle */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-2 text-xs text-[#3c4043]">
              <span className="w-2 h-2 rounded-full bg-[#137333]" />
              <span className="font-medium text-[#202124]">
                {isPrimaryCare ? summary.patient.systemOrigin : 'NHS eDN'}
              </span>
              <span className="text-[#dadce0]">|</span>
              <span className="text-[#5f6368]">
                {isPrimaryCare ? 'Verified EHR Record' : 'Verified Clinical Draft'}
              </span>
            </div>

            <button
              onClick={() => setShowCitations(!showCitations)}
              className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                showCitations
                  ? 'bg-[#f1f3f4] text-[#1a73e8] border-[#dadce0]'
                  : 'bg-white text-[#5f6368] border-[#dadce0] hover:bg-[#f1f3f4]'
              }`}
              title="Toggle source reference citations"
            >
              <span>Source Citations: {showCitations ? 'ON' : 'OFF'}</span>
            </button>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsEhrModalOpen(true)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-[#dadce0] text-[#3c4043] hover:bg-[#f1f3f4] text-xs font-medium transition-colors"
            >
              <Copy className="w-3.5 h-3.5 text-[#5f6368]" />
              <span>Copy to EHR</span>
            </button>

            {hasUnresolvedContradictions ? (
              <button
                onClick={() => setIsConflictModalOpen(true)}
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-[#d93025] hover:bg-[#b3261e] text-white text-xs font-medium transition-colors shadow-xs cursor-pointer"
                title="Clinical Safety Gate: Must resolve cross-record contradictions before signing off"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Safety Locked ({unresolvedContradictions.length})</span>
              </button>
            ) : (
              <button
                onClick={() => setIsDispatchModalOpen(true)}
                className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-lg bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-medium transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isPrimaryCare ? 'Sign Off & Save' : 'Sign Off & Dispatch'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Clinical Safety & Contradiction Alert Banner */}
        {contradictions && contradictions.length > 0 && (
          <ClinicalSafetyAlertBanner
            contradictions={contradictions}
            onOpenReviewModal={() => setIsConflictModalOpen(true)}
          />
        )}

        {/* Google-Style 5-Tab Segmented Navigation Bar */}
        {!isSynthesizing && (
          <div className="bg-white p-1 rounded-xl flex items-center gap-1 border border-[#dadce0] shadow-xs overflow-x-auto">
            <button
              onClick={() => setActiveTab('preconsult')}
              className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'preconsult'
                  ? 'bg-[#202124] text-white'
                  : 'text-[#5f6368] hover:text-[#202124] hover:bg-[#f1f3f4]'
              }`}
            >
              1. {isPrimaryCare ? 'GP Pre-Consult Brief' : 'Ward Round Brief'}
            </button>

            <button
              onClick={() => setActiveTab('record')}
              className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'record'
                  ? 'bg-[#202124] text-white'
                  : 'text-[#5f6368] hover:text-[#202124] hover:bg-[#f1f3f4]'
              }`}
            >
              2. Record Summary
            </button>

            <button
              onClick={() => setActiveTab('medrec')}
              className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'medrec'
                  ? 'bg-[#202124] text-white'
                  : 'text-[#5f6368] hover:text-[#202124] hover:bg-[#f1f3f4]'
              }`}
            >
              3. Med Reconciliation ({summary.medications.length})
            </button>

            <button
              onClick={() => setActiveTab('medical')}
              className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'medical'
                  ? 'bg-[#202124] text-white'
                  : 'text-[#5f6368] hover:text-[#202124] hover:bg-[#f1f3f4]'
              }`}
            >
              {isPrimaryCare ? '4. Consultation Note' : '4. Medical eDN'}
            </button>

            <button
              onClick={() => setActiveTab('patient')}
              className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'patient'
                  ? 'bg-[#202124] text-white'
                  : 'text-[#5f6368] hover:text-[#202124] hover:bg-[#f1f3f4]'
              }`}
            >
              5. Patient Guidance
            </button>
          </div>
        )}
      </div>

      {/* Part Underneath: Independently Scrollable Active Tab Content */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-1 pb-16 space-y-4 custom-scrollbar">
        {isSynthesizing ? (
          <div className="bg-white rounded-xl border border-[#dadce0] p-10 text-center animate-fade-in shadow-xs">
            <div className="w-14 h-14 rounded-xl bg-[#e8f0fe] border border-[#d2e3fc] text-[#1a73e8] flex items-center justify-center mx-auto mb-4">
              <Loader2 className="w-7 h-7 animate-spin" />
            </div>
            <h3 className="text-base font-semibold text-[#202124] tracking-tight">
              {isPrimaryCare
                ? 'Synthesizing Primary Care Clinical Intelligence...'
                : 'Synthesizing Clinical Discharge Package...'}
            </h3>
            <p className="text-xs text-[#5f6368] mt-1 max-w-md mx-auto">
              Extracting observations, cross-referencing timeline evidence, and formulating structured clinical insights.
            </p>

            <div className="max-w-xl mx-auto mt-6 space-y-3 text-left">
              {synthesisSteps.map((step, idx) => {
                const isDone = synthesisStep > idx;
                const isCurrent = synthesisStep === idx;

                return (
                  <div
                    key={idx}
                    className={`flex items-center space-x-3 p-3 rounded-lg border text-xs transition-all ${
                      isDone
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-medium'
                        : isCurrent
                          ? 'bg-[#e8f0fe] border-[#d2e3fc] text-[#1a73e8] font-semibold shadow-xs'
                          : 'bg-[#f8f9fa] border-[#dadce0] text-[#5f6368]'
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : isCurrent ? (
                        <Loader2 className="w-4 h-4 animate-spin text-[#1a73e8]" />
                      ) : (
                        <div className="w-4 h-4 rounded border border-[#dadce0] flex items-center justify-center text-[10px] text-[#5f6368]">
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
          /* Active Tab Panel */
          <div className="bg-white rounded-xl border border-[#dadce0] p-5 lg:p-7 shadow-xs">
            {activeTab === 'preconsult' && (
              <PreConsultBriefingTab
                briefing={briefing}
                careSetting={careSetting}
                onCitationClick={onCitationClick}
                showCitations={showCitations}
              />
            )}

            {activeTab === 'record' && (
              <RecordSummaryTab
                recordSummary={recordSummary}
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

            {activeTab === 'medical' && (
              <MedicalEdnTab
                summary={summary}
                onUpdateSummary={onUpdateSummary}
                onCitationClick={onCitationClick}
                showCitations={showCitations}
              />
            )}

            {activeTab === 'patient' && (
              <PatientLeafletTab
                leaflet={summary.patientLeaflet}
                patientName={summary.patient.name}
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
        patient={{
          name: summary.patient.name,
          nhsNumber: summary.patient.nhsNumber,
          ward: summary.patient.practiceOrHospital,
          bed: summary.patient.bed,
          consultant: summary.patient.consultant,
        }}
      />

      <ContradictionResolutionModal
        isOpen={isConflictModalOpen}
        onClose={() => setIsConflictModalOpen(false)}
        contradictions={contradictions || []}
        auditTrail={auditTrail}
        onResolveContradiction={(id, resId, notes) => {
          if (onResolveContradiction) onResolveContradiction(id, resId, notes);
        }}
        onResolveAll={() => {
          if (onResolveAllContradictions) onResolveAllContradictions();
        }}
        onJumpToTimelineEvent={onJumpToTimelineEvent || onCitationClick}
      />
    </div>
  );
};
