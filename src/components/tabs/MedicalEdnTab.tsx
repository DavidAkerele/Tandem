import React, { useState } from 'react';
import { Stethoscope, CheckCircle2, Bookmark, Edit3, Link2, ExternalLink } from 'lucide-react';
import { DischargeSummary } from '../../types/clinical';

interface MedicalEdnTabProps {
  summary: DischargeSummary;
  onUpdateSummary: (updated: DischargeSummary) => void;
  onCitationClick: (citationId: string) => void;
  showCitations: boolean;
}

export const MedicalEdnTab: React.FC<MedicalEdnTabProps> = ({
  summary,
  onUpdateSummary,
  onCitationClick,
  showCitations,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="space-y-7">
      {/* Top Banner with PRSB standard notification */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[#f0f4f9] border border-blue-100">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-100/80 flex items-center justify-center text-blue-700">
            <Stethoscope className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-800 block">
              PRSB Standard Electronic Discharge Notification (eDN)
            </span>
            <span className="text-[11px] text-slate-500">
              Structured clinical summary formatted for NHS Spine MESH transfer
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${isEditing
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 shadow-2xs'
              }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Editing Mode Active' : 'Human-in-the-Loop Edit'}</span>
          </button>
        </div>
      </div>

      {/* Primary Diagnosis */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Primary Discharge Diagnosis
          </h3>
          {showCitations && summary.primaryDiagnosis.citationId && (
            <button
              onClick={() => onCitationClick(summary.primaryDiagnosis.citationId)}
              className="inline-flex items-center space-x-1.5 text-xs font-medium text-blue-700 hover:text-blue-800 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200/60 transition-colors"
              title="Click to view source event in timeline"
            >
              <Link2 className="w-3 h-3" />
              <span>Evidence Ref</span>
            </button>
          )}
        </div>

        {isEditing ? (
          <input
            type="text"
            value={summary.primaryDiagnosis.term}
            onChange={(e) =>
              onUpdateSummary({
                ...summary,
                primaryDiagnosis: { ...summary.primaryDiagnosis, term: e.target.value },
              })
            }
            className="w-full text-base font-semibold text-slate-900 border border-slate-300 rounded-xl p-3.5 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
          />
        ) : (
          <div className="text-base font-semibold text-slate-900">
            {summary.primaryDiagnosis.term}
          </div>
        )}

        <div className="flex flex-wrap gap-2.5 mt-4 pt-3.5 border-t border-slate-100 text-xs">
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-[#f0f4f9] text-slate-800 font-mono text-xs border border-slate-200/80">
            <Bookmark className="w-3 h-3 text-blue-600" />
            <span>SNOMED CT: <b className="font-semibold">{summary.primaryDiagnosis.snomedCode}</b></span>
          </span>
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-[#f0f4f9] text-slate-800 font-mono text-xs border border-slate-200/80">
            <span>ICD-10: <b className="font-semibold">{summary.primaryDiagnosis.icd10}</b></span>
          </span>
        </div>
      </div>

      {/* Secondary Diagnoses */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">
          Secondary Diagnoses & Comorbidities
        </h3>

        <div className="space-y-3">
          {summary.secondaryDiagnoses.map((diag, index) => (
            <div
              key={index}
              className="flex flex-wrap items-center justify-between p-4 rounded-xl bg-[#f8fafd] border border-slate-200/70 hover:bg-white transition-colors"
            >
              <div className="flex-1 min-w-[220px]">
                <span className="text-sm font-medium text-slate-900">{diag.term}</span>
              </div>
              <div className="flex items-center space-x-2.5 mt-2 sm:mt-0">
                <span className="text-xs font-mono bg-white px-2.5 py-0.5 rounded-md text-slate-600 border border-slate-200">
                  SNOMED: {diag.snomedCode}
                </span>
                <span className="text-xs font-mono bg-white px-2.5 py-0.5 rounded-md text-slate-600 border border-slate-200">
                  ICD: {diag.icd10}
                </span>
                {showCitations && diag.citationId && (
                  <button
                    onClick={() => onCitationClick(diag.citationId)}
                    className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                    title="View Source"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hospital Course / Narrative by System */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">
          Hospital Course & Clinical Trajectory
        </h3>

        <div className="space-y-5">
          {summary.hospitalCourse.map((item, index) => (
            <div key={index} className="p-5 rounded-xl bg-[#f8fafd] border border-slate-200/70 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">
                  {item.system}
                </span>
                {showCitations && item.citationId && (
                  <button
                    onClick={() => onCitationClick(item.citationId)}
                    className="inline-flex items-center space-x-1.5 text-xs font-medium text-blue-700 hover:underline"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                    <span>Source Entry</span>
                  </button>
                )}
              </div>

              {isEditing ? (
                <textarea
                  rows={3}
                  value={item.summary}
                  onChange={(e) => {
                    const newCourse = [...summary.hospitalCourse];
                    newCourse[index].summary = e.target.value;
                    onUpdateSummary({ ...summary, hospitalCourse: newCourse });
                  }}
                  className="w-full text-sm text-slate-800 bg-white border border-slate-300 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 leading-relaxed"
                />
              ) : (
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {item.summary}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Diagnostic & Therapeutic Procedures */}
      {summary.procedures && summary.procedures.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">
            Procedures & Key Investigations
          </h3>
          <div className="space-y-3">
            {summary.procedures.map((proc, index) => (
              <div
                key={index}
                className="flex items-start justify-between p-4 rounded-xl bg-[#f8fafd] border border-slate-200/70 text-xs"
              >
                <div>
                  <div className="text-sm font-semibold text-slate-900">{proc.name}</div>
                  <div className="text-slate-600 mt-1 leading-relaxed">{proc.findings}</div>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <span className="text-xs text-slate-500 font-mono bg-white px-2.5 py-0.5 rounded-md border border-slate-200">{proc.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Discharge Destination & Legal Status */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2.5">
          Discharge Destination & Care Handover
        </h3>
        <p className="text-sm text-slate-800 font-medium leading-relaxed">
          {summary.dischargeDestination}
        </p>
        <div className="mt-3 flex items-center space-x-2 text-xs text-emerald-800 font-semibold bg-emerald-50/70 p-3 rounded-xl border border-emerald-200/70">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Patient Medically Fit for Discharge (MFFD) & Verified by Attending Consultant</span>
        </div>
      </div>
    </div>
  );
};
