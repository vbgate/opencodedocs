---
title: "Read Skill Files: Safely Access Skill Resources | opencode-agent-skills"
sidebarTitle: "Read Files"
subtitle: "Read Skill Files: Safely Access Skill Resources"
description: "Learn to use read_skill_file tool. Access docs, configs, and examples in skill directories with built-in path security."
tags:
  - "Skill Files"
  - "Tool Usage"
  - "Path Security"
prerequisite:
  - "start-installation"
  - "platforms-listing-available-skills"
order: 6
---

# Read Skill Files

## What You'll Learn

- Use the `read_skill_file` tool to read documentation, configuration, and example files from skill directories
- Understand the path security mechanism to prevent directory traversal attacks
- Master XML format file content injection
- Handle error messages and available file listings when files don't exist

## Your Current Challenge

A skill's SKILL.md contains only core guidance, but many skills provide supporting files such as documentation, configuration examples, usage guides, and more. You want to access these files for more detailed instructions, but you don't know how to safely read files under skill directories.

## When to Use This

- **View detailed documentation**: Skills have detailed usage guides in their `docs/` directory
- **Configuration examples**: Need to reference example configuration files in the `config/` directory
- **Code examples**: Skills' `examples/` directory contains code examples
- **Debugging assistance**: View the skill's README or other documentation files
- **Understand resource structure**: Explore what files are available in a skill directory

## Core Concept

The `read_skill_file` tool allows you to safely access support files under skill directories. It guarantees safety and usability through the following mechanisms:

::: info Security Mechanism
The plugin strictly validates file paths to prevent directory traversal attacks:
- Forbidden from using `..` to access files outside the skill directory
- Forbidden from using absolute paths
- Only allows access to files within the skill directory and its subdirectories
:::

Tool execution flow:
1. Verify that the skill name exists (supports namespaces)
2. Check if the requested file path is safe
3. Read file content
4. Wrap in XML format and inject into session context
5. Return success confirmation message

::: tip File Content Persistence
File content is injected via `synthetic: true` and `noReply: true` flags, which means:
- File content becomes part of the session context
- Content remains accessible even after session compaction
- Injection doesn't trigger an immediate AI response
:::

## Follow Along

### Step 1: Read Skill Documentation

Assume there's detailed usage documentation in the skill directory:

```
User input:
Read the git-helper documentation

System call:
read_skill_file(skill="git-helper", filename="docs/usage-guide.md")

System response:
File "docs/usage-guide.md" from skill "git-helper" loaded.
```

File content will be injected into the session context in XML format:

```xml
<skill-file skill="git-helper" file="docs/usage-guide.md">
  <metadata>
    <directory>/path/to/project/.opencode/skills/git-helper</directory>
  </metadata>

  <content>
# Git Helper Usage Guide

This skill provides guidance for Git branch management, commit conventions, and collaboration workflows...

[Documentation content continues]
  </content>
</skill-file>
```

**You should see**: A success message, with file content injected into the session context.

### Step 2: Read Configuration Examples

View the skill's example configuration:

```
User input:
Show docker-helper's configuration example

System call:
read_skill_file(skill="docker-helper", filename="config/docker-compose.yml.example")

System response:
File "config/docker-compose.yml.example" from skill "docker-helper" loaded.
```

**You should see**: Configuration file content injected, and AI can reference the example to generate actual configuration for you.

### Step 3: Read Files Using Namespaces

If there are skills with the same name at both project and user levels:

```
User input:
Read the build script from project:build-helper

System call:
read_skill_file(skill="project:build-helper", filename="scripts/build.sh")

System response:
File "scripts/build.sh" from skill "build-helper" loaded.
```

**You should see**: The namespace clearly specifies the skill's source.

### Step 4: Handle File Not Found

If you attempt to read a non-existent file:

```
User input:
Read api-docs.md from git-helper

System call:
read_skill_file(skill="git-helper", filename="api-docs.md")

System response:
File "api-docs.md" not found. Available files: docs/usage-guide.md, examples/branch-flow.md, README.md, SKILL.md
```

The tool will list all available files in the skill directory, helping you find the correct filename.

**You should see**: An error message and a list of available files.

### Step 5: Experience Path Security Protection

Attempt to access files outside the skill directory:

```
User input:
Read the parent directory file from git-helper

System call:
read_skill_file(skill="git-helper", filename="../secrets.txt")

System response:
Invalid path: cannot access files outside skill directory.
```

The tool will reject any request attempting to access files outside the skill directory.

**You should see**: A path security error message.

## Checkpoint ✅

- [ ] Can you use `read_skill_file` to read skill files?
- [ ] Can you understand the purpose of the path security mechanism?
- [ ] Can you identify the XML format of file content injection?
- [ ] Can you find the list of available files from error messages?
- [ ] Can you use namespaces to precisely locate skills?

## Common Pitfalls

### Pitfall 1: Incorrect File Path

