import React, { useState } from 'react';
import { Header } from './components/Header';
import { TimelineFeed } from './components/TimelineFeed';
import { SynthesizerCockpit } from './components/SynthesizerCockpit';
import { mockClinicalCases } from './data/mockCases';
import { ClinicalCase, TimelineEvent, DischargeSummary } from './types/clinical';

export const App: React.FC = () => {
  const [cases, setCases] = useState<ClinicalCase[]>(mockClinicalCases);
  const [selectedCaseId, setSelectedCaseId] = useState<string>(mockClinicalCases[0].id);
  const [activeCitationId, setActiveCitationId] = useState<string | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [synthesisStep, setSynthesisStep] = useState<number>(0);

  const currentCase = cases.find((c) => c.id === selectedCaseId) || cases[0];

  // Handle switching clinical cases
  const handleSelectCase = (caseId: string) => {
    setSelectedCaseId(caseId);
    setActiveCitationId(null);
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
    <div className="h-screen w-screen bg-[#f4f7fb] flex flex-col font-sans overflow-hidden selection:bg-blue-100 selection:text-blue-900 relative">
      {/* Ambient Liquid Fluid Glow Layer (Refracts through all frosted glass panels) */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
        {/* Azure / Cobalt Liquid Orb */}
        <div className="absolute top-[-100px] left-[-80px] w-[580px] h-[580px] rounded-full bg-gradient-to-tr from-blue-500/20 via-indigo-400/22 to-cyan-300/18 blur-[100px] animate-liquid-orb-1" />
        {/* Emerald / Cyan Liquid Orb */}
        <div className="absolute bottom-[-140px] right-[-100px] w-[680px] h-[680px] rounded-full bg-gradient-to-bl from-teal-400/18 via-sky-400/20 to-blue-600/14 blur-[120px] animate-liquid-orb-2" />
        {/* Violet / Sky Center Ambient Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[520px] h-[520px] rounded-full bg-gradient-to-r from-purple-400/12 via-indigo-300/16 to-sky-300/12 blur-[110px] animate-liquid-orb-3" />
        {/* Microscopic Grid Refraction Mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:28px_28px] opacity-[0.022]" />
      </div>

      {/* Global Header (Fixed Height, Liquid Glass) */}
      <div className="relative z-40 flex-shrink-0">
        <Header
          cases={cases}
          selectedCaseId={selectedCaseId}
          onSelectCase={handleSelectCase}
          onSynthesize={handleSynthesize}
          onReset={handleReset}
          isSynthesizing={isSynthesizing}
        />
      </div>

      {/* Main Dual-Pane Workspace (Full Height, Independent Scrolling, Liquid Glass Panels) */}
      <main className="relative z-10 flex-1 min-h-0 w-full px-6 lg:px-10 xl:px-12 py-6 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 h-full min-h-0">
          {/* Left Pane: Static Patient Details + Scrollable Ward Notes */}
          <div className="lg:col-span-5 xl:col-span-4 h-full min-h-0 flex flex-col overflow-hidden">
            <TimelineFeed
              patient={currentCase.patient}
              timeline={currentCase.timeline}
              activeCitationId={activeCitationId}
              onAddNote={handleAddNote}
            />
          </div>

          {/* Right Pane: Static Controls & Tabs + Scrollable Tab Content */}
          <div className="lg:col-span-7 xl:col-span-8 h-full min-h-0 flex flex-col overflow-hidden">
            <SynthesizerCockpit
              summary={currentCase.defaultSummary}
              onUpdateSummary={handleUpdateSummary}
              isSynthesizing={isSynthesizing}
              synthesisStep={synthesisStep}
              onCitationClick={handleCitationClick}
            />
          </div>
        </div>
      </main>
    </div>
  );
};
