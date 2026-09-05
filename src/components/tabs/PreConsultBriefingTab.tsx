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
  const [assessedRedFlags, setAssessedRedFlags] = useState<Record<string, boolean>>({});
  const [selectedPointIndex, setSelectedPointIndex] = useState<number>(
    Math.max(0, briefing.physiologicalTrajectory.history.length - 1)
  );

  const toggleGap = (id: string) => {
    setCompletedGaps((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleRedFlag = (id: string) => {
    setAssessedRedFlags((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const isPrimaryCare = careSetting === 'primary_care';

  const history = briefing.physiologicalTrajectory.history;

  // Extract numeric values for graphical trajectory
  const parsedPoints = history.map((h, i) => {
    const match = String(h.scoreOrValue).match(/(\d+(\.\d+)?)/);
    const num = match ? parseFloat(match[1]) : i + 1;
    return {
      index: i,
      timestamp: h.timestamp,
      raw: h.scoreOrValue,
      num,
      parameters: h.parameters,
      badgeColor: h.badgeColor,
    };
  });

  const numericValues = parsedPoints.map((p) => p.num);
  const minVal = Math.min(...numericValues);
  const maxVal = Math.max(...numericValues);
  const valRange = maxVal - minVal === 0 ? 1 : maxVal - minVal;

  const chartWidth = 640;
  const chartHeight = 110;
  const paddingX = 42;
  const paddingY = 22;
  const usableWidth = chartWidth - paddingX * 2;
  const usableHeight = chartHeight - paddingY * 2;

  const svgCoords = parsedPoints.map((p, idx) => {
    const x = paddingX + (idx / Math.max(1, parsedPoints.length - 1)) * usableWidth;
    const y = chartHeight - paddingY - ((p.num - minVal) / valRange) * usableHeight;
    return { x, y, ...p };
  });

  const pathD = svgCoords.length > 0
    ? `M ${svgCoords.map((c) => `${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(' L ')}`
    : '';

  const areaD = svgCoords.length > 0
    ? `${pathD} L ${svgCoords[svgCoords.length - 1].x.toFixed(1)},${chartHeight - paddingY} L ${svgCoords[0].x.toFixed(1)},${chartHeight - paddingY} Z`
    : '';

  const totalGaps = briefing.gapsInCare.length;
  const resolvedGapsCount = briefing.gapsInCare.filter((g) => completedGaps[g.id]).length;
  const percentGapsResolved = totalGaps > 0 ? Math.round((resolvedGapsCount / totalGaps) * 100) : 100;

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

      {/* Physiological / Biomarker Trajectory Track with Interactive SVG Chart */}
      <div className="bg-white rounded-xl border border-[#dadce0] p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2.5 border-b border-[#f1f3f4]">
          <div>
            <h4 className="text-xs font-semibold text-[#202124] uppercase tracking-wider">
              {briefing.physiologicalTrajectory.label}
            </h4>
            <p className="text-[11px] text-[#5f6368]">
              {isPrimaryCare
                ? 'Longitudinal clinical biomarker progression curve'
                : 'Inpatient physiological trajectory & recovery curve'}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#e8f0fe] text-[#1a73e8] border border-[#d2e3fc]">
              Interactive Telemetry Curve
            </span>
            <span className="text-xs text-[#5f6368]">
              {briefing.physiologicalTrajectory.history.length} Intervals
            </span>
          </div>
        </div>

        {/* SVG Longitudinal Trend Graph */}
        <div className="p-3 rounded-lg border border-[#dadce0] bg-[#f8f9fa] overflow-hidden">
          <div className="flex items-center justify-between text-[11px] text-[#5f6368] mb-1">
            <span className="font-medium text-[#202124]">
              {briefing.physiologicalTrajectory.type === 'chronic_disease'
                ? 'Metabolic Target Band (Ref: NICE NG28)'
                : 'Surgical Acuity & NEWS2 Recovery Target'}
            </span>
            <span className="text-[10px] text-[#5f6368]">Click data node to inspect intervals</span>
          </div>

          <div className="w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-28 overflow-visible"
              aria-label="Longitudinal Trajectory Chart"
            >
              <defs>
                <linearGradient id="traj-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1a73e8" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#1a73e8" stopOpacity="0.01" />
                </linearGradient>
              </defs>

              {/* Background Grid Lines */}
              <line
                x1={paddingX}
                y1={paddingY}
                x2={chartWidth - paddingX}
                y2={paddingY}
                stroke="#dadce0"
                strokeDasharray="3 3"
                strokeWidth="1"
              />
              <line
                x1={paddingX}
                y1={chartHeight / 2}
                x2={chartWidth - paddingX}
                y2={chartHeight / 2}
                stroke="#dadce0"
                strokeDasharray="3 3"
                strokeWidth="1"
              />
              <line
                x1={paddingX}
                y1={chartHeight - paddingY}
                x2={chartWidth - paddingX}
                y2={chartHeight - paddingY}
                stroke="#dadce0"
                strokeWidth="1"
              />

              {/* Area fill */}
              {areaD && <path d={areaD} fill="url(#traj-grad)" />}

              {/* Trend line */}
              {pathD && (
                <path
                  d={pathD}
                  fill="none"
                  stroke="#1a73e8"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Nodes and Value Labels */}
              {svgCoords.map((pt) => {
                const isSelected = selectedPointIndex === pt.index;

                return (
                  <g
                    key={pt.index}
                    className="cursor-pointer transition-all"
                    onClick={() => setSelectedPointIndex(pt.index)}
                  >
                    {/* Value Badge Text Above Node */}
                    <text
                      x={pt.x}
                      y={pt.y - 8}
                      textAnchor="middle"
                      className={`text-[10px] font-semibold select-none ${
                        isSelected ? 'fill-[#1a73e8]' : 'fill-[#202124]'
                      }`}
                    >
                      {pt.num}
                    </text>

                    {/* Outer Glow / Ring for Selected */}
                    {isSelected && (
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="7"
                        fill="#e8f0fe"
                        stroke="#1a73e8"
                        strokeWidth="2"
                      />
                    )}

                    {/* Core Point Circle */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isSelected ? "4" : "3"}
                      fill={isSelected ? "#1a73e8" : "#ffffff"}
                      stroke="#1a73e8"
                      strokeWidth="2"
                    />

                    {/* Timestamp label on axis */}
                    <text
                      x={pt.x}
                      y={chartHeight - 4}
                      textAnchor="middle"
                      className="text-[9px] fill-[#5f6368] select-none"
                    >
                      {pt.timestamp.split('(')[0].trim()}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Data Cards for Intervals */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {briefing.physiologicalTrajectory.history.map((step, idx) => {
            const isSelected = selectedPointIndex === idx;

            return (
              <div
                key={idx}
                onClick={() => setSelectedPointIndex(idx)}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#1a73e8] bg-white ring-1 ring-[#1a73e8] shadow-xs'
                    : 'border-[#dadce0] bg-[#f8f9fa] hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] text-[#5f6368]">
                  <span className="font-medium">{step.timestamp}</span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-[#1a73e8]" />
                  )}
                </div>
                <p className="text-xs font-semibold text-[#202124] mt-1">{step.scoreOrValue}</p>

                {step.parameters && (
                  <div className="pt-1.5 border-t border-[#dadce0] grid grid-cols-2 gap-1 text-[10px] mt-1.5">
                    {Object.entries(step.parameters).map(([key, val]) => (
                      <div key={key} className="truncate">
                        <span className="text-[#5f6368]">{key}: </span>
                        <span className="font-medium text-[#202124]">{val}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
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

            {/* Care Gap Resolution Ring Gauge */}
            <div className="flex items-center space-x-3">
              <div className="relative w-8 h-8 flex items-center justify-center flex-shrink-0" title={`${percentGapsResolved}% resolved`}>
                <svg className="w-8 h-8 -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-[#dadce0]"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-[#1a73e8] transition-all duration-500"
                    strokeDasharray={`${percentGapsResolved}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-[9px] font-bold text-[#202124]">
                  {percentGapsResolved}%
                </span>
              </div>
              <span className="text-xs font-medium px-2 py-0.5 rounded bg-[#f1f3f4] text-[#3c4043] border border-[#dadce0]">
                {totalGaps - resolvedGapsCount} Overdue
              </span>
            </div>
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
