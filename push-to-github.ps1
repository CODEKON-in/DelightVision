# Push this project to https://github.com/CODEKON-in/DelightVision
#
# Run it by right-clicking the file and choosing "Run with PowerShell", or:
#   cd "D:\delight vision\DelightVision-main"
#   powershell -ExecutionPolicy Bypass -File .\push-to-github.ps1
#
# It clones the repo to a temp folder, copies this project over it, and
# pushes. Your working folder is never modified. Git will ask you to sign in
# to GitHub the first time.

$ErrorActionPreference = "Stop"

$Project  = "D:\delight vision\DelightVision-main"
$RepoUrl  = "https://github.com/CODEKON-in/DelightVision.git"
$Branch   = "main"
$Work     = Join-Path $env:TEMP "dv-push"
$Message  = "Typography, layout and pricing fixes across the site"

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  Write-Host "git is not installed. Get it from https://git-scm.com/download/win" -ForegroundColor Red
  exit 1
}

if (Test-Path $Work) { Remove-Item $Work -Recurse -Force }

Write-Host "`nCloning $RepoUrl ..." -ForegroundColor Cyan
git clone --branch $Branch $RepoUrl $Work
if ($LASTEXITCODE -ne 0) { Write-Host "Clone failed." -ForegroundColor Red; exit 1 }

Write-Host "`nCopying project files ..." -ForegroundColor Cyan
# /MIR mirrors the project into the clone so deleted files are dropped too.
# Everything excluded below is either rebuilt from source or local-only.
robocopy $Project $Work /MIR /NFL /NDL /NJH /NJS /NC /NS `
  /XD "$Work\.git" node_modules dist ".claude" "Claude outputs" `
  /XF ".gitignore.bak" "push-to-github.ps1" | Out-Null

Push-Location $Work
git add -A

$staged = git diff --cached --name-only
if (-not $staged) {
  Write-Host "`nNothing to push - the repo already matches your folder." -ForegroundColor Yellow
  Pop-Location
  exit 0
}

Write-Host "`nFiles to be pushed:" -ForegroundColor Cyan
$staged | ForEach-Object { Write-Host "  $_" }

Write-Host ""
$answer = Read-Host "Push these to $Branch ? (y/n)"
if ($answer -ne "y") {
  Write-Host "Cancelled. Nothing was pushed." -ForegroundColor Yellow
  Pop-Location
  exit 0
}

git commit -m $Message
git push origin $Branch
$ok = $LASTEXITCODE
Pop-Location

if ($ok -eq 0) {
  Write-Host "`nPushed. See https://github.com/CODEKON-in/DelightVision" -ForegroundColor Green
} else {
  Write-Host "`nPush failed - check the sign-in prompt or your access to the repo." -ForegroundColor Red
}
