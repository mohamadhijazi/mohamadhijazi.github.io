/* ==========================================
   EduJS - Core Application Script
   ========================================== */

// Translation Dictionary for Multilingual Support
// Translation Dictionary for Multilingual Support
const TRANSLATIONS = {
  en: {
    nav_feed: "Feed",
    nav_labs: "Labs",
    nav_graph: "Graph",
    nav_chatbot: "AI Chat",
    nav_settings: "Settings",
    feed_title: "Educational Feed",
    labs_title: "Interactive Labs",
    graph_title: "Knowledge Graph",
    chatbot_title: "AI Guided Creator",
    settings_title: "Application Settings",
    search_placeholder: "Search topics, categories, or keywords...",
    cat_all: "All",
    cat_tech: "Tech & Enterprise",
    cat_science: "Science",
    cat_math: "Math",
    cat_biology: "Biology",
    cat_physics: "Physics",
    cat_chemistry: "Chemistry",
    cat_history: "History",
    comments_heading: "Comments",
    add_comment_placeholder: "Write a reply...",
    comment_post_btn: "Post",
    set_heading_ui: "Interface Adjustments",
    set_theme_title: "Theme Mode",
    set_theme_desc: "Switch between immersive dark mode and high contrast light mode.",
    set_theme_toggle_btn: "Toggle Theme",
    set_lang_title: "Interface Language",
    set_lang_desc: "Modify the UI translations for titles, placeholders, and buttons.",
    set_heading_sync: "Wi-Fi Knowledge Sharing",
    set_sync_desc: "Export data to back up or share your graph. Drag & drop the JSON file on other family devices to merge.",
    set_btn_export: "Export Graph JSON",
    set_btn_import: "Import Graph JSON",
    set_btn_reset: "Reset to Defaults",
    set_heading_stats: "Knowledge Base Status",
    set_stat_nodes: "Total Nodes",
    set_stat_edges: "Total Connections",
    set_stat_likes: "Total Feed Likes",
    bot_online: "Guided Creator Wizard",
    chat_placeholder: "Type your answer and press Enter...",
    chat_send: "Send",
    node_connections: "Connected Concepts",
    node_view_post: "View in Feed",
    graph_repulsion: "Elastic Repulsion:",
    // Labs UI Keys
    lab_geometry: "📐 Geometry",
    lab_physics: "⚡ Physics",
    lab_biology: "🫁 Biology",
    lab_chemistry: "🧪 Chemistry",
    lab_geography: "🗺️ Geography",
    lab_code: "💻 Code Sandbox",
    geom_triangle_title: "Draggable Triangle Solver",
    geom_triangle_desc: "Drag points A, B, and C to reshape the triangle. Coordinates, side lengths, angles, and area update in real-time.",
    geom_side_a: "Side AB",
    geom_side_b: "Side BC",
    geom_side_c: "Side CA",
    geom_area: "Area",
    geom_calc_title: "Function Graphing Calculator",
    geom_calc_desc: "Plot customized mathematical functions. Write an algebraic equation in terms of `x` (e.g. `Math.sin(x) * 5` or `0.05 * x * x`).",
    geom_formula_lbl: "f(x) = ",
    geom_plot_btn: "Plot",
    phys_gravity_title: "Gravity Drop Zone (v = gt)",
    phys_gravity_desc: "Simulate falling objects in real time. Adjust local gravity (Earth vs Moon vs Space) and mass, and track drop speeds.",
    phys_gravity_lbl: "Gravity:",
    phys_mass_lbl: "Mass:",
    phys_drop_btn: "Drop Object",
    phys_reset_btn: "Reset",
    phys_time: "Time (t)",
    phys_velocity: "Velocity (v)",
    phys_height: "Distance (d)",
    phys_force_title: "Force, Mass & Friction (F = ma)",
    phys_force_desc: "Push a block along a friction plane. See how force, mass, and surface friction dictate acceleration and velocity.",
    phys_force_lbl: "Pushing Force:",
    phys_friction_lbl: "Friction Coeff:",
    phys_push_btn: "Push / Stop",
    phys_accel: "Accel (a)",
    phys_speed: "Speed (v)",
    bio_systems_title: "Human Body Systems Navigator",
    bio_systems_desc: "Select a biological system below. Click components on the SVG layout to view interactive details and run neon system animations.",
    bio_sys_respiratory: "🫁 Respiratory",
    bio_sys_circulatory: "❤️ Circulatory",
    bio_sys_nervous: "🧠 Nervous",
    bio_sys_digestive: "🍕 Digestive",
    bio_key_organs: "Key Organs",
    bio_fun_fact_lbl: "Fun Fact:",
    bio_animate_btn: "Trigger Animation",
    chem_title: "Chemical Titration & Reactions",
    chem_desc: "Experiment with acids, bases, and indicators. Observe pH adjustments, color indicators, neutralization reactions, and gas releases.",
    chem_reset_btn: "Wash Beaker",
    chem_log_title: "Reactivity Log",
    chem_ph: "pH Level",
    chem_state: "State",
    chem_equation: "Active Reaction Equation",
    chem_reactions_tested: "Reaction Log",
    geo_map_title: "Interactive Global Map",
    geo_map_desc: "Explore countries, cities, ports, supply chain routes, and weather patterns. Use compass to navigate directions.",
    geo_compass_title: "Navigation Compass",
    geo_compass_desc: "Real-time compass showing cardinal directions. Select locations to view details and weather information.",
    geo_zoom: "Zoom:",
    geo_layers: "Display Layers:",
    geo_reset: "Reset View",
    geo_selected_location: "Selected Location:",
    sandbox_editor: "Code Sandbox Editor",
    sandbox_preview: "Live Preview Output",
    set_heading_notifications: "Activity Simulator & Notifications",
    set_notifications_desc: "Simulate periodic educational updates. Enabling browser notifications will fire standard OS popups when you are tagged or receive comment replies.",
    set_notify_perm_title: "Browser OS Alerts",
    set_notify_perm_desc: "Request permission to display standard system push notifications.",
    set_notify_sim_title: "Trigger Hourly Action Now",
    set_notify_sim_desc: "Manually trigger a random network activity (e.g. tag, comment, or reply) to test notifications instantly."
  },
  ar: {
    nav_feed: "المنشورات",
    nav_labs: "المختبرات",
    nav_graph: "خارطة المعرفة",
    nav_chatbot: "المساعد الذكي",
    nav_settings: "الإعدادات",
    feed_title: "منصة التعليم التفاعلي",
    labs_title: "المختبرات العلمية",
    graph_title: "شبكة العلوم المترابطة",
    chatbot_title: "منشئ المحتوى التفاعلي",
    settings_title: "إعدادات التطبيق",
    search_placeholder: "ابحث عن موضوع، تصنيف، أو كلمة دلالية...",
    cat_all: "الكل",
    cat_tech: "التكنولوجيا والأعمال",
    cat_science: "العلوم العامة",
    cat_math: "الرياضيات",
    cat_biology: "الأحياء",
    cat_physics: "الفيزياء",
    cat_chemistry: "الكيمياء",
    cat_history: "التاريخ",
    comments_heading: "التعليقات",
    add_comment_placeholder: "اكتب تعليقاً...",
    comment_post_btn: "نشر",
    set_heading_ui: "تخصيص الواجهة",
    set_theme_title: "مظهر التطبيق",
    set_theme_desc: "التبديل بين الوضع المظلم الغامر ووضع الإضاءة عالي التباين.",
    set_theme_toggle_btn: "تغيير المظهر",
    set_lang_title: "لغة التطبيق",
    set_lang_desc: "تغيير لغة العرض للعلامات والعناوين ومطالبات المساعد.",
    set_heading_sync: "مشاركة المعرفة عبر الواي فاي",
    set_sync_desc: "قم بتصدير البيانات لمزامنتها أو حفظها. اسحب ملف JSON وضعه على أجهزة العائلة الأخرى للدمج.",
    set_btn_export: "تصدير ملف JSON",
    set_btn_import: "استيراد ملف JSON",
    set_btn_reset: "استعادة الافتراضي",
    set_heading_stats: "إحصائيات المعرفة",
    set_stat_nodes: "إجمالي المواضيع",
    set_stat_edges: "إجمالي الروابط",
    set_stat_likes: "إجمالي الإعجابات",
    bot_online: "منشئ المواضيع الذكي",
    chat_placeholder: "اكتب إجابتك هنا واضغط Enter...",
    chat_send: "إرسال",
    node_connections: "المفاهيم المرتبطة",
    node_view_post: "عرض في المنشورات",
    graph_repulsion: "قوة التنافر المتبادل:",
    lab_geometry: "📐 الهندسة",
    lab_physics: "⚡ الفيزياء",
    lab_biology: "🫁 الأحياء",
    lab_chemistry: "🧪 الكيمياء",
    lab_geography: "🗺️ الجغرافيا",
    lab_code: "💻 بيئة الأكواد",
    geom_triangle_title: "محلل المثلث التفاعلي",
    geom_triangle_desc: "قم بسحب النقاط A و B و C لتغيير شكل المثلث. يتم تحديث الإحداثيات وأطوال الأضلاع والمساحة فوراً.",
    geom_side_a: "الضلع AB",
    geom_side_b: "الضلع BC",
    geom_side_c: "الضلع CA",
    geom_area: "المساحة",
    geom_calc_title: "رسم المعادلات البيانية",
    geom_calc_desc: "قم برسم دوال رياضية مخصصة. اكتب معادلة بدلالة `x` (مثل: `Math.sin(x) * 5` ).",
    geom_formula_lbl: "د(س) = ",
    geom_plot_btn: "رسم",
    phys_gravity_title: "منطقة السقوط الحر الجاذبية",
    phys_gravity_desc: "قم بمحاكاة الأجسام الساقطة. غير قوة الجاذبية (الأرض مقابل القمر) والكتلة وتابع السرعة المتغيرة.",
    phys_gravity_lbl: "الجاذبية:",
    phys_mass_lbl: "الكتلة:",
    phys_drop_btn: "إسقاط الجسم",
    phys_reset_btn: "إعادة تعيين",
    phys_time: "الزمن (ث)",
    phys_velocity: "السرعة (م/ث)",
    phys_height: "المسافة (م)",
    phys_force_title: "القوة والكتلة والاحتكاك (ق = ك ت)",
    phys_force_desc: "ادفع كتلة على سطح ذي احتكاك. شاهد كيف تؤثر القوة والكتلة والاحتكاك على التسارع والسرعة.",
    phys_force_lbl: "قوة الدفع:",
    phys_friction_lbl: "معامل الاحتكاك:",
    phys_push_btn: "دفع / إيقاف",
    phys_accel: "التسارع (م/ث²)",
    phys_speed: "السرعة (م/ث)",
    bio_systems_title: "مستكشف أجهزة جسم الإنسان",
    bio_systems_desc: "اختر أحد أجهزة الجسم أدناه. انقر على الأعضاء لرؤية تفاصيلها وتشغيل الرسوم التوضيحية المتحركة.",
    bio_sys_respiratory: "🫁 الجهاز التنفسي",
    bio_sys_circulatory: "❤️ جهاز الدوران",
    bio_sys_nervous: "🧠 الجهاز العصبي",
    bio_sys_digestive: "🍕 الجهاز الهضمي",
    bio_key_organs: "الأعضاء الرئيسية",
    bio_fun_fact_lbl: "معلومة هامة:",
    bio_animate_btn: "تشغيل الرسوم المتحركة",
    chem_title: "التفاعلات الكيميائية والمعايرة",
    chem_desc: "اختبر تفاعل الأحماض والقواعد والكواشف. راقب مستويات pH وتغير الألوان وإطلاق الغازات.",
    chem_reset_btn: "غسيل الوعاء",
    chem_log_title: "سجل التفاعلات",
    chem_ph: "مستوى pH",
    chem_state: "الحالة",
    chem_equation: "معادلة التفاعل النشط",
    chem_reactions_tested: "سجل التفاعلات المنفذة",
    geo_map_title: "خريطة عالمية تفاعلية",
    geo_map_desc: "استكشف الدول والمدن والموانئ ومسارات سلسلة الإمداد وأنماط الطقس. استخدم البوصلة للتنقل بين الاتجاهات.",
    geo_compass_title: "بوصلة الملاحة",
    geo_compass_desc: "بوصلة في الوقت الفعلي تعرض الاتجاهات الأساسية. حدد المواقع لعرض التفاصيل ومعلومات الطقس.",
    geo_zoom: "التكبير:",
    geo_layers: "عرض الطبقات:",
    geo_reset: "إعادة تعيين الرؤية",
    geo_selected_location: "الموقع المحدد:",
    sandbox_editor: "محرر الأكواد التجريبي",
    sandbox_preview: "معاينة البث المباشر",
    set_heading_notifications: "محاكي النشاط والتنبيهات",
    set_notifications_desc: "محاكاة التحديثات التعليمية الدورية. سيؤدي تمكين تنبيهات المتصفح إلى إرسال إشعارات النظام عند الإشارة إليك أو تلقي ردود.",
    set_notify_perm_title: "تنبيهات النظام للمتصفح",
    set_notify_perm_desc: "طلب إذن لعرض إشعارات الدفع القياسية للنظام.",
    set_notify_sim_title: "محاكاة النشاط الآن",
    set_notify_sim_desc: "قم بتشغيل نشاط عشوائي (مثل الإشارة، التعليق، أو الرد) لاختبار الإشعارات فوراً."
  },
  fr: {
    nav_feed: "Flux",
    nav_labs: "Labos",
    nav_graph: "Graphe",
    nav_chatbot: "Chatbot AI",
    nav_settings: "Paramètres",
    feed_title: "Flux Éducatif",
    labs_title: "Laboratoires Interactifs",
    graph_title: "Graphe de Connaissances",
    chatbot_title: "Créateur Assisté par IA",
    settings_title: "Paramètres de l'App",
    search_placeholder: "Rechercher des sujets, catégories, mots clés...",
    cat_all: "Tout",
    cat_tech: "Tech & Entreprise",
    cat_science: "Sciences",
    cat_math: "Maths",
    cat_biology: "Biologie",
    cat_physics: "Physique",
    cat_chemistry: "Chimie",
    cat_history: "Histoire",
    comments_heading: "Commentaires",
    add_comment_placeholder: "Écrire une réponse...",
    comment_post_btn: "Publier",
    set_heading_ui: "Ajustements d'Interface",
    set_theme_title: "Mode Thème",
    set_theme_desc: "Basculez entre le mode sombre immersif et le mode clair à contraste élevé.",
    set_theme_toggle_btn: "Changer de thème",
    set_lang_title: "Langue de l'Interface",
    set_lang_desc: "Modifier les traductions pour les titres, boutons et invites.",
    set_heading_sync: "Partage de Données Local",
    set_sync_desc: "Exportez les données pour les sauvegarder ou les partager. Importez le fichier JSON sur d'autres appareils.",
    set_btn_export: "Exporter JSON",
    set_btn_import: "Importer JSON",
    set_btn_reset: "Réinitialiser",
    set_heading_stats: "Statut de la Base de Connaissances",
    set_stat_nodes: "Total Sujets",
    set_stat_edges: "Total Liens",
    set_stat_likes: "Total Likes",
    bot_online: "Assistant Créateur",
    chat_placeholder: "Tapez votre réponse et appuyez sur Entrée...",
    chat_send: "Envoyer",
    node_connections: "Concepts Connectés",
    node_view_post: "Voir dans le Flux",
    graph_repulsion: "Répulsion Élastique:",
    lab_geometry: "📐 Géométrie",
    lab_physics: "⚡ Physique",
    lab_biology: "🫁 Biologie",
    lab_chemistry: "🧪 Chimie",
    lab_geography: "🗺️ Géographie",
    lab_code: "💻 Sandbox Code",
    geom_triangle_title: "Solveur de Triangle",
    geom_triangle_desc: "Glissez les points A, B, C pour remodeler le triangle. Les coordonnées, longueurs et l'aire s'actualisent.",
    geom_side_a: "Côté AB",
    geom_side_b: "Côté BC",
    geom_side_c: "Côté CA",
    geom_area: "Aire",
    geom_calc_title: "Traceur de Fonctions",
    geom_calc_desc: "Tracez des équations en fonction de `x` (ex: `Math.sin(x) * 5`).",
    geom_formula_lbl: "f(x) = ",
    geom_plot_btn: "Tracer",
    phys_gravity_title: "Chute Libre & Gravité (v = gt)",
    phys_gravity_desc: "Simulez la chute d'un objet. Modifiez la gravité (Terre vs Lune) et la masse pour observer les vitesses.",
    phys_gravity_lbl: "Gravité:",
    phys_mass_lbl: "Masse:",
    phys_drop_btn: "Lâcher l'Objet",
    phys_reset_btn: "Réinitialiser",
    phys_time: "Temps (t)",
    phys_velocity: "Vitesse (v)",
    phys_height: "Distance (d)",
    phys_force_title: "Force, Masse & Friction (F = ma)",
    phys_force_desc: "Poussez un bloc sur un plan avec friction. Observez l'accélération résultante.",
    phys_force_lbl: "Force de Poussée:",
    phys_friction_lbl: "Coeff Friction:",
    phys_push_btn: "Pousser / Arrêter",
    phys_accel: "Accél (a)",
    phys_speed: "Vitesse (v)",
    bio_systems_title: "Anatomie Humaine Interactive",
    bio_systems_desc: "Sélectionnez un système organique. Cliquez sur les composants pour voir les informations et lancer l'animation.",
    bio_sys_respiratory: "🫁 Respiratoire",
    bio_sys_circulatory: "❤️ Circulatoire",
    bio_sys_nervous: "🧠 Nerveux",
    bio_sys_digestive: "🍕 Digestif",
    bio_key_organs: "Organes Clés",
    bio_fun_fact_lbl: "Fait Amusant:",
    bio_animate_btn: "Lancer l'Animation",
    chem_title: "Titrage & Réactions Chimiques",
    chem_desc: "Expérimentez avec des acides, bases et indicateurs. Observez le pH et les bulles de gaz.",
    chem_reset_btn: "Laver le Bêcher",
    chem_log_title: "Registre Chimique",
    chem_ph: "Niveau pH",
    chem_state: "État",
    chem_equation: "Équation de Réaction",
    chem_reactions_tested: "Registre de Réactions",
    geo_map_title: "Carte Mondiale Interactive",
    geo_map_desc: "Explorez les pays, villes, ports, routes commerciales et motifs météorologiques. Utilisez la boussole pour naviguer.",
    geo_compass_title: "Boussole de Navigation",
    geo_compass_desc: "Boussole en temps réel montrant les directions cardinales. Sélectionnez des emplacements pour voir les détails.",
    geo_zoom: "Zoom:",
    geo_layers: "Afficher les Couches:",
    geo_reset: "Réinitialiser la Vue",
    geo_selected_location: "Localisation Sélectionnée:",
    sandbox_editor: "Éditeur Code Sandbox",
    sandbox_preview: "Aperçu en Direct",
    set_heading_notifications: "Simulateur d'Activité & Notifications",
    set_notifications_desc: "Simuler des mises à jour périodiques. L'activation des notifications déclenchera des alertes OS lorsque vous êtes mentionné.",
    set_notify_perm_title: "Alertes Système OS",
    set_notify_perm_desc: "Demander l'autorisation d'afficher des notifications push système.",
    set_notify_sim_title: "Déclencher l'Action Simulée",
    set_notify_sim_desc: "Déclencher manuellement une activité réseau aléatoire pour tester les notifications instantanément."
  },
  ur: {
    nav_feed: "فیڈ",
    nav_labs: "لیبز",
    nav_graph: "علمی خاکہ",
    nav_chatbot: "چیٹ بوٹ",
    nav_settings: "سیٹنگز",
    feed_title: "تعلیمی فیڈ",
    labs_title: "تعلیمی لیبارٹریز",
    graph_title: "علمی نیٹ ورک",
    chatbot_title: "انٹرایکٹو تخلیق کار",
    settings_title: "ایپلی کیشن سیٹنگز",
    search_placeholder: "موضوع، زمرہ، یا کلیدی الفاظ تلاش کریں...",
    cat_all: "سب",
    cat_tech: "ٹکنالوجی اور بزنس",
    cat_science: "سائنس",
    cat_math: "ریاضی",
    cat_biology: "حیاتیات",
    cat_physics: "فزکس",
    cat_chemistry: "کیمسٹری",
    cat_history: "تاریخ",
    comments_heading: "تبصرے",
    add_comment_placeholder: "تبصرہ لکھیں...",
    comment_post_btn: "پوسٹ",
    set_heading_ui: "انٹرفیس ایڈجسٹمنٹ",
    set_theme_title: "تھیم موڈ",
    set_theme_desc: "تاریک موڈ اور روشن موڈ کے درمیان تبدیل کریں۔",
    set_theme_toggle_btn: "تھیم تبدیل کریں",
    set_lang_title: "ایپ کی زبان",
    set_lang_desc: "ٹائٹلز، بٹنز اور چیٹ بوٹ سوالات کا ترجمہ تبدیل کریں۔",
    set_heading_sync: "وائی فائی ڈیٹا شیئرنگ",
    set_sync_desc: "اپنا ڈیٹا ایکسپورٹ کریں۔ دوسرے ڈیوائسز پر امپورٹ کرنے کے لیے JSON فائل کا استعمال کریں۔",
    set_btn_export: "ایکسپورٹ JSON",
    set_btn_import: "امپورٹ JSON",
    set_btn_reset: "ری سیٹ کریں",
    set_heading_stats: "علمی ڈیٹا بیس کی حالت",
    set_stat_nodes: "کل موضوعات",
    set_stat_edges: "کل روابط",
    set_stat_likes: "کل لائیکس",
    bot_online: "آن لائن گائیڈ",
    chat_placeholder: "اپنا جواب لکھیں اور انٹر دبائیں...",
    chat_send: "بھیجیں",
    node_connections: "منسلک تصورات",
    node_view_post: "فیڈ میں دیکھیں",
    graph_repulsion: "باہمی پسپائی کی طاقت:",
    lab_geometry: "📐 جیومیٹری",
    lab_physics: "⚡ فزکس",
    lab_biology: "🫁 حیاتیات",
    lab_chemistry: "🧪 کیمسٹری",
    lab_geography: "🗺️ جغرافیہ",
    lab_code: "💻 کوڈ سینڈ باکس",
    geom_triangle_title: "جیومیٹری مثلث حل کار",
    geom_triangle_desc: "مثلث کو تبدیل کرنے کے لیے پوائنٹس A، B اور C کو کھینچیں۔ نقاط، لمبائی، اور رقبہ فوراً اپ ڈیٹ ہو جائیں گے۔",
    geom_side_a: "ضلع AB",
    geom_side_b: "ضلع BC",
    geom_side_c: "ضلع CA",
    geom_area: "رقبہ",
    geom_calc_title: "فنکشن گرافنگ کیلکولیٹر",
    geom_calc_desc: "ریاضی کے مساوات کا گراف بنائیں۔ `x` کی صورت میں کوئی مساوات لکھیں (جیسے `Math.sin(x) * 5`)۔",
    geom_formula_lbl: "f(x) = ",
    geom_plot_btn: "گراف بنائیں",
    phys_gravity_title: "کشش ثقل کا زون (v = gt)",
    phys_gravity_desc: "گرتی ہوئی اشیاء کی نقل کریں۔ کشش ثقل اور وزن کو تبدیل کر کے رفتار کا مشواد کریں۔",
    phys_gravity_lbl: "کشش ثقل:",
    phys_mass_lbl: "وزن (کلو):",
    phys_drop_btn: "آبجیکٹ گرائیں",
    phys_reset_btn: "ری سیٹ",
    phys_time: "وقت (سیکنڈ)",
    phys_velocity: "رفتار (میٹر/سیکنڈ)",
    phys_height: "فاصلہ (میٹر)",
    phys_force_title: "قوت، وزن اور رگڑ (F = ma)",
    phys_force_desc: "رگڑ والی سطح پر بلاک کو دھکیلیں۔ دیکھیں کہ قوت، وزن اور رگڑ اسپیڈ کو کیسے متاثر کرتے ہیں۔",
    phys_force_lbl: "دھکیلنے کی قوت:",
    phys_friction_lbl: "رگڑ کا عددی سر:",
    phys_push_btn: "دھکیلیں / روکیں",
    phys_accel: "اسراع (میٹر/سیکنڈ²)",
    phys_speed: "رفتار (میٹر/سیکنڈ)",
    bio_systems_title: "انسانی جسم کے نظام کا رہنما",
    bio_systems_desc: "نیچے سے کوئی نظام منتخب کریں۔ معلومات دیکھنے اور متحرک تصاویر چلانے کے لیے اعضاء پر کلک کریں۔",
    bio_sys_respiratory: "🫁 سانس کا نظام",
    bio_sys_circulatory: "❤️ خون کا نظام",
    bio_sys_nervous: "🧠 اعصابی نظام",
    bio_sys_digestive: "🍕 نظام ہضم",
    bio_key_organs: "اہم اعضاء",
    bio_fun_fact_lbl: "دلچسپ حقیقت:",
    bio_animate_btn: "حرکت شروع کریں",
    chem_title: "کیمیائی تعاملات اور مائع کی آمیزش",
    chem_desc: "تیزاب، اساس اور انڈیکیٹر کے ساتھ تجربہ کریں۔ پی ایچ کی تبدیلی اور رنگوں کا مشاہدہ کریں۔",
    chem_reset_btn: "برتن صاف کریں",
    chem_log_title: "کیمیائی لاگ بک",
    chem_ph: "پی ایچ لیول",
    chem_state: "حالت",
    chem_equation: "تعامل کا مساوات",
    chem_reactions_tested: "کیمیائی تجربات کا ریکارڈ",
    geo_map_title: "عالمی انٹرایکٹو نقشہ",
    geo_map_desc: "ممالک، شہروں، بندرگاہوں، سپلائی چین راستوں اور موسمی نمونوں کی تلاش کریں۔ سمت کے لیے قطب نما استعمال کریں۔",
    geo_compass_title: "نیویگیشن قطب نما",
    geo_compass_desc: "حقیقی وقت میں قطب نما شمال، جنوب، مشرق اور مغرب کو ظاہر کرتا ہے۔ مقامات منتخب کریں تفصیلات دیکھنے کے لیے۔",
    geo_zoom: "ज़ूم:",
    geo_layers: "تہیں دکھائیں:",
    geo_reset: "دوبارہ ترتیب دیں",
    geo_selected_location: "منتخب شدہ مقام:",
    sandbox_editor: "کوڈ ایڈیٹر",
    sandbox_preview: "لائیو پیش نظارہ",
    set_heading_notifications: "سرگرمی سمیلیٹر اور اطلاعات",
    set_notifications_desc: "وقتی تعلیمی اپ ڈیٹس کی نقل کریں۔ براؤزر کی اطلاعات کو فعال کرنے سے سسٹم الرٹس فائر ہوں گے جب آپ کو ٹیگ کیا جائے گا۔",
    set_notify_perm_title: "سسٹم پش الرٹس",
    set_notify_perm_desc: "سسٹم پش اطلاعات کو ڈسپلے کرنے کی اجازت طلب کریں۔",
    set_notify_sim_title: "سرگرمی شروع کریں",
    set_notify_sim_desc: "اطلاعات کو فوری طور پر جانچنے کے لیے ایک یادش باری نیٹ ورک سرگرمی شروع کریں۔"
  },
  es: {
    nav_feed: "Inicio",
    nav_labs: "Laboratorios",
    nav_graph: "Grafo",
    nav_chatbot: "Chatbot IA",
    nav_settings: "Ajustes",
    feed_title: "Feed Educativo",
    labs_title: "Laboratorios Interactivos",
    graph_title: "Grafo de Conocimientos",
    chatbot_title: "Creador Guiado por IA",
    settings_title: "Ajustes de la Aplicación",
    search_placeholder: "Buscar temas, categorías o palabras clave...",
    cat_all: "Todo",
    cat_tech: "Tech y Negocios",
    cat_science: "Ciencia",
    cat_math: "Matemáticas",
    cat_biology: "Biología",
    cat_physics: "Física",
    cat_chemistry: "Química",
    cat_history: "Historia",
    comments_heading: "Comentarios",
    add_comment_placeholder: "Escribe una respuesta...",
    comment_post_btn: "Publicar",
    set_heading_ui: "Personalización de Interfaz",
    set_theme_title: "Modo de Tema",
    set_theme_desc: "Cambie entre el modo oscuro inmersivo y el modo claro de alto contraste.",
    set_theme_toggle_btn: "Alternar Tema",
    set_lang_title: "Idioma de Interfaz",
    set_lang_desc: "Modifique las traducciones del menú, etiquetas y diálogos del asistente.",
    set_heading_sync: "Compartir Datos por Wi-Fi",
    set_sync_desc: "Exporte sus datos para respaldar. Arrastre e importe el archivo JSON en otros dispositivos para sincronizar.",
    set_btn_export: "Exportar JSON del Grafo",
    set_btn_import: "Importar JSON del Grafo",
    set_btn_reset: "Restablecer Valores",
    set_heading_stats: "Estado de la Base de Conocimientos",
    set_stat_nodes: "Nodos Totales",
    set_stat_edges: "Conexiones Totales",
    set_stat_likes: "Likes Totales",
    bot_online: "Asistente Creador Guiado",
    chat_placeholder: "Escribe tu respuesta y presiona Enter...",
    chat_send: "Enviar",
    node_connections: "Conceptos Conectados",
    node_view_post: "Ver en Feed",
    graph_repulsion: "Repulsión Elástica:",
    lab_geometry: "📐 Geometría",
    lab_physics: "⚡ Física",
    lab_biology: "🫁 Biología",
    lab_chemistry: "🧪 Química",
    lab_geography: "🗺️ Geografía",
    lab_code: "💻 Sandbox de Código",
    geom_triangle_title: "Resolvedor de Triángulos",
    geom_triangle_desc: "Arrastre los puntos A, B, y C para cambiar el triángulo. Coordenadas, lados, ángulos y área se actualizan.",
    geom_side_a: "Lado AB",
    geom_side_b: "Lado BC",
    geom_side_c: "Lado CA",
    geom_area: "Área",
    geom_calc_title: "Calculadora de Funciones",
    geom_calc_desc: "Grafique funciones matemáticas. Escriba una ecuación algebraica en términos de `x` (ej: `Math.sin(x) * 5`).",
    geom_formula_lbl: "f(x) = ",
    geom_plot_btn: "Graficar",
    phys_gravity_title: "Zona de Caída de Gravedad (v = gt)",
    phys_gravity_desc: "Simule la caída de objetos. Ajuste la gravedad (Tierra vs Luna) y masa, y controle las velocidades.",
    phys_gravity_lbl: "Gravedad:",
    phys_mass_lbl: "Masa:",
    phys_drop_btn: "Soltar Objeto",
    phys_reset_btn: "Reiniciar",
    phys_time: "Tiempo (t)",
    phys_velocity: "Velocidad (v)",
    phys_height: "Distancia (d)",
    phys_force_title: "Fuerza, Masa y Fricción (F = ma)",
    phys_force_desc: "Empuje un bloque sobre un plano con fricción. Vea cómo se comportan la aceleración y velocidad.",
    phys_force_lbl: "Fuerza de Empuje:",
    phys_friction_lbl: "Coef. de Fricción:",
    phys_push_btn: "Empujar / Parar",
    phys_accel: "Acel. (a)",
    phys_speed: "Velocidad (v)",
    bio_systems_title: "Navegador de Sistemas Humanos",
    bio_systems_desc: "Seleccione un sistema orgánico. Haga clic en los órganos para ver la información y activar la animación.",
    bio_sys_respiratory: "🫁 Respiratorio",
    bio_sys_circulatory: "❤️ Circulatorio",
    bio_sys_nervous: "🧠 Nervioso",
    bio_sys_digestive: "🍕 Digestivo",
    bio_key_organs: "Órganos Clave",
    bio_fun_fact_lbl: "Dato Curioso:",
    bio_animate_btn: "Ejecutar Animación",
    chem_title: "Titulación y Reacciones Químicas",
    chem_desc: "Experimente con ácidos, bases e indicadores. Observe cambios de pH, colores y gases.",
    chem_reset_btn: "Lavar Vaso",
    chem_log_title: "Registro de Reactividad",
    chem_ph: "Nivel de pH",
    chem_state: "Estado",
    chem_equation: "Ecuación Química Activa",
    chem_reactions_tested: "Registro de Reacciones",
    geo_map_title: "Mapa Global Interactivo",
    geo_map_desc: "Explore países, ciudades, puertos, rutas comerciales y patrones climáticos. Use la brújula para navegar.",
    geo_compass_title: "Brújula de Navegación",
    geo_compass_desc: "Brújula en tiempo real que muestra direcciones cardinales. Seleccione ubicaciones para ver detalles.",
    geo_zoom: "Zoom:",
    geo_layers: "Mostrar Capas:",
    geo_reset: "Restablecer Vista",
    geo_selected_location: "Ubicación Seleccionada:",
    sandbox_editor: "Editor Sandbox de Código",
    sandbox_preview: "Salida de Vista Previa",
    set_heading_notifications: "Simulador de Actividad y Notificaciones",
    set_notifications_desc: "Simular actualizaciones periódicas. Habilitar notificaciones del navegador activará alertas del sistema OS cuando seas etiquetado.",
    set_notify_perm_title: "Alertas del Sistema OS",
    set_notify_perm_desc: "Solicitar permiso para mostrar notificaciones push del sistema estándar.",
    set_notify_sim_title: "Simular Acción Ahora",
    set_notify_sim_desc: "Activar manualmente una actividad de red aleatoria para probar notificaciones al instante."
  }
};


