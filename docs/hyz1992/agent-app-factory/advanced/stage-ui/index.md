---
title: "Stage 3: UI - Design Interface and Prototype - ui-ux-pro-max Design System | Agent App Factory Tutorial"
sidebarTitle: "Design Interface and Prototype"
subtitle: "Stage 3: UI - Design Interface and Prototype"
description: "Learn how the UI stage generates professional UI schemas and previewable prototypes based on PRD. This tutorial covers UI Agent's responsibilities, ui-ux-pro-max design system usage, ui.schema.yaml standard structure, design principles, and delivery checklist."
tags:
  - "Pipeline"
  - "UI/UX"
  - "Design System"
prerequisite:
  - "stage-prd"
order: 100
---

# Stage 3: UI - Design Interface and Prototype

UI is the third stage of the Agent App Factory pipeline, responsible for transforming functional descriptions from the PRD into clear interface structures (UI Schema) and previewable prototypes. This stage determines the final application's appearance and interaction experience, serving as the critical bridge connecting product requirements with technical implementation.

## What You'll Learn

- Transform PRD into standard-compliant `ui.schema.yaml` files
- Use ui-ux-pro-max skill to generate professional design systems (styles, colors, fonts)
- Create previewable prototypes (HTML + CSS + JS) in the browser
- Understand UI Agent's responsibility boundaries (visual design only, no technical implementation)
- Avoid common AI design pitfalls (such as overusing purple gradients and Inter font)

## Your Current Dilemma

You may have a clear PRD but don't know how to start designing the interface:

- "The PRD is ready, but I can't think of a suitable UI style" (lack of design system knowledge)
- "Don't know what colors, fonts, or layouts to use" (relying on personal taste instead of professional standards)
- "The generated prototype doesn't match the PRD" (interface structure disconnected from functional requirements)
- "Afraid the design is too ugly or too flashy, doesn't fit product positioning" (lack of industry design experience)

This design blindness leads to the subsequent Code stage lacking clear visual guidelines, resulting in applications with chaotic appearances and inconsistent interactions.

## When to Use This Approach

When your PRD is complete and meets the following conditions:

1. **Clear PRD document** (includes user stories, feature list, non-goals)
2. **Haven't started interface design yet** (UI is the first design stage)
3. **Haven't decided on tech stack** (implementation details are in Tech stage)
4. **Want to control design scope, avoid over-design** (UI stage limited to no more than 3 pages)

## 🎒 Preparation Before Starting

::: warning Prerequisites
Before starting the UI stage, please ensure:

- ✅ Completed [PRD stage](../stage-prd/), `artifacts/prd/prd.md` has been generated
- ✅ Installed ui-ux-pro-max plugin (recommended: execute [factory init](../../start/installation/) to install automatically)
- ✅ Understood [7-stage pipeline overview](../../start/pipeline-overview/)
- ✅ Ready AI assistant (recommend Claude Code)
:::

## Core Concepts

### What is the UI Stage?

The **UI Stage** is the bridge connecting product requirements with technical implementation. Its sole responsibility is to **transform functional descriptions from the PRD into interface structures and visual specifications**.

::: info Not Frontend Development
The UI Agent is not a frontend development engineer. It doesn't write React components or CSS code. Its tasks are:
- Analyze functional requirements from the PRD
- Define interface information architecture (pages and components)
- Generate design system (colors, fonts, spacing, border radius)
- Create previewable prototypes (HTML + CSS + JS)

It doesn't decide "which framework to implement with," only decides "what it looks like."
:::

### Why Do We Need a Design System?

Imagine house renovation without a design system:

- ❌ No design system: Living room uses minimalist style, bedroom uses retro style, kitchen uses industrial style, overall chaotic
- ✅ With design system: Unified color scheme, unified style, unified materials throughout the house, coordinated and consistent

The UI stage generates this "house decoration guide" through the ui-ux-pro-max skill, ensuring all interfaces generated in the subsequent Code stage follow unified visual specifications.

### Output File Structure

The UI stage generates three files:

