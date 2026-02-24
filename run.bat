@echo off
chcp 65001 >nul 2>&1
title SourceVerify - AI-Generated Content Detector

echo ============================================
echo   SourceVerify - Starting...
echo ============================================
echo.

where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH.
    echo         Download: https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do echo [INFO] Node: %%i

if not exist "node_modules" (
    echo [INFO] Installing dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install dependencies.
        pause
        exit /b 1
    )
    echo [OK] Dependencies installed.
    echo.
)

echo ============================================
echo   http://localhost:3000
echo   Press Ctrl+C to stop
echo ============================================
echo.
call npm run dev
