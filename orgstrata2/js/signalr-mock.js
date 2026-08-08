/* ==========================================================================
   DIGITAL TWIN WORKSPACE - SIGNALR REAL-TIME SIMULATION & INTELLIGENCE ENGINE
   Streams event payloads matching the 11 domain categorization matrix.
   ========================================================================== */

class SignalRMockEngine {
  constructor() {
    this.listeners = [];
    this.timer = null;
    this.isRunning = false;
    
    // Authoritative event pool
    this.eventPool = [
      {
        title: "Saudi Press Agency (SPA): LEAP 2026 Tech Summit Announced",
        description: "Saudi Ministry of Communications & IT announces $6.4B investment in AI cloud data centers.",
        tags: ["Technology", "AI Agents", "Nvidia", "Growth"],
        theme: "Technology",
        source: "Saudi Press Agency (SPA)"
      },
      {
        title: "Gartner Research: SAP S/4HANA Enterprise Migration Timeline Warning",
        description: "Gartner highlights critical licensing shifts for legacy SAP instances prior to Q4 2026.",
        tags: ["Applications", "SaaS", "Oracle", "SAP", "Risk"],
        theme: "Technology",
        source: "Gartner"
      },
      {
        title: "Reuters: Global Oil & Energy Benchmark Shift",
        description: "OPEC+ agrees on new supply quotas impacting global market pricing for household utility utilities.",
        tags: ["Economic", "Operations", "Strategy"],
        theme: "Economic",
        source: "Reuters"
      },
      {
        title: "CNN Tech: Critical Cyber Security Advisory (Zero-Day CS Alert)",
        description: "Cyber Security Threat Response Center issues patch bulletin for enterprise SaaS identity gateways.",
        tags: ["CS", "Threat", "Data", "Security"],
        theme: "Technology",
        source: "CNN"
      },
      {
        title: "Forrester Research: Modern Digital Twin Architecture Report",
        description: "Local-first PWA architectures shown to reduce enterprise UI latency by 85% compared to legacy stacks.",
        tags: ["UX", "Navigation", "Capability", "Workflow"],
        theme: "Science",
        source: "Forrester"
      }
    ];
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    // Emit initial event
    this.emitRandomEvent();
    
    // Stream event tick every 18 seconds
    this.timer = setInterval(() => {
      this.emitRandomEvent();
    }, 18000);
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
    this.isRunning = false;
  }

  subscribe(callback) {
    this.listeners.push(callback);
  }

  emitRandomEvent() {
    const rawEvent = this.eventPool[Math.floor(Math.random() * this.eventPool.length)];
    const activeWs = window.appState.getWorkspace();
    
    const fullPayload = {
      GUID: activeWs.userGUID || `guid_${Math.random().toString(36).substr(2, 9)}`,
      title: rawEvent.title,
      description: rawEvent.description,
      tags: rawEvent.tags,
      date_start: new Date().toISOString(),
      date_end: new Date(Date.now() + 3600000).toISOString(),
      theme: rawEvent.theme,
      source: rawEvent.source
    };

    // Notify subscribers
    this.listeners.forEach(cb => cb(fullPayload));

    // Update global ticker in DOM
    this.updateDomTicker(fullPayload);

    // Apply dynamic highlight effects across UI elements matching event tags
    this.triggerTagIntelligenceHighlights(fullPayload.tags);

    // Feed event tags into workspace components that have matching tag registrations
    if (window.appState && typeof window.appState.applySignalEventToWorkspace === 'function') {
      window.appState.applySignalEventToWorkspace(fullPayload);
    }
  }

  updateDomTicker(eventData) {
    const tickerText = document.getElementById("signalTickerText");
    if (tickerText) {
      tickerText.innerHTML = `<strong>[${eventData.source || 'SignalR'}]</strong> ${eventData.title} &bull; <span style="color: var(--accent-cyan);">${eventData.tags.join(", ")}</span>`;
    }
  }

  triggerTagIntelligenceHighlights(tags) {
    // Find all nodes in BPMN canvas or Hierarchy matching tags and add glowing highlight
    const bpmnNodes = document.querySelectorAll(".bpmn-node-item");
    bpmnNodes.forEach(node => {
      const nodeTag = node.getAttribute("data-tag");
      if (nodeTag && tags.includes(nodeTag)) {
        node.classList.add("event-highlight-glow");
        setTimeout(() => node.classList.remove("event-highlight-glow"), 6000);
      }
    });
  }
}

window.signalEngine = new SignalRMockEngine();
