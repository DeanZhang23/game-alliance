"use client";

import { creatorBlendPercent, ECONOMY, formatPoint, splitFor } from "@/lib/economy";
import { fill } from "@/lib/messages";
import { useI18n } from "@/lib/i18n";

export function EconomyView() {
  const { t } = useI18n();
  const play = splitFor("play");
  const like = splitFor("like");
  const share = splitFor("share");
  const pct = creatorBlendPercent();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
      <p className="font-mono text-xs tracking-[0.18em] text-lime uppercase">{t.economy.kicker}</p>
      <h1 className="mt-3 max-w-3xl font-display text-5xl leading-tight text-paper">{t.economy.title}</h1>
      <p className="mt-4 max-w-2xl text-mist">{t.economy.lead}</p>
      <p className="mt-3 font-mono text-sm text-lime">{fill(t.economy.blend, { pct })}</p>

      <ul className="mt-8 grid gap-3 md:hidden">
        {ECONOMY.map((row) => (
          <li key={row.id} className="rounded-3xl border border-line bg-panel px-4 py-4">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="font-display text-2xl">{t.economy.signals[row.id]}</h2>
              <p className="font-mono text-xl text-lime">
                {row.points}
                <span className="ml-2 text-xs text-dim">{t.economy.colWeight}</span>
              </p>
            </div>
            <p className="mt-2 font-mono text-sm text-mist">
              {t.economy.colCreator} {Math.round(row.creator * 100)}% · {t.economy.colPlayer} {Math.round(row.player * 100)}%
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-8 hidden overflow-x-auto rounded-3xl border border-line md:block">
        <table className="w-full min-w-[36rem] text-left">
          <thead className="bg-panel font-mono text-[11px] tracking-[0.14em] text-dim uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">{t.economy.colSignal}</th>
              <th className="px-4 py-3 font-medium">{t.economy.colWeight}</th>
              <th className="px-4 py-3 font-medium">{t.economy.colCreator}</th>
              <th className="px-4 py-3 font-medium">{t.economy.colPlayer}</th>
            </tr>
          </thead>
          <tbody>
            {ECONOMY.map((row) => (
              <tr key={row.id} className="border-t border-line">
                <th className="px-4 py-4 font-display text-2xl font-normal text-paper">{t.economy.signals[row.id]}</th>
                <td className="px-4 py-4 font-mono text-xl text-lime">{row.points}</td>
                <td className="px-4 py-4 font-mono text-lg">{Math.round(row.creator * 100)}%</td>
                <td className="px-4 py-4 font-mono text-lg text-mist">{Math.round(row.player * 100)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <article className="rounded-3xl border border-line bg-panel p-5">
          <h2 className="font-display text-3xl">{t.economy.playTitle}</h2>
          <p className="mt-3 leading-relaxed text-mist">{t.economy.playBody}</p>
        </article>
        <article className="rounded-3xl border border-line bg-panel p-5">
          <h2 className="font-display text-3xl">{t.economy.cycleTitle}</h2>
          <p className="mt-3 leading-relaxed text-mist">{t.economy.cycleBody}</p>
        </article>
      </div>

      <section className="mt-4 rounded-3xl border border-line p-5">
        <h2 className="font-display text-3xl">{t.economy.exampleTitle}</h2>
        <p className="mt-3 leading-relaxed text-mist">
          {fill(t.economy.example, {
            playPoints: play.points,
            playCreator: formatPoint(play.creatorPoints),
            playPlayer: formatPoint(play.playerPoints),
            likePoints: like.points,
            likeCreator: formatPoint(like.creatorPoints),
            likePlayer: formatPoint(like.playerPoints),
            sharePoints: share.points,
            shareCreator: formatPoint(share.creatorPoints),
            sharePlayer: formatPoint(share.playerPoints),
          })}
        </p>
      </section>

      <aside className="mt-4 rounded-3xl border border-clay/70 bg-clay/10 p-5">
        <h2 className="font-display text-3xl text-clay">{t.economy.skipTitle}</h2>
        <p className="mt-3 leading-relaxed text-paper">{t.economy.skipBody}</p>
      </aside>
    </div>
  );
}
