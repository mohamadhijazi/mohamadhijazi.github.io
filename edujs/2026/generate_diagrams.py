import os
from PIL import Image, ImageDraw, ImageFont

output_dir = r"C:\ws\github\mohammadhijazi\mohamadhijazi.github.io\edujs\2026"
os.makedirs(output_dir, exist_ok=True)

def get_font(size, bold=False):
    font_path = "C:\\Windows\\Fonts\\segoeuib.ttf" if bold else "C:\\Windows\\Fonts\\segoeui.ttf"
    if not os.path.exists(font_path):
        font_path = "C:\\Windows\\Fonts\\arialbd.ttf" if bold else "C:\\Windows\\Fonts\\arial.ttf"
    try:
        return ImageFont.truetype(font_path, size)
    except Exception:
        return ImageFont.load_default()

def draw_card(draw, x, y, w, h, bg_color, border_color=None, border_width=1, radius=12):
    draw.rounded_rectangle([x, y, x + w, y + h], radius=radius, fill=bg_color, outline=border_color, width=border_width)

def draw_pill(draw, x, y, text, font, bg_color, text_color, pad_x=14, pad_y=6, radius=12):
    bbox = font.getbbox(text)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    pw = tw + pad_x * 2
    ph = th + pad_y * 2
    draw.rounded_rectangle([x, y, x + pw, y + ph], radius=radius, fill=bg_color)
    draw.text((x + pad_x, y + pad_y - bbox[1]), text, font=font, fill=text_color)
    return pw, ph

