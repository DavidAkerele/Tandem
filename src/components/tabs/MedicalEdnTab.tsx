import React, { useState } from 'react';
import { Stethoscope, CheckCircle2, Bookmark, Edit3, Link2, ExternalLink, ClipboardCheck } from 'lucide-react';
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
  const isPrimaryCare = summary.patient.careSetting === 'primary_care';

  return (
    <div className="space-y-4">
      {/* 30-Second Consultation Note Executive Header - Google Style Clean Surface */}
      <div className="bg-white rounded-xl border border-[#dadce0] p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#f1f3f4]">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-medium px-2 py-0.5 rounded bg-[#f1f3f4] text-[#5f6368] border border-[#dadce0]">
                {isPrimaryCare ? 'Primary Care Encounter' : 'Secondary Care Transfer'}
              </span>
              <span className="text-xs text-[#5f6368]">
                {isPrimaryCare ? 'General Practice Clinical Record' : 'NHS Spine MESH Transfer'}
              </span>
            </div>
            <h2 className="text-xl font-semibold text-[#202124] tracking-tight mt-1">
              {isPrimaryCare
                ? 'Consultation Note & Management Plan'
                : 'Electronic Discharge Notification (eDN)'}
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                isEditing
                  ? 'bg-[#1a73e8] text-white shadow-xs border border-[#1a73e8]'
                  : 'bg-white text-[#202124] border border-[#dadce0] hover:bg-[#f1f3f4] shadow-xs'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Editing Mode Active' : 'Human-in-the-Loop Edit'}</span>
            </button>
          </div>
        </div>

        <div className="bg-[#f8f9fa] border-l-4 border-l-[#1a73e8] p-4 rounded-r-lg space-y-1">
          <span className="text-[11px] font-medium text-[#5f6368] tracking-wider uppercase block">
            {isPrimaryCare ? 'Coded Consultation Metadata' : 'PRSB Standard Protocol'}
          </span>
          <p className="text-xs text-[#3c4043] leading-relaxed">
            {isPrimaryCare
              ? `Structured encounter note formatted with SNOMED CT and ICD-10 codes for ${summary.patient.systemOrigin} electronic health record.`
              : 'Structured clinical summary formatted for NHS Spine MESH transfer with verified clinical coding.'}
          </p>
        </div>
      </div>

      {/* Primary Problem / Diagnosis */}
      <div className="bg-white rounded-xl border border-[#dadce0] p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#f1f3f4]">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#202124]">
            {isPrimaryCare ? 'Primary Consultation Diagnosis / Problem' : 'Primary Discharge Diagnosis'}
          </h3>
          {showCitations && summary.primaryDiagnosis.citationId && (
            <button
              onClick={() => onCitationClick(summary.primaryDiagnosis.citationId)}
              className="inline-flex items-center space-x-1 text-xs font-medium text-[#1a73e8] hover:underline bg-[#e8f0fe] px-2.5 py-1 rounded-md border border-[#d2e3fc] transition-colors"
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
            className="w-full text-sm font-semibold text-[#202124] border border-[#dadce0] rounded-lg p-3 focus:ring-1 focus:ring-[#1a73e8] focus:border-[#1a73e8] focus:outline-none"
          />
        ) : (
          <div className="text-base font-semibold text-[#202124]">
            {summary.primaryDiagnosis.term}
          </div>
        )}

        <div className="flex flex-wrap gap-2 pt-2 border-t border-[#f1f3f4] text-xs">
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-[#f1f3f4] text-[#3c4043] font-mono text-xs border border-[#dadce0]">
            <Bookmark className="w-3 h-3 text-[#1a73e8]" />
            <span>SNOMED CT: <b className="font-semibold text-[#202124]">{summary.primaryDiagnosis.snomedCode}</b></span>
          </span>
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-[#f1f3f4] text-[#3c4043] font-mono text-xs border border-[#dadce0]">
            <span>ICD-10: <b className="font-semibold text-[#202124]">{summary.primaryDiagnosis.icd10}</b></span>
          </span>
        </div>
      </div>

      {/* Secondary Diagnoses */}
      <div className="bg-white rounded-xl border border-[#dadce0] p-5 shadow-xs space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#202124] pb-2 border-b border-[#f1f3f4]">
          {isPrimaryCare ? 'Problem List & Co-morbidities' : 'Secondary Diagnoses & Comorbidities'}
        </h3>

        <div className="space-y-2">
          {summary.secondaryDiagnoses.map((diag, index) => (
            <div
              key={index}
              className="flex flex-wrap items-center justify-between p-3.5 rounded-lg border border-[#dadce0] bg-[#f8f9fa] hover:bg-white transition-colors"
            >
              <div className="flex-1 min-w-[220px]">
                <span className="text-xs font-medium text-[#202124]">{diag.term}</span>
              </div>
              <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                <span className="text-xs font-mono bg-white px-2 py-0.5 rounded-md text-[#5f6368] border border-[#dadce0]">
                  SNOMED: {diag.snomedCode}
                </span>
                <span className="text-xs font-mono bg-white px-2 py-0.5 rounded-md text-[#5f6368] border border-[#dadce0]">
                  ICD: {diag.icd10}
                </span>
                {showCitations && diag.citationId && (
                  <button
                    onClick={() => onCitationClick(diag.citationId)}
                    className="p-1 text-[#1a73e8] hover:bg-[#e8f0fe] rounded-md transition-colors"
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

      {/* Consultation Course / Primary Care Systems Plan */}
      <div className="bg-white rounded-xl border border-[#dadce0] p-5 shadow-xs space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#202124] pb-2 border-b border-[#f1f3f4]">
          {isPrimaryCare ? 'Consultation Course & Plan by System' : 'Hospital Course & Clinical Trajectory'}
        </h3>

        <div className="space-y-3">
          {summary.hospitalCourse.map((item, index) => (
            <div key={index} className="p-4 rounded-lg border border-[#dadce0] bg-[#f8f9fa] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1a73e8] uppercase tracking-wide">
                  {item.system}
                </span>
                {showCitations && item.citationId && (
                  <button
                    onClick={() => onCitationClick(item.citationId)}
                    className="inline-flex items-center space-x-1 text-xs font-medium text-[#1a73e8] hover:underline"
                  >
                    <Link2 className="w-3 h-3" />
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
                  className="w-full text-xs text-[#202124] bg-white border border-[#dadce0] rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-[#1a73e8] leading-relaxed"
                />
              ) : (
                <div className="space-y-1.5 pt-0.5">
                  {item.summary.split('\n').filter((l) => l.trim().length > 0).map((line, lIdx) => {
                    const cleanLine = line.replace(/^[•\-\*]\s*/, '').trim();
                    return (
                      <div key={lIdx} className="flex items-start space-x-2 text-xs text-[#3c4043]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1a73e8] mt-1.5 flex-shrink-0" />
                        <span className="leading-relaxed">{cleanLine}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Diagnostic & Therapeutic Procedures */}
      {summary.procedures && summary.procedures.length > 0 && (
        <div className="bg-white rounded-xl border border-[#dadce0] p-5 shadow-xs space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#202124] pb-2 border-b border-[#f1f3f4]">
            {isPrimaryCare ? 'Clinical Examinations & Completed Assessments' : 'Procedures & Key Investigations'}
          </h3>
          <div className="space-y-2">
            {summary.procedures.map((proc, index) => (
              <div
                key={index}
                className="flex items-start justify-between p-3.5 rounded-lg border border-[#dadce0] bg-[#f8f9fa] text-xs"
              >
                <div>
                  <div className="text-xs font-semibold text-[#202124]">{proc.name}</div>
                  <div className="text-[#5f6368] mt-1 leading-relaxed">{proc.findings}</div>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <span className="text-xs text-[#5f6368] font-mono bg-white px-2 py-0.5 rounded-md border border-[#dadce0]">{proc.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Discharge / Disposition Destination & Status */}
      <div className="bg-white rounded-xl border border-[#dadce0] p-5 shadow-xs space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#202124]">
          {isPrimaryCare ? 'Patient Disposition & Follow-Up Agreement' : 'Discharge Destination & Care Handover'}
        </h3>
        <p className="text-xs text-[#3c4043] font-medium leading-relaxed">
          {summary.dischargeDestination}
        </p>
        <div className="mt-3 flex items-center space-x-2 text-xs text-emerald-800 font-semibold bg-emerald-50 p-3 rounded-lg border border-emerald-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>
            {isPrimaryCare
              ? `Consultation Verified & Saved to ${summary.patient.systemOrigin} Medical Record by ${summary.patient.consultant}`
              : 'Patient Medically Fit for Discharge (MFFD) & Verified by Attending Consultant'}
          </span>
        </div>
      </div>
    </div>
  );
};
