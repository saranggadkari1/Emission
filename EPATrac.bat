@echo off
cd /d "%~dp0"
title EPATrac v1.0

if exist node.exe (
  node.exe server.js
) else (
  where node >nul 2>&1
  if %errorlevel%==0 (
    node server.js
  ) else (
    echo Node.js not found. Run GET-NODE.bat first to download portable node.exe
    echo Or install Node.js from https://nodejs.org
    pause
    exit /b 1
  )
)
pause
