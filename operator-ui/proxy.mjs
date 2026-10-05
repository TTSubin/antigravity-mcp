import http from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HOST = process.env.OPERATOR_UI_HOST ?? "127.0.0.1";
const PORT = Number(process.env.OPERATOR_UI_PORT ?? "8080");
const UPSTREAM = new URL(
  process.env.TUNNEL_OPERATOR_UPSTREAM ?? "http://127.0.0.1:8081",
);
const ROOT = path.dirname(fileURLToPath(import.meta.url));
const THEME_PATH = path.join(ROOT, "operator-theme.css");

const UI_HTML = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta http-equiv="Cache-Control" content="no-store" />
    <meta name="theme-color" content="#0b1020" />
    <title>Antigravity MCP — Tunnel Operator</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&family=Fira+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="/assets/styles.css" />
    <link rel="stylesheet" href="/assets/operator-theme.css" />
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/assets/app.js"></script>
  </body>
</html>`;

function proxyRequest(req, res) {
  const target = new URL(req.url ?? "/", UPSTREAM);
  const headers = { ...req.headers, host: UPSTREAM.host };
  delete headers["content-length"];

  const upstreamReq = http.request(
    {
      protocol: UPSTREAM.protocol,
      hostname: UPSTREAM.hostname,
      port: UPSTREAM.port,
      method: req.method,
      path: `${target.pathname}${target.search}`,
      headers,
    },
    (upstreamRes) => {
      res.writeHead(upstreamRes.statusCode ?? 502, upstreamRes.headers);
      upstreamRes.pipe(res);
    },
  );

  upstreamReq.on("error", (error) => {
    if (res.headersSent) {
      res.destroy(error);
      return;
    }

    res.writeHead(502, {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    });
    res.end(
      JSON.stringify({
        error: "tunnel_operator_unavailable",
        details: error.message,
        upstream: UPSTREAM.origin,
      }),
    );
  });

  req.pipe(upstreamReq);
}

const server = http.createServer(async (req, res) => {
  const requestUrl = new URL(req.url ?? "/", `http://${req.headers.host ?? HOST}`);

  if (requestUrl.pathname === "/") {
    res.writeHead(302, { location: "/ui" });
    res.end();
    return;
  }

  if (requestUrl.pathname === "/ui" || requestUrl.pathname === "/ui/") {
    res.writeHead(200, {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
    });
    res.end(UI_HTML);
    return;
  }

  if (requestUrl.pathname === "/assets/operator-theme.css") {
    try {
      const css = await readFile(THEME_PATH, "utf8");
      res.writeHead(200, {
        "content-type": "text/css; charset=utf-8",
        "cache-control": "no-store",
      });
      res.end(css);
    } catch (error) {
      res.writeHead(500, {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-store",
      });
      res.end(`Failed to load operator theme: ${String(error)}`);
    }
    return;
  }

  proxyRequest(req, res);
});

server.listen(PORT, HOST, () => {
  console.log(
    `Custom Tunnel Operator UI: http://${HOST}:${PORT}/ui -> ${UPSTREAM.origin}`,
  );
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    server.close(() => process.exit(0));
  });
}
