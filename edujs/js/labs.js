/* ==========================================
   EduJS - Scientific & Technical Labs
   ========================================== */

// Labs Global Controller
class EduLabs {
  constructor() {
    this.activeLab = "geometry";
    this.initDone = {};
    
    // Bind Lab sub-navigation
    const subNavs = document.querySelectorAll(".sub-nav-item");
    subNavs.forEach(nav => {
      nav.addEventListener("click", () => {
        subNavs.forEach(n => n.classList.remove("active"));
        nav.classList.add("active");
        const selectedLab = nav.getAttribute("data-lab");
        this.switchLab(selectedLab);
      });
    });
  }

  switchLab(labId) {
    this.activeLab = labId;
    document.querySelectorAll(".lab-module").forEach(mod => {
      mod.classList.remove("active");
    });
    const targetMod = document.getElementById(`lab-${labId}`);
    if (targetMod) targetMod.classList.add("active");
    
    this.initActiveLab();
  }

  initActiveLab() {
    switch (this.activeLab) {
      case "geometry":
        this.initGeometryLab();
        break;
      case "physics":
        this.initPhysicsLab();
        break;
      case "biology":
        this.initBiologyLab();
        break;
      case "chemistry":
        this.initChemistryLab();
        break;
      case "geography":
        this.initGeographyLab();
        break;
      case "code":
        this.initCodeSandboxLab();
        break;
    }
  }

  // ==========================================
  // LAB 1: Geometry & Equation Plotter
  // ==========================================
  initGeometryLab() {
    if (this.initDone.geometry) return;
    this.initDone.geometry = true;

    // Draggable Triangle Setup
    const canvas = document.getElementById("geometry-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // Triangle vertices (relative coordinates)
    let points = [
      { id: "A", x: 100, y: 250, radius: 10 },
      { id: "B", x: 350, y: 250, radius: 10 },
      { id: "C", x: 220, y: 80, radius: 10 }
    ];
    let selectedPoint = null;
    let isDragging = false;

    function drawGrid() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = state.theme === 'dark' ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)";
      ctx.lineWidth = 1;
      
      // Grid lines
      const gridSize = 25;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    }

    function calculateStats() {
      // Distance between coordinates
      const dist = (p1, p2) => Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
      const a = dist(points[0], points[1]); // AB
      const b = dist(points[1], points[2]); // BC
      const c = dist(points[2], points[0]); // CA
      
      // Area using Heron's formula
      const s = (a + b + c) / 2;
      const area = Math.sqrt(Math.max(0, s * (s - a) * (s - b) * (s - c)));

      document.getElementById("geom-val-ab").textContent = (a / 10).toFixed(2);
      document.getElementById("geom-val-bc").textContent = (b / 10).toFixed(2);
      document.getElementById("geom-val-ca").textContent = (c / 10).toFixed(2);
      document.getElementById("geom-val-area").textContent = (area / 100).toFixed(2);
    }

