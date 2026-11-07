import type { GameDef } from "@/lib/types";

export const GAMES: GameDef[] = [
  {
    id: "star-kiln",
    title: { zh: "星窑", en: "Star Kiln" },
    pitch: {
      zh: "点亮炉心，把黑夜压成星。炉火自己也会慢慢跳。",
      en: "Tap the kiln until night compresses into stars. The fire creeps on its own.",
    },
    creator: { zh: "林夏", en: "Lin Xia" },
    mode: "click",
    clickValue: 2,
    idlePerSecond: 0.2,
    goal: 30,
    accent: "#e6ff4d",
    shape: "core",
    source: "catalog",
  },
  {
    id: "moss-clock",
    title: { zh: "苔藓钟", en: "Moss Clock" },
    pitch: {
      zh: "一座不肯停的钟，苔藓按秒生长。点一下，钟摆更重。",
      en: "A clock that will not stop. Moss grows by the second. A tap makes the swing heavier.",
    },
    creator: { zh: "北港", en: "North Harbor" },
    mode: "idle",
    clickValue: 3,
    idlePerSecond: 1.4,
    goal: 80,
    accent: "#8ee0a8",
    shape: "ring",
    source: "catalog",
  },
  {
    id: "lantern-well",
    title: { zh: "灯井", en: "Lantern Well" },
    pitch: {
      zh: "井底有一盏灯。你点一次，它就亮一截。",
      en: "A lamp sits at the bottom of a well. Each tap lifts the light.",
    },
    creator: { zh: "井南", en: "Jing Nan" },
    mode: "click",
    clickValue: 4,
    idlePerSecond: 0.1,
    goal: 40,
    accent: "#ffb020",
    shape: "diamond",
    source: "catalog",
  },
  {
    id: "tide-press",
    title: { zh: "潮汐冲压", en: "Tide Press" },
    pitch: {
      zh: "潮水自己冲压。你偶尔按下去，产量就跳一档。",
      en: "The tide presses on its own. A press of your hand kicks the yield up.",
    },
    creator: { zh: "港务处", en: "Harbor Desk" },
    mode: "idle",
    clickValue: 2,
    idlePerSecond: 1.8,
    goal: 100,
    accent: "#79c0ff",
    shape: "bar",
    source: "catalog",
  },
  {
    id: "signal-kites",
    title: { zh: "信号风筝", en: "Signal Kites" },
    pitch: {
      zh: "把信号放上天。点得越勤，线越亮。",
      en: "Send a signal into the sky. The faster you tap, the brighter the line.",
    },
    creator: { zh: "风筝同盟", en: "Kite Union" },
    mode: "click",
    clickValue: 1,
    idlePerSecond: 0.4,
    goal: 50,
    accent: "#ff7a59",
    shape: "core",
    source: "catalog",
  },
];

export function getCatalogGame(id: string) {
  return GAMES.find((game) => game.id === id) ?? null;
}
