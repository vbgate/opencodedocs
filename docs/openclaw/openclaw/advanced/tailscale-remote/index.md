---
title: "Tailscale Remote Access - Secure Gateway Exposure | OpenClaw Tutorial"
sidebarTitle: "Tailscale Remote Access"
subtitle: "Tailscale Remote Access - Secure Gateway Exposure"
description: "Learn how to configure Tailscale Serve/Funnel for secure remote access and mDNS/Bonjour device discovery."
tags:
  - "Tailscale"
  - "Remote Access"
  - "Security"
  - "Networking"
order: 140
---

# Tailscale Remote Access - Secure Gateway Exposure

## What You'll Learn

After completing this tutorial, you will be able to:
- Configure Tailscale integration
- Use Tailscale Serve/Funnel to expose Gateway
- Implement secure remote access
- Configure mDNS/Bonjour device discovery

## Core Concepts

Tailscale is a zero-config VPN solution based on WireGuard that allows you to securely access OpenClaw Gateway from anywhere.

```
┌─────────────────────────────────────────────────────────────┐
│                 Tailscale Network Architecture              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   External User                                             │
│       │                                                     │
│       │  Tailscale Funnel (Optional)                        │
│       ▼                                                     │
│   ┌─────────────────────────────────────────────────────┐  │
│   │              Tailscale Network                      │  │
│   │                                                   │  │
│   │  ┌─────────────┐         ┌─────────────────────┐  │  │
│   │  │  Your Device │ ←────→ │  OpenClaw Gateway   │  │  │
│   │  │ (Phone/PC)  │ WireGuard │  (Home Server)    │  │  │
│   │  └─────────────┘  Tunnel └─────────┬───────────┘  │  │
│   │                                      │              │  │
│   │                           ┌──────────┴──────────┐   │  │
│   │                           │  Tailscale Coord    │   │  │
│   │                           │  (DERP Relay)       │   │  │
│   │                           └─────────────────────┘   │  │
│   │                                                     │  │
│   └─────────────────────────────────────────────────────┘  │
│                                                             │
│   Features:                                                 │
│   - End-to-end Encryption                                   │
│   - No Public IP Required                                   │
│   - NAT Traversal                                           │
│   - Granular Access Control                                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Three Access Modes

| Mode | Description | Use Case |
|------|-------------|----------|
| **Tailscale VPN** | Join the same Tailnet for access | Team/Family use |
| **Tailscale Serve** | Expose service to Tailnet | Sharing within LAN |
| **Tailscale Funnel** | Expose service to internet | Providing external services |

## Prerequisites

1. **Tailscale Account**  
   Visit [tailscale.com](https://tailscale.com) to register a free account

2. **Install Tailscale**  
   Install Tailscale on the Gateway host and user devices

```bash
# macOS
brew install tailscale

# Linux
curl -fsSL https://tailscale.com/install.sh | sh

# For other systems, see https://tailscale.com/download
```

3. **Login to Tailscale**

```bash
sudo tailscale up
# Follow the prompt to complete login in browser
```

## Follow Along

### Step 1: Enable Tailscale Integration

**Why**  
OpenClaw needs to know whether to use Tailscale for network configuration.

```bash
# Enable Tailscale mode
openclaw config set gateway.tailscale.mode serve

# Available modes: off, serve, funnel
# - off: Don't use Tailscale
# - serve: Expose only to Tailnet
# - funnel: Expose to the internet

# Verify configuration
openclaw config get gateway.tailscale
```

**Tailscale Configuration Options**

```json
{
  "gateway": {
    "tailscale": {
      "mode": "serve",
      "resetOnExit": false
    }
  }
}
```

### Step 2: Configure Tailscale Serve

**Why**  
Securely expose Gateway service to other devices in the Tailnet.

```bash
# Configure Serve on Gateway host
sudo tailscale serve --https 18789 localhost:18789

