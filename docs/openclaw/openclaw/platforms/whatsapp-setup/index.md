---
title: "WhatsApp Integration - Configure Baileys Connection | OpenClaw Tutorial"
sidebarTitle: "WhatsApp Integration"
subtitle: "WhatsApp Integration - Configure Baileys Connection"
description: "Detailed guide on configuring WhatsApp channel using Baileys library for connection, completing pairing flow, and setting up security measures."
tags:
  - "WhatsApp"
  - "Baileys"
  - "Channel Configuration"
order: 60
---

# WhatsApp Integration - Configure Baileys Connection

## What You'll Learn

After completing this tutorial, you will be able to:
- Connect WhatsApp using the Baileys library
- Complete the WhatsApp pairing process
- Configure security settings to protect your account
- Manage WhatsApp connection status

## Your Current Challenge

You want to chat with an AI assistant through WhatsApp, but you may be encountering:
- Not knowing how to start WhatsApp pairing
- Concerns about account security
- Unclear how to manage multi-device connections

## Core Concept

OpenClaw uses the **Baileys** library to communicate with WhatsApp. Baileys is an open-source WhatsApp Web API implementation that allows connection without the official Business API.

```
┌─────────────────────────────────────────────────────────────┐
│                  WhatsApp Connection Flow                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌─────────────┐      ┌─────────────┐      ┌──────────┐   │
│   │  OpenClaw   │      │   Baileys   │      │ WhatsApp │   │
│   │   Gateway   │ ───→ │   Library   │ ───→ │  Server  │   │
│   └──────┬──────┘      └─────────────┘      └──────────┘   │
│          │                                                  │
│          │  1. Generate QR Code                              │
│          │  2. Phone scans                                   │
│          │  3. Establish connection                          │
│          │  4. Sync messages                                 │
│          │                                                  │
└─────────────────────────────────────────────────────────────┘
```

### Pairing Mechanism

WhatsApp uses a multi-device architecture:
- Phone acts as the primary device
- OpenClaw acts as the connected device
- After pairing, messages can be sent and received without the phone being online

## Step-by-Step Guide

### Step 1: Enable WhatsApp Channel

**Why**  
First, you need to enable WhatsApp functionality in the configuration.

```bash
# Enable WhatsApp channel
openclaw config set channels.whatsapp.enabled true

# Verify configuration
openclaw config get channels.whatsapp.enabled
```

### Step 2: Start Pairing Flow

**Why**  
You need to complete pairing by scanning a QR code with your WhatsApp mobile app.

```bash
# Start WhatsApp login flow
openclaw channels add whatsapp

# Or use the dedicated command
openclaw whatsapp login
```

**You should see**  
Terminal displaying QR code:

```
┌─────────────────────────────────────┐
│  WhatsApp Pairing                   │
├─────────────────────────────────────┤
│                                     │
│  ████████████████████████████████  │
│  ██  ▄▄▄▄▄  █▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀  ██  │
│  ██  █   █  █                  ██  │
│  ██  █   █  █  QR Code here    ██  │
│  ██  ▀▀▀▀▀  █                  ██  │
│  ████████████████████████████████  │
│                                     │
│  1. Open WhatsApp mobile app        │
│  2. Settings → Linked Devices → Link a Device │
│  3. Scan the QR code above          │
│                                     │
└─────────────────────────────────────┘
```

### Step 3: Scan with Phone and Confirm

**Why**  
WhatsApp requires explicit user authorization for new device connections.

Steps:
1. Open WhatsApp mobile app
2. Tap ⋮ in top right → **Linked Devices**
3. Tap **Link a Device**
4. Scan the QR code displayed in terminal
5. Wait for connection to establish

**You should see**  
Terminal showing successful connection:

```
✅ WhatsApp connected successfully!
   Phone: +86 138 **** xxxx
   Name: Your Name
   Device: OpenClaw Gateway
```

### Step 4: Configure Allowlist

**Why**  
Limit which users can trigger AI assistant responses.

```bash
# Add allowed phone numbers
openclaw config set channels.whatsapp.allowFrom "+86138xxxxxxxx"

# Allow multiple numbers
openclaw config set channels.whatsapp.allowFrom "+86138xxxxxxxx,+86139xxxxxxxx"

# Allow everyone (not recommended for production)
openclaw config set channels.whatsapp.allowFrom "*"
```

**Configuration Example**

```json
{
  "channels": {
    "whatsapp": {
      "enabled": true,
      "allowFrom": ["+86138xxxxxxxx", "+86139xxxxxxxx"],
      "dmPolicy": "allow",
      "groupPolicy": "owner-only",
      "accounts": {
        "default": {
          "phoneNumber": "+86138xxxxxxxx"
        }
      }
    }
  }
}
```

