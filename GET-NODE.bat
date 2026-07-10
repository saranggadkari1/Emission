@echo off
cd /d "%~dp0"
title EPATrac - download portable Node.js
echo Downloading portable node.exe (Node v20.11.0, win-x64)...
powershell -NoProfile -Command "try { Invoke-WebRequest -Uri 'https://nodejs.org/dist/v20.11.0/win-x64/node.exe' -OutFile '%~dp0node.exe'; Write-Host 'Done.' } catch { Write-Host 'Download failed:' $_.Exception.Message }"
echo.
if exist "%~dp0node.exe" (echo node.exe is ready. You can now run EPATrac.bat.) else (echo node.exe was not downloaded. Check your internet connection.)
echo.
pause
