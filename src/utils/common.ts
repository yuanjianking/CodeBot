/**
 * 共通工具函数
 */

import fs from 'fs/promises';
import crypto from 'crypto';
import type {
  PipelineContext,
} from '../types/index.js';

/**
 * 生成唯一ID
 */
export function generateId(): string {
  return crypto.randomUUID();
}

/**
 * 生成时间戳
 */
export function generateTimestamp(): string {
  return new Date().toISOString();
}


/**
 * 检查目录是否存在
 */
export async function directoryExists(dirPath: string): Promise<boolean> {
  try {
    const stats = await fs.stat(dirPath);
    return stats.isDirectory();
  } catch {
    return false;
  }
}


/**
 * 创建流水线上下文
 */
export function createPipelineContext(
  codeDirectory: string,
  taskRequirement: string
): PipelineContext {
  return {
    id: generateId(),
    codeDirectory,
    taskRequirement,
    status: 'initialized',
    startTime: generateTimestamp(),
  };
}

/**
 * 更新流水线上下文
 */
export function updatePipelineContext(
  context: PipelineContext,
  updates: Partial<Omit<PipelineContext, 'id' | 'startTime'>>
): PipelineContext {
  return {
    ...context,
    ...updates,
  };
}

/**
 * 记录流水线执行日志
 */
export async function logPipelineExecution(
  context: PipelineContext,
  logFile: string = 'pipeline-execution.log'
): Promise<void> {
  try {
    const logEntry = `${generateTimestamp()} [${context.status}] ${context.id} - ${context.taskRequirement}\n`;

    if (context.error) {
      const errorEntry = `${generateTimestamp()} [ERROR] ${context.id} - ${context.error}\n`;
      await fs.appendFile(logFile, logEntry + errorEntry, 'utf-8');
    } else {
      await fs.appendFile(logFile, logEntry, 'utf-8');
    }
  } catch (error) {
    // 日志记录失败不影响主流程
    console.warn(`Failed to log pipeline execution: ${error}`);
  }
}