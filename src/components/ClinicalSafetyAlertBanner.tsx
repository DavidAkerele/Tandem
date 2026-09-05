import React from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Server,
  UserCheck,
  Cpu,
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

  if (isAllResolved) {
    return (
      <div className="bg-white rounded-xl border border-[#dadce0] border-l-4 border-l-[#188038] p-3.5 shadow-xs flex flex-wrap items-center justify-between gap-3 transition-all">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#188038] flex-shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-[#202124]">
                Clinical Contradictions Reconciled & Safety Gate Passed
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                DCB0129 Compliant
              </span>
            </div>
            <p className="text-[11px] text-[#5f6368] mt-0.5">
              All {contradictions.length} clinical safety conflicts (system telemetry latency, transit artifacts & clinician slips) reconciled by Dr. Alex Smith (GMC 7849201).
            </p>
          </div>
        </div>

        <button
          onClick={onOpenReviewModal}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-[#dadce0] text-xs font-medium text-[#3c4043] hover:bg-[#f1f3f4] transition-colors"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#188038]" />
          <span>View Safety Resolution Audit Trail</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-[#dadce0] border-l-4 border-l-[#d93025] p-3.5 shadow-xs space-y-3 transition-all">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left Icon & Heading */}
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-[#d93025] flex-shrink-0 mt-0.5">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <span className="text-xs font-bold text-[#202124] uppercase tracking-wide">
                Critical Safety Contradiction Detected — Clinician Verification Required
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-red-100 text-red-900 border border-red-200">
                {unresolvedCount} Active Conflict{unresolvedCount !== 1 ? 's' : ''}
              </span>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#f1f3f4] text-[#3c4043] border border-[#dadce0] inline-flex items-center space-x-1">
                <Server className="w-3 h-3 text-[#1a73e8]" />
                <span>{systemErrorsCount} System Telemetry</span>
              </span>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#f1f3f4] text-[#3c4043] border border-[#dadce0] inline-flex items-center space-x-1">
                <UserCheck className="w-3 h-3 text-[#b06000]" />
                <span>{humanErrorsCount} Clinician Factors</span>
              </span>
            </div>
            <p className="text-xs text-[#5f6368] mt-1">
              The AI Safety Engine identified data discrepancies stemming from both hardware/telemetry transit failures (HL7 broker lag, pneumatic tube hemolysis) and human EHR slips. Discharge dispatch is safety-locked.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onOpenReviewModal}
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-[#d93025] hover:bg-[#b3261e] text-white text-xs font-medium transition-colors shadow-xs flex-shrink-0"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Audit & Resolve Conflicts ({unresolvedCount})</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Conflict Quick Preview Chips */}
      <div className="pt-2 border-t border-[#f1f3f4] flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-semibold text-[#5f6368] mr-1">
          Root Cause Classification:
        </span>
        {contradictions.map((conflict, idx) => {
          const isSystem = conflict.errorOrigin === 'system_error';
          const isHybrid = conflict.errorOrigin === 'hybrid_error';
          const isHuman = conflict.errorOrigin === 'human_error' || (!isSystem && !isHybrid);

          return (
            <button
              key={conflict.id}
              onClick={onOpenReviewModal}
              className={`text-[11px] font-medium px-2.5 py-1 rounded-md border inline-flex items-center space-x-1.5 transition-colors ${
                conflict.isResolved
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 line-through opacity-70'
                  : 'bg-white text-[#202124] border-[#dadce0] hover:border-red-300 hover:bg-red-50/40'
              }`}
            >
              <span className="font-bold text-[#5f6368]">{idx + 1}.</span>
              <span className="truncate max-w-[260px]">{conflict.title}</span>
              
              {/* Origin badge */}
              <span
                className={`text-[9px] font-bold px-1.5 py-0.2 rounded-xs uppercase tracking-tight flex items-center space-x-1 ${
                  isSystem
                    ? 'bg-blue-50 text-blue-800 border border-blue-200'
                    : isHybrid
                    ? 'bg-purple-50 text-purple-800 border border-purple-200'
                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}
              >
                {isSystem && <Server className="w-2.5 h-2.5 mr-0.5 inline" />}
                {isHybrid && <Cpu className="w-2.5 h-2.5 mr-0.5 inline" />}
                {isHuman && <UserCheck className="w-2.5 h-2.5 mr-0.5 inline" />}
                <span>{isSystem ? 'System' : isHybrid ? 'Hybrid' : 'Human'}</span>
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
  );
};
