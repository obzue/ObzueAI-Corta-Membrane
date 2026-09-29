import type { Action, DeviceClass, Grant, Membrane } from "./types.ts";

export const DEVICES: { id: DeviceClass; label: string }[] = [
  { id: "desktop", label: "Desktop" },
  { id: "tablet", label: "Tablet" },
  { id: "android", label: "Android" },
  { id: "ios", label: "iOS" },
];

export const GRANTS: { id: Grant; label: string; ask: string }[] = [
  { id: "device", label: "Full device control", ask: "Open apps, software, and websites you name." },
  { id: "photos", label: "Photos", ask: "Use photos you hand over for the lesson." },
  { id: "videos", label: "Video clips", ask: "Use clips you hand over." },
  { id: "pdfs", label: "PDFs", ask: "Read PDFs you hand over." },
  { id: "screen", label: "Screen record", ask: "Record the screen with a visible mark. You can stop it." },
  { id: "private-docs", label: "Private documents", ask: "Stay off unless you allow a named file. Off by default." },
];

export function greeting(m: Membrane) {
  const device = DEVICES.find((d) => d.id === m.device)?.label ?? "device";
  return (
    "I am Corta. Before I teach, I have to ask. May I take control of this " +
    device +
    "? I would open the apps and the websites you name, and I would show each step. I will not open private documents unless you allow that on its own. Photos, video clips, and PDFs only if you hand them to me. If I record the screen, you will see that I am recording, and you can tell me to stop."
  );
}

export function gate(action: Action, m: Membrane): { ok: true } | { ok: false; reason: string } {
  if (action.type === "open-app" || action.type === "open-url") {
    if (!m.grants.device) return { ok: false, reason: "Device control is not allowed." };
    return { ok: true };
  }
  if (action.type === "screen-record") {
    if (!action.on) return { ok: true };
    if (!m.grants.screen) return { ok: false, reason: "Screen recording is not allowed." };
    return { ok: true };
  }
  if (action.type === "show") {
    const source = m.sources.find((s) => s.id === action.sourceId);
    if (!source) return { ok: false, reason: "That source is not in memory." };
    if (source.kind === "photo" && !m.grants.photos) return { ok: false, reason: "Photos are not allowed." };
    if (source.kind === "clip" && !m.grants.videos) return { ok: false, reason: "Video clips are not allowed." };
    if (source.kind === "pdf" && !m.grants.pdfs) return { ok: false, reason: "PDFs are not allowed." };
    return { ok: true };
  }
  return { ok: true };
}
