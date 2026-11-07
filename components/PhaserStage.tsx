"use client";

import { useEffect, useRef, useState } from "react";
import type { GameDef } from "@/lib/types";

type Props = {
  game: GameDef;
  title: string;
  hint: string;
  modeLabel: string;
  scoreLabel: string;
  goalLabel: string;
  clicksLabel: string;
  continuingLabel: string;
  stageLabel: string;
  onQualified?: () => void;
};

export function PhaserStage(props: Props) {
  return <PhaserStageInner key={props.game.id} {...props} />;
}

function PhaserStageInner({
  game,
  title,
  hint,
  modeLabel,
  scoreLabel,
  goalLabel,
  clicksLabel,
  continuingLabel,
  stageLabel,
  onQualified,
}: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const onQualifiedRef = useRef(onQualified);
  const scoreRef = useRef(0);
  const goalRef = useRef(game.goal);
  const clicksRef = useRef(0);
  const qualifiedRef = useRef(false);
  const startedRef = useRef(0);
  const aliveRef = useRef(true);
  const [score, setScore] = useState(0);
  const [goal, setGoal] = useState(game.goal);
  const [clicks, setClicks] = useState(0);
  const [loops, setLoops] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    onQualifiedRef.current = onQualified;
  }, [onQualified]);

  useEffect(() => {
    aliveRef.current = true;
    startedRef.current = Date.now();
    const timer = window.setInterval(() => {
      if (qualifiedRef.current) return;
      const elapsed = Date.now() - startedRef.current;
      if (clicksRef.current >= 8 || (elapsed >= 20_000 && clicksRef.current >= 1)) {
        qualifiedRef.current = true;
        onQualifiedRef.current?.();
      }
    }, 400);
    return () => {
      aliveRef.current = false;
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    let destroyed = false;
    let gameInstance: import("phaser").Game | null = null;
    const host = hostRef.current;
    if (!host) return;

    const boot = async () => {
      try {
        const imported = await import("phaser");
        const Phaser = resolvePhaser(imported);
        if (destroyed || !hostRef.current) return;

        class RunScene extends Phaser.Scene {
          private shape!: import("phaser").GameObjects.Shape;

          constructor() {
            super("run");
          }

          create() {
            const width = this.scale.width;
            const height = this.scale.height;
            this.add.rectangle(0, 0, width, height, 0x0c1612).setOrigin(0);
            const grid = this.add.graphics();
            grid.lineStyle(1, 0x1d3328, 0.9);
            for (let x = 0; x <= width; x += 32) grid.lineBetween(x, 0, x, height);
            for (let y = 0; y <= height; y += 32) grid.lineBetween(0, y, width, y);

            const cx = width / 2;
            const cy = height / 2;
            const color = Phaser.Display.Color.HexStringToColor(game.accent).color;
            if (game.shape === "diamond") {
              this.shape = this.add.polygon(cx, cy, [0, -86, 86, 0, 0, 86, -86, 0], color);
            } else if (game.shape === "ring") {
              const ring = this.add.circle(cx, cy, 74, 0x0c1612);
              ring.setStrokeStyle(16, color);
              this.shape = ring;
            } else if (game.shape === "bar") {
              this.shape = this.add.rectangle(cx, cy, 220, 72, color);
            } else {
              this.shape = this.add.circle(cx, cy, 72, color);
            }

            const labelColor = game.shape === "ring" ? game.accent : "#08110d";
            this.add
              .text(cx, cy, String(game.clickValue), {
                fontFamily: "IBM Plex Mono, ui-monospace, monospace",
                fontSize: "42px",
                color: labelColor,
              })
              .setOrigin(0.5);

            const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            if (!reduce) {
              this.tweens.add({
                targets: this.shape,
                scale: game.mode === "idle" ? 1.08 : 1.04,
                duration: game.mode === "idle" ? 680 : 1200,
                yoyo: true,
                repeat: -1,
                ease: "Sine.easeInOut",
              });
            }

            this.input.setDefaultCursor("pointer");
            this.input.on("pointerdown", (pointer: import("phaser").Input.Pointer) => {
              if (!aliveRef.current) return;
              clicksRef.current += 1;
              setClicks(clicksRef.current);
              if (!qualifiedRef.current && clicksRef.current >= 8) {
                qualifiedRef.current = true;
                onQualifiedRef.current?.();
              }
              gain(game.clickValue);
              const tag = this.add
                .text(pointer.x, pointer.y - 12, `+${game.clickValue}`, {
                  fontFamily: "IBM Plex Mono, ui-monospace, monospace",
                  fontSize: "22px",
                  color: "#f3ecdf",
                })
                .setOrigin(0.5);
              this.tweens.add({ targets: this.shape, scale: 0.9, duration: 70, yoyo: true });
              this.tweens.add({
                targets: tag,
                y: pointer.y - 52,
                alpha: 0,
                duration: 520,
                onComplete: () => tag.destroy(),
              });
            });

            this.time.addEvent({
              delay: 200,
              loop: true,
              callback: () => {
                const amount = game.idlePerSecond * 0.2;
                if (amount > 0) gain(amount);
              },
            });

            const gain = (amount: number) => {
              if (!aliveRef.current) return;
              scoreRef.current += amount;
              if (scoreRef.current >= goalRef.current) {
                scoreRef.current = 0;
                goalRef.current = Math.round(goalRef.current * 1.6);
                setGoal(goalRef.current);
                setLoops((count) => count + 1);
                this.cameras.main.flash(160, 230, 255, 77, false);
              }
              setScore(scoreRef.current);
            };
          }
        }

        gameInstance = new Phaser.Game({
          type: Phaser.CANVAS,
          parent: hostRef.current,
          width: 960,
          height: 380,
          backgroundColor: "#0c1612",
          banner: false,
          audio: { noAudio: true },
          scene: RunScene,
          scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
          },
        });
      } catch {
        if (!destroyed) setFailed(true);
      }
    };

    void boot();

    return () => {
      destroyed = true;
      aliveRef.current = false;
      if (gameInstance) {
        gameInstance.destroy(true);
      }
      host.replaceChildren();
    };
  }, [game]);

  return (
    <section className="overflow-hidden rounded-3xl border border-line bg-panel" aria-label={stageLabel}>
      <div className="flex items-start justify-between gap-4 border-b border-line px-4 py-3">
        <div>
          <p className="font-mono text-[11px] tracking-[0.16em] text-lime uppercase">{modeLabel}</p>
          <h2 className="font-display text-2xl text-paper">{title}</h2>
        </div>
        <div className="text-right">
          <p className="font-mono text-[11px] tracking-wide text-dim uppercase">{scoreLabel}</p>
          <p className="font-mono text-3xl text-lime" data-score={Math.floor(score)}>
            {Math.floor(score)}
          </p>
        </div>
      </div>
      <div ref={hostRef} className="h-[380px] w-full cursor-pointer bg-[#0c1612]" />
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm text-mist">
        <p>{failed ? "Phaser failed to start." : hint}</p>
        <p className="font-mono text-xs text-dim">
          {clicksLabel} {clicks} · {goalLabel} {goal}
          {loops > 0 ? ` · ${continuingLabel}` : ""}
        </p>
      </div>
    </section>
  );
}

function resolvePhaser(imported: unknown): typeof import("phaser") {
  if (hasGame(imported)) return imported;
  if (imported && typeof imported === "object" && "default" in imported && hasGame(imported.default)) {
    return imported.default;
  }
  throw new Error("Phaser failed to load");
}

function hasGame(value: unknown): value is typeof import("phaser") {
  return Boolean(value && typeof value === "object" && "Game" in value && "CANVAS" in value);
}
