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
