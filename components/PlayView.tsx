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
    return <p className="page-wrap text-mist">{t.play.loading}</p>;
  }

  if (!game) {
    return (
      <div className="page-wrap">
        <section className="pixel-panel max-w-xl">
          <p className="font-pixel text-[10px] text-clay">404</p>
          <h1 className="hero-title">{t.play.missing}</h1>
          <p className="lead">{t.play.missingBody}</p>
          <Link href="/games" className="pixel-btn mt-5">
            <span className="pixel-arrow-left" aria-hidden />
            {t.play.back}
          </Link>
        </section>
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
    <div className="page-wrap">
      <Link href="/games" className="pixel-btn pixel-btn-ghost pixel-btn-sm">
        <span className="pixel-arrow-left" aria-hidden />
        {t.play.back}
      </Link>
      <div className="mt-5">
        <p className={game.mode === "idle" ? "chip chip-mana" : "chip"}>{t.mode[game.mode]}</p>
        <h1 className="hero-title">{game.title[lang]}</h1>
        <p className="lead">{game.pitch[lang]}</p>
        <p className="mt-3 text-sm font-bold text-dim">
          {t.play.creator} · {game.creator[lang]}
          {game.source === "draft" ? ` · ${t.play.draft}` : ""}
        </p>
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
          tone="like"
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
          tone="share"
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
        <p className="quest-clear">
          <span className="font-pixel mr-2 text-[10px]">1UP</span>
          {t.play.qualified}{" "}
          {fill(t.play.split, {
            creator: formatPoint(playSplit.creatorPoints),
            player: formatPoint(playSplit.playerPoints),
          })}
        </p>
      ) : null}
      <p className="mt-3 text-sm leading-relaxed text-dim">{t.play.actionsNote}</p>
    </div>
  );
}

function ActionCard({
  label,
  detail,
  onClick,
  disabled,
  pressed,
  tone,
}: {
  label: string;
  detail: string;
  onClick: () => void;
  disabled: boolean;
  pressed: boolean;
  tone: "like" | "share";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={pressed}
      className={`action-pad ${tone === "like" ? "tone-like" : "tone-share"}${pressed ? " is-down" : ""}`}
    >
      <span className="action-face">{label}</span>
      <span className="action-detail">{detail}</span>
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
