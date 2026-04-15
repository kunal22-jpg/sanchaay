# Sustain-a-thon Project Bundler
# Run this script to create a ZIP file of your project for submission.

$projectName = "Sustain-a-thon-Project"
$zipName = "$projectName.zip"
$excludeList = @("node_modules", ".git", "dist", ".vite", "*.zip", "zip-project.ps1")

Write-Host "📦 Bundling project: $projectName..." -ForegroundColor Cyan

if (Test-Path $zipName) {
    Remove-Item $zipName
}

Compress-Archive -Path ./* -DestinationPath $zipName -Exclude $excludeList

Write-Host "✅ Done! Project saved as $zipName" -ForegroundColor Green
Write-Host "You can now upload this file to your submission portal." -ForegroundColor Yellow