# -------------------------------------------------------------
# DIAGRAM 1: EA Evolution 2005 Baseline vs 2026 Digital Ecosystem
# -------------------------------------------------------------
def create_diagram_1():
    W, H = 1800, 1400
    img = Image.new("RGB", (W, H), color="#0B0F19")
    draw = ImageDraw.Draw(img)

    f_title = get_font(38, bold=True)
    f_subtitle = get_font(19, bold=False)
    f_sec_hdr = get_font(24, bold=True)
    f_card_hdr = get_font(19, bold=True)
    f_body = get_font(15, bold=False)
    f_badge = get_font(13, bold=True)
    f_footer_hdr = get_font(16, bold=True)
    f_footer_body = get_font(14, bold=False)

    # Header
    draw.text((80, 45), "ENTERPRISE ARCHITECTURE EVOLUTION: 2005 vs 2026", font=f_title, fill="#FFFFFF")
    draw.text((80, 100), "Comparative Socio-Technical Analysis: From Static Metamodel Repositories to Living Composable Digital Twins", font=f_subtitle, fill="#94A3B8")

    col_w = 790
    col_h = 1060
    c1_x = 80
    c2_x = 930
    start_y = 155

    # 2005 Column Box
    draw_card(draw, c1_x, start_y, col_w, col_h, "#111827", "#1E293B", border_width=2, radius=16)
    draw_pill(draw, c1_x + 30, start_y + 24, "2005 BASELINE ARCHITECTURE", f_badge, "#374151", "#E2E8F0")
    draw.text((c1_x + 30, start_y + 64), "Centralized, Periodic & Repository-Centric", font=f_sec_hdr, fill="#F8FAFC")
    draw.text((c1_x + 30, start_y + 98), "Objective: Business-IT alignment via desktop metamodeling tools and structured relational repositories.", font=f_body, fill="#94A3B8")

    cards_2005 = [
        ("1. Strategy & Market Positioning",
         "Linear Value Chains & Static Partner Networks",
         "• Strategy defined by business units and static partner networks\n• Annual Balanced Scorecard (BSC) & manual KPI updates\n• Disconnect: Fast business cycles (<1 yr) vs legacy IT lifespan (10-20 yrs)",
         "#1E293B", "#38BDF8"),
        ("2. Organization & Business Processes",
         "Hierarchical Units & Static Process Chains (eEPC)",
         "• Functional department silos and top-down management structures\n• Extended Event-driven Process Chains (eEPC) & early BPMN diagrams\n• Manual workflow redesign projects requiring 12-24 months",
         "#1E293B", "#34D399"),
        ("3. Application & Information Assets",
         "Monolithic Core & Relational Data Stores",
         "• Monolithic 3-tier architectures (Client, App Server, Central DB)\n• Point-to-point Enterprise Application Integration (EAI) message brokers\n• Manual terminology harmonization (standardizing synonyms & homonyms)",
         "#1E293B", "#FBBF24"),
        ("4. Infrastructure & Implementation Tooling",
         "On-Premises Dedicated Servers & Desktop Tools",
         "• Physical hardware in corporate data centers; manual provisioning\n• Desktop client-server metamodeling suites with proprietary databases\n• Passive model checks: identifying discrepancies via periodic audits",
         "#1E293B", "#A78BFA")
    ]

    card_y = start_y + 140
    for title, subtitle, desc, bg, accent in cards_2005:
        draw_card(draw, c1_x + 25, card_y, col_w - 50, 208, bg, "#334155", border_width=1, radius=12)
        draw.rectangle([c1_x + 25, card_y, c1_x + 31, card_y + 208], fill=accent)
        draw.text((c1_x + 45, card_y + 16), title, font=f_card_hdr, fill="#FFFFFF")
        draw.text((c1_x + 45, card_y + 44), subtitle, font=f_body, fill=accent)
        draw.text((c1_x + 45, card_y + 76), desc, font=f_body, fill="#CBD5E1", spacing=5)
        card_y += 228

    # 2026 Column Box
    draw_card(draw, c2_x, start_y, col_w, col_h, "#0A1329", "#0284C7", border_width=2, radius=16)
    draw_pill(draw, c2_x + 30, start_y + 24, "2026 MODERN DIGITAL ECOSYSTEM", f_badge, "#0369A1", "#BAE6FD")
    draw.text((c2_x + 30, start_y + 64), "Composable, Continuous & Living Digital Twin", font=f_sec_hdr, fill="#38BDF8")
    draw.text((c2_x + 30, start_y + 98), "Objective: Dynamic telemetry-driven architecture with closed-loop feedback and AI-assisted governance.", font=f_body, fill="#94A3B8")

    cards_2026 = [
        ("1. Strategy & Platform Ecosystems",
         "Multi-Sided Platforms & Composable API Networks",
         "• Digital ecosystems, public/private API marketplaces & co-creation\n• Continuous OKRs driven by automated, real-time business telemetry\n• Dynamic synchronization: Rapid business pivots matched by modular services",
         "#1E293B", "#38BDF8"),
        ("2. Organization & Adaptive Operating Models",
         "Team Topologies & Automated Process Mining",
         "• Autonomous stream-aligned squads and internal platform teams\n• Automated Process Mining directly from operational event logs\n• Continuous workflow optimization & AI-augmented hyperautomation",
         "#1E293B", "#34D399"),
        ("3. Application & Information Assets",
         "Domain Microservices, Event Streams & Data Mesh",
         "• Decoupled microservices, serverless functions, and event-driven backbones\n• Data Mesh: Domain-owned data products replacing monolithic lakes\n• Knowledge Graphs & AI vector embeddings for semantic interoperability",
         "#1E293B", "#FBBF24"),
        ("4. Infrastructure & Architecture Practice",
         "Cloud-Native, OpenTelemetry & Living Digital Twins",
         "• Multi-cloud & edge container orchestration (Kubernetes, IaC, GitOps)\n• Architecture-as-Code with real-time runtime discovery (OpenTelemetry)\n• Closed-loop AI impact analysis: continuous verification of architecture drift",
         "#1E293B", "#A78BFA")
    ]

    card_y = start_y + 140
    for title, subtitle, desc, bg, accent in cards_2026:
        draw_card(draw, c2_x + 25, card_y, col_w - 50, 208, bg, "#0C1B33", border_width=1, radius=12)
        draw.rectangle([c2_x + 25, card_y, c2_x + 31, card_y + 208], fill=accent)
        draw.text((c2_x + 45, card_y + 16), title, font=f_card_hdr, fill="#FFFFFF")
        draw.text((c2_x + 45, card_y + 44), subtitle, font=f_body, fill=accent)
        draw.text((c2_x + 45, card_y + 76), desc, font=f_body, fill="#CBD5E1", spacing=5)
        card_y += 228

    # Footer Insight Bar
    draw_card(draw, 80, 1245, 1640, 115, "#131D31", "#1E293B", border_width=1, radius=12)
    draw.text((110, 1260), "CORE SCIENTIFIC PRINCIPLE VALIDATED (2005 -> 2026):", font=f_footer_hdr, fill="#38BDF8")
    line1 = "The fundamental thesis of the 2005 metamodel—that business intent and technology execution must maintain formal, multi-layered referential integrity—remains proven."
    line2 = "The major transformation lies in the operating context: from manual repository documentation to automated telemetry-driven discovery, continuous delivery, and AI-governed adaptation."
    draw.text((110, 1290), line1, font=f_footer_body, fill="#E2E8F0")
    draw.text((110, 1315), line2, font=f_footer_body, fill="#94A3B8")

    img.save(os.path.join(output_dir, "EA_Evolution_2005_to_2026.png"))
    print("Generated EA_Evolution_2005_to_2026.png")

