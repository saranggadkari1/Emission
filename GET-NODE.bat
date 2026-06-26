@echo off
cd /d "%~dp0"
echo Downloading portable Node.js v20.11.0...
powershell -Command "Invoke-WebRequest -Uri 'https://nodejs.org/dist/v20.11.0/win-x64/node.exe' -OutFile 'node.exe'"
if exist node.exe (
  echo node.exe downloaded successfully.
) else (
  echo Download failed. Please download manually from https://nodejs.org
)
pause
