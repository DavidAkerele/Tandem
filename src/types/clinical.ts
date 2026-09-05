export type CareSetting = 'primary_care' | 'secondary_care';

export interface PatientDemographics {
  id: string;
  name: string;
  nhsNumber: string;
  dob: string;
  age: number;
  gender: string;
  bed: string;
  ward: string;
  careSetting: CareSetting;
  practiceOrHospital: string;
  systemOrigin: 'EMIS Web' | 'SystmOne' | 'Epic EHR' | 'Cerner Millennium';
  registeredGp?: string;
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
  category:
    | 'admission'
    | 'ward_round'
    | 'labs'
    | 'microbiology'
    | 'radiology'
    | 'investigation'
    | 'medication'
    | 'consultation'
    | 'triage'
    | 'screening';
  author: string;
  title: string;
  content: string;
  facility?: string;
  keyFindings?: string[];
  abnormalFlags?: string[];
  metrics?: Record<string, string | number>;
  imageUrl?: string;
  imageCaption?: string;
  sourceDocument?: {
    name: string;
    size?: string;
    type?: 'pdf' | 'doc' | 'scan';
  };
  contradictionId?: string;
  contradictionSeverity?: 'critical' | 'high' | 'moderate';
  isFlagged?: boolean;
  flagReason?: string;
  flagType?: 'contradiction' | 'ai_hallucination' | 'system_error';
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
  complianceNote?: string;
  repeatStatus?: 'acute' | 'repeat' | 'dispensed_30d' | 'overdue';
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
  reasonBulletPoints?: string[];
  whatWeDid: string;
  actionsTakenBulletPoints?: string[];
  currentCondition: string;
  conditionBulletPoints?: string[];
  dailyMedicineSchedule: {
    timeOfDay: 'Morning' | 'Lunch' | 'Evening' | 'Bedtime';
    medicines: { name: string; dose: string; note: string }[];
    instructions: string;
  }[];
  redFlagSymptoms: string[];
  urgentContactInstructions: string;
}

export interface ActiveProblemItem {
  id: string;
  title: string;
  snomedCode?: string;
  onset: string;
  qofStatus?: string;
  controlStatus: 'controlled' | 'suboptimal' | 'uncontrolled' | 'acute' | 'stable' | 'active';
  metrics?: string;
  citationId?: string;
}

export interface CareGapItem {
  id: string;
  title: string;
  category: 'screening' | 'monitoring' | 'vaccination' | 'review';
  urgency: 'immediate_24h' | 'urgent_7d' | 'routine_4w' | 'overdue';
  overdueDuration: string;
  recommendedAction: string;
  rationale: string;
  completed: boolean;
}

export interface SuggestedQuestionItem {
  id: string;
  question: string;
  rationale: string;
  targetCondition: string;
  asked?: boolean;
}

export interface RedFlagItem {
  id: string;
  symptom: string;
  ruleOut: string;
  status: 'ruled_out' | 'requires_assessment' | 'critical';
  notes?: string;
}

export interface PendingInvestigationItem {
  id: string;
  title: string;
  requestedDate: string;
  expectedBy: string;
  source: string;
}

export interface PhysiologicalTrajectory {
  label: string;
  type: 'news2' | 'chronic_disease';
  currentScore?: number;
  trajectoryTrend: 'improving' | 'stable' | 'deteriorating' | 'suboptimal';
  history: {
    timestamp: string;
    scoreOrValue: string | number;
    parameters?: Record<string, string | number>;
    badgeColor?: string;
  }[];
}

export interface PreConsultBriefing {
  appointmentReason: string;
  triageSummary: string;
  triageBulletPoints?: string[];
  executiveSummary: string;
  executiveBulletPoints?: string[];
  clinicalTrajectory: 'improving' | 'stable' | 'deteriorating' | 'suboptimal';
  activeProblemList: ActiveProblemItem[];
  gapsInCare: CareGapItem[];
  suggestedQuestions: SuggestedQuestionItem[];
  redFlags: RedFlagItem[];
  pendingInvestigations: PendingInvestigationItem[];
  physiologicalTrajectory: PhysiologicalTrajectory;
}

