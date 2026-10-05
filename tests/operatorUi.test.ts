import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

function read(relativePath: string): string {
  return readFileSync(path.join(root, relativePath), "utf8");
}

describe("custom tunnel operator UI", () => {
  it("serves the upstream app with a local theme override", () => {
    const proxy = read("operator-ui/proxy.mjs");

    expect(proxy).toContain('href="/assets/styles.css"');
    expect(proxy).toContain('href="/assets/operator-theme.css"');
    expect(proxy).toContain('src="/assets/app.js"');
    expect(proxy).toContain('http://127.0.0.1:8081');
    expect(proxy).toContain("proxyRequest(req, res)");
  });

  it("keeps the wrapper loopback-only by default", () => {
    const proxy = read("operator-ui/proxy.mjs");

    expect(proxy).toContain('OPERATOR_UI_HOST ?? "127.0.0.1"');
    expect(proxy).toContain('OPERATOR_UI_PORT ?? "8080"');
  });

  it("starts tunnel-client on 8081 and exposes the custom UI on 8080", () => {
    const runScript = read("scripts/tunnel-run.ps1");

    expect(runScript).toContain('--health.listen-addr "127.0.0.1:8081"');
    expect(runScript).toContain('"http://127.0.0.1:8081"');
    expect(runScript).toContain("operator-ui\\proxy.mjs");
    expect(runScript).toContain("http://127.0.0.1:8080/ui");
  });

  it("contains responsive and accessible theme overrides", () => {
    const theme = read("operator-ui/operator-theme.css");

    expect(theme).toContain(":focus-visible");
    expect(theme).toContain("@media (max-width: 900px)");
    expect(theme).toContain("@media (prefers-reduced-motion: reduce)");
    expect(theme).toContain("@media (forced-colors: active)");
    expect(theme).toContain(".tabs");
    expect(theme).toContain(".logs");
  });
});
