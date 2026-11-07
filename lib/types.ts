export type Lang = "zh" | "en";

export type GameMode = "click" | "idle";

export type GameShape = "core" | "ring" | "diamond" | "bar";

export type GameSource = "catalog" | "draft";

export type Localized = {
  zh: string;
  en: string;
};

export type GameDef = {
  id: string;
  title: Localized;
  pitch: Localized;
  creator: Localized;
  mode: GameMode;
  clickValue: number;
  idlePerSecond: number;
  goal: number;
  accent: string;
  shape: GameShape;
  source: GameSource;
};
