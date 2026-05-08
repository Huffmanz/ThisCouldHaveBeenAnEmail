# Current Feature: Start Meeting (Screen 1)

## Status
In Progress

## Goals
- Render the setup screen when no URL params are present
- Meeting name field — optional free-text input, max 60 characters
- Number of attendees field — numeric input with +/− stepper, range 1–99
- Average seniority selector — 4-button toggle (Junior / Mid / Senior / Exec) with salary hint displayed below
- Start button — sets start timestamp, base64url-encodes state into `?m=` param, transitions to Screen 2

## Notes
- Screen is shown on first load only (no `?m=` param in URL)
- Seniority tiers map to salary: Junior $65k, Mid $110k, Senior $160k, Exec $260k
- Salary hint below the seniority selector should reflect the selected tier
- All state goes into URL on Start; no backend

## History
