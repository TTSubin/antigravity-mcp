# antigravity-mcp

A **frontend-only** MCP bridge that lets an orchestrator such as ChatGPT delegate UI implementation to Google Antigravity CLI while keeping backend work outside this agent.

## Architecture

```text
ChatGPT (orchestrator)
├─ Frontend task ──> antigravity-mcp ──> Antigravity CLI ──> frontend code
└─ Backend task  ──> ChatCode

If antigravity-mcp receives backend, mixed, or unclear work, it returns
`handoff_required` to the orchestrator instead of delegating to another agent.
```

Agents do not delegate directly to other agents. They return control to the orchestrator.

## What this MCP owns

- UI/UX implementation
- React/Next/Vue/Svelte frontend changes
- layouts, components, styling and responsive work
- visual redesigns and polish
- frontend states and accessibility
- frontend review

It intentionally does **not** own:

- backend/API implementation
- database schemas or migrations
- webhooks, queues, server-side services
- Docker/nginx/infrastructure
- backend authentication or business logic

## Antigravity requirements

Install and authenticate Antigravity CLI.

Windows PowerShell:

```powershell
irm https://antigravity.google/cli/install.ps1 | iex
```

macOS/Linux:

```bash
curl -fsSL https://antigravity.google/cli/install.sh | bash
```

Then run `agy` once and complete account sign-in. The runner checks the normal install locations on Windows and macOS/Linux before falling back to `agy` on `PATH`.

Headless execution uses Antigravity's outer JSON envelope:

```bash
agy -p "<compiled prompt>" \
  --output-format json \
  --mode accept-edits \
  --model gemini-3.8-flash-high
```

The prompt requires the inner `response` to be strict JSON and the MCP validates/parses it itself. This intentionally avoids `--json-schema`: Antigravity CLI 1.2.14 can stall in print mode with that flag even before sending tokens to the model.

`--dangerously-skip-permissions` is **disabled by default**. For a trusted local development workspace only, you may opt in by setting `ANTIGRAVITY_MCP_DANGEROUS_SKIP_PERMISSIONS=1`. Do not enable this on shared, CI, or untrusted workspaces.

If your executable has another name/path, set:

```bash
ANTIGRAVITY_CLI=/path/to/agy
```

The MCP defaults to `gemini-3.8-flash-high` because Antigravity's account default can vary or temporarily have no capacity. Override it with:

```bash
ANTIGRAVITY_MCP_MODEL=gemini-3.8-flash-low
```

or pass `model` on a tool call. For Antigravity model IDs that already end in `-low`, `-medium`, or `-high`, the MCP does not also pass `--effort`, because CLI 1.2.x treats that combination as conflicting.

## Install

```bash
npm install
npm run typecheck
npm test
npm run build
```

## Configure projects

Copy:

```text
config/projects.example.json
```

to:

```text
~/.antigravity-mcp/projects.json
```

or point to another file:

```bash
ANTIGRAVITY_MCP_PROJECTS_FILE=/absolute/path/projects.json
```

Example:

```json
{
  "projects": {
    "ttsubinos": {
      "path": "C:/Projects/TTSubinOS",
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

`project` values exposed to the MCP are aliases such as `ttsubinos`; callers do not pass arbitrary filesystem paths.

## Install frontend Agent Skills in each workspace

The MCP **verifies that every routed skill actually exists** under the target project's Antigravity workspace skills before running `agy`.

UI/UX Pro Max is now part of the default route for frontend work. Install it with its official Antigravity installer:

```bash
npx --yes ui-ux-pro-max-cli@latest init --ai antigravity
```

Source: `nextlevelbuilder/ui-ux-pro-max-skill`. The installer writes the skill to `.agents/skills/ui-ux-pro-max/` and includes its local UI/UX search data/scripts.

Taste skills remain complementary:

For landing pages and portfolios:

```bash
npx skills add https://github.com/Leonxlnx/taste-skill \
  --skill "design-taste-frontend"
```

For existing redesigns:

```bash
npx skills add https://github.com/Leonxlnx/taste-skill \
  --skill "redesign-existing-projects"
