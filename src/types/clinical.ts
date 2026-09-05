export interface PatientDemographics {
  id: string;
  name: string;
  nhsNumber: string;
  dob: string;
  age: number;
  gender: string;
  bed: string;
  ward: string;
  admissionDate: string;
  dischargeDate: string;
  consultant: string;
  allergies: string[];
}

export interface TimelineEvent {
  id: string;
  dayNumber: number;
  date: string;
  time: string;
  category: 'admission' | 'ward_round' | 'labs' | 'microbiology' | 'radiology' | 'medication';
  author: string;
  title: string;
  content: string;
  keyFindings?: string[];
  abnormalFlags?: string[];
  sourceDocument?: {
    name: string;
    size?: string;
    type?: 'pdf' | 'doc' | 'scan';
  };
}

export interface MedicationDiffItem {
  id: string;
  drugName: string;
  status: 'started' | 'stopped' | 'changed' | 'continued';
  priorDose?: string;
  dischargeDose: string;
  route: string;
  frequency: string;
  indication: string;
  clinicalRationale: string;
  plannedDuration?: string;
  gpInstructions?: string;
  sourceCitationId?: string; // Links to a TimelineEvent.id
}

export interface GPActionItem {
  id: string;
  urgency: 'immediate_24h' | 'urgent_7d' | 'routine_4w' | 'safety_net';
  action: string;
  rationale: string;
  timeline: string;
  assignedRole: string;
  completed: boolean;
  sourceCitationId?: string;
}

export interface PatientLeafletData {
  reasonForAdmission: string;
  whatWeDid: string;
  currentCondition: string;
  dailyMedicineSchedule: {
    timeOfDay: 'Morning' | 'Lunch' | 'Evening' | 'Bedtime';
    medicines: { name: string; dose: string; note: string }[];
    instructions: string;
  }[];
  redFlagSymptoms: string[];
  urgentContactInstructions: string;
}

export interface DischargeSummary {
  patient: PatientDemographics;
  primaryDiagnosis: {
    term: string;
    snomedCode: string;
    icd10: string;
    citationId: string;
  };
  secondaryDiagnoses: {
    term: string;
    snomedCode: string;
    icd10: string;
    citationId: string;
  }[];
  hospitalCourse: {
    system: string;
    summary: string;
    citationId: string;
  }[];
  procedures: {
    name: string;
    date: string;
    findings: string;
    citationId: string;
  }[];
  medications: MedicationDiffItem[];
  gpActions: GPActionItem[];
  patientLeaflet: PatientLeafletData;
  dischargeDestination: string;
  dischargeStatus: 'draft' | 'verified' | 'dispatched';
}

export interface ClinicalCase {
  id: string;
  title: string;
  subtitle: string;
  specialty: string;
  patient: PatientDemographics;
  timeline: TimelineEvent[];
  defaultSummary: DischargeSummary;
}
