# Docs preview workflow

## Full report
- Main entry: `docs/Report.tex`
- Full PDF output: `docs/Report.pdf`

## Per-chapter previews
- Source files: one `.tex` per chapter under `docs/sections/`
- Example:
  - source: `docs/sections/03-theory.tex`
  - preview: `docs/previews/sections/03-theory.pdf`

## How previews are generated
- Automatic: Claude Code hook runs after editing a `.tex` file under `docs/sections/`
- Manual: run `bash scripts/build-section-preview.sh docs/sections/XX-chapter.tex`

## Recommended editing flow
1. Edit a chapter file under `docs/sections/`
2. Open the matching PDF under `docs/previews/sections/`
3. If needed, rebuild the full report with `xelatex docs/Report.tex` from `docs/`

## Structure conventions
- `docs/sections/XX-<name>.tex` = one file per chapter
- `docs/sections/00-preface.tex`, `01-summary.tex`, `07-references.tex` = front/back matter
- `docs/previews/sections/` mirrors `docs/sections/` for easy lookup
