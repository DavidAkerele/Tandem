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

class PRDCanvas(NumberedCanvas):
    doc_title = "Tandem Discharge — Product Requirements Document (PRD) | NXGN x Tandem Health"

def build_prd_pdf(filename="TandemDischarge_PRD.pdf"):
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

    # Custom Typography Styles
    title_style = ParagraphStyle(
        'CoverTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=28,
        leading=34,
        textColor=PRIMARY_DARK,
        spaceAfter=12
    )

    subtitle_style = ParagraphStyle(
        'CoverSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12.5,
        leading=17,
        textColor=TEXT_BODY,
        spaceAfter=20
    )

    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=16,
        leading=20,
        textColor=PRIMARY_DARK,
        spaceBefore=14,
        spaceAfter=8,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=TEXT_DARK,
        spaceBefore=10,
        spaceAfter=5,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13.5,
        textColor=TEXT_BODY,
        spaceAfter=6
    )

    bullet_style = ParagraphStyle(
        'Bullet_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
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
        leading=12.5,
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

    story = []

    # =========================================================================
    # PAGE 1: COVER PAGE
    # =========================================================================
    story.append(Spacer(1, 35))
    
    # Badge
    badge_data = [[
        Paragraph("<b>PRODUCT REQUIREMENTS DOCUMENT (PRD) — VERSION 1.0</b>", 
                  ParagraphStyle('Badge', fontName='Helvetica-Bold', fontSize=8.5, textColor=PRIMARY_DARK, alignment=1))
    ]]
    badge_table = Table(badge_data, colWidths=[320])
    badge_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), PRIMARY_LIGHT),
        ('BOX', (0,0), (-1,-1), 1, PRIMARY),
        ('PADDING', (0,0), (-1,-1), 4),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(badge_table)
    story.append(Spacer(1, 14))

    story.append(Paragraph("Tandem Discharge", title_style))
    story.append(Paragraph(
        "<b>Autonomous Inpatient & Urgent Care Clinical Synthesis Engine</b><br/>"
        "Transforming multi-day fragmented ward round notes, laboratory feeds, and medication charts "
        "into NHS-compliant Electronic Discharge Notifications (eDN) in seconds.",
        subtitle_style
    ))

    story.append(HRFlowable(width="100%", thickness=2, color=PRIMARY, spaceBefore=8, spaceAfter=18))

    # Metadata Card
    meta_data = [
        [Paragraph("<b>Project:</b>", table_cell_bold), Paragraph("Tandem Discharge (Clinical Admin Automation)", table_cell),
         Paragraph("<b>Target Event:</b>", table_cell_bold), Paragraph("NXGN x Tandem Health Hackathon 2026", table_cell)],
        [Paragraph("<b>Author / Lead:</b>", table_cell_bold), Paragraph("Engineering & Clinical Product Team", table_cell),
         Paragraph("<b>Date:</b>", table_cell_bold), Paragraph("September 5, 2026", table_cell)],
        [Paragraph("<b>Target Audience:</b>", table_cell_bold), Paragraph("NHS Junior Doctors, Ward Consultants, GPs, Urgent Care Leads", table_cell),
         Paragraph("<b>Clinical Standards:</b>", table_cell_bold), Paragraph("PRSB eDN, NICE Guidelines, SNOMED-CT", table_cell)],
        [Paragraph("<b>Status:</b>", table_cell_bold), Paragraph("<font color='#0F766E'><b>READY FOR IMPLEMENTATION</b></font>", table_cell),
         Paragraph("<b>Target Execution:</b>", table_cell_bold), Paragraph("3-Hour Hackathon Build + Live Demo", table_cell)]
    ]
    meta_table = Table(meta_data, colWidths=[100, 160, 100, 144])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), BG_LIGHT),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('PADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 20))

    # Executive Overview Callout
    callout_data = [[
        Paragraph(
            "<b>Executive Summary & Strategic Thesis:</b><br/>"
            "Tandem Health has pioneered ambient clinical scribing for single-encounter consultations. "
            "However, the single largest administrative bottleneck causing NHS hospital bed-blocking is the "
            "<b>Electronic Discharge Notification (eDN)</b> in secondary and urgent care. Junior doctors spend "
            "30 to 60 minutes per patient manually synthesizing fragmented ward notes, blood test trends, and drug charts. "
            "<b>Tandem Discharge</b> expands Tandem's intelligence from ambient audio to multi-source asynchronous clinical "
            "synthesis—generating a fully reconciled, audit-traceable discharge package in under 90 seconds.",
            callout_text
        )
    ]]
    callout_table = Table(callout_data, colWidths=[504])
    callout_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F0FDFA")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#99F6E4")),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
        ('TOPPADDING', (0,0), (-1,-1), 10),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(callout_table)

    story.append(PageBreak())

    # =========================================================================
    # PAGE 2: SECTION 1: PROBLEM DEFINITION & CLINICAL NEED
    # =========================================================================
    story.append(Paragraph("1. Problem Statement & Clinical Landscape", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceBefore=4, spaceAfter=10))

    story.append(Paragraph(
        "In NHS hospital trusts and urgent care centres across the United Kingdom, clinical documentation "
        "is acutely bifurcated between <i>consultation recording</i> and <i>episode synthesis</i>. While ambient AI scribes "
        "excel in primary care 1-on-1 outpatient appointments, inpatient care operates asynchronously across multiple days, "
        "multidisciplinary teams, and fragmented health IT silos.",
        body_style
    ))

    story.append(Paragraph("1.1 The Inpatient Discharge Summary Crisis", h2_style))
    story.append(Paragraph(
        "Writing the Electronic Discharge Notification (eDN) is universally cited by NHS Junior Doctors (Foundation Year 1 & 2) "
        "as their most dreaded administrative task. When a patient is deemed medically fit for discharge (MFFD), the following manual workflow occurs:",
        body_style
    ))

    story.append(Paragraph("• <b>Fragmented Record Scouring:</b> The clinician must read 3 to 10 days of physical and electronic notes, nursing entries, lab result trends, and microbiology cultures.", bullet_style))
    story.append(Paragraph("• <b>High-Risk Medication Reconciliation:</b> The clinician must cross-reference medications on admission against the inpatient drug chart (Kardex or ePMA) and formulate the discharge TTO (To-Take-Out) prescription. Up to 50% of medication errors in the NHS occur during clinical handovers.", bullet_style))
    story.append(Paragraph("• <b>Manual GP Instruction Formulation:</b> The clinician must draft clear, actionable follow-up items for primary care (e.g., repeat U&Es, titration dates, outpatient clinic referrals).", bullet_style))
    story.append(Paragraph("• <b>Bed-Blocking & Flow Stagnation:</b> The discharge summary and pharmacy dispensing take 4 to 8 hours to complete. Beds cannot be turned over for acute admissions from A&E, worsening ambulance handover delays.", bullet_style))

    story.append(Spacer(1, 8))

    # Metric Comparison Table
    metrics_data = [
        [Paragraph("Metric / Workflow Dimension", table_header),
         Paragraph("Current NHS Manual Process", table_header),
         Paragraph("With Tandem Discharge", table_header),
         Paragraph("Net Impact", table_header)],
        [Paragraph("<b>Time per Discharge Summary</b>", table_cell_bold),
         Paragraph("35 - 60 minutes", table_cell),
         Paragraph("<b>< 90 seconds</b> (automated draft)", table_cell),
         Paragraph("<font color='#16A34A'><b>95% time reduction</b></font>", table_cell)],
        [Paragraph("<b>Medication Reconciliation Accuracy</b>", table_cell_bold),
         Paragraph("High risk (omissions in 30-40% of cases)", table_cell),
         Paragraph("<b>Zero-omission diff matrix</b> with reasons", table_cell),
         Paragraph("<font color='#16A34A'><b>Eliminates TTO errors</b></font>", table_cell)],
        [Paragraph("<b>Time to Free Hospital Bed</b>", table_cell_bold),
         Paragraph("4 - 6 hours post-ward round", table_cell),
         Paragraph("<b>Immediate</b> (ready by 10:30 AM)", table_cell),
         Paragraph("<font color='#16A34A'><b>Unlocks hospital capacity</b></font>", table_cell)],
        [Paragraph("<b>GP Clarity & Safety Netting</b>", table_cell_bold),
         Paragraph("Dense, unformatted narrative", table_cell),
         Paragraph("<b>Structured, prioritized checklist</b>", table_cell),
         Paragraph("<font color='#16A34A'><b>Zero lost follow-ups</b></font>", table_cell)],
        [Paragraph("<b>Patient Comprehension</b>", table_cell_bold),
         Paragraph("Complex medical jargon", table_cell),
         Paragraph("<b>Plain-English leaflet (Reading Age 11)</b>", table_cell),
         Paragraph("<font color='#16A34A'><b>Reduces readmissions</b></font>", table_cell)]
    ]
    metrics_table = Table(metrics_data, colWidths=[130, 124, 130, 120])
    metrics_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY_DARK),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, BG_LIGHT]),
        ('PADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(metrics_table)
    story.append(Spacer(1, 10))

    story.append(Paragraph("1.2 Stakeholder Ecosystem & Beneficiaries", h2_style))
    story.append(Paragraph("• <b>Junior Doctors (FY1/FY2/ST):</b> Reclaims 2+ hours per shift previously spent typing notes; mitigates burnout.", bullet_style))
    story.append(Paragraph("• <b>Ward Consultants & Clinical Leads:</b> Instant visibility into patient trajectory with audit-verifiable source citations.", bullet_style))
    story.append(Paragraph("• <b>General Practitioners (Primary Care):</b> Receives standardized PRSB-compliant letters with highlighted actions rather than buried free-text.", bullet_style))
    story.append(Paragraph("• <b>Urgent Care & Hospital Operations:</b> Accelerates morning bed-turnover, directly addressing NHS winter pressures and four-hour emergency targets.", bullet_style))

    story.append(PageBreak())

    # =========================================================================
    # PAGE 3: SECTION 2: STRATEGIC ALIGNMENT WITH TANDEM HEALTH
    # =========================================================================
    story.append(Paragraph("2. Strategic Alignment with Tandem Health", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceBefore=4, spaceAfter=10))

    story.append(Paragraph(
        "Tandem Health has established market leadership in ambient consultation recording. "
        "The strategic imperative for healthcare AI in 2026 is moving from <i>point-in-time scribing</i> to "
        "<i>episodic clinical intelligence</i>. <b>Tandem Discharge</b> represents the exact bridge from primary care scribing "
        "into secondary care and urgent care enterprise adoption.",
        body_style
    ))

    story.append(Paragraph("2.1 Why Ambient Scribing Alone Cannot Solve Inpatient Discharge", h2_style))
    story.append(Paragraph(
        "Ambient listening only hears what is spoken aloud during a single bed visit. Inpatient care is asynchronous: "
        "a blood test is ordered on Monday, an ultrasound is performed on Tuesday, microbiology calls on Wednesday with blood culture results, "
        "and a medication is switched on Thursday. Scribing a 2-minute bedside conversation misses 90% of the relevant clinical context. "
        "<b>Tandem Discharge ingests the chronological timeline</b> of ward notes, observations, and charts to create a coherent medical narrative.",
        body_style
    ))

    story.append(Spacer(1, 6))

    # Architectural Alignment Diagram Callout
    align_data = [[
        Paragraph(
            "<b>The Two Pillars of Tandem's Clinical Documentation Ecosystem:</b><br/><br/>"
            "<b>1. Tandem Ambient (Existing Core):</b> Synchronous audio capture during live 1-on-1 consultations. Optimized for GP clinics and outpatient specialty appointments.<br/><br/>"
            "<b>2. Tandem Discharge (This Product):</b> Asynchronous timeline synthesis across multi-day inpatient stays, lab feeds, and drug charts. Optimized for Acute Wards, Urgent Care Units, and Hospital Discharge Lounges.",
            callout_text
        )
    ]]
    align_table = Table(align_data, colWidths=[504])
    align_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F0FDFA")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#99F6E4")),
        ('PADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(align_table)
    story.append(Spacer(1, 10))

    story.append(Paragraph("2.2 Alignment with NHS & UK Standards", h2_style))
    story.append(Paragraph("• <b>PRSB Compliance:</b> Formatted according to the Professional Record Standards Body (PRSB) Core Information Standard for eDN.", bullet_style))
    story.append(Paragraph("• <b>SNOMED-CT Diagnostic Encoding:</b> Automatically attaches validated clinical terms and ICD-10 codes for trust billing and QOF audit.", bullet_style))
    story.append(Paragraph("• <b>Caldicott & NHS Information Governance:</b> Zero training on protected health information; fully anonymized synthetic data for demonstration.", bullet_style))
    story.append(Paragraph("• <b>EHR Compatibility:</b> Formatted outputs engineered for seamless paste into EMIS Web, SystmOne, Epic Hyperspace, and Cerner Millennium.", bullet_style))

    story.append(PageBreak())

    # =========================================================================
    # PAGE 4: SECTION 3: FUNCTIONAL REQUIREMENTS & FEATURE SPECIFICATIONS
    # =========================================================================
    story.append(Paragraph("3. Functional Requirements & Feature Scope", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceBefore=4, spaceAfter=8))

    story.append(Paragraph(
        "The system is architected around a dual-pane workspace: raw chronological inputs on the left, "
        "and multi-dimensional, synthesized clinical outputs on the right.",
        body_style
    ))

    story.append(Paragraph("3.1 Feature Matrix (MoSCoW Prioritization for Hackathon)", h2_style))

    feature_data = [
        [Paragraph("Feature Module", table_header),
         Paragraph("Priority", table_header),
         Paragraph("Description & Clinical Rationale", table_header),
         Paragraph("Verification Criteria", table_header)],
        [Paragraph("<b>Multi-Source Intake Feed</b>", table_cell_bold),
         Paragraph("<font color='#16A34A'><b>P0 (Must)</b></font>", table_cell),
         Paragraph("Chronological ingest of admission notes, ward round logs, nurse vitals, and lab feeds.", table_cell),
         Paragraph("Accepts pasted text, pre-loaded cases, or raw JSON feeds.", table_cell)],
        [Paragraph("<b>AI Synthesis Engine</b>", table_cell_bold),
         Paragraph("<font color='#16A34A'><b>P0 (Must)</b></font>", table_cell),
         Paragraph("Generates structured NHS eDN: Chief Complaint, Hospital Course, Diagnoses, Procedures.", table_cell),
         Paragraph("Outputs complete narrative in < 5 seconds with zero hallucination.", table_cell)],
        [Paragraph("<b>Interactive Med Rec Matrix</b>", table_cell_bold),
         Paragraph("<font color='#16A34A'><b>P0 (Must)</b></font>", table_cell),
         Paragraph("Visual diff table categorizing meds into Started, Stopped, Dose Changed, and Unchanged.", table_cell),
         Paragraph("Mandatory 'Reason for Change' column for clinical safety.", table_cell)],
        [Paragraph("<b>Actionable GP Checklist</b>", table_cell_bold),
         Paragraph("<font color='#16A34A'><b>P0 (Must)</b></font>", table_cell),
         Paragraph("Structured primary care tasks with explicit timelines (e.g., 'Repeat U&Es in 7 days').", table_cell),
         Paragraph("Categorized by Urgency (Urgent, Routine, Safety Net).", table_cell)],
        [Paragraph("<b>Patient 'Take-Home' Leaflet</b>", table_cell_bold),
         Paragraph("<font color='#16A34A'><b>P0 (Must)</b></font>", table_cell),
         Paragraph("Translates medical jargon into plain English (Reading Age 11) with warning signs.", table_cell),
         Paragraph("Includes daily visual medicine schedule and 111/999 rules.", table_cell)],
        [Paragraph("<b>Source-Tracing Tooltips</b>", table_cell_bold),
         Paragraph("<font color='#16A34A'><b>P0 (Must)</b></font>", table_cell),
         Paragraph("Clicking any synthesized sentence highlights the source line in the input timeline.", table_cell),
         Paragraph("Provides 100% auditability for clinician verification.", table_cell)],
        [Paragraph("<b>EHR Copy & Export Modal</b>", table_cell_bold),
         Paragraph("<font color='#D97706'><b>P1 (Should)</b></font>", table_cell),
         Paragraph("One-click formatted copy tailored for EMIS Web, SystmOne, and Epic Hyperspace.", table_cell),
         Paragraph("Copies plain formatted text to OS clipboard instantly.", table_cell)],
        [Paragraph("<b>SNOMED-CT Auto-Coding</b>", table_cell_bold),
         Paragraph("<font color='#D97706'><b>P1 (Should)</b></font>", table_cell),
         Paragraph("Attaches standardized SNOMED concept IDs to all extracted diagnoses.", table_cell),
         Paragraph("Badges display concept codes alongside diagnostic text.", table_cell)]
    ]
    feature_table = Table(feature_data, colWidths=[110, 65, 195, 134])
    feature_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY_DARK),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, BG_LIGHT]),
        ('PADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(feature_table)
    story.append(Spacer(1, 8))

    story.append(Paragraph("3.2 Deep-Dive: The Medication Reconciliation Matrix", h2_style))
    story.append(Paragraph(
        "Medication reconciliation is the single most safety-critical component of patient discharge. "
        "The system enforces a 4-state state machine for every drug identified across the patient admission:",
        body_style
    ))

    story.append(Paragraph("1. <font color='#16A34A'><b>STARTED:</b></font> Newly initiated during admission (e.g., Co-Amoxiclav). Requires planned duration and indication.", bullet_style))
    story.append(Paragraph("2. <font color='#DC2626'><b>STOPPED:</b></font> Discontinued inpatient medication (e.g., Codeine ceased due to constipation). Requires explicit clinical rationale so GP does not restart.", bullet_style))
    story.append(Paragraph("3. <font color='#D97706'><b>DOSE CHANGED:</b></font> Altered dosage or frequency (e.g., Furosemide doubled to 80mg OD). Requires titration monitoring instructions.", bullet_style))
    story.append(Paragraph("4. <font color='#2563EB'><b>CONTINUED:</b></font> Unchanged home medications maintained throughout stay (e.g., Atorvastatin 20mg ON).", bullet_style))

    story.append(PageBreak())

    # =========================================================================
    # PAGE 5: SECTION 4: USER PERSONAS & CLINICAL WORKFLOW
    # =========================================================================
    story.append(Paragraph("4. Target User Personas & Clinical Workflow", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceBefore=4, spaceAfter=10))

    story.append(Paragraph(
        "The user experience is designed around the high-pressure environment of NHS acute wards and urgent care units.",
        body_style
    ))

    # Persona Cards Table
    persona_data = [
        [Paragraph("Persona A: Inpatient Junior Doctor", table_header),
         Paragraph("Persona B: Urgent Care Clinical Lead", table_header),
         Paragraph("Persona C: Receiving GP", table_header)],
        [Paragraph(
            "<b>Dr. Alex Smith, FY1</b><br/>"
            "<i>Ward 4B (Acute Medicine)</i><br/><br/>"
            "<b>Pain Point:</b> Has 6 patients ready for discharge by 11 AM. Writing summaries manually takes until 3 PM. Trapped behind computer while ward tasks pile up.<br/><br/>"
            "<b>Needs:</b> Rapid synthesis of messy notes, automated drug diffs, instant copy to hospital EHR.",
            table_cell
         ),
         Paragraph(
            "<b>Dr. Jonathan Tai</b><br/>"
            "<i>Clinical Lead, NHS Urgent Care</i><br/><br/>"
            "<b>Pain Point:</b> High patient turnover. Urgent care handovers require rapid risk stratification, clear red flag safety nets, and seamless primary care follow-up.<br/><br/>"
            "<b>Needs:</b> Standardized discharge templates, bulleted safety instructions, zero missing lab alerts.",
            table_cell
         ),
         Paragraph(
            "<b>Dr. Sarah Patel, GP Partner</b><br/>"
            "<i>Millwood Medical Practice</i><br/><br/>"
            "<b>Pain Point:</b> Receives 30 hospital discharge letters daily. Spends 10 minutes per letter hunting for what actually changed and what bloods she needs to order.<br/><br/>"
            "<b>Needs:</b> Prominent 'GP Action Required' box on page 1 with specific deadlines.",
            table_cell
         )]
    ]
    persona_table = Table(persona_data, colWidths=[168, 168, 168])
    persona_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY_DARK),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('BACKGROUND', (0,1), (-1,-1), BG_LIGHT),
        ('PADDING', (0,0), (-1,-1), 6),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(persona_table)
    story.append(Spacer(1, 12))

    story.append(Paragraph("4.2 End-to-End Clinical User Journey", h2_style))
    story.append(Paragraph("1. <b>Morning Ward Round (09:00):</b> Consultant declares patient Medically Fit for Discharge (MFFD).", bullet_style))
    story.append(Paragraph("2. <b>One-Click Case Intake (09:15):</b> Junior doctor selects patient or pastes multi-day ward notes and Kardex snapshot into Tandem Discharge.", bullet_style))
    story.append(Paragraph("3. <b>Instant Synthesis (09:16):</b> AI engine generates PRSB eDN, extracts diagnoses, maps SNOMED codes, and performs 4-way medication reconciliation.", bullet_style))
    story.append(Paragraph("4. <b>Clinician Review & Verification (09:18):</b> Doctor inspects red flags, reviews med diffs, verifies GP action dates, and modifies text if needed.", bullet_style))
    story.append(Paragraph("5. <b>One-Click EHR Dispatch (09:20):</b> Summary is copied into hospital EHR, sent electronically to GP, and a patient leaflet is printed.", bullet_style))
    story.append(Paragraph("6. <b>Bed Turnaround (09:30):</b> Patient moves to discharge lounge 5 hours earlier than manual baseline, freeing bed for acute admission.", bullet_style))

    story.append(PageBreak())

    # =========================================================================
    # PAGE 6: SECTION 5: CLINICAL SAFETY, GOVERNANCE & GUARDRAILS
    # =========================================================================
    story.append(Paragraph("5. Clinical Safety, Governance & Guardrails", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceBefore=4, spaceAfter=10))

    story.append(Paragraph(
        "Clinical generative AI must operate under an uncompromising standard of safety. "
        "The system implements a four-tier guardrail architecture:",
        body_style
    ))

    story.append(Paragraph("5.1 Guardrail Architecture", h2_style))
    story.append(Paragraph("• <b>Human-in-the-Loop Verification:</b> The AI acts strictly as an assistant. Every section of the eDN is editable by the clinician. The document cannot be marked 'Dispatched' without explicit clinician review confirmation.", bullet_style))
    story.append(Paragraph("• <b>Strict Extractive Grounding:</b> The synthesis prompt enforces that zero diagnostic or therapeutic assertions are made unless explicitly present in the input chronological record. Speculation is disallowed.", bullet_style))
    story.append(Paragraph("• <b>Interactive Source Tracing:</b> Clicking on any synthesized paragraph highlights the exact sentence in the source ward notes, providing immediate visual verification.", bullet_style))
    story.append(Paragraph("• <b>Contradiction Detection:</b> If admission notes state 'NKDA' (No Known Drug Allergies) but an inpatient note mentions a Penicillin rash, the system generates a high-priority amber warning flag for clinician resolution.", bullet_style))

    story.append(Spacer(1, 10))

    # Safety Alert Callout
    safety_callout = [[
        Paragraph(
            "<b>Clinical Governance Statement (NHS DCB0129 / DCB0160 Alignment):</b><br/>"
            "All test data utilized for the hackathon demonstration is 100% synthetic, clinically realistic, "
            "and strictly de-identified in compliance with the UK Data Protection Act 2018 and Caldicott Principles. "
            "No live NHS patient data is processed or transmitted.",
            callout_text
        )
    ]]
    safety_table = Table(safety_callout, colWidths=[504])
    safety_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#FEF2F2")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#FECACA")),
        ('PADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(safety_table)
    story.append(Spacer(1, 10))

    story.append(Paragraph("5.2 Evaluation Metrics for Clinical Accuracy", h2_style))
    story.append(Paragraph("• <b>Omission Rate:</b> 0% tolerance for missing discontinued or newly initiated medications.", bullet_style))
    story.append(Paragraph("• <b>Hallucination Rate:</b> 0% tolerated for non-documented clinical interventions.", bullet_style))
    story.append(Paragraph("• <b>Readability Index:</b> Patient Leaflet constrained to Flesch-Kincaid Grade Level ≤ 6 (Reading Age 11).", bullet_style))

    story.append(PageBreak())

    # =========================================================================
    # PAGE 7: SECTION 6: HACKATHON DELIVERY ROADMAP & PITCH SCRIPT
    # =========================================================================
    story.append(Paragraph("6. Hackathon 3-Hour Execution Roadmap & Pitch", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceBefore=4, spaceAfter=8))

    story.append(Paragraph(
        "With building beginning at 12:30 and the submission deadline at 15:45, time allocation is strictly phased:",
        body_style
    ))

    timeline_data = [
        [Paragraph("Time Window", table_header),
         Paragraph("Phase", table_header),
         Paragraph("Key Deliverables & Action Items", table_header),
         Paragraph("Exit Criteria", table_header)],
        [Paragraph("<b>12:30 - 13:15</b><br/>(45 mins)", table_cell),
         Paragraph("<b>Phase 1: Shell & Data Ingestion</b>", table_cell_bold),
         Paragraph("• Scaffold React/Tailwind shell with Lovable.<br/>• Embed 3 rich NHS mock patient cases (Frailty, Post-Op, Asthma).<br/>• Build left-hand chronological timeline feed.", table_cell),
         Paragraph("Working split-pane UI with interactive patient selector.", table_cell)],
        [Paragraph("<b>13:15 - 14:15</b><br/>(60 mins)", table_cell),
         Paragraph("<b>Phase 2: Synthesis & Med Rec Matrix</b>", table_cell_bold),
         Paragraph("• Implement eDN generation state machine.<br/>• Build interactive 4-status Medication Reconciliation diff table.<br/>• Build structured GP Action checklist with urgency tags.", table_cell),
         Paragraph("Working synthesis with dynamic tab switching.", table_cell)],
        [Paragraph("<b>14:15 - 14:45</b><br/>(30 mins)", table_cell),
         Paragraph("<b>Phase 3: Working Lunch & Intelligence</b>", table_cell_bold),
         Paragraph("• Connect LLM API / fine-tune zero-hallucination prompt.<br/>• Implement source-citation highlight tooltips.<br/>• Build patient 'Take-Home' leaflet view.", table_cell),
         Paragraph("Live synthesis generating both clinical & patient views.", table_cell)],
        [Paragraph("<b>14:45 - 15:30</b><br/>(45 mins)", table_cell),
         Paragraph("<b>Phase 4: Design Polish & Export</b>", table_cell_bold),
         Paragraph("• Apply Tandem Health teal design system & micro-animations.<br/>• Implement EHR one-click copy modal (SystmOne/EMIS/Epic).<br/>• Add confetti celebration & demo reset toggle.", table_cell),
         Paragraph("Pixel-perfect, wow-factor user interface.", table_cell)],
        [Paragraph("<b>15:30 - 15:45</b><br/>(15 mins)", table_cell),
         Paragraph("<b>Phase 5: Final Submission & QA</b>", table_cell_bold),
         Paragraph("• Deploy live URL to Vercel/Lovable.<br/>• Push code to public GitHub repo.<br/>• Complete official hackathon submission form.", table_cell),
         Paragraph("<font color='#16A34A'><b>Submitted before 15:45 deadline</b></font>", table_cell)]
    ]
    timeline_table = Table(timeline_data, colWidths=[90, 110, 184, 120])
    timeline_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY_DARK),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, BG_LIGHT]),
        ('PADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(timeline_table)
    story.append(Spacer(1, 8))

    # Pitch script callout
    pitch_callout = [[
        Paragraph(
            "<b>The 2-Minute Live Pitch Strategy (For Team Demos at 15:55):</b><br/>"
            "<b>0:00 - 0:30 (The Hook):</b> Introduce Dr. Alex Smith on Ward 4B at 3 PM, drowning under 6 discharge summaries while ambulances wait outside. State the thesis: <i>'Tandem Health solved the single consult. We built the engine that solves the hospital episode.'</i><br/>"
            "<b>0:30 - 1:15 (The Live Demo):</b> Click into an 82yo Heart Failure case with 4 days of chaotic ward notes. Hit <i>'Synthesize Discharge Package'</i>. Show the generated PRSB summary, the instant color-coded Med Rec diff table (Ramipril stopped, Furosemide doubled), and click a sentence to show instant source-tracing back to Day 2 ward round.<br/>"
            "<b>1:15 - 1:45 (The Magic Twist):</b> Toggle to the <b>'Patient Leaflet'</b> tab. Show the warm, plain-English summary and daily medicine chart. Then click <b>'Copy to EHR'</b> (formatted for EMIS/SystmOne).<br/>"
            "<b>1:45 - 2:00 (The Close):</b> Connect directly to Tandem's mission: freeing clinicians from admin across the entire patient journey. Close with an invitation for Q&A.",
            callout_text
        )
    ]]
    pitch_table = Table(pitch_callout, colWidths=[504])
    pitch_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), PRIMARY_LIGHT),
        ('BOX', (0,0), (-1,-1), 1, PRIMARY),
        ('PADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(pitch_table)

    doc.build(story, canvasmaker=PRDCanvas)
    print(f"PRD PDF built successfully: {filename}")

if __name__ == "__main__":
    build_prd_pdf()
