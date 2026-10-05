import { describe, expect, it } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { evaluateScope } from "../public/js/dashboard.js";

describe("Frontend Dashboard UI & Components", () => {
  const publicIndexPath = path.resolve(__dirname, "../public/index.html");
  const publicCssPath = path.resolve(__dirname, "../public/css/dashboard.css");
  const publicJsPath = path.resolve(__dirname, "../public/js/dashboard.js");
  const dashboardIndexPath = path.resolve(__dirname, "../dashboard/index.html");

  it("ensures public and dashboard entrypoints exist", () => {
    expect(existsSync(publicIndexPath)).toBe(true);
    expect(existsSync(publicCssPath)).toBe(true);
    expect(existsSync(publicJsPath)).toBe(true);
    expect(existsSync(dashboardIndexPath)).toBe(true);
  });

  it("validates semantic HTML landmarks and accessibility attributes in public/index.html", () => {
    const html = readFileSync(publicIndexPath, "utf8");

    // Semantic landmarks
    expect(html).toMatch(/<header[^>]*role="banner"/i);
    expect(html).toMatch(/<nav[^>]*aria-label=/i);
    expect(html).toMatch(/<main[^>]*id="main-content"[^>]*role="main"/i);
    expect(html).toMatch(/<footer[^>]*role="contentinfo"/i);

    // Skip navigation link for keyboard users
    expect(html).toMatch(/<a[^>]+href="#main-content"[^>]*class="skip-link"/i);

    // Viewport and language attributes
    expect(html).toMatch(/<html[^>]+lang="en"/i);
    expect(html).toMatch(/<meta[^>]+name="viewport"[^>]+content="[^"]*width=device-width/i);

    // Tab navigation accessibility attributes
    expect(html).toMatch(/role="tablist"/i);
    expect(html).toMatch(/role="tab"/i);
    expect(html).toMatch(/role="tabpanel"/i);
    expect(html).toMatch(/aria-selected="true"/i);
    expect(html).toMatch(/aria-controls="tabpanel-overview"/i);
  });

  it("validates ui-ux-pro-max design tokens and responsive CSS rules", () => {
    const css = readFileSync(publicCssPath, "utf8");

    // UI Pro Max color tokens
    expect(css).toContain("--color-background: #0f172a;");
    expect(css).toContain("--color-surface: #1e293b;");
    expect(css).toContain("--color-accent: #22c55e;");
    expect(css).toContain("--color-ring: #38bdf8;");

    // Typography & Spacing scale
    expect(css).toContain("--font-sans:");
    expect(css).toContain("--font-mono:");
    expect(css).toContain("--space-4: 16px;");

    // Visible focus states
    expect(css).toMatch(/:focus-visible/);

    // Responsive media queries
    expect(css).toMatch(/@media\s*\(\s*max-width:\s*768px\s*\)/);
    expect(css).toMatch(/@media\s*\(\s*max-width:\s*1024px\s*\)/);

    // Reduced motion accessibility
    expect(css).toMatch(/@media\s*\(\s*prefers-reduced-motion:\s*reduce\s*\)/);
  });

  it("validates frontend scope guard logic in dashboard.js", () => {
    // 1. Valid Frontend Task
    const frontendRes = evaluateScope("Redesign the navigation bar and improve dark mode contrast on the dashboard");
    expect(frontendRes.kind).toBe("frontend");
    expect(frontendRes.status).toBe("executable");
    expect(frontendRes.matchesFrontend.length).toBeGreaterThan(0);

    // 2. Prohibited Backend Task
    const backendRes = evaluateScope("Create a Spring Boot payment API and run database migrations");
    expect(backendRes.kind).toBe("backend");
    expect(backendRes.status).toBe("handoff_required");
    expect(backendRes.handoffPayload?.reason).toBe("backend_task");

    // 3. Mixed Scope Task
    const mixedRes = evaluateScope("Build the React checkout UI and create the Stripe payment webhook endpoint");
    expect(mixedRes.kind).toBe("mixed");
    expect(mixedRes.status).toBe("handoff_required");
    expect(mixedRes.handoffPayload?.reason).toBe("mixed_scope");
  });
});
