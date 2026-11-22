# Security Policy

## Scope

This repository contains static-analysis rules (Semgrep/Opengrep) and two small
example applications used to test them. The code under `examples/vulnerable/` is
**intentionally insecure** and exists only to prove the rules fire. Do not deploy
it or copy it into production.

## Reporting a vulnerability

If you find a problem in a rule (a false negative that lets a real bug through, or
a pattern that could mislead a user), please open a private report by email to
**helhinho10@gmail.com** rather than a public issue. Include the rule id, a minimal
code sample, and whether Semgrep reported it or missed it.

## What is not a vulnerability

- Findings produced by the `examples/vulnerable/` app. That is by design.
- False positives on the heuristic rules (`prisma-find-by-param-no-owner`,
  `nest-controller-no-guard`, `jwt-verify-no-algorithms`). These are documented as
  heuristics whose false-positive rate still has to be measured on real codebases.

## Supported engines

Rules are plain YAML and MIT-licensed, so they run on both Semgrep and Opengrep.
They are validated with `semgrep --test` against the pinned Docker image listed in
the README.
