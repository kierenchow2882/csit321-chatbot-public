# Kill processes on specific ports for automotive chatbot
# Ports: 3000 (frontend), 8000 (backend), 5005 (rasa), 5055 (actions)

Write-Host "Killing processes on automotive chatbot ports..." -ForegroundColor Yellow

$ports = @(3000, 3001, 8000, 5005, 5055)

foreach ($port in $ports) {
    Write-Host "Checking port $port..." -ForegroundColor Cyan
    
    $processes = netstat -ano | findstr ":$port "
    
    if ($processes) {
        $processes | ForEach-Object {
            $line = $_.ToString().Trim()
            $parts = $line -split '\s+'
            $pid = $parts[-1]
            
            if ($pid -match '^\d+$') {
                try {
                    Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
                    Write-Host "Killed process $pid on port $port" -ForegroundColor Green
                } catch {
                    Write-Host "Could not kill process $pid" -ForegroundColor Red
                }
            }
        }
    } else {
        Write-Host "Port $port is free" -ForegroundColor Green
    }
}

Write-Host "Waiting for processes to terminate..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

Write-Host "Port cleanup complete!" -ForegroundColor Green 