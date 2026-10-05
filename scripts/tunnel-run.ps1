param([string]$Profile = "antigravity-mcp")

. (Join-Path $PSScriptRoot "tunnel-common.ps1")
if (-not $env:CONTROL_PLANE_API_KEY) { throw "CONTROL_PLANE_API_KEY is not set in this terminal." }
Ensure-McpBuild
$TunnelClient = Resolve-TunnelClient
$OperatorProxy = Join-Path $RepoRoot "operator-ui\proxy.mjs"
$OperatorProxyProcess = $null
$TunnelExitCode = 0

Write-Host "Starting Secure MCP Tunnel profile '$Profile'..."
Write-Host "Keep this process running while ChatGPT uses antigravity-mcp."
Write-Host ""

try {
  $env:TUNNEL_OPERATOR_UPSTREAM = "http://127.0.0.1:8081"
  $OperatorProxyProcess = Start-Process -FilePath "node" -ArgumentList @($OperatorProxy) -WorkingDirectory $RepoRoot -NoNewWindow -PassThru

  Write-Host "Tunnel backend UI:  http://127.0.0.1:8081/ui"
  Write-Host "Custom operator UI: http://127.0.0.1:8080/ui"
  Write-Host ""

  & $TunnelClient run --profile $Profile --health.listen-addr "127.0.0.1:8081"
  $TunnelExitCode = $LASTEXITCODE
}
finally {
  if ($OperatorProxyProcess -and -not $OperatorProxyProcess.HasExited) {
    Stop-Process -Id $OperatorProxyProcess.Id -Force
  }
}

exit $TunnelExitCode
