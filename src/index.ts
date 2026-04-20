#!/usr/bin/env node

/**
 * 代码维护流水线CLI入口
 */

import { runCodeMaintenancePipeline } from './orchestrator.js';
import { directoryExists } from './utils/common.js';
import path from 'path';

/**
 * 主函数
 */
async function main(): Promise<void> {
  try {
    const args = process.argv.slice(2);

    // 显示帮助信息
    if (args.includes('--help') || args.includes('-h') || args.length === 0) {
      showHelp();
      process.exit(0);
    }

    // 显示版本信息
    if (args.includes('--version') || args.includes('-v')) {
      await showVersion();
      process.exit(0);
    }

    // 解析参数
    const { codeDirectory, taskRequirement } = parseArguments(args);

    // 验证参数
    await validateArguments(codeDirectory, taskRequirement);

    // 运行流水线
    console.log('🚀 启动代码维护流水线...\n');
    const context = await runCodeMaintenancePipeline(codeDirectory, taskRequirement);

    // 根据执行状态退出
    if (context.status === 'completed') {
      console.log('\n✅ 流水线执行成功');
      process.exit(0);
    } else {
      console.log('\n❌ 流水线执行失败');
      process.exit(1);
    }
  } catch (error) {
    console.error('\n💥 程序执行失败:', error);
    console.error('\n💡 使用 --help 查看使用说明');
    process.exit(1);
  }
}

/**
 * 显示帮助信息
 */
function showHelp(): void {
  const helpText = `
代码维护流水线工具

使用方法:
  npm start <代码目录> "<任务需求>"
  或
  node dist/index.js <代码目录> "<任务需求>"

示例:
  npm start ./example "移除所有console.log语句和TODO注释"
  npm start ./src "重构函数为箭头函数语法"
  npm start . "修复TypeScript类型错误，添加缺失的类型注解"

参数:
  <代码目录>     要分析的代码目录路径
  "<任务需求>"   用引号包裹的任务需求描述

选项:
  -h, --help     显示此帮助信息
  -v, --version  显示版本信息

环境要求:
  - Node.js 18+
  - Claude API访问权限
  - 对代码目录的读写权限

说明:
  本工具使用Claude AI分析代码并执行维护任务，包括:
  1. 分析代码并生成修改报告
  2. 执行代码修改
  3. 验证修改的正确性

  执行结果将保存到当前目录的JSON报告中。
  `.trim();

  console.log(helpText);
}

/**
 * 显示版本信息
 */
async function showVersion(): Promise<void> {
  try {
    // 使用import()动态导入JSON文件
    const packageJson = await import('../package.json', { with: { type: 'json' } });
    const version = packageJson.default?.version || '未知版本';
    console.log(`代码维护流水线 v${version}`);
  } catch (error) {
    console.warn('无法读取版本信息:', error);
    console.log('代码维护流水线 v未知版本');
  }
}

/**
 * 解析命令行参数
 */
function parseArguments(args: string[]): { codeDirectory: string; taskRequirement: string } {
  if (args.length < 2) {
    throw new Error('参数不足。需要提供代码目录和任务需求。');
  }

  // 第一个参数是代码目录
  const codeDirectory = args[0];

  // 剩余参数合并为任务需求
  const taskRequirement = args.slice(1).join(' ');

  // 如果任务需求被引号包裹，去除引号
  const trimmedRequirement = taskRequirement.replace(/^["']|["']$/g, '');

  return {
    codeDirectory,
    taskRequirement: trimmedRequirement,
  };
}

/**
 * 验证参数
 */
async function validateArguments(codeDirectory: string, taskRequirement: string): Promise<void> {
  if (!codeDirectory || codeDirectory.trim() === '') {
    throw new Error('代码目录不能为空');
  }

  if (!taskRequirement || taskRequirement.trim() === '') {
    throw new Error('任务需求不能为空');
  }

  // 检查代码目录是否存在（相对路径）
  const absolutePath = path.resolve(process.cwd(), codeDirectory);

  const exists = await directoryExists(absolutePath);
  if (!exists) {
    throw new Error(`代码目录不存在: ${absolutePath}`);
  }

  // 注意：这里不检查是否为目录，因为directoryExists已经检查了
}

/**
 * 检测是否作为主模块运行
 */
// const isMainModule = import.meta.url === `file://${process.argv[1]}` ||
//                     (typeof require !== 'undefined' && require.main === module);

// 执行主函数
// if (isMainModule) {
//   main().catch(error => {
//     console.error('程序崩溃:', error);
//     process.exit(1);
//   });
// }
main().catch(error => {
  console.error('程序崩溃:', error);
  process.exit(1);
});

// 导出主要功能供模块使用
export { runCodeMaintenancePipeline } from './orchestrator.js';
export { analyzeCode } from './services/analysis-services.js';
export { modifyCode } from './services/modification-services.js';
export { validateCode } from './services/validation-services.js';