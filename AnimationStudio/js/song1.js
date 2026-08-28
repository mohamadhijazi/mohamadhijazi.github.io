/*
 * BODY PARTS LEARNING PROJECT
 * Production format: 1920 × 1080, 30 FPS, 60 seconds
 *
 * Timeline:
 * 00:00–00:04  Opening
 * 00:04–00:10  Head
 * 00:10–00:16  Nose
 * 00:16–00:22  Mouth
 * 00:22–00:28  Shoulders
 * 00:28–00:34  Knees
 * 00:34–00:40  Toes
 * 00:40–00:54  Guided recap
 * 00:54–01:00  Celebration
 */

var FPS = 30;
const TOTAL_FRAMES = 1800;

const encodeSvg = (svg) =>
     svg;
    //     .replaceAll("&", "&amp;")
    //     .replaceAll("<", "&lt;")
    //     .replaceAll(">", "&gt;")
    //     .replaceAll('"', "&quot;");

const keyframe = (
    frame,
    x,
    y,
    scale = 1,
    rotation = 0
) => ({
    frame,
    x,
    y,
    scale,
    rotation
});

const hiddenKeyframe = (frame, x = 0, y = 0) =>
    keyframe(frame, x, y, 0.001, 0);

const createLabelSvg = ({
    title,
    subtitle,
    accent = "#146C94",
    icon = "●"
}) => encodeSvg(`
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 760 220"
        width="760"
        height="220"
    >
        <defs>
            <filter
                id="cardShadow"
                x="-20%"
                y="-30%"
                width="140%"
                height="170%"
            >
                <feDropShadow
                    dx="0"
                    dy="12"
                    stdDeviation="14"
                    flood-color="#16324F"
                    flood-opacity="0.16"
                />
            </filter>
        </defs>

        <g filter="url(#cardShadow)">
            <rect
                x="22"
                y="22"
                width="716"
                height="176"
                rx="42"
                fill="#FFFFFF"
            />

            <rect
                x="22"
                y="22"
                width="18"
                height="176"
                rx="9"
                fill="${accent}"
            />

            <circle
                cx="120"
                cy="110"
                r="52"
                fill="${accent}"
                opacity="0.12"
            />

            <text
                x="120"
                y="129"
                text-anchor="middle"
                font-family="Arial, Helvetica, sans-serif"
                font-size="48"
                font-weight="700"
                fill="${accent}"
            >${icon}</text>

            <text
                x="200"
                y="101"
                font-family="Arial, Helvetica, sans-serif"
                font-size="48"
                font-weight="700"
                fill="#17324D"
            >${title}</text>

            <text
                x="200"
                y="147"
                font-family="Arial, Helvetica, sans-serif"
                font-size="25"
                font-weight="400"
                fill="#587087"
            >${subtitle}</text>
        </g>
    </svg>
`);

const createCalloutActor = ({
    id,
    title,
    subtitle,
    icon,
    accent,
    startFrame,
    endFrame
}) => ({
    id,
    name: `${title} Callout`,
    svg: createLabelSvg({
        title,
        subtitle,
        icon,
        accent
    }),
    zIndex: 8,
    keyframes: [
        hiddenKeyframe(
            Math.max(0, startFrame - 12),
            1040,
            405
        ),
        keyframe(
            startFrame,
            1040,
            405,
            0.82,
            0
        ),
        keyframe(
            startFrame + 12,
            1010,
            405,
            0.88,
            0
        ),
        keyframe(
            endFrame - 15,
            1010,
            405,
            0.88,
            0
        ),
        keyframe(
            endFrame,
            1060,
            405,
            0.001,
            0
        )
    ]
});

