import React, { useState } from 'react';
import { Pill, ShieldCheck, Filter, Link2 } from 'lucide-react';
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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-300">
            <span className="w-1.5 h-1.5 rounded-sm bg-emerald-600"></span>
            STARTED
          </span>
        );
      case 'stopped':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-red-50 text-red-800 border border-red-300">
            <span className="w-1.5 h-1.5 rounded-sm bg-red-600"></span>
            STOPPED
          </span>
        );
      case 'changed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-800 border border-amber-300">
            <span className="w-1.5 h-1.5 rounded-sm bg-amber-600"></span>
            DOSE CHANGED
          </span>
        );
      case 'continued':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-[#f1f3f4] text-[#3c4043] border border-[#dadce0]">
            <span className="w-1.5 h-1.5 rounded-sm bg-[#5f6368]"></span>
            CONTINUED
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* 30-Second Reconciliation Executive Header - Google Style Clean Surface */}
      <div className="bg-white rounded-xl border border-[#dadce0] p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#f1f3f4]">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-medium px-2 py-0.5 rounded bg-[#f1f3f4] text-[#5f6368] border border-[#dadce0]">
                Prescription Safety
              </span>
              <span className="text-xs text-[#5f6368]">Admission vs. Active / Discharge TTO</span>
            </div>
            <h2 className="text-xl font-semibold text-[#202124] tracking-tight mt-1">
              Medication Reconciliation &amp; Safety Review
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-[#e8f0fe] text-[#1a73e8] border border-[#d2e3fc] flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#1a73e8]" />
              <span>{medications.length} Monitored Regimens</span>
            </span>
          </div>
        </div>

        <div className="bg-[#f8f9fa] border-l-4 border-l-[#1a73e8] p-4 rounded-r-lg space-y-1">
          <span className="text-[11px] font-medium text-[#5f6368] tracking-wider uppercase block">
            Zero-Omission Clinical Verification
          </span>
          <p className="text-xs text-[#3c4043] leading-relaxed">
            All acute medication changes, additions, and discontinuations are cross-referenced with biological investigations, renal function, and clinical encounter notes.
          </p>
        </div>
      </div>

      {/* Filter Segmented Control */}
      <div className="bg-[#f1f3f4] p-1 rounded-lg flex flex-wrap items-center gap-1 border border-[#dadce0]">
        <span className="text-xs font-medium text-[#5f6368] px-2 flex items-center space-x-1">
          <Filter className="w-3.5 h-3.5 text-[#5f6368]" />
          <span>Filter:</span>
        </span>
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
            filter === 'all'
              ? 'bg-white text-[#202124] shadow-xs border border-[#dadce0]'
              : 'text-[#5f6368] hover:text-[#202124]'
          }`}
        >
          All ({counts.all})
        </button>
        <button
          onClick={() => setFilter('started')}
          className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
            filter === 'started'
              ? 'bg-white text-emerald-800 shadow-xs border border-emerald-300 font-semibold'
              : 'text-[#5f6368] hover:text-emerald-800'
          }`}
        >
          Started ({counts.started})
        </button>
        <button
          onClick={() => setFilter('stopped')}
          className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
            filter === 'stopped'
              ? 'bg-white text-red-800 shadow-xs border border-red-300 font-semibold'
              : 'text-[#5f6368] hover:text-red-800'
          }`}
        >
          Stopped ({counts.stopped})
        </button>
        <button
          onClick={() => setFilter('changed')}
          className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
            filter === 'changed'
              ? 'bg-white text-amber-800 shadow-xs border border-amber-300 font-semibold'
              : 'text-[#5f6368] hover:text-amber-800'
          }`}
        >
          Dose Changed ({counts.changed})
        </button>
        <button
          onClick={() => setFilter('continued')}
          className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
            filter === 'continued'
              ? 'bg-white text-[#1a73e8] shadow-xs border border-[#d2e3fc] font-semibold'
              : 'text-[#5f6368] hover:text-[#1a73e8]'
          }`}
        >
          Continued ({counts.continued})
        </button>
      </div>

      {/* Medication Diff Cards */}
      <div className="space-y-3">
        {filteredMeds.map((med) => (
          <div
            key={med.id}
            className="bg-white rounded-xl border border-[#dadce0] p-5 shadow-xs space-y-3 hover:border-[#bdc1c6] transition-all"
          >
            {/* Top row: Drug Name, Route, Status Badge, Evidence Button */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#f1f3f4]">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-[#e8f0fe] border border-[#d2e3fc] flex items-center justify-center text-[#1a73e8]">
                  <Pill className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#202124]">{med.drugName}</h4>
                  <span className="text-[11px] text-[#5f6368]">Route: {med.route}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {getStatusBadge(med.status)}
                {showCitations && med.sourceCitationId && (
                  <button
                    onClick={() => onCitationClick(med.sourceCitationId!)}
                    className="inline-flex items-center space-x-1 text-xs font-medium text-[#1a73e8] hover:underline bg-[#e8f0fe] px-2.5 py-1 rounded-md border border-[#d2e3fc] transition-colors"
                    title="View clinical justification in timeline"
                  >
                    <Link2 className="w-3 h-3" />
                    <span>Evidence</span>
                  </button>
                )}
              </div>
            </div>

            {/* Dose Comparison Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg border border-[#dadce0] bg-[#f8f9fa]">
                <span className="text-[11px] font-medium text-[#5f6368] block mb-1">
                  PRE-ADMISSION (HOME) REGIMEN:
                </span>
                <div
                  className={`font-mono text-xs font-medium ${
                    med.priorDose
                      ? med.status !== 'continued'
                        ? 'line-through text-[#80868b]'
                        : 'text-[#202124]'
                      : 'text-[#80868b] italic'
                  }`}
                >
                  {med.priorDose || 'Not prescribed prior to admission'}
                </div>
              </div>

              <div
                className={`p-3 rounded-lg border ${
                  med.status === 'stopped'
                    ? 'bg-red-50/40 border-red-200 text-red-900'
                    : 'bg-emerald-50/40 border-emerald-200 text-emerald-900'
                }`}
              >
                <span className="text-[11px] font-medium text-[#5f6368] block mb-1">
                  DISCHARGE (TTO) / ACTIVE REGIMEN:
                </span>
                <div className="font-mono text-xs font-semibold">
                  {med.dischargeDose || 'DISCONTINUED (0mg)'}
                </div>
              </div>
            </div>

            {/* Clinical Rationale Box */}
            <div className="p-3 rounded-lg border border-[#dadce0] bg-[#f8f9fa] border-l-4 border-l-[#1a73e8]">
              <span className="text-[11px] font-semibold text-[#202124] uppercase tracking-wider block mb-0.5">
                Clinical Rationale:
              </span>
              <p className="text-xs text-[#3c4043] leading-relaxed">
                {med.clinicalRationale}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
