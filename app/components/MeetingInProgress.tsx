"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { RECEIPT_ITEMS, SENIORITY_ORDER, SENIORITY_TIERS } from "../lib/constants";
import { costPerSecond, encodeMeeting, type MeetingState } from "../lib/meeting";

interface MeetingInProgressProps {
  meeting: MeetingState;
}

function formatMoney(value: number): string {
  return `$${value.toFixed(2)}`;
}

function formatDuration(totalSeconds: number): string {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const hh = Math.floor(seconds / 3600);
  const mm = Math.floor((seconds % 3600) / 60);
  const ss = seconds % 60;

  if (hh > 0) {
    return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
  }

  return `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
}

function inferSeniorityLabel(salary: number): string {
  return SENIORITY_ORDER.reduce((closest, level) => {
    const currentDiff = Math.abs(SENIORITY_TIERS[level].salary - salary);
    const closestDiff = Math.abs(SENIORITY_TIERS[closest].salary - salary);
    return currentDiff < closestDiff ? level : closest;
  }, SENIORITY_ORDER[0]);
}

function contextualComparison(totalCost: number): string {
  const firstReceiptItem = RECEIPT_ITEMS[0]?.name ?? "receipt item";

  if (totalCost < 2) {
    return `not even a single ${firstReceiptItem}`;
  }

  const byPriceDesc = [...RECEIPT_ITEMS].sort((a, b) => b.price - a.price);
  const affordable = byPriceDesc.find((item) => totalCost >= item.price);
  if (!affordable) {
    return `not even a single ${firstReceiptItem}`;
  }

  const quantity = Math.floor(totalCost / affordable.price);
  if (quantity <= 1) {
    return `about one ${affordable.name}`;
  }

  return `about ${quantity.toLocaleString()} ${affordable.name}s`;
}

export default function MeetingInProgress({ meeting }: MeetingInProgressProps) {
  const router = useRouter();
  const cps = useMemo(() => costPerSecond(meeting.s, meeting.a), [meeting.s, meeting.a]);
  const [nowMs, setNowMs] = useState(meeting.t);
  const [displayCost, setDisplayCost] = useState(0);
  const [shareCopied, setShareCopied] = useState(false);
  const trueCost = Math.max(0, ((nowMs - meeting.t) / 1000) * cps);

  useEffect(() => {
    let rafId = 0;
    let mounted = true;

    const tick = () => {
      const now = Date.now();
      const currentTrueCost = Math.max(0, ((now - meeting.t) / 1000) * cps);
      setNowMs(now);
      setDisplayCost((prev) => {
        const diff = currentTrueCost - prev;
        if (Math.abs(diff) > 250) {
          return currentTrueCost;
        }
        return prev + diff * 0.14;
      });
      if (mounted) {
        rafId = requestAnimationFrame(tick);
      }
    };

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        const now = Date.now();
        setNowMs(now);
        setDisplayCost(Math.max(0, ((now - meeting.t) / 1000) * cps));
      }
    };

    rafId = requestAnimationFrame(tick);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      mounted = false;
      cancelAnimationFrame(rafId);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [meeting.t, cps]);

  useEffect(() => {
    if (!shareCopied) {
      return;
    }
    const timeout = window.setTimeout(() => setShareCopied(false), 1200);
    return () => window.clearTimeout(timeout);
  }, [shareCopied]);

  async function handleShare() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareCopied(true);
    } catch {
      setShareCopied(false);
    }
  }

  function handleEndMeeting() {
    const endedMeeting: MeetingState = {
      ...meeting,
      e: Date.now(),
    };
    router.push(`/?m=${encodeMeeting(endedMeeting)}`);
  }

  function handleRefreshCounter() {
    const now = Date.now();
    setNowMs(now);
    setDisplayCost(Math.max(0, ((now - meeting.t) / 1000) * cps));
  }

  return (
    <div className="min-h-screen bg-[#eceae2] px-2 py-8 text-[#1f1f1d] md:px-6">
      <div className="mx-auto w-full max-w-[1020px]">
        <div className="mb-7 flex items-center justify-between border-b border-dashed border-[#d4d1c9] pb-6">
          <p className="flex items-center gap-3 font-mono text-[12px] uppercase tracking-[0.32em] text-[#2d2d2a]">
            <span className="h-2.5 w-2.5 rounded-[3px] bg-[#1b1b19]" />
            This Could Have Been An Email
          </p>
          <p className="font-mono text-[12px] uppercase tracking-[0.24em] text-[#76736d]">
            2026.05.08 · No. 9835
          </p>
        </div>

        <div className="rounded-[18px] border border-[#cbc8bf] bg-[#f2f0e8] p-10 shadow-[0_8px_18px_rgba(31,31,29,0.08)]">
          <div className="mb-10 flex items-start justify-between">
            <div className="flex items-center gap-3 rounded-full bg-[#efd9d4] px-4 py-2 font-mono text-[12px] uppercase tracking-[0.3em] text-[#a54040]">
              <span className="relative h-2.5 w-2.5">
                <span className="absolute inset-0 animate-ping rounded-full bg-[#1b1b19]/45" />
                <span className="absolute inset-0 rounded-full bg-[#1b1b19]" />
              </span>
              <span>Meeting in progress</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleShare}
                className={`h-12 w-12 rounded-[12px] border text-lg transition-colors ${
                  shareCopied
                    ? "border-[#2e7d32] bg-[#e8f5e9] text-[#2e7d32]"
                    : "border-[#c9c5bb] bg-[#f7f5ef] text-[#4f4c46] hover:bg-[#ece9e1]"
                }`}
                title="Copy share link"
                aria-label="Copy share link"
              >
                ⧉
              </button>
              <button
                onClick={handleRefreshCounter}
                className="h-12 w-12 rounded-[12px] border border-[#c9c5bb] bg-[#f7f5ef] text-lg text-[#4f4c46] transition-colors hover:bg-[#ece9e1]"
                title="Refresh counter"
                aria-label="Refresh counter"
              >
                ↻
              </button>
            </div>
          </div>

          <p className="mb-2 font-mono text-[13px] uppercase tracking-[0.28em] text-[#7f7a73]">
            Burning, in real time
          </p>
          {meeting.n ? <p className="mb-3 text-sm text-[#6c6861]">{meeting.n}</p> : null}

          <p className="font-mono leading-none text-[#161513]">
            <span className="align-top text-[48px] text-[#3d3a35]">$</span>
            <span className="text-[112px] font-semibold">{Math.floor(displayCost)}</span>
            <span className="text-[56px] text-[#3d3a35]">.{String(Math.floor((displayCost % 1) * 100)).padStart(2, "0")}</span>
          </p>

          <p className="mt-2 font-mono text-[28px] text-[#4d4a44]">
            {formatMoney(cps * 60)} / min · {formatMoney(cps * 3600)} / hr
          </p>

          <div className="mt-6 grid grid-cols-3 overflow-hidden rounded-[16px] border border-[#ccc8be] bg-[#f7f5ef]">
            <div className="border-r border-dashed border-[#d2cec4] px-6 py-5">
              <p className="font-mono text-xs uppercase tracking-[0.26em] text-[#7a756d]">Duration</p>
              <p className="mt-2 font-mono text-[22px] font-semibold text-[#1e1d1b]">
                {formatDuration((nowMs - meeting.t) / 1000)}
              </p>
            </div>
            <div className="border-r border-dashed border-[#d2cec4] px-6 py-5">
              <p className="font-mono text-xs uppercase tracking-[0.26em] text-[#7a756d]">Attendees</p>
              <p className="mt-2 font-mono text-[22px] font-semibold text-[#1e1d1b]">{meeting.a}</p>
            </div>
            <div className="px-6 py-5">
              <p className="font-mono text-xs uppercase tracking-[0.26em] text-[#7a756d]">Seniority</p>
              <p className="mt-2 font-mono text-[22px] font-semibold text-[#1e1d1b]">
                {inferSeniorityLabel(meeting.s)}
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center rounded-[12px] bg-[#dfdbd0] px-4 py-3 text-[#2a2926]">
            <span className="mr-3 text-[24px] leading-none">≈</span>
            <p className="text-[14px]">
              <span className="text-[#6a655d]">That&apos;s</span>{" "}
              <span className="font-semibold">{contextualComparison(trueCost)}</span>.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-[1fr_auto] gap-3">
            <button
              onClick={handleEndMeeting}
              className="rounded-[14px] bg-[#181715] px-6 py-4 text-[16px] font-semibold uppercase tracking-[0.04em] text-[#efede6] transition-colors hover:bg-[#23211f]"
            >
              End Meeting
            </button>
            <button
              onClick={() => router.push("/")}
              className="rounded-[14px] border border-[#c9c5bb] bg-[#f7f5ef] px-7 py-4 text-[16px] font-semibold text-[#4f4c46] transition-colors hover:bg-[#ece9e1]"
            >
              Discard
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 flex w-full max-w-[1020px] items-center justify-between border-t border-dashed border-[#d4d1c9] pt-5">
        <p className="font-mono text-xs uppercase tracking-[0.24em] text-[#726f68]">State lives in the URL</p>
        <p className="font-mono text-xs uppercase tracking-[0.24em] text-[#726f68]">Anchored to wall-clock</p>
      </div>
    </div>
  );
}
