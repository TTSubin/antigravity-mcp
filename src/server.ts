import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import * as z from "zod/v4";
import { executeFrontendTask } from "./tools/execute.js";
import type { FrontendTask } from "./types.js";

const modeSchema = z.enum([
  "create",
  "redesign",
  "fix-ui",
  "responsive",
  "polish",
  "review",
]);

const surfaceSchema = z.enum([
  "landing",
  "portfolio",
  "dashboard",
  "settings",
  "form",
  "product-ui",
  "general",
]);

const baseTaskSchema = z.object({
  project: z.string().min(1),
  task: z.string().min(1),
  mode: modeSchema,
  surface: surfaceSchema.optional(),
  scope: z.array(z.string()).optional(),
  constraints: z.array(z.string()).optional(),
  acceptanceCriteria: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
  effort: z.enum(["low", "medium", "high"]).optional(),
  model: z.string().min(1).optional(),
  timeoutMinutes: z.number().int().min(1).max(60).optional(),
});

const noAuthMeta = {
  securitySchemes: [{ type: "noauth" }],
};

function toolResult(payload: Record<string, unknown>) {
  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(payload, null, 2),
      },
    ],
  };
}

async function safeToolCall(
  call: () => Promise<Record<string, unknown>>,
) {
  try {
    return toolResult(await call());
  } catch (error) {
    return toolResult({
      status: "error",
      handled: false,
      returnTo: "orchestrator",
      error:
        error instanceof Error ? error.message : "Unknown antigravity-mcp error",
    });
  }
}

function createServer(): McpServer {
  const server = new McpServer({
    name: "antigravity-mcp",
    version: "0.1.0",
  });

  server.registerTool(
    "antigravity_execute",
    {
      description:
        "Execute FRONTEND-ONLY implementation work through Google Antigravity CLI. Backend, database, API, infrastructure, and mixed tasks are not executed; they return handoff_required to the orchestrator.",
      inputSchema: baseTaskSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        openWorldHint: false,
      },
      _meta: noAuthMeta,
    },
    async (input) =>
      safeToolCall(() =>
        executeFrontendTask(input as FrontendTask),
      ),
  );

  server.registerTool(
    "antigravity_inspect",
    {
      description:
        "Inspect/review FRONTEND-ONLY code with Antigravity and the routed frontend Agent Skills. Requests are compiled as read-only and must not edit files.",
      inputSchema: baseTaskSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
      },
      _meta: noAuthMeta,
    },
    async (input) =>
      safeToolCall(() =>
        executeFrontendTask(
          { ...(input as FrontendTask), mode: "review" },
          { inspectOnly: true },
        ),
      ),
  );

  server.registerTool(
    "antigravity_continue",
    {
      description:
        "Continue an existing Antigravity frontend conversation by conversation_id. Scope is revalidated before resuming. Backend or mixed follow-ups return control to the orchestrator.",
      inputSchema: baseTaskSchema.extend({
        conversationId: z.string().uuid(),
      }),
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        openWorldHint: false,
      },
      _meta: noAuthMeta,
    },
    async ({ conversationId, ...input }) =>
      safeToolCall(() =>
        executeFrontendTask(input as FrontendTask, {
          conversationId,
        }),
      ),
  );

  return server;
}

void serveStdio(createServer);
console.error("antigravity-mcp running on stdio");
