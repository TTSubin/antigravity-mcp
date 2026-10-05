import { access, readFile, realpath } from "node:fs/promises";
import { homedir } from "node:os";
import path from "node:path";
import type { ProjectConfig, ProjectRegistry } from "../types.js";

export function resolveRegistryPath(): string {
  return (
    process.env.ANTIGRAVITY_MCP_PROJECTS_FILE ??
    path.join(homedir(), ".antigravity-mcp", "projects.json")
  );
}

export async function loadProject(projectName: string): Promise<ProjectConfig> {
  const registryPath = resolveRegistryPath();

  let raw: string;
  try {
    raw = await readFile(registryPath, "utf8");
  } catch (error) {
    throw new Error(
      `Project registry not found at ${registryPath}. Copy config/projects.example.json to that path or set ANTIGRAVITY_MCP_PROJECTS_FILE.`,
      { cause: error },
    );
  }

  const registry = JSON.parse(raw.replace(/^\uFEFF/, "")) as ProjectRegistry;
  const project = registry.projects?.[projectName];

  if (!project) {
    throw new Error(
      `Unknown project "${projectName}". Add it to ${registryPath}.`,
    );
  }

  await access(project.path);
  const canonicalPath = await realpath(project.path);

  return {
    ...project,
    path: canonicalPath,
    frontendRoots: project.frontendRoots ?? [],
    blockedRoots: project.blockedRoots ?? [],
  };
}
