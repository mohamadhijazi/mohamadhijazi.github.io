var DB_NAME = 'AnimationStudioDB';
var DB_VERSION = 1;
var STORE_PROJECTS = 'projects';

function openDB() {
    return new Promise(function (resolve, reject) {
        var request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onerror = function () { reject(request.error); };
        request.onsuccess = function () { resolve(request.result); };
        request.onupgradeneeded = function (event) {
            var db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_PROJECTS)) {
                var store = db.createObjectStore(STORE_PROJECTS, { keyPath: 'id' });
                store.createIndex('name', 'name', { unique: false });
            }
        };
    });
}

function getAllProjects() {
    return openDB().then(function (db) {
        return new Promise(function (resolve, reject) {
            var tx = db.transaction(STORE_PROJECTS, 'readonly');
            var store = tx.objectStore(STORE_PROJECTS);
            var request = store.getAll();
            request.onsuccess = function () { resolve(request.result || []); };
            request.onerror = function () { reject(request.error); };
        });
    });
}

function getProject(id) {
    return openDB().then(function (db) {
        return new Promise(function (resolve, reject) {
            var tx = db.transaction(STORE_PROJECTS, 'readonly');
            var store = tx.objectStore(STORE_PROJECTS);
            var request = store.get(id);
            request.onsuccess = function () { resolve(request.result); };
            request.onerror = function () { reject(request.error); };
        });
    });
}

function saveProject(project) {
    if (!project || !project.id) {
        console.error('saveProject called without a valid project id', project);
        return Promise.reject(new Error('Project missing id'));
    }
    return openDB().then(function (db) {
        return new Promise(function (resolve, reject) {
            var tx = db.transaction(STORE_PROJECTS, 'readwrite');
            var store = tx.objectStore(STORE_PROJECTS);
            var request = store.put(project);
            request.onsuccess = function () { resolve(request.result); };
            request.onerror = function () { reject(request.error); };
        });
    });
}

function deleteProject(id) {
    return openDB().then(function (db) {
        return new Promise(function (resolve, reject) {
            var tx = db.transaction(STORE_PROJECTS, 'readwrite');
            var store = tx.objectStore(STORE_PROJECTS);
            var request = store.delete(id);
            request.onsuccess = function () { resolve(); };
            request.onerror = function () { reject(request.error); };
        });
    });
}

