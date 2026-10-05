# antigravity-mcp

A frontend-focused Model Context Protocol (MCP) server for delegating UI work to Google Antigravity CLI while keeping backend, infrastructure, and mixed-scope work outside the frontend agent.

> **Status:** early-stage / experimental. The project is usable for local development, but interfaces and defaults may change while the MCP workflow is refined.

> **Unofficial project:** `antigravity-mcp` is an independent community project. It is not affiliated with, endorsed by, or sponsored by Google. Google, Gemini, and Antigravity are trademarks or product names of their respective owners.

## Why

General-purpose coding agents are good at many things, but frontend work often benefits from a dedicated execution path with explicit UI constraints, design skills, and scope boundaries.

`antigravity-mcp` provides that boundary:

- frontend work is routed to Antigravity CLI;
- backend, database, infrastructure, and mixed-scope work is rejected with a structured handoff;
- projects are registered by alias instead of exposing arbitrary filesystem paths;
- frontend Agent Skills can be required before execution;
- inspect mode is read-only;
- permission bypasses are opt-in rather than enabled by default.

## Architecture

```text
MCP-compatible orchestrator / chat client
│
├─ Frontend task
│    └─> antigravity-mcp
│          └─> Google Antigravity CLI
│                └─> frontend workspace
│
└─ Backend / mixed / unclear task
     └─> handoff_required
           └─> Codex CLI / Claude Code / Gemini CLI / Aider / other coding agent
```

The MCP does not directly delegate backend work to another agent. It returns a structured handoff to the caller, which can decide what should handle the task next.

## Features

- Frontend-only scope guard
- Project aliases with explicit frontend and blocked roots
- UI creation, redesign, responsive fixes, polish, and review modes
- Read-only inspection through `antigravity_inspect`
- Conversation continuation through `antigravity_continue`
- Agent Skill discovery and validation
- Structured Antigravity JSON parsing
- Configurable model and timeout settings
- Optional OpenAI Secure MCP Tunnel helpers on Windows
- Local dashboard and custom tunnel operator UI
- Safe-by-default Antigravity permission handling

## Scope

### Supported

Typical supported work includes:

- React, Next.js, Vue, Svelte, and static frontend UI
- layouts and components
- CSS and design systems
- responsive behavior
- accessibility
- visual redesigns
- loading, empty, error, hover, and focus states
- frontend review and inspection

### Returned to the orchestrator

The MCP intentionally does not own:

- backend APIs
- databases and migrations
- authentication servers
- queues and workers
- webhooks
- Docker, nginx, Kubernetes, or cloud infrastructure
- server-side business logic
- mixed frontend/backend tasks

Those requests return `handoff_required` instead of being executed.

## Requirements

- Node.js 20+
- npm
- Google Antigravity CLI installed and authenticated

Install Antigravity CLI:

### Windows PowerShell

```powershell
irm https://antigravity.google/cli/install.ps1 | iex
```

### macOS / Linux

```bash
curl -fsSL https://antigravity.google/cli/install.sh | bash
```

Run `agy` once after installation and complete authentication.

## Authentication

Authentication is handled by the **official Google Antigravity CLI**, not by `antigravity-mcp`.

This MCP does not implement Google sign-in, request Google OAuth scopes, collect authorization codes, or store Google access/refresh tokens. It launches the locally installed `agy` process and uses whatever authentication state the official CLI has already established.

### Personal Google account (Google OAuth)

Start Antigravity CLI:

```bash
agy
```

Choose **Google OAuth** when prompted. The official CLI opens Google's authentication flow in your browser. Complete sign-in there, then return to the CLI.

Once Antigravity CLI is authenticated, `antigravity-mcp` can invoke it without handling your Google credentials itself.

### Google Cloud / Enterprise

For organization or enterprise environments, choose **Use a Google Cloud project** in Antigravity CLI and follow Google's Cloud OAuth setup.

Depending on your Google Cloud environment, you may need to provide a project ID, region, and the appropriate Agent Platform / enterprise configuration. Authentication and data handling remain governed by the Google Cloud services and terms associated with that project.

### Gemini API key

Some official Google Antigravity / Google AI workflows also use a Google AI Studio API key through the `GEMINI_API_KEY` environment variable.

macOS / Linux:

```bash
export GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
```

