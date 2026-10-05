import { describe, expect, it } from "vitest";
import { routeSkills } from "../src/skills/router.js";

describe("routeSkills", () => {
  it("uses ui-ux-pro-max plus taste v2 for landing pages", () => {
    expect(routeSkills("create", "landing").skills).toEqual([
      "ui-ux-pro-max",
      "design-taste-frontend",
    ]);
  });

  it("uses ui-ux-pro-max plus dashboard-compatible taste v1 for product UI", () => {
    expect(routeSkills("create", "dashboard").skills).toEqual([
      "ui-ux-pro-max",
      "design-taste-frontend-v1",
    ]);
  });

  it("combines ui-ux-pro-max, audit, and design skills for redesigns", () => {
    expect(routeSkills("redesign", "landing").skills).toEqual([
      "ui-ux-pro-max",
      "redesign-existing-projects",
      "design-taste-frontend",
    ]);
  });

  it("uses the official ui-ux-pro-max Antigravity installer", () => {
    expect(
      routeSkills("create", "landing", ["ui-ux-pro-max"]).installCommands[
        "ui-ux-pro-max"
      ],
    ).toBe("npx --yes ui-ux-pro-max-cli@latest init --ai antigravity");
  });

  it("respects explicit skills", () => {
    expect(
      routeSkills("create", "landing", ["minimalist-ui"]).skills,
    ).toEqual(["minimalist-ui"]);
  });
});
