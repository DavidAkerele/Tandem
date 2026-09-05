import React, { useState, useEffect, useRef } from 'react';
import {
  X, PlusCircle, User, FileUp, PenLine, UploadCloud,
  FileText, Check, AlertCircle, RefreshCw, Sparkles, Plus, Trash2
} from 'lucide-react';
import { TimelineEvent } from '../../types/clinical';
import {
  ParsedClinicalDocument,
  extractTextFromPdfBuffer,
  synthesizeClinicalDocument,
  formatFileSize,
  CLINICAL_PDF_SAMPLES
} from '../../utils/pdfParser';

interface AddWardNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitNote: (newNote: Omit<TimelineEvent, 'id'>) => void;
  currentDayNumber: number;
  initialMode?: 'manual' | 'pdf';
  initialFile?: File | null;
}

export const AddWardNoteModal: React.FC<AddWardNoteModalProps> = ({
  isOpen,
  onClose,
  onSubmitNote,
  currentDayNumber,
  initialMode = 'manual',
  initialFile = null,
}) => {
  const [activeTab, setActiveTab] = useState<'manual' | 'pdf'>(initialMode);

  // Manual Note Form State
  const [category, setCategory] = useState<TimelineEvent['category']>('ward_round');
  const [author, setAuthor] = useState('Dr. Alex Smith, FY1');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [keyFinding, setKeyFinding] = useState('');

  // PDF Ingestion State
  const [isParsing, setIsParsing] = useState(false);
  const [parsedDoc, setParsedDoc] = useState<ParsedClinicalDocument | null>(null);
  const [pdfCategory, setPdfCategory] = useState<TimelineEvent['category']>('radiology');
  const [pdfAuthor, setPdfAuthor] = useState('');
  const [pdfTitle, setPdfTitle] = useState('');
  const [pdfContent, setPdfContent] = useState('');
  const [pdfKeyFindings, setPdfKeyFindings] = useState<string[]>([]);
  const [pdfAbnormalFlags, setPdfAbnormalFlags] = useState<string[]>([]);
  const [newFindingInput, setNewFindingInput] = useState('');
  const [isDraggingInModal, setIsDraggingInModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync mode and initial file when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialMode);
      if (initialFile) {
        processUploadedFile(initialFile);
      }
    } else {
      // Reset states on close
      setParsedDoc(null);
      setIsParsing(false);
      setIsDraggingInModal(false);
    }
  }, [isOpen, initialMode, initialFile]);

  if (!isOpen) return null;

  // Process a selected or dropped file
  const processUploadedFile = async (file: File) => {
    setIsParsing(true);
    try {
      const buffer = await file.arrayBuffer();
      const rawText = await extractTextFromPdfBuffer(buffer);
      const synthesized = synthesizeClinicalDocument(
        file.name,
        formatFileSize(file.size),
        rawText
      );

      setParsedDoc(synthesized);
      setPdfCategory(synthesized.category);
      setPdfAuthor(synthesized.author);
      setPdfTitle(synthesized.title);
      setPdfContent(synthesized.content);
      setPdfKeyFindings(synthesized.keyFindings);
      setPdfAbnormalFlags(synthesized.abnormalFlags || []);
    } catch {
      // Fallback synthesis if file reading encounters unexpected binary structure
      const fallback = synthesizeClinicalDocument(
        file.name,
        formatFileSize(file.size),
        ''
      );
      setParsedDoc(fallback);
      setPdfCategory(fallback.category);
      setPdfAuthor(fallback.author);
      setPdfTitle(fallback.title);
      setPdfContent(fallback.content);
      setPdfKeyFindings(fallback.keyFindings);
      setPdfAbnormalFlags(fallback.abnormalFlags || []);
    } finally {
      setIsParsing(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processUploadedFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingInModal(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingInModal(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingInModal(false);
  };

  const handleLoadSample = (sample: ParsedClinicalDocument) => {
    setParsedDoc(sample);
    setPdfCategory(sample.category);
    setPdfAuthor(sample.author);
    setPdfTitle(sample.title);
    setPdfContent(sample.content);
    setPdfKeyFindings([...sample.keyFindings]);
    setPdfAbnormalFlags(sample.abnormalFlags ? [...sample.abnormalFlags] : []);
  };

  const handleAddKeyFinding = () => {
    if (!newFindingInput.trim()) return;
    setPdfKeyFindings((prev) => [...prev, newFindingInput.trim()]);
    setNewFindingInput('');
  };

  const handleRemoveKeyFinding = (index: number) => {
    setPdfKeyFindings((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Submit Manual Entry
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const findings: string[] = ['Clinician manual entry added at bedside'];
    if (keyFinding.trim()) {
      findings.push(keyFinding.trim());
    }

    onSubmitNote({
      dayNumber: currentDayNumber > 0 ? currentDayNumber : 1,
      date: new Date().toLocaleDateString('en-GB'),
      time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      category,
      author: author.trim() || 'Attending Clinician',
      title: title.trim() || 'Additional Clinical Ward Entry',
      content: content.trim(),
      keyFindings: findings,
    });

    setTitle('');
    setContent('');
    setKeyFinding('');
    onClose();
  };

  // Submit PDF Document Ingestion
  const handlePdfSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfContent.trim() || !parsedDoc) return;

    onSubmitNote({
      dayNumber: currentDayNumber > 0 ? currentDayNumber : 1,
      date: new Date().toLocaleDateString('en-GB'),
      time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      category: pdfCategory,
      author: pdfAuthor.trim() || 'Attending Clinical Specialist',
      title: pdfTitle.trim() || 'Ingested Clinical Document Note',
      content: pdfContent.trim(),
      keyFindings: pdfKeyFindings,
      abnormalFlags: pdfAbnormalFlags.length > 0 ? pdfAbnormalFlags : undefined,
      sourceDocument: {
        name: parsedDoc.fileName,
        size: parsedDoc.fileSize,
        type: 'pdf',
      },
    });

    setParsedDoc(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/35 backdrop-blur-md p-4 animate-fade-in overflow-y-auto">
      <div
        className="liquid-glass-modal rounded-3xl max-w-2xl w-full flex flex-col my-8 overflow-hidden animate-scale-up"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-ward-note-title"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200/60">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50/80 border border-blue-200/80 flex items-center justify-center text-blue-600 flex-shrink-0 shadow-2xs">
              {activeTab === 'manual' ? (
                <PlusCircle className="w-5 h-5" />
              ) : (
                <FileUp className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 id="add-ward-note-title" className="text-base font-semibold text-slate-900">
                {activeTab === 'manual'
                  ? 'Add Custom Ward Note / Bedside Entry'
                  : 'Ingest Clinical PDF Report / Diagnostic Document'}
              </h3>
              <p className="text-xs text-slate-500">
                {activeTab === 'manual'
                  ? 'Record inpatient observations, lab developments, or MDT consults'
                  : 'Synthesize hospital discharge letters, radiology, lab panels, or scans'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation: Manual Note vs. PDF Document (Liquid Glass) */}
        <div className="px-6 pt-4 pb-1 flex items-center space-x-2 border-b border-slate-200/60 bg-white/40 backdrop-blur-xs">
          <button
            type="button"
            onClick={() => setActiveTab('manual')}
            className={`flex items-center space-x-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'manual'
                ? 'liquid-glass text-blue-700 shadow-xs border border-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <PenLine className="w-3.5 h-3.5" />
            <span>Manual Clinical Note</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pdf')}
            className={`flex items-center space-x-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'pdf'
                ? 'liquid-glass text-blue-700 shadow-xs border border-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <FileUp className="w-3.5 h-3.5" />
            <span>Ingest PDF Document</span>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200/60">
              AI Parser
            </span>
          </button>
        </div>

        {/* TAB 1: MANUAL NOTE FORM */}
        {activeTab === 'manual' && (
          <form onSubmit={handleManualSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="note-category" className="block text-xs font-medium text-slate-700 mb-1.5">
                  Entry Category
                </label>
                <div className="relative">
                  <select
                    id="note-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as TimelineEvent['category'])}
                    className="w-full text-xs bg-[#f8fafd] border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="ward_round">Ward Round Consultation</option>
                    <option value="labs">Laboratory / Pathology Panel</option>
                    <option value="radiology">Radiology / Imaging Report</option>
                    <option value="microbiology">Microbiology & Sensitivities</option>
                    <option value="medication">Drug Chart / Pharmacy TTO</option>
                    <option value="admission">Admission History / Clerking</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="note-author" className="block text-xs font-medium text-slate-700 mb-1.5">
                  Author & Professional Role
                </label>
                <div className="relative flex items-center">
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
                  <input
                    id="note-author"
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full text-xs bg-[#f8fafd] border border-slate-300 rounded-xl pl-8 pr-3.5 py-2.5 text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none"
                    placeholder="e.g. Dr. A. Smith, FY1"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="note-title" className="block text-xs font-medium text-slate-700 mb-1.5">
                Entry Headline / Context
              </label>
              <input
                id="note-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-xs bg-[#f8fafd] border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none"
                placeholder="e.g. Afternoon Microbiology Consultation & Antibiotic Review"
              />
            </div>

            <div>
              <label htmlFor="note-finding" className="block text-xs font-medium text-slate-700 mb-1.5">
                Key Clinical Finding / Action (Optional)
              </label>
              <input
                id="note-finding"
                type="text"
                value={keyFinding}
                onChange={(e) => setKeyFinding(e.target.value)}
                className="w-full text-xs bg-[#f8fafd] border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none"
                placeholder="e.g. Blood cultures negative at 48h; CRP downtrending to 18"
              />
            </div>

            <div>
              <label htmlFor="note-content" className="block text-xs font-medium text-slate-700 mb-1.5">
                Clinical Narrative Body
              </label>
              <textarea
                id="note-content"
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full text-xs bg-[#f8fafd] border border-slate-300 rounded-xl p-3 text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none leading-relaxed resize-none"
                placeholder="Record bedside examination findings, MDT notes, changes in physiological observations, or post-operative progress..."
                required
              />
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-98"
              >
                Insert into Timeline
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: PDF DOCUMENT INGESTION */}
        {activeTab === 'pdf' && (
          <div className="p-6 space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={handleFileInputChange}
            />

            {/* File Dropzone / Uploader */}
            {!parsedDoc && !isParsing && (
              <div className="space-y-4">
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                    isDraggingInModal
                      ? 'border-blue-500 bg-blue-50/60 ring-4 ring-blue-500/10'
                      : 'border-slate-300 hover:border-blue-500 bg-[#f8fafd] hover:bg-blue-50/20'
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-blue-100/80 text-blue-600 flex items-center justify-center mx-auto mb-3">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-1">
                    Drag & drop clinical PDF report here
                  </h4>
                  <p className="text-xs text-slate-500 mb-3">
                    or <span className="text-blue-600 font-semibold underline underline-offset-2">browse files</span> from your workstation
                  </p>
                  <div className="inline-flex items-center space-x-2 text-[11px] text-slate-400 bg-white px-3 py-1 rounded-md border border-slate-200/80">
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                    <span>Supports CXR/CT radiology, microbiology panels, blood reports, discharge letters</span>
                  </div>
                </div>

                {/* Pre-configured NHS Clinical Document Samples */}
                <div className="pt-2">
                  <div className="flex items-center space-x-2 mb-2.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span className="text-xs font-semibold text-slate-700">
                      Or test with sample hospital documents:
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {CLINICAL_PDF_SAMPLES.map((sample, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleLoadSample(sample)}
                        className="text-left p-3 rounded-xl border border-slate-200/80 bg-white hover:border-blue-400 hover:bg-blue-50/30 transition-all group"
                      >
                        <div className="flex items-start space-x-2">
                          <FileText className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-slate-800 truncate">{sample.fileName}</p>
                            <p className="text-[11px] text-slate-500 capitalize">{sample.category} • {sample.fileSize}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Parsing In-Progress Indicator */}
            {isParsing && (
              <div className="p-8 text-center space-y-3 bg-[#f8fafd] rounded-2xl border border-slate-200">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto animate-pulse">
                  <RefreshCw className="w-6 h-6 animate-spin" />
                </div>
                <h4 className="text-sm font-semibold text-slate-900">Ingesting Clinical PDF Document...</h4>
                <p className="text-xs text-slate-500">
                  Parsing stream objects, extracting clinical entities, and mapping hospital timeline records
                </p>
              </div>
            )}

            {/* Parsed & Ready for Clinician Review Form */}
            {parsedDoc && !isParsing && (
              <form onSubmit={handlePdfSubmit} className="space-y-4">
                {/* File Ingestion Banner */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/80">
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {parsedDoc.fileName}
                        </span>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white text-blue-800 border border-blue-200/70">
                          {parsedDoc.fileSize}
                        </span>
                      </div>
                      <p className="text-[11px] text-blue-700 flex items-center space-x-1 mt-0.5">
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Entities Synthesized & Linked</span>
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setParsedDoc(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Change File</span>
                  </button>
                </div>

                {/* Category & Specialist Author */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="pdf-category" className="block text-xs font-medium text-slate-700 mb-1.5">
                      Classified Category
                    </label>
                    <select
                      id="pdf-category"
                      value={pdfCategory}
                      onChange={(e) => setPdfCategory(e.target.value as TimelineEvent['category'])}
                      className="w-full text-xs bg-[#f8fafd] border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="radiology">Radiology / Diagnostic Imaging</option>
                      <option value="microbiology">Microbiology & Culture Sensitivities</option>
                      <option value="labs">Laboratory / Pathology Panel</option>
                      <option value="ward_round">Ward Round Consultation</option>
                      <option value="medication">Drug Chart / Pharmacy TTO</option>
                      <option value="admission">Admission History / Clerking</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="pdf-author" className="block text-xs font-medium text-slate-700 mb-1.5">
                      Responsible Clinician / Specialist
                    </label>
                    <input
                      id="pdf-author"
                      type="text"
                      value={pdfAuthor}
                      onChange={(e) => setPdfAuthor(e.target.value)}
                      className="w-full text-xs bg-[#f8fafd] border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Document Title */}
                <div>
                  <label htmlFor="pdf-title" className="block text-xs font-medium text-slate-700 mb-1.5">
                    Synthesized Document Title
                  </label>
                  <input
                    id="pdf-title"
                    type="text"
                    value={pdfTitle}
                    onChange={(e) => setPdfTitle(e.target.value)}
                    className="w-full text-xs bg-[#f8fafd] border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>

                {/* Key Findings List & Editor */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Extracted Key Findings & Conclusions ({pdfKeyFindings.length})
                  </label>
                  <div className="space-y-1.5 mb-2 max-h-36 overflow-y-auto pr-1">
                    {pdfKeyFindings.map((finding, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200/80 text-xs text-slate-800"
                      >
                        <span className="truncate pr-2">• {finding}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveKeyFinding(idx)}
                          className="text-slate-400 hover:text-red-600 transition-colors p-1"
                          aria-label="Remove finding"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add additional finding */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={newFindingInput}
                      onChange={(e) => setNewFindingInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddKeyFinding();
                        }
                      }}
                      placeholder="Add an additional key finding..."
                      className="flex-1 text-xs bg-[#f8fafd] border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddKeyFinding}
                      className="px-3 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 flex items-center space-x-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>

                {/* Abnormal Flags preview if present */}
                {pdfAbnormalFlags.length > 0 && (
                  <div>
                    <label className="block text-xs font-medium text-red-700 mb-1 flex items-center space-x-1">
                      <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                      <span>Detected Clinical Alerts</span>
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {pdfAbnormalFlags.map((flag, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium bg-red-50 text-red-700 border border-red-200/80"
                        >
                          ⚠️ {flag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Document Clinical Narrative */}
                <div>
                  <label htmlFor="pdf-content" className="block text-xs font-medium text-slate-700 mb-1.5">
                    Synthesized Clinical Report Body
                  </label>
                  <textarea
                    id="pdf-content"
                    rows={5}
                    value={pdfContent}
                    onChange={(e) => setPdfContent(e.target.value)}
                    className="w-full text-xs bg-[#f8fafd] border border-slate-300 rounded-xl p-3 text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none leading-relaxed resize-none font-mono text-[11px]"
                    required
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setParsedDoc(null)}
                    className="text-xs text-slate-500 hover:text-slate-800"
                  >
                    ← Upload different PDF
                  </button>

                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-5 py-2.5 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-98 flex items-center space-x-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>Insert PDF into Timeline</span>
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
