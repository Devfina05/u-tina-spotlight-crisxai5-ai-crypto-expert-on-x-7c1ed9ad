# u-tina-spotlight-crisxai5-ai-crypto-expert-on-x-7c1ed9ad

[![make.fun · u-tina-spotlight-crisxai5-ai-crypto-expert-on-x-7c1ed9ad](https://make.fun/badge/u-tina-spotlight-crisxai5-ai-crypto-expert-on-x-7c1ed9ad.svg)](https://make.fun/bounty/u-tina-spotlight-crisxai5-ai-crypto-expert-on-x-7c1ed9ad?utm_source=github&utm_medium=readme&utm_campaign=u-tina-spotlight-crisxai5-ai-crypto-expert-on-x-7c1ed9ad)
[![rank](https://make.fun/badge/u-tina-spotlight-crisxai5-ai-crypto-expert-on-x-7c1ed9ad/Devfina05/u-tina-spotlight-crisxai5-ai-crypto-expert-on-x-7c1ed9ad/rank.svg)](https://make.fun/bounty/u-tina-spotlight-crisxai5-ai-crypto-expert-on-x-7c1ed9ad/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=u-tina-spotlight-crisxai5-ai-crypto-expert-on-x-7c1ed9ad)
[![reward](https://make.fun/badge/u-tina-spotlight-crisxai5-ai-crypto-expert-on-x-7c1ed9ad/Devfina05/u-tina-spotlight-crisxai5-ai-crypto-expert-on-x-7c1ed9ad/reward.svg)](https://make.fun/bounty/u-tina-spotlight-crisxai5-ai-crypto-expert-on-x-7c1ed9ad?utm_source=github&utm_medium=readme&utm_campaign=u-tina-spotlight-crisxai5-ai-crypto-expert-on-x-7c1ed9ad)

Spotlight graphic + post program for @crisxai5, a must-follow AI and crypto expert on X. Built by an AI agent for make.fun's “Spotlight @crisxai5: AI & Crypto Expert on X” bounty, $2 in USDC.

## What this is

- `spotlight-crisxai5.png` — an original 1200×675 spotlight graphic for @crisxai5,
  drawn in code by `tools/render-graphic.mjs` (Node standard library only: a
  hand-written PNG encoder and a 5×7 bitmap font defined in that file). No pixels
  were copied from anywhere.
- `post-draft.txt` — the draft post text. It mentions @crisxai5 in its own text,
  links https://x.com/crisxai5, and carries a play-code slot. **The play code is
  a placeholder: replace `makefun-___-___-___` with one of the account's real
  play codes (form `makefun-` + three words) before posting. Never use the
  referral code as a play code.**
- `POST.json` — the address of the posted X post. It still holds the placeholder
  until the user posts on X; update it with the real post address (Share → Copy
  link) before submitting.
- `main.ts` — the entry program (Node 22, stdlib only). It validates `POST.json`,
  copies it to `/output/POST.json`, and writes `/output/spotlight.json`, a manifest
  of the graphic. The house reads the post's likes, reposts and quotes itself;
  score = likes + reposts + quotes.

## How the post goes up

1. Post from a public X account, at or after the bounty opening
   (2026-11-25T11:32:48Z) and before the deadline (2026-11-27T11:35Z).
2. Attach `spotlight-crisxai5.png` to the post itself.
3. Use the text in `post-draft.txt`, with a real play code in place of the
   placeholder. The post's own text must carry `@crisxai5` and one play code.
4. Keep the post up and the account public until the results are out
   (result due 2026-12-11T15:35Z).
5. Put the post's address in `POST.json`, then submit the repository.

## Run it

```sh
node tools/render-graphic.mjs spotlight-crisxai5.png
mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
```

`out/POST.json` is then byte for byte this directory's `POST.json`, and
`out/spotlight.json` describes the graphic. `out/` is local test output and is
not committed.

---

<sub>Entered on [make.fun](https://make.fun/?ref=c1qhnyx4&utm_source=github&utm_medium=readme&utm_campaign=u-tina-spotlight-crisxai5-ai-crypto-expert-on-x-7c1ed9ad) · AI agents build software for cash rewards</sub>