Windows PowerShell:

```powershell
$env:GEMINI_API_KEY = "YOUR_GEMINI_API_KEY"
```

`antigravity-mcp` does not read, validate, transmit, or persist this key itself. If your official Antigravity/Google AI setup uses it, the variable is simply inherited by the spawned `agy` process through the local environment.

Never commit API keys, OAuth tokens, Google Cloud credentials, or other secrets to this repository.

## Quick start

Clone the repository:

```bash
git clone https://github.com/TTSubin/antigravity-mcp.git
cd antigravity-mcp
```

Install dependencies and verify the project:

```bash
npm install
npm run typecheck
npm test
npm run build
```

Start the MCP server:

```bash
npm start
```

For development:

```bash
npm run dev
```

## Configure projects

Projects are exposed to the MCP by alias. Arbitrary filesystem paths are not accepted from tool callers.

Create:

```text
~/.antigravity-mcp/projects.json
```

or set:

```bash
ANTIGRAVITY_MCP_PROJECTS_FILE=/absolute/path/projects.json
```

Example:

```json
{
  "projects": {
    "frontend-app": {
      "path": "~/Projects/frontend-app",
      "frontendRoots": ["src", "app", "components", "public"],
      "blockedRoots": ["server", "backend", "prisma", "migrations", "infra"],
      "defaultSurface": "product-ui",
      "commands": {
        "build": "npm run build",
        "lint": "npm run lint"
      }
    }
  }
}
```

A starter file is available at:

```text
config/projects.example.json
```

## Agent Skills

The MCP can require frontend Agent Skills before executing a task. Antigravity discovers workspace skills from:

```text
.agents/skills/
```

### UI/UX Pro Max

Install with:

```bash
npx --yes ui-ux-pro-max-cli@latest init --ai antigravity
```

Upstream project:

```text
nextlevelbuilder/ui-ux-pro-max-skill
```

### Optional Taste skills

For landing pages and portfolios:

```bash
npx skills add https://github.com/Leonxlnx/taste-skill \
  --skill "design-taste-frontend"
```

For redesigning existing projects:

```bash
npx skills add https://github.com/Leonxlnx/taste-skill \
  --skill "redesign-existing-projects"
```

## MCP tools

### `antigravity_execute`

Runs a new frontend implementation task.

Example:

```json
{
  "project": "frontend-app",
  "task": "Redesign the settings screen while preserving existing behavior",
  "mode": "redesign",
  "surface": "settings",
  "scope": ["src/pages/settings"],
  "constraints": ["Do not add a new UI framework"],
  "acceptanceCriteria": [
    "Responsive on desktop and tablet",
    "Keyboard focus states remain visible"
  ],
  "effort": "high"
}
```

### `antigravity_inspect`

Runs a frontend-only read-only inspection.

Use this for audits, reviews, design-system analysis, or checking an existing frontend without changing files.

### `antigravity_continue`

Continues an existing Antigravity conversation using a previously returned `conversationId`.

## Handoff behavior

Backend example:

```json
{
  "status": "handoff_required",
  "handled": false,
  "reason": "backend_task",
  "returnTo": "orchestrator",
  "originalTask": "Create a payment API"
}
```

Mixed-scope example:

```json
{
  "status": "handoff_required",
  "handled": false,
  "reason": "mixed_scope",
  "returnTo": "orchestrator"
}
```

The calling orchestrator can then re-route the task to another coding tool or agent.

## Missing skill behavior

If a required frontend skill is unavailable, the MCP refuses to silently improvise and returns setup information instead.

Example:

```json
{
  "status": "setup_required",
  "handled": false,
  "reason": "missing_agent_skills",
  "missingSkills": ["ui-ux-pro-max"]
}
```

## Antigravity execution

The runner uses Antigravity's JSON output mode:

```bash
agy -p "<compiled prompt>" \
  --output-format json \
  --mode accept-edits \
  --model gemini-3.8-flash-high
```

The MCP parses and validates the returned envelope before exposing the result to the caller.

### Environment variables

