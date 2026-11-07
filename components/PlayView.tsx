"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PhaserStage } from "@/components/PhaserStage";
import { readDraft } from "@/lib/drafts";
import { formatPoint, splitFor } from "@/lib/economy";
import { getCatalogGame } from "@/lib/games";
import { useI18n } from "@/lib/i18n";
import { fill } from "@/lib/messages";
import type { GameDef } from "@/lib/types";

type Flags = {
  like: boolean;
  share: boolean;
};

export function PlayView({ id }: { id: string }) {
  const { lang, t } = useI18n();
  const catalog = getCatalogGame(id);
  const [draft, setDraft] = useState<GameDef | null>(null);
  const [checked, setChecked] = useState(Boolean(catalog));
  const [flags, setFlags] = useState<Flags>({ like: false, share: false });
  const [copied, setCopied] = useState(false);
  const [qualified, setQualified] = useState(false);

  useEffect(() => {
    if (catalog) return;
    setDraft(readDraft(id));
    setChecked(true);
  }, [catalog, id]);

  useEffect(() => {
    setFlags(readFlags(id));
    setQualified(false);
    setCopied(false);
  }, [id]);

  const game = catalog ?? draft;

  if (!checked) {
    return <p className="mx-auto max-w-6xl px-4 py-12 text-mist md:px-6">{t.play.loading}</p>;
  }

  if (!game) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
        <h1 className="font-display text-5xl">{t.play.missing}</h1>
        <p className="mt-3 text-mist">{t.play.missingBody}</p>
        <Link href="/games" className="mt-6 inline-block text-lime">
          {t.play.back}
        </Link>
      </div>
    );
  }

  const likeSplit = splitFor("like");
  const shareSplit = splitFor("share");
  const playSplit = splitFor("play");

  async function share() {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      setCopied(false);
    }
    const next = { ...readFlags(id), share: true };
    writeFlags(id, next);
    setFlags(next);
  }

  function like() {
    const next = { ...readFlags(id), like: true };
    writeFlags(id, next);
    setFlags(next);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
      <Link href="/games" className="font-mono text-xs tracking-[0.14em] text-dim uppercase">
        ← {t.play.back}
      </Link>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-xs tracking-[0.16em] text-lime uppercase">{t.mode[game.mode]}</p>
          <h1 className="mt-2 font-display text-5xl text-paper">{game.title[lang]}</h1>
          <p className="mt-3 max-w-2xl text-mist">{game.pitch[lang]}</p>
          <p className="mt-2 text-sm text-dim">
            {t.play.creator} · {game.creator[lang]}
            {game.source === "draft" ? ` · ${t.play.draft}` : ""}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <PhaserStage
          game={game}
          title={game.title[lang]}
          hint={game.mode === "idle" ? t.play.hintIdle : t.play.hintClick}
          modeLabel={t.mode[game.mode]}
          scoreLabel={t.play.score}
          goalLabel={t.play.goal}
          clicksLabel={t.play.clicks}
          continuingLabel={t.play.continuing}
          stageLabel={t.play.stage}
          onQualified={() => setQualified(true)}
        />
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <ActionCard
          pressed={flags.like}
          label={flags.like ? t.play.liked : t.play.like}
          detail={fill(t.play.split, {
            creator: formatPoint(likeSplit.creatorPoints),
            player: formatPoint(likeSplit.playerPoints),
          })}
          onClick={like}
          disabled={flags.like}
        />
        <ActionCard
          pressed={flags.share}
          label={flags.share ? t.play.shared : t.play.share}
          detail={`${fill(t.play.split, {
            creator: formatPoint(shareSplit.creatorPoints),
            player: formatPoint(shareSplit.playerPoints),
          })}${copied ? ` · ${t.play.copied}` : ""}`}
          onClick={() => void share()}
          disabled={flags.share}
        />
      </div>
      {qualified ? (
        <p className="mt-4 rounded-2xl border border-lime/50 bg-lime/10 px-4 py-3 text-sm text-paper">
          {t.play.qualified}{" "}
          {fill(t.play.split, {
            creator: formatPoint(playSplit.creatorPoints),
            player: formatPoint(playSplit.playerPoints),
          })}
        </p>
      ) : null}
      <p className="mt-3 text-sm text-dim">{t.play.actionsNote}</p>
    </div>
  );
}

function ActionCard({
  label,
  detail,
  onClick,
  disabled,
  pressed,
}: {
  label: string;
  detail: string;
  onClick: () => void;
  disabled: boolean;
  pressed: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={pressed}
      className="rounded-2xl border border-line bg-panel px-4 py-4 text-left disabled:opacity-80"
    >
      <span className="block font-display text-2xl text-paper">{label}</span>
      <span className="mt-1 block text-sm text-mist">{detail}</span>
    </button>
  );
}

function flagKey(id: string) {
  return `ga-flags:${id}`;
}

function readFlags(id: string): Flags {
  try {
    const raw = window.sessionStorage.getItem(flagKey(id));
    if (!raw) return { like: false, share: false };
    const parsed = JSON.parse(raw) as Partial<Flags>;
    return { like: Boolean(parsed.like), share: Boolean(parsed.share) };
  } catch {
    return { like: false, share: false };
  }
}

function writeFlags(id: string, flags: Flags) {
  window.sessionStorage.setItem(flagKey(id), JSON.stringify(flags));
}
