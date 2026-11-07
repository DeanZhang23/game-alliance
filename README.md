# Game · 公用游戏联盟

MVP of the public game alliance: one sentence becomes a small click or idle game. Mining follows play, likes, and shares. Creators take the majority, players a small share. Chain: BSC. Token name, for now: **Game**. Token supply, contract, and emissions are intentionally skipped.

## Stack

Next.js App Router, TypeScript, Phaser 3, Tailwind CSS. Chinese and English switch in the header and persist in `localStorage`.

## Run locally

Requires Node.js 20+.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Production check:

```bash
npm run build
npm start
```

## Routes

| Route | What to verify |
| --- | --- |
| `/` | Vision line 「人人共创永不关机的世界」, the alliance name, the loop 想 → 造 → 玩 → 传 → 挖, and CTAs to `/create` and `/games`. |
| `/games` | Five sample cards. Each opens `/play/[id]`. |
| `/create` | Type one sentence, generate a mock click/idle config, play the preview, then open `/play/draft-…`. |
| `/economy` | Weight table for effective play, likes, and shares. Creator majority, player minority. BSC cycle claim copy. Token-details-skipped notice. |
| `/play/star-kiln` | Phaser stage. Click the canvas and the score increases. Also try `moss-clock`, `lantern-well`, `tide-press`, `signal-kites`. |
| `/play/missing-id` | Missing-game state with a link back to the catalog. |

Header links cover home, catalog, create, and economy. Use **中文 / EN** to switch language on every page.

## Play check

On a play page, click the canvas. The score in the header of the stage should jump by the number drawn on the shape. Eight taps, or one tap plus 20 seconds, marks one effective play and shows the illustrative point split. Like copies nothing on-chain; Share copies the page URL. Both are session-only demos of the weights.

Generated games live in `sessionStorage` for the current tab. Refresh keeps a draft; a new tab does not.