// Application State Management
let state = {
  currentLang: 'en',
  theme: 'dark',
  currentTab: 'feed',
  knowledgeBase: null,
  activeFilter: 'all',
  searchQuery: '',
  // Comments Modal State
  activeCommentPostId: null,
  // Chatbot Creator State
  chatState: {
    step: 0, // 0: Welcome/Idle, 1: Title, 2: Category, 3: Description, 4: ConnectTo, 5: EdgeLabel
    tempNode: {
      id: '',
      title: '',
      category: 'Tech',
      description: '',
      likes: 0,
      comments: [],
      author: 'EduBotUser'
    },
    tempEdge: {
      from: '',
      to: '',
      label: ''
    }
  }
};

// ==========================================
// Initialization & LocalStorage Hooks
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  
  try {
    initAppState();
    bindGlobalEvents();
    renderApp();

    // Handle Android Chrome dynamic toolbar
    handleDynamicViewport();

    // Trigger initial chatbot greeting based on local time
    chatbotInit();
    
  } catch (error) {
    console.error("Error during app initialization:", error);
  }
  
});

function initAppState() {
  // Load Theme
  state.theme = localStorage.getItem("edujs_theme") || 'dark';
  document.documentElement.setAttribute("data-theme", state.theme);
  updateThemeTogglesUI();

  // Load Language
  state.currentLang = localStorage.getItem("edujs_lang") || 'en';
  document.getElementById("lang-selector").value = state.currentLang;
  document.getElementById("settings-lang-selector").value = state.currentLang;


  // Load Knowledge Database
  const localDB = localStorage.getItem("edujs_knowledge_base");
  if (localDB) {
    try {
      state.knowledgeBase = JSON.parse(localDB);
    } catch (e) {
      console.error("Error parsing local DB, restoring seeds.", e);
      loadSeeds();
    }
  } else {
    loadSeeds();
  }
  updateAppLanguage(state.currentLang);
}

