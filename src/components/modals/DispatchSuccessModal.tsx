import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Send, ShieldCheck, Download, ArrowRight } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/35 backdrop-blur-md p-4 animate-fade-in">
      <div className="liquid-glass-modal rounded-3xl max-w-lg w-full p-8 text-center animate-scale-up">
        {/* Big Success Icon with Specular Glow */}
        <div className="w-16 h-16 rounded-2xl bg-emerald-50/80 text-emerald-600 border border-emerald-200/90 flex items-center justify-center mx-auto mb-5 shadow-xs">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <h3 className="text-xl font-semibold text-slate-900 tracking-tight">
          Discharge Summary Dispatched
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
          The Electronic Discharge Notification (eDN) for <b className="text-slate-800">{patient.name}</b> has been signed off and electronically transmitted to the GP practice.
        </p>

        {/* Transmission Metadata Card with Liquid Glass Refraction */}
        <div className="mt-6 p-5 liquid-glass-subtle rounded-2xl border border-white/80 text-left text-xs space-y-3 shadow-xs">
          <div className="flex justify-between">
            <span className="text-slate-500">Destination GP:</span>
            <span className="font-semibold text-slate-800">Millwood Medical Practice (GP2GP Link)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">NHS Spine MESH:</span>
            <span className="font-semibold text-emerald-700 flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Delivered (ACK 200 OK)</span>
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Timestamp:</span>
            <span className="font-mono text-slate-700">{new Date().toLocaleDateString('en-GB')} {new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Signing Clinician:</span>
            <span className="font-medium text-slate-800">{patient.consultant || 'Dr. R. Kapoor (Attending Consultant)'}</span>
          </div>
        </div>

        {/* Discharge Lounge Bed Alert */}
        <div className="mt-4 p-4 rounded-xl bg-blue-50/70 border border-blue-200/70 text-xs text-blue-900 text-left flex items-start space-x-2.5">
          <Send className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-semibold text-blue-950">Bed Turnover Alert:</span> Patient has been queued for transfer to Discharge Lounge. {patient.bed || 'Acute Bed'} is now flagged available for acute emergency intake.
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-7">
          <button
            onClick={onClose}
            className="w-full py-3 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm shadow-sm hover:shadow-md transition-all active:scale-98"
          >
            Done & Return to Cockpit
          </button>
        </div>
      </div>
    </div>
  );
};
