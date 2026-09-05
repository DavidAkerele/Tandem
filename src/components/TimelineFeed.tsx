import React, { useState, useMemo } from 'react';
import {
  FileText, PlusCircle, FileUp, Search, X, AlertTriangle
} from 'lucide-react';
import { PatientDemographics, TimelineEvent, DataContradiction } from '../types/clinical';
import { AddWardNoteModal } from './modals/AddWardNoteModal';
import { TimelineEventCard } from './TimelineEventCard';
import { PatientVitalsTelemetry } from './PatientVitalsTelemetry';

interface TimelineFeedProps {
  patient: PatientDemographics;
  timeline: TimelineEvent[];
  contradictions?: DataContradiction[];
  activeCitationId: string | null;
  onAddNote: (newNote: Omit<TimelineEvent, 'id'>) => void;
  onInspectConflict?: (contradictionId: string) => void;
}

type CategoryFilter = 'all' | 'consults' | 'labs' | 'meds' | 'imaging' | 'triage';

export const TimelineFeed: React.FC<TimelineFeedProps> = ({
  patient,
  timeline,
  contradictions,
  activeCitationId,
  onAddNote,
  onInspectConflict,
}) => {
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'manual' | 'pdf'>('manual');
  const [droppedFile, setDroppedFile] = useState<File | null>(null);
  const [isDraggingOverTimeline, setIsDraggingOverTimeline] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');

  const isPrimaryCare = patient.careSetting === 'primary_care';

  // Filter timeline items based on search query and category tab
  const filteredTimeline = useMemo(() => {
    return timeline.filter((event) => {
      if (selectedCategory === 'consults' && event.category !== 'consultation' && event.category !== 'ward_round') {
        return false;
      }
      if (selectedCategory === 'labs' && event.category !== 'labs' && event.category !== 'microbiology') {
        return false;
      }
      if (selectedCategory === 'meds' && event.category !== 'medication') {
        return false;
      }
      if (selectedCategory === 'imaging' && event.category !== 'radiology' && event.category !== 'investigation') {
        return false;
      }
      if (selectedCategory === 'triage' && event.category !== 'triage' && event.category !== 'admission') {
        return false;
      }

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const matchTitle = event.title.toLowerCase().includes(q);
      const matchContent = event.content.toLowerCase().includes(q);
      const matchAuthor = event.author.toLowerCase().includes(q);
      const matchFindings = event.keyFindings?.some((f) => f.toLowerCase().includes(q)) ?? false;
      const matchFlags = event.abnormalFlags?.some((f) => f.toLowerCase().includes(q)) ?? false;
      return matchTitle || matchContent || matchAuthor || matchFindings || matchFlags;
    });
  }, [timeline, selectedCategory, searchQuery]);

  const categoryCounts = useMemo(() => {
    return {
      all: timeline.length,
      consults: timeline.filter((e) => e.category === 'consultation' || e.category === 'ward_round').length,
      labs: timeline.filter((e) => e.category === 'labs' || e.category === 'microbiology').length,
      meds: timeline.filter((e) => e.category === 'medication').length,
      imaging: timeline.filter((e) => e.category === 'radiology' || e.category === 'investigation').length,
      triage: timeline.filter((e) => e.category === 'triage' || e.category === 'admission').length,
    };
  }, [timeline]);

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
    <div className="h-full min-h-0 flex flex-col space-y-3">
      {/* Patient Demographic Card - Clean Google Style */}
      <div className="flex-shrink-0 bg-white rounded-xl p-4 border border-[#dadce0] shadow-xs">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-semibold text-[#202124]">{patient.name}</h2>
              <span className="text-xs text-[#5f6368]">
                ({patient.age}y • {patient.gender})
              </span>
            </div>
            <p className="text-xs text-[#5f6368] font-mono mt-0.5">
              NHS: <span className="font-medium text-[#202124]">{patient.nhsNumber}</span>
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-[#f1f3f4] text-[#3c4043] border border-[#dadce0]">
              {patient.bed}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-[#f1f3f4] text-xs">
          <div>
            <span className="text-[#5f6368] block text-[11px]">
              {isPrimaryCare ? 'Practice' : 'Location'}:
            </span>
            <span className="font-medium text-[#202124] truncate block" title={patient.practiceOrHospital}>
              {patient.practiceOrHospital}
            </span>
          </div>
          <div>
            <span className="text-[#5f6368] block text-[11px]">
              {isPrimaryCare ? 'Lead Clinician' : 'Consultant'}:
            </span>
            <span className="font-medium text-[#202124] truncate block">{patient.consultant}</span>
          </div>
        </div>

        {/* Allergy Alert Banner - COLOR strictly where attention MUST be drawn */}
        {patient.allergies.length > 0 && (
          <div className="mt-2.5 p-2 rounded-lg bg-red-50 border-l-4 border-l-red-600 text-xs flex items-center space-x-2">
            <AlertTriangle className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
            <div>
              <span className="font-semibold text-red-900">ALLERGY ALERT:</span>{' '}
              <span className="text-red-800">{patient.allergies.join(', ')}</span>
            </div>
          </div>
        )}
      </div>

      {/* Patient Vitals & Physiological Telemetry Strip */}
      <PatientVitalsTelemetry patient={patient} />

      {/* Search & Category Filter Chips */}
      <div className="flex-shrink-0 space-y-2">
        {/* Instant Search Bar */}
        <div className="relative flex items-center bg-[#f1f3f4] rounded-lg px-3.5 py-1.5 border border-transparent focus-within:border-[#1a73e8] focus-within:bg-white transition-all">
          <Search className="w-3.5 h-3.5 text-[#5f6368] mr-2 flex-shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              isPrimaryCare
                ? 'Search consultations, labs, meds...'
                : 'Search ward notes, labs, imaging...'
            }
            className="w-full bg-transparent text-xs text-[#202124] placeholder-[#5f6368] focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="p-0.5 text-[#5f6368] hover:text-[#202124] rounded-md"
              title="Clear"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Minimal Google Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {(
            [
              { id: 'all', label: 'All', count: categoryCounts.all },
              { id: 'consults', label: isPrimaryCare ? 'Consults' : 'Ward Notes', count: categoryCounts.consults },
              { id: 'labs', label: 'Labs', count: categoryCounts.labs },
              { id: 'meds', label: 'Meds', count: categoryCounts.meds },
              { id: 'triage', label: isPrimaryCare ? 'Triage' : 'Admissions', count: categoryCounts.triage },
              ...(categoryCounts.imaging > 0
                ? [{ id: 'imaging', label: 'Imaging', count: categoryCounts.imaging }]
                : []),
            ] as const
          ).map((chip) => {
            const isSelected = selectedCategory === chip.id;
            return (
              <button
                key={chip.id}
                onClick={() => setSelectedCategory(chip.id as CategoryFilter)}
                className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#202124] text-white font-medium shadow-xs'
                    : 'bg-white text-[#5f6368] hover:bg-[#f1f3f4] border border-[#dadce0]'
                }`}
              >
                <span>{chip.label}</span>
                <span className={`text-[10px] ${isSelected ? 'text-white/80' : 'text-[#5f6368]'}`}>
                  {chip.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Scrollable Events Feed */}
      <div
        onDragOver={handleTimelineDragOver}
        onDragLeave={handleTimelineDragLeave}
        onDrop={handleTimelineDrop}
        className="flex-1 min-h-0 overflow-y-auto pr-1 pb-12 space-y-3 relative"
      >
        {isDraggingOverTimeline && (
          <div className="sticky top-0 z-30 p-5 rounded-xl bg-blue-50 border-2 border-dashed border-[#1a73e8] flex flex-col items-center justify-center text-center mb-3">
            <FileUp className="w-6 h-6 text-[#1a73e8] mb-1" />
            <p className="text-xs font-semibold text-[#1a73e8]">Drop Clinical Report Here</p>
          </div>
        )}

        <div className="bg-white rounded-xl p-4 border border-[#dadce0] space-y-3">
          {/* Feed Header */}
          <div className="flex items-center justify-between pb-2.5 border-b border-[#f1f3f4]">
            <span className="text-xs font-semibold text-[#202124] uppercase tracking-wider">
              {isPrimaryCare ? 'Patient Record Timeline' : 'Episode Timeline'}
            </span>
            <span className="text-[11px] text-[#5f6368]">
              {filteredTimeline.length} entries
            </span>
          </div>

          {filteredTimeline.length === 0 ? (
            <div className="text-center py-6 px-4 bg-[#f8f9fa] rounded-lg border border-[#dadce0]">
              <p className="text-xs font-medium text-[#3c4043]">No entries match your search</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="mt-2 text-xs text-[#1a73e8] hover:underline"
              >
                Reset filters
              </button>
            </div>
          ) : (
            /* Vertical Event Line */
            <div className="relative pl-4 border-l border-[#dadce0] space-y-3">
              {filteredTimeline.map((event) => (
                <TimelineEventCard
                  key={event.id}
                  event={event}
                  isCited={activeCitationId === event.id}
                  isPrimaryCare={isPrimaryCare}
                  contradictions={contradictions}
                  onInspectConflict={onInspectConflict}
                />
              ))}
            </div>
          )}

          {/* Action Trigger Buttons */}
          <div className="mt-3 pt-3 border-t border-[#f1f3f4] flex items-center gap-2">
            <button
              onClick={() => handleOpenModal('manual')}
              className="flex-1 flex items-center justify-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-[#202124] bg-white border border-[#dadce0] hover:bg-[#f1f3f4] rounded-lg transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#5f6368]" />
              <span>{isPrimaryCare ? 'Add Note' : 'Add Ward Note'}</span>
            </button>

            <button
              onClick={() => handleOpenModal('pdf')}
              className="flex-1 flex items-center justify-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-[#202124] bg-white border border-[#dadce0] hover:bg-[#f1f3f4] rounded-lg transition-colors"
            >
              <FileUp className="w-3.5 h-3.5 text-[#5f6368]" />
              <span>Upload PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
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
