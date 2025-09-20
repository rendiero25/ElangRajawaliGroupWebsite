@echo off
echo ========================================
echo Starting ERG Website Frontend (Vite)
echo ========================================
echo Current directory: %cd%
echo.
echo Checking if frontend dependencies are installed...
if not exist "node_modules" (
    echo Installing frontend dependencies...
    npm install
    echo.
)

echo Starting frontend server on http://localhost:5173
echo Backend should be running on http://localhost:5000
echo Press Ctrl+C to stop the server
echo ========================================
npm run dev
