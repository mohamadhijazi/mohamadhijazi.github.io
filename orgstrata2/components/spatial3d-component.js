/* ==========================================================================
   SPATIAL 3D COMPONENT MODULE
   Renders 3D floor plan using Three.js room boxes
   Falls back to rooms grid card layout if Three.js unavailable
   Universal Component Studio: rooms data editor
   ========================================================================== */

window.Spatial3DComponent = {
  type: '3dspatial',
  _renderers: {},
  _blueprintInstances: {},

  render(container, config) {
    container.innerHTML = '';
    const data = config.data || {};
    const rooms = data.rooms || [];

    if (typeof window.Blueprint3d !== 'undefined') {
      this._renderBlueprint3D(container, config, data);
    } else if (typeof THREE !== 'undefined') {
      this._renderThree(container, config, rooms);
    } else {
      this._renderFallback(container, rooms);
    }
  },

  _renderBlueprint3D(container, config, data) {
    const uid = 'bp3d-' + (config.id || Math.random().toString(36).slice(2, 9));
    const serializedPlan = data.serialized || data.plan || this._getDefaultBlueprintPlan();

    container.innerHTML = `
      <div class="blueprint3d-shell" style="position:relative;height:100%;min-height:260px;border-radius:10px;overflow:hidden;border:1px solid rgba(0,242,254,0.25);background:linear-gradient(180deg, rgba(14,17,27,0.9), rgba(15,22,31,0.95));">
        <div id="${uid}-viewer" class="blueprint3d-viewer" style="position:absolute;inset:0 0 0 0;display:block;"></div>
        <div id="${uid}-floorplanner" class="blueprint3d-floorplanner" style="position:absolute;inset:0 0 0 0;display:block;background:rgba(0,0,0,0.05);">
          <canvas id="${uid}-canvas" style="width:100%;height:100%;display:block;"></canvas>
          <div class="blueprint3d-toolbar" style="position:absolute;left:12px;top:12px;display:flex;gap:6px;flex-wrap:wrap;z-index:3;">
            <button type="button" data-blueprint-mode="move" style="padding:6px 10px;border-radius:999px;border:1px solid rgba(255,255,255,0.15);background:rgba(10,15,20,0.7);color:#eaf7ff;cursor:pointer;">Move</button>
            <button type="button" data-blueprint-mode="draw" style="padding:6px 10px;border-radius:999px;border:1px solid rgba(255,255,255,0.15);background:rgba(10,15,20,0.7);color:#eaf7ff;cursor:pointer;">Draw</button>
            <button type="button" data-blueprint-mode="delete" style="padding:6px 10px;border-radius:999px;border:1px solid rgba(255,255,255,0.15);background:rgba(10,15,20,0.7);color:#eaf7ff;cursor:pointer;">Delete</button>
            <button type="button" data-blueprint-mode="done" style="padding:6px 10px;border-radius:999px;border:1px solid rgba(0,242,254,0.4);background:rgba(0,242,254,0.15);color:#d7fbff;cursor:pointer;">Done</button>
          </div>
        </div>
      </div>
    `;

    const instance = new window.Blueprint3d({
      threeElement: `#${uid}-viewer`,
      threeCanvasElement: `${uid}-three-canvas`,
      floorplannerElement: `${uid}-canvas`,
      textureDir: 'components/blueprint3d/models/textures/',
      widget: false
    });

    instance.model.loadSerialized(typeof serializedPlan === 'string' ? serializedPlan : JSON.stringify(serializedPlan));
    this._blueprintInstances[config.id] = instance;

    const floorplanner = instance.floorplanner;
    container.querySelectorAll('[data-blueprint-mode]').forEach((button) => {
      button.addEventListener('click', () => {
        const mode = button.dataset.blueprintMode;
        if (mode === 'move') floorplanner.setMode(floorplanner.modes.MOVE);
        if (mode === 'draw') floorplanner.setMode(floorplanner.modes.DRAW);
        if (mode === 'delete') floorplanner.setMode(floorplanner.modes.DELETE);
        if (mode === 'done') {
          floorplanner.setMode(floorplanner.modes.MOVE);
          instance.three.updateWindowSize();
        }
      });
    });

    setTimeout(() => {
      try { instance.three.updateWindowSize(); } catch (e) {}
    }, 80);
  },

  _getDefaultBlueprintPlan() {
    return {
      floorplan: {
        corners: {
          a: { x: 0, y: 0 },
          b: { x: 540, y: 0 },
          c: { x: 540, y: 360 },
          d: { x: 0, y: 360 }
        },
        walls: [
          { corner1: 'a', corner2: 'b', frontTexture: { url: 'components/blueprint3d/models/textures/wallmap.png', stretch: true, scale: 0 }, backTexture: { url: 'components/blueprint3d/models/textures/wallmap.png', stretch: true, scale: 0 } },
          { corner1: 'b', corner2: 'c', frontTexture: { url: 'components/blueprint3d/models/textures/wallmap.png', stretch: true, scale: 0 }, backTexture: { url: 'components/blueprint3d/models/textures/wallmap.png', stretch: true, scale: 0 } },
          { corner1: 'c', corner2: 'd', frontTexture: { url: 'components/blueprint3d/models/textures/wallmap.png', stretch: true, scale: 0 }, backTexture: { url: 'components/blueprint3d/models/textures/wallmap.png', stretch: true, scale: 0 } },
          { corner1: 'd', corner2: 'a', frontTexture: { url: 'components/blueprint3d/models/textures/wallmap.png', stretch: true, scale: 0 }, backTexture: { url: 'components/blueprint3d/models/textures/wallmap.png', stretch: true, scale: 0 } }
        ],
        wallTextures: [],
        floorTextures: {},
        newFloorTextures: {}
      },
      items: []
    };
  },

  _renderThree(container, config, rooms) {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'width:100%;height:260px;display:block;border-radius:8px;';
    container.appendChild(canvas);

    // Clean up old renderer
    if (this._renderers[config.id]) {
      try { this._renderers[config.id].dispose(); } catch(e) {}
    }

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(container.offsetWidth || 400, 260);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, (container.offsetWidth || 400) / 260, 0.1, 1000);
    camera.position.set(8, 10, 12);
    camera.lookAt(0, 0, 0);

    // Ambient + directional light
    scene.add(new THREE.AmbientLight(0x334466, 2));
    const dirLight = new THREE.DirectionalLight(0x00f2fe, 1);
    dirLight.position.set(5, 10, 5);
    scene.add(dirLight);

    // Grid floor
    const grid = new THREE.GridHelper(20, 20, 0x1a2535, 0x0f1625);
    scene.add(grid);

    // Render rooms as boxes
    const colors = [0x00f2fe, 0x7f00ff, 0x00e676, 0xff9100, 0x4facfe];
    let xOffset = -6;

    rooms.slice(0, 5).forEach((room, i) => {
      const w = parseFloat(room.width)  || 4;
      const l = parseFloat(room.length) || 5;
      const h = 2.5;

      const geometry = new THREE.BoxGeometry(w * 0.6, h, l * 0.6);
      const material = new THREE.MeshPhongMaterial({
        color: colors[i % colors.length],
        opacity: 0.7,
        transparent: true,
        wireframe: false
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(xOffset, h / 2, 0);
      scene.add(mesh);

      // Wireframe edges
      const edges = new THREE.EdgesGeometry(geometry);
      const lineMat = new THREE.LineBasicMaterial({ color: colors[i % colors.length], opacity: 0.9, transparent: true });
      const wireframe = new THREE.LineSegments(edges, lineMat);
      wireframe.position.copy(mesh.position);
      scene.add(wireframe);

      xOffset += w * 0.6 + 0.5;
    });

    // Animate
    let frameId;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      scene.rotation.y += 0.003;
      renderer.render(scene, camera);
    };
    animate();

    this._renderers[config.id] = { renderer, frameId };
  },

  _renderFallback(container, rooms) {
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'height:260px;overflow-y:auto;padding:0.25rem;';

    const header = `<div style="font-size:0.75rem;color:#7f00ff;margin-bottom:0.75rem;font-weight:700;"><i class="fa-solid fa-cube"></i> 3D Floor Plan (Three.js)</div>`;

    const grid = document.createElement('div');
    grid.className = 'rooms-grid';

    rooms.forEach(r => {
      const card = document.createElement('div');
      card.className = 'room-card';
      card.innerHTML = `<div class="room-card-name">${r.name}</div>
                        <div class="room-card-dim"><i class="fa-solid fa-vector-square"></i> ${r.width} × ${r.length}</div>
                        <div class="room-card-assets"><i class="fa-solid fa-boxes-stacked"></i> ${r.assets}</div>`;
      grid.appendChild(card);
    });

    wrapper.innerHTML = header;
    if (rooms.length === 0) {
      wrapper.innerHTML += '<div style="padding:1rem;color:#64748b;font-size:0.82rem;text-align:center;">No rooms. Add via Component Studio.</div>';
    }
    wrapper.appendChild(grid);
    container.appendChild(wrapper);
  },

  getStudioConfig(config) {
    return {
      settingsFields: [
        { key: 'title', label: 'Title', type: 'text', value: config.title },
        { key: 'columnSpan', label: 'Column Span', type: 'select',
          options: ['full','half','two-thirds','third'], value: config.columnSpan }
      ],
      dataType: 'rooms',
      dataDescription: 'One row per room (name, width in m, length in m, assets description)',
      getTableHeaders() { return ['Room Name','Width (m)','Length (m)','Assets / Notes']; },
      getTableRows() { return (config.data?.rooms || []).map(r => [r.name, r.width, r.length, r.assets]); },
      parseTableData(rows) {
        return {
          rooms: rows.filter(r => r[0]).map(r => ({
            name: r[0], width: r[1] || '4m', length: r[2] || '5m', assets: r[3] || ''
          }))
        };
      }
    };
  }
};
