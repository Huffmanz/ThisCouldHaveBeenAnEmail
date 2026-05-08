"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SENIORITY_ORDER, SENIORITY_TIERS, type SeniorityLevel } from "../lib/constants";
import { encodeMeeting } from "../lib/meeting";

export default function StartMeeting() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [attendees, setAttendees] = useState(6);
  const [seniority, setSeniority] = useState<SeniorityLevel>("Mid");

  function handleStart() {
    const state = {
      t: Date.now(),
      a: attendees,
      s: SENIORITY_TIERS[seniority].salary,
      ...(name.trim() ? { n: name.trim() } : {}),
    };
    router.push(`/?m=${encodeMeeting(state)}`);
  }

  const salary = SENIORITY_TIERS[seniority].salary;
  const costPerSecond = (salary / 2080 / 3600) * attendees;
  const costPerMinute = (salary / 2080 / 60) * attendees;
  const costPerHour = (salary / 2080) * attendees;
  const halfHourMeeting = costPerHour / 2;

  return (
    <div className="min-h-screen bg-[#eceae2] px-2 py-8 text-[#1f1f1d] md:px-6">
      <div className="mx-auto w-full max-w-[920px]">
        <div className="flex items-center justify-between border-b border-dashed border-[#d4d1c9] pb-6">
          <p className="flex items-center gap-3 font-mono text-[12px] uppercase tracking-[0.32em] text-[#2d2d2a]">
            <span className="h-2.5 w-2.5 rounded-[3px] bg-[#1b1b19]" />
            This Could Have Been An Email
          </p>
          <p className="font-mono text-[12px] uppercase tracking-[0.24em] text-[#76736d]">
            2026.05.08 · No. 9835
          </p>
        </div>

        <div className="mt-7 rounded-[18px] border border-[#cbc8bf] bg-[#f2f0e8] p-8 shadow-[0_8px_18px_rgba(31,31,29,0.08)]">
          <div className="mb-8">
            <p className="font-mono text-xs uppercase tracking-[0.32em] text-[#77736e]">Setup · Step 01</p>
            <h1 className="mt-3 text-[52px] font-semibold leading-[1.1] tracking-[-0.02em] text-[#1d1d1b]">
              Let&apos;s see what this&apos;ll cost the company.
            </h1>
            <p className="mt-3 max-w-[690px] text-[14px] leading-[1.4] text-[#4c4a45]">
              Set up your meeting and we&apos;ll start a live counter the moment you hit start. Share
              the URL
            </p>
          </div>

          <div className="space-y-7">
            <div>
              <div className="mb-3 flex items-center justify-between">
                <label className="font-mono text-xs uppercase tracking-[0.32em] text-[#52504b]">
                  Meeting Name
                </label>
                <p className="text-[12px] text-[#74716b]">{name.length}/60 · optional</p>
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value.slice(0, 60))}
                placeholder="e.g. Q3 Roadmap Alignment Sync"
                maxLength={60}
                className="h-14 w-full rounded-[14px] border border-[#ccc8be] bg-[#f7f5ef] px-5 text-[14px] text-[#2e2d2a] placeholder:text-[#8a877f] focus:outline-none"
              />
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between">
                <label className="font-mono text-xs uppercase tracking-[0.32em] text-[#52504b]">
                  Attendees
                </label>
                <p className="text-[12px] text-[#74716b]">how many warm bodies</p>
              </div>
              <div className="grid h-14 grid-cols-[60px_1fr_60px] overflow-hidden rounded-[14px] border border-[#ccc8be] bg-[#f7f5ef]">
                <button
                  onClick={() => setAttendees(attendees - 1)}
                  className="border-r border-[#d2cec4] text-3xl font-semibold text-[#1f1f1d] transition-colors hover:bg-[#ede9df]"
                >
                  -
                </button>
                <div className="flex items-center justify-center gap-2 px-4 text-center">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={attendees}
                    onChange={(e) => setAttendees(parseInt(e.target.value, 10) || 0)}
                    className="h-full w-24 bg-transparent text-center text-[32px] font-semibold leading-none tabular-nums text-[#1f1f1d] focus:outline-none"
                    aria-label="Number of attendees"
                  />
                  <span className="font-mono text-xs uppercase tracking-[0.28em] text-[#6d6963]">
                    people
                  </span>
                </div>
                <button
                  onClick={() => setAttendees(attendees + 1)}
                  className="border-l border-[#d2cec4] text-3xl font-semibold text-[#1f1f1d] transition-colors hover:bg-[#ede9df]"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between">
                <label className="font-mono text-xs uppercase tracking-[0.32em] text-[#52504b]">
                  Average Seniority
                </label>
                <p className="text-[12px] text-[#74716b]">salary is approximate</p>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {SENIORITY_ORDER.map((level) => (
                  <button
                    key={level}
                    onClick={() => setSeniority(level)}
                    className={`rounded-[14px] border px-3 py-4 text-left transition-colors ${
                      seniority === level
                        ? "border-[#1d1c1a] bg-[#1a1917] text-[#f2efe7]"
                        : "border-[#ccc8be] bg-[#f7f5ef] text-[#1d1d1b] hover:bg-[#ece9e1]"
                    }`}
                  >
                    <p className="text-[15px] font-semibold leading-tight">{level}</p>
                    <p
                      className={`mt-1 font-mono text-[14px] ${
                        seniority === level ? "text-[#c8c5be]" : "text-[#69655e]"
                      }`}
                    >
                      ${Math.round(SENIORITY_TIERS[level].salary / 1000)}k
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[14px] border border-dashed border-[#d8d4ca] bg-[#f8f6f0] px-6 py-5">
              <div className="grid grid-cols-[1fr_auto] gap-y-2">
                <p className="font-mono text-[13px] tracking-[0.06em] text-[#6d6963]">per second</p>
                <p className="font-mono text-[13px] font-semibold text-[#1f1f1d]">${costPerSecond.toFixed(2)}</p>
                <p className="font-mono text-[13px] tracking-[0.06em] text-[#6d6963]">per minute</p>
                <p className="font-mono text-[13px] font-semibold text-[#1f1f1d]">${costPerMinute.toFixed(2)}</p>
                <p className="font-mono text-[13px] tracking-[0.06em] text-[#6d6963]">per hour</p>
                <p className="font-mono text-[13px] font-semibold text-[#1f1f1d]">${costPerHour.toFixed(2)}</p>
                <p className="font-mono text-[13px] tracking-[0.06em] text-[#6d6963]">30 min meeting</p>
                <p className="font-mono text-[13px] font-semibold text-[#1f1f1d]">${halfHourMeeting.toFixed(2)}</p>
              </div>
            </div>

            <button
              onClick={handleStart}
              className="h-[68px] w-full rounded-[14px] bg-[#181715] text-[16px] font-semibold text-[#efede6] shadow-[0_8px_16px_rgba(23,22,20,0.18)] transition-colors hover:bg-[#23211f]"
            >
              Start Meeting →
            </button>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-between border-t border-dashed border-[#d4d1c9] pt-5">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-[#726f68]">
            State lives in the URL
          </p>
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-[#726f68]">

          </p>
        </div>
      </div>
    </div>
  );
}
