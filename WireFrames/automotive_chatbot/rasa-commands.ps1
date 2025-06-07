# Rasa Commands Helper Script
# Usage: .\rasa-commands.ps1 train
# Usage: .\rasa-commands.ps1 shell
# Usage: .\rasa-commands.ps1 run

param(
    [Parameter(Mandatory=$true)]
    [string]$Command
)

# Navigate to backend directory
Set-Location -Path "$PSScriptRoot\backend"

# Execute the rasa command using python module
switch ($Command.ToLower()) {
    "train" {
        Write-Host "🚀 Training Rasa model..." -ForegroundColor Green
        python -m rasa train
    }
    "shell" {
        Write-Host "🤖 Starting Rasa shell..." -ForegroundColor Green
        python -m rasa shell
    }
    "run" {
        Write-Host "🌐 Starting Rasa server..." -ForegroundColor Green
        python -m rasa run --enable-api --cors "*" --port 5005
    }
    "interactive" {
        Write-Host "🎯 Starting Rasa interactive learning..." -ForegroundColor Green
        python -m rasa interactive
    }
    default {
        Write-Host "❌ Unknown command: $Command" -ForegroundColor Red
        Write-Host "Available commands: train, shell, run, interactive" -ForegroundColor Yellow
    }
} 