import type { Grant, Membrane, Note, Source, VoiceChoice } from "./types.ts";

let n = 0;
export function nid(prefix: string) {
  n += 1;
  return prefix + "-" + n + "-" + Math.random().toString(36).slice(2, 8);
}

export function blankGrants(): Record<Grant, boolean> {
  return { device: false, photos: false, videos: false, pdfs: false, screen: false, "private-docs": false };
}

export function blankVoice(): VoiceChoice {
  return { gender: "female", english: "clear", customVoiceId: "" };
}

export function blankMembrane(): Membrane {
  return {
    learner: "",
    device: null,
    grants: blankGrants(),
    voice: blankVoice(),
    sources: [],
    notes: [],
    plan: null,
  };
}

export function remember(m: Membrane, note: Omit<Note, "id">): Membrane {
  const next: Note = { id: nid("note"), ...note };
  return { ...m, notes: [...m.notes, next].slice(-24) };
}

export function addSource(m: Membrane, source: Source): Membrane {
  return remember(
    { ...m, sources: [...m.sources, source].slice(-12), plan: null },
    { kind: "source", text: sourceLabel(source) },
  );
}

export function sourceLabel(source: Source) {
  if (source.kind === "text") return "Text: " + source.title;
  if (source.kind === "pdf") return "PDF: " + source.name;
  if (source.kind === "photo") return "Photo: " + source.name;
  if (source.kind === "clip") return "Clip: " + source.name;
  if (source.kind === "website") return "Website: " + source.url;
  return "Software: " + source.name;
}
