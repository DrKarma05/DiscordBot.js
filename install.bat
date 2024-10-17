@echo off

echo Installing GTPS bot for Discord...

npm init -y
if errorlevel 1 (
    echo Failed to initialize npm project. Please check the output for errors.
    exit /b 1
)

npm install discord.js
if errorlevel 1 (
    echo Failed to install discord.js. Please check the output for errors.
    exit /b 1
)

echo Registering commands...
node register-command.js
if errorlevel 1 (
    echo Failed to register commands. Please check the script for errors.
    exit /b 1
)

echo Starting account menu...
node account_menu.js
if errorlevel 1 (
    echo Failed to start account menu. Please check the script for errors.
    exit /b 1
)

echo Installation completed successfully.
timeout /t 3 >nul
exit
