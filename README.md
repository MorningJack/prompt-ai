# 提示词管理平台 (Prompt AI Platform)

一个现代化的提示词管理平台，帮助用户创建、管理、分享和发现高质量的 AI 提示词。

## 🌟 核心功能

### 用户功能

#### 📝 创建提示词
- **多语言支持**: 中文名称、英文名称、别名管理
- **模型适配**: 支持 OpenAI、DeepSeek 等多种 AI 模型
- **场景分类**: 教育培训、商业营销、内容创作、技术研发
- **详细描述**: 文本描述、示例输入输出、使用技巧
- **效果评估**: 评估标准、用户反馈、优化建议、应用案例

#### 👤 个人提示词管理
- 通过 MCP 服务访问个人提示词库
- 支持 CRUD 操作和版本控制
- 私有和公开状态管理

### 平台功能

#### 🔍 提示词浏览
- **官方精选**: 平台认证的高质量提示词
- **社区分享**: 用户公开的提示词
- **智能搜索**: 基于内容、标签、分类的搜索

#### ⭐ 精选机制
- **评分系统**: 5星评价和评论系统
- **官方精选**: 平台审核推荐机制
- **MCP 服务**: 标准化 API 访问

#### 📂 分类体系
- **编程类**: Cursor、Claude 等工具专用
- **方案类**: 营销活动、效果测试等场景
- **其他类**: 持续扩展的分类体系

### MCP 服务
- **个人提示词访问**: 私有提示词的标准化访问
- **平台精选**: 官方推荐提示词的公共 API
- **实时同步**: 提示词更新的即时推送

## 🏗️ 技术架构

### 前端技术栈
- **框架**: Vue 3 + TypeScript + Vite
- **UI 库**: Magic UI + Tailwind CSS
- **状态管理**: Pinia
- **图标**: Font Awesome
- **设计风格**: 参考 [21st.dev](https://21st.dev/home) 现代化设计

### 后端技术栈
- **框架**: FastAPI + Python
- **数据库**: PostgreSQL + SQLAlchemy
- **认证**: JWT + OAuth2
- **缓存**: Redis
- **MCP**: Model Context Protocol 标准

### AI 集成
- **Sequential Thinking**: 复杂提示词分析和优化
- **多模型支持**: OpenAI、DeepSeek、Claude 等
- **效果评估**: 自动化提示词质量评估

## 📁 项目结构

```
prompt-ai/
├── frontend/              # Vue 3 前端应用
│   ├── src/
│   │   ├── components/    # 公共组件
│   │   ├── views/         # 页面组件
│   │   ├── stores/        # Pinia 状态管理
│   │   ├── services/      # API 服务
│   │   └── types/         # TypeScript 类型
│   └── package.json
├── backend/               # FastAPI 后端应用
│   ├── app/
│   │   ├── api/           # API 路由
│   │   ├── models/        # 数据模型
│   │   ├── services/      # 业务逻辑
│   │   └── main.py        # 应用入口
│   └── requirements.txt
├── mcp-service/           # MCP 服务实现
│   ├── src/
│   │   ├── handlers/      # MCP 处理器
│   │   └── server.ts      # MCP 服务器
│   └── package.json
├── docs/                  # 项目文档
├── deploy/                # 部署配置
└── .cursor/               # Cursor 开发规则
    └── rules/             # 开发规范文件
```

## 🚀 快速开始

### 环境要求
- Node.js 18+
- Python 3.9+
- PostgreSQL 14+
- Redis 6+

### 安装依赖

```bash
# 前端
cd frontend
npm install

# 后端
cd backend
pip install -r requirements.txt

# MCP 服务
cd mcp-service
npm install
```

### 数据库配置

```bash
# 创建数据库
createdb prompt_ai

# 运行数据库迁移
cd backend
alembic upgrade head
```

### 启动服务

```bash
# 后端服务
cd backend
uvicorn app.main:app --reload --port 8000

# 前端开发服务器
cd frontend
npm run dev

# MCP 服务
cd mcp-service
npm run dev
```

## 📖 API 文档

### 提示词 API

#### 获取提示词列表
- **GET** `/api/v1/prompts`
- **参数**: `page`, `size`, `category`, `search`
- **返回**: 分页的提示词列表

#### 创建提示词
- **POST** `/api/v1/prompts`
- **参数**: 提示词创建数据
- **返回**: 创建的提示词信息

#### 获取提示词详情
- **GET** `/api/v1/prompts/{id}`
- **返回**: 提示词详细信息

### 用户 API

#### 用户注册
- **POST** `/api/v1/auth/register`
- **参数**: `username`, `email`, `password`

#### 用户登录
- **POST** `/api/v1/auth/login`
- **参数**: `email`, `password`
- **返回**: JWT Token

### MCP API

#### 个人提示词访问
- **Endpoint**: `/mcp/personal`
- **认证**: JWT Token
- **功能**: CRUD 操作个人提示词

#### 平台精选访问
- **Endpoint**: `/mcp/featured`
- **认证**: API Key
- **功能**: 访问平台精选提示词

## 🎨 UI 设计规范

### 设计原则
- **现代化**: 参考 21st.dev 的设计风格
- **简洁性**: 清晰的信息层次和操作流程
- **响应式**: 支持桌面端和移动端
- **可访问性**: 遵循 WCAG 2.1 标准

### 颜色体系
- **主色**: 蓝色系 (#3B82F6)
- **辅色**: 灰色系 (#6B7280)
- **成功**: 绿色 (#10B981)
- **警告**: 黄色 (#F59E0B)
- **错误**: 红色 (#EF4444)

### 组件库
- 使用 Magic UI 提供的高质量组件
- Font Awesome 图标库
- Tailwind CSS 样式系统

## 🔧 开发规范

### 代码质量
- TypeScript 强类型约束
- ESLint + Prettier 代码格式化
- 完整的单元测试覆盖
- 详细的代码注释

### Git 工作流
- 功能分支开发
- Pull Request 代码审查
- 自动化 CI/CD 流程

### 部署环境
- 开发环境: 本地开发和测试
- 测试环境: 集成测试和 UAT
- 生产环境: 正式发布版本

## 📝 贡献指南

1. Fork 项目到个人仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交代码 (`git commit -m 'Add amazing feature'`)
4. 推送分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 联系我们

- 项目主页: [GitHub](https://github.com/yourusername/prompt-ai)
- 问题反馈: [Issues](https://github.com/yourusername/prompt-ai/issues)
- 功能建议: [Discussions](https://github.com/yourusername/prompt-ai/discussions)

---

⭐ 如果这个项目对您有帮助，请给我们一个 Star！