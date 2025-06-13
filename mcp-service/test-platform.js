#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 测试平台MCP服务
async function testPlatformMCPService() {
  console.log('🧪 测试平台 MCP 服务...\n');

  const serverPath = join(__dirname, 'dist', 'platform.js');
  
  // 启动MCP服务器
  const server = spawn('node', [serverPath], {
    stdio: ['pipe', 'pipe', 'pipe'],
    env: {
      ...process.env,
      API_BASE_URL: 'http://localhost:8000'
    }
  });

  // 测试用例
  const testCases = [
    {
      name: '获取精选提示词',
      request: {
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/call',
        params: {
          name: 'get_featured_prompts',
          arguments: { limit: 5 }
        }
      }
    },
    {
      name: '搜索精选提示词',
      request: {
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/call',
        params: {
          name: 'search_featured_prompts',
          arguments: { query: '写作', limit: 3 }
        }
      }
    },
    {
      name: '获取分类列表',
      request: {
        jsonrpc: '2.0',
        id: 3,
        method: 'tools/call',
        params: {
          name: 'get_categories',
          arguments: {}
        }
      }
    },
    {
      name: '获取热门提示词',
      request: {
        jsonrpc: '2.0',
        id: 4,
        method: 'tools/call',
        params: {
          name: 'get_trending_prompts',
          arguments: { limit: 5 }
        }
      }
    }
  ];

  let testIndex = 0;
  let passedTests = 0;

  // 处理服务器响应
  server.stdout.on('data', (data) => {
    const response = data.toString().trim();
    if (response) {
      try {
        const parsed = JSON.parse(response);
        const testCase = testCases[testIndex - 1];
        
        if (testCase) {
          console.log(`✅ ${testCase.name}: 成功`);
          console.log(`   响应: ${JSON.stringify(parsed, null, 2).substring(0, 200)}...\n`);
          passedTests++;
        }
      } catch (error) {
        console.log(`❌ 解析响应失败: ${error.message}\n`);
      }
    }
  });

  server.stderr.on('data', (data) => {
    const message = data.toString().trim();
    if (message && !message.includes('已启动')) {
      console.log(`⚠️  服务器消息: ${message}`);
    }
  });

  // 等待服务器启动
  await new Promise(resolve => setTimeout(resolve, 2000));

  // 发送测试请求
  for (const testCase of testCases) {
    console.log(`🔍 测试: ${testCase.name}`);
    
    try {
      server.stdin.write(JSON.stringify(testCase.request) + '\n');
      testIndex++;
      
      // 等待响应
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.log(`❌ ${testCase.name}: ${error.message}\n`);
    }
  }

  // 等待所有响应
  await new Promise(resolve => setTimeout(resolve, 2000));

  // 关闭服务器
  server.kill();

  // 输出测试结果
  console.log('\n📊 测试结果:');
  console.log(`   总测试数: ${testCases.length}`);
  console.log(`   通过测试: ${passedTests}`);
  console.log(`   失败测试: ${testCases.length - passedTests}`);
  
  if (passedTests === testCases.length) {
    console.log('\n🎉 所有测试通过！平台 MCP 服务运行正常。');
  } else {
    console.log('\n⚠️  部分测试失败，请检查服务配置。');
  }
}

// 运行测试
testPlatformMCPService().catch(console.error); 