function loadSeeds() {
  // Load seeds from json.js loaded in window
  if (typeof INITIAL_KNOWLEDGE_BASE !== 'undefined') {
    // MERGE INITIAL_pbi_KNOWLEDGE_BASE and INITIAL_KNOWLEDGE_BASE topics & edges
    // Ensures no duplicates by ID, allowing base seed set + updates without data loss
    let mergedTopics = [];
    let mergedEdges = [];

    // Add topics from INITIAL_KNOWLEDGE_BASE (primary base)
    if (INITIAL_KNOWLEDGE_BASE && INITIAL_KNOWLEDGE_BASE.topics) {
      mergedTopics.push(...INITIAL_KNOWLEDGE_BASE.topics);
      mergedTopics.push(...INITIAL_databricks_KNOWLEDGE_BASE.topics);
      mergedTopics.push(...INITIAL_health_KNOWLEDGE_BASE.topics);
      mergedTopics.push(...INITIAL_pbi_KNOWLEDGE_BASE.topics);
      mergedTopics.push(...INITIAL_pmp_KNOWLEDGE_BASE.topics);
      mergedTopics.push(...INITIAL_powerplatform_KNOWLEDGE_BASE.topics);
    }

    // Add topics from INITIAL_pbi_KNOWLEDGE_BASE without duplicates by ID
    // if (typeof INITIAL_pbi_KNOWLEDGE_BASE !== 'undefined' && INITIAL_pbi_KNOWLEDGE_BASE.topics) {
    //   INITIAL_pbi_KNOWLEDGE_BASE.topics.forEach(topic => {
    //     if (!mergedTopics.some(t => t.id === topic.id)) {
    //       mergedTopics.push(topic);
    //     }
    //   });
    // }

    // Add edges from INITIAL_KNOWLEDGE_BASE (primary base)
    if (INITIAL_KNOWLEDGE_BASE && INITIAL_KNOWLEDGE_BASE.edges) {
      mergedEdges.push(...INITIAL_KNOWLEDGE_BASE.edges);
        mergedEdges.push(...INITIAL_databricks_KNOWLEDGE_BASE.edges);
        mergedEdges.push(...INITIAL_health_KNOWLEDGE_BASE.edges);
        mergedEdges.push(...INITIAL_pbi_KNOWLEDGE_BASE.edges);
        mergedEdges.push(...INITIAL_pmp_KNOWLEDGE_BASE.edges);
        mergedEdges.push(...INITIAL_powerplatform_KNOWLEDGE_BASE.edges);        
    }

    // Add edges from INITIAL_pbi_KNOWLEDGE_BASE without duplicates (by from+to pair)
    // if (typeof INITIAL_pbi_KNOWLEDGE_BASE !== 'undefined' && INITIAL_pbi_KNOWLEDGE_BASE.edges) {
    //   INITIAL_pbi_KNOWLEDGE_BASE.edges.forEach(edge => {
    //     if (!mergedEdges.some(e => e.from === edge.from && e.to === edge.to)) {
    //       mergedEdges.push(edge);
    //     }
    //   });
    // }

    state.knowledgeBase = {
      topics: mergedTopics,
      edges: mergedEdges
    };
  } else {
    // Fail-safe default
    state.knowledgeBase = { topics: [], edges: [] };
  }
  saveDBToLocalStorage();
}