const createHighlightActor = ({
    id,
    name,
    startFrame,
    endFrame,
    x,
    y,
    scale,
    accent = "#FFCC4D"
}) => ({
    id,
    name,
    svg: encodeSvg(`
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 320 320"
            width="320"
            height="320"
        >
            <defs>
                <radialGradient
                    id="spotlight"
                    cx="50%"
                    cy="50%"
                    r="50%"
                >
                    <stop
                        offset="0"
                        stop-color="#FFFFFF"
                        stop-opacity="0"
                    />
                    <stop
                        offset="0.52"
                        stop-color="${accent}"
                        stop-opacity="0.12"
                    />
                    <stop
                        offset="0.8"
                        stop-color="${accent}"
                        stop-opacity="0.38"
                    />
                    <stop
                        offset="1"
                        stop-color="${accent}"
                        stop-opacity="0"
                    />
                </radialGradient>

                <filter
                    id="softGlow"
                    x="-40%"
                    y="-40%"
                    width="180%"
                    height="180%"
                >
                    <feGaussianBlur
                        stdDeviation="7"
                        result="blur"
                    />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            <circle
                cx="160"
                cy="160"
                r="145"
                fill="url(#spotlight)"
            />

            <circle
                cx="160"
                cy="160"
                r="108"
                fill="none"
                stroke="${accent}"
                stroke-width="10"
                stroke-linecap="round"
                stroke-dasharray="28 18"
                opacity="0.92"
                filter="url(#softGlow)"
            />

            <circle
                cx="160"
                cy="160"
                r="88"
                fill="none"
                stroke="#FFFFFF"
                stroke-width="4"
                opacity="0.72"
            />
        </svg>
    `),
    zIndex: 7,
    keyframes: [
        hiddenKeyframe(
            Math.max(0, startFrame - 10),
            x,
            y
        ),
        keyframe(
            startFrame,
            x,
            y,
            scale * 0.82,
            -8
        ),
        keyframe(
            startFrame + 15,
            x,
            y,
            scale,
            0
        ),
        keyframe(
            startFrame + 60,
            x,
            y,
            scale * 1.08,
            10
        ),
        keyframe(
            startFrame + 105,
            x,
            y,
            scale,
            0
        ),
        keyframe(
            endFrame - 12,
            x,
            y,
            scale * 0.92,
            -8
        ),
        hiddenKeyframe(
            endFrame,
            x,
            y
        )
    ]
});

