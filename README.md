# Field Crew Event Dashboard

Track crew events — resignations, no-call/no-shows, policy violations, attendance issues — from one page. Add an event, respond to it with a resolution, filter by type, watch the stats (total / open / closed / overdue / average response time).

Live: https://field-crew-event-dashboard.netlify.app/

## How to use

1. Open the live site — the stats at the top show total, open, closed, overdue events, and average response time.
2. Click **Add Event**, fill in the name, type, and what happened, and save. It lands in the table right away.
3. Use **Filter by Type** to narrow the table to one kind of event.
4. When an event is handled, click **Respond**, type the resolution, and it closes with a response time.
5. Overdue means open for more than 12 hours — those rows flag themselves.

## Local only

Everything is stored in the browser's localStorage (`dashboardEvents` key). There is no account, no backend, and nothing leaves the device. Each browser keeps its own copy of the events.

## First run

The first visit seeds 4 sample events with fictional names (John Doe, Alice Smith, Bob Johnson, Maya Patel) so the stats and table are visible right away. Add your own events and the samples stay until you clear the browser's site data — they are clearly labeled as samples on the page.

## Files

- `index.html` — the dashboard page
- `style.css` — NEXUS dark theme
- `script.js` — all client-side logic (load/save, stats, table, filter, add/respond)
- `icons/` — custom icon set, `manifest.json` — PWA manifest

## Links

- Live site: https://field-crew-event-dashboard.netlify.app/
- NEXUS World Hub: https://nexus-world-hub.netlify.app/
- Repo: https://github.com/AntManThePro/field-crew-event-dashboard
