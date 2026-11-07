"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { PhaserStage } from "@/components/PhaserStage";
import { saveDraft } from "@/lib/drafts";
import { useI18n } from "@/lib/i18n";
import { mockGenerate } from "@/lib/mock-ai";
import type { GameDef } from "@/lib/types";

export function CreateView() {
  const { lang, t } = useI18n();
  const [idea, setIdea] = useState("");
  const [error, setError] = useState(false);
  const [pending, setPending] = useState(false);
  const [draft, setDraft] = useState<GameDef | null>(null);
  const resultRef = useRef<HTMLElement>(null);

  async function generate() {
    const text = idea.trim();
    if (text.length < 2) {
      setError(true);
      return;
    }
    setError(false);
    setPending(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    const next = mockGenerate(text);
    saveDraft(next);
    setDraft(next);
    setPending(false);
    requestAnimationFrame(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
      <p className="font-mono text-xs tracking-[0.18em] text-lime uppercase">{t.create.kicker}</p>
      <h1 className="mt-3 max-w-3xl font-display text-5xl leading-tight text-paper">{t.create.title}</h1>
      <p className="mt-4 max-w-2xl text-mist">{t.create.lead}</p>

      <form
        className="mt-8 max-w-3xl"
        onSubmit={(event) => {
          event.preventDefault();
          void generate();
        }}
      >
        <label htmlFor="idea" className="font-mono text-xs tracking-[0.14em] text-dim uppercase">
          {t.create.label}
        </label>
        <textarea
          id="idea"
          value={idea}
          disabled={pending}
          onChange={(event) => setIdea(event.target.value)}
          placeholder={t.create.placeholder}
          rows={4}
          className="mt-2 w-full resize-y rounded-2xl border border-line bg-panel px-4 py-3 text-paper outline-none placeholder:text-dim"
        />
        {error ? <p className="mt-2 text-sm text-clay">{t.create.error}</p> : null}
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <button type="submit" disabled={pending} className="rounded-full bg-clay px-5 py-2.5 text-sm font-medium text-ink disabled:opacity-60">
            {pending ? t.create.working : t.create.submit}
          </button>
          <p className="text-sm text-dim">{t.create.note}</p>
        </div>
      </form>

      {draft ? (
        <section ref={resultRef} className="mt-10" aria-label={t.create.result}>
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <h2 className="font-display text-3xl">{t.create.result}</h2>
            <Link href={`/play/${draft.id}`} className="rounded-full border border-lime px-4 py-2 text-sm text-lime">
              {t.create.open}
            </Link>
          </div>
          <dl className="mb-4 grid gap-3 sm:grid-cols-4">
            <Stat label={t.create.mode} value={t.mode[draft.mode]} />
            <Stat label={t.create.click} value={String(draft.clickValue)} />
            <Stat label={t.create.idle} value={`${draft.idlePerSecond} ${t.create.perSecond}`} />
            <Stat label={t.create.goal} value={String(draft.goal)} />
          </dl>
          <PhaserStage
            game={draft}
            title={draft.title[lang]}
            hint={draft.mode === "idle" ? t.play.hintIdle : t.play.hintClick}
            modeLabel={t.mode[draft.mode]}
            scoreLabel={t.play.score}
            goalLabel={t.play.goal}
            clicksLabel={t.play.clicks}
            continuingLabel={t.play.continuing}
            stageLabel={t.play.stage}
          />
        </section>
      ) : null}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line bg-panel px-4 py-3">
      <dt className="font-mono text-[11px] tracking-[0.14em] text-dim uppercase">{label}</dt>
      <dd className="mt-1 text-lg text-paper">{value}</dd>
    </div>
  );
}
