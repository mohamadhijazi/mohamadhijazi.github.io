/**
 * eventEngine.js - Mock SignalR Event Streamer
 * Phase 4.1: Simulates real-time telemetry events and dispatches browser events
 */

const EventEngine = {
    running: false,
    intervalId: null,
    eventInterval: 10000, // 10 seconds as specified
    
    // Telemetry event categories and sample data
    categories: ['Operations', 'Risk', 'Health', 'Finance'],
    
    sampleEvents: {
        'Operations': [
            { message: 'Routine task completed: Morning Reset - 3/5 steps done', severity: 'info', tags: ['Operations', 'Routine'] },
            { message: 'Floor plan updated: 2BR Apartment - Living Room status changed', severity: 'info', tags: ['Operations', 'Spatial'] },
            { message: 'New contact added to org structure', severity: 'info', tags: ['Operations', 'Contacts'] },
            { message: 'System sync completed successfully', severity: 'info', tags: ['Operations', 'System'] },
            { message: 'Performance alert: High CPU usage detected on workspace engine', severity: 'warning', tags: ['Operations', 'Performance'] },
            { message: 'Workflow bottleneck detected in daily routine pipeline', severity: 'critical', tags: ['Operations', 'Bottleneck'] }
        ],
        'Risk': [
            { message: 'Risk threshold exceeded: Budget variance > 15%', severity: 'warning', tags: ['Risk', 'Finance'] },
            { message: 'Compliance check failed: Missing documentation for task #42', severity: 'critical', tags: ['Risk', 'Compliance'] },
            { message: 'Risk assessment updated for Q4 operations', severity: 'info', tags: ['Risk', 'Assessment'] },
            { message: 'Anomaly detected in telemetry signal pattern', severity: 'warning', tags: ['Risk', 'Anomaly'] },
            { message: 'Critical: Data integrity check failed on workspace storage', severity: 'critical', tags: ['Risk', 'Integrity'] }
        ],
        'Health': [
            { message: 'System health: All services operational', severity: 'info', tags: ['Health', 'System'] },
            { message: 'Storage usage at 75% capacity - consider cleanup', severity: 'warning', tags: ['Health', 'Storage'] },
            { message: 'API response time degraded: avg 450ms (threshold: 200ms)', severity: 'warning', tags: ['Health', 'Performance'] },
            { message: 'Memory usage spike detected: 89% utilization', severity: 'critical', tags: ['Health', 'Memory'] },
            { message: 'Health check passed: All monitors green', severity: 'info', tags: ['Health', 'Monitor'] }
        ],
        'Finance': [
            { message: 'Daily financial summary: Transactions processed = 142', severity: 'info', tags: ['Finance', 'Summary'] },
            { message: 'Budget alert: Department spending approaching limit', severity: 'warning', tags: ['Finance', 'Budget'] },
            { message: 'Invoice processing queue: 23 pending items', severity: 'info', tags: ['Finance', 'Processing'] },
            { message: 'Currency exchange rate update: USD/SAR = 3.75', severity: 'info', tags: ['Finance', 'Exchange'] },
            { message: 'Critical: Payment gateway timeout detected', severity: 'critical', tags: ['Finance', 'Gateway'] }
        ]
    },

    /**
     * Start the event stream
     */
    start() {
        if (this.running) {
            console.log('EventEngine: Stream already running');
            return;
        }

        this.running = true;
        console.log('EventEngine: Starting telemetry stream...');

        // Fire first event immediately
        this.fireEvent();

        // Set up interval
        this.intervalId = setInterval(() => {
            this.fireEvent();
        }, this.eventInterval);
    },

    /**
     * Stop the event stream
     */
    stop() {
        this.running = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        console.log('EventEngine: Telemetry stream stopped');
    },

    /**
     * Fire a single telemetry event
     */
    fireEvent() {
        // Pick random category
        const category = this.categories[Math.floor(Math.random() * this.categories.length)];
        const events = this.sampleEvents[category];
        const event = events[Math.floor(Math.random() * events.length)];

        // Build event payload
        const payload = {
            eventId: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date().toISOString(),
            category: category,
            ...event
        };

        // Dispatch custom DOM event
        const customEvent = new CustomEvent('telemetry-event', { detail: payload });
        window.dispatchEvent(customEvent);

        console.log('EventEngine: Telemetry event fired', payload);
    },

    /**
     * Manually fire an event with specific data
     */
    fireManual(category, message, severity = 'info') {
        const payload = {
            eventId: `evt-manual-${Date.now()}`,
            timestamp: new Date().toISOString(),
            category: category,
            message: message,
            severity: severity,
            tags: [category, 'Manual']
        };

        const customEvent = new CustomEvent('telemetry-event', { detail: payload });
        window.dispatchEvent(customEvent);
    },

    /**
     * Get current status
     */
    getStatus() {
        return {
            running: this.running,
            interval: this.eventInterval,
            categories: this.categories
        };
    }
};

// Auto-start when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => EventEngine.start(), 2000); // Start 2 seconds after load
    });
} else {
    setTimeout(() => EventEngine.start(), 2000);
}