| File | Content | Purpose |
|------|---------|---------|
| **ui.schema.yaml** | Design system configuration + page structure definition | Tech stage reads this file to design data models, Code stage reads this file to generate interfaces |
| **preview.web/index.html** | Previewable prototype in browser | Let you see the interface effect in advance and verify if design meets expectations |
| **design-system.md** (optional) | Persistent design system documentation | Record design decisions for future adjustments |

## Follow Along

### Step 1: Confirm PRD is Complete

Before starting the UI stage, ensure `artifacts/prd/prd.md` exists with complete content.

**Checkpoints ✅**:

1. **Is the target audience clear?**
   - ✅ Has specific persona (age/occupation/technical ability)
   - ❌ Vague: "everyone"

2. **Are core features listed?**
   - ✅ Has 3-7 key features
   - ❌ Too many or too few

3. **Are non-goals sufficient?**
   - ✅ At least 3 features not to do are listed
   - ❌ Missing or too few

::: tip If PRD is incomplete
Return to [PRD stage](../stage-prd/) to modify first, ensuring design has clear input.
:::

### Step 2: Start Pipeline to UI Stage

Execute in the Factory project directory:

```bash
# Continue from PRD stage (if PRD stage just completed)
factory continue

# Or directly specify starting from ui
factory run ui
```

The CLI will display current status and available stages.

### Step 3: AI Assistant Reads UI Agent Definition

The AI assistant (such as Claude Code) will automatically read `agents/ui.agent.md` to understand its responsibilities and constraints.

::: info Agent Responsibilities
The UI Agent can only:
- Read `artifacts/prd/prd.md`
- Write to `artifacts/ui/`
- Use ui-ux-pro-max skill to generate design system
- Create prototypes with no more than 3 pages

It cannot:
- Read other files
- Write to other directories
- Decide tech stack (these are in Tech stage)
- Use AI default styles (purple gradients, Inter font)
:::

### Step 4: Force Use of ui-ux-pro-max Design System (Critical Step)

This is the core step of the UI stage. The AI assistant **must** first call the `ui-ux-pro-max` skill, even if you think the design direction is clear.

**Purpose of ui-ux-pro-max skill**:

1. **Auto-recommend design system**: Automatically matches best styles based on product type and industry domain
2. **Provide 67 UI styles**: From minimalism to Neo-Brutalism
3. **Provide 96 color palettes**: Pre-designed by industry and style
4. **Provide 57 font combinations**: Avoid common AI styles (Inter, Roboto)
5. **Apply 100 industry reasoning rules**: Ensure design fits product positioning

**What the AI assistant will do**:
- Extract key information from PRD: product type, industry domain, target users
- Call `ui-ux-pro-max` skill to get complete design system recommendations
- Apply the recommended design system to `ui.schema.yaml` and prototypes

::: danger Skipping this step will be rejected
The Sisyphus scheduler will verify whether the ui-ux-pro-max skill was used. If not, the UI Agent's artifacts will be rejected and require re-execution.
:::

**What does the design system include?**

```yaml
design_system:
  style: "Glassmorphism"           # Selected style (e.g., glassmorphism, minimalism)
  colors:
    primary: "#2563eb"             # Primary color (for primary actions)
    secondary: "#64748b"           # Secondary color
    success: "#10b981"             # Success color
    warning: "#f59e0b"             # Warning color
    error: "#ef4444"               # Error color
    background: "#ffffff"          # Background color
    surface: "#f8fafc"            # Surface color
    text:
      primary: "#1e293b"           # Primary text
      secondary: "#64748b"         # Secondary text
  typography:
    font_family:
      headings: "DM Sans"          # Heading font (avoid Inter)
      body: "DM Sans"              # Body font
    font_size:
      base: 16
      lg: 18
      xl: 20
      2xl: 24
  spacing:
    unit: 8                        # Spacing base (8px grid)
  border_radius:
    md: 8
    lg: 12
  effects:
    hover_transition: "200ms"      # Hover transition time
    blur: "backdrop-blur-md"       # Frosted glass effect
```

### Step 5: Design Interface Structure

The AI assistant will design interface information architecture (pages and components) based on functional requirements from the PRD.

**Interface Structure Example** (from `ui.schema.yaml`):

