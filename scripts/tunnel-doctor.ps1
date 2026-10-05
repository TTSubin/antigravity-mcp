param([string]$Profile = "antigravity-mcp")

. (Join-Path $PSScriptRoot "tunnel-common.ps1")
Ensure-McpBuild
$TunnelClient = Resolve-TunnelClient
& $TunnelClient doctor --profile $Profile --explain
if ($LASTEXITCODE -ne 0) { throw "Tunnel doctor failed for profile '$Profile'." }
