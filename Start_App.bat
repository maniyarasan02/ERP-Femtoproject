@echo off
setlocal
set "BACKEND_DIR=%~dp0backend"
set "URL=http://localhost:8000"

echo ==========================================
echo Starting Logistics ERP Application...
echo ==========================================
echo.

if not exist "%BACKEND_DIR%\app.py" (
    echo [ERROR] Backend folder not found at %BACKEND_DIR%
    pause
    exit /b 1
)

cd /d "%BACKEND_DIR%"

:: Start Flask in a minimized window or separate process
echo [1/2] Launching backend server...
start /b cmd /c "start_flask.bat"

echo [2/2] Opening application in browser...
timeout /t 3 /nobreak >nul
start %URL%

echo.
echo Application is running!
echo Keep this window open while using the app.
echo.
echo URL: %URL%
echo ==========================================
pause
