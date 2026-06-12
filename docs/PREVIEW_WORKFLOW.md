# Docs preview workflow

## Full report
- Main entry: `docs/Report.tex`
- Full PDF output: `docs/Report.pdf`

## Per-file previews
- Source files live under `docs/sections/`
- Standalone preview PDFs are generated under matching paths in `docs/previews/`
- Example:
  - source: `docs/sections/05-implementation-results/01-implementation-environment-and-technology.tex`
  - preview: `docs/previews/sections/05-implementation-results/01-implementation-environment-and-technology.pdf`

## How previews are generated
- Automatic: Claude Code hook runs after editing a `.tex` file under `docs/sections/`
- Manual: run `bash scripts/build-section-preview.sh <path-to-tex-file>`

## Recommended editing flow
1. Edit a file under `docs/sections/`
2. Open the matching PDF under `docs/previews/sections/...`
3. If needed, rebuild the full report with `xelatex docs/Report.tex` from `docs/`

## Structure conventions
- `docs/sections/XX-<chapter>/index.tex` = chapter aggregator
- numbered child files = editable section/subsection fragments
- `docs/previews/` mirrors `docs/sections/` for easy lookup
