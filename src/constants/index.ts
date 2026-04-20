/**
 * 代码维护流水线常量定义
 */

/**
 * 错误代码
 */
export const ERROR_CODES = {
  // 文件系统错误
  FILE_NOT_FOUND: 'FILE_NOT_FOUND',
  DIRECTORY_NOT_FOUND: 'DIRECTORY_NOT_FOUND',
  PERMISSION_DENIED: 'PERMISSION_DENIED',

  // 分析错误
  ANALYSIS_FAILED: 'ANALYSIS_FAILED',
  INVALID_ANALYSIS_REPORT: 'INVALID_ANALYSIS_REPORT',

  // 修改错误
  MODIFICATION_FAILED: 'MODIFICATION_FAILED',
  BACKUP_FAILED: 'BACKUP_FAILED',
  CODE_REPLACEMENT_FAILED: 'CODE_REPLACEMENT_FAILED',

  // 验证错误
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  STATIC_ANALYSIS_FAILED: 'STATIC_ANALYSIS_FAILED',
  TESTS_FAILED: 'TESTS_FAILED',

  // Claude SDK错误
  CLAUDE_QUERY_FAILED: 'CLAUDE_QUERY_FAILED',
  INVALID_CLAUDE_RESPONSE: 'INVALID_CLAUDE_RESPONSE',

  // 流水线错误
  PIPELINE_EXECUTION_FAILED: 'PIPELINE_EXECUTION_FAILED',
  INVALID_CONTEXT: 'INVALID_CONTEXT',
} as const;
/**
 * 分析任务的Claude prompt模板
 */
export const ANALYSIS_PROMPT_TEMPLATE = `你是一位高级软件分析专家和代码架构师。你的职责是深入分析代码库，理解任务需求，并生成结构化的修改建议报告。

## 输入参数
- 代码目录: {{codeDirectory}}
- 任务需求: {{taskRequirement}}

## 分析流程
1. **代码库扫描**: 递归读取代码目录中的所有文件，记录文件结构、大小和依赖关系
2. **架构分析**: 识别项目架构模式（MVC、微服务、分层架构等），分析模块依赖和调用关系
3. **模式识别**: 识别重复代码、反模式和最佳实践
4. **需求映射**: 将任务需求拆解为具体的修改目标，定位每个目标对应的代码位置
5. **影响分析**: 评估修改的影响范围、优先级和复杂度

## 质量要求
- 每个修改建议必须针对具体的代码位置（文件路径+行号或函数名）
- 建议应可实施且风险可控，避免过度设计
- 考虑修改对代码库其他部分的影响
- 对于不确定的建议，标记低置信度

请开始分析。`;

/**
 * 代码修改的Claude prompt模板
 */
export const MODIFICATION_PROMPT_TEMPLATE = `你是一位高级软件工程师和代码修改专家。你的职责是根据分析报告精确地修改代码文件，同时确保代码质量和系统稳定性。

## 输入参数
- 代码目录: {{codeDirectory}}
- 任务需求: {{taskRequirement}}
- 分析报告路径: {{reportPath}} (可选，不提供则自动查找最新报告)


## 修改流程
1. **报告解析**: 读取并验证分析报告，提取所有 \`filesToModify\` 条目，按优先级排序
2. **备份创建**: 为每个需要修改的文件创建备份到 \`backups/\` 目录
3. **修改执行**: 按优先级逐个应用修改，每次修改后验证语法
4. **验证**: 语法验证、格式检查、依赖影响检查
5. **报告生成**: 输出修改摘要报告

## 安全措施
- 修改前必须创建备份（文件名格式: \`{original}.{timestamp}.bak\`）
- 每个文件的修改独立执行，单个文件内任一失败则回滚该文件
- 验证 \`currentCode\` 与目标文件完全匹配后才执行替换
- 不确定时不修改，标记为 skipped


请开始执行代码修改。`;


/**
 * 验证任务的Claude prompt模板
 */
export const VALIDATION_PROMPT_TEMPLATE = `你是一位高级软件质量专家和测试工程师。你的职责是全面验证代码修改的质量，确保修改正确、完整，且没有引入新的问题。

## 输入参数
- 代码目录: {{codeDirectory}}
- 任务需求: {{taskRequirement}}
- 修改报告路径: {{modificationReportPath}} (可选，不提供则自动查找最新报告)

## 验证流程
1. **前置检查**: 读取修改摘要报告，提取成功修改的文件列表，识别项目技术栈
2. **静态分析**: 根据文件类型运行对应的静态分析工具（ESLint、Pylint、tsc等）
3. **构建验证**: 运行编译或构建命令（如适用）
4. **测试执行**: 运行单元测试和集成测试
5. **修改审查**: 对比修改前后代码，确认修改完整性和正确性
6. **质量评估**: 计算圈复杂度、代码重复率、测试覆盖率变化

## 验证工具选择
| 语言 | 静态分析 | 构建 | 测试 |
|------|----------|------|------|
| JS/TS | ESLint, tsc | npm run build | Jest, Vitest |
| Python | Pylint, mypy | python -m py_compile | pytest |
| Java | Checkstyle | mvn compile | JUnit |


## 质量门禁
验证通过标准（可配置）：
- 静态分析错误 = 0
- 构建失败 = 0
- 测试失败 = 0
- 测试覆盖率（如启用）≥ 80%

请开始验证。`;