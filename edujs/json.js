// Seed data for EduJS Social EdTech Platform
const INITIAL_KNOWLEDGE_BASE = {
  "topics": [
    {
      "id": "azure_fabric",
      "title": "Azure Fabric",
      "category": "PBI Azure fabric",
      "description": "An all-in-one SaaS analytics solution for enterprises that covers everything from data movement to data science and business intelligence.",
      "likes": 24,
      "author": "CloudArchitect"
    },
    {
      "id": "databricks",
      "title": "Azure Databricks",
      "category": "Azure databricks",
      "description": "A data analytics platform optimized for Microsoft Azure, based on Apache Spark for high-performance processing.",
      "likes": 18,
      "author": "SparkMaster"
    },
    {
      "id": "azure_ai",
      "title": "Azure AI Services",
      "category": "Azure AI",
      "description": "A portfolio of AI services and cognitive APIs helping developers build intelligent applications.",
      "likes": 35,
      "author": "NeuralNinja"
    },
    {
      "id": "pmp",
      "title": "PMP Certification",
      "category": "pmp",
      "description": "Leading project management certification validating leadership in agile, predictive, and hybrid projects.",
      "likes": 28,
      "author": "PMO_Lead"
    },
    {
      "id": "powerplatform",
      "title": "Power Platform",
      "category": "powerplatform",
      "description": "System enabling low-code apps, automated workflows, and data analysis.",
      "likes": 22,
      "author": "LowCodeKing"
    },
    {
      "id": "geography",
      "title": "Global Geography",
      "category": "Geographic",
      "description": "The study of physical features of the earth and human activity impacts.",
      "likes": 19,
      "author": "GeoGuru"
    },
    {
      "id": "geometry",
      "title": "Math Geometry",
      "category": "Math",
      "description": "Branch of math concerned with properties and relations of points, lines, and surfaces.",
      "likes": 31,
      "author": "Euclid_Jr"
    },
    {
      "id": "biology_systems",
      "title": "Human Biology Systems",
      "category": "Biology",
      "description": "Complex anatomical structures including respiratory and circulatory systems.",
      "likes": 42,
      "author": "Dr_Cell"
    },
    {
      "id": "physics_gravity",
      "title": "Physics Laws of Gravity",
      "category": "Physics",
      "description": "Study of gravitational force and motion according to Galileo and Newton.",
      "likes": 29,
      "author": "Newtonian"
    },
    {
      "id": "chemistry_lab",
      "title": "Chemistry Solutions & Reactions",
      "category": "Chemistry",
      "description": "Study of chemical changes where acids and bases neutralize each other.",
      "likes": 26,
      "author": "Curie_Marie"
    },
    {
      "id": "history_science",
      "title": "History of Scientific Discoveries",
      "category": "History",
      "description": "Chronological review of humanity's mathematical, physical, and biological discoveries.",
      "likes": 17,
      "author": "Chronos"
    },
    {
      "id": "togaf_intro",
      "title": "Introduction to the TOGAF Standard",
      "category": "togaf_fundamental",
      "description": "An open, industry consensus framework for Enterprise Architecture. (Ref: p. 9, 54)",
      "likes": 15,
      "author": "EnterpriseGuy"
    },
    {
      "id": "togaf_doc_structure",
      "title": "TOGAF Documentation Structure",
      "category": "togaf_fundamental",
      "description": "Modular structure moving from universal concepts (Fundamental Content) to stable best practices (Series Guides). (Ref: p. 10, 56)",
      "likes": 12,
      "author": "EnterpriseGuy"
    },
    {
      "id": "togaf_fundamental_content",
      "title": "TOGAF Fundamental Content",
      "category": "togaf_fundamental",
      "description": "Universal concepts consisting of six core documents, including Introduction, ADM, and Content Framework. (Ref: p. 12, 60)",
      "likes": 20,
      "author": "EnterpriseGuy"
    },
    {
      "id": "togaf_series_guides",
      "title": "TOGAF Series Guides",
      "category": "togaf_fundamental",
      "description": "Extended guidance for specific topics like Security, Agile, and Business Architecture. (Ref: p. 13, 63)",
      "likes": 14,
      "author": "EnterpriseGuy"
    },
    {
      "id": "togaf_library",
      "title": "The TOGAF Library",
      "category": "togaf_fundamental",
      "description": "A repository of emerging ideas, guidelines, templates, and patterns to accelerate architecture creation. (Ref: p. 16, 69)",
      "likes": 18,
      "author": "EnterpriseGuy"
    },
    {
      "id": "togaf_ea_purpose",
      "title": "Purposes of Enterprise Architecture",
      "category": "togaf_core",
      "description": "EA supports Strategy, Portfolio, Project, and Solution Delivery. (Ref: p. 23, 86)",
      "likes": 22,
      "author": "EnterpriseGuy"
    },
    {
      "id": "togaf_peek_ahead",
      "title": "Peek-Ahead Strategy",
      "category": "togaf_digital",
      "description": "Using just enough guidance to deliver minimum viable digital products while ensuring future transitions. (Ref: p. 28, 99)",
      "likes": 25,
      "author": "EnterpriseGuy"
    },
    {
      "id": "togaf_ea_as_services",
      "title": "EA as Services Strategy",
      "category": "togaf_digital",
      "description": "Developing architecture on demand to support the operations tempo of digital efforts in a consulting fashion. (Ref: p. 29, 100)",
      "likes": 19,
      "author": "EnterpriseGuy"
    },
    {
      "id": "togaf_dtra",
      "title": "Digital Transformation Readiness Assessment (DTRA)",
      "category": "togaf_digital",
      "description": "A technique to assess organizational preparedness across foundational, impact, and sustaining factors. (Ref: p. 38, 116)",
      "likes": 30,
      "author": "EnterpriseGuy"
    },
    {
      "id": "togaf_arch_capability",
      "title": "Enterprise Architecture Capability",
      "category": "togaf_capability",
      "description": "The ability to develop, use, and maintain an enterprise architecture and use it to govern change. (Ref: p. 42, 106, 124)",
      "likes": 21,
      "author": "EnterpriseGuy"
    },
    {
      "id": "togaf_org_models",
      "title": "Organization Models for EA",
      "category": "togaf_capability",
      "description": "Alignment variants: Function-Centric, IT-Centric, or Strategy-Centric. (Ref: p. 44, 127)",
      "likes": 16,
      "author": "EnterpriseGuy"
    },
    {
      "id": "togaf_security_arch",
      "title": "Security Architecture Integration",
      "category": "togaf_security",
      "description": "Integrating risk and security as a cross-cutting concern throughout all ADM domains. (Ref: p. 47, 131)",
      "likes": 28,
      "author": "SecurityExpert"
    },
    {
      "id": "togaf_risk_mgmt",
      "title": "Risk Management",
      "category": "togaf_security",
      "description": "The art and science of applying risk assessment concepts in decision-making. (Ref: p. 49, 132)",
      "likes": 32,
      "author": "SecurityExpert"
    },
    {
      "id": "togaf_business_models",
      "title": "Business Models",
      "category": "togaf_business",
      "description": "Describes the rationale of how an organization creates, delivers, and captures value. (Ref: p. 52, 140)",
      "likes": 27,
      "author": "BizArchitect"
    },
    {
      "id": "togaf_business_capability",
      "title": "Business Capabilities",
      "category": "togaf_business",
      "description": "A particular ability or capacity a business possesses to achieve a specific purpose. (Ref: p. 52, 142)",
      "likes": 35,
      "author": "BizArchitect"
    },
    {
      "id": "togaf_value_streams",
      "title": "Value Streams",
      "category": "togaf_business",
      "description": "An end-to-end collection of value-adding activities that create a result for a customer. (Ref: p. 57, 151)",
      "likes": 38,
      "author": "BizArchitect"
    },
    {
      "id": "togaf_info_mapping",
      "title": "Information Mapping",
      "category": "togaf_business",
      "description": "Articulates and represents information critical to the business. (Ref: p. 61, 162)",
      "likes": 18,
      "author": "BizArchitect"
    },
    {
      "id": "togaf_org_mapping",
      "title": "Organization Mapping",
      "category": "togaf_business",
      "description": "Identifies business units and third parties that participate in value streams. (Ref: p. 62, 165)",
      "likes": 15,
      "author": "BizArchitect"
    },
    {
      "id": "togaf_business_scenarios",
      "title": "Business Scenarios",
      "category": "togaf_techniques",
      "description": "Technique to understand requirements and build consensus with stakeholders. (Ref: p. 64, 167)",
      "likes": 24,
      "author": "BizArchitect"
    },
    {
      "id": "togaf_enterprise_agility",
      "title": "Enterprise Agility",
      "category": "togaf_agile",
      "description": "Responsive, value-driven characteristics using empowered, autonomous teams. (Ref: p. 67, 173)",
      "likes": 40,
      "author": "AgileCoach"
    },
    {
      "id": "togaf_mva",
      "title": "Minimum Viable Architecture (MVA)",
      "category": "togaf_agile",
      "description": "The minimum architecture that is realizable, adds business value, and satisfies quality requirements. (Ref: p. 70, 182, 381)",
      "likes": 45,
      "author": "AgileCoach"
    },
    {
      "id": "togaf_agile_adm",
      "title": "Sprinting with the TOGAF ADM",
      "category": "togaf_agile",
      "description": "Applying ADM phases within iterative sprints for agile delivery. (Ref: p. 74, 186)",
      "likes": 33,
      "author": "AgileCoach"
    },
    {
      "id": "togaf_dbrm",
      "title": "Digital Business Reference Model (DBRM)",
      "category": "togaf_reference",
      "description": "Industry-independent outline of common core components for a digital enterprise. (Ref: p. 77, 190)",
      "likes": 22,
      "author": "EnterpriseGuy"
    },
    {
      "id": "togaf_grm",
      "title": "Government Reference Model (GRM)",
      "category": "togaf_reference",
      "description": "Standard model template used to describe businesses in the public sector. (Ref: p. 79, 191)",
      "likes": 19,
      "author": "EnterpriseGuy"
    },
    {
      "id": "togaf_maturity_models",
      "title": "Architecture Maturity Models",
      "category": "togaf_techniques",
      "description": "Techniques for evaluating and quantifying an organization's maturity in EA. (Ref: p. 81, 191, 203)",
      "likes": 17,
      "author": "EnterpriseGuy"
    },
    {
      "id": "togaf_skills_framework",
      "title": "Architecture Skills Framework",
      "category": "togaf_capability",
      "description": "Defines role, skill, and experience norms for architecture staff. (Ref: p. 82, 192, 206)",
      "likes": 29,
      "author": "EnterpriseGuy"
    },
    {
      "id": "togaf_stakeholder_mgmt",
      "title": "Stakeholder Management",
      "category": "togaf_techniques",
      "description": "Discipline to win support and shape architecture based on stakeholder input. (Ref: p. 86, 216)",
      "likes": 36,
      "author": "EnterpriseGuy"
    },
    {
      "id": "togaf_gap_analysis",
      "title": "Gap Analysis",
      "category": "togaf_techniques",
      "description": "Highlights shortfalls between Baseline and Target Architectures. (Ref: p. 87, 218)",
      "likes": 42,
      "author": "EnterpriseGuy"
    },
    {
      "id": "togaf_content_framework",
      "title": "Architecture Content Framework",
      "category": "togaf_content",
      "description": "A structured metamodel for architectural artifacts and work products. (Ref: p. 101, 248)",
      "likes": 26,
      "author": "EnterpriseGuy"
    },
    {
      "id": "togaf_continuum",
      "title": "The Enterprise Continuum",
      "category": "togaf_content",
      "description": "Categorization mechanism for classifying artifacts as they evolve from generic to specific. (Ref: p. 103, 254)",
      "likes": 21,
      "author": "EnterpriseGuy"
    },
    {
      "id": "togaf_repository",
      "title": "Architecture Repository",
      "category": "togaf_content",
      "description": "Logical storage area for architectural assets, standards, and guidelines. (Ref: p. 104, 255)",
      "likes": 23,
      "author": "EnterpriseGuy"
    },
    {
      "id": "togaf_governance",
      "title": "Architecture Governance",
      "category": "togaf_governance",
      "description": "Practice by which architectures are managed and controlled enterprise-wide. (Ref: p. 107, 258)",
      "likes": 31,
      "author": "EnterpriseGuy"
    },
    {
      "id": "togaf_board",
      "title": "Architecture Board",
      "category": "togaf_governance",
      "description": "Body of executives responsible for review, maintenance, and conflict resolution. (Ref: p. 107, 260)",
      "likes": 20,
      "author": "EnterpriseGuy"
    },
    {
      "id": "togaf_preliminary",
      "title": "Preliminary Phase",
      "category": "togaf_adm",
      "description": "Preparation and initiation activities to create an Architecture Capability. (Ref: p. 112, 268)",
      "likes": 34,
      "author": "EnterpriseGuy"
    },
    {
      "id": "togaf_phase_a",
      "title": "Phase A: Architecture Vision",
      "category": "togaf_adm",
      "description": "Defining scope, identifying stakeholders, and creating a high-level vision. (Ref: p. 114, 273)",
      "likes": 39,
      "author": "EnterpriseGuy"
    },
    {
      "id": "togaf_phase_b",
      "title": "Phase B: Business Architecture",
      "category": "togaf_adm",
      "description": "Developing Target Business Architecture to achieve goals and respond to drivers. (Ref: p. 116, 277)",
      "likes": 30,
      "author": "EnterpriseGuy"
    },
    {
      "id": "togaf_phase_c",
      "title": "Phase C: Information Systems Architectures",
      "category": "togaf_adm",
      "description": "Covers Data and Application Architecture to support the business. (Ref: p. 118, 281)",
      "likes": 28,
      "author": "EnterpriseGuy"
    },
    {
      "id": "togaf_phase_d",
      "title": "Phase D: Technology Architecture",
      "category": "togaf_adm",
      "description": "Defining technology components and services required for the solution. (Ref: p. 122, 288)",
      "likes": 25,
      "author": "EnterpriseGuy"
    },
    {
      "id": "togaf_phase_e",
      "title": "Phase E: Opportunities and Solutions",
      "category": "togaf_adm",
      "description": "Identifying delivery vehicles (projects/programs) for implementation. (Ref: p. 124, 292)",
      "likes": 22,
      "author": "EnterpriseGuy"
    },
    {
      "id": "togaf_phase_f",
      "title": "Phase F: Migration Planning",
      "category": "togaf_adm",
      "description": "Finalizing the Architecture Roadmap and Migration Plan. (Ref: p. 126, 297)",
      "likes": 21,
      "author": "EnterpriseGuy"
    },
    {
      "id": "togaf_phase_g",
      "title": "Phase G: Implementation Governance",
      "category": "togaf_adm",
      "description": "Providing architectural oversight for implementation projects. (Ref: p. 128, 301)",
      "likes": 24,
      "author": "EnterpriseGuy"
    },
    {
      "id": "togaf_phase_h",
      "title": "Phase H: Architecture Change Management",
      "category": "togaf_adm",
      "description": "Procedures for managing change to the new architecture lifecycle. (Ref: p. 130, 305)",
      "likes": 19,
      "author": "EnterpriseGuy"
    },
    {
      "id": "togaf_req_mgmt",
      "title": "Requirements Management",
      "category": "togaf_adm",
      "description": "Central dynamic process managing requirements throughout the ADM. (Ref: p. 132, 308)",
      "likes": 48,
      "author": "EnterpriseGuy"
    },
    {
      "id": "togaf_principles",
      "title": "Architecture Principles",
      "category": "togaf_deliverable",
      "description": "General rules and guidelines relating to architecture work. (Ref: p. 138, 319)",
      "likes": 44,
      "author": "EnterpriseGuy"
    },
    {
      "id": "togaf_definition_doc",
      "title": "Architecture Definition Document",
      "category": "togaf_deliverable",
      "description": "Qualitative view of the solution across all architecture domains. (Ref: p. 145, 337)",
      "likes": 37,
      "author": "EnterpriseGuy"
    },
    {
      "id": "togaf_req_spec",
      "title": "Architecture Requirements Specification",
      "category": "togaf_deliverable",
      "description": "Quantitative view stating measurable criteria for implementation. (Ref: p. 149, 347)",
      "likes": 32,
      "author": "EnterpriseGuy"
    },
    {
      "id": "togaf_roadmap",
      "title": "Architecture Roadmap",
      "category": "togaf_deliverable",
      "description": "Timeline of work packages showing progression to the target. (Ref: p. 151, 352)",
      "likes": 46,
      "author": "EnterpriseGuy"
    },
    {
      "id": "togaf_abb_sbb",
      "title": "Building Blocks (ABB & SBB)",
      "category": "togaf_deliverable",
      "description": "ABBs capture requirements; SBBs implement them through products. (Ref: p. 152-153, 354)",
      "likes": 31,
      "author": "EnterpriseGuy"
    },
    {
      "id": "togaf_transition_arch",
      "title": "Transition Architecture",
      "category": "togaf_deliverable",
      "description": "Description of the enterprise at an intermediate point along the roadmap. (Ref: p. 154, 360)",
      "likes": 29,
      "author": "EnterpriseGuy"
    }
  ],
  "edges": [
    { "from": "databricks", "to": "azure_fabric", "label": "feeds data into" },
    { "from": "azure_ai", "to": "azure_fabric", "label": "adds AI capabilities to" },
    { "from": "azure_ai", "to": "powerplatform", "label": "powers chatbots in" },
    { "from": "powerplatform", "to": "azure_fabric", "label": "visualizes data from" },
    { "from": "togaf_intro", "to": "pmp", "label": "aligns project delivery with" },
    { "from": "geometry", "to": "geography", "label": "helps map coordinates in" },
    { "from": "geometry", "to": "physics_gravity", "label": "models trajectories in" },
    { "from": "physics_gravity", "to": "chemistry_lab", "label": "governs fluid kinetics in" },
    { "from": "chemistry_lab", "to": "biology_systems", "label": "fuels metabolic reactions in" },
    { "from": "history_science", "to": "physics_gravity", "label": "contextualizes Newton's work in" },
    { "from": "history_science", "to": "togaf_intro", "label": "shows evolution of organization systems in" },
    { "from": "togaf_preliminary", "to": "togaf_principles", "label": "establishes" },
    { "from": "togaf_phase_a", "to": "togaf_preliminary", "label": "follows" },
    { "from": "togaf_req_mgmt", "to": "togaf_phase_a", "label": "drives" },
    { "from": "togaf_business_capability", "to": "togaf_phase_b", "label": "is mapped in" },
    { "from": "togaf_roadmap", "to": "togaf_phase_f", "label": "is finalized in" },
    { "from": "togaf_mva", "to": "togaf_agile_adm", "label": "is deliverable of" },
    { "from": "togaf_security_arch", "to": "togaf_req_mgmt", "label": "informs" },
    { "from": "togaf_gap_analysis", "to": "togaf_roadmap", "label": "identifies components for" }
  ]
};