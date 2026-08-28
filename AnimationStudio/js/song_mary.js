/*
 * MARY HAD A LITTLE LAMB
 * Production format: 1920 × 1080, 30 FPS, 60 seconds
 *
 * Timeline:
 * 00:00–00:08  Intro: Mary waves
 * 00:08–00:18  Verse 1: Lamb follows Mary to school
 * 00:18–00:28  Verse 2: Lamb stays in school
 * 00:28–00:38  Verse 3: Snowy schoolyard
 * 00:38–00:50  Recap all three scenes
 * 00:50–01:00  Celebration finale
 */
function initmarysong(){
const FPS = 30;
const TOTAL_FRAMES = 1800;

const encodeSvg = (svg) => svg;

const keyframe = (frame, x, y, scale = 1, rotation = 0) => ({
    frame, x, y, scale, rotation
});

const hiddenKeyframe = (frame, x = 0, y = 0) =>
    keyframe(frame, x, y, 0.001, 0);

const createSkySvg = () => encodeSvg(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">
        <defs>
            <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stop-color="#87CEEB"/>
                <stop offset="0.6" stop-color="#B0E0E6"/>
                <stop offset="1" stop-color="#E0F6FF"/>
            </linearGradient>
            <linearGradient id="grass" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stop-color="#7CFC00"/>
                <stop offset="1" stop-color="#228B22"/>
            </linearGradient>
            <filter id="cloudBlur">
                <feGaussianBlur stdDeviation="2"/>
            </filter>
        </defs>
        <rect width="1920" height="1080" fill="url(#sky)"/>
        <circle cx="1700" cy="150" r="70" fill="#FFFACD" opacity="0.9"/>
        <circle cx="1700" cy="150" r="110" fill="#FFFACD" opacity="0.3"/>
        <g filter="url(#cloudBlur)" fill="white" opacity="0.85">
            <ellipse cx="300" cy="180" rx="120" ry="40"/>
            <ellipse cx="370" cy="160" rx="80" ry="35"/>
            <ellipse cx="230" cy="160" rx="70" ry="30"/>
            <ellipse cx="1200" cy="140" rx="100" ry="35"/>
            <ellipse cx="1260" cy="120" rx="70" ry="28"/>
            <ellipse cx="1140" cy="120" rx="65" ry="25"/>
        </g>
        <rect y="750" width="1920" height="330" fill="url(#grass)"/>
        <path d="M0 820 Q480 780 960 820 Q1440 780 1920 820 L1920 1080 L0 1080 Z" fill="#32CD32" opacity="0.6"/>
    </svg>
`);

const createSnowySvg = () => encodeSvg(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">
        <defs>
            <linearGradient id="snowSky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stop-color="#B0C4DE"/>
                <stop offset="1" stop-color="#E8E8E8"/>
            </linearGradient>
        </defs>
        <rect width="1920" height="1080" fill="url(#snowSky)"/>
        <circle cx="300" cy="200" r="25" fill="white" opacity="0.7"/>
        <circle cx="800" cy="150" r="18" fill="white" opacity="0.6"/>
        <circle cx="1400" cy="180" r="22" fill="white" opacity="0.7"/>
        <circle cx="1700" cy="120" r="15" fill="white" opacity="0.5"/>
        <rect y="750" width="1920" height="330" fill="#F0F8FF"/>
        <path d="M0 820 Q480 790 960 820 Q1440 790 1920 820 L1920 1080 L0 1080 Z" fill="white" opacity="0.8"/>
        <g fill="white" opacity="0.6">
            <circle cx="200" cy="800" r="8"/>
            <circle cx="500" cy="850" r="6"/>
            <circle cx="800" cy="820" r="10"/>
            <circle cx="1100" cy="860" r="7"/>
            <circle cx="1400" cy="830" r="9"/>
            <circle cx="1700" cy="870" r="6"/>
            <circle cx="350" cy="900" r="8"/>
            <circle cx="650" cy="920" r="6"/>
            <circle cx="950" cy="890" r="10"/>
            <circle cx="1250" cy="930" r="7"/>
            <circle cx="1550" cy="910" r="8"/>
        </g>
    </svg>
`);

const createSchoolhouseSvg = () => encodeSvg(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 350" width="400" height="350">
        <defs>
            <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stop-color="#FFF8DC"/>
                <stop offset="1" stop-color="#F5DEB3"/>
            </linearGradient>
        </defs>
        <rect x="50" y="120" width="300" height="220" fill="url(#wall)" stroke="#8B4513" stroke-width="4"/>
        <polygon points="40,120 200,30 360,120" fill="#8B0000" stroke="#8B4513" stroke-width="3"/>
        <rect x="160" y="180" width="80" height="160" fill="#8B4513" rx="4"/>
        <circle cx="240" cy="260" r="8" fill="#FFD700"/>
        <rect x="80" y="150" width="60" height="50" fill="#87CEEB" stroke="#8B4513" stroke-width="3"/>
        <rect x="260" y="150" width="60" height="50" fill="#87CEEB" stroke="#8B4513" stroke-width="3"/>
        <line x1="110" y1="150" x2="110" y2="200" stroke="#8B4513" stroke-width="2"/>
        <line x1="80" y1="175" x2="140" y2="175" stroke="#8B4513" stroke-width="2"/>
        <line x1="290" y1="150" x2="290" y2="200" stroke="#8B4513" stroke-width="2"/>
        <line x1="260" y1="175" x2="320" y2="175" stroke="#8B4513" stroke-width="2"/>
        <text x="200" y="85" text-anchor="middle" font-family="Georgia, serif" font-size="22" font-weight="bold" fill="#8B0000">SCHOOL</text>
    </svg>
`);

const createMarySvg = () => encodeSvg(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300" width="200" height="300">
        <defs>
            <linearGradient id="dress" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stop-color="#FF69B4"/>
                <stop offset="1" stop-color="#C71585"/>
            </linearGradient>
            <linearGradient id="skin" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stop-color="#FFDAB9"/>
                <stop offset="1" stop-color="#F5DEB3"/>
            </linearGradient>
            <filter id="maryShadow">
                <feDropShadow dx="0" dy="4" stdDeviation="3" flood-color="#000" flood-opacity="0.15"/>
            </filter>
        </defs>
        <g filter="url(#maryShadow)">
            <ellipse cx="100" cy="260" rx="45" ry="15" fill="#000" opacity="0.1"/>
            <path d="M55 160 Q50 220 60 280 L140 280 Q150 220 145 160 Z" fill="url(#dress)"/>
            <path d="M60 170 Q100 190 140 170 L145 220 Q100 240 55 220 Z" fill="#FFB6C1"/>
            <circle cx="100" cy="100" r="50" fill="url(#skin)"/>
            <path d="M55 90 Q60 40 100 35 Q140 40 145 90 Q140 75 100 72 Q60 75 55 90 Z" fill="#FFD700"/>
            <path d="M50 85 Q55 50 100 45 Q145 50 150 85" fill="none" stroke="#FFD700" stroke-width="3"/>
            <circle cx="82" cy="95" r="6" fill="#4169E1"/>
            <circle cx="118" cy="95" r="6" fill="#4169E1"/>
            <circle cx="84" cy="93" r="2" fill="white"/>
            <circle cx="120" cy="93" r="2" fill="white"/>
            <path d="M92 115 Q100 122 108 115" fill="none" stroke="#FF69B4" stroke-width="3" stroke-linecap="round"/>
            <circle cx="70" cy="110" r="10" fill="url(#skin)" opacity="0.3"/>
            <circle cx="130" cy="110" r="10" fill="url(#skin)" opacity="0.3"/>
        </g>
    </svg>
`);

const createLambSvg = () => encodeSvg(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 140" width="160" height="140">
        <defs>
            <filter id="lambFluff">
                <feGaussianBlur stdDeviation="1.5"/>
            </filter>
        </defs>
        <g filter="url(#lambFluff)">
            <ellipse cx="80" cy="90" rx="50" ry="40" fill="white" stroke="#E8E8E8" stroke-width="1"/>
            <ellipse cx="80" cy="90" rx="35" ry="28" fill="#F8F8FF"/>
            <circle cx="80" cy="50" r="28" fill="white" stroke="#E8E8E8" stroke-width="1"/>
            <circle cx="80" cy="50" r="20" fill="#F8F8FF"/>
            <ellipse cx="65" cy="46" rx="4" ry="5" fill="#333"/>
            <ellipse cx="95" cy="46" rx="4" ry="5" fill="#333"/>
            <circle cx="66" cy="45" r="1.5" fill="white"/>
            <circle cx="96" cy="45" r="1.5" fill="white"/>
            <ellipse cx="80" cy="56" rx="4" ry="2.5" fill="#FFB6C1"/>
            <rect x="65" y="125" width="8" height="15" fill="#DDD" rx="3"/>
            <rect x="87" y="125" width="8" height="15" fill="#DDD" rx="3"/>
            <path d="M42 75 Q30 60 35 50" fill="none" stroke="white" stroke-width="8" stroke-linecap="round"/>
            <path d="M118 75 Q130 60 125 50" fill="none" stroke="white" stroke-width="8" stroke-linecap="round"/>
        </g>
    </svg>
`);

const createLabelSvg = ({
    title, subtitle, accent = "#FF69B4", icon = "♪"
}) => encodeSvg(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 120" width="600" height="120">
        <defs>
            <filter id="labelShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.1"/>
            </filter>
        </defs>
        <g filter="url(#labelShadow)">
            <rect x="4" y="4" width="592" height="112" rx="28" fill="white" opacity="0.95"/>
            <rect x="4" y="4" width="16" height="112" rx="8" fill="${accent}"/>
            <circle cx="70" cy="60" r="28" fill="${accent}" opacity="0.12"/>
            <text x="70" y="68" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="${accent}">${icon}</text>
            <text x="130" y="52" font-family="Arial, sans-serif" font-size="28" font-weight="700" fill="#2C3E50">${title}</text>
            <text x="130" y="82" font-family="Arial, sans-serif" font-size="18" fill="#7F8C8D">${subtitle}</text>
        </g>
    </svg>
`);

const createSpotlightSvg = (accent = "#FFD700") => encodeSvg(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
        <defs>
            <radialGradient id="spot" cx="50%" cy="50%" r="50%">
                <stop offset="0" stop-color="${accent}" stop-opacity="0.2"/>
                <stop offset="0.7" stop-color="${accent}" stop-opacity="0.05"/>
                <stop offset="1" stop-color="${accent}" stop-opacity="0"/>
            </radialGradient>
        </defs>
        <circle cx="150" cy="150" r="140" fill="url(#spot)"/>
        <circle cx="150" cy="150" r="100" fill="none" stroke="${accent}" stroke-width="3" stroke-dasharray="20 12" opacity="0.6"/>
    </svg>
`);

const maryProject = {
    id: "p3_mary",
    name: "Mary Had a Little Lamb",
    duration: 60,
    fps: FPS,
    totalFrames: TOTAL_FRAMES,
    audioTrack: null,
    audioClips: [],
    background: "#87CEEB",
    metadata: {
        category: "Nursery Rhymes",
        subject: "Music & Movement",
        audience: "Children",
        resolution: [1920, 1080],
        frameRate: 30,
        safeArea: { top: 60, right: 80, bottom: 60, left: 80 },
        designSystem: {
            primary: "#FF69B4",
            secondary: "#FFB6C1",
            accent: "#FFD700",
            green: "#32CD32",
            brown: "#8B4513",
            sky: "#87CEEB",
            text: "#2C3E50"
        }
    },
    actors: [
        {
            id: "bg_day",
            name: "Sunny Schoolyard",
            svg: createSkySvg(),
            zIndex: 0,
            keyframes: [
                keyframe(0, 0, 0, 1, 0),
                keyframe(1800, 0, 0, 1, 0)
            ]
        },
        {
            id: "bg_snow",
            name: "Snowy Schoolyard",
            svg: createSnowySvg(),
            zIndex: 0,
            keyframes: [
                hiddenKeyframe(0),
                hiddenKeyframe(1200),
                keyframe(1260, 0, 0, 1, 0),
                keyframe(1500, 0, 0, 1, 0),
                hiddenKeyframe(1800)
            ]
        },
        {
            id: "schoolhouse",
            name: "Schoolhouse",
            svg: createSchoolhouseSvg(),
            zIndex: 1,
            keyframes: [
                keyframe(0, 1300, 620, 1.8, 0),
                keyframe(1800, 1300, 620, 1.8, 0)
            ]
        },
        {
            id: "mary",
            name: "Mary",
            svg: createMarySvg(),
            zIndex: 3,
            keyframes: [
                keyframe(0, 400, 750, 1.2, 0),
                keyframe(60, 400, 745, 1.2, -2),
                keyframe(120, 400, 750, 1.2, 0),
                keyframe(240, 650, 750, 1.2, 0),
                keyframe(540, 650, 750, 1.2, 0),
                keyframe(600, 650, 745, 1.2, 2),
                keyframe(660, 650, 750, 1.2, 0),
                keyframe(1080, 650, 750, 1.2, 0),
                keyframe(1140, 650, 745, 1.2, -2),
                keyframe(1200, 650, 750, 1.2, 0),
                keyframe(1500, 650, 750, 1.2, 0),
                keyframe(1560, 400, 750, 1.2, 0),
                keyframe(1800, 400, 750, 1.2, 0)
            ]
        },
        {
            id: "lamb",
            name: "Little Lamb",
            svg: createLambSvg(),
            zIndex: 2,
            keyframes: [
                hiddenKeyframe(0),
                keyframe(120, 250, 820, 1.1, 0),
                keyframe(180, 280, 815, 1.1, 3),
                keyframe(240, 310, 820, 1.1, 0),
                keyframe(300, 340, 815, 1.1, -3),
                keyframe(360, 370, 820, 1.1, 0),
                keyframe(420, 400, 815, 1.1, 2),
                keyframe(480, 430, 820, 1.1, 0),
                keyframe(540, 500, 820, 1.1, 0),
                keyframe(600, 530, 815, 1.1, -2),
                keyframe(660, 560, 820, 1.1, 0),
                keyframe(1080, 560, 820, 1.1, 0),
                keyframe(1140, 530, 815, 1.1, 3),
                keyframe(1200, 500, 820, 1.1, 0),
                keyframe(1500, 250, 820, 1.1, 0),
                keyframe(1560, 220, 815, 1.1, -3),
                keyframe(1620, 190, 820, 1.1, 0),
                keyframe(1680, 160, 815, 1.1, 2),
                keyframe(1740, 130, 820, 1.1, 0),
                keyframe(1800, 100, 820, 1.1, 0)
            ]
        },
        {
            id: "label_intro",
            name: "Intro Label",
            svg: createLabelSvg({
                title: "Mary Had a Little Lamb",
                subtitle: "A classic nursery rhyme",
                accent: "#FF69B4",
                icon: "♫"
            }),
            zIndex: 5,
            keyframes: [
                hiddenKeyframe(0),
                keyframe(30, 960, 200, 1, 0),
                keyframe(90, 960, 180, 1.05, 0),
                keyframe(450, 960, 180, 1.05, 0),
                keyframe(510, 960, 200, 1, 0),
                hiddenKeyframe(540)
            ]
        },
        {
            id: "label_v1",
            name: "Verse 1 Label",
            svg: createLabelSvg({
                title: "Mary had a little lamb",
                subtitle: "Its fleece was white as snow",
                accent: "#FFD700",
                icon: "✦"
            }),
            zIndex: 5,
            keyframes: [
                hiddenKeyframe(0),
                hiddenKeyframe(540),
                keyframe(570, 960, 200, 1, 0),
                keyframe(630, 960, 180, 1.05, 0),
                keyframe(1020, 960, 180, 1.05, 0),
                keyframe(1080, 960, 200, 1, 0),
                hiddenKeyframe(1110)
            ]
        },
        {
            id: "label_v2",
            name: "Verse 2 Label",
            svg: createLabelSvg({
                title: "It followed her to school one day",
                subtitle: "Which was against the rule",
                accent: "#32CD32",
                icon: "★"
            }),
            zIndex: 5,
            keyframes: [
                hiddenKeyframe(0),
                hiddenKeyframe(1110),
                keyframe(1140, 960, 200, 1, 0),
                keyframe(1200, 960, 180, 1.05, 0),
                keyframe(1590, 960, 180, 1.05, 0),
                keyframe(1650, 960, 200, 1, 0),
                hiddenKeyframe(1680)
            ]
        },
        {
            id: "label_v3",
            name: "Verse 3 Label",
            svg: createLabelSvg({
                title: "The snow did blow",
                subtitle: "And the school was closed",
                accent: "#87CEEB",
                icon: "❄"
            }),
            zIndex: 5,
            keyframes: [
                hiddenKeyframe(0),
                hiddenKeyframe(1680),
                keyframe(1710, 960, 200, 1, 0),
                keyframe(1770, 960, 180, 1.05, 0),
                keyframe(2100, 960, 180, 1.05, 0),
                keyframe(2160, 960, 200, 1, 0),
                hiddenKeyframe(2190)
            ]
        },
        {
            id: "celebrate",
            name: "Celebration",
            svg: createSpotlightSvg("#FFD700"),
            zIndex: 6,
            keyframes: [
                hiddenKeyframe(0),
                hiddenKeyframe(2400),
                keyframe(2460, 960, 540, 1.2, 0),
                keyframe(2520, 960, 520, 1.3, 5),
                keyframe(2580, 960, 540, 1.2, -5),
                keyframe(2640, 960, 540, 1.2, 0),
                keyframe(2700, 960, 540, 1.2, 0),
                hiddenKeyframe(2760)
            ]
        }
    ]
};

return maryProject;
}
var maryProject=initmarysong();