# Verify service is exposed
sudo tailscale serve status
```

**You should see**

```
┌─────────────────────────────────────┐
│  Tailscale Serve Status             │
├─────────────────────────────────────┤
│  https://openclaw-gateway.tailnet   │
│  └── /  proxy http://localhost:18789│
│                                     │
│  Funnel: not configured             │
└─────────────────────────────────────┘
```

### Step 3: Access from Other Devices

**Why**  
Verify that Tailscale connection is working properly.

On another device that has joined the same Tailnet:

```bash
# Get Gateway host's Tailscale IP
ping openclaw-gateway

# Test Gateway connection
curl https://openclaw-gateway.tailnet-xyz.ts.net/status

# Configure OpenClaw CLI to use remote Gateway
openclaw config set gateway.host "openclaw-gateway.tailnet-xyz.ts.net"
openclaw config set gateway.port 443
openclaw config set gateway.tls true

# Test connection
openclaw status
```

### Step 4: Configure Tailscale Funnel (Optional)

**Why**  
If you need access from outside the Tailnet (e.g., friends without Tailscale installed).

::: warning Security Warning
Funnel exposes your service to the public internet. Ensure strong authentication is configured.
:::

```bash
# Enable Funnel
sudo tailscale funnel --https 18789 localhost:18789

# Verify Funnel status
sudo tailscale funnel status
```

**Configure Strong Authentication**

```bash
# Configure Token authentication (strongly recommended)
openclaw config set gateway.auth.mode token
openclaw config set gateway.auth.token "$(openssl rand -hex 32)"

# Or configure password authentication
openclaw config set gateway.auth.mode password
openclaw config set gateway.auth.password "your-strong-password"
```

### Step 5: Configure mDNS/Bonjour Discovery

**Why**  
Allow devices on the local network to automatically discover Gateway.

```bash
# Enable mDNS discovery
openclaw config set discovery.mdns.mode auto

# Configure device display name
openclaw config set discovery.mdns.name "My OpenClaw Gateway"

# Enable Bonjour (macOS/iOS)
openclaw config set discovery.bonjour.enabled true
```

**Discovery Configuration Example**

```json
{
  "discovery": {
    "mdns": {
      "mode": "auto",
      "name": "OpenClaw Gateway"
    },
    "bonjour": {
      "enabled": true
    },
    "wideArea": {
      "enabled": false,
      "domain": ""
    }
  }
}
```

### Step 6: Configure Access Control

**Why**  
Restrict who can access your Gateway.

**Tailscale ACL Configuration**

Configure ACL in the Tailscale admin console:

```json
{
  "acls": [
    {
      "action": "accept",
      "src": ["group:family"],
      "dst": ["tag:openclaw:18789"]
    }
  ],
  "tagOwners": {
    "tag:openclaw": ["autogroup:admin"]
  }
}
```

**OpenClaw Access Control**

```bash
# Configure channel allowlist
openclaw config set channels.whatsapp.allowFrom "+86138xxxxxxxx"

# Configure Agent access control
openclaw config set agents.defaults.allowList "["user1@tailnet","user2@tailnet"]"
```

## Checkpoint ✅

Verify Tailscale integration:

```bash
# Check Tailscale status
sudo tailscale status

# Expected output
┌────────────────────────────────────────────────────────────┐
│  Tailscale Status                                          │
├────────────────────────────────────────────────────────────┤
│  openclaw-gateway  100.x.x.x    linux   -                  │
│  my-laptop         100.x.x.y    macOS   active  direct     │
│  my-phone          100.x.x.z    iOS     active  relay      │
└────────────────────────────────────────────────────────────┘

# Check OpenClaw Tailscale integration
openclaw status

# Expected output
┌─────────────────────────────────────┐
│  OpenClaw Status                    │
├─────────────────────────────────────┤
│  Gateway:     ✅ Running            │
│  Port:        18789                 │
│  Tailscale:   ✅ Serve mode         │
│  Tailnet:     xxxxx.tailnet-xyz.ts.net │
│  mDNS:        ✅ Active             │
└─────────────────────────────────────┘
```

## Mobile Access Configuration

### iOS Configuration

1. Install [Tailscale iOS App](https://apps.apple.com/app/tailscale/id1470499037)
2. Login with the same account
3. Open Safari and visit `https://openclaw-gateway.tailnet-xyz.ts.net`

