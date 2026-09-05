import React, { useState } from 'react';
import {
  Calendar, Clock, User, AlertCircle, PlusCircle,
  FlaskConical, Stethoscope, Pill, ShieldAlert, FileText,
  FileUp, FileSearch, Microscope
} from 'lucide-react';
import { PatientDemographics, TimelineEvent } from '../types/clinical';
import { AddWardNoteModal } from './modals/AddWardNoteModal';

interface TimelineFeedProps {
  patient: PatientDemographics;
  timeline: TimelineEvent[];
  activeCitationId: string | null;
  onAddNote: (newNote: Omit<TimelineEvent, 'id'>) => void;
}

export const TimelineFeed: React.FC<TimelineFeedProps> = ({
  patient,
  timeline,
  activeCitationId,
  onAddNote,
}) => {
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'manual' | 'pdf'>('manual');
  const [droppedFile, setDroppedFile] = useState<File | null>(null);
  const [isDraggingOverTimeline, setIsDraggingOverTimeline] = useState(false);

  const getCategoryIcon = (category: TimelineEvent['category']) => {
    switch (category) {
      case 'admission':
        return <AlertCircle className="w-3.5 h-3.5 text-amber-600" />;
      case 'labs':
        return <FlaskConical className="w-3.5 h-3.5 text-blue-600" />;
      case 'medication':
        return <Pill className="w-3.5 h-3.5 text-emerald-600" />;
      case 'radiology':
        return <FileSearch className="w-3.5 h-3.5 text-indigo-600" />;
      case 'microbiology':
        return <Microscope className="w-3.5 h-3.5 text-purple-600" />;
      case 'ward_round':
      default:
        return <Stethoscope className="w-3.5 h-3.5 text-blue-700" />;
    }
  };

  const getCategoryBadge = (category: TimelineEvent['category']) => {
    switch (category) {
      case 'admission':
        return 'bg-amber-50 text-amber-800 border-amber-200/80';
      case 'labs':
        return 'bg-blue-50 text-blue-800 border-blue-200/80';
      case 'medication':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200/80';
      case 'radiology':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200/80';
      case 'microbiology':
        return 'bg-purple-50 text-purple-800 border-purple-200/80';
      case 'ward_round':
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const handleOpenModal = (mode: 'manual' | 'pdf') => {
    setModalMode(mode);
    setDroppedFile(null);
    setIsAddNoteModalOpen(true);
  };

  const handleTimelineDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOverTimeline(true);
  };

  const handleTimelineDragLeave = () => {
    setIsDraggingOverTimeline(false);
  };

  const handleTimelineDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOverTimeline(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setDroppedFile(file);
      setModalMode('pdf');
      setIsAddNoteModalOpen(true);
    }
  };

  return (
    <div className="h-full min-h-0 flex flex-col space-y-4">
      {/* Patient Demographic Card (Fixed position, liquid glass card) */}
      <div className="flex-shrink-0 liquid-glass-card rounded-2xl p-5 border border-white/80">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2.5">
              <h2 className="text-base lg:text-lg font-semibold text-slate-900 tracking-tight">{patient.name}</h2>
              <span className="text-xs font-medium px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200/60">
                {patient.age}y • {patient.gender}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              NHS No: <span className="font-semibold text-slate-800">{patient.nhsNumber}</span>
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200/70 flex-shrink-0">
            {patient.bed}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 mt-3.5 pt-3 border-t border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px] mb-0.5">Admission Date:</span>
            <span className="font-medium text-slate-800">{patient.admissionDate}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px] mb-0.5">Estimated Discharge:</span>
            <span className="font-medium text-slate-800">{patient.dischargeDate}</span>
          </div>
          <div className="col-span-2 pt-0.5">
            <span className="text-slate-400 block text-[11px] mb-0.5">Responsible Clinician:</span>
            <span className="font-medium text-slate-800">{patient.consultant}</span>
          </div>
        </div>

        {/* Allergy Alert Banner */}
        {patient.allergies.length > 0 && (
          <div className="mt-3 p-2.5 rounded-xl bg-red-50/70 border border-red-200/80 flex items-start space-x-2 text-xs">
            <ShieldAlert className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="leading-snug">
              <span className="font-bold text-red-800">ALLERGY ALERT:</span>{' '}
              <span className="text-red-700 font-medium">
                {patient.allergies.join(', ')}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Part Underneath: Independently Scrollable Ward Notes Feed */}
      <div
        onDragOver={handleTimelineDragOver}
        onDragLeave={handleTimelineDragLeave}
        onDrop={handleTimelineDrop}
        className="flex-1 min-h-0 overflow-y-auto pr-1 pb-16 space-y-4 custom-scrollbar relative"
      >
        {/* Sleek Drag & Drop Overlay */}
        {isDraggingOverTimeline && (
          <div className="sticky top-0 z-30 p-6 rounded-2xl bg-blue-600/10 border-2 border-dashed border-blue-500 backdrop-blur-xs flex flex-col items-center justify-center text-center animate-fade-in pointer-events-none mb-4">
            <div className="w-12 h-12 rounded-2xl bg-white text-blue-600 flex items-center justify-center shadow-lg mb-2">
              <FileUp className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-blue-900">Drop Clinical PDF Report Here</p>
            <p className="text-xs text-blue-700">Instantly parse and synthesize into inpatient timeline</p>
          </div>
        )}

        <div className="liquid-glass-card rounded-2xl p-5 lg:p-6 border border-white/80 space-y-5">
          {/* Timeline Feed Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-200/60">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-50/80 border border-blue-200/60 flex items-center justify-center text-blue-600 shadow-2xs">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Inpatient Timeline Feed</h3>
                <p className="text-[11px] text-slate-400">Ingested ward rounds, labs, imaging & bedside charts</p>
              </div>
            </div>
            <span className="text-xs font-medium px-2.5 py-1 rounded-md liquid-glass-badge bg-white/70 text-slate-600 border border-white/80">
              {timeline.length} Events
            </span>
          </div>

          {/* Vertical Event Line */}
          <div className="relative pl-5 border-l-2 border-slate-200/80 space-y-5">
            {timeline.map((event) => {
              const isCited = activeCitationId === event.id;

              return (
                <div
                  key={event.id}
                  id={`timeline-${event.id}`}
                  className={`relative transition-all duration-300 rounded-2xl p-5 border ${
                    isCited
                      ? 'citation-active liquid-glass border-blue-500 shadow-md ring-2 ring-blue-400/20'
                      : 'liquid-glass-subtle border-white/80 hover:bg-white/95 hover:border-blue-200/80 hover:shadow-xs'
                  }`}
                >
                  {/* Timeline Dot */}
                  <div
                    className={`absolute -left-[27px] top-5 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center ${
                      isCited ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                    }`}
                  />

                  {/* Event Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-medium border ${getCategoryBadge(
                          event.category
                        )}`}
                      >
                        {getCategoryIcon(event.category)}
                        <span className="capitalize">{event.category.replace('_', ' ')}</span>
                      </span>
                      <span className="text-xs font-semibold text-slate-800">
                        Day {event.dayNumber}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 text-xs text-slate-400">
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {event.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {event.time}
                      </span>
                    </div>
                  </div>

                  {/* Title & Author */}
                  <h4 className="text-sm font-semibold text-slate-900 leading-snug">
                    {event.title}
                  </h4>
                  <p className="text-xs text-slate-500 flex items-center mt-1">
                    <User className="w-3 h-3 mr-1 text-slate-400" />
                    {event.author}
                  </p>

                  {/* Sourced Document Indicator */}
                  {event.sourceDocument && (
                    <div className="mt-2.5 inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-blue-50/70 border border-blue-200/80 text-blue-800 text-[11px] font-medium">
                      <FileText className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                      <span>Sourced from PDF: {event.sourceDocument.name}</span>
                      {event.sourceDocument.size && (
                        <span className="text-blue-500 text-[10px]">({event.sourceDocument.size})</span>
                      )}
                    </div>
                  )}

                  {/* Content */}
                  <div className="text-xs text-slate-700 mt-3 leading-relaxed whitespace-pre-line bg-white p-3.5 rounded-xl border border-slate-100 shadow-2xs">
                    {event.content}
                  </div>

                  {/* Abnormal Alerts if present */}
                  {event.abnormalFlags && event.abnormalFlags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {event.abnormalFlags.map((flag, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-red-50 text-red-700 border border-red-200/70"
                        >
                          ⚠️ {flag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Key Findings */}
                  {event.keyFindings && event.keyFindings.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {event.keyFindings.map((finding, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] bg-slate-100 text-slate-600 font-medium border border-slate-200/40"
                        >
                          • {finding}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action Trigger Buttons: Manual Note vs. PDF Document */}
          <div className="mt-4 pt-4 border-t border-slate-200/60 flex flex-col sm:flex-row items-center gap-2.5">
            <button
              onClick={() => handleOpenModal('manual')}
              className="w-full sm:w-1/2 flex items-center justify-center space-x-2 px-3.5 py-2.5 text-xs font-semibold text-blue-700 liquid-glass-button rounded-xl border border-blue-200/70 transition-all shadow-2xs"
            >
              <PlusCircle className="w-4 h-4 text-blue-600" />
              <span>Add Custom Ward Note</span>
            </button>

            <button
              onClick={() => handleOpenModal('pdf')}
              className="w-full sm:w-1/2 flex items-center justify-center space-x-2 px-3.5 py-2.5 text-xs font-semibold text-slate-700 liquid-glass-button rounded-xl border border-white/80 hover:text-blue-700 transition-all shadow-2xs"
            >
              <FileUp className="w-4 h-4 text-blue-600" />
              <span>Ingest Clinical PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Unified Add Ward Note / PDF Ingestion Modal */}
      <AddWardNoteModal
        isOpen={isAddNoteModalOpen}
        onClose={() => {
          setIsAddNoteModalOpen(false);
          setDroppedFile(null);
        }}
        onSubmitNote={onAddNote}
        currentDayNumber={timeline.length > 0 ? timeline[timeline.length - 1].dayNumber : 1}
        initialMode={modalMode}
        initialFile={droppedFile}
      />
    </div>
  );
};
