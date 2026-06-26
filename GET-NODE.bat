@echo off
cd /d "%~dp0"
title Get Portable Node.js
echo Downloading portable node.exe...
powershell -Command "Invoke-WebRequest -Uri 'https://nodejs.org/dist/v20.11.0/win-x64/node.exe' -OutFile 'node.exe' -UseBasicParsing"
if exist "node.exe" (
  echo node.exe downloaded successfully.
) else (
  echo Download failed. Please install Node.js from https://nodejs.org and try again.
)
pause
