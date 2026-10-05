import type { AntigravityStructuredResult } from "../types.js";

function isValidationState(value: unknown): boolean {
  return (
    value === "passed" ||
    value === "failed" ||
    value === "not_run" ||
    value === "not_available"
  );
}

function isStructuredResult(
  value: unknown,
): value is AntigravityStructuredResult {
  if (!value || typeof value !== "object") return false;

  const result = value as Record<string, unknown>;
  const validation = result.validation as Record<string, unknown> | undefined;
  const backendDependency = result.backendDependency as
    | Record<string, unknown>
    | undefined;

  return (
    typeof result.summary === "string" &&
    Array.isArray(result.changedFiles) &&
    result.changedFiles.every((item) => typeof item === "string") &&
    Boolean(validation) &&
    isValidationState(validation?.build) &&
    isValidationState(validation?.lint) &&
    isValidationState(validation?.test) &&
    Array.isArray(result.warnings) &&
    result.warnings.every((item) => typeof item === "string") &&
    Array.isArray(result.unresolvedIssues) &&
    result.unresolvedIssues.every((item) => typeof item === "string") &&
    Boolean(backendDependency) &&
    typeof backendDependency?.required === "boolean" &&
    typeof backendDependency?.details === "string"
  );
}

function stripFence(text: string): string {
  const trimmed = text.trim();
  const match = trimmed.match(/^\`\`\`(?:json)?\s*([\s\S]*?)\s*\`\`\`$/i);
  return match?.[1]?.trim() ?? trimmed;
}

export function parseStructuredResponse(
  response: string | undefined,
): AntigravityStructuredResult | undefined {
  if (!response?.trim()) return undefined;

  const candidates = [stripFence(response)];

  const firstBrace = response.indexOf("{");
  const lastBrace = response.lastIndexOf("}");
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    candidates.push(response.slice(firstBrace, lastBrace + 1));
  }

  for (const candidate of candidates) {
    try {
      const parsed: unknown = JSON.parse(candidate);
      if (isStructuredResult(parsed)) return parsed;
    } catch {
      // Try the next extraction strategy.
    }
  }

  return undefined;
}
