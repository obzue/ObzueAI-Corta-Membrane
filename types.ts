export type DeviceClass = "desktop" | "android" | "ios" | "tablet";

export type Grant = "device" | "photos" | "videos" | "pdfs" | "screen" | "private-docs";

export type EnglishId =
  | "clear"
  | "british"
  | "australian"
  | "indian"
  | "jamaican"
  | "trinidadian"
  | "barbadian"
  | "guyanese";

export type VoiceChoice = {
  gender: "female" | "male";
  english: EnglishId;
  customVoiceId: string;
};

export type Source =
  | { id: string; kind: "text"; title: string; text: string }
  | { id: string; kind: "pdf"; name: string; text: string }
  | { id: string; kind: "photo"; name: string; note: string }
  | { id: string; kind: "clip"; name: string; note: string }
  | { id: string; kind: "website"; url: string; note: string }
  | { id: string; kind: "software"; name: string; note: string };

export type Action =
  | { type: "speak"; text: string }
  | { type: "open-app"; name: string }
  | { type: "open-url"; url: string }
  | { type: "show"; sourceId: string }
  | { type: "screen-record"; on: boolean }
  | { type: "wait-for-learner" };

export type Beat = { id: string; say: string; action: Action };

export type LessonPlan = {
  title: string;
  beats: Beat[];
  clips: { id: string; title: string; say: string }[];
  blocked: string[];
  questions: string[];
};

export type Note = {
  id: string;
  kind: "consent" | "source" | "miss" | "exchange" | "plan";
  text: string;
};

export type Membrane = {
  learner: string;
  device: DeviceClass | null;
  grants: Record<Grant, boolean>;
  voice: VoiceChoice;
  sources: Source[];
  notes: Note[];
  plan: LessonPlan | null;
};
