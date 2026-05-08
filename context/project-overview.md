# This Could Have Been an Email
> A live meeting cost counter that shows what a meeting is really costing the company — and what you could have bought instead.
---
## Project Description

This Could Have Been an Email is a lightweight, no-backend web app that calculates and displays the real-time cost of a meeting based on the number of attendees and their average seniority. The cost is anchored to a start timestamp encoded in the URL, meaning the counter is always accurate regardless of whether the tab was backgrounded, the phone was locked, or someone opens a shared link 20 minutes late. When the meeting ends, it generates a receipt showing what that money could have bought instead.

---
## Core Requirements
- **No backend or database** — all state lives in the URL
- **Encoded URL** — parameters are base64url-encoded, not readable query strings
- **Time-anchored calculation** — cost is always computed as `(now − startTime) × costPerSecond`, never accumulated in memory
- **Accurate across sleep/background** — works correctly whether the device is locked, the tab is hidden, or the link is opened hours later
- **Smooth animation** — `requestAnimationFrame` lerps the displayed value toward the true value each frame so the counter always looks like it's counting up smoothly
- **Fully shareable** — a single URL captures the full meeting state (name, attendees, seniority, start time, and optionally end time)
- **Salary estimation only** — no exact salaries, just seniority tiers mapped to approximate averages
- **Configurable** - All hardcoded values: seniority tiers, cost comparisons, etc should be easily changed to add/update/remove items without having to change other code elsewhere
- **Design** - Minimal but mocking corporate environments.  Screen 3/3 should look like 
---

## URL Encoding
All meeting state is stored as a JSON object, base64url-encoded into a single `?m=` query parameter.
| Key | Description |
|-----|-------------|
| `t` | Start timestamp (Unix ms) |
| `a` | Number of attendees |
| `s` | Average salary (derived from seniority tier) |
| `e` | End timestamp (Unix ms) — present only after meeting ends |
| `n` | Meeting name (optional) |

When `e` is present, the app renders the frozen end screen. When absent, it renders the live counter from `t` to now.
---

## Seniority Tiers
| Label | Assumed Salary |
|-------|---------------|
| Junior | $65,000 |
| Mid | $110,000 |
| Senior | $160,000 |
| Exec | $260,000 |

Cost per second = `(salary / 2,080 hrs / 3,600 sec) × attendees`
---
## Screens
### Screen 1 — Start Meeting

The setup screen. Shown on first load when no URL params are present.

**Fields**
- Meeting name — optional free-text input, max 60 characters
- Number of attendees — numeric input with +/− stepper, range 1–99
- Average seniority — 4-button selector (Junior / Mid / Senior / Exec) with salary hint shown below

**Actions**

- Start — transitions to Screen 2, sets start timestamp, updates URL

---

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

### Screen 3 — Meeting Ended

The summary and receipt screen. Shown after ending a meeting, or when opening a URL that contains an end timestamp.

**Display**

*Header*
- "Meeting ended" label
- Meeting name (if provided)
- Final cost — large monospace total

*Stats bar*
- Duration
- Attendees
- Cost per minute
- Seniority tier

*Receipt*
- Styled as a thermal receipt with jagged tear edges top and bottom
- Header: "Instead of this meeting, you could have bought…"
- Line items: each item is a standalone alternative (not a combination), separated by "— or —"
- Each line shows: item name, quantity and unit price in format `(1,240 @ $2.00)`, and total value
- Up to 6 items, sorted by total value descending
- Footer: timestamp + "Thank you for attending · Please come again"

**Actions**

- New meeting — clears all state, returns to Screen 1
- Share icon — copies the frozen receipt URL to clipboard
 

## Receipt Items
I want this to be a constant so I can easily add / take away items for comparison
Items used for the receipt comparisons, sorted by price:
| Item | Price |
|------|-------|
| Costco hot dog & soda | $1.50 |
| Lottery ticket | $2.00 |
| Cup of coffee | $5.50 |
| Chipotle burrito | $10.50 |
| Movie ticket | $15.00 |
| Paperback book | $16.00 |
| Cocktail at a bar | $18.00 |
| Pizza delivery | $22.00 |
| Tank of gas | $55.00 |
| Nintendo Switch game | $60.00 |
| Costco membership (year) | $65.00 |
| Spotify Premium (year) | $99.00 |
| Hotel night (budget) | $110.00 |
| AirPods | $129.00 |
| Fancy dinner for two | $160.00 |
| Flight to Vegas | $220.00 |
| Netflix (year) | $264.00 |
| Weekend Airbnb | $340.00 |
| Round-trip flight (domestic) | $380.00 |
| PS5 | $499.00 |
| MacBook Air | $1,099.00 |
| Month of rent (avg US) | $1,500.00 |
| Used car | $8,000.00 |

Receipt items are selected by quantity affordable at the final meeting cost, sorted by total value, limited to 6 lines.
