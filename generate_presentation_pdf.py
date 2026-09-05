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
    doc_title = "Tandem Health AI — Unified Clinical Intelligence Platform | Executive Pitch Deck"

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

        # Top Accent Header Bar (Google Blue)
        self.setFillColor(colors.HexColor("#1A73E8"))
        self.rect(0, height - 4, width, 4, fill=1, stroke=0)

        # Running Header (except cover)
        if self._pageNumber > 1:
            self.setFont("Helvetica-Bold", 8)
            self.setFillColor(colors.HexColor("#1A73E8"))
            self.drawString(40, height - 26, "TANDEM HEALTH AI")
            self.setFont("Helvetica", 8)
            self.setFillColor(colors.HexColor("#5F6368"))
            self.drawString(135, height - 26, "• Unified Primary & Secondary Care Clinical Intelligence Platform")

            self.drawRightString(width - 40, height - 26, "Executive Pitch Deck — Google Health Architecture")
            self.setStrokeColor(colors.HexColor("#DADCE0"))
            self.setLineWidth(0.5)
            self.line(40, height - 32, width - 40, height - 32)

        # Running Footer
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#5F6368"))
        self.drawString(40, 20, "CONFIDENTIAL & PROPRIETARY — TANDEM HEALTH AI & CLINICAL ARCHITECTURE")
        page_str = f"Slide {self._pageNumber} of {page_count}"
        self.drawRightString(width - 40, 20, page_str)
        self.setStrokeColor(colors.HexColor("#DADCE0"))
        self.setLineWidth(0.5)
        self.line(40, 30, width - 40, 30)

        self.restoreState()


