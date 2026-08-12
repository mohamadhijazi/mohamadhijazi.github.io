/**
 * costView.js - Cost Planning Dashboard
 * v4.0: Financial planning visualization with assets, liabilities, income, spending
 * Uses Chart.js for visualizations
 */

const CostView = {
    charts: {},

    render() {
        return `
            <div class="cost-header">
                <h2>Cost Planning</h2>
                <div class="cost-controls">
                    <button class="btn-secondary" onclick="CostView.openIncomeModal()">+ Add Income</button>
                    <button class="btn-secondary" onclick="CostView.openExpenseModal()">+ Add Expense</button>
                    <button class="btn-secondary" onclick="CostView.openAssetModal()">+ Add Asset</button>
                    <button class="btn-secondary" onclick="CostView.openLiabilityModal()">+ Add Liability</button>
                    <button class="btn-primary" onclick="CostView.exportFinancialReport()">Export Report</button>
                </div>
            </div>
            <div class="cost-summary-grid">
                <div class="cost-summary-card">
                    <div class="summary-icon">💵</div>
                    <div class="summary-label">Total Income</div>
                    <div class="summary-value" id="totalIncome">$0.00</div>
                </div>
                <div class="cost-summary-card">
                    <div class="summary-icon">💸</div>
                    <div class="summary-label">Total Spending</div>
                    <div class="summary-value" id="totalSpending">$0.00</div>
                </div>
                <div class="cost-summary-card">
                    <div class="summary-icon">📈</div>
                    <div class="summary-label">Net Cash Flow</div>
                    <div class="summary-value" id="netCashFlow">$0.00</div>
                </div>
                <div class="cost-summary-card">
                    <div class="summary-icon">🏦</div>
                    <div class="summary-label">Total Assets</div>
                    <div class="summary-value" id="totalAssets">$0.00</div>
                </div>
                <div class="cost-summary-card">
                    <div class="summary-icon">💳</div>
                    <div class="summary-label">Total Liabilities</div>
                    <div class="summary-value" id="totalLiabilities">$0.00</div>
                </div>
                <div class="cost-summary-card">
                    <div class="summary-icon">💎</div>
                    <div class="summary-label">Net Worth</div>
                    <div class="summary-value" id="netWorth">$0.00</div>
                </div>
            </div>
            <div class="cost-charts-grid">
                <div class="chart-container">
                    <h3>Asset Allocation</h3>
                    <canvas id="assetPieChart"></canvas>
                </div>
                <div class="chart-container">
                    <h3>Liability Breakdown</h3>
                    <canvas id="liabilityBarChart"></canvas>
                </div>
                <div class="chart-container chart-wide">
                    <h3>Income vs Spending Trend</h3>
                    <canvas id="cashFlowLineChart"></canvas>
                </div>
                <div class="chart-container">
                    <h3>Spending by Category</h3>
                    <canvas id="spendingDoughnutChart"></canvas>
                </div>
            </div>
            <div class="entity-cost-section">
                <h3>Entity Cost Breakdown</h3>
                <div class="entity-cost-tabs">
                    <button class="tab-btn active" data-entity-tab="trips" onclick="CostView.showEntityTab('trips', event)">Trips/Routines</button>
                    <button class="tab-btn" data-entity-tab="buildings" onclick="CostView.showEntityTab('buildings', event)">Buildings/Floors</button>
                    <button class="tab-btn" data-entity-tab="contacts" onclick="CostView.showEntityTab('contacts', event)">Contacts</button>
                </div>
                <div id="entityCostContent" class="entity-cost-content"></div>
            </div>
            <div class="transactions-section">
                <h3>Financial Transactions</h3>
                <div class="transaction-tabs">
                    <button class="tab-btn active" data-trans-tab="income" onclick="CostView.showTransactionTab('income', event)">Income</button>
                    <button class="tab-btn" data-trans-tab="expenses" onclick="CostView.showTransactionTab('expenses', event)">Expenses</button>
                    <button class="tab-btn" data-trans-tab="assets" onclick="CostView.showTransactionTab('assets', event)">Assets</button>
                    <button class="tab-btn" data-trans-tab="liabilities" onclick="CostView.showTransactionTab('liabilities', event)">Liabilities</button>
                </div>
                <div id="transactionsContent" class="transactions-content"></div>
            </div>
        `;
    },

    init() {
        this.updateSummaryCards();
        this.renderCharts();
        this.showEntityTab('trips', null, true);
        this.showTransactionTab('income', null, true);
    },

    updateSummaryCards() {
        const workspace = getWorkspaceData();
        const contacts = workspace?.contacts || [];
        const routines = workspace?.routines || [];
        const buildings = workspace?.buildings || [];

        let totalIncome = 0;
        let totalSpending = 0;
        let totalAssetValue = 0;
        let totalLiabilityValue = 0;

        contacts.forEach(contact => {
            const cost = contact.cost || {};
            (cost.income || []).forEach(income => {
                totalIncome += income.amount || 0;
            });
            const categories = cost.categories || {};
            Object.values(categories).forEach(val => {
                totalSpending += val || 0;
            });
            (cost.assets || []).forEach(asset => {
                totalAssetValue += asset.value || 0;
            });
            (cost.liabilities || []).forEach(liab => {
                totalLiabilityValue += liab.balance || 0;
            });
        });

        routines.forEach(routine => {
            const cost = routine.cost || {};
            totalSpending += cost.actual || 0;
        });

        buildings.forEach(building => {
            const bCost = building.cost || {};
            totalSpending += (bCost.maintenance || 0) + (bCost.utilities || 0);
        });

        const netCashFlow = totalIncome - totalSpending;
        const netWorth = totalAssetValue - totalLiabilityValue;

        this.updateSummaryValue('totalIncome', totalIncome);
        this.updateSummaryValue('totalSpending', totalSpending);
        this.updateSummaryValue('netCashFlow', netCashFlow);
        this.updateSummaryValue('totalAssets', totalAssetValue);
        this.updateSummaryValue('totalLiabilities', totalLiabilityValue);
        this.updateSummaryValue('netWorth', netWorth);

        const netFlowEl = document.getElementById('netCashFlow');
        if (netFlowEl) {
            netFlowEl.style.color = netCashFlow >= 0 ? '#4CAF50' : '#F44336';
        }
        const netWorthEl = document.getElementById('netWorth');
        if (netWorthEl) {
            netWorthEl.style.color = netWorth >= 0 ? '#4CAF50' : '#F44336';
        }
    },

    updateSummaryValue(elementId, value) {
        const el = document.getElementById(elementId);
        if (el) {
            el.textContent = '$' + value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }
    },

    renderCharts() {
        this.renderAssetPieChart();
        this.renderLiabilityBarChart();
        this.renderCashFlowLineChart();
        this.renderSpendingDoughnutChart();
    },

    renderAssetPieChart() {
        const workspace = getWorkspaceData();
        const contacts = workspace?.contacts || [];
        const assetTypes = { real_estate: 0, vehicle: 0, investment: 0, cash: 0, other: 0 };

        contacts.forEach(contact => {
            (contact.cost?.assets || []).forEach(asset => {
                const type = asset.type || 'other';
                assetTypes[type] = (assetTypes[type] || 0) + (asset.value || 0);
            });
        });

        const ctx = document.getElementById('assetPieChart');
        if (!ctx) return;
        if (this.charts.assetPie) { this.charts.assetPie.destroy(); }

        this.charts.assetPie = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Real Estate', 'Vehicle', 'Investment', 'Cash', 'Other'],
                datasets: [{
                    data: [assetTypes.real_estate || 0, assetTypes.vehicle || 0, assetTypes.investment || 0, assetTypes.cash || 0, assetTypes.other || 0],
                    backgroundColor: ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#607D8B']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'bottom' },
                    tooltip: { callbacks: { label: (context) => '$' + context.parsed.toLocaleString() } }
                }
            }
        });
    },

    renderLiabilityBarChart() {
        const workspace = getWorkspaceData();
        const contacts = workspace?.contacts || [];
        const liabilityTypes = { mortgage: 0, loan: 0, credit_card: 0, other: 0 };

        contacts.forEach(contact => {
            (contact.cost?.liabilities || []).forEach(liab => {
                const type = liab.type || 'other';
                liabilityTypes[type] = (liabilityTypes[type] || 0) + (liab.balance || 0);
            });
        });

        const ctx = document.getElementById('liabilityBarChart');
        if (!ctx) return;
        if (this.charts.liabilityBar) { this.charts.liabilityBar.destroy(); }

        this.charts.liabilityBar = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Mortgage', 'Loan', 'Credit Card', 'Other'],
                datasets: [{ label: 'Balance', data: [liabilityTypes.mortgage || 0, liabilityTypes.loan || 0, liabilityTypes.credit_card || 0, liabilityTypes.other || 0], backgroundColor: '#F44336' }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false }, tooltip: { callbacks: { label: (context) => '$' + context.parsed.y.toLocaleString() } } },
                scales: { y: { beginAtZero: true, ticks: { callback: (value) => '$' + value.toLocaleString() } } }
            }
        });
    },

    renderCashFlowLineChart() {
        const workspace = getWorkspaceData();
        const contacts = workspace?.contacts || [];
        const months = [];
        const incomeData = [];
        const spendingData = [];

        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const monthKey = date.toISOString().slice(0, 7);
            const monthName = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
            months.push(monthName);
            let monthIncome = 0;
            let monthSpending = 0;

            contacts.forEach(contact => {
                (contact.cost?.income || []).forEach(income => {
                    if (income.date && income.date.startsWith(monthKey)) {
                        monthIncome += income.amount || 0;
                    }
                });
                (contact.cost?.categories || {}).forEach((val, key) => {
                    monthSpending += val || 0;
                });
            });

            incomeData.push(monthIncome);
            spendingData.push(monthSpending);
        }

        const ctx = document.getElementById('cashFlowLineChart');
        if (!ctx) return;
        if (this.charts.cashFlow) { this.charts.cashFlow.destroy(); }

        this.charts.cashFlow = new Chart(ctx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [
                    { label: 'Income', data: incomeData, borderColor: '#4CAF50', backgroundColor: 'rgba(76, 175, 80, 0.1)', fill: true, tension: 0.3 },
                    { label: 'Spending', data: spendingData, borderColor: '#F44336', backgroundColor: 'rgba(244, 67, 54, 0.1)', fill: true, tension: 0.3 }
                ]
            },
            options: {
                responsive: true,
                plugins: { legend: { position: 'top' }, tooltip: { callbacks: { label: (context) => context.dataset.label + ': $' + context.parsed.y.toLocaleString() } } },
                scales: { y: { beginAtZero: true, ticks: { callback: (value) => '$' + value.toLocaleString() } } }
            }
        });
    },

    renderSpendingDoughnutChart() {
        const workspace = getWorkspaceData();
        const contacts = workspace?.contacts || [];
        const categories = { housing: 0, food: 0, transport: 0, health: 0, education: 0, entertainment: 0 };

        contacts.forEach(contact => {
            const contactCategories = contact.cost?.categories || {};
            Object.keys(categories).forEach(key => {
                categories[key] += contactCategories[key] || 0;
            });
        });

        const ctx = document.getElementById('spendingDoughnutChart');
        if (!ctx) return;
        if (this.charts.spending) { this.charts.spending.destroy(); }

        this.charts.spending = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Housing', 'Food', 'Transport', 'Health', 'Education', 'Entertainment'],
                datasets: [{
                    data: [categories.housing, categories.food, categories.transport, categories.health, categories.education, categories.entertainment],
                    backgroundColor: ['#2196F3', '#4CAF50', '#FF9800', '#F44336', '#9C27B0', '#00BCD4']
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { position: 'bottom' }, tooltip: { callbacks: { label: (context) => '$' + context.parsed.toLocaleString() } } }
            }
        });
    },

    showEntityTab(tab, clickEvent = null, skipActiveUpdate = false) {
        const workspace = getWorkspaceData();
        const content = document.getElementById('entityCostContent');
        if (!content) return;

        if (!skipActiveUpdate) {
            document.querySelectorAll('.entity-cost-tabs .tab-btn').forEach(btn => btn.classList.remove('active'));
            if (clickEvent && clickEvent.target) {
                clickEvent.target.classList.add('active');
            } else {
                const btn = document.querySelector('.entity-cost-tabs .tab-btn[data-entity-tab="' + tab + '"]');
                if (btn) btn.classList.add('active');
            }
        }

        let html = '<div class="entity-cost-table">';

        if (tab === 'trips') {
            const routines = workspace?.routines || [];
            if (routines.length === 0) {
                html += '<p class="empty-state">No routines with cost data.</p>';
            } else {
                html += '<table><thead><tr><th>Name</th><th>Category</th><th>Budget</th><th>Actual</th><th>Status</th></tr></thead><tbody>';
                routines.forEach(r => {
                    const cost = r.cost || {};
                    const budget = cost.budget || 0;
                    const actual = cost.actual || 0;
                    const status = actual > budget ? 'Over Budget' : 'Within Budget';
                    const statusClass = actual > budget ? 'over-budget' : 'within-budget';
                    html += '<tr><td>' + r.name + '</td><td>' + (r.category || '-') + '</td><td>$' + budget.toLocaleString() + '</td><td>$' + actual.toLocaleString() + '</td><td><span class="status-badge ' + statusClass + '">' + status + '</span></td></tr>';
                });
                html += '</tbody></table>';
            }
        } else if (tab === 'buildings') {
            const buildings = workspace?.buildings || [];
            if (buildings.length === 0) {
                html += '<p class="empty-state">No buildings with cost data.</p>';
            } else {
                html += '<table><thead><tr><th>Building</th><th>Floors</th><th>Maintenance</th><th>Utilities</th><th>Rent</th><th>Total</th></tr></thead><tbody>';
                buildings.forEach(b => {
                    const bCost = b.cost || {};
                    const maintenance = bCost.maintenance || 0;
                    const utilities = bCost.utilities || 0;
                    const rent = bCost.rent || 0;
                    const total = maintenance + utilities + rent;
                    html += '<tr><td>' + b.name + '</td><td>' + (b.floors || []).length + '</td><td>$' + maintenance.toLocaleString() + '</td><td>$' + utilities.toLocaleString() + '</td><td>$' + rent.toLocaleString() + '</td><td><strong>$' + total.toLocaleString() + '</strong></td></tr>';
                });
                html += '</tbody></table>';
            }
        } else if (tab === 'contacts') {
            const contacts = workspace?.contacts || [];
            if (contacts.length === 0) {
                html += '<p class="empty-state">No contacts with cost data.</p>';
            } else {
                html += '<table><thead><tr><th>Name</th><th>Role</th><th>Monthly Living</th><th>Housing</th><th>Food</th><th>Transport</th></tr></thead><tbody>';
                contacts.forEach(c => {
                    const cost = c.cost || {};
                    const living = cost.monthlyLivingCost || 0;
                    const categories = cost.categories || {};
                    html += '<tr><td>' + c.name + '</td><td>' + c.role + '</td><td>$' + living.toLocaleString() + '</td><td>$' + (categories.housing || 0).toLocaleString() + '</td><td>$' + (categories.food || 0).toLocaleString() + '</td><td>$' + (categories.transport || 0).toLocaleString() + '</td></tr>';
                });
                html += '</tbody></table>';
            }
        }

        html += '</div>';
        content.innerHTML = html;
    },

    showTransactionTab(tab, clickEvent = null, skipActiveUpdate = false) {
        const content = document.getElementById('transactionsContent');
        if (!content) return;

        if (!skipActiveUpdate) {
            document.querySelectorAll('.transaction-tabs .tab-btn').forEach(btn => btn.classList.remove('active'));
            if (clickEvent && clickEvent.target) {
                clickEvent.target.classList.add('active');
            } else {
                const btn = document.querySelector('.transaction-tabs .tab-btn[data-trans-tab="' + tab + '"]');
                if (btn) btn.classList.add('active');
            }
        }

        let html = '<div class="transaction-table">';
        if (tab === 'income') html += this.renderTransactionsTable('income');
        else if (tab === 'expenses') html += this.renderTransactionsTable('expense');
        else if (tab === 'assets') html += this.renderTransactionsTable('asset');
        else if (tab === 'liabilities') html += this.renderTransactionsTable('liability');
        html += '</div>';
        content.innerHTML = html;
    },

    renderTransactionsTable(type) {
        const workspace = getWorkspaceData();
        const contacts = workspace?.contacts || [];
        let rows = '';

        contacts.forEach(c => {
            const cost = c.cost || {};
            if (type === 'income') {
                (cost.income || []).forEach(income => {
                    rows += '<tr><td>' + c.name + '</td><td>' + (income.source || 'Unknown') + '</td><td>$' + (income.amount || 0).toLocaleString() + '</td><td>' + (income.type || '-') + '</td><td>' + (income.date ? new Date(income.date).toLocaleDateString() : '-') + '</td></tr>';
                });
            } else if (type === 'expense') {
                const categories = cost.categories || {};
                Object.entries(categories).forEach(([key, value]) => {
                    rows += '<tr><td>' + c.name + '</td><td>' + key + '</td><td>$' + (value || 0).toLocaleString() + '</td><td>-</td><td>-</td></tr>';
                });
            } else if (type === 'asset') {
                (cost.assets || []).forEach(asset => {
                    rows += '<tr><td>' + c.name + '</td><td>' + asset.name + '</td><td>$' + (asset.value || 0).toLocaleString() + '</td><td>' + (asset.type || '-') + '</td><td>' + (asset.purchaseDate ? new Date(asset.purchaseDate).toLocaleDateString() : '-') + '</td></tr>';
                });
            } else if (type === 'liability') {
                (cost.liabilities || []).forEach(liab => {
                    rows += '<tr><td>' + c.name + '</td><td>' + liab.name + '</td><td>$' + (liab.balance || 0).toLocaleString() + '</td><td>' + (liab.type || '-') + '</td><td>' + (liab.dueDate ? new Date(liab.dueDate).toLocaleDateString() : '-') + '</td></tr>';
                });
            }
        });

        if (!rows) return '<p class="empty-state">No ' + type + ' records found.</p>';

        return '<table><thead><tr><th>Contact</th><th>Name/Category</th><th>Amount</th><th>Type</th><th>Date</th></tr></thead><tbody>' + rows + '</tbody></table>';
    },

    openIncomeModal() {
        const html = '<div class="cost-form">' +
            '<div class="form-group"><label>Contact</label><select id="incomeContact" style="width:100%;padding:8px;border:1px solid var(--border-color);border-radius:4px;">' + this.getContactOptions() + '</select></div>' +
            '<div class="form-group"><label>Source</label><input type="text" id="incomeSource" placeholder="e.g., Salary" style="width:100%;padding:8px;border:1px solid var(--border-color);border-radius:4px;"></div>' +
            '<div class="form-group"><label>Amount</label><input type="number" id="incomeAmount" placeholder="0.00" style="width:100%;padding:8px;border:1px solid var(--border-color);border-radius:4px;"></div>' +
            '<div class="form-group"><label>Type</label><select id="incomeType" style="width:100%;padding:8px;border:1px solid var(--border-color);border-radius:4px;"><option value="salary">Salary</option><option value="investment">Investment</option><option value="freelance">Freelance</option><option value="other">Other</option></select></div>' +
            '<div class="form-group"><label>Date</label><input type="date" id="incomeDate" style="width:100%;padding:8px;border:1px solid var(--border-color);border-radius:4px;"></div>' +
            '</div><div style="margin-top:16px;display:flex;gap:8px;"><button class="btn-primary" onclick="CostView.saveIncome()">Save</button><button class="btn-secondary" onclick="App.closeModal()">Cancel</button></div>';
        App.openModal('Add Income', html);
    },

    saveIncome() {
        const contactId = document.getElementById('incomeContact').value;
        const source = document.getElementById('incomeSource').value;
        const amount = parseFloat(document.getElementById('incomeAmount').value);
        const type = document.getElementById('incomeType').value;
        const date = document.getElementById('incomeDate').value;

        if (!contactId || !amount) { App.showToast('Please fill required fields'); return; }

        const workspace = getWorkspaceData();
        const contacts = workspace.contacts || [];
        const contact = contacts.find(c => c.id === contactId);
        if (!contact) return;

        if (!contact.cost) contact.cost = {};
        if (!contact.cost.income) contact.cost.income = [];

        contact.cost.income.push({ source: source, amount: amount, type: type, date: date ? new Date(date).toISOString() : new Date().toISOString() });

        saveWorkspaceData(workspace);
        App.closeModal();
        this.init();
        App.showToast('Income added successfully');
    },

    openExpenseModal() {
        const html = '<div class="cost-form">' +
            '<div class="form-group"><label>Contact</label><select id="expenseContact" style="width:100%;padding:8px;border:1px solid var(--border-color);border-radius:4px;">' + this.getContactOptions() + '</select></div>' +
            '<div class="form-group"><label>Category</label><select id="expenseCategory" style="width:100%;padding:8px;border:1px solid var(--border-color);border-radius:4px;"><option value="housing">Housing</option><option value="food">Food</option><option value="transport">Transport</option><option value="health">Health</option><option value="education">Education</option><option value="entertainment">Entertainment</option></select></div>' +
            '<div class="form-group"><label>Amount</label><input type="number" id="expenseAmount" placeholder="0.00" style="width:100%;padding:8px;border:1px solid var(--border-color);border-radius:4px;"></div>' +
            '<div class="form-group"><label>Description</label><input type="text" id="expenseDescription" placeholder="Description" style="width:100%;padding:8px;border:1px solid var(--border-color);border-radius:4px;"></div>' +
            '</div><div style="margin-top:16px;display:flex;gap:8px;"><button class="btn-primary" onclick="CostView.saveExpense()">Save</button><button class="btn-secondary" onclick="App.closeModal()">Cancel</button></div>';
        App.openModal('Add Expense', html);
    },

    saveExpense() {
        const contactId = document.getElementById('expenseContact').value;
        const category = document.getElementById('expenseCategory').value;
        const amount = parseFloat(document.getElementById('expenseAmount').value);

        if (!contactId || !amount) { App.showToast('Please fill required fields'); return; }

        const workspace = getWorkspaceData();
        const contacts = workspace.contacts || [];
        const contact = contacts.find(c => c.id === contactId);
        if (!contact) return;

        if (!contact.cost) contact.cost = {};
        if (!contact.cost.categories) contact.cost.categories = {};

        contact.cost.categories[category] = (contact.cost.categories[category] || 0) + amount;

        saveWorkspaceData(workspace);
        App.closeModal();
        this.init();
        App.showToast('Expense added successfully');
    },

    openAssetModal() {
        const html = '<div class="cost-form">' +
            '<div class="form-group"><label>Contact</label><select id="assetContact" style="width:100%;padding:8px;border:1px solid var(--border-color);border-radius:4px;">' + this.getContactOptions() + '</select></div>' +
            '<div class="form-group"><label>Asset Name</label><input type="text" id="assetName" placeholder="e.g., House, Car" style="width:100%;padding:8px;border:1px solid var(--border-color);border-radius:4px;"></div>' +
            '<div class="form-group"><label>Value</label><input type="number" id="assetValue" placeholder="0.00" style="width:100%;padding:8px;border:1px solid var(--border-color);border-radius:4px;"></div>' +
            '<div class="form-group"><label>Type</label><select id="assetType" style="width:100%;padding:8px;border:1px solid var(--border-color);border-radius:4px;"><option value="real_estate">Real Estate</option><option value="vehicle">Vehicle</option><option value="investment">Investment</option><option value="cash">Cash</option><option value="other">Other</option></select></div>' +
            '<div class="form-group"><label>Purchase Date</label><input type="date" id="assetDate" style="width:100%;padding:8px;border:1px solid var(--border-color);border-radius:4px;"></div>' +
            '</div><div style="margin-top:16px;display:flex;gap:8px;"><button class="btn-primary" onclick="CostView.saveAsset()">Save</button><button class="btn-secondary" onclick="App.closeModal()">Cancel</button></div>';
        App.openModal('Add Asset', html);
    },

    saveAsset() {
        const contactId = document.getElementById('assetContact').value;
        const name = document.getElementById('assetName').value;
        const value = parseFloat(document.getElementById('assetValue').value);
        const type = document.getElementById('assetType').value;
        const date = document.getElementById('assetDate').value;

        if (!contactId || !name || !value) { App.showToast('Please fill required fields'); return; }

        const workspace = getWorkspaceData();
        const contacts = workspace.contacts || [];
        const contact = contacts.find(c => c.id === contactId);
        if (!contact) return;

        if (!contact.cost) contact.cost = {};
        if (!contact.cost.assets) contact.cost.assets = [];

        contact.cost.assets.push({ name: name, value: value, type: type, purchaseDate: date ? new Date(date).toISOString() : new Date().toISOString() });

        saveWorkspaceData(workspace);
        App.closeModal();
        this.init();
        App.showToast('Asset added successfully');
    },

    openLiabilityModal() {
        const html = '<div class="cost-form">' +
            '<div class="form-group"><label>Contact</label><select id="liabilityContact" style="width:100%;padding:8px;border:1px solid var(--border-color);border-radius:4px;">' + this.getContactOptions() + '</select></div>' +
            '<div class="form-group"><label>Liability Name</label><input type="text" id="liabilityName" placeholder="e.g., Mortgage" style="width:100%;padding:8px;border:1px solid var(--border-color);border-radius:4px;"></div>' +
            '<div class="form-group"><label>Balance</label><input type="number" id="liabilityBalance" placeholder="0.00" style="width:100%;padding:8px;border:1px solid var(--border-color);border-radius:4px;"></div>' +
            '<div class="form-group"><label>Type</label><select id="liabilityType" style="width:100%;padding:8px;border:1px solid var(--border-color);border-radius:4px;"><option value="mortgage">Mortgage</option><option value="loan">Loan</option><option value="credit_card">Credit Card</option><option value="other">Other</option></select></div>' +
            '<div class="form-group"><label>Interest Rate (%)</label><input type="number" id="liabilityRate" placeholder="0.0" step="0.1" style="width:100%;padding:8px;border:1px solid var(--border-color);border-radius:4px;"></div>' +
            '<div class="form-group"><label>Due Date</label><input type="date" id="liabilityDueDate" style="width:100%;padding:8px;border:1px solid var(--border-color);border-radius:4px;"></div>' +
            '</div><div style="margin-top:16px;display:flex;gap:8px;"><button class="btn-primary" onclick="CostView.saveLiability()">Save</button><button class="btn-secondary" onclick="App.closeModal()">Cancel</button></div>';
        App.openModal('Add Liability', html);
    },

    saveLiability() {
        const contactId = document.getElementById('liabilityContact').value;
        const name = document.getElementById('liabilityName').value;
        const balance = parseFloat(document.getElementById('liabilityBalance').value);
        const type = document.getElementById('liabilityType').value;
        const rate = parseFloat(document.getElementById('liabilityRate').value) || 0;
        const dueDate = document.getElementById('liabilityDueDate').value;

        if (!contactId || !name || !balance) { App.showToast('Please fill required fields'); return; }

        const workspace = getWorkspaceData();
        const contacts = workspace.contacts || [];
        const contact = contacts.find(c => c.id === contactId);
        if (!contact) return;

        if (!contact.cost) contact.cost = {};
        if (!contact.cost.liabilities) contact.cost.liabilities = [];

        contact.cost.liabilities.push({ name: name, balance: balance, type: type, interestRate: rate, dueDate: dueDate ? new Date(dueDate).toISOString() : null });

        saveWorkspaceData(workspace);
        App.closeModal();
        this.init();
        App.showToast('Liability added successfully');
    },

    getContactOptions() {
        const workspace = getWorkspaceData();
        const contacts = workspace?.contacts || [];
        return contacts.map(c => '<option value="' + c.id + '">' + c.name + ' (' + c.role + ')</option>').join('');
    },

    exportFinancialReport() {
        const workspace = getWorkspaceData();
        const report = {
            generatedAt: new Date().toISOString(),
            summary: { totalIncome: 0, totalSpending: 0, totalAssets: 0, totalLiabilities: 0, netWorth: 0 },
            contacts: []
        };

        (workspace.contacts || []).forEach(contact => {
            const cost = contact.cost || {};
            report.contacts.push({
                name: contact.name,
                income: cost.income || [],
                expenses: cost.categories || {},
                assets: cost.assets || [],
                liabilities: cost.liabilities || []
            });
            report.summary.totalIncome += (cost.income || []).reduce((sum, i) => sum + (i.amount || 0), 0);
            report.summary.totalSpending += Object.values(cost.categories || {}).reduce((sum, v) => sum + (v || 0), 0);
            report.summary.totalAssets += (cost.assets || []).reduce((sum, a) => sum + (a.value || 0), 0);
            report.summary.totalLiabilities += (cost.liabilities || []).reduce((sum, l) => sum + (l.balance || 0), 0);
        });

        report.summary.netWorth = report.summary.totalAssets - report.summary.totalLiabilities;

        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'financial_report_' + new Date().toISOString().slice(0, 10) + '.json';
        a.click();
        URL.revokeObjectURL(url);
        App.showToast('Financial report exported');
    }
};