```

For dashboards/product UI, Taste Skill v2 explicitly says it is out of scope, so this MCP routes to the preserved v1 skill:

```bash
npx skills add https://github.com/Leonxlnx/taste-skill \
  --skill "design-taste-frontend-v1"
```

Antigravity discovers workspace Agent Skills from `.agents/skills/`.

## MCP tools

### `antigravity_execute`

Starts a new frontend task.

Example:

```json
{
  "project": "ttsubinos",
  "task": "Redesign the settings screen while preserving all behavior",
  "mode": "redesign",
  "surface": "settings",
  "scope": ["src/pages/settings"],
  "constraints": ["Do not add a new UI library"],
  "acceptanceCriteria": ["Responsive on desktop and tablet"],
  "effort": "high"
}
```

### `antigravity_continue`

Continues the same Antigravity conversation using the `conversationId` returned by a prior run.

### `antigravity_inspect`

Runs a frontend-only, read-only review prompt.

## Handoff behavior

Backend task:

```json
{
  "status": "handoff_required",
  "handled": false,
  "reason": "backend_task",
  "returnTo": "orchestrator",
  "originalTask": "Create a Spring Boot payment API"
}
```

Mixed task:

```json
{
  "status": "handoff_required",
  "handled": false,
  "reason": "mixed_scope",
  "returnTo": "orchestrator"
}
```

The orchestrator should then split/re-route the work, e.g. ChatGPT -> ChatCode for backend.

## Missing skill behavior

The MCP refuses to run a design task without the selected Agent Skill:

```json
{
  "status": "setup_required",
  "handled": false,
  "reason": "missing_agent_skills",
  "missingSkills": ["design-taste-frontend"],
  "installCommands": [
    "npx skills add https://github.com/Leonxlnx/taste-skill --skill \"design-taste-frontend\""
  ]
}
```

This prevents Antigravity from silently improvising frontend taste rules.

## Prompt compiler

Prompt templates are versioned in `prompts/`:

- `base.v1.md`
- `create.v1.md`
- `redesign.v1.md`
- `inspect.v1.md`

Override the directory with:

```bash
ANTIGRAVITY_MCP_PROMPTS_DIR=/path/to/prompts
```

This keeps frontend design knowledge inside Agent Skills while the MCP prompt focuses on task scope, boundaries, validation, and acceptance criteria.

## Secure MCP Tunnel (Windows)

This repo includes PowerShell helpers for OpenAI Secure MCP Tunnel:

- `npm run tunnel:setup` creates the `antigravity-mcp` stdio tunnel profile.
- `npm run tunnel:doctor` validates the profile and local MCP command.
- `npm run tunnel:run` runs the tunnel in the foreground.

Before setup, provide these values locally (do not commit them). You can either set them in your shell/user environment, or copy `scripts/tunnel-env.example.ps1` to the gitignored `scripts/tunnel-env.local.ps1`; tunnel scripts automatically load that local file:

```powershell
$env:CONTROL_PLANE_TUNNEL_ID = "tunnel_..."
$env:CONTROL_PLANE_API_KEY = "<runtime key>"
# Optional local-development-only permission bypass:
# $env:ANTIGRAVITY_MCP_DANGEROUS_SKIP_PERMISSIONS = "1"
```

Then run:

```powershell
npm run tunnel:setup
npm run tunnel:doctor
npm run tunnel:run
```

The generated tunnel profile launches this repo over stdio using `node <repo>\dist\src\server.js`. The local tunnel operator UI is `http://127.0.0.1:8080/ui` while the tunnel is running.

The tunnel ID is created in OpenAI Platform Tunnels settings. The API key must be a Runtime API key with Tunnels Read + Use. ChatGPT plan/workspace support for custom MCP apps is separate from tunnel setup.

## Test with MCP Inspector

```bash
npx @modelcontextprotocol/inspector npm run dev
```

## Security notes

- The MCP only accepts registered project aliases.
- It never passes user text through a shell.
- `agy` is launched with `spawn(..., { shell: false })`.
- Backend/mixed/unclear tasks are returned to the orchestrator.
- `--dangerously-skip-permissions` is disabled by default and requires an explicit local opt-in environment variable.
- For stronger filesystem enforcement, configure Antigravity permission rules in addition to this MCP's prompt/scope guards.
