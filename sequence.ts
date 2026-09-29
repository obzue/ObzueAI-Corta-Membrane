import { PLACE } from "./place.ts";
import type { Membrane } from "./types.ts";
import { ENGLANDS, resolveVoice, VOICE_SYNTHESIS } from "./voices.ts";

export type StepState = "done" | "now" | "ahead";

export type CoreStep = {
  id: "obzue" | "greeting" | "consent" | "voice" | "memory" | "intake" | "script" | "reason" | "host";
  name: string;
  holds: string;
  state: StepState;
};

const NAMES = ["ObzueAI", "Greeting", "Consent", "Voice", "Memory", "Intake", "Script", "Reason", "Host"] as const;

/** Membrane core only. Not Matrix, not Cortex, not the companion desk. */
export function coreSequence(m: Membrane): CoreStep[] {
  const voice = resolveVoice(m.voice);
  const caribbean = ENGLANDS.some((row) => row.caribbean && row.id === m.voice.english);
  const flags = [
    true,
    m.device !== null,
    m.grants.device,
    !caribbean || voice.performs,
    m.learner.trim().length > 0 || m.notes.length > 0,
    m.sources.length > 0,
    m.plan !== null,
    m.notes.some((note) => note.kind === "exchange"),
    !!m.plan && m.plan.beats.length > 0 && m.plan.blocked.length === 0,
  ];
  const open = flags.findIndex((ok) => !ok);
  const holds = [
    PLACE.line,
    "She asks which device the lesson runs on: desktop, tablet, Android, or iOS.",
    "Full control is a grant, not a grab. Photos, clips, PDFs, and screen record are separate asks. Private documents stay off.",
    VOICE_SYNTHESIS.finding,
    "Memory keeps the learner, the miss, the source, the grant, and the exchange. She does not read the device by herself.",
    "She scans only what you hand her: text, a PDF, a photo, a clip, a website, or software.",
    "The scan becomes a script and a clip list. A blocked step is written down, not skipped in silence.",
    "She answers from memory, and she asks one question when a fact is missing.",
    "The new app may open software, open a site, or show a recording mark only when the gate allows it. This web desk only proposes the step.",
  ];
  const ids = ["obzue", "greeting", "consent", "voice", "memory", "intake", "script", "reason", "host"] as const;
  return ids.map((id, i) => ({
    id,
    name: NAMES[i],
    holds: holds[i],
    state: flags[i] ? "done" : open === i ? "now" : "ahead",
  }));
}
