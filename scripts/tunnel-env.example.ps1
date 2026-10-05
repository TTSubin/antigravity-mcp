# Do NOT commit real secrets.
# Copy this file to tunnel-env.local.ps1 for local-only settings.
# Obtain tunnel credentials from OpenAI Platform tunnel settings / Runtime API keys.

$env:CONTROL_PLANE_TUNNEL_ID = "tunnel_REPLACE_ME"
$env:CONTROL_PLANE_API_KEY = "YOUR_RUNTIME_API_KEY"

# Security-sensitive and disabled by default in the public repository.
# If you explicitly want local Antigravity CLI permission auto-approval,
# opt in via the documented environment variable in README.md.
