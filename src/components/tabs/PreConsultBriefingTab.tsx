import React, { useState } from 'react';
import {
  CheckCircle2, Clock, AlertTriangle, Link2, Minus, TrendingDown, TrendingUp
} from 'lucide-react';
import { PreConsultBriefing, CareSetting } from '../../types/clinical';

interface PreConsultBriefingTabProps {
  briefing: PreConsultBriefing;
  careSetting: CareSetting;
  onCitationClick: (citationId: string) => void;
  showCitations: boolean;
  onToggleCareGap?: (gapId: string) => void;
}

export const PreConsultBriefingTab: React.FC<PreConsultBriefingTabProps> = ({
  briefing,
  careSetting,
  onCitationClick,
  showCitations,
}) => {
  const [completedGaps, setCompletedGaps] = useState<Record<string, boolean>>({});
  const [askedQuestions, setAskedQuestions] = useState<Record<string, boolean>>({});
  const [assessedRedFlags, setAssessedRedFlags] = useState<Record<string, boolean>>({});

  const toggleGap = (id: string) => {
    setCompletedGaps((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleQuestion = (id: string) => {
    setAskedQuestions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleRedFlag = (id: string) => {
    setAssessedRedFlags((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const isPrimaryCare = careSetting === 'primary_care';

  const getTrajectoryBadge = (trajectory: PreConsultBriefing['clinicalTrajectory']) => {
    switch (trajectory) {
      case 'improving':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-300">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            Improving Trajectory
          </span>
        );
      case 'deteriorating':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-red-50 text-red-800 border border-red-300">
            <TrendingDown className="w-3.5 h-3.5 text-red-600" />
            Deteriorating Trajectory
          </span>
        );
      case 'suboptimal':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-800 border border-amber-300">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            Suboptimal Control
          </span>
        );
      case 'stable':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-[#f1f3f4] text-[#3c4043] border border-[#dadce0]">
            <Minus className="w-3.5 h-3.5 text-[#5f6368]" />
            Stable Trajectory
          </span>
        );
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'immediate_24h':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-red-50 text-red-800 border border-red-200">
            Action Today
          </span>
        );
      case 'urgent_7d':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
            Urgent (&lt;7 days)
          </span>
        );
      case 'routine_4w':
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#f1f3f4] text-[#3c4043] border border-[#dadce0]">
            Routine (4 weeks)
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* 30-Second Pre-Consult Executive Header - Google Style Clean Surface */}
      <div className="bg-white rounded-xl border border-[#dadce0] p-6 shadow-xs space-y-5">
        {/* Title Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#f1f3f4]">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-medium px-2 py-0.5 rounded bg-[#f1f3f4] text-[#5f6368] border border-[#dadce0]">
                {isPrimaryCare ? 'Primary Care' : 'Secondary Care'}
              </span>
              <span className="text-xs text-[#5f6368]">30-Second Review</span>
            </div>
            <h2 className="text-xl font-semibold text-[#202124] tracking-tight mt-1">
              {isPrimaryCare ? 'GP Pre-Consultation Brief' : 'Ward Round Pre-Encounter Brief'}
            </h2>
          </div>

          <div>{getTrajectoryBadge(briefing.clinicalTrajectory)}</div>
        </div>

        {/* Reason for Appointment / Encounter (Highlight to draw attention) */}
        <div className="bg-[#f8f9fa] border-l-4 border-l-[#1a73e8] p-4 rounded-r-lg space-y-1">
          <span className="text-[11px] font-medium text-[#5f6368] tracking-wider uppercase block">
            {isPrimaryCare ? 'Reason for Booking / Chief Complaint' : 'Encounter Objective'}:
          </span>
          <p className="text-sm font-medium text-[#202124] leading-relaxed">
            {briefing.appointmentReason}
          </p>
        </div>

        {/* Incoming Triage Highlights (Direct Bullet Points) */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-[#202124] uppercase tracking-wider block">
            {isPrimaryCare ? 'Triage & Patient App Highlights' : 'Handover & Triage Highlights'}
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {(briefing.triageBulletPoints && briefing.triageBulletPoints.length > 0
              ? briefing.triageBulletPoints
              : briefing.triageSummary.split(/(?<=[.!?])\s+/).filter(Boolean)
            ).map((item, idx) => (
              <div key={idx} className="flex items-start space-x-2 text-xs text-[#3c4043] leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5f6368] mt-1.5 flex-shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* At-a-Glance Clinical Facts (Concise Patient Facts, Filtered) */}
        <div className="pt-4 border-t border-[#f1f3f4] space-y-2">
          <span className="text-xs font-semibold text-[#202124] uppercase tracking-wider block">
            At-a-Glance Clinical Facts
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {(briefing.executiveBulletPoints && briefing.executiveBulletPoints.length > 0
              ? briefing.executiveBulletPoints
              : briefing.executiveSummary.split(/(?<=[.!?])\s+/).filter(Boolean)
            )
              .filter(
                (bullet) =>
                  !bullet.toLowerCase().startsWith('action today') &&
                  !bullet.toLowerCase().startsWith('action:')
              )
              .map((bullet, idx) => (
                <div key={idx} className="flex items-start space-x-2 text-xs text-[#3c4043] leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#202124] mt-1.5 flex-shrink-0" />
                  <span>{bullet}</span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Physiological / Biomarker Trajectory Track */}
      <div className="bg-white rounded-xl border border-[#dadce0] p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2.5 border-b border-[#f1f3f4]">
          <div>
            <h4 className="text-xs font-semibold text-[#202124] uppercase tracking-wider">
              {briefing.physiologicalTrajectory.label}
            </h4>
            <p className="text-[11px] text-[#5f6368]">
              {isPrimaryCare ? 'Longitudinal trajectory & blood tests' : 'Inpatient observations'}
            </p>
          </div>
          <span className="text-xs text-[#5f6368]">
            {briefing.physiologicalTrajectory.history.length} Data Points
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {briefing.physiologicalTrajectory.history.map((step, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg border border-[#dadce0] bg-[#f8f9fa] space-y-1.5"
            >
              <div className="flex items-center justify-between text-[11px] text-[#5f6368]">
                <span>{step.timestamp}</span>
              </div>
              <p className="text-xs font-semibold text-[#202124]">{step.scoreOrValue}</p>

              {step.parameters && (
                <div className="pt-1.5 border-t border-[#dadce0] grid grid-cols-2 gap-1 text-[10px]">
                  {Object.entries(step.parameters).map(([key, val]) => (
                    <div key={key} className="truncate">
                      <span className="text-[#5f6368]">{key}: </span>
                      <span className="font-medium text-[#202124]">{val}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Layout: Gaps in Care & Red Flags */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Gaps in Care & Overdue Screenings */}
        <div className="bg-white rounded-xl border border-[#dadce0] p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2.5 border-b border-[#f1f3f4]">
            <div>
              <h4 className="text-xs font-semibold text-[#202124] uppercase tracking-wider">
                Gaps in Care &amp; Overdue Screenings
              </h4>
              <p className="text-[11px] text-[#5f6368]">Actionable register monitoring</p>
            </div>
            <span className="text-xs font-medium px-2 py-0.5 rounded bg-[#f1f3f4] text-[#3c4043] border border-[#dadce0]">
              {briefing.gapsInCare.length} Actionable
            </span>
          </div>

          <div className="space-y-2.5">
            {briefing.gapsInCare.map((gap) => {
              const isResolved = !!completedGaps[gap.id];

              return (
                <div
                  key={gap.id}
                  className={`p-3 rounded-lg border transition-colors ${
                    isResolved
                      ? 'bg-[#f8f9fa] border-[#dadce0] opacity-60'
                      : 'bg-white border-[#dadce0]'
                  }`}
                >
                  <div className="flex items-start space-x-2.5">
                    <button
                      onClick={() => toggleGap(gap.id)}
                      className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-colors flex-shrink-0 ${
                        isResolved
                          ? 'bg-[#1a73e8] border-[#1a73e8] text-white'
                          : 'border-[#bdc1c6] hover:border-[#1a73e8] bg-white'
                      }`}
                      title="Mark resolved"
                    >
                      {isResolved && <CheckCircle2 className="w-3 h-3" />}
                    </button>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {getUrgencyBadge(gap.urgency)}
                        <span className="text-[11px] text-[#5f6368] flex items-center">
                          <Clock className="w-3 h-3 mr-1 text-[#5f6368]" />
                          {gap.overdueDuration}
                        </span>
                      </div>
                      <h5 className={`text-xs font-medium ${isResolved ? 'line-through text-[#5f6368]' : 'text-[#202124]'}`}>
                        {gap.title}
                      </h5>
                      <p className="text-xs text-[#3c4043]">
                        <strong className="text-[#202124]">Action:</strong> {gap.recommendedAction}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Targeted Questions & Red Flags */}
        <div className="space-y-4">
          {/* Targeted Inquiries */}
          <div className="bg-white rounded-xl border border-[#dadce0] p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2.5 border-b border-[#f1f3f4]">
              <div>
                <h4 className="text-xs font-semibold text-[#202124] uppercase tracking-wider">
                  Targeted Inquiries
                </h4>
                <p className="text-[11px] text-[#5f6368]">Diagnostic prompts for this visit</p>
              </div>
              <span className="text-xs text-[#5f6368]">
                {briefing.suggestedQuestions.length} Questions
              </span>
            </div>

            <div className="space-y-2.5">
              {briefing.suggestedQuestions.map((q) => {
                const isAsked = !!askedQuestions[q.id];

                return (
                  <div
                    key={q.id}
                    className={`p-3 rounded-lg border transition-colors ${
                      isAsked
                        ? 'bg-[#f8f9fa] border-[#dadce0] opacity-60'
                        : 'bg-white border-[#dadce0]'
                    }`}
                  >
                    <div className="flex items-start space-x-2.5">
                      <button
                        onClick={() => toggleQuestion(q.id)}
                        className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-colors flex-shrink-0 ${
                          isAsked
                            ? 'bg-[#1a73e8] border-[#1a73e8] text-white'
                            : 'border-[#bdc1c6] hover:border-[#1a73e8] bg-white'
                        }`}
                        title="Mark asked"
                      >
                        {isAsked && <CheckCircle2 className="w-3 h-3" />}
                      </button>
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-[#f1f3f4] text-[#3c4043] border border-[#dadce0]">
                          {q.targetCondition}
                        </span>
                        <p className={`text-xs font-medium ${isAsked ? 'line-through text-[#5f6368]' : 'text-[#202124]'}`}>
                          &ldquo;{q.question}&rdquo;
                        </p>
                        <p className="text-[11px] text-[#5f6368]">
                          Rationale: {q.rationale}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Red Flag Checklist (COLOR draws attention to unassessed flags) */}
          <div className="bg-white rounded-xl border border-[#dadce0] p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2.5 border-b border-[#f1f3f4]">
              <div>
                <h4 className="text-xs font-semibold text-[#202124] uppercase tracking-wider">
                  Red Flag Rule-Out Checklist
                </h4>
                <p className="text-[11px] text-[#5f6368]">Critical safety-netting</p>
              </div>
              <span className="text-xs font-medium text-red-700">Safety Net</span>
            </div>

            <div className="space-y-2">
              {briefing.redFlags.map((rf) => {
                const isChecked = !!assessedRedFlags[rf.id];

                return (
                  <div
                    key={rf.id}
                    className={`p-2.5 rounded-lg border transition-colors ${
                      isChecked
                        ? 'bg-[#f8f9fa] border-[#dadce0] opacity-70'
                        : rf.status === 'requires_assessment'
                          ? 'bg-red-50/40 border-red-200'
                          : 'bg-white border-[#dadce0]'
                    }`}
                  >
                    <div className="flex items-start space-x-2.5">
                      <button
                        onClick={() => toggleRedFlag(rf.id)}
                        className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-colors flex-shrink-0 ${
                          isChecked
                            ? 'bg-[#1a73e8] border-[#1a73e8] text-white'
                            : 'border-[#bdc1c6] hover:border-red-500 bg-white'
                        }`}
                        title="Mark assessed"
                      >
                        {isChecked && <CheckCircle2 className="w-3 h-3" />}
                      </button>
                      <div className="text-xs space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-[#202124]">{rf.symptom}</span>
                          <span className={`text-[10px] font-medium px-1.5 py-0.2 rounded border ${
                            isChecked
                              ? 'bg-[#f1f3f4] text-[#5f6368] border-[#dadce0]'
                              : rf.status === 'requires_assessment'
                                ? 'bg-red-50 text-red-800 border-red-200'
                                : 'bg-[#f1f3f4] text-[#3c4043] border-[#dadce0]'
                          }`}>
                            {isChecked ? 'RULED OUT' : rf.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        <p className="text-[#5f6368]">
                          <strong className="text-[#3c4043]">Rule out:</strong> {rf.ruleOut}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Active Problem Register */}
      <div className="bg-white rounded-xl border border-[#dadce0] p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2.5 border-b border-[#f1f3f4]">
          <div>
            <h4 className="text-xs font-semibold text-[#202124] uppercase tracking-wider">
              Active Problem Register
            </h4>
            <p className="text-[11px] text-[#5f6368]">
              {isPrimaryCare ? 'Coded problem list & disease control' : 'Inpatient active diagnoses'}
            </p>
          </div>
          <span className="text-xs text-[#5f6368]">
            {briefing.activeProblemList.length} Active Problems
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {briefing.activeProblemList.map((problem) => (
            <div
              key={problem.id}
              className="p-3.5 rounded-lg border border-[#dadce0] bg-white space-y-1.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h5 className="text-xs font-semibold text-[#202124]">{problem.title}</h5>
                  {problem.snomedCode && (
                    <span className="text-[10px] font-mono text-[#5f6368]">
                      SNOMED: {problem.snomedCode}
                    </span>
                  )}
                </div>

                <span className={`text-[10px] font-medium px-2 py-0.5 rounded border flex-shrink-0 ${
                  problem.controlStatus === 'controlled'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : problem.controlStatus === 'uncontrolled'
                      ? 'bg-red-50 text-red-800 border-red-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}>
                  {problem.controlStatus.toUpperCase()}
                </span>
              </div>

              <div className="text-xs text-[#3c4043] space-y-0.5 pt-1 border-t border-[#f1f3f4]">
                <div className="flex justify-between">
                  <span className="text-[#5f6368] text-[11px]">Onset:</span>
                  <span className="font-medium text-[#202124]">{problem.onset}</span>
                </div>
                {problem.metrics && (
                  <div className="flex justify-between">
                    <span className="text-[#5f6368] text-[11px]">Key Metric:</span>
                    <span className="font-medium text-[#202124]">{problem.metrics}</span>
                  </div>
                )}
              </div>

              {showCitations && problem.citationId && (
                <div className="pt-1 flex justify-end">
                  <button
                    onClick={() => onCitationClick(problem.citationId!)}
                    className="inline-flex items-center space-x-1 text-[11px] font-medium text-[#1a73e8] hover:underline"
                  >
                    <Link2 className="w-3 h-3" />
                    <span>Evidence</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
