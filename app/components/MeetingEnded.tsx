"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { RECEIPT_ITEMS } from "../lib/constants";
import { costPerSecond, type MeetingState } from "../lib/meeting";

interface MeetingEndedProps {
  meeting: MeetingState;
}

interface ReceiptLine {
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
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

function getReceiptLines(totalCost: number): ReceiptLine[] {
  const lines = RECEIPT_ITEMS.map((item) => {
    const quantity = Math.floor(totalCost / item.price);
    return {
      name: item.name,
      quantity,
      unitPrice: item.price,
      total: quantity * item.price,
    };
  })
    .filter((line) => line.quantity > 0)
    .sort((a, b) => b.total - a.total)
    .slice(0, 6);

  if (lines.length > 0) {
    return lines;
  }

  const firstItem = RECEIPT_ITEMS[0];
  return [
    {
      name: `Not even a single ${firstItem.name}`,
      quantity: 0,
      unitPrice: firstItem.price,
      total: 0,
    },
  ];
}

export default function MeetingEnded({ meeting }: MeetingEndedProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const endTime = meeting.e ?? meeting.t;
  const cps = costPerSecond(meeting.s, meeting.a);
  const finalCost = Math.max(0, ((endTime - meeting.t) / 1000) * cps);
  const durationSeconds = (endTime - meeting.t) / 1000;
  const receiptLines = useMemo(() => getReceiptLines(finalCost), [finalCost]);
  const receiptTimestamp = new Date(endTime).toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  async function handleShare() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
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

        <div className="rounded-[18px] border border-[#cbc8bf] bg-[#f2f0e8] p-8 shadow-[0_8px_18px_rgba(31,31,29,0.08)]">
          <p className="mb-6 font-mono text-xs uppercase tracking-[0.32em] text-[#77736e]">
            Receipt · Step 03
          </p>

          <div className="flex justify-center">
            <p className="rounded-full bg-[#1a1917] px-5 py-2 font-mono text-xs uppercase tracking-[0.28em] text-[#efede6]">
              • Meeting ended
            </p>
          </div>

          {meeting.n ? <p className="mt-4 text-center text-sm text-[#66625b]">{meeting.n}</p> : null}

          <div className="mt-4 text-center font-mono leading-none text-[#161513]">
            <span className="align-top text-[52px] text-[#3d3a35]">$</span>
            <span className="text-[118px] font-semibold">{Math.floor(finalCost)}</span>
            <span className="text-[58px] text-[#3d3a35]">
              .{String(Math.floor((finalCost % 1) * 100)).padStart(2, "0")}
            </span>
          </div>
          <p className="mt-2 text-center font-mono text-xs uppercase tracking-[0.32em] text-[#76726b]">
            Final cost
          </p>

          <div className="mt-8 grid grid-cols-3 overflow-hidden rounded-[16px] border border-[#ccc8be] bg-[#f7f5ef]">
          <div className="border-r border-dashed border-[#d2cec4] px-5 py-4">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-[#7a756d]">Duration</p>
            <p className="mt-1 font-mono text-[34px] font-semibold text-[#1e1d1b]">{formatDuration(durationSeconds)}</p>
          </div>
          <div className="border-r border-dashed border-[#d2cec4] px-5 py-4">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-[#7a756d]">Attendees</p>
            <p className="mt-1 font-mono text-[34px] font-semibold text-[#1e1d1b]">{meeting.a}</p>
          </div>
            <div className="border-r border-dashed border-[#d2cec4] px-5 py-4">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-[#7a756d]">Per minute</p>
            <p className="mt-1 font-mono text-[34px] font-semibold text-[#1e1d1b]">{formatMoney(cps * 60)}</p>
          </div>
          </div>

          <div className="mt-8 border border-[#e1ddd4] bg-[#fbfaf6]">
          <div className="h-3 bg-[repeating-linear-gradient(-45deg,#f6f3ed_0_6px,#fbfaf6_6px_12px)]" />
          <div className="px-8 py-8">
            <p className="text-center font-mono text-[34px] font-semibold uppercase tracking-[0.26em] text-[#262420]">
              {meeting.n?.trim() ? meeting.n : "Untitled Meeting"}
            </p>
            <p className="mt-2 text-center font-mono text-[13px] text-[#77736d]">Receipt · {receiptTimestamp}</p>

            <div className="my-6 border-t border-dashed border-[#8b8780]" />

            <p className="text-center font-mono text-[17px] text-[#2d2a25]">
              Instead of this meeting, you could have bought…
            </p>

            <div className="mt-6 space-y-4">
              {receiptLines.map((line, idx) => (
                <div key={`${line.name}-${idx}`}>
                  {idx > 0 ? (
                    <p className="mb-2 text-center font-mono text-xs uppercase tracking-[0.24em] text-[#7a756d]">— or —</p>
                  ) : null}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[30px] font-semibold text-[#25231f]">{line.name}</p>
                      {line.quantity > 0 ? (
                        <p className="font-mono text-[13px] text-[#5f5a52]">
                          ({line.quantity.toLocaleString()} @ {formatMoney(line.unitPrice)})
                        </p>
                      ) : (
                        <p className="font-mono text-[13px] text-[#5f5a52]">(this meeting was, in fact, fine)</p>
                      )}
                    </div>
                    <p className="font-mono text-[30px] font-semibold text-[#25231f]">
                      {line.quantity > 0 ? formatMoney(line.total) : "—"}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="my-6 border-t border-dashed border-[#8b8780]" />
            <div className="space-y-1 font-mono text-[14px] text-[#2f2c27]">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>{formatMoney(finalCost)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Regret tax</span>
                <span>incl.</span>
              </div>
            </div>
            <div className="my-2 border-t border-dashed border-[#8b8780]" />
            <div className="flex items-center justify-between">
              <p className="text-[37px] font-semibold text-[#25231f]">Total burned</p>
              <p className="font-mono text-[37px] font-semibold text-[#25231f]">{formatMoney(finalCost)}</p>
            </div>
            <p className="mt-6 text-center font-mono text-xs uppercase tracking-[0.22em] text-[#6e6961]">
              Thank you for attending · Please come again
            </p>
          </div>
          <div className="h-3 bg-[repeating-linear-gradient(-45deg,#f6f3ed_0_6px,#fbfaf6_6px_12px)]" />
          </div>

          <div className="mt-8 grid grid-cols-[1fr_auto] gap-3">
            <button
              onClick={() => router.push("/")}
              className="rounded-[14px] bg-[#181715] px-6 py-4 text-[16px] font-semibold text-[#efede6] transition-colors hover:bg-[#23211f]"
            >
              Start a new meeting →
            </button>
            <button
              onClick={handleShare}
              className={`rounded-[14px] border px-6 py-4 text-[16px] font-semibold transition-colors ${
                copied
                  ? "border-[#2e7d32] bg-[#e8f5e9] text-[#2e7d32]"
                  : "border-[#c9c5bb] bg-[#f7f5ef] text-[#4f4c46] hover:bg-[#ece9e1]"
              }`}
            >
              {copied ? "Copied" : "Share"}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 flex w-full max-w-[1020px] items-center border-t border-dashed border-[#d4d1c9] pt-5">
        <p className="font-mono text-xs uppercase tracking-[0.24em] text-[#726f68]">State lives in the URL</p>
      </div>
    </div>
  );
}
