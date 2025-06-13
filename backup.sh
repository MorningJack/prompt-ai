#!/bin/bash

# Prompt AI 备份脚本
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

# 创建备份目录
create_backup_dir() {
    local timestamp=$(date +"%Y%m%d_%H%M%S")
    local backup_dir="backups/backup_$timestamp"
    
    mkdir -p "$backup_dir"
    echo "$backup_dir"
}

# 备份数据库
backup_database() {
    local backup_dir=$1
    
    log_info "备份数据库..."
    
    if [ -f "backend/prompt_ai.db" ]; then
        cp "backend/prompt_ai.db" "$backup_dir/prompt_ai.db"
        log_success "数据库备份完成"
    else
        log_warning "数据库文件不存在"
    fi
}

# 备份配置文件
backup_config() {
    local backup_dir=$1
    
    log_info "备份配置文件..."
    
    # 备份环境配置
    if [ -f ".env" ]; then
        cp ".env" "$backup_dir/.env"
    fi
    
    # 备份后端配置
    if [ -f "backend/app/core/config.py" ]; then
        mkdir -p "$backup_dir/backend/app/core"
        cp "backend/app/core/config.py" "$backup_dir/backend/app/core/"
    fi
    
    # 备份前端配置
    if [ -f "frontend-react/next.config.js" ]; then
        mkdir -p "$backup_dir/frontend-react"
        cp "frontend-react/next.config.js" "$backup_dir/frontend-react/"
    fi
    
    if [ -f "frontend-react/tailwind.config.ts" ]; then
        cp "frontend-react/tailwind.config.ts" "$backup_dir/frontend-react/"
    fi
    
    log_success "配置文件备份完成"
}

# 备份日志文件
backup_logs() {
    local backup_dir=$1
    
    log_info "备份日志文件..."
    
    if [ -d "logs" ]; then
        cp -r "logs" "$backup_dir/"
        log_success "日志文件备份完成"
    else
        log_warning "日志目录不存在"
    fi
}

# 备份用户上传文件
backup_uploads() {
    local backup_dir=$1
    
    log_info "备份用户上传文件..."
    
    if [ -d "backend/uploads" ]; then
        cp -r "backend/uploads" "$backup_dir/"
        log_success "用户上传文件备份完成"
    else
        log_warning "上传文件目录不存在"
    fi
}

# 创建备份清单
create_manifest() {
    local backup_dir=$1
    local manifest_file="$backup_dir/backup_manifest.txt"
    
    log_info "创建备份清单..."
    
    cat > "$manifest_file" << EOF
Prompt AI 备份清单
==================

备份时间: $(date)
备份版本: 1.0.0
备份目录: $backup_dir

备份内容:
EOF
    
    # 列出备份的文件
    find "$backup_dir" -type f | sort | while read file; do
        local relative_path=${file#$backup_dir/}
        local file_size=$(ls -lh "$file" | awk '{print $5}')
        echo "  $relative_path ($file_size)" >> "$manifest_file"
    done
    
    log_success "备份清单创建完成"
}

# 压缩备份
compress_backup() {
    local backup_dir=$1
    local archive_name="${backup_dir}.tar.gz"
    
    log_info "压缩备份文件..."
    
    tar -czf "$archive_name" -C "$(dirname "$backup_dir")" "$(basename "$backup_dir")"
    
    if [ $? -eq 0 ]; then
        rm -rf "$backup_dir"
        log_success "备份压缩完成: $archive_name"
        echo "$archive_name"
    else
        log_error "备份压缩失败"
        return 1
    fi
}

# 清理旧备份
cleanup_old_backups() {
    local keep_days=${1:-7}  # 默认保留7天
    
    log_info "清理 $keep_days 天前的备份..."
    
    find backups -name "backup_*.tar.gz" -mtime +$keep_days -delete 2>/dev/null
    
    local deleted_count=$(find backups -name "backup_*.tar.gz" -mtime +$keep_days 2>/dev/null | wc -l)
    if [ $deleted_count -gt 0 ]; then
        log_success "清理了 $deleted_count 个旧备份"
    else
        log_info "没有需要清理的旧备份"
    fi
}

# 显示备份统计
show_backup_stats() {
    log_info "备份统计信息:"
    
    if [ -d "backups" ]; then
        local backup_count=$(find backups -name "backup_*.tar.gz" | wc -l)
        local total_size=$(du -sh backups 2>/dev/null | awk '{print $1}')
        
        echo "  备份数量: $backup_count"
        echo "  总大小: $total_size"
        
        if [ $backup_count -gt 0 ]; then
            echo "  最新备份:"
            find backups -name "backup_*.tar.gz" -exec ls -lh {} \; | sort -k9 | tail -1 | awk '{print "    " $9 " (" $5 ", " $6 " " $7 " " $8 ")"}'
        fi
    else
        echo "  备份目录不存在"
    fi
}

# 主函数
main() {
    local keep_days=${1:-7}
    
    log_info "开始备份 Prompt AI..."
    
    # 创建备份目录
    local backup_dir=$(create_backup_dir)
    log_info "备份目录: $backup_dir"
    
    # 执行备份
    backup_database "$backup_dir"
    backup_config "$backup_dir"
    backup_logs "$backup_dir"
    backup_uploads "$backup_dir"
    create_manifest "$backup_dir"
    
    # 压缩备份
    local archive_file=$(compress_backup "$backup_dir")
    
    if [ $? -eq 0 ]; then
        # 清理旧备份
        cleanup_old_backups "$keep_days"
        
        # 显示统计
        show_backup_stats
        
        log_success "备份完成: $archive_file"
    else
        log_error "备份失败"
        exit 1
    fi
}

# 显示帮助信息
show_help() {
    echo "Prompt AI 备份脚本"
    echo ""
    echo "用法: $0 [保留天数]"
    echo ""
    echo "参数:"
    echo "  保留天数    保留备份的天数，默认为7天"
    echo ""
    echo "示例:"
    echo "  $0          # 使用默认设置备份"
    echo "  $0 14       # 备份并保留14天的备份"
}

# 检查参数
if [ "$1" = "-h" ] || [ "$1" = "--help" ]; then
    show_help
    exit 0
fi

# 执行主函数
main "$@" 