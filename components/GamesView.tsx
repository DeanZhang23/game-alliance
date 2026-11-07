"use client";

import Link from "next/link";
import { PageIntro } from "@/components/Chrome";
import { useI18n } from "@/lib/i18n";
import { GAMES } from "@/lib/games";

export function GamesView() {
  const { lang, t } = useI18n();

  return (
    <div className="page-wrap">
      <PageIntro kicker={t.games.kicker} title={t.games.title} lead={t.games.lead} />
      <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {GAMES.map((game, index) => (
          <li key={game.id}>
            <Link href={`/play/${game.id}`} className="cart">
              <span className="cart-ridge" style={{ backgroundColor: game.accent }} />
              <span className="cart-body">
                <span className="flex items-center justify-between gap-2">
                  <span className={game.mode === "idle" ? "chip chip-mana" : "chip"}>{t.mode[game.mode]}</span>
                  <span className="font-pixel text-[10px] text-[#6b5348]">{String(index + 1).padStart(2, "0")}</span>
                </span>
                <span className="cart-title">{game.title[lang]}</span>
                <span className="cart-pitch">{game.pitch[lang]}</span>
                <span className="flex items-center justify-between gap-3">
                  <span className="cart-quiet">
                    {t.games.creator} · {game.creator[lang]}
                  </span>
                  <span className="pixel-btn pixel-btn-sm">
                    <span className="pixel-arrow" aria-hidden />
                    {t.games.play}
                  </span>
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
