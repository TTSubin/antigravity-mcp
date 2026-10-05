import { describe, expect, it } from "vitest";
import { parseStructuredResponse } from "../src/antigravity/parser.js";

const payload = {
  summary: "Reviewed settings UI",
  changedFiles: [],
  validation: {
    build: "not_run",
    lint: "not_run",
    test: "not_run",
  },
  warnings: [],
  unresolvedIssues: [],
  backendDependency: {
    required: false,
    details: "",
  },
};

describe("parseStructuredResponse", () => {
  it("parses a strict JSON response", () => {
    expect(parseStructuredResponse(JSON.stringify(payload))).toEqual(payload);
  });

  it("parses a fenced JSON response defensively", () => {
    const response = `\`\`\`json\n${JSON.stringify(payload)}\n\`\`\``;
    expect(parseStructuredResponse(response)).toEqual(payload);
  });

  it("rejects an incomplete result", () => {
    expect(parseStructuredResponse('{"summary":"only"}')).toBeUndefined();
  });
});
