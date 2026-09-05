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
  Activity,
  Layers,
} from 'lucide-react';
import { DataContradiction } from '../../types/clinical';

interface ContradictionResolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  contradictions: DataContradiction[];
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
  onResolveContradiction,
  onResolveAll,
  onJumpToTimelineEvent,
}) => {
  const [selectedContradictionIndex, setSelectedContradictionIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState<'all' | 'system' | 'human'>('all');
  const [customNotes, setCustomNotes] = useState<Record<string, string>>({});
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    contradictions.forEach((c) => {
      const rec = c.resolutionOptions.find((o) => o.isRecommended);
      initial[c.id] = rec ? rec.id : c.resolutionOptions[0]?.id || '';
    });
    return initial;
  });

  if (!isOpen) return null;

  // Filter contradictions by category
  const filteredContradictions = contradictions.filter((c) => {
    if (activeFilter === 'system') {
      return c.errorOrigin === 'system_error' || c.systemError !== undefined;
    }
    if (activeFilter === 'human') {
      return c.errorOrigin === 'human_error' || c.humanError !== undefined;
    }
    return true;
  });

  const currentConflict =
    filteredContradictions[selectedContradictionIndex] ||
    filteredContradictions[0] ||
    contradictions[0];

  const unresolvedCount = contradictions.filter((c) => !c.isResolved).length;
  const isAllResolved = unresolvedCount === 0;

  const systemErrorsTotal = contradictions.filter(
    (c) => c.errorOrigin === 'system_error' || c.systemError !== undefined
  ).length;
  const humanErrorsTotal = contradictions.filter(
    (c) => c.errorOrigin === 'human_error' || c.humanError !== undefined
  ).length;

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
            <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-700 flex-shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <h2 className="text-base font-bold text-[#202124]">
                  Clinical Safety & Contradiction Resolution Engine
                </h2>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-red-100 text-red-800 border border-red-200">
                  {unresolvedCount} Active Conflict{unresolvedCount !== 1 ? 's' : ''} Pending
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#202124] text-white">
                  NHS DCB0129 / DCB0160 Compliant
                </span>
              </div>
              <p className="text-xs text-[#5f6368] mt-0.5">
                Human-in-the-Loop Safety Gate: Reconciles hardware/telemetry transit bugs and clinical cognition slips before electronic discharge authorization.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#5f6368] hover:text-[#202124] hover:bg-[#e8eaed] transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Bar: All vs System Errors vs Human Factors */}
        <div className="px-6 py-2.5 bg-[#f1f3f4]/60 border-b border-[#dadce0] flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-1.5 text-xs">
            <span className="text-[11px] font-semibold text-[#5f6368] mr-1 uppercase tracking-wider">
              Category Filter:
            </span>
            <button
              onClick={() => {
                setActiveFilter('all');
                setSelectedContradictionIndex(0);
              }}
              className={`px-2.5 py-1 rounded-md font-medium border text-xs transition-colors ${
                activeFilter === 'all'
                  ? 'bg-[#202124] text-white border-[#202124]'
                  : 'bg-white text-[#3c4043] border-[#dadce0] hover:bg-[#f1f3f4]'
              }`}
            >
              All Conflicts ({contradictions.length})
            </button>
            <button
              onClick={() => {
                setActiveFilter('system');
                setSelectedContradictionIndex(0);
              }}
              className={`px-2.5 py-1 rounded-md font-medium border text-xs inline-flex items-center space-x-1.5 transition-colors ${
                activeFilter === 'system'
                  ? 'bg-[#1a73e8] text-white border-[#1a73e8]'
                  : 'bg-white text-[#3c4043] border-[#dadce0] hover:bg-[#f1f3f4]'
              }`}
            >
              <Server className="w-3 h-3" />
              <span>System & Telemetry Errors ({systemErrorsTotal})</span>
            </button>
            <button
              onClick={() => {
                setActiveFilter('human');
                setSelectedContradictionIndex(0);
              }}
              className={`px-2.5 py-1 rounded-md font-medium border text-xs inline-flex items-center space-x-1.5 transition-colors ${
                activeFilter === 'human'
                  ? 'bg-[#b06000] text-white border-[#b06000]'
                  : 'bg-white text-[#3c4043] border-[#dadce0] hover:bg-[#f1f3f4]'
              }`}
            >
              <UserCheck className="w-3 h-3" />
              <span>Clinician Human Factors ({humanErrorsTotal})</span>
            </button>
          </div>

          <div className="text-[11px] text-[#5f6368] font-medium">
            Case: Mr. Robert Hall (NHS 948 201 8832)
          </div>
        </div>

        {/* Conflict Selector Tabs */}
        {filteredContradictions.length > 0 && (
          <div className="px-6 py-2.5 bg-white border-b border-[#dadce0] flex items-center gap-2 overflow-x-auto">
            {filteredContradictions.map((conflict, index) => {
              const isSelected = index === selectedContradictionIndex;
              const isSystem = conflict.errorOrigin === 'system_error';
              const isHybrid = conflict.errorOrigin === 'hybrid_error';
              return (
                <button
                  key={conflict.id}
                  onClick={() => setSelectedContradictionIndex(index)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center space-x-2 whitespace-nowrap transition-colors ${
                    isSelected
                      ? 'bg-[#202124] text-white border-[#202124] shadow-xs'
                      : conflict.isResolved
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                      : 'bg-[#f8f9fa] text-[#3c4043] border-[#dadce0] hover:bg-[#f1f3f4]'
                  }`}
                >
                  <span className="font-bold">#{index + 1}</span>
                  <span className="max-w-[200px] truncate">{conflict.title}</span>
                  
                  <span
                    className={`text-[9px] font-bold px-1 py-0.2 rounded-xs uppercase tracking-tight ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : isSystem
                        ? 'bg-blue-100 text-blue-800'
                        : isHybrid
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {isSystem ? 'System' : isHybrid ? 'Hybrid' : 'Human'}
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

        {/* Modal Body */}
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
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {currentConflict.errorOrigin === 'system_error' && <Server className="w-3 h-3 inline" />}
                      {currentConflict.errorOrigin === 'hybrid_error' && <Cpu className="w-3 h-3 inline" />}
                      {currentConflict.errorOrigin === 'human_error' && <UserCheck className="w-3 h-3 inline" />}
                      <span>
                        {currentConflict.errorOrigin === 'system_error'
                          ? 'System Telemetry Error'
                          : currentConflict.errorOrigin === 'hybrid_error'
                          ? 'Hybrid Socio-Technical Error'
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

              {/* Dual-Axis Root Cause Breakdown: System Errors & Human Factors */}
              {(currentConflict.systemError || currentConflict.humanError) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* System Error Panel */}
                  {currentConflict.systemError ? (
                    <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/30 space-y-2.5">
                      <div className="flex items-center justify-between border-b border-blue-200 pb-2">
                        <div className="flex items-center space-x-1.5 text-xs font-bold text-blue-900 uppercase tracking-wider">
                          <Server className="w-3.5 h-3.5 text-blue-700" />
                          <span>System & Telemetry Failure Profile</span>
                        </div>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-xs bg-blue-100 text-blue-800 border border-blue-200">
                          DCB0129 §4.2
                        </span>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div>
                          <span className="text-[11px] font-semibold text-[#5f6368] block">
                            Hardware / Interface Component:
                          </span>
                          <span className="text-[#202124] font-medium">
                            {currentConflict.systemError.systemComponent}
                          </span>
                        </div>

                        <div>
                          <span className="text-[11px] font-semibold text-[#5f6368] block">
                            Failure Mechanism:
                          </span>
                          <span className="text-[#3c4043] leading-relaxed">
                            {currentConflict.systemError.failureMechanism}
                          </span>
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
                          <span className="text-[11px] font-semibold text-[#5f6368] block">
                            Technical Mitigation Protocol:
                          </span>
                          <span className="text-emerald-800 font-medium bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200 block mt-0.5">
                            {currentConflict.systemError.mitigationProtocol}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl border border-[#dadce0] bg-[#f8f9fa] flex items-center justify-center text-center p-6 text-xs text-[#5f6368]">
                      <div>
                        <Server className="w-5 h-5 text-[#9aa0a6] mx-auto mb-1 opacity-50" />
                        <span className="font-semibold block text-[#3c4043]">No Telemetry / Hardware Failure</span>
                        <span>This incident originated purely through clinical workflow/cognitive human factor.</span>
                      </div>
                    </div>
                  )}

                  {/* Human Error Panel */}
                  {currentConflict.humanError ? (
                    <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/30 space-y-2.5">
                      <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                        <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-900 uppercase tracking-wider">
                          <UserCheck className="w-3.5 h-3.5 text-amber-700" />
                          <span>Human Factors & Cognitive Load Analysis</span>
                        </div>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-xs bg-amber-100 text-amber-800 border border-amber-200">
                          DCB0160 §3.1
                        </span>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div>
                          <span className="text-[11px] font-semibold text-[#5f6368] block">
                            Clinical Role Involved:
                          </span>
                          <span className="text-[#202124] font-medium">
                            {currentConflict.humanError.clinicalRole}
                          </span>
                        </div>

                        <div>
                          <span className="text-[11px] font-semibold text-[#5f6368] block">
                            Cognitive Contributing Factor:
                          </span>
                          <span className="text-[#3c4043] leading-relaxed">
                            {currentConflict.humanError.contributingFactor}
                          </span>
                        </div>

                        <div>
                          <span className="text-[11px] font-semibold text-[#5f6368] block">
                            Error Taxonomy:
                          </span>
                          <span className="text-amber-900 font-semibold uppercase tracking-wider bg-amber-100/80 px-2 py-0.5 rounded-md border border-amber-200 inline-block mt-0.5">
                            {currentConflict.humanError.errorType.replace(/_/g, ' ')}
                          </span>
                        </div>

                        <div className="p-2 rounded-lg bg-white border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
                          Safety Recommendation: Implement non-punitive dual-signoff on high-risk drug orders and restrict CPOE patient template duplication across adjacent ward beds.
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl border border-[#dadce0] bg-[#f8f9fa] flex items-center justify-center text-center p-6 text-xs text-[#5f6368]">
                      <div>
                        <UserCheck className="w-5 h-5 text-[#9aa0a6] mx-auto mb-1 opacity-50" />
                        <span className="font-semibold block text-[#3c4043]">No Clinician Cognitive Slip</span>
                        <span>This contradiction was caused by asynchronous integration queue latency outside clinician control.</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Side-by-Side Conflicting Data Sources */}
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
                          className="inline-flex items-center space-x-1 text-[11px] font-medium text-[#1a73e8] hover:underline self-start pt-1"
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
                  Select Clinician Action & Clinical Resolution
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

                {/* Optional Clinician Justification Note */}
                <div className="pt-2">
                  <label className="block text-xs font-medium text-[#3c4043] mb-1">
                    Clinician Rationale / Medicolegal Audit Note (Optional):
                  </label>
                  <input
                    type="text"
                    value={customNotes[currentConflict.id] || ''}
                    onChange={(e) =>
                      setCustomNotes((prev) => ({
                        ...prev,
                        [currentConflict.id]: e.target.value,
                      }))
                    }
                    placeholder="e.g. Verified with patient bedside allergy history; Co-Amoxiclav blocked, switched to ciprofloxacin."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#dadce0] bg-[#f8f9fa] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1a73e8] text-[#202124]"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-[#5f6368]">
              No contradiction matching current filter.
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[#dadce0] bg-[#f8f9fa] flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center space-x-2 text-xs text-[#5f6368]">
            <Stethoscope className="w-4 h-4 text-[#5f6368]" />
            <span>Audit Trail: Signed by Dr. Alex Smith (GMC 7849201)</span>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-[#dadce0] text-xs font-medium text-[#3c4043] hover:bg-[#e8eaed] transition-colors"
            >
              Cancel & Keep Locked
            </button>

            {currentConflict && !currentConflict.isResolved && (
              <button
                onClick={() => handleApplyResolution(currentConflict.id)}
                className="px-4 py-2 rounded-lg bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-medium transition-colors inline-flex items-center space-x-1.5"
              >
                <span>Apply Resolution for #{selectedContradictionIndex + 1}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {!isAllResolved && (
              <button
                onClick={() => {
                  onResolveAll();
                  onClose();
                }}
                className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium transition-colors inline-flex items-center space-x-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Resolve All with Recommended Guardrails</span>
              </button>
            )}

            {isAllResolved && (
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium transition-colors inline-flex items-center space-x-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Done — Autonomous Dispatch Unlocked</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
