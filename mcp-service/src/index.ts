#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
  McpError,
  ErrorCode,
} from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';
import dotenv from 'dotenv';


// 加载环境变量
dotenv.config();

// API基础URL
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8000';

// 创建服务器实例
const server = new Server(
  {
    name: 'prompt-ai-mcp-service',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 定义工具列表
const tools: Tool[] = [
  {
    name: 'search_prompts',
    description: '搜索提示词库中的提示词',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: '搜索关键词',
        },
        category_id: {
          type: 'number',
          description: '分类ID（可选）',
        },
        page: {
          type: 'number',
          description: '页码（默认为1）',
          default: 1,
        },
        size: {
          type: 'number',
          description: '每页数量（默认为10）',
          default: 10,
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_prompt_by_id',
    description: '根据ID获取特定提示词的详细信息',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: '提示词ID',
        },
      },
      required: ['id'],
    },
  },
  {
    name: 'get_categories',
    description: '获取所有提示词分类',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_featured_prompts',
    description: '获取精选提示词',
    inputSchema: {
      type: 'object',
      properties: {
        limit: {
          type: 'number',
          description: '返回数量限制（默认为5）',
          default: 5,
        },
      },
    },
  },
  {
    name: 'create_prompt',
    description: '创建新的提示词（需要认证）',
    inputSchema: {
      type: 'object',
      properties: {
        name_zh: {
          type: 'string',
          description: '中文名称',
        },
        name_en: {
          type: 'string',
          description: '英文名称（可选）',
        },
        description: {
          type: 'string',
          description: '描述',
        },
        content: {
          type: 'string',
          description: '提示词内容',
        },
        category_id: {
          type: 'number',
          description: '分类ID',
        },
        tags: {
          type: 'array',
          items: { type: 'string' },
          description: '标签列表（可选）',
        },
        is_public: {
          type: 'boolean',
          description: '是否公开（默认为true）',
          default: true,
        },
      },
      required: ['name_zh', 'content', 'category_id'],
    },
  },
  {
    name: 'get_user_prompts',
    description: '获取当前用户的所有提示词（包括私有提示词）',
    inputSchema: {
      type: 'object',
      properties: {
        limit: {
          type: 'number',
          description: '返回结果数量限制',
          default: 50,
        },
        skip: {
          type: 'number',
          description: '跳过的结果数量',
          default: 0,
        },
        include_private: {
          type: 'boolean',
          description: '是否包含私有提示词',
          default: true,
        },
      },
    },
  },
];

// 处理工具列表请求
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools,
  };
});

// 处理工具调用请求
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'search_prompts': {
        const { query, category_id, page = 1, size = 10 } = args as {
          query: string;
          category_id?: number;
          page?: number;
          size?: number;
        };

        const params = new URLSearchParams({
          search: query,
          page: page.toString(),
          size: size.toString(),
          is_public: 'true',
        });

        if (category_id) {
          params.append('category_id', category_id.toString());
        }

        const response = await axios.get(`${API_BASE_URL}/api/v1/prompts/?${params}`);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                data: response.data,
                message: `找到 ${response.data.total} 个相关提示词`,
              }, null, 2),
            },
          ],
        };
      }

      case 'get_prompt_by_id': {
        const { id } = args as { id: number };
        
        const response = await axios.get(`${API_BASE_URL}/api/v1/prompts/${id}`);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                data: response.data,
                message: '成功获取提示词详情',
              }, null, 2),
            },
          ],
        };
      }

      case 'get_categories': {
        const response = await axios.get(`${API_BASE_URL}/api/v1/categories/`);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                data: response.data,
                message: `获取到 ${response.data.length} 个分类`,
              }, null, 2),
            },
          ],
        };
      }

      case 'get_featured_prompts': {
        const { limit = 5 } = args as { limit?: number };
        
        const response = await axios.get(`${API_BASE_URL}/api/v1/prompts/?is_featured=true&size=${limit}`);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                data: response.data,
                message: `获取到 ${response.data.items.length} 个精选提示词`,
              }, null, 2),
            },
          ],
        };
      }

      case 'create_prompt': {
        const {
          name_zh,
          name_en,
          description,
          content,
          category_id,
          tags,
          is_public = true,
        } = args as {
          name_zh: string;
          name_en?: string;
          description?: string;
          content: string;
          category_id: number;
          tags?: string[];
          is_public?: boolean;
        };

        // 注意：这里需要认证token，实际使用时需要配置
        const token = process.env.AUTH_TOKEN;
        if (!token) {
          throw new Error('需要认证token才能创建提示词');
        }

        const response = await axios.post(
          `${API_BASE_URL}/api/v1/prompts/`,
          {
            name_zh,
            name_en,
            description,
            content,
            category_id,
            tags,
            is_public,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                data: response.data,
                message: '提示词创建成功',
              }, null, 2),
            },
          ],
        };
      }

      case 'get_user_prompts': {
        if (!process.env.AUTH_TOKEN) {
          throw new McpError(
            ErrorCode.InvalidRequest,
            '需要认证令牌才能访问用户提示词'
          );
        }

        const { limit = 50, skip = 0, include_private = true } = args as {
          limit?: number;
          skip?: number;
          include_private?: boolean;
        };

        // 首先获取当前用户信息
        const userResponse = await axios.get(`${API_BASE_URL}/api/v1/users/me`, {
          headers: { Authorization: `Bearer ${process.env.AUTH_TOKEN}` },
        });
        
        const userId = userResponse.data.id;

        // 获取用户的提示词
        const response = await axios.get(`${API_BASE_URL}/api/v1/prompts/user/${userId}`, {
          headers: { Authorization: `Bearer ${process.env.AUTH_TOKEN}` },
          params: { limit, skip },
        });

        let prompts = response.data;

        // 如果不包含私有提示词，则过滤掉
        if (!include_private) {
          prompts = prompts.filter((prompt: any) => prompt.is_public);
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                data: prompts,
                message: `获取到 ${prompts.length} 个用户提示词`,
                user_id: userId,
                include_private,
              }, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`未知的工具: ${name}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '未知错误';
    const statusCode = axios.isAxiosError(error) ? error.response?.status : undefined;
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: false,
            error: errorMessage,
            statusCode,
            message: '工具调用失败',
          }, null, 2),
        },
      ],
      isError: true,
    };
  }
});

// 启动服务器
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Prompt AI MCP服务已启动');
}

main().catch((error) => {
  console.error('启动MCP服务失败:', error);
  process.exit(1);
}); 