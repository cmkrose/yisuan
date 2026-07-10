@echo off
chcp 65001 >nul
title 易算 - Dev Server
echo.
echo  ========================================
echo    《易算》本地开发服务器
echo  ========================================
echo.
echo  后端: http://localhost:3001
echo  前端: http://localhost:3000
echo  手机: http://[你的IP]:3000
echo.
echo  关闭此窗口即可停止所有服务
echo  ========================================
echo.

cd /d "%~dp0"

start "易算-API" cmd /c "cd /d backend && npx nest start"
start "易算-Web" cmd /c "cd /d frontend && npx next dev -p 3000 -H 0.0.0.0"

echo [OK] 服务已启动，等待就绪...
timeout /t 8 /nobreak >nul

echo.
echo  ========================================
echo   服务状态检查
echo  ========================================
node -e "require('http').get('http://localhost:3000',r=>console.log('[OK] 前端: http://localhost:3000')).on('error',e=>console.log('[X] 前端未响应'))"
node -e "require('http').get('http://localhost:3001/api/knowledge/categories',r=>console.log('[OK] 后端: http://localhost:3001')).on('error',e=>console.log('[X] 后端未响应'))"
echo.
echo  管理员后台: http://localhost:3000/admin 密码: yisuan123
echo  手机访问请输入: http://你的电脑IP:3000
echo.

pause
