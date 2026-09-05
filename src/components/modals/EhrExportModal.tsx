import React, { useState } from 'react';
import { X, Copy, Check, Monitor } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[88vh] flex flex-col border border-[#dadce0] shadow-2xl overflow-hidden animate-scale-up">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#dadce0] bg-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#e8f0fe] border border-[#d2e3fc] flex items-center justify-center text-[#1a73e8] shadow-2xs">
              <Monitor className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#202124]">
                Copy to Clinical EHR / EPR System
              </h3>
              <p className="text-xs text-[#5f6368]">Formats structured clinical text for direct electronic paste</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#5f6368] hover:text-[#202124] rounded-lg hover:bg-[#f1f3f4] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* EHR Selector Tabs */}
        <div className="px-6 py-2.5 bg-[#f8f9fa] border-b border-[#dadce0]">
          <div className="flex bg-[#f1f3f4] p-1 rounded-lg border border-[#dadce0] gap-1">
            <button
              onClick={() => setSelectedEhr('emis')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all text-center ${
                selectedEhr === 'emis'
                  ? 'bg-white text-[#1a73e8] font-semibold shadow-xs border border-[#dadce0]'
                  : 'text-[#5f6368] hover:text-[#202124] hover:bg-white/50'
              }`}
            >
              EMIS Web (GP)
            </button>
            <button
              onClick={() => setSelectedEhr('systmone')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all text-center ${
                selectedEhr === 'systmone'
                  ? 'bg-white text-[#1a73e8] font-semibold shadow-xs border border-[#dadce0]'
                  : 'text-[#5f6368] hover:text-[#202124] hover:bg-white/50'
              }`}
            >
              TPP SystmOne
            </button>
            <button
              onClick={() => setSelectedEhr('epic')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all text-center ${
                selectedEhr === 'epic'
                  ? 'bg-white text-[#1a73e8] font-semibold shadow-xs border border-[#dadce0]'
                  : 'text-[#5f6368] hover:text-[#202124] hover:bg-white/50'
              }`}
            >
              Epic Hyperspace
            </button>
          </div>
        </div>

        {/* Text Area Content */}
        <div className="p-6 flex-1 overflow-y-auto bg-white">
          <pre className="p-5 bg-[#202124] text-[#e8eaed] rounded-xl font-mono text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap select-all max-h-[42vh] border border-[#3c4043] shadow-inner">
            {generateExportText()}
          </pre>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#dadce0] bg-[#f8f9fa]">
          <span className="text-xs text-[#5f6368]">
            Compliant with NHS PRSB discharge standards.
          </span>
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#5f6368] hover:text-[#202124] rounded-lg hover:bg-[#f1f3f4] transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleCopy}
              className="inline-flex items-center space-x-2 px-5 py-2 text-xs font-semibold text-white bg-[#1a73e8] hover:bg-[#1557b0] rounded-lg shadow-xs transition-colors"
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
