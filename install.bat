@echo off
title NetPass Pro - Installation
color 0A
echo.
echo  ================================================
echo    NetPass Pro - Installation Locale (Windows)
echo  ================================================
echo.

REM Verifier Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo  [ERREUR] Node.js n'est pas installe.
    echo  Telechargez-le sur : https://nodejs.org
    echo  Choisissez la version LTS et installez-la.
    pause
    exit /b 1
)

echo  [OK] Node.js detecte
echo.

REM Installer backend
echo  [1/4] Installation du backend...
cd backend
call npm install --silent
if %errorlevel% neq 0 (
    echo  [ERREUR] Echec installation backend
    pause
    exit /b 1
)
echo  [OK] Backend installe

REM Copier .env si pas encore fait
if not exist .env (
    copy .env.example .env >nul 2>&1
    echo  [INFO] Fichier .env cree - pensez a y mettre votre cle Wave
)

REM Generer Prisma + creer la base SQLite
echo  [2/4] Creation de la base de donnees...
call npx prisma generate --silent
call npx prisma db push --accept-data-loss
if %errorlevel% neq 0 (
    echo  [ERREUR] Echec creation base de donnees
    pause
    exit /b 1
)
echo  [OK] Base de donnees creee (netpass.db)

REM Installer frontend
echo  [3/4] Installation du frontend...
cd ..\frontend
call npm install --silent
if %errorlevel% neq 0 (
    echo  [ERREUR] Echec installation frontend
    pause
    exit /b 1
)
echo  [OK] Frontend installe

REM Build frontend
echo  [4/4] Compilation du frontend (peut prendre 1-2 minutes)...
call npm run build
if %errorlevel% neq 0 (
    echo  [ERREUR] Echec compilation frontend
    pause
    exit /b 1
)
echo  [OK] Frontend compile

cd ..
echo.
echo  ================================================
echo    Installation terminee avec succes !
echo    Lancez START.BAT pour demarrer NetPass Pro
echo  ================================================
echo.
pause
