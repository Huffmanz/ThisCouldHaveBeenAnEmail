# This Could Have Been an Email

A lightweight meeting-cost calculator that makes the real-time cost of meetings visible, then reframes that spend as tangible alternatives.

## Purpose

This app is designed to answer one question quickly:

**"What is this meeting costing right now?"**

It computes meeting cost from wall-clock time, attendee count, and estimated seniority salary tiers, then:

- shows a live running total while the meeting is in progress
- keeps meeting state fully shareable via a single encoded URL
- generates an end-of-meeting receipt showing what that money could have bought instead

## How It Works

- No backend or database; all state lives in the URL (`?m=...`)
- Time math is anchored to timestamps (`start` and optional `end`) rather than in-memory counters
- Live screen uses smooth animation while staying accurate after tab sleep/backgrounding
- End screen freezes totals and renders receipt alternatives from configurable constants

## Run Locally

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
```
