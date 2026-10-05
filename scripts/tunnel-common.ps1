$ErrorActionPreference = "Stop"

$RepoRoot = Split-Path -Parent $PSScriptRoot
$ServerEntry = Join-Path $RepoRoot "dist\src\server.js"
$DefaultTunnelClient = Join-Path $env:LOCALAPPDATA "OpenAI\tunnel-client\bin\tunnel-client.exe"

$LocalEnvFile = Join-Path $PSScriptRoot "tunnel-env.local.ps1"
if (Test-Path $LocalEnvFile) {
  . $LocalEnvFile
}

if (-not $env:CONTROL_PLANE_API_KEY) {
  $userRuntimeKey = [Environment]::GetEnvironmentVariable("CONTROL_PLANE_API_KEY", "User")
  if ($userRuntimeKey) {
    $env:CONTROL_PLANE_API_KEY = $userRuntimeKey
  }
}

function Resolve-TunnelClient {
  $fromPath = Get-Command tunnel-client -ErrorAction SilentlyContinue
  if ($fromPath) { return $fromPath.Source }
  if (Test-Path $DefaultTunnelClient) { return $DefaultTunnelClient }
  throw "tunnel-client was not found. Expected it on PATH or at $DefaultTunnelClient"
}

function Ensure-McpBuild {
  if (Test-Path $ServerEntry) { return }
  Push-Location $RepoRoot
  try {
    npm run build
    if ($LASTEXITCODE -ne 0) { throw "npm run build failed." }
  } finally { Pop-Location }
  if (-not (Test-Path $ServerEntry)) { throw "MCP server entry was not produced at $ServerEntry" }
}
