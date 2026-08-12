/**
 * rightPanel.js - Competence & Consciousness Detector Panel
 * Phase 7: UX Touchpoint Matrix - 4 Stages of Competence → Personal Digital Twin
 * Right-side expandable panel (380px width, collapsible to 48px)
 * Displays domain assessments, development paths, and enhancement suggestions
 */

const RightPanel = {
    // Panel state
    state: {
        collapsed: false,
        activeTab: 'domains',
        selectedDomain: null,
        scrollPosition: 0
    },

    // Stage color coding
    stageColors: {
        sensing: '#2196F3',
        diagnostics: '#FF9800',
        orchestration: '#4CAF50',
        automated: '#9C27B0'
    },

    stageLabels: {
        unconsciousIncompetence: 'Unconscious Incompetence (Sensing)',
        consciousIncompetence: 'Conscious Incompetence (Diagnostics)',
        consciousCompetence: 'Conscious Competence (Orchestration)',
        unconsciousCompetence: 'Unconscious Competence (Automated)'
    },

    /**
     * Initialize the right panel
     */
    init() {
        this.loadState();
        this.render();
        this.bindEvents();
        this.updateAllDomains();

        // Show panel by default on first load
        if (!localStorage.getItem('pwa_rightPanel_initialized')) {
            this.state.collapsed = false;
            this.saveState();
            this.toggle(true);
        }
    },

    /**
     * Load panel state from localStorage
     */
    loadState() {
        try {
            const saved = localStorage.getItem('pwa_rightPanel');
            if (saved) {
                this.state = { ...this.state, ...JSON.parse(saved) };
            }
        } catch (e) {
            console.warn('Failed to load right panel state:', e);
        }
    },

    /**
     * Save panel state to localStorage
     */
    saveState() {
        try {
            localStorage.setItem('pwa_rightPanel', JSON.stringify(this.state));
        } catch (e) {
            console.warn('Failed to save right panel state:', e);
        }
    },

    /**
     * Render the right panel HTML
     */
    render() {
        // Create panel element
        const panel = document.createElement('div');
        panel.id = 'rightPanel';
        panel.className = `right-panel ${this.state.collapsed ? 'collapsed' : ''}`;
        
        panel.innerHTML = `
            <div class="panel-header" id="panelHeader">
                <div class="panel-title">
                    <span class="panel-icon">🧠</span>
                    <span class="panel-title-text">Competence Detector</span>
                </div>
                <div class="panel-controls">
                    <button class="panel-btn panel-collapse" id="panelCollapse" title="Collapse">◀</button>
                    <button class="panel-btn panel-minimize" id="panelMinimize" title="Minimize">─</button>
                    <button class="panel-btn panel-close" id="panelClose" title="Close">✕</button>
                </div>
            </div>
            <div class="panel-tabs" id="panelTabs">
                <button class="tab-btn ${this.state.activeTab === 'domains' ? 'active' : ''}" data-tab="domains">
                    📊 Domains
                </button>
                <button class="tab-btn ${this.state.activeTab === 'paths' ? 'active' : ''}" data-tab="paths">
                    🗺️ Paths
                </button>
                <button class="tab-btn ${this.state.activeTab === 'enhance' ? 'active' : ''}" data-tab="enhance">
                    ⚡ Enhance
                </button>
            </div>
            <div class="panel-body" id="panelBody">
                <div class="tab-content ${this.state.activeTab === 'domains' ? 'active' : ''}" id="tab-domains">
                    ${this.renderDomainsTab()}
                </div>
                <div class="tab-content ${this.state.activeTab === 'paths' ? 'active' : ''}" id="tab-paths">
                    ${this.renderPathsTab()}
                </div>
                <div class="tab-content ${this.state.activeTab === 'enhance' ? 'active' : ''}" id="tab-enhance">
                    ${this.renderEnhanceTab()}
                </div>
            </div>
            <div class="panel-footer" id="panelFooter">
                <button class="export-dev-path" id="exportDevPath">📄 Export Development Path</button>
            </div>
        `;

        // Append to main content area
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.style.position = 'relative';
            mainContent.appendChild(panel);
        }

        // Apply initial state
        if (!this.state.collapsed) {
            panel.classList.remove('collapsed');
        }
    },

    /**
     * Render the Domains tab content
     */
    renderDomainsTab() {
        const domains = this.getCompetenceDomains();
        
        if (domains.length === 0) {
            return `
                <div class="empty-state">
                    <div class="empty-icon">📊</div>
                    <p>No domains assessed yet. Complete maturity evaluation to see domain assessments.</p>
                    <button class="btn-primary" onclick="App.navigateTo('maturity')">Go to Maturity Radar</button>
                </div>
            `;
        }

        return domains.map(domain => {
            const color = this.stageColors[domain.stage] || '#999';
            const progressWidth = domain.consciousLevel || 0;
            
            return `
                <div class="domain-card ${this.state.selectedDomain === domain.domainId ? 'selected' : ''}" 
                     data-domain-id="${domain.domainId}" 
                     style="--domain-color: ${color}">
                    <div class="domain-header" onclick="RightPanel.selectDomain('${domain.domainId}')">
                        <div class="domain-name">${domain.domainName}</div>
                        <div class="domain-stage-badge" style="background: ${color}">
                            ${domain.stage}
                        </div>
                    </div>
                    <div class="domain-body">
                        <div class="domain-progress">
                            <div class="progress-label">
                                <span>Conscious Level</span>
                                <span>${progressWidth}%</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${progressWidth}%; background: ${color}"></div>
                            </div>
                        </div>
                        <div class="domain-state">
                            <div class="state-label">Detected State:</div>
                            <div class="state-value">${this.stageLabels[domain.consciousState] || domain.consciousState}</div>
                        </div>
                        ${domain.recommendedActions && domain.recommendedActions.length > 0 ? `
                            <div class="domain-action">
                                <div class="action-label">Recommended Action:</div>
                                <div class="action-value">${domain.recommendedActions[0]}</div>
                            </div>
                        ` : ''}
                        ${domain.dataGaps && domain.dataGaps.length > 0 ? `
                            <div class="domain-gap">
                                <div class="gap-label">Data Gap:</div>
                                <div class="gap-value">${domain.dataGaps[0]}</div>
                            </div>
                        ` : ''}
                        ${domain.enhancementSuggestions && domain.enhancementSuggestions.length > 0 ? `
                            <div class="domain-enhance">
                                <div class="enhance-label">Enhancement:</div>
                                <div class="enhance-value">${domain.enhancementSuggestions[0]}</div>
                            </div>
                        ` : ''}
                        ${domain.streakDays > 0 ? `
                            <div class="domain-streak">
                                🔥 ${domain.streakDays} day streak
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');
    },

    /**
     * Render the Paths tab content
     */
    renderPathsTab() {
        const devPath = this.getDevelopmentPath();
        const domains = this.getCompetenceDomains();
        
        if (!devPath || domains.length === 0) {
            return `
                <div class="empty-state">
                    <div class="empty-icon">🗺️</div>
                    <p>No development path configured. Assess domains to generate recommendations.</p>
                </div>
            `;
        }

        const sortedPaths = [...domains].sort((a, b) => {
            const pathA = devPath.progression?.find(p => p.domainId === a.domainId)?.recommendedOrder || 999;
            const pathB = devPath.progression?.find(p => p.domainId === b.domainId)?.recommendedOrder || 999;
            return pathA - pathB;
        });

        return `
            <div class="path-overview">
                <div class="path-stage-indicator">
                    <div class="path-current-stage" style="background: ${this.stageColors[devPath.currentStage] || '#999'}">
                        Current Stage: ${devPath.currentStage}
                    </div>
                </div>
                ${devPath.nextRecommendedAction ? `
                    <div class="path-next-action">
                        <div class="next-action-label">Next Recommended Action:</div>
                        <div class="next-action-value">${devPath.nextRecommendedAction}</div>
                    </div>
                ` : ''}
            </div>
            <div class="path-sequence">
                <div class="path-sequence-title">Recommended Progression:</div>
                ${sortedPaths.map((domain, index) => {
                    const pathItem = devPath.progression?.find(p => p.domainId === domain.domainId);
                    const statusIcon = pathItem?.status === 'mastered' ? '✅' : 
                                     pathItem?.status === 'inProgress' ? '🔄' : '⬜';
                    return `
                        <div class="path-item ${pathItem?.status === 'inProgress' ? 'in-progress' : ''}" 
                             onclick="RightPanel.selectDomain('${domain.domainId}')">
                            <div class="path-item-order">${index + 1}</div>
                            <div class="path-item-content">
                                <div class="path-item-name">${domain.domainName}</div>
                                <div class="path-item-status">${statusIcon} ${pathItem?.status || 'notStarted'}</div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    },

    /**
     * Render the Enhance tab content
     */
    renderEnhanceTab() {
        const domains = this.getCompetenceDomains();
        const suggestions = [];

        // Generate enhancement suggestions based on domain analysis
        domains.forEach(domain => {
            if (domain.consciousLevel < 30) {
                suggestions.push({
                    domain: domain.domainName,
                    priority: 'high',
                    suggestion: `Critical: ${domain.domainName} needs immediate attention. Start with basic data collection.`,
                    type: 'data-collection'
                });
            }
            
            if (domain.dataGaps && domain.dataGaps.length > 0) {
                domain.dataGaps.forEach(gap => {
                    suggestions.push({
                        domain: domain.domainName,
                        priority: 'medium',
                        suggestion: `Fill data gap: ${gap}`,
                        type: 'gap-fill'
                    });
                });
            }

            if (domain.enhancementSuggestions && domain.enhancementSuggestions.length > 0) {
                domain.enhancementSuggestions.forEach(sugg => {
                    suggestions.push({
                        domain: domain.domainName,
                        priority: 'low',
                        suggestion: sugg,
                        type: 'enhancement'
                    });
                });
            }

            // Add telemetry source suggestions
            if (!domain.telemetrySources || domain.telemetrySources.length === 0) {
                suggestions.push({
                    domain: domain.domainName,
                    priority: 'medium',
                    suggestion: `Connect telemetry source for ${domain.domainName} tracking`,
                    type: 'telemetry'
                });
            }
        });

        // Add general enhancement suggestions
        suggestions.push({
            domain: 'System',
            priority: 'low',
            suggestion: 'Enable device sensor integration for passive telemetry',
            type: 'system'
        });

        suggestions.push({
            domain: 'System',
            priority: 'medium',
            suggestion: 'Set up automated daily cadence reminders',
            type: 'automation'
        });

        if (suggestions.length === 0) {
            return `
                <div class="empty-state">
                    <div class="empty-icon">⚡</div>
                    <p>No enhancement suggestions at this time. Keep tracking data for recommendations.</p>
                </div>
            `;
        }

        return suggestions.map(s => {
            const priorityColor = s.priority === 'high' ? '#f44336' : 
                                s.priority === 'medium' ? '#FF9800' : '#4CAF50';
            return `
                <div class="enhancement-card" style="--enhance-priority: ${priorityColor}">
                    <div class="enhance-priority" style="background: ${priorityColor}">
                        ${s.priority.toUpperCase()}
                    </div>
                    <div class="enhance-domain">${s.domain}</div>
                    <div class="enhance-suggestion">${s.suggestion}</div>
                    <div class="enhance-actions">
                        <button class="btn-small" onclick="RightPanel.applyEnhancement('${s.type}', '${s.domain}')">Apply</button>
                        <button class="btn-small btn-secondary" onclick="RightPanel.dismissEnhancement('${s.type}', '${s.domain}')">Dismiss</button>
                    </div>
                </div>
            `;
        }).join('');
    },

    /**
     * Bind panel events
     */
    bindEvents() {
        // Collapse button
        const collapseBtn = document.getElementById('panelCollapse');
        if (collapseBtn) {
            collapseBtn.addEventListener('click', () => this.toggle());
        }

        // Minimize button
        const minimizeBtn = document.getElementById('panelMinimize');
        if (minimizeBtn) {
            minimizeBtn.addEventListener('click', () => {
                const body = document.getElementById('panelBody');
                const footer = document.getElementById('panelFooter');
                if (body) body.style.display = body.style.display === 'none' ? '' : 'none';
                if (footer) footer.style.display = footer.style.display === 'none' ? '' : 'none';
            });
        }

        // Close button
        const closeBtn = document.getElementById('panelClose');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.state.collapsed = true;
                this.saveState();
                this.toggle(true);
            });
        }

        // Tab buttons
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                this.switchTab(tab);
            });
        });

        // Export button
        const exportBtn = document.getElementById('exportDevPath');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportDevelopmentPath());
        }

        // Header click to toggle on mobile
        const header = document.getElementById('panelHeader');
        if (header) {
            header.addEventListener('click', (e) => {
                if (e.target === header || e.target.classList.contains('panel-title')) {
                    if (window.innerWidth <= 768) {
                        this.toggle();
                    }
                }
            });
        }
    },

    /**
     * Toggle panel open/closed
     */
    toggle(forceClose) {
        const panel = document.getElementById('rightPanel');
        if (!panel) return;

        if (forceClose === true) {
            panel.classList.add('collapsed');
            this.state.collapsed = true;
        } else {
            panel.classList.toggle('collapsed');
            this.state.collapsed = panel.classList.contains('collapsed');
        }
        this.saveState();
    },

    /**
     * Switch panel tab
     */
    switchTab(tabName) {
        this.state.activeTab = tabName;
        this.saveState();

        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        const targetTab = document.getElementById(`tab-${tabName}`);
        if (targetTab) {
            targetTab.classList.add('active');
        }
    },

    /**
     * Select a domain
     */
    selectDomain(domainId) {
        this.state.selectedDomain = domainId;
        this.saveState();

        // Update card selection
        document.querySelectorAll('.domain-card').forEach(card => {
            card.classList.toggle('selected', card.dataset.domainId === domainId);
        });
    },

    /**
     * Get competence domains from storage
     */
    getCompetenceDomains() {
        try {
            const workspace = getWorkspaceData();
            return workspace?.competenceDomains || [];
        } catch (e) {
            console.warn('Failed to get competence domains:', e);
            return [];
        }
    },

    /**
     * Get development path from storage
     */
    getDevelopmentPath() {
        try {
            const workspace = getWorkspaceData();
            return workspace?.developmentPath || null;
        } catch (e) {
            console.warn('Failed to get development path:', e);
            return null;
        }
    },

    /**
     * Update all domain cards with current data
     */
    updateAllDomains() {
        const domainsTab = document.getElementById('tab-domains');
        if (domainsTab && this.state.activeTab === 'domains') {
            domainsTab.innerHTML = this.renderDomainsTab();
        }

        const pathsTab = document.getElementById('tab-paths');
        if (pathsTab && this.state.activeTab === 'paths') {
            pathsTab.innerHTML = this.renderPathsTab();
        }

        const enhanceTab = document.getElementById('tab-enhance');
        if (enhanceTab && this.state.activeTab === 'enhance') {
            enhanceTab.innerHTML = this.renderEnhanceTab();
        }
    },

    /**
     * Calculate and update competence domains from existing data
     */
    calculateDomainsFromData() {
        const workspace = getWorkspaceData();
        const maturityScores = workspace?.maturityScores || {};
        const routines = workspace?.routines || [];
        const contacts = workspace?.contacts || [];
        const costs = this.aggregateCostData();

        // Define default domains based on available data
        const defaultDomains = [
            {
                domainId: 'financial',
                domainName: 'Financial Management',
                targetLevel: 70,
                currentScore: this.calculateFinancialScore(maturityScores, costs),
                dataGaps: [],
                recommendedActions: ['Review budget vs actual'],
                enhancementSuggestions: ['Link bank statements for auto-tracking']
            },
            {
                domainId: 'health',
                domainName: 'Health & Wellness',
                targetLevel: 80,
                currentScore: this.calculateHealthScore(maturityScores),
                dataGaps: ['Missing sleep data', 'No movement tracking'],
                recommendedActions: ['Log daily sleep hours', 'Set movement goals'],
                enhancementSuggestions: ['Connect fitness tracker', 'Add sleep score tracking']
            },
            {
                domainId: 'skills',
                domainName: 'Skills & Capabilities',
                targetLevel: 75,
                currentScore: this.calculateSkillsScore(maturityScores, contacts),
                dataGaps: [],
                recommendedActions: ['Complete skills assessment'],
                enhancementSuggestions: ['Add family competency mapping']
            },
            {
                domainId: 'routines',
                domainName: 'Routine Consistency',
                targetLevel: 85,
                currentScore: this.calculateRoutineScore(routines),
                dataGaps: [],
                recommendedActions: ['Maintain daily routine streak'],
                enhancementSuggestions: ['Add consistency heatmap']
            },
            {
                domainId: 'spatial',
                domainName: 'Spatial Awareness',
                targetLevel: 60,
                currentScore: this.calculateSpatialScore(workspace),
                dataGaps: ['Map pins need more locations'],
                recommendedActions: ['Add more location markers'],
                enhancementSuggestions: ['Enable energy leak detection']
            }
        ];

        // Merge with existing domains or create new ones
        const existingDomains = workspace?.competenceDomains || [];
        const mergedDomains = defaultDomains.map(defaultDomain => {
            const existing = existingDomains.find(d => d.domainId === defaultDomain.domainId);
            if (existing) {
                return { ...existing, ...defaultDomain };
            }
            return {
                ...defaultDomain,
                stage: this.determineStage(defaultDomain.currentScore, defaultDomain.targetLevel),
                consciousState: this.determineConsciousState(defaultDomain.currentScore, defaultDomain.targetLevel),
                consciousLevel: defaultDomain.currentScore,
                repetitionCount: 0,
                streakDays: 0,
                lastAssessed: new Date().toISOString(),
                telemetrySources: []
            };
        });

        // Update workspace
        workspace.competenceDomains = mergedDomains;

        // Update development path
        workspace.developmentPath = {
            currentStage: this.getDominantStage(mergedDomains),
            progression: mergedDomains.map((d, i) => ({
                domainId: d.domainId,
                prerequisites: i > 0 ? [mergedDomains[i-1].domainId] : [],
                recommendedOrder: i + 1,
                status: d.consciousLevel >= d.targetLevel ? 'mastered' : 
                       d.consciousLevel >= d.targetLevel * 0.5 ? 'inProgress' : 'notStarted'
            })),
            nextRecommendedAction: this.getNextRecommendedAction(mergedDomains),
            lastReview: new Date().toISOString()
        };

        saveWorkspaceData(workspace);
        this.updateAllDomains();
    },

    /**
     * Calculate financial score
     */
    calculateFinancialScore(maturityScores, costs) {
        if (maturityScores?.financial?.currentScore) {
            return maturityScores.financial.currentScore;
        }
        // Base score on cost data completeness
        let score = 20;
        if (costs.totalBudget > 0) score += 20;
        if (costs.totalActual > 0) score += 20;
        if (costs.categories?.length > 0) score += 20;
        if (costs.assets?.length > 0) score += 20;
        return Math.min(score, 100);
    },

    /**
     * Calculate health score
     */
    calculateHealthScore(maturityScores) {
        if (maturityScores?.health?.currentScore) {
            return maturityScores.health.currentScore;
        }
        return 25; // Default low score until data is collected
    },

    /**
     * Calculate skills score
     */
    calculateSkillsScore(maturityScores, contacts) {
        if (maturityScores?.skills?.currentScore) {
            return maturityScores.skills.currentScore;
        }
        // Base on contact skill tags
        const totalSkills = contacts.reduce((sum, c) => sum + (c.skillTags?.length || 0), 0);
        return Math.min(20 + totalSkills * 10, 100);
    },

    /**
     * Calculate routine score
     */
    calculateRoutineScore(routines) {
        if (routines.length === 0) return 10;
        let totalSteps = 0;
        let completedSteps = 0;
        routines.forEach(r => {
            totalSteps += (r.steps?.length || 0);
            completedSteps += (r.completedSteps?.length || 0);
        });
        return totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 10;
    },

    /**
     * Calculate spatial score
     */
    calculateSpatialScore(workspace) {
        const pinCount = (workspace?.mapPins || []).length;
        const buildingCount = (workspace?.buildings || []).length;
        const contactLocationCount = (workspace?.contacts || []).reduce(
            (sum, c) => sum + (c.locationAssociations?.length || 0), 0
        );
        return Math.min(10 + pinCount * 10 + buildingCount * 15 + contactLocationCount * 5, 100);
    },

    /**
     * Aggregate cost data
     */
    aggregateCostData() {
        const workspace = getWorkspaceData();
        const routines = workspace?.routines || [];
        const contacts = workspace?.contacts || [];
        
        let totalBudget = 0;
        let totalActual = 0;
        const categories = [];
        const assets = [];
        const liabilities = [];
        const income = [];

        routines.forEach(r => {
            if (r.cost) {
                totalBudget += r.cost.budget || 0;
                totalActual += r.cost.actual || 0;
                if (r.cost.categories) categories.push(...r.cost.categories);
                if (r.cost.assets) assets.push(...r.cost.assets);
                if (r.cost.liabilities) liabilities.push(...r.cost.liabilities);
                if (r.cost.income) income.push(...r.cost.income);
            }
        });

        contacts.forEach(c => {
            if (c.cost) {
                totalBudget += c.cost.budget || 0;
                totalActual += c.cost.actual || 0;
                if (c.cost.categories) categories.push(...c.cost.categories);
                if (c.cost.assets) assets.push(...c.cost.assets);
                if (c.cost.liabilities) liabilities.push(...c.cost.liabilities);
                if (c.cost.income) income.push(...c.cost.income);
            }
        });

        return { totalBudget, totalActual, categories, assets, liabilities, income };
    },

    /**
     * Determine stage from score and target
     */
    determineStage(current, target) {
        const ratio = current / target;
        if (ratio >= 0.9) return 'automated';
        if (ratio >= 0.6) return 'orchestration';
        if (ratio >= 0.3) return 'diagnostics';
        return 'sensing';
    },

    /**
     * Determine conscious state from score and target
     */
    determineConsciousState(current, target) {
        const ratio = current / target;
        if (ratio >= 0.9) return 'unconsciousCompetence';
        if (ratio >= 0.6) return 'consciousCompetence';
        if (ratio >= 0.3) return 'consciousIncompetence';
        return 'unconsciousIncompetence';
    },

    /**
     * Get dominant stage from domains
     */
    getDominantStage(domains) {
        const stageCounts = { sensing: 0, diagnostics: 0, orchestration: 0, automated: 0 };
        domains.forEach(d => {
            stageCounts[d.stage] = (stageCounts[d.stage] || 0) + 1;
        });
        return Object.entries(stageCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'sensing';
    },

    /**
     * Get next recommended action
     */
    getNextRecommendedAction(domains) {
        const incomplete = domains.filter(d => {
            const path = getWorkspaceData()?.developmentPath?.progression?.find(p => p.domainId === d.domainId);
            return path?.status !== 'mastered';
        });

        if (incomplete.length === 0) return 'All domains mastered! Review executive dashboard.';
        
        const next = incomplete.sort((a, b) => a.consciousLevel - b.consciousLevel)[0];
        return `Improve ${next.domainName} from ${next.consciousLevel}% to ${next.targetLevel}%`;
    },

    /**
     * Apply an enhancement suggestion
     */
    applyEnhancement(type, domain) {
        switch (type) {
            case 'data-collection':
                if (domain === 'Health & Wellness') {
                    App.navigateTo('maturity');
                } else {
                    App.showToast('Start collecting data for ' + domain);
                }
                break;
            case 'gap-fill':
                App.showToast('Addressing gap in ' + domain);
                break;
            case 'telemetry':
                App.showToast('Setting up telemetry for ' + domain);
                break;
            case 'system':
                App.showToast('System enhancement initiated');
                break;
            case 'automation':
                App.showToast('Setting up automation');
                break;
            default:
                App.showToast('Enhancement applied to ' + domain);
        }
    },

    /**
     * Dismiss an enhancement suggestion
     */
    dismissEnhancement(type, domain) {
        const card = event.target.closest('.enhancement-card');
        if (card) {
            card.style.opacity = '0.5';
            card.style.pointerEvents = 'none';
        }
    },

    /**
     * Export development path as JSON
     */
    exportDevelopmentPath() {
        const workspace = getWorkspaceData();
        const exportData = {
            type: 'personal-development-path',
            exportedAt: new Date().toISOString(),
            version: workspace.version || '5.0',
            competenceDomains: workspace.competenceDomains || [],
            developmentPath: workspace.developmentPath || {},
            maturityScores: workspace.maturityScores || {}
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `development-path-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        App.showToast('Development path exported');
    }
};

// Initialize right panel when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => RightPanel.init());
} else {
    RightPanel.init();
}