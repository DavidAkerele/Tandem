import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Send, ShieldCheck } from 'lucide-react';

interface DispatchSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: {
    name: string;
    nhsNumber: string;
    ward?: string;
    bed?: string;
    consultant?: string;
  };
}

export const DispatchSuccessModal: React.FC<DispatchSuccessModalProps> = ({
  isOpen,
  onClose,
  patient,
}) => {
  useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#1a73e8', '#0f9d58', '#4285f4', '#34a853'],
        });
      } catch {
        // Non-critical celebration confetti animation
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 text-center border border-[#dadce0] shadow-2xl animate-scale-up">
        {/* Success Icon */}
        <div className="w-14 h-14 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-7 h-7" />
        </div>

        <h3 className="text-lg font-semibold text-[#202124] tracking-tight">
          Discharge Summary Dispatched
        </h3>
        <p className="text-xs sm:text-sm text-[#5f6368] mt-2 leading-relaxed">
          The Electronic Discharge Notification (eDN) for <b className="text-[#202124]">{patient.name}</b> has been signed off and electronically transmitted to the GP practice.
        </p>

        {/* Transmission Metadata Card */}
        <div className="mt-6 p-4 rounded-xl bg-[#f8f9fa] border border-[#dadce0] text-left text-xs space-y-2.5">
          <div className="flex justify-between">
            <span className="text-[#5f6368]">Destination GP:</span>
            <span className="font-semibold text-[#202124]">Millwood Medical Practice (GP2GP Link)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#5f6368]">NHS Spine MESH:</span>
            <span className="font-semibold text-emerald-700 flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Delivered (ACK 200 OK)</span>
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#5f6368]">Timestamp:</span>
            <span className="font-mono text-[#3c4043]">{new Date().toLocaleDateString('en-GB')} {new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#5f6368]">Signing Clinician:</span>
            <span className="font-medium text-[#202124]">{patient.consultant || 'Dr. R. Kapoor (Attending Consultant)'}</span>
          </div>
        </div>

        {/* Discharge Lounge Bed Alert */}
        <div className="mt-4 p-3.5 rounded-xl bg-[#e8f0fe] border border-[#d2e3fc] text-xs text-[#1a73e8] text-left flex items-start space-x-2.5">
          <Send className="w-4 h-4 text-[#1a73e8] flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-semibold text-[#174ea6]">Bed Turnover Alert:</span> Patient has been queued for transfer to Discharge Lounge. {patient.bed || 'Acute Bed'} is now flagged available for acute emergency intake.
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-6 rounded-lg bg-[#1a73e8] hover:bg-[#1557b0] text-white font-medium text-xs shadow-xs transition-colors"
          >
            Done &amp; Return to Cockpit
          </button>
        </div>
      </div>
    </div>
  );
};
