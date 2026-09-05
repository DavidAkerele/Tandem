import React, { useState } from 'react';
import { Header } from './components/Header';
import { TimelineFeed } from './components/TimelineFeed';
import { SynthesizerCockpit } from './components/SynthesizerCockpit';
import { mockClinicalCases } from './data/mockCases';
import { ClinicalCase, TimelineEvent, DischargeSummary, CareSetting, AuditTrailEntry } from './types/clinical';

export const App: React.FC = () => {
  const [cases, setCases] = useState<ClinicalCase[]>(mockClinicalCases);
  const [selectedCaseId, setSelectedCaseId] = useState<string>(mockClinicalCases[0].id);
  const [selectedCareSetting, setSelectedCareSetting] = useState<'all' | CareSetting>('all');
  const [activeCitationId, setActiveCitationId] = useState<string | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [synthesisStep, setSynthesisStep] = useState<number>(0);

  const currentCase = cases.find((c) => c.id === selectedCaseId) || cases[0];

  // Handle switching clinical cases
  const handleSelectCase = (caseId: string) => {
    setSelectedCaseId(caseId);
    setActiveCitationId(null);
  };

  // Handle filtering cases by care setting
  const handleSelectCareSetting = (setting: 'all' | CareSetting) => {
    setSelectedCareSetting(setting);
    setActiveCitationId(null);

    // If changing setting and current case does not match, auto-select first matching case
    if (setting !== 'all') {
      const match = cases.find((c) => c.careSetting === setting);
      if (match && currentCase.careSetting !== setting) {
        setSelectedCaseId(match.id);
      }
    }
  };

  // Reset current case to clean mock data
  const handleReset = () => {
    const original = mockClinicalCases.find((c) => c.id === selectedCaseId);
    if (original) {
      setCases((prev) =>
        prev.map((c) => (c.id === selectedCaseId ? JSON.parse(JSON.stringify(original)) : c))
      );
      setActiveCitationId(null);
    }
  };

  // Trigger realistic clinical synthesis simulation
  const handleSynthesize = () => {
    setIsSynthesizing(true);
    setSynthesisStep(0);

    const stepInterval = setInterval(() => {
      setSynthesisStep((prev) => {
        if (prev >= 3) {
          clearInterval(stepInterval);
          setIsSynthesizing(false);
          return 3;
        }
        return prev + 1;
      });
    }, 450);
  };

  // Add custom note to current case timeline
  const handleAddNote = (newNote: Omit<TimelineEvent, 'id'>) => {
    const noteId = `custom-${Date.now()}`;
    const fullNote: TimelineEvent = { ...newNote, id: noteId };

    setCases((prev) =>
      prev.map((c) => {
        if (c.id === selectedCaseId) {
          return {
            ...c,
            timeline: [...c.timeline, fullNote],
          };
        }
        return c;
      })
    );

    // Prompt user to re-synthesize
    handleSynthesize();
  };

  // Update discharge summary
  const handleUpdateSummary = (updatedSummary: DischargeSummary) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id === selectedCaseId) {
          return {
            ...c,
            defaultSummary: updatedSummary,
          };
        }
        return c;
      })
    );
  };

  const [isContradictionModalOpen, setIsContradictionModalOpen] = useState(false);

  // Resolve a single contradiction with clinical action
  const handleResolveContradiction = (
    contradictionId: string,
    resolutionId: string,
    notes?: string
  ) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id === selectedCaseId && c.dataContradictions) {
          const targetConflict = c.dataContradictions.find((x) => x.id === contradictionId);
          const chosenOption = targetConflict?.resolutionOptions.find((o) => o.id === resolutionId);
          const effectiveComment =
            notes && notes.trim()
              ? notes.trim()
              : chosenOption?.actionDescription ||
                'Reconciled via clinician safety verification and DCB0129 guardrail.';

          const updatedContradictions = c.dataContradictions.map((conflict) => {
            if (conflict.id === contradictionId) {
              return {
                ...conflict,
                isResolved: true,
                selectedResolutionId: resolutionId,
                resolvedBy: 'Dr. Alex Smith (GMC 7849201)',
                resolvedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                resolutionNotes: effectiveComment,
              };
            }
            return conflict;
          });

          // Harmonize clinical data according to the clinician's resolution choice
          const updatedSummary = { ...c.defaultSummary };
          if (contradictionId === 'conflict-penicillin-coamox') {
            updatedSummary.medications = updatedSummary.medications.map((m) =>
              m.drugName.toLowerCase().includes('co-amoxiclav')
                ? { ...m, status: 'stopped', dischargeDose: 'CANCELLED - ALLERGY' }
                : m
            );
          }
          if (contradictionId === 'conflict-potassium-spironolactone') {
            updatedSummary.medications = updatedSummary.medications.map((m) =>
              m.drugName.toLowerCase().includes('spironolactone')
                ? { ...m, status: 'stopped', dischargeDose: 'WITHHELD - HYPERKALEMIA' }
                : m
            );
          }
          if (contradictionId === 'conflict-radiology-diagnosis') {
            updatedSummary.primaryDiagnosis = {
              term: 'Severe Bilateral Aspiration Pneumonia',
              snomedCode: '423405001',
              icd10: 'J69.0',
              citationId: 'ev-hall-ct-scan',
            };
          }
          if (contradictionId === 'conflict-hl7-microbiology-latency') {
            const hasCipro = updatedSummary.medications.some((m) =>
              m.drugName.toLowerCase().includes('ciprofloxacin')
            );
            if (!hasCipro) {
              updatedSummary.medications.push({
                id: 'med-hall-cipro',
                drugName: 'Ciprofloxacin (Oral)',
                dischargeDose: '500mg BD for 5 more days (Total 7-day course)',
                route: 'Oral',
                frequency: 'Twice daily',
                status: 'started',
                indication: 'Targeted sensitivity for Klebsiella pneumonia (HL7 antibiogram sync)',
                clinicalRationale: 'Synchronized via HL7 gateway cache flush; replaces empiric beta-lactams.',
                plannedDuration: '5 days',
                gpInstructions: 'Ensure completion of full 7-day course. Stop if tendon pain or neuro symptoms develop.',
                sourceCitationId: 'ev-hall-hl7-lag',
              });
            }
          }
          if (contradictionId === 'conflict-ai-hallucination-diabetes') {
            // Remove hallucinated Metformin
            updatedSummary.medications = updatedSummary.medications.filter(
              (m) => !m.drugName.toLowerCase().includes('metformin')
            );
            // Remove hallucinated diabetes diagnosis
            updatedSummary.secondaryDiagnoses = updatedSummary.secondaryDiagnoses.filter(
              (d) => !d.term.toLowerCase().includes('diabetes')
            );
          }

          // Create permanent Audit Trail Log Entry with comments
          const auditEntry: AuditTrailEntry = {
            id: `audit-${Date.now()}-${contradictionId}`,
            timestamp:
              new Date().toLocaleDateString('en-GB') +
              ' ' +
              new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            caseId: c.id,
            targetItemTitle: targetConflict?.title || contradictionId,
            conflictId: contradictionId,
            category: targetConflict?.errorOrigin || 'human_error',
            actionTaken: chosenOption ? chosenOption.label : 'Reconciled with safety guardrail',
            actor: 'Dr. Alex Smith (GMC 7849201)',
            comments: effectiveComment,
            previousState: targetConflict?.description || '',
            newState: chosenOption?.actionDescription || 'Safety verified and reconciled',
            status: 'reconciled',
          };

          const updatedAuditTrail = [...(c.auditTrail || []), auditEntry];

          return {
            ...c,
            dataContradictions: updatedContradictions,
            defaultSummary: updatedSummary,
            auditTrail: updatedAuditTrail,
          };
        }
        return c;
      })
    );
  };

  // Resolve all contradictions with recommended clinical safety guardrails & rationale comments
  const handleResolveAllContradictions = () => {
    if (!currentCase.dataContradictions) return;
    currentCase.dataContradictions.forEach((conflict) => {
      const rec = conflict.resolutionOptions.find((o) => o.isRecommended) || conflict.resolutionOptions[0];
      let auditComment = 'Auto-resolved via recommended NHS DCB0129 clinical safety guardrail.';
      if (conflict.id === 'conflict-penicillin-coamox') {
        auditComment = 'Verified with allergy band; Penicillin anaphylaxis confirmed. Co-Amoxiclav blocked, non-beta-lactam cover verified.';
      } else if (conflict.id === 'conflict-potassium-spironolactone') {
        auditComment = 'Withheld Spironolactone; repeated hand-carried non-hemolysed VBG confirmed K+ 4.5 mmol/L (initial sample was transit hemolysed).';
      } else if (conflict.id === 'conflict-radiology-diagnosis') {
        auditComment = 'Reconciled against formal CT report (Bilateral aspiration pneumonia); Bed 11 cholecystitis copy-paste error purged.';
      } else if (conflict.id === 'conflict-hl7-microbiology-latency') {
        auditComment = 'Flushed HL7 gateway buffer; synchronized resistant Klebsiella antibiogram and initiated targeted oral Ciprofloxacin.';
      } else if (conflict.id === 'conflict-ai-hallucination-diabetes') {
        auditComment = 'Purged ungrounded Type 2 Diabetes diagnosis and cancelled Metformin order (normal baseline HbA1c 38 mmol/mol).';
      }

      handleResolveContradiction(conflict.id, rec.id, auditComment);
    });
  };

  // Citation highlighting and auto-scrolling
  const handleCitationClick = (citationId: string) => {
    setActiveCitationId(citationId);

    // Scroll timeline to the cited element inside the left scrollable container
    const element = document.getElementById(`timeline-${citationId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Clear highlight after 4 seconds
    setTimeout(() => {
      setActiveCitationId((current) => (current === citationId ? null : current));
    }, 4000);
  };

  return (
    <div className="h-screen w-screen bg-[#f8f9fa] flex flex-col font-sans overflow-hidden selection:bg-blue-100 selection:text-blue-900">
      {/* Global Header */}
      <div className="relative z-40 flex-shrink-0">
        <Header
          cases={cases}
          selectedCaseId={selectedCaseId}
          selectedCareSetting={selectedCareSetting}
          onSelectCase={handleSelectCase}
          onSelectCareSetting={handleSelectCareSetting}
          onSynthesize={handleSynthesize}
          onReset={handleReset}
          isSynthesizing={isSynthesizing}
        />
      </div>

      {/* Main Dual-Pane Workspace */}
      <main className="relative z-10 flex-1 min-h-0 w-full px-4 lg:px-8 xl:px-12 py-5 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 h-full min-h-0">
          {/* Left Pane: Patient Demographic Card + Scrollable Timeline Feed */}
          <div className="lg:col-span-5 xl:col-span-4 h-full min-h-0 flex flex-col overflow-hidden">
            <TimelineFeed
              patient={currentCase.patient}
              timeline={currentCase.timeline}
              contradictions={currentCase.dataContradictions}
              activeCitationId={activeCitationId}
              onAddNote={handleAddNote}
              onInspectConflict={() => setIsContradictionModalOpen(true)}
            />
          </div>

          {/* Right Pane: 5-Tab Clinical Intelligence Cockpit */}
          <div className="lg:col-span-7 xl:col-span-8 h-full min-h-0 flex flex-col overflow-hidden">
            <SynthesizerCockpit
              summary={currentCase.defaultSummary}
              briefing={currentCase.preConsultBriefing}
              recordSummary={currentCase.recordSummary}
              careSetting={currentCase.careSetting}
              contradictions={currentCase.dataContradictions}
              auditTrail={currentCase.auditTrail || []}
              onUpdateSummary={handleUpdateSummary}
              onResolveContradiction={handleResolveContradiction}
              onResolveAllContradictions={handleResolveAllContradictions}
              isSynthesizing={isSynthesizing}
              synthesisStep={synthesisStep}
              onCitationClick={handleCitationClick}
              onJumpToTimelineEvent={handleCitationClick}
              isContradictionModalOpen={isContradictionModalOpen}
              onToggleContradictionModal={setIsContradictionModalOpen}
            />
          </div>
        </div>
      </main>
    </div>
  );
};
