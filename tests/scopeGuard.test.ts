import { describe, expect, it } from "vitest";
import { classifyScope } from "../src/security/scopeGuard.js";

const project = {
  path: "/tmp/project",
  frontendRoots: ["src"],
  blockedRoots: ["backend", "prisma"],
};

describe("classifyScope", () => {
  it("accepts clear frontend work", () => {
    expect(
      classifyScope(
        "Redesign the React dashboard and improve responsive layout",
        ["src/pages/dashboard"],
        project,
      ).kind,
    ).toBe("frontend");
  });

  it("hands backend work back", () => {
    expect(
      classifyScope(
        "Create a Spring Boot payment API endpoint",
        [],
        project,
      ).kind,
    ).toBe("backend");
  });

  it("hands mixed work back", () => {
    expect(
      classifyScope(
        "Build the React checkout page and create the API endpoint",
        [],
        project,
      ).kind,
    ).toBe("mixed");
  });

  it("accepts short frontend follow-ups", () => {
    expect(
      classifyScope("Make the button smaller on mobile").kind,
    ).toBe("frontend");
  });

  it("blocks explicitly blocked roots", () => {
    expect(
      classifyScope(
        "Update styling",
        ["backend/controllers"],
        project,
      ).kind,
    ).toBe("backend");
  });
});
