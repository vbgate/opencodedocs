---
title: "Loading Skills: Session Context | opencode-agent-skills"
sidebarTitle: "Loading Skills"
subtitle: "Loading Skills into Session Context"
description: "Master loading skills into session context via use_skill tool. Understand XML injection, synthetic messages, and compression recovery mechanisms."
tags:
  - "skill loading"
  - "XML injection"
  - "context management"
prerequisite:
  - "start-creating-your-first-skill"
  - "platforms-listing-available-skills"
order: 3
---

# Loading Skills into Session Context

## What You'll Learn

- Use the `use_skill` tool to load skills into the current session
- Understand how skill content is injected into context in XML format
- Master the Synthetic Message Injection mechanism
- Understand skill metadata structure (source, directory, scripts, files)
- Learn how skills remain available after session compression

## Your Current Problem

You've created a skill, but the AI seems unable to access its content. Or in long conversations, skill guidance suddenly disappears and the AI forgets previous rules. These issues are related to the skill loading mechanism.

## When to Use This

- **Manual skill loading**: Directly specify the required skill when AI auto-recommendation isn't appropriate
- **Long session persistence**: Ensure skill content remains accessible after context compression
- **Claude Code compatibility**: Load Claude-format skills with tool mapping
- **Precise control**: Load specific skill versions via namespace

## Core Concept

The `use_skill` tool injects the skill's SKILL.md content into the session context, enabling the AI to follow rules and workflows defined in the skill.

### XML Content Injection

Skill content is injected in structured XML format, consisting of three parts:

```xml
<skill name="skill-name">
  <metadata>
    <source>Skill source label</source>
    <directory>Skill directory path</directory>
    <scripts>
      <script>tools/script1.sh</script>
    </scripts>
    <files>
      <file>docs/guide.md</file>
    </files>
  </metadata>

  <tool-mapping>
    <!-- Claude Code tool mapping -->
  </tool-mapping>

  <content>
    Complete content of SKILL.md
  </content>
</skill>
```

### Synthetic Message Injection

The plugin uses the OpenCode SDK's `session.prompt()` method to inject skill content, setting two key flags:

::: info Synthetic Message Injection
- `noReply: true` - AI won't respond to the injection itself
- `synthetic: true` - Marks the message as system-generated (hidden from user, not counted as user input)
:::

This means:
- **Invisible to users**: Skill injection doesn't appear in conversation history
- **No input consumption**: Doesn't count toward user message count
- **Persistent availability**: Even after session compression, skill content remains in context

### Session Lifecycle

1. **On first message**: Plugin automatically injects `<available-skills>` list showing all available skills
2. **Using `use_skill`**: Injects the selected skill's XML content into context
3. **After session compression**: Plugin listens for `session.compacted` event and re-injects skill list

## Follow Along

### Step 1: Load a Basic Skill

In OpenCode, ask the AI to load a skill:

```
User input:
Load the brainstorming skill

System response:
Skill "brainstorming" loaded.
```

**What you should see**: AI returns a loading success message, and skill content has been injected into context.

Now you can test if the AI follows skill rules:

```
User input:
Help me write a product description

System response:
(AI generates content according to brainstorming skill rules, following its techniques and workflow)
```

### Step 2: View Available Resources After Loading

When loading a skill, the system returns a list of available scripts and files:

```
User input:
Load git-helper

System response:
Skill "git-helper" loaded.
Available scripts: tools/branch.sh, tools/commit.sh
Available files: docs/usage.md, examples/workflow.md
```

This information tells you what resources are available in the skill directory:
- **Scripts**: Can be executed with the `run_skill_script` tool
- **Files**: Can be read with the `read_skill_file` tool

**What you should see**: A loading success message followed by a list of optional scripts and files.

### Step 3: Load Same-Named Skills Using Namespace

Suppose both project-level and user-level have a `build-helper` skill:

