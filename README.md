# SynthAI Linux Integration Target

This repo is the clean assembly target for the merged SynthAI/AION/Kimi/This-Is-It build.

## Non-negotiable merge rule

Kimi is the main shell. Do not replace or gut Kimi.

AION is added as:

- alternative themes/modes
- ingestion/runtime functions
- AutoLing / 5W analysis layer
- optional real apps only

This Is It is added as:

- Docker build tooling
- APK build tooling
- deployment scripts

ResonanceAnalyzer is added as:

- runtime analysis module
- app only if wrapped by a real user-openable UI

## App rule

Only real apps go into `apps/`.

A file counts as an app only if it has one of these:

- user-openable UI screen/component/page
- runnable entry point
- manifest/config that launches it
- clear user-facing function

Everything else goes into `runtime/`, `tools/`, `docs/`, or `build/`.

## Stub rule

Remove stubs everywhere.

Remove:

- placeholder pages
- coming soon screens
- empty components
- dummy routes
- fake buttons
- mock APIs that do not connect
- duplicate half-built components
- demo-only apps unless explicitly needed for testing

Do not delete unknown real code just because it is loose. Loose files must be classified first.

## Target structure

```text
apps/                  # real user-openable apps only
shell/kimi/            # full Kimi shell, preserved
runtime/aion/          # AION ingest, AutoLing, orchestration
runtime/resonance/     # ResonanceAnalyzer and field-analysis runtime
build/docker/          # Docker tooling from This Is It
build/android/         # APK builder from This Is It
scripts/               # audit, classify, merge helpers
docs/                  # merge notes and evidence
```

## Current status

This repo was created as a clean target. It does not yet contain the full Kimi shell source. Do not mark the merge complete until Kimi source, AION source, and This Is It build assets are all present and verified.
