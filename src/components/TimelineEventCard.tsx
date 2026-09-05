import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  AlertTriangle,
  Maximize2,
  X,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Sparkles,
  ShieldAlert,
  Server,
  UserCheck,
  Cpu,
} from 'lucide-react';
import { TimelineEvent, DataContradiction } from '../types/clinical';

interface TimelineEventCardProps {
  event: TimelineEvent;
  isCited: boolean;
  isPrimaryCare: boolean;
  contradictions?: DataContradiction[];
  onInspectConflict?: (contradictionId: string) => void;
}

export const TimelineEventCard: React.FC<TimelineEventCardProps> = ({
  event,
  isCited,
  isPrimaryCare,
  contradictions,
  onInspectConflict,
}) => {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const isLongContent = event.content.length > 200;
  const displayContent =
    isLongContent && !isExpanded ? `${event.content.slice(0, 180)}...` : event.content;

  // Resolve matching contradiction state
  const associatedConflict = contradictions?.find((c) => c.id === event.contradictionId);
  const isConflictResolved = associatedConflict?.isResolved ?? false;

  // An item is actively flagged ONLY if it has an unresolved contradiction or unresolved flag
  const isActivelyFlagged =
    (Boolean(event.contradictionId) && !isConflictResolved) ||
    (Boolean(event.isFlagged) && !isConflictResolved);

  // If it was flagged but has been fixed, it stops being flagged as an active hazard
  const isFlagResolved =
    (Boolean(event.contradictionId) || Boolean(event.isFlagged)) && isConflictResolved;

  const isHallucination =
    event.flagType === 'ai_hallucination' ||
    associatedConflict?.errorOrigin === 'ai_hallucination';

  return (
    <>
      <div
        id={`timeline-${event.id}`}
        className={`relative transition-all rounded-xl p-4 border bg-white ${
          isActivelyFlagged
            ? 'border-red-300 border-l-4 border-l-[#d93025] bg-red-50/15 shadow-xs'
            : isFlagResolved
            ? 'border-emerald-200 border-l-4 border-l-emerald-600 bg-white hover:border-[#bdc1c6]'
            : isCited
            ? 'border-[#1a73e8] border-l-4 shadow-sm ring-1 ring-[#1a73e8]/20 bg-blue-50/10'
            : 'border-[#dadce0] hover:border-[#bdc1c6]'
        }`}
      >
        {/* Timeline Dot */}
        <div
          className={`absolute -left-[26px] top-4 w-3 h-3 rounded-full border-2 bg-white transition-colors ${
            isActivelyFlagged
              ? 'border-[#d93025] bg-[#d93025]'
              : isFlagResolved
              ? 'border-emerald-600 bg-emerald-600'
              : isCited
              ? 'border-[#1a73e8] bg-[#1a73e8]'
              : 'border-[#bdc1c6]'
          }`}
        />

        {/* Header Row: Category Badge, Timing & Date */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#f1f3f4] text-[#3c4043] border border-[#dadce0] capitalize">
              {event.category.replace('_', ' ')}
            </span>
            <span className="text-[11px] font-medium text-[#5f6368]">
              {isPrimaryCare ? event.date : `Day ${event.dayNumber} • ${event.date}`}
            </span>
          </div>

          <div className="flex items-center space-x-2 text-[11px] text-[#5f6368]">
            <Clock className="w-3 h-3" />
            <span>{event.time}</span>
          </div>
        </div>

        {/* Event Title */}
        <h4 className="text-xs font-semibold text-[#202124] leading-snug mb-1">
          {event.title}
        </h4>

        {/* Author / Clinical Role */}
        <p className="text-[11px] text-[#5f6368] mb-2 font-medium">
          Author: {event.author}
          {event.facility && <span> • {event.facility}</span>}
        </p>

        {/* Event Content / Narrative Text */}
        <div className="text-xs text-[#3c4043] leading-relaxed bg-[#f8f9fa] rounded-lg p-2.5 border border-[#f1f3f4] font-mono whitespace-pre-wrap">
          {displayContent}
          {isLongContent && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-1.5 inline-flex items-center space-x-1 text-[11px] font-medium text-[#1a73e8] hover:underline focus:outline-none cursor-pointer"
            >
              <span>{isExpanded ? 'Show less' : 'Read full note'}</span>
              {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          )}
        </div>

        {/* Key Clinical Findings */}
        {event.keyFindings && event.keyFindings.length > 0 && (
          <div className="mt-2 space-y-1">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-[#5f6368]">
              Key Findings
            </div>
            <ul className="list-disc list-inside text-xs text-[#3c4043] space-y-0.5 pl-1">
              {event.keyFindings.map((finding, idx) => (
                <li key={idx} className="leading-snug">{finding}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Metrics / Key-Value Pairs */}
        {event.metrics && Object.keys(event.metrics).length > 0 && (
          <div className="mt-2.5 grid grid-cols-2 gap-1.5 pt-2 border-t border-[#dadce0]">
            {Object.entries(event.metrics).map(([key, val]) => (
              <div key={key} className="bg-white px-2 py-1 rounded border border-[#dadce0] text-[11px]">
                <span className="text-[#5f6368] font-medium">{key}: </span>
                <span className="text-[#202124] font-semibold">{val}</span>
              </div>
            ))}
          </div>
        )}

        {/* Active Flag Alert Box (Shown only when NOT resolved) */}
        {isActivelyFlagged && (
          <div className="mt-2.5 p-2.5 rounded-lg bg-red-50 border border-red-200 flex items-center justify-between gap-2">
            <div className="flex items-center space-x-1.5 text-xs font-semibold text-red-900">
              {isHallucination ? (
                <Sparkles className="w-3.5 h-3.5 text-purple-700 flex-shrink-0" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
              )}
              <span>
                {isHallucination
                  ? 'AI Hallucination Drift Flagged'
                  : 'Cross-Record Contradiction Detected'}
              </span>
            </div>
            {onInspectConflict && event.contradictionId && (
              <button
                onClick={() => onInspectConflict(event.contradictionId!)}
                className="text-[11px] font-bold text-red-700 hover:text-red-900 underline flex-shrink-0 cursor-pointer"
              >
                Audit &amp; Reconcile →
              </button>
            )}
          </div>
        )}

        {/* Resolved Safety Flag (Replaces active red warning when resolved) */}
        {isFlagResolved && (
          <div className="mt-2.5 p-2 rounded-lg bg-emerald-50/70 border border-emerald-200 flex items-start justify-between gap-2 text-xs">
            <div className="flex items-start space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="flex items-center space-x-1.5 flex-wrap">
                  <span className="font-semibold text-emerald-950">Safety Flag Reconciled &amp; Audited</span>
                  <span className="text-[10px] text-emerald-800 font-mono">
                    ({associatedConflict?.resolvedBy || 'Dr. Alex Smith'})
                  </span>
                </div>
                {associatedConflict?.resolutionNotes && (
                  <p className="text-[11px] text-emerald-800 italic mt-0.5 leading-snug">
                    &ldquo;{associatedConflict.resolutionNotes}&rdquo;
                  </p>
                )}
              </div>
            </div>
            {onInspectConflict && event.contradictionId && (
              <button
                onClick={() => onInspectConflict(event.contradictionId!)}
                className="text-[10px] font-semibold text-emerald-800 hover:text-emerald-950 underline flex-shrink-0 cursor-pointer"
              >
                Audit Log →
              </button>
            )}
          </div>
        )}

        {/* Embedded Diagnostic Image Thumbnail */}
        {event.imageUrl && (
          <div className="mt-2.5 rounded-lg overflow-hidden border border-[#dadce0] bg-[#f8f9fa]">
            <div
              className="relative aspect-[16/9] max-h-36 w-full overflow-hidden flex items-center justify-center cursor-pointer group bg-black"
              onClick={() => setIsImageModalOpen(true)}
            >
              <img
                src={event.imageUrl}
                alt={event.imageCaption || event.title}
                className="w-full h-full object-cover object-center group-hover:opacity-90 transition-opacity"
                loading="lazy"
              />
              <div className="absolute top-2 right-2 p-1 rounded bg-black/70 text-white hover:bg-black transition-colors">
                <Maximize2 className="w-3 h-3" />
              </div>
            </div>
            {event.imageCaption && (
              <p className="p-1.5 text-[11px] text-[#5f6368] italic border-t border-[#dadce0] bg-white">
                {event.imageCaption}
              </p>
            )}
          </div>
        )}

        {/* Abnormal Flags Badges */}
        {event.abnormalFlags && event.abnormalFlags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {event.abnormalFlags.map((flag, idx) => (
              <span
                key={idx}
                className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-red-50 text-red-800 border border-red-200"
              >
                ⚠️ {flag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* High-Resolution Diagnostic Scan Lightbox Modal */}
      {isImageModalOpen && event.imageUrl && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full bg-[#202124] rounded-2xl overflow-hidden border border-[#5f6368] shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-4 border-b border-[#3c4043] bg-[#303134] text-white">
              <div>
                <h3 className="text-sm font-semibold">{event.title} — PACS Diagnostic Scan</h3>
                <p className="text-xs text-[#9aa0a6]">{event.date} • {event.time} • {event.author}</p>
              </div>
              <button
                onClick={() => setIsImageModalOpen(false)}
                className="p-1.5 rounded-lg text-[#9aa0a6] hover:text-white hover:bg-[#3c4043] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 flex-1 flex items-center justify-center overflow-auto bg-black">
              <img
                src={event.imageUrl}
                alt={event.imageCaption || event.title}
                className="max-h-[70vh] w-auto object-contain rounded"
              />
            </div>
            {event.imageCaption && (
              <div className="p-3 bg-[#303134] border-t border-[#3c4043] text-xs text-[#e8eaed] text-center">
                {event.imageCaption}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
