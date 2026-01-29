---
title: "Release Notes: New Features, Improvements, and Breaking Changes | Clawdbot Tutorial"
sidebarTitle: "Release Notes"
subtitle: "Release Notes: New Features, Improvements, and Breaking Changes"
description: "Learn Clawdbot's version update history, including new features, improvements, fixes, and breaking changes in each version. This tutorial helps users track feature evolution and keep systems updated with the latest features and security fixes."
tags:
  - "changelog"
  - "version-history"
  - "release-notes"
prerequisite: []
order: 380
---

# Release Notes: New Features, Improvements, and Breaking Changes

Clawdbot continuously iterates and updates, with each version bringing new features, performance improvements, and security enhancements. This log helps you quickly understand version evolution and decide when to upgrade and what to watch out for.

## What You'll Learn

- Understand new features and highlights in the latest versions
- Master breaking changes across versions to avoid upgrade interruptions
- Review the list of issue fixes to confirm if your issues have been resolved
- Track feature evolution roadmap and plan to use new features

::: tip Version Number Format
Version number format: `YYYY.M.D` (Year.Month.Day)

- **Major version**: Year or month number changes usually represent major feature updates
- **Patch version**: `-1`, `-2`, `-3` represent fix versions, containing only bug fixes
:::

---

## 2026.1.25
**Status**: Unreleased

### Highlights

None yet

### Changes