# -------------------------------------------------------------
# DIAGRAM 2: Modern 2026 Multi-Layer Metamodel Architecture
# -------------------------------------------------------------
def create_diagram_2():
    W, H = 1800, 1400
    img = Image.new("RGB", (W, H), color="#080C14")
    draw = ImageDraw.Draw(img)

    f_title = get_font(38, bold=True)
    f_subtitle = get_font(19, bold=False)
    f_layer_num = get_font(14, bold=True)
    f_layer_hdr = get_font(21, bold=True)
    f_card_hdr = get_font(16, bold=True)
    f_card_body = get_font(13, bold=False)
    f_side_hdr = get_font(20, bold=True)
    f_side_body = get_font(14, bold=False)
    f_arrow = get_font(16, bold=True)

    draw.text((80, 45), "THE 2026 ENTERPRISE ARCHITECTURE METAMODEL", font=f_title, fill="#FFFFFF")
    draw.text((80, 100), "A Comprehensive Socio-Technical Meta-Structure for Modern Composable & Cloud-Native Enterprises", font=f_subtitle, fill="#94A3B8")

    layers_x = 80
    layers_w = 1120
    start_y = 155
    layer_h = 195
    spacing = 38

    modern_layers = [
        ("LAYER 1: STRATEGIC & ECOSYSTEM LAYER",
         "Value Networks, Digital Platforms & Continuous Objectives",
         [("Strategic OKRs & Value Streams", "Outcome metrics & real-time telemetry goals"),
          ("Ecosystem Partner Networks", "API consumers, suppliers & co-creation networks"),
          ("Composable Business Models", "Packaged Business Capabilities (PBCs) & modular services")],
         "#0284C7", "#0C1E38"),
        
        ("LAYER 2: BUSINESS CAPABILITY & OPERATING MODEL",
         "Team Topologies, Value Delivery & Process Mining",
         [("Stream-Aligned Squads", "Cross-functional, outcome-oriented teams"),
          ("Automated Process Mining", "Execution paths extracted from event logs"),
          ("Hyperautomation & AI Agents", "Orchestrated human-AI hybrid task workflows")],
         "#059669", "#082820"),
        
        ("LAYER 3: APPLICATION & INFORMATION ARCHITECTURE",
         "Domain Services, Event Streams & Data Mesh",
         [("Microservices & Serverless APIs", "Domain-driven design, independently deployable"),
          ("Event Streaming Fabric", "Apache Kafka, real-time pub/sub asynchronous events"),
          ("Data Mesh & Knowledge Graphs", "Decentralized data products & semantic ontologies")],
         "#D97706", "#2D1D06"),
        
        ("LAYER 4: PLATFORM & CLOUD-NATIVE RUNTIME",
         "Container Orchestration, Edge & Infrastructure-as-Code",
         [("Kubernetes & Serverless Runtimes", "Multi-cloud, auto-scaling, self-healing nodes"),
          ("Infrastructure-as-Code & GitOps", "Declarative configurations & immutable environments"),
          ("Policy-as-Code & Zero Trust", "Dynamic policy enforcement at runtime (OPA / Gatekeeper)")],
         "#7C3AED", "#1C1138"),
        
        ("LAYER 5: CONTINUOUS OBSERVABILITY & CLOSED-LOOP",
         "Enterprise Digital Twin, Telemetry & AI Architecture Governance",
         [("OpenTelemetry Telemetry Backbone", "Correlated distributed traces, metrics, and logs"),
          ("Living Enterprise Digital Twin", "Dynamic graph model updated by runtime signals"),
          ("AI Impact Analysis Copilot", "Proactive drift detection & automated architectural risk analysis")],
         "#DC2626", "#2D0D12")
    ]

    curr_y = start_y
    for i, (layer_title, layer_sub, items, accent, bg) in enumerate(modern_layers):
        draw_card(draw, layers_x, curr_y, layers_w, layer_h, bg, accent, border_width=2, radius=14)
        draw.rectangle([layers_x, curr_y, layers_x + 8, curr_y + layer_h], fill=accent)
        
        # Layer Header
        draw.text((layers_x + 25, curr_y + 14), layer_title, font=f_layer_hdr, fill="#F8FAFC")
        draw.text((layers_x + 25, curr_y + 44), layer_sub, font=f_card_body, fill="#94A3B8")

        # 3 Child Cards inside the layer
        card_w = (layers_w - 70) // 3
        card_x = layers_x + 25
        card_inner_y = curr_y + 75
        for item_title, item_desc in items:
            draw_card(draw, card_x, card_inner_y, card_w, 100, "#111827", "#1F2937", border_width=1, radius=10)
            draw.text((card_x + 14, card_inner_y + 14), item_title, font=f_card_hdr, fill="#FFFFFF")
            draw.text((card_x + 14, card_inner_y + 45), item_desc, font=f_card_body, fill="#94A3B8")
            card_x += card_w + 10

        # Draw connecting vertical arrow between layers
        if i < len(modern_layers) - 1:
            arrow_y = curr_y + layer_h + 4
            arrow_center_x = layers_x + (layers_w // 2)
            draw.line([(arrow_center_x, arrow_y), (arrow_center_x, arrow_y + 24)], fill="#38BDF8", width=3)
            # arrowhead
            draw.polygon([(arrow_center_x - 6, arrow_y + 18), (arrow_center_x + 6, arrow_y + 18), (arrow_center_x, arrow_y + 26)], fill="#38BDF8")
            draw.text((arrow_center_x + 15, arrow_y + 3), "Bidirectional Referential Links & Runtime Telemetry Feedback", font=get_font(11, bold=True), fill="#38BDF8")

        curr_y += layer_h + spacing

    # Right Side Panel: Cross-Cutting Architectural Governance
    side_x = 1240
    side_w = 480
    side_h = 1130
    draw_card(draw, side_x, start_y, side_w, side_h, "#0F172A", "#1E293B", border_width=2, radius=16)

    draw_pill(draw, side_x + 30, start_y + 25, "CROSS-CUTTING PRINCIPLES", get_font(13, bold=True), "#1E293B", "#38BDF8")
    draw.text((side_x + 30, start_y + 68), "Enterprise Governance 2026", font=f_side_hdr, fill="#FFFFFF")
    draw.text((side_x + 30, start_y + 102), "Ubiquitous dimensions spanning all layers:", font=f_side_body, fill="#94A3B8")

    side_topics = [
        ("Zero Trust Architecture (ZTA)",
         "Formal compliance with NIST SP 800-207. Identity is the primary perimeter. Every transaction, microservice call, and data access is continuously authenticated and authorized.",
         "#38BDF8"),
        ("Trustworthy AI Lifecycle (NIST AI RMF)",
         "Enterprise-wide governance for generative and predictive AI. Tracks data lineage, algorithmic risk, model explainability, bias controls, and human-in-the-loop oversight.",
         "#34D399"),
        ("Continuous Architecture-as-Code",
         "Architectural definitions expressed as declarative code, version-controlled in Git repositories, and integrated directly into continuous integration / continuous deployment (CI/CD) pipelines.",
         "#FBBF24"),
        ("Living Enterprise Digital Twin",
         "Replacing static Visio drawings and periodic repository updates with a live, querying graph that reflects production infrastructure, running services, and live customer journeys.",
         "#A78BFA"),
        ("Proactive Impact & Drift Analysis",
         "Automated detection of divergence between planned architecture and production reality. Immediate blast-radius analysis for software and business modifications.",
         "#F87171")
    ]

    panel_y = start_y + 145
    for stitle, sdesc, scolor in side_topics:
        draw_card(draw, side_x + 25, panel_y, side_w - 50, 175, "#1E293B", "#334155", border_width=1, radius=12)
        draw.rectangle([side_x + 25, panel_y, side_x + 31, panel_y + 175], fill=scolor)
        draw.text((side_x + 45, panel_y + 16), stitle, font=f_card_hdr, fill=scolor)
        # text wrap manually for description
        words = sdesc.split()
        lines = []
        cur_line = []
        for w in words:
            cur_line.append(w)
            bbox = f_side_body.getbbox(" ".join(cur_line))
            if bbox[2] - bbox[0] > (side_w - 95):
                cur_line.pop()
                lines.append(" ".join(cur_line))
                cur_line = [w]
        if cur_line:
            lines.append(" ".join(cur_line))
        
        line_offset = panel_y + 50
        for l in lines:
            draw.text((side_x + 45, line_offset), l, font=f_side_body, fill="#CBD5E1")
            line_offset += 23
        
        panel_y += 195

    # Footer
    draw_card(draw, 80, 1315, 1640, 55, "#111827", "#1E293B", border_width=1, radius=10)
    draw.text((105, 1332), "STANDARDS COMPLIANCE: Mapped to TOGAF 10, ArchiMate 3.2, NIST SP 800-145 (Cloud), NIST CSF 2.0, NIST AI RMF 1.0, and OpenTelemetry.", font=get_font(13, bold=True), fill="#38BDF8")

    img.save(os.path.join(output_dir, "Modern_Metamodel_Architecture_2026.png"))
    print("Generated Modern_Metamodel_Architecture_2026.png")

# -------------------------------------------------------------
# DIAGRAM 3: Closed-Loop End-to-End Traceability (2026 Model)
# -------------------------------------------------------------
def create_diagram_3():
    W, H = 1800, 1400
    img = Image.new("RGB", (W, H), color="#090D18")
    draw = ImageDraw.Draw(img)

    f_title = get_font(38, bold=True)
    f_subtitle = get_font(19, bold=False)
    f_step_num = get_font(18, bold=True)
    f_step_hdr = get_font(19, bold=True)
    f_body = get_font(14, bold=False)
    f_box_hdr = get_font(16, bold=True)

    draw.text((80, 45), "CLOSED-LOOP END-TO-END TRACEABILITY (2026)", font=f_title, fill="#FFFFFF")
    draw.text((80, 100), "Connecting Strategic Intent to Production Reality: The Continuous Feedback Loop of Modern Enterprise Architecture", font=f_subtitle, fill="#94A3B8")

    # Workflow Steps: Left to Right across two rows or cascading down
    # Let's do a top-down cascading pipeline on left, and closed-loop feedback on right
    pipe_x = 80
    pipe_w = 1050
    step_h = 130
    step_gap = 25
    start_y = 155

    steps = [
        ("STEP 1: Strategic Intent & Real-Time OKRs",
         "Enterprise goals, market positioning, target customer value propositions, and measurable performance indicators.",
         "#0284C7", "Strategy Layer"),
        ("STEP 2: Business Capabilities & Team Topologies",
         "Mapping outcomes to stream-aligned squads and platform capabilities. Automated process mining tracks actual execution.",
         "#059669", "Organization Layer"),
        ("STEP 3: Composable Domain Services & Event Streams",
         "Packaged business capabilities exposed as APIs, event contracts (Kafka/EventHub), and domain-oriented data products.",
         "#D97706", "Application Layer"),
        ("STEP 4: Cloud-Native Runtime & Infrastructure-as-Code",
         "Containerized microservices orchestrated via Kubernetes, declarative GitOps configurations, and Zero Trust policies.",
         "#7C3AED", "Platform Layer"),
        ("STEP 5: Runtime Telemetry (Traces, Metrics, Logs)",
         "Continuous streaming signals via OpenTelemetry capturing latency, throughput, error budgets, and user journey events.",
         "#0EA5E9", "Observability Layer"),
        ("STEP 6: AI-Assisted Drift & Blast Radius Analysis",
         "Automated comparison of operational reality against architectural metamodel to identify architectural drift and risks.",
         "#DC2626", "Closed-Loop Governance"),
        ("STEP 7: Continuous Strategic Realignment",
         "Telemetry insights feed directly back into strategic investment, capability prioritization, and technical debt retirement.",
         "#10B981", "Feedback Loop Complete")
    ]

    curr_y = start_y
    for i, (title, desc, accent, layer_tag) in enumerate(steps):
        draw_card(draw, pipe_x, curr_y, pipe_w, step_h, "#111827", accent, border_width=2, radius=12)
        draw.rectangle([pipe_x, curr_y, pipe_x + 8, curr_y + step_h], fill=accent)
        
        # Step number circle
        draw.ellipse([pipe_x + 25, curr_y + 20, pipe_x + 65, curr_y + 60], fill=accent)
        draw.text((pipe_x + 40, curr_y + 28), str(i + 1), font=f_step_num, fill="#FFFFFF")

        # Texts
        draw.text((pipe_x + 85, curr_y + 20), title, font=f_step_hdr, fill="#FFFFFF")
        draw_pill(draw, pipe_x + pipe_w - 180, curr_y + 18, layer_tag, get_font(11, bold=True), "#1F2937", accent, pad_x=10, pad_y=4)
        draw.text((pipe_x + 85, curr_y + 60), desc, font=f_body, fill="#CBD5E1")

        # Down arrow
        if i < len(steps) - 1:
            draw.line([(pipe_x + 45, curr_y + step_h), (pipe_x + 45, curr_y + step_h + step_gap)], fill="#38BDF8", width=3)
            draw.polygon([(pipe_x + 40, curr_y + step_h + step_gap - 6), (pipe_x + 50, curr_y + step_h + step_gap - 6), (pipe_x + 45, curr_y + step_h + step_gap)], fill="#38BDF8")

        curr_y += step_h + step_gap

    # Right side: The Feedback Loop Insights & Why Traceability Matters
    side_x = 1170
    side_w = 550
    draw_card(draw, side_x, start_y, side_w, 1060, "#0F172A", "#1E293B", border_width=2, radius=16)

    draw_pill(draw, side_x + 30, start_y + 25, "THE SCIENTIFIC DIFFERENCE", get_font(13, bold=True), "#1E293B", "#38BDF8")
    draw.text((side_x + 30, start_y + 68), "2005 vs 2026 Traceability", font=get_font(22, bold=True), fill="#FFFFFF")
    draw.text((side_x + 30, start_y + 102), "Why end-to-end linkages transformed from a static audit document into an active operational nervous system:", font=f_body, fill="#94A3B8")

    side_blocks = [
        ("1. Bidirectional Causality",
         "In 2005, traceability was predominantly a top-down cascade (Strategy -> Process -> App -> Component). In 2026, it is a living feedback loop: operational runtime telemetry provides direct evidence of whether strategic hypotheses succeeded or failed.",
         "#38BDF8"),
        ("2. Real-Time Blast Radius Analysis",
         "When a business rule, API contract, or cloud component changes, modern graph-based enterprise models instantly compute the affected services, teams, customer journeys, and compliance obligations.",
         "#34D399"),
        ("3. Continuous Drift Detection",
         "Prevents 'paper architecture' where documentation diverges from production reality. Telemetry agents (OpenTelemetry, eBPF) auto-verify that running services conform to metamodel rules.",
         "#FBBF24"),
        ("4. Automated Compliance & Provenance",
         "Zero Trust identities and AI model inputs/outputs are traceable from regulatory policy down to the exact container instance and training data commit.",
         "#A78BFA"),
        ("5. Fast Strategic Pivoting",
         "By decoupling capabilities into composable domain building blocks, leadership can reallocate strategic priorities within weeks without stranding decades-old legacy assets.",
         "#F43F5E")
    ]

    by = start_y + 150
    for btitle, bdesc, bcolor in side_blocks:
        draw_card(draw, side_x + 25, by, side_w - 50, 165, "#1E293B", "#334155", border_width=1, radius=12)
        draw.rectangle([side_x + 25, by, side_x + 31, by + 165], fill=bcolor)
        draw.text((side_x + 45, by + 16), btitle, font=f_box_hdr, fill=bcolor)
        
        words = bdesc.split()
        lines = []
        cur_line = []
        for w in words:
            cur_line.append(w)
            bbox = f_body.getbbox(" ".join(cur_line))
            if bbox[2] - bbox[0] > (side_w - 95):
                cur_line.pop()
                lines.append(" ".join(cur_line))
                cur_line = [w]
        if cur_line:
            lines.append(" ".join(cur_line))
        
        loffset = by + 48
        for l in lines:
            draw.text((side_x + 45, loffset), l, font=f_body, fill="#CBD5E1")
            loffset += 22
        
        by += 180

    # Bottom summary
    draw_card(draw, 80, 1255, 1640, 100, "#111827", "#1E293B", border_width=1, radius=12)
    draw.text((110, 1272), "THE AUTHOR'S PROPHECY REALIZED:", font=get_font(16, bold=True), fill="#38BDF8")
    draw.text((110, 1302), "The 2005 paper advocated that architecture must become an 'active concept' rather than a passive drawing tool. In 2026, closed-loop telemetry and living digital twins have fully realized this vision.", font=f_body, fill="#E2E8F0")

    img.save(os.path.join(output_dir, "Continuous_Traceability_Closed_Loop_2026.png"))
    print("Generated Continuous_Traceability_Closed_Loop_2026.png")

# -------------------------------------------------------------
# DIAGRAM 4: Socio-Technical Architecture Transformation Matrix
# -------------------------------------------------------------
def create_diagram_4():
    W, H = 1800, 1400
    img = Image.new("RGB", (W, H), color="#080C14")
    draw = ImageDraw.Draw(img)

    f_title = get_font(38, bold=True)
    f_subtitle = get_font(19, bold=False)
    f_col_hdr = get_font(20, bold=True)
    f_row_hdr = get_font(17, bold=True)
    f_cell = get_font(14, bold=False)
    f_tag = get_font(12, bold=True)

    draw.text((80, 45), "SOCIO-TECHNICAL TRANSFORMATION MATRIX (2005 vs 2026)", font=f_title, fill="#FFFFFF")
    draw.text((80, 100), "Multi-Dimensional Scientific Comparison Across Enterprise Architectural Domains", font=f_subtitle, fill="#94A3B8")

    start_x = 80
    start_y = 155
    total_w = 1640
    col1_w = 340
    col2_w = 640
    col3_w = 660
    header_h = 60

    # Header Row
    draw_card(draw, start_x, start_y, col1_w, header_h, "#1E293B", "#334155", radius=8)
    draw.text((start_x + 20, start_y + 18), "ARCHITECTURAL DIMENSION", font=f_col_hdr, fill="#38BDF8")

    draw_card(draw, start_x + col1_w + 10, start_y, col2_w, header_h, "#111827", "#334155", radius=8)
    draw.text((start_x + col1_w + 30, start_y + 18), "2005 BASELINE ERA (REPOSITORY-CENTRIC)", font=f_col_hdr, fill="#E2E8F0")

    draw_card(draw, start_x + col1_w + col2_w + 20, start_y, col3_w, header_h, "#0A1329", "#0284C7", radius=8)
    draw.text((start_x + col1_w + col2_w + 40, start_y + 18), "2026 CONTEMPORARY ERA (DIGITAL ECOSYSTEM)", font=f_col_hdr, fill="#38BDF8")

    matrix_rows = [
        ("Strategic Alignment",
         "Annual Balanced Scorecards (BSC), fixed supplier-buyer networks, manual KPI gathering. Disconnected time horizons (<1 yr strategy vs 15 yr IT).",
         "Continuous real-time OKRs, multi-sided API ecosystems, automated strategic telemetry. Dynamic synchronization via composable capabilities.",
         "#38BDF8"),
        ("Organizational Design",
         "Functional silos, hierarchical command-and-control, manual extended Event-driven Process Chains (eEPC), 1-2 year reorganization lifecycles.",
         "Cross-functional Team Topologies (stream-aligned squads, platform teams), automated Process Mining directly from event logs, hyperautomation.",
         "#34D399"),
        ("Application Landscape",
         "Monolithic applications, 3-tier client/server, point-to-point Enterprise Application Integration (EAI) message brokers, batch synchronization.",
         "Decoupled microservices, serverless functions, event streaming backbones (Apache Kafka), API-first composable architectures.",
         "#FBBF24"),
        ("Data Architecture",
         "Centralized relational DBMS, centralized Enterprise Data Warehouses (EDW), manual glossary harmonization for synonyms/homonyms.",
         "Domain Data Mesh (data products with decentral ownership), Data Fabric, knowledge graphs, AI vector embeddings for semantic reconciliation.",
         "#A78BFA"),
        ("Infrastructure & Runtime",
         "On-premises data centers, physical bare-metal servers, manual OS installation, static network configurations, fixed capacity planning.",
         "Multi-cloud & edge container orchestration (Kubernetes), Infrastructure-as-Code (IaC), GitOps, auto-scaling, ephemeral runtimes.",
         "#F43F5E"),
        ("Security & Governance",
         "Perimeter firewalls, trusted internal networks, periodic compliance audits, manual Change Advisory Boards (CAB), reactive patch cycles.",
         "Zero Trust Architecture (NIST SP 800-207), Policy-as-Code (OPA), automated continuous compliance, Trustworthy AI governance (NIST AI RMF).",
         "#FB923C"),
        ("Architecture Tooling",
         "Desktop client-server modeling suites (ADONIS/ARIS), manual model entry, static report generation, isolated repository databases.",
         "Architecture-as-Code, living Enterprise Digital Twins, automated runtime discovery (OpenTelemetry/eBPF), AI-assisted impact simulation.",
         "#38BDF8")
    ]

    row_y = start_y + header_h + 12
    row_h = 135
    for dim_title, base_desc, cont_desc, accent in matrix_rows:
        # Col 1: Dimension
        draw_card(draw, start_x, row_y, col1_w, row_h, "#1E293B", "#334155", radius=10)
        draw.rectangle([start_x, row_y, start_x + 6, row_y + row_h], fill=accent)
        draw.text((start_x + 20, row_y + 48), dim_title, font=f_row_hdr, fill="#FFFFFF")

        # Helper to wrap text
        def draw_wrapped_text(text, x, y, max_w, font, color, line_h=22):
            words = text.split()
            lines = []
            cur_line = []
            for w in words:
                cur_line.append(w)
                bbox = font.getbbox(" ".join(cur_line))
                if bbox[2] - bbox[0] > max_w:
                    cur_line.pop()
                    lines.append(" ".join(cur_line))
                    cur_line = [w]
            if cur_line:
                lines.append(" ".join(cur_line))
            cur_y = y
            for l in lines:
                draw.text((x, cur_y), l, font=font, fill=color)
                cur_y += line_h

        # Col 2: 2005 Baseline
        draw_card(draw, start_x + col1_w + 10, row_y, col2_w, row_h, "#111827", "#1F2937", radius=10)
        draw_wrapped_text(base_desc, start_x + col1_w + 30, row_y + 24, col2_w - 50, f_cell, "#94A3B8")

        # Col 3: 2026 Contemporary
        draw_card(draw, start_x + col1_w + col2_w + 20, row_y, col3_w, row_h, "#0A1329", "#0284C7", radius=10)
        draw_wrapped_text(cont_desc, start_x + col1_w + col2_w + 40, row_y + 24, col3_w - 60, f_cell, "#E2E8F0")

        row_y += row_h + 10

    # Bottom conclusion note
    draw_card(draw, 80, 1265, 1640, 95, "#131D31", "#1E293B", radius=10)
    draw.text((110, 1282), "CONCLUSION:", font=get_font(16, bold=True), fill="#38BDF8")
    draw.text((110, 1312), "Enterprise Architecture evolved from an episodic, documentation-heavy discipline into a real-time socio-technical operating capability that guarantees alignment, resilience, and agility at digital scale.", font=f_cell, fill="#CBD5E1")

    img.save(os.path.join(output_dir, "SocioTechnical_Governance_Matrix_2026.png"))
    print("Generated SocioTechnical_Governance_Matrix_2026.png")

create_diagram_1()
create_diagram_2()
create_diagram_3()
create_diagram_4()
