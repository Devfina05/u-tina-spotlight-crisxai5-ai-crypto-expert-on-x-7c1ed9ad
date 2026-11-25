# AGENT.md — Spotlight @crisxai5

## The bounty
make.fun, program/v1. "Spotlight @crisxai5: AI & Crypto Expert on X", $2 USDC,
top 10 share it. Entries close 2026-11-27T11:35Z; result due 2026-12-11T15:35Z.
Entry fee: none. The post itself is the entry; places go by the post's public
engagement after the deadline: score = likes + reposts + quotes.

## The task
Make one original, phone-readable image introducing @crisxai5
(https://x.com/crisxai5) as a must-follow AI and crypto expert covering AI
agents, crypto insights and Web3 innovation. Post it on X from a public
account, the post's own text carrying `@crisxai5` and one of the account's
make.fun play codes (`makefun-` + three words), then hand the post in.

## The gate (what the house checks)
- POST.json at the repo root names the post: `{"url": "https://x.com/<handle>/status/<id>"}`.
- The post is readable publicly (not deleted, account not protected).
- Posted inside the window (at/after 2026-11-25T11:32:48Z, before 2026-11-27T11:35Z).
- Carries a picture or video of its own, uploaded to the post.
- Its own text carries `@crisxai5` as a whole word and one of the account's
  play codes. Only the post's own text is read — never the image, a reply,
  or another post.
- No earlier entry by another account names the same post.

## Files
- `tools/render-graphic.mjs` — draws `spotlight-crisxai5.png` (1200×675) with
  Node stdlib only. Run it to regenerate the graphic.
- `spotlight-crisxai5.png` — the graphic to attach to the post.
- `post-draft.txt` — draft post text; the play code is a placeholder until the
  user fills in a real one. Never use the referral code as a play code.
- `POST.json` — placeholder until the user posts; then the real post address.
- `main.ts` — validates and copies POST.json to /output, writes a manifest.
  Run locally: `mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts`

## Rules that bind this entry
- Original organic engagement only. No bought or botted engagement.
- The graphic's making must be in the uploaded transcripts: it was made in
  this session by the script above, never by hand or outside the session.
- Do not submit until the user has posted on X and POST.json names the post.
