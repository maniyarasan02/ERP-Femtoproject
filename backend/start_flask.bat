@echo off
echo Starting Logistics ERP Flask Backend...
echo Backend will be available at: http://localhost:8000
echo Press Ctrl+C to stop the server.
echo.
cd /d "%~dp0"
"%LOCALAPPDATA%\Programs\Python\Python312\python.exe" app.py
