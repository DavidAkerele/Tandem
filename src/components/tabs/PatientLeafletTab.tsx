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
        return <Moon className="w-4 h-4 text-[#1a73e8]" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* 30-Second Patient Guidance Executive Header - Google Style Clean Surface */}
      <div className="bg-white rounded-xl border border-[#dadce0] p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#f1f3f4]">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-medium px-2 py-0.5 rounded bg-[#f1f3f4] text-[#5f6368] border border-[#dadce0]">
                Patient-Facing Translation
              </span>
              <span className="text-xs text-[#5f6368]">Plain English (Reading Level 6)</span>
            </div>
            <h2 className="text-xl font-semibold text-[#202124] tracking-tight mt-1">
              Personalized Patient Guidance &amp; Care Leaflet
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-[#e8f0fe] text-[#1a73e8] border border-[#d2e3fc] flex items-center space-x-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>Patient: {patientName}</span>
            </span>
          </div>
        </div>

        <div className="bg-[#f8f9fa] border-l-4 border-l-[#1a73e8] p-4 rounded-r-lg space-y-1">
          <span className="text-[11px] font-medium text-[#5f6368] tracking-wider uppercase block">
            Plain English Communication Standard
          </span>
          <p className="text-xs text-[#3c4043] leading-relaxed">
            Written in accessible plain English to help you and your family manage your health, recovery steps, and medications safely at home.
          </p>
        </div>
      </div>

      {/* Summary Bullet Points Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="bg-white rounded-xl border border-[#dadce0] p-5 shadow-xs space-y-3">
          <h3 className="font-semibold text-[#202124] text-xs uppercase tracking-wider flex items-center space-x-2 pb-2 border-b border-[#f1f3f4]">
            <span className="w-2 h-2 rounded-xs bg-[#1a73e8]"></span>
            <span>Why you were seen / Reason for care</span>
          </h3>
          <div className="space-y-2">
            {(leaflet.reasonBulletPoints && leaflet.reasonBulletPoints.length > 0
              ? leaflet.reasonBulletPoints
              : leaflet.reasonForAdmission.split(/(?<=[.!?])\s+/).filter(Boolean)
            ).map((point, idx) => (
              <div key={idx} className="flex items-start space-x-2 text-xs text-[#3c4043]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1a73e8] mt-1.5 flex-shrink-0" />
                <span className="leading-relaxed">{point}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#dadce0] p-5 shadow-xs space-y-3">
          <h3 className="font-semibold text-[#202124] text-xs uppercase tracking-wider flex items-center space-x-2 pb-2 border-b border-[#f1f3f4]">
            <span className="w-2 h-2 rounded-xs bg-[#188038]"></span>
            <span>What was done during your care</span>
          </h3>
          <div className="space-y-2">
            {(leaflet.actionsTakenBulletPoints && leaflet.actionsTakenBulletPoints.length > 0
              ? leaflet.actionsTakenBulletPoints
              : leaflet.whatWeDid.split(/(?<=[.!?])\s+/).filter(Boolean)
            ).map((point, idx) => (
              <div key={idx} className="flex items-start space-x-2 text-xs text-[#3c4043]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#188038] mt-1.5 flex-shrink-0" />
                <span className="leading-relaxed">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Current Condition Card */}
      <div className="bg-white rounded-xl border border-[#dadce0] p-5 shadow-xs space-y-3">
        <h3 className="font-semibold text-[#202124] text-xs uppercase tracking-wider flex items-center space-x-2 pb-2 border-b border-[#f1f3f4]">
          <FileCheck className="w-3.5 h-3.5 text-[#1a73e8]" />
          <span>How you are doing today &amp; Next steps</span>
        </h3>
        <div className="space-y-2">
          {(leaflet.conditionBulletPoints && leaflet.conditionBulletPoints.length > 0
            ? leaflet.conditionBulletPoints
            : leaflet.currentCondition.split(/(?<=[.!?])\s+/).filter(Boolean)
          ).map((point, idx) => (
            <div key={idx} className="flex items-start space-x-2 text-xs text-[#3c4043]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1a73e8] mt-1.5 flex-shrink-0" />
              <span className="leading-relaxed">{point}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Medicine Schedule Table */}
      <div className="bg-white rounded-xl border border-[#dadce0] p-5 shadow-xs space-y-3">
        <div className="pb-2 border-b border-[#f1f3f4]">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#202124]">
            Your Daily Medication Timetable
          </h3>
          <p className="text-[11px] text-[#5f6368]">
            Clear daily timetable of what medicines to take, dose, and instructions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {leaflet.dailyMedicineSchedule.map((period, index) => (
            <div
              key={index}
              className="bg-[#f8f9fa] rounded-lg border border-[#dadce0] p-3.5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center space-x-2 font-semibold text-[#202124] text-xs mb-2 pb-1.5 border-b border-[#dadce0]">
                  {getTimeIcon(period.timeOfDay)}
                  <span>{period.timeOfDay}</span>
                </div>

                {period.medicines.length === 0 ? (
                  <p className="text-xs text-[#80868b] italic py-2">
                    No medications needed.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {period.medicines.map((m, mIdx) => (
                      <div key={mIdx} className="bg-white p-2.5 rounded-md border border-[#dadce0] shadow-xs text-xs">
                        <div className="font-semibold text-[#202124]">{m.name}</div>
                        <div className="text-xs text-[#1a73e8] font-semibold mt-0.5">{m.dose}</div>
                        {m.note && (
                          <div className="text-[11px] text-[#5f6368] mt-1 leading-snug">{m.note}</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {period.instructions && (
                <div className="mt-3 pt-2 border-t border-[#dadce0] text-[11px] text-[#5f6368] leading-relaxed">
                  {period.instructions}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Red Flags Alert Section - Google Warning Surface */}
      <div className="bg-red-50/60 rounded-xl border border-red-200 p-5 shadow-xs space-y-3">
        <div className="flex items-center space-x-2 text-red-800 font-semibold text-xs uppercase tracking-wider pb-2 border-b border-red-200/80">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span>When to Seek Urgent Medical Help (Red Flags)</span>
        </div>

        <ul className="space-y-1.5 text-xs text-red-950 pl-5 list-disc">
          {leaflet.redFlagSymptoms.map((symptom, idx) => (
            <li key={idx} className="leading-relaxed">
              {symptom}
            </li>
          ))}
        </ul>

        <div className="p-3.5 bg-white rounded-lg border border-red-200 text-xs text-[#3c4043] flex items-start space-x-3 shadow-xs">
          <PhoneCall className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-[#202124]">Emergency Guidance:</span>{' '}
            <span className="leading-relaxed">{leaflet.urgentContactInstructions}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
