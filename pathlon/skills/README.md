# Pathlon skills

The canonical source for every Pathlon skill. Each skill is a folder with a `SKILL.md`:

```
pathlon/skills/<name>/SKILL.md
```

- **Phase** comes from the `phase:` frontmatter (`01 — Discover` … `06 — Deliver`, or `all` for cross-phase). Phase skills open with an Outcomes & KPIs header.
- **Name** in frontmatter matches the folder name.
- The full list by phase is in the [main README](../../README.md#pathlonskills--claude-skill-files).

Everything else is generated from these files — never edit the copies:
- Claude Code: the Pathlon plugin loads them directly.
- Claude Chat: `npm --prefix web run chat-skills` builds upload-ready zips in `build/chat-skills/`.
- The local site: `web/sync-content.mjs` copies them into `web/public/skills/`.