    function drawTriangle() {
      drawGrid();

      // Draw sides
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      ctx.lineTo(points[1].x, points[1].y);
      ctx.lineTo(points[2].x, points[2].y);
      ctx.closePath();
      
      ctx.fillStyle = "rgba(0, 242, 254, 0.15)";
      ctx.fill();
      ctx.strokeStyle = "#00f2fe";
      ctx.lineWidth = 3;
      ctx.shadowBlur = 10;
      ctx.shadowColor = "rgba(0, 242, 254, 0.5)";
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Draw points
      points.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = "#ff007a";
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Label
        ctx.fillStyle = state.theme === 'dark' ? "#ffffff" : "#222222";
        ctx.font = "bold 14px Inter";
        ctx.fillText(p.id, p.x - 5, p.y - 15);
      });
      
      calculateStats();
    }

    // Draggable Point Mouse Handlers
    const getMousePos = (evt) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      return {
        x: (evt.clientX - rect.left) * scaleX,
        y: (evt.clientY - rect.top) * scaleY
      };
    };

    canvas.addEventListener("mousedown", (e) => {
      const mouse = getMousePos(e);
      // Check collision
      points.forEach(p => {
        const d = Math.sqrt(Math.pow(p.x - mouse.x, 2) + Math.pow(p.y - mouse.y, 2));
        if (d <= p.radius + 5) {
          selectedPoint = p;
          isDragging = true;
        }
      });
    });

    canvas.addEventListener("mousemove", (e) => {
      if (!isDragging || !selectedPoint) return;
      const mouse = getMousePos(e);
      // Constraints
      selectedPoint.x = Math.max(10, Math.min(canvas.width - 10, mouse.x));
      selectedPoint.y = Math.max(10, Math.min(canvas.height - 10, mouse.y));
      drawTriangle();
    });

    window.addEventListener("mouseup", () => {
      isDragging = false;
      selectedPoint = null;
    });

    drawTriangle();

    // Secondary Function Calculator Grapher
    const calcCanvas = document.getElementById("calculator-canvas");
    const calcCtx = calcCanvas.getContext("2d");
    const plotBtn = document.getElementById("calc-plot-btn");
    const formulaInput = document.getElementById("calc-formula");

    function drawCalculatorGrid() {
      calcCtx.clearRect(0, 0, calcCanvas.width, calcCanvas.height);
      const isDark = state.theme === 'dark';
      
      // grid lines
      calcCtx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)";
      calcCtx.lineWidth = 1;
      const spacing = 20;
      for (let x = 0; x < calcCanvas.width; x += spacing) {
        calcCtx.beginPath(); calcCtx.moveTo(x, 0); calcCtx.lineTo(x, calcCanvas.height); calcCtx.stroke();
      }
      for (let y = 0; y < calcCanvas.height; y += spacing) {
        calcCtx.beginPath(); calcCtx.moveTo(0, y); calcCtx.lineTo(calcCanvas.width, y); calcCtx.stroke();
      }

      // X and Y axes
      calcCtx.strokeStyle = isDark ? "#ffffff" : "#222222";
      calcCtx.lineWidth = 2;
      const centerX = calcCanvas.width / 2;
      const centerY = calcCanvas.height / 2;

      // X Axis
      calcCtx.beginPath();
      calcCtx.moveTo(0, centerY);
      calcCtx.lineTo(calcCanvas.width, centerY);
      calcCtx.stroke();

      // Y Axis
      calcCtx.beginPath();
      calcCtx.moveTo(centerX, 0);
      calcCtx.lineTo(centerX, calcCanvas.height);
      calcCtx.stroke();
    }

    function plotFunction() {
      drawCalculatorGrid();
      const equationStr = formulaInput.value;
      const centerX = calcCanvas.width / 2;
      const centerY = calcCanvas.height / 2;

      calcCtx.strokeStyle = "#ff007a";
      calcCtx.lineWidth = 2.5;
      calcCtx.shadowBlur = 6;
      calcCtx.shadowColor = "rgba(255, 0, 122, 0.5)";
      calcCtx.beginPath();

      let started = false;
      const scale = 25; // Pixels per unit coordinate

      for (let pixelX = 0; pixelX < calcCanvas.width; pixelX++) {
        // Convert screen pixel to graph coordinates
        const x = (pixelX - centerX) / scale;
        let y;
        
        try {
          // Safe eval formula
          // Replace Math keywords or variables appropriately
          // Using a scope variable inside Function
          const evalFn = new Function('x', `return ${equationStr}`);
          y = evalFn(x);
        } catch(err) {
          console.error("Math eval error", err);
          calcCtx.fillStyle = "#ff4444";
          calcCtx.fillText("Formula Error", 20, 30);
          return;
        }

        if (isNaN(y) || !isFinite(y)) continue;

        // Convert graph coordinates back to screen pixels
        const pixelY = centerY - (y * scale);

        if (!started) {
          calcCtx.moveTo(pixelX, pixelY);
          started = true;
        } else {
          calcCtx.lineTo(pixelX, pixelY);
        }
      }
      calcCtx.stroke();
      calcCtx.shadowBlur = 0;
    }

    plotBtn.addEventListener("click", plotFunction);
    plotFunction();
  }

  // ==========================================
  // LAB 2: Physics Motion & Forces
  // ==========================================
  initPhysicsLab() {
    if (this.initDone.physics) return;
    this.initDone.physics = true;

    // 1) Gravity drop zone simulator
    const gravCanvas = document.getElementById("gravity-canvas");
    const gCtx = gravCanvas.getContext("2d");
    const dropBtn = document.getElementById("phys-drop-btn");
    const gravResetBtn = document.getElementById("phys-reset-btn");
    const gravitySlider = document.getElementById("phys-gravity-slider");
    const massSlider = document.getElementById("phys-mass-slider");

    let isFalling = false;
    let ball = { y: 25, velocity: 0, time: 0, height: 0, initialY: 25 };
    let dropAnimationId = null;
    let lastTime = 0;

    // Read initial sliders
    gravitySlider.addEventListener("input", (e) => {
      document.getElementById("val-phys-gravity").textContent = parseFloat(e.target.value).toFixed(1);
    });
    massSlider.addEventListener("input", (e) => {
      document.getElementById("val-phys-mass").textContent = parseFloat(e.target.value).toFixed(1);
    });

    function drawDropZone() {
      gCtx.clearRect(0, 0, gravCanvas.width, gravCanvas.height);
      
      // Draw background sky & tower line
      gCtx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      gCtx.lineWidth = 2;
      gCtx.beginPath();
      gCtx.moveTo(80, 0);
      gCtx.lineTo(80, gravCanvas.height - 20);
      gCtx.stroke();

      // Measurement markers
      gCtx.fillStyle = "#888888";
      gCtx.font = "9px Inter";
      for (let h = 0; h <= 10; h++) {
        const yPos = 25 + (h * 22);
        gCtx.beginPath();
        gCtx.moveTo(75, yPos);
        gCtx.lineTo(85, yPos);
        gCtx.stroke();
        gCtx.fillText(`${(10 - h) * 10}m`, 50, yPos + 3);
      }

      // Draw floor ground line
      gCtx.fillStyle = "#ff007a";
      gCtx.fillRect(0, gravCanvas.height - 20, gravCanvas.width, 20);

      // Draw object ball
      const radius = Math.min(22, 8 + parseFloat(massSlider.value) * 0.4); // Ball size changes with mass
      gCtx.beginPath();
      gCtx.arc(150, ball.y, radius, 0, Math.PI * 2);
      gCtx.fillStyle = "#00f2fe";
      gCtx.shadowBlur = 10;
      gCtx.shadowColor = "rgba(0, 242, 254, 0.6)";
      gCtx.fill();
      gCtx.strokeStyle = "#ffffff";
      gCtx.lineWidth = 1.5;
      gCtx.stroke();
      gCtx.shadowBlur = 0;
    }

    function animateDrop(timestamp) {
      if (!isFalling) return;
      if (!lastTime) lastTime = timestamp;
      const dt = (timestamp - lastTime) / 1000;
      lastTime = timestamp;

      const gravity = parseFloat(gravitySlider.value);
      ball.time += dt;

      // equations of motion
      ball.velocity = gravity * ball.time;
      // Scale coordinates to fit screen height
      const scaleHeight = 2.2; // 220 pixels total drop depth represents 100m
      const dy = 0.5 * gravity * ball.time * ball.time * scaleHeight;
      ball.y = ball.initialY + dy;

      const groundY = gravCanvas.height - 20 - 15; // Max fall before ball touches floor

      if (ball.y >= groundY) {
        ball.y = groundY;
        isFalling = false;
        // recalculate exact values for stop
        const tFinal = Math.sqrt((groundY - ball.initialY) / (0.5 * gravity * scaleHeight));
        ball.time = tFinal;
        ball.velocity = gravity * tFinal;
      }

      // Update screen telemetry
      document.getElementById("phys-time-val").textContent = `${ball.time.toFixed(2)} s`;
      document.getElementById("phys-velocity-val").textContent = `${ball.velocity.toFixed(1)} m/s`;
      const distanceTravelled = (ball.y - ball.initialY) / scaleHeight;
      document.getElementById("phys-dist-val").textContent = `${distanceTravelled.toFixed(1)} m`;

      drawDropZone();

      if (isFalling) {
        dropAnimationId = requestAnimationFrame(animateDrop);
      }
    }

    dropBtn.addEventListener("click", () => {
      if (isFalling) return;
      isFalling = true;
      lastTime = 0;
      ball.y = ball.initialY;
      ball.velocity = 0;
      ball.time = 0;
      dropAnimationId = requestAnimationFrame(animateDrop);
    });

    gravResetBtn.addEventListener("click", () => {
      isFalling = false;
      cancelAnimationFrame(dropAnimationId);
      ball = { y: 25, velocity: 0, time: 0, height: 0, initialY: 25 };
      document.getElementById("phys-time-val").textContent = "0.00 s";
      document.getElementById("phys-velocity-val").textContent = "0.00 m/s";
      document.getElementById("phys-dist-val").textContent = "0.00 m";
      drawDropZone();
    });

    drawDropZone();

    // 2) Force acceleration simulator (F = ma)
    const forceCanvas = document.getElementById("force-canvas");
    const fCtx = forceCanvas.getContext("2d");
    const pushBtn = document.getElementById("phys-push-btn");
    const pushResetBtn = document.getElementById("phys-push-reset-btn");
    const forceSlider = document.getElementById("phys-force-slider");
    const frictionSlider = document.getElementById("phys-friction-slider");

    let isPushing = false;
    let block = { x: 50, vx: 0, ax: 0, size: 40 };
    let forceAnimationId = null;
    let lastForceTime = 0;

    forceSlider.addEventListener("input", (e) => {
      document.getElementById("val-phys-force").textContent = e.target.value;
    });
    frictionSlider.addEventListener("input", (e) => {
      document.getElementById("val-phys-friction").textContent = parseFloat(e.target.value).toFixed(2);
    });

    function drawForceField() {
      fCtx.clearRect(0, 0, forceCanvas.width, forceCanvas.height);
      
      // Ground plane
      fCtx.fillStyle = state.theme === 'dark' ? "#333" : "#ddd";
      fCtx.fillRect(0, 150, forceCanvas.width, 50);

      // Block object
      fCtx.fillStyle = "#ff007a";
      fCtx.fillRect(block.x, 150 - block.size, block.size, block.size);
      fCtx.strokeStyle = "#fff";
      fCtx.lineWidth = 1.5;
      fCtx.strokeRect(block.x, 150 - block.size, block.size, block.size);

      // Label block mass
      fCtx.fillStyle = "#fff";
      fCtx.font = "11px Inter";
      fCtx.fillText(`${massSlider.value}kg`, block.x + 8, 150 - (block.size / 2) + 4);

      // Push arrow representation
      const pushForce = parseFloat(forceSlider.value);
      if (pushForce !== 0 && isPushing) {
        fCtx.strokeStyle = pushForce > 0 ? "#00f2fe" : "#ef4444";
        fCtx.lineWidth = 3;
        fCtx.beginPath();
        const arrowStart = pushForce > 0 ? block.x - 30 : block.x + block.size + 30;
        const arrowEnd = pushForce > 0 ? block.x - 2 : block.x + block.size + 2;
        fCtx.moveTo(arrowStart, 150 - 20);
        fCtx.lineTo(arrowEnd, 150 - 20);
        // arrowhead
        const headlen = 8;
        const angle = pushForce > 0 ? 0 : Math.PI;
        fCtx.lineTo(arrowEnd - headlen * Math.cos(angle - Math.PI/6), 150 - 20 - headlen * Math.sin(angle - Math.PI/6));
        fCtx.moveTo(arrowEnd, 150 - 20);
        fCtx.lineTo(arrowEnd - headlen * Math.cos(angle + Math.PI/6), 150 - 20 - headlen * Math.sin(angle + Math.PI/6));
        fCtx.stroke();
      }
    }

    function animateForce(timestamp) {
      if (!isPushing) return;
      if (!lastForceTime) lastForceTime = timestamp;
      const dt = (timestamp - lastForceTime) / 1000;
      lastForceTime = timestamp;

      const mass = parseFloat(massSlider.value);
      const appliedForce = parseFloat(forceSlider.value);
      const frictionCoeff = parseFloat(frictionSlider.value);
      const gConstant = 9.8;

      // Friction opposes velocity direction
      const fNormal = mass * gConstant;
      let fFrictionMax = frictionCoeff * fNormal;
      
      // Calculate net forces
      let netForce = appliedForce;
      
      if (block.vx > 0.05) {
        // Sliding right
        netForce -= fFrictionMax;
      } else if (block.vx < -0.05) {
        // Sliding left
        netForce += fFrictionMax;
      } else {
        // Static state: applied force must overcome static friction
        if (Math.abs(appliedForce) > fFrictionMax) {
          netForce = appliedForce - (Math.sign(appliedForce) * fFrictionMax);
        } else {
          netForce = 0;
          block.vx = 0;
        }
      }

      block.ax = netForce / mass;
      block.vx += block.ax * dt;

      // Update position
      block.x += block.vx * dt * 30; // Scale velocity to screen coordinates

      // Wall bounds & collision bouncing
      if (block.x <= 0) {
        block.x = 0;
        block.vx = 0;
      } else if (block.x >= forceCanvas.width - block.size) {
        block.x = forceCanvas.width - block.size;
        block.vx = 0;
      }

      document.getElementById("phys-accel-val").textContent = `${block.ax.toFixed(2)} m/s²`;
      document.getElementById("phys-speed-val").textContent = `${Math.abs(block.vx).toFixed(2)} m/s`;

      drawForceField();

      if (isPushing) {
        forceAnimationId = requestAnimationFrame(animateForce);
      }
    }

    pushBtn.addEventListener("click", () => {
      isPushing = !isPushing;
      if (isPushing) {
        lastForceTime = 0;
        pushBtn.textContent = state.currentLang === 'ar' ? 'إيقاف الحركة' : 'Stop Force';
        forceAnimationId = requestAnimationFrame(animateForce);
      } else {
        pushBtn.textContent = state.currentLang === 'ar' ? 'دفع / إيقاف' : 'Push / Stop';
      }
    });

    pushResetBtn.addEventListener("click", () => {
      isPushing = false;
      cancelAnimationFrame(forceAnimationId);
      pushBtn.textContent = state.currentLang === 'ar' ? 'دفع / إيقاف' : 'Push / Stop';
      block = { x: 50, vx: 0, ax: 0, size: 40 };
      document.getElementById("phys-accel-val").textContent = "0.00 m/s²";
      document.getElementById("phys-speed-val").textContent = "0.00 m/s";
      drawForceField();
    });

    drawForceField();
  }

  // ==========================================
  // LAB 3: Anatomy Organ Navigator
  // ==========================================
  initBiologyLab() {
    if (this.initDone.biology) return;
    this.initDone.biology = true;

    const bioButtons = document.querySelectorAll(".bio-btn");
    const activeGroup = document.querySelectorAll(".bio-system-group");
    const infoTitle = document.getElementById("bio-info-title");
    const infoText = document.getElementById("bio-info-text");
    const organsList = document.getElementById("bio-organs-list");
    const factText = document.getElementById("bio-fun-fact-text");
    const animateBtn = document.getElementById("bio-animate-btn");

    let currentSystem = "respiratory";

    const systemData = {
      respiratory: {
        title: "Respiratory System / الجهاز التنفسي",
        desc: "The respiratory system takes in oxygen from the air and releases carbon dioxide. The lungs exchange these gases in tiny air sacs called alveoli.",
        organs: [
          "Trachea (Windpipe) - Connects larynx to bronchi",
          "Bronchi - Main passageway branching into lungs",
          "Lungs (Left & Right) - Primary organs of gas exchange",
          "Diaphragm - Muscle contracting to pull in air"
        ],
        fact: "Your lungs contain almost 1,500 miles of airways and 300 million alveoli, maximizing the surface area for diffusion.",
        animClass: "breathing"
      },
      circulatory: {
        title: "Circulatory System / جهاز الدوران",
        desc: "The circulatory system delivers oxygen and nutrients to cells and takes away carbon dioxide. The heart pumps blood through arteries (oxygenated) and veins (deoxygenated).",
        organs: [
          "Heart - 4-chambered muscular pump pushing blood",
          "Arteries - High pressure pathways leaving heart (Red)",
          "Veins - Lower pressure paths returning to heart (Blue)",
          "Capillaries - Microscopic sites of cell exchange"
        ],
        fact: "The heart pumps around 2,000 gallons of blood every day, beating about 100,000 times to sustain circulation.",
        animClass: "beating"
      },
      nervous: {
        title: "Nervous System / الجهاز العصبي",
        desc: "The nervous system transmits signals between the brain and the rest of the body. It controls sensory perceptions, movements, thoughts, and autonomic reactions.",
        organs: [
          "Brain - Central command center processing signals",
          "Spinal Cord - Main pathway transmitting nerve impulses",
          "Nerves - Peripheral fibers branching to extremities",
          "Neurons - Synapse connections firing signals"
        ],
        fact: "Nerve impulses travel to and from the brain at speeds up to 268 miles per hour, faster than a formula racing car!",
        animClass: "flashing"
      },
      digestive: {
        title: "Digestive System / الجهاز الهضمي",
        desc: "The digestive system breaks down food into nutrients such as carbohydrates, fats, and proteins. They are then absorbed into the bloodstream for energy and repair.",
        organs: [
          "Esophagus - Muscular tube conveying swallowed food",
          "Stomach - Acid reservoir digesting proteins chemically",
          "Small Intestine - Principal site of nutrient absorption",
          "Large Intestine - Recovers water and processes waste"
        ],
        fact: "The small intestine is actually about 20 feet long! Its internal surface is covered in folds and microvilli, expanding absorption area.",
        animClass: "digesting"
      }
    };

    function selectSystem(sysId) {
      currentSystem = sysId;
      const data = systemData[sysId];

      // Update Active Navigation State
      bioButtons.forEach(btn => {
        if (btn.getAttribute("data-system") === sysId) {
          btn.classList.add("active");
        } else {
          btn.classList.remove("active");
        }
      });

      // Update SVG highlighting groups
      activeGroup.forEach(g => {
        g.classList.remove("active", "breathing", "beating", "flashing", "digesting");
        if (g.id === `bio-grp-${sysId}`) {
          g.classList.add("active");
        }
      });

      // Update Info Cards
      infoTitle.textContent = data.title;
      infoText.textContent = data.desc;
      factText.textContent = data.fact;

      // Populate Organs
      organsList.innerHTML = data.organs.map(org => `<li>${org}</li>`).join('');
    }

    bioButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        selectSystem(btn.getAttribute("data-system"));
      });
    });

    animateBtn.addEventListener("click", () => {
      const activeSysGroup = document.getElementById(`bio-grp-${currentSystem}`);
      const animClass = systemData[currentSystem].animClass;
      
      if (activeSysGroup.classList.contains(animClass)) {
        activeSysGroup.classList.remove(animClass);
      } else {
        activeSysGroup.classList.add(animClass);
      }
    });

    selectSystem("respiratory");
  }

  // ==========================================
  // LAB 4: Chemical reactions
  // ==========================================
  initChemistryLab() {
    if (this.initDone.chemistry) return;
    this.initDone.chemistry = true;

    const liquidPath = document.getElementById("beaker-liquid");
    const phValueEl = document.getElementById("chem-val-ph");
    const stateEl = document.getElementById("chem-val-state");
    const equationEl = document.getElementById("chem-equation-box");
    const logList = document.getElementById("chem-log-list");
    const bubbleGroup = document.getElementById("beaker-bubbles");
    const washBtn = document.getElementById("chem-reset-btn");
    const dropperBtns = document.querySelectorAll(".dropper-btn");

    let currentPH = 7.0;
    let hasIndicator = false;
    let reactantState = "water"; // "water", "acidic", "alkaline", "salt_water"

    function getLiquidColor(ph) {
      if (!hasIndicator) {
        return "rgba(255, 255, 255, 0.12)"; // Translucent clear liquid
      }
      
      // Universal indicator colors depending on pH
      if (ph < 3) return "rgba(255, 0, 122, 0.65)";    // Acid: Deep Pink/Red
      if (ph < 5.5) return "rgba(255, 120, 0, 0.6)";   // Weak Acid: Orange
      if (ph <= 7.5) return "rgba(16, 185, 129, 0.5)"; // Neutral: Green
      if (ph < 10) return "rgba(0, 242, 254, 0.6)";    // Weak Base: Cyan
      return "rgba(139, 92, 246, 0.65)";               // Strong Base: Purple
    }

    function updateBeakerDisplay() {
      liquidPath.setAttribute("fill", getLiquidColor(currentPH));
      phValueEl.textContent = currentPH.toFixed(1);

      // Determine textual states
      let desc = "Neutral";
      let classType = "neutral";
      
      if (currentPH < 6.5) {
        desc = currentPH < 3 ? "Strong Acid (HCl)" : "Weak Acid";
        classType = "acidic";
      } else if (currentPH > 7.5) {
        desc = currentPH > 11 ? "Strong Base (NaOH)" : "Weak Base";
        classType = "alkaline";
      } else if (reactantState === "salt_water") {
        desc = "Saline Solution (NaCl + H₂O)";
      }

      stateEl.textContent = desc;
      stateEl.className = `gauge-val ${classType}`;
    }

    function addLogEntry(text, type = "system-msg") {
      const entry = document.createElement("div");
      entry.className = `log-entry ${type}`;
      entry.textContent = text;
      logList.appendChild(entry);
      logList.scrollTop = logList.scrollHeight;
    }

    function triggerNeutralizationBubbles() {
      // Create animated bubbles inside SVG group
      bubbleGroup.innerHTML = "";
      for (let i = 0; i < 20; i++) {
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        const rx = 25 + Math.random() * 50; // Random X spread
        const ry = 80 + Math.random() * 20; // Bottom Beaker coordinates
        const size = 1.5 + Math.random() * 3;
        const delay = Math.random() * 1.5;

        circle.setAttribute("cx", rx);
        circle.setAttribute("cy", ry);
        circle.setAttribute("r", size);
        circle.setAttribute("fill", "#ffffff");
        circle.setAttribute("opacity", "0.6");
        circle.setAttribute("class", "chem-bubble");
        circle.setAttribute("style", `animation-delay: ${delay}s;`);
        bubbleGroup.appendChild(circle);
      }

      // Clear bubbles after animation duration
      setTimeout(() => {
        bubbleGroup.innerHTML = "";
      }, 3500);
    }

    dropperBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const liquid = btn.getAttribute("data-liquid");

        if (liquid === "indicator") {
          hasIndicator = true;
          addLogEntry("Universal indicator added. Molecular colorization active.", "neutral");
          updateBeakerDisplay();
          return;
        }

        if (liquid === "acid") {
          // Add hydrochloric acid
          if (currentPH > 2) {
            currentPH = Math.max(1.0, currentPH - 2.5);
            addLogEntry("Dropped Hydrochloric Acid (HCl). High Hydronium ion count [H₃O⁺].", "acidic");
          } else {
            addLogEntry("pH at saturation limit.", "acidic");
          }

          if (reactantState === "alkaline") {
            // Neutralization reaction!
            reactantState = "salt_water";
            currentPH = 7.0;
            equationEl.textContent = "HCl + NaOH → NaCl + H₂O (Neutralization)";
            addLogEntry("Acid reacted with Sodium Hydroxide. Exothermic Neutralization occurred! NaCl salt precipitated.", "neutral");
            triggerNeutralizationBubbles();
          } else if (reactantState === "water") {
            reactantState = "acidic";
            equationEl.textContent = "HCl + H₂O → H₃O⁺ + Cl⁻";
          }
        }

        if (liquid === "base") {
          // Add Sodium Hydroxide base
          if (currentPH < 13) {
            currentPH = Math.min(14.0, currentPH + 2.5);
            addLogEntry("Dropped Sodium Hydroxide (NaOH). High Hydroxide ion concentration [OH⁻].", "alkaline");
          } else {
            addLogEntry("pH at saturation limit.", "alkaline");
          }

          if (reactantState === "acidic") {
            // Neutralization!
            reactantState = "salt_water";
            currentPH = 7.0;
            equationEl.textContent = "NaOH + HCl → NaCl + H₂O (Neutralization)";
            addLogEntry("Base reacted with Hydrochloric Acid. Exothermic Neutralization occurred! NaCl salt precipitated.", "neutral");
            triggerNeutralizationBubbles();
          } else if (reactantState === "water") {
            reactantState = "alkaline";
            equationEl.textContent = "NaOH → Na⁺ + OH⁻ (Dissociation)";
          }
        }

        updateBeakerDisplay();
      });
    });

    washBtn.addEventListener("click", () => {
      currentPH = 7.0;
      hasIndicator = false;
      reactantState = "water";
      equationEl.textContent = "H₂O (Water Solution)";
      bubbleGroup.innerHTML = "";
      logList.innerHTML = `<div class="log-entry system-msg">Beaker washed. Filled with pure water.</div>`;
      updateBeakerDisplay();
    });

    updateBeakerDisplay();
  }

  // ==========================================
  // LAB 5: Geographic Map Explorer
  // ==========================================
  initGeographyLab() {
    if (this.initDone.geography) return;
    this.initDone.geography = true;

    const canvas = document.getElementById("geography-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    
    // Compass SVG needle
    const compassNeedle = document.getElementById("compass-needle");
    const zoomSlider = document.getElementById("geo-zoom-slider");
    const resetBtn = document.getElementById("geo-reset-btn");
    const layerCheckboxes = document.querySelectorAll(".geo-layer-checkbox");

    let zoom = 1;
    let panX = 0;
    let panY = 0;
    let currentRotation = 0;
    let selectedLocation = null;

    // Geographic data: Countries, Cities, Ports, and Routes
    const countries = [
      { name: "USA", bounds: { x: 50, y: 150, w: 120, h: 80 }, color: "rgba(0, 242, 254, 0.2)" },
      { name: "Canada", bounds: { x: 60, y: 100, w: 100, h: 60 }, color: "rgba(100, 200, 255, 0.2)" },
      { name: "Brazil", bounds: { x: 180, y: 200, w: 70, h: 80 }, color: "rgba(34, 197, 94, 0.2)" },
      { name: "Europe", bounds: { x: 240, y: 120, w: 80, h: 70 }, color: "rgba(168, 85, 247, 0.2)" },
      { name: "Africa", bounds: { x: 260, y: 200, w: 70, h: 90 }, color: "rgba(249, 115, 22, 0.2)" },
      { name: "Middle East", bounds: { x: 300, y: 160, w: 60, h: 50 }, color: "rgba(239, 68, 68, 0.2)" },
      { name: "India", bounds: { x: 340, y: 180, w: 50, h: 40 }, color: "rgba(236, 72, 153, 0.2)" },
      { name: "China", bounds: { x: 360, y: 130, w: 60, h: 50 }, color: "rgba(60, 120, 216, 0.2)" },
      { name: "Australia", bounds: { x: 420, y: 280, w: 50, h: 50 }, color: "rgba(34, 197, 94, 0.15)" }
    ];

    const cities = [
      { name: "New York", x: 80, y: 170, country: "USA", population: "8.3M", weather: "Temperate" },
      { name: "Los Angeles", x: 50, y: 180, country: "USA", population: "3.9M", weather: "Mediterranean" },
      { name: "Chicago", x: 100, y: 160, country: "USA", population: "2.7M", weather: "Temperate" },
      { name: "Toronto", x: 110, y: 120, country: "Canada", population: "2.9M", weather: "Continental" },
      { name: "São Paulo", x: 200, y: 230, country: "Brazil", population: "11.8M", weather: "Tropical" },
      { name: "London", x: 250, y: 140, country: "Europe", population: "8.9M", weather: "Oceanic" },
      { name: "Paris", x: 260, y: 145, country: "Europe", population: "2.1M", weather: "Temperate" },
      { name: "Cairo", x: 280, y: 210, country: "Africa", population: "19.5M", weather: "Desert" },
      { name: "Dubai", x: 310, y: 190, country: "Middle East", population: "3.6M", weather: "Desert" },
      { name: "Delhi", x: 350, y: 180, country: "India", population: "30.3M", weather: "Tropical" },
      { name: "Shanghai", x: 390, y: 150, country: "China", population: "27.0M", weather: "Subtropical" },
      { name: "Tokyo", x: 420, y: 140, country: "Japan", population: "14.0M", weather: "Temperate" },
      { name: "Sydney", x: 450, y: 300, country: "Australia", population: "5.3M", weather: "Temperate" }
    ];

    const ports = [
      { name: "Port of Rotterdam", x: 260, y: 135, country: "Europe", volume: "14.35M TEU" },
      { name: "Port of Singapore", x: 380, y: 240, country: "Singapore", volume: "37.0M TEU" },
      { name: "Port of Shanghai", x: 395, y: 155, country: "China", volume: "43.3M TEU" },
      { name: "Port of LA", x: 48, y: 185, country: "USA", volume: "9.4M TEU" },
      { name: "Port of Dubai", x: 315, y: 195, country: "UAE", volume: "15.1M TEU" },
      { name: "Port of Hamburg", x: 265, y: 130, country: "Germany", volume: "9.3M TEU" },
      { name: "Port of Santos", x: 210, y: 240, country: "Brazil", volume: "3.9M TEU" }
    ];

    const supplyRoutes = [
      { name: "Trans-Pacific Route", points: [[50, 180], [100, 160], [200, 150], [300, 160], [380, 170]], color: "#00f2fe" },
      { name: "Suez Route", points: [[250, 200], [280, 210], [310, 200], [340, 190], [380, 170]], color: "#ff007a" },
      { name: "Silk Road", points: [[260, 145], [300, 160], [340, 170], [380, 160], [420, 150]], color: "#fbbf24" },
      { name: "Atlantic Route", points: [[80, 170], [150, 160], [200, 150], [250, 140], [280, 140]], color: "#10b981" }
    ];

    const weatherZones = [
      { name: "Tropical", bounds: { x: 150, y: 220, w: 150, h: 60 }, color: "rgba(239, 68, 68, 0.1)", temp: "25-35°C" },
      { name: "Temperate", bounds: { x: 100, y: 130, w: 200, h: 80 }, color: "rgba(59, 130, 246, 0.1)", temp: "10-20°C" },
      { name: "Desert", bounds: { x: 260, y: 180, w: 100, h: 70 }, color: "rgba(251, 191, 36, 0.1)", temp: "20-40°C" },
      { name: "Arctic/Cold", bounds: { x: 80, y: 90, w: 180, h: 40 }, color: "rgba(96, 165, 250, 0.1)", temp: "-10 to 0°C" }
    ];

    let visibleLayers = {
      countries: true,
      cities: true,
      ports: true,
      roads: true,
      weather: true
    };

    function drawMap() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background
      ctx.fillStyle = state.theme === 'dark' ? "#0a0e27" : "#e8f4f8";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw ocean grid
      ctx.strokeStyle = state.theme === 'dark' ? "rgba(0, 242, 254, 0.05)" : "rgba(0, 100, 200, 0.05)";
      ctx.lineWidth = 0.5;
      const gridSize = 40;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Save context for transformations
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.scale(zoom, zoom);
      ctx.translate(-canvas.width / 2 + panX, -canvas.height / 2 + panY);

      // Draw weather zones
      if (visibleLayers.weather) {
        weatherZones.forEach(zone => {
          ctx.fillStyle = zone.color;
          ctx.fillRect(zone.bounds.x, zone.bounds.y, zone.bounds.w, zone.bounds.h);
          ctx.strokeStyle = zone.color.replace("0.1", "0.3");
          ctx.lineWidth = 1;
          ctx.strokeRect(zone.bounds.x, zone.bounds.y, zone.bounds.w, zone.bounds.h);

          // Weather label
          ctx.fillStyle = state.theme === 'dark' ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.2)";
          ctx.font = "10px Inter";
          ctx.fillText(zone.name + " (" + zone.temp + ")", zone.bounds.x + 5, zone.bounds.y + 15);
        });
      }

      // Draw countries
      if (visibleLayers.countries) {
        countries.forEach(country => {
          ctx.fillStyle = country.color;
          ctx.fillRect(country.bounds.x, country.bounds.y, country.bounds.w, country.bounds.h);
          ctx.strokeStyle = "#00f2fe";
          ctx.lineWidth = 1.5;
          ctx.strokeRect(country.bounds.x, country.bounds.y, country.bounds.w, country.bounds.h);

          // Country label
          ctx.fillStyle = state.theme === 'dark' ? "#ffffff" : "#222222";
          ctx.font = "bold 12px Inter";
          ctx.fillText(country.name, country.bounds.x + 5, country.bounds.y + country.bounds.h / 2);
        });
      }

      // Draw supply routes
      if (visibleLayers.roads) {
        supplyRoutes.forEach(route => {
          ctx.strokeStyle = route.color;
          ctx.lineWidth = 2.5;
          ctx.shadowBlur = 8;
          ctx.shadowColor = route.color;
          ctx.beginPath();
          route.points.forEach((point, idx) => {
            if (idx === 0) {
              ctx.moveTo(point[0], point[1]);
            } else {
              ctx.lineTo(point[0], point[1]);
            }
          });
          ctx.stroke();
          ctx.shadowBlur = 0;

          // Route label
          const midPoint = route.points[Math.floor(route.points.length / 2)];
          ctx.fillStyle = route.color;
          ctx.font = "9px Inter";
          ctx.fillText(route.name, midPoint[0] + 5, midPoint[1] - 5);
        });
      }

      // Draw ports
      if (visibleLayers.ports) {
        ports.forEach(port => {
          // Port anchor symbol
          ctx.fillStyle = "#ffb700";
          ctx.beginPath();
          ctx.moveTo(port.x, port.y - 8);
          ctx.lineTo(port.x - 6, port.y + 4);
          ctx.lineTo(port.x + 6, port.y + 4);
          ctx.closePath();
          ctx.fill();

          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.shadowBlur = 6;
          ctx.shadowColor = "rgba(255, 183, 0, 0.5)";
          ctx.beginPath();
          ctx.arc(port.x, port.y + 2, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;

          // Port label
          ctx.fillStyle = "#ffb700";
          ctx.font = "8px Inter";
          ctx.fillText(port.name, port.x - 20, port.y - 12);
        });
      }

      // Draw cities
      if (visibleLayers.cities) {
        cities.forEach(city => {
          // City dot
          ctx.beginPath();
          ctx.arc(city.x, city.y, 4, 0, Math.PI * 2);
          ctx.fillStyle = "#ff4757";
          ctx.fill();

          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Glow effect
          ctx.shadowBlur = 5;
          ctx.shadowColor = "rgba(255, 71, 87, 0.6)";
          ctx.beginPath();
          ctx.arc(city.x, city.y, 4, 0, Math.PI * 2);
          ctx.stroke();
          ctx.shadowBlur = 0;

          // City label
          ctx.fillStyle = state.theme === 'dark' ? "#ffffff" : "#222222";
          ctx.font = "8px Inter";
          ctx.fillText(city.name, city.x - 15, city.y - 8);
        });
      }

      ctx.restore();

      // Update stats
      document.getElementById("geo-zoom-level").textContent = zoom.toFixed(1);
    }

    // Mouse interactions for selecting locations
    canvas.addEventListener("click", (e) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left) / zoom;
      const mouseY = (e.clientY - rect.top) / zoom;

      // Check cities
      cities.forEach(city => {
        const dist = Math.sqrt(Math.pow(city.x - mouseX, 2) + Math.pow(city.y - mouseY, 2));
        if (dist < 15) {
          selectedLocation = city;
          updateLocationInfo(city);
        }
      });

      // Check ports
      ports.forEach(port => {
        const dist = Math.sqrt(Math.pow(port.x - mouseX, 2) + Math.pow(port.y - mouseY, 2));
        if (dist < 15) {
          selectedLocation = port;
          updateLocationInfo(port);
        }
      });
    });

    function updateLocationInfo(location) {
      document.getElementById("geo-location-name").textContent = location.name;
      document.getElementById("geo-location-type").textContent = location.volume ? "Port" : "City";
      document.getElementById("geo-location-coords").textContent = `(${location.x.toFixed(0)}, ${location.y.toFixed(0)})`;
      document.getElementById("geo-location-weather").textContent = location.weather || "Seaport";
      
      // Update compass needle to point to location
      if (location.x && location.y) {
        const angle = Math.atan2(location.y - (canvas.height / 2), location.x - (canvas.width / 2)) * 180 / Math.PI;
        currentRotation = angle;
        compassNeedle.setAttribute("transform", `rotate(${angle} 100 100)`);
      }
    }

    // Zoom control
    zoomSlider.addEventListener("input", (e) => {
      zoom = parseFloat(e.target.value);
      drawMap();
    });

    // Layer toggle
    layerCheckboxes.forEach(checkbox => {
      checkbox.addEventListener("change", (e) => {
        visibleLayers[e.target.getAttribute("data-layer")] = e.target.checked;
        drawMap();
      });
    });

    // Reset view
    resetBtn.addEventListener("click", () => {
      zoom = 1;
      panX = 0;
      panY = 0;
      zoomSlider.value = 1;
      selectedLocation = null;
      document.getElementById("geo-location-name").textContent = "None Selected";
      document.getElementById("geo-location-type").textContent = "-";
      document.getElementById("geo-location-coords").textContent = "-";
      document.getElementById("geo-location-weather").textContent = "-";
      drawMap();
    });

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
      if (document.getElementById("labs-tab").classList.contains("active")) {
        const panSpeed = 10;
        switch(e.key) {
          case "ArrowUp":
            panY -= panSpeed;
            drawMap();
            break;
          case "ArrowDown":
            panY += panSpeed;
            drawMap();
            break;
          case "ArrowLeft":
            panX -= panSpeed;
            drawMap();
            break;
          case "ArrowRight":
            panX += panSpeed;
            drawMap();
            break;
        }
      }
    });

    drawMap();
  }

  // ==========================================
  // LAB 6: Code Sandbox compiler
  // ==========================================
  initCodeSandboxLab() {
    if (this.initDone.code) return;
    this.initDone.code = true;

    const editorTextarea = document.getElementById("code-editor-textarea");
    const lineNumbersDiv = document.getElementById("editor-line-numbers");
    const sampleSelect = document.getElementById("code-sample-selector");
    const runBtn = document.getElementById("code-run-btn");
    const livePreview = document.getElementById("code-live-preview");

    // Sample code templates
    const samples = {
      pulse: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { background-color: #0b0b0d; color: #fff; text-align: center; font-family: sans-serif; overflow: hidden; margin: 0;}
    canvas { background-color: #121216; display: block; width: 100vw; height: 100vh;}
  </style>
</head>
<body>
  <canvas id="c"></canvas>
  <script>
    const canvas = document.getElementById("c");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    let mouse = { x: canvas.width/2, y: canvas.height/2 };
    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    let scale = 0;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      scale += 0.05;
      const size = 30 + Math.sin(scale) * 15;
      
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, size, 0, Math.PI*2);
      ctx.fillStyle = "rgba(0, 242, 254, 0.4)";
      ctx.fill();
      ctx.strokeStyle = "#00f2fe";
      ctx.lineWidth = 4;
      ctx.stroke();

      requestAnimationFrame(draw);
    }
    draw();
  <\/script>
</body>
</html>`,
      heart: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { background-color: #121212; display: flex; justify-content: center; align-items: center; height: 100vh; overflow: hidden; margin: 0;}
    svg { fill: #ff007a; width: 120px; animation: pulse 1.2s infinite ease-in-out; filter: drop-shadow(0 0 10px rgba(255, 0, 122, 0.5));}
    @keyframes pulse {
      0% { transform: scale(1); }
      30% { transform: scale(1.25); }
      45% { transform: scale(1.1); }
      60% { transform: scale(1.25); }
      100% { transform: scale(1); }
    }
  </style>
</head>
<body>
  <svg viewBox="0 0 32 29.6">
    <path d="M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2
    c6.1-9.3,16-12.1,16-21.2C32,3.8,28.2,0,23.6,0z"/>
  </svg>
</body>
</html>`,
      glass: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { 
      background: radial-gradient(circle, #25123e 0%, #0d0614 100%); 
      display: flex; justify-content: center; align-items: center; 
      height: 100vh; margin: 0; font-family: system-ui, sans-serif;
    }
    .card {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(12px);
      border-radius: 20px;
      padding: 30px;
      width: 260px;
      text-align: center;
      box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
      color: #fff;
      transition: transform 0.4s ease, border-color 0.4s ease;
      cursor: pointer;
    }
    .card:hover {
      transform: scale(1.05) translateY(-5px);
      border-color: #00f2fe;
    }
    .icon { font-size: 40px; margin-bottom: 10px; }
    h2 { font-size: 20px; margin: 0 0 10px 0; letter-spacing: 1px; }
    p { font-size: 13px; color: #ccc; margin: 0; line-height: 1.4; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">✨</div>
    <h2>PREMIUM UI</h2>
    <p>This glassmorphic card responds with scaling animations and neon glow adjustments.</p>
  </div>
</body>
</html>`,
      plotter: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { background-color: #080710; margin: 0; overflow: hidden; display: flex; justify-content: center; align-items: center; height: 100vh; }
    canvas { background-color: #080710; }
  </style>
</head>
<body>
  <canvas id="c"></canvas>
  <script>
    const canvas = document.getElementById("c");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let offset = 0;
    function animate() {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#ff007a";
      
      for (let x = 0; x < canvas.width; x++) {
        const y = canvas.height/2 + Math.sin(x * 0.01 + offset) * Math.cos(x * 0.005) * 80;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      offset += 0.03;
      requestAnimationFrame(animate);
    }
    animate();
  <\/script>
</body>
</html>`,
      neonwave: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { background-color: #06060c; margin: 0; height: 100vh; display: flex; justify-content: center; align-items: center;}
    canvas { width: 100%; height: 100%; }
  </style>
</head>
<body>
  <canvas id="wave"></canvas>
  <script>
    const canvas = document.getElementById("wave");
    const ctx = canvas.getContext("wave");
    const c = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let angle = 0;
    function render() {
      c.fillStyle = "rgba(6, 6, 12, 0.1)";
      c.fillRect(0, 0, canvas.width, canvas.height);
      
      c.beginPath();
      c.strokeStyle = "#00f2fe";
      c.lineWidth = 2.5;
      
      const midY = canvas.height / 2;
      for(let x=0; x<canvas.width; x+=5) {
        const y = midY + Math.sin(x * 0.008 + angle) * Math.sin(angle * 0.5) * 120;
        if (x === 0) c.moveTo(x, y);
        else c.lineTo(x, y);
      }
      c.stroke();
      angle += 0.04;
      requestAnimationFrame(render);
    }
    render();
  <\/script>
</body>
</html>`
    };

    function updateLineNumbers() {
      const text = editorTextarea.value;
      const lines = text.split("\n").length;
      let numbers = "";
      for (let i = 1; i <= lines; i++) {
        numbers += `${i}<br>`;
      }
      lineNumbersDiv.innerHTML = numbers;
    }

    function loadTemplate(name) {
      if (samples[name]) {
        editorTextarea.value = samples[name];
        updateLineNumbers();
        runPreview();
      }
    }

    function runPreview() {
      const code = editorTextarea.value;
      
      // Sandbox iframe execution (srcdoc is robust and self-contained)
      livePreview.srcdoc = code;
    }

    // Bindings
    editorTextarea.addEventListener("input", updateLineNumbers);
    editorTextarea.addEventListener("scroll", () => {
      lineNumbersDiv.scrollTop = editorTextarea.scrollTop;
    });

    sampleSelect.addEventListener("change", (e) => {
      loadTemplate(e.target.value);
    });

    runBtn.addEventListener("click", runPreview);

    // Initial load
    loadTemplate("pulse");
  }
}

// Bind to window to allow loading in other modules
window.addEventListener("load", () => {
  window.eduLabs = new EduLabs();
});
