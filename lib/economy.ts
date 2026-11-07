export const ECONOMY = [
  { id: "play", points: 10, creator: 0.7, player: 0.3 },
  { id: "like", points: 6, creator: 0.8, player: 0.2 },
  { id: "share", points: 8, creator: 0.85, player: 0.15 },
] as const;

export type SignalId = (typeof ECONOMY)[number]["id"];

export function splitFor(id: SignalId) {
  const row = ECONOMY.find((item) => item.id === id);
  if (!row) {
    throw new Error(`Unknown signal: ${id}`);
  }
  return {
    ...row,
    creatorPoints: roundPoint(row.points * row.creator),
    playerPoints: roundPoint(row.points * row.player),
  };
}

export function creatorBlendPercent() {
  const total = ECONOMY.reduce((sum, row) => sum + row.points, 0);
  const creator = ECONOMY.reduce((sum, row) => sum + row.points * row.creator, 0);
  return Math.round((creator / total) * 100);
}

function roundPoint(value: number) {
  return Math.round(value * 10) / 10;
}

export function formatPoint(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}
