#!/bin/bash

# Prompt AI 部署脚本
# 作者: Prompt AI Team
# 版本: 1.0.0

set -e  # 遇到错误立即退出

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

# 检查依赖
check_dependencies() {
    log_info "检查系统依赖..."
    
    # 检查 Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js 未安装，请先安装 Node.js 18+"
        exit 1
    fi
    
    # 检查 Python
    if ! command -v python3 &> /dev/null; then
        log_error "Python3 未安装，请先安装 Python 3.8+"
        exit 1
    fi
    
    # 检查 npm
    if ! command -v npm &> /dev/null; then
        log_error "npm 未安装，请先安装 npm"
        exit 1
    fi
    
    # 检查 pip
    if ! command -v pip3 &> /dev/null; then
        log_error "pip3 未安装，请先安装 pip3"
        exit 1
    fi
    
    log_success "系统依赖检查完成"
}

# 环境配置
setup_environment() {
    log_info "配置环境变量..."
    
    # 创建环境配置文件
    if [ ! -f ".env" ]; then
        log_info "创建环境配置文件..."
        cat > .env << EOF
# 数据库配置
DATABASE_URL=sqlite:///./prompt_ai.db

# JWT配置
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS配置
BACKEND_CORS_ORIGINS=["http://localhost:3000","http://localhost:3001","http://127.0.0.1:3000","http://127.0.0.1:3001"]

# 服务器配置
HOST=0.0.0.0
PORT=8000

# 前端配置
NEXT_PUBLIC_API_URL=http://localhost:8000
EOF
        log_warning "请根据实际情况修改 .env 文件中的配置"
    fi
    
    log_success "环境配置完成"
}

# 后端部署
deploy_backend() {
    log_info "开始部署后端服务..."
    
    cd backend
    
    # 创建虚拟环境
    if [ ! -d "venv" ]; then
        log_info "创建Python虚拟环境..."
        python3 -m venv venv
    fi
    
    # 激活虚拟环境
    source venv/bin/activate
    
    # 安装依赖
    log_info "安装Python依赖..."
    pip install -r requirements.txt
    
    # 初始化数据库
    log_info "初始化数据库..."
    python init_categories.py
    
    # 启动后端服务
    log_info "启动后端服务..."
    nohup python main.py > ../logs/backend.log 2>&1 &
    echo $! > ../pids/backend.pid
    
    cd ..
    log_success "后端服务部署完成"
}

# 前端部署
deploy_frontend() {
    log_info "开始部署前端服务..."
    
    cd frontend-react
    
    # 安装依赖
    log_info "安装Node.js依赖..."
    npm install
    
    # 构建项目
    log_info "构建前端项目..."
    npm run build
    
    # 启动前端服务
    log_info "启动前端服务..."
    nohup npm start > ../logs/frontend.log 2>&1 &
    echo $! > ../pids/frontend.pid
    
    cd ..
    log_success "前端服务部署完成"
}

# 创建必要目录
create_directories() {
    log_info "创建必要目录..."
    mkdir -p logs
    mkdir -p pids
    mkdir -p backups
    log_success "目录创建完成"
}

# 健康检查
health_check() {
    log_info "执行健康检查..."
    
    # 等待服务启动
    sleep 5
    
    # 检查后端服务
    if curl -f http://localhost:8000/health > /dev/null 2>&1; then
        log_success "后端服务运行正常"
    else
        log_error "后端服务启动失败"
        return 1
    fi
    
    # 检查前端服务
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        log_success "前端服务运行正常"
    else
        log_error "前端服务启动失败"
        return 1
    fi
    
    log_success "所有服务运行正常"
}

# 显示服务状态
show_status() {
    echo ""
    echo "=========================================="
    echo "           Prompt AI 部署完成"
    echo "=========================================="
    echo ""
    echo "服务地址:"
    echo "  前端: http://localhost:3000"
    echo "  后端: http://localhost:8000"
    echo "  API文档: http://localhost:8000/docs"
    echo ""
    echo "日志文件:"
    echo "  后端日志: logs/backend.log"
    echo "  前端日志: logs/frontend.log"
    echo ""
    echo "进程ID文件:"
    echo "  后端PID: pids/backend.pid"
    echo "  前端PID: pids/frontend.pid"
    echo ""
    echo "管理命令:"
    echo "  停止服务: ./stop.sh"
    echo "  重启服务: ./restart.sh"
    echo "  查看状态: ./status.sh"
    echo "=========================================="
}

# 主函数
main() {
    log_info "开始部署 Prompt AI..."
    
    check_dependencies
    create_directories
    setup_environment
    deploy_backend
    deploy_frontend
    health_check
    show_status
    
    log_success "部署完成！"
}

# 执行主函数
main "$@" 