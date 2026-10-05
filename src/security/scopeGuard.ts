import path from "node:path";
import type { ProjectConfig, ScopeDecision } from "../types.js";

const BACKEND_SIGNALS = [
  /\bspring\s*boot\b/i,
  /\bnest(?:js)?\b/i,
  /\bexpress(?:\.js)?\b/i,
  /\bfastify\b/i,
  /\bcontroller\b/i,
  /\brepository\b/i,
  /\bdatabase\b/i,
  /\bmigration\b/i,
  /\bprisma\b/i,
  /\btypeorm\b/i,
  /\bsequelize\b/i,
  /\bsql\b/i,
  /\bapi\s+(?:endpoint|route|handler)\b/i,
  /\bwebhook\b/i,
  /\bmessage\s+queue\b/i,
  /\bredis\b/i,
  /\bdocker(?:file)?\b/i,
  /\bnginx\b/i,
  /\bserver-side\b/i,
  /\bbackend\b/i,
  /cơ sở dữ liệu/i,
  /máy chủ/i,
];

const FRONTEND_SIGNALS = [
  /\bfrontend\b/i,
  /\bui\b/i,
  /\bux\b/i,
  /\breact\b/i,
  /\bnext(?:\.js)?\b/i,
  /\bvue\b/i,
  /\bsvelte\b/i,
  /\bcomponent\b/i,
  /\bpage\b/i,
  /\blayout\b/i,
  /\bcss\b/i,
  /\btailwind\b/i,
  /\bresponsive\b/i,
  /\banimation\b/i,
  /\blanding\b/i,
  /\bportfolio\b/i,
  /\bdashboard\b/i,
  /\bsettings\b/i,
  /\bform\b/i,
  /\bdesign\b/i,
  /\bbutton\b/i,
  /\bmodal\b/i,
  /\bnavbar\b/i,
  /\bsidebar\b/i,
  /\btypography\b/i,
  /\bspacing\b/i,
  /\boverflow\b/i,
  /\bhover\b/i,
  /\bmobile\b/i,
  /\bdesktop\b/i,
  /giao diện/i,
  /\btrang\b/i,
  /\bnút\b/i,
];

function containsAny(text: string, patterns: RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(text));
}

function normalize(value: string): string {
  return value.replaceAll("\\", "/").replace(/^\.?\//, "").toLowerCase();
}

function scopeTouchesBlockedRoot(
  scope: string[],
  project: ProjectConfig,
): string | undefined {
  const blocked = (project.blockedRoots ?? []).map(normalize);

  for (const requested of scope) {
    const normalized = normalize(path.posix.normalize(normalize(requested)));
    const hit = blocked.find(
      (root) => normalized === root || normalized.startsWith(`${root}/`),
    );
    if (hit) return requested;
  }

  return undefined;
}

export function classifyScope(
  task: string,
  scope: string[] = [],
  project?: ProjectConfig,
): ScopeDecision {
  if (project) {
    const blockedPath = scopeTouchesBlockedRoot(scope, project);
    if (blockedPath) {
      return {
        kind: "backend",
        reason: `Requested scope "${blockedPath}" is inside a blocked project root.`,
      };
    }
  }

  const combined = [task, ...scope].join("\n");
  const hasBackend = containsAny(combined, BACKEND_SIGNALS);
  const hasFrontend = containsAny(combined, FRONTEND_SIGNALS);

  if (hasBackend && hasFrontend) {
    return {
      kind: "mixed",
      reason: "The request contains both frontend and backend/infrastructure signals.",
    };
  }

  if (hasBackend) {
    return {
      kind: "backend",
      reason: "The request appears to be backend, database, API, or infrastructure work.",
    };
  }

  if (hasFrontend) {
    return {
      kind: "frontend",
      reason: "The request contains frontend/UI signals.",
    };
  }

  return {
    kind: "unclear",
    reason: "The request does not clearly identify frontend work.",
  };
}
