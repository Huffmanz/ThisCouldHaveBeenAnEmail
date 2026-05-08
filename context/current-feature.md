# Current Feature: Meeting in Progress (Screen 2)

## Status
In Progress

## Goals
- Render the Meeting in Progress screen when a valid in-progress `?m=` meeting payload is present
- Show a pulsing "Meeting in progress" indicator and optional meeting name
- Display a live cost counter with cost-per-minute, duration, attendee count, and seniority tier
- Show a contextual comparison line based on current meeting cost
- Add actions for End, New meeting, and Share with clipboard confirmation behavior
- Ending a meeting should record `e` (end timestamp), freeze totals, and transition toward Screen 3 behavior

## Notes
- Cost must be computed from wall-clock time, not accumulated state: `(now - startTs) * costPerSec`
- Use `requestAnimationFrame` with lerp smoothing so the displayed total animates smoothly
- Handle tab sleep/background resume by snapping back to true computed cost before continuing animation
- Keep URL as source of truth and ensure the running meeting URL remains shareable

## History
- Start Meeting (Screen 1): Implemented the setup screen with editable meeting inputs, URL-encoded meeting state, and screenshot-aligned styling.
