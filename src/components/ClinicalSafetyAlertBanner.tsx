import React, { useState } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  ArrowRight,
  Server,
  UserCheck,
  Cpu,
  Sparkles,
  ClipboardList,
  ChevronDown,
} from 'lucide-react';
import { DataContradiction } from '../types/clinical';

interface ClinicalSafetyAlertBannerProps {
  contradictions: DataContradiction[];
  onOpenReviewModal: () => void;
}

export const ClinicalSafetyAlertBanner: React.FC<ClinicalSafetyAlertBannerProps> = ({
  contradictions,
  onOpenReviewModal,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!contradictions || contradictions.length === 0) return null;

  const unresolved = contradictions.filter((c) => !c.isResolved);
  const unresolvedCount = unresolved.length;
  const isAllResolved = unresolvedCount === 0;

  const systemErrorsCount = contradictions.filter(
    (c) => c.errorOrigin === 'system_error' || c.systemError !== undefined
  ).length;
  const humanErrorsCount = contradictions.filter(
    (c) => c.errorOrigin === 'human_error' || c.humanError !== undefined
  ).length;
  const aiHallucinationsCount = contradictions.filter(
    (c) => c.errorOrigin === 'ai_hallucination' || c.aiHallucination !== undefined
  ).length;

  if (isAllResolved) {
    return (
      <div className="bg-white rounded-xl border border-emerald-200 border-l-4 border-l-[#188038] px-4 py-2.5 shadow-xs flex flex-wrap items-center justify-between gap-3 transition-all">
        <div className="flex items-center space-x-2.5">
          <div className="w-6 h-6 rounded-md bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#188038] flex-shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <div className="flex items-center space-x-2 flex-wrap">
            <span className="text-xs font-semibold text-[#202124]">
              Safety Gate Cleared: All {contradictions.length} Clinical Contradictions Reconciled
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
              DCB0129 Compliant
            </span>
          </div>
        </div>

        <button
          onClick={onOpenReviewModal}
          className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md border border-[#dadce0] text-xs font-medium text-[#3c4043] hover:bg-[#f1f3f4] transition-colors cursor-pointer"
        >
          <ClipboardList className="w-3.5 h-3.5 text-[#188038]" />
          <span>View Audit Trail</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-red-200 border-l-4 border-l-[#d93025] px-4 py-2.5 shadow-xs transition-all space-y-2.5">
      {/* Sleek Always-Visible Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        {/* Left: Shield Icon, Tag, Headline */}
        <div className="flex items-center space-x-2.5 flex-1 min-w-[280px]">
          <div className="w-7 h-7 rounded-md bg-red-50 border border-red-200 flex items-center justify-center text-[#d93025] flex-shrink-0">
            <ShieldAlert className="w-4 h-4" />
          </div>

          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-red-100 text-red-900 border border-red-200 uppercase tracking-wide">
              SAFETY GATE LOCKED
            </span>
            <span className="text-xs font-semibold text-[#202124]">
              {unresolvedCount} Critical Data Contradiction{unresolvedCount !== 1 ? 's' : ''} Detected
            </span>
            <span className="hidden xl:inline text-xs text-[#5f6368]">
              — Clinician verification required before sign-off
            </span>
          </div>
        </div>

        {/* Right: Origin Counters, CTA & Drawer Toggle */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          <div className="hidden sm:flex items-center space-x-1 text-[10px] text-[#5f6368]">
            <span className="inline-flex items-center space-x-1 bg-[#f8f9fa] px-2 py-0.5 rounded-md border border-[#dadce0]">
              <Server className="w-2.5 h-2.5 text-[#1a73e8]" />
              <span>{systemErrorsCount} Telemetry</span>
            </span>
            <span className="inline-flex items-center space-x-1 bg-[#f8f9fa] px-2 py-0.5 rounded-md border border-[#dadce0]">
              <UserCheck className="w-2.5 h-2.5 text-[#b06000]" />
              <span>{humanErrorsCount} Clinician</span>
            </span>
            {aiHallucinationsCount > 0 && (
              <span className="inline-flex items-center space-x-1 bg-[#f8f9fa] px-2 py-0.5 rounded-md border border-[#dadce0]">
                <Sparkles className="w-2.5 h-2.5 text-purple-700" />
                <span>{aiHallucinationsCount} AI Drift</span>
              </span>
            )}
          </div>

          <button
            onClick={onOpenReviewModal}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#d93025] hover:bg-[#b3261e] text-white text-xs font-semibold transition-colors shadow-xs cursor-pointer"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Resolve Conflicts ({unresolvedCount})</span>
            <ArrowRight className="w-3 h-3" />
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border border-[#dadce0] text-xs font-medium text-[#5f6368] hover:text-[#202124] hover:bg-[#f1f3f4] transition-colors cursor-pointer"
            title={isExpanded ? 'Collapse contradiction breakdown' : 'Expand contradiction breakdown'}
          >
            <span className="text-[11px]">{isExpanded ? 'Less' : 'Details'}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transform transition-transform duration-200 ${
                isExpanded ? 'rotate-180' : 'rotate-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Expandable Breakdown Drawer */}
      {isExpanded && (
        <div className="pt-2.5 border-t border-[#f1f3f4] space-y-2.5">
          <p className="text-xs text-[#5f6368] leading-relaxed">
            The AI Safety Engine flagged data discrepancies from hardware/telemetry transit failures (HL7 broker lag, tube hemolysis), human clinician slips, and ungrounded AI inferences. In accordance with NHS DCB0129 clinical risk governance, discharge dispatch is locked until all contradictions are explicitly resolved.
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold text-[#5f6368]">
              Discrepancy Breakdown:
            </span>
            {contradictions.map((conflict, idx) => {
              const isSystem = conflict.errorOrigin === 'system_error';
              const isHybrid = conflict.errorOrigin === 'hybrid_error';
              const isHallucination = conflict.errorOrigin === 'ai_hallucination';
              const isHuman = conflict.errorOrigin === 'human_error' || (!isSystem && !isHybrid && !isHallucination);

              return (
                <button
                  key={conflict.id}
                  onClick={onOpenReviewModal}
                  className={`text-[11px] font-medium px-2.5 py-1 rounded-md border inline-flex items-center space-x-1.5 transition-colors cursor-pointer ${
                    conflict.isResolved
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200 line-through opacity-70'
                      : 'bg-white text-[#202124] border-[#dadce0] hover:border-red-300 hover:bg-red-50/40'
                  }`}
                >
                  <span className="font-bold text-[#5f6368]">{idx + 1}.</span>
                  <span className="truncate max-w-[240px]">{conflict.title}</span>

                  {/* Origin badge */}
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded-xs uppercase tracking-tight flex items-center space-x-1 ${
                      isSystem
                        ? 'bg-blue-50 text-blue-800 border border-blue-200'
                        : isHybrid
                        ? 'bg-purple-50 text-purple-800 border border-purple-200'
                        : isHallucination
                        ? 'bg-purple-100 text-purple-900 border border-purple-300'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {isSystem && <Server className="w-2.5 h-2.5 mr-0.5 inline" />}
                    {isHybrid && <Cpu className="w-2.5 h-2.5 mr-0.5 inline" />}
                    {isHallucination && <Sparkles className="w-2.5 h-2.5 mr-0.5 inline" />}
                    {isHuman && <UserCheck className="w-2.5 h-2.5 mr-0.5 inline" />}
                    <span>{isSystem ? 'System' : isHybrid ? 'Hybrid' : isHallucination ? 'AI Drift' : 'Human'}</span>
                  </span>

                  {conflict.isResolved ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 ml-0.5" />
                  ) : (
                    <AlertTriangle className="w-3 h-3 text-red-600 ml-0.5" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
