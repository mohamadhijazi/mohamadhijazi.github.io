/**
 * Impact360 Command Center - Event Engine
 * Evaluates external event impacts, project delays, and smart schedule recommendations.
 */

const EventEngine = (function () {

  /**
   * Finds all projects affected by a given event
   * @param {Object} event 
   * @param {Array} projects 
   * @returns {Array}
   */
  function getAffectedProjects(event, projects = []) {
    if (!event || !projects) return [];
    return projects.filter(p => p.relatedEvents && p.relatedEvents.includes(event.id));
  }

  /**
   * Calculates predicted delay in days caused by an external event
   * @param {Object} event 
   * @returns {number} Delay in days
   */
  function calculateDelay(event) {
    if (!event || event.status !== 'Active') return 0;
    
    // Base delay = Severity (1-5) * 3 days
    let baseDelay = event.severity * 3;
    
    // Category multiplier
    if (event.category === 'Weather' || event.category === 'Cyber') {
      baseDelay += 4;
    } else if (event.category === 'Transportation' || event.category === 'OPEC') {
      baseDelay += 3;
    }

    return Math.round(baseDelay * event.probability);
  }

  /**
   * Assesses overall impact of an event on a project
   * @param {Object} event 
   * @param {Object} project 
   * @returns {Object} { delayDays, riskIncrease, severityRating }
   */
  function assessImpact(event, project) {
    const delayDays = calculateDelay(event);
    const riskIncrease = Math.round(event.severity * event.probability * 5);
    
    return {
      eventId: event.id,
      eventTitle: event.title,
      delayDays: delayDays,
      riskIncrease: riskIncrease,
      severityRating: event.severity >= 4 ? 'Critical Impact' : 'Moderate Impact'
    };
  }

  /**
   * Smart Schedule Recommendation: Recommends new project completion date
   * @param {Object} project 
   * @param {Array} events 
   * @returns {Object} { currentEndDate, totalPredictedDelayDays, recommendedEndDate }
   */
  function recommendNewDate(project, events = []) {
    let totalDelayDays = 0;

    if (project.relatedEvents && project.relatedEvents.length > 0) {
      project.relatedEvents.forEach(eventId => {
        const ev = events.find(e => e.id === eventId);
        if (ev) {
          totalDelayDays += calculateDelay(ev);
        }
      });
    }

    // Default delay buffer if project risk is high
    if (totalDelayDays === 0 && project.internalRisk > 30) {
      totalDelayDays = 7;
    }

    const currentDate = new Date(project.plannedEndDate);
    const recommendedDate = new Date(currentDate);
    recommendedDate.setDate(recommendedDate.getDate() + totalDelayDays);

    const formatDate = (dateObj) => {
      const day = String(dateObj.getDate()).padStart(2, '0');
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = monthNames[dateObj.getMonth()];
      const year = dateObj.getFullYear();
      return `${day}-${month}-${year}`;
    };

    return {
      currentEndDate: formatDate(currentDate),
      totalPredictedDelayDays: totalDelayDays,
      recommendedEndDate: formatDate(recommendedDate),
      rawRecommendedDate: recommendedDate.toISOString().split('T')[0]
    };
  }

  return {
    getAffectedProjects: getAffectedProjects,
    calculateDelay: calculateDelay,
    assessImpact: assessImpact,
    recommendNewDate: recommendNewDate
  };
})();
