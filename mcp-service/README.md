# Prompt AI MCP 服务

这是 Prompt AI 平台的 Model Context Protocol (MCP) 服务，提供两种不同的服务模式：

## 🔧 服务类型

### 1. 个人 MCP 服务 (Personal)
- **服务名称**: `prompt-ai-personal`
- **功能**: 访问用户的私有提示词库，包括个人创建的所有提示词
- **权限**: 需要用户认证令牌，只能访问当前用户的数据
- **适用场景**: 个人使用，管理私有提示词

### 2. 平台 MCP 服务 (Platform)
- **服务名称**: `prompt-ai-platform`
- **功能**: 访问平台的公开和精选提示词
- **权限**: 无需认证，只能访问公开内容
- **适用场景**: 浏览平台精选内容，发现优质提示词

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 构建项目

```bash
npm run build
```

### 测试服务

```bash
# 测试个人服务
npm run test

# 测试平台服务
npm run test:platform
```

## ⚙️ Claude Desktop 配置

### 个人服务配置

在 Claude Desktop 的配置文件中添加以下配置：

```json
{
  "mcpServers": {
    "prompt-ai-personal": {
      "command": "node",
      "args": ["/path/to/prompt-ai/mcp-service/dist/index.js"],
      "env": {
        "API_BASE_URL": "http://localhost:8000",
        "AUTH_TOKEN": "your-jwt-token-here"
      }
    }
  }
}
```

### 平台服务配置

```json
{
  "mcpServers": {
    "prompt-ai-platform": {
      "command": "node",
      "args": ["/path/to/prompt-ai/mcp-service/dist/platform.js"],
      "env": {
        "API_BASE_URL": "http://localhost:8000"
      }
    }
  }
}
```

### 同时使用两个服务

```json
{
  "mcpServers": {
    "prompt-ai-personal": {
      "command": "node",
      "args": ["/path/to/prompt-ai/mcp-service/dist/index.js"],
      "env": {
        "API_BASE_URL": "http://localhost:8000",
        "AUTH_TOKEN": "your-jwt-token-here"
      }
    },
    "prompt-ai-platform": {
      "command": "node",
      "args": ["/path/to/prompt-ai/mcp-service/dist/platform.js"],
      "env": {
        "API_BASE_URL": "http://localhost:8000"
      }
    }
  }
}
```

## 🔑 获取认证令牌

1. 登录 Prompt AI 平台：http://localhost:3000/login
2. 打开浏览器开发者工具
3. 在 Application/Storage > Cookies 中找到 `access_token`
4. 复制令牌值并在配置中使用

## 🛠️ 可用工具

### 个人服务工具

| 工具名称 | 描述 | 权限要求 |
|---------|------|----------|
| `search_prompts` | 搜索提示词（包括私有） | 需要认证 |
| `get_prompt_by_id` | 获取提示词详情 | 需要认证 |
| `get_categories` | 获取分类列表 | 无 |
| `get_featured_prompts` | 获取精选提示词 | 无 |
| `create_prompt` | 创建新提示词 | 需要认证 |
| `get_user_prompts` | 获取用户所有提示词 | 需要认证 |

### 平台服务工具

| 工具名称 | 描述 | 权限要求 |
|---------|------|----------|
| `get_featured_prompts` | 获取平台精选提示词 | 无 |
| `search_featured_prompts` | 搜索精选提示词 | 无 |
| `get_prompt_by_id` | 获取公开提示词详情 | 无 |
| `get_categories` | 获取分类列表 | 无 |
| `get_trending_prompts` | 获取热门趋势提示词 | 无 |

## 📝 使用示例

### 搜索提示词

```
请帮我搜索关于"写作"的提示词
```

### 获取精选内容

```
给我推荐一些平台精选的高质量提示词
```

### 创建新提示词

```
帮我创建一个用于代码审查的提示词
```

### 管理个人提示词

```
显示我的所有私有提示词
```

## 🔧 开发配置

### 环境变量

创建 `.env` 文件：

```env
API_BASE_URL=http://localhost:8000
AUTH_TOKEN=your-jwt-token
```

### 开发模式

```bash
# 启动个人服务
npm run dev

# 启动平台服务
npm run dev:platform
```

## 🐛 故障排除

### 常见问题

1. **认证失败**
   - 检查 AUTH_TOKEN 是否正确
   - 确认令牌未过期
   - 验证 API_BASE_URL 是否可访问

2. **连接失败**
   - 确认后端服务正在运行
   - 检查端口配置是否正确
   - 验证网络连接

3. **权限错误**
   - 个人服务需要认证令牌
   - 平台服务只能访问公开内容
   - 检查用户权限设置

### 调试模式

启用详细日志：

```bash
DEBUG=1 node dist/index.js
```

## 📚 API 文档

详细的 API 文档请参考：
- 后端 API: http://localhost:8000/docs
- 前端应用: http://localhost:3000

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## �� 许可证

MIT License 