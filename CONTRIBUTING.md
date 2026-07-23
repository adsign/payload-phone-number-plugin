# Contributing

Bug reports, reproductions, and PRs are all welcome.

## Getting started

```bash
pnpm install
pnpm dev
```

This serves a Payload admin app from `dev/` at http://localhost:3000/admin on an in-memory MongoDB. Log in with `dev@payloadcms.com` / `test`. Its `employees` collection has a field for every option.

Two things to regenerate when you touch the plugin's surface:

- Added or renamed a client component → `pnpm dev:generate-importmap`
- Changed the stored shape → `pnpm dev:generate-types`

## Tests

```bash
pnpm test:int    # Vitest integration tests
pnpm test:e2e    # Playwright tests through the admin UI
pnpm lint        # add --max-warnings=0 to match CI
```

## Pull requests

The PR title becomes the changelog entry (we squash-merge). Use a [Conventional Commits](https://www.conventionalcommits.org/) type — `feat`, `fix`, `docs`, `chore`, `refactor`, `perf`, `build`, `ci`, `revert` — scope optional. A check validates it.

No `Co-Authored-By` trailers for AI agents. AI is a tool, not an author.
