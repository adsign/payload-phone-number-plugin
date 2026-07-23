# Conventions

## Naming

Use full, readable names — `response` not `res`, `request` not `req`, `error` not `err`, `message` not `msg`, `button` not `btn`, `number` not `num`, `index` not `idx`. No single-letter names. Name callback parameters after what they represent: `countries.find((country) => ...)`.

Exceptions: `_` for unused, and `_`-prefixed unused params.

## Comments

A comment earns its place when it says what a thing is *for* or what non-obvious code *does* — keep those. Never write internal design discussion or rationale: why the API was shaped this way, how it compares to other tools, what problem it replaced — that goes in the PR/chat, not the code. Don't restate a type/function's name or narrate obvious lines.

- Keep: `/** Formats the national number for the field's display format. */`
- Cut: `/** We format here because the old version showed raw E.164 and users complained. */`

## JSDoc

Always multi-line — `/**` on its own line, description on its own line(s), `*/` on its own line. Never single-line `/** ... */`.

## Object literals

Always multi-line. Every property on its own line, every nested object expanded — even single-property ones. **Non-negotiable** — this applies everywhere, including code shown in plans, examples, and chat, not just committed files.

```ts
// no
phoneNumberField({ admin: { width: '50%' } });

// yes
phoneNumberField({
    admin: {
        width: '50%',
    },
});
```

## Git

Never add `Co-Authored-By` trailers for AI agents (Claude, Copilot, Cursor, etc.) to commit messages. AI is a tool, not an author.

## Tests

- `pnpm test:int` — Vitest integration tests (in-memory MongoDB).
- `pnpm test:e2e` — Playwright end-to-end tests against the dev admin app.
- `pnpm lint --max-warnings=0` — ESLint (includes Prettier); `pnpm lint:fix` to autofix.
