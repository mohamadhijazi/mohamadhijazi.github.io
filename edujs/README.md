# 💡 EduJS - Localized Social EdTech Platform

EduJS is a lightweight, localized, and highly visual **Social EdTech Platform** running entirely in the browser. It merges the addictive, vertical scroll mechanics of Instagram/TikTok with interactive virtual science laboratories, a custom physics-based Knowledge Graph, and a conversational AI creation wizard—all running client-side without external server requirements.

---

## 🎨 UI/UX & Visual Identity (The TikTok/Instagram Vibe)
EduJS features a **Modern Dark/Light Glassmorphism UI** optimized for both desktop (collapsible sidebar layout) and mobile (bottom-bar navigation frame):
*   **Aesthetics**: Glassmorphic panels with dynamic background blur, neon gradients, scale transitions, and glowing element highlights.
*   **TikTok Accent (Coral Pink `#FF007A`)**: Used for social engagement metrics, follow buttons, and pulsing heart micro-animations.
*   **Instagram/Tech Accent (Electric Cyan `#00F2FE`)**: Highlights cognitive networks, node selections, biology systems, and physics variables.
*   **Social Micro-Interactions**: Double-tap feed cards to trigger a large pop-up glowing heart animation and increment likes.

---

## 🛠️ Detailed Feature Specifications

### 1. Module A: The Core Knowledge Graph
*   **Physics Simulator**: Built on an HTML5 Canvas using vector integration:
    *   *Repulsion Force (Coulomb's Law)*: All topics repel each other inversely to distance squared.
    *   *Attraction Force (Hooke's Law)*: Connected concepts act as elastic springs, drawing nodes together.
    *   *Center Gravity*: Prevents network drift by pulling nodes gently toward the center.
*   **Interactive Viewport**: Drag-and-drop nodes to reshape networks, use mouse-wheel gestures to zoom, or drag the background to pan.
*   **Inspector Sidebar**: Clicking a node highlights its local neighborhood and slides out a card detailing connections, categories, descriptions, and a link to jump directly to its feed post.

### 2. Module B: Interactive Science Labs
*   **📐 Math Geometry Lab**:
    *   *Draggable Shape Solver*: Drag vertices $A$, $B$, and $C$ on a coordinate plane; equations, side lengths, angles, and area recalculate in real-time.
    *   *Function Plotter*: Type any custom algebraic equation in terms of `x` (e.g. `Math.sin(x) * 4` or `0.08 * x * x`) and plot f(x) instantly on a coordinate grid.
*   **⚡ Physics Simulator**:
    *   *Gravity Drop Zone ($v = gt$)*: Adjust gravity ($g$ in $m/s^2$) and mass ($m$ in $kg$) to watch objects fall, plotting time, velocity, and distance.
    *   *Friction Plane Force ($F = ma$)*: Push a block along a surface with adjustable pushing forces and coefficient of friction constants.
*   **🫁 Biology anatomy Navigator**:
    *   *System Toggles*: Switch highlights across Respiratory (lungs), Circulatory (heart), Nervous (brain), and Digestive systems on a vector anatomy layout.
    *   *Neon CSS Animations*: Trigger breathing cycles (lungs expanding), heartbeats (cardiac pulsing), spinal nerve impulse flashes, or digestion squiggles.
*   **🧪 Chemistry Beaker titration**:
    *   *Universal Indicator pH Scaling*: Add drops of Acid (decreases pH) or Base (increases pH). The beaker liquid dynamically shifts colors across red, orange, green, cyan, and purple.
    *   *Neutralization Reactions*: Mixing acid and base yields salt precipitate, equations ($HCl + NaOH \rightarrow NaCl + H_2O$), and triggers gas bubble particles.
*   **💻 Code Sandbox compiler**:
    *   Split-pane code compiler executing HTML5/JS/CSS sandbox code inside an isolated `iframe`.
    *   Includes 5 pre-loaded templates (pulsing mouse rings, beating SVG hearts, sine wave oscillators) with scroll-synchronized line numbers.

### 3. Module C: Guided AI Creator Chatbot
*   **Guided Wizard**: Rather than using a heavy AI backend, a conversational state machine welcomes users with time-sensitive greetings ("Good morning/evening...") and leads them step-by-step to create new nodes.
*   **Graph Linking**: The bot prompts for a Title $\rightarrow$ Category $\rightarrow$ Description $\rightarrow$ Connections. It renders interactive select dropdowns directly inside its message bubbles. Once finalized, the bot injects the node and edge into the database, instantly updating the Feed and Graph tabs.

### 4. Module D: Activity Simulator & Push Notifications
*   **Synthesized Audio Bell Chime**: Uses the browser **Web Audio API** to generate double-bell chime tones dynamically in code. This provides a self-contained offline warning sound without external MP3 asset downloads.
*   **Social Activity Simulator**: Triggers random background network updates (such as another user tagging you in new posts, commenting on your nodes, or replying to comments you left).
*   **Notification Banners**: Spawns glassmorphic, color-coded push alerts. Clicking a card switches tabs and scrolls directly to that feed item.
*   **Browser Notifications**: Settings panel includes triggers to enable system OS notifications or force-run a simulated action instantly.

---

## 🌐 Settings & Local Sync (Home Wi-Fi Syncing)
Browser databases are sandboxed to specific browsers and devices. To share knowledge bases with family members on the home Wi-Fi network without running databases:
1.  **Export Graph JSON**: Downloads the current knowledge graph as a JSON backup.
2.  **Import Graph JSON**: Uploads a family member's exported JSON file and merges it into the local database.
3.  **Language & RTL Layout**: Select from English, Arabic, French, Urdu, or Spanish. Selecting Arabic or Urdu dynamically shifts the entire page layout direction to **Right-to-Left (RTL)**.

---

## 📂 File Structure
```
c:/ws/edujs/
├── index.html          # Markup shell, navigation headers, biology SVGs, and overlays
├── json.js             # Initial database seeds (Azure, TOGAF, Physics, Math, etc.)
├── README.md           # This documentation file
├── css/
│   └── style.css       # Design tokens, theme variables, glassmorphic cards, and RTL overrides
└── js/
    ├── app.js          # Core app controller, translation dictionary, chatbot state, simulator
    ├── graph.js        # Physics-based Canvas rendering loop, panning, zoom, sidebar inspector
    └── labs.js         # Math coordinate events, gravity Euler math, titration colors, and iframe compiler
```

---

## 🚀 Getting Started
Since the application runs entirely client-side, there are no compilers or dependencies to install.

### Option A: Local Double-Click (Recommended)
1.  Navigate to `c:/ws/edujs/`.
2.  Double-click **`index.html`** to run the app directly in your preferred web browser.

### Option B: Quick Python Local Server
To run with local serving (bypassing minor filesystem protocol differences):
1.  Open your command shell.
2.  Navigate and serve:
    ```powershell
    cd c:\ws\edujs\
    python -m http.server 8000
    ```
3.  Navigate to `http://localhost:8000` in your web browser.
