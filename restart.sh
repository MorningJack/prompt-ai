#!/bin/bash

# Prompt AI 重启服务脚本
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

# 主函数
main() {
    log_info "开始重启 Prompt AI 服务..."
    
    # 停止服务
    log_info "停止现有服务..."
    ./stop.sh
    
    # 等待服务完全停止
    sleep 3
    
    # 重新部署
    log_info "重新启动服务..."
    ./deploy.sh
    
    log_success "服务重启完成！"
}

# 执行主函数
main "$@" 