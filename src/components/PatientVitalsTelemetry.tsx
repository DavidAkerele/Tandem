import React, { useState, useEffect } from 'react';
import {
  Heart, Activity, Wind, Gauge, ShieldCheck, TrendingDown, TrendingUp, Minus, ChevronDown
} from 'lucide-react';
import { PatientDemographics } from '../types/clinical';

interface PatientVitalsTelemetryProps {
  patient: PatientDemographics;
}

interface VitalMetric {
  id: string;
  label: string;
  value: string;
  unit: string;
  subtext: string;
  status: 'normal' | 'warning' | 'critical';
  trend: 'improving' | 'stable' | 'deteriorating';
  sparkline: number[]; // values
  color: string;
}

// Deterministic vitals data derived from the active patient case
const getVitalsForPatient = (patientId: string): VitalMetric[] => {
  switch (patientId) {
      case 'pt-gp-001': // David Jenkins - T2D / Neuropathy
        return [
          {
            id: 'hr',
            label: 'Heart Rate',
            value: '74',
            unit: 'bpm',
            subtext: 'Normal Sinus Rhythm',
            status: 'normal',
            trend: 'stable',
            sparkline: [72, 75, 71, 74, 76, 73, 74],
            color: '#d93025',
          },
          {
            id: 'bp',
            label: 'Blood Pressure',
            value: '134/82',
            unit: 'mmHg',
            subtext: 'MAP 99 • Controlled HTN',
            status: 'normal',
            trend: 'improving',
            sparkline: [142, 138, 140, 136, 138, 135, 134],
            color: '#1a73e8',
          },
          {
            id: 'spo2',
            label: 'Oxygen Saturation',
            value: '98%',
            unit: 'SpO₂',
            subtext: 'Room Air • Ambient',
            status: 'normal',
            trend: 'stable',
            sparkline: [98, 97, 98, 99, 98, 98, 98],
            color: '#188038',
          },
          {
            id: 'metabolic',
            label: 'HbA1c Biomarker',
            value: '86',
            unit: 'mmol/mol',
            subtext: 'Escalation Threshold Breached',
            status: 'critical',
            trend: 'deteriorating',
            sparkline: [62, 65, 69, 72, 74, 80, 86],
            color: '#ea8600',
          },
        ];

      case 'pt-ed-002': // Rajesh Sharma - Sepsis / Pyelonephritis
        return [
          {
            id: 'hr',
            label: 'Heart Rate',
            value: '104',
            unit: 'bpm',
            subtext: 'Sinus Tachycardia (Downtrending)',
            status: 'warning',
            trend: 'improving',
            sparkline: [118, 114, 112, 108, 106, 105, 104],
            color: '#d93025',
          },
          {
            id: 'bp',
            label: 'Blood Pressure',
            value: '108/64',
            unit: 'mmHg',
            subtext: 'MAP 79 • Post-IV Resuscitation',
            status: 'normal',
            trend: 'improving',
            sparkline: [92, 94, 98, 102, 104, 106, 108],
            color: '#1a73e8',
          },
          {
            id: 'spo2',
            label: 'Oxygen Saturation',
            value: '97%',
            unit: 'SpO₂',
            subtext: 'Room Air (AFB negative)',
            status: 'normal',
            trend: 'stable',
            sparkline: [95, 96, 96, 97, 97, 96, 97],
            color: '#188038',
          },
          {
            id: 'news2',
            label: 'NEWS2 Score',
            value: '1',
            unit: 'Acuity',
            subtext: 'Low Clinical Risk (Prev 5)',
            status: 'normal',
            trend: 'improving',
            sparkline: [5, 5, 4, 3, 2, 1, 1],
            color: '#188038',
          },
        ];

      case 'pt-inpatient-003': // Eleanor Evans - Heart Failure
        return [
          {
            id: 'hr',
            label: 'Heart Rate',
            value: '82',
            unit: 'bpm',
            subtext: 'Rate-Controlled Atrial Fib',
            status: 'normal',
            trend: 'improving',
            sparkline: [98, 92, 88, 85, 84, 83, 82],
            color: '#d93025',
          },
          {
            id: 'bp',
            label: 'Blood Pressure',
            value: '126/78',
            unit: 'mmHg',
            subtext: 'MAP 94 • Post-Diuresis',
            status: 'normal',
            trend: 'improving',
            sparkline: [142, 138, 134, 130, 128, 126, 126],
            color: '#1a73e8',
          },
          {
            id: 'spo2',
            label: 'Oxygen Saturation',
            value: '96%',
            unit: 'SpO₂',
            subtext: '2L Nasal Cannula (Weaning)',
            status: 'normal',
            trend: 'improving',
            sparkline: [92, 93, 94, 95, 95, 96, 96],
            color: '#188038',
          },
          {
            id: 'fluid',
            label: 'Fluid Balance',
            value: '-1.4',
            unit: 'L/24h',
            subtext: 'Net Negative Balance Target Met',
            status: 'normal',
            trend: 'improving',
            sparkline: [2.8, 1.9, 0.4, -0.6, -1.1, -1.3, -1.4],
            color: '#1a73e8',
          },
        ];

      case 'pt-hall-006': // Margaret Hall - Contradiction Case
        return [
          {
            id: 'hr',
            label: 'Heart Rate',
            value: '88',
            unit: 'bpm',
            subtext: 'Sinus Rhythm • Stable',
            status: 'normal',
            trend: 'stable',
            sparkline: [92, 90, 89, 88, 89, 87, 88],
            color: '#d93025',
          },
          {
            id: 'bp',
            label: 'Blood Pressure',
            value: '124/76',
            unit: 'mmHg',
            subtext: 'MAP 92 • Normotensive',
            status: 'normal',
            trend: 'stable',
            sparkline: [128, 126, 125, 124, 122, 124, 124],
            color: '#1a73e8',
          },
          {
            id: 'spo2',
            label: 'Oxygen Saturation',
            value: '95%',
            unit: 'SpO₂',
            subtext: '2L O₂ • Resolving Pneumonia',
            status: 'warning',
            trend: 'improving',
            sparkline: [91, 92, 93, 94, 94, 95, 95],
            color: '#188038',
          },
          {
            id: 'news2',
            label: 'NEWS2 Score',
            value: '2',
            unit: 'Acuity',
            subtext: 'Low Risk (Respiratory Focus)',
            status: 'normal',
            trend: 'improving',
            sparkline: [4, 4, 3, 3, 2, 2, 2],
            color: '#ea8600',
          },
        ];

      default:
        return [
          {
            id: 'hr',
            label: 'Heart Rate',
            value: '72',
            unit: 'bpm',
            subtext: 'Normal Sinus Rhythm',
            status: 'normal',
            trend: 'stable',
            sparkline: [70, 72, 71, 73, 72, 71, 72],
            color: '#d93025',
          },
          {
            id: 'bp',
            label: 'Blood Pressure',
            value: '122/76',
            unit: 'mmHg',
            subtext: 'MAP 91 • Target Normal',
            status: 'normal',
            trend: 'stable',
            sparkline: [126, 124, 122, 123, 121, 122, 122],
            color: '#1a73e8',
          },
          {
            id: 'spo2',
            label: 'Oxygen Saturation',
            value: '99%',
            unit: 'SpO₂',
            subtext: 'Room Air Ambient',
            status: 'normal',
            trend: 'stable',
            sparkline: [98, 98, 99, 99, 98, 99, 99],
            color: '#188038',
          },
          {
            id: 'news2',
            label: 'NEWS2 Score',
            value: '0',
            unit: 'Acuity',
            subtext: 'Baseline Physiological Stability',
            status: 'normal',
            trend: 'stable',
            sparkline: [2, 1, 1, 0, 0, 0, 0],
            color: '#188038',
          },
        ];
    }
};