```yaml
pages:
  - id: home
    title: "Home"
    type: list
    description: "Display all project list"
    components:
      - type: header
        content: "My App"
      - type: list
        source: "api/items"
        item_layout:
          - type: text
            field: "title"
            style: "heading"
          - type: text
            field: "description"
            style: "body"
        actions:
          - type: "navigate"
            target: "detail"
            params: ["id"]

  - id: detail
    title: "Detail"
    type: detail
    params:
      - name: "id"
        type: "number"

  - id: create
    title: "Create"
    type: form
    fields:
      - name: "title"
        type: "text"
        label: "Title"
        required: true
    submit:
      action: "post"
      endpoint: "/api/items"
      on_success: "navigate:home"
```

**Page types**:
- `list`: List page (e.g., home page, search results)
- `detail`: Detail page (e.g., viewing project details)
- `form`: Form page (e.g., create, edit)

### Step 6: Create Preview Prototype

The AI assistant will create previewable prototypes using HTML + CSS + JS, demonstrating key interaction flows.

**Prototype characteristics**:
- Use native technologies (no framework dependencies)
- Apply design system recommended colors, fonts, effects
- All clickable elements have hover states and `cursor-pointer`
- Mobile-first design (responsive correctly at 375px and 768px)
- Use SVG icons (Heroicons/Lucide), not emoji

**How to preview**:
Open `artifacts/ui/preview.web/index.html` in a browser to view the prototype.

### Step 7: Confirm UI Output

After the UI Agent completes, you need to check the output files.

**Checkpoints ✅**:

1. **Does ui.schema.yaml exist?**
   - ✅ File exists in `artifacts/ui/` directory
   - ❌ Missing or wrong path

2. **Did the design system use ui-ux-pro-max skill?**
   - ✅ Clearly stated in output or schema
   - ❌ Self-selected design system

3. **Is the page count no more than 3?**
   - ✅ 1-3 pages (MVP focuses on core features)
   - ❌ More than 3 pages

4. **Can the prototype be opened in a browser?**
   - ✅ Opening `preview.web/index.html` in browser displays correctly
   - ❌ Cannot open or displays errors

5. **Did it avoid AI default styles?**
   - ✅ No purple/pink gradients
   - ✅ No Inter font used
   - ✅ Used SVG icons (not emoji)
   - ❌ Above AI styles appear

6. **Do all clickable elements have interaction feedback?**
   - ✅ Have `cursor-pointer` and hover states
   - ✅ Smooth transitions (150-300ms)
   - ❌ No interaction indication or instant changes

### Step 8: Choose to Continue, Retry, or Pause

After confirmation, the CLI will display options:

```bash
Choose an action:
[1] Continue (enter Tech stage)
[2] Retry (regenerate UI)
[3] Pause (continue later)
```

::: tip Recommend previewing prototype first
Before confirming in the AI assistant, open the prototype in a browser first to verify if the design meets expectations. Once entering the Tech stage, modifying the design will be more costly.
:::

## Common Pitfalls

### Pitfall 1: Not Using ui-ux-pro-max Skill

**Wrong example**:
```
The AI assistant self-selected glassmorphism style and blue color scheme
```

**Consequence**: The Sisyphus scheduler will reject the artifacts and require re-execution.

**Recommendation**:
```
The AI assistant must first call the ui-ux-pro-max skill to get recommended design system
```

### Pitfall 2: Using AI Default Styles

**Wrong examples**:
- Purple/pink gradient backgrounds
- Inter or Roboto fonts
- Emoji as UI icons

**Consequence**: Design looks unprofessional, easily identifiable as AI-generated, affecting product image.

**Recommendations**:
- Choose from 57 font combinations recommended by ui-ux-pro-max
- Use SVG icon libraries (Heroicons/Lucide)
- Avoid overusing gradients and neon colors

### Pitfall 3: Page Count Exceeds 3

**Wrong example**:
```
Generated 5 pages: home, detail, create, edit, settings
```

**Consequence**: MVP scope out of control, Tech and Code stage workload increases significantly.

**Recommendation**: Control to 1-3 pages, focus on core usage paths.

### Pitfall 4: Prototype Lacks Interaction Feedback

