const INITIAL_pbi_KNOWLEDGE_BASE = {
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
"id": "onelake",
"title": "OneLake",
"category": "Fabric Platform",
"description": "A single, unified, logical data lake for the whole organization, automatically included with every Fabric tenant, designed to be the 'OneDrive for data'.",
"likes": 45,
"author": "Fabric_Expert"
},
{
"id": "fabric_workspace",
"title": "Fabric Workspace",
"category": "Fabric Platform",
"description": "A logical container within a tenant where collaboration happens and ownership/access policies are distributed.",
"likes": 32,
"author": "CloudArchitect"
},
{
"id": "fabric_tenant",
"title": "Fabric Tenant",
"category": "Fabric Platform",
"description": "The top level of organization and governance for Fabric data, protecting any data landing in OneLake with tenant-level policies.",
"likes": 15,
"author": "Security_Sentinel"
},
{
"id": "fabric_capacity",
"title": "Fabric Capacity",
"category": "Fabric Platform",
"description": "A dedicated pool of resources tied to a specific region that host workspaces and determine processing power; billed separately.",
"likes": 21,
"author": "CloudArchitect"
},
{
"id": "onelake_shortcut",
"title": "OneLake Shortcut",
"category": "Fabric Platform",
"description": "A reference to data stored in other internal or external locations (like ADLS or S3) that makes files look local without moving them.",
"likes": 50,
"author": "Fabric_Expert"
},
{
"id": "data_factory_workload",
"title": "Data Factory",
"category": "Fabric Workloads",
"description": "A data integration solution that connects to over 170 sources to move and transform data at scale through pipelines and dataflows.",
"likes": 38,
"author": "Query_Guru"
},
{
"id": "data_engineering_workload",
"title": "Data Engineering",
"category": "Fabric Workloads",
"description": "Workload focused on building lakehouses, ingesting data, and using Apache Spark for large-scale transformations.",
"likes": 29,
"author": "SparkMaster"
},
{
"id": "data_science_workload",
"title": "Data Science",
"category": "Fabric Workloads",
"description": "Enables data scientists to manage notebooks, experiments, and models while collaborating across the enterprise.",
"likes": 35,
"author": "NeuralNinja"
},
{
"id": "data_warehouse_workload",
"title": "Data Warehouse",
"category": "Fabric Workloads",
"description": "Provides a fully transactional data warehouse with full T-SQL capabilities for enterprise-scale analytics.",
"likes": 42,
"author": "CloudArchitect"
},
{
"id": "real_time_intelligence_workload",
"title": "Real-Time Intelligence",
"category": "Fabric Workloads",
"description": "Workload for ingesting, processing, and visualizing data in motion to gain immediate insights from streaming events.",
"likes": 33,
"author": "NeuralNinja"
},
{
"id": "power_bi_workload",
"title": "Power BI (Fabric)",
"category": "Fabric Workloads",
"description": "The integrated workload for building interactive reports and dashboards to visualize OneLake data.",
"likes": 48,
"author": "PBI_Pro"
},
{
"id": "sql_db_fabric",
"title": "Fabric SQL Database",
"category": "Fabric Workloads",
"description": "A managed SQL database capability within the Fabric ecosystem for high-performance data management.",
"likes": 25,
"author": "CloudArchitect"
},
{
"id": "fabric_iq",
"title": "Fabric IQ",
"category": "Fabric Workloads",
"description": "Workload that defines business vocabulary in an ontology and binds it to underlying data sources via data agents.",
"likes": 19,
"author": "Fabric_Expert"
},
{
"id": "lakehouse",
"title": "Lakehouse",
"category": "Lakehouse",
"description": "A data store combining data lake storage flexibility with data warehouse analytical capabilities, using Delta Parquet format.",
"likes": 37,
"author": "SparkMaster"
},
{
"id": "delta_table",
"title": "Delta Table",
"category": "Lakehouse",
"description": "The unified table format across all Fabric compute engines, offering ACID transactions and high-performance data access.",
"likes": 41,
"author": "Fabric_Expert"
},
{
"id": "sql_analytics_endpoint",
"title": "SQL Analytics Endpoint",
"category": "Lakehouse",
"description": "Provides a read-only SQL connection point for querying Lakehouse data using T-SQL.",
"likes": 28,
"author": "CloudArchitect"
},
{
"id": "dataflow_gen2",
"title": "Dataflow Gen2",
"category": "Data Integration",
"description": "A low-code interface offering over 300 transformations for data cleaning and enrichment, loading into Fabric destinations.",
"likes": 55,
"author": "Query_Guru"
},
{
"id": "data_factory_pipeline",
"title": "Data Pipeline",
"category": "Data Integration",
"description": "A workflow orchestration tool used to run and automate multiple data movements and transformation activities.",
"likes": 34,
"author": "Query_Guru"
},
{
"id": "mirroring",
"title": "Mirroring",
"category": "Data Integration",
"description": "A feature providing near real-time replicas of operational databases within OneLake to simplify reporting and analytics.",
"likes": 30,
"author": "CloudArchitect"
},
{
"id": "dbt_job",
"title": "dbt Job",
"category": "Data Integration",
"description": "Enables SQL-based data transformations directly in Fabric to build, test, and deploy dbt models on a warehouse.",
"likes": 22,
"author": "CloudArchitect"
},
{
"id": "real_time_hub",
"title": "Real-Time Hub",
"category": "Real-Time Intelligence",
"description": "A central place to discover and manage streaming data, allowing users to extract insights from events in motion.",
"likes": 39,
"author": "NeuralNinja"
},
{
"id": "eventstream",
"title": "Eventstream",
"category": "Real-Time Intelligence",
"description": "A tool for capturing, transforming, and routing high-volume streaming data to Fabric destinations like Eventhouse.",
"likes": 27,
"author": "NeuralNinja"
},
{
"id": "eventhouse",
"title": "Eventhouse",
"category": "Real-Time Intelligence",
"description": "A specialized storage engine optimized for high-volume streaming data and log analysis using KQL.",
"likes": 24,
"author": "NeuralNinja"
},
{
"id": "kql_query",
"title": "KQL Query",
"category": "Real-Time Intelligence",
"description": "A query written in Kusto Query Language used to explore and analyze large-scale streaming datasets.",
"likes": 31,
"author": "NeuralNinja"
},
{
"id": "real_time_dashboard",
"title": "Real-Time Dashboard",
"category": "Real-Time Intelligence",
"description": "A visual tool for exploring and monitoring streaming data with low-latency updates.",
"likes": 40,
"author": "NeuralNinja"
},
{
"id": "semantic_model",
"title": "Semantic Model",
"category": "Power BI Concepts",
"description": "A logical layer that defines relationships, calculations, and measures over source data for report visualization.",
"likes": 46,
"author": "PBI_Pro"
},
{
"id": "direct_lake_mode",
"title": "Direct Lake Mode",
"category": "Power BI Concepts",
"description": "A high-performance storage mode that builds reports directly on OneLake files, providing the speed of import without data copying.",
"likes": 62,
"author": "Fabric_Expert"
},
{
"id": "import_mode",
"title": "Import Mode",
"category": "Power BI Concepts",
"description": "A mode where data is fully loaded into Power BI's in-memory storage for rapid querying and analysis.",
"likes": 33,
"author": "PBI_Pro"
},
{
"id": "directquery_mode",
"title": "DirectQuery Mode",
"category": "Power BI Concepts",
"description": "A mode where Power BI queries the source data directly at report runtime rather than storing a local copy.",
"likes": 18,
"author": "PBI_Pro"
},
{
"id": "pbip_project",
"title": "PBI Project (.pbip)",
"category": "Power BI Concepts",
"description": "A Power BI Desktop project format designed for developer workflows and workspace-level version control.",
"likes": 27,
"author": "PBI_Pro"
},
{
"id": "dax_query_view",
"title": "DAX Query View",
"category": "Power BI Concepts",
"description": "A dedicated workspace in Power BI Desktop for writing, testing, and debugging Data Analysis Expressions queries.",
"likes": 29,
"author": "DAX_Diva"
},
{
"id": "performance_analyzer",
"title": "Performance Analyzer",
"category": "Power BI Concepts",
"description": "A tool used to identify poorly performing report visuals, DAX measures, and data relationships.",
"likes": 35,
"author": "PBI_Pro"
},
{
"id": "deployment_pipelines",
"title": "Deployment Pipelines",
"category": "Power BI Concepts",
"description": "A tool for managing content lifecycle by moving report assets through development, test, and production stages.",
"likes": 31,
"author": "PBI_Pro"
},
{
"id": "xmla_endpoint",
"title": "XMLA Endpoint",
"category": "Power BI Concepts",
"description": "Provides open connectivity for semantic models, allowing advanced management via tools like TOM and TMSL.",
"likes": 23,
"author": "PBI_Pro"
},
{
"id": "calculation_groups",
"title": "Calculation Groups",
"category": "Power BI Concepts",
"description": "A feature for reducing measure redundancy by grouping common calculation logic into a single structure.",
"likes": 44,
"author": "DAX_Diva"
},
{
"id": "dynamic_format_strings",
"title": "Dynamic Format Strings",
"category": "Power BI Concepts",
"description": "Allows a measure's format to change dynamically based on the current context or data value.",
"likes": 36,
"author": "DAX_Diva"
},
{
"id": "field_parameters",
"title": "Field Parameters",
"category": "Power BI Concepts",
"description": "Enables end-users to dynamically swap dimensions or measures within a report visual.",
"likes": 49,
"author": "PBI_Pro"
},
{
"id": "composite_models",
"title": "Composite Models",
"category": "Power BI Concepts",
"description": "A modeling feature that allows combining data from multiple DirectQuery sources or mixing Import and DirectQuery data.",
"likes": 26,
"author": "PBI_Pro"
},
{
"id": "incremental_refresh",
"title": "Incremental Refresh",
"category": "Power BI Concepts",
"description": "An optimization technique that refreshes only new or modified data rows rather than the entire dataset.",
"likes": 38,
"author": "PBI_Pro"
},
{
"id": "pbi_dashboard",
"title": "PBI Dashboard",
"category": "Power BI Concepts",
"description": "A single-page monitoring visual that pins key tiles from one or more reports to track high-level metrics.",
"likes": 41,
"author": "PBI_Pro"
},
{
"id": "pbi_gateway",
"title": "PBI Gateway",
"category": "Power BI Concepts",
"description": "Bridge software enabling secure communication between on-premises data sources and cloud-based analytics services.",
"likes": 20,
"author": "Security_Sentinel"
},
{
"id": "fabric_copilot",
"title": "Fabric Copilot",
"category": "AI Capabilities",
"description": "An AI assistant available across Fabric for summarizing models, generating code, and creating narrative report visuals.",
"likes": 75,
"author": "NeuralNinja"
},
{
"id": "ds_experiment",
"title": "DS Experiment",
"category": "Data Science",
"description": "A feature for data scientists to track and compare multiple runs of machine learning models within Fabric.",
"likes": 22,
"author": "Data_Science_Sage"
},
{
"id": "ds_model",
"title": "DS Model",
"category": "Data Science",
"description": "A machine learning model versioned and managed within the Fabric data science ecosystem.",
"likes": 26,
"author": "Data_Science_Sage"
},
{
"id": "ds_notebook",
"title": "DS Notebook",
"category": "Data Science",
"description": "An interactive document for writing Spark code, documenting processes, and visualizing data engineering results.",
"likes": 39,
"author": "SparkMaster"
},
{
"id": "power_query_m",
"title": "Power Query M Language",
"category": "Power Query M",
"description": "A functional, case-sensitive mashup language used for data filtering and transformation in Power BI and Fabric.",
"likes": 53,
"author": "Query_Guru"
},
{
"id": "m_let_expression",
"title": "M 'let' Expression",
"category": "Power Query M",
"description": "A syntax structure that encapsulates a set of formula steps with named variables for computation.",
"likes": 28,
"author": "Query_Guru"
},
{
"id": "m_lazy_evaluation",
"title": "M Lazy Evaluation",
"category": "Power Query M",
"description": "An evaluation model where steps are only computed when their results are required for a subsequent calculation.",
"likes": 15,
"author": "Query_Guru"
},
{
"id": "m_metadata",
"title": "M Metadata",
"category": "Power Query M",
"description": "Information associated with a value using a metadata record, defined via the 'meta' operator.",
"likes": 12,
"author": "Query_Guru"
},
{
"id": "m_try_expression",
"title": "M 'try' Expression",
"category": "Power Query M",
"description": "A logic construct used to handle potential errors in query steps by returning a status record.",
"likes": 20,
"author": "Query_Guru"
},
{
"id": "table_functions_m",
"title": "M Table Functions",
"category": "Power Query M",
"description": "A category of functions for constructing, transforming, and manipulating table objects, such as Table.AddColumn.",
"likes": 47,
"author": "Query_Guru"
},
{
"id": "list_functions_m",
"title": "M List Functions",
"category": "Power Query M",
"description": "Functions for creating and managing ordered sequences of values, including List.Sum and List.Select.",
"likes": 32,
"author": "Query_Guru"
},
{
"id": "dax_language",
"title": "DAX Language",
"category": "DAX",
"description": "Data Analysis Expressions; a library of functions used to create formulas in Power BI semantic models and Analysis Services.",
"likes": 58,
"author": "DAX_Diva"
},
{
"id": "dax_iterators",
"title": "DAX Iterators",
"category": "DAX",
"description": "A category of DAX functions (like SUMX) that loop through a table to perform row-level logic.",
"likes": 39,
"author": "DAX_Diva"
},
{
"id": "row_level_security",
"title": "Row-Level Security (RLS)",
"category": "Security & Governance",
"description": "A security feature that filters data visibility at the row level based on user identity or group membership.",
"likes": 42,
"author": "Security_Sentinel"
},
{
"id": "object_level_security",
"title": "Object-Level Security (OLS)",
"category": "Security & Governance",
"description": "Controls that restrict access to sensitive tables or columns within a Power BI semantic model.",
"likes": 25,
"author": "Security_Sentinel"
},
{
"id": "sensitivity_labels",
"title": "Sensitivity Labels",
"category": "Security & Governance",
"description": "Information classification tags used to protect and govern sensitive content throughout the Fabric platform.",
"likes": 19,
"author": "Security_Sentinel"
},
{
"id": "endorsement",
"title": "Fabric Endorsement",
"category": "Security & Governance",
"description": "The process of labeling items as Promoted or Certified to signify they are high-quality, trusted data sources.",
"likes": 27,
"author": "CloudArchitect"
},
{
"id": "onelake_catalog",
"title": "OneLake Catalog",
"category": "Security & Governance",
"description": "A searchable repository for discovering all data assets and items available across the enterprise OneLake.",
"likes": 31,
"author": "Fabric_Expert"
},
{
"id": "m_accessing_data_functions",
"title": "M Accessing Data Functions",
"category": "Power Query M",
"description": "Category of functions for connecting to external sources like Access.Database or AzureStorage.Blobs. [1]",
"likes": 14,
"author": "Query_Guru"
},
{
"id": "m_binary_functions",
"title": "M Binary Functions",
"category": "Power Query M",
"description": "Functions used to read and manipulate binary data streams and formats like Binary.Buffer. [2]",
"likes": 11,
"author": "Query_Guru"
},
{
"id": "m_combiner_functions",
"title": "M Combiner Functions",
"category": "Power Query M",
"description": "Functions used to merge values, such as combining lists of text with delimiters. [3]",
"likes": 16,
"author": "Query_Guru"
},
{
"id": "m_comparer_functions",
"title": "M Comparer Functions",
"category": "Power Query M",
"description": "Functions that test for equality and determine the relative sort order of values. [4]",
"likes": 9,
"author": "Query_Guru"
},
{
"id": "m_date_functions",
"title": "M Date Functions",
"category": "Power Query M",
"description": "Functions for creating and calculating properties of date values, such as Date.AddDays. [5]",
"likes": 22,
"author": "Query_Guru"
},
{
"id": "m_datetime_functions",
"title": "M DateTime Functions",
"category": "Power Query M",
"description": "Functions used to manipulate combined date and time values. [6]",
"likes": 17,
"author": "Query_Guru"
},
{
"id": "m_datetimezone_functions",
"title": "M DateTimeZone Functions",
"category": "Power Query M",
"description": "Functions specifically for handling date/time values with time zone offset data. [7]",
"likes": 13,
"author": "Query_Guru"
},
{
"id": "m_duration_functions",
"title": "M Duration Functions",
"category": "Power Query M",
"description": "Functions for calculating and manipulating lengths of time intervals. [8]",
"likes": 15,
"author": "Query_Guru"
},
{
"id": "m_error_handling_functions",
"title": "M Error Handling Functions",
"category": "Power Query M",
"description": "Category of functions used to construct, trace, and manage error records like Error.Record. [9]",
"likes": 10,
"author": "Query_Guru"
},
{
"id": "m_expression_functions",
"title": "M Expression Functions",
"category": "Power Query M",
"description": "Functions that allow the construction and evaluation of M code as text strings. [10]",
"likes": 12,
"author": "Query_Guru"
},
{
"id": "m_function_values",
"title": "M Function Values",
"category": "Power Query M",
"description": "A category for functions that can create or invoke other function objects. [11]",
"likes": 14,
"author": "Query_Guru"
},
{
"id": "m_lines_functions",
"title": "M Lines Functions",
"category": "Power Query M",
"description": "Functions that convert between text and lists of strings based on line break logic. [12]",
"likes": 8,
"author": "Query_Guru"
},
{
"id": "m_logical_functions",
"title": "M Logical Functions",
"category": "Power Query M",
"description": "Functions for creating and manipulating Boolean true/false logic. [13]",
"likes": 20,
"author": "Query_Guru"
},
{
"id": "m_number_functions",
"title": "M Number Functions",
"category": "Power Query M",
"description": "Broad category for arithmetic, mathematical, and number conversion logic. [14]",
"likes": 26,
"author": "Query_Guru"
},
{
"id": "m_record_functions",
"title": "M Record Functions",
"category": "Power Query M",
"description": "Functions for selecting, adding, or transforming fields within record objects. [15]",
"likes": 21,
"author": "Query_Guru"
},
{
"id": "m_replacer_functions",
"title": "M Replacer Functions",
"category": "Power Query M",
"description": "Specific functions used in transform operations to find and replace values. [16]",
"likes": 12,
"author": "Query_Guru"
},
{
"id": "m_splitter_functions",
"title": "M Splitter Functions",
"category": "Power Query M",
"description": "Functions that split text values into lists based on delimiters or lengths. [16]",
"likes": 15,
"author": "Query_Guru"
},
{
"id": "m_text_functions",
"title": "M Text Functions",
"category": "Power Query M",
"description": "Category for manipulating, cleaning, and formatting Unicode text data. [17]",
"likes": 33,
"author": "Query_Guru"
},
{
"id": "m_time_functions",
"title": "M Time Functions",
"category": "Power Query M",
"description": "Functions for working with specific time-of-day values. [17]",
"likes": 14,
"author": "Query_Guru"
},
{
"id": "m_type_functions",
"title": "M Type Functions",
"category": "Power Query M",
"description": "Functions for defining and inspecting data types within expressions. [17]",
"likes": 11,
"author": "Query_Guru"
},
{
"id": "m_uri_functions",
"title": "M Uri Functions",
"category": "Power Query M",
"description": "Functions used to handle web URIs and network-based data access strings. [17]",
"likes": 7,
"author": "Query_Guru"
},
{
"id": "m_value_functions",
"title": "M Value Functions",
"category": "Power Query M",
"description": "Generic functions that can operate on any type of M value. [17]",
"likes": 13,
"author": "Query_Guru"
},
{
"id": "dax_windowing",
"title": "DAX Window Functions",
"category": "DAX",
"description": "Advanced functions for performing calculations across specified windows of data rows. [18]",
"likes": 25,
"author": "DAX_Diva"
},
{
"id": "dax_iterators",
"title": "DAX Table Iterators",
"category": "DAX",
"description": "Functions that execute logic by iterating through every row of a specified table. [18]",
"likes": 19,
"author": "DAX_Diva"
},
{
"id": "pbi_narrative_copilot",
"title": "PBI Narrative with Copilot",
"category": "AI Capabilities",
"description": "An AI-powered visual that generates written summaries and insights based on report data. [19]",
"likes": 54,
"author": "PBI_Pro"
},
{
"id": "pbi_bookmarks",
"title": "Bookmarks",
"category": "Power BI Concepts",
"description": "A feature used to save the specific state of a report page for presentations. [20]",
"likes": 32,
"author": "PBI_Pro"
},
{
"id": "pbi_drillthrough",
"title": "Drillthrough Navigation",
"category": "Power BI Concepts",
"description": "A feature allowing users to navigate from summary charts to detailed data pages. [20]",
"likes": 27,
"author": "PBI_Pro"
},
{
"id": "pbi_forecasting",
"title": "Forecasting",
"category": "Power BI Concepts",
"description": "A tool that uses built-in ML models to predict future data trends based on history. [21]",
"likes": 40,
"author": "PBI_Pro"
},
{
"id": "onelake_file_explorer",
"title": "OneLake File Explorer",
"category": "Fabric Platform",
"description": "A Windows tool for managing and browsing OneLake files locally on a workstation. [22]",
"likes": 44,
"author": "Fabric_Expert"
},
{
"id": "workspace_roles",
"title": "Workspace Roles",
"category": "Security & Governance",
"description": "Permissions tiers (Admin, Member, Contributor, Viewer) for Fabric workspace items. [23]",
"likes": 18,
"author": "Security_Sentinel"
},
{
"id": "fabric_ontology",
"title": "Business Ontology",
"category": "Fabric Platform",
"description": "A definition of standard business terms and concepts used across Fabric IQ. [24]",
"likes": 14,
"author": "Fabric_Expert"
},
{
"id": "data_agents",
"title": "Data Agents",
"category": "Fabric Platform",
"description": "Connectors that bind business ontology terms to physical data sources in Fabric IQ. [24]",
"likes": 12,
"author": "Fabric_Expert"
},
{
"id": "fabric_graph",
"title": "Fabric Graph",
"category": "Fabric Platform",
"description": "A visualization tool showing relationships between business concepts and datasets. [24]",
"likes": 16,
"author": "Fabric_Expert"
},
{
"id": "tom_tabular_object_model",
"title": "TOM (Tabular Object Model)",
"category": "Power BI Concepts",
"description": "A programmable API used to manage the metadata and logic of semantic models. [25]",
"likes": 23,
"author": "PBI_Pro"
},
{
"id": "tmsl_tabular_scripting",
"title": "TMSL (Tabular Model Scripting Language)",
"category": "Power BI Concepts",
"description": "A command language for defining and updating tabular model structures. [25]",
"likes": 19,
"author": "PBI_Pro"
},
{
"id": "onelake_data_sharing",
"title": "OneLake Data Sharing",
"category": "Fabric Platform",
"description": "Enables providing access to OneLake data items to external users across tenants. [26]",
"likes": 30,
"author": "Security_Sentinel"
},
{
"id": "sql_db_virtualization",
"title": "SQL DB Virtualization",
"category": "Fabric Workloads",
"description": "Simplifies data management by allowing SQL items to reference data without copying. [27]",
"likes": 21,
"author": "CloudArchitect"
},
{
"id": "copilot_for_sql",
"title": "Copilot for SQL Database",
"category": "AI Capabilities",
"description": "An AI assistant specialized in generating and optimizing T-SQL queries in Fabric. [27]",
"likes": 48,
"author": "CloudArchitect"
},
{
"id": "pbi_custom_tooltips",
"title": "Custom Tooltips",
"category": "Power BI Concepts",
"description": "Enhanced visuals that display detailed context when hovering over chart elements. [20]",
"likes": 34,
"author": "PBI_Pro"
},
{
"id": "pbi_sync_slicers",
"title": "Sync Slicers",
"category": "Power BI Concepts",
"description": "A feature ensuring filtering selections are consistent across multiple report pages. [20]",
"likes": 29,
"author": "PBI_Pro"
},
{
"id": "pbi_narrative_visual",
"title": "Narrative Visual",
"category": "Power BI Concepts",
"description": "Generates natural-language summaries of data directly within a report page. [19]",
"likes": 37,
"author": "PBI_Pro"
},
{
"id": "fabric_industry_solutions",
"title": "Industry Solutions",
"category": "Fabric Workloads",
"description": "Pre-configured templates and analytics patterns for specific industrial sectors. [28]",
"likes": 15,
"author": "CloudArchitect"
},
{
"id": "fabric_admin_portal",
"title": "Fabric Admin Portal",
"category": "Fabric Platform",
"description": "The central management interface for tenant-level settings and capacity controls. [28, 29]",
"likes": 20,
"author": "Security_Sentinel"
},
{
"id": "onelake_delta_parquet",
"title": "Delta Parquet Format",
"category": "Fabric Platform",
"description": "The open storage standard used to ensure data interoperability across all engines. [30]",
"likes": 42,
"author": "Fabric_Expert"
},
{
"id": "pbi_large_model_storage",
"title": "Large Model Storage",
"category": "Power BI Concepts",
"description": "A storage format configuration used to support datasets exceeding standard limits. [18]",
"likes": 28,
"author": "PBI_Pro"
},
{
"id": "ds_ml_experiments",
"title": "ML Experiments",
"category": "Data Science",
"description": "A tracking tool for comparing metrics and parameters across machine learning runs. [31]",
"likes": 24,
"author": "Data_Science_Sage"
},
{
"id": "ds_model_scoring",
"title": "Model Scoring",
"category": "Data Science",
"description": "The process of using a trained ML model to generate predictions on new data. [31]",
"likes": 33,
"author": "Data_Science_Sage"
},
{
"id": "m_record_fields",
"title": "M Record Fields",
"category": "Power Query M",
"description": "The name-value pairs that constitute the structure of a Power Query record. [32]",
"likes": 11,
"author": "Query_Guru"
},
{
"id": "m_lazy_records",
"title": "M Lazy Records",
"category": "Power Query M",
"description": "M handles cyclic values by keeping record and list construction lazy. [33]",
"likes": 9,
"author": "Query_Guru"
}
],
"edges": [
{ "from": "databricks", "to": "azure_fabric", "label": "feeds data into" },
{ "from": "azure_ai", "to": "azure_fabric", "label": "adds AI capabilities to" },
{ "from": "onelake", "to": "azure_fabric", "label": "serves as data foundation for" },
{ "from": "data_factory_workload", "to": "azure_fabric", "label": "integrates data for" },
{ "from": "lakehouse", "to": "onelake", "label": "stores data in" },
{ "from": "data_warehouse_workload", "to": "onelake", "label": "stores data in" },
{ "from": "power_bi_workload", "to": "onelake", "label": "queries data via Direct Lake from" },
{ "from": "fabric_workspace", "to": "fabric_tenant", "label": "belongs to" },
{ "from": "fabric_data_item", "to": "fabric_workspace", "label": "is created within" },
{ "from": "onelake_shortcut", "to": "onelake", "label": "virtualizes data in" },
{ "from": "data_integration", "to": "onelake", "label": "lands data into" },
{ "from": "eventstream", "to": "eventhouse", "label": "routes streaming data to" },
{ "from": "eventhouse", "to": "onelake", "label": "is stored within" },
{ "from": "semantic_model", "to": "power_bi_workload", "label": "is the data source for" },
{ "from": "direct_lake_mode", "to": "onelake", "label": "reads directly from" },
{ "from": "fabric_copilot", "to": "azure_fabric", "label": "provides AI assistance across" },
{ "from": "power_query_m", "to": "dataflow_gen2", "label": "is the engine for" },
{ "from": "dax_language", "to": "semantic_model", "label": "defines calculations in" },
{ "from": "row_level_security", "to": "semantic_model", "label": "protects data in" },
{ "from": "onelake_data_sharing", "to": "fabric_tenant", "label": "allows access outside of" }
]
};