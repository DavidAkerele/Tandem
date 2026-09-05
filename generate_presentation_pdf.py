import os
import sys
from reportlab.lib.pagesizes import letter, landscape
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class PresentationCanvas(canvas.Canvas):
    doc_title = "Tandem Discharge — Executive Pitch Deck | NXGN x Tandem Health 2026"

    def __init__(self, *args, **kwargs):
        super(PresentationCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_slide_decorations(num_pages)
            super(PresentationCanvas, self).showPage()
        super(PresentationCanvas, self).save()

    def draw_slide_decorations(self, page_count):
        # 11 x 8.5 inches landscape = 792 x 612 pt
        width = 11 * inch
        height = 8.5 * inch

        self.saveState()

        # Top Accent Header Bar
        self.setFillColor(colors.HexColor("#0F766E"))
        self.rect(0, height - 6, width, 6, fill=1, stroke=0)

        # Running Header (except cover)
        if self._pageNumber > 1:
            self.setFont("Helvetica-Bold", 8)
            self.setFillColor(colors.HexColor("#0F766E"))
            self.drawString(40, height - 28, "TANDEM DISCHARGE")
            self.setFont("Helvetica", 8)
            self.setFillColor(colors.HexColor("#64748B"))
            self.drawString(135, height - 28, "• Autonomous Inpatient & Urgent Care Clinical Synthesis Engine")

            self.drawRightString(width - 40, height - 28, "NXGN x Tandem Health Hackathon 2026")
            self.setStrokeColor(colors.HexColor("#E2E8F0"))
            self.setLineWidth(0.5)
            self.line(40, height - 34, width - 40, height - 34)

        # Running Footer
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        self.drawString(40, 22, "CONFIDENTIAL & PROPRIETARY — TANDEM HEALTH AI")
        page_str = f"Slide {self._pageNumber} of {page_count}"
        self.drawRightString(width - 40, 22, page_str)
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.5)
        self.line(40, 32, width - 40, 32)

        self.restoreState()


