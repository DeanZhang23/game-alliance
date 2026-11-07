export function PageIntro({
  kicker,
  title,
  lead,
}: {
  kicker: string;
  title: string;
  lead?: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="kicker">{kicker}</p>
      <h1 className="hero-title">{title}</h1>
      {lead ? <p className="lead">{lead}</p> : null}
    </div>
  );
}

export function HudStat({
  label,
  value,
  numeric = false,
}: {
  label: string;
  value: string;
  numeric?: boolean;
}) {
  return (
    <dl className="hud-stat">
      <dt className="hud-stat-label">{label}</dt>
      <dd className={numeric ? "hud-stat-value font-pixel" : "hud-stat-value"}>{value}</dd>
    </dl>
  );
}

export function SplitMeter({
  label,
  percent,
  tone,
}: {
  label: string;
  percent: number;
  tone: "hp" | "mp";
}) {
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between gap-2">
        <span className="text-sm font-bold">{label}</span>
        <span className="font-pixel text-[11px] text-gold">{percent}%</span>
      </div>
      <div className="meter" aria-hidden>
        <span className={tone === "hp" ? "meter-fill meter-hp" : "meter-fill meter-mp"} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
