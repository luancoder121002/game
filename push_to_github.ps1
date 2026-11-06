# Script hỗ trợ đẩy code lên GitHub https://github.com/luancoder121002/game
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   SIGNAL FACTORY - PUSH TO GITHUB luancoder121002/game   " -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

$token = Read-Host "Nhap GitHub Personal Access Token cua tai khoan luancoder121002 (hoac Enter de dung Git Credential Manager)"
if ($token -and $token.Trim() -ne "") {
    $remoteUrl = "https://${token}@github.com/luancoder121002/game.git"
    git remote set-url origin $remoteUrl
    Write-Host "Dang day code len main branch..." -ForegroundColor Green
    git push -u origin main
    # Reset remote URL ve dang https khong chua token de bao mat
    git remote set-url origin "https://github.com/luancoder121002/game.git"
} else {
    Write-Host "Dang day code voi Git Credential mac dinh..." -ForegroundColor Green
    git push -u origin main
}