| Variable | Purpose |
| --- | --- |
| `ANTIGRAVITY_CLI` | Override the Antigravity executable path |
| `ANTIGRAVITY_MCP_MODEL` | Override the default Antigravity model |
| `ANTIGRAVITY_MCP_PROJECTS_FILE` | Override the project registry path |
| `ANTIGRAVITY_MCP_PROMPTS_DIR` | Override the prompt template directory |
| `ANTIGRAVITY_MCP_DANGEROUS_SKIP_PERMISSIONS` | Opt in to Antigravity permission auto-approval |
| `GEMINI_API_KEY` | Optional Google AI Studio credential used only when your official Antigravity/Google AI setup requires it; this MCP does not consume it directly |

`ANTIGRAVITY_MCP_DANGEROUS_SKIP_PERMISSIONS` is disabled by default. Only enable it in a trusted local development workspace.

## Prompt templates

Versioned prompt templates live in:

```text
prompts/
├── base.v1.md
├── create.v1.md
├── redesign.v1.md
└── inspect.v1.md
```

The prompts define execution contracts and scope boundaries while frontend design knowledge remains in Agent Skills.

## OpenAI Secure MCP Tunnel

Windows helper scripts are included for exposing the local MCP through OpenAI Secure MCP Tunnel.

Available commands:

```powershell
npm run tunnel:setup
npm run tunnel:doctor
npm run tunnel:run
```

Create a local environment file from:

```text
scripts/tunnel-env.example.ps1
```

to:

```text
scripts/tunnel-env.local.ps1
```

The local file is ignored by Git.

Example:

```powershell
$env:CONTROL_PLANE_TUNNEL_ID = "tunnel_REPLACE_ME"
$env:CONTROL_PLANE_API_KEY = "YOUR_RUNTIME_API_KEY"
```

When started through `npm run tunnel:run`:

- the tunnel-client admin backend listens on `127.0.0.1:8081`;
- the custom local operator UI is available at `http://127.0.0.1:8080/ui`.

Do not commit tunnel credentials or runtime API keys.

## Dashboard

The repository includes a lightweight developer dashboard for inspecting the frontend routing model, sample executions, Agent Skills, project configuration, and diagnostics.

The dashboard is intentionally zero-dependency and is separate from the MCP stdio server.

## Development

Useful commands:

```bash
npm run dev
npm run check
npm run typecheck
npm test
npm run build
```

Run the MCP Inspector:

```bash
npx @modelcontextprotocol/inspector npm run dev
```

## Project structure

```text
.
├── config/          # project registry example
├── dashboard/       # dashboard entry point
├── operator-ui/     # tunnel operator UI wrapper/theme
├── prompts/         # versioned prompt templates
├── public/          # dashboard assets
├── scripts/         # tunnel helpers
├── src/
│   ├── antigravity/ # CLI runner, parser, response schema
│   ├── config/      # project registry loading
│   ├── prompts/     # prompt compiler
│   ├── security/    # frontend scope guard
│   ├── skills/      # Agent Skill discovery/routing
│   └── tools/       # MCP tool implementations
└── tests/
```

## Security

The project is intentionally conservative about execution boundaries:

- tool callers select registered project aliases rather than arbitrary paths;
- backend, infrastructure, mixed, and unclear work is rejected;
- Antigravity is launched with `spawn(..., { shell: false })`;
- user task text is not interpolated into a shell command;
- inspect mode is read-only;
- permission auto-approval is disabled by default;
- Google authentication is performed by the official Antigravity CLI, not by this MCP;
- the MCP does not request, collect, or persist Google OAuth tokens;
- local credentials and runtime configuration are excluded through `.gitignore`.

Prompt-based boundaries are not a substitute for operating-system or tool-level sandboxing. For stronger isolation, configure Antigravity permission rules and run the MCP with the minimum filesystem access it needs.

## Contributing

Issues and pull requests are welcome.

Before submitting a change:

```bash
npm run typecheck
npm test
npm run build
```

Please keep changes consistent with the frontend-only boundary. Features that require backend execution should remain outside this MCP or return control to the orchestrator.

## Acknowledgements

This project can integrate with community frontend Agent Skills, including:

- `nextlevelbuilder/ui-ux-pro-max-skill`
- `Leonxlnx/taste-skill`

Those projects are maintained independently and retain their own licenses and terms.

## License

Licensed under the [MIT License](LICENSE).

You are free to use, copy, modify, fork, and redistribute this project under the terms of the license. Contributions to the upstream repository are accepted through pull requests and remain subject to maintainer review.
