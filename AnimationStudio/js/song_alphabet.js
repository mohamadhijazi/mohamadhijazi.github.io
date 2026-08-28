/*
 * ABCD... THE ALPHABET ADVENTURE
 * Production format: 1920 × 1080, 30 FPS, 180 seconds (3 minutes)
 *
 * Timeline:
 * 00:00–00:05  Intro: Welcome to Alphabet Land
 * 00:05–00:35  A B C D E F G H I J K L M
 * 00:35–01:05  N O P Q R S T U V W X Y Z
 * 01:05–01:30  Recap: Sing the alphabet song
 * 01:30–03:00  Celebration & interactive review
 */
function initAlphabetsong(){
const FPS = 30;
const TOTAL_FRAMES = 5400;

const encodeSvg = (svg) => svg;

const keyframe = (frame, x, y, scale = 1, rotation = 0) => ({
    frame, x, y, scale, rotation
});

const hiddenKeyframe = (frame, x = 0, y = 0) =>
    keyframe(frame, x, y, 0.001, 0);

const createChalkboardSvg = () => encodeSvg(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">
        <defs>
            <linearGradient id="boardBg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stop-color="#2E8B57"/>
                <stop offset="1" stop-color="#1a5e3a"/>
            </linearGradient>
            <filter id="chalkDust">
                <feGaussianBlur stdDeviation="1"/>
            </filter>
        </defs>
        <rect width="1920" height="1080" fill="#1a1a2e"/>
        <rect x="160" y="80" width="1600" height="920" rx="20" fill="url(#boardBg)" stroke="#8B4513" stroke-width="24"/>
        <rect x="180" y="100" width="1560" height="880" rx="8" fill="#2E8B57" opacity="0.3"/>
        <g filter="url(#chalkDust)" fill="white" opacity="0.15">
            <circle cx="300" cy="200" r="3"/>
            <circle cx="500" cy="400" r="2"/>
            <circle cx="800" cy="300" r="4"/>
            <circle cx="1200" cy="500" r="3"/>
            <circle cx="1500" cy="250" r="2"/>
            <circle cx="1700" cy="600" r="3"/>
        </g>
    </svg>
`);

const createLetterSvg = (letter, color, objectSvg) => encodeSvg(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
        <defs>
            <linearGradient id="letterBg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stop-color="${color}" stop-opacity="0.2"/>
                <stop offset="1" stop-color="${color}" stop-opacity="0.05"/>
            </linearGradient>
        </defs>
        <circle cx="150" cy="150" r="140" fill="url(#letterBg)" stroke="${color}" stroke-width="4" opacity="0.8"/>
        <circle cx="150" cy="150" r="110" fill="none" stroke="${color}" stroke-width="2" stroke-dasharray="15 10" opacity="0.5"/>
        <text x="150" y="195" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-size="140" font-weight="900" fill="${color}" opacity="0.9">${letter}</text>
        ${objectSvg}
    </svg>
`);

const createObjectSvg = (type, color) => {
    const svg = {
        'apple': `<circle cx="150" cy="260" r="28" fill="#FF6B6B"/><circle cx="150" cy="260" r="20" fill="#FF8E8E"/><path d="M150 232 Q155 220 160 225" fill="none" stroke="#228B22" stroke-width="3"/>`,
        'ball': `<circle cx="150" cy="265" r="30" fill="#4ECDC4"/><path d="M120 265 Q150 250 180 265" fill="none" stroke="#fff" stroke-width="2" opacity="0.5"/>`,
        'cat': `<ellipse cx="150" cy="270" rx="35" ry="25" fill="#FFA500"/><circle cx="150" cy="245" r="22" fill="#FFA500"/><polygon points="130,230 138,245 125,245" fill="#FFA500"/><polygon points="170,230 162,245 175,245" fill="#FFA500"/>`,
        'dog': `<ellipse cx="150" cy="270" rx="32" ry="26" fill="#8B4513"/><circle cx="150" cy="245" r="24" fill="#8B4513"/><ellipse cx="135" cy="240" rx="5" ry="7" fill="#333"/><ellipse cx="165" cy="240" rx="5" ry="7" fill="#333"/>`,
        'elephant': `<ellipse cx="150" cy="265" rx="40" ry="32" fill="#A0A0A0"/><circle cx="150" cy="240" r="30" fill="#A0A0A0"/><path d="M150 265 Q145 290 150 295" fill="none" stroke="#A0A0A0" stroke-width="8"/>`,
        'fish': `<ellipse cx="150" cy="265" rx="35" ry="22" fill="#FF6B6B"/><polygon points="185,265 210,250 210,280" fill="#FF6B6B"/><circle cx="130" cy="260" r="4" fill="white"/><circle cx="131" cy="261" r="2" fill="black"/>`,
        'grapes': `<circle cx="135" cy="255" r="12" fill="#9B59B6"/><circle cx="155" cy="255" r="12" fill="#9B59B6"/><circle cx="145" cy="275" r="12" fill="#9B59B6"/><circle cx="150" cy="245" r="12" fill="#9B59B6"/>`,
        'house': `<rect x="115" y="240" width="70" height="55" fill="#E74C3C"/><polygon points="110,240 150,210 190,240" fill="#C0392B"/><rect x="140" y="260" width="20" height="35" fill="#8B4513"/>`,
        'ice': `<rect x="120" y="235" width="60" height="65" rx="5" fill="#AED6F1"/><rect x="128" y="245" width="44" height="8" fill="#EBF5FB"/>`,
        'jar': `<path d="M125 245 L125 280 Q125 295 150 295 Q175 295 175 280 L175 245" fill="#F39C12" opacity="0.7"/><rect x="120" y="240" width="60" height="10" fill="#E67E22"/>`,
        'kite': `<polygon points="150,235 165,265 150,280 135,265" fill="#E74C3C"/><line x1="150" y1="280" x2="150" y2="300" stroke="#333" stroke-width="2"/>`,
        'lion': `<circle cx="150" cy="255" r="28" fill="#F39C12"/><circle cx="150" cy="250" r="20" fill="#F39C12"/><circle cx="140" cy="245" r="3" fill="black"/><circle cx="160" cy="245" r="3" fill="black"/><path d="M145 258 Q150 263 155 258" fill="none" stroke="black" stroke-width="2"/>`,
        'moon': `<circle cx="150" cy="265" r="28" fill="#F1C40F"/><circle cx="160" cy="258" r="22" fill="#1a1a2e"/>`,
        'nose': `<ellipse cx="150" cy="265" rx="12" ry="18" fill="#FFB6C1"/><circle cx="142" cy="258" r="3" fill="#FF69B4" opacity="0.5"/>`,
        'ocean': `<path d="M120 250 Q135 240 150 250 Q165 260 180 250 L180 290 L120 290 Z" fill="#3498DB"/><path d="M125 260 Q140 250 155 260 Q170 270 185 260" fill="none" stroke="white" stroke-width="2" opacity="0.6"/>`,
        'pig': `<ellipse cx="150" cy="268" rx="30" ry="24" fill="#FFB6C1"/><circle cx="150" cy="248" r="22" fill="#FFB6C1"/><ellipse cx="150" cy="255" rx="8" ry="6" fill="#FF69B4"/><circle cx="142" cy="243" r="3" fill="black"/><circle cx="158" cy="243" r="3" fill="black"/>`,
        'queen': `<polygon points="150,230 140,250 160,250" fill="#FFD700"/><circle cx="150" cy="265" r="25" fill="#9B59B6"/><circle cx="150" cy="258" r="4" fill="white"/><circle cx="150" cy="258" r="2" fill="black"/>`,
        'rainbow': `<path d="M100 280 Q150 200 200 280" fill="none" stroke="#FF0000" stroke-width="8"/><path d="M108 280 Q150 215 192 280" fill="none" stroke="#FF7F00" stroke-width="8"/><path d="M116 280 Q150 230 184 280" fill="none" stroke="#FFFF00" stroke-width="8"/><path d="M124 280 Q150 245 176 280" fill="none" stroke="#00FF00" stroke-width="8"/>`,
        'sun': `<circle cx="150" cy="260" r="30" fill="#F1C40F"/><g stroke="#F1C40F" stroke-width="4" stroke-linecap="round"><line x1="150" y1="220" x2="150" y2="200"/><line x1="150" y1="300" x2="150" y2="320"/><line x1="110" y1="260" x2="90" y2="260"/><line x1="190" y1="260" x2="210" y2="260"/><line x1="122" y1="232" x2="108" y2="218"/><line x1="178" y1="288" x2="192" y2="302"/><line x1="178" y1="232" x2="192" y2="218"/><line x1="122" y1="288" x2="108" y2="302"/></g>`,
        'tree': `<rect x="140" y="250" width="20" height="40" fill="#8B4513"/><circle cx="150" cy="235" r="30" fill="#27AE60"/><circle cx="135" cy="225" r="20" fill="#2ECC71"/><circle cx="165" cy="225" r="20" fill="#2ECC71"/>`,
        'umbrella': `<line x1="150" y1="290" x2="150" y2="260" stroke="#8B4513" stroke-width="4"/><path d="M100 260 Q150 230 200 260" fill="#E74C3C" stroke="#C0392B" stroke-width="2"/>`,
        'violin': `<ellipse cx="140" cy="270" rx="18" ry="25" fill="#8B4513"/><ellipse cx="160" cy="270" rx="18" ry="25" fill="#8B4513"/><rect x="145" y="235" width="10" height="30" fill="#8B4513"/><line x1="148" y1="240" x2="148" y2="285" stroke="#333" stroke-width="1"/><line x1="152" y1="240" x2="152" y2="285" stroke="#333" stroke-width="1"/>`,
        'watch': `<circle cx="150" cy="265" r="25" fill="white" stroke="#333" stroke-width="3"/><circle cx="150" cy="265" r="3" fill="black"/><line x1="150" y1="265" x2="150" y2="248" stroke="black" stroke-width="2"/><line x1="150" y1="265" x2="162" y2="265" stroke="black" stroke-width="2"/>`,
        'xray': `<rect x="125" y="235" width="50" height="60" rx="5" fill="none" stroke="#333" stroke-width="3"/><circle cx="150" cy="265" r="12" fill="none" stroke="#333" stroke-width="2"/><line x1="150" y1="253" x2="150" y2="277" stroke="#333" stroke-width="2"/>`,
        'yacht': `<path d="M120 275 L150 240 L180 275 L170 285 L130 285 Z" fill="white" stroke="#333" stroke-width="2"/><line x1="150" y1="240" x2="150" y2="220" stroke="#333" stroke-width="2"/><polygon points="150,220 165,235 150,235" fill="#E74C3C"/>`,
        'zebra': `<ellipse cx="150" cy="268" rx="30" ry="22" fill="white" stroke="black" stroke-width="1"/><circle cx="150" cy="248" r="20" fill="white" stroke="black" stroke-width="1"/><line x1="140" y1="255" x2="140" y2="280" stroke="black" stroke-width="2"/><line x1="150" y1="255" x2="150" y2="280" stroke="black" stroke-width="2"/><line x1="160" y1="255" x2="160" y2="280" stroke="black" stroke-width="2"/>`
    };
    return svg[type] || '';
};

const alphabetData = [
    { letter: 'A', word: 'Apple', color: '#FF6B6B', type: 'apple' },
    { letter: 'B', word: 'Ball', color: '#4ECDC4', type: 'ball' },
    { letter: 'C', word: 'Cat', color: '#FFA500', type: 'cat' },
    { letter: 'D', word: 'Dog', color: '#8B4513', type: 'dog' },
    { letter: 'E', word: 'Elephant', color: '#A0A0A0', type: 'elephant' },
    { letter: 'F', word: 'Fish', color: '#FF6B6B', type: 'fish' },
    { letter: 'G', word: 'Grapes', color: '#9B59B6', type: 'grapes' },
    { letter: 'H', word: 'House', color: '#E74C3C', type: 'house' },
    { letter: 'I', word: 'Ice Cream', color: '#AED6F1', type: 'ice' },
    { letter: 'J', word: 'Jar', color: '#F39C12', type: 'jar' },
    { letter: 'K', word: 'Kite', color: '#E74C3C', type: 'kite' },
    { letter: 'L', word: 'Lion', color: '#F39C12', type: 'lion' },
    { letter: 'M', word: 'Moon', color: '#F1C40F', type: 'moon' },
    { letter: 'N', word: 'Nose', color: '#FFB6C1', type: 'nose' },
    { letter: 'O', word: 'Ocean', color: '#3498DB', type: 'ocean' },
    { letter: 'P', word: 'Pig', color: '#FFB6C1', type: 'pig' },
    { letter: 'Q', word: 'Queen', color: '#FFD700', type: 'queen' },
    { letter: 'R', word: 'Rainbow', color: '#E74C3C', type: 'rainbow' },
    { letter: 'S', word: 'Sun', color: '#F1C40F', type: 'sun' },
    { letter: 'T', word: 'Tree', color: '#27AE60', type: 'tree' },
    { letter: 'U', word: 'Umbrella', color: '#E74C3C', type: 'umbrella' },
    { letter: 'V', word: 'Violin', color: '#8B4513', type: 'violin' },
    { letter: 'W', word: 'Watch', color: '#333333', type: 'watch' },
    { letter: 'X', word: 'X-Ray', color: '#333333', type: 'xray' },
    { letter: 'Y', word: 'Yacht', color: '#FFFFFF', type: 'yacht' },
    { letter: 'Z', word: 'Zebra', color: '#FFFFFF', type: 'zebra' }
];

const createIntroLabel = () => encodeSvg(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 140" width="800" height="140">
        <defs>
            <filter id="introShadow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#000" flood-opacity="0.2"/>
            </filter>
        </defs>
        <g filter="url(#introShadow)">
            <rect x="4" y="4" width="792" height="132" rx="32" fill="white" opacity="0.95"/>
            <rect x="4" y="4" width="20" height="132" rx="10" fill="#9B59B6"/>
            <circle cx="90" cy="70" r="35" fill="#9B59B6" opacity="0.12"/>
            <text x="90" y="80" text-anchor="middle" font-family="Arial, sans-serif" font-size="32" fill="#9B59B6">★</text>
            <text x="160" y="62" font-family="Arial Black, Arial, sans-serif" font-size="36" font-weight="900" fill="#2C3E50">ABCD...</text>
            <text x="160" y="100" font-family="Arial, sans-serif" font-size="22" fill="#7F8C8D">The Alphabet Adventure</text>
        </g>
    </svg>
`);

const createLetterLabel = (letter, word, color) => encodeSvg(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 80" width="300" height="80">
        <rect x="4" y="4" width="292" height="72" rx="16" fill="white" opacity="0.9"/>
        <rect x="4" y="4" width="8" height="72" rx="4" fill="${color}"/>
        <text x="35" y="52" font-family="Arial Black, Arial, sans-serif" font-size="32" font-weight="900" fill="${color}">${letter}</text>
        <text x="90" y="52" font-family="Arial, sans-serif" font-size="24" fill="#555">is for</text>
        <text x="200" y="52" font-family="Arial, sans-serif" font-size="24" font-weight="700" fill="#333">${word}</text>
    </svg>
`);

const createRecapLabel = () => encodeSvg(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 120" width="700" height="120">
        <defs>
            <filter id="recapShadow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.15"/>
            </filter>
        </defs>
        <g filter="url(#recapShadow)">
            <rect x="4" y="4" width="692" height="112" rx="28" fill="white" opacity="0.95"/>
            <rect x="4" y="4" width="16" height="112" rx="8" fill="#9B59B6"/>
            <circle cx="75" cy="60" r="28" fill="#9B59B6" opacity="0.12"/>
            <text x="75" y="68" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="#9B59B6">♪</text>
            <text x="120" y="52" font-family="Arial, sans-serif" font-size="28" font-weight="700" fill="#2C3E50">Now I know my ABCs!</text>
            <text x="120" y="82" font-family="Arial, sans-serif" font-size="18" fill="#7F8C8D">Next time won't you sing with me!</text>
        </g>
    </svg>
`);

return alphabetProject = {
    id: "p4_alphabet",
    name: "ABCD... The Alphabet Adventure",
    duration: 180,
    fps: FPS,
    totalFrames: TOTAL_FRAMES,
    audioTrack: null,
    audioClips: [],
    background: "#1a1a2e",
    metadata: {
        category: "Early Learning",
        subject: "Letters & Phonics",
        audience: "Children",
        resolution: [1920, 1080],
        frameRate: 30,
        safeArea: { top: 60, right: 80, bottom: 60, left: 80 },
        designSystem: {
            primary: "#9B59B6",
            secondary: "#8E44AD",
            accent: "#F1C40F",
            success: "#2ECC71",
            warning: "#F39C12",
            danger: "#E74C3C",
            background: "#1a1a2e",
            text: "#FFFFFF"
        }
    },
    actors: [
        {
            id: "chalkboard",
            name: "Chalkboard Background",
            svg: createChalkboardSvg(),
            zIndex: 0,
            keyframes: [
                keyframe(0, 960, 540, 1, 0),
                keyframe(5400, 960, 540, 1, 0)
            ]
        },
        {
            id: "intro_label",
            name: "Welcome Label",
            svg: createIntroLabel(),
            zIndex: 10,
            keyframes: [
                hiddenKeyframe(0),
                keyframe(30, 960, 180, 1, 0),
                keyframe(90, 960, 160, 1.05, 0),
                keyframe(270, 960, 160, 1.05, 0),
                keyframe(330, 960, 180, 1, 0),
                hiddenKeyframe(360)
            ]
        }
    ].concat(
        alphabetData.map((item, i) => {
            const startFrame = 300 + (i * 180);
            const endFrame = startFrame + 150;
            const cols = 6;
            const col = i % cols;
            const row = Math.floor(i / cols);
            const xPos = 280 + (col * 280);
            const yPos = 320 + (row * 320);
            return {
                id: `letter_${item.letter.toLowerCase()}`,
                name: `${item.letter} is for ${item.word}`,
                svg: createLetterSvg(item.letter, item.color, createObjectSvg(item.type, item.color)),
                zIndex: 2 + (i % 3),
                keyframes: [
                    hiddenKeyframe(startFrame - 30),
                    keyframe(startFrame, xPos, yPos, 0.001, -15),
                    keyframe(startFrame + 30, xPos, yPos, 1.1, 5),
                    keyframe(startFrame + 60, xPos, yPos, 1, 0),
                    keyframe(startFrame + 120, xPos, yPos, 1, 0),
                    keyframe(endFrame, xPos, yPos, 0.9, 0),
                    hiddenKeyframe(endFrame + 30)
                ]
            };
        })
    ).concat([
        {
            id: "recap_label",
            name: "Recap Label",
            svg: createRecapLabel(),
            zIndex: 10,
            keyframes: [
                hiddenKeyframe(0),
                hiddenKeyframe(2700),
                keyframe(2760, 960, 180, 1, 0),
                keyframe(2820, 960, 160, 1.05, 0),
                keyframe(3300, 960, 160, 1.05, 0),
                keyframe(3360, 960, 180, 1, 0),
                hiddenKeyframe(3420)
            ]
        },
        {
            id: "celebration",
            name: "Celebration Sparkles",
            svg: encodeSvg(`
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">
                    <defs>
                        <radialGradient id="sparkle" cx="50%" cy="50%" r="50%">
                            <stop offset="0" stop-color="#FFD700" stop-opacity="0.4"/>
                            <stop offset="1" stop-color="#FFD700" stop-opacity="0"/>
                        </radialGradient>
                    </defs>
                    <circle cx="200" cy="200" r="150" fill="url(#sparkle)"/>
                    <circle cx="1720" cy="300" r="120" fill="url(#sparkle)"/>
                    <circle cx="300" cy="880" r="140" fill="url(#sparkle)"/>
                    <circle cx="1620" cy="800" r="130" fill="url(#sparkle)"/>
                    <circle cx="960" cy="540" r="180" fill="url(#sparkle)"/>
                </svg>
            `),
            zIndex: 9,
            keyframes: [
                hiddenKeyframe(0),
                hiddenKeyframe(4500),
                keyframe(4560, 960, 540, 1.2, 0),
                keyframe(4620, 960, 530, 1.3, 5),
                keyframe(4680, 960, 540, 1.2, -5),
                keyframe(4740, 960, 540, 1.2, 0),
                keyframe(5100, 960, 540, 1.2, 0),
                keyframe(5160, 960, 540, 1.2, 10),
                keyframe(5220, 960, 540, 1.2, -10),
                keyframe(5280, 960, 540, 1.2, 0),
                hiddenKeyframe(5400)
            ]
        }
    ])
};
};
var alphabetProject=initAlphabetsong();