function saveDBToLocalStorage() {
  localStorage.setItem("edujs_knowledge_base", JSON.stringify(state.knowledgeBase));
  updateSystemStats();
}

// ==========================================
// Event Binding & Dynamic View Routing
// ==========================================
function bindGlobalEvents() {
  // Initialize AudioContext on first user interaction (iOS requirement)
  document.addEventListener('click', initAudioContext, { once: true });
  document.addEventListener('touchstart', initAudioContext, { once: true });

  // Tab Navigation Links (Sidebar & Bottom-bar synced)
  const navElements = document.querySelectorAll(".nav-item, .bottom-nav-item");
  navElements.forEach(elem => {
    elem.addEventListener("click", (e) => {
      e.preventDefault();
      const targetTab = elem.getAttribute("data-tab");
      switchTab(targetTab);
    });
  });

  // Language selectors
  document.getElementById("lang-selector").addEventListener("change", (e) => {
    updateAppLanguage(e.target.value);
  });
  document.getElementById("settings-lang-selector").addEventListener("change", (e) => {
    updateAppLanguage(e.target.value);
  });

  // Theme switches
  document.getElementById("theme-toggle-header").addEventListener("click", toggleAppTheme);
  document.getElementById("theme-toggle-sidebar").addEventListener("click", toggleAppTheme);
  document.getElementById("theme-toggle-settings").addEventListener("click", toggleAppTheme);

  // Search input
  document.getElementById("global-search").addEventListener("input", (e) => {
    state.searchQuery = e.target.value.toLowerCase().trim();
    renderFeedPosts();
  });

  // Category Filter Pills
  document.getElementById("category-pills-container").addEventListener("click", (e) => {
    const pill = e.target.closest(".pill");
    if (!pill) return;

    document.querySelectorAll("#category-pills-container .pill").forEach(p => p.classList.remove("active"));
    pill.classList.add("active");

    state.activeFilter = pill.getAttribute("data-category");
    renderFeedPosts();
  });

  // Comment Modal closing
  document.getElementById("close-comments-btn").addEventListener("click", () => {
    document.getElementById("comments-modal").classList.remove("active");
  });
  document.getElementById("modal-comment-submit").addEventListener("click", submitNewComment);
  document.getElementById("modal-comment-input").addEventListener("keypress", (e) => {
    if (e.key === "Enter") submitNewComment();
  });

  // Settings Actions
  document.getElementById("sync-export-btn").addEventListener("click", exportGraphData);
  document.getElementById("sync-import-file").addEventListener("change", importGraphData);
  document.getElementById("sync-reset-btn").addEventListener("click", () => {
    if (confirm("Are you sure you want to reset the knowledge graph to defaults? All custom edits will be lost.")) {
      loadSeeds();
      renderApp();
      showToastNotification("Reset database to seeds!");
    }
  });

  // Chatbot action button
  document.getElementById("chat-send-btn").addEventListener("click", handleChatbotInput);
  document.getElementById("chat-user-input").addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleChatbotInput();
  });

  // Notifications Simulator Events
  document.getElementById("settings-request-notify-btn").addEventListener("click", requestOSNotificationPermission);
  document.getElementById("settings-trigger-sim-btn").addEventListener("click", () => {
    simulateRandomActivity();
  });
}

