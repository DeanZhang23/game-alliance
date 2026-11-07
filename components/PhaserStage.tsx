"use client";

import { useEffect, useRef, useState } from "react";
import type { GameDef, GameShape } from "@/lib/types";

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

const SCENE_W = 480;
const SCENE_H = 190;
const PIXEL = 4;

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
          constructor() {
            super("run");
          }

          create() {
            const width = this.scale.width;
            const height = this.scale.height;
            const cx = 240;
            const cy = 96;
            paintBackdrop(this, width, height, game.id);

            const graphics = this.make.graphics(undefined, false);
            const box = drawToken(graphics, game.shape, game.accent, String(game.clickValue));
            graphics.generateTexture("token", box.w, box.h);
            graphics.destroy();

            const token = this.add.image(cx, cy, "token").setOrigin(0.5);

            const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            const baseY = cy;
            let bob = 0;
            let hold = 0;
            const place = (y: number) => {
              token.setPosition(cx, Math.round(y));
            };
            place(baseY);
            if (!reduce) {
              this.time.addEvent({
                delay: game.mode === "idle" ? 180 : 320,
                loop: true,
                callback: () => {
                  if (hold > 0) {
                    hold -= 1;
                    return;
                  }
                  bob = bob ? 0 : 1;
                  place(baseY - bob * PIXEL);
                },
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
              hold = 2;
              place(baseY + PIXEL);
              const x = snap(pointer.x);
              const y = snap(pointer.y);
              const tag = spawnPopup(this, `+${game.clickValue}`, x, y - 8);
              this.tweens.add({
                targets: tag.image,
                y: y - 36,
                alpha: 0,
                duration: 420,
                ease: "Linear",
                onComplete: () => {
                  tag.image.destroy();
                  this.textures.remove(tag.key);
                },
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
                this.cameras.main.flash(120, 200, 245, 66, false);
              }
              setScore(scoreRef.current);
            };
          }
        }

        gameInstance = new Phaser.Game({
          type: Phaser.CANVAS,
          parent: hostRef.current,
          width: SCENE_W,
          height: SCENE_H,
          backgroundColor: "#12091c",
          banner: false,
          pixelArt: true,
          antialias: false,
          roundPixels: true,
          audio: { noAudio: true },
          scene: RunScene,
          scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
          },
          render: {
            antialias: false,
            pixelArt: true,
            roundPixels: true,
          },
          callbacks: {
            postBoot: (phaserGame) => {
              phaserGame.canvas.style.imageRendering = "pixelated";
              const context = phaserGame.canvas.getContext("2d");
              if (context) context.imageSmoothingEnabled = false;
            },
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

  const ratio = goal > 0 ? Math.max(0, Math.min(1, score / goal)) : 0;

  return (
    <section className="cabinet" aria-label={stageLabel}>
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className={game.mode === "idle" ? "chip chip-mana" : "chip"}>{modeLabel}</p>
          <h2 className="mt-2 text-2xl leading-tight font-black text-paper">{title}</h2>
        </div>
        <div className="score-box">
          <p className="text-[11px] font-bold tracking-wide text-dim uppercase">{scoreLabel}</p>
          <p className="font-pixel text-[15px] text-lime" data-score={Math.floor(score)}>
            {Math.floor(score)}
          </p>
        </div>
      </div>
      <div className="cabinet-screen">
        <div ref={hostRef} className="stage-host" />
      </div>
      <div className="mt-3">
        <div className="meter" aria-hidden>
          <span className="meter-fill meter-gold" style={{ width: `${ratio * 100}%` }} />
        </div>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-sm text-mist">
          <p>{failed ? "Phaser failed to start." : hint}</p>
          <p className="font-bold text-dim">
            {clicksLabel} <span className="font-pixel text-[11px] text-lime">{clicks}</span>
            {" · "}
            {goalLabel} <span className="font-pixel text-[11px] text-gold">{goal}</span>
            {loops > 0 ? ` · ${continuingLabel}` : ""}
          </p>
        </div>
      </div>
    </section>
  );
}

function paintBackdrop(scene: import("phaser").Scene, width: number, height: number, seedKey: string) {
  const bg = scene.add.graphics();
  bg.fillStyle(0x12091c, 1);
  bg.fillRect(0, 0, width, height);
  bg.fillStyle(0x2a1c44, 1);
  for (let y = 4; y < height; y += 16) {
    for (let x = 4; x < width; x += 16) {
      bg.fillRect(x, y, 2, 2);
    }
  }
  let seed = 2166136261;
  for (let index = 0; index < seedKey.length; index += 1) {
    seed ^= seedKey.charCodeAt(index);
    seed = Math.imul(seed, 16777619);
  }
  const rand = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const palette = [0xffd23f, 0x49d6ff, 0xfff4e4, 0xc8f542, 0xff5a45];
  for (let index = 0; index < 26; index += 1) {
    const x = Math.floor(rand() * (width / PIXEL)) * PIXEL;
    const y = Math.floor(rand() * (height / PIXEL)) * PIXEL;
    const size = index % 6 === 0 ? PIXEL : 2;
    bg.fillStyle(palette[index % palette.length], 1);
    bg.fillRect(x, y, size, size);
  }
}

function drawToken(graphics: import("phaser").GameObjects.Graphics, shape: GameShape, accent: string, label: string) {
  const color = hexToInt(accent);
  const highlight = mixWhite(color, 0.55);
  const ink = shape === "ring" ? color : 0x140c08;
  if (shape === "bar") {
    const w = 176;
    const h = 56;
    graphics.fillStyle(0x05030a, 1);
    graphics.fillRect(0, 0, w, h);
    graphics.fillStyle(color, 1);
    graphics.fillRect(PIXEL, PIXEL, w - PIXEL * 2, h - PIXEL * 2);
    graphics.fillStyle(highlight, 1);
    graphics.fillRect(PIXEL, PIXEL, w - PIXEL * 2, PIXEL * 2);
    graphics.fillStyle(0x05030a, 1);
    for (let x = 24; x < w - PIXEL * 2; x += 24) {
      if (Math.abs(x - w / 2) < 22) continue;
      graphics.fillRect(x, PIXEL * 3, PIXEL, h - PIXEL * 5);
    }
    drawBitmap(graphics, label, w / 2, h / 2, ink, PIXEL, false);
    return { w, h };
  }

  const size = 104;
  const cx = 52;
  const cy = 52;
  const radius = 40;
  if (shape === "diamond") {
    fillDiamond(graphics, cx, cy, radius + PIXEL, 0x05030a);
    fillDiamond(graphics, cx, cy, radius, color);
    fillDiamond(graphics, cx - 10, cy - 16, 10, highlight);
  } else if (shape === "ring") {
    fillRing(graphics, cx, cy, radius + PIXEL, 18, 0x05030a);
    fillRing(graphics, cx, cy, radius, 14, color);
    graphics.fillStyle(highlight, 1);
    graphics.fillRect(cx - 18, cy - radius + 10, PIXEL * 3, PIXEL);
  } else {
    fillCircle(graphics, cx, cy, radius + PIXEL, 0x05030a);
    fillCircle(graphics, cx, cy, radius, color);
    graphics.fillStyle(highlight, 1);
    graphics.fillRect(cx - 18, cy - 24, PIXEL * 3, PIXEL * 2);
    graphics.fillRect(cx - 10, cy - 28, PIXEL * 2, PIXEL);
  }
  drawBitmap(graphics, label, cx, cy, ink, PIXEL, shape === "ring");
  return { w: size, h: size };
}

const GLYPHS: Record<string, string[]> = {
  "0": ["111", "101", "101", "101", "111"],
  "1": ["010", "110", "010", "010", "111"],
  "2": ["111", "001", "111", "100", "111"],
  "3": ["111", "001", "111", "001", "111"],
  "4": ["101", "101", "111", "001", "001"],
  "5": ["111", "100", "111", "001", "111"],
  "6": ["111", "100", "111", "101", "111"],
  "7": ["111", "001", "001", "001", "001"],
  "8": ["111", "101", "111", "101", "111"],
  "9": ["111", "101", "111", "001", "111"],
  "+": ["000", "010", "111", "010", "000"],
};

function drawBitmap(
  graphics: import("phaser").GameObjects.Graphics,
  text: string,
  centerX: number,
  centerY: number,
  color: number,
  scale: number,
  outlined: boolean,
) {
  const glyphWidth = 3 * scale;
  const gap = scale;
  const width = text.length * glyphWidth + Math.max(0, text.length - 1) * gap;
  let cursor = Math.round(centerX - width / 2);
  const top = Math.round(centerY - (5 * scale) / 2);
  for (const char of text) {
    const rows = GLYPHS[char];
    if (rows) {
      if (outlined) {
        for (const [ox, oy] of [
          [scale, 0],
          [-scale, 0],
          [0, scale],
          [0, -scale],
        ]) {
          stampGlyph(graphics, rows, cursor + ox, top + oy, 0x05030a, scale);
        }
      }
      stampGlyph(graphics, rows, cursor, top, color, scale);
    }
    cursor += glyphWidth + gap;
  }
}

function stampGlyph(
  graphics: import("phaser").GameObjects.Graphics,
  rows: string[],
  x: number,
  y: number,
  color: number,
  scale: number,
) {
  graphics.fillStyle(color, 1);
  rows.forEach((row, rowIndex) => {
    for (let column = 0; column < row.length; column += 1) {
      if (row[column] === "1") {
        graphics.fillRect(x + column * scale, y + rowIndex * scale, scale, scale);
      }
    }
  });
}

let popupSerial = 0;

function spawnPopup(scene: import("phaser").Scene, text: string, x: number, y: number) {
  const scale = PIXEL;
  const glyphWidth = 3 * scale;
  const gap = scale;
  const pad = scale;
  const width = text.length * glyphWidth + Math.max(0, text.length - 1) * gap + pad * 2;
  const height = 5 * scale + pad * 2;
  const graphics = scene.make.graphics(undefined, false);
  graphics.fillStyle(0x05030a, 1);
  graphics.fillRect(0, 0, width, height);
  drawBitmap(graphics, text, width / 2, height / 2, 0xfff4e4, scale, false);
  const key = `pop-${popupSerial}`;
  popupSerial += 1;
  graphics.generateTexture(key, width, height);
  graphics.destroy();
  return { key, image: scene.add.image(x, y, key).setOrigin(0.5, 1) };
}

function fillCircle(graphics: import("phaser").GameObjects.Graphics, cx: number, cy: number, radius: number, color: number) {
  graphics.fillStyle(color, 1);
  for (let y = -radius; y <= radius; y += PIXEL) {
    for (let x = -radius; x <= radius; x += PIXEL) {
      const dx = x + PIXEL / 2;
      const dy = y + PIXEL / 2;
      if (dx * dx + dy * dy <= radius * radius) {
        graphics.fillRect(cx + x, cy + y, PIXEL, PIXEL);
      }
    }
  }
}

function fillRing(
  graphics: import("phaser").GameObjects.Graphics,
  cx: number,
  cy: number,
  radius: number,
  thickness: number,
  color: number,
) {
  const inner = Math.max(0, radius - thickness);
  graphics.fillStyle(color, 1);
  for (let y = -radius; y <= radius; y += PIXEL) {
    for (let x = -radius; x <= radius; x += PIXEL) {
      const dx = x + PIXEL / 2;
      const dy = y + PIXEL / 2;
      const distance = dx * dx + dy * dy;
      if (distance <= radius * radius && distance >= inner * inner) {
        graphics.fillRect(cx + x, cy + y, PIXEL, PIXEL);
      }
    }
  }
}

function fillDiamond(graphics: import("phaser").GameObjects.Graphics, cx: number, cy: number, radius: number, color: number) {
  graphics.fillStyle(color, 1);
  for (let y = -radius; y <= radius; y += PIXEL) {
    for (let x = -radius; x <= radius; x += PIXEL) {
      if (Math.abs(x + PIXEL / 2) + Math.abs(y + PIXEL / 2) <= radius) {
        graphics.fillRect(cx + x, cy + y, PIXEL, PIXEL);
      }
    }
  }
}

function hexToInt(hex: string) {
  return Number.parseInt(hex.replace("#", ""), 16);
}

function mixWhite(color: number, amount: number) {
  const mix = (channel: number) => Math.max(0, Math.min(255, Math.round(channel + (255 - channel) * amount)));
  const red = mix((color >> 16) & 255);
  const green = mix((color >> 8) & 255);
  const blue = mix(color & 255);
  return (red << 16) | (green << 8) | blue;
}

function snap(value: number) {
  return Math.round(value / PIXEL) * PIXEL;
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
