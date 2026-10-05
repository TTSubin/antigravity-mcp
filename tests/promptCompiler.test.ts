import { describe, expect, it } from "vitest";
import { compilePrompt } from "../src/prompts/compiler.js";

describe("compilePrompt", () => {
  it("injects frontend boundary and skills", async () => {
    const prompt = await compilePrompt(
      {
        project: "demo",
        task: "Build a responsive landing page",
        mode: "create",
        surface: "landing",
      },
      {
        path: "/tmp/demo",
        frontendRoots: ["src"],
        blockedRoots: ["backend"],
        commands: { build: "npm run build" },
      },
      ["design-taste-frontend"],
    );

    expect(prompt).toContain("Frontend work only");
    expect(prompt).toContain("design-taste-frontend");
    expect(prompt).toContain("Build a responsive landing page");
    expect(prompt).toContain("npm run build");
  });
});
