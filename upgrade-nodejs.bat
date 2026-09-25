@echo off
REM Node.js 升级脚本
REM 这个脚本会下载并安装最新的 Node.js LTS 版本

echo 正在下载 Node.js 最新版本...
echo.
echo 请访问以下链接下载最新的 Node.js LTS 版本：
echo https://nodejs.org/
echo.
echo 或者直接下载：
echo https://nodejs.org/dist/v22.11.0/node-v22.11.0-x64.msi
echo.
echo 下载完成后，双击 .msi 文件进行安装
echo 安装时选择 "Add to PATH" 选项
echo.
echo 安装完成后，重启电脑或命令行窗口
echo 然后运行以下命令验证：
echo node --version
echo.
pause
