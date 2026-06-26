@echo off
cd /d "%~dp0"
title FMVSSTrac — Pilot Systems International LLC

if exist "node.exe" (
  echo Starting FMVSSTrac with portable Node...
  node.exe server.js
) else (
  where node >nul 2>&1
  if %errorlevel%==0 (
    echo Starting FMVSSTrac with system Node...
    node server.js
  ) else (
    echo Node.js not found. Run GET-NODE.bat first to download portable Node.
    pause
    exit /b 1
  )
)
pause
