# Field Crew Event Dashboard

Track crew events — resignations, no-call/no-shows, policy violations,
attendance issues — from one page. Add an event, respond to it with a
resolution, filter by type, watch the stats (total / open / closed /
overdue / average response time).

## Local only

Everything is stored in the browser's localStorage (`dashboardEvents` key).
There is no account, no backend, and nothing leaves the device. Each
browser keeps its own copy of the events.

## First run

The first visit seeds 4 sample events with fictional names (John Doe,
Alice Smith, Bob Johnson, Maya Patel) so the stats and table are visible
right away. Add your own events and the samples stay until you clear the
browser's site data — they are clearly labeled as samples on the page.

## Files

- `index.html` — the dashboard page
- `style.css` — NEXUS dark theme
- `script.js` — all client-side logic (load/save, stats, table, filter,
  add/respond)
- `icons/` — custom icon set, `manifest.json` — PWA manifest
