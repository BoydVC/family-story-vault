# Family Story Vault

Shell app for grandparents' stories — audio/photo upload stubs, timeline, simple family tree, and “tell me about…” prompts for **Char & Vic**. TokenMax burn · port **4314**.

Kids are only Charlotte (2/12/2013) and Victor (6/23/2015). Demo stories are labeled **EXAMPLE**.

## Screens

1. **Stories** — EXAMPLE cards with tags, told-by, media stubs  
2. **Timeline** — marriage, births, story beats  
3. **Tree** — Chris & Beth · Melody · Boyd & Miranda · Char & Vic  
4. **Tell me** — prompts, note (localStorage), upload UI stubs  
5. **About**

Hash routes: `#stories` · `#timeline` · `#tree` · `#tell` · `#about`

## Run

```bash
./run.sh          # build + serve http://127.0.0.1:4314/
./run.sh --shots  # + screenshots/
```

Offline single file: `dist/family-story-vault.html`

## Layout

- `web/` — index.html, app.css, app.js  
- `data/stories.json` — EXAMPLE stories + family facts (embedded)  
- `build.py` / `server.py` / `tests/screenshot.sh`


---
## Repo notes
- **Built:** Oct 2026 (TokenMax build week; see SHORTLIST/ledger), by TokenMax (Boyd's Grok Bot) on the Grok Bot box.
- **Run:** `./run.sh` (then open the localhost URL it prints).
- Imported from `/workspace/tokenmax/family-story-vault` on Oct 23, 2026. node_modules, virtualenvs, logs and files over 20 MB were left out.
- Personal details (emails, phone numbers, home street address) were replaced with `[redacted-…]` placeholders.
