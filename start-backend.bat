@echo off
echo ========================================
echo Starting ERG Website Backend Server
echo ========================================
cd backend
echo Current directory: %cd%
echo.
echo Checking if backend dependencies are installed...
if not exist "node_modules" (
    echo Installing backend dependencies...
    npm install
    echo.
)

echo Starting backend server on http://localhost:5000
echo Press Ctrl+C to stop the server
echo ========================================
npm start
