const INITIAL_health_KNOWLEDGE_BASE =
{
  "topics": [
    {
      "id": "preload_physiology",
      "title": "Preload and Ventricular Filling",
      "category": "Hemodynamic Monitoring",
      "description": "The degree of stretch on the muscle fibers at the end of diastole. It is influenced by venous return and total blood volume.",
      "likes": 850,
      "author": "Jerlin_Priya"
    },
    {
      "id": "afterload_resistance",
      "title": "Afterload and Systemic Vascular Resistance",
      "category": "Hemodynamic Monitoring",
      "description": "The resistance the heart must pump against to eject blood. High afterload increases myocardial oxygen demand.",
      "likes": 820,
      "author": "Jerlin_Priya"
    },
    {
      "id": "contractility_inotropy",
      "title": "Myocardial Contractility",
      "category": "Hemodynamic Monitoring",
      "description": "The inherent ability of the myocardium to shorten and pump blood, independent of preload and afterload.",
      "likes": 790,
      "author": "Jerlin_Priya"
    },
    {
      "id": "cardiac_output_calc",
      "title": "Cardiac Output (CO) Determination",
      "category": "Hemodynamic Monitoring",
      "description": "Calculated as Stroke Volume multiplied by Heart Rate. It is the central determinant of systemic oxygen delivery (DO2).",
      "likes": 910,
      "author": "Jerlin_Priya"
    },
    {
      "id": "news2_parameters",
      "title": "NEWS2 Scoring Parameters",
      "category": "Early Warning Scores",
      "description": "Uses weighted scoring of respiratory rate, oxygen saturation, systolic BP, heart rate, temperature, and level of consciousness.",
      "likes": 950,
      "author": "Royal_College_Physicians"
    },
    {
      "id": "mews_readmission_risk",
      "title": "MEWS and ICU Readmission",
      "category": "Early Warning Scores",
      "description": "The Modified Early Warning Score is used to predict deterioration and the risk of readmission for patients transferring from the ICU.",
      "likes": 640,
      "author": "Tien_et_al"
    },
    {
      "id": "distributive_shock_sepsis",
      "title": "Distributive Shock Phenotype",
      "category": "Shock Management",
      "description": "Characterized by systemic vasodilation, relative hypotension, and warm peripheries in early stages, often septic in origin.",
      "likes": 770,
      "author": "Monnet_et_al"
    },
    {
      "id": "cardiogenic_shock_failure",
      "title": "Cardiogenic Shock Management",
      "category": "Shock Management",
      "description": "Resulting from impaired myocardial contractility; findings include elevated JVP, crackles, and low mixed venous oxygen saturation (SvO2).",
      "likes": 810,
      "author": "Baldetti"
    },
    {
      "id": "obstructive_shock_rapid_dx",
      "title": "Obstructive Shock Recognition",
      "category": "Shock Management",
      "description": "Caused by sudden mechanical interference (e.g., PE, tamponade, tension pneumothorax) leading to hypotension and high clinical urgency.",
      "likes": 740,
      "author": "Monnet_et_al"
    },
    {
      "id": "lactate_perfusion_marker",
      "title": "Serum Lactate and Microcirculation",
      "category": "Hemodynamic Monitoring",
      "description": "An indicator of tissue oxygenation and hypoperfusion that remains critical even when blood pressure appears stable.",
      "likes": 980,
      "author": "Monnet_et_al"
    },
    {
      "id": "pulse_pressure_variation",
      "title": "Dynamic Fluid Responsiveness (PPV)",
      "category": "Hemodynamic Monitoring",
      "description": "More reliable than static CVP; evaluates changes in stroke volume during mechanical ventilation to predict fluid needs.",
      "likes": 720,
      "author": "Kulkarni_et_al"
    },
    {
      "id": "passive_leg_raise_test",
      "title": "Passive Leg Raise (PLR) Test",
      "category": "Critical Care Skills",
      "description": "A dynamic maneuver used to assess fluid responsiveness by increasing venous return without administering external fluid.",
      "likes": 880,
      "author": "Monnet_et_al"
    },
    {
      "id": "phlebostatic_axis_leveling",
      "title": "Transducer Leveling and the Phlebostatic Axis",
      "category": "Hemodynamic Monitoring",
      "description": "Critical nursing responsibility involving the positioning of transducers at the 4th intercostal space, mid-axillary line for accurate pressure readings.",
      "likes": 830,
      "author": "McEachron_et_al"
    },
    {
      "id": "arterial_line_overdamping",
      "title": "Arterial Waveform Troubleshooting",
      "category": "Hemodynamic Monitoring",
      "description": "Identifying damped or artifact-laden signals to ensure the systolic and diastolic values reflect true physiologic change.",
      "likes": 610,
      "author": "McEachron_et_al"
    },
    {
      "id": "cr_itp_standard",
      "title": "Individualized Treatment Plan (ITP)",
      "category": "Cardiac Rehabilitation",
      "description": "A holistic plan documented in the medical record, signed by a physician, and updated every 30 days to guide recovery and risk reduction.",
      "likes": 940,
      "author": "AHA_AACVPR"
    },
    {
      "id": "nutritional_counseling_smart",
      "title": "Nutritional SMART Goals",
      "category": "Cardiac Rehabilitation",
      "description": "Specific, Measurable, Attainable, Relevant, and Time-bound dietary behaviors prioritizing changes in saturated fats, sodium, and portion sizes.",
      "likes": 690,
      "author": "Van_Horn_et_al"
    },
    {
      "id": "weight_vs_body_composition",
      "title": "Body Composition Assessment",
      "category": "Cardiac Rehabilitation",
      "description": "Moving beyond BMI to assess lean mass vs. fat mass; includes waist circumference as a feasible remote measurement tool.",
      "likes": 530,
      "author": "AHA_AACVPR"
    },
    {
      "id": "blood_pressure_target_2024",
      "title": "BP Targets in Secondary Prevention",
      "category": "Cardiac Rehabilitation",
      "description": "Expected outcomes for patients in CR are a Systolic BP <130 mm Hg and Diastolic BP <80 mm Hg.",
      "likes": 900,
      "author": "Whelton_et_al"
    },
    {
      "id": "dyslipidemia_ldl_goals",
      "title": "LDL Cholesterol Goals",
      "category": "Cardiac Rehabilitation",
      "description": "Patients with ASCVD should aim for LDL <70 mg/dL, and <55 mg/dL if at very high risk.",
      "likes": 840,
      "author": "Grundy_et_al"
    },
    {
      "id": "psychosocial_depression_risk",
      "title": "Depression and CVD Outcomes",
      "category": "Cardiac Rehabilitation",
      "description": "Clinical depression portends a higher risk of adverse outcomes and lower CR completion rates; requires assessment and referral.",
      "likes": 710,
      "author": "Levine_et_al"
    },
    {
      "id": "borg_rpe_scale",
      "title": "Borg Scale of Perceived Exertion",
      "category": "Exercise Physiology",
      "description": "A 6–20 scale used to monitor exercise intensity; moderate is typically 12–13, while vigorous is 14–16.",
      "likes": 890,
      "author": "Borg_GA"
    },
    {
      "id": "talk_test_intensity",
      "title": "The Talk Test in Exercise Prescription",
      "category": "Exercise Physiology",
      "description": "A practical tool for identifying exercise intensity when objective graded exercise testing is unavailable.",
      "likes": 650,
      "author": "Reed_and_Pipe"
    },
    {
      "id": "one_rm_strength_testing",
      "title": "1-Repetition Maximum (1-RM) Testing",
      "category": "Strength Training",
      "description": "The gold standard for prescribing resistance exercise intensity to improve metabolism and functional independence.",
      "likes": 420,
      "author": "AHA_AACVPR"
    },
    {
      "id": "frailty_tug_test",
      "title": "Timed Up and Go (TUG) Test",
      "category": "Frailty Assessment",
      "description": "Used to identify fall risk; an older adult taking ≥12 seconds to rise, walk 3 meters, and sit is at high risk.",
      "likes": 560,
      "author": "Flint_et_al"
    },
    {
      "id": "sbar_escalation_protocol",
      "title": "SBAR for Deterioration Escalation",
      "category": "Clinical Communication",
      "description": "Structured framework (Situation, Background, Assessment, Recommendation) to clearly articulate EWS trends and hemodynamic findings to RRT.",
      "likes": 1000,
      "author": "Jerlin_Priya"
    },
    {
      "id": "advanced_ecg_acs",
      "title": "ECG in Acute Coronary Syndromes",
      "category": "Clinical Skills",
      "description": "Identifying ST-segment subtleties, T-wave inversions, and pathological Q-waves to distinguish types of myocardial infarction.",
      "likes": 870,
      "author": "CIPHER_Medical"
    },
    {
      "id": "electrolyte_imbalance_ecg",
      "title": "Electrolyte Effects on Cardiac Rhythms",
      "category": "Clinical Skills",
      "description": "Recognizing ECG manifestations of potassium (peaked T-waves) and calcium imbalances to prevent lethal arrhythmias.",
      "likes": 780,
      "author": "CIPHER_Medical"
    },
    {
      "id": "cmc_eligibility_standard",
      "title": "CMC Certification Eligibility",
      "category": "Nursing Professionalism",
      "description": "Requires 1,750–2,000 direct care hours in the previous 2–5 years, with specific hours dedicated to acutely ill cardiac patients.",
      "likes": 500,
      "author": "AACN"
    },
    {
      "id": "cvrn_level_differences",
      "title": "CVRN Level 1 vs. Level 2",
      "category": "Nursing Professionalism",
      "description": "Level 1 is for non-acute settings (rehab, clinics); Level 2 is for acute/critical settings (CVICU, interventional cardiology).",
      "likes": 620,
      "author": "ABCM"
    },
    {
      "id": "magnet_program_nursing",
      "title": "Magnet Recognition and CMC",
      "category": "Nursing Professionalism",
      "description": "CMC certification is formally accepted by the Magnet Recognition Program as evidence of clinical excellence.",
      "likes": 440,
      "author": "AACN"
    }
  ],
  "edges": [
    { "from": "preload_physiology", "to": "cardiac_output_calc", "label": "component of" },
    { "from": "news2_parameters", "to": "sbar_escalation_protocol", "label": "communicated via" },
    { "from": "distributive_shock_sepsis", "to": "lactate_perfusion_marker", "label": "monitored with" },
    { "from": "cr_itp_standard", "to": "borg_rpe_scale", "label": "includes" },
    { "from": "cmc_eligibility_standard", "to": "magnet_program_nursing", "label": "qualifies for" },
    { "from": "frailty_tug_test", "to": "weight_vs_body_composition", "label": "complements assessment of" }
  ]
};