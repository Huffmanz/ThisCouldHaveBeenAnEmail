export interface MeetingState {
  t: number;        // start timestamp (Unix ms)
  a: number;        // attendees
  s: number;        // salary (annual)
  e?: number;       // end timestamp (Unix ms)
  n?: string;       // meeting name
}

export function encodeMeeting(state: MeetingState): string {
  const json = JSON.stringify(state);
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeMeeting(param: string): MeetingState | null {
  try {
    const base64 = param.replace(/-/g, "+").replace(/_/g, "/");
    const binary = atob(base64);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    const json = new TextDecoder().decode(bytes);
    return JSON.parse(json) as MeetingState;
  } catch {
    return null;
  }
}

export function costPerSecond(salary: number, attendees: number): number {
  return (salary / 2080 / 3600) * attendees;
}
