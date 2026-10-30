@echo off
echo ========================================================
echo  Deploying to GitHub: https://github.com/b-solomon/SE_IA3_AI_Library
echo  Student: BODDU SOLOMON (URK25CS1191) - Karunya University
echo ========================================================
echo.

cd /d "%~dp0"

where git >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Git is not installed or not in your system PATH.
    echo Please install Git from https://git-scm.com/download/win
    echo After installing, double-click this file again!
    echo.
    pause
    exit /b 1
)

echo [1/5] Initializing Git repository...
if not exist ".git" (
    git init
)

echo [2/5] Setting default branch to main...
git branch -M main

echo [3/5] Staging files...
git add .

echo [4/5] Committing changes...
git commit -m "feat: complete AI Digital Library Management System - BODDU SOLOMON (URK25CS1191)"

echo [5/5] Connecting remote repository...
git remote remove origin >nul 2>&1
git remote add origin https://github.com/b-solomon/SE_IA3_AI_Library.git

echo.
echo Pushing to GitHub...
git push -u origin main

echo.
echo ========================================================
echo  Done! Visit: https://github.com/b-solomon/SE_IA3_AI_Library
echo ========================================================
pause