If you forget that the file is in a subdirectory:

```
User input:
Read usage-guide.md from git-helper

System response:
File "usage-guide.md" not found. Available files: docs/usage-guide.md, examples/branch-flow.md, README.md
```

**Cause**: The file might be in a subdirectory and requires a relative path.

**Solution**: Use the full path, such as `docs/usage-guide.md`.

### Pitfall 2: Ignoring Namespace Conflicts

When skills with the same name exist in multiple namespaces:

```
User input:
Read the README from build-helper

System response:
File "README.md" from skill "build-helper" loaded.
```

You might be reading a project-level skill, but expected a user-level skill.

**Solution**: Use the namespace to explicitly specify, such as `read_skill_file(skill="user:build-helper", filename="README.md")`.

### Pitfall 3: Attempting Path Traversal

Try using `..` to access parent directories:

```
User input:
Read a file outside the skill directory

System call:
read_skill_file(skill="my-skill", filename="../../../etc/passwd")

System response:
Invalid path: cannot access files outside skill directory.
```

**Cause**: This is a security restriction to prevent directory traversal attacks.

**Solution**: Only access files within the skill directory. For other files, have the AI use the `Read` tool directly.

### Pitfall 4: File Already Exists in Session Context

If you've already loaded a skill, file content might be in the skill's SKILL.md or other injected content:

```
User input:
Read the skill's core documentation

System call:
read_skill_file(skill="my-skill", filename="core-guide.md")
```

But this might be unnecessary, as core content is usually in SKILL.md.

**Solution**: First check the content of loaded skills to confirm if additional files are needed.

## Summary

The `read_skill_file` tool allows you to safely access support files under skill directories:

- **Secure Path Checks**: Prevents directory traversal, only allows access to files within the skill directory
- **XML Injection Mechanism**: File content is wrapped in `<skill-file>` XML tags with metadata
- **User-Friendly Errors**: When files don't exist, lists available files to help you find the correct path
- **Namespace Support**: Can use `namespace:skill-name` to precisely locate skills with the same name
- **Context Persistence**: Through the `synthetic: true` flag, file content remains accessible even after session compaction

This tool is perfect for reading a skill's:
- Detailed documentation (`docs/` directory)
- Configuration examples (`config/` directory)
- Code examples (`examples/` directory)
- README and documentation files
- Script source code (if you need to view the implementation)

## Next Up

> In the next lesson, we'll learn **[Claude Code Skill Compatibility](../../advanced/claude-code-compatibility/)**.
>
> You'll learn:
> - How the plugin is compatible with Claude Code's skill and plugin systems
> - Understand tool mapping mechanisms (converting Claude Code tools to OpenCode tools)
> - Master methods for discovering skills from Claude Code installation locations

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-24

| Feature | File Path | Line |
| ----------- | ------------------------------------------------------------------------------------------- | ------- |
| ReadSkillFile tool definition | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L74-L135) | 74-135 |
| Path security check | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L130-L133) | 130-133 |
| List skill files | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L289-L316) | 289-316 |
| resolveSkill function | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L269-L283) | 269-283 |
| injectSyntheticContent function | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L147-L162) | 147-162 |

**Key Types**:
- `Skill`: Skill metadata interface (`skills.ts:43-52`)
- `OpencodeClient`: OpenCode SDK client type (`utils.ts:140`)
- `SessionContext`: Session context containing model and agent information (`utils.ts:142-145`)

**Key Functions**:
- `ReadSkillFile(directory: string, client: OpencodeClient)`: Returns tool definition, handles skill file reading
- `isPathSafe(basePath: string, requestedPath: string): boolean`: Validates whether a path is within the base directory, prevents directory traversal
- `listSkillFiles(skillPath: string, maxDepth: number = 3): Promise<string[]>`: Lists all files in the skill directory (excluding SKILL.md)
- `resolveSkill(skillName: string, skillsByName: Map<string, Skill>): Skill | null`: Supports `namespace:skill-name` format skill resolution
- `injectSyntheticContent(client, sessionID, text, context)`: Injects content into session via `noReply: true` and `synthetic: true`

**Business Rules**:
- Path security check uses `path.resolve()` to verify, ensuring the resolved path starts with the base directory (`utils.ts:131-132`)
- When file doesn't exist, attempts `fs.readdir()` to list available files, providing friendly error messages (`tools.ts:126-131`)
- File content is wrapped in XML format with `skill`, `file` attributes and `<metadata>`, `<content>` tags (`tools.ts:111-119`)
- When injecting, gets the current session's model and agent context to ensure content is injected into the correct context (`tools.ts:121-122`)

**Security Mechanisms**:
- Directory traversal protection: `isPathSafe()` checks if path is within base directory (`utils.ts:130-133`)
- Provides fuzzy matching suggestions when skill doesn't exist (`tools.ts:90-95`)
- Lists available files when file doesn't exist, helping users find the correct path (`tools.ts:126-131`)

</details>
