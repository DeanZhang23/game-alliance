const PALETTE: Record<string, string> = {
  k: "#1a0e08",
  y: "#ffd23f",
  w: "#fff6ea",
  l: "#c8f542",
  c: "#49d6ff",
  r: "#ff5a45",
};

const ROWS = [
  "....yyyy....",
  "..yyyyyyyy..",
  ".yykkyykkyy.",
  ".yywwyywwyy.",
  "yyyyyyyyyyyy",
  "yyykkkkkkkyy",
  ".yyyyyyyyyy.",
  "..yyykkkyy..",
  "...yyyyyy...",
  "....yyyy....",
  "...krrrrk...",
  "..krrrrrrk..",
  "...kkkkkk...",
];

export function PixelMark({ cell = 6 }: { cell?: number }) {
  const width = ROWS[0].length * cell;
  const height = ROWS.length * cell;

  return (
    <span className="pixel-mark" style={{ width, height }} aria-hidden>
      {ROWS.flatMap((row, y) =>
        [...row].map((glyph, x) => {
          const color = PALETTE[glyph];
          if (!color) return null;
          return (
            <span
              key={`${x}-${y}`}
              style={{
                position: "absolute",
                left: x * cell,
                top: y * cell,
                width: cell,
                height: cell,
                background: color,
              }}
            />
          );
        }),
      )}
    </span>
  );
}
