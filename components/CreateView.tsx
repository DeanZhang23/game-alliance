"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { HudStat, PageIntro } from "@/components/Chrome";
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
    <div className="page-wrap">
      <PageIntro kicker={t.create.kicker} title={t.create.title} lead={t.create.lead} />

      <form
        className="pixel-panel mt-8 max-w-3xl"
        onSubmit={(event) => {
          event.preventDefault();
          void generate();
        }}
      >
        <label htmlFor="idea" className="field-label">
          {t.create.label}
        </label>
        <textarea
          id="idea"
          value={idea}
          disabled={pending}
          onChange={(event) => setIdea(event.target.value)}
          placeholder={t.create.placeholder}
          rows={4}
          className="pixel-field"
        />
        {error ? <p className="mt-2 text-sm font-bold text-clay">{t.create.error}</p> : null}
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <button type="submit" disabled={pending} className="pixel-btn pixel-btn-clay">
            {pending ? t.create.working : t.create.submit}
          </button>
          <p className="max-w-sm text-sm leading-relaxed text-dim">{t.create.note}</p>
        </div>
      </form>

      {draft ? (
        <section ref={resultRef} className="scroll-target mt-10" aria-label={t.create.result}>
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <h2 className="text-3xl font-black">{t.create.result}</h2>
            <Link href={`/play/${draft.id}`} className="pixel-btn pixel-btn-sm">
              <span className="pixel-arrow" aria-hidden />
              {t.create.open}
            </Link>
          </div>
          <dl className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <HudStat label={t.create.mode} value={t.mode[draft.mode]} />
            <HudStat label={t.create.click} value={String(draft.clickValue)} numeric />
            <HudStat label={t.create.idle} value={`${draft.idlePerSecond} ${t.create.perSecond}`} />
            <HudStat label={t.create.goal} value={String(draft.goal)} numeric />
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
