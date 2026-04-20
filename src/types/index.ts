/**
 * 流水线执行上下文
 */
export interface PipelineContext {
  /** 上下文ID */
  id: string;
  /** 代码目录 */
  codeDirectory: string;
  /** 任务需求 */
  taskRequirement: string;
  /** 执行状态 */
  status: 'initialized' | 'analyzing' | 'modifying' | 'validating' | 'completed' | 'failed';
  /** 错误信息（如果有） */
  error?: string;
  /** 开始时间 */
  startTime: string;
  /** 结束时间（可选） */
  endTime?: string;
}