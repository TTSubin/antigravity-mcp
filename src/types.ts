export type FrontendMode =
  | "create"
  | "redesign"
  | "fix-ui"
  | "responsive"
  | "polish"
  | "review";

export type FrontendSurface =
  | "landing"
  | "portfolio"
  | "dashboard"
  | "settings"
  | "form"
  | "product-ui"
  | "general";

export type Effort = "low" | "medium" | "high";

export interface ProjectConfig {
  path: string;
  frontendRoots: string[];
  blockedRoots?: string[];
  defaultSurface?: FrontendSurface;
  commands?: {
    build?: string;
    lint?: string;
    test?: string;
  };
}

export interface ProjectRegistry {
  projects: Record<string, ProjectConfig>;
}

export interface FrontendTask {
  project: string;
  task: string;
  mode: FrontendMode;
  surface?: FrontendSurface;
  scope?: string[];
  constraints?: string[];
  acceptanceCriteria?: string[];
  skills?: string[];
  effort?: Effort;
  model?: string;
  timeoutMinutes?: number;
}

export interface ScopeDecision {
  kind: "frontend" | "backend" | "mixed" | "unclear";
  reason: string;
}

export interface AntigravityStructuredResult {
  summary: string;
  changedFiles: string[];
  validation: {
    build: "passed" | "failed" | "not_run" | "not_available";
    lint: "passed" | "failed" | "not_run" | "not_available";
    test: "passed" | "failed" | "not_run" | "not_available";
  };
  warnings: string[];
  unresolvedIssues: string[];
  backendDependency: {
    required: boolean;
    details: string;
  };
}

export interface AntigravityEnvelope {
  conversation_id?: string;
  status?: string;
  response?: string;
  structured_output?: AntigravityStructuredResult;
  duration_seconds?: number;
  num_turns?: number;
  usage?: Record<string, number>;
}