export interface ClinicalImageItem {
  id: string;
  title: string;
  modality: string;
  date: string;
  imageUrl: string;
  findings: string;
  citationId?: string;
}

export interface SystemsSummaryItem {
  id: string;
  system:
    | 'Cardiovascular'
    | 'Metabolic & Endocrine'
    | 'Renal & Genitourinary'
    | 'Respiratory'
    | 'Neurology & Mental Health'
    | 'Musculoskeletal'
    | 'Gastrointestinal';
  status: 'stable' | 'active' | 'watch' | 'resolved';
  narrative: string;
  bulletPoints?: string[];
  keyFindings: string[];
  citationIds: string[];
}

export interface DiagnosticMilestoneItem {
  id: string;
  yearOrDate: string;
  event: string;
  code?: string;
  type: 'diagnosis' | 'procedure' | 'admission' | 'milestone';
  citationId?: string;
}

export interface RecordSummary {
  executiveNarrative: string;
  executiveBulletPoints?: string[];
  systemsSummary: SystemsSummaryItem[];
  diagnosticMilestones: DiagnosticMilestoneItem[];
  clinicalImages?: ClinicalImageItem[];
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

export interface ContradictionSource {
  documentName: string;
  author: string;
  timestamp: string;
  excerpt: string;
  timelineEventId?: string;
  documentType?: 'clerking' | 'ward_round' | 'lab' | 'radiology' | 'prescription';
}

export interface ContradictionResolutionOption {
  id: string;
  label: string;
  actionDescription: string;
  isRecommended?: boolean;
}

export type ContradictionRootCause = 'human_error' | 'system_error' | 'hybrid_error' | 'ai_hallucination';

export interface SystemErrorDetails {
  systemComponent: string;
  failureMechanism: string;
  telemetryLog?: string;
  mitigationProtocol: string;
}

export interface HumanErrorDetails {
  clinicalRole: string;
  contributingFactor: string;
  errorType: 'transcription_slip' | 'wrong_patient_copy_paste' | 'omission_during_handover' | 'rule_violation';
}

export interface AIHallucinationDetails {
  hallucinatedClaim: string;
  sourceEvidenceLacking: string;
  groundTruthRecord: string;
  mitigationAction: string;
}

export interface AuditTrailEntry {
  id: string;
  timestamp: string;
  caseId: string;
  targetItemTitle: string;
  conflictId?: string;
  category: ContradictionRootCause;
  actionTaken: string;
  actor: string;
  comments: string;
  previousState?: string;
  newState?: string;
  status: 'reconciled' | 'overridden' | 'flagged';
}

export interface DataContradiction {
  id: string;
  severity: 'critical' | 'high' | 'moderate';
  category: 'allergy_medication' | 'biochemistry_prescription' | 'radiology_diagnosis' | 'clinical_history' | 'telemetry_sync_latency' | 'ai_hallucination_drift';
  errorOrigin: ContradictionRootCause;
  title: string;
  description: string;
  clinicalRisk: string;
  sources: ContradictionSource[];
  suggestedResolution: string;
  resolutionOptions: ContradictionResolutionOption[];
  systemError?: SystemErrorDetails;
  humanError?: HumanErrorDetails;
  aiHallucination?: AIHallucinationDetails;
  isResolved?: boolean;
  selectedResolutionId?: string;
  resolvedBy?: string;
  resolvedAt?: string;
  resolutionNotes?: string;
}

export interface ClinicalCase {
  id: string;
  careSetting: CareSetting;
  title: string;
  subtitle: string;
  specialty: string;
  patient: PatientDemographics;
  timeline: TimelineEvent[];
  preConsultBriefing: PreConsultBriefing;
  recordSummary: RecordSummary;
  defaultSummary: DischargeSummary;
  dataContradictions?: DataContradiction[];
  auditTrail?: AuditTrailEntry[];
}
