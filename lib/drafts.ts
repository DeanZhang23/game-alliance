import type { GameDef, GameMode, GameShape } from "@/lib/types";

const KEY = "ga-drafts";

const SHAPES: GameShape[] = ["core", "ring", "diamond", "bar"];

export function readDraft(id: string): GameDef | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return null;
    const all = JSON.parse(raw) as Record<string, unknown>;
    return parseDraft(all[id]);
  } catch {
    return null;
  }
}

export function saveDraft(game: GameDef) {
  const raw = window.sessionStorage.getItem(KEY);
  const all = raw ? (JSON.parse(raw) as Record<string, GameDef>) : {};
  all[game.id] = game;
  window.sessionStorage.setItem(KEY, JSON.stringify(all));
}

function parseDraft(value: unknown): GameDef | null {
  if (!value || typeof value !== "object") return null;
  const game = value as Partial<GameDef>;
  if (!game.id || !game.title || !game.pitch || !game.creator) return null;
  if (game.mode !== "click" && game.mode !== "idle") return null;
  if (!game.shape || !SHAPES.includes(game.shape)) return null;
  if (typeof game.clickValue !== "number" || typeof game.goal !== "number") return null;
  return {
    id: game.id,
    title: game.title,
    pitch: game.pitch,
    creator: game.creator,
    mode: game.mode as GameMode,
    clickValue: game.clickValue,
    idlePerSecond: typeof game.idlePerSecond === "number" ? game.idlePerSecond : 0,
    goal: game.goal,
    accent: typeof game.accent === "string" ? game.accent : "#e6ff4d",
    shape: game.shape,
    source: "draft",
  };
}