### Android Configuration

1. Install [Tailscale Android App](https://play.google.com/store/apps/details?id=com.tailscale.ipn)
2. Login with the same account
3. Use browser or HTTP client to access Gateway

## Troubleshooting Tips

::: warning Common Issues
1. **Tailscale Not Connected**  
   Symptom: `tailscale status` shows offline  
   Solution: Run `sudo tailscale up` to ensure you're logged in

2. **Firewall Blocking**  
   Symptom: Tailscale connects but can't access Gateway  
   Solution: Check local firewall rules, allow Tailscale interface (tailscale0)

3. **Certificate Error**  
   Symptom: `certificate not trusted`  
   Solution: Tailscale uses its own CA, ensure Tailscale certificate is installed on the device

4. **Funnel Limitations**  
   Symptom: Funnel can't be enabled  
   Solution: Free accounts have bandwidth limits, check Tailscale console

5. **mDNS Not Working**  
   Symptom: Devices can't auto-discover  
   Solution: Check if local network supports multicast, try `discovery.mdns.mode: "off"` and use direct IP connection
:::

## Advanced Configuration

### Using MagicDNS

Tailscale's MagicDNS assigns a domain name to each device:

```bash
# Enable MagicDNS
# Enable in Tailscale admin console

# Then you can access using hostname directly
curl https://openclaw-gateway.tailnet-xyz.ts.net:18789/status
```

### Configuring HTTPS Certificates

Tailscale automatically provides HTTPS certificates for devices:

```bash
# Get HTTPS certificate
sudo tailscale cert openclaw-gateway.tailnet-xyz.ts.net

# Certificate location
# /var/lib/tailscale/certs/openclaw-gateway.tailnet-xyz.ts.net.crt
# /var/lib/tailscale/certs/openclaw-gateway.tailnet-xyz.ts.net.key
```

### Subnet Routing

If you need to access other devices on the local network:

```bash
# Enable subnet routing
sudo tailscale up --advertise-routes=192.168.1.0/24

# Approve routes in admin console
```

## Summary

In this tutorial, you learned:

- ✅ How Tailscale works and its advantages
- ✅ Configure Tailscale Serve to expose Gateway
- ✅ Securely access Gateway from other devices
- ✅ Configure Tailscale Funnel (use with caution)
- ✅ Enable mDNS/Bonjour device discovery
- ✅ Configure access control policies
- ✅ Mobile access configuration

## Next Lesson Preview

> Next we learn **[Troubleshooting](../faq/troubleshooting/)**.
>
> You'll learn:
> - Diagnostic methods for common issues
> - Using doctor command to fix problems
> - Log analysis and debugging techniques

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-02-14

| Feature | File Path | Line |
|---------|-----------|------|
| Tailscale Integration | [`src/gateway/server-tailscale.ts`](https://github.com/openclaw/openclaw/blob/main/src/gateway/server-tailscale.ts) | - |
| Discovery Service | [`src/gateway/server-discovery.ts`](https://github.com/openclaw/openclaw/blob/main/src/gateway/server-discovery.ts) | - |
| Discovery Runtime | [`src/gateway/server-discovery-runtime.ts`](https://github.com/openclaw/openclaw/blob/main/src/gateway/server-discovery-runtime.ts) | - |
| mDNS/Bonjour | [`src/gateway/server-discovery.ts`](https://github.com/openclaw/openclaw/blob/main/src/gateway/server-discovery.ts) | - |

**Tailscale Modes**:
- `off`: Don't use Tailscale
- `serve`: Expose service to Tailnet
- `funnel`: Expose service to internet

**Discovery Protocols**:
- mDNS: Multicast DNS (cross-platform)
- Bonjour: Apple's device discovery protocol
- Wide Area: Wide area network discovery

</details>
