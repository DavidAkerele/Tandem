import React, { useState } from 'react';
import {
  AlertTriangle, ShieldAlert, CheckCircle2, X, ExternalLink,
  ChevronRight, ArrowRight, ShieldCheck, FileWarning, Stethoscope
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

  const currentConflict = contradictions[selectedContradictionIndex] || contradictions[0];
  const unresolvedCount = contradictions.filter((c) => !c.isResolved).length;
  const isAllResolved = unresolvedCount === 0;

  const handleSelectOption = (conflictId: string, optionId: string) => {
    setSelectedOptions((prev) => ({ ...prev, [conflictId]: optionId }));
  };

  const handleApplyResolution = (conflictId: string) => {
    const chosenOption = selectedOptions[conflictId];
    const notes = customNotes[conflictId];
    onResolveContradiction(conflictId, chosenOption, notes);
    
    // Automatically move to next unresolved conflict if available
    const nextUnresolvedIndex = contradictions.findIndex(
      (c, idx) => idx > selectedContradictionIndex && !c.isResolved
    );
    if (nextUnresolvedIndex !== -1) {
      setSelectedContradictionIndex(nextUnresolvedIndex);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full border border-[#dadce0] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#dadce0] flex items-center justify-between bg-[#f8f9fa]">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-700">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-semibold text-[#202124]">
                  Clinical Data Contradiction & Safety Audit
                </h2>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-red-100 text-red-800 border border-red-200">
                  {unresolvedCount} Conflict{unresolvedCount !== 1 ? 's' : ''} Pending
                </span>
              </div>
              <p className="text-xs text-[#5f6368] mt-0.5">
                Human-in-the-Loop Safety Gate: Conflicting clinical entries must be reviewed and resolved before discharge sign-off.
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

        {/* Conflict Selector Tabs (if multiple conflicts) */}
        {contradictions.length > 1 && (
          <div className="px-6 py-2.5 bg-white border-b border-[#dadce0] flex items-center gap-2 overflow-x-auto">
            {contradictions.map((conflict, index) => {
              const isSelected = index === selectedContradictionIndex;
              return (
                <button
                  key={conflict.id}
                  onClick={() => setSelectedContradictionIndex(index)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center space-x-2 whitespace-nowrap transition-colors ${
                    isSelected
                      ? 'bg-[#202124] text-white border-[#202124]'
                      : conflict.isResolved
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                      : 'bg-[#f8f9fa] text-[#3c4043] border-[#dadce0] hover:bg-[#f1f3f4]'
                  }`}
                >
                  <span>
                    {index + 1}. {conflict.title}
                  </span>
                  {conflict.isResolved ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
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
              <div className="p-4 rounded-xl border border-red-200 bg-red-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-red-100 text-red-800 border border-red-200">
                      Severity: {currentConflict.severity}
                    </span>
                    <span className="text-xs font-semibold text-[#202124]">
                      {currentConflict.title}
                    </span>
                  </div>
                  {currentConflict.isResolved && (
                    <span className="inline-flex items-center space-x-1 text-xs font-medium text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-md border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Resolved by {currentConflict.resolvedBy || 'Dr. Alex Smith'}</span>
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
              No contradiction selected.
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[#dadce0] bg-[#f8f9fa] flex items-center justify-between gap-3">
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
                <span>Apply Resolution for Conflict #{selectedContradictionIndex + 1}</span>
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
