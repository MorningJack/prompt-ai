#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';

// 配置
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8000';

// API客户端
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 工具定义
const TOOLS = [
  {
    name: 'get_featured_prompts',
    description: '获取平台精选提示词列表',
    inputSchema: {
      type: 'object',
      properties: {
        limit: {
          type: 'number',
          description: '返回结果数量限制',
          default: 20,
        },
        category_id: {
          type: 'number',
          description: '分类ID筛选',
        },
      },
    },
  },
  {
    name: 'search_featured_prompts',
    description: '搜索平台精选提示词',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: '搜索关键词',
        },
        category_id: {
          type: 'number',
          description: '分类ID筛选',
        },
        limit: {
          type: 'number',
          description: '返回结果数量限制',
          default: 10,
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_prompt_by_id',
    description: '根据ID获取提示词详情（仅限公开提示词）',
    inputSchema: {
      type: 'object',
      properties: {
        prompt_id: {
          type: 'number',
          description: '提示词ID',
        },
      },
      required: ['prompt_id'],
    },
  },
  {
    name: 'get_categories',
    description: '获取所有分类列表',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_trending_prompts',
    description: '获取热门趋势提示词',
    inputSchema: {
      type: 'object',
      properties: {
        limit: {
          type: 'number',
          description: '返回结果数量限制',
          default: 10,
        },
        days: {
          type: 'number',
          description: '统计天数范围',
          default: 7,
        },
      },
    },
  },
];

// 创建服务器
const server = new Server(
  {
    name: 'prompt-ai-platform',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 工具列表处理
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: TOOLS,
  };
});

// 工具调用处理
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'get_featured_prompts': {
        const { limit = 20, category_id } = args as {
          limit?: number;
          category_id?: number;
        };

        const params = new URLSearchParams();
        params.append('limit', limit.toString());
        if (category_id) {
          params.append('category_id', category_id.toString());
        }

        const response = await apiClient.get(`/api/v1/prompts/featured?${params}`);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                data: response.data,
                message: `获取到 ${response.data.length} 个精选提示词`,
              }, null, 2),
            },
          ],
        };
      }

      case 'search_featured_prompts': {
        const { query, category_id, limit = 10 } = args as {
          query: string;
          category_id?: number;
          limit?: number;
        };

        const params = new URLSearchParams();
        params.append('q', query);
        params.append('limit', limit.toString());
        if (category_id) {
          params.append('category_id', category_id.toString());
        }

        // 先获取所有精选提示词，然后进行搜索筛选
        const featuredResponse = await apiClient.get('/api/v1/prompts/featured');
        const featuredPrompts = featuredResponse.data;

        // 简单的文本搜索
        const filteredPrompts = featuredPrompts.filter((prompt: any) => {
          const matchesQuery = 
            prompt.title.toLowerCase().includes(query.toLowerCase()) ||
            prompt.description.toLowerCase().includes(query.toLowerCase()) ||
            prompt.content.toLowerCase().includes(query.toLowerCase());
          
          const matchesCategory = !category_id || prompt.category_id === category_id;
          
          return matchesQuery && matchesCategory;
        }).slice(0, limit);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                data: filteredPrompts,
                message: `搜索到 ${filteredPrompts.length} 个匹配的精选提示词`,
                query,
              }, null, 2),
            },
          ],
        };
      }

      case 'get_prompt_by_id': {
        const { prompt_id } = args as { prompt_id: number };

        const response = await apiClient.get(`/api/v1/prompts/${prompt_id}`);
        
        // 检查是否为公开提示词
        if (!response.data.is_public) {
          throw new McpError(
            ErrorCode.InvalidRequest,
            '该提示词不是公开的，无法通过平台服务访问'
          );
        }

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
        const response = await apiClient.get('/api/v1/categories/');
        
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

      case 'get_trending_prompts': {
        const { limit = 10, days = 7 } = args as {
          limit?: number;
          days?: number;
        };

        // 获取所有公开提示词并按使用量排序
        const response = await apiClient.get('/api/v1/prompts/');
        const publicPrompts = response.data.filter((prompt: any) => prompt.is_public);
        
        // 按使用量排序
        const trendingPrompts = publicPrompts
          .sort((a: any, b: any) => b.usage_count - a.usage_count)
          .slice(0, limit);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                data: trendingPrompts,
                message: `获取到 ${trendingPrompts.length} 个热门提示词`,
                period: `${days} 天`,
              }, null, 2),
            },
          ],
        };
      }

      default:
        throw new McpError(
          ErrorCode.MethodNotFound,
          `未知的工具: ${name}`
        );
    }
  } catch (error) {
    if (error instanceof McpError) {
      throw error;
    }

    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.detail || error.message;
      
      if (status === 404) {
        throw new McpError(ErrorCode.InvalidRequest, `资源不存在: ${message}`);
      } else if (status === 403) {
        throw new McpError(ErrorCode.InvalidRequest, `访问被拒绝: ${message}`);
      } else if (status === 401) {
        throw new McpError(ErrorCode.InvalidRequest, `认证失败: ${message}`);
      } else {
        throw new McpError(ErrorCode.InternalError, `API请求失败: ${message}`);
      }
    }

    throw new McpError(
      ErrorCode.InternalError,
      `工具执行失败: ${error instanceof Error ? error.message : String(error)}`
    );
  }
});

// 启动服务器
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Prompt AI Platform MCP Server 已启动');
}

main().catch((error) => {
  console.error('服务器启动失败:', error);
  process.exit(1);
}); 