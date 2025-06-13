#!/usr/bin/env node

// 简单的MCP服务测试脚本
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 设置环境变量
process.env.API_BASE_URL = 'http://localhost:8000';

console.log('🚀 启动 Prompt AI MCP 服务测试...\n');

// 启动MCP服务
const mcpService = spawn('node', [join(__dirname, 'dist/index.js')], {
  stdio: ['pipe', 'pipe', 'inherit'],
  env: { ...process.env }
});

// 测试工具列表请求
const listToolsRequest = {
  jsonrpc: '2.0',
  id: 1,
  method: 'tools/list',
  params: {}
};

// 测试搜索提示词请求
const searchPromptsRequest = {
  jsonrpc: '2.0',
  id: 2,
  method: 'tools/call',
  params: {
    name: 'search_prompts',
    arguments: {
      query: '软件',
      page: 1,
      size: 5
    }
  }
};

// 测试获取分类请求
const getCategoriesRequest = {
  jsonrpc: '2.0',
  id: 3,
  method: 'tools/call',
  params: {
    name: 'get_categories',
    arguments: {}
  }
};

let testIndex = 0;
const tests = [
  { name: '获取工具列表', request: listToolsRequest },
  { name: '搜索提示词', request: searchPromptsRequest },
  { name: '获取分类', request: getCategoriesRequest }
];

function runNextTest() {
  if (testIndex >= tests.length) {
    console.log('\n✅ 所有测试完成！');
    mcpService.kill();
    process.exit(0);
    return;
  }

  const test = tests[testIndex++];
  console.log(`📋 测试 ${testIndex}: ${test.name}`);
  
  mcpService.stdin.write(JSON.stringify(test.request) + '\n');
  
  setTimeout(runNextTest, 2000); // 等待2秒后运行下一个测试
}

// 处理MCP服务的输出
mcpService.stdout.on('data', (data) => {
  const output = data.toString().trim();
  if (output) {
    try {
      const response = JSON.parse(output);
      console.log('📤 响应:', JSON.stringify(response, null, 2));
    } catch (e) {
      console.log('📤 原始输出:', output);
    }
  }
});

mcpService.on('error', (error) => {
  console.error('❌ MCP服务错误:', error);
});

mcpService.on('close', (code) => {
  console.log(`🔚 MCP服务已关闭，退出码: ${code}`);
});

// 等待服务启动后开始测试
setTimeout(() => {
  console.log('🔧 开始运行测试...\n');
  runNextTest();
}, 1000); 