#!/bin/bash

# Prompt AI 状态检查脚本
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

# 检查服务状态
check_service() {
    local service_name=$1
    local pid_file=$2
    local port=$3
    local url=$4
    
    echo "----------------------------------------"
    echo "检查 $service_name 服务状态:"
    
    # 检查PID文件
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if ps -p "$pid" > /dev/null 2>&1; then
            echo "  进程状态: 运行中 (PID: $pid)"
            
            # 检查端口
            if lsof -i :$port > /dev/null 2>&1; then
                echo "  端口状态: $port 端口正在监听"
            else
                echo "  端口状态: $port 端口未监听"
            fi
            
            # 检查HTTP响应
            if [ -n "$url" ]; then
                if curl -f "$url" > /dev/null 2>&1; then
                    echo "  HTTP状态: 服务响应正常"
                else
                    echo "  HTTP状态: 服务无响应"
                fi
            fi
            
            # 显示内存使用
            local memory=$(ps -p "$pid" -o rss= | awk '{print $1/1024}')
            echo "  内存使用: ${memory}MB"
            
            # 显示CPU使用
            local cpu=$(ps -p "$pid" -o %cpu= | awk '{print $1}')
            echo "  CPU使用: ${cpu}%"
            
        else
            echo "  进程状态: 未运行 (PID文件存在但进程不存在)"
        fi
    else
        echo "  进程状态: 未运行 (PID文件不存在)"
    fi
}

# 显示系统信息
show_system_info() {
    echo "=========================================="
    echo "           系统信息"
    echo "=========================================="
    echo "操作系统: $(uname -s)"
    echo "内核版本: $(uname -r)"
    echo "主机名: $(hostname)"
    echo "当前时间: $(date)"
    echo "系统负载: $(uptime | awk -F'load average:' '{print $2}')"
    echo "内存使用: $(free -h 2>/dev/null | grep Mem || echo '无法获取内存信息')"
    echo "磁盘使用: $(df -h . | tail -1 | awk '{print $5 " used of " $2}')"
}

# 显示日志摘要
show_log_summary() {
    echo "=========================================="
    echo "           日志摘要"
    echo "=========================================="
    
    if [ -f "logs/backend.log" ]; then
        echo "后端日志 (最近10行):"
        tail -10 logs/backend.log | sed 's/^/  /'
        echo ""
    else
        echo "后端日志: 文件不存在"
    fi
    
    if [ -f "logs/frontend.log" ]; then
        echo "前端日志 (最近10行):"
        tail -10 logs/frontend.log | sed 's/^/  /'
        echo ""
    else
        echo "前端日志: 文件不存在"
    fi
}

# 检查网络连接
check_network() {
    echo "=========================================="
    echo "           网络连接检查"
    echo "=========================================="
    
    # 检查端口占用
    echo "端口占用情况:"
    echo "  3000端口: $(lsof -i :3000 2>/dev/null | wc -l | awk '{if($1>1) print "占用"; else print "空闲"}')"
    echo "  8000端口: $(lsof -i :8000 2>/dev/null | wc -l | awk '{if($1>1) print "占用"; else print "空闲"}')"
    
    # 检查网络连接
    echo ""
    echo "网络连接测试:"
    if curl -s http://localhost:3000 > /dev/null; then
        echo "  前端连接: 正常"
    else
        echo "  前端连接: 失败"
    fi
    
    if curl -s http://localhost:8000/health > /dev/null; then
        echo "  后端连接: 正常"
    else
        echo "  后端连接: 失败"
    fi
}

# 主函数
main() {
    echo "=========================================="
    echo "         Prompt AI 状态检查"
    echo "=========================================="
    echo ""
    
    show_system_info
    echo ""
    
    check_service "前端" "pids/frontend.pid" "3000" "http://localhost:3000"
    echo ""
    
    check_service "后端" "pids/backend.pid" "8000" "http://localhost:8000/health"
    echo ""
    
    check_network
    echo ""
    
    show_log_summary
    
    echo "=========================================="
    echo "状态检查完成"
    echo "=========================================="
}

# 执行主函数
main "$@" 