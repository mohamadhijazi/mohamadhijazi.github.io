/**
 * maturityView.js - Highcharts.js Maturity Radar Visualization
 * v4.0: Maturity radar reporting for Financial, Health, and Skills/Capabilities
 * Based on metamodel with 5 maturity levels
 */

const MaturityView = {
    charts: {},
    currentTab: 'financial',

    /**
     * Render maturity view HTML
     */
    render() {
        return `
            <div class="maturity-header">
                <h2>📈 Maturity Radar</h2>
                <div class="maturity-controls">
                    <button class="btn-primary" onclick="MaturityView.calculateMaturity()">🔄 Recalculate</button>
                    <button class="btn-secondary" onclick="MaturityView.openScoreModal()">✏️ Edit Scores</button>
                    <button class="btn-secondary" onclick="MaturityView.exportMaturityReport()">📊 Export Report</button>
                </div>
            </div>

            <!-- Maturity Level Overview -->
            <div class="maturity-level-overview">
                <div class="maturity-level-card">
                    <div class="level-icon">💰</div>
                    <div class="level-label">Financial</div>
                    <div class="level-value" id="financialOverall">0</div>
                    <div class="level-badge" id="financialBadge">Level 1</div>
                </div>
                <div class="maturity-level-card">
                    <div class="level-icon">❤️</div>
                    <div class="level-label">Health</div>
                    <div class="level-value" id="healthOverall">0</div>
                    <div class="level-badge" id="healthBadge">Level 1</div>
                </div>
                <div class="maturity-level-card">
                    <div class="level-icon">🧠</div>
                    <div class="level-label">Skills</div>
                    <div class="level-value" id="skillsOverall">0</div>
                    <div class="level-badge" id="skillsBadge">Level 1</div>
                </div>
            </div>

            <!-- Radar Chart -->
            <div class="maturity-chart-container">
                <div class="maturity-tabs">
                    <button class="tab-btn active" onclick="MaturityView.switchTab('financial')">Financial Maturity</button>
                    <button class="tab-btn" onclick="MaturityView.switchTab('health')">Health Maturity</button>
                    <button class="tab-btn" onclick="MaturityView.switchTab('skills')">Skills Maturity</button>
                    <button class="tab-btn" onclick="MaturityView.switchTab('compare')">Comparison</button>
                </div>
                <div id="radarChart" style="min-height: 500px;"></div>
            </div>

            <!-- Dimension Scores -->
            <div class="maturity-dimensions">
                <h3>Dimension Scores</h3>
                <div id="dimensionScores">
                    <!-- Dynamic content -->
                </div>
            </div>

            <!-- Maturity History -->
            <div class="maturity-history">
                <h3>Maturity History</h3>
                <div id="maturityHistoryChart" style="min-height: 300px;"></div>
            </div>

            <!-- Improvement Recommendations -->
            <div class="maturity-recommendations">
                <h3>Improvement Recommendations</h3>
                <div id="recommendations">
                    <!-- Dynamic content -->
                </div>
            </div>
        `;
    },

    /**
     * Initialize maturity view
     */
    init() {
        this.calculateMaturity();
        this.switchTab('financial');
    },

    /**
     * Calculate maturity scores from workspace data
     */
    calculateMaturity() {
        const workspace = getWorkspaceData();
        const contacts = workspace?.contacts || [];
        const routines = workspace?.routines || [];

        // Calculate Financial Maturity
        const financial = this.calculateFinancialMaturity(contacts, routines);

        // Calculate Health Maturity
        const health = this.calculateHealthMaturity(contacts, routines);

        // Calculate Skills Maturity
        const skills = this.calculateSkillsMaturity(contacts, routines);

        // Save to workspace
        if (!workspace.maturityScores) {
            workspace.maturityScores = {};
        }

        workspace.maturityScores.financial = financial;
        workspace.maturityScores.health = health;
        workspace.maturityScores.skills = skills;

        saveWorkspaceData(workspace);

        // Update UI
        this.updateOverviewCards();
        this.renderRadarChart();
        this.renderHistoryChart();
        this.renderDimensionScores();
        this.renderRecommendations();
    },

    /**
     * Calculate Financial Maturity
     */
    calculateFinancialMaturity(contacts, routines) {
        let totalIncome = 0;
        let totalSavings = 0;
        let totalDebt = 0;
        let totalAssets = 0;
        let investmentAssets = 0;
        let expenseCategories = new Set();
        let hasInsurance = false;
        let hasRetirement = false;
        let cashFlowStability = 0;

        contacts.forEach(contact => {
            const cost = contact.cost || {};

            // Income
            (cost.income || []).forEach(income => {
                totalIncome += income.amount || 0;
            });

            // Savings
            (cost.assets || []).forEach(asset => {
                totalAssets += asset.value || 0;
                if (asset.type === 'investment') {
                    investmentAssets += asset.value || 0;
                }
                if (asset.type === 'cash') {
                    totalSavings += asset.value || 0;
                }
            });

            // Debt
            (cost.liabilities || []).forEach(liab => {
                totalDebt += liab.balance || 0;
            });

            // Expense diversity
            const categories = cost.categories || {};
            Object.keys(categories).forEach(key => {
                expenseCategories.add(key);
            });

            // Check for insurance/retirement indicators
            if (categories.health > 0) hasInsurance = true;
        });

        // Calculate dimension scores (0-100)
        const savingsRate = totalIncome > 0 ? Math.min((totalSavings / totalIncome) * 100, 100) : 50;
        const debtRatio = totalAssets > 0 ? Math.max(100 - (totalDebt / totalAssets) * 100, 0) : 50;
        const investmentDiversity = Math.min((investmentAssets / Math.max(totalAssets, 1)) * 100, 100);
        const budgetingDiscipline = routines.length > 0 ? Math.min(routines.filter(r => {
            const cost = r.cost || {};
            return cost.actual <= (cost.budget || Infinity);
        }).length / routines.length * 100, 100) : 50;
        const insuranceCoverage = hasInsurance ? 70 : 30;
        const retirementPlanning = hasRetirement ? 80 : 40;
         cashFlowStability = totalIncome > 0 ? Math.max(100 - (totalDebt / totalIncome) * 10, 0) : 50;

        const overall = Math.round(
            (budgetingDiscipline + savingsRate + investmentDiversity + debtRatio + 
             insuranceCoverage + retirementPlanning + cashFlowStability) / 7
        );

        return {
            budgetingDiscipline: Math.round(budgetingDiscipline),
            savingsRate: Math.round(savingsRate),
            investmentDiversification: Math.round(investmentDiversity),
            debtManagement: Math.round(debtRatio),
            insuranceCoverage: Math.round(insuranceCoverage),
            retirementPlanning: Math.round(retirementPlanning),
            cashFlowStability: Math.round(Math.max(cashFlowStability, 0)),
            overall: overall,
            level: this.getMaturityLevel(overall),
            history: []
        };
    },

    /**
     * Calculate Health Maturity
     */
    calculateHealthMaturity(contacts, routines) {
        // Default scores - can be enhanced with health tracking routines
        const baseScore = 50;
        
        // Check for health-related routines
        let healthRoutineCount = 0;
        routines.forEach(r => {
            const tags = (r.tags || []).join(' ').toLowerCase();
            if (tags.includes('health') || tags.includes('exercise') || tags.includes('gym') || tags.includes('workout')) {
                healthRoutineCount++;
            }
        });

        // Check for health-related contacts
        let healthContactCount = 0;
        contacts.forEach(c => {
            const tags = (c.tags || []).join(' ').toLowerCase();
            if (tags.includes('doctor') || tags.includes('health')) {
                healthContactCount++;
            }
        });

        const exerciseScore = Math.min(baseScore + healthRoutineCount * 10, 100);
        const physicalScore = Math.min(baseScore + healthRoutineCount * 5, 100);
        const mentalScore = Math.min(baseScore, 100);
        const nutritionScore = Math.min(baseScore, 100);
        const sleepScore = Math.min(baseScore, 100);
        const preventiveCareScore = Math.min(baseScore + healthContactCount * 15, 100);
        const workLifeBalanceScore = Math.min(baseScore, 100);

        const overall = Math.round(
            (physicalScore + mentalScore + nutritionScore + exerciseScore + 
             sleepScore + preventiveCareScore + workLifeBalanceScore) / 7
        );

        return {
            physicalScore: Math.round(physicalScore),
            mentalScore: Math.round(mentalScore),
            nutritionScore: Math.round(nutritionScore),
            exerciseScore: Math.round(exerciseScore),
            sleepScore: Math.round(sleepScore),
            preventiveCareScore: Math.round(preventiveCareScore),
            workLifeBalanceScore: Math.round(workLifeBalanceScore),
            overall: overall,
            level: this.getMaturityLevel(overall),
            history: []
        };
    },

    /**
     * Calculate Skills/Capabilities Maturity
     */
    calculateSkillsMaturity(contacts, routines) {
        const allSkillTags = new Set();
        const skillCategories = {
            technical: 0,
            leadership: 0,
            communication: 0,
            problemSolving: 0,
            teamwork: 0,
            innovation: 0,
            timeManagement: 0
        };

        contacts.forEach(contact => {
            (contact.skillTags || []).forEach(tag => {
                allSkillTags.add(tag.toLowerCase());
                const tagLower = tag.toLowerCase();
                if (tagLower.includes('tech') || tagLower.includes('code') || tagLower.includes('dev') || tagLower.includes('programming')) {
                    skillCategories.technical++;
                }
                if (tagLower.includes('lead') || tagLower.includes('manage') || tagLower.includes('direct')) {
                    skillCategories.leadership++;
                }
                if (tagLower.includes('communicat') || tagLower.includes('present') || tagLower.includes('write')) {
                    skillCategories.communication++;
                }
                if (tagLower.includes('problem') || tagLower.includes('analy') || tagLower.includes('debug')) {
                    skillCategories.problemSolving++;
                }
                if (tagLower.includes('team') || tagLower.includes('collaborat') || tagLower.includes('support')) {
                    skillCategories.teamwork++;
                }
                if (tagLower.includes('innovat') || tagLower.includes('creat') || tagLower.includes('design')) {
                    skillCategories.innovation++;
                }
                if (tagLower.includes('time') || tagLower.includes('organize') || tagLower.includes('plan')) {
                    skillCategories.timeManagement++;
                }
            });
        });

        const totalSkills = allSkillTags.size;
        const maxScore = 100;
        const baseScore = Math.min(totalSkills * 10, 60);

        const technicalSkills = Math.min(baseScore + skillCategories.technical * 10, maxScore);
        const leadership = Math.min(baseScore + skillCategories.leadership * 10, maxScore);
        const communication = Math.min(baseScore + skillCategories.communication * 10, maxScore);
        const problemSolving = Math.min(baseScore + skillCategories.problemSolving * 10, maxScore);
        const teamwork = Math.min(baseScore + skillCategories.teamwork * 10, maxScore);
        const innovation = Math.min(baseScore + skillCategories.innovation * 10, maxScore);
        const timeManagement = Math.min(baseScore + skillCategories.timeManagement * 10, maxScore);

        const overall = Math.round(
            (technicalSkills + leadership + communication + problemSolving + 
             teamwork + innovation + timeManagement) / 7
        );

        return {
            technicalSkills: Math.round(technicalSkills),
            leadership: Math.round(leadership),
            communication: Math.round(communication),
            problemSolving: Math.round(problemSolving),
            teamwork: Math.round(teamwork),
            innovation: Math.round(innovation),
            timeManagement: Math.round(timeManagement),
            overall: overall,
            level: this.getMaturityLevel(overall),
            history: []
        };
    },

    /**
     * Get maturity level from score
     */
    getMaturityLevel(score) {
        if (score >= 90) return { level: 5, name: 'Optimizing', description: 'Continuous improvement culture with optimized processes' };
        if (score >= 70) return { level: 4, name: 'Quantitatively Managed', description: 'Measured and controlled with quantitative understanding' };
        if (score >= 50) return { level: 3, name: 'Defined', description: 'Proactive and well-defined processes organizational level' };
        if (score >= 30) return { level: 2, name: 'Managed', description: 'Reactive with basic project-level management' };
        return { level: 1, name: 'Initial', description: 'Ad-hoc and chaotic processes' };
    },

    /**
     * Update overview cards
     */
    updateOverviewCards() {
        const workspace = getWorkspaceData();
        const scores = workspace?.maturityScores || {};

        // Financial
        const fin = scores.financial || {};
        document.getElementById('financialOverall').textContent = fin.overall || 0;
        const finBadge = this.getMaturityLevel(fin.overall || 0);
        document.getElementById('financialBadge').textContent = `Level ${finBadge.level}: ${finBadge.name}`;

        // Health
        const hel = scores.health || {};
        document.getElementById('healthOverall').textContent = hel.overall || 0;
        const helBadge = this.getMaturityLevel(hel.overall || 0);
        document.getElementById('healthBadge').textContent = `Level ${helBadge.level}: ${helBadge.name}`;

        // Skills
        const sks = scores.skills || {};
        document.getElementById('skillsOverall').textContent = sks.overall || 0;
        const sksBadge = this.getMaturityLevel(sks.overall || 0);
        document.getElementById('skillsBadge').textContent = `Level ${sksBadge.level}: ${sksBadge.name}`;
    },

    /**
     * Switch maturity tab
     */
    switchTab(tab, clickEvent = null) {
        this.currentTab = tab;

        // Update tab buttons
        document.querySelectorAll('.maturity-tabs .tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Try to activate the clicked button, or find by onclick attribute
        if (clickEvent && clickEvent.target) {
            clickEvent.target.classList.add('active');
        } else {
            // Find button by onclick attribute
            const buttons = document.querySelectorAll('.maturity-tabs .tab-btn');
            buttons.forEach(btn => {
                if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(`'${tab}'`)) {
                    btn.classList.add('active');
                }
            });
        }

        this.renderRadarChart();
    },

    /**
     * Render radar chart with gap visualization (v5.0 enhancement)
     * Shows current vs target scores as dual-series radar overlay
     */
    renderRadarChart() {
        const container = document.getElementById('radarChart');
        if (!container) return;

        const workspace = getWorkspaceData();
        const scores = workspace?.maturityScores || {};

        let chart;
        const chartId = 'radarChart';

        // Destroy existing chart
        Highcharts.charts.forEach(c => {
            if (c.renderTo === chartId) c.destroy();
        });
        Highcharts.charts = Highcharts.charts.filter(c => c.renderTo !== chartId);

        let series = [];
        let targetSeries = [];
        let title = '';
        let categories = [];

        // Target scores for gap visualization
        const targetScores = {
            financial: { budgetingDiscipline: 80, savingsRate: 70, investmentDiversification: 60, debtManagement: 75, insuranceCoverage: 70, retirementPlanning: 65, cashFlowStability: 80 },
            health: { physicalScore: 75, mentalScore: 70, nutritionScore: 80, exerciseScore: 70, sleepScore: 80, preventiveCareScore: 75, workLifeBalanceScore: 70 },
            skills: { technicalSkills: 75, leadership: 65, communication: 70, problemSolving: 75, teamwork: 70, innovation: 65, timeManagement: 70 }
        };

        if (this.currentTab === 'financial') {
            const fin = scores.financial || {};
            const tgt = targetScores.financial;
            title = 'Financial Maturity Radar';
            categories = ['Budgeting', 'Savings', 'Investment', 'Debt Mgmt', 'Insurance', 'Retirement', 'Cash Flow'];
            series = [{
                name: 'Current Score',
                data: [
                    fin.budgetingDiscipline || 0,
                    fin.savingsRate || 0,
                    fin.investmentDiversification || 0,
                    fin.debtManagement || 0,
                    fin.insuranceCoverage || 0,
                    fin.retirementPlanning || 0,
                    fin.cashFlowStability || 0
                ],
                color: '#4CAF50',
                pointPlacement: 'on'
            }];
            targetSeries = [{
                name: 'Target Score',
                data: [
                    tgt.budgetingDiscipline,
                    tgt.savingsRate,
                    tgt.investmentDiversification,
                    tgt.debtManagement,
                    tgt.insuranceCoverage,
                    tgt.retirementPlanning,
                    tgt.cashFlowStability
                ],
                color: 'rgba(244, 67, 54, 0.6)',
                dashStyle: 'ShortDash',
                type: 'line',
                marker: { enabled: false },
                pointPlacement: 'on'
            }];
        } else if (this.currentTab === 'health') {
            const hel = scores.health || {};
            const tgt = targetScores.health;
            title = 'Health Maturity Radar';
            categories = ['Physical', 'Mental', 'Nutrition', 'Exercise', 'Sleep', 'Preventive', 'Work-Life'];
            series = [{
                name: 'Current Score',
                data: [
                    hel.physicalScore || 0,
                    hel.mentalScore || 0,
                    hel.nutritionScore || 0,
                    hel.exerciseScore || 0,
                    hel.sleepScore || 0,
                    hel.preventiveCareScore || 0,
                    hel.workLifeBalanceScore || 0
                ],
                color: '#F44336',
                pointPlacement: 'on'
            }];
            targetSeries = [{
                name: 'Target Score',
                data: [
                    tgt.physicalScore,
                    tgt.mentalScore,
                    tgt.nutritionScore,
                    tgt.exerciseScore,
                    tgt.sleepScore,
                    tgt.preventiveCareScore,
                    tgt.workLifeBalanceScore
                ],
                color: 'rgba(244, 67, 54, 0.6)',
                dashStyle: 'ShortDash',
                type: 'line',
                marker: { enabled: false },
                pointPlacement: 'on'
            }];
        } else if (this.currentTab === 'skills') {
            const sks = scores.skills || {};
            const tgt = targetScores.skills;
            title = 'Skills/Capabilities Maturity Radar';
            categories = ['Technical', 'Leadership', 'Communication', 'Problem Solving', 'Teamwork', 'Innovation', 'Time Mgmt'];
            series = [{
                name: 'Current Score',
                data: [
                    sks.technicalSkills || 0,
                    sks.leadership || 0,
                    sks.communication || 0,
                    sks.problemSolving || 0,
                    sks.teamwork || 0,
                    sks.innovation || 0,
                    sks.timeManagement || 0
                ],
                color: '#2196F3',
                pointPlacement: 'on'
            }];
            targetSeries = [{
                name: 'Target Score',
                data: [
                    tgt.technicalSkills,
                    tgt.leadership,
                    tgt.communication,
                    tgt.problemSolving,
                    tgt.teamwork,
                    tgt.innovation,
                    tgt.timeManagement
                ],
                color: 'rgba(33, 150, 243, 0.6)',
                dashStyle: 'ShortDash',
                type: 'line',
                marker: { enabled: false },
                pointPlacement: 'on'
            }];
        } else if (this.currentTab === 'compare') {
            title = 'Maturity Comparison';
            categories = ['Budget/Physical', 'Savings/Mental', 'Debt/Nutrition', 'Invest/Exercise', 'Insurance/Sleep', 'Overall', 'Cash Flow/Work-Life'];
            const fin = scores.financial || {};
            const hel = scores.health || {};
            const sks = scores.skills || {};

            series = [
                {
                    name: 'Financial',
                    data: [fin.budgetingDiscipline || 0, fin.savingsRate || 0, fin.debtManagement || 0, fin.investmentDiversification || 0, fin.insuranceCoverage || 0, fin.overall || 0, fin.cashFlowStability || 0],
                    color: '#4CAF50',
                    pointPlacement: 'on'
                },
                {
                    name: 'Health',
                    data: [hel.physicalScore || 0, hel.mentalScore || 0, hel.exerciseScore || 0, hel.nutritionScore || 0, hel.preventiveCareScore || 0, hel.overall || 0, hel.workLifeBalanceScore || 0],
                    color: '#F44336',
                    pointPlacement: 'on'
                },
                {
                    name: 'Skills',
                    data: [sks.technicalSkills || 0, sks.leadership || 0, sks.communication || 0, sks.problemSolving || 0, sks.teamwork || 0, sks.overall || 0, sks.timeManagement || 0],
                    color: '#2196F3',
                    pointPlacement: 'on'
                }
            ];
        }

        // Build chart config
        const chartConfig = {
            chart: {
                type: 'line',
                polar: true,
                backgroundColor: 'transparent',
                style: { fontFamily: 'Segoe UI, Arial, sans-serif' }
            },
            title: {
                text: title,
                style: { fontSize: '16px', fontWeight: 'bold' }
            },
            subtitle: {
                text: this.currentTab !== 'compare' 
                    ? 'Gap Visualization: Current vs Target (dashed line) — Prefrontal Friction View' 
                    : 'Maturity scores by dimension (0-100)',
                style: { color: this.currentTab !== 'compare' ? '#FF9800' : '#999', fontSize: '12px' }
            },
            xAxis: {
                categories: categories,
                tickmarkPlacement: 'on',
                lineWidth: 1,
                labels: { style: { fontSize: '11px' } }
            },
            yAxis: {
                min: 0,
                max: 100,
                tickInterval: 20,
                labels: {
                    formatter: function () { return this.value; },
                    style: { fontSize: '11px' }
                },
                title: { text: 'Score' },
                gridLineInterpolation: 'polygon'
            },
            legend: { enabled: true, align: 'center', verticalAlign: 'top' },
            pane: { size: '80%' },
            series: series.concat(targetSeries),
            plotOptions: {
                series: {
                    pointPlacement: 'on',
                    fillOpacity: this.currentTab === 'compare' ? 0.15 : 0.2,
                    marker: { enabled: true, radius: 5 }
                }
            },
            credits: { enabled: false },
            exporting: { enabled: true }
        };

        chart = Highcharts.chart(chartId, chartConfig);
    },

    /**
     * Get categories for current tab
     */
    getCategoriesForTab(tab) {
        switch (tab) {
            case 'financial':
                return ['Budgeting', 'Savings', 'Investment', 'Debt Mgmt', 'Insurance', 'Retirement', 'Cash Flow'];
            case 'health':
                return ['Physical', 'Mental', 'Nutrition', 'Exercise', 'Sleep', 'Preventive', 'Work-Life'];
            case 'skills':
                return ['Technical', 'Leadership', 'Communication', 'Problem Solving', 'Teamwork', 'Innovation', 'Time Mgmt'];
            case 'compare':
                return ['Budget/Physical', 'Savings/Mental', 'Debt/Nutrition', 'Invest/Exercise', 'Insurance/Sleep', 'Overall', 'Cash Flow/Work-Life'];
            default:
                return ['Dimension 1', 'Dimension 2', 'Dimension 3', 'Dimension 4', 'Dimension 5', 'Dimension 6', 'Dimension 7'];
        }
    },

    /**
     * Render dimension scores table
     */
    renderDimensionScores() {
        const container = document.getElementById('dimensionScores');
        if (!container) return;

        const workspace = getWorkspaceData();
        const scores = workspace?.maturityScores || {};
        const tab = this.currentTab;

        let data = {};

        if (tab === 'financial') {
            data = scores.financial || {};
        } else if (tab === 'health') {
            data = scores.health || {};
        } else if (tab === 'skills') {
            data = scores.skills || {};
        }

        const labels = this.getDimensionLabels(tab);

        let html = '<div class="dimension-grid">';
        
        Object.keys(data).forEach(key => {
            if (key === 'overall' || key === 'level' || key === 'history') return;
            const score = data[key];
            const label = labels[key] || key.replace(/([A-Z])/g, ' $1').trim();
            const level = this.getMaturityLevel(score);
            const percentage = score;
            const color = score >= 70 ? '#4CAF50' : score >= 50 ? '#FF9800' : '#F44336';

            html += `
                <div class="dimension-card">
                    <div class="dimension-label">${label}</div>
                    <div class="dimension-score" style="color: ${color};">${score}/100</div>
                    <div class="dimension-bar">
                        <div class="dimension-bar-fill" style="width: ${percentage}%; background: ${color};"></div>
                    </div>
                    <div class="dimension-level">Level ${level.level}: ${level.name}</div>
                </div>
            `;
        });

        html += '</div>';
        container.innerHTML = html;
    },

    /**
     * Get dimension labels
     */
    getDimensionLabels(tab) {
        const labels = {
            financial: {
                budgetingDiscipline: 'Budgeting Discipline',
                savingsRate: 'Savings Rate',
                investmentDiversification: 'Investment Diversification',
                debtManagement: 'Debt Management',
                insuranceCoverage: 'Insurance Coverage',
                retirementPlanning: 'Retirement Planning',
                cashFlowStability: 'Cash Flow Stability'
            },
            health: {
                physicalScore: 'Physical Health',
                mentalScore: 'Mental Health',
                nutritionScore: 'Nutrition Management',
                exerciseScore: 'Exercise Routine',
                sleepScore: 'Sleep Quality',
                preventiveCareScore: 'Preventive Care',
                workLifeBalanceScore: 'Work-Life Balance'
            },
            skills: {
                technicalSkills: 'Technical Skills',
                leadership: 'Leadership',
                communication: 'Communication',
                problemSolving: 'Problem Solving',
                teamwork: 'Teamwork',
                innovation: 'Innovation',
                timeManagement: 'Time Management'
            }
        };
        return labels[tab] || {};
    },

    /**
     * Render maturity history chart
     */
    renderHistoryChart() {
        const container = document.getElementById('maturityHistoryChart');
        if (!container) return;

        const chartId = 'maturityHistoryChart';
        Highcharts.charts.forEach(c => {
            if (c.renderTo === chartId) c.destroy();
        });
        Highcharts.charts = Highcharts.charts.filter(c => c.renderTo !== chartId);

        Highcharts.chart(chartId, {
            chart: {
                type: 'line',
                backgroundColor: 'transparent'
            },
            title: {
                text: 'Overall Maturity Trend',
                style: { fontSize: '14px', fontWeight: 'bold' }
            },
            xAxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                title: {
                    text: 'Month'
                }
            },
            yAxis: {
                min: 0,
                max: 100,
                title: {
                    text: 'Maturity Score'
                }
            },
            series: [
                {
                    name: 'Financial',
                    data: [45, 52, 58, 65, 70, 72],
                    color: '#4CAF50'
                },
                {
                    name: 'Health',
                    data: [50, 55, 53, 60, 62, 65],
                    color: '#F44336'
                },
                {
                    name: 'Skills',
                    data: [60, 62, 68, 72, 75, 78],
                    color: '#2196F3'
                }
            ],
            plotOptions: {
                line: {
                    marker: {
                        enabled: true
                    }
                }
            },
            credits: {
                enabled: false
            }
        });
    },

    /**
     * Render improvement recommendations
     */
    renderRecommendations() {
        const container = document.getElementById('recommendations');
        if (!container) return;

        const workspace = getWorkspaceData();
        const scores = workspace?.maturityScores || {};
        const tab = this.currentTab;

        let data = {};
        let category = '';

        if (tab === 'financial') {
            data = scores.financial || {};
            category = 'Financial';
        } else if (tab === 'health') {
            data = scores.health || {};
            category = 'Health';
        } else if (tab === 'skills') {
            data = scores.skills || {};
            category = 'Skills';
        }

        let recommendations = [];

        // Generate recommendations based on lowest scores
        const dimensionScores = [];
        Object.keys(data).forEach(key => {
            if (key !== 'overall' && key !== 'level' && key !== 'history') {
                dimensionScores.push({ key, score: data[key] });
            }
        });

        dimensionScores.sort((a, b) => a.score - b.score);

        const weakest = dimensionScores.slice(0, 3);

        const recommendationTexts = {
            financial: {
                budgetingDiscipline: 'Create a detailed monthly budget and track all expenses. Use budgeting tools to monitor spending patterns.',
                savingsRate: 'Aim to save at least 20% of your income. Set up automatic transfers to savings accounts.',
                investmentDiversification: 'Diversify investments across different asset classes (stocks, bonds, real estate). Consider index funds for broad exposure.',
                debtManagement: 'Prioritize paying high-interest debt first. Consider debt consolidation for lower rates.',
                insuranceCoverage: 'Review insurance coverage regularly. Ensure adequate health, life, and property insurance.',
                retirementPlanning: 'Maximize retirement account contributions. Consider 401(k), IRA, or equivalent options.',
                cashFlowStability: 'Build emergency fund covering 6 months of expenses. Diversify income sources.'
            },
            health: {
                physicalScore: 'Establish regular health check-ups. Maintain a balanced exercise routine.',
                mentalScore: 'Practice stress management techniques. Consider meditation or mindfulness exercises.',
                nutritionScore: 'Follow a balanced diet rich in fruits, vegetables, and whole grains. Stay hydrated.',
                exerciseScore: 'Aim for 150 minutes of moderate exercise per week. Include both cardio and strength training.',
                sleepScore: 'Maintain consistent sleep schedule. Aim for 7-9 hours of quality sleep per night.',
                preventiveCareScore: 'Schedule regular preventive screenings. Stay up-to-date with vaccinations.',
                workLifeBalanceScore: 'Set clear boundaries between work and personal time. Take regular breaks.'
            },
            skills: {
                technicalSkills: 'Invest in continuous learning through online courses, certifications, and hands-on projects.',
                leadership: 'Seek leadership opportunities in projects. Mentor junior team members.',
                communication: 'Practice public speaking and presentation skills. Read books on effective communication.',
                problemSolving: 'Engage in problem-solving exercises and case studies. Learn systematic approaches to analysis.',
                teamwork: 'Participate in team-building activities. Practice active listening and collaboration.',
                innovation: 'Dedicate time for creative thinking and experimentation. Stay updated with industry trends.',
                timeManagement: 'Use time management techniques like Pomodoro or time blocking. Prioritize tasks effectively.'
            }
        };

        let html = '<div class="recommendations-list">';

        weakest.forEach(item => {
            const label = this.getDimensionLabels(tab)[item.key] || item.key;
            const text = (recommendationTexts[tab] || {})[item.key] || `Improve your ${label.toLowerCase()} through practice and learning.`;

            html += `
                <div class="recommendation-card">
                    <div class="recommendation-priority">Priority: ${item.score < 40 ? 'High' : item.score < 60 ? 'Medium' : 'Low'}</div>
                    <div class="recommendation-title">${label} (${item.score}/100)</div>
                    <div class="recommendation-text">${text}</div>
                </div>
            `;
        });

        html += '</div>';
        container.innerHTML = html;
    },

    /**
     * Open score edit modal
     */
    openScoreModal() {
        const workspace = getWorkspaceData();
        const scores = workspace?.maturityScores || {};

        const html = `
            <div class="maturity-edit-form">
                <h3>Financial Maturity Scores</h3>
                <div class="score-inputs">
                    ${this.createScoreInput('fin_budgeting', 'Budgeting Discipline', scores.financial?.budgetingDiscipline || 0)}
                    ${this.createScoreInput('fin_savings', 'Savings Rate', scores.financial?.savingsRate || 0)}
                    ${this.createScoreInput('fin_investment', 'Investment Diversification', scores.financial?.investmentDiversification || 0)}
                    ${this.createScoreInput('fin_debt', 'Debt Management', scores.financial?.debtManagement || 0)}
                    ${this.createScoreInput('fin_insurance', 'Insurance Coverage', scores.financial?.insuranceCoverage || 0)}
                    ${this.createScoreInput('fin_retirement', 'Retirement Planning', scores.financial?.retirementPlanning || 0)}
                    ${this.createScoreInput('fin_cashflow', 'Cash Flow Stability', scores.financial?.cashFlowStability || 0)}
                </div>

                <h3>Health Maturity Scores</h3>
                <div class="score-inputs">
                    ${this.createScoreInput('health_physical', 'Physical Health', scores.health?.physicalScore || 0)}
                    ${this.createScoreInput('health_mental', 'Mental Health', scores.health?.mentalScore || 0)}
                    ${this.createScoreInput('health_nutrition', 'Nutrition Management', scores.health?.nutritionScore || 0)}
                    ${this.createScoreInput('health_exercise', 'Exercise Routine', scores.health?.exerciseScore || 0)}
                    ${this.createScoreInput('health_sleep', 'Sleep Quality', scores.health?.sleepScore || 0)}
                    ${this.createScoreInput('health_preventive', 'Preventive Care', scores.health?.preventiveCareScore || 0)}
                    ${this.createScoreInput('health_worklife', 'Work-Life Balance', scores.health?.workLifeBalanceScore || 0)}
                </div>

                <h3>Skills Maturity Scores</h3>
                <div class="score-inputs">
                    ${this.createScoreInput('skills_tech', 'Technical Skills', scores.skills?.technicalSkills || 0)}
                    ${this.createScoreInput('skills_leadership', 'Leadership', scores.skills?.leadership || 0)}
                    ${this.createScoreInput('skills_comm', 'Communication', scores.skills?.communication || 0)}
                    ${this.createScoreInput('skills_problem', 'Problem Solving', scores.skills?.problemSolving || 0)}
                    ${this.createScoreInput('skills_team', 'Teamwork', scores.skills?.teamwork || 0)}
                    ${this.createScoreInput('skills_innovation', 'Innovation', scores.skills?.innovation || 0)}
                    ${this.createScoreInput('skills_time', 'Time Management', scores.skills?.timeManagement || 0)}
                </div>
            </div>
            <div style="margin-top: 16px; display: flex; gap: 8px;">
                <button class="btn-primary" onclick="MaturityView.saveScores()">Save Scores</button>
                <button class="btn-secondary" onclick="App.closeModal()">Cancel</button>
            </div>
        `;

        App.openModal('Edit Maturity Scores', html);
    },

    /**
     * Create a score input field
     */
    createScoreInput(id, label, value) {
        return `
            <div class="score-input-group">
                <label>${label}</label>
                <input type="range" id="${id}" min="0" max="100" value="${value}" 
                       oninput="document.getElementById('${id}_val').textContent=this.value">
                <span id="${id}_val">${value}</span>
            </div>
        `;
    },

    /**
     * Save edited scores
     */
    saveScores() {
        const workspace = getWorkspaceData();
        if (!workspace.maturityScores) workspace.maturityScores = {};

        workspace.maturityScores.financial = {
            budgetingDiscipline: parseInt(document.getElementById('fin_budgeting').value),
            savingsRate: parseInt(document.getElementById('fin_savings').value),
            investmentDiversification: parseInt(document.getElementById('fin_investment').value),
            debtManagement: parseInt(document.getElementById('fin_debt').value),
            insuranceCoverage: parseInt(document.getElementById('fin_insurance').value),
            retirementPlanning: parseInt(document.getElementById('fin_retirement').value),
            cashFlowStability: parseInt(document.getElementById('fin_cashflow').value),
            overall: 0,
            level: '',
            history: []
        };

        workspace.maturityScores.health = {
            physicalScore: parseInt(document.getElementById('health_physical').value),
            mentalScore: parseInt(document.getElementById('health_mental').value),
            nutritionScore: parseInt(document.getElementById('health_nutrition').value),
            exerciseScore: parseInt(document.getElementById('health_exercise').value),
            sleepScore: parseInt(document.getElementById('health_sleep').value),
            preventiveCareScore: parseInt(document.getElementById('health_preventive').value),
            workLifeBalanceScore: parseInt(document.getElementById('health_worklife').value),
            overall: 0,
            level: '',
            history: []
        };

        workspace.maturityScores.skills = {
            technicalSkills: parseInt(document.getElementById('skills_tech').value),
            leadership: parseInt(document.getElementById('skills_leadership').value),
            communication: parseInt(document.getElementById('skills_comm').value),
            problemSolving: parseInt(document.getElementById('skills_problem').value),
            teamwork: parseInt(document.getElementById('skills_team').value),
            innovation: parseInt(document.getElementById('skills_innovation').value),
            timeManagement: parseInt(document.getElementById('skills_time').value),
            overall: 0,
            level: '',
            history: []
        };

        // Recalculate overall scores
        ['financial', 'health', 'skills'].forEach(key => {
            const scores = workspace.maturityScores[key];
            const values = Object.values(scores).filter(v => typeof v === 'number' && v !== 0);
            scores.overall = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
            scores.level = this.getMaturityLevel(scores.overall);
        });

        saveWorkspaceData(workspace);
        App.closeModal();
        this.init();
        App.showToast('Scores updated successfully');
    },

    /**
     * Export maturity report
     */
    exportMaturityReport() {
        const workspace = getWorkspaceData();
        const scores = workspace?.maturityScores || {};

        const report = {
            generatedAt: new Date().toISOString(),
            financial: scores.financial || {},
            health: scores.health || {},
            skills: scores.skills || {}
        };

        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'maturity_report_' + new Date().toISOString().slice(0, 10) + '.json';
        a.click();
        URL.revokeObjectURL(url);

        App.showToast('Maturity report exported');
    }
};