**Wrong example**:
```
Buttons have no hover state, links have no cursor-pointer
```

**Consequence**: Poor user experience, prototype doesn't feel real.

**Recommendation**: Add `cursor-pointer` and hover states to all clickable elements (150-300ms transition).

### Pitfall 5: Insufficient Contrast in Light Mode

**Wrong example**:
```
Glass card background color bg-white/10 (too transparent), text color #94A3B8 (too light)
```

**Consequence**: Content not visible in light mode, accessibility doesn't meet standards.

**Recommendations**:
- Light mode glass cards use `bg-white/80` or higher
- Text contrast ratio >= 4.5:1 (WCAG AA standard)

### Pitfall 6: Prototype and Schema Inconsistent

**Wrong example**:
```
2 pages defined in schema, but 3 pages shown in prototype
```

**Consequence**: Tech and Code stages will be confused, not knowing which to follow.

**Recommendation**: Ensure prototype and schema are completely consistent, page count and component structure must correspond.

## Lesson Summary

The core of the UI stage is the **design system**:

1. **Input**: Clear PRD document (`artifacts/prd/prd.md`)
2. **Process**: AI assistant generates professional design system through ui-ux-pro-max skill
3. **Output**: `ui.schema.yaml` (design system + interface structure) + `preview.web/index.html` (previewable prototype)
4. **Validation**: Check if design system is professional, prototype is previewable, AI default styles are avoided

::: tip Key Principles
- ❌ What NOT to do: Don't decide tech stack, don't write frontend code, don't use AI default styles
- ✅ What ONLY to do: Generate design system, design interface structure, create previewable prototype
:::

## Next Lesson Preview

> Next lesson we'll learn **[Stage 4: Tech - Design Technical Architecture](../stage-tech/)**.
>
> You'll learn:
> - How to design technical architecture based on PRD and UI Schema
> - How to choose appropriate tech stack (Express + Prisma + React Native)
> - How to design minimal viable data models (Prisma Schema)
> - Why Tech stage cannot involve UI implementation details

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-29

| Function | File Path | Line Numbers |
| -------- | --------------------------------------------------------- | ------------ |
| UI Agent definition | [`agents/ui.agent.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/ui.agent.md) | 1-98 |
| UI Skill | [`skills/ui/skill.md`](https://github.com/hyz1992/agent-app-factory/blob/main/skills/ui/skill.md) | 1-430 |
| Pipeline definition (UI stage) | [`pipeline.yaml`](https://github.com/hyz1992/agent-app-factory/blob/main/pipeline.yaml) | 34-47 |
| Scheduler definition | [`agents/orchestrator.checkpoint.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/orchestrator.checkpoint.md) | 1-100+ |

**Key constraints**:
- **Mandatory use of ui-ux-pro-max skill**: ui.agent.md:33, 53-54
- **Prohibit AI style colors**: ui.agent.md:36
- **Prohibit emoji icons**: ui.agent.md:37
- **Must add cursor-pointer and hover states**: ui.agent.md:38
- **Prototype pages no more than 3**: ui.agent.md:34
- **Use native HTML/CSS/JS**: ui.agent.md:35

**Exit conditions** (pipeline.yaml:43-47):
- ui.schema.yaml exists
- Page count no more than 3
- Preview page can be opened in browser
- Agent has used `ui-ux-pro-max` skill to generate design system

**UI Skill content framework**:
- **Mental framework**: Purpose, tone, differentiation, information architecture
- **Design system generation workflow**: Analyze requirements → Generate design system → Supplement search → Get tech stack guide
- **67 UI styles**: Minimalism, Neumorphism, Glassmorphism, Brutalism, etc.
- **Industry reasoning rules**: 100 rules, automatically recommend design system by product type
- **Design system guide**: Color system, typography system, spacing system, component specifications
- **Pre-delivery checklist**: Visual quality, interaction, light/dark mode, layout, accessibility
- **Decision principles**: Purpose-driven, mobile-first, accessibility, simplicity first, preview consistency, tools first
- **Don't do (NEVER)**: AI style fonts/colors, emoji icons, low contrast, more than 3 pages, etc.

</details>
