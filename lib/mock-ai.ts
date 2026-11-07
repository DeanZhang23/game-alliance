import type { GameDef, GameMode, GameShape } from "@/lib/types";

const ACCENTS = ["#e6ff4d", "#8ee0a8", "#ffb020", "#79c0ff", "#ff7a59", "#d7b4ff"];
const SHAPES: GameShape[] = ["core", "ring", "diamond", "bar"];
const IDLE_HINT = /放置|挂机|自动|自己|生长|潮|钟|idle|afk|farm|clock|moss/i;
const CLICK_HINT = /点击|点按|点一下|click|tap|press/i;

export function mockGenerate(idea: string): GameDef {
  const text = idea.trim().replace(/\s+/g, " ");
  const hash = hashString(text);
  const wantsIdle = IDLE_HINT.test(text);
  const wantsClick = CLICK_HINT.test(text);
  const mode: GameMode = wantsIdle && !wantsClick ? "idle" : wantsClick && !wantsIdle ? "click" : hash % 3 === 0 ? "idle" : "click";
  const clickValue = 1 + (hash % 5);
  const idlePerSecond = mode === "idle" ? round1(1 + (hash % 4) * 0.4) : round1((hash % 5) * 0.1);
  const title = text.slice(0, 18);

  return {
    id: `draft-${hash.toString(36)}`,
    title: { zh: title, en: title },
    pitch: { zh: text, en: text },
    creator: { zh: "你", en: "You" },
    mode,
    clickValue,
    idlePerSecond,
    goal: 24 + (hash % 70),
    accent: ACCENTS[hash % ACCENTS.length],
    shape: SHAPES[hash % SHAPES.length],
    source: "draft",
  };
}

function hashString(input: string) {
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function round1(value: number) {
  return Math.round(value * 10) / 10;
}