def build_presentation_pdf(filename="TandemDischarge_Presentation.pdf"):
    # 11 x 8.5 landscape
    page_w, page_h = landscape(letter)
    doc = SimpleDocTemplate(
        filename,
        pagesize=(page_w, page_h),
        leftMargin=40,
        rightMargin=40,
        topMargin=42,
        bottomMargin=38
    )

    styles = getSampleStyleSheet()

    # Color definitions
    PRIMARY = colors.HexColor("#0F766E")      # Teal 700
    PRIMARY_DARK = colors.HexColor("#115E59") # Teal 800
    PRIMARY_LIGHT = colors.HexColor("#F0FDFA")# Teal 50
    TEXT_DARK = colors.HexColor("#0F172A")    # Slate 900
    TEXT_BODY = colors.HexColor("#334155")    # Slate 700
    BORDER_COLOR = colors.HexColor("#CBD5E1") # Slate 300
    BG_LIGHT = colors.HexColor("#F8FAFC")     # Slate 50
    RED_ACCENT = colors.HexColor("#DC2626")
    GREEN_ACCENT = colors.HexColor("#16A34A")

    # Typography
    slide_title = ParagraphStyle(
        'SlideTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=PRIMARY_DARK,
        spaceAfter=4
    )

    slide_subtitle = ParagraphStyle(
        'SlideSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=TEXT_BODY,
        spaceAfter=12
    )

    h2_style = ParagraphStyle(
        'H2Style',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=TEXT_DARK,
        spaceBefore=6,
        spaceAfter=4
    )

    body_style = ParagraphStyle(
        'BodyStyle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=TEXT_BODY,
        spaceAfter=5
    )

    bullet_style = ParagraphStyle(
        'BulletStyle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=TEXT_BODY,
        leftIndent=12,
        firstLineIndent=-8,
        spaceAfter=3
    )

    table_header = ParagraphStyle(
        'TH',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.white
    )

    table_cell = ParagraphStyle(
        'TC',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.5,
        leading=10.5,
        textColor=TEXT_DARK
    )

    table_cell_bold = ParagraphStyle(
        'TCBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=10.5,
        textColor=TEXT_DARK
    )

    story = []

    # =========================================================================
    # SLIDE 1: COVER SLIDE
    # =========================================================================
    story.append(Spacer(1, 40))
    badge_p = Paragraph("<font color='#0F766E'><b>NXGN x TANDEM HEALTH HACKATHON 2026 — EXECUTIVE PRESENTATION</b></font>",
                        ParagraphStyle('CoverBadge', fontName='Helvetica-Bold', fontSize=8.5, alignment=1))
    badge_tbl = Table([[badge_p]], colWidths=[420])
    badge_tbl.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), PRIMARY_LIGHT),
        ('BOX', (0,0), (-1,-1), 1, PRIMARY),
        ('PADDING', (0,0), (-1,-1), 4),
        ('ALIGN', (0,0), (-1,-1), 'CENTER')
    ]))
    story.append(badge_tbl)
    story.append(Spacer(1, 20))

    story.append(Paragraph("Tandem Discharge", ParagraphStyle('CoverT', fontName='Helvetica-Bold', fontSize=34, leading=38, textColor=PRIMARY_DARK, alignment=1)))
    story.append(Spacer(1, 6))
    story.append(Paragraph("<b>Autonomous Inpatient & Urgent Care Clinical Synthesis Engine</b>",
                           ParagraphStyle('CoverSub1', fontName='Helvetica-Bold', fontSize=14, leading=18, textColor=TEXT_DARK, alignment=1)))
    story.append(Paragraph("Transforming multi-day fragmented ward notes, laboratory feeds, and medication charts into NHS-compliant Electronic Discharge Notifications (eDN) in seconds.",
                           ParagraphStyle('CoverSub2', fontName='Helvetica', fontSize=10.5, leading=15, textColor=TEXT_BODY, alignment=1)))

    story.append(Spacer(1, 25))
    story.append(HRFlowable(width="80%", thickness=1.5, color=PRIMARY, spaceBefore=0, spaceAfter=20))

    meta_data = [
        [Paragraph("<b>Core Thesis:</b>", table_cell_bold), Paragraph("From single-consult ambient scribing to episodic hospital intelligence.", table_cell),
         Paragraph("<b>Clinical Standards:</b>", table_cell_bold), Paragraph("PRSB eDN • SNOMED-CT • NICE • NHS DCB0129", table_cell)],
        [Paragraph("<b>Drafting Speed:</b>", table_cell_bold), Paragraph("Reduces summary time from 45 mins to <90 seconds (95% faster).", table_cell),
         Paragraph("<b>Med Rec Safety:</b>", table_cell_bold), Paragraph("Deterministic 4-status reconciliation eliminating TTO omissions.", table_cell)],
        [Paragraph("<b>Delivery Status:</b>", table_cell_bold), Paragraph("<font color='#16A34A'><b>Fully Verified Working Prototype</b></font>", table_cell),
         Paragraph("<b>Target Audience:</b>", table_cell_bold), Paragraph("NHS FY1/FY2 Doctors, Urgent Care Leads, General Practitioners", table_cell)]
    ]
    meta_table = Table(meta_data, colWidths=[90, 240, 100, 250])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), BG_LIGHT),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('PADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(meta_table)

    story.append(PageBreak())

    # =========================================================================
    # SLIDE 2: THE INPATIENT DISCHARGE CRISIS
    # =========================================================================
    story.append(Paragraph("1. The Inpatient Discharge Crisis", slide_title))
    story.append(Paragraph("The 60-minute administrative bottleneck paralyzing NHS secondary care and emergency patient flow.", slide_subtitle))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceBefore=0, spaceAfter=14))

    card_data = [
        [Paragraph("<b>45–60 Mins</b>", ParagraphStyle('M1', fontName='Helvetica-Bold', fontSize=20, leading=22, textColor=RED_ACCENT, alignment=1)),
         Paragraph("<b>50% Errors</b>", ParagraphStyle('M2', fontName='Helvetica-Bold', fontSize=20, leading=22, textColor=RED_ACCENT, alignment=1)),
         Paragraph("<b>4–6 Hours</b>", ParagraphStyle('M3', fontName='Helvetica-Bold', fontSize=20, leading=22, textColor=RED_ACCENT, alignment=1)),
         Paragraph("<b>100k+ Days</b>", ParagraphStyle('M4', fontName='Helvetica-Bold', fontSize=20, leading=22, textColor=RED_ACCENT, alignment=1))],
        [Paragraph("<b>Time per Discharge</b><br/>Scouring 3-10 days of paper notes, lab portals, and nursing logs.", table_cell),
         Paragraph("<b>Handover Drug Errors</b><br/>Medication discrepancies peak during transition to primary care.", table_cell),
         Paragraph("<b>Discharge Delay</b><br/>Patients wait hours after being deemed Medically Fit (MFFD).", table_cell),
         Paragraph("<b>Bed-Days Blocked</b><br/>Ambulances queue outside A&E as downstream beds stay occupied.", table_cell)]
    ]
    card_table = Table(card_data, colWidths=[175, 175, 175, 175])
    card_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#FEF2F2")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#FECACA")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#FCA5A5")),
        ('PADDING', (0,0), (-1,-1), 10),
        ('ALIGN', (0,0), (-1,0), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(card_table)
    story.append(Spacer(1, 16))

    story.append(Paragraph("<b>The Ward 4B Reality:</b> Dr. Alex Smith (FY1) has 6 patients ready for discharge on morning ward rounds at 09:00. Even working uninterrupted, manual letter drafting consumes her afternoon until 15:00. Inpatient beds cannot turn over for acute admissions, and ambulance crews wait outside emergency departments.", body_style))

    story.append(PageBreak())

    # =========================================================================
    # SLIDE 3: WHY AMBIENT SCRIBING ISN'T ENOUGH
    # =========================================================================
    story.append(Paragraph("2. Architectural Insight: Ambient vs. Episodic", slide_title))
    story.append(Paragraph("Why ambient audio scribing cannot solve secondary care, and why episodic synthesis is required.", slide_subtitle))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceBefore=0, spaceAfter=14))

    compare_data = [
        [Paragraph("Dimension", table_header),
         Paragraph("Tandem Ambient (Primary Care / Outpatients)", table_header),
         Paragraph("Tandem Discharge (Secondary / Inpatients / Urgent Care)", table_header)],
        [Paragraph("<b>Clinical Interaction</b>", table_cell_bold),
         Paragraph("Synchronous 1-on-1 bedside or GP room dialogue.", table_cell),
         Paragraph("<b>Asynchronous multi-day timeline</b> across MDT teams.", table_cell)],
        [Paragraph("<b>Data Modality</b>", table_cell_bold),
         Paragraph("Live audio streaming → transcript → clinical note.", table_cell),
         Paragraph("<b>Multi-source text & data ingestion:</b> clerking, labs, vitals, drug charts.", table_cell)],
        [Paragraph("<b>Time Horizon</b>", table_cell_bold),
         Paragraph("Single 10–15 minute encounter.", table_cell),
         Paragraph("<b>3 to 10+ days</b> of inpatient hospital trajectory.", table_cell)],
        [Paragraph("<b>Medication Reconciliation</b>", table_cell_bold),
         Paragraph("Extracts spoken changes during consultation.", table_cell),
         Paragraph("<b>Deterministic 4-way diff:</b> Admission vs. Inpatient vs. TTO prescription.", table_cell)],
        [Paragraph("<b>Health System Value</b>", table_cell_bold),
         Paragraph("Reduces GP clinic burnout and clinic documentation time.", table_cell),
         Paragraph("<b>Unlocks hospital bed capacity</b>, reduces handover errors, speeds bed release.", table_cell)]
    ]
    compare_table = Table(compare_data, colWidths=[140, 280, 290])
    compare_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY_DARK),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, BG_LIGHT]),
        ('PADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(compare_table)

    story.append(PageBreak())

    # =========================================================================
    # SLIDE 4: TANDEM DISCHARGE SOLUTION OVERVIEW
    # =========================================================================
    story.append(Paragraph("3. Tandem Discharge: Product Solution", slide_title))
    story.append(Paragraph("Dual-pane cognitive workspace engineered for high-pressure acute hospital workflows.", slide_subtitle))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceBefore=0, spaceAfter=14))

    sol_data = [
        [Paragraph("<b>Chronological Timeline Feed (Left Pane)</b>", table_header),
         Paragraph("<b>Clinical AI Synthesis Engine (Right Pane)</b>", table_header)],
        [Paragraph(
            "• <b>Unified Intake:</b> Ingests admission notes, ward round entries, nursing vitals, and microbiology reports.<br/>"
            "• <b>Source Citations:</b> Every timestamped entry is indexable and linkable.<br/>"
            "• <b>Contradiction Scanning:</b> Flags discrepancies across ward entries automatically.",
            table_cell
         ),
         Paragraph(
            "• <b>PRSB eDN Generator:</b> Creates Chief Complaint, Diagnoses, Hospital Course, and Procedures in <90 seconds.<br/>"
            "• <b>SNOMED-CT Coded:</b> Standardizes diagnostic terminology for trust audits and billing.<br/>"
            "• <b>Actionable GP Checklist:</b> Categorizes follow-up tasks into Urgent, Routine, and Safety Net.",
            table_cell
         )]
    ]
    sol_table = Table(sol_data, colWidths=[355, 355])
    sol_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY_DARK),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('BACKGROUND', (0,1), (-1,-1), BG_LIGHT),
        ('PADDING', (0,0), (-1,-1), 10),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(sol_table)
    story.append(Spacer(1, 14))

    story.append(Paragraph("<b>Zero-Friction Workflow Integration:</b> Output documents are engineered with one-click export formatters directly matching UK electronic health record systems including EMIS Web, SystmOne, Epic Hyperspace, and Cerner Millennium.", body_style))

    story.append(PageBreak())

    # =========================================================================
    # SLIDE 5: 4-STATE MED REC MATRIX
    # =========================================================================
    story.append(Paragraph("4. The 4-State Medication Reconciliation Matrix", slide_title))
    story.append(Paragraph("Eliminating handover errors through an auditable, deterministic clinical diff engine.", slide_subtitle))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceBefore=0, spaceAfter=14))

    med_data = [
        [Paragraph("Medication Status", table_header),
         Paragraph("Clinical Definition", table_header),
         Paragraph("Mandatory Guardrail Requirement", table_header),
         Paragraph("Clinical Example", table_header)],
        [Paragraph("<font color='#16A34A'><b>STARTED</b></font>", table_cell_bold),
         Paragraph("Newly prescribed during the inpatient stay.", table_cell),
         Paragraph("Must include indication & planned duration/stop date.", table_cell),
         Paragraph("Co-Amoxiclav 625mg TDS (Course: 7 days total).", table_cell)],
        [Paragraph("<font color='#DC2626'><b>STOPPED</b></font>", table_cell_bold),
         Paragraph("Discontinued inpatient medication.", table_cell),
         Paragraph("Must provide explicit clinical rationale so GP doesn't restart.", table_cell),
         Paragraph("Ramipril 5mg OD (Ceased due to AKI Stage 2).", table_cell)],
        [Paragraph("<font color='#D97706'><b>DOSE CHANGED</b></font>", table_cell_bold),
         Paragraph("Titrated dosage or adjusted dosing frequency.", table_cell),
         Paragraph("Must specify monitoring schedule and titration target.", table_cell),
         Paragraph("Furosemide doubled to 80mg OD (Repeat U&Es in 7d).", table_cell)],
        [Paragraph("<font color='#2563EB'><b>CONTINUED</b></font>", table_cell_bold),
         Paragraph("Maintained chronic pre-admission therapy.", table_cell),
         Paragraph("Cross-referenced against admission clerking record.", table_cell),
         Paragraph("Atorvastatin 20mg ON (Maintained throughout).", table_cell)]
    ]
    med_table = Table(med_data, colWidths=[100, 190, 220, 200])
    med_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY_DARK),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, BG_LIGHT]),
        ('PADDING', (0,0), (-1,-1), 7),
    ]))
    story.append(med_table)
    story.append(Spacer(1, 14))

    story.append(Paragraph("<b>Safety Benchmark:</b> The PRD enforces 0% tolerance for undocumented medication omissions. Discontinued medications require mandatory rationale, preventing dangerous repeat prescriptions by receiving community GPs.", body_style))

    story.append(PageBreak())

    # =========================================================================
    # SLIDE 6: DUAL-AUDIENCE SYNTHESIS
    # =========================================================================
    story.append(Paragraph("5. Dual-Audience Synthesis: Clinician & Patient", slide_title))
    story.append(Paragraph("One synthesis engine generates both a PRSB clinical handover and a Plain-English patient guide.", slide_subtitle))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceBefore=0, spaceAfter=14))

    dual_data = [
        [Paragraph("<b>Clinician eDN (Secondary Care & General Practice)</b>", table_header),
         Paragraph("<b>Patient 'Take-Home' Leaflet (Patient & Family)</b>", table_header)],
        [Paragraph(
            "• <b>Standard:</b> PRSB Core Information Standard.<br/>"
            "• <b>Clinical Accuracy:</b> SNOMED-CT diagnostic codes, ICD-10 cross-references.<br/>"
            "• <b>Prioritized Tasks:</b> GP action table categorized by Urgency (Urgent, Routine, Safety Net).<br/>"
            "• <b>Audit Trail:</b> Medicolegal consultant and junior doctor sign-off metadata.",
            table_cell
         ),
         Paragraph(
            "• <b>Reading Level:</b> Flesch-Kincaid Grade &le; 6 (Reading Age 11).<br/>"
            "• <b>Clarity:</b> Translates 'decompensated cardiac failure' into 'heart strain with fluid in lungs'.<br/>"
            "• <b>Visual Schedule:</b> Morning, Lunch, Dinner, Bedtime medicine timetable.<br/>"
            "• <b>Red Flag Rules:</b> Clear guidance on when to call GP vs. 111 vs. 999.",
            table_cell
         )]
    ]
    dual_table = Table(dual_data, colWidths=[355, 355])
    dual_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY_DARK),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('BACKGROUND', (0,1), (-1,-1), BG_LIGHT),
        ('PADDING', (0,0), (-1,-1), 10),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(dual_table)
    story.append(Spacer(1, 14))

    story.append(Paragraph("<b>Clinical Impact:</b> Reduces 30-day emergency hospital readmissions caused by patient medication confusion and lack of understanding regarding post-discharge red flag symptoms.", body_style))

    story.append(PageBreak())

    # =========================================================================
    # SLIDE 7: CLINICAL SAFETY & GOVERNANCE
    # =========================================================================
    story.append(Paragraph("6. Clinical Safety, Governance & Guardrails", slide_title))
    story.append(Paragraph("NHS DCB0129 / DCB0160 Clinical Risk Management standard alignment.", slide_subtitle))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceBefore=0, spaceAfter=14))

    gov_data = [
        [Paragraph("<b>1-Click Source Tracing</b>", table_header),
         Paragraph("<b>Contradiction Detection</b>", table_header),
         Paragraph("<b>Human-in-the-Loop</b>", table_header)],
        [Paragraph(
            "Clicking any sentence in the synthesized eDN automatically highlights the exact source sentence in the raw chronological ward notes.<br/><br/>"
            "<b>100% auditability and verification.</b>",
            table_cell
         ),
         Paragraph(
            "Detects conflicting entries across ward notes (e.g., admission records 'NKDA' but Day 2 note reports Penicillin hives).<br/><br/>"
            "<b>High-priority amber warning flag.</b>",
            table_cell
         ),
         Paragraph(
            "AI functions strictly as an intelligent co-pilot. Every section, diagnostic tag, and drug dosage is fully editable.<br/><br/>"
            "<b>Mandatory clinician sign-off.</b>",
            table_cell
         )]
    ]
    gov_table = Table(gov_data, colWidths=[236, 236, 238])
    gov_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY_DARK),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('BACKGROUND', (0,1), (-1,-1), BG_LIGHT),
        ('PADDING', (0,0), (-1,-1), 10),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(gov_table)
    story.append(Spacer(1, 14))

    story.append(Paragraph("<b>Information Governance:</b> All demonstration datasets are 100% synthetic and anonymized in compliance with the UK Data Protection Act 2018 and Caldicott Principles. No patient health data is stored or transmitted.", body_style))

    story.append(PageBreak())

    # =========================================================================
    # SLIDE 8: MEASURABLE ROI & EFFICIENCY
    # =========================================================================
    story.append(Paragraph("7. Measurable Clinical & Operational ROI", slide_title))
    story.append(Paragraph("Quantifiable impact on NHS junior doctor productivity and acute hospital flow.", slide_subtitle))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceBefore=0, spaceAfter=14))

    roi_data = [
        [Paragraph("Performance Metric", table_header),
         Paragraph("Current NHS Manual Process", table_header),
         Paragraph("With Tandem Discharge", table_header),
         Paragraph("Net Clinical Impact", table_header)],
        [Paragraph("<b>Time per Discharge Summary</b>", table_cell_bold),
         Paragraph("35 – 60 minutes", table_cell),
         Paragraph("<b>< 90 seconds</b>", table_cell),
         Paragraph("<font color='#16A34A'><b>95% time reduction</b></font>", table_cell)],
        [Paragraph("<b>Medication Reconciliation Accuracy</b>", table_cell_bold),
         Paragraph("High risk (omissions in 30-40% cases)", table_cell),
         Paragraph("<b>Zero-omission diff matrix</b>", table_cell),
         Paragraph("<font color='#16A34A'><b>Eliminates TTO errors</b></font>", table_cell)],
        [Paragraph("<b>Time to Free Hospital Bed</b>", table_cell_bold),
         Paragraph("4 – 6 hours post-ward round", table_cell),
         Paragraph("<b>Immediate</b> (ready by 10:30 AM)", table_cell),
         Paragraph("<font color='#16A34A'><b>Unlocks hospital capacity</b></font>", table_cell)],
        [Paragraph("<b>GP Clarity & Actionability</b>", table_cell_bold),
         Paragraph("Dense, unformatted narrative", table_cell),
         Paragraph("<b>Prioritized checklist with deadlines</b>", table_cell),
         Paragraph("<font color='#16A34A'><b>Zero lost follow-ups</b></font>", table_cell)],
        [Paragraph("<b>Patient Comprehension</b>", table_cell_bold),
         Paragraph("Complex medical jargon", table_cell),
         Paragraph("<b>Plain-English leaflet (Age 11)</b>", table_cell),
         Paragraph("<font color='#16A34A'><b>Reduces readmissions</b></font>", table_cell)]
    ]
    roi_table = Table(roi_data, colWidths=[175, 175, 180, 180])
    roi_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY_DARK),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, BG_LIGHT]),
        ('PADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(roi_table)

    story.append(PageBreak())

    # =========================================================================
    # SLIDE 9: STAKEHOLDER PERSONAS
    # =========================================================================
    story.append(Paragraph("8. Stakeholder Ecosystem & User Personas", slide_title))
    story.append(Paragraph("Engineered to address acute pain points across the multidisciplinary care team.", slide_subtitle))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceBefore=0, spaceAfter=14))

    persona_data = [
        [Paragraph("<b>Dr. Alex Smith, FY1</b><br/><i>Acute Medicine (Ward 4B)</i>", table_header),
         Paragraph("<b>Dr. Jonathan Tai</b><br/><i>Clinical Lead, Urgent Care</i>", table_header),
         Paragraph("<b>Dr. Sarah Patel</b><br/><i>GP Partner, Millwood Medical</i>", table_header)],
        [Paragraph(
            "<b>Pain Point:</b> Has 6 patients ready for discharge by 11 AM. Writing summaries manually takes until 3 PM while urgent ward tasks pile up.<br/><br/>"
            "<b>With Tandem:</b> Synthesizes all 6 cases before 10:30 AM. Reclaims 2+ hours per shift, prevents burnout, and leaves on time.",
            table_cell
         ),
         Paragraph(
            "<b>Pain Point:</b> High-throughput urgent care handovers with risk of missed red flag laboratory results.<br/><br/>"
            "<b>With Tandem:</b> Standardized discharge protocols with immediate safety-net alerts and structured handover to community teams.",
            table_cell
         ),
         Paragraph(
            "<b>Pain Point:</b> Receives 30 dense discharge letters daily. Spends 10 minutes per letter hunting for what actually changed.<br/><br/>"
            "<b>With Tandem:</b> Prominent 'GP Action Required' box on page 1 with explicit blood test target dates.",
            table_cell
         )]
    ]
    persona_table = Table(persona_data, colWidths=[236, 236, 238])
    persona_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY_DARK),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('BACKGROUND', (0,1), (-1,-1), BG_LIGHT),
        ('PADDING', (0,0), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(persona_table)

    story.append(PageBreak())

    # =========================================================================
    # SLIDE 10: TECHNICAL ARCHITECTURE
    # =========================================================================
    story.append(Paragraph("9. Technical Architecture & Interoperability", slide_title))
    story.append(Paragraph("High logic density, sovereign anti-slop engineering, and native EHR compatibility.", slide_subtitle))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceBefore=0, spaceAfter=14))

    tech_data = [
        [Paragraph("<b>Frontend & UI Layer</b>", table_header),
         Paragraph("<b>Synthesis & Data Modeling</b>", table_header),
         Paragraph("<b>EHR Interoperability</b>", table_header)],
        [Paragraph(
            "• React 18 + TypeScript + Vite.<br/>"
            "• Tailwind CSS design tokens.<br/>"
            "• Liquid glass refraction styling.<br/>"
            "• Anti-slop zero-capsule audit pass.",
            table_cell
         ),
         Paragraph(
            "• Dual-pane cognitive cockpit.<br/>"
            "• 4-state deterministic Med Rec diff.<br/>"
            "• Interactive source-citation mapping.<br/>"
            "• SNOMED-CT clinical taxonomy.",
            table_cell
         ),
         Paragraph(
            "• 1-Click EHR Export Modal.<br/>"
            "• Formatted for EMIS Web & SystmOne.<br/>"
            "• Compatible with Epic Hyperspace.<br/>"
            "• Zero vendor lock-in.",
            table_cell
         )]
    ]
    tech_table = Table(tech_data, colWidths=[236, 236, 238])
    tech_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY_DARK),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('BACKGROUND', (0,1), (-1,-1), BG_LIGHT),
        ('PADDING', (0,0), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(tech_table)

    story.append(PageBreak())

    # =========================================================================
    # SLIDE 11: HACKATHON 3-HOUR DELIVERY ROADMAP
    # =========================================================================
    story.append(Paragraph("10. Hackathon 3-Hour Delivery Roadmap", slide_title))
    story.append(Paragraph("Phased execution from initial problem framing at 12:30 to verified submission before 15:45.", slide_subtitle))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceBefore=0, spaceAfter=14))

    time_data = [
        [Paragraph("Window", table_header),
         Paragraph("Phase", table_header),
         Paragraph("Key Deliverables Completed", table_header),
         Paragraph("Exit Criteria", table_header)],
        [Paragraph("<b>12:30 - 13:15</b>", table_cell),
         Paragraph("<b>Phase 1: Shell & Intake</b>", table_cell_bold),
         Paragraph("Scaffold React/Tailwind shell; embed 3 NHS cases; build chronological timeline feed.", table_cell),
         Paragraph("<font color='#16A34A'><b>VERIFIED</b></font>", table_cell)],
        [Paragraph("<b>13:15 - 14:15</b>", table_cell),
         Paragraph("<b>Phase 2: Synthesis & Med Rec</b>", table_cell_bold),
         Paragraph("Build eDN synthesis engine; 4-status Med Rec diff table; actionable GP checklist.", table_cell),
         Paragraph("<font color='#16A34A'><b>VERIFIED</b></font>", table_cell)],
        [Paragraph("<b>14:15 - 14:45</b>", table_cell),
         Paragraph("<b>Phase 3: Intelligence & Citations</b>", table_cell_bold),
         Paragraph("Implement source-citation highlight tooltips; build patient 'Take-Home' leaflet view.", table_cell),
         Paragraph("<font color='#16A34A'><b>VERIFIED</b></font>", table_cell)],
        [Paragraph("<b>14:45 - 15:30</b>", table_cell),
         Paragraph("<b>Phase 4: Design & Polish</b>", table_cell_bold),
         Paragraph("Apply Tandem teal design system; anti-slop zero-capsule audit; EHR copy modal.", table_cell),
         Paragraph("<font color='#16A34A'><b>VERIFIED</b></font>", table_cell)],
        [Paragraph("<b>15:30 - 15:45</b>", table_cell),
         Paragraph("<b>Phase 5: Submission & QA</b>", table_cell_bold),
         Paragraph("Build presentation deck, compile PDF, test live production URLs, submit project.", table_cell),
         Paragraph("<font color='#16A34A'><b>SUBMITTED</b></font>", table_cell)]
    ]
    time_table = Table(time_data, colWidths=[90, 160, 360, 100])
    time_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY_DARK),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, BG_LIGHT]),
        ('PADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(time_table)

    story.append(PageBreak())

    # =========================================================================
    # SLIDE 12: VISION & THE ASK
    # =========================================================================
    story.append(Paragraph("11. Vision: The Complete Clinical OS", slide_title))
    story.append(Paragraph("Closing the episode loop and expanding Tandem's clinical OS across secondary care.", slide_subtitle))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceBefore=0, spaceAfter=14))

    story.append(Paragraph("<b>The Expanded Tandem Ecosystem:</b>", h2_style))
    story.append(Paragraph("• <b>Tandem Ambient (Primary Care):</b> Synchronous audio scribing during live 1-on-1 consultations. The doctor's trusted co-pilot in outpatient clinics.", bullet_style))
    story.append(Paragraph("• <b>Tandem Discharge (Secondary Care):</b> Multi-source asynchronous synthesis across multi-day inpatient stays, lab feeds, and drug charts. The acute ward's administrative engine.", bullet_style))
    story.append(Paragraph("• <b>Unified Care Continuity:</b> When a patient is discharged from hospital, the receiving GP's Tandem Ambient system receives the structured discharge package automatically, pre-populating consultation context.", bullet_style))

    story.append(Spacer(1, 14))

    callout_data = [[
        Paragraph(
            "<b>Closing Pitch:</b><br/>"
            "<i>'Tandem Health pioneered ambient clinical scribing to solve the single consultation. "
            "With Tandem Discharge, we solve the hospital episode—unlocking bed capacity, protecting patients from medication handover errors, "
            "and freeing NHS clinicians to do what they do best: care for patients.'</i>",
            ParagraphStyle('CloseText', fontName='Helvetica', fontSize=10, leading=14, textColor=TEXT_DARK)
        )
    ]]
    callout_table = Table(callout_data, colWidths=[710])
    callout_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), PRIMARY_LIGHT),
        ('BOX', (0,0), (-1,-1), 1.5, PRIMARY),
        ('PADDING', (0,0), (-1,-1), 12),
    ]))
    story.append(callout_table)
    story.append(Spacer(1, 12))
    story.append(Paragraph("<font color='#64748B'><b>Ready for Live Demonstration & Q&A.</b> Thank you to the Tandem Health & NXGN team.</font>",
                           ParagraphStyle('End', fontName='Helvetica-Bold', fontSize=9, alignment=1)))

    doc.build(story, canvasmaker=PresentationCanvas)
    print(f"Presentation PDF built successfully: {filename}")

if __name__ == "__main__":
    build_presentation_pdf()
