import { parseStructuredResponse } from "../antigravity/parser.js";
import { runAntigravity } from "../antigravity/runner.js";
import { loadProject } from "../config/projects.js";
import { compilePrompt } from "../prompts/compiler.js";
import { classifyScope } from "../security/scopeGuard.js";
import { discoverWorkspaceSkills } from "../skills/discovery.js";
import { routeSkills } from "../skills/router.js";
import type {
  FrontendSurface,
  FrontendTask,
} from "../types.js";

export type ToolPayload = Record<string, unknown>;

function handoff(
  input: FrontendTask,
  reason: "backend_task" | "mixed_scope" | "scope_unclear",
  details: string,
): ToolPayload {
  return {
    status: "handoff_required",
    handled: false,
    reason,
    returnTo: "orchestrator",
    originalTask: input.task,
    project: input.project,
    details,
  };
}

export async function executeFrontendTask(
  input: FrontendTask,
  options: {
    inspectOnly?: boolean;
    conversationId?: string;
  } = {},
): Promise<ToolPayload> {
  const initialDecision = classifyScope(input.task, input.scope);

  if (initialDecision.kind !== "frontend") {
    const reason =
      initialDecision.kind === "backend"
        ? "backend_task"
        : initialDecision.kind === "mixed"
          ? "mixed_scope"
          : "scope_unclear";
    return handoff(input, reason, initialDecision.reason);
  }

  const project = await loadProject(input.project);
  const decision = classifyScope(input.task, input.scope, project);

  if (decision.kind !== "frontend") {
    const reason =
      decision.kind === "backend"
        ? "backend_task"
        : decision.kind === "mixed"
          ? "mixed_scope"
          : "scope_unclear";
    return handoff(input, reason, decision.reason);
  }

  const surface: FrontendSurface =
    input.surface ?? project.defaultSurface ?? "general";
  const route = routeSkills(input.mode, surface, input.skills);
  const installed = await discoverWorkspaceSkills(project.path);
  const missing = route.skills.filter((skill) => !installed.has(skill));

  if (missing.length > 0) {
    return {
      status: "setup_required",
      handled: false,
      reason: "missing_agent_skills",
      returnTo: "orchestrator",
      project: input.project,
      missingSkills: missing,
      installCommands: missing.map(
        (skill) => route.installCommands[skill],
      ),
      details:
        "Required Antigravity Agent Skills are not installed in this workspace. Install them, then retry the same task.",
    };
  }

  const prompt = await compilePrompt(
    input,
    project,
    route.skills,
    options.inspectOnly,
  );

  const runOptions = {
    cwd: project.path,
    prompt,
    ...(input.effort ? { effort: input.effort } : {}),
    ...(input.model ? { model: input.model } : {}),
    ...(input.timeoutMinutes
      ? { timeoutMinutes: input.timeoutMinutes }
      : {}),
    mode: options.inspectOnly ? "plan" as const : "accept-edits" as const,
    ...(options.conversationId
      ? { conversationId: options.conversationId }
      : {}),
  };

  const { envelope, stderr, exitCode } = await runAntigravity(runOptions);

  const structured =
    envelope.structured_output ??
    parseStructuredResponse(envelope.response);
  const timedOut = /print timeout/i.test(stderr);
  const success =
    envelope.status === "SUCCESS" &&
    exitCode === 0 &&
    !timedOut &&
    Boolean(structured);

  return {
    status: success
      ? "success"
      : timedOut
        ? "antigravity_timeout"
        : "antigravity_incomplete",
    handled: success,
    project: input.project,
    conversationId: envelope.conversation_id,
    antigravityStatus: envelope.status ?? "UNKNOWN",
    result: structured ?? null,
    rawResponse: structured ? undefined : envelope.response,
    stderr: stderr || undefined,
    exitCode,
  };
}
