# Prompt AI - 智能提示词管理平台

一个基于 FastAPI + Next.js 的现代化 AI 提示词管理平台，支持提示词的创建、管理、分享和协作。

## 🚀 最新更新 (2025-06-13)

### ✅ 已完成优化

#### 1. 用户认证系统优化
- **Token过期时间延长**: 从30分钟延长到7天，减少重复登录
- **自动认证检查**: 应用启动时自动检查用户登录状态
- **智能错误处理**: 改进API错误处理和用户友好的错误提示
- **Cookie同步**: 前端Cookie过期时间与后端Token一致

#### 2. 提示词创建功能完善
- **真实API集成**: 替换模拟数据，使用真实的后端API
- **用户认证验证**: 创建提示词前检查用户登录状态
- **分类数据获取**: 从后端动态获取分类列表
- **完整表单验证**: 增强表单验证和错误处理
- **成功反馈**: 添加Toast通知和页面跳转

#### 3. 系统稳定性提升
- **错误边界处理**: 改进前端错误处理机制
- **网络错误处理**: 优化网络连接失败的用户体验
- **自动重定向**: 未登录用户自动重定向到登录页面
- **状态持久化**: 优化用户状态的本地存储

### 🧪 测试验证

创建了完整的测试脚本验证功能：
- ✅ 用户登录功能正常
- ✅ 分类获取功能正常  
- ✅ 提示词创建功能正常
- ✅ 提示词列表获取正常

## 📋 功能特性

### 核心功能
- **用户管理**: 注册、登录、个人资料管理
- **提示词管理**: 创建、编辑、删除、分类管理
- **权限控制**: 公开/私有提示词，用户权限管理
- **搜索功能**: 按关键词、分类、标签搜索提示词
- **评分系统**: 提示词评分和评论功能

### 技术特性
- **现代化架构**: FastAPI + Next.js + TypeScript
- **响应式设计**: 支持桌面和移动设备
- **实时更新**: 基于WebSocket的实时通信
- **安全认证**: JWT Token + Cookie双重认证
- **数据持久化**: SQLite数据库 + 文件存储

## 🛠️ 技术栈

### 后端
- **FastAPI**: 现代化Python Web框架
- **SQLAlchemy**: ORM数据库操作
- **SQLite**: 轻量级数据库
- **JWT**: 用户认证
- **Pydantic**: 数据验证

### 前端
- **Next.js 15**: React全栈框架
- **TypeScript**: 类型安全
- **Tailwind CSS**: 原子化CSS框架
- **shadcn/ui**: 现代化UI组件库
- **Zustand**: 状态管理
- **Axios**: HTTP客户端

### 开发工具
- **MCP服务**: 模型上下文协议集成
- **ESLint**: 代码规范检查
- **Prettier**: 代码格式化

## 🚀 快速开始

### 环境要求
- Node.js 18+
- Python 3.8+
- npm 或 yarn

### 一键部署
```bash
# 克隆项目
git clone <repository-url>
cd prompt-ai

# 运行部署脚本
chmod +x deploy.sh
./deploy.sh
```

### 手动部署

#### 1. 后端部署
```bash
cd backend

# 创建虚拟环境
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 安装依赖
pip install -r requirements.txt

# 初始化数据库
python init_categories.py

# 启动服务
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

#### 2. 前端部署
```bash
cd frontend-react

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 或构建生产版本
npm run build
npm start
```

### 3. 访问应用
- 前端: http://localhost:3000
- 后端API: http://localhost:8000
- API文档: http://localhost:8000/docs

## 📖 使用指南

### 用户注册和登录
1. 访问 `/register` 页面注册新账户
2. 或使用演示账户：
   - 用户名: `demo`
   - 密码: `demo123`

### 创建提示词
1. 登录后点击"创建提示词"
2. 填写提示词基本信息
3. 编写提示词内容和示例
4. 选择分类和标签
5. 设置公开/私有权限
6. 提交创建

### 管理提示词
- **我的提示词**: 查看和管理个人创建的提示词
- **编辑提示词**: 修改提示词内容和设置
- **删除提示词**: 删除不需要的提示词
- **分享提示词**: 设置为公开让其他用户使用

## 🔧 运维管理

### 服务管理脚本
```bash
# 检查服务状态
./status.sh

# 停止所有服务
./stop.sh

# 重启服务
./restart.sh

# 备份数据
./backup.sh
```

### 日志查看
```bash
# 查看后端日志
tail -f logs/backend.log

# 查看前端日志
tail -f logs/frontend.log
```

### 数据备份
- 自动备份: 每日凌晨2点自动备份
- 手动备份: 运行 `./backup.sh`
- 备份位置: `backups/` 目录

## 🐛 故障排除

### 常见问题

#### 1. 前端无法连接后端
- 检查后端服务是否启动: `./status.sh`
- 检查端口占用: `lsof -i :8000`
- 检查防火墙设置

#### 2. 登录失败
- 检查用户名密码是否正确
- 检查数据库连接
- 查看后端日志: `tail -f logs/backend.log`

#### 3. 提示词创建失败
- 确保用户已登录
- 检查分类是否存在
- 验证表单数据格式

#### 4. 数据库错误
- 重新初始化数据库: `python backend/init_categories.py`
- 检查数据库文件权限
- 查看详细错误日志

### 性能优化
- 数据库索引优化
- 静态资源CDN加速
- API响应缓存
- 图片压缩和懒加载

## 📊 项目结构

```
prompt-ai/
├── backend/                 # 后端服务
│   ├── app/
│   │   ├── api/            # API路由
│   │   ├── core/           # 核心配置
│   │   ├── models/         # 数据模型
│   │   ├── schemas/        # 数据模式
│   │   └── services/       # 业务逻辑
│   ├── requirements.txt    # Python依赖
│   └── init_categories.py  # 数据初始化
├── frontend-react/         # 前端应用
│   ├── src/
│   │   ├── app/           # Next.js页面
│   │   ├── components/    # React组件
│   │   ├── lib/          # 工具库
│   │   ├── stores/       # 状态管理
│   │   └── types/        # TypeScript类型
│   └── package.json      # Node.js依赖
├── mcp-service/           # MCP服务
├── docs/                  # 文档
├── logs/                  # 日志文件
├── backups/              # 备份文件
├── deploy.sh             # 部署脚本
├── status.sh             # 状态检查
├── stop.sh               # 停止服务
├── restart.sh            # 重启服务
├── backup.sh             # 备份脚本
└── README.md             # 项目说明
```

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支: `git checkout -b feature/new-feature`
3. 提交更改: `git commit -am 'Add new feature'`
4. 推送分支: `git push origin feature/new-feature`
5. 提交Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 联系我们

- 项目地址: [GitHub Repository]
- 问题反馈: [Issues]
- 文档地址: [Documentation]

---

**Prompt AI** - 让AI提示词管理更简单、更高效！