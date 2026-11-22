# semgrep-rules

> [English](README.md) · [Português (Brasil)](README-pt-BR.md)

Static-analysis rules for **Node / TypeScript** backends built on **Prisma, NestJS,
Express and JWT**. Each rule targets a real, realistic bug class and ships with its
own test file. Two small example apps — one vulnerable, one fixed — prove the rules
catch the bug and go quiet once it is corrected.

> *"Every real bug I found became a rule that stops the regression."*

## What it is

- `rules/{prisma,nest,express,jwt}/*.yml` — one rule per file, each with a sibling
  `*.test.ts` validated by `semgrep --test` (the `// ruleid:` / `// ok:` annotations).
- `examples/vulnerable/` — a small NestJS + Prisma + Express API containing the bugs.
- `examples/fixed/` — the same API with the security controls in place.

All 10 rules currently pass `semgrep --test` (10/10). Running the rule set against
`examples/vulnerable/` produces 11 findings (all 10 rules fire); against
`examples/fixed/` it produces 0.

## 2-minute quick start

You need Docker. No Python, Node or Go required to run the rules.

Validate every rule against its test file:

```bash
docker run --rm -v "$(pwd):/src" semgrep/semgrep:1.184.0 semgrep --test /src/rules
```

Scan your own code with the rules:

```bash
docker run --rm -v "$(pwd):/src" semgrep/semgrep:1.184.0 \
  semgrep --config /src/rules /src/path/to/your/app
```

See the rules catch the vulnerable example and stay silent on the fixed one:

```bash
docker run --rm -v "$(pwd):/src" semgrep/semgrep:1.184.0 semgrep --config /src/rules /src/examples/vulnerable
docker run --rm -v "$(pwd):/src" semgrep/semgrep:1.184.0 semgrep --config /src/rules /src/examples/fixed
```

Pinned image: **`semgrep/semgrep:1.184.0`** (released 2026-11-05). Pin the same tag
everywhere for reproducible results.

## Rules

| Rule | What it catches | Severity |
|---|---|---|
| `prisma-raw-unsafe-taint` | User input (`req.body/query/params`) reaching `$queryRawUnsafe` / `$executeRawUnsafe` / `Prisma.raw`, even through a variable or concatenation (taint mode) | ERROR |
| `jwt-decode-as-auth` | `jwt.decode()` (no signature check) used to make an authorization/identity decision | ERROR |
| `express-cors-reflect-credentials` | CORS reflecting the request Origin together with `credentials: true` | ERROR |
| `nest-validationpipe-no-whitelist` | `ValidationPipe` without `whitelist: true` (mass assignment) | WARNING |
| `nest-public-on-write-route` | `@Public()` on a `@Post/@Put/@Patch/@Delete` route | WARNING |
| `cookie-session-insecure` | Session cookie missing `httpOnly` / `secure` / `sameSite` | WARNING |
| `open-redirect` | User input flowing into `res.redirect()` (taint mode) | WARNING |
| `prisma-find-by-param-no-owner` *(heuristic)* | `findUnique/findFirst` keyed only by a request-supplied id, with no owner scope (`ownerId/userId/tenantId`) — possible IDOR | INFO |
| `nest-controller-no-guard` *(heuristic)* | Write route with no `@UseGuards` on the method or the controller class | INFO |
| `jwt-verify-no-algorithms` *(heuristic)* | `jwt.verify()` without an explicit `algorithms` list | INFO |

### A note on the heuristic rules

The three rules marked *(heuristic)* are noisy by design. They flag patterns that are
**often** wrong but have legitimate exceptions (a global Nest guard, an id that is
already owner-scoped upstream, jsonwebtoken v9 already restricting algorithms by key
type). Their **false-positive rate has not been measured yet** — that measurement must
be done on real repositories before these are enforced in CI. No FP numbers are
published here because none have been measured.

## Engines: Semgrep and Opengrep

The rules are validated with Semgrep. After Semgrep changed the **license of its
rule registry** in December 2024, the community created **[Opengrep](https://opengrep.dev)**,
an open fork of the Semgrep engine. These rules are intentionally **MIT-licensed**
(see `LICENSE`) and use only core pattern features, so they are free to run on **any
compatible engine**, Semgrep or Opengrep. The CI includes a best-effort Opengrep job;
it was not executed by the author (see "What is not verified").

## Why this architecture

Every decision and every dependency, and why:

- **Why Semgrep as the engine.** Rules are readable (they look like the code they
  match), and Semgrep ships a native unit-test mode (`--test`) driven by `// ruleid:`
  / `// ok:` annotations, so each rule is proven against real code samples in CI.
  Rejected: an ESLint plugin (ties rules to one toolchain, weaker cross-file / taint
  analysis) and CodeQL (powerful but heavier, and its query language is far from the
  code being matched).
- **Why taint mode** (for `prisma-raw-unsafe-taint` and `open-redirect`). A literal
  pattern only catches the dangerous call when the user input is written *inside* it.
  Taint mode follows the data from a source (`req.body/query/params`) to the sink even
  through an intermediate variable or string concatenation, which is how these bugs
  actually look in real code. Limitation: Semgrep CE taint analysis is single-file.
- **Why the Prisma + Nest focus.** The public rule registries are thin for this stack,
  and it is the author's day-to-day stack (web pentest / AppSec on Node backends).
  Rules the registry already covers well (e.g. `dangerouslySetInnerHTML`) are left out.
- **Why Docker to run it.** This repo is developed on a machine with no Python. The
  official `semgrep/semgrep` image removes the need for a local Python/Semgrep install,
  and pinning an exact image tag makes results reproducible across machines and CI.
- **Why a vulnerable + fixed example pair** instead of only loose snippets. The pair
  proves two things at once: the rule catches a realistic bug (11 findings on
  `examples/vulnerable/`) **and** the corrected code passes clean (0 findings on
  `examples/fixed/`). It doubles as a reference for how to fix each finding.
- **Why MIT-licensed rules.** So they run on any engine, free of the Semgrep Rules
  License, including Opengrep.
- **Dependencies of the example apps** (`@nestjs/common`, `@nestjs/core`,
  `@prisma/client`, `express`, `express-session`, `cors`, `jsonwebtoken`, `typescript`)
  exist only so the examples are real, idiomatic code for each rule's target framework.
  They are not needed to run the rules themselves.

## What is not verified

- The **Opengrep** CI job and image/install reference were **not executed**; the exact
  Opengrep image tag could not be confirmed by the author. Confirm before relying on it.
- CI was **not run** by the author (no GitHub Actions execution from this environment).
- The example apps were **not `npm install`ed / typechecked** in this environment; they
  are written to compile against the pinned dependency versions but `tsc` was not run.
- Heuristic false-positive rates are **unmeasured** (see above).

## License

MIT — see [`LICENSE`](LICENSE). Copyright (c) 2026 Hélio Delfino.
Security policy: [`SECURITY.md`](SECURITY.md).
