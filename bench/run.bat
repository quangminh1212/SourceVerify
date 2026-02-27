@echo off
chcp 65001 >nul
cd /d "%~dp0"
cd ..

echo ══════════════════════════════════════════════════════════
echo   SourceVerify Benchmark Runner
echo ══════════════════════════════════════════════════════════
echo.
echo   Usage: run.bat [count] [--skip-download]
echo   Examples:
echo     run.bat              (200 images, download + test)
echo     run.bat 500          (500 images)
echo     run.bat 1000         (1000 images)
echo     run.bat --skip-download  (test existing images only)
echo.

set COUNT=%1
if "%COUNT%"=="" set COUNT=200
if "%COUNT%"=="--skip-download" (
    set COUNT=200
    set EXTRA=--skip-download
) else (
    set EXTRA=%2
)

echo   Config: %COUNT% images %EXTRA%
echo   Dir:    %CD%
echo.

node bench\benchmark.js --count=%COUNT% %EXTRA%

echo.
echo ══════════════════════════════════════════════════════════
echo   Done! Check these files:
echo     bench\bench.log          - Summary log
echo     bench\signals_detail.log - Per-image signal details
echo     bench\results.json       - JSON results
echo ══════════════════════════════════════════════════════════
echo.
pause
