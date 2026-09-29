import type { EnglishId, VoiceChoice } from "./types.ts";

/** What synthesis can and cannot do. Pace tags are not an accent. */
export const VOICE_SYNTHESIS = {
  finding:
    "The speech call is text, a voice id, and language en. There is no accent switch. Documented accents are British (Eve, Leo), Australian male (Rigel), and Indian male (Naksh). Jamaican, Trinidadian, Barbadian, and Guyanese are not voices. A language hint such as en-JM returns audio and does not prove a Caribbean accent. Tags like <slow> and [pause] change pace, not region. A Caribbean voice is a cloned voice id you attach. Until then she speaks clear English.",
};
export const DOCUMENTED = [
  { id: "eve", gender: "female" as const, accent: "British" },
  { id: "leo", gender: "male" as const, accent: "British" },
  { id: "rigel", gender: "male" as const, accent: "Australian" },
  { id: "naksh", gender: "male" as const, accent: "Indian" },
];

export const TEACHER_VOICES = ["luna", "rex", "eve", "leo", "rigel", "naksh", "ara", "sal"] as const;

export const ENGLANDS: { id: EnglishId; label: string; caribbean: boolean }[] = [
  { id: "clear", label: "Clear English", caribbean: false },
  { id: "british", label: "British English", caribbean: false },
  { id: "australian", label: "Australian English", caribbean: false },
  { id: "indian", label: "Indian English", caribbean: false },
  { id: "jamaican", label: "Jamaican English", caribbean: true },
  { id: "trinidadian", label: "Trinidadian English", caribbean: true },
  { id: "barbadian", label: "Barbadian English", caribbean: true },
  { id: "guyanese", label: "Guyanese English", caribbean: true },
];

const CLEAR = { female: "luna", male: "rex" };

export function resolveVoice(choice: VoiceChoice): { voiceId: string; performs: boolean; note: string } {
  const custom = choice.customVoiceId.trim().toLowerCase();
  if (custom && isCustomVoice(custom)) {
    return {
      voiceId: custom,
      performs: true,
      note: "Using the voice id you attached. This membrane does not prove the clone is that English.",
    };
  }
  if (choice.english === "british") {
    return {
      voiceId: choice.gender === "female" ? "eve" : "leo",
      performs: true,
      note: "Eve and Leo are the documented British voices.",
    };
  }
  if (choice.english === "australian" && choice.gender === "male") {
    return { voiceId: "rigel", performs: true, note: "Rigel is the documented Australian voice. There is no female Australian voice in the catalog." };
  }
  if (choice.english === "indian" && choice.gender === "male") {
    return { voiceId: "naksh", performs: true, note: "Naksh is the documented Indian voice. There is no female Indian voice in the catalog." };
  }
  const caribbean = ENGLANDS.find((e) => e.id === choice.english)?.caribbean;
  if (caribbean || choice.english === "australian" || choice.english === "indian") {
    return {
      voiceId: CLEAR[choice.gender],
      performs: false,
      note: caribbean
        ? "No Jamaican, Trinidadian, Barbadian, or Guyanese voice is in this engine. She speaks clear English until you attach a cloned voice id."
        : "That accent is only documented for the other gender. This side uses clear English (Luna or Rex).",
    };
  }
  return {
    voiceId: CLEAR[choice.gender],
    performs: false,
    note: "Luna and Rex are clear English teacher voices. They are not labeled as a regional accent.",
  };
}

export function isCustomVoice(id: string) {
  return /^[a-z0-9]{6,64}$/.test(id) && !TEACHER_VOICES.includes(id as (typeof TEACHER_VOICES)[number]);
}

export function isAllowedVoice(id: string) {
  const v = id.trim().toLowerCase();
  return TEACHER_VOICES.includes(v as (typeof TEACHER_VOICES)[number]) || isCustomVoice(v);
}
