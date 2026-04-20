# 代码维护流水线 (Code Maintenance Pipeline)

一个基于 Claude Agent SDK 的自动化代码维护工具，使用 AI 分析、修改和验证代码变更。

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## ✨ 特性

- **AI 驱动的代码分析** - 使用 Claude AI 理解代码结构和识别修改点
- **安全的代码修改** - 自动执行修改，包含备份和回滚机制
- **全面的验证** - 静态分析和测试验证确保代码质量
- **权限自动配置** - 最高权限级别，无需人工干预 (`bypassPermissions`)
- **结构化报告** - 详细的 JSON 和 Markdown 报告
- **CLI 工具** - 简单的命令行接口，易于集成到工作流

## 🚀 快速开始

### 安装

```bash
# 克隆项目
git clone <repository-url>
cd CodeBot

# 安装依赖
npm install

# 构建项目
npm run build
```

### 基本使用

```bash
# 运行代码维护流水线
npm start <代码目录> "<任务需求>"

# 示例：移除指定目录中所有的 console.log 语句
npm start ./example "移除所有console.log语句和TODO注释"

# 示例：重构函数为箭头函数语法
npm start ./src "重构函数为箭头函数语法"
```

## 📦 打包与分发

### 作为 npm 包发布

项目已配置为可直接发布的 npm 包：

```bash
# 1. 构建项目
npm run build

# 2. 本地测试（使用 npm link）
npm link
# 在其他项目中：npm link code-maintenance-pipeline

# 3. 发布到 npm（需要 npm 账号）
npm publish
```

### 作为 CLI 工具使用

安装后，可通过以下方式使用：

```bash
# 全局安装
npm install -g code-maintenance-pipeline

# 使用长命令
code-maintenance ./src "重构代码"

# 使用短别名
cmaint ./src "添加类型注解"

# 使用 npx（无需安装）
npx code-maintenance ./src "修复代码格式"
```

### 作为库集成到其他项目

```bash
# 作为依赖安装
npm install code-maintenance-pipeline
```

```typescript
// 在代码中使用
import { runCodeMaintenancePipeline } from 'code-maintenance-pipeline';

async function maintainCode() {
  const context = await runCodeMaintenancePipeline(
    './my-code',
    '优化代码结构'
  );
  console.log('维护完成:', context.status);
}
```

### 配置说明

当工具在其他工程中使用时：

1. **`.claude` 配置读取**：
   - 工具会从**当前工作目录**读取 `.claude/` 配置
   - 确保目标项目有适当的权限配置（或使用默认的 `bypassPermissions` 模式）
   - 如果目标项目没有 `.claude` 文件夹，工具会使用内置的默认配置

2. **权限模式**：
   - 默认使用 `bypassPermissions`，自动批准所有操作
   - 可在目标项目的 `.claude/settings.local.json` 中覆盖配置
   - 支持所有标准权限模式：`default`, `acceptEdits`, `plan`, `dontAsk`, `auto`

3. **工具访问**：
   - 默认允许的工具：`Agent`, `Skill`, `Read`, `Edit`, `Bash`, `Glob`, `Grep`
   - 可在 `QueryClientConfig` 中自定义

### 打包选项

| 方法 | 说明 | 适用场景 |
| :--- | :--- | :--- |
| **npm 包** | 发布到 npm 注册表 | 开源分发、团队共享 |
| **本地链接** | `npm link` 本地开发 | 开发测试、频繁修改 |
| **源码集成** | 直接复制源码到项目 | 定制化修改、私有部署 |
| **Docker 镜像** | 容器化部署 | CI/CD 流水线、云环境 |

### 开发模式打包

对于开发环境，建议使用：

```bash
# 1. 构建项目
npm run build

# 2. 创建全局链接
npm link

# 3. 在目标项目中使用
cd /path/to/other-project
npm link code-maintenance-pipeline
code-maintenance ./src "测试任务"
```

## 📁 项目结构

```
CodeBot/
├── src/
│   ├── index.ts              # CLI 入口点
│   ├── orchestrator.ts       # 流水线中控器
│   ├── services/
│   │   ├── analysis-services.ts      # 分析服务
│   │   ├── modification-services.ts  # 修改服务
│   │   └── validation-services.ts    # 验证服务
│   ├── utils/
│   │   ├── query-client.ts          # Claude SDK 查询客户端
│   │   └── common.ts                # 通用工具函数
│   ├── types/
│   │   └── index.ts                 # TypeScript 类型定义
│   └── constants/
│       └── index.ts                 # 常量定义
├── .claude/
│   ├── CLAUDE.md                    # Claude Code 配置文件
│   └── settings.local.json          # 权限配置
├── package.json
├── tsconfig.json
└── README.md
```

## 🏗️ 架构设计

### 流水线工作流程

```
用户输入 → CLI 入口 → 中控器 → 三个阶段 → 输出报告
                         ↓
        分析 → 修改 → 验证 → 完成
```

### 1. 分析阶段 (Analysis)
- 扫描代码目录结构
- 使用 Claude AI 分析代码并生成修改建议
- 创建详细的修改报告 (`report.json`)

### 2. 修改阶段 (Modification)
- 基于分析报告执行代码修改
- 自动创建备份文件（`.bak`）
- 原子操作确保安全性
- 生成修改摘要 (`modification_summary.json`)

### 3. 验证阶段 (Validation)
- 运行静态分析（TypeScript 编译器）
- 执行单元测试（如果存在）
- 验证修改完整性和正确性
- 生成验证报告 (`validation_report.json`)

## 🔧 配置

### Claude Agent SDK 配置

核心配置位于 `src/utils/query-client.ts`：

```typescript
const options: Options = {
  maxTurns: config?.maxTurns ?? 3,
  cwd: config?.cwd ?? process.cwd(),
  allowedTools: config?.allowedTools ?? ["Agent", "Skill", "Read", "Edit", "Bash", "Glob", "Grep"],
  settingSources: config?.settingSources ?? ["user", "project"] as SettingSource[],
  permissionMode: config?.permissionMode ?? "bypassPermissions" as PermissionMode,
};
```

**权限模式说明**：
- `bypassPermissions`: 最高权限级别，自动批准所有操作
- 支持的工具：Agent, Skill, Read, Edit, Bash, Glob, Grep
- 设置来源：用户配置 + 项目配置

### TypeScript 配置

使用现代 TypeScript 配置 (`module: "node16"`)：
- `target: "ES2022"`
- `strict: true`（严格的类型检查）
- 无 `any` 类型使用
- 完整的声明文件生成

## 📖 API 参考

### CLI 命令

```bash
# 基本语法
npm start <代码目录> "<任务需求>"

# 选项
-h, --help     显示帮助信息
-v, --version  显示版本信息

# 环境要求
- Node.js 18+
- Claude API 访问权限
- 对代码目录的读写权限
```

### 模块导出

```typescript
// 导入主要功能
import { runCodeMaintenancePipeline } from './orchestrator.js';
import { analyzeCode } from './services/analysis-services.js';
import { modifyCode } from './services/modification-services.js';
import { validateCode } from './services/validation-services.js';

// 使用示例
const context = await runCodeMaintenancePipeline('./src', '添加类型注解');
```

### 报告格式

每次执行生成以下报告：

1. **分析报告** (`report.json`) - 代码分析和修改建议
2. **修改摘要** (`modification_summary.json`) - 修改执行结果
3. **验证报告** (`validation_report.json`) - 验证结果
4. **最终报告** (`pipeline-report-{id}.json`) - 完整的流水线摘要

## 🧪 开发指南

### 本地开发

```bash
# 安装依赖
npm install

# 开发模式（使用 ts-node）
npm run dev ./example "测试任务"

# 代码检查
npm run lint
npm run type-check

# 格式化代码
npm run format

# 运行测试
npm test
```

