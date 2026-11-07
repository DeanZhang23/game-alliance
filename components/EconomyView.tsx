"use client";

import { PageIntro, SplitMeter } from "@/components/Chrome";
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
    <div className="page-wrap">
      <PageIntro kicker={t.economy.kicker} title={t.economy.title} lead={t.economy.lead} />
      <p className="callout">{fill(t.economy.blend, { pct })}</p>

      <ul className="mt-8 grid gap-4 md:grid-cols-3">
        {ECONOMY.map((row) => (
          <li key={row.id} className="pixel-card flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-2xl leading-tight font-black">{t.economy.signals[row.id]}</h2>
              <div className="score-box">
                <p className="flex items-center justify-end gap-1.5">
                  <span className="px-coin" aria-hidden />
                  <span className="font-pixel text-[15px] text-lime">{row.points}</span>
                </p>
                <p className="mt-1 text-[11px] leading-tight font-bold text-dim">{t.economy.colWeight}</p>
              </div>
            </div>
            <SplitMeter label={t.economy.colCreator} percent={Math.round(row.creator * 100)} tone="hp" />
            <SplitMeter label={t.economy.colPlayer} percent={Math.round(row.player * 100)} tone="mp" />
          </li>
        ))}
      </ul>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <article className="pixel-card">
          <h2 className="text-2xl font-black">{t.economy.playTitle}</h2>
          <p className="mt-3 leading-relaxed text-mist">{t.economy.playBody}</p>
        </article>
        <article className="pixel-card">
          <h2 className="text-2xl font-black">{t.economy.cycleTitle}</h2>
          <p className="mt-3 leading-relaxed text-mist">{t.economy.cycleBody}</p>
        </article>
      </div>

      <section className="pixel-panel mt-4">
        <h2 className="text-2xl font-black">{t.economy.exampleTitle}</h2>
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

      <aside className="warn-panel mt-4">
        <h2 className="text-2xl font-black text-clay">{t.economy.skipTitle}</h2>
        <p className="mt-3 leading-relaxed text-paper">{t.economy.skipBody}</p>
      </aside>
    </div>
  );
}
