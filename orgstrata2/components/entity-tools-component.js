/* ==========================================================================
   ENTITY TOOLS COMPONENT MODULE
   Renders: Capabilities Radar (Highcharts), Risk Matrix, Likert Maturity
   Universal Component Studio: dimension/risk data editors
   ========================================================================== */

window.EntityToolsComponent = {

  render(container, config) {
    container.innerHTML = '';
    switch(config.type) {
      case 'capabilities': return this._renderCapabilities(container, config);
      case 'risk':         return this._renderRiskMatrix(container, config);
      case 'maturity':     return this._renderMaturity(container, config);
      default:             return this._renderCapabilities(container, config);
    }
  },

  // ─── CAPABILITIES RADAR CHART ─────────────────────────────────────────────
  _renderCapabilities(container, config) {
    const data = config.data || {};
    const dimensions = data.dimensions || [];

    if (typeof Highcharts === 'undefined') {
      container.innerHTML = '<div style="padding:1rem;color:#ff9100;font-size:0.82rem;">Highcharts not loaded</div>';
      return;
    }

    const el = document.createElement('div');
    el.id = `cap_${config.id}`;
    el.style.cssText = 'width:100%;height:260px;';
    container.appendChild(el);

    Highcharts.chart(el.id, {
      chart: { polar: true, type: 'area', backgroundColor: 'transparent', animation: { duration: 600 } },
      title: { text: null },
      pane: { startAngle: 0, endAngle: 360 },
      xAxis: {
        categories: dimensions.map(d => d.name),
        lineWidth: 0,
        tickmarkPlacement: 'on',
        labels: { style: { color: '#94a3b8', fontSize: '0.7rem' } }
      },
      yAxis: {
        min: 0, max: 5, gridLineInterpolation: 'polygon',
        gridLineColor: 'rgba(255,255,255,0.08)',
        labels: { style: { color: '#64748b', fontSize: '0.65rem' } }
      },
      tooltip: { backgroundColor: 'rgba(13,19,32,0.95)', borderColor: 'rgba(0,242,254,0.3)', style: { color: '#f0f4f8' } },
      legend: { enabled: false },
      credits: { enabled: false },
      series: [{
        name: 'Capability Score',
        data: dimensions.map(d => Number(d.score) || 0),
        color: '#00f2fe',
        fillOpacity: 0.15,
        pointPlacement: 'on'
      }]
    });
  },

  // ─── RISK SCORING MATRIX ──────────────────────────────────────────────────
  _renderRiskMatrix(container, config) {
    const data = config.data || {};
    const risks = data.risks || [];

    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'overflow:auto;height:260px;';

    const table = document.createElement('table');
    table.className = 'risk-matrix-table';
    table.innerHTML = `
      <thead>
        <tr>
          <th>Risk</th><th>Probability (1-5)</th><th>Impact (1-5)</th><th>Score</th><th>Owner</th><th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${risks.map(r => {
          const score = (r.probability || 1) * (r.impact || 1);
          const scoreClass = score >= 16 ? 'score-high' : score >= 8 ? 'score-medium' : 'score-low';
          const statusColor = r.status === 'Open' ? '#ff9100' : r.status === 'Closed' ? '#00e676' : '#94a3b8';
          return `
            <tr>
              <td style="font-weight:600;color:#f0f4f8;">${r.name}</td>
              <td style="text-align:center;">${r.probability}</td>
              <td style="text-align:center;">${r.impact}</td>
              <td><span class="risk-score-cell ${scoreClass}">${score}</span></td>
              <td style="color:#94a3b8;">${r.owner}</td>
              <td><span style="color:${statusColor};font-weight:600;">${r.status}</span></td>
            </tr>`;
        }).join('')}
      </tbody>`;

    wrapper.appendChild(table);

    if (risks.length === 0) {
      wrapper.innerHTML = '<div style="padding:1.5rem;color:#64748b;text-align:center;"><i class="fa-solid fa-triangle-exclamation" style="font-size:2rem;opacity:0.3;display:block;margin-bottom:0.5rem;"></i>No risks. Add via Component Studio.</div>';
    }

    container.appendChild(wrapper);
  },

  // ─── LIKERT MATURITY ASSISTANT ────────────────────────────────────────────
  _renderMaturity(container, config) {
    const data = config.data || {};
    const dimensions = data.dimensions || [];

    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'height:260px;overflow-y:auto;padding:0.25rem;';

    const labels = ['Initial (1)', 'Managed (2)', 'Defined (3)', 'Quantified (4)', 'Optimizing (5)'];

    const scale = document.createElement('div');
    scale.className = 'maturity-scale';

    dimensions.forEach(dim => {
      const score = Number(dim.score) || 1;
      const pct   = ((score - 1) / 4) * 100;
      const label = labels[Math.round(score) - 1] || labels[0];

      const row = document.createElement('div');
      row.className = 'maturity-row';
      row.innerHTML = `
        <div class="maturity-row-header">
          <span class="maturity-row-name">${dim.name}</span>
          <span class="maturity-score-badge">${label}</span>
        </div>
        <div class="maturity-bar-track">
          <div class="maturity-bar-fill" style="width:${pct}%;"></div>
        </div>
        <div class="maturity-labels">
          <span>Initial</span><span>Managed</span><span>Defined</span><span>Quantified</span><span>Optimizing</span>
        </div>`;
      scale.appendChild(row);
    });

    wrapper.appendChild(scale);

    if (dimensions.length === 0) {
      wrapper.innerHTML = '<div style="padding:1.5rem;color:#64748b;text-align:center;"><i class="fa-solid fa-chart-simple" style="font-size:2rem;opacity:0.3;display:block;margin-bottom:0.5rem;"></i>No dimensions. Add via Component Studio.</div>';
    }

    container.appendChild(wrapper);
  },

  getStudioConfig(config) {
    const type = config.type;

    if (type === 'risk') {
      return {
        settingsFields: [
          { key: 'title', label: 'Title', type: 'text', value: config.title },
          { key: 'columnSpan', label: 'Column Span', type: 'select', options: ['full','half','two-thirds','third'], value: config.columnSpan }
        ],
        dataType: 'risks',
        dataDescription: 'One row per risk (name, probability 1-5, impact 1-5, owner, status)',
        getTableHeaders() { return ['Risk Name','Probability','Impact','Owner','Status']; },
        getTableRows() { return (config.data?.risks || []).map(r => [r.name, r.probability, r.impact, r.owner, r.status]); },
        parseTableData(rows) {
          return {
            risks: rows.filter(r => r[0]).map(r => ({
              name: r[0], probability: parseInt(r[1])||1, impact: parseInt(r[2])||1,
              owner: r[3]||'Unassigned', status: r[4]||'Open'
            }))
          };
        }
      };
    }

    // capabilities or maturity
    return {
      settingsFields: [
        { key: 'title', label: 'Title', type: 'text', value: config.title },
        { key: 'columnSpan', label: 'Column Span', type: 'select', options: ['full','half','two-thirds','third'], value: config.columnSpan }
      ],
      dataType: 'dimensions',
      dataDescription: 'One row per dimension (name, score 1-5)',
      getTableHeaders() { return ['Dimension Name','Score (1-5)']; },
      getTableRows() { return (config.data?.dimensions || []).map(d => [d.name, d.score]); },
      parseTableData(rows) {
        return {
          dimensions: rows.filter(r => r[0]).map(r => ({
            name: r[0], score: parseFloat(r[1])||1
          }))
        };
      }
    };
  }
};