function switchTab(tabId) {
  state.currentTab = tabId;

  // Update Tab Views
  document.querySelectorAll(".tab-view").forEach(view => {
    view.classList.remove("active");
  });
  const activeView = document.getElementById(`${tabId}-tab`);
  if (activeView) activeView.classList.add("active");

  // Update Navigation buttons state
  document.querySelectorAll(".nav-item, .bottom-nav-item").forEach(item => {
    if (item.getAttribute("data-tab") === tabId) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });

  // Update Title in Header
  const titleKey = `${tabId}_title`;
  const headerTitle = document.getElementById("current-tab-title");
  headerTitle.setAttribute("data-i18n", titleKey);
  headerTitle.textContent = getTranslation(titleKey);

  // Trigger sub-component redraws if necessary
  if (tabId === 'graph') {
    // Reset/redraw Force-directed Graph Canvas
    if (window.eduGraph) {
      setTimeout(() => {
        window.eduGraph.resizeCanvas();
        window.eduGraph.initPhysicsSimulation();
      }, 100);
    }
  } else if (tabId === 'labs') {
    // Initialize current active lab canvas
    setTimeout(() => {
      if (window.eduLabs) window.eduLabs.initActiveLab();
    }, 100);
  }
}

// ==========================================
// Theme & Multi-language Mechanics
// ==========================================
function toggleAppTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem("edujs_theme", state.theme);
  document.documentElement.setAttribute("data-theme", state.theme);
  updateThemeTogglesUI();

  // Redraw Graph Canvas to update color nodes
  if (window.eduGraph && state.currentTab === 'graph') {
    window.eduGraph.initPhysicsSimulation();
  }
}

function updateThemeTogglesUI() {
  const icon = state.theme === 'dark' ? '☀️' : '🌙';
  document.getElementById("theme-toggle-header").textContent = icon;
  document.getElementById("theme-toggle-sidebar").textContent = icon;
  document.getElementById("theme-toggle-settings").textContent = icon;
}

function updateAppLanguage(langCode) {
  state.currentLang = langCode;
  localStorage.setItem("edujs_lang", langCode);

  // Set dropdown selectors
  document.getElementById("lang-selector").value = langCode;
  document.getElementById("settings-lang-selector").value = langCode;

  // Toggle dynamic RTL layout for Arabic (ar) and Urdu (ur)
  if (langCode === 'ar' || langCode === 'ur') {
    document.documentElement.setAttribute("dir", "rtl");
  } else {
    document.documentElement.setAttribute("dir", "ltr");
  }

  // Scan document for elements containing data-i18n and translate
  document.querySelectorAll("[data-i18n]").forEach(elem => {
    const key = elem.getAttribute("data-i18n");
    const trans = getTranslation(key);
    if (trans) elem.textContent = trans;
  });

  // Placeholders
  document.querySelectorAll("[data-i18n-placeholder]").forEach(elem => {
    const key = elem.getAttribute("data-i18n-placeholder");
    const trans = getTranslation(key);
    if (trans) elem.setAttribute("placeholder", trans);
  });

  // Re-render feed layout to adjust translated post strings
  renderFeedPosts();

  // If the chatbot dialog is showing, redraw messages to align RTL
  renderChatbotMessages();
}

function getTranslation(key) {
  const dict = TRANSLATIONS[state.currentLang] || TRANSLATIONS['en'];
  return dict[key] || TRANSLATIONS['en'][key] || key;
}