function isDBEmpty() {
    return getAllProjects().then(function (projects) { return projects.length === 0; });
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

var seedData = {
    metadata: { version: "1.0", resolution: [1920, 1080], fps: 30 },
    projects: [enterpriseBodyPartsProject,song1,
        {
    id: "p2_flying_butterfly",
    name: "Flying Butterfly Through Nature",
    duration: 60,
    audioTrack: null,
    audioClips: [],

    background: "#87ceeb",

    actors: [
        {
            id: "nature_background",
            name: "Moving Nature Background",
            svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 3840 1080\" width=\"3840\" height=\"1080\">" +
                "<defs>" +
                    "<linearGradient id=\"skyGradient\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\">" +
                        "<stop offset=\"0\" stop-color=\"#68c8f2\"/>" +
                        "<stop offset=\"0.65\" stop-color=\"#c9f0ff\"/>" +
                        "<stop offset=\"1\" stop-color=\"#fff5cf\"/>" +
                    "</linearGradient>" +
                    "<linearGradient id=\"grassGradient\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\">" +
                        "<stop offset=\"0\" stop-color=\"#75c95a\"/>" +
                        "<stop offset=\"1\" stop-color=\"#238b45\"/>" +
                    "</linearGradient>" +
                "</defs>" +

                "<rect width=\"3840\" height=\"1080\" fill=\"url(#skyGradient)\"/>" +

                "<circle cx=\"400\" cy=\"190\" r=\"85\" fill=\"#fff6a8\" opacity=\"0.95\"/>" +
                "<circle cx=\"400\" cy=\"190\" r=\"125\" fill=\"#fff6a8\" opacity=\"0.18\"/>" +
                "<circle cx=\"2320\" cy=\"170\" r=\"80\" fill=\"#fff6a8\" opacity=\"0.9\"/>" +
                "<circle cx=\"2320\" cy=\"170\" r=\"120\" fill=\"#fff6a8\" opacity=\"0.16\"/>" +

                "<g fill=\"#ffffff\" opacity=\"0.82\">" +
                    "<ellipse cx=\"720\" cy=\"220\" rx=\"120\" ry=\"42\"/>" +
                    "<ellipse cx=\"650\" cy=\"225\" rx=\"75\" ry=\"55\"/>" +
                    "<ellipse cx=\"790\" cy=\"210\" rx=\"85\" ry=\"58\"/>" +

                    "<ellipse cx=\"1560\" cy=\"310\" rx=\"130\" ry=\"44\"/>" +
                    "<ellipse cx=\"1485\" cy=\"315\" rx=\"75\" ry=\"52\"/>" +
                    "<ellipse cx=\"1640\" cy=\"300\" rx=\"90\" ry=\"62\"/>" +

                    "<ellipse cx=\"2760\" cy=\"235\" rx=\"125\" ry=\"45\"/>" +
                    "<ellipse cx=\"2685\" cy=\"240\" rx=\"75\" ry=\"55\"/>" +
                    "<ellipse cx=\"2835\" cy=\"225\" rx=\"90\" ry=\"60\"/>" +

                    "<ellipse cx=\"3500\" cy=\"330\" rx=\"135\" ry=\"45\"/>" +
                    "<ellipse cx=\"3425\" cy=\"335\" rx=\"80\" ry=\"55\"/>" +
                    "<ellipse cx=\"3580\" cy=\"320\" rx=\"90\" ry=\"62\"/>" +
                "</g>" +

                "<path d=\"M0 760 Q350 430 700 760 Q1050 390 1400 760 Q1750 450 2100 760 Q2450 390 2800 760 Q3150 420 3500 760 Q3680 590 3840 750 L3840 1080 L0 1080 Z\" fill=\"#4aa65c\"/>" +

                "<path d=\"M0 820 Q420 560 840 820 Q1260 520 1680 820 Q2100 570 2520 820 Q2940 530 3360 820 Q3600 660 3840 810 L3840 1080 L0 1080 Z\" fill=\"#66bc55\"/>" +

                "<rect y=\"790\" width=\"3840\" height=\"290\" fill=\"url(#grassGradient)\"/>" +

                "<path d=\"M0 930 C450 850 740 990 1150 915 S1900 880 2300 945 S3100 980 3840 900\" fill=\"none\" stroke=\"#e6c078\" stroke-width=\"95\" opacity=\"0.9\"/>" +

                "<g>" +
                    "<g transform=\"translate(220 0)\">" +
                        "<rect x=\"0\" y=\"650\" width=\"36\" height=\"180\" rx=\"15\" fill=\"#7c5030\"/>" +
                        "<circle cx=\"18\" cy=\"610\" r=\"105\" fill=\"#2e914d\"/>" +
                        "<circle cx=\"-48\" cy=\"650\" r=\"75\" fill=\"#3fa85e\"/>" +
                        "<circle cx=\"80\" cy=\"650\" r=\"80\" fill=\"#46b464\"/>" +
                    "</g>" +

                    "<g transform=\"translate(1050 10)\">" +
                        "<rect x=\"0\" y=\"650\" width=\"38\" height=\"180\" rx=\"15\" fill=\"#7c5030\"/>" +
                        "<circle cx=\"19\" cy=\"610\" r=\"110\" fill=\"#2e914d\"/>" +
                        "<circle cx=\"-50\" cy=\"650\" r=\"80\" fill=\"#3fa85e\"/>" +
                        "<circle cx=\"85\" cy=\"650\" r=\"82\" fill=\"#46b464\"/>" +
                    "</g>" +

                    "<g transform=\"translate(2050 -5)\">" +
                        "<rect x=\"0\" y=\"650\" width=\"38\" height=\"180\" rx=\"15\" fill=\"#7c5030\"/>" +
                        "<circle cx=\"19\" cy=\"605\" r=\"110\" fill=\"#2e914d\"/>" +
                        "<circle cx=\"-52\" cy=\"650\" r=\"78\" fill=\"#3fa85e\"/>" +
                        "<circle cx=\"88\" cy=\"650\" r=\"84\" fill=\"#46b464\"/>" +
                    "</g>" +

                    "<g transform=\"translate(3100 5)\">" +
                        "<rect x=\"0\" y=\"650\" width=\"38\" height=\"180\" rx=\"15\" fill=\"#7c5030\"/>" +
                        "<circle cx=\"19\" cy=\"610\" r=\"110\" fill=\"#2e914d\"/>" +
                        "<circle cx=\"-52\" cy=\"650\" r=\"80\" fill=\"#3fa85e\"/>" +
                        "<circle cx=\"88\" cy=\"650\" r=\"84\" fill=\"#46b464\"/>" +
                    "</g>" +
                "</g>" +

                "<g>" +
                    "<g transform=\"translate(500 875)\">" +
                        "<circle cx=\"0\" cy=\"0\" r=\"18\" fill=\"#ffd54f\"/>" +
                        "<circle cx=\"-20\" cy=\"0\" r=\"17\" fill=\"#ff7aa8\"/>" +
                        "<circle cx=\"20\" cy=\"0\" r=\"17\" fill=\"#ff7aa8\"/>" +
                        "<circle cx=\"0\" cy=\"-20\" r=\"17\" fill=\"#ff7aa8\"/>" +
                        "<circle cx=\"0\" cy=\"20\" r=\"17\" fill=\"#ff7aa8\"/>" +
                    "</g>" +

                    "<g transform=\"translate(1420 920)\">" +
                        "<circle cx=\"0\" cy=\"0\" r=\"18\" fill=\"#ffd54f\"/>" +
                        "<circle cx=\"-20\" cy=\"0\" r=\"17\" fill=\"#9f7aea\"/>" +
                        "<circle cx=\"20\" cy=\"0\" r=\"17\" fill=\"#9f7aea\"/>" +
                        "<circle cx=\"0\" cy=\"-20\" r=\"17\" fill=\"#9f7aea\"/>" +
                        "<circle cx=\"0\" cy=\"20\" r=\"17\" fill=\"#9f7aea\"/>" +
                    "</g>" +

                    "<g transform=\"translate(2500 870)\">" +
                        "<circle cx=\"0\" cy=\"0\" r=\"18\" fill=\"#ffd54f\"/>" +
                        "<circle cx=\"-20\" cy=\"0\" r=\"17\" fill=\"#ffffff\"/>" +
                        "<circle cx=\"20\" cy=\"0\" r=\"17\" fill=\"#ffffff\"/>" +
                        "<circle cx=\"0\" cy=\"-20\" r=\"17\" fill=\"#ffffff\"/>" +
                        "<circle cx=\"0\" cy=\"20\" r=\"17\" fill=\"#ffffff\"/>" +
                    "</g>" +

                    "<g transform=\"translate(3480 930)\">" +
                        "<circle cx=\"0\" cy=\"0\" r=\"18\" fill=\"#ffd54f\"/>" +
                        "<circle cx=\"-20\" cy=\"0\" r=\"17\" fill=\"#ff7aa8\"/>" +
                        "<circle cx=\"20\" cy=\"0\" r=\"17\" fill=\"#ff7aa8\"/>" +
                        "<circle cx=\"0\" cy=\"-20\" r=\"17\" fill=\"#ff7aa8\"/>" +
                        "<circle cx=\"0\" cy=\"20\" r=\"17\" fill=\"#ff7aa8\"/>" +
                    "</g>" +
                "</g>" +
            "</svg>",

            zIndex: 0,

            keyframes: [
                {
                    frame: 0,
                    x: 0,
                    y: 0,
                    scale: 1,
                    rotation: 0
                },
                {
                    frame: 450,
                    x: -480,
                    y: 0,
                    scale: 1,
                    rotation: 0
                },
                {
                    frame: 900,
                    x: -960,
                    y: 0,
                    scale: 1,
                    rotation: 0
                },
                {
                    frame: 1350,
                    x: -1440,
                    y: 0,
                    scale: 1,
                    rotation: 0
                },
                {
                    frame: 1800,
                    x: -1920,
                    y: 0,
                    scale: 1,
                    rotation: 0
                }
            ]
        },

        {
            id: "distant_birds",
            name: "Distant Birds",
            svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 500 200\" width=\"500\" height=\"200\">" +
                "<g fill=\"none\" stroke=\"#37596b\" stroke-width=\"8\" stroke-linecap=\"round\" opacity=\"0.65\">" +
                    "<path d=\"M40 80 Q65 55 90 80 Q115 55 140 80\"/>" +
                    "<path d=\"M210 115 Q232 92 254 115 Q276 92 298 115\"/>" +
                    "<path d=\"M360 60 Q380 40 400 60 Q420 40 440 60\"/>" +
                "</g>" +
            "</svg>",

            zIndex: 1,

            keyframes: [
                {
                    frame: 0,
                    x: 1500,
                    y: 160,
                    scale: 0.65,
                    rotation: 0
                },
                {
                    frame: 900,
                    x: 650,
                    y: 160,
                    scale: 0.65,
                    rotation: 0
                },
                {
                    frame: 1800,
                    x: -300,
                    y: 160,
                    scale: 0.65,
                    rotation: 0
                }
            ]
        },

        {
            id: "butterfly_main",
            name: "Flying Butterfly",
            svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 400 300\" width=\"400\" height=\"300\">" +
                "<defs>" +
                    "<linearGradient id=\"leftWing\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\">" +
                        "<stop offset=\"0\" stop-color=\"#ffca3a\"/>" +
                        "<stop offset=\"0.55\" stop-color=\"#ff7b35\"/>" +
                        "<stop offset=\"1\" stop-color=\"#e63946\"/>" +
                    "</linearGradient>" +
                    "<linearGradient id=\"rightWing\" x1=\"1\" y1=\"0\" x2=\"0\" y2=\"1\">" +
                        "<stop offset=\"0\" stop-color=\"#ffca3a\"/>" +
                        "<stop offset=\"0.55\" stop-color=\"#ff7b35\"/>" +
                        "<stop offset=\"1\" stop-color=\"#e63946\"/>" +
                    "</linearGradient>" +
                    "<filter id=\"butterflyShadow\" x=\"-30%\" y=\"-30%\" width=\"160%\" height=\"160%\">" +
                        "<feDropShadow dx=\"0\" dy=\"9\" stdDeviation=\"7\" flood-color=\"#174b2a\" flood-opacity=\"0.28\"/>" +
                    "</filter>" +
                "</defs>" +

                "<g filter=\"url(#butterflyShadow)\">" +
                    "<path d=\"M190 145 C145 55 45 30 38 105 C32 170 110 180 186 165 Z\" fill=\"url(#leftWing)\" stroke=\"#5c2a35\" stroke-width=\"7\"/>" +
                    "<path d=\"M210 145 C255 55 355 30 362 105 C368 170 290 180 214 165 Z\" fill=\"url(#rightWing)\" stroke=\"#5c2a35\" stroke-width=\"7\"/>" +

                    "<path d=\"M188 165 C120 170 65 215 105 258 C145 291 190 230 197 178 Z\" fill=\"#9d4edd\" stroke=\"#51236b\" stroke-width=\"7\"/>" +
                    "<path d=\"M212 165 C280 170 335 215 295 258 C255 291 210 230 203 178 Z\" fill=\"#9d4edd\" stroke=\"#51236b\" stroke-width=\"7\"/>" +

                    "<circle cx=\"105\" cy=\"108\" r=\"18\" fill=\"#fff2a8\" opacity=\"0.9\"/>" +
                    "<circle cx=\"295\" cy=\"108\" r=\"18\" fill=\"#fff2a8\" opacity=\"0.9\"/>" +
                    "<circle cx=\"145\" cy=\"195\" r=\"14\" fill=\"#ffd6ff\" opacity=\"0.85\"/>" +
                    "<circle cx=\"255\" cy=\"195\" r=\"14\" fill=\"#ffd6ff\" opacity=\"0.85\"/>" +

                    "<ellipse cx=\"200\" cy=\"165\" rx=\"19\" ry=\"78\" fill=\"#3a243b\"/>" +
                    "<circle cx=\"200\" cy=\"85\" r=\"25\" fill=\"#3a243b\"/>" +

                    "<path d=\"M190 68 Q155 25 140 37\" fill=\"none\" stroke=\"#3a243b\" stroke-width=\"7\" stroke-linecap=\"round\"/>" +
                    "<path d=\"M210 68 Q245 25 260 37\" fill=\"none\" stroke=\"#3a243b\" stroke-width=\"7\" stroke-linecap=\"round\"/>" +

                    "<circle cx=\"140\" cy=\"37\" r=\"8\" fill=\"#3a243b\"/>" +
                    "<circle cx=\"260\" cy=\"37\" r=\"8\" fill=\"#3a243b\"/>" +
                "</g>" +
            "</svg>",

            zIndex: 3,

            keyframes: [
                {
                    frame: 0,
                    x: -320,
                    y: 390,
                    scale: 0.5,
                    rotation: 0
                },
                {
                    frame: 180,
                    x: -80,
                    y: 390,
                    scale: 0.5,
                    rotation: 0
                },
                {
                    frame: 360,
                    x: 160,
                    y: 390,
                    scale: 0.5,
                    rotation: 0
                },
                {
                    frame: 540,
                    x: 400,
                    y: 390,
                    scale: 0.5,
                    rotation: 0
                },
                {
                    frame: 720,
                    x: 640,
                    y: 390,
                    scale: 0.5,
                    rotation: 0
                },
                {
                    frame: 900,
                    x: 880,
                    y: 390,
                    scale: 0.5,
                    rotation: 0
                },
                {
                    frame: 1080,
                    x: 1120,
                    y: 390,
                    scale: 0.5,
                    rotation: 0
                },
                {
                    frame: 1260,
                    x: 1360,
                    y: 390,
                    scale: 0.5,
                    rotation: 0
                },
                {
                    frame: 1440,
                    x: 1600,
                    y: 390,
                    scale: 0.5,
                    rotation: 0
                },
                {
                    frame: 1620,
                    x: 1840,
                    y: 390,
                    scale: 0.5,
                    rotation: 0
                },
                {
                    frame: 1800,
                    x: 2080,
                    y: 390,
                    scale: 0.5,
                    rotation: 0
                }
            ]
        },

        {
            id: "foreground_leaves",
            name: "Moving Foreground Leaves",
            svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 2400 250\" width=\"2400\" height=\"250\">" +
                "<g fill=\"#176b3a\" opacity=\"0.88\">" +
                    "<ellipse cx=\"120\" cy=\"175\" rx=\"80\" ry=\"24\" transform=\"rotate(-30 120 175)\"/>" +
                    "<ellipse cx=\"350\" cy=\"195\" rx=\"95\" ry=\"28\" transform=\"rotate(22 350 195)\"/>" +
                    "<ellipse cx=\"690\" cy=\"170\" rx=\"90\" ry=\"25\" transform=\"rotate(-20 690 170)\"/>" +
                    "<ellipse cx=\"1010\" cy=\"200\" rx=\"105\" ry=\"30\" transform=\"rotate(28 1010 200)\"/>" +
                    "<ellipse cx=\"1360\" cy=\"175\" rx=\"90\" ry=\"26\" transform=\"rotate(-25 1360 175)\"/>" +
                    "<ellipse cx=\"1700\" cy=\"195\" rx=\"110\" ry=\"30\" transform=\"rotate(18 1700 195)\"/>" +
                    "<ellipse cx=\"2070\" cy=\"170\" rx=\"95\" ry=\"27\" transform=\"rotate(-24 2070 170)\"/>" +
                    "<ellipse cx=\"2300\" cy=\"195\" rx=\"100\" ry=\"29\" transform=\"rotate(25 2300 195)\"/>" +
                "</g>" +
            "</svg>",

            zIndex: 4,

            keyframes: [
                {
                    frame: 0,
                    x: 0,
                    y: 830,
                    scale: 1,
                    rotation: 0
                },
                {
                    frame: 900,
                    x: -950,
                    y: 830,
                    scale: 1,
                    rotation: 0
                },
                {
                    frame: 1800,
                    x: -1900,
                    y: 830,
                    scale: 1,
                    rotation: 0
                }
            ]
        }
    ]
},
        {
            id: "p1_twinkle",
            name: "Twinkle Twinkle Little Star",
            duration: 60,
            audioTrack: null,
            audioClips: [],
            background: "#0b0b2a",
            actors: [
                {
                    id: "star_main",
                    name: "Twinkle Star",
                    svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 400 400\" width=\"400\" height=\"400\"><defs><radialGradient id=\"starGlow\" cx=\"50%\" cy=\"45%\" r=\"65%\"><stop offset=\"0\" stop-color=\"#fffde7\"/><stop offset=\"0.45\" stop-color=\"#ffe66d\"/><stop offset=\"1\" stop-color=\"#ffad33\"/></radialGradient><filter id=\"softGlow\" x=\"-50%\" y=\"-50%\" width=\"200%\" height=\"200%\"><feGaussianBlur stdDeviation=\"8\" result=\"blur\"/><feMerge><feMergeNode in=\"blur\"/><feMergeNode in=\"SourceGraphic\"/></feMerge></filter></defs><circle cx=\"200\" cy=\"200\" r=\"145\" fill=\"#ffe66d\" opacity=\"0.16\" filter=\"url(#softGlow)\"/><path d=\"M200 35 L238 148 L358 152 L263 223 L295 340 L200 272 L105 340 L137 223 L42 152 L162 148 Z\" fill=\"url(#starGlow)\" stroke=\"#fff6a8\" stroke-width=\"7\" stroke-linejoin=\"round\"/><path d=\"M166 178 Q180 160 194 178\" fill=\"none\" stroke=\"#6b4b18\" stroke-width=\"8\" stroke-linecap=\"round\"/><path d=\"M206 178 Q220 160 234 178\" fill=\"none\" stroke=\"#6b4b18\" stroke-width=\"8\" stroke-linecap=\"round\"/><circle cx=\"178\" cy=\"196\" r=\"7\" fill=\"#513713\"/><circle cx=\"222\" cy=\"196\" r=\"7\" fill=\"#513713\"/><path d=\"M174 220 Q200 246 226 220\" fill=\"none\" stroke=\"#6b4b18\" stroke-width=\"8\" stroke-linecap=\"round\"/><path d=\"M87 105 L75 70 M313 105 L325 70 M75 265 L48 285 M325 265 L352 285\" stroke=\"#fff7ad\" stroke-width=\"8\" stroke-linecap=\"round\"/><circle cx=\"115\" cy=\"115\" r=\"10\" fill=\"#fff\" opacity=\"0.8\"/><circle cx=\"285\" cy=\"115\" r=\"7\" fill=\"#fff\" opacity=\"0.8\"/></svg>",
                    zIndex: 3,
                    keyframes: [
                        { frame: 0, x: -240, y: 260, scale: 0.25, rotation: -35 },
                        { frame: 90, x: 180, y: 260, scale: 0.9, rotation: 0 },
                        { frame: 180, x: 180, y: 260, scale: 1.15, rotation: 8 },
                        { frame: 270, x: 180, y: 260, scale: 0.95, rotation: -8 },
                        { frame: 360, x: 180, y: 260, scale: 1, rotation: 0 },
                        { frame: 600, x: 460, y: 210, scale: 1.25, rotation: 25 },
                        { frame: 840, x: 760, y: 340, scale: 0.9, rotation: -20 },
                        { frame: 1080, x: 1040, y: 190, scale: 1.3, rotation: 35 },
                        { frame: 1320, x: 1310, y: 330, scale: 0.95, rotation: -25 },
                        { frame: 1500, x: 1550, y: 190, scale: 1.2, rotation: 15 },
                        { frame: 1680, x: 1810, y: 270, scale: 0.85, rotation: 0 },
                        { frame: 1800, x: 2070, y: 270, scale: 0.2, rotation: 30 }
                    ]
                },
                {
                    id: "moon_companion",
                    name: "Friendly Moon",
                    svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 300 300\" width=\"300\" height=\"300\"><circle cx=\"150\" cy=\"150\" r=\"105\" fill=\"#f5f0c8\" stroke=\"#fff8dc\" stroke-width=\"6\"/><circle cx=\"112\" cy=\"112\" r=\"20\" fill=\"#d8d09d\" opacity=\"0.7\"/><circle cx=\"185\" cy=\"155\" r=\"27\" fill=\"#d8d09d\" opacity=\"0.7\"/><circle cx=\"125\" cy=\"198\" r=\"13\" fill=\"#d8d09d\" opacity=\"0.7\"/><path d=\"M105 160 Q120 145 135 160 M165 160 Q180 145 195 160\" fill=\"none\" stroke=\"#56533d\" stroke-width=\"7\" stroke-linecap=\"round\"/><path d=\"M125 190 Q150 212 175 190\" fill=\"none\" stroke=\"#56533d\" stroke-width=\"7\" stroke-linecap=\"round\"/></svg>",
                    zIndex: 2,
                    keyframes: [
                        { frame: 0, x: 1650, y: 250, scale: 0.9, rotation: -8 },
                        { frame: 900, x: 1650, y: 230, scale: 1, rotation: 0 },
                        { frame: 1800, x: 1650, y: 250, scale: 0.9, rotation: 8 }
                    ]
                },
                {
                    id: "star_sparkles",
                    name: "Sparkle Trail",
                    svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 400 400\" width=\"400\" height=\"400\"><g fill=\"#fff6a8\"><path d=\"M70 90 l8 24 24 8-24 8-8 24-8-24-24-8 24-8z\"/><path d=\"M300 75 l6 18 18 6-18 6-6 18-6-18-18-6 18-6z\"/><path d=\"M310 300 l9 27 27 9-27 9-9 27-9-27-27-9 27-9z\"/><path d=\"M90 310 l5 15 15 5-15 5-5 15-5-15-15-5 15-5z\"/></g></svg>",
                    zIndex: 1,
                    keyframes: [
                        { frame: 0, x: -120, y: 260, scale: 0.1, rotation: 0 },
                        { frame: 300, x: 240, y: 260, scale: 0.75, rotation: 45 },
                        { frame: 900, x: 900, y: 270, scale: 1, rotation: 180 },
                        { frame: 1500, x: 1540, y: 250, scale: 0.7, rotation: 315 },
                        { frame: 1800, x: 2040, y: 270, scale: 0.1, rotation: 360 }
                    ]
                }
            ]
        },
        {
            id: "p2_spider",
            name: "Itsy Bitsy Spider",
            duration: 60,
            audioTrack: null,
            audioClips: [],
            background: "#87CEEB",
            actors: [
                {
                    id: "spider_main",
                    name: "Itsy Spider",
                    svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 200 200\" width=\"200\" height=\"200\"><defs><radialGradient id=\"bodyGrad\" cx=\"50%\" cy=\"30%\" r=\"70%\"><stop offset=\"0%\" stop-color=\"#444\"/><stop offset=\"100%\" stop-color=\"#111\"/></radialGradient></defs><ellipse cx=\"100\" cy=\"130\" rx=\"35\" ry=\"45\" fill=\"url(#bodyGrad)\" stroke=\"#000\" stroke-width=\"2\"/><circle cx=\"100\" cy=\"60\" r=\"28\" fill=\"url(#bodyGrad)\" stroke=\"#000\" stroke-width=\"2\"/><circle cx=\"90\" cy=\"52\" r=\"6\" fill=\"#fff\"/><circle cx=\"110\" cy=\"52\" r=\"6\" fill=\"#fff\"/><circle cx=\"90\" cy=\"52\" r=\"3\" fill=\"#000\"/><circle cx=\"110\" cy=\"52\" r=\"3\" fill=\"#000\"/><path d=\"M70 70 Q60 50 50 30\" stroke=\"#222\" stroke-width=\"3\" fill=\"none\"/><path d=\"M130 70 Q140 50 150 30\" stroke=\"#222\" stroke-width=\"3\" fill=\"none\"/><path d=\"M80 75 Q70 55 55 35\" stroke=\"#222\" stroke-width=\"3\" fill=\"none\"/><path d=\"M120 75 Q130 55 145 35\" stroke=\"#222\" stroke-width=\"3\" fill=\"none\"/><path d=\"M65 130 Q30 120 10 140\" stroke=\"#222\" stroke-width=\"3\" fill=\"none\"/><path d=\"M135 130 Q170 120 190 140\" stroke=\"#222\" stroke-width=\"3\" fill=\"none\"/><path d=\"M70 150 Q40 160 20 180\" stroke=\"#222\" stroke-width=\"3\" fill=\"none\"/><path d=\"M130 150 Q160 160 180 180\" stroke=\"#222\" stroke-width=\"3\" fill=\"none\"/><ellipse cx=\"100\" cy=\"90\" rx=\"12\" ry=\"8\" fill=\"#c44\" opacity=\"0.9\"/></svg>",
                    zIndex: 2,
                    keyframes: [
                        { frame: 0, x: 500, y: 900, scale: 1, rotation: 0 },
                        { frame: 900, x: 500, y: 300, scale: 1, rotation: 0 },
                        { frame: 1200, x: 500, y: 900, scale: 1, rotation: 180 }
                    ]
                },
                {
                    id: "spout_prop",
                    name: "Water Spout",
                    svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 120 300\" width=\"120\" height=\"300\"><defs><linearGradient id=\"pipeGrad\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"0%\"><stop offset=\"0%\" stop-color=\"#555\"/><stop offset=\"30%\" stop-color=\"#aaa\"/><stop offset=\"70%\" stop-color=\"#888\"/><stop offset=\"100%\" stop-color=\"#444\"/></linearGradient></defs><rect x=\"20\" y=\"0\" width=\"80\" height=\"300\" rx=\"10\" fill=\"url(#pipeGrad)\" stroke=\"#222\" stroke-width=\"4\"/><rect x=\"35\" y=\"10\" width=\"50\" height=\"280\" rx=\"6\" fill=\"none\" stroke=\"#666\" stroke-width=\"2\"/><ellipse cx=\"60\" cy=\"20\" rx=\"40\" ry=\"12\" fill=\"#777\" stroke=\"#222\" stroke-width=\"3\"/><ellipse cx=\"60\" cy=\"20\" rx=\"25\" ry=\"7\" fill=\"#444\"/><rect x=\"10\" y=\"260\" width=\"100\" height=\"20\" rx=\"4\" fill=\"#666\" stroke=\"#222\" stroke-width=\"3\"/><rect x=\"0\" y=\"280\" width=\"120\" height=\"20\" rx=\"4\" fill=\"#777\" stroke=\"#222\" stroke-width=\"3\"/></svg>",
                    zIndex: 1,
                    keyframes: [
                        { frame: 0, x: 480, y: 540, scale: 5, rotation: 0 }
                    ]
                }
            ]
        },
        maryProject,
        alphabetProject,
    ]
};

function seedDatabase() {
    return isDBEmpty().then(function (empty) {
        if (!empty) return;
        var chain = Promise.resolve();
        for (var i = 0; i < seedData.projects.length; i++) {
            (function (project) {
                chain = chain.then(function () { return saveProject(project); });
            })(seedData.projects[i]);
        }
        return chain;
    });
}