// Helper to construct an SVG path from array of numbers
const renderSparkline = (points: number[], color: string) => {
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min === 0 ? 1 : max - min;
  const width = 64;
  const height = 24;

  const coordinates = points.map((p, idx) => {
    const x = (idx / (points.length - 1)) * width;
    const y = height - ((p - min) / range) * (height - 6) - 3;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const pathD = `M ${coordinates.join(' L ')}`;

  return (
    <svg
      className="w-16 h-6 overflow-visible flex-shrink-0"
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
    >
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* End dot marker */}
      {coordinates.length > 0 && (
        <circle
          cx={coordinates[coordinates.length - 1].split(',')[0]}
          cy={coordinates[coordinates.length - 1].split(',')[1]}
          r="2.5"
          fill={color}
        />
      )}
    </svg>
  );
};

const getMetricIcon = (id: string) => {
  switch (id) {
    case 'hr':
      return <Heart className="w-3.5 h-3.5 text-[#d93025]" />;
    case 'bp':
      return <Activity className="w-3.5 h-3.5 text-[#1a73e8]" />;
    case 'spo2':
      return <Wind className="w-3.5 h-3.5 text-[#188038]" />;
    default:
      return <Gauge className="w-3.5 h-3.5 text-[#ea8600]" />;
  }
};

export const PatientVitalsTelemetry: React.FC<PatientVitalsTelemetryProps> = ({ patient }) => {
  const [vitals, setVitals] = useState<VitalMetric[]>(() => getVitalsForPatient(patient.id));
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Re-seed vitals whenever active patient changes
  useEffect(() => {
    setVitals(getVitalsForPatient(patient.id));
  }, [patient.id]);

  // Telemedicine visual feed: Real-time physiological telemetry drift
  useEffect(() => {
    const interval = setInterval(() => {
      setVitals((prevVitals) =>
        prevVitals.map((metric) => {
          if (metric.id === 'hr') {
            const currentHR = parseInt(metric.value, 10);
            if (isNaN(currentHR)) return metric;
            const delta = Math.random() > 0.5 ? 1 : -1;
            const baseHR = parseInt(getVitalsForPatient(patient.id).find((m) => m.id === 'hr')?.value || '72', 10);
            let nextHR = currentHR + delta;
            if (nextHR > baseHR + 3) nextHR = baseHR + 2;
            if (nextHR < baseHR - 3) nextHR = baseHR - 2;
            const nextSparkline = [...metric.sparkline.slice(1), nextHR];
            return {
              ...metric,
              value: String(nextHR),
              sparkline: nextSparkline,
            };
          }

          if (metric.id === 'bp') {
            const parts = metric.value.split('/');
            if (parts.length === 2) {
              const systolic = parseInt(parts[0], 10);
              const diastolic = parseInt(parts[1], 10);
              const deltaSys = Math.random() > 0.5 ? 1 : -1;
              const nextSys = systolic + deltaSys;
              const nextSparkline = [...metric.sparkline.slice(1), nextSys];
              return {
                ...metric,
                value: `${nextSys}/${diastolic}`,
                sparkline: nextSparkline,
              };
            }
          }

          if (metric.id === 'spo2') {
            const currentSpO2 = parseInt(metric.value.replace('%', ''), 10);
            if (!isNaN(currentSpO2) && Math.random() > 0.6) {
              const delta = Math.random() > 0.5 ? 1 : -1;
              const nextSpO2 = Math.min(100, Math.max(95, currentSpO2 + delta));
              return {
                ...metric,
                value: `${nextSpO2}%`,
                sparkline: [...metric.sparkline.slice(1), nextSpO2],
              };
            }
          }

          return metric;
        })
      );
    }, 2800);

    return () => clearInterval(interval);
  }, [patient.id]);

  return (
    <div className="flex-shrink-0 bg-white rounded-xl p-3 border border-[#dadce0] shadow-xs transition-all">
      {/* Clickable Header Bar */}
      <div
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="flex items-center justify-between cursor-pointer select-none"
        title={isCollapsed ? 'Click to expand telemetry cards' : 'Click to collapse telemetry cards'}
      >
        <div className="flex items-center space-x-2">
          <Activity className="w-3.5 h-3.5 text-[#1a73e8]" />
          <h3 className="text-xs font-semibold text-[#202124] uppercase tracking-wider">
            Telemetry &amp; Vitals Feed
          </h3>
        </div>

        <div className="flex items-center space-x-2">
          {/* If collapsed, show compact live summary inline */}
          {isCollapsed && (
            <div className="flex items-center space-x-1.5 text-[10px] font-mono text-[#3c4043] bg-[#f8f9fa] px-2 py-0.5 rounded-md border border-[#dadce0]">
              <span className="font-semibold text-[#d93025]">HR {vitals.find((v) => v.id === 'hr')?.value}</span>
              <span className="text-[#dadce0]">|</span>
              <span className="font-semibold text-[#1a73e8]">BP {vitals.find((v) => v.id === 'bp')?.value}</span>
              <span className="text-[#dadce0]">|</span>
              <span className="font-semibold text-[#188038]">{vitals.find((v) => v.id === 'spo2')?.value}</span>
            </div>
          )}

          <div className="flex items-center space-x-1 text-[10px] text-[#188038] font-medium">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-sm bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-sm h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-[10px]">LIVE</span>
          </div>

          <div className="p-0.5 text-[#5f6368] hover:text-[#202124] transition-colors">
            <ChevronDown
              className={`w-3.5 h-3.5 transform transition-transform duration-200 ${
                isCollapsed ? '-rotate-90' : 'rotate-0'
              }`}
            />
          </div>
        </div>
      </div>

      {/* 4-Card Responsive Grid - Hidden when collapsed */}
      {!isCollapsed && (
        <div className="grid grid-cols-2 gap-2 mt-2.5 pt-2 border-t border-[#f1f3f4]">
          {vitals.map((metric) => (
            <div
              key={metric.id}
              className="p-2.5 rounded-lg border border-[#dadce0] bg-[#f8f9fa] hover:bg-white hover:border-[#bdc1c6] transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  {getMetricIcon(metric.id)}
                  <span className="text-[10px] font-medium text-[#5f6368]">{metric.label}</span>
                </div>
                {metric.trend === 'improving' ? (
                  <span className="text-[9px] text-[#188038] font-medium flex items-center">
                    <TrendingUp className="w-2.5 h-2.5 mr-0.5" />
                    Optimal
                  </span>
                ) : metric.trend === 'deteriorating' ? (
                  <span className="text-[9px] text-[#d93025] font-medium flex items-center">
                    <TrendingDown className="w-2.5 h-2.5 mr-0.5" />
                    Alert
                  </span>
                ) : (
                  <span className="text-[9px] text-[#5f6368] font-medium flex items-center">
                    <Minus className="w-2.5 h-2.5 mr-0.5" />
                    Stable
                  </span>
                )}
              </div>

              <div className="flex items-baseline justify-between mt-1">
                <div>
                  <span className="text-sm font-bold text-[#202124] tracking-tight">
                    {metric.value}
                  </span>{' '}
                  <span className="text-[10px] text-[#5f6368]">{metric.unit}</span>
                </div>
                {renderSparkline(metric.sparkline, metric.color)}
              </div>

              <p className="text-[10px] text-[#5f6368] truncate mt-1 border-t border-[#dadce0]/60 pt-1">
                {metric.subtext}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
