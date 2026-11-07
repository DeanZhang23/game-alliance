"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export function HomeView() {
  const { t } = useI18n();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
      <p className="font-mono text-xs tracking-[0.18em] text-lime uppercase">{t.home.kicker}</p>
      <div className="mt-5 grid items-start gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.8fr)]">
        <div>
          <h1 className="max-w-4xl font-display text-5xl leading-[1.08] text-paper md:text-7xl">{t.home.title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-mist">{t.home.lead}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/create" className="rounded-full bg-lime px-5 py-2.5 text-sm font-medium text-ink">
              {t.home.ctaCreate}
            </Link>
            <Link href="/games" className="rounded-full border border-line px-5 py-2.5 text-sm text-paper">
              {t.home.ctaGames}
            </Link>
          </div>
        </div>
        <section className="rounded-3xl border border-line bg-panel p-5" aria-labelledby="loop-title">
          <h2 id="loop-title" className="font-mono text-xs tracking-[0.18em] text-dim uppercase">
            {t.home.loopTitle}
          </h2>
          <ol className="mt-4">
            {t.home.steps.map((step, index) => (
              <li key={step.name} className="grid grid-cols-[auto_1fr] gap-3 border-t border-line py-3 first:border-t-0">
                <span className="font-mono text-xs text-lime">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <p className="font-display text-2xl leading-none">{step.name}</p>
                  <p className="mt-1 text-sm leading-relaxed text-mist">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>
      <section className="mt-12 grid gap-4 md:grid-cols-3">
        {t.home.notes.map((note) => (
          <article key={note.title} className="rounded-3xl border border-line bg-panel/70 p-5">
            <h2 className="font-display text-2xl">{note.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-mist">{note.text}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
