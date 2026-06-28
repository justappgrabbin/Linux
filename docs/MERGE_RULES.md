# Merge Rules

## Priority order

1. Keep all Kimi shell files and Kimi apps.
2. Add AION themes, ingestion pipeline, AutoLing functions, and real AION apps.
3. Add ResonanceAnalyzer as runtime unless/until a real UI wrapper exists.
4. Add This Is It Docker/APK/deploy tooling.
5. Remove stubs, placeholders, duplicates, and fake apps.

## What belongs where

| Source | Keep as | Destination |
|---|---|---|
| Kimi | Main shell, real apps, UI body | `shell/kimi/`, `apps/` |
| AION | Themes, ingest, AutoLing, real apps | `runtime/aion/`, `themes/aion/`, `apps/` |
| ResonanceAnalyzer.ts | Runtime analysis module | `runtime/resonance/` |
| This Is It | Docker/APK/build tooling only | `build/docker/`, `build/android/`, `scripts/` |

## Stub detection checklist

A file/app should be removed or hidden when it contains only:

- `TODO`
- `coming soon`
- `placeholder`
- `stub`
- `mock only`
- empty return component
- buttons without handlers
- route without implementation
- hard-coded fake result pretending to be runtime output

## Do not remove

Do not remove loose root files until classified. Loose is messy, not automatically fake. Annoying, yes. Fake, not proven.
