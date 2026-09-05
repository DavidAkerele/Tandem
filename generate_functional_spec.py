import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from canvas_helper import NumberedCanvas

class FunctionalSpecCanvas(NumberedCanvas):
    doc_title = "Tandem Discharge — Lovable Scaffolding & Functional Blueprint | NXGN x Tandem Health"

def build_functional_spec_pdf(filename="TandemDischarge_Lovable_Functional_Spec.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    # Custom Color Palette
    PRIMARY = colors.HexColor("#0F766E")      # Teal 700
    PRIMARY_DARK = colors.HexColor("#115E59") # Teal 800
    PRIMARY_LIGHT = colors.HexColor("#F0FDFA")# Teal 50
    TEXT_DARK = colors.HexColor("#0F172A")    # Slate 900
    TEXT_BODY = colors.HexColor("#334155")    # Slate 700
    BORDER_COLOR = colors.HexColor("#CBD5E1") # Slate 300
    BG_LIGHT = colors.HexColor("#F8FAFC")     # Slate 50
    CODE_BG = colors.HexColor("#F1F5F9")      # Slate 100
    ACCENT_PURPLE = colors.HexColor("#7C3AED")# Purple 600 (Lovable accent)
    ACCENT_PURPLE_LIGHT = colors.HexColor("#F5F3FF")

    title_style = ParagraphStyle(
        'CoverTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=26,
        leading=32,
        textColor=PRIMARY_DARK,
        spaceAfter=12
    )

    subtitle_style = ParagraphStyle(
        'CoverSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16.5,
        textColor=TEXT_BODY,
        spaceAfter=18
    )

    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=19,
        textColor=PRIMARY_DARK,
        spaceBefore=12,
        spaceAfter=6,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=TEXT_DARK,
        spaceBefore=9,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12.5,
        textColor=TEXT_BODY,
        spaceAfter=5
    )

    bullet_style = ParagraphStyle(
        'Bullet_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=TEXT_BODY,
        leftIndent=14,
        firstLineIndent=-9,
        spaceAfter=3
    )

    callout_text = ParagraphStyle(
        'CalloutText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=TEXT_DARK
    )

    table_header = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10.5,
        textColor=colors.white
    )

    table_cell = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=TEXT_DARK
    )

    table_cell_bold = ParagraphStyle(
        'TableCellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=11,
        textColor=TEXT_DARK
    )

    code_block = ParagraphStyle(
        'CodeBlock',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=7,
        leading=9.5,
        textColor=colors.HexColor("#0F172A")
    )

    prompt_box_text = ParagraphStyle(
        'PromptBoxText',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=7.5,
        leading=10.5,
        textColor=colors.HexColor("#312E81")
    )

    story = []

    # =========================================================================
    # PAGE 1: COVER PAGE
    # =========================================================================
    story.append(Spacer(1, 35))

    # Badge
    badge_data = [[
        Paragraph("<b>FUNCTIONAL SPECIFICATION & LOVABLE SCAFFOLDING BLUEPRINT</b>", 
                  ParagraphStyle('Badge', fontName='Helvetica-Bold', fontSize=8.5, textColor=ACCENT_PURPLE, alignment=1))
    ]]
    badge_table = Table(badge_data, colWidths=[360])
    badge_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), ACCENT_PURPLE_LIGHT),
        ('BOX', (0,0), (-1,-1), 1, ACCENT_PURPLE),
        ('PADDING', (0,0), (-1,-1), 4),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(badge_table)
    story.append(Spacer(1, 14))

    story.append(Paragraph("Tandem Discharge", title_style))
    story.append(Paragraph(
        "<b>Turnkey Lovable Implementation Guide & Architecture Blueprint</b><br/>"
        "Complete technical specifications, UI wireframes, TypeScript interfaces, mock NHS clinical cases, "
        "and modular copy-paste prompts to build a winning prototype in under 30 minutes.",
        subtitle_style
    ))

    story.append(HRFlowable(width="100%", thickness=2, color=PRIMARY, spaceBefore=6, spaceAfter=18))

    # Metadata Grid
    meta_data = [
        [Paragraph("<b>Target Generator:</b>", table_cell_bold), Paragraph("Lovable.dev / Claude Code / Vite+React", table_cell),
         Paragraph("<b>Design System:</b>", table_cell_bold), Paragraph("Tailwind CSS + Tandem Teal Theme", table_cell)],
        [Paragraph("<b>Component Kit:</b>", table_cell_bold), Paragraph("Radix UI / Shadcn UI + Lucide Icons", table_cell),
         Paragraph("<b>Build Duration:</b>", table_cell_bold), Paragraph("30 - 45 min scaffold target", table_cell)],
        [Paragraph("<b>EHR Targets:</b>", table_cell_bold), Paragraph("EMIS Web, SystmOne, Epic Hyperspace", table_cell),
         Paragraph("<b>Mock Datasets:</b>", table_cell_bold), Paragraph("3 Pre-loaded NHS Inpatient/Urgent Care Cases", table_cell)],
        [Paragraph("<b>Status:</b>", table_cell_bold), Paragraph("<font color='#16A34A'><b>PRODUCTION READY PROMPTS</b></font>", table_cell),
         Paragraph("<b>Offline Fallback:</b>", table_cell_bold), Paragraph("100% resilient mock mode included", table_cell)]
    ]
    meta_table = Table(meta_data, colWidths=[100, 160, 100, 144])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), BG_LIGHT),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('PADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 18))

    # Strategy Callout
    callout_data = [[
        Paragraph(
            "<b>How to use this document with Lovable:</b><br/>"
            "This functional specification is engineered for direct execution in <b>Lovable</b> (lovable.dev). "
            "It provides exact screen layouts, component trees, TypeScript data models, and a sequence of "
            "<b>5 copy-paste Master Prompts</b>. Feed the prompts sequentially to Lovable to generate the "
            "application rapidly, ensuring seamless UI polish, zero compile bugs, and instant live demo capabilities.",
            callout_text
        )
    ]]
    callout_table = Table(callout_data, colWidths=[504])
    callout_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F5F3FF")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#DDD6FE")),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(callout_table)

    story.append(PageBreak())

    # =========================================================================
    # PAGE 2: SECTION 1: APPLICATION ARCHITECTURE & UI LAYOUT
    # =========================================================================
    story.append(Paragraph("1. Application Architecture & UI Layout", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceBefore=4, spaceAfter=10))

    story.append(Paragraph(
        "The web application utilizes a split-screen <b>Dual-Pane Clinical Cockpit</b> layout. "
        "The left pane presents the raw, chronological patient record, while the right pane renders "
        "the AI-synthesized NHS Electronic Discharge Notification (eDN) across four specialized tabs.",
        body_style
    ))

    # Wireframe Layout Breakdown Table
    layout_data = [
        [Paragraph("Screen Region", table_header),
         Paragraph("Width / Grid", table_header),
         Paragraph("Components & Interactive Controls", table_header)],
        [Paragraph("<b>Global Header</b>", table_cell_bold),
         Paragraph("Full Width (h-16)", table_cell),
         Paragraph("• Tandem Health Teal Logo + 'Discharge' badge.<br/>• Ward Selector: <i>'Ward 4B - Acute Medicine'</i>.<br/>• Clinician Profile Pill: <i>'Dr. Alex Smith (FY1)'</i>.<br/>• <b>Case Selector Dropdown:</b> Toggle between Case 1 (Heart Failure), Case 2 (Urgent Care Asthma), Case 3 (Post-Op Cholecystectomy).<br/>• <b>'Reset Demo'</b> and <b>'New Synthesis'</b> CTA buttons.", table_cell)],
        [Paragraph("<b>Left Pane:<br/>Inpatient Timeline Feed</b>", table_cell_bold),
         Paragraph("38% Width (w-5/12)", table_cell),
         Paragraph("• <b>Patient Demographic Banner:</b> Name, NHS Number, Age, Bed #, Allergy status (red alert for Penicillin).<br/>• <b>Chronological Event Stack:</b><br/>  - <i>Day 0:</i> Admission Clerking & Presenting Complaint.<br/>  - <i>Day 1:</i> Consultant Ward Round & Bedside Echo.<br/>  - <i>Day 2:</i> Blood Test Panel (U&Es with eGFR drop, highlighted).<br/>  - <i>Day 3:</i> Discharge Planning & Medication Adjustments.<br/>  - <i>Drug Chart:</i> Inpatient Kardex snapshot.<br/>• <b>Paste Custom Notes:</b> Accordion to paste raw text.", table_cell)],
        [Paragraph("<b>Right Pane:<br/>Synthesized eDN Cockpit</b>", table_cell_bold),
         Paragraph("62% Width (w-7/12)", table_cell),
         Paragraph("• <b>Top Command Bar:</b><br/>  - Verification status badge (<i>'NHS eDN Verified Draft'</i>).<br/>  - <i>'Show Source Citations'</i> toggle.<br/>  - <b>'Copy to EHR'</b> modal trigger (EMIS / SystmOne / Epic).<br/>  - <b>'Sign Off & Dispatch'</b> button (triggers celebration).<br/>• <b>Four Interactive Tabs:</b><br/>  1. <b>Medical eDN:</b> Structured PRSB summary, SNOMED badges.<br/>  2. <b>Med Rec Matrix:</b> Color-coded 4-category diff table.<br/>  3. <b>GP Action Plan:</b> Prioritized checklist with timelines.<br/>  4. <b>Patient Leaflet:</b> Plain-English take-home guide.", table_cell)]
    ]
    layout_table = Table(layout_data, colWidths=[120, 104, 280])
    layout_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY_DARK),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, BG_LIGHT]),
        ('PADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(layout_table)
    story.append(Spacer(1, 10))

    story.append(Paragraph("1.2 Design System Tokens & Aesthetics", h2_style))
    story.append(Paragraph("• <b>Primary Colors:</b> Teal 700 (<font color='#0F766E'>#0F766E</font>), Teal 600 (<font color='#0D9488'>#0D9488</font>), Teal 50 (<font color='#F0FDFA'>#F0FDFA</font>) matching Tandem Health's corporate identity.", bullet_style))
    story.append(Paragraph("• <b>Neutral Foundation:</b> Slate 900 (<font color='#0F172A'>#0F172A</font>) for headings, Slate 700 (<font color='#334155'>#334155</font>) for body, Slate 50 (<font color='#F8FAFC'>#F8FAFC</font>) for card backgrounds.", bullet_style))
    story.append(Paragraph("• <b>Clinical Category Accents:</b><br/>  - <font color='#16A34A'><b>Started:</b></font> Emerald (bg-emerald-50, text-emerald-700, border-emerald-300)<br/>  - <font color='#DC2626'><b>Stopped:</b></font> Rose (bg-rose-50, text-rose-700, border-rose-300)<br/>  - <font color='#D97706'><b>Dose Changed:</b></font> Amber (bg-amber-50, text-amber-700, border-amber-300)<br/>  - <font color='#2563EB'><b>Continued:</b></font> Blue (bg-blue-50, text-blue-700, border-blue-300)", bullet_style))

    story.append(PageBreak())

    # =========================================================================
    # PAGE 3: SECTION 2: TYPESCRIPT DATA MODELS
    # =========================================================================
    story.append(Paragraph("2. TypeScript Core Data Models", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceBefore=4, spaceAfter=8))

    story.append(Paragraph(
        "Define these exact interfaces in <code>/src/types/clinical.ts</code> to ensure complete type safety:",
        body_style
    ))

    ts_code = """export interface PatientDemographics {
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
  author: string; // e.g. "Dr. A. Smith, FY1" or "Staff Nurse K. Miller"
  title: string;
  content: string;
  keyFindings?: string[];
  abnormalFlags?: string[];
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
}

export interface GPActionItem {
  id: string;
  urgency: 'immediate_24h' | 'urgent_7d' | 'routine_4w' | 'safety_net';
  action: string;
  rationale: string;
  timeline: string;
  assignedRole: string; // e.g. "Practice Nurse", "GP", "Phlebotomy"
  completed: boolean;
}

export interface PatientLeafletData {
  reasonForAdmission: string;
  whatWeDid: string;
  currentCondition: string;
  dailyMedicineSchedule: {
    timeOfDay: 'Morning' | 'Lunch' | 'Evening' | 'Bedtime';
    medicines: string[];
    instructions: string;
  }[];
  redFlagSymptoms: string[];
  urgentContactInstructions: string;
}"""

    code_table = Table([[Paragraph(ts_code.replace('\n', '<br/>').replace(' ', '&nbsp;'), code_block)]], colWidths=[504])
    code_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), CODE_BG),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('PADDING', (0,0), (-1,-1), 7),
    ]))
    story.append(code_table)

    story.append(PageBreak())

    # =========================================================================
    # PAGE 4: SECTION 3: THREE PRE-LOADED NHS MOCK CASES
    # =========================================================================
    story.append(Paragraph("3. Pre-loaded NHS Clinical Cases (Mock Data)", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceBefore=4, spaceAfter=8))

    story.append(Paragraph(
        "Embed these three realistic NHS clinical scenarios in <code>/src/data/mockCases.ts</code>. "
        "Case 2 is specifically tailored to appeal to Dr. Jonathan Tai's Urgent Care leadership.",
        body_style
    ))

    case_data = [
        [Paragraph("Case Identifier", table_header),
         Paragraph("Clinical Specialty", table_header),
         Paragraph("Patient Narrative & Admin Friction", table_header),
         Paragraph("Key Synthesis & Med Rec Moments", table_header)],
        [Paragraph("<b>Case 1:<br/>Mrs. Margaret Evans</b><br/>(82yo Female)", table_cell_bold),
         Paragraph("Acute Medicine / Frailty", table_cell),
         Paragraph("Admitted with severe SOB, orthopnoea, and bilateral ankle oedema. Diagnosed with acute decompensated heart failure. Stayed 4 days on Ward 4B.", table_cell),
         Paragraph("• <b>Furosemide:</b> Doubled to 80mg OD.<br/>• <b>Ramipril:</b> Withheld due to acute eGFR drop (62 -> 38).<br/>• <b>GP Action:</b> Check U&Es in 7 days; restart ACEi when stable.", table_cell)],
        [Paragraph("<b>Case 2:<br/>Ms. Priya Sharma</b><br/>(28yo Female)<br/><i>*Urgent Care Lead Special*</i>", table_cell_bold),
         Paragraph("Urgent Care / Ambulatory Acute", table_cell),
         Paragraph("Severe acute asthma exacerbation triggered by viral URTI. Peak flow 45% predicted. Received 3x Salbutamol/Ipratropium nebs and IV Hydrocortisone in Urgent Care.", table_cell),
         Paragraph("• <b>Prednisolone:</b> 40mg OD for 5 days started.<br/>• <b>Inhaler Technique:</b> Spacer provided.<br/>• <b>GP Action:</b> Mandatory asthma review within 48h; check peak flow diary.", table_cell)],
        [Paragraph("<b>Case 3:<br/>Mr. David Chen</b><br/>(45yo Male)", table_cell_bold),
         Paragraph("General Surgery / Post-Op", table_cell),
         Paragraph("Elective laparoscopic cholecystectomy converted to mini-laparotomy. Developed post-op superficial surgical site infection with fever on Day 2.", table_cell),
         Paragraph("• <b>Co-Amoxiclav:</b> 625mg TDS for 7 days.<br/>• <b>Codeine:</b> Ceased due to severe nausea/constipation; switched to Paracetamol.<br/>• <b>GP Action:</b> Practice nurse wound inspection at Day 7.", table_cell)]
    ]
    case_table = Table(case_data, colWidths=[110, 84, 150, 160])
    case_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY_DARK),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, BG_LIGHT]),
        ('PADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(case_table)
    story.append(Spacer(1, 10))

    story.append(Paragraph("3.2 Realistic NHS Clinical Terminology Guardrails", h2_style))
    story.append(Paragraph("• <b>Acronyms:</b> Use authentic NHS shorthand: SOB (Shortness of Breath), MFFD (Medically Fit for Discharge), U&Es (Urea & Electrolytes), eGFR (estimated Glomerular Filtration Rate), TTO (To-Take-Out).", bullet_style))
    story.append(Paragraph("• <b>Safety Netting:</b> Enforce red flag triggers: chest pain, haemoptysis, acute breathlessness, signs of DVT/PE, sepsis warning signs (NEWS2 score triggers).", bullet_style))

    story.append(PageBreak())

    # =========================================================================
    # PAGE 5: SECTION 4: LOVABLE MASTER PROMPTS 1 & 2
    # =========================================================================
    story.append(Paragraph("4. Lovable Master Prompts — Phase 1 & 2", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceBefore=4, spaceAfter=8))

    story.append(Paragraph(
        "Copy and paste Prompt 1 into Lovable to scaffold the foundation. Once complete, submit Prompt 2.",
        body_style
    ))

    # PROMPT 1
    story.append(Paragraph("Prompt 1: Project Shell, Theme & Layout Scaffold", h2_style))
    p1_text = (
        "Build a modern clinical healthcare web app called 'Tandem Discharge'.\n"
        "Theme: Clean, sleek medical design inspired by Tandem Health. Primary color: Teal (#0F766E, #0D9488), background: Slate-50 (#F8FAFC), card borders: Slate-200, dark slate text.\n"
        "Header: Left side has a brand icon with text 'Tandem Discharge' and a subtle badge 'NHS eDN Synthesizer'. Center has a Ward Selector pill ('Ward 4B - Acute Medicine') and Clinician profile ('Dr. Alex Smith, FY1'). Right side has a Case Selector Dropdown ('Case 1: Heart Failure (82yo F)', 'Case 2: Urgent Care Asthma (28yo F)', 'Case 3: Post-Op Cholecystectomy (45yo M)') and a 'Reset Demo' button.\n"
        "Main layout: Responsive 2-column split screen (Left: 38% width 'Inpatient Timeline Feed', Right: 62% width 'Synthesized eDN Cockpit'). Use Lucide icons throughout."
    )
    p1_table = Table([[Paragraph(p1_text.replace('\n', '<br/>'), prompt_box_text)]], colWidths=[504])
    p1_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#EEF2FF")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#C7D2FE")),
        ('PADDING', (0,0), (-1,-1), 7),
    ]))
    story.append(p1_table)
    story.append(Spacer(1, 10))

    # PROMPT 2
    story.append(Paragraph("Prompt 2: Inpatient Timeline Feed & Demographics Component", h2_style))
    p2_text = (
        "In the Left Pane ('Inpatient Timeline Feed'), build a rich chronological record viewer:\n"
        "1. Patient Demographic Banner at top: Name, NHS Number (xxx xxx xxxx), Age, Bed, Admission Date, Consultant, and an Allergy badge (Show 'NKDA' or red warning 'ALLERGY: Penicillin').\n"
        "2. Chronological Vertical Timeline: Render event cards along a vertical teal line for Day 0 (Admission Clerking), Day 1 (Consultant Ward Round), Day 2 (Blood Tests / Labs), Day 3 (Discharge Decision), and Inpatient Drug Chart. Each card has a date badge, author role, title, and bulleted findings.\n"
        "3. Highlight abnormal lab values with an amber pill (e.g. 'eGFR: 38 mL/min [Abnormal Drop]', 'CRP: 84 mg/L').\n"
        "4. Include an 'Add Ward Note' accordion at the bottom allowing custom text pasting."
    )
    p2_table = Table([[Paragraph(p2_text.replace('\n', '<br/>'), prompt_box_text)]], colWidths=[504])
    p2_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#EEF2FF")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#C7D2FE")),
        ('PADDING', (0,0), (-1,-1), 7),
    ]))
    story.append(p2_table)

    story.append(PageBreak())

    # =========================================================================
    # PAGE 6: SECTION 5: LOVABLE MASTER PROMPTS 3 & 4
    # =========================================================================
    story.append(Paragraph("5. Lovable Master Prompts — Phase 3 & 4", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceBefore=4, spaceAfter=8))

    story.append(Paragraph(
        "Execute Prompt 3 to build the tabbed eDN workspace, followed by Prompt 4 for the Med Rec & GP Checklist.",
        body_style
    ))

    # PROMPT 3
    story.append(Paragraph("Prompt 3: Synthesized eDN Cockpit & 4 Interactive Tabs", h2_style))
    p3_text = (
        "In the Right Pane, build the 'Synthesized eDN Cockpit':\n"
        "1. Top Command Bar: Status badge ('Verified NHS eDN Draft'), 'Source Tracing' toggle switch, 'Copy to EHR' button with clipboard icon, and 'Sign Off & Dispatch' primary teal button.\n"
        "2. Four primary Tabs using Radix UI:\n"
        "   - Tab 1: 'Medical eDN (PRSB)' - Formatted according to NHS PRSB standards: Primary Diagnosis with SNOMED-CT code badge, Secondary Diagnoses, Clinical Narrative / Hospital Course, Procedures, Complications, and Discharge Destination.\n"
        "   - Tab 2: 'Medication Reconciliation' - A visual diff table comparing pre-admission vs discharge meds.\n"
        "   - Tab 3: 'GP Action Plan' - Categorized checklist of GP follow-up tasks.\n"
        "   - Tab 4: 'Patient Take-Home Leaflet' - Plain-English summary for the patient.\n"
        "Make all fields editable so the clinician has full human-in-the-loop control."
    )
    p3_table = Table([[Paragraph(p3_text.replace('\n', '<br/>'), prompt_box_text)]], colWidths=[504])
    p3_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#EEF2FF")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#C7D2FE")),
        ('PADDING', (0,0), (-1,-1), 7),
    ]))
    story.append(p3_table)
    story.append(Spacer(1, 10))

    # PROMPT 4
    story.append(Paragraph("Prompt 4: Medication Reconciliation Diff Matrix & GP Action Checklist", h2_style))
    p4_text = (
        "Implement Tab 2 (Medication Reconciliation) and Tab 3 (GP Action Plan):\n"
        "For Tab 2: Build a table with columns [Medication Name, Status, Prior Dose, Discharge Dose, Route/Freq, Indication, Clinical Rationale for Change]. Render status as badges:\n"
        "  - Green: STARTED (e.g. Furosemide 40mg IV)\n"
        "  - Red: STOPPED (e.g. Ramipril 5mg OD - Rationale: 'Withheld due to acute eGFR decline from 62 to 38')\n"
        "  - Amber: DOSE CHANGED (e.g. Furosemide increased to 80mg PO OD)\n"
        "  - Blue: CONTINUED (e.g. Atorvastatin 20mg ON)\n"
        "For Tab 3: Build an interactive checklist grouped by urgency: 'Immediate (24-48h)', 'Urgent (7 Days)', and 'Routine (2-4 Weeks)'. Each item has a checkbox, bold action title, clinical rationale, and assignee pill (e.g. 'Phlebotomy / Practice Nurse: Repeat U&Es in 7 days to reassess renal function prior to restarting ACEi')."
    )
    p4_table = Table([[Paragraph(p4_text.replace('\n', '<br/>'), prompt_box_text)]], colWidths=[504])
    p4_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#EEF2FF")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#C7D2FE")),
        ('PADDING', (0,0), (-1,-1), 7),
    ]))
    story.append(p4_table)

    story.append(PageBreak())

    # =========================================================================
    # PAGE 7: SECTION 6: PROMPT 5 & PRESENTATION CHECKLIST
    # =========================================================================
    story.append(Paragraph("6. Lovable Prompt 5 & Saturday Demo Checklist", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceBefore=4, spaceAfter=8))

    story.append(Paragraph(
        "Execute Prompt 5 for final visual polish, citation highlights, and export modals:",
        body_style
    ))

    # PROMPT 5
    story.append(Paragraph("Prompt 5: Patient Leaflet, Source Citations, EHR Modal & Confetti Polish", h2_style))
    p5_text = (
        "Add the finishing wow-factor features:\n"
        "1. Tab 4 ('Patient Leaflet'): Friendly card layout. 'Why you were in hospital' in simple language (Reading age 11). A 4-column visual table for 'Your Daily Medicines' (Morning, Noon, Evening, Bedtime). A prominent alert card: 'When to get urgent medical advice' with 111 vs 999 rules.\n"
        "2. Source Tracing: When the 'Source Tracing' toggle is on, clicking or hovering over any synthesized section highlights the corresponding event card in the Left Timeline with a pulse animation and teal border.\n"
        "3. EHR Export Modal: Clicking 'Copy to EHR' opens a modal with tabs for 'EMIS Web', 'SystmOne', and 'Epic'. Each tab shows formatted text ready for one-click copy, with a toast notification 'Copied to clipboard formatted for EMIS!'.\n"
        "4. Sign Off & Dispatch: Clicking this button fires canvas-confetti and shows a success modal: 'Discharge Summary Dispatched to Millwood Medical Practice & NHS Spine'."
    )
    p5_table = Table([[Paragraph(p5_text.replace('\n', '<br/>'), prompt_box_text)]], colWidths=[504])
    p5_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#EEF2FF")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#C7D2FE")),
        ('PADDING', (0,0), (-1,-1), 7),
    ]))
    story.append(p5_table)
    story.append(Spacer(1, 10))

    story.append(Paragraph("6.2 Saturday Hackathon Demo Checklist (15:55 Live Pitch)", h2_style))
    story.append(Paragraph("• <b>Display Pre-Flight:</b> Connect laptop to presentation display; set browser zoom to 90% for optimal dual-pane visibility.", bullet_style))
    story.append(Paragraph("• <b>Case 1 Warm-up:</b> Pre-load Mrs. Margaret Evans (Heart Failure). Point out the chaotic 4-day ward notes on the left.", bullet_style))
    story.append(Paragraph("• <b>The Synthesis Reveal:</b> Demonstrate the 4-color Med Rec diff table. Explain why Ramipril was stopped (eGFR drop).", bullet_style))
    story.append(Paragraph("• <b>The Urgent Care Appeal:</b> Briefly switch to Case 2 (Ms. Priya Sharma, Asthma) to directly appeal to Dr. Jonathan Tai.", bullet_style))
    story.append(Paragraph("• <b>The Grand Finale:</b> Toggle to the Patient Leaflet, click 'Copy to EHR (EMIS)', and hit 'Sign Off & Dispatch' to trigger the confetti celebration.", bullet_style))

    doc.build(story, canvasmaker=FunctionalSpecCanvas)
    print(f"Functional Spec PDF built successfully: {filename}")

if __name__ == "__main__":
    build_functional_spec_pdf()
