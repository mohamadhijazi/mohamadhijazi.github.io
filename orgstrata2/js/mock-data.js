/* ==========================================================================
   DIGITAL TWIN UNIVERSAL WORKSPACE — PRE-POPULATED MOCK DATASETS v2.2.0
   Implements: WorkspaceConfig, PageConfig, ComponentConfig schemas
   Author: Mohammad Hijazi
   ========================================================================== */

const MOCK_DATASETS = {

  // ─── 1. PERSONAL TWIN: FAMILY OF 4 ───────────────────────────────────────
  "family_of_4": {
    id: "family_of_4",
    name: "Personal Twin: Family of 4",
    type: "personal",
    description: "5-year personal planning, household logistics, family school terms, utilities, flight analytics, and residence 3D twin.",
    activePageId: "fam_pg_1",
    pages: [
      {
        id: "fam_pg_1",
        title: "Executive Overview",
        icon: "fa-solid fa-chart-pie",
        layoutType: "grid-flexible",
        components: [
          {
            id: "fam_chart_1",
            type: "highcharts",
            title: "Utility & Travel Expenses",
            subtitle: "Monthly breakdown — 2026",
            columnSpan: "half",
            domainTags: ["Operations", "Finance"],
            settings: { chartType: "line", theme: "dark" },
            data: {
              categories: ["Jan","Feb","Mar","Apr","May","Jun"],
              series: [
                { name: "Utilities ($)", data: [340, 390, 410, 380, 450, 420] },
                { name: "Travel ($)", data: [200, 500, 150, 800, 100, 1200] }
              ]
            }
          },
          {
            id: "fam_calendar_1",
            type: "calendar",
            title: "Family 5-Year Horizon",
            subtitle: "Events, school terms & travel",
            columnSpan: "half",
            domainTags: ["UX", "Logistics"],
            settings: { defaultView: "dayGridMonth" },
            data: {
              events: [
                { id:"c1", title:"Summer Trip - Tokyo", start:"2026-07-10", end:"2026-07-25", color:"#00f2fe" },
                { id:"c2", title:"University Tuition Due", start:"2026-09-01", color:"#ff9100" },
                { id:"c3", title:"Passport Renewal Deadline", start:"2026-11-15", color:"#ff1744" },
                { id:"c4", title:"Residence Insurance Review", start:"2027-01-20", color:"#7f00ff" },
                { id:"c5", title:"Child 2 School Term Start", start:"2026-08-25", color:"#00e676" }
              ]
            }
          },
          {
            id: "fam_map_1",
            type: "map",
            title: "Family Geo Locations",
            subtitle: "Home, school, work — Riyadh",
            columnSpan: "half",
            domainTags: ["Logistics"],
            settings: { centerLat: 24.7136, centerLng: 46.6753, zoom: 13 },
            data: {
              markers: [
                { name:"Family Primary Residence", lat:24.7136, lng:46.6753, type:"Home", status:"Active", color:"#00f2fe" },
                { name:"Child 2 Elementary Campus", lat:24.720, lng:46.680, type:"School", status:"Active", color:"#00e676" },
                { name:"Child 1 University", lat:24.735, lng:46.660, type:"University", status:"Active", color:"#ff9100" },
                { name:"Executive Office", lat:24.750, lng:46.700, type:"Work", status:"Active", color:"#7f00ff" }
              ]
            }
          },
          {
            id: "fam_table_1",
            type: "jqtable",
            title: "Bills & Subscriptions Tracker",
            subtitle: "Live payment status",
            columnSpan: "half",
            domainTags: ["Finance"],
            settings: { pageLength: 10, searchable: true },
            data: {
              columns: ["Item","Provider","Amount","Due Date","Status"],
              rows: [
                ["Electric & Solar Utility","SEC Grid","$380/mo","Every 28th","Paid"],
                ["Home Fiber Internet 1Gbps","STC Telecom","$110/mo","Every 1st","Paid"],
                ["Mohammad Passport Renewal","Gov Portal","$150","2026-11-15","Pending"],
                ["Family Health Insurance","Bupa Global","$4,200/yr","2027-01-10","Active"],
                ["Streaming Subscriptions","Netflix / Spotify","$35/mo","Every 5th","Active"]
              ]
            }
          }
        ]
      },
      {
        id: "fam_pg_2",
        title: "BPMN Travel Flow",
        icon: "fa-solid fa-diagram-project",
        layoutType: "single-canvas",
        components: [
          {
            id: "fam_bpmn_1",
            type: "bpmn",
            title: "International Travel Preparation Flow",
            subtitle: "Visa → Flight → Hotel → Packing",
            columnSpan: "full",
            domainTags: ["BPMN", "Logistics"],
            settings: {},
            data: {
              bpmnXml: `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
  xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
  id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="Process_1" isExecutable="false">
    <bpmn:startEvent id="Start_1" name="Plan Vacation"><bpmn:outgoing>Flow_1</bpmn:outgoing></bpmn:startEvent>
    <bpmn:task id="Task_Visa" name="Check Passport &amp; Visa Expiry"><bpmn:incoming>Flow_1</bpmn:incoming><bpmn:outgoing>Flow_2</bpmn:outgoing></bpmn:task>
    <bpmn:task id="Task_Flight" name="Book Flights &amp; Insurance"><bpmn:incoming>Flow_2</bpmn:incoming><bpmn:outgoing>Flow_3</bpmn:outgoing></bpmn:task>
    <bpmn:task id="Task_Hotel" name="Reserve Accommodation"><bpmn:incoming>Flow_3</bpmn:incoming><bpmn:outgoing>Flow_4</bpmn:outgoing></bpmn:task>
    <bpmn:task id="Task_Pack" name="Packing &amp; Health Check"><bpmn:incoming>Flow_4</bpmn:incoming><bpmn:outgoing>Flow_5</bpmn:outgoing></bpmn:task>
    <bpmn:endEvent id="End_1" name="Depart!"><bpmn:incoming>Flow_5</bpmn:incoming></bpmn:endEvent>
    <bpmn:sequenceFlow id="Flow_1" sourceRef="Start_1" targetRef="Task_Visa"/>
    <bpmn:sequenceFlow id="Flow_2" sourceRef="Task_Visa" targetRef="Task_Flight"/>
    <bpmn:sequenceFlow id="Flow_3" sourceRef="Task_Flight" targetRef="Task_Hotel"/>
    <bpmn:sequenceFlow id="Flow_4" sourceRef="Task_Hotel" targetRef="Task_Pack"/>
    <bpmn:sequenceFlow id="Flow_5" sourceRef="Task_Pack" targetRef="End_1"/>
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNShape id="Start_1_di" bpmnElement="Start_1"><dc:Bounds x="152" y="82" width="36" height="36"/></bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_Visa_di" bpmnElement="Task_Visa"><dc:Bounds x="240" y="60" width="120" height="80"/></bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_Flight_di" bpmnElement="Task_Flight"><dc:Bounds x="420" y="60" width="120" height="80"/></bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_Hotel_di" bpmnElement="Task_Hotel"><dc:Bounds x="600" y="60" width="120" height="80"/></bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_Pack_di" bpmnElement="Task_Pack"><dc:Bounds x="780" y="60" width="120" height="80"/></bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="End_1_di" bpmnElement="End_1"><dc:Bounds x="962" y="82" width="36" height="36"/></bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_1_di" bpmnElement="Flow_1"><di:waypoint x="188" y="100"/><di:waypoint x="240" y="100"/></bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_2_di" bpmnElement="Flow_2"><di:waypoint x="360" y="100"/><di:waypoint x="420" y="100"/></bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_3_di" bpmnElement="Flow_3"><di:waypoint x="540" y="100"/><di:waypoint x="600" y="100"/></bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_4_di" bpmnElement="Flow_4"><di:waypoint x="720" y="100"/><di:waypoint x="780" y="100"/></bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_5_di" bpmnElement="Flow_5"><di:waypoint x="900" y="100"/><di:waypoint x="962" y="100"/></bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`
            }
          }
        ]
      },
      {
        id: "fam_pg_3",
        title: "Risk & Maturity",
        icon: "fa-solid fa-triangle-exclamation",
        layoutType: "grid-flexible",
        components: [
          {
            id: "fam_risk_1",
            type: "risk",
            title: "Family Risk Scoring Matrix",
            subtitle: "Probability × Impact assessment",
            columnSpan: "half",
            domainTags: ["Risk"],
            settings: {},
            data: {
              risks: [
                { name:"Passport Expiry", probability:4, impact:5, owner:"Mohammad", status:"Open" },
                { name:"Health Emergency", probability:2, impact:5, owner:"Spouse", status:"Mitigated" },
                { name:"University Fee Increase", probability:3, impact:4, owner:"Mohammad", status:"Open" },
                { name:"Travel Flight Cancellation", probability:3, impact:3, owner:"Mohammad", status:"Open" },
                { name:"Home Insurance Gap", probability:2, impact:4, owner:"Mohammad", status:"Closed" }
              ]
            }
          },
          {
            id: "fam_maturity_1",
            type: "maturity",
            title: "Family Digital Maturity Assessment",
            subtitle: "5-point Likert scale — 2026",
            columnSpan: "half",
            domainTags: ["Strategy"],
            settings: {},
            data: {
              dimensions: [
                { name:"Financial Planning", score:4 },
                { name:"Digital Security", score:3 },
                { name:"Health Management", score:4 },
                { name:"Education Tracking", score:5 },
                { name:"Travel Planning", score:3 }
              ]
            }
          }
        ]
      }
    ]
  },

  // ─── 2. CORPORATE TWIN: COMPANY OF 200 ───────────────────────────────────
  "company_of_200": {
    id: "company_of_200",
    name: "Enterprise Twin: Company of 200",
    type: "enterprise",
    description: "200-employee global enterprise digital twin. Org structure, value chain BPMN, Oracle/SAP license tracking, branch maps, and 3D floor plans.",
    activePageId: "corp_pg_1",
    paymentSmsRecords: [
      {
        sender: 'STC',
        body: 'Your payment of SAR 399.00 to STC Telecom was successful. Ref: 234861.',
        receivedAt: '2026-08-05T19:40:00Z',
        merchant: 'STC Telecom',
        amount: 399,
        currency: 'SAR',
        paymentType: 'bank',
        status: 'matched',
        notes: 'Telecom service renewal'
      },
      {
        sender: 'AWS',
        body: 'Your card ending 4242 was charged USD 1,280.20 for Amazon Web Services.',
        receivedAt: '2026-08-04T12:05:00Z',
        merchant: 'Amazon Web Services',
        amount: 1280.2,
        currency: 'USD',
        paymentType: 'card',
        status: 'matched',
        notes: 'Cloud infrastructure'
      },
      {
        sender: 'Oracle',
        body: 'Invoice paid: USD 84,500.00 for Oracle Cloud Infrastructure. Ref: OCI-8142',
        receivedAt: '2026-08-03T09:15:00Z',
        merchant: 'Oracle Cloud Infrastructure',
        amount: 84500,
        currency: 'USD',
        paymentType: 'bank',
        status: 'matched',
        notes: 'IaaS renewal'
      },
      {
        sender: 'NAYAT',
        body: 'Transaction of AED 1,250.00 to NAYAT Home was approved.',
        receivedAt: '2026-08-02T14:10:00Z',
        merchant: 'NAYAT Home',
        amount: 1250,
        currency: 'AED',
        paymentType: 'card',
        status: 'review',
        notes: 'Facilities purchase'
      }
    ],
    pages: [
      {
        id: "corp_pg_1",
        title: "Executive Dashboard",
        icon: "fa-solid fa-gauge-high",
        layoutType: "grid-flexible",
        components: [
          {
            id: "corp_chart_1",
            type: "highcharts",
            title: "Quarterly OPEX vs CAPEX",
            subtitle: "2026 Enterprise Spend Analysis",
            columnSpan: "half",
            domainTags: ["Finance", "Strategy"],
            settings: { chartType: "bar", theme: "dark" },
            data: {
              categories: ["Q1","Q2","Q3","Q4","Q1-2027","Q2-2027"],
              series: [
                { name: "OPEX ($K)", data: [450, 520, 480, 610, 580, 640] },
                { name: "CAPEX ($K)", data: [200, 350, 250, 400, 300, 420] }
              ]
            }
          },
          {
            id: "corp_table_1",
            type: "jqtable",
            title: "Enterprise SaaS License Tracker",
            subtitle: "Oracle, SAP, Nvidia, Microsoft",
            columnSpan: "half",
            domainTags: ["Applications", "SaaS"],
            settings: { pageLength: 10, searchable: true },
            data: {
              columns: ["System","Vendor","Annual Cost","Renewal Date","Status"],
              rows: [
                ["SAP S/4HANA Enterprise","SAP SE","$240,000","2026-10-01","⚠ Renewal Warning"],
                ["Oracle Cloud Infrastructure","Oracle Corp","$180,000","2026-12-15","✅ Active"],
                ["Nvidia DGX AI Compute","Nvidia","$320,000","2027-03-30","✅ Active"],
                ["Microsoft M365 (200 seats)","Microsoft","$54,000","2027-01-01","✅ Active"],
                ["Salesforce CRM Enterprise","Salesforce","$96,000","2026-09-15","✅ Active"]
              ]
            }
          },
          {
            id: "corp_cost_1",
            type: "jqtable",
            title: "Cost Management & Payments Reconciliation",
            subtitle: "Reads payment SMS and reconciles spend to finance ledger",
            columnSpan: "full",
            domainTags: ["Finance", "Operations"],
            settings: { pageLength: 10, searchable: true },
            data: {
              columns: ["Category","Vendor","Description","Amount","Currency","Invoice Date","Payment Channel","Source Reference","Status"],
              rows: [
                ["Software & SaaS","Oracle Cloud Infrastructure","Oracle IaaS renewal","84500.00","USD","2026-08-03","bank","Oracle","Paid"],
                ["Telecom & Connectivity","STC Telecom","Data and telecom service renewal","399.00","SAR","2026-08-05","bank","STC","Paid"],
                ["Facilities & Office","NAYAT Home","Facilities purchase","1250.00","AED","2026-08-02","card","NAYAT","Review"]
              ]
            }
          },
          {
            id: "corp_calendar_1",
            type: "calendar",
            title: "Enterprise Events & Contract Calendar",
            subtitle: "2026–2027 horizon",
            columnSpan: "full",
            domainTags: ["Strategy", "Applications", "webinar", "renewal"],
            settings: { defaultView: "dayGridMonth" },
            data: {
              events: [
                { id:"ce1", title:"SAP License Renewal", start:"2026-10-01", color:"#ff9100", tags:["renewal"] },
                { id:"ce2", title:"Gartner Global Tech Summit", start:"2026-08-20", end:"2026-08-24", color:"#00f2fe", tags:["webinar"] },
                { id:"ce3", title:"OPEC Economic Forum", start:"2026-11-10", color:"#7f00ff", tags:["strategy"] },
                { id:"ce4", title:"Annual Cyber Security Audit", start:"2026-12-05", color:"#ff1744", tags:["security"] },
                { id:"ce5", title:"Q4 Board Review", start:"2026-12-20", color:"#00e676", tags:["strategy"] }
              ]
            }
          }
        ]
      },
      {
        id: "corp_pg_2",
        title: "Value Chain BPMN",
        icon: "fa-solid fa-diagram-project",
        layoutType: "single-canvas",
        components: [
          {
            id: "corp_bpmn_1",
            type: "bpmn",
            title: "Order-To-Cash Enterprise Value Chain",
            subtitle: "SAP → Nvidia AI → Logistics → Revenue",
            columnSpan: "full",
            domainTags: ["BPMN", "Operations"],
            settings: {},
            data: {
              bpmnXml: `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
  xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
  id="Definitions_Corp" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="Process_Corp" isExecutable="false">
    <bpmn:startEvent id="Start_Corp" name="Client Order"><bpmn:outgoing>CF_1</bpmn:outgoing></bpmn:startEvent>
    <bpmn:task id="Task_SAP" name="SAP Inventory Check"><bpmn:incoming>CF_1</bpmn:incoming><bpmn:outgoing>CF_2</bpmn:outgoing></bpmn:task>
    <bpmn:task id="Task_AI" name="AI Production Schedule (Nvidia)"><bpmn:incoming>CF_2</bpmn:incoming><bpmn:outgoing>CF_3</bpmn:outgoing></bpmn:task>
    <bpmn:task id="Task_Mfg" name="Manufacturing Execution"><bpmn:incoming>CF_3</bpmn:incoming><bpmn:outgoing>CF_4</bpmn:outgoing></bpmn:task>
    <bpmn:task id="Task_Logis" name="Logistics &amp; Customs"><bpmn:incoming>CF_4</bpmn:incoming><bpmn:outgoing>CF_5</bpmn:outgoing></bpmn:task>
    <bpmn:task id="Task_Oracle" name="Oracle Revenue Recognition"><bpmn:incoming>CF_5</bpmn:incoming><bpmn:outgoing>CF_6</bpmn:outgoing></bpmn:task>
    <bpmn:endEvent id="End_Corp" name="Revenue Closed"><bpmn:incoming>CF_6</bpmn:incoming></bpmn:endEvent>
    <bpmn:sequenceFlow id="CF_1" sourceRef="Start_Corp" targetRef="Task_SAP"/>
    <bpmn:sequenceFlow id="CF_2" sourceRef="Task_SAP" targetRef="Task_AI"/>
    <bpmn:sequenceFlow id="CF_3" sourceRef="Task_AI" targetRef="Task_Mfg"/>
    <bpmn:sequenceFlow id="CF_4" sourceRef="Task_Mfg" targetRef="Task_Logis"/>
    <bpmn:sequenceFlow id="CF_5" sourceRef="Task_Logis" targetRef="Task_Oracle"/>
    <bpmn:sequenceFlow id="CF_6" sourceRef="Task_Oracle" targetRef="End_Corp"/>
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_Corp">
    <bpmndi:BPMNPlane id="BPMNPlane_Corp" bpmnElement="Process_Corp">
      <bpmndi:BPMNShape id="Start_Corp_di" bpmnElement="Start_Corp"><dc:Bounds x="82" y="82" width="36" height="36"/></bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_SAP_di" bpmnElement="Task_SAP"><dc:Bounds x="170" y="60" width="120" height="80"/></bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_AI_di" bpmnElement="Task_AI"><dc:Bounds x="340" y="60" width="120" height="80"/></bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_Mfg_di" bpmnElement="Task_Mfg"><dc:Bounds x="510" y="60" width="120" height="80"/></bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_Logis_di" bpmnElement="Task_Logis"><dc:Bounds x="680" y="60" width="120" height="80"/></bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_Oracle_di" bpmnElement="Task_Oracle"><dc:Bounds x="850" y="60" width="120" height="80"/></bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="End_Corp_di" bpmnElement="End_Corp"><dc:Bounds x="1032" y="82" width="36" height="36"/></bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="CF_1_di" bpmnElement="CF_1"><di:waypoint x="118" y="100"/><di:waypoint x="170" y="100"/></bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="CF_2_di" bpmnElement="CF_2"><di:waypoint x="290" y="100"/><di:waypoint x="340" y="100"/></bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="CF_3_di" bpmnElement="CF_3"><di:waypoint x="460" y="100"/><di:waypoint x="510" y="100"/></bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="CF_4_di" bpmnElement="CF_4"><di:waypoint x="630" y="100"/><di:waypoint x="680" y="100"/></bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="CF_5_di" bpmnElement="CF_5"><di:waypoint x="800" y="100"/><di:waypoint x="850" y="100"/></bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="CF_6_di" bpmnElement="CF_6"><di:waypoint x="970" y="100"/><di:waypoint x="1032" y="100"/></bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`
            }
          }
        ]
      },
      {
        id: "corp_pg_3",
        title: "Global Geo Map",
        icon: "fa-solid fa-globe",
        layoutType: "grid-flexible",
        components: [
          {
            id: "corp_map_1",
            type: "map",
            title: "Global HQ & Branch Locations",
            subtitle: "Riyadh HQ, Austin, EMEA, Data Center",
            columnSpan: "two-thirds",
            domainTags: ["Operations", "Infrastructure"],
            settings: { centerLat: 24.7136, centerLng: 46.6753, zoom: 3 },
            data: {
              markers: [
                { name:"Global Headquarters", lat:24.7136, lng:46.6753, type:"HQ", status:"Active", color:"#00f2fe" },
                { name:"EMEA Regional Hub (Riyadh)", lat:24.770, lng:46.620, type:"Branch", status:"Active", color:"#00e676" },
                { name:"North America Hub (Austin)", lat:30.267, lng:-97.743, type:"Branch", status:"Active", color:"#ff9100" },
                { name:"AI Cloud Data Center (Nvidia)", lat:24.800, lng:46.500, type:"DataCenter", status:"Active", color:"#7f00ff" }
              ]
            }
          },
          {
            id: "corp_kanban_1",
            type: "kanban",
            title: "Expansion Project Kanban",
            subtitle: "2026 Global Expansion Board",
            columnSpan: "third",
            domainTags: ["Strategy"],
            settings: {},
            data: {
              columns: [
                { id:"backlog", title:"Backlog", color:"#64748b" },
                { id:"inprogress", title:"In Progress", color:"#00f2fe" },
                { id:"done", title:"Done", color:"#00e676" }
              ],
              tasks: [
                { id:"t1", title:"Austin Office Setup", column:"done", priority:"High" },
                { id:"t2", title:"Nvidia DGX Installation", column:"inprogress", priority:"Critical" },
                { id:"t3", title:"SAP S/4HANA Renewal", column:"inprogress", priority:"High" },
                { id:"t4", title:"SOC Security Upgrade", column:"backlog", priority:"Medium" },
                { id:"t5", title:"EMEA Compliance Audit", column:"backlog", priority:"Low" }
              ]
            }
          }
        ]
      },
      {
        id: "corp_pg_4",
        title: "Risk & Capabilities",
        icon: "fa-solid fa-shield-halved",
        layoutType: "grid-flexible",
        components: [
          {
            id: "corp_risk_1",
            type: "risk",
            title: "Enterprise Risk Scoring Matrix",
            subtitle: "Probability × Impact — 2026 Risk Register",
            columnSpan: "half",
            domainTags: ["Risk", "CS"],
            settings: {},
            data: {
              risks: [
                { name:"SAP License Lapse", probability:3, impact:5, owner:"CTO Office", status:"Open" },
                { name:"Cyber Breach (SOC)", probability:2, impact:5, owner:"CISO", status:"Mitigated" },
                { name:"Supply Chain Disruption", probability:4, impact:4, owner:"COO", status:"Open" },
                { name:"AI Vendor Lock-in (Nvidia)", probability:3, impact:3, owner:"CTO", status:"Open" },
                { name:"Regulatory Non-Compliance", probability:2, impact:5, owner:"Legal", status:"Open" }
              ]
            }
          },
          {
            id: "corp_capability_1",
            type: "capabilities",
            title: "Strategic Capabilities Radar",
            subtitle: "Heatmap across 8 business domains",
            columnSpan: "half",
            domainTags: ["Strategy", "Capability"],
            settings: {},
            data: {
              dimensions: [
                { name:"Digital Innovation", score:4.5 },
                { name:"Operational Efficiency", score:3.8 },
                { name:"Cyber Resilience", score:3.5 },
                { name:"AI Adoption", score:4.2 },
                { name:"Customer Experience", score:3.9 },
                { name:"Supply Chain Agility", score:3.2 },
                { name:"Talent Management", score:4.0 },
                { name:"Data Governance", score:3.6 }
              ]
            }
          }
        ]
      }
    ]
  }
};
