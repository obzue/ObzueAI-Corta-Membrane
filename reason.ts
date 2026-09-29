import { PLACE } from "./place.ts";
import { resolveVoice } from "./voices.ts";
import type { Membrane } from "./types.ts";

export function reasonMessages(m: Membrane, said: string) {
  const voice = resolveVoice(m.voice);
  const notes = m.notes
    .slice(-8)
    .map((note) => note.kind + ": " + note.text)
    .join("\n");
  const sources = m.sources
    .slice(-6)
    .map((s) => {
      if (s.kind === "text") return "text " + s.title + ": " + s.text.slice(0, 160);
      if (s.kind === "pdf") return "pdf " + s.name + ": " + s.text.slice(0, 160);
      if (s.kind === "website") return "website " + s.url;
      if (s.kind === "software") return "software " + s.name;
      return s.kind + " " + s.name;
    })
    .join("\n");
  const grants = Object.entries(m.grants)
    .filter(([, on]) => on)
    .map(([k]) => k)
    .join(", ");
  return [
    {
      role: "system" as const,
      content:
        "You are Corta's membrane, the instructor brain for ObzueAI Instructor. " +
        PLACE.line +
        " You are caring and firm. You remember what is in the notes. You ask one question when a fact is missing. " +
        "You do not claim you opened a real device. You only propose a next step the host app may run if that grant is on. " +
        "Write clear English. Do not invent dialect spelling. Voice note: " +
        voice.note +
        " Learner: " +
        (m.learner || "unnamed") +
        ". Device: " +
        (m.device ?? "not chosen") +
        ". Grants on: " +
        (grants || "none") +
        ". Sources:\n" +
        (sources || "none") +
        "\nMemory:\n" +
        (notes || "none"),
    },
    { role: "user" as const, content: said.slice(0, 500) },
  ];
}
