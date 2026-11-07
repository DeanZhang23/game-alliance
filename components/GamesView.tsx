"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { GAMES } from "@/lib/games";

export function GamesView() {
  const { lang, t } = useI18n();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
      <p className="font-mono text-xs tracking-[0.18em] text-lime uppercase">{t.games.kicker}</p>
      <h1 className="mt-3 font-display text-5xl text-paper">{t.games.title}</h1>
      <p className="mt-4 max-w-2xl text-mist">{t.games.lead}</p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {GAMES.map((game) => (
          <li key={game.id}>
            <Link
              href={`/play/${game.id}`}
              className="flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-panel transition-colors hover:border-lime/70"
            >
              <span className="h-1.5" style={{ backgroundColor: game.accent }} />
              <span className="flex flex-1 flex-col p-5">
                <span className="flex items-center justify-between font-mono text-[11px] tracking-[0.14em] text-dim uppercase">
                  <span>{t.mode[game.mode]}</span>
                  <span>{game.id}</span>
                </span>
                <span className="mt-4 font-display text-4xl text-paper">{game.title[lang]}</span>
                <span className="mt-3 flex-1 text-sm leading-relaxed text-mist">{game.pitch[lang]}</span>
                <span className="mt-5 flex items-center justify-between text-sm">
                  <span className="text-dim">
                    {t.games.creator} · {game.creator[lang]}
                  </span>
                  <span className="text-lime">{t.games.play}</span>
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