// ==========================================
// Feed Renderer & Card Social Mechanics
// ==========================================
function renderFeedPosts() {
  const container = document.getElementById("feed-posts-container");
  if (!container) return;
  container.innerHTML = "";

  // Apply filters
  let posts = state.knowledgeBase.topics;

  // Filter by search query
  if (state.searchQuery) {
    posts = posts.filter(p =>
      p.title.toLowerCase().includes(state.searchQuery) ||
      p.description.toLowerCase().includes(state.searchQuery) ||
      p.category.toLowerCase().includes(state.searchQuery)
    );
  }

  // Filter by category pill
  if (state.activeFilter !== 'all') {
    posts = posts.filter(p => p.category.toLowerCase().includes(state.activeFilter.toLowerCase()));
  }

  if (posts.length === 0) {
    container.innerHTML = `<div class="empty-feed-msg">${state.currentLang === 'ar' ? 'لم يتم العثور على مواضيع.' : 'No topics found matching current filters.'}</div>`;
    return;
  }

  posts.forEach(post => {
    const isLiked = isPostLikedLocally(post.id);
    const following = isFollowingAuthor(post.author);

    const card = document.createElement("article");
    card.className = "feed-card glass-card";
    card.setAttribute("data-post-id", post.id);

    // Dynamic HTML structure
    card.innerHTML = `
      <div class="card-user-info">
        <div class="user-avatar-meta">
          <div class="user-avatar">${post.author ? post.author.substring(0, 2).toUpperCase() : 'ED'}</div>
          <div class="user-name-role">
            <span class="user-handle">@${post.author || 'Educator'}</span>
            <span class="post-time">1m ago</span>
          </div>
        </div>
        <button class="btn-follow ${following ? 'following' : ''}" data-author="${post.author || 'Educator'}">
          ${following ? (state.currentLang === 'ar' ? 'متابع' : 'Following') : (state.currentLang === 'ar' ? 'متابعة' : '+ Follow')}
        </button>
      </div>

      <div class="card-media-body" data-post-id="${post.id}">
        <span class="card-category-badge">${post.category}</span>
        <h4 class="card-concept-title">${post.title}</h4>
        <p class="card-concept-desc">${post.description}</p>
        <span class="double-tap-heart">❤️</span>
        <div class="tap-learn-hint">💡 Double tap card to Like</div>
      </div>

      <div class="card-actions-bar">
        <button class="action-btn like-btn ${isLiked ? 'liked' : ''}" data-post-id="${post.id}">
          <span class="btn-like-icon">❤️</span> <span class="like-count">${post.likes}</span>
        </button>
        <button class="action-btn comment-trigger" data-post-id="${post.id}">
          <span class="btn-comment-icon">💬</span> <span>${post.comments ? post.comments.length : 0}</span>
        </button>
        <button class="action-btn share-trigger" data-post-id="${post.id}">
          <span class="btn-share-icon">🔗</span> <span data-i18n="feed_share">Share</span>
        </button>
      </div>
    `;

    // Event Bindings for Card Body Double-Tap
    const cardBody = card.querySelector(".card-media-body");
    let lastTap = 0;
    cardBody.addEventListener("click", (e) => {
      const currentTime = new Date().getTime();
      const tapLength = currentTime - lastTap;
      if (tapLength < 300 && tapLength > 0) {
        // Double Tap
        handleDoubleTapLike(cardBody, post.id);
      }
      lastTap = currentTime;
    });

    // Event Bindings for Likes
    card.querySelector(".like-btn").addEventListener("click", () => {
      togglePostLike(post.id);
    });

    // Event Bindings for Comments
    card.querySelector(".comment-trigger").addEventListener("click", () => {
      openCommentsModal(post.id);
    });

    // Event Bindings for Follows
    card.querySelector(".btn-follow").addEventListener("click", (e) => {
      toggleFollowAuthor(e.target);
    });

    // Event Bindings for Shares
    card.querySelector(".share-trigger").addEventListener("click", () => {
      copyPostShareLink(post.id);
    });

    container.appendChild(card);
  });
}

function handleDoubleTapLike(cardBody, postId) {
  const heart = cardBody.querySelector(".double-tap-heart");
  heart.classList.remove("animate");
  void heart.offsetWidth; // Trigger reflow
  heart.classList.add("animate");

  // Increment like count if not already liked
  if (!isPostLikedLocally(postId)) {
    togglePostLike(postId);
  }
}

function togglePostLike(postId) {
  const likedArray = JSON.parse(localStorage.getItem("edujs_liked_posts") || "[]");
  const post = state.knowledgeBase.topics.find(p => p.id === postId);
  if (!post) return;

  const idx = likedArray.indexOf(postId);
  if (idx === -1) {
    // Like post
    likedArray.push(postId);
    post.likes++;
  } else {
    // Unlike post
    likedArray.splice(idx, 1);
    post.likes--;
  }

  localStorage.setItem("edujs_liked_posts", JSON.stringify(likedArray));
  saveDBToLocalStorage();
  renderFeedPosts();
}

function isPostLikedLocally(postId) {
  const likedArray = JSON.parse(localStorage.getItem("edujs_liked_posts") || "[]");
  return likedArray.includes(postId);
}

function toggleFollowAuthor(button) {
  const author = button.getAttribute("data-author");
  const followArray = JSON.parse(localStorage.getItem("edujs_following") || "[]");

  const idx = followArray.indexOf(author);
  if (idx === -1) {
    followArray.push(author);
    button.classList.add("following");
    button.textContent = state.currentLang === 'ar' ? 'متابع' : 'Following';
  } else {
    followArray.splice(idx, 1);
    button.classList.remove("following");
    button.textContent = state.currentLang === 'ar' ? 'متابعة' : '+ Follow';
  }
  localStorage.setItem("edujs_following", JSON.stringify(followArray));
}

function isFollowingAuthor(author) {
  const followArray = JSON.parse(localStorage.getItem("edujs_following") || "[]");
  return followArray.includes(author);
}

function copyPostShareLink(postId) {
  const dummyUrl = `${window.location.origin}${window.location.pathname}?tab=feed&post=${postId}`;
  navigator.clipboard.writeText(dummyUrl).then(() => {
    showToastNotification(state.currentLang === 'ar' ? 'تم نسخ رابط المنشور!' : 'Link copied to clipboard!');
  }).catch(() => {
    // Failover
    showToastNotification("Copied to clipboard!");
  });
}

function showToastNotification(msg) {
  const toast = document.getElementById("toast-notify");
  toast.textContent = msg;
  toast.classList.add("active");
  setTimeout(() => {
    toast.classList.remove("active");
  }, 2500);
}

// ==========================================
// Comment System Modal Mechanics
// ==========================================
function openCommentsModal(postId) {
  state.activeCommentPostId = postId;
  const post = state.knowledgeBase.topics.find(p => p.id === postId);
  if (!post) return;

  const modal = document.getElementById("comments-modal");
  const commentsList = document.getElementById("modal-comments-list");
  commentsList.innerHTML = "";

  if (post.comments && post.comments.length > 0) {
    post.comments.forEach(comment => {
      const bubble = document.createElement("div");
      bubble.className = "comment-bubble";
      bubble.innerHTML = `
        <div class="comment-meta">
          <span>@${comment.user}</span>
          <span>Just now</span>
        </div>
        <div class="comment-text">${comment.text}</div>
      `;
      commentsList.appendChild(bubble);
    });
  } else {
    commentsList.innerHTML = `<div class="empty-comments">${state.currentLang === 'ar' ? 'لا توجد تعليقات بعد. كن أول من يعلق!' : 'No comments yet. Be the first to reply!'}</div>`;
  }

  document.getElementById("modal-comment-input").value = "";
  modal.classList.add("active");
}

function submitNewComment() {
  const input = document.getElementById("modal-comment-input");
  const text = input.value.trim();
  if (!text || !state.activeCommentPostId) return;

  const post = state.knowledgeBase.topics.find(p => p.id === state.activeCommentPostId);
  if (!post) return;

  if (!post.comments) post.comments = [];

  post.comments.push({
    user: "You",
    text: text
  });

  input.value = "";
  saveDBToLocalStorage();
  openCommentsModal(state.activeCommentPostId);
  renderFeedPosts(); // Refresh counts
}

// ==========================================
// Guided Creator Chatbot
// ==========================================
let chatHistory = [];

function chatbotInit() {
  chatHistory = [];
  state.chatState.step = 0;

  const hour = new Date().getHours();
  let greeting = "";
  if (hour < 12) {
    greeting = state.currentLang === 'ar' ? 'صباح الخير! ☀️' : 'Good morning! ☀️';
  } else if (hour < 18) {
    greeting = state.currentLang === 'ar' ? 'مساء الخير! 🌤️' : 'Good afternoon! 🌤️';
  } else {
    greeting = state.currentLang === 'ar' ? 'طاب مساؤك! 🌙' : 'Good evening! 🌙';
  }

  const welcomeText = state.currentLang === 'ar' ?
    `${greeting} أنا مساعدك الذكي EduBot. هل ترغب في إضافة موضوع تعليمي جديد وتوصيله بشبكة العلوم المترابطة؟ ابدأ بكتابة عنوان الموضوع الجديد هنا.` :
    `${greeting} I am EduBot, your guide. Let's create a new educational topic and connect it in the Knowledge Graph. To start, what is the Title of the new topic?`;

  addBotChatMessage(welcomeText);
  state.chatState.step = 1; // Waiting for Title
}

