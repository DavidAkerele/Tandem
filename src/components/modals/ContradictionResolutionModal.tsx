import React, { useState } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  X,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  FileWarning,
  Stethoscope,
  Server,
  UserCheck,
  Cpu,
  Terminal,
  Sparkles,
  ClipboardList,
  MessageSquare,
  History,
  Edit3,
} from 'lucide-react';
import { DataContradiction, AuditTrailEntry } from '../../types/clinical';

interface ContradictionResolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  contradictions: DataContradiction[];
  auditTrail?: AuditTrailEntry[];
  initialView?: 'review' | 'audit_log';
  onResolveContradiction: (
    contradictionId: string,
    resolutionId: string,
    notes?: string
  ) => void;
  onResolveAll: () => void;
  onJumpToTimelineEvent?: (eventId: string) => void;
}

export const ContradictionResolutionModal: React.FC<ContradictionResolutionModalProps> = ({
  isOpen,
  onClose,
  contradictions,
  auditTrail = [],
  initialView,
  onResolveContradiction,
  onResolveAll,
  onJumpToTimelineEvent,
}) => {
  const unresolvedCount = contradictions.filter((c) => !c.isResolved).length;
  const isAllResolved = unresolvedCount === 0;

  const [modalView, setModalView] = useState<'review' | 'audit_log'>(
    initialView || (isAllResolved ? 'audit_log' : 'review')
  );
  const [selectedContradictionIndex, setSelectedContradictionIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState<'all' | 'system' | 'human' | 'hallucination'>('all');
  const [customNotes, setCustomNotes] = useState<Record<string, string>>({});
  const [editingAuditId, setEditingAuditId] = useState<string | null>(null);
  const [editingAuditText, setEditingAuditText] = useState<string>('');

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    contradictions.forEach((c) => {
      const rec = c.resolutionOptions.find((o) => o.isRecommended);
      initial[c.id] = rec ? rec.id : c.resolutionOptions[0]?.id || '';
    });
    return initial;
  });

  if (!isOpen) return null;

  // Filter contradictions by category in review mode
  const filteredContradictions = contradictions.filter((c) => {
    if (activeFilter === 'system') {
      return c.errorOrigin === 'system_error' || c.systemError !== undefined;
    }
    if (activeFilter === 'human') {
      return c.errorOrigin === 'human_error' || c.humanError !== undefined;
    }
    if (activeFilter === 'hallucination') {
      return c.errorOrigin === 'ai_hallucination' || c.aiHallucination !== undefined;
    }
    return true;
  });

  const currentConflict =
    filteredContradictions[selectedContradictionIndex] ||
    filteredContradictions[0] ||
    contradictions[0];

  const systemErrorsTotal = contradictions.filter(
    (c) => c.errorOrigin === 'system_error' || c.systemError !== undefined
  ).length;
  const humanErrorsTotal = contradictions.filter(
    (c) => c.errorOrigin === 'human_error' || c.humanError !== undefined
  ).length;
  const aiHallucinationsTotal = contradictions.filter(
    (c) => c.errorOrigin === 'ai_hallucination' || c.aiHallucination !== undefined
  ).length;

  const resolvedContradictions = contradictions.filter((c) => c.isResolved);

  const handleSelectOption = (conflictId: string, optionId: string) => {
    setSelectedOptions((prev) => ({ ...prev, [conflictId]: optionId }));
  };

  const handleApplyResolution = (conflictId: string) => {
    const chosenOption = selectedOptions[conflictId];
    const notes = customNotes[conflictId];
    onResolveContradiction(conflictId, chosenOption, notes);

    // Advance to next unresolved conflict if available
    const nextUnresolvedIdx = filteredContradictions.findIndex(
      (c, idx) => idx > selectedContradictionIndex && !c.isResolved
    );
    if (nextUnresolvedIdx !== -1) {
      setSelectedContradictionIndex(nextUnresolvedIdx);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-5xl w-full border border-[#dadce0] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#dadce0] flex items-center justify-between bg-[#f8f9fa]">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 ${
              isAllResolved
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}>
              {isAllResolved ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <h2 className="text-base font-bold text-[#202124]">
                  Clinical Safety &amp; Contradiction Resolution Engine
                </h2>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${
                  isAllResolved
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-200'
                    : 'bg-red-100 text-red-800 border-red-200'
                }`}>
                  {unresolvedCount > 0 ? `${unresolvedCount} Active Conflict${unresolvedCount !== 1 ? 's' : ''} Pending` : 'All Conflicts Reconciled'}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#202124] text-white">
                  NHS DCB0129 / DCB0160 Compliant
                </span>
              </div>
              <p className="text-xs text-[#5f6368] mt-0.5">
                Human-in-the-Loop Sovereign Gate: Reconciles hardware/telemetry transit bugs, clinician slips &amp; AI hallucinations before electronic discharge sign-off.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#5f6368] hover:text-[#202124] hover:bg-[#e8eaed] transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary View Switcher: Review Active Conflicts vs. Safety Audit Trail & Comments Log */}
        <div className="px-6 py-2 bg-white border-b border-[#dadce0] flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setModalView('review')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer border ${
                modalView === 'review'
                  ? 'bg-[#202124] text-white border-[#202124]'
                  : 'bg-white text-[#5f6368] border-[#dadce0] hover:bg-[#f1f3f4]'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Review Conflicts ({unresolvedCount})</span>
            </button>

            <button
              onClick={() => setModalView('audit_log')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer border ${
                modalView === 'audit_log'
                  ? 'bg-[#188038] text-white border-[#188038]'
                  : 'bg-white text-[#5f6368] border-[#dadce0] hover:bg-[#f1f3f4]'
              }`}
            >
              <ClipboardList className="w-3.5 h-3.5" />
              <span>Safety Audit Trail &amp; Comments Log ({resolvedContradictions.length})</span>
            </button>
          </div>

          <div className="text-[11px] text-[#5f6368] font-medium flex items-center space-x-2">
            <span>Patient: Mr. Robert Hall (NHS 948 201 8832)</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* VIEW 1: ACTIVE CONFLICTS REVIEW */}
        {/* ========================================================================= */}
        {modalView === 'review' && (
          <>
            {/* Filter Bar: All vs System Errors vs Human Factors vs AI Hallucinations */}
            <div className="px-6 py-2 bg-[#f8f9fa] border-b border-[#dadce0] flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center space-x-1.5 text-xs flex-wrap gap-y-1">
                <span className="text-[11px] font-semibold text-[#5f6368] mr-1 uppercase tracking-wider">
                  Origin Filter:
                </span>
                <button
                  onClick={() => {
                    setActiveFilter('all');
                    setSelectedContradictionIndex(0);
                  }}
                  className={`px-2.5 py-1 rounded-md font-medium border text-xs transition-colors cursor-pointer ${
                    activeFilter === 'all'
                      ? 'bg-[#202124] text-white border-[#202124]'
                      : 'bg-white text-[#3c4043] border-[#dadce0] hover:bg-[#f1f3f4]'
                  }`}
                >
                  All ({contradictions.length})
                </button>
                <button
                  onClick={() => {
                    setActiveFilter('system');
                    setSelectedContradictionIndex(0);
                  }}
                  className={`px-2.5 py-1 rounded-md font-medium border text-xs inline-flex items-center space-x-1.5 transition-colors cursor-pointer ${
                    activeFilter === 'system'
                      ? 'bg-[#1a73e8] text-white border-[#1a73e8]'
                      : 'bg-white text-[#3c4043] border-[#dadce0] hover:bg-[#f1f3f4]'
                  }`}
                >
                  <Server className="w-3 h-3" />
                  <span>System Errors ({systemErrorsTotal})</span>
                </button>
                <button
                  onClick={() => {
                    setActiveFilter('human');
                    setSelectedContradictionIndex(0);
                  }}
                  className={`px-2.5 py-1 rounded-md font-medium border text-xs inline-flex items-center space-x-1.5 transition-colors cursor-pointer ${
                    activeFilter === 'human'
                      ? 'bg-[#b06000] text-white border-[#b06000]'
                      : 'bg-white text-[#3c4043] border-[#dadce0] hover:bg-[#f1f3f4]'
                  }`}
                >
                  <UserCheck className="w-3 h-3" />
                  <span>Human Factors ({humanErrorsTotal})</span>
                </button>
                <button
                  onClick={() => {
                    setActiveFilter('hallucination');
                    setSelectedContradictionIndex(0);
                  }}
                  className={`px-2.5 py-1 rounded-md font-medium border text-xs inline-flex items-center space-x-1.5 transition-colors cursor-pointer ${
                    activeFilter === 'hallucination'
                      ? 'bg-purple-700 text-white border-purple-700'
                      : 'bg-white text-[#3c4043] border-[#dadce0] hover:bg-[#f1f3f4]'
                  }`}
                >
                  <Sparkles className="w-3 h-3" />
                  <span>AI Hallucinations ({aiHallucinationsTotal})</span>
                </button>
              </div>

              {unresolvedCount > 0 && (
                <span className="text-[11px] text-red-700 font-semibold bg-red-50 px-2 py-0.5 rounded border border-red-200">
                  ⚠️ Dispatch Locked Until Reconciled
                </span>
              )}
            </div>

            {/* Conflict Selector Tabs */}
            {filteredContradictions.length > 0 && (
              <div className="px-6 py-2.5 bg-white border-b border-[#dadce0] flex items-center gap-2 overflow-x-auto">
                {filteredContradictions.map((conflict, index) => {
                  const isSelected = index === selectedContradictionIndex;
                  const isSystem = conflict.errorOrigin === 'system_error';
                  const isHybrid = conflict.errorOrigin === 'hybrid_error';
                  const isHallucination = conflict.errorOrigin === 'ai_hallucination';
                  return (
                    <button
                      key={conflict.id}
                      onClick={() => setSelectedContradictionIndex(index)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center space-x-2 whitespace-nowrap transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#202124] text-white border-[#202124] shadow-xs'
                          : conflict.isResolved
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-[#f8f9fa] text-[#3c4043] border-[#dadce0] hover:bg-[#f1f3f4]'
                      }`}
                    >
                      <span className="font-bold">#{index + 1}</span>
                      <span className="max-w-[190px] truncate">{conflict.title}</span>

                      <span
                        className={`text-[9px] font-bold px-1 py-0.2 rounded-xs uppercase tracking-tight ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : isSystem
                            ? 'bg-blue-100 text-blue-800'
                            : isHybrid
                            ? 'bg-purple-100 text-purple-800'
                            : isHallucination
                            ? 'bg-purple-100 text-purple-900'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {isSystem ? 'System' : isHybrid ? 'Hybrid' : isHallucination ? 'AI Drift' : 'Human'}
                      </span>

                      {conflict.isResolved ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <AlertTriangle className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-red-500'}`} />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Modal Body for Review */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {currentConflict ? (
                <div className="space-y-6">
                  {/* Conflict Summary Header Card */}
                  <div className="p-4 rounded-xl border border-red-200 bg-red-50/40 space-y-2.5">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-red-100 text-red-900 border border-red-200">
                          Severity: {currentConflict.severity}
                        </span>

                        {/* Error Origin Pill */}
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-md border flex items-center space-x-1 uppercase tracking-tight ${
                            currentConflict.errorOrigin === 'system_error'
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : currentConflict.errorOrigin === 'hybrid_error'
                              ? 'bg-purple-50 text-purple-800 border-purple-200'
                              : currentConflict.errorOrigin === 'ai_hallucination'
                              ? 'bg-purple-50 text-purple-900 border-purple-300'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          {currentConflict.errorOrigin === 'system_error' && <Server className="w-3 h-3 inline" />}
                          {currentConflict.errorOrigin === 'hybrid_error' && <Cpu className="w-3 h-3 inline" />}
                          {currentConflict.errorOrigin === 'human_error' && <UserCheck className="w-3 h-3 inline" />}
                          {currentConflict.errorOrigin === 'ai_hallucination' && <Sparkles className="w-3 h-3 inline" />}
                          <span>
                            {currentConflict.errorOrigin === 'system_error'
                              ? 'System Telemetry Error'
                              : currentConflict.errorOrigin === 'hybrid_error'
                              ? 'Hybrid Socio-Technical Error'
                              : currentConflict.errorOrigin === 'ai_hallucination'
                              ? 'AI Hallucination Drift Intercepted'
                              : 'Clinician Human Factor'}
                          </span>
                        </span>

                        <span className="text-xs font-bold text-[#202124]">
                          {currentConflict.title}
                        </span>
                      </div>

                      {currentConflict.isResolved && (
                        <span className="inline-flex items-center space-x-1 text-xs font-medium text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-md border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Reconciled by {currentConflict.resolvedBy || 'Dr. Alex Smith'}</span>
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#202124] leading-relaxed">
                      {currentConflict.description}
                    </p>

                    <div className="pt-2 border-t border-red-200/60 flex items-start space-x-2 text-xs text-red-900 font-medium">
                      <FileWarning className="w-4 h-4 text-red-700 flex-shrink-0 mt-0.5" />
                      <span>Clinical Risk: {currentConflict.clinicalRisk}</span>
                    </div>
                  </div>

                  {/* Root Cause Panels */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* System Error Details */}
                    {currentConflict.systemError ? (
                      <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/30 space-y-2.5">
                        <div className="flex items-center justify-between border-b border-blue-200 pb-2">
                          <div className="flex items-center space-x-1.5 text-xs font-bold text-blue-900 uppercase tracking-wider">
                            <Server className="w-3.5 h-3.5 text-blue-700" />
                            <span>System &amp; Telemetry Failure Profile</span>
                          </div>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-xs bg-blue-100 text-blue-800 border border-blue-200">
                            DCB0129 §4.2
                          </span>
                        </div>
                        <div className="space-y-2 text-xs">
                          <div>
                            <span className="text-[11px] font-semibold text-[#5f6368] block">Hardware / Interface:</span>
                            <span className="text-[#202124] font-medium">{currentConflict.systemError.systemComponent}</span>
                          </div>
                          <div>
                            <span className="text-[11px] font-semibold text-[#5f6368] block">Failure Mechanism:</span>
                            <span className="text-[#3c4043] leading-relaxed">{currentConflict.systemError.failureMechanism}</span>
                          </div>
                          {currentConflict.systemError.telemetryLog && (
                            <div>
                              <div className="flex items-center space-x-1 text-[11px] font-semibold text-[#5f6368] mb-1">
                                <Terminal className="w-3 h-3 text-blue-600" />
                                <span>Raw Telemetry Protocol Log:</span>
                              </div>
                              <div className="p-2 rounded-lg bg-[#202124] text-[#8ab4f8] font-mono text-[11px] leading-relaxed overflow-x-auto border border-black">
                                {currentConflict.systemError.telemetryLog}
                              </div>
                            </div>
                          )}
                          <div>
                            <span className="text-[11px] font-semibold text-[#5f6368] block">Mitigation Protocol:</span>
                            <span className="text-emerald-800 font-medium bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200 block mt-0.5">
                              {currentConflict.systemError.mitigationProtocol}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : null}

                    {/* Human Error Details */}
                    {currentConflict.humanError ? (
                      <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/30 space-y-2.5">
                        <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                          <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-900 uppercase tracking-wider">
                            <UserCheck className="w-3.5 h-3.5 text-amber-700" />
                            <span>Human Factors &amp; Cognitive Load Analysis</span>
                          </div>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-xs bg-amber-100 text-amber-800 border border-amber-200">
                            DCB0160 §3.1
                          </span>
                        </div>
                        <div className="space-y-2 text-xs">
                          <div>
                            <span className="text-[11px] font-semibold text-[#5f6368] block">Clinical Role Involved:</span>
                            <span className="text-[#202124] font-medium">{currentConflict.humanError.clinicalRole}</span>
                          </div>
                          <div>
                            <span className="text-[11px] font-semibold text-[#5f6368] block">Cognitive Contributing Factor:</span>
                            <span className="text-[#3c4043] leading-relaxed">{currentConflict.humanError.contributingFactor}</span>
                          </div>
                          <div>
                            <span className="text-[11px] font-semibold text-[#5f6368] block">Error Taxonomy:</span>
                            <span className="text-amber-900 font-semibold uppercase tracking-wider bg-amber-100/80 px-2 py-0.5 rounded-md border border-amber-200 inline-block mt-0.5">
                              {currentConflict.humanError.errorType.replace(/_/g, ' ')}
                            </span>
                          </div>
                          <div className="p-2 rounded-lg bg-white border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
                            Recommendation: Enforce non-punitive dual sign-off on high-risk orders and prevent CPOE template auto-fill across beds.
                          </div>
                        </div>
                      </div>
                    ) : null}

                    {/* AI Hallucination Details */}
                    {currentConflict.aiHallucination ? (
                      <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/30 space-y-2.5 col-span-1 md:col-span-2">
                        <div className="flex items-center justify-between border-b border-purple-200 pb-2">
                          <div className="flex items-center space-x-1.5 text-xs font-bold text-purple-900 uppercase tracking-wider">
                            <Sparkles className="w-3.5 h-3.5 text-purple-700" />
                            <span>AI Hallucination &amp; Ungrounded Inference Interception</span>
                          </div>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-xs bg-purple-100 text-purple-800 border border-purple-200">
                            Zero-Confabulation Gate
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          <div>
                            <span className="text-[11px] font-semibold text-[#5f6368] block">Hallucinated Assertion:</span>
                            <span className="text-red-900 font-medium bg-red-50 px-2 py-1 rounded border border-red-200 block mt-0.5">
                              &ldquo;{currentConflict.aiHallucination.hallucinatedClaim}&rdquo;
                            </span>
                          </div>
                          <div>
                            <span className="text-[11px] font-semibold text-[#5f6368] block">Ground Truth In Record:</span>
                            <span className="text-emerald-900 font-medium bg-emerald-50 px-2 py-1 rounded border border-emerald-200 block mt-0.5">
                              {currentConflict.aiHallucination.groundTruthRecord}
                            </span>
                          </div>
                          <div className="col-span-1 md:col-span-2">
                            <span className="text-[11px] font-semibold text-[#5f6368] block">Extractive Proof Deficit:</span>
                            <span className="text-[#3c4043] leading-relaxed">{currentConflict.aiHallucination.sourceEvidenceLacking}</span>
                          </div>
                          <div className="col-span-1 md:col-span-2">
                            <span className="text-[11px] font-semibold text-[#5f6368] block">Mitigation Protocol:</span>
                            <span className="text-purple-900 font-medium bg-purple-100/70 px-2 py-1 rounded border border-purple-200 block mt-0.5">
                              {currentConflict.aiHallucination.mitigationAction}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>

                  {/* Conflicting Clinical Records Side-by-Side */}
                  <div>
                    <h3 className="text-xs font-bold text-[#202124] uppercase tracking-wider mb-2.5">
                      Conflicting Clinical Records Side-by-Side
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {currentConflict.sources.map((source, srcIdx) => (
                        <div
                          key={srcIdx}
                          className="p-4 rounded-xl border border-[#dadce0] bg-[#f8f9fa] space-y-2.5 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between border-b border-[#dadce0] pb-2 mb-2">
                              <span className="text-xs font-bold text-[#202124]">
                                Source {srcIdx + 1}: {source.documentName}
                              </span>
                              <span className="text-[11px] text-[#5f6368]">
                                {source.timestamp}
                              </span>
                            </div>
                            <p className="text-xs font-medium text-[#3c4043] mb-1">
                              Author: {source.author}
                            </p>
                            <div className="p-2.5 rounded-lg bg-white border border-[#dadce0] text-xs text-[#202124] font-mono leading-relaxed">
                              &ldquo;{source.excerpt}&rdquo;
                            </div>
                          </div>

                          {source.timelineEventId && onJumpToTimelineEvent && (
                            <button
                              onClick={() => {
                                onJumpToTimelineEvent(source.timelineEventId!);
                                onClose();
                              }}
                              className="inline-flex items-center space-x-1 text-[11px] font-medium text-[#1a73e8] hover:underline self-start pt-1 cursor-pointer"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>View in Chronological Timeline</span>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Resolution Options */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-[#202124] uppercase tracking-wider">
                      Select Clinician Action &amp; Clinical Resolution
                    </h3>

                    <div className="space-y-2">
                      {currentConflict.resolutionOptions.map((option) => {
                        const isChecked = selectedOptions[currentConflict.id] === option.id;
                        return (
                          <label
                            key={option.id}
                            className={`flex items-start space-x-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                              isChecked
                                ? 'bg-blue-50/50 border-[#1a73e8] ring-1 ring-[#1a73e8]'
                                : 'bg-white border-[#dadce0] hover:bg-[#f8f9fa]'
                            }`}
                          >
                            <input
                              type="radio"
                              name={`resolution-${currentConflict.id}`}
                              value={option.id}
                              checked={isChecked}
                              onChange={() => handleSelectOption(currentConflict.id, option.id)}
                              className="mt-0.5 text-[#1a73e8] focus:ring-[#1a73e8]"
                            />
                            <div className="flex-1 text-xs">
                              <div className="flex items-center space-x-2">
                                <span className="font-semibold text-[#202124]">
                                  {option.label}
                                </span>
                                {option.isRecommended && (
                                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                                    Recommended Safety Guardrail
                                  </span>
                                )}
                              </div>
                              <p className="text-[#5f6368] mt-1 leading-relaxed">
                                {option.actionDescription}
                              </p>
                            </div>
                          </label>
                        );
                      })}
                    </div>

                    {/* Clinician Justification Note & Comments */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-semibold text-[#202124]">
                          Clinician Comments &amp; Medicolegal Audit Rationale (Recorded in Audit Trail):
                        </label>
                        <span className="text-[10px] text-[#5f6368]">Immutable GMC Audit Log</span>
                      </div>
                      <textarea
                        rows={2}
                        value={customNotes[currentConflict.id] || ''}
                        onChange={(e) =>
                          setCustomNotes((prev) => ({
                            ...prev,
                            [currentConflict.id]: e.target.value,
                          }))
                        }
                        placeholder="e.g. Verified with patient bedside allergy history. Penicillin anaphylaxis confirmed; Co-Amoxiclav purged from draft TTO and substituted with targeted oral Ciprofloxacin per microbiology sensitivities."
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#dadce0] bg-[#f8f9fa] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1a73e8] text-[#202124] leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-xs text-[#5f6368]">
                  No contradiction matching current filter.
                </div>
              )}
            </div>

            {/* Modal Footer for Review View */}
            <div className="px-6 py-4 border-t border-[#dadce0] bg-[#f8f9fa] flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center space-x-2 text-xs text-[#5f6368]">
                <Stethoscope className="w-4 h-4 text-[#5f6368]" />
                <span>Audit Trail: Signed by Dr. Alex Smith (GMC 7849201)</span>
              </div>

              <div className="flex items-center space-x-2.5">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg border border-[#dadce0] text-xs font-medium text-[#3c4043] hover:bg-[#e8eaed] transition-colors cursor-pointer"
                >
                  Close
                </button>

                {currentConflict && !currentConflict.isResolved && (
                  <button
                    onClick={() => handleApplyResolution(currentConflict.id)}
                    className="px-4 py-2 rounded-lg bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-medium transition-colors inline-flex items-center space-x-1.5 cursor-pointer shadow-xs"
                  >
                    <span>Apply Resolution for #{selectedContradictionIndex + 1}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                {!isAllResolved && (
                  <button
                    onClick={() => {
                      onResolveAll();
                      setModalView('audit_log');
                    }}
                    className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium transition-colors inline-flex items-center space-x-1.5 cursor-pointer shadow-xs"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Resolve All with Recommended Guardrails</span>
                  </button>
                )}

                {isAllResolved && (
                  <button
                    onClick={() => setModalView('audit_log')}
                    className="px-4 py-2 rounded-lg bg-[#188038] hover:bg-[#13662c] text-white text-xs font-medium transition-colors inline-flex items-center space-x-1.5 cursor-pointer shadow-xs"
                  >
                    <ClipboardList className="w-3.5 h-3.5" />
                    <span>View Completed Audit Trail Log</span>
                  </button>
                )}
              </div>
            </div>
          </>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: SAFETY AUDIT TRAIL & CLINICIAN COMMENTS LOG */}
        {/* ========================================================================= */}
        {modalView === 'audit_log' && (
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Audit Log Overview Banner */}
            <div className="px-6 py-3 bg-emerald-50/50 border-b border-emerald-200 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                <div>
                  <h3 className="text-xs font-bold text-emerald-950">
                    Medicolegal Clinical Safety Audit Trail &amp; Clinician Comments Log
                  </h3>
                  <p className="text-[11px] text-emerald-800">
                    Permanent record of all reconciled telemetry bugs, clinician slips, and AI hallucination interventions under NHS DCB0129 / DCB0160.
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-xs font-mono text-emerald-900 bg-white px-2.5 py-1 rounded border border-emerald-300">
                <span>{resolvedContradictions.length} of {contradictions.length} Reconciled</span>
              </div>
            </div>

            {/* Audit Log Stream */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {resolvedContradictions.length === 0 ? (
                <div className="text-center py-16 text-xs text-[#5f6368] space-y-2">
                  <ClipboardList className="w-8 h-8 text-[#9aa0a6] mx-auto mb-2 opacity-60" />
                  <p className="font-semibold text-[#202124]">No Contradictions Resolved Yet</p>
                  <p className="max-w-md mx-auto">
                    Review and reconcile the active conflicts to generate signed audit entries with clinician comments.
                  </p>
                  <button
                    onClick={() => setModalView('review')}
                    className="mt-3 px-4 py-2 bg-[#1a73e8] text-white rounded-lg text-xs font-medium cursor-pointer"
                  >
                    Switch to Review Mode
                  </button>
                </div>
              ) : (
                resolvedContradictions.map((conflict, idx) => {
                  const isSystem = conflict.errorOrigin === 'system_error';
                  const isHybrid = conflict.errorOrigin === 'hybrid_error';
                  const isHallucination = conflict.errorOrigin === 'ai_hallucination';
                  const chosenOption = conflict.resolutionOptions.find(
                    (o) => o.id === conflict.selectedResolutionId
                  );

                  return (
                    <div
                      key={conflict.id}
                      className="bg-white rounded-xl border border-[#dadce0] p-4 shadow-xs space-y-3 transition-all hover:border-[#bdc1c6]"
                    >
                      {/* Entry Header */}
                      <div className="flex items-center justify-between border-b border-[#f1f3f4] pb-2.5 flex-wrap gap-2">
                        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#202124] text-white">
                            Log Entry #{idx + 1}
                          </span>

                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-tight flex items-center space-x-1 ${
                              isSystem
                                ? 'bg-blue-50 text-blue-800 border-blue-200'
                                : isHybrid
                                ? 'bg-purple-50 text-purple-800 border-purple-200'
                                : isHallucination
                                ? 'bg-purple-100 text-purple-900 border-purple-300'
                                : 'bg-amber-50 text-amber-800 border-amber-200'
                            }`}
                          >
                            {isSystem && <Server className="w-2.5 h-2.5 mr-0.5 inline" />}
                            {isHybrid && <Cpu className="w-2.5 h-2.5 mr-0.5 inline" />}
                            {isHallucination && <Sparkles className="w-2.5 h-2.5 mr-0.5 inline" />}
                            {!isSystem && !isHybrid && !isHallucination && <UserCheck className="w-2.5 h-2.5 mr-0.5 inline" />}
                            <span>{isSystem ? 'System Error' : isHybrid ? 'Hybrid Error' : isHallucination ? 'AI Hallucination Intercepted' : 'Clinician Factor'}</span>
                          </span>

                          <span className="text-xs font-bold text-[#202124]">
                            {conflict.title}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2 text-[11px] text-[#5f6368]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="font-medium text-emerald-800">Reconciled</span>
                          <span>•</span>
                          <span>{conflict.resolvedAt || 'Today 09:15'}</span>
                        </div>
                      </div>

                      {/* Action Applied */}
                      <div className="text-xs space-y-1">
                        <div className="text-[11px] font-semibold text-[#5f6368] uppercase tracking-wider">
                          Reconciliation Action Applied:
                        </div>
                        <p className="font-semibold text-[#202124] bg-[#f8f9fa] p-2 rounded-lg border border-[#dadce0]">
                          {chosenOption ? chosenOption.label : 'Standard Clinical Guardrail Applied'}
                          {chosenOption?.actionDescription && (
                            <span className="block font-normal text-[11px] text-[#5f6368] mt-0.5">
                              {chosenOption.actionDescription}
                            </span>
                          )}
                        </p>
                      </div>

                      {/* Clinician Comment Box */}
                      <div className="bg-amber-50/40 rounded-lg p-3 border border-amber-200/80 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1.5 text-[11px] font-bold text-amber-950 uppercase tracking-wider">
                            <MessageSquare className="w-3.5 h-3.5 text-amber-800" />
                            <span>Clinician Rationale &amp; Audit Comment:</span>
                          </div>
                          <span className="text-[10px] font-mono text-amber-800">
                            Signed by: {conflict.resolvedBy || 'Dr. Alex Smith (GMC 7849201)'}
                          </span>
                        </div>

                        {editingAuditId === conflict.id ? (
                          <div className="space-y-2 pt-1">
                            <textarea
                              rows={2}
                              value={editingAuditText}
                              onChange={(e) => setEditingAuditText(e.target.value)}
                              className="w-full p-2 text-xs rounded border border-amber-300 bg-white text-[#202124]"
                            />
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => setEditingAuditId(null)}
                                className="px-2 py-1 text-[11px] border border-[#dadce0] rounded bg-white text-[#5f6368]"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => {
                                  conflict.resolutionNotes = editingAuditText;
                                  setEditingAuditId(null);
                                }}
                                className="px-2 py-1 text-[11px] bg-[#188038] text-white rounded font-medium"
                              >
                                Save Comment
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-xs text-amber-950 italic leading-relaxed">
                              &ldquo;{conflict.resolutionNotes || chosenOption?.actionDescription || 'Auto-resolved via recommended NHS DCB0129 clinical safety guardrail.'}&rdquo;
                            </p>
                            <button
                              onClick={() => {
                                setEditingAuditId(conflict.id);
                                setEditingAuditText(conflict.resolutionNotes || '');
                              }}
                              className="text-[11px] text-amber-800 hover:text-amber-950 underline inline-flex items-center space-x-1 flex-shrink-0 cursor-pointer"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>Amend</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer for Audit Log View */}
            <div className="px-6 py-4 border-t border-[#dadce0] bg-[#f8f9fa] flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center space-x-2 text-xs text-[#5f6368]">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>DCB0129 Safety File: Exportable to NHS Spine MESH and Trust EPR Audit Storage</span>
              </div>

              <div className="flex items-center space-x-2.5">
                <button
                  onClick={() => setModalView('review')}
                  className="px-4 py-2 rounded-lg border border-[#dadce0] text-xs font-medium text-[#3c4043] hover:bg-[#e8eaed] transition-colors cursor-pointer"
                >
                  Back to Review Conflicts
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-[#202124] hover:bg-black text-white text-xs font-medium transition-colors cursor-pointer shadow-xs"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
