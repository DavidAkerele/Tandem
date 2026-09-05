import React, { useState } from 'react';
import {
  Calendar, Clock, AlertTriangle, Maximize2, X, ChevronDown, ChevronUp
} from 'lucide-react';
import { TimelineEvent } from '../types/clinical';

interface TimelineEventCardProps {
  event: TimelineEvent;
  isCited: boolean;
  isPrimaryCare: boolean;
  onInspectConflict?: (contradictionId: string) => void;
}

export const TimelineEventCard: React.FC<TimelineEventCardProps> = ({
  event,
  isCited,
  isPrimaryCare,
  onInspectConflict,
}) => {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const isLongContent = event.content.length > 200;
  const displayContent = isLongContent && !isExpanded
    ? `${event.content.slice(0, 180)}...`
    : event.content;

  const hasContradiction = Boolean(event.contradictionId);

  return (
    <>
      <div
        id={`timeline-${event.id}`}
        className={`relative transition-all rounded-xl p-4 border bg-white ${
          hasContradiction
            ? 'border-red-300 border-l-4 border-l-red-600 bg-red-50/10 shadow-xs'
            : isCited
            ? 'border-[#1a73e8] border-l-4 shadow-sm ring-1 ring-[#1a73e8]/20 bg-blue-50/10'
            : 'border-[#dadce0] hover:border-[#bdc1c6]'
        }`}
      >
        {/* Timeline Dot */}
        <div
          className={`absolute -left-[26px] top-4 w-3 h-3 rounded-full border-2 bg-white ${
            hasContradiction
              ? 'border-red-600 bg-red-600'
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
              {isPrimaryCare
                ? event.dayNumber < 0
                  ? `${Math.abs(event.dayNumber)}d ago`
                  : 'Current'
                : `Day ${event.dayNumber}`}
            </span>
          </div>

          <div className="flex items-center space-x-1.5 text-[11px] text-[#5f6368]">
            <span>{event.date}</span>
            <span>•</span>
            <span>{event.time}</span>
          </div>
        </div>

        {/* Event Title */}
        <h4 className="text-sm font-medium text-[#202124] leading-snug">
          {event.title}
        </h4>

        {/* Author / Source */}
        <p className="text-[11px] text-[#5f6368] mt-0.5">
          {event.author}
          {event.sourceDocument && (
            <span className="ml-1 text-[#5f6368]">
              • {event.sourceDocument.name}
            </span>
          )}
        </p>

        {/* Event Text (Clamped with smooth expander to avoid overloading) */}
        <div className="text-xs text-[#3c4043] mt-2 leading-relaxed whitespace-pre-line bg-[#f8f9fa] p-3 rounded-lg border border-[#e8eaed]">
          {displayContent}
          {isLongContent && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-1.5 inline-flex items-center text-[11px] font-medium text-[#1a73e8] hover:underline"
            >
              {isExpanded ? (
                <>
                  <span>Show less</span>
                  <ChevronUp className="w-3 h-3 ml-0.5" />
                </>
              ) : (
                <>
                  <span>Read full note</span>
                  <ChevronDown className="w-3 h-3 ml-0.5" />
                </>
              )}
            </button>
          )}
        </div>

        {/* Contradiction Alert Box */}
        {event.contradictionId && (
          <div className="mt-2.5 p-2.5 rounded-lg bg-red-50 border border-red-200 flex items-center justify-between gap-2">
            <div className="flex items-center space-x-1.5 text-xs font-semibold text-red-900">
              <AlertTriangle className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
              <span>Cross-Record Contradiction Detected</span>
            </div>
            {onInspectConflict && (
              <button
                onClick={() => onInspectConflict(event.contradictionId!)}
                className="text-[11px] font-bold text-red-700 hover:text-red-900 underline flex-shrink-0 cursor-pointer"
              >
                Inspect Conflict →
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
            <div className="px-3 py-1.5 bg-white border-t border-[#dadce0] flex items-center justify-between text-[11px] text-[#3c4043]">
              <span className="font-medium truncate pr-2">
                {event.imageCaption || event.title}
              </span>
              <span className="text-[#1a73e8] font-medium cursor-pointer" onClick={() => setIsImageModalOpen(true)}>
                View scan
              </span>
            </div>
          </div>
        )}

        {/* Abnormal Alert Tags (Color strictly where attention is drawn) */}
        {event.abnormalFlags && event.abnormalFlags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {event.abnormalFlags.map((flag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-red-50 text-red-800 border border-red-200"
              >
                <AlertTriangle className="w-3 h-3 text-red-600 flex-shrink-0" />
                <span>{flag}</span>
              </span>
            ))}
          </div>
        )}

        {/* Key Findings (Neutral quiet tags) */}
        {event.keyFindings && event.keyFindings.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {event.keyFindings.map((finding, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md text-[11px] bg-[#f1f3f4] text-[#3c4043] border border-[#dadce0]"
              >
                {finding}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {isImageModalOpen && event.imageUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setIsImageModalOpen(false)}
        >
          <div
            className="relative max-w-2xl w-full bg-white rounded-xl overflow-hidden border border-[#dadce0] shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#dadce0]">
              <div>
                <h3 className="text-sm font-semibold text-[#202124]">{event.title}</h3>
                <p className="text-xs text-[#5f6368]">{event.imageCaption || 'Diagnostic Scan'}</p>
              </div>
              <button
                onClick={() => setIsImageModalOpen(false)}
                className="p-1 text-[#5f6368] hover:text-[#202124] rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-2 bg-black flex items-center justify-center max-h-[65vh]">
              <img
                src={event.imageUrl}
                alt={event.imageCaption || event.title}
                className="max-h-[60vh] w-auto object-contain"
              />
            </div>
            <div className="px-4 py-2.5 bg-[#f8f9fa] border-t border-[#dadce0] text-xs text-[#5f6368] flex items-center justify-between">
              <span>{event.date} • {event.author}</span>
              <span className="text-[#1a73e8] font-medium">Verified PACS Scan</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
