# Current Feature: Optional Past Duration on Start Screen

## Status
In Progress

## Goals
- Add optional duration inputs on Screen 1 for meetings that already ended (hours and minutes)
- Keep duration fields optional so normal "start now" behavior still works without filling them
- When duration is provided, submit should create a completed meeting payload and go directly to Screen 3
- Ensure the generated URL includes both `t` and `e` so the receipt is deterministic and shareable
- Preserve existing Screen 1 styling/flow while adding the new optional controls clearly

## Notes
- Duration represents elapsed meeting length prior to now; derive `t` from `Date.now() - durationMs` and set `e = Date.now()`
- Validate and sanitize hours/minutes input (non-negative, minute normalization) before encoding
- If optional duration is blank/zero, continue existing behavior and route to Screen 2

## History
- Start Meeting (Screen 1): Implemented the setup screen with editable meeting inputs, URL-encoded meeting state, and screenshot-aligned styling.
- Meeting in Progress (Screen 2): Implemented the live counter screen with wall-clock math, real-time actions, hydration-safe rendering, and screenshot-aligned UI.
- Meeting Ended (Screen 3): Implemented the frozen receipt screen with final-cost calculations, alternatives list, and shared visual framing across all steps.
- Fix Mobile View: Improved responsive layout and spacing across all screens to avoid clipped content and reduce small-screen overflow.
