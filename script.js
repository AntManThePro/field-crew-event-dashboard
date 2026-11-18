/*
 * Field Crew Event Dashboard Logic
 *
 * This file contains all of the client‑side logic for the dashboard.
 * It handles loading and saving events from localStorage, rendering
 * statistics and tables, filtering, creating new events and closing
 * events with resolutions.  It operates entirely in the browser.
 */

document.addEventListener('DOMContentLoaded', () => {
    const storageKey = 'dashboardEvents';

    /**
     * Escape user-entered text before injecting it into the table,
     * so a name or description can never break out of its cell.
     * @param {string} s
     * @returns {string}
     */
    function escapeHtml(s) {
        return String(s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    /**
     * Load events from localStorage or seed with sample data.
     * @returns {Array}
     */
    function loadEvents() {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (err) {
                console.error('Failed to parse events from storage', err);
            }
        }
        // If no data exists, seed with sample events
        const now = Date.now();
        return [
            {
                id: generateId(),
                employeeName: 'John Doe',
                eventType: 'No-Call/No-Show',
                description: 'Employee missed shift without notice',
                eventTime: now - 2 * 60 * 60 * 1000,
                status: 'Open',
                responseTime: null,
                resolution: ''
            },
            {
                id: generateId(),
                employeeName: 'Alice Smith',
                eventType: 'Policy Violation',
                description: 'Broke safety protocol',
                eventTime: now - 24 * 60 * 60 * 1000,
                status: 'Closed',
                responseTime: now - 22 * 60 * 60 * 1000,
                resolution: 'Written warning issued.'
            },
            {
                id: generateId(),
                employeeName: 'Bob Johnson',
                eventType: 'Attendance Issue',
                description: 'Late arrival',
                eventTime: now - 8 * 60 * 60 * 1000,
                status: 'Open',
                responseTime: null,
                resolution: ''
            },
            {
                id: generateId(),
                employeeName: 'Maya Patel',
                eventType: 'Resignation',
                description: 'Submitted resignation via text',
                eventTime: now - 36 * 60 * 60 * 1000,
                status: 'Closed',
                responseTime: now - 35 * 60 * 60 * 1000,
                resolution: 'Resignation accepted.'
            }
        ];
    }

    /**
     * Persist the events array to localStorage.
     */
    function saveEvents() {
        localStorage.setItem(storageKey, JSON.stringify(events));
    }

    /**
     * Generate a simple unique identifier.
     * @returns {string}
     */
    function generateId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Format a timestamp into a human readable string using the
     * browser’s locale.
     * @param {number} ts
     * @returns {string}
     */
    function formatDate(ts) {
        const date = new Date(ts);
        return date.toLocaleString();
    }

    /**
     * Convert a duration in milliseconds into a compact human
     * readable format (e.g. “1h 30m”). If the duration is less than
     * one hour it will still show minutes.
     * @param {number} ms
     * @returns {string}
     */
    function formatDuration(ms) {
        const hours = Math.floor(ms / (1000 * 60 * 60));
        const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
        const parts = [];
        if (hours) parts.push(`${hours}h`);
        // Always show minutes, even if 0, when hours are present
        if (minutes || !hours) parts.push(`${minutes}m`);
        return parts.join(' ');
    }

    /**
     * Determine whether an event is overdue (unresolved after a
     * configurable threshold). In this implementation the threshold
     * is 12 hours for demonstration purposes.
     * @param {Object} event
     * @returns {boolean}
     */
    function isOverdue(event) {
        const thresholdHours = 12;
        const now = Date.now();
        return event.status === 'Open' && (now - event.eventTime > thresholdHours * 60 * 60 * 1000);
    }

    /**
     * Compute the average response time across all closed events.
     * Returns null when no responses exist.
     * @returns {number|null}
     */
    function calcAverageResponse() {
        const responded = events.filter(e => e.responseTime);
        if (responded.length === 0) return null;
        const durations = responded.map(e => e.responseTime - e.eventTime);
        const totalDuration = durations.reduce((a, b) => a + b, 0);
        return totalDuration / responded.length;
    }

    /**
     * Render the statistics cards based on current events.
     */
    function renderStats() {
        const total = events.length;
        const openCount = events.filter(e => e.status === 'Open').length;
        const closedCount = total - openCount;
        const overdueCount = events.filter(e => isOverdue(e)).length;
        const avgResponse = calcAverageResponse();

        document.getElementById('totalEvents').textContent = total;
        document.getElementById('openEvents').textContent = openCount;
        document.getElementById('closedEvents').textContent = closedCount;
        document.getElementById('overdueEvents').textContent = overdueCount;
        document.getElementById('avgResponse').textContent = avgResponse ? formatDuration(avgResponse) : 'N/A';
    }

    /**
     * Render the event table applying sort and filters.
     */
    function renderTable() {
        const tbody = document.querySelector('#eventTable tbody');
        tbody.innerHTML = '';
        const filterVal = document.getElementById('filterSelect').value;
        let display = [...events];
        // Sort descending by event time
        display.sort((a, b) => b.eventTime - a.eventTime);
        if (filterVal !== 'All') {
            display = display.filter(e => e.eventType === filterVal);
        }
        display.forEach(event => {
            const tr = document.createElement('tr');
            if (event.status === 'Closed') tr.classList.add('closed');
            if (isOverdue(event)) tr.classList.add('alert');
            tr.innerHTML = `
                <td>${escapeHtml(event.employeeName)}</td>
                <td>${escapeHtml(event.eventType)}</td>
                <td>${formatDate(event.eventTime)}</td>
                <td>${escapeHtml(event.description)}</td>
                <td>${event.status === 'Closed' ? formatDuration(event.responseTime - event.eventTime) : '-'}</td>
                <td>${event.status === 'Closed' ? escapeHtml(event.resolution) : '-'}</td>
                <td>
                    ${event.status === 'Open' ? `<button class="respond${isOverdue(event) ? ' overdue' : ''}" data-id="${event.id}">${isOverdue(event) ? 'Respond (Overdue)' : 'Respond'}</button>` : ''}
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    /**
     * Handle a user closing (responding to) an event.  Prompts for a
     * resolution and updates the record.
     * @param {string} id
     */
    function handleRespond(id) {
        const event = events.find(ev => ev.id === id);
        if (!event) return;
        const resolution = prompt('Enter resolution/response:');
        if (resolution === null) return; // user cancelled
        event.responseTime = Date.now();
        event.status = 'Closed';
        event.resolution = resolution.trim();
        saveEvents();
        renderStats();
        renderTable();
    }

    /**
     * Open the modal for creating a new event.
     */
    function openModal() {
        document.getElementById('modal').style.display = 'flex';
    }

    /**
     * Close the modal and reset the form.
     */
    function closeModal() {
        document.getElementById('modal').style.display = 'none';
        document.getElementById('eventForm').reset();
    }

    // Initialise events
    let events = loadEvents();
    // Save initial state in case sample data was loaded
    saveEvents();

    // Render initial UI
    renderStats();
    renderTable();

    // Event listeners
    document.getElementById('addEventBtn').addEventListener('click', openModal);
    document.getElementById('cancelBtn').addEventListener('click', closeModal);
    document.getElementById('filterSelect').addEventListener('change', () => {
        renderTable();
    });
    document.querySelector('#eventForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const form = e.target;
        const employeeName = form.employeeName.value.trim();
        const eventType = form.eventType.value;
        const description = form.description.value.trim();
        const eventTimeInput = form.eventTime.value;
        const eventTime = eventTimeInput ? new Date(eventTimeInput).getTime() : Date.now();
        if (!employeeName || !description) {
            alert('Employee name and description are required.');
            return;
        }
        const newEvent = {
            id: generateId(),
            employeeName,
            eventType,
            description,
            eventTime,
            status: 'Open',
            responseTime: null,
            resolution: ''
        };
        events.push(newEvent);
        saveEvents();
        form.reset();
        closeModal();
        renderStats();
        renderTable();
    });
    /* EASTER EGG: triple-click the footer ant -> DoubleA's fine print. Harmless; touches no events. */
    let crewEggClicks = 0, crewEggTimer = null;
    const crewAnt = document.getElementById('crewAnt');
    if (crewAnt) {
        crewAnt.addEventListener('click', () => {
            crewEggClicks++;
            clearTimeout(crewEggTimer);
            crewEggTimer = setTimeout(() => { crewEggClicks = 0; }, 2000);
            if (crewEggClicks >= 3) {
                crewEggClicks = 0;
                document.getElementById('crewEgg').classList.toggle('hidden');
            }
        });
    }

    // Delegate respond button clicks
    document.querySelector('#eventTable tbody').addEventListener('click', (e) => {
        const btn = e.target;
        if (btn.matches('button.respond')) {
            const id = btn.getAttribute('data-id');
            handleRespond(id);
        }
    });
});