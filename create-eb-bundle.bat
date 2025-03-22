@echo off
echo Creating Elastic Beanstalk deployment package...

REM Install dependencies
call npm install

REM Build Angular app and backend
call npm run build

REM Create necessary directories
mkdir -p .ebextensions

REM Zip the application for deployment
echo Creating ZIP file for deployment...
powershell Compress-Archive -Path .\dist\*,.\package.json,.\package-lock.json,.\.ebextensions\*,.\Procfile -DestinationPath .\eb-deploy.zip -Force

echo Deployment package created: eb-deploy.zip
echo Upload this file to Elastic Beanstalk console manually or use: eb deploy --staged
