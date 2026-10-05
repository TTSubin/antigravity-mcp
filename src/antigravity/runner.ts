import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";
import type {
  AntigravityEnvelope,
  Effort,
} from "../types.js";

export interface RunOptions {
  cwd: string;
  prompt: string;
  conversationId?: string;
  effort?: Effort;
  model?: string;
  timeoutMinutes?: number;
  mode?: "accept-edits" | "plan";
}

export interface RunResult {
  envelope: AntigravityEnvelope;
  stderr: string;
  exitCode: number | null;
}

function clampTimeout(value: number | undefined): number {
  if (!value || Number.isNaN(value)) return 15;
  return Math.max(1, Math.min(60, Math.trunc(value)));
}

export function resolveAntigravityExecutable(): string {
  if (process.env.ANTIGRAVITY_CLI) {
    return process.env.ANTIGRAVITY_CLI;
  }

  const candidates =
    process.platform === "win32"
      ? [
          path.join(
            process.env.LOCALAPPDATA ??
              path.join(homedir(), "AppData", "Local"),
            "agy",
            "bin",
            "agy.exe",
          ),
          path.join(
            "C:",
            "Program Files",
            "Google",
            "antigravity-cli",
            "agy.exe",
          ),
        ]
      : [path.join(homedir(), ".local", "bin", "agy")];

  return candidates.find((candidate) => existsSync(candidate)) ?? "agy";
}

export async function runAntigravity(
  options: RunOptions,
): Promise<RunResult> {
  const executable = resolveAntigravityExecutable();
  const minutes = clampTimeout(options.timeoutMinutes);

  const model =
    options.model ??
    process.env.ANTIGRAVITY_MCP_MODEL ??
    "gemini-3.8-flash-high";

  const args = [
    "-p",
    options.prompt,
    "--output-format",
    "json",
    "--print-timeout",
    `${minutes}m`,
    "--mode",
    options.mode ?? "accept-edits",
    "--model",
    model,
  ];

  const dangerouslySkipPermissions = /^(?:1|true|yes|on)$/i.test(
    process.env.ANTIGRAVITY_MCP_DANGEROUS_SKIP_PERMISSIONS ?? "",
  );

  if (dangerouslySkipPermissions) {
    args.unshift("--dangerously-skip-permissions");
  }

  const modelEncodesEffort = /-(?:low|medium|high)$/.test(model);
  if (!modelEncodesEffort && options.effort) {
    args.push("--effort", options.effort);
  }

  if (options.conversationId) {
    args.push("--conversation", options.conversationId);
  }

  return new Promise((resolve, reject) => {
    const child = spawn(executable, args, {
      cwd: options.cwd,
      shell: false,
      windowsHide: true,
      env: process.env,
    });

    let stdout = "";
    let stderr = "";

    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");

    child.stdout.on("data", (chunk: string) => {
      stdout += chunk;
    });
    child.stderr.on("data", (chunk: string) => {
      stderr += chunk;
    });

    child.on("error", (error) => {
      reject(
        new Error(
          `Failed to start Antigravity CLI "${executable}". Is it installed and on PATH?`,
          { cause: error },
        ),
      );
    });

    child.on("close", (exitCode) => {
      try {
        const envelope = JSON.parse(stdout.trim()) as AntigravityEnvelope;
        resolve({ envelope, stderr: stderr.trim(), exitCode });
      } catch (error) {
        reject(
          new Error(
            `Antigravity returned non-JSON output. exitCode=${String(exitCode)} stderr=${stderr.trim()} stdout=${stdout.trim().slice(0, 2000)}`,
            { cause: error },
          ),
        );
      }
    });
  });
}
