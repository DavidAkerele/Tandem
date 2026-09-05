import React from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle2, ArrowRight, ShieldCheck, ExternalLink } from 'lucide-react';
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

  const unresolvedCount = contradictions.filter((c) => !c.isResolved).length;
  const isAllResolved = unresolvedCount === 0;

  if (isAllResolved) {
    return (
      <div className="bg-white rounded-xl border border-[#dadce0] border-l-4 border-l-[#188038] p-3 shadow-xs flex flex-wrap items-center justify-between gap-3 transition-all">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#188038] flex-shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-[#202124]">
                Clinical Contradictions Verified & Resolved
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                Audit Trail Complete
              </span>
            </div>
            <p className="text-[11px] text-[#5f6368] mt-0.5">
              All {contradictions.length} data mismatches reconciled by Dr. Alex Smith (GMC 7849201). Autonomous discharge synthesis unlocked.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenReviewModal}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-[#dadce0] text-xs font-medium text-[#3c4043] hover:bg-[#f1f3f4] transition-colors"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#188038]" />
          <span>View Resolution Audit Log</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-[#dadce0] border-l-4 border-l-[#d93025] p-3.5 shadow-xs space-y-2.5 transition-all">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left Icon & Heading */}
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-[#d93025] flex-shrink-0 mt-0.5">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-[#202124] uppercase tracking-wide">
                Critical Clinical Contradiction Detected — Human Verification Required
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-red-100 text-red-900 border border-red-200">
                {unresolvedCount} Active Conflict{unresolvedCount !== 1 ? 's' : ''}
              </span>
            </div>
            <p className="text-xs text-[#5f6368] mt-0.5">
              The AI Safety Engine detected contradictory entries across admission notes, ward rounds, labs, and radiology. Autonomous discharge sign-off is locked until verified.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onOpenReviewModal}
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-[#d93025] hover:bg-[#b3261e] text-white text-xs font-medium transition-colors shadow-xs flex-shrink-0"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Review & Resolve Mismatches ({unresolvedCount})</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Conflict Quick Preview Chips */}
      <div className="pt-2 border-t border-[#f1f3f4] flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-medium text-[#5f6368]">
          Detected Mismatches:
        </span>
        {contradictions.map((conflict, idx) => (
          <button
            key={conflict.id}
            onClick={onOpenReviewModal}
            className={`text-[11px] font-medium px-2.5 py-1 rounded-md border inline-flex items-center space-x-1.5 transition-colors ${
              conflict.isResolved
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 line-through opacity-70'
                : 'bg-red-50 text-red-900 border-red-200 hover:bg-red-100'
            }`}
          >
            <span className="font-bold">{idx + 1}.</span>
            <span>{conflict.title}</span>
            {conflict.isResolved ? (
              <CheckCircle2 className="w-3 h-3 text-emerald-600 ml-1" />
            ) : (
              <AlertTriangle className="w-3 h-3 text-red-600 ml-1" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
