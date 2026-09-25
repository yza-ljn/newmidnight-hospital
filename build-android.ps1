# 午夜病院 - Android 自动打包脚本
# 使用方法：在 PowerShell 中运行此脚本

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "午夜病院 - Android 应用打包工具" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查必要工具
Write-Host "检查必要工具..." -ForegroundColor Yellow

$tools = @{
    "Node.js" = "node --version"
    "Cordova" = "cordova --version"
    "Java" = "java -version"
    "Android SDK" = "sdkmanager --version"
}

$missingTools = @()

foreach ($tool in $tools.GetEnumerator()) {
    try {
        $output = Invoke-Expression $tool.Value 2>&1
        Write-Host "✓ $($tool.Key) 已安装" -ForegroundColor Green
    } catch {
        Write-Host "✗ $($tool.Key) 未安装" -ForegroundColor Red
        $missingTools += $tool.Key
    }
}

if ($missingTools.Count -gt 0) {
    Write-Host ""
    Write-Host "缺少以下工具，请先安装：" -ForegroundColor Red
    foreach ($tool in $missingTools) {
        Write-Host "  - $tool"
    }
    Write-Host ""
    Write-Host "详见 ANDROID_BUILD_GUIDE.md" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "所有工具已就绪！" -ForegroundColor Green
Write-Host ""

# 获取项目信息
$projectName = "MidnightHospital"
$packageName = "com.example.midnighthospital"
$appName = "午夜病院"

Write-Host "项目配置：" -ForegroundColor Cyan
Write-Host "  项目名称：$projectName"
Write-Host "  包名：$packageName"
Write-Host "  应用名称：$appName"
Write-Host ""

# 检查 Cordova 项目是否存在
if (-Not (Test-Path "$projectName/config.xml")) {
    Write-Host "创建 Cordova 项目..." -ForegroundColor Yellow
    cordova create $projectName $packageName $appName
    if ($LASTEXITCODE -ne 0) {
        Write-Host "创建项目失败！" -ForegroundColor Red
        exit 1
    }
    Write-Host "✓ 项目创建成功" -ForegroundColor Green
} else {
    Write-Host "✓ Cordova 项目已存在" -ForegroundColor Green
}

Write-Host ""
Write-Host "进入项目目录..." -ForegroundColor Yellow
Push-Location $projectName

# 添加 Android 平台
if (-Not (Test-Path "platforms/android")) {
    Write-Host "添加 Android 平台..." -ForegroundColor Yellow
    cordova platform add android
    if ($LASTEXITCODE -ne 0) {
        Write-Host "添加 Android 平台失败！" -ForegroundColor Red
        Pop-Location
        exit 1
    }
    Write-Host "✓ Android 平台已添加" -ForegroundColor Green
} else {
    Write-Host "✓ Android 平台已存在" -ForegroundColor Green
}

Write-Host ""
Write-Host "复制游戏文件..." -ForegroundColor Yellow

# 复制游戏文件到 www 目录
$filesToCopy = @(
    "index.html",
    "game.js",
    "main.js",
    "rosebud-game-defaults.js",
    "rosebud-game-defaults.css"
)

$sourceDir = Split-Path -Parent (Get-Location)

foreach ($file in $filesToCopy) {
    $source = Join-Path $sourceDir $file
    $dest = Join-Path (Get-Location) "www" $file
    
    if (Test-Path $source) {
        Copy-Item $source $dest -Force
        Write-Host "  ✓ 复制 $file"
    } else {
        Write-Host "  ✗ 找不到 $file" -ForegroundColor Yellow
    }
}

# 复制文件夹
$foldersToCopy = @("assets", "rosie")

foreach ($folder in $foldersToCopy) {
    $source = Join-Path $sourceDir $folder
    $dest = Join-Path (Get-Location) "www" $folder
    
    if (Test-Path $source) {
        if (Test-Path $dest) {
            Remove-Item $dest -Recurse -Force
        }
        Copy-Item $source $dest -Recurse -Force
        Write-Host "  ✓ 复制文件夹 $folder"
    } else {
        Write-Host "  ✗ 找不到文件夹 $folder" -ForegroundColor Yellow
    }
}

Write-Host "✓ 游戏文件复制完成" -ForegroundColor Green

Write-Host ""
Write-Host "构建 APK..." -ForegroundColor Yellow
cordova build android

if ($LASTEXITCODE -ne 0) {
    Write-Host "构建失败！" -ForegroundColor Red
    Pop-Location
    exit 1
}

Write-Host "✓ APK 构建成功" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "打包完成！" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$apkPath = "platforms/android/app/build/outputs/apk/debug/app-debug.apk"
$fullPath = Join-Path (Get-Location) $apkPath

if (Test-Path $fullPath) {
    Write-Host "APK 文件位置：" -ForegroundColor Green
    Write-Host "  $fullPath"
    Write-Host ""
    Write-Host "文件大小：$('{0:N2}' -f ((Get-Item $fullPath).Length / 1MB)) MB"
    Write-Host ""
    Write-Host "下一步：" -ForegroundColor Cyan
    Write-Host "  1. 连接 Android 设备（USB 调试模式）"
    Write-Host "  2. 运行：cordova run android"
    Write-Host "  3. 或将 APK 文件复制到设备并安装"
} else {
    Write-Host "APK 文件未找到！" -ForegroundColor Red
}

Write-Host ""
Pop-Location
