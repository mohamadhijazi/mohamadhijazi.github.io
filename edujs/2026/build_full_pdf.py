import os
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, landscape
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Image as RLImage, Table, TableStyle, PageBreak
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas

output_dir = r"C:\ws\github\mohammadhijazi\mohamadhijazi.github.io\edujs\2026"
pdf_path = os.path.join(output_dir, "Enterprise_Architecture_Evolution_2005_2026.pdf")

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_page_decorations(self, page_count):
        if self._pageNumber == 1:
            return  # Suppress headers/footers on cover

        self.saveState()
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#0284C7"))
        self.drawString(54, 574, "ENTERPRISE ARCHITECTURE EVOLUTION (2005 -> 2026)")
        
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        self.drawRightString(738, 574, "FACT-CHECKED PUBLIC KNOWLEDGE & SCIENTIFIC SYNTHESIS")

        # Top thin line
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.6)
        self.line(54, 566, 738, 566)

        # Bottom thin line
        self.line(54, 40, 738, 40)
        self.drawString(54, 28, "Educational Visual Synthesis | Strictly Objective & Scientific | No Institutional/Personal Attribution")
        self.drawRightString(738, 28, f"Page {self._pageNumber} of {page_count}")
        self.restoreState()

def build_pdf():
    # Usable area: width = 792 - 108 = 684 pt, height = 612 - 80 = 532 pt
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=landscape(letter),
        leftMargin=54,
        rightMargin=54,
        topMargin=46,
        bottomMargin=46
    )

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        'CoverTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=30,
        leading=36,
        textColor=colors.HexColor("#0F172A"),
        spaceAfter=10
    )

    subtitle_style = ParagraphStyle(
        'CoverSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=14,
        leading=18,
        textColor=colors.HexColor("#0284C7"),
        spaceAfter=20
    )

    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=17,
        leading=21,
        textColor=colors.HexColor("#0F172A"),
        spaceAfter=4,
        keepWithNext=True
    )

    h1_sub = ParagraphStyle(
        'Heading1_Sub',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=13,
        textColor=colors.HexColor("#64748B"),
        spaceAfter=8,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#334155"),
        spaceAfter=6
    )

    body_bold = ParagraphStyle(
        'Body_Bold_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#0F172A"),
        spaceAfter=6
    )

    story = []

    # ---------------------------------------------------------
    # PAGE 1: COVER & EXECUTIVE SYNTHESIS
    # ---------------------------------------------------------
    story.append(Spacer(1, 30))
    story.append(Paragraph("Enterprise Architecture: 2005 to 2026", title_style))
    story.append(Paragraph("Two Decades of Socio-Technical Evolution: From Static Metamodel Repositories to Living Digital Twins", subtitle_style))

    summary_text = (
        "<b>Executive Scientific Overview:</b> In 2005, foundational enterprise architecture research established "
        "that socio-technical systems require multi-level metamodeling to align fast-moving strategic plans (&lt;1 year) "
        "with slower organizational redesigns (1-2 years) and long-lived operational information systems (10-20 years). "
        "The core thesis was clear: <i>drawing tools are insufficient; formal repositories enforcing cross-layer referential "
        "integrity are essential to guide redesign and evaluate impact.</i><br/><br/>"
        "By 2026, the core thesis has proven remarkably durable and prescient. What transformed entirely is the "
        "<b>operating substrate and velocity</b>: moving from monolithic 3-tier architectures, on-premises servers, and periodic audits "
        "to composable microservices, distributed event streams, domain data mesh, cloud-native container runtimes, "
        "and continuous closed-loop telemetry. Architecture has evolved from an episodic modeling exercise into a "
        "real-time, continuous socio-technical capability."
    )
    
    summary_table = Table([[Paragraph(summary_text, body_style)]], colWidths=[684])
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F8FAFC")),
        ('BOX', (0,0), (-1,-1), 1.5, colors.HexColor("#0284C7")),
        ('LEFTPADDING', (0,0), (-1,-1), 18),
        ('RIGHTPADDING', (0,0), (-1,-1), 18),
        ('TOPPADDING', (0,0), (-1,-1), 14),
        ('BOTTOMPADDING', (0,0), (-1,-1), 14),
    ]))
    story.append(summary_table)
    story.append(Spacer(1, 16))

    meta_text = (
        "<b>Document Specification:</b> Factual Scientific Synthesis & Visual Field Guide.<br/>"
        "<b>Scope:</b> Public domain enterprise architecture frameworks, metamodeling theory, distributed computing paradigms, "
        "and standards (TOGAF 10, ArchiMate 3.2, NIST SP 800-145, NIST SP 800-207, NIST AI RMF 1.0, OpenTelemetry).<br/>"
        "<b>Attribution Policy:</b> Strictly objective, scientific, and concept-focused. Contains zero individual or institutional citations."
    )
    story.append(Paragraph(meta_text, body_style))
    story.append(PageBreak())

    # ---------------------------------------------------------
    # PAGE 2: THE 2005 FOUNDATIONAL MESSAGES
    # ---------------------------------------------------------
    story.append(Paragraph("1. The Foundational Author Messages (2005 Baseline)", h1_style))
    story.append(Paragraph(
        "The 2005 paper articulated several core principles of socio-technical system design that remain permanent truths of the discipline:",
        h1_sub
    ))

    p2_col1 = (
        "<b>1. Multi-Layer Abstraction is Indispensable:</b><br/>"
        "An enterprise is an aggregate socio-technical system. It cannot be governed through a single monolithic view. "
        "A rigorous framework must differentiate between distinct layers of design: Strategy, Organization, Application, "
        "and Software/Technology. Each layer addresses distinct stakeholder concerns while preserving mutual consistency.<br/><br/>"
        "<b>2. Why Drawing Tools Fail:</b><br/>"
        "The author warned that using informal graphical software (e.g. Visio or presentation tools) to document architecture "
        "is an anti-pattern. Drawing tools lack referential integrity, automated consistency checks, reusable components, "
        "and impact querying. Serious enterprise management requires formal repositories based on explicit metamodels.<br/><br/>"
        "<b>3. The Alignment Discrepancy:</b><br/>"
        "Strategic plans demand rapid execution (&lt;1 year); organizational restructuring requires 1-2 years; yet underlying "
        "core transaction systems often date back decades. Enterprise architecture must bridge these divergent lifecycles."
    )

    p2_col2 = (
        "<b>4. Active Redesign vs. Passive Documentation:</b><br/>"
        "Architecture should not be a passive filing cabinet. In an active role, enterprise models guide continuous organizational "
        "redesign, evaluate proposed modifications, calculate blast radiuses, and cascade requirements down to engineering platforms.<br/><br/>"
        "<b>5. Cross-Layer Referential Integrity:</b><br/>"
        "True architectural value lies in the explicit relationships between layers: connecting organizational units to roles in value networks, "
        "binding customer processes to internal business workflows, linking information objects to database models, and assigning applications "
        "to business functions.<br/><br/>"
        "<b>6. Managing Networked Structures:</b><br/>"
        "Already in 2005, business models were transcending single enterprises into distributed value networks and service partnerships, "
        "requiring multi-enterprise process and interface coordination."
    )

    p2_table = Table([[Paragraph(p2_col1, body_style), Paragraph(p2_col2, body_style)]], colWidths=[332, 332])
    p2_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F1F5F9")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#CBD5E1")),
        ('LEFTPADDING', (0,0), (-1,-1), 14),
        ('RIGHTPADDING', (0,0), (-1,-1), 14),
        ('TOPPADDING', (0,0), (-1,-1), 12),
        ('BOTTOMPADDING', (0,0), (-1,-1), 12),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(p2_table)
    story.append(Spacer(1, 10))

    if os.path.exists(os.path.join(output_dir, "Designer (1).png")):
        img_table = Table([[RLImage(os.path.join(output_dir, "Designer (1).png"), width=480, height=200)]], colWidths=[684])
        img_table.setStyle(TableStyle([('ALIGN', (0,0), (-1,-1), 'CENTER')]))
        story.append(img_table)

    story.append(PageBreak())

    # ---------------------------------------------------------
    # PAGE 3: THE 2005 FOUR LAYERS & TRACEABILITY
    # ---------------------------------------------------------
    story.append(Paragraph("2. Foundational Four-Layer Metamodel Structure", h1_style))
    story.append(Paragraph(
        "Systematic decomposition of socio-technical complexity into four interconnected design layers:",
        h1_sub
    ))

    layers_summary = [
        [Paragraph("<b>Layer</b>", body_bold), Paragraph("<b>Design Objective</b>", body_bold), Paragraph("<b>Key Metamodel Constructs</b>", body_bold)],
        [Paragraph("<b>1. Strategy Layer</b>", body_style),
         Paragraph("Positioning within the value network, customer process stages, and strategic goals.", body_style),
         Paragraph("Value Network, Customer Process, Service Spec, Strategic Goal, Critical Success Factor (CSF), Balanced Scorecard Indicator.", body_style)],
        [Paragraph("<b>2. Organization Layer</b>", body_style),
         Paragraph("Efficiency and effectiveness of service production, delivery, and governance.", body_style),
         Paragraph("Business Process Map, Process Control Flow (eEPC), Organizational Unit, Position, Role, Process Goal, Report.", body_style)],
        [Paragraph("<b>3. Application Layer</b>", body_style),
         Paragraph("Clustering support functionalities, managing information flows, and data integration.", body_style),
         Paragraph("Business Function, Information Object, Application Landscape, Integration Range, Data/Control Flow, Lifecycle Status.", body_style)],
        [Paragraph("<b>4. Technology / Software Layer</b>", body_style),
         Paragraph("Design for reuse and design by reuse of software artifacts and technical assets.", body_style),
         Paragraph("Software Component, Reusable Data Structure, Application Interface, Physical IT Platform.", body_style)],
    ]
    layer_tbl = Table(layers_summary, colWidths=[120, 240, 324])
    layer_tbl.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0284C7")),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.HexColor("#FFFFFF"), colors.HexColor("#F8FAFC")]),
    ]))
    story.append(layer_tbl)
    story.append(Spacer(1, 10))

    if os.path.exists(os.path.join(output_dir, "Designer (3).png")):
        img_table = Table([[RLImage(os.path.join(output_dir, "Designer (3).png"), width=480, height=200)]], colWidths=[684])
        img_table.setStyle(TableStyle([('ALIGN', (0,0), (-1,-1), 'CENTER')]))
        story.append(img_table)

    story.append(PageBreak())

    # Helper function for full-page diagram slides
    def add_diagram_page(title, subtitle, image_filename):
        story.append(Paragraph(title, h1_style))
        story.append(Paragraph(subtitle, h1_sub))
        img_path = os.path.join(output_dir, image_filename)
        if os.path.exists(img_path):
            # Target image size: width=620 pt, height=385 pt fits cleanly on the page with headers
            img_tbl = Table([[RLImage(img_path, width=620, height=385)]], colWidths=[684])
            img_tbl.setStyle(TableStyle([
                ('ALIGN', (0,0), (-1,-1), 'CENTER'),
                ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
                ('TOPPADDING', (0,0), (-1,-1), 0),
                ('BOTTOMPADDING', (0,0), (-1,-1), 0)
            ]))
            story.append(img_tbl)
        story.append(PageBreak())

    # ---------------------------------------------------------
    # PAGE 4: VISUAL FIGURE: 2005 vs 2026 EVOLUTION
    # ---------------------------------------------------------
    add_diagram_page(
        "3. Visual Comparative Analysis: 2005 Baseline vs. 2026 Ecosystem",
        "Contrasting the monolithic repository paradigm of 2005 with the dynamic, living composable ecosystem of 2026:",
        "EA_Evolution_2005_to_2026.png"
    )

    # ---------------------------------------------------------
    # PAGE 5: THE 2026 MODERN METAMODEL ARCHITECTURE
    # ---------------------------------------------------------
    add_diagram_page(
        "4. The 2026 Modern Enterprise Architecture Metamodel",
        "Expanded multi-layer metamodel incorporating cloud-native runtime, streaming fabrics, and real-time observability:",
        "Modern_Metamodel_Architecture_2026.png"
    )

    # ---------------------------------------------------------
    # PAGE 6: CLOSED-LOOP END-TO-END TRACEABILITY
    # ---------------------------------------------------------
    add_diagram_page(
        "5. Closed-Loop Traceability & Continuous Impact Analysis",
        "Transitioning from unidirectional top-down cascading to bidirectional, telemetry-validated closed-loop feedback:",
        "Continuous_Traceability_Closed_Loop_2026.png"
    )

    # ---------------------------------------------------------
    # PAGE 7: SOCIO-TECHNICAL TRANSFORMATION MATRIX
    # ---------------------------------------------------------
    add_diagram_page(
        "6. Multi-Dimensional Socio-Technical Transformation Matrix",
        "Rigorous dimension-by-dimension scientific evaluation across the seven core architectural domains:",
        "SocioTechnical_Governance_Matrix_2026.png"
    )

    # ---------------------------------------------------------
    # PAGE 8: DETAILED LAYER-BY-LAYER SCIENTIFIC ANALYSIS
    # ---------------------------------------------------------
    story.append(Paragraph("7. Comprehensive Layer-by-Layer Technical Evolution", h1_style))
    story.append(Paragraph("Deep-dive scientific comparison detailing architectural evolution over two decades:", h1_sub))
    
    col_tech1 = (
        "<b>A. Strategy Layer Evolution:</b><br/>"
        "• <i>2005:</i> Strategy was captured via static corporate balanced scorecards, qualitative success factors, and fixed B2B bilateral supply relationships.<br/>"
        "• <i>2026:</i> Strategic intent is expressed via dynamic Objectives & Key Results (OKRs) connected directly to live operational business telemetry. "
        "Value networks have expanded into multi-sided digital platform ecosystems, where business capabilities are monetized and consumed as public APIs.<br/><br/>"
        "<b>B. Organization & Process Layer Evolution:</b><br/>"
        "• <i>2005:</i> Process design relied on manual modeling of extended Event-driven Process Chains (eEPC) and static organizational charts, requiring year-long redesign cycles.<br/>"
        "• <i>2026:</i> Team Topologies (stream-aligned squads, platform teams) have replaced bureaucratic hierarchies. Process flows are discovered automatically from runtime event logs using "
        "<b>Process Mining</b> algorithms, revealing real-world execution paths, bottlenecks, and compliance deviations instantaneously.<br/><br/>"
        "<b>C. Application & Software Layer Evolution:</b><br/>"
        "• <i>2005:</i> Dominated by 3-tier monolithic architectures and centralized Enterprise Application Integration (EAI) message brokers. Interoperability required manual synonym/homonym glossaries.<br/>"
        "• <i>2026:</i> Applications are decoupled into independently deployable microservices and serverless functions communicating over event-streaming fabrics (e.g. Apache Kafka). "
        "Terminology reconciliation is automated using enterprise Knowledge Graphs and semantic vector embeddings."
    )

    col_tech2 = (
        "<b>D. Data Architecture Evolution:</b><br/>"
        "• <i>2005:</i> Centralized enterprise data warehouses (EDW) and relational databases created massive operational bottlenecks.<br/>"
        "• <i>2026:</i> <b>Data Mesh</b> treats data as a decentralized product owned directly by domain teams. Data contracts, schema registries, and unified Data Fabrics guarantee analytical governance.<br/><br/>"
        "<b>E. Technology & Runtime Layer Evolution:</b><br/>"
        "• <i>2005:</i> Physical servers in on-premises data centers with manual provisioning and static capacity planning.<br/>"
        "• <i>2026:</i> Cloud-native container orchestration (Kubernetes) and serverless execution run across multi-cloud and edge environments. Infrastructure is declared entirely as code (IaC) "
        "and reconciled continuously via GitOps.<br/><br/>"
        "<b>F. Cross-Cutting Governance & Trust Evolution:</b><br/>"
        "• <i>2005:</i> Security was perimeter-centric (firewalls, internal network trust) and compliance was audited semi-annually through manual checklists.<br/>"
        "• <i>2026:</i> <b>Zero Trust Architecture (NIST SP 800-207)</b> enforces mutual TLS and continuous cryptographic verification for every call. "
        "AI capabilities are governed under the <b>NIST AI Risk Management Framework (AI RMF 1.0)</b>, tracking algorithmic safety, training lineage, and human oversight."
    )

    p8_table = Table([[Paragraph(col_tech1, body_style), Paragraph(col_tech2, body_style)]], colWidths=[332, 332])
    p8_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#FFFFFF")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#CBD5E1")),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
        ('TOPPADDING', (0,0), (-1,-1), 10),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(p8_table)
    story.append(PageBreak())

    # ---------------------------------------------------------
    # PAGE 9: THE LIVING DIGITAL TWIN & EVIDENCE STANDARDS
    # ---------------------------------------------------------
    story.append(Paragraph("8. The Living Enterprise Digital Twin & Public Standards", h1_style))
    story.append(Paragraph("Modern architecture practices replace static documentation with continuous evidence-backed governance:", h1_sub))

    p9_col1 = (
        "<b>The Transformation of Architectural Tooling:</b><br/>"
        "The 2005 paper correctly identified that enterprise modeling must be backed by a relational/object repository rather than graphic drawing tools. "
        "In 2026, this concept has evolved into <b>Architecture-as-Code</b> and the <b>Living Enterprise Digital Twin</b>:<br/>"
        "• <b>Declarative Architecture:</b> Architecture definitions are stored in version control (Git) alongside software code, subject to pull requests and peer review.<br/>"
        "• <b>Automated Discovery:</b> Runtime instrumentation (OpenTelemetry, eBPF) auto-populates dependency graphs, discovering service-to-service links and database calls without manual data entry.<br/>"
        "• <b>Real-Time Impact Simulation:</b> Graph query engines instantly calculate the blast radius of deprecating an API or migrating an infrastructure platform.<br/>"
        "• <b>Continuous Compliance (Policy-as-Code):</b> Open Policy Agent (OPA) rules prevent non-compliant deployments in CI/CD pipelines before code reaches production."
    )

    p9_col2 = (
        "<b>Fact-Checked Public Standards & Frameworks:</b><br/>"
        "• <b>TOGAF Standard, 10th Edition (The Open Group):</b> Provides modular guidance for configuring enterprise architecture practices across agile, digital, and zero-trust landscapes.<br/>"
        "• <b>ArchiMate 3.2 (The Open Group):</b> Open, vendor-neutral modeling language with precise semantics linking Strategy, Business, Application, and Technology layers.<br/>"
        "• <b>NIST SP 800-145 (Cloud Computing):</b> Standard definitions of on-demand self-service, broad network access, resource pooling, rapid elasticity, and measured service.<br/>"
        "• <b>NIST SP 800-207 (Zero Trust Architecture):</b> Enterprise security framework treating network perimeters as untrusted; continuous policy evaluation per request.<br/>"
        "• <b>NIST AI RMF 1.0 & Generative AI Profile:</b> Trustworthy AI risk management addressing bias, explainability, safety, security, and human oversight.<br/>"
        "• <b>OpenTelemetry (CNCF):</b> Industry-standard telemetry framework for vendor-neutral collection of distributed traces, metrics, and logs."
    )

    p9_table = Table([[Paragraph(p9_col1, body_style), Paragraph(p9_col2, body_style)]], colWidths=[332, 332])
    p9_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F8FAFC")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#0284C7")),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
        ('TOPPADDING', (0,0), (-1,-1), 10),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(p9_table)
    story.append(Spacer(1, 10))

    conclusion_text = (
        "<b>Final Scientific Takeaway:</b> Architecture is neither a drawing nor a shelf-bound binder; it is a "
        "<b>continuous socio-technical decision-making capability</b>. The 2005 metamodeling foundation was right: "
        "traceability across intent, process, information, and infrastructure is mandatory. Modern technology has simply "
        "given that metamodel real-time sensory organs (telemetry) and autonomous actuators (cloud automation)."
    )
    concl_table = Table([[Paragraph(conclusion_text, body_style)]], colWidths=[684])
    concl_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#EFF6FF")),
        ('BOX', (0,0), (-1,-1), 1.5, colors.HexColor("#2563EB")),
        ('LEFTPADDING', (0,0), (-1,-1), 14),
        ('RIGHTPADDING', (0,0), (-1,-1), 14),
        ('TOPPADDING', (0,0), (-1,-1), 10),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(concl_table)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Built comprehensive PDF: {pdf_path}")

build_pdf()