### Step 5: Configure DM Pairing

**Why**  
DM (Direct Message) pairing is a security mechanism to prevent unauthorized access.

```bash
# Enable DM pairing
openclaw config set channels.whatsapp.dmPolicy "pairing"

# Pairing mode options
# "allow"    - Allow DM from everyone
# "deny"     - Deny all DMs
# "pairing"  - Require pairing verification
```

**DM Pairing Flow**

When a user sends a DM for the first time:
1. AI responds with a pairing verification code request
2. User confirms pairing in Gateway UI or CLI
3. Subsequent conversations proceed normally

### Step 6: Test Message Sending

**Why**  
Verify that WhatsApp connection is working properly.

```bash
# Send test message via WhatsApp
openclaw message send --channel whatsapp --to "+86138xxxxxxxx" --text "Hello from OpenClaw!"

# Or use the agent command
openclaw agent --to "+86138xxxxxxxx" --message "Hello, this is a test message"
```

## Checkpoint ✅

Verify WhatsApp connection status:

```bash
# Check WhatsApp status
openclaw channels status whatsapp

# Expected output
┌─────────────────────────────────────┐
│  WhatsApp Status                    │
├─────────────────────────────────────┤
│  Status:     ✅ Connected            │
│  Phone:      +86 138 **** xxxx      │
│  Name:       Your Name              │
│  Last seen:  Just now               │
└─────────────────────────────────────┘
```

## Troubleshooting

::: warning Common Issues
1. **QR Code Expired**  
   Symptom: `QR code expired`  
   Solution: QR code is valid for about 1 minute, regenerate after timeout

2. **Phone Can't Scan**  
   Symptom: No response when scanning QR code  
   Solution: Ensure WhatsApp is updated to latest version, check camera permissions

3. **Connection Disconnected**  
   Symptom: `Disconnected from WhatsApp`  
   Solution: Check network connection, rerun login flow

4. **Max Devices Reached**  
   Symptom: `Max devices reached`  
   Solution: Remove unused linked devices in WhatsApp mobile app

5. **Invalid Phone Number Format**  
   Symptom: `Invalid phone number`  
   Solution: Use international format `+86138xxxxxxxx`, include country code
:::

## Security Configuration Recommendations

### Production Environment Configuration

```json
{
  "channels": {
    "whatsapp": {
      "enabled": true,
      "allowFrom": ["+86138xxxxxxxx"],
      "dmPolicy": "pairing",
      "groupPolicy": "owner-only",
      "heartbeat": {
        "showOk": false,
        "showAlerts": true,
        "useIndicator": true
      }
    }
  }
}
```

### Privacy Protection

- Use `allowFrom` to limit accessible users
- Enable `dmPolicy: "pairing"` to prevent access from strangers
- Regularly check the list of paired devices
- Do not store sensitive message content in logs

## Lesson Summary

In this tutorial, you learned:

- ✅ WhatsApp and Baileys connection principles
- ✅ Complete pairing flow operations
- ✅ Configure allowlist to control access
- ✅ DM pairing security mechanism
- ✅ Test message sending to verify connection
- ✅ Production environment security configuration recommendations

## Next Steps

> In the next lesson, we'll learn **[Telegram Integration](../telegram-setup/)**.
>
> You'll learn:
> - Creating Telegram Bots
> - Configuring Bot Token
> - Group management and permission settings

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-02-14

| Feature | File Path | Line Numbers |
| --- | --- | --- |
| WhatsApp Implementation | [`src/whatsapp/`](https://github.com/openclaw/openclaw/blob/main/src/whatsapp/) | - |
| WhatsApp Config Types | [`src/config/types.whatsapp.ts`](https://github.com/openclaw/openclaw/blob/main/src/config/types.whatsapp.ts) | - |
| Baileys Integration | [`src/channels/plugins/outbound/whatsapp.ts`](https://github.com/openclaw/openclaw/blob/main/src/channels/plugins/outbound/whatsapp.ts) | - |
| Pairing Logic | [`src/channels/plugins/pairing.ts`](https://github.com/openclaw/openclaw/blob/main/src/channels/plugins/pairing.ts) | - |
| WhatsApp Extension | [`extensions/whatsapp/`](https://github.com/openclaw/openclaw/blob/main/extensions/whatsapp/) | - |

**Key Baileys Configuration**:
- Uses `@whiskeysockets/baileys` library
- Supports multi-device architecture
- Auto-reconnect mechanism
- Message deduplication handling

</details>
