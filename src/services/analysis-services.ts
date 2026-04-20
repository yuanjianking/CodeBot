/**
 * 代码分析工具
 */

import { codeAnalysisAgent } from '../agents/code-analysis-agent.js';
import { ANALYSIS_PROMPT_TEMPLATE, ERROR_CODES } from '../constants/index.js';
import { CLAUDE_PROMPT_TEMPLATE } from '../system-prompt/claude.js';
import { executeClaudeQuery } from '../utils/query-client.js';

/**
 * 分析代码并生成修改报告
 */
export async function analyzeCode(
  codeDirectory: string,
  taskRequirement: string
): Promise<void> {
  try {
    console.log(`开始分析代码目录: ${codeDirectory}`);
    console.log(`任务需求: ${taskRequirement}`);

    // 验证代码目录存在
    const directoryExists = await checkDirectoryExists(codeDirectory);
    if (!directoryExists) {
      throw new Error(`代码目录不存在: ${codeDirectory}`, {
        cause: ERROR_CODES.DIRECTORY_NOT_FOUND,
      });
    }

    // 构建Claude查询prompt
    const prompt = buildAnalysisPrompt(codeDirectory, taskRequirement);

    // 调用Claude进行分析
    console.log('正在使用Claude分析代码...');
    await queryClaude(prompt);
    console.log('代码分析完成');

  } catch (error) {
    console.error('代码分析失败:', error);
    throw new Error(`代码分析失败: ${error instanceof Error ? error.message : '未知错误'}`, {
      cause: ERROR_CODES.ANALYSIS_FAILED,
    });
  }
}

/**
 * 检查目录是否存在
 */
async function checkDirectoryExists(directory: string): Promise<boolean> {
  try {
    const { directoryExists } = await import('../utils/common.js');
    return await directoryExists(directory);
  } catch (error) {
    console.warn(`检查目录存在时出错: ${error}`);
    return false;
  }
}

/**
 * 构建分析prompt
 */
function buildAnalysisPrompt(
  codeDirectory: string,
  taskRequirement: string,
): string {
  const prompt = ANALYSIS_PROMPT_TEMPLATE
    .replace('{{codeDirectory}}', codeDirectory)
    .replace('{{taskRequirement}}', taskRequirement);

  return prompt;
}

/**
 * 调用Claude查询
 */
async function queryClaude(prompt: string): Promise<void> {
  try {
    await executeClaudeQuery(prompt, {
      agents: {
        "codeAnalyzer": codeAnalysisAgent(),
      },
      systemPrompt: CLAUDE_PROMPT_TEMPLATE
    });

  } catch (error) {
    console.error('Claude查询失败:', error);
    throw new Error(`Claude查询失败: ${error instanceof Error ? error.message : '未知错误'}`, {
      cause: ERROR_CODES.CLAUDE_QUERY_FAILED,
    });
  }
}
