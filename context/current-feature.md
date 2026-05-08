# Current Feature: Meeting Ended (Screen 3)

## Status
In Progress

## Goals
- Render the Meeting Ended screen when the decoded meeting state contains an end timestamp (`e`)
- Display "Meeting ended", optional meeting name, and final frozen total cost
- Show stats bar with duration, attendees, cost per minute, and inferred seniority tier
- Render receipt view styled like `context/screenshots/Receipt.png` with thermal/jagged top and bottom edges
- Generate up to 6 receipt line items from constants, sorted by total value descending, with "— or —" separators
- Add receipt footer timestamp and "Thank you for attending · Please come again"
- Provide actions for New meeting (clear state, return to Screen 1) and Share (copy frozen URL)

## Notes
- Use existing `RECEIPT_ITEMS` constants; each item is a standalone alternative, not combined bundles
- Receipt rows should show item name, quantity + unit price `(qty @ $unit)`, and total value
- Receipt quantities are based on the frozen final meeting cost at end time (`e`), not current wall-clock time
- Screen should also render when opening a shared URL that already includes an `e` timestamp

## History
- Start Meeting (Screen 1): Implemented the setup screen with editable meeting inputs, URL-encoded meeting state, and screenshot-aligned styling.
- Meeting in Progress (Screen 2): Implemented the live counter screen with wall-clock math, real-time actions, hydration-safe rendering, and screenshot-aligned UI.
