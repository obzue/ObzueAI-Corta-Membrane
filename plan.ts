import { gate } from "./consent.ts";
import type { LessonPlan, Membrane } from "./types.ts";

export function buildPlan(m: Membrane): LessonPlan {
  const blocked: string[] = [];
  const questions: string[] = [];
  const beats: LessonPlan["beats"] = [];

  if (!m.device) questions.push("Which device should I take: desktop, tablet, Android, or iOS?");
  else if (!m.grants.device) {
    blocked.push("Device control is off. I will not open apps or websites.");
    questions.push("May I take control of this " + m.device + " to teach?");
  }
  if (!m.sources.length) {
    questions.push("What should I teach? Give me text, a PDF, a photo, a clip, a website, or software.");
  }

  for (const source of m.sources) {
    if (source.kind === "text" || source.kind === "pdf") {
      if (source.kind === "pdf" && !m.grants.pdfs) {
        blocked.push("PDF " + source.name + " is waiting. Allow PDFs.");
        continue;
      }
      const excerpt = source.text.trim().slice(0, 180);
      if (!excerpt) {
        questions.push("That " + source.kind + " has no text yet. Paste the part I should teach.");
        continue;
      }
      beats.push({
        id: "read-" + source.id,
        say: "I scanned this. The part I will teach is: " + excerpt,
        action: { type: "show", sourceId: source.id },
      });
    } else if (source.kind === "website") {
      const action = { type: "open-url" as const, url: source.url };
      const allowed = gate(action, m);
      if (!allowed.ok) {
        blocked.push(source.url + " \u2014 " + allowed.reason);
        continue;
      }
      beats.push({
        id: "web-" + source.id,
        say: "I am opening " + source.url + ". Watch the page with me. " + (source.note || ""),
        action,
      });
      if (m.grants.screen) {
        beats.push({
          id: "rec-" + source.id,
          say: "The screen record is on, and you can see it. Say stop and I stop.",
          action: { type: "screen-record", on: true },
        });
      } else {
        questions.push("Should I record the screen while I teach " + source.url + "?");
      }
    } else if (source.kind === "software") {
      const action = { type: "open-app" as const, name: source.name };
      const allowed = gate(action, m);
      if (!allowed.ok) {
        blocked.push(source.name + " \u2014 " + allowed.reason);
        continue;
      }
      beats.push({
        id: "app-" + source.id,
        say: "I am opening " + source.name + ". I will not open software you did not name. " + (source.note || ""),
        action,
      });
    } else if (source.kind === "photo" || source.kind === "clip") {
      const action = { type: "show" as const, sourceId: source.id };
      const allowed = gate(action, m);
      if (!allowed.ok) {
        blocked.push(source.name + " \u2014 " + allowed.reason);
        continue;
      }
      beats.push({
        id: source.kind + "-" + source.id,
        say: "I have " + source.name + ". " + (source.note || "Tell me what a learner should notice."),
        action,
      });
    }
  }

  if (beats.length) {
    beats.push({
      id: "close",
      say: "That is the class. Tell me the step you missed. I will keep it.",
      action: { type: "wait-for-learner" },
    });
  }

  return {
    title: (m.learner || "Learner") + " \u2014 instruction",
    beats,
    clips: beats.map((b) => ({ id: b.id, title: b.id, say: b.say })),
    blocked,
    questions,
  };
}
