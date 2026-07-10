@echo off
cd /d "%~dp0"
title EPATrac v1.0
if exist "%~dp0node.exe" (
  "%~dp0node.exe" server.js
  goto :eof
)
where node >nul 2>nul
if %errorlevel%==0 (
  node server.js
  goto :eof
)
echo.
echo Node.js was not found.
echo Run GET-NODE.bat once to download a portable copy, then start EPATrac again.
echo.
pause
