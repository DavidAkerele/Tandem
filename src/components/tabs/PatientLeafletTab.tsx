import React from 'react';
import { Heart, Sun, Coffee, Sunset, Moon, PhoneCall, AlertCircle, FileCheck } from 'lucide-react';
import { PatientLeafletData } from '../../types/clinical';

interface PatientLeafletTabProps {
  leaflet: PatientLeafletData;
  patientName: string;
}

export const PatientLeafletTab: React.FC<PatientLeafletTabProps> = ({
  leaflet,
  patientName,
}) => {
  const getTimeIcon = (time: string) => {
    switch (time) {
      case 'Morning':
        return <Sun className="w-4 h-4 text-amber-500" />;
      case 'Lunch':
        return <Coffee className="w-4 h-4 text-orange-500" />;
      case 'Evening':
        return <Sunset className="w-4 h-4 text-indigo-500" />;
      case 'Bedtime':
      default:
        return <Moon className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-7">
      {/* Friendly Header Card */}
      <div className="bg-[#f0f4f9] rounded-2xl border border-blue-100 p-6 shadow-2xs">
        <div className="flex items-center space-x-2 text-blue-700 font-semibold text-xs mb-1.5">
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
          <span>Patient Take-Home Guide & Discharge Leaflet</span>
        </div>
        <h2 className="text-xl font-semibold text-slate-900 tracking-tight">
          Your Recovery Plan: {patientName}
        </h2>
        <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
          Written in plain English (Reading Level 6) to help you and your family manage your health and medications safely at home.
        </p>
      </div>

      {/* Summary Narrative Grid (Roomy 2 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs">
          <h3 className="font-semibold text-slate-900 text-sm mb-2 flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            <span>Why you were in hospital</span>
          </h3>
          <p className="text-slate-600 leading-relaxed text-sm">
            {leaflet.reasonForAdmission}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs">
          <h3 className="font-semibold text-slate-900 text-sm mb-2 flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <span>What we did for you</span>
          </h3>
          <p className="text-slate-600 leading-relaxed text-sm">
            {leaflet.whatWeDid}
          </p>
        </div>
      </div>

      {/* Current Condition Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs">
        <h3 className="font-semibold text-slate-900 text-sm mb-2 flex items-center space-x-2">
          <FileCheck className="w-4 h-4 text-blue-600" />
          <span>How you are doing today</span>
        </h3>
        <p className="text-slate-600 leading-relaxed text-sm">
          {leaflet.currentCondition}
        </p>
      </div>

      {/* Daily Medicine Schedule Table (Full Width with Generous Gutter) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">
          Your Daily Medication Timetable
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {leaflet.dailyMedicineSchedule.map((period, index) => (
            <div
              key={index}
              className="bg-[#f8fafd] rounded-2xl border border-slate-200/70 p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center space-x-2 font-semibold text-slate-900 text-sm mb-3 pb-2 border-b border-slate-200/80">
                  {getTimeIcon(period.timeOfDay)}
                  <span>{period.timeOfDay}</span>
                </div>

                {period.medicines.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-2">
                    No medications needed.
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {period.medicines.map((m, mIdx) => (
                      <div key={mIdx} className="bg-white p-3 rounded-xl border border-slate-100 shadow-2xs text-xs">
                        <div className="font-semibold text-slate-900">{m.name}</div>
                        <div className="text-xs text-blue-700 font-semibold mt-0.5">{m.dose}</div>
                        {m.note && (
                          <div className="text-[11px] text-slate-500 mt-1 leading-snug">{m.note}</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {period.instructions && (
                <div className="mt-4 pt-2.5 border-t border-slate-200 text-xs text-slate-500 leading-relaxed">
                  {period.instructions}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Red Flags Alert Section (Calm Google Alert Styling) */}
      <div className="bg-red-50/60 rounded-2xl border border-red-200/80 p-6 shadow-2xs">
        <div className="flex items-center space-x-2 text-red-800 font-semibold text-sm mb-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span>When to Seek Urgent Medical Help (Red Flags)</span>
        </div>

        <ul className="space-y-2 text-xs sm:text-sm text-red-950 mb-4 pl-5 list-disc">
          {leaflet.redFlagSymptoms.map((symptom, idx) => (
            <li key={idx} className="leading-relaxed">
              {symptom}
            </li>
          ))}
        </ul>

        <div className="p-4 bg-white rounded-xl border border-red-200 text-xs sm:text-sm text-slate-700 flex items-start space-x-3 shadow-2xs">
          <PhoneCall className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-900">Emergency Guidance:</span>{' '}
            <span className="leading-relaxed">{leaflet.urgentContactInstructions}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
