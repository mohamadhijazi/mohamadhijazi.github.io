/* ==========================================================================
   OPENMAP / LEAFLET COMPONENT MODULE
   Renders Leaflet OpenStreetMap with configurable geo markers
   Universal Component Studio data table integration
   ========================================================================== */

window.OpenMapComponent = {
  type: 'map',
  _maps: {},

  render(container, config) {
    container.innerHTML = '';
    const data = config.data || {};
    const settings = config.settings || {};

    if (typeof L === 'undefined') {
      container.innerHTML = '<div style="padding:1rem;color:#ff9100;font-size:0.82rem;"><i class="fa-solid fa-triangle-exclamation"></i> Leaflet not loaded</div>';
      return;
    }

    // Destroy existing map
    if (this._maps[config.id]) {
      try { this._maps[config.id].remove(); } catch(e) {}
      delete this._maps[config.id];
    }

    const el = document.createElement('div');
    el.id = `map_${config.id}`;
    el.style.cssText = 'width:100%;height:260px;border-radius:8px;z-index:1;';
    container.appendChild(el);

    const centerLat = settings.centerLat || 24.7136;
    const centerLng = settings.centerLng || 46.6753;
    const zoom = settings.zoom || 12;

    const map = L.map(el.id, { zoomControl: true }).setView([centerLat, centerLng], zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map);

    const markers = data.markers || [];
    markers.forEach(m => {
      const color = m.color || '#00f2fe';
      const svgIcon = L.divIcon({
        html: `<svg width="22" height="30" viewBox="0 0 22 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <ellipse cx="11" cy="28" rx="5" ry="2" fill="rgba(0,0,0,0.3)"/>
                 <path d="M11 0C4.925 0 0 4.925 0 11C0 19.25 11 30 11 30C11 30 22 19.25 22 11C22 4.925 17.075 0 11 0Z" fill="${color}"/>
                 <circle cx="11" cy="11" r="5" fill="white" opacity="0.9"/>
               </svg>`,
        className: '', iconSize: [22, 30], iconAnchor: [11, 30], popupAnchor: [0, -30]
      });

      const marker = L.marker([m.lat, m.lng], { icon: svgIcon }).addTo(map);
      marker.bindPopup(`
        <div style="font-family:inherit;font-size:0.8rem;line-height:1.5;">
          <strong style="color:#00f2fe;">${m.name}</strong><br>
          <span style="color:#888;">Type:</span> ${m.type}<br>
          <span style="color:#888;">Status:</span> ${m.status}
        </div>`
      );
    });

    this._maps[config.id] = map;
    // Force resize after render
    setTimeout(() => map.invalidateSize(), 200);
  },

  getStudioConfig(config) {
    return {
      settingsFields: [
        { key: 'title', label: 'Title', type: 'text', value: config.title },
        { key: 'settings.centerLat', label: 'Center Latitude', type: 'text', value: config.settings?.centerLat || 24.7136 },
        { key: 'settings.centerLng', label: 'Center Longitude', type: 'text', value: config.settings?.centerLng || 46.6753 },
        { key: 'settings.zoom', label: 'Zoom Level', type: 'text', value: config.settings?.zoom || 12 },
        { key: 'columnSpan', label: 'Column Span', type: 'select',
          options: ['full','half','two-thirds','third'], value: config.columnSpan }
      ],
      dataType: 'markers',
      dataDescription: 'One row per map marker (name, lat, lng, type, status, color)',
      getTableHeaders() { return ['Name','Latitude','Longitude','Type','Status','Color']; },
      getTableRows() {
        return (config.data?.markers || []).map(m => [m.name, m.lat, m.lng, m.type, m.status, m.color||'#00f2fe']);
      },
      parseTableData(rows) {
        return {
          markers: rows.filter(r => r[0]).map(r => ({
            name: r[0], lat: parseFloat(r[1])||0, lng: parseFloat(r[2])||0,
            type: r[3]||'Location', status: r[4]||'Active', color: r[5]||'#00f2fe'
          }))
        };
      }
    };
  }
};
