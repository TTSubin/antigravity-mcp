export const ANTIGRAVITY_RESULT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    summary: { type: "string" },
    changedFiles: {
      type: "array",
      items: { type: "string" },
    },
    validation: {
      type: "object",
      additionalProperties: false,
      properties: {
        build: {
          type: "string",
          enum: ["passed", "failed", "not_run", "not_available"],
        },
        lint: {
          type: "string",
          enum: ["passed", "failed", "not_run", "not_available"],
        },
        test: {
          type: "string",
          enum: ["passed", "failed", "not_run", "not_available"],
        },
      },
      required: ["build", "lint", "test"],
    },
    warnings: {
      type: "array",
      items: { type: "string" },
    },
    unresolvedIssues: {
      type: "array",
      items: { type: "string" },
    },
    backendDependency: {
      type: "object",
      additionalProperties: false,
      properties: {
        required: { type: "boolean" },
        details: { type: "string" },
      },
      required: ["required", "details"],
    },
  },
  required: [
    "summary",
    "changedFiles",
    "validation",
    "warnings",
    "unresolvedIssues",
    "backendDependency"
  ],
} as const;
