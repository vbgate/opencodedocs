---
title: "opencode-notify Changelog: Version History and Feature Changes"
sidebarTitle: "Changelog"
subtitle: "Changelog"
description: "View version history and important change records for the opencode-notify plugin. Learn about feature updates, bug fixes, and configuration improvements in each version."
tags:
  - "Changelog"
  - "Version History"
order: 150
---

# Changelog

## Version Notes

This plugin is distributed via OCX and does not follow traditional version numbering. Important changes are recorded below in reverse chronological order.

---

## 2026-01-23

**Change Type**: Sync Update

- Keep synchronized with kdcokenny/ocx main repository

---

## 2026-01-22

**Change Type**: Sync Update

- Keep synchronized with kdcokenny/ocx main repository

---

## 2026-01-13

**Change Type**: Sync Update

- Keep synchronized with kdcokenny/ocx main repository

---

## 2026-01-12

**Change Type**: Sync Update

- Keep synchronized with kdcokenny/ocx main repository

---

## 2026-01-08

**Change Type**: Sync Update

- Keep synchronized with kdcokenny/ocx main repository

---

## 2026-01-07

**Change Type**: Sync Update

- Updated from ocx@30a9af5
- Skip CI build

---

## 2026-01-01

### Fix: Cargo-Style Namespace Syntax

**Changes**:
- Update namespace syntax: `ocx add kdco-notify` → `ocx add kdco/notify`
- Update namespace syntax: `ocx add kdco-workspace` → `ocx add kdco/workspace`
- Rename source file: `kdco-notify.ts` → `notify.ts`

**Impact**:
- Installation command changed from `ocx add kdco-notify` to `ocx add kdco/notify`
- Source code file structure is clearer, following Cargo naming conventions

---

### Enhancement: README Documentation

**Changes**:
- Improve README documentation, add value proposition explanation
- Add FAQ section, answer common questions
- Refine "Smart Notification" related descriptions
- Simplify installation step instructions

**New Content**:
- Value proposition table (event, notification, sound, reason)
- FAQ: Does it add context? Will I receive spam notifications? How to temporarily disable?

---

## 2025-12-31

### Documentation: Simplify README

**Changes**:
- Remove invalid icons and dark mode references
- Simplify README documentation, focus on core feature descriptions

### Removal: Icon Support

**Changes**:
- Remove OpenCode icon support (cross-platform dark mode detection)
- Simplify notification flow, remove unstable icon features
- Clean up `src/plugin/assets/` directory

**Removed Files**:
- `src/plugin/assets/opencode-icon-dark.png`
- `src/plugin/assets/opencode-icon-light.png`

**Impact**:
- Notifications no longer display custom icons
- Notification flow is more stable, reduces platform compatibility issues

### Addition: OpenCode Icon (Removed)

**Changes**:
- Add OpenCode icon support
- Implement cross-platform dark mode detection

::: info
This feature was removed in later versions, see "Removal: Icon Support" on 2025-12-31.
:::

### Addition: Terminal Detection and Focus Awareness

**Changes**:
- Add automatic terminal detection (supports 37+ terminals)
- Add focus detection (macOS only)
- Add click-to-focus (macOS only)

**New Features**:
- Automatically identify terminal emulators
- Suppress notifications when terminal is focused
- Click notification to focus terminal window (macOS)

**Technical Details**:
- Use `detect-terminal` library to detect terminal type
- Get foreground application via macOS osascript
- Use node-notifier's activate option for click-to-focus

### Addition: Initial Version

**Changes**:
- Initial commit: kdco-notify plugin
- Basic native notification functionality
- Basic configuration system

**Core Features**:
- session.idle event notification (task completion)
- session.error event notification (error)
- permission.updated event notification (permission request)
- node-notifier integration (cross-platform native notifications)

**Initial Files**:
- `LICENSE` - MIT License
- `README.md` - Project documentation
- `registry.json` - OCX registration configuration
- `src/plugin/kdco-notify.ts` - Main plugin code

---

## Related Resources

- **GitHub Repository**: https://github.com/kdcokenny/ocx/tree/main/registry/src/kdco/notify
- **Commit History**: https://github.com/kdcokenny/ocx/commits/main/registry/src/kdco/notify
- **OCX Documentation**: https://github.com/kdcokenny/ocx

---

## Version Policy

As part of the OCX ecosystem, this plugin adopts the following version policy:

- **No Version Numbers**: Track changes via Git commit history
- **Continuous Delivery**: Sync updates with OCX main repository
- **Backward Compatibility**: Maintain backward compatibility of configuration format and API

Breaking changes will be clearly marked in the changelog.

---

**Last Updated**: 2026-01-27
