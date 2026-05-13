@echo off
title NetPass Pro - Serveur Local
color 0A

echo.
echo  ================================================
echo    NetPass Pro - Demarrage
echo  ================================================
echo.

REM Demarrer le backend dans une nouvelle fenetre
echo  Demarrage du backend (port 3001)...
start "NetPass Backend" cmd /k "cd /d %~dp0backend && node src/index.js"

REM Attendre 3 secondes que le backend demarre
timeout /t 3 /nobreak >nul

REM Demarrer le frontend dans une nouvelle fenetre
echo  Demarrage du frontend (port 3000)...
start "NetPass Frontend" cmd /k "cd /d %~dp0frontend && npm start"

timeout /t 4 /nobreak >nul

echo.
echo  ================================================
echo    NetPass Pro est demarre !
echo.
echo    Depuis ce PC      : http://localhost:3000
echo    Depuis le reseau  : http://10.10.10.2:3000
echo    Panel admin       : http://10.10.10.2:3000/admin
echo  ================================================
echo.
echo  Pour arreter : fermez les deux fenetres "NetPass"
echo.
pause