const enterpriseBodyPartsProject = {
    id: "p3_body_parts_enterprise",
    name: "My Body: Head, Nose, Mouth, Shoulders, Knees and Toes",
    duration: 60,
    fps: FPS,
    totalFrames: TOTAL_FRAMES,

    audioTrack: null,
    audioClips: [],

    /*
     * Optional audio configuration:
     *
     * audioTrack: {
     *     src: "/audio/body-parts-original-recording.mp3",
     *     startFrame: 0,
     *     volume: 0.9,
     *     loop: false,
     *     fadeInFrames: 20,
     *     fadeOutFrames: 45
     * }
     */

    background: "#DDF5F7",

    metadata: {
        category: "Early Learning",
        subject: "Body Parts",
        audience: "Children",
        resolution: [1920, 1080],
        frameRate: 30,
        safeArea: {
            top: 60,
            right: 80,
            bottom: 60,
            left: 80
        },
        designSystem: {
            primary: "#146C94",
            secondary: "#19A7CE",
            accent: "#FFCC4D",
            coral: "#F76C6C",
            purple: "#7C6FD0",
            background: "#DDF5F7",
            text: "#17324D"
        }
    },

    actors: [
        /*
         * BACKGROUND
         */
        {
            id: "premium_background",
            name: "Premium Learning Environment",
            svg: encodeSvg(`
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1920 1080"
                    width="1920"
                    height="1080"
                >
                    <defs>
                        <linearGradient
                            id="sky"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop
                                offset="0"
                                stop-color="#DFF7FA"
                            />
                            <stop
                                offset="0.7"
                                stop-color="#F3FBF7"
                            />
                            <stop
                                offset="1"
                                stop-color="#FFF8E6"
                            />
                        </linearGradient>

                        <linearGradient
                            id="stage"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop
                                offset="0"
                                stop-color="#AEDCBB"
                            />
                            <stop
                                offset="1"
                                stop-color="#77BC8A"
                            />
                        </linearGradient>

                        <filter
                            id="backgroundBlur"
                            x="-20%"
                            y="-20%"
                            width="140%"
                            height="140%"
                        >
                            <feGaussianBlur stdDeviation="3" />
                        </filter>
                    </defs>

                    <rect
                        width="1920"
                        height="1080"
                        fill="url(#sky)"
                    />

                    <circle
                        cx="1660"
                        cy="170"
                        r="90"
                        fill="#FFE37E"
                        opacity="0.82"
                    />

                    <circle
                        cx="1660"
                        cy="170"
                        r="145"
                        fill="#FFE37E"
                        opacity="0.14"
                    />

                    <g
                        fill="#FFFFFF"
                        opacity="0.74"
                    >
                        <ellipse
                            cx="300"
                            cy="190"
                            rx="115"
                            ry="36"
                        />
                        <ellipse
                            cx="245"
                            cy="196"
                            rx="68"
                            ry="48"
                        />
                        <ellipse
                            cx="360"
                            cy="185"
                            rx="76"
                            ry="52"
                        />

                        <ellipse
                            cx="1120"
                            cy="155"
                            rx="105"
                            ry="32"
                        />
                        <ellipse
                            cx="1070"
                            cy="160"
                            rx="62"
                            ry="44"
                        />
                        <ellipse
                            cx="1175"
                            cy="150"
                            rx="70"
                            ry="48"
                        />
                    </g>

                    <path
                        d="
                            M0 710
                            Q240 560 480 710
                            Q720 505 960 710
                            Q1200 545 1440 710
                            Q1680 520 1920 700
                            L1920 1080
                            L0 1080
                            Z
                        "
                        fill="#B7DDB9"
                    />

                    <path
                        d="
                            M0 790
                            Q300 625 600 790
                            Q900 600 1200 790
                            Q1500 620 1920 775
                            L1920 1080
                            L0 1080
                            Z
                        "
                        fill="#93CD9F"
                    />

                    <rect
                        x="0"
                        y="790"
                        width="1920"
                        height="290"
                        fill="url(#stage)"
                    />

                    <ellipse
                        cx="800"
                        cy="965"
                        rx="455"
                        ry="72"
                        fill="#397A58"
                        opacity="0.12"
                        filter="url(#backgroundBlur)"
                    />

                    <path
                        d="
                            M0 965
                            C330 920 560 1020 910 958
                            C1220 903 1480 1015 1920 942
                        "
                        fill="none"
                        stroke="#F9E6AE"
                        stroke-width="86"
                        opacity="0.82"
                    />

                    <g opacity="0.78">
                        <g transform="translate(105 700)">
                            <rect
                                x="0"
                                y="0"
                                width="24"
                                height="125"
                                rx="12"
                                fill="#8A5D41"
                            />
                            <circle
                                cx="12"
                                cy="-25"
                                r="68"
                                fill="#499B69"
                            />
                            <circle
                                cx="-35"
                                cy="10"
                                r="46"
                                fill="#63AF79"
                            />
                            <circle
                                cx="55"
                                cy="8"
                                r="50"
                                fill="#63AF79"
                            />
                        </g>

                        <g transform="translate(1760 690)">
                            <rect
                                x="0"
                                y="0"
                                width="24"
                                height="135"
                                rx="12"
                                fill="#8A5D41"
                            />
                            <circle
                                cx="12"
                                cy="-28"
                                r="72"
                                fill="#499B69"
                            />
                            <circle
                                cx="-37"
                                cy="12"
                                r="48"
                                fill="#63AF79"
                            />
                            <circle
                                cx="58"
                                cy="10"
                                r="52"
                                fill="#63AF79"
                            />
                        </g>
                    </g>

                    <g opacity="0.85">
                        <circle
                            cx="205"
                            cy="915"
                            r="10"
                            fill="#F76C6C"
                        />
                        <circle
                            cx="265"
                            cy="945"
                            r="8"
                            fill="#FFCC4D"
                        />
                        <circle
                            cx="1655"
                            cy="920"
                            r="10"
                            fill="#7C6FD0"
                        />
                        <circle
                            cx="1715"
                            cy="952"
                            r="8"
                            fill="#F76C6C"
                        />
                    </g>
                </svg>
            `),
            zIndex: 0,
            keyframes: [
                keyframe(0, 0, 0, 1, 0),
                keyframe(900, -12, 0, 1.015, 0),
                keyframe(1800, 0, 0, 1, 0)
            ]
        },

        /*
         * BRAND-STYLE HEADER
         */
        {
            id: "lesson_header",
            name: "Lesson Header",
            svg: encodeSvg(`
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 920 170"
                    width="920"
                    height="170"
                >
                    <defs>
                        <filter
                            id="headerShadow"
                            x="-20%"
                            y="-30%"
                            width="140%"
                            height="170%"
                        >
                            <feDropShadow
                                dx="0"
                                dy="8"
                                stdDeviation="10"
                                flood-color="#17324D"
                                flood-opacity="0.12"
                            />
                        </filter>
                    </defs>

                    <g filter="url(#headerShadow)">
                        <rect
                            x="12"
                            y="12"
                            width="896"
                            height="146"
                            rx="44"
                            fill="#FFFFFF"
                            opacity="0.96"
                        />

                        <circle
                            cx="95"
                            cy="85"
                            r="42"
                            fill="#19A7CE"
                        />

                        <path
                            d="
                                M74 87
                                Q95 63 116 87
                                Q95 111 74 87
                            "
                            fill="#FFFFFF"
                        />

                        <text
                            x="160"
                            y="78"
                            font-family="Arial, Helvetica, sans-serif"
                            font-size="43"
                            font-weight="700"
                            fill="#17324D"
                        >MY BODY</text>

                        <text
                            x="160"
                            y="119"
                            font-family="Arial, Helvetica, sans-serif"
                            font-size="24"
                            font-weight="400"
                            fill="#597287"
                        >Learn, point and move</text>
                    </g>
                </svg>
            `),
            zIndex: 4,
            keyframes: [
                keyframe(0, 500, -190, 0.92, 0),
                keyframe(24, 500, 45, 0.92, 0),
                keyframe(95, 500, 38, 0.92, 0),
                keyframe(120, 500, 45, 0.92, 0),
                keyframe(150, 500, -190, 0.92, 0),

                hiddenKeyframe(1610, 500, -190),
                keyframe(1640, 500, 45, 0.92, 0),
                keyframe(1800, 500, 45, 0.92, 0)
            ]
        },

        /*
         * MAIN CHARACTER
         */
        {
            id: "main_character",
            name: "Learning Guide",
            svg: encodeSvg(`
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 620 900"
                    width="620"
                    height="900"
                >
                    <defs>
                        <linearGradient
                            id="shirt"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop
                                offset="0"
                                stop-color="#1DA8CE"
                            />
                            <stop
                                offset="1"
                                stop-color="#11769C"
                            />
                        </linearGradient>

                        <linearGradient
                            id="shorts"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop
                                offset="0"
                                stop-color="#7C6FD0"
                            />
                            <stop
                                offset="1"
                                stop-color="#5149A6"
                            />
                        </linearGradient>

                        <filter
                            id="characterShadow"
                            x="-30%"
                            y="-20%"
                            width="160%"
                            height="150%"
                        >
                            <feDropShadow
                                dx="0"
                                dy="16"
                                stdDeviation="13"
                                flood-color="#24573E"
                                flood-opacity="0.2"
                            />
                        </filter>
                    </defs>

                    <g filter="url(#characterShadow)">
                        <!-- Legs -->
                        <path
                            d="M240 640 L230 800"
                            fill="none"
                            stroke="#D89F78"
                            stroke-width="58"
                            stroke-linecap="round"
                        />

                        <path
                            d="M380 640 L390 800"
                            fill="none"
                            stroke="#D89F78"
                            stroke-width="58"
                            stroke-linecap="round"
                        />

                        <!-- Shoes -->
                        <path
                            d="
                                M165 790
                                Q225 760 285 796
                                L283 842
                                L165 842
                                Q140 820 165 790
                                Z
                            "
                            fill="#FFFFFF"
                            stroke="#40566F"
                            stroke-width="8"
                        />

                        <path
                            d="
                                M335 796
                                Q395 760 455 790
                                Q480 820 455 842
                                L337 842
                                Z
                            "
                            fill="#FFFFFF"
                            stroke="#40566F"
                            stroke-width="8"
                        />

                        <path
                            d="M175 817 L272 817"
                            stroke="#19A7CE"
                            stroke-width="9"
                            stroke-linecap="round"
                        />

                        <path
                            d="M348 817 L445 817"
                            stroke="#19A7CE"
                            stroke-width="9"
                            stroke-linecap="round"
                        />

                        <!-- Shorts -->
                        <path
                            d="
                                M185 555
                                L435 555
                                L420 690
                                L330 690
                                L310 625
                                L290 690
                                L200 690
                                Z
                            "
                            fill="url(#shorts)"
                            stroke="#413A8B"
                            stroke-width="8"
                            stroke-linejoin="round"
                        />

                        <!-- Arms -->
                        <path
                            d="M190 355 Q102 395 85 510"
                            fill="none"
                            stroke="#D89F78"
                            stroke-width="52"
                            stroke-linecap="round"
                        />

                        <path
                            d="M430 355 Q518 395 535 510"
                            fill="none"
                            stroke="#D89F78"
                            stroke-width="52"
                            stroke-linecap="round"
                        />

                        <!-- Hands -->
                        <circle
                            cx="85"
                            cy="510"
                            r="32"
                            fill="#D89F78"
                            stroke="#744936"
                            stroke-width="7"
                        />

                        <circle
                            cx="535"
                            cy="510"
                            r="32"
                            fill="#D89F78"
                            stroke="#744936"
                            stroke-width="7"
                        />

                        <!-- Torso -->
                        <path
                            d="
                                M182 330
                                Q310 285 438 330
                                L450 575
                                Q310 620 170 575
                                Z
                            "
                            fill="url(#shirt)"
                            stroke="#0D6283"
                            stroke-width="9"
                            stroke-linejoin="round"
                        />

                        <!-- Shirt detail -->
                        <circle
                            cx="310"
                            cy="430"
                            r="62"
                            fill="#FFFFFF"
                            opacity="0.95"
                        />

                        <path
                            d="
                                M278 434
                                Q310 397 342 434
                                Q310 471 278 434
                            "
                            fill="#FFCC4D"
                        />

                        <!-- Neck -->
                        <rect
                            x="275"
                            y="270"
                            width="70"
                            height="80"
                            rx="28"
                            fill="#D89F78"
                            stroke="#744936"
                            stroke-width="7"
                        />

                        <!-- Head -->
                        <circle
                            cx="310"
                            cy="170"
                            r="132"
                            fill="#D89F78"
                            stroke="#744936"
                            stroke-width="9"
                        />

                        <!-- Hair -->
                        <path
                            d="
                                M179 176
                                Q170 50 310 30
                                Q457 45 442 180
                                Q415 118 360 125
                                Q290 65 179 176
                                Z
                            "
                            fill="#3B2B28"
                        />

                        <path
                            d="
                                M195 120
                                Q242 42 325 61
                                Q377 58 425 118
                            "
                            fill="none"
                            stroke="#5A4038"
                            stroke-width="22"
                            stroke-linecap="round"
                        />

                        <!-- Eyes -->
                        <ellipse
                            cx="255"
                            cy="176"
                            rx="12"
                            ry="15"
                            fill="#2B2424"
                        />

                        <ellipse
                            cx="365"
                            cy="176"
                            rx="12"
                            ry="15"
                            fill="#2B2424"
                        />

                        <circle
                            cx="259"
                            cy="171"
                            r="4"
                            fill="#FFFFFF"
                        />

                        <circle
                            cx="369"
                            cy="171"
                            r="4"
                            fill="#FFFFFF"
                        />

                        <!-- Eyebrows -->
                        <path
                            d="M228 145 Q255 130 282 145"
                            fill="none"
                            stroke="#4A342F"
                            stroke-width="8"
                            stroke-linecap="round"
                        />

                        <path
                            d="M338 145 Q365 130 392 145"
                            fill="none"
                            stroke="#4A342F"
                            stroke-width="8"
                            stroke-linecap="round"
                        />

                        <!-- Nose -->
                        <path
                            d="
                                M310 180
                                L297 215
                                Q310 225 324 214
                            "
                            fill="none"
                            stroke="#A66F53"
                            stroke-width="8"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />

                        <!-- Mouth -->
                        <path
                            d="
                                M260 243
                                Q310 285 360 243
                                Q310 255 260 243
                                Z
                            "
                            fill="#FFFFFF"
                            stroke="#A8545A"
                            stroke-width="8"
                            stroke-linejoin="round"
                        />

                        <!-- Cheeks -->
                        <circle
                            cx="220"
                            cy="230"
                            r="20"
                            fill="#F58F8F"
                            opacity="0.42"
                        />

                        <circle
                            cx="400"
                            cy="230"
                            r="20"
                            fill="#F58F8F"
                            opacity="0.42"
                        />
                    </g>
                </svg>
            `),
            zIndex: 5,
            keyframes: [
                keyframe(0, 120, 160, 0.001, 0),
                keyframe(35, 210, 95, 0.78, -4),
                keyframe(70, 210, 115, 0.82, 2),
                keyframe(120, 210, 105, 0.8, 0),

                keyframe(300, 210, 98, 0.81, -1.5),
                keyframe(480, 210, 105, 0.8, 1.5),
                keyframe(660, 210, 98, 0.81, -1.5),
                keyframe(840, 210, 105, 0.8, 1.5),
                keyframe(1020, 210, 98, 0.81, -1.5),
                keyframe(1200, 210, 105, 0.8, 0),

                keyframe(1260, 210, 82, 0.82, -3),
                keyframe(1350, 210, 105, 0.8, 3),
                keyframe(1440, 210, 82, 0.82, -3),
                keyframe(1530, 210, 105, 0.8, 3),
                keyframe(1620, 210, 70, 0.84, -4),
                keyframe(1710, 210, 105, 0.8, 4),
                keyframe(1800, 210, 88, 0.83, 0)
            ]
        },

        /*
         * BODY PART HIGHLIGHTS
         */
        createHighlightActor({
            id: "highlight_head",
            name: "Head Highlight",
            startFrame: 120,
            endFrame: 300,
            x: 333,
            y: 145,
            scale: 0.82,
            accent: "#FFCC4D"
        }),

        createHighlightActor({
            id: "highlight_nose",
            name: "Nose Highlight",
            startFrame: 300,
            endFrame: 480,
            x: 412,
            y: 245,
            scale: 0.25,
            accent: "#F76C6C"
        }),

        createHighlightActor({
            id: "highlight_mouth",
            name: "Mouth Highlight",
            startFrame: 480,
            endFrame: 660,
            x: 393,
            y: 287,
            scale: 0.36,
            accent: "#F76C6C"
        }),

        createHighlightActor({
            id: "highlight_shoulders",
            name: "Shoulders Highlight",
            startFrame: 660,
            endFrame: 840,
            x: 280,
            y: 370,
            scale: 1.18,
            accent: "#19A7CE"
        }),

        createHighlightActor({
            id: "highlight_knees",
            name: "Knees Highlight",
            startFrame: 840,
            endFrame: 1020,
            x: 303,
            y: 660,
            scale: 1,
            accent: "#7C6FD0"
        }),

        createHighlightActor({
            id: "highlight_toes",
            name: "Toes Highlight",
            startFrame: 1020,
            endFrame: 1200,
            x: 286,
            y: 782,
            scale: 1.12,
            accent: "#FFCC4D"
        }),

        /*
         * EDUCATIONAL CALLOUTS
         */
        createCalloutActor({
            id: "label_head",
            title: "HEAD",
            subtitle: "Point to the top of your body",
            icon: "●",
            accent: "#146C94",
            startFrame: 120,
            endFrame: 300
        }),

        createCalloutActor({
            id: "label_nose",
            title: "NOSE",
            subtitle: "Point to the center of your face",
            icon: "◆",
            accent: "#F76C6C",
            startFrame: 300,
            endFrame: 480
        }),

        createCalloutActor({
            id: "label_mouth",
            title: "MOUTH",
            subtitle: "Smile and point to your mouth",
            icon: "◕",
            accent: "#D95763",
            startFrame: 480,
            endFrame: 660
        }),

        createCalloutActor({
            id: "label_shoulders",
            title: "SHOULDERS",
            subtitle: "Touch both shoulders",
            icon: "↔",
            accent: "#19A7CE",
            startFrame: 660,
            endFrame: 840
        }),

        createCalloutActor({
            id: "label_knees",
            title: "KNEES",
            subtitle: "Bend gently and touch your knees",
            icon: "▼",
            accent: "#7C6FD0",
            startFrame: 840,
            endFrame: 1020
        }),

        createCalloutActor({
            id: "label_toes",
            title: "TOES",
            subtitle: "Reach down toward your toes",
            icon: "★",
            accent: "#D99C00",
            startFrame: 1020,
            endFrame: 1200
        }),

        /*
         * RECAP TITLE
         */
        {
            id: "recap_title",
            name: "Guided Recap Title",
            svg: createLabelSvg({
                title: "LET'S RECAP",
                subtitle: "Follow the visual guide",
                icon: "✓",
                accent: "#146C94"
            }),
            zIndex: 9,
            keyframes: [
                hiddenKeyframe(0, 1040, 390),
                hiddenKeyframe(1190, 1040, 390),
                keyframe(1210, 1040, 390, 0.84, 0),
                keyframe(1230, 1010, 390, 0.88, 0),
                keyframe(1560, 1010, 390, 0.88, 0),
                hiddenKeyframe(1590, 1060, 390)
            ]
        },

        /*
         * RECAP ORBIT INDICATOR
         */
        {
            id: "recap_indicator",
            name: "Recap Indicator",
            svg: encodeSvg(`
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 300 300"
                    width="300"
                    height="300"
                >
                    <defs>
                        <filter
                            id="recapGlow"
                            x="-50%"
                            y="-50%"
                            width="200%"
                            height="200%"
                        >
                            <feGaussianBlur
                                stdDeviation="8"
                                result="blur"
                            />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    <circle
                        cx="150"
                        cy="150"
                        r="118"
                        fill="#FFCC4D"
                        opacity="0.12"
                    />

                    <circle
                        cx="150"
                        cy="150"
                        r="96"
                        fill="none"
                        stroke="#FFCC4D"
                        stroke-width="12"
                        stroke-linecap="round"
                        stroke-dasharray="38 20"
                        filter="url(#recapGlow)"
                    />

                    <circle
                        cx="150"
                        cy="150"
                        r="15"
                        fill="#FFFFFF"
                    />
                </svg>
            `),
            zIndex: 7,
            keyframes: [
                hiddenKeyframe(0, 340, 150),
                hiddenKeyframe(1190, 340, 150),

                keyframe(1200, 340, 150, 0.82, 0),
                keyframe(1260, 420, 245, 0.3, 100),
                keyframe(1320, 400, 285, 0.38, 180),
                keyframe(1380, 285, 370, 1.18, 260),
                keyframe(1440, 305, 655, 1, 340),
                keyframe(1500, 285, 780, 1.1, 420),

                hiddenKeyframe(1570, 285, 780)
            ]
        },

        /*
         * FINALE GRAPHICS
         */
        {
            id: "finale_graphics",
            name: "Professional Celebration Graphics",
            svg: encodeSvg(`
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1920 1080"
                    width="1920"
                    height="1080"
                >
                    <g fill="#FFCC4D">
                        <path
                            d="
                                M190 210
                                l11 34 34 11
                                -34 11
                                -11 34
                                -11-34
                                -34-11
                                34-11
                                z
                            "
                        />

                        <path
                            d="
                                M1680 220
                                l16 48 48 16
                                -48 16
                                -16 48
                                -16-48
                                -48-16
                                48-16
                                z
                            "
                        />

                        <path
                            d="
                                M1500 760
                                l13 39 39 13
                                -39 13
                                -13 39
                                -13-39
                                -39-13
                                39-13
                                z
                            "
                        />
                    </g>

                    <g fill="#19A7CE">
                        <circle
                            cx="330"
                            cy="345"
                            r="17"
                        />
                        <circle
                            cx="1570"
                            cy="390"
                            r="14"
                        />
                        <circle
                            cx="1400"
                            cy="180"
                            r="12"
                        />
                    </g>

                    <g fill="#F76C6C">
                        <circle
                            cx="245"
                            cy="690"
                            r="15"
                        />
                        <circle
                            cx="1650"
                            cy="680"
                            r="18"
                        />
                        <circle
                            cx="1240"
                            cy="850"
                            r="13"
                        />
                    </g>

                    <g fill="#7C6FD0">
                        <rect
                            x="410"
                            y="200"
                            width="24"
                            height="24"
                            rx="6"
                            transform="rotate(25 422 212)"
                        />

                        <rect
                            x="1500"
                            y="540"
                            width="28"
                            height="28"
                            rx="7"
                            transform="rotate(35 1514 554)"
                        />

                        <rect
                            x="510"
                            y="800"
                            width="24"
                            height="24"
                            rx="6"
                            transform="rotate(20 522 812)"
                        />
                    </g>
                </svg>
            `),
            zIndex: 10,
            keyframes: [
                hiddenKeyframe(0, 0, 0),
                hiddenKeyframe(1600, 0, 0),
                keyframe(1630, 0, 0, 0.72, -12),
                keyframe(1680, 0, 0, 1, 0),
                keyframe(1740, 0, 0, 1.04, 5),
                keyframe(1800, 0, 0, 1, 0)
            ]
        }
    ]
};