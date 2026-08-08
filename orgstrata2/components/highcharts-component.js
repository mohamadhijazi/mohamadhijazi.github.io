/* ==========================================================================
   HIGHCHARTS COMPONENT MODULE
   Supports: line, bar, column, area, pie chart types
   Universal Component Studio integration (settings + data editor)
   ========================================================================== */

window.HighchartsComponent = {
  type: 'highcharts',

  render(container, config) {
    container.innerHTML = '';
    const el = document.createElement('div');
    el.id = `hc_${config.id}`;
    el.style.cssText = 'width:100%;height:260px;';
    container.appendChild(el);

    const data    = config.data || {};
    const settings = config.settings || {};
    const chartType = settings.chartType || 'line';
    const categories = data.categories || [];
    const series    = data.series || [{ name: 'Series 1', data: [] }];

    if (typeof Highcharts === 'undefined') {
      container.innerHTML = '<div style="padding:1rem;color:#ff9100;font-size:0.82rem;"><i class="fa-solid fa-triangle-exclamation"></i> Highcharts not loaded</div>';
      return;
    }

    let hcSeries;
    if (chartType === 'pie') {
      const pieData = (series[0]?.data || []).map((val, i) => ({
        name: categories[i] || `Item ${i+1}`,
        y: Number(val) || 0
      }));
      hcSeries = [{ type: 'pie', name: series[0]?.name || 'Data', data: pieData }];
    } else {
      hcSeries = series.map(s => ({
        type: chartType,
        name: s.name || 'Series',
        data: (s.data || []).map(Number)
      }));
    }

    const isLight = (document.documentElement.getAttribute('data-theme') || 'dark') === 'light';
    const axisLabelColor = isLight ? '#5a5a6e' : '#94a3b8';
    const axisLineColor  = isLight ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.1)';
    const gridLineColor  = isLight ? 'rgba(212,175,55,0.08)' : 'rgba(255,255,255,0.06)';
    const legendItemHover = isLight ? '#1a1a2e' : '#f0f4f8';
    const tooltipBg      = isLight ? 'rgba(255,255,255,0.98)' : 'rgba(13,19,32,0.95)';
    const tooltipBorder  = isLight ? 'rgba(212,175,55,0.4)' : 'rgba(212,175,55,0.5)';
    const tooltipText    = isLight ? '#1a1a2e' : '#f0f4f8';
    const goldPalette = ['#d4af37','#b8860b','#f4d03f','#8b6914','#daa520','#cd853f','#ffd700','#a67c00'];

    Highcharts.chart(el.id, {
      chart: { backgroundColor: 'transparent', animation: { duration: 600 } },
      title: { text: null },
      xAxis: { categories, lineColor: axisLineColor, tickColor: axisLineColor, labels: { style: { color: axisLabelColor, fontSize: '0.72rem' } } },
      yAxis: { gridLineColor: gridLineColor, title: { text: null }, labels: { style: { color: axisLabelColor, fontSize: '0.72rem' } } },
      legend: { itemStyle: { color: axisLabelColor, fontSize: '0.72rem' }, itemHoverStyle: { color: legendItemHover } },
      tooltip: { backgroundColor: tooltipBg, borderColor: tooltipBorder, style: { color: tooltipText } },
      plotOptions: { series: { borderWidth: 0 }, area: { fillOpacity: 0.18 } },
      colors: goldPalette,
      credits: { enabled: false },
      series: hcSeries
    });
  },

  getStudioConfig(config) {
    return {
      settingsFields: [
        { key: 'settings.chartType', label: 'Chart Type', type: 'select',
          options: ['line','bar','column','area','pie','spline'], value: config.settings?.chartType || 'line' },
        { key: 'title', label: 'Title', type: 'text', value: config.title },
        { key: 'subtitle', label: 'Subtitle', type: 'text', value: config.subtitle || '' },
        { key: 'columnSpan', label: 'Column Span', type: 'select',
          options: ['full','half','two-thirds','third'], value: config.columnSpan }
      ],
      dataType: 'series',
      dataDescription: 'Categories row + one row per data series',
      getTableHeaders() { return ['Category', ...((config.data?.series || []).map(s => s.name || 'Series'))]; },
      getTableRows() {
        const cats = config.data?.categories || [];
        const series = config.data?.series || [];
        return cats.map((cat, i) => [cat, ...series.map(s => s.data[i] ?? '')]);
      },
      parseTableData(rows, headers) {
        const seriesNames = headers.slice(1);
        return {
          categories: rows.map(r => String(r[0] || '')),
          series: seriesNames.map((name, si) => ({
            name,
            data: rows.map(r => Number(r[si + 1]) || 0)
          }))
        };
      }
    };
  }
};