```
User input:
Load build-helper

System response:
Skill "build-helper" loaded.
Available scripts: build.sh, optimize.sh

User input:
(Check which version of build-helper was loaded)
```

Based on skill discovery priority, the project-level skill is loaded by default. If you need the user-level one:

```
User input:
Load user:build-helper

System response:
Skill "build-helper" loaded.
Available scripts: ci.sh, test.sh
Available files: README.md
```

**What you should see**: Using the `namespace:skill-name` format to load different versions of same-named skills from different sources.

### Step 4: Experience Skill Guidance Effect

After loading a skill, the AI's behavior should follow the rules defined in the skill. Taking the brainstorming skill as an example:

```
User input:
Load brainstorming
Help me brainstorm core selling points for a smart home product

System response:
(AI will use techniques defined in the brainstorming skill, such as:
- List possible directions first, then explore deeply
- Avoid judging ideas too early
- Use "Yes, and..." to expand thoughts
- Record all ideas before filtering)

Let's start by listing possible directions:
1. Convenient control
2. Energy management
3. Security protection
...
```

**What you should see**: The AI's response style and workflow are consistent with what's defined in the skill.

### Step 5: Understand Skill Persistence in Long Sessions

Conduct a long conversation and observe whether the skill remains effective:

```
User input:
Load docker-helper
(Conduct multiple rounds of dialogue involving building, deployment, etc.)
...
(Assume the conversation is very long and triggers OpenCode's context compression)
User input:
Continue the previous Docker deployment

System response:
(AI can still access docker-helper content
because the plugin re-injected the skill list after compression)
```

::: tip Compression Recovery Mechanism
The plugin listens for the `session.compacted` event and re-injects the skill list when the session is compressed, ensuring loaded skills remain accessible after compression.
:::

**What you should see**: Even with long conversations and compressed context, AI can still access skill content.

### Step 6: Load Claude Code Format Skills

If you have Claude Code skills, they will be automatically discovered:

```
User input:
List all available skills

System response:
...
claude-code-superpowers (claude-plugins)
  Complete software development workflow

User input:
Load claude-code-superpowers

System response:
Skill "claude-code-superpowers" loaded.
```

When loading Claude-format skills, tool mappings are automatically injected (toolTranslation), mapping Claude's tool names to OpenCode's tools:

::: info Tool Mapping Example
- Claude's `TodoWrite` → OpenCode's `todowrite`
- Claude's `Task` → OpenCode's `task` (sub-agent)
- Claude's `Bash` → OpenCode's `bash`
:::

**What you should see**: Skill loads successfully, and AI can understand and use Claude-format workflows.

## Checkpoint ✅

- [ ] Can you use `use_skill` to load skills?
- [ ] Do you understand the mechanism of skill content injection in XML format?
- [ ] Can you name the two key flags of synthetic messages?
- [ ] Can you explain why skills remain available after session compression?
- [ ] Can you use namespace to load different versions of same-named skills?

## Common Pitfalls

### Pitfall 1: Misspelled Skill Name

If you enter an incorrect skill name:

```
User input:
Load brainstormig

System response:
Skill "brainstormig" not found. Did you mean "brainstorming"?
```

The plugin provides fuzzy matching suggestions based on edit distance.

**Solution**: Check spelling or use `get_available_skills` to see correct names.

### Pitfall 2: Confusion with Same-Named Skills

If project-level and user-level have same-named skills, you might load the wrong version:

```
User input:
Load build-helper

System response:
Skill "build-helper" loaded.
Available scripts: build.sh, optimize.sh  # This is project-level

User expected to load user-level, but project-level was loaded by default
```

**Solution**: Use namespace to explicitly specify, like `user:build-helper`.

### Pitfall 3: Skill Content Not Taking Effect

Sometimes you load a skill, but the AI doesn't seem to follow the rules:

```
User input:
Load my-conventions
(Expect AI to follow code conventions)
User input:
Write a function

System response:
(AI writes code that doesn't match expected conventions)
```

