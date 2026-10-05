export interface ScopeEvaluationResult {
  kind: "frontend" | "backend" | "mixed" | "unclear";
  status: "executable" | "handoff_required" | "unclear";
  reason: string;
  matchesFrontend: string[];
  matchesBackend: string[];
  handoffPayload?: {
    status: string;
    handled: boolean;
    reason: string;
    returnTo: string;
    task: string;
  };
}

export function evaluateScope(taskText: string): ScopeEvaluationResult;
export function switchTab(tabId: string): void;
export function showToast(message: string, type?: string): void;
export function initDashboard(): void;
