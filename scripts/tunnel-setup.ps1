param(
  [string]$Profile = "antigravity-mcp",
  [string]$TunnelId = $env:CONTROL_PLANE_TUNNEL_ID
)

. (Join-Path $PSScriptRoot "tunnel-common.ps1")

if (-not $TunnelId) {
  throw "Missing tunnel id. Set CONTROL_PLANE_TUNNEL_ID or pass -TunnelId tunnel_..."
}
Ensure-McpBuild
$TunnelClient = Resolve-TunnelClient
$McpScript = $ServerEntry -replace '\\', '/'
$McpCommand = 'node "' + $McpScript + '"'

& $TunnelClient init `
  --sample sample_mcp_stdio_local `
  --profile $Profile `
  --tunnel-id $TunnelId `
  --mcp-command $McpCommand `
  --control-plane-api-key-ref "env:CONTROL_PLANE_API_KEY" `
  --health-listen-addr "127.0.0.1:8080"

if ($LASTEXITCODE -ne 0) { throw "tunnel-client init failed." }
Write-Host ""
Write-Host "Profile '$Profile' created."
Write-Host "Next: npm run tunnel:doctor"
