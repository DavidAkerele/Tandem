import React, { useState } from 'react';
import { Pill, ShieldCheck, Filter, AlertTriangle, ArrowRight, Link2 } from 'lucide-react';
import { MedicationDiffItem } from '../../types/clinical';

interface MedRecTabProps {
  medications: MedicationDiffItem[];
  onCitationClick: (citationId: string) => void;
  showCitations: boolean;
}

export const MedRecTab: React.FC<MedRecTabProps> = ({
  medications,
  onCitationClick,
  showCitations,
}) => {
  const [filter, setFilter] = useState<'all' | 'started' | 'stopped' | 'changed' | 'continued'>('all');

  const counts = {
    all: medications.length,
    started: medications.filter((m) => m.status === 'started').length,
    stopped: medications.filter((m) => m.status === 'stopped').length,
    changed: medications.filter((m) => m.status === 'changed').length,
    continued: medications.filter((m) => m.status === 'continued').length,
  };

  const filteredMeds = medications.filter((m) => {
    if (filter === 'all') return true;
    return m.status === filter;
  });

  const getStatusBadge = (status: MedicationDiffItem['status']) => {
    switch (status) {
      case 'started':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80">
            <span className="w-1.5 h-1.5 rounded-xs bg-emerald-600"></span>
            STARTED
          </span>
        );
      case 'stopped':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-red-50 text-red-800 border border-red-200/80">
            <span className="w-1.5 h-1.5 rounded-xs bg-red-600"></span>
            STOPPED
          </span>
        );
      case 'changed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/80">
            <span className="w-1.5 h-1.5 rounded-xs bg-amber-600"></span>
            DOSE CHANGED
          </span>
        );
      case 'continued':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-xs bg-slate-500"></span>
            CONTINUED
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Informational Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[#f0f4f9] border border-blue-100">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-100/80 flex items-center justify-center text-blue-700">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-800 block">
              Medication Reconciliation Matrix (Admission vs. Discharge TTO)
            </span>
            <span className="text-[11px] text-slate-500">
              Zero-Omission clinical verification with cross-referenced reasoning
            </span>
          </div>
        </div>
        <div className="text-xs text-slate-600 font-medium bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
          {medications.length} Monitored Regimens
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#f0f4f9] rounded-xl border border-slate-200/60">
        <span className="text-xs font-medium text-slate-500 px-2.5 flex items-center space-x-1">
          <Filter className="w-3.5 h-3.5" />
          <span>Status:</span>
        </span>
        <button
          onClick={() => setFilter('all')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${filter === 'all'
              ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
        >
          All ({counts.all})
        </button>
        <button
          onClick={() => setFilter('started')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${filter === 'started'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-emerald-800 hover:bg-emerald-100/60'
            }`}
        >
          Started ({counts.started})
        </button>
        <button
          onClick={() => setFilter('stopped')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${filter === 'stopped'
              ? 'bg-red-600 text-white shadow-xs'
              : 'text-red-800 hover:bg-red-100/60'
            }`}
        >
          Stopped ({counts.stopped})
        </button>
        <button
          onClick={() => setFilter('changed')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${filter === 'changed'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-amber-800 hover:bg-amber-100/60'
            }`}
        >
          Dose Changed ({counts.changed})
        </button>
        <button
          onClick={() => setFilter('continued')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${filter === 'continued'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-blue-800 hover:bg-blue-100/60'
            }`}
        >
          Continued ({counts.continued})
        </button>
      </div>

      {/* Medication Diff Cards (Generous Box Padding) */}
      <div className="space-y-4">
        {filteredMeds.map((med) => (
          <div
            key={med.id}
            className={`bg-white rounded-2xl border p-6 shadow-2xs transition-all hover:shadow-xs ${med.status === 'stopped'
                ? 'border-red-200 bg-red-50/10'
                : med.status === 'started'
                  ? 'border-emerald-200 bg-emerald-50/10'
                  : med.status === 'changed'
                    ? 'border-amber-200 bg-amber-50/10'
                    : 'border-slate-200/80'
              }`}
          >
            {/* Top row: Drug Name, Status Badge, Citation Button */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Pill className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-slate-900">{med.drugName}</h4>
                  <span className="text-xs text-slate-500">Route: {med.route}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2.5">
                {getStatusBadge(med.status)}
                {showCitations && med.sourceCitationId && (
                  <button
                    onClick={() => onCitationClick(med.sourceCitationId!)}
                    className="inline-flex items-center space-x-1.5 text-xs font-medium text-blue-700 hover:text-blue-900 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 transition-colors"
                    title="View clinical justification in timeline"
                  >
                    <Link2 className="w-3 h-3" />
                    <span>Evidence</span>
                  </button>
                )}
              </div>
            </div>

            {/* Dose Comparison Grid (Roomy 2-column layout) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-100 text-xs">
              <div className="p-4 rounded-xl bg-[#f8fafd] border border-slate-200/70">
                <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                  PRE-ADMISSION (HOME) REGIMEN:
                </span>
                <div
                  className={`font-mono text-xs font-medium ${med.priorDose ? (med.status !== 'continued' ? 'line-through text-slate-400' : 'text-slate-800') : 'text-slate-400 italic'
                    }`}
                >
                  {med.priorDose || 'Not prescribed prior to admission'}
                </div>
              </div>

              <div
                className={`p-4 rounded-xl border ${med.status === 'stopped'
                    ? 'bg-red-50/40 border-red-200 text-red-900'
                    : 'bg-[#f0fdf4]/50 border-emerald-200 text-emerald-900'
                  }`}
              >
                <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                  DISCHARGE (TTO) REGIMEN:
                </span>
                <div className="font-mono text-xs font-semibold">
                  {med.dischargeDose || 'DISCONTINUED (0mg)'}
                </div>
              </div>
            </div>

            {/* Clinical Rationale Box (Generous Padding) */}
            <div className="mt-4 p-4 rounded-xl bg-[#f8fafd] border border-slate-200/70">
              <div className="flex items-start space-x-2">
                <span className="text-xs font-bold text-slate-700 block mb-0.5">Clinical Rationale:</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                {med.clinicalRationale}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
