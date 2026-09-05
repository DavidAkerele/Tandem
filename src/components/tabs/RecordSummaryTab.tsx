import React, { useState } from 'react';
import {
  Maximize2, X, Link2
} from 'lucide-react';
import { RecordSummary, SystemsSummaryItem, ClinicalImageItem } from '../../types/clinical';

interface RecordSummaryTabProps {
  recordSummary: RecordSummary;
  onCitationClick: (citationId: string) => void;
  showCitations: boolean;
}

export const RecordSummaryTab: React.FC<RecordSummaryTabProps> = ({
  recordSummary,
  onCitationClick,
  showCitations,
}) => {
  const [selectedImage, setSelectedImage] = useState<ClinicalImageItem | null>(null);

  const getSystemStatusBadge = (status: SystemsSummaryItem['status']) => {
    switch (status) {
      case 'active':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-red-50 text-red-800 border border-red-200">
            Active Focus
          </span>
        );
      case 'watch':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
            Watch &amp; Monitor
          </span>
        );
      case 'resolved':
      case 'stable':
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#f1f3f4] text-[#3c4043] border border-[#dadce0]">
            Stable
          </span>
        );
    }
  };

  return (
    <>
      <div className="space-y-4">
        {/* At-a-Glance Executive Record Summary (Google Style) */}
        <div className="bg-white rounded-xl border border-[#dadce0] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#f1f3f4]">
            <div>
              <h3 className="text-base font-semibold text-[#202124]">
                Longitudinal Record Summary
              </h3>
              <p className="text-xs text-[#5f6368]">
                Cross-system intelligence extracted across EHR, consultations, and pathology
              </p>
            </div>
            <span className="text-xs text-[#5f6368]">
              {recordSummary.systemsSummary.length} Organ Systems
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {(recordSummary.executiveBulletPoints && recordSummary.executiveBulletPoints.length > 0
              ? recordSummary.executiveBulletPoints
              : recordSummary.executiveNarrative.split(/(?<=[.!?])\s+/).filter(Boolean)
            ).map((bullet, idx) => (
              <div
                key={idx}
                className="flex items-start space-x-2 text-xs text-[#3c4043] leading-relaxed"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#202124] mt-1.5 flex-shrink-0" />
                <span>{bullet}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Diagnostic Imaging & Clinical Scans Gallery */}
        {recordSummary.clinicalImages && recordSummary.clinicalImages.length > 0 && (
          <div className="bg-white rounded-xl border border-[#dadce0] p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2.5 border-b border-[#f1f3f4]">
              <div>
                <h4 className="text-xs font-semibold text-[#202124] uppercase tracking-wider">
                  Diagnostic Scans &amp; Imaging
                </h4>
                <p className="text-[11px] text-[#5f6368]">PACS radiographs, ultrasounds, and rhythm strips</p>
              </div>
              <span className="text-xs text-[#5f6368]">
                {recordSummary.clinicalImages.length} Scans Available
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {recordSummary.clinicalImages.map((img) => (
                <div
                  key={img.id}
                  className="rounded-lg overflow-hidden border border-[#dadce0] bg-white flex flex-col"
                >
                  <div
                    className="relative aspect-video w-full overflow-hidden bg-black flex items-center justify-center cursor-pointer group"
                    onClick={() => setSelectedImage(img)}
                  >
                    <img
                      src={img.imageUrl}
                      alt={img.title}
                      className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                      loading="lazy"
                    />
                    <div className="absolute top-2 right-2 p-1 rounded bg-black/70 text-white hover:bg-black transition-colors">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <div className="p-3 bg-white text-xs space-y-1.5 flex-1 flex flex-col justify-between border-t border-[#dadce0]">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-[#202124]">{img.title}</span>
                        <span className="text-[10px] bg-[#f1f3f4] text-[#3c4043] px-1.5 py-0.5 rounded border border-[#dadce0]">
                          {img.modality}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#5f6368] leading-relaxed">{img.findings}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#f1f3f4] text-[10px] text-[#5f6368]">
                      <span>{img.date}</span>
                      {showCitations && img.citationId && (
                        <button
                          onClick={() => onCitationClick(img.citationId!)}
                          className="text-[#1a73e8] hover:underline font-medium"
                        >
                          View in Timeline
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Organ Systems Analysis */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#202124] uppercase tracking-wider">
              Organ Systems Analysis
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {recordSummary.systemsSummary.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-[#dadce0] p-4 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-[#f1f3f4]">
                  <h5 className="text-sm font-semibold text-[#202124]">{item.system}</h5>
                  <div>{getSystemStatusBadge(item.status)}</div>
                </div>

                {/* Direct Points */}
                <div className="space-y-1">
                  {(item.bulletPoints && item.bulletPoints.length > 0
                    ? item.bulletPoints
                    : item.narrative.split(/(?<=[.!?])\s+/).filter(Boolean)
                  ).map((pt, pIdx) => (
                    <div key={pIdx} className="flex items-start space-x-2 text-xs text-[#3c4043] leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#5f6368] mt-1.5 flex-shrink-0" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>

                {/* Key Findings */}
                {item.keyFindings && item.keyFindings.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.keyFindings.map((finding, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[11px] bg-[#f1f3f4] text-[#3c4043] border border-[#dadce0]"
                      >
                        {finding}
                      </span>
                    ))}
                  </div>
                )}

                {/* Citations Footer */}
                {showCitations && item.citationIds && item.citationIds.length > 0 && (
                  <div className="pt-2 border-t border-[#f1f3f4] flex items-center justify-end gap-1.5">
                    {item.citationIds.map((cId) => (
                      <button
                        key={cId}
                        onClick={() => onCitationClick(cId)}
                        className="inline-flex items-center space-x-1 text-[11px] font-medium text-[#1a73e8] hover:underline"
                      >
                        <Link2 className="w-3 h-3" />
                        <span>Citation #{cId}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Milestones */}
        {recordSummary.diagnosticMilestones && recordSummary.diagnosticMilestones.length > 0 && (
          <div className="bg-white rounded-xl border border-[#dadce0] p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2.5 border-b border-[#f1f3f4]">
              <h4 className="text-xs font-semibold text-[#202124] uppercase tracking-wider">
                Procedural &amp; Diagnostic Milestones
              </h4>
              <span className="text-xs text-[#5f6368]">
                {recordSummary.diagnosticMilestones.length} Milestones
              </span>
            </div>

            <div className="space-y-2">
              {recordSummary.diagnosticMilestones.map((milestone) => (
                <div
                  key={milestone.id}
                  className="p-3 rounded-lg border border-[#dadce0] bg-[#f8f9fa] flex items-center justify-between gap-2 text-xs"
                >
                  <div>
                    <span className="font-semibold text-[#202124] block">{milestone.event}</span>
                    {milestone.code && (
                      <span className="text-[#5f6368] text-[11px] font-mono">Code: {milestone.code}</span>
                    )}
                  </div>
                  <span className="text-[#5f6368] text-[11px] flex-shrink-0">{milestone.yearOrDate}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-white rounded-xl overflow-hidden border border-[#dadce0] shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#dadce0]">
              <div>
                <h3 className="text-sm font-semibold text-[#202124]">{selectedImage.title}</h3>
                <p className="text-xs text-[#5f6368]">{selectedImage.modality} • {selectedImage.date}</p>
              </div>
              <button
                onClick={() => setSelectedImage(null)}
                className="p-1 text-[#5f6368] hover:text-[#202124] rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-2 bg-black flex items-center justify-center max-h-[65vh]">
              <img
                src={selectedImage.imageUrl}
                alt={selectedImage.title}
                className="max-h-[60vh] w-auto object-contain"
              />
            </div>
            <div className="p-3.5 bg-[#f8f9fa] border-t border-[#dadce0] text-xs text-[#3c4043]">
              <p>{selectedImage.findings}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
