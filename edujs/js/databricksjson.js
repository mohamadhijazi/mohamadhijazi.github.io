const INITIAL_databricks_KNOWLEDGE_BASE ={
  "topics": [
    {
      "id": "azure_databricks_history",
      "title": "History of Databricks",
      "category": "Corporate History",
      "description": "Founded in 2013 by the creators of Apache Spark at UC Berkeley, the company grew from the AMPLab project [1, 2]. Microsoft integrated it as a first-party service, Azure Databricks, in 2017 [3]. By late 2025, the company reached a $134 billion valuation following a $4 billion Series L funding round [4, 5].",
      "likes": 850,
      "author": "Spark_Creators"
    },
    {
      "id": "lakehouse_architecture_v2",
      "title": "Lakehouse Architecture",
      "category": "Architecture Patterns",
      "description": "A paradigm that unifies the performance and ACID transactions of data warehouses with the flexible, low-cost storage of data lakes [2, 6]. It supports analytical queries on semi-structured data without a traditional schema and received FedRAMP authorization in 2022 [6, 7].",
      "likes": 920,
      "author": "Databricks_Staff"
    },
    {
      "id": "medallion_bronze",
      "title": "Bronze Layer (Raw Data)",
      "category": "Medallion Architecture",
      "description": "The landing zone for raw data from external systems, maintained 'as-is' with minimal changes to support historical archiving, data lineage, and auditability [8, 9].",
      "likes": 450,
      "author": "Data_Architect"
    },
    {
      "id": "medallion_silver",
      "title": "Silver Layer (Cleansed Data)",
      "category": "Medallion Architecture",
      "description": "The 'Enterprise view' where data is matched, merged, and cleansed just enough to provide non-duplicated transactions and master business entities for self-service analytics [8, 10].",
      "likes": 560,
      "author": "Data_Architect"
    },
    {
      "id": "medallion_gold",
      "title": "Gold Layer (Curated Data)",
      "category": "Medallion Architecture",
      "description": "Consumption-ready data organized into project-specific databases using de-normalized, read-optimized models like Kimball star schemas for high-level reporting [8, 11].",
      "likes": 780,
      "author": "Data_Architect"
    },
    {
      "id": "delta_lake_log",
      "title": "Delta Lake Transaction Log",
      "category": "Storage Layer",
      "description": "An open protocol that extends Parquet with a file-based log to provide ACID transactions and scalable metadata handling, serving as the foundation for lakehouse tables [12, 13].",
      "likes": 1000,
      "author": "NeuralNinja"
    },
    {
      "id": "photon_vectorization",
      "title": "Photon Query Engine",
      "category": "Compute Engine",
      "description": "A native C++ vectorized query engine that processes data in columnar batches of thousands of rows [14, 15]. It provides up to 5x better price/performance and is the default for SQL warehouses [16, 17].",
      "likes": 1000,
      "author": "Performance_Pro"
    },
    {
      "id": "unity_catalog_scim",
      "title": "Unity Catalog Governance",
      "category": "Data Governance",
      "description": "A unified solution for governance that uses SCIM to provision users and groups at the account level [18, 19]. It distinguishes between 'Managed' tables (lifecycle managed by Databricks) and 'External' tables (files managed by the cloud provider) [20].",
      "likes": 980,
      "author": "Governance_Guardian"
    },
    {
      "id": "vnet_injection_networking",
      "title": "VNet Injection Requirements",
      "category": "Networking",
      "description": "Allows deploying Databricks in a customer's VNet for secure connectivity [21, 22]. Requires two dedicated subnets (container and host) with CIDR blocks of at least /26 and no smaller than /24 for the total VNet space [23, 24].",
      "likes": 310,
      "author": "Security_Sentinel"
    },
    {
      "id": "dp_203_skills",
      "title": "DP-203 Certification Skills",
      "category": "Professional Development",
      "description": "Measures expertise in designing and implementing data storage, processing, and security [25, 26]. Focus areas include Azure Data Factory, Synapse Analytics, Stream Analytics, and Databricks [26]. Candidates need 700/1000 to pass [27].",
      "likes": 892,
      "author": "dojogreen"
    },
    {
      "id": "agent_bricks_2025",
      "title": "Agent Bricks",
      "category": "AI Capabilities",
      "description": "Launched in June 2025, this suite of tools and development platform helps organizations build no-code AI agents [28-30].",
      "likes": 1000,
      "author": "AI_Innovator"
    },
    {
      "id": "genie_code_agent",
      "title": "Genie Code",
      "category": "AI Capabilities",
      "description": "An AI agent released in March 2026 designed specifically to assist with complex data science and engineering tasks [30, 31].",
      "likes": 1000,
      "author": "AI_Innovator"
    },
    {
      "id": "lakewatch_security",
      "title": "Lakewatch",
      "category": "Security",
      "description": "An AI-powered agentic security platform launched in 2026 to automate threat detection and response across the data intelligence platform [30, 31].",
      "likes": 1000,
      "author": "Security_Officer"
    }
  ],
  "edges": [
    { "from": "delta_lake_log", "to": "lakehouse_architecture_v2", "label": "enables foundation of" },
    { "from": "photon_vectorization", "to": "azure_databricks_history", "label": "powers performance in" },
    { "from": "medallion_bronze", "to": "medallion_silver", "label": "refined into" },
    { "from": "medallion_silver", "to": "medallion_gold", "label": "aggregated into" },
    { "from": "unity_catalog_scim", "to": "medallion_bronze", "label": "governs access to" },
    { "from": "vnet_injection_networking", "to": "unity_catalog_scim", "label": "provides secure path for" },
    { "from": "dp_203_skills", "to": "lakehouse_architecture_v2", "label": "tests knowledge of" },
    { "from": "agent_bricks_2025", "to": "genie_code_agent", "label": "is parent platform for" },
    { "from": "lakewatch_security", "to": "azure_databricks_history", "label": "protects ecosystem of" }
  ]
}