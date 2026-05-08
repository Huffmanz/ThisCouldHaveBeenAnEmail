
### Screen 2 — Meeting in Progress
The live counter screen. Shown while a meeting is running.

**Display**

- Pulsing red dot + "Meeting in progress" indicator
- Meeting name (if provided)
- Live cost counter — large monospace display, smoothly animating via rAF lerp
- Cost per minute label
- Duration clock (MM:SS or HH:MM:SS)
- Attendee count
- Seniority tier
- Contextual comparison line — e.g. "That's a tank of gas"

**Actions**

- End — freezes the counter, records end timestamp, transitions to Screen 3, updates URL with `e` param
- New meeting — discards current meeting, returns to Screen 1
- Share icon — copies the current live URL to clipboard; icon turns green briefly to confirm

**Technical**
- `requestAnimationFrame` loop lerps displayed value toward `(now − startTs) × costPerSec`
- Tab/device sleep is handled correctly — on resume, value snaps to true calculated amount and resumes smooth animation
- URL is updated on start so the link is shareable before the meeting ends
---