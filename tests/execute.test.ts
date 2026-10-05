import { describe, expect, it } from "vitest";
import { executeFrontendTask } from "../src/tools/execute.js";

describe("executeFrontendTask handoff", () => {
  it("returns backend work to the orchestrator before project lookup", async () => {
    const result = await executeFrontendTask({
      project: "not-configured",
      task: "Create a Spring Boot payment API endpoint",
      mode: "create",
    });

    expect(result).toMatchObject({
      status: "handoff_required",
      handled: false,
      reason: "backend_task",
      returnTo: "orchestrator",
      project: "not-configured",
    });
  });

  it("returns mixed work to the orchestrator", async () => {
    const result = await executeFrontendTask({
      project: "not-configured",
      task: "Build the React checkout UI and create the payment API endpoint",
      mode: "create",
    });

    expect(result).toMatchObject({
      status: "handoff_required",
      handled: false,
      reason: "mixed_scope",
      returnTo: "orchestrator",
    });
  });
});
