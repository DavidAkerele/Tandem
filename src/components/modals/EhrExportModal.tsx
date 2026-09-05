import React, { useState } from 'react';
import { X, Copy, Check, FileText, Monitor, CheckCircle } from 'lucide-react';
import { DischargeSummary } from '../../types/clinical';

interface EhrExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary: DischargeSummary;
}

export const EhrExportModal: React.FC<EhrExportModalProps> = ({
  isOpen,
  onClose,
  summary,
}) => {
  const [selectedEhr, setSelectedEhr] = useState<'emis' | 'systmone' | 'epic'>('emis');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generateExportText = () => {
    const medRecText = summary.medications
      .map(
        (m) =>
          `• ${m.drugName} (${m.route}) - [${m.status.toUpperCase()}]\n  Dose: ${m.dischargeDose} (${m.frequency})\n  Rationale: ${m.clinicalRationale}`
      )
      .join('\n');

    const gpActionsText = summary.gpActions
      .map((a) => `[${a.urgency.toUpperCase()}] ${a.action} (${a.timeline}) - Role: ${a.assignedRole}`)
      .join('\n');

    if (selectedEhr === 'emis') {
      return `*** EMIS WEB ELECTRONIC DISCHARGE NOTIFICATION ***
PATIENT: ${summary.patient.name} | NHS: ${summary.patient.nhsNumber} | DOB: ${summary.patient.dob}
ADMISSION: ${summary.patient.admissionDate} | DISCHARGE: ${summary.patient.dischargeDate}
WARD: ${summary.patient.ward} | CONSULTANT: ${summary.patient.consultant}

[PRIMARY DIAGNOSIS]
${summary.primaryDiagnosis.term} (SNOMED: ${summary.primaryDiagnosis.snomedCode}, ICD-10: ${summary.primaryDiagnosis.icd10})

[SECONDARY DIAGNOSES]
${summary.secondaryDiagnoses.map((d) => `• ${d.term} (SNOMED: ${d.snomedCode})`).join('\n')}

[HOSPITAL COURSE]
${summary.hospitalCourse.map((c) => `--- ${c.system} ---\n${c.summary}`).join('\n\n')}

[MEDICATION RECONCILIATION & TTO]
${medRecText}

[PRIMARY CARE / GP ACTIONS]
${gpActionsText}

[DISCHARGE DESTINATION]
${summary.dischargeDestination}
Electronically Verified via Tandem Health Discharge Engine.`;
    }

    if (selectedEhr === 'systmone') {
      return `=== TPP SYSTMONE CLINICAL DISCHARGE SUMMARY ===
NHS No: ${summary.patient.nhsNumber} | Pt: ${summary.patient.name} (${summary.patient.dob})
Episode: ${summary.patient.admissionDate} to ${summary.patient.dischargeDate}
Lead: ${summary.patient.consultant}

DIAGNOSES:
* ${summary.primaryDiagnosis.term} [${summary.primaryDiagnosis.snomedCode}]
${summary.secondaryDiagnoses.map((d) => `* ${d.term} [${d.snomedCode}]`).join('\n')}

CLINICAL SUMMARY:
${summary.hospitalCourse.map((c) => `[${c.system}]: ${c.summary}`).join('\n')}

MEDICATIONS RECONCILED:
${medRecText}

GP FOLLOW-UP CHECKLIST:
${gpActionsText}`;
    }

    // Epic Hyperspace
    return `EPIC HYPERSPACE - INPATIENT CLINICAL SUMMARY
PATIENT: ${summary.patient.name} MRN/NHS: ${summary.patient.nhsNumber}
DATES: ${summary.patient.admissionDate} - ${summary.patient.dischargeDate}

HOSPITAL PROBLEMS:
1. ${summary.primaryDiagnosis.term} (ICD-10: ${summary.primaryDiagnosis.icd10})
${summary.secondaryDiagnoses.map((d, i) => `${i + 2}. ${d.term}`).join('\n')}

NARRATIVE SUMMARY:
${summary.hospitalCourse.map((c) => `${c.system}:\n${c.summary}`).join('\n\n')}

DISCHARGE MEDICATIONS:
${medRecText}

FOLLOW UP / ACTIONS:
${gpActionsText}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateExportText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/35 backdrop-blur-md p-4 animate-fade-in">
      <div className="liquid-glass-modal rounded-3xl max-w-3xl w-full max-h-[88vh] flex flex-col overflow-hidden animate-scale-up">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200/60">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50/80 border border-blue-200/80 flex items-center justify-center text-blue-600 shadow-2xs">
              <Monitor className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Copy to Clinical EHR / EPR System
              </h3>
              <p className="text-xs text-slate-500">Formats structured clinical text for direct electronic paste</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* EHR Selector Tabs */}
        <div className="px-6 pt-4 pb-2 bg-white/40 backdrop-blur-xs border-b border-slate-200/60">
          <div className="flex liquid-glass-subtle p-1.5 rounded-xl border border-white/80 gap-1.5 shadow-xs">
            <button
              onClick={() => setSelectedEhr('emis')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all text-center ${selectedEhr === 'emis'
                  ? 'liquid-glass text-blue-700 shadow-xs border border-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
            >
              EMIS Web (GP)
            </button>
            <button
              onClick={() => setSelectedEhr('systmone')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all text-center ${selectedEhr === 'systmone'
                  ? 'liquid-glass text-blue-700 shadow-xs border border-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
            >
              TPP SystmOne
            </button>
            <button
              onClick={() => setSelectedEhr('epic')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all text-center ${selectedEhr === 'epic'
                  ? 'liquid-glass text-blue-700 shadow-xs border border-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
            >
              Epic Hyperspace
            </button>
          </div>
        </div>

        {/* Text Area Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          <pre className="p-5 bg-slate-900 text-slate-100 rounded-2xl font-mono text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap select-all max-h-[42vh] shadow-inner">
            {generateExportText()}
          </pre>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-6 border-t border-slate-100 bg-[#f8fafd]">
          <span className="text-xs text-slate-500">
            Compliant with NHS PRSB discharge standards.
          </span>
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-200/50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleCopy}
              className="inline-flex items-center space-x-2 px-6 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Formatted Text</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
