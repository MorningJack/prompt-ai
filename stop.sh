#!/bin/bash

# Prompt AI 停止服务脚本
# 作者: Prompt AI Team
# 版本: 1.0.0

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 停止服务函数
stop_service() {
    local service_name=$1
    local pid_file=$2
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if ps -p "$pid" > /dev/null 2>&1; then
            log_info "停止 $service_name 服务 (PID: $pid)..."
            kill "$pid"
            
            # 等待进程结束
            local count=0
            while ps -p "$pid" > /dev/null 2>&1 && [ $count -lt 30 ]; do
                sleep 1
                count=$((count + 1))
            done
            
            if ps -p "$pid" > /dev/null 2>&1; then
                log_warning "$service_name 服务未能正常停止，强制终止..."
                kill -9 "$pid"
            fi
            
            log_success "$service_name 服务已停止"
        else
            log_warning "$service_name 服务进程不存在 (PID: $pid)"
        fi
        rm -f "$pid_file"
    else
        log_warning "$service_name 服务PID文件不存在"
    fi
}

# 主函数
main() {
    log_info "开始停止 Prompt AI 服务..."
    
    # 停止前端服务
    stop_service "前端" "pids/frontend.pid"
    
    # 停止后端服务
    stop_service "后端" "pids/backend.pid"
    
    # 清理其他可能的进程
    log_info "清理其他相关进程..."
    pkill -f "python.*main.py" 2>/dev/null || true
    pkill -f "npm.*start" 2>/dev/null || true
    pkill -f "next.*start" 2>/dev/null || true
    
    log_success "所有服务已停止"
}

# 执行主函数
main "$@" 