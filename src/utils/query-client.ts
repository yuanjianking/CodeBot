/**
 * Claude Agent SDK查询客户端
 * 正确的Options配置，符合官方使用示例
 * 支持流式响应，实时接收文本和工具调用
 */

import { query } from '@anthropic-ai/claude-agent-sdk';
import type {  SettingSource, PermissionMode,  AgentDefinition } from '@anthropic-ai/claude-agent-sdk';

/**
 * 查询客户端配置
 */
export interface QueryClientConfig {
  /** 允许使用的工具列表 */
  allowedTools?: string[];
  /** 设置来源 */
  settingSources?: SettingSource[];
  /** 权限模式 */
  permissionMode?: PermissionMode;
  /** 代理列表 */
  agents?: Record<string, AgentDefinition>;
  /** 可选系统提示 */
  systemPrompt?: string;
}

/**
 * 执行Claude查询（封装工作示例）
 */
export async function executeClaudeQuery(
  prompt: string,
  config: QueryClientConfig
): Promise<void> {
  // Agentic loop: streams messages as Claude works
  for await (const message of query({
    prompt,
    options: {
      allowedTools: config?.allowedTools ?? ["Agent", "Skill", "Read", "Edit", "Bash", "Glob", "Grep"],
      settingSources: config?.settingSources ?? ["user", "project"] as SettingSource[],
      permissionMode: config?.permissionMode ?? "bypassPermissions" as PermissionMode,
      allowDangerouslySkipPermissions: true, // 必须启用才能使用bypassPermissions模式
      agents: config?.agents, // 可选代理列表
      systemPrompt: config?.systemPrompt, // 可选系统提示
    }
  })) {
    // Print human-readable output
    if (message.type === "assistant" && message.message?.content) {
      for (const block of message.message.content) {
        if ("text" in block) {
          console.log(block.text); // Claude's reasoning
        } else if ("name" in block) {
          console.log(`Tool: ${block.name}`); // Tool being called
        }
      }
    } else if (message.type === "result") {
      console.log(`Done: ${message.subtype}`); // Final result
    }
  }
}