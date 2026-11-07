"use client";

import Link from "next/link";
import { PixelMark } from "@/components/PixelMark";
import { useI18n } from "@/lib/i18n";

const NOTE_TONES = ["chip-lime", "chip-mana", "chip-clay"] as const;

export function HomeView() {
  const { t } = useI18n();

  return (
    <div className="page-wrap">
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.9fr)]">
        <div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="mark-screen">
              <PixelMark />
            </div>
            <p className="kicker">{t.home.kicker}</p>
          </div>
          <h1 className="hero-title">{t.home.title}</h1>
          <p className="lead">{t.home.lead}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/create" className="pixel-btn">
              {t.home.ctaCreate}
            </Link>
            <Link href="/games" className="pixel-btn pixel-btn-ghost">
              {t.home.ctaGames}
            </Link>
          </div>
        </div>
        <section className="pixel-panel" aria-labelledby="loop-title">
          <h2 id="loop-title" className="text-xs font-bold tracking-wide text-gold uppercase">
            {t.home.loopTitle}
          </h2>
          <ol className="mt-4 flex flex-col gap-3">
            {t.home.steps.map((step, index) => (
              <li key={step.name} className="flex items-start gap-3">
                <span className="step-index font-pixel">{String(index + 1).padStart(2, "0")}</span>
                <div className="min-w-0 pt-0.5">
                  <p className="text-2xl leading-none font-black">{step.name}</p>
                  <p className="mt-1 text-sm leading-relaxed text-mist">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>
      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {t.home.notes.map((note, index) => (
          <article key={note.title} className="pixel-card">
            <span className={`chip ${NOTE_TONES[index] ?? "chip-lime"}`}>{String(index + 1).padStart(2, "0")}</span>
            <h2 className="mt-3 text-2xl font-black">{note.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-mist">{note.text}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
