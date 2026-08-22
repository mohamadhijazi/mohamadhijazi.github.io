/**
 * Impact360 Command Center - Risk Engine
 * Computes Risk Scores according to formula:
 * Risk Score = Internal Risk + External Risk + Dependency Risk (Max 100)
 */

const RiskEngine = (function () {

  /**
   * Calculates total project risk score based on internal factors,
   * linked external events severity, and dependency risk.
   * @param {Object} project 
   * @param {Array} allEvents 
   * @returns {Object} { totalRisk, internalRisk, externalRisk, dependencyRisk }
   */
  function calculateProjectRisk(project, allEvents = []) {
    const internalRisk = project.internalRisk || 20;

    // External risk derived from linked events
    let externalRisk = 0;
    if (project.relatedEvents && project.relatedEvents.length > 0) {
      project.relatedEvents.forEach(eventId => {
        const ev = allEvents.find(e => e.id === eventId);
        if (ev && ev.status === 'Active') {
          // Severity (1-5) * Probability (0-1) * 8 multiplier
          const eventRiskContrib = ev.severity * ev.probability * 8;
          externalRisk += eventRiskContrib;
        }
      });
    }
    externalRisk = Math.round(externalRisk);

    // Dependency risk derived from budget pressure & progress lag
    let dependencyRisk = 0;
    if (project.progress < 40 && project.budgetUsdM > 25) {
      dependencyRisk += 15;
    } else if (project.progress < 60) {
      dependencyRisk += 10;
    } else {
      dependencyRisk += 5;
    }

    const totalRisk = Math.min(100, Math.round(internalRisk + externalRisk + dependencyRisk));

    return {
      totalRisk: totalRisk,
      internalRisk: internalRisk,
      externalRisk: externalRisk,
      dependencyRisk: dependencyRisk
    };
  }

  /**
   * Calculates aggregate Global Risk Index for the organization
   * @param {Array} projects 
   * @param {Array} events 
   * @returns {number}
   */
  function calculateGlobalRiskIndex(projects, events) {
    if (!projects || projects.length === 0) return 0;
    let sum = 0;
    projects.forEach(p => {
      const riskObj = calculateProjectRisk(p, events);
      sum += riskObj.totalRisk;
    });
    return Math.round(sum / projects.length);
  }

  return {
    calculateProjectRisk: calculateProjectRisk,
    calculateGlobalRiskIndex: calculateGlobalRiskIndex
  };
})();