function addBotChatMessage(text, interactiveHTML = null) {
  chatHistory.push({ sender: 'bot', text: text, html: interactiveHTML });
  renderChatbotMessages();
}

function addUserChatMessage(text) {
  chatHistory.push({ sender: 'user', text: text });
  renderChatbotMessages();
}

function renderChatbotMessages() {
  const container = document.getElementById("chat-messages-container");
  if (!container) return;
  container.innerHTML = "";

  chatHistory.forEach(msg => {
    const item = document.createElement("div");
    item.className = `chat-msg ${msg.sender}`;

    let content = `<div class="msg-bubble">${msg.text}</div>`;
    if (msg.html) {
      content = `<div class="msg-bubble">${msg.text} ${msg.html}</div>`;
    }

    item.innerHTML = `
      ${content}
      <span class="msg-meta">${msg.sender === 'bot' ? 'EduBot' : 'You'}</span>
    `;
    container.appendChild(item);
  });

  // Scroll to bottom
  container.scrollTop = container.scrollHeight;
}

function handleChatbotInput() {
  const inputEl = document.getElementById("chat-user-input");
  const value = inputEl.value.trim();
  if (!value) return;

  // Display user response
  addUserChatMessage(value);
  inputEl.value = "";

  // Advance state
  const step = state.chatState.step;
  const temp = state.chatState.tempNode;

  if (step === 1) {
    // User submitted Title
    temp.title = value;
    temp.id = value.toLowerCase().replace(/[^a-z0-9]/g, "_");

    // Check if ID already exists
    const exists = state.knowledgeBase.topics.some(p => p.id === temp.id);
    if (exists) {
      addBotChatMessage(state.currentLang === 'ar' ?
        `يبدو أن هذا الموضوع موجود بالفعل بالمعرف (${temp.id}). يرجى تقديم عنوان مختلف.` :
        `It looks like a topic with ID (${temp.id}) already exists. Please choose a different title.`
      );
      return;
    }

    addBotChatMessage(state.currentLang === 'ar' ?
      `ممتاز! موضوع "${temp.title}" يبدو رائعاً. ما هو التصنيف (القسم) الذي ينتمي إليه؟ (مثال: Math, Physics, Chemistry, Biology, Tech, History)` :
      `Great! "${temp.title}" sounds interesting. What Category does it fall under? (e.g. Math, Physics, Chemistry, Biology, Tech, History)`
    );
    state.chatState.step = 2;

  } else if (step === 2) {
    // User submitted Category
    temp.category = value;
    addBotChatMessage(state.currentLang === 'ar' ?
      `فهمت ذلك. يرجى كتابة وصف موجز ومبسط لهذا المفهوم (سطر أو سطرين).` :
      `Got it. Now, please enter a short 1-sentence description explaining this concept.`
    );
    state.chatState.step = 3;

  } else if (step === 3) {
    // User submitted Description
    temp.description = value;

    // Build Dropdown to connect to existing topics
    const optionsHTML = state.knowledgeBase.topics.map(topic =>
      `<option value="${topic.id}">${topic.title}</option>`
    ).join('');

    const dropdownSelect = `
      <div class="chat-interactive-holder">
        <label>${state.currentLang === 'ar' ? 'اختر الموضوع المرتبط:' : 'Select related topic:'}</label>
        <select id="chat-wizard-connect-to" class="select-input">
          ${optionsHTML}
        </select>
        <button id="chat-wizard-select-connect-btn" class="btn-primary" style="margin-top:6px; padding: 4px 8px; font-size:12px;">Confirm Connection</button>
      </div>
    `;

    addBotChatMessage(
      state.currentLang === 'ar' ?
        `تمام. دعنا نقوم بتوصيل هذا الموضوع بآخر في خارطة المعرفة. اختر الموضوع الذي يرتبط به من القائمة أدناه:` :
        `Wonderful! Let's connect this concept to something else in our Knowledge Graph. Select which node it links to below:`,
      dropdownSelect
    );
    state.chatState.step = 4;

    // Attach event listener immediately to confirm connection button
    setTimeout(() => {
      const confirmBtn = document.getElementById("chat-wizard-select-connect-btn");
      if (confirmBtn) {
        confirmBtn.addEventListener("click", () => {
          const selectVal = document.getElementById("chat-wizard-connect-to").value;
          state.chatState.tempEdge.to = selectVal;
          addUserChatMessage(`Connects to: ${selectVal}`);

          // Move to relationship label
          addBotChatMessage(state.currentLang === 'ar' ?
            `رائع. ما هي طبيعة العلاقة بين الموضوعين؟ (مثال: "يغذي بيانات", "يساعد في توضيح", "متطلب لـ", "مبني على")` :
            `Cool. What is the relation Label representing this link? (e.g. "feeds data into", "helps explain", "prerequisite for", "built on")`
          );
          state.chatState.step = 5;
        });
      }
    }, 100);

  } else if (step === 5) {
    // User submitted Edge label
    state.chatState.tempEdge.label = value;
    state.chatState.tempEdge.from = temp.id;

    // Push node
    state.knowledgeBase.topics.push({
      id: temp.id,
      title: temp.title,
      category: temp.category,
      description: temp.description,
      likes: 0,
      comments: [],
      author: 'EduBotUser'
    });

    // Push edge
    state.knowledgeBase.edges.push({
      from: state.chatState.tempEdge.from,
      to: state.chatState.tempEdge.to,
      label: state.chatState.tempEdge.label
    });

    saveDBToLocalStorage();

    addBotChatMessage(state.currentLang === 'ar' ?
      `نجاح باهر! 🚀 لقد قمت بإدراج الموضوع "${temp.title}" وتوصيله بنجاح بـ "${state.chatState.tempEdge.to}". يمكنك الانتقال إلى علامة تبويب "المنشورات" أو "الرسم البياني" لرؤيته حياً!` :
      `Success! 🚀 I have registered "${temp.title}" and connected it to "${state.chatState.tempEdge.to}". Visit the Feed or the Knowledge Graph to see your live contribution!`
    );

    // Reset Chatbot Wizard
    setTimeout(() => {
      chatbotInit();
      renderApp(); // Redraw whole UI to account for changes
    }, 3000);
  }
}

// ==========================================
// settings & sync helpers
// ==========================================
function updateSystemStats() {
  const nodesCount = state.knowledgeBase.topics.length;
  const edgesCount = state.knowledgeBase.edges.length;
  const likesSum = state.knowledgeBase.topics.reduce((acc, p) => acc + (p.likes || 0), 0);

  document.getElementById("stats-total-nodes").textContent = nodesCount;
  document.getElementById("stats-total-edges").textContent = edgesCount;
  document.getElementById("stats-total-likes").textContent = likesSum;

  const nodesEl = document.getElementById("stats-total-nodes");
  const edgesEl = document.getElementById("stats-total-edges");
  const likesEl = document.getElementById("stats-total-likes");
  if (nodesEl) nodesEl.textContent = nodesCount;
  if (edgesEl) edgesEl.textContent = edgesCount;
  if (likesEl) likesEl.textContent = likesSum;
}

function exportGraphData() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state.knowledgeBase, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", "edujs_knowledge_graph.json");
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  showToastNotification("Downloaded Graph Backup!");
}

function importGraphData(e) {
  const fileReader = new FileReader();
  const file = e.target.files[0];
  if (!file) return;

  fileReader.onload = function (event) {
    try {
      const parsedData = JSON.parse(event.target.result);

      // Basic Schema Validation
      if (parsedData && Array.isArray(parsedData.topics) && Array.isArray(parsedData.edges)) {
        // Merge topics & edges (no duplicates)
        state.knowledgeBase = parsedData;
        saveDBToLocalStorage();
        renderApp();
        showToastNotification("Imported and Succeeded!");
      } else {
        alert("Invalid file structure. Must contain 'topics' and 'edges' arrays.");
      }
    } catch (err) {
      alert("Error reading file: " + err);
    }
  };
  fileReader.readAsText(file);
}

// ==========================================
// Master Application Render
// ==========================================
function renderApp() {
  renderFeedPosts();
  updateSystemStats();

  // Refresh Knowledge Graph canvas visual
  if (window.eduGraph && state.currentTab === 'graph') {
    window.eduGraph.initPhysicsSimulation();
  }
}

// ==========================================
// Global AudioContext (iOS requires user gesture to create)
let globalAudioContext = null;

// Initialize AudioContext on first user interaction
function initAudioContext() {
  if (!globalAudioContext) {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        globalAudioContext = new AudioContext();
      }
    } catch (e) {
      console.warn("AudioContext not supported on this device", e);
    }
  }
  return globalAudioContext;
}