### 构建项目

```bash
# 编译 TypeScript
npm run build

# 生产环境使用
node dist/index.js ./src "重构代码"
```

### 添加新功能

1. 在 `src/services/` 中添加新服务
2. 更新类型定义 (`src/types/index.ts`)
3. 添加测试用例
4. 更新文档

## 🔒 安全性

### 权限控制
- 默认使用 `bypassPermissions` 模式，自动批准所有操作
- 可配置为其他权限模式 (`default`, `acceptEdits`, `plan` 等)
- 工具访问白名单控制

### 备份机制
- 所有修改前自动创建备份
- 备份文件保存在 `backups/` 目录
- 保留至少 7 天
- 支持手动回滚

### 错误处理
- 详细的错误报告和日志
- 自动回滚失败的操作
- 用户友好的错误消息

## 📊 输出示例

### 成功执行
```
🚀 启动代码维护流水线...
📁 代码目录: ./example
🎯 任务需求: 移除所有console.log语句

--- 阶段1: 代码分析 ---
✅ 代码分析完成
📊 分析报告ID: analysis_20250417_143022

--- 阶段2: 代码修改 ---
✅ 代码修改完成
📊 修改状态: success
📄 修改文件数: 3

--- 阶段3: 代码验证 ---
✅ 代码验证完成
📊 验证状态: passed

🎉 代码维护流水线执行完成！

📋 最终报告摘要:
==================================================
{
  "pipelineId": "pipeline_20250417_143022",
  "codeDirectory": "./example",
  "taskRequirement": "移除所有console.log语句",
  "executionStatus": "completed",
  ...
}
==================================================
📄 完整报告已保存到: pipeline-report-pipeline_20250417_143022.json
```

## 🤝 贡献

欢迎贡献！请遵循以下步骤：

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开 Pull Request

### 开发规范
- 使用 TypeScript，避免 `any` 类型
- 遵循现有代码风格
- 添加适当的注释
- 更新相关文档

## 📄 许可证

本项目基于 MIT 许可证开源 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [Claude Agent SDK](https://github.com/anthropics/claude-agent-sdk) - AI 代理框架
- [TypeScript](https://www.typescriptlang.org/) - 类型安全的 JavaScript
- 所有贡献者和用户

## ❓ 常见问题

### Q: 如何将工具打包并在其他工程中使用？
A: 项目已配置为 npm 包，可以通过以下方式打包：
   - **npm 包**: 运行 `npm publish` 发布到 npm 注册表
   - **本地使用**: 使用 `npm link` 创建全局链接
   - **源码集成**: 复制 `dist/` 目录和 `package.json` 依赖
   工具会从当前工作目录读取 `.claude/` 配置，确保目标项目有适当的权限设置。

### Q: 在其他工程中运行时，.claude 配置能否正确读取？
A: 可以。工具使用 Claude Agent SDK 的 `settingSources: ["user", "project"]` 配置，会从**当前工作目录**（即运行工具的项目根目录）读取 `.claude/` 配置。如果目标项目没有 `.claude` 文件夹，工具会使用默认的 `bypassPermissions` 权限模式。

### Q: 需要 Claude API 密钥吗？
A: 是的，需要有效的 Claude API 访问权限。Claude Agent SDK 会自动处理认证。

### Q: 支持哪些编程语言？
A: 主要支持 TypeScript/JavaScript，但可以扩展支持其他语言。

### Q: 如何修改权限配置？
A: 编辑 `src/utils/query-client.ts` 中的 `QueryClientConfig` 接口。

### Q: 可以在 CI/CD 中使用吗？
A: 可以，项目设计为无头运行，适合集成到自动化流水线。

### Q: 如何查看详细日志？
A: 启用调试模式或查看生成的 JSON 报告文件。

---

**提示**: 首次使用前，请确保已安装 Node.js 18+ 并配置好 Claude API 访问权限。

如有问题，请查看 [issues](https://github.com/your-repo/issues) 或提交新问题。