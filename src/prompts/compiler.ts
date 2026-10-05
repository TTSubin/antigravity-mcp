import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type {
  FrontendTask,
  ProjectConfig,
} from "../types.js";

const here = path.dirname(fileURLToPath(import.meta.url));

async function resolvePromptsDir(): Promise<string> {
  if (process.env.ANTIGRAVITY_MCP_PROMPTS_DIR) {
    return process.env.ANTIGRAVITY_MCP_PROMPTS_DIR;
  }

  const candidates = [
    path.resolve(process.cwd(), "prompts"),
    path.resolve(here, "../../prompts"),
    path.resolve(here, "../../../prompts"),
  ];

  for (const candidate of candidates) {
    try {
      await access(candidate);
      return candidate;
    } catch {
      // Try the next source/dist layout.
    }
  }

  throw new Error(
    "Prompt templates not found. Set ANTIGRAVITY_MCP_PROMPTS_DIR to the prompts directory.",
  );
}

function list(values: string[] | undefined, fallback = "None specified."): string {
  if (!values || values.length === 0) return fallback;
  return values.map((value) => `- ${value}`).join("\n");
}

function replaceAll(
  template: string,
  values: Record<string, string>,
): string {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replaceAll(`{{${key}}}`, value),
    template,
  );
}

async function loadTemplate(name: string): Promise<string> {
  const promptsDir = await resolvePromptsDir();
  return readFile(path.join(promptsDir, name), "utf8");
}

export async function compilePrompt(
  input: FrontendTask,
  project: ProjectConfig,
  skills: string[],
  inspectOnly = false,
): Promise<string> {
  const base = await loadTemplate("base.v1.md");

  const modeTemplate =
    inspectOnly || input.mode === "review"
      ? "inspect.v1.md"
      : input.mode === "redesign" || input.mode === "polish"
        ? "redesign.v1.md"
        : "create.v1.md";

  const taskTemplate = await loadTemplate(modeTemplate);

  const validationCommands = Object.entries(project.commands ?? {})
    .filter(([, command]) => Boolean(command))
    .map(([name, command]) => `- ${name}: ${command}`)
    .join("\n");

  const common = {
    PROJECT_NAME: input.project,
    FRONTEND_ROOTS: list(project.frontendRoots),
    BLOCKED_ROOTS: list(project.blockedRoots),
    VALIDATION_COMMANDS:
      validationCommands || "No project validation commands configured.",
    SKILLS: skills.map((skill) => `- ${skill}`).join("\n"),
  };

  const taskValues = {
    TASK: input.task,
    SCOPE: list(input.scope),
    CONSTRAINTS: list(input.constraints),
    ACCEPTANCE: list(input.acceptanceCriteria),
  };

  return `${replaceAll(base, common)}\n\n${replaceAll(taskTemplate, taskValues)}`.trim();
}
