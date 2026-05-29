const INITIAL_powerplatform_KNOWLEDGE_BASE = {
  "topics": [
    {
      "id": "azure_fabric",
      "title": "Azure Fabric",
      "category": "Fabric Platform",
      "description": "An all-in-one SaaS analytics solution for enterprises that covers everything from data movement to data science and business intelligence. [1]",
      "likes": 24,
      "author": "CloudArchitect"
    },
    {
      "id": "onelake",
      "title": "OneLake",
      "category": "Fabric Platform",
      "description": "A single, unified, logical data lake for the whole organization, automatically included with every Fabric tenant, designed to be the 'OneDrive for data'. [1]",
      "likes": 45,
      "author": "Fabric_Expert"
    },
    {
      "id": "fabric_tenant",
      "title": "Fabric Tenant",
      "category": "Fabric Platform",
      "description": "The top level of organization and governance for Fabric data, protecting any data landing in OneLake with tenant-level policies. [2]",
      "likes": 15,
      "author": "Security_Sentinel"
    },
    {
      "id": "ms_365_tenant_config",
      "title": "M365 Tenant Configuration",
      "category": "M365 Administration",
      "description": "The process of setting up an organizational profile, subscriptions, component services, and administrative roles to manage a cloud environment. [3]",
      "likes": 52,
      "author": "Admin_Expert"
    },
    {
      "id": "ms_entra_id",
      "title": "Microsoft Entra ID",
      "category": "M365 Identity",
      "description": "The cloud-based identity and access management service used for directory synchronization (Connect/Cloud Sync) and multi-factor authentication. [3]",
      "likes": 68,
      "author": "Identity_Lead"
    },
    {
      "id": "defender_xdr",
      "title": "Microsoft Defender XDR",
      "category": "M365 Security",
      "description": "A unified security suite designed to manage security services and implement threat protection across endpoints, identities, and applications. [4, 5]",
      "likes": 74,
      "author": "Security_Officer"
    },
    {
      "id": "ms_secure_score",
      "title": "Microsoft Secure Score",
      "category": "M365 Security",
      "description": "A measurement of an organization's security posture; a higher score indicates more recommended improvement actions have been taken. [3]",
      "likes": 41,
      "author": "Security_Officer"
    },
    {
      "id": "purview_information_protection",
      "title": "Information Protection (IP)",
      "category": "Microsoft Purview",
      "description": "A solution that discovers, classifies, and protects sensitive data wherever it lives or travels by applying sensitivity labels. [6, 7]",
      "likes": 88,
      "author": "Purview_Pro"
    },
    {
      "id": "sensitivity_label_inheritance",
      "title": "Downstream Inheritance",
      "category": "Microsoft Purview",
      "description": "A capability in Power BI where a label applied to a semantic model or report is automatically trickled down to newly created content. [8, 9]",
      "likes": 57,
      "author": "Governance_Guardian"
    },
    {
      "id": "purview_dlp",
      "title": "Data Loss Prevention (DLP)",
      "category": "Microsoft Purview",
      "description": "A solution used to identify, monitor, and automatically protect sensitive information across clouds, apps, and devices to prevent oversharing. [10, 11]",
      "likes": 92,
      "author": "Purview_Pro"
    },
    {
      "id": "adaptive_protection",
      "title": "Adaptive Protection",
      "category": "Microsoft Purview",
      "description": "A feature that integrates insider risk levels to dynamically enforce DLP controls on users based on their detected risky behavior. [12, 13]",
      "likes": 110,
      "author": "Security_Sentinel"
    },
    {
      "id": "purview_irm",
      "title": "Insider Risk Management (IRM)",
      "category": "Microsoft Purview",
      "description": "A solution that detects, investigates, and acts on potentially risky activities, such as data theft by departing employees, using ML models. [10, 14]",
      "likes": 79,
      "author": "Purview_Pro"
    },
    {
      "id": "dspm",
      "title": "Data Security Posture Management",
      "category": "Microsoft Purview",
      "description": "A solution providing continuous risk assessment and visibility into unprotected sensitive data to strengthen overall security posture. [15]",
      "likes": 65,
      "author": "Security_Officer"
    },
    {
      "id": "low_code_coe",
      "title": "Low Code Center of Excellence",
      "category": "Power Platform",
      "description": "A team and framework focused on driving adoption, establishing governance, and nurturing a community of citizen developers and makers. [16, 17]",
      "likes": 83,
      "author": "Governance_Guardian"
    },
    {
      "id": "pp_well_architected",
      "title": "PP Well-Architected Framework",
      "category": "Power Platform",
      "description": "Guidance based on five pillars: Reliability, Security, Operational Excellence, Performance Efficiency, and Experience Optimization. [18, 19]",
      "likes": 55,
      "author": "Platform_Specialist"
    },
    {
      "id": "environment_routing",
      "title": "Environment Routing",
      "category": "Power Platform",
      "description": "A governance feature that automatically directs new makers to their own personal developer environments when they access maker portals. [20]",
      "likes": 47,
      "author": "Governance_Guardian"
    },
    {
      "id": "pp_alm_strategy",
      "title": "ALM Strategy",
      "category": "Power Platform",
      "description": "The processes and tools used to manage the entire lifecycle of an application, including version control, testing, and CI/CD pipelines. [21, 22]",
      "likes": 61,
      "author": "Admin_Expert"
    },
    {
      "id": "managed_identities_pp",
      "title": "Managed Identities",
      "category": "Power Platform",
      "description": "Provides a secure way for Power Platform apps to authenticate with Azure services without needing hard-coded credentials. [23]",
      "likes": 39,
      "author": "Security_Officer"
    },
    {
      "id": "sas_logging",
      "title": "SAS Logging in Purview",
      "category": "Power Platform",
      "description": "A setting in the Power Platform admin center that enables environment activity logs to be accessed by Purview auditing solutions. [24, 25]",
      "likes": 26,
      "author": "Admin_Expert"
    },
    {
      "id": "security_copilot",
      "title": "Microsoft Security Copilot",
      "category": "AI Capabilities",
      "description": "An AI platform embedded in Purview to help identify, summarize, and remediate issues like insider risk alerts and data exposure. [26, 27]",
      "likes": 125,
      "author": "NeuralNinja"
    }
  ],
  "edges": [
    { "from": "ms_entra_id", "to": "fabric_tenant", "label": "manages access for" },
    { "from": "purview_information_protection", "to": "azure_fabric", "label": "governs data in" },
    { "from": "sensitivity_label_inheritance", "to": "power_bi_workload", "label": "automates labeling in" },
    { "from": "adaptive_protection", "to": "purview_dlp", "label": "dynamically attaches to" },
    { "from": "low_code_coe", "to": "pp_well_architected", "label": "implements guidance from" },
    { "from": "environment_routing", "to": "fabric_workspace", "label": "isolates development in" },
    { "from": "security_copilot", "to": "purview_irm", "label": "summarizes alerts for" },
    { "from": "sas_logging", "to": "purview_information_protection", "label": "provides audit data to" }
  ]
}