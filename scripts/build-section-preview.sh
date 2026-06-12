#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -ne 1 ]; then
  echo "Usage: $0 docs/sections/XX-chapter.tex" >&2
  exit 1
fi

TARGET_INPUT="$1"
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DOCS_DIR="$REPO_ROOT/docs"
TARGET_ABS="$(cd "$REPO_ROOT" && python - <<'PY' "$TARGET_INPUT"
import os, sys
print(os.path.abspath(sys.argv[1]))
PY
)"

case "$TARGET_ABS" in
  "$DOCS_DIR"/sections/*.tex) ;;
  *)
    echo "Target must be under docs/sections and end with .tex" >&2
    exit 1
    ;;
esac

TARGET_REL_FROM_DOCS="${TARGET_ABS#$DOCS_DIR/}"
TARGET_STEM="${TARGET_REL_FROM_DOCS%.tex}"
PREVIEW_DIR="$DOCS_DIR/previews/$(dirname "$TARGET_STEM")"
BUILD_DIR="$DOCS_DIR/.preview-build/$(dirname "$TARGET_STEM")"
PREVIEW_BASENAME="$(basename "$TARGET_STEM")"
WRAPPER_TEX="$BUILD_DIR/${PREVIEW_BASENAME}-preview.tex"

mkdir -p "$PREVIEW_DIR" "$BUILD_DIR"

cat > "$WRAPPER_TEX" <<EOF
\\documentclass[12pt,a4paper]{report}

% Auto-generated standalone preview wrapper.
\\usepackage{fontspec}
\\usepackage[vietnamese]{babel}
\\setmainfont{Times New Roman}
\\setsansfont{Arial}
\\setmonofont{Consolas}
\\usepackage{geometry}
\\usepackage{setspace}
\\usepackage{graphicx}
\\usepackage{xcolor}
\\usepackage{booktabs}
\\usepackage{tabularx}
\\usepackage{longtable}
\\usepackage{array}
\\usepackage{enumitem}
\\usepackage{hyperref}
\\usepackage{fancyhdr}
\\usepackage{titlesec}
\\usepackage{caption}
\\usepackage{subcaption}
\\usepackage{amsmath}
\\usepackage{tikz}
\\usetikzlibrary{arrows.meta,positioning,shapes.geometric,fit,calc,patterns}

\\geometry{top=2.5cm,bottom=2.5cm,left=3cm,right=2.5cm}
\\onehalfspacing
\\setlength{\\parindent}{0.8cm}
\\setlength{\\parskip}{4pt}
\\setlist[itemize]{leftmargin=1.25cm,itemsep=2pt,topsep=4pt}
\\setlist[enumerate]{leftmargin=1.25cm,itemsep=2pt,topsep=4pt}

\\definecolor{Navy}{RGB}{18,52,86}
\\definecolor{Blue}{RGB}{36,101,180}
\\definecolor{LightBlue}{RGB}{232,242,255}
\\definecolor{LightGray}{RGB}{245,247,250}
\\definecolor{Green}{RGB}{38,139,96}
\\definecolor{Orange}{RGB}{220,130,40}
\\definecolor{Red}{RGB}{190,55,55}
\\definecolor{Purple}{RGB}{110,76,180}

\\hypersetup{hidelinks,pdftitle={Section Preview},pdfauthor={SourceVerify}}
\\pagestyle{fancy}
\\fancyhf{}
\\fancyhead[L]{\\small\\textit{SourceVerify Preview}}
\\fancyhead[R]{\\small\\textit{$TARGET_REL_FROM_DOCS}}
\\fancyfoot[C]{\\thepage}

\\titleformat{\\chapter}{\\normalfont\\LARGE\\bfseries\\color{Navy}}{Chương \\thechapter.}{0.6em}{}
\\titleformat{\\section}{\\normalfont\\Large\\bfseries\\color{Navy}}{\\thesection.}{0.5em}{}
\\titleformat{\\subsection}{\\normalfont\\large\\bfseries\\color{Blue}}{\\thesubsection.}{0.5em}{}
\\titleformat{\\subsubsection}{\\normalfont\\normalsize\\bfseries}{\\thesubsubsection.}{0.5em}{}

\\newcolumntype{Y}{>{\\raggedright\\arraybackslash}X}
\\newcommand{\\method}[1]{\\textbf{#1}}
\\newcommand{\\code}[1]{\\texttt{#1}}

\\begin{document}
\\setcounter{chapter}{1}
\\chapter*{Preview: $TARGET_REL_FROM_DOCS}
\\addcontentsline{toc}{chapter}{Preview: $TARGET_REL_FROM_DOCS}
\\input{$TARGET_REL_FROM_DOCS}
\\end{document}
EOF

cd "$DOCS_DIR"
xelatex -interaction=nonstopmode -output-directory "$BUILD_DIR" "$WRAPPER_TEX" >/dev/null
xelatex -interaction=nonstopmode -output-directory "$BUILD_DIR" "$WRAPPER_TEX" >/dev/null
cp "$BUILD_DIR/${PREVIEW_BASENAME}-preview.pdf" "$PREVIEW_DIR/${PREVIEW_BASENAME}.pdf"
printf 'Generated %s\n' "$PREVIEW_DIR/${PREVIEW_BASENAME}.pdf"