**Possible reasons**:
- Skill SKILL.md content isn't clear enough
- Skill description lacks detail, causing AI understanding deviations
- Long conversation context was compressed, skill list needs re-injection

**Solutions**:
- Check if skill frontmatter and content are clear
- Explicitly tell AI to use specific rules: "Please use rules from the my-conventions skill"
- Reload the skill after compression

### Pitfall 4: Tool Mapping Issues with Claude Skills

After loading a Claude Code skill, AI may still use incorrect tool names:

```
User input:
Load claude-code-superpowers
Use TodoWrite tool

System response:
(AI might try to use incorrect tool names because mapping wasn't correct)
```

**Reason**: Tool mappings are automatically injected when loading skills, but AI may need explicit hints.

**Solution**: After loading the skill, explicitly tell AI to use the mapped tools:

```
User input:
Load claude-code-superpowers
Note to use the todowrite tool (not TodoWrite)
```

## Summary

The `use_skill` tool injects skill content into session context in XML format, implemented through the Synthetic Message Injection mechanism:

- **Structured XML injection**: Includes metadata, tool mapping, and skill content
- **Synthetic messages**: `noReply: true` and `synthetic: true` ensure messages are hidden from users
- **Persistent availability**: Even after context compression, skill content remains accessible
- **Namespace support**: `namespace:skill-name` format precisely specifies skill source
- **Claude compatibility**: Automatically injects tool mappings, supporting Claude Code skills

Skill loading is a key mechanism for making AI follow specific workflows and rules. Through content injection, AI can maintain consistent behavioral style throughout the conversation.

## Coming Next

> Next, we'll learn **[Automatic Skill Recommendation: Semantic Matching Principles](../automatic-skill-matching/)**.
>
> You'll learn:
> - Understand how plugins automatically recommend relevant skills based on semantic similarity
> - Master the basic principles of embedding models and cosine similarity calculation
> - Learn skill description optimization techniques for better recommendations
> - Understand how embedding caching improves performance

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-24

| Feature        | File Path                                                                                    | Lines   |
|--- | --- | ---|
| UseSkill tool definition | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L200-L267)         | 200-267 |
| injectSyntheticContent function | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L147-L162)    | 147-162 |
| injectSkillsList function | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L345-L370) | 345-370 |
| resolveSkill function | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L269-L283) | 269-283 |
| listSkillFiles function | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L289-L316) | 289-316 |

**Key Constants**:
- None

**Key Functions**:
- `UseSkill()`: Accepts `skill` parameter, builds XML-formatted skill content and injects into session
- `injectSyntheticContent(client, sessionID, text, context)`: Injects synthetic message via `client.session.prompt()`, setting `noReply: true` and `synthetic: true`
- `injectSkillsList()`: Injects `<available-skills>` list on first message
- `resolveSkill(skillName: string, skillsByName: Map<string, Skill>)`: Supports `namespace:skill-name` format skill resolution
- `listSkillFiles(skillPath: string, maxDepth: number)`: Recursively lists all files in skill directory (excluding SKILL.md)

**Business Rules**:
- Skill content is injected in XML format, including metadata, tool mapping, and content (`tools.ts:238-249`)
- Injected messages are marked as synthetic, not counted as user input (`utils.ts:159`)
- Loaded skills are not recommended again in current session (`plugin.ts:128-132`)
- Skill list is automatically injected on first message (`plugin.ts:70-105`)
- Skill list is re-injected after session compression (`plugin.ts:145-151`)

**XML Content Format**:
```xml
<skill name="${skill.name}">
  <metadata>
    <source>${skill.label}</source>
    <directory>${skill.path}</directory>
    <scripts>
      <script>${script.relativePath}</script>
    </scripts>
    <files>
      <file>${file}</file>
    </files>
  </metadata>

  ${toolTranslation}

  <content>
  ${skill.template}
  </content>
</skill>
```

</details>