// Handle Android Chrome dynamic toolbar (bottom URL bar)
function handleDynamicViewport() {
  if (!window.visualViewport) return;

  const updateLayout = () => {
    const vh = window.visualViewport.height;
    const mainContent = document.querySelector('.main-content');
    const bottomNav = document.querySelector('.bottom-nav');
    
    if (mainContent && bottomNav && bottomNav.style.display !== 'none') {
      // Adjust for bottom navigation height (60px)
      mainContent.style.height = `${vh - 60}px`;
      
      // Prevent content from scrolling behind the toolbar
      const tabViewContainer = document.querySelector('.tab-view-container');
      if (tabViewContainer) {
        // Scroll content up slightly when viewport shrinks
        tabViewContainer.scrollTop = Math.min(tabViewContainer.scrollTop, tabViewContainer.scrollHeight - vh);
      }
    }
  };

  // Listen for viewport resize (keyboard/toolbar appears/disappears)
  window.visualViewport.addEventListener('resize', updateLayout);
  window.visualViewport.addEventListener('scroll', updateLayout);
  
  // Handle orientation change
  window.addEventListener('orientationchange', () => {
    setTimeout(updateLayout, 100);
  });
  
  // Initial call
  updateLayout();
}

// Simulated Activity & Push Notifications
// ==========================================
function playNotificationSound() {
  try {
    const audioCtx = initAudioContext();
    if (!audioCtx) return; // Audio not available

    // iOS requires context to be resumed on user interaction
    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(err => console.warn("Could not resume audio context:", err));
      return; // Will play on next call
    }

    const now = audioCtx.currentTime;

    // First chime (A5 note)
    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, now);
    gain1.gain.setValueAtTime(0.15, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    osc1.connect(gain1);
    gain1.connect(audioCtx.destination);
    osc1.start(now);
    osc1.stop(now + 0.4);

    // Second chime slightly delayed and higher pitch (D6 note)
    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1174.66, now + 0.1);
    gain2.gain.setValueAtTime(0.12, now + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    osc2.connect(gain2);
    gain2.connect(audioCtx.destination);
    osc2.start(now + 0.1);
    osc2.stop(now + 0.5);
  } catch (e) {
    console.warn("Audio playback failed (may be blocked on iOS):", e);
  }
}

function requestOSNotificationPermission() {
  if (!("Notification" in window)) {
    alert("This browser does not support OS notifications.");
    return;
  }
  Notification.requestPermission().then(permission => {
    const btn = document.getElementById("settings-request-notify-btn");
    if (permission === "granted") {
      btn.textContent = "OS Alerts Allowed ✓";
      btn.disabled = true;
      showToastNotification("OS notifications enabled successfully!");
    } else {
      btn.textContent = "OS Alerts Denied ✗";
      showToastNotification("Notification permission was denied.");
    }
  });
}

function fireNotificationAlert(type, title, body, targetPostId) {
  // 1) In-App Push Notification Toast
  const container = document.getElementById("in-app-notifications");
  if (!container) return;

  const card = document.createElement("div");
  card.className = `push-notification-card type-${type}`;

  let icon = "🔔";
  if (type === "tag") icon = "🏷️";
  else if (type === "comment") icon = "💬";
  else if (type === "post") icon = "💡";

  card.innerHTML = `
    <div class="notify-icon-box">${icon}</div>
    <div class="notify-content-box">
      <div class="notify-title">${title}</div>
      <div class="notify-body">${body}</div>
      <div class="notify-meta-time">just now</div>
    </div>
  `;

  // Click handler to view target post in feed
  card.addEventListener("click", () => {
    if (targetPostId) {
      switchTab("feed");
      setTimeout(() => {
        const cardEl = document.querySelector(`.feed-card[data-post-id="${targetPostId}"]`);
        if (cardEl) {
          cardEl.scrollIntoView({ behavior: "smooth", block: "center" });
          cardEl.style.borderColor = "var(--accent-pink)";
          setTimeout(() => cardEl.style.borderColor = "var(--border-glass)", 2500);
        }
      }, 200);
    }
    card.classList.remove("active");
    setTimeout(() => card.remove(), 400);
  });

  container.appendChild(card);

  // Trigger transition
  setTimeout(() => card.classList.add("active"), 50);

  // Play synthesized bell chime
  playNotificationSound();

  // Dismiss timer (6 seconds)
  setTimeout(() => {
    if (card.parentElement) {
      card.classList.remove("active");
      setTimeout(() => card.remove(), 400);
    }
  }, 6000);

  // 2) Browser OS Notification (if permitted)
  if ("Notification" in window && Notification.permission === "granted") {
    try {
      new Notification(title, { body: body });
    } catch (err) {
      console.warn("OS Notification trigger failed", err);
    }
  }
}

// Simulated network action data
const SIMULATED_USERS = ["Dr_Xavier", "Professor_Sarah", "Dad", "AgileCoach", "CitizenDev", "Explorer", "MathWiz", "Curie_Marie", "PMO_Lead"];
const SIMULATED_COMMENTS = [
  "Wow, this is an excellent description! Check it out.",
  "Very interesting view on this subject. Added it to my bookmarks.",
  "I was just studying this this morning! Perfect timing.",
  "Can you connect this to TOGAF as well? It helps.",
  "Super clear lab simulation. Highly recommended!",
  "Great job on explaining this concept!",
  "This makes studying so much more interactive!"
];
const SIMULATED_TAG_TOPICS = [
  { id: "quantum_physics", title: "Quantum Physics", category: "Physics", description: "The branch of physics addressing mechanics of atomic and subatomic particles, introducing wave-particle dualities." },
  { id: "togaf_architecture", title: "TOGAF Architecture Principles", category: "togaf", description: "High-level guidelines for enterprise design including business architectures and systems architectures." },
  { id: "power_bi_dash", title: "Power BI Interactive Dashboards", category: "PBI Azure fabric", description: "Design paradigms for streaming data visuals, analytics metrics, and dashboard tiles in Azure Fabric." },
  { id: "biochem_enzymes", title: "Biochemical Enzymes", category: "Biology", description: "Catalysts speeding up metabolic reactions and circulation energy transformations in cells." }
];

function simulateRandomActivity() {
  if (!state.knowledgeBase || state.knowledgeBase.topics.length === 0) return;

  const roll = Math.floor(Math.random() * 3); // 0, 1, 2
  const randomUser = SIMULATED_USERS[Math.floor(Math.random() * SIMULATED_USERS.length)];

  if (roll === 0) {
    // 1) Tag the User in a simulated new post
    const samplePost = SIMULATED_TAG_TOPICS[Math.floor(Math.random() * SIMULATED_TAG_TOPICS.length)];

    // Check duplicates
    if (state.knowledgeBase.topics.some(t => t.id === samplePost.id)) {
      // fallback to comment
      simulateRandomComment(randomUser);
      return;
    }

    const newPost = {
      id: samplePost.id,
      title: samplePost.title,
      category: samplePost.category,
      description: `Hey @You, ${samplePost.description}`,
      likes: Math.floor(Math.random() * 12) + 2,
      comments: [
        { user: randomUser, text: "Tagged you so you can link this to our graph!" }
      ],
      author: randomUser
    };

    state.knowledgeBase.topics.push(newPost);
    // Add relation to a random node
    const randomExistingNode = state.knowledgeBase.topics[Math.floor(Math.random() * (state.knowledgeBase.topics.length - 1))];
    state.knowledgeBase.edges.push({
      from: newPost.id,
      to: randomExistingNode.id,
      label: "relates to"
    });

    //saveDBToLocalStorage();
    renderApp();

    fireNotificationAlert(
      "tag",
      `@${randomUser} tagged you!`,
      `Check out "${newPost.title}" and help connect it.`,
      newPost.id
    );

  } else if (roll === 1) {
    // 2) Comment on a post
    simulateRandomComment(randomUser);
  } else {
    // 3) Reply to comments (especially if the user commented "You")
    // Find posts with comments from "You"
    const userCommentedPosts = state.knowledgeBase.topics.filter(p => p.comments && p.comments.some(c => c.user === "You"));

    if (userCommentedPosts.length > 0) {
      const selectedPost = userCommentedPosts[Math.floor(Math.random() * userCommentedPosts.length)];
      const replyText = `Thanks @You, I tried it and it works!`;
      selectedPost.comments.push({
        user: randomUser,
        text: replyText
      });

      //saveDBToLocalStorage();
      renderApp();

      fireNotificationAlert(
        "comment",
        `@${randomUser} replied to your comment!`,
        `"${replyText}" on topic "${selectedPost.title}"`,
        selectedPost.id
      );
    } else {
      // Fallback comment
      simulateRandomComment(randomUser);
    }
  }
}

function simulateRandomComment(user) {
  const posts = state.knowledgeBase.topics;
  const post = posts[Math.floor(Math.random() * posts.length)];
  const commentText = SIMULATED_COMMENTS[Math.floor(Math.random() * SIMULATED_COMMENTS.length)];

  if (!post.comments) post.comments = [];
  post.comments.push({
    user: user,
    text: commentText
  });

  ////saveDBToLocalStorage();
  renderApp();

  fireNotificationAlert(
    "comment",
    `@${user} commented on a post!`,
    `"${commentText}" on topic "${post.title}"`,
    post.id
  );
}

// Start Simulator Timer: Simulate action periodically (every 60s for live demo, representing hourly actions)
setInterval(() => {
  simulateRandomActivity();
}, 120000);
