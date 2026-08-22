/**
 * Impact360 Command Center - Ownership Engine
 * Computes Employee Context-Aware Ownership Scores:
 * Ownership Score = Achievement × Difficulty Factor
 */

const OwnershipEngine = (function () {

  /**
   * Calculates dynamic difficulty factor based on contextual obstacles
   * @param {Array} activeEvents 
   * @param {Object} employee 
   * @returns {number} Multiplier (e.g. 1.0 to 1.35)
   */
  function calculateDifficultyFactor(activeEvents = [], employee = {}) {
    let difficultyMultiplier = 1.0;

    // Evaluate active contextual obstacles
    activeEvents.forEach(ev => {
      if (ev.status === 'Active') {
        if (ev.category === 'Cyber') difficultyMultiplier += 0.08;
        if (ev.category === 'Weather') difficultyMultiplier += 0.06;
        if (ev.category === 'Transportation') difficultyMultiplier += 0.07; // Supply chain
        if (ev.category === 'Economic' || ev.category === 'OPEC') difficultyMultiplier += 0.05; // Budget pressure
      }
    });

    return parseFloat(Math.min(1.4, difficultyMultiplier).toFixed(2));
  }

  /**
   * Calculates context-aware ownership score for an employee
   * @param {Object} employee 
   * @param {Array} activeEvents 
   * @returns {Object} { ownershipScore, baseAchievement, difficultyFactor }
   */
  function calculateOwnershipScore(employee, activeEvents = []) {
    const baseAchievement = employee.collaborationScore * 0.4 + employee.citizenImpactScore * 0.6;
    const difficultyFactor = calculateDifficultyFactor(activeEvents, employee);
    
    const computedScore = Math.min(100, Math.round(baseAchievement * (difficultyFactor / 1.1)));

    return {
      ownershipScore: computedScore,
      baseAchievement: Math.round(baseAchievement),
      difficultyFactor: difficultyFactor
    };
  }

  return {
    calculateDifficultyFactor: calculateDifficultyFactor,
    calculateOwnershipScore: calculateOwnershipScore
  };
})();
