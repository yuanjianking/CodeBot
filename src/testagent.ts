import { query } from "@anthropic-ai/claude-agent-sdk";
import { codeAnalysisAgent } from "./agents/code-analysis-agent.js";
import { CLAUDE_PROMPT_TEMPLATE } from "./system-prompt/claude.js";

// Agentic loop: streams messages as Claude works
for await (const message of query({
  prompt: "你是一位高级软件分析专家,并将分析的结果输出到指定的路径下。目标工程的路径是 test-simple，任务需求是：删除console。",
  options: {
    allowedTools: ["Agent"], // Tools Claude can use
    agents: {
      "codeAnalyzer": codeAnalysisAgent(),
    },
      systemPrompt: CLAUDE_PROMPT_TEMPLATE,


    permissionMode: "acceptEdits" // Auto-approve file edits
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