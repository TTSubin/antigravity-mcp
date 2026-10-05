import { readdir, readFile } from "node:fs/promises";
import { homedir } from "node:os";
import path from "node:path";

const FRONTMATTER_NAME = /^name:\s*["']?([^"'\r\n]+)["']?\s*$/m;

async function collectMarkdownFiles(
  dir: string,
  depth = 0,
): Promise<string[]> {
  if (depth > 3) return [];

  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }

  const files: string[] = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectMarkdownFiles(full, depth + 1)));
    } else if (
      entry.isFile() &&
      (entry.name === "SKILL.md" || (depth === 0 && entry.name.endsWith(".md")))
    ) {
      files.push(full);
    }
  }

  return files;
}

export async function discoverWorkspaceSkills(
  projectPath: string,
): Promise<Set<string>> {
  const roots = [
    path.join(projectPath, ".agents", "skills"),
    path.join(projectPath, ".agent", "skills"),
    path.join(homedir(), ".gemini", "antigravity-cli", "skills"),
  ];

  const names = new Set<string>();

  for (const root of roots) {
    const files = await collectMarkdownFiles(root);
    for (const file of files) {
      try {
        const content = await readFile(file, "utf8");
        const match = content.match(FRONTMATTER_NAME);
        if (match?.[1]) names.add(match[1].trim());
      } catch {
        // Ignore unreadable skill files; missing-skill handling exposes them.
      }
    }
  }

  return names;
}