- **Agents**: Honor `tools.exec.safeBins` in exec allowlist check (#2281)
- **Docs**: Tighten Fly private deployment steps (#2289) - thanks to @dguido
- **Gateway**: Warn about hook tokens passed via query parameters; document preferred header auth method (#2200) - thanks to @YuriNachos
- **Gateway**: Add dangerous Control UI device auth bypass flag + audit warning (#2248)
- **Doctor**: Warn when gateway is exposed without authentication (#2016) - thanks to @Alex-Alaniz
- **Discord**: Add configurable privileged gateway intents (presences/members) (#2266) - thanks to @kentaro
- **Docs**: Add Vercel AI Gateway to providers sidebar (#1901) - thanks to @jerilynzheng
- **Agents**: Expand cron tool description to include full schema docs (#1988) - thanks to @tomascupr
- **Skills**: Add missing dependency metadata for GitHub, Notion, Slack, Discord (#1995) - thanks to @jackheuberger
- **Docs**: Add Render deployment guide (#1975) - thanks to @anurag
- **Docs**: Add Claude Max API proxy guide (#1875) - thanks to @atalovesyou
- **Docs**: Add DigitalOcean deployment guide (#1870) - thanks to @0xJonHoldsCrypto
- **Docs**: Add Raspberry Pi installation guide (#1871) - thanks to @0xJonHoldsCrypto
- **Docs**: Add GCP Compute Engine deployment guide (#1848) - thanks to @hougangdev
- **Docs**: Add LINE channel guide - thanks to @thewilloftheshadow
- **Docs**: Credit two contributors for Control UI refresh (#1852) - thanks to @EnzeD
- **Onboarding**: Add Venice API key to non-interactive flow (#1893) - thanks to @jonisjongithub
- **Onboarding**: Strengthen beta security warning copy + access control expectations
- **Tlon**: Format thread reply IDs as `@ud` (#1837) - thanks to @wca4a
- **Gateway**: Prefer latest session metadata when merging storage (#1823) - thanks to @emanuelst
- **Web UI**: Keep sub-agent announcement replies visible in WebChat (#1977) - thanks to @andrescardonas7
- **CI**: Increase Node heap size for macOS checks (#1890) - thanks to @realZachi
- **macOS**: Avoid crash when rendering code blocks by upgrading Textual to 0.3.1 (#2033) - thanks to @garricn
- **Browser**: Fall back to URL matching for extension relay target resolution (#1999) - thanks to @jonit-dev
- **Update**: Ignore dist/control-ui in dirty check and restore after UI build (#1976) - thanks to @Glucksberg
- **Telegram**: Allow caption parameter when sending media (#1888) - thanks to @mguellsegarra
- **Telegram**: Support plugin sendPayload channelData (media/buttons) and validate plugin commands (#1917) - thanks to @JoshuaLelon
- **Telegram**: Avoid chunked replies when streaming is disabled (#1885) - thanks to @ivancasco
- **Auth**: Show copyable Google auth URL after ASCII prompt (#1787) - thanks to @robbyczgw-cla
- **Routing**: Precompile session key regex (#1697) - thanks to @Ray0907
- **TUI**: Avoid width overflow when rendering selection lists (#1686) - thanks to @mossein
- **Telegram**: Preserve thread ID in restart sentry notifications (#1807) - thanks to @hsrvc
- **Config**: Apply `config.env` before `${VAR}` substitution (#1813) - thanks to @spanishflu-est1918
- **Slack**: Clear ack reaction after streaming replies (#2044) - thanks to @fancyboi999
- **macOS**: Preserve custom SSH username in remote targets (#2046) - thanks to @algal

### Fixes

- **Telegram**: Wrap reasoning italics per line to avoid raw underscores (#2181) - thanks to @YuriNachos
- **Voice Call**: Enforce Twilio webhook signature verification for ngrok URLs; disable ngrok free tier bypass by default
- **Security**: Harden Tailscale Serve auth by verifying local tailscaled identity before trusting headers
- **Build**: Align memory-core peer dependency with lockfile
- **Security**: Add mDNS discovery mode, defaulting to minimal to reduce information disclosure (#1882) - thanks to @orlyjamie
- **Security**: Harden URL fetch with DNS pinning to reduce rebinding risk - thanks to Chris Zheng
- **Web UI**: Improve WebChat image paste preview and allow sending images only (#1925) - thanks to @smartprogrammer93
- **Security**: Default to wrapping external hook content with per-hook exit option (#1827) - thanks to @mertcicekci0
- **Gateway**: Default auth now fails closed (requires token/password; Tailscale Serve identity still allowed)
- **Onboarding**: Remove unsupported gateway auth "off" choice from onboarding/configure flow and CLI flag

---

## 2026.1.24-3

### Fixes

- **Slack**: Fix image download failure due to missing Authorization header on cross-domain redirects (#1936) - thanks to @sanderhelgesen
- **Gateway**: Harden local client detection and reverse proxy handling for unauthenticated proxy connections (#1795) - thanks to @orlyjamie
- **Security audit**: Mark disabled-auth loopback Control UI as critical (#1795) - thanks to @orlyjamie
- **CLI**: Restore claude-cli sessions and stream CLI replies to TUI client (#1921) - thanks to @rmorse

---

## 2026.1.24-2

### Fixes

- **Packaging**: Include dist/link-understanding output in npm tarball (fixes missing apply.js import on install)

---

## 2026.1.24-1

### Fixes

- **Packaging**: Include dist/shared output in npm tarball (fixes missing reasoning-tags import on install)

---

## 2026.1.24

### Highlights

- **Providers**: Ollama discovery + docs; Venice guide upgrade + cross-linking (#1606) - thanks to @abhaymundhara
- **Channels**: LINE plugin (Messaging API) supports rich replies + quick replies (#1630) - thanks to @plum-dawg
- **TTS**: Edge fallback (no key) + `/tts` auto mode (#1668, #1667) - thanks to @steipete, @sebslight
- **Exec approvals**: In-chat approvals via `/approve` across all channels (including plugins) (#1621) - thanks to @czekaj
- **Telegram**: DM threads as independent sessions + outbound link preview toggle (#1597, #1700) - thanks to @rohannagpal, @zerone0x

### Changes

- **Channels**: Add LINE plugin (Messaging API) supporting rich replies, quick replies, and plugin HTTP registry (#1630) - thanks to @plum-dawg
- **TTS**: Add Edge TTS provider fallback, defaulting to Edge with no key, retrying MP3 when format fails (#1668) - thanks to @steipete
- **TTS**: Add auto mode enum (off/always/inbound/tagged) with per-session `/tts` override support (#1667) - thanks to @sebslight
- **Telegram**: Treat DM threads as independent sessions and use thread suffix to keep DM history limit stable (#1597) - thanks to @rohannagpal
- **Telegram**: Add `channels.telegram.linkPreview` toggle for outbound link previews (#1700) - thanks to @zerone0x
- **Web search**: Add Brave freshness filter parameters for time-limited results (#1688) - thanks to @JonUleis
- **UI**: Refresh Control UI dashboard design system (colors, icons, typography) (#1745, #1786) - thanks to @EnzeD, @mousberg
- **Exec approvals**: Forward approval prompts to chat, support all channels via `/approve` (including plugins) (#1621) - thanks to @czekaj
- **Gateway**: Expose `config.patch` in gateway tools, supporting safe partial updates + restart sentinel (#1653) - thanks to @Glucksberg
- **Diagnostics**: Add diagnostic flags for targeted debug logging (config + env overrides)
- **Docs**: Expand FAQ (migration, scheduling, concurrency, model recommendations, OpenAI subscription auth, Pi size, installable, docs SSL workaround)
- **Docs**: Add detailed installer troubleshooting guide
- **Docs**: Add macOS VM guide with local/hosted options + VPS/node guidance (#1693) - thanks to @f-trycua
- **Docs**: Add Bedrock EC2 instance role setup + IAM steps (#1625) - thanks to @sergical
- **Docs**: Update Fly.io guide instructions
- **Dev**: Add prek pre-commit hooks + weekly update config for dependencies (#1720) - thanks to @dguido

### Fixes

- **Web UI**: Fix config/debug layout overflow, scrolling, and code block size (#1715) - thanks to @saipreetham589
- **Web UI**: Show stop button during activity run, switch back to new session when idle (#1664) - thanks to @ndbroadbent
- **Web UI**: Clear stale disconnect banner on reconnect; allow saving forms with unsupported schema paths but block missing schema (#1707) - thanks to @Glucksberg
- **Web UI**: Hide internal `message_id` tooltip in chat bubbles
- **Gateway**: Allow Control UI token-only auth to skip device pairing even when device identity exists (`gateway.controlUi.allowInsecureAuth`) (#1679) - thanks to @steipete
- **Matrix**: Protect E2EE media attachment decryption with preflight size check (#1744) - thanks to @araa47
- **BlueBubbles**: Route phone number targets to DM, avoid exposing routing IDs, and auto-create missing DMs (requires Private API) (#1751) - thanks to @tyler6204
- **BlueBubbles**: Keep part-index GUID in reply labels when short ID is missing
- **iMessage**: Normalize chat_id/chat_guid/chat_identifier prefixes case-insensitively and keep service prefix handles stable (#1708) - thanks to @aaronn
- **Signal**: Fix reaction sending (group/UUID targets + CLI author flag) (#1651) - thanks to @vilkasdev
- **Signal**: Add configurable signal-cli startup timeout + external daemon mode docs (#1677)
- **Telegram**: Set fetch duplex="half" for uploads on Node 22 to avoid sendPhoto failure (#1684) - thanks to @commdata2338
- **Telegram**: Use wrapped fetch for long polling on Node to normalize AbortSignal handling (#1639)
- **Telegram**: Honor per-account proxy for outbound API calls (#1774) - thanks to @radek-paclt
- **Telegram**: Fall back to text when voice notes are blocked by privacy settings (#1725) - thanks to @foeken
- **Voice Call**: Return streaming TwiML for outbound session calls on initial Twilio webhook (#1634)
- **Voice Call**: Serialize Twilio TTS plays and cancel on interruption to prevent overlap (#1713) - thanks to @dguido
- **Google Chat**: Tighten email allowlist matching, sanitize input, media caps, and onboarding/docs/tests (#1635) - thanks to @iHildy
- **Google Chat**: Normalize space targets without double `spaces/` prefix
- **Agents**: Auto-compress on context overflow prompt error (#1627) - thanks to @rodrigouroz
- **Agents**: Use active auth profile for auto-compression recovery
- **Media understanding**: Skip image understanding when primary model already supports vision (#1747) - thanks to @tyler6204
- **Models**: Default missing custom provider fields to accept minimal config
- **Messaging**: Keep newline block splitting safe for fenced markdown blocks across channels
- **Messaging**: Process newline blocks as paragraph-aware (split by empty lines) to keep lists and headings together (#1726) - thanks to @tyler6204
- **TUI**: Reload history after gateway reconnect to restore session state (#1663)
- **Heartbeat**: Normalize target identifiers to maintain routing consistency
- **Exec**: Keep approval for elevated ask unless in full mode (#1616) - thanks to @ivancasco
- **Exec**: Treat Windows platform tags as Windows for node shell selection (#1760) - thanks to @ymat19
- **Gateway**: Include inline config env vars in service install environment (#1735) - thanks to @Seredeep
- **Gateway**: Skip Tailscale DNS probe when tailscale.mode is off (#1671)
- **Gateway**: Reduce log noise for delayed calls + remote node probes; debounce skills refresh (#1607) - thanks to @petter-b
- **Gateway**: Clarify Control UI/WebChat auth error hints for missing token (#1690)
- **Gateway**: Listen on IPv6 loopback when bound to 127.0.0.1 so localhost webhooks work
- **Gateway**: Store lockfile in temp directory to avoid stale locks on persistent volumes (#1676)
- **macOS**: Direct `ws://` URL transport defaults to port 18789; document `gateway.remote.transport` (#1603) - thanks to @ngutman
- **Tests**: Limit Vitest workers on CI macOS to reduce timeouts (#1597) - thanks to @rohannagpal
- **Tests**: Avoid fake-timer dependency in embedded runner stream simulation to reduce CI flakiness (#1597) - thanks to @rohannagpal
- **Tests**: Increase embedded runner sort test timeout to reduce CI flakiness (#1597) - thanks to @rohannagpal

---

## 2026.1.23-1

### Fixes

- **Packaging**: Include dist/tts output in npm tarball (fixes missing dist/tts/tts.js)

---

## 2026.1.23

### Highlights

- **TTS**: Move Telegram TTS to core + default enable model-driven TTS tags for expressive audio replies (#1559) - thanks to @Glucksberg
- **Gateway**: Add `/tools/invoke` HTTP endpoint for direct tool invocation (enforces auth + tool policy) (#1575) - thanks to @vignesh07
- **Heartbeat**: Per-channel visibility control (OK/alerts/indicator) (#1452) - thanks to @dlauer
- **Deploy**: Add Fly.io deployment support + guide (#1570)
- **Channels**: Add Tlon/Urbit channel plugin (DM, group mentions, thread replies) (#1544) - thanks to @wca4a

### Changes

- **Channels**: Allow per-group allow/deny policies for tools in built-in + plugin channels (#1546) - thanks to @adam91holt
- **Agents**: Add Bedrock auto-discovery defaults + config override (#1553) - thanks to @fal3
- **CLI**: Add `clawdbot system` for system events + heartbeat control; remove standalone `wake`
- **CLI**: Add live auth probes to `clawdbot models status` for per-profile validation
- **CLI**: Restart gateway by default after `clawdbot update`; add `--no-restart` to skip
- **Browser**: Add node host proxy auto-routing for remote gateways (per gateway/node configurable)
- **Plugins**: Add optional `llm-task` JSON-only tool for workflows (#1498) - thanks to @vignesh07
- **Markdown**: Add per-channel table conversion (Signal/WhatsApp use bullets, others use code blocks) (#1495) - thanks to @odysseus0
- **Agents**: Keep system prompt timezone-only and move current time to `session_status` for better cache hits
- **Agents**: Remove redundant bash tool alias from tool registration/display (#1571) - thanks to @Takhoffman
- **Docs**: Add cron vs heartbeat decision guide (including Lobster workflow notes) (#1533) - thanks to @JustYannicc
- **Docs**: Clarify that empty HEARTBEAT.md files skip heartbeat, missing files still run (#1535) - thanks to @JustYannicc

### Fixes

- **Sessions**: Accept non-UUID sessionIds for history/send/status while maintaining agent scope
- **Heartbeat**: Accept plugin channel ids for heartbeat target validation + UI hints
- **Messaging/Sessions**: Mirror outbound sends to target session keys (thread + dmScope), create session entry on send, and normalize session key case (#1520)
- **Sessions**: Reject array-backed session storage to prevent silent erasure (#1469)
- **Gateway**: Compare Linux process start times to avoid PID reuse lock loops; keep lock unless stale (#1572) - thanks to @steipete
- **Gateway**: Accept null optional fields in exec approval requests (#1511) - thanks to @pvoo
- **Exec approvals**: Persist allowlist entry ids to keep macOS allowlist rows stable (#1521) - thanks to @ngutman
- **Exec**: Honor tools.exec ask/security defaults for elevated approvals (avoid unwanted prompts)
- **Daemon**: Use platform PATH separator when building minimal service paths
- **Linux**: Include env config user bin root in systemd PATH and align PATH audit (#1512) - thanks to @robbyczgw-cla
- **Tailscale**: Use sudo retry for serve/funnel only on permission errors and preserve original failure details (#1551) - thanks to @sweepies
- **Docker**: Update gateway commands in docker-compose and Hetzner guides (#1514)
- **Agents**: Show tool error fallback when last assistant turn only calls tools (prevent silent stop)
- **Agents**: Ignore IDENTITY.md template placeholders when parsing identity (#1556)
- **Agents**: Remove orphaned OpenAI Responses reasoning blocks on model switch (#1562) - thanks to @roshanasingh4
- **Agents**: Add CLI log hints in "agent failed before reply" message (#1550) - thanks to @sweepies
- **Agents**: Warn and ignore tool allowlists that only reference unknown or unloaded plugin tools (#1566)
- **Agents**: Treat plugin-only tool allowlists as opt-in; keep core tools enabled (#1467)
- **Agents**: Honor enqueue override for embedded runs to avoid queue deadlocks in tests
- **Slack**: Honor open groupPolicy for unlisted channels in message + slash gate (#1563) - thanks to @itsjaydesu
- **Discord**: Limit auto-thread mention bypass to bot-owned threads; keep ack reaction mention-gated (#1511) - thanks to @pvoo
- **Discord**: Retry rate-limited allowlist resolution + command deployment to avoid gateway crashes
- **Mentions**: Ignore mentionPattern matches in group chats when another explicit mention exists (Slack/Discord/Telegram/WhatsApp)
- **Telegram**: Render markdown in media captions (#1478)
- **MS Teams**: Remove `.default` suffix from Graph scope and Bot Framework discovery scopes (#1507, #1574) - thanks to @Evizero
- **Browser**: Keep extension relay tab controllable when extension reuses session id after tab switch (#1160)
- **Voice wake**: Auto-save wake words on blur/submit across iOS/Android and align limits with macOS
- **UI**: Keep Control UI sidebar visible when scrolling long pages (#1515) - thanks to @pookNast
- **UI**: Cache Control UI markdown render + memoize chat text extraction to reduce Safari input jank
- **TUI**: Forward unknown slash commands, include Gateway commands in autocomplete, and render slash replies as system output
- **CLI**: Polish auth probe output (table output, inline errors, reduce noise and line break fixes in `clawdbot models status`)
- **Media**: Only parse `MEDIA:` tags when they start a line to avoid stripping prose mentions (#1206)
- **Media**: Preserve PNG alpha when possible; fall back to JPEG when still exceeding size limit (#1491) - thanks to @robbyczgw-cla
- **Skills**: Gate bird Homebrew install to macOS (#1569) - thanks to @bradleypriest

---

## Upgrade Recommendations

### Pre-Upgrade Checklist

Before upgrading to a new version, we recommend:

1. **Read Breaking Changes**: Check if there are breaking changes that may affect your configuration
2. **Backup Configuration**: Backup `~/.clawdbot/clawdbot.json`
3. **Run Diagnostics**: `clawdbot doctor` to ensure current system health
4. **Check Dependencies**: Ensure Node.js version meets requirements (≥22)

### Post-Upgrade Verification

After completing the upgrade, perform the following verification:

```bash
# 1. Check version
clawdbot --version

# 2. Check status
clawdbot status

# 3. Verify channel connections
clawdbot channels status

# 4. Test message sending
clawdbot message "Hello" --target=<your-channel>
```

### View Full Changelog

For more detailed version history and issue links, visit:

- **GitHub Releases**: https://github.com/clawdbot/clawdbot/releases
- **Official Docs**: https://docs.clawd.bot

---

## Previous Versions

To view earlier version updates, visit [GitHub Releases](https://github.com/clawdbot/clawdbot/releases) or [CHANGELOG.md](https://github.com/clawdbot/clawdbot/blob/main/CHANGELOG.md) in the project root.

::: tip Contributing
If you discover a bug or have a feature suggestion, please submit it in [GitHub Issues](https://github.com/clawdbot/clawdbot/issues).
:::
