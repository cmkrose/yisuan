@echo off
chcp 65001 >nul
title 易算 - 数据库初始化

echo ========================================
echo   易算 - 数据库初始化脚本
echo ========================================
echo.

REM 1. 检查 Docker
docker info >nul 2>&1
if errorlevel 1 (
    echo [✗] Docker 未运行，请先启动 Docker Desktop
    pause
    exit /b 1
)
echo [✓] Docker 正在运行

REM 2. 启动数据库容器
echo [→] 启动 PostgreSQL + Redis...
cd /d "%~dp0"
docker compose up -d postgres redis
if errorlevel 1 (
    echo [✗] 数据库启动失败
    pause
    exit /b 1
)
echo [✓] 数据库容器已启动

REM 3. 等待数据库就绪
echo [→] 等待数据库就绪...
timeout /t 5 /nobreak >nul

REM 4. 运行 Prisma 迁移
echo [→] 创建数据库表...
cd /d "%~dp0backend"
call pnpm db:generate
if errorlevel 1 (
    echo [✗] Prisma 生成失败
    pause
    exit /b 1
)

call pnpm db:migrate -- --name init
if errorlevel 1 (
    echo [!] 迁移可能已存在，继续...
)

REM 5. 导入种子数据
echo [→] 导入种子数据...
call pnpm db:seed
if errorlevel 1 (
    echo [✗] 种子数据导入失败
    pause
    exit /b 1
)

echo.
echo ========================================
echo   初始化完成！
echo ========================================
echo.
echo   启动网站: cd /d "%~dp0" ^&^& pnpm dev
echo   后台地址: http://localhost:3000/admin
echo   管理员密码: yisuan123
echo.

pause