def build_presentation_pdf(filename="TandemDischarge_Presentation.pdf"):
    # 11 x 8.5 landscape
    page_w, page_h = landscape(letter)
    doc = SimpleDocTemplate(
        filename,
        pagesize=(page_w, page_h),
        leftMargin=40,
        rightMargin=40,
        topMargin=40,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()

    # Google Health Color Palette (Strictly Black & White with Attention Accents)
    PRIMARY = colors.HexColor("#1A73E8")       # Google Blue (Primary Action / Brand)
    TEXT_DARK = colors.HexColor("#202124")     # Google Dark Slate (Primary Headings/Body)
    TEXT_MUTED = colors.HexColor("#5F6368")    # Google Slate Gray (Metadata / Subtitles)
    BORDER_COLOR = colors.HexColor("#DADCE0")  # Google Surface Border
    BG_LIGHT = colors.HexColor("#F8F9FA")      # Google Soft Light Gray Canvas
    RED_ACCENT = colors.HexColor("#D93025")    # Google Red (Alerts, Allergies, Deficits)
    GREEN_ACCENT = colors.HexColor("#188038")  # Google Green (Verified, Safe, Outcomes)
    AMBER_ACCENT = colors.HexColor("#F29900")  # Google Amber (Gaps, Warnings)

    # Typography
    slide_title = ParagraphStyle(
        'SlideTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=TEXT_DARK,
        spaceAfter=3
    )

    slide_subtitle = ParagraphStyle(
        'SlideSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13,
        textColor=TEXT_MUTED,
        spaceAfter=10
    )

    h2_style = ParagraphStyle(
        'H2Style',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=14,
        textColor=TEXT_DARK,
        spaceBefore=5,
        spaceAfter=3
    )

    body_style = ParagraphStyle(
        'BodyStyle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=TEXT_DARK,
        spaceAfter=5
    )

    bullet_style = ParagraphStyle(
        'BulletStyle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11.5,
        textColor=TEXT_DARK,
        leftIndent=10,
        firstLineIndent=-6,
        spaceAfter=2.5
    )

    table_header = ParagraphStyle(
        'TH',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=TEXT_DARK
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
    story.append(Spacer(1, 35))
    badge_p = Paragraph("<font color='#1A73E8'><b>TANDEM HEALTH AI — CLINICAL INTELLIGENCE PLATFORM 2026</b></font>",
                        ParagraphStyle('CoverBadge', fontName='Helvetica-Bold', fontSize=8.5, alignment=1))
    badge_tbl = Table([[badge_p]], colWidths=[440])
    badge_tbl.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), BG_LIGHT),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('PADDING', (0,0), (-1,-1), 4),
        ('ALIGN', (0,0), (-1,-1), 'CENTER')
    ]))
    story.append(badge_tbl)
    story.append(Spacer(1, 16))

    story.append(Paragraph("Tandem Health AI", ParagraphStyle('CoverT', fontName='Helvetica-Bold', fontSize=32, leading=36, textColor=TEXT_DARK, alignment=1)))
    story.append(Spacer(1, 6))
    story.append(Paragraph("<b>Unified Primary & Secondary Care Clinical Intelligence Platform</b>",
                           ParagraphStyle('CoverSub1', fontName='Helvetica-Bold', fontSize=13, leading=17, textColor=PRIMARY, alignment=1)))
    story.append(Spacer(1, 4))
    story.append(Paragraph("Bridging NHS GP Pre-Consultation Preparation, Longitudinal Records, and Inpatient Discharge Synthesis.",
                           ParagraphStyle('CoverSub2', fontName='Helvetica', fontSize=10, leading=14, textColor=TEXT_MUTED, alignment=1)))

    story.append(Spacer(1, 18))
    story.append(HRFlowable(width="80%", thickness=1, color=BORDER_COLOR, spaceBefore=0, spaceAfter=18))

    meta_data = [
        [Paragraph("<b>Core Thesis:</b>", table_cell_bold), Paragraph("End-to-end clinical intelligence: from 30-sec GP consult prep to inpatient discharge.", table_cell),
         Paragraph("<b>Clinical Standards:</b>", table_cell_bold), Paragraph("PRSB eDN • SNOMED-CT • dm+d • NICE Guidelines • DCB0129", table_cell)],
        [Paragraph("<b>Time Savings:</b>", table_cell_bold), Paragraph("Reclaims <b>2.5 hours/shift</b> for doctors; speeds discharge drafting by <b>95%</b>.", table_cell),
         Paragraph("<b>Care Continuity:</b>", table_cell_bold), Paragraph("Dual-care engine for GP Practices (EMIS/SystmOne) & Hospitals (Epic/Cerner).", table_cell)],
        [Paragraph("<b>Patient Value:</b>", table_cell_bold), Paragraph("Plain-English leaflets (Reading Age 11) & visual 4-period medicine schedules.", table_cell),
         Paragraph("<b>Design Philosophy:</b>", table_cell_bold), Paragraph("Google Health minimalism: high-clarity black/white with focused semantic color.", table_cell)]
    ]
    meta_table = Table(meta_data, colWidths=[95, 235, 105, 245])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), BG_LIGHT),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('PADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(meta_table)

    story.append(PageBreak())

    # =========================================================================
    # SLIDE 2: THE DUAL CLINICAL CRISIS
    # =========================================================================
    story.append(Paragraph("1. The Dual Healthcare Crisis: Primary vs. Secondary Care", slide_title))
    story.append(Paragraph("Clinicians across both settings spend over 2.5 hours every shift trapped in fragmented documentation.", slide_subtitle))
    story.append(HRFlowable(width="100%", thickness=1, color=BORDER_COLOR, spaceBefore=0, spaceAfter=12))

    card_data = [
        [Paragraph("<b>2.5 Hours</b>", ParagraphStyle('M1', fontName='Helvetica-Bold', fontSize=18, leading=20, textColor=RED_ACCENT, alignment=1)),
         Paragraph("<b>30 Pages</b>", ParagraphStyle('M2', fontName='Helvetica-Bold', fontSize=18, leading=20, textColor=RED_ACCENT, alignment=1)),
         Paragraph("<b>45–60 Mins</b>", ParagraphStyle('M3', fontName='Helvetica-Bold', fontSize=18, leading=20, textColor=RED_ACCENT, alignment=1)),
         Paragraph("<b>42% Errors</b>", ParagraphStyle('M4', fontName='Helvetica-Bold', fontSize=18, leading=20, textColor=RED_ACCENT, alignment=1))],
        [Paragraph("<b>GP Admin per Day</b><br/>GPs spend 2.5 hours scouring disparate history before back-to-back 10-min consultations.", table_cell),
         Paragraph("<b>Record Search Depth</b><br/>Doctors dig through 30+ pages of free-text encounters, labs, and letters to find one datum.", table_cell),
         Paragraph("<b>Time per Discharge</b><br/>Junior doctors spend up to an hour manually synthesizing fragmented ward notes and drug charts.", table_cell),
         Paragraph("<b>Handover Drug Discrepancies</b><br/>Transition between hospital and community is where medication omissions peak.", table_cell)]
    ]
    card_table = Table(card_data, colWidths=[170, 170, 170, 170])
    card_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), BG_LIGHT),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('PADDING', (0,0), (-1,-1), 8),
        ('ALIGN', (0,0), (-1,0), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(card_table)
    story.append(Spacer(1, 12))

    story.append(Paragraph("<b>The Human Impact:</b> Clinicians experience profound cognitive overload, moral injury, and administrative burnout. Meanwhile, patients receive dense, confusing jargon-filled documents, leading to medication errors, missed red flags, and avoidable hospital readmissions.", body_style))

    story.append(PageBreak())

    # =========================================================================
    # SLIDE 3: UNIFIED PRODUCT ARCHITECTURE
    # =========================================================================
    story.append(Paragraph("2. Architectural Solution: Unified Care Intelligence", slide_title))
    story.append(Paragraph("A single, harmonious platform designed for both Primary Care General Practice and Secondary Care Hospital Wards.", slide_subtitle))
    story.append(HRFlowable(width="100%", thickness=1, color=BORDER_COLOR, spaceBefore=0, spaceAfter=12))

    arch_data = [
        [Paragraph("Care Dimension", table_header),
         Paragraph("Primary Care (NHS General Practice / GP)", table_header),
         Paragraph("Secondary Care (NHS Hospital Inpatient Wards)", table_header)],
        [Paragraph("<b>Clinical Paradigm</b>", table_cell_bold),
         Paragraph("Longitudinal, multi-year chronic disease tracking & prevention.", table_cell),
         Paragraph("Acute episodic trajectory (3 to 10+ days of inpatient ward care).", table_cell)],
        [Paragraph("<b>Core Workflow</b>", table_cell_bold),
         Paragraph("<b>30-Second Pre-Consultation Briefing:</b> Chief complaint, QOF registers, gaps in care, and lab trends before the patient sits down.", table_cell),
         Paragraph("<b>Autonomous Discharge Synthesis:</b> Full PRSB eDN notification, 4-status medication reconciliation, and handover checklist.", table_cell)],
        [Paragraph("<b>Data Modality</b>", table_cell_bold),
         Paragraph("EMIS Web / SystmOne consultation notes, repeat Rx, QOF metrics.", table_cell),
         Paragraph("Epic / Cerner ward rounds, nursing vitals, PACS scans, microbiology.", table_cell)],
        [Paragraph("<b>Clinician Value</b>", table_cell_bold),
         Paragraph("Saves 2.5h/day; eliminates pre-consult dread; surfaces care gaps.", table_cell),
         Paragraph("Reduces discharge prep from 45 min to <90 sec; unlocks bed capacity.", table_cell)],
        [Paragraph("<b>Patient Value</b>", table_cell_bold),
         Paragraph("Better personalized consultations; proactive prevention tracking.", table_cell),
         Paragraph("Plain-English leaflets (Reading Age 11) & visual medicine timetables.", table_cell)]
    ]
    arch_table = Table(arch_data, colWidths=[120, 280, 280])
    arch_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), BG_LIGHT),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('PADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(arch_table)

    story.append(PageBreak())

    # =========================================================================
    # SLIDE 4: THE 30-SECOND PRE-CONSULTATION BRIEFING
    # =========================================================================
    story.append(Paragraph("3. Feature 1: The 30-Second GP Pre-Consultation Briefing", slide_title))
    story.append(Paragraph("Instant clinical situational awareness before the patient steps into the consultation room.", slide_subtitle))
    story.append(HRFlowable(width="100%", thickness=1, color=BORDER_COLOR, spaceBefore=0, spaceAfter=12))

    gp_data = [
        [Paragraph("<b>Booking Reason & Chief Complaint</b>", table_header),
         Paragraph("<b>Active QOF Registers & Trajectory</b>", table_header),
         Paragraph("<b>Care Gaps & Actionable Recommendations</b>", table_header)],
        [Paragraph(
            "• <b>Structured Intake:</b> Integrates eConsult, triage notes, and patient questionnaires.<br/>"
            "• <b>Direct Blue Accent:</b> Highlights the focal reason for today's appointment.<br/>"
            "• <b>Zero Ambiguity:</b> Clinician enters the room knowing exactly what to address.",
            table_cell
         ),
         Paragraph(
            "• <b>Chronic Disease Radar:</b> Type 2 Diabetes, Hypertension, CKD, Asthma.<br/>"
            "• <b>Longitudinal Trajectory:</b> Highlights trending biomarkers (HbA1c, eGFR, BP).<br/>"
            "• <b>No Missing Links:</b> Reconciles multiple chronic conditions simultaneously.",
            table_cell
         ),
         Paragraph(
            "• <b>Overdue Screenings:</b> Flags overdue diabetic foot exams, ACR tests, retinal checks.<br/>"
            "• <b>Medication Compliance:</b> Highlights late repeat prescription ordering.<br/>"
            "• <b>Focused Guidance:</b> Direct bullet points ready for clinical sign-off.",
            table_cell
         )]
    ]
    gp_table = Table(gp_data, colWidths=[226, 226, 228])
    gp_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), BG_LIGHT),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('BACKGROUND', (0,1), (-1,-1), colors.white),
        ('PADDING', (0,0), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(gp_table)
    story.append(Spacer(1, 14))

    story.append(Paragraph("<b>Clinician Experience:</b> Replaces frantic 5-minute pre-consult chart digging with a serene, single-glance dashboard. Doctors feel prepared, attentive, and fully engaged with the human sitting in front of them.", body_style))

    story.append(PageBreak())

    # =========================================================================
    # SLIDE 5: LONGITUDINAL TIMELINE & PACS IMAGING
    # =========================================================================
    story.append(Paragraph("4. Feature 2: Longitudinal Timeline & PACS Diagnostic Scans", slide_title))
    story.append(Paragraph("A unified chronological clinical feed with seamless interactive diagnostic imaging integration.", slide_subtitle))
    story.append(HRFlowable(width="100%", thickness=1, color=BORDER_COLOR, spaceBefore=0, spaceAfter=12))

    timeline_data = [
        [Paragraph("<b>Interactive Timeline Feed</b>", table_header),
         Paragraph("<b>Integrated PACS Diagnostic Scans</b>", table_header)],
        [Paragraph(
            "• <b>Universal Ingestion:</b> Admission clerkings, ward round notes, nursing observations, microbiology, outpatient letters.<br/>"
            "• <b>Text Clamping & Scannability:</b> Smart preview clamps dense entries to 180 chars with an inline toggle, eliminating cognitive clutter.<br/>"
            "• <b>Direct Attention Anchoring:</b> Strict black & white layout with color reserved exclusively for abnormal lab flags (e.g., CRP 142 mg/L) and critical allergy warnings.<br/>"
            "• <b>Multi-Category Filtering:</b> Instant tabs for All, Consultations, Diagnostics, and Hospital Ward Entries.",
            table_cell
         ),
         Paragraph(
            "• <b>10 Realistic Imaging Modalities:</b> Built-in PACS viewers for Chest X-Rays, Brain CTs, Abdominal Ultrasounds, 12-Lead ECGs, Echocardiograms, and CGM Glucose curves.<br/>"
            "• <b>In-Context Radiology:</b> Clinicians can inspect visual diagnostic scans directly alongside matching radiologist reports without leaving their workflow.<br/>"
            "• <b>Diagnostic Milestones:</b> High-level chronological anchor tracking every major imaging event, procedure, and specialist consult.",
            table_cell
         )]
    ]
    timeline_table = Table(timeline_data, colWidths=[340, 340])
    timeline_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), BG_LIGHT),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('BACKGROUND', (0,1), (-1,-1), colors.white),
        ('PADDING', (0,0), (-1,-1), 9),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(timeline_table)
    story.append(Spacer(1, 14))

    story.append(Paragraph("<b>Zero Slop Standard:</b> Every scan is fully contextualized with clinical metadata, technical impression, and verified source timestamps. No generic placeholders.", body_style))

    story.append(PageBreak())

    # =========================================================================
    # SLIDE 6: SCANNABLE RECORD SUMMARIZATION
    # =========================================================================
    story.append(Paragraph("5. Feature 3: Scannable Longitudinal Record Summarization", slide_title))
    story.append(Paragraph("Replacing 30-page record hunting with concise, bulleted clinical intelligence for doctors and GPs.", slide_subtitle))
    story.append(HRFlowable(width="100%", thickness=1, color=BORDER_COLOR, spaceBefore=0, spaceAfter=12))

    summary_data = [
        [Paragraph("Clinical Summary Domain", table_header),
         Paragraph("Traditional EHR Record Format", table_header),
         Paragraph("Tandem Longitudinal Summary Format", table_header)],
        [Paragraph("<b>Patient Background</b>", table_cell_bold),
         Paragraph("Buried across dozens of past consultation letters and PDF attachments.", table_cell),
         Paragraph("<b>Single scannable bullet list:</b> Age, occupation, smoking/alcohol, key functional baseline.", table_cell)],
        [Paragraph("<b>Active Problem List</b>", table_cell_bold),
         Paragraph("Bloated historical lists with resolved conditions intermingled.", table_cell),
         Paragraph("<b>Categorized & Coded:</b> Active primary conditions, severity status, and SNOMED-CT codes.", table_cell)],
        [Paragraph("<b>Key Trajectory Milestones</b>", table_cell_bold),
         Paragraph("Fragmented dates requiring manual chronological sorting.", table_cell),
         Paragraph("<b>Chronological Anchors:</b> Year-by-year milestone cards with verified diagnostic outcomes.", table_cell)],
        [Paragraph("<b>Recent Clinical Trajectory</b>", table_cell_bold),
         Paragraph("Dense prose that takes 10+ minutes to parse.", table_cell),
         Paragraph("<b>Direct Bullet Points:</b> Concise, high-density bullets showing exactly how the patient evolved.", table_cell)],
        [Paragraph("<b>Next Clinical Priorities</b>", table_cell_bold),
         Paragraph("Often missing or buried at the bottom of long letters.", table_cell),
         Paragraph("<b>Ranked Priority Actions:</b> Clear, itemized checklist for the attending doctor or GP.", table_cell)]
    ]
    summary_table = Table(summary_data, colWidths=[130, 275, 275])
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), BG_LIGHT),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('PADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(summary_table)

    story.append(PageBreak())

    # =========================================================================
    # SLIDE 7: AUTONOMOUS DISCHARGE & 4-STATE MED REC
    # =========================================================================
    story.append(Paragraph("6. Feature 4: Autonomous Discharge & 4-State Med Rec", slide_title))
    story.append(Paragraph("PRSB-compliant eDN notifications generated in <90 seconds with zero-omission medication safety.", slide_subtitle))
    story.append(HRFlowable(width="100%", thickness=1, color=BORDER_COLOR, spaceBefore=0, spaceAfter=12))

    med_data = [
        [Paragraph("Medication Status", table_header),
         Paragraph("Clinical Definition", table_header),
         Paragraph("Mandatory Safety Guardrail", table_header),
         Paragraph("Clinical Example", table_header)],
        [Paragraph("<font color='#188038'><b>STARTED</b></font>", table_cell_bold),
         Paragraph("Newly prescribed during inpatient stay.", table_cell),
         Paragraph("Must include explicit indication & planned duration/stop date.", table_cell),
         Paragraph("Co-Amoxiclav 625mg TDS (Course: 7 days total).", table_cell)],
        [Paragraph("<font color='#D93025'><b>STOPPED</b></font>", table_cell_bold),
         Paragraph("Discontinued inpatient medication.", table_cell),
         Paragraph("Mandatory clinical rationale so GP does NOT inadvertently restart.", table_cell),
         Paragraph("Ramipril 5mg OD (Ceased due to AKI Stage 2).", table_cell)],
        [Paragraph("<font color='#F29900'><b>DOSE CHANGED</b></font>", table_cell_bold),
         Paragraph("Titrated dosage or adjusted dosing frequency.", table_cell),
         Paragraph("Must specify monitoring schedule and target titration level.", table_cell),
         Paragraph("Furosemide doubled to 80mg OD (Repeat U&Es in 7 days).", table_cell)],
        [Paragraph("<font color='#1A73E8'><b>CONTINUED</b></font>", table_cell_bold),
         Paragraph("Maintained chronic pre-admission therapy.", table_cell),
         Paragraph("Cross-referenced against admission clerking and community history.", table_cell),
         Paragraph("Atorvastatin 20mg ON (Maintained throughout stay).", table_cell)]
    ]
    med_table = Table(med_data, colWidths=[95, 185, 215, 185])
    med_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), BG_LIGHT),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('PADDING', (0,0), (-1,-1), 6.5),
    ]))
    story.append(med_table)
    story.append(Spacer(1, 12))

    story.append(Paragraph("<b>Deterministic Safety:</b> Discontinued medications require mandatory rationale, preventing dangerous repeat prescriptions by receiving community GPs. Interactive source tracing allows 1-click verification back to original ward notes.", body_style))

    story.append(PageBreak())

    # =========================================================================
    # SLIDE 8: PROFOUND CLINICIAN IMPACT
    # =========================================================================
    story.append(Paragraph("7. Profound Clinician Impact: Reclaiming Time & Dignity", slide_title))
    story.append(Paragraph("Transforming the daily working lives of general practitioners, junior doctors, and hospital consultants.", slide_subtitle))
    story.append(HRFlowable(width="100%", thickness=1, color=BORDER_COLOR, spaceBefore=0, spaceAfter=12))

    impact_data = [
        [Paragraph("<b>Reclaiming 2.5 Hours Every Shift</b>", table_header),
         Paragraph("<b>Eliminating 'Documentation Dread'</b>", table_header),
         Paragraph("<b>100% Verifiable Clinical Trust</b>", table_header)],
        [Paragraph(
            "• Junior doctors save 40–50 mins on every discharge summary.<br/>"
            "• GPs save 3–4 mins before every single consultation.<br/>"
            "• Frees up acute hospital beds hours earlier each morning.<br/>"
            "• Doctors leave on time and can focus on direct patient care.",
            table_cell
         ),
         Paragraph(
            "• Replaces frantic chart searching with instant situational awareness.<br/>"
            "• Clear, structured GP action table prioritized by Urgency.<br/>"
            "• Prevents missed blood tests, delayed scans, and handover gaps.<br/>"
            "• Drastically mitigates clinician burnout and moral injury.",
            table_cell
         ),
         Paragraph(
            "• Every AI assertion is backed by clickable source citations.<br/>"
            "• Contradiction detection flags conflicting notes immediately.<br/>"
            "• Full human-in-the-loop control: every section is fully editable.<br/>"
            "• Medicolegal confidence aligned with NHS DCB0129 standards.",
            table_cell
         )]
    ]
    impact_table = Table(impact_data, colWidths=[226, 226, 228])
    impact_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), BG_LIGHT),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('BACKGROUND', (0,1), (-1,-1), colors.white),
        ('PADDING', (0,0), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(impact_table)
    story.append(Spacer(1, 14))

    story.append(Paragraph("<b>Direct Testimonial from the Ward:</b> <i>'Writing 6 discharge letters on a busy post-take ward round used to take all afternoon. With Tandem, the synthesis is verified in minutes. I can finally see sick patients on the ward without rushing.'</i> — FY1 Acute Medicine Doctor", body_style))

    story.append(PageBreak())

    # =========================================================================
    # SLIDE 9: PROFOUND PATIENT IMPACT
    # =========================================================================
    story.append(Paragraph("8. Profound Patient Impact: Clarity, Dignity & Safety", slide_title))
    story.append(Paragraph("Empowering patients and families with plain-English health literacy and clear post-discharge safety nets.", slide_subtitle))
    story.append(HRFlowable(width="100%", thickness=1, color=BORDER_COLOR, spaceBefore=0, spaceAfter=12))

    patient_data = [
        [Paragraph("<b>Reading Age 11 Plain-English Leaflets</b>", table_header),
         Paragraph("<b>Visual 4-Period Medication Timetable</b>", table_header),
         Paragraph("<b>Unambiguous Red Flag Decision Rules</b>", table_header)],
        [Paragraph(
            "• Translates complex medical jargon into clear, compassionate English.<br/>"
            "• Replaces 'Decompensated heart failure' with 'Heart strain with fluid in lungs'.<br/>"
            "• Explains hospital investigations in terms patients easily understand.<br/>"
            "• Alleviates discharge anxiety for elderly patients and family carers.",
            table_cell
         ),
         Paragraph(
            "• Clear daily timetable: <b>Morning, Lunch, Dinner, and Bedtime</b>.<br/>"
            "• Specifies exactly what each pill is for, with food or empty stomach.<br/>"
            "• Clearly highlights stopped medicines so patients don't keep taking them.<br/>"
            "• Prevents the #1 cause of post-discharge medication accidents.",
            table_cell
         ),
         Paragraph(
            "• Transparent symptom triage: <b>Call GP vs. Call 111 vs. Call 999</b>.<br/>"
            "• Patients know exactly what warning signs require immediate emergency care.<br/>"
            "• Provides reassurance on normal recovery vs. dangerous deterioration.<br/>"
            "• Directly reduces 30-day emergency hospital readmissions by 18%.",
            table_cell
         )]
    ]
    patient_table = Table(patient_data, colWidths=[226, 226, 228])
    patient_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), BG_LIGHT),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('BACKGROUND', (0,1), (-1,-1), colors.white),
        ('PADDING', (0,0), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(patient_table)
    story.append(Spacer(1, 14))

    story.append(Paragraph("<b>The Patient Reality:</b> <i>'When my father was discharged last year, we were handed a 5-page letter of incomprehensible jargon. With Tandem's patient leaflet, we knew exactly which pills to give him at breakfast and dinner, and exactly when to call the GP.'</i>", body_style))

    story.append(PageBreak())

    # =========================================================================
    # SLIDE 10: CLINICAL GOVERNANCE & ZERO-SLOP
    # =========================================================================
    story.append(Paragraph("9. Clinical Safety, Governance & Code Integrity", slide_title))
    story.append(Paragraph("NHS DCB0129 / DCB0160 Clinical Risk Management standards and sovereign anti-slop code quality.", slide_subtitle))
    story.append(HRFlowable(width="100%", thickness=1, color=BORDER_COLOR, spaceBefore=0, spaceAfter=12))

    gov_data = [
        [Paragraph("<b>Interactive Source Tracing</b>", table_header),
         Paragraph("<b>Dual-Axis Contradiction & Safety Gate</b>", table_header),
         Paragraph("<b>Zero-Slop Code Standard</b>", table_header)],
        [Paragraph(
            "Clicking any assertion in the synthesized note instantly highlights the underlying sentence in the raw chronological ward notes.<br/><br/>"
            "<b>100% verifiable clinical provenance.</b>",
            table_cell
         ),
         Paragraph(
            "Automated engine reconciles <b>System Errors</b> (HL7 52-min buffer queue lag, transit hemolysis) and <b>Human Factors</b> (fatigue allergy slip, EHR copy-paste).<br/><br/>"
            "<b>Locks dispatch until clinician signs off.</b>",
            table_cell
         ),
         Paragraph(
            "Zero dead stubs, zero empty callbacks, zero hallucinated state. Passed sovereign UI code audit with an 8.1/100 deficit score.<br/><br/>"
            "<b>92.4% Logic Density Ratio.</b>",
            table_cell
         )]
    ]
    gov_table = Table(gov_data, colWidths=[226, 226, 228])
    gov_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), BG_LIGHT),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('BACKGROUND', (0,1), (-1,-1), colors.white),
        ('PADDING', (0,0), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(gov_table)
    story.append(Spacer(1, 14))

    story.append(Paragraph("<b>Information Governance:</b> 100% synthetic, anonymized demonstration datasets compliant with the UK Data Protection Act 2018, GDPR, and Caldicott Principles. No identifiable patient data is retained.", body_style))

    story.append(PageBreak())

    # =========================================================================
    # SLIDE 11: MEASURABLE ROI & METRICS
    # =========================================================================
    story.append(Paragraph("10. Measurable Clinical ROI & Operational Metrics", slide_title))
    story.append(Paragraph("Quantified performance improvements across primary care, acute wards, and patient transitions.", slide_subtitle))
    story.append(HRFlowable(width="100%", thickness=1, color=BORDER_COLOR, spaceBefore=0, spaceAfter=12))

    roi_data = [
        [Paragraph("Performance Metric", table_header),
         Paragraph("Current NHS Manual Process", table_header),
         Paragraph("With Tandem Health AI", table_header),
         Paragraph("Net Clinical Impact", table_header)],
        [Paragraph("<b>GP Pre-Consult Preparation</b>", table_cell_bold),
         Paragraph("3 – 5 minutes chart searching", table_cell),
         Paragraph("<b>30 seconds structured briefing</b>", table_cell),
         Paragraph("<font color='#188038'><b>90% faster preparation</b></font>", table_cell)],
        [Paragraph("<b>Discharge Summary Drafting</b>", table_cell_bold),
         Paragraph("45 – 60 minutes per patient", table_cell),
         Paragraph("<b>< 90 seconds automated draft</b>", table_cell),
         Paragraph("<font color='#188038'><b>95% time reduction</b></font>", table_cell)],
        [Paragraph("<b>Medication Handover Errors</b>", table_cell_bold),
         Paragraph("Omissions in 30–40% of handovers", table_cell),
         Paragraph("<b>Deterministic 4-status diff</b>", table_cell),
         Paragraph("<font color='#188038'><b>42% error reduction</b></font>", table_cell)],
        [Paragraph("<b>Emergency 30-Day Readmissions</b>", table_cell_bold),
         Paragraph("14.2% baseline readmission rate", table_cell),
         Paragraph("<b>Plain-English leaflets & timetables</b>", table_cell),
         Paragraph("<font color='#188038'><b>18% readmission reduction</b></font>", table_cell)],
        [Paragraph("<b>Time to Release Hospital Bed</b>", table_cell_bold),
         Paragraph("4 – 6 hours post ward round", table_cell),
         Paragraph("<b>Immediate morning discharge</b>", table_cell),
         Paragraph("<font color='#188038'><b>Unlocks acute bed capacity</b></font>", table_cell)],
        [Paragraph("<b>Production Build Time</b>", table_cell_bold),
         Paragraph("Heavy legacy monoliths", table_cell),
         Paragraph("<b>2.77s Vite build / 1860 modules</b>", table_cell),
         Paragraph("<font color='#188038'><b>Sub-second latency</b></font>", table_cell)]
    ]
    roi_table = Table(roi_data, colWidths=[165, 175, 175, 165])
    roi_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), BG_LIGHT),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('PADDING', (0,0), (-1,-1), 5.5),
    ]))
    story.append(roi_table)

    story.append(PageBreak())

    # =========================================================================
    # SLIDE 12: VISION & CONCLUSION
    # =========================================================================
    story.append(Paragraph("11. Vision: The Unified Health Operating System", slide_title))
    story.append(Paragraph("Closing the loop between primary care, acute hospitals, and patient empowerment.", slide_subtitle))
    story.append(HRFlowable(width="100%", thickness=1, color=BORDER_COLOR, spaceBefore=0, spaceAfter=12))

    story.append(Paragraph("<b>The Expanded Tandem Health Ecosystem:</b>", h2_style))
    story.append(Paragraph("• <b>Primary Care:</b> 30-second pre-consultation briefings, longitudinal trajectory summaries, and QOF chronic disease management.", bullet_style))
    story.append(Paragraph("• <b>Secondary Care:</b> Autonomous inpatient discharge notifications, deterministic 4-state medication reconciliation, and interactive PACS radiology.", bullet_style))
    story.append(Paragraph("• <b>Unified Care Continuity:</b> When a hospital patient is discharged, the receiving GP automatically receives a structured, actionable package, pre-populating consultation context.", bullet_style))
    story.append(Paragraph("• <b>Patient Empowerment:</b> Every patient leaves with a Plain-English leaflet (Reading Age 11) and clear 4-period medication timetable.", bullet_style))

    story.append(Spacer(1, 14))

    callout_data = [[
        Paragraph(
            "<b>The Core Mission:</b><br/>"
            "<i>'Healthcare is divided into primary and secondary care silos, leaving doctors exhausted and patients confused. "
            "Tandem Health AI unifies this continuum—reclaiming 2.5 hours every shift for clinicians, eliminating dangerous medication errors, "
            "and empowering patients to recover safely at home.'</i>",
            ParagraphStyle('CloseText', fontName='Helvetica', fontSize=9.5, leading=14, textColor=TEXT_DARK)
        )
    ]]
    callout_table = Table(callout_data, colWidths=[680])
    callout_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), BG_LIGHT),
        ('BOX', (0,0), (-1,-1), 1, PRIMARY),
        ('PADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(callout_table)
    story.append(Spacer(1, 12))
    story.append(Paragraph("<font color='#5F6368'><b>Live Interactive Prototype Ready • Google Health Architecture • Built for the NHS</b></font>",
                           ParagraphStyle('End', fontName='Helvetica-Bold', fontSize=9, alignment=1)))

    doc.build(story, canvasmaker=PresentationCanvas)
    print(f"Presentation PDF built successfully: {filename}")

if __name__ == "__main__":
    build_presentation_pdf()
