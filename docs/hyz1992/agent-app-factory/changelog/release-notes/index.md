---
title: "Changelog: Version History and Feature Changes | Agent App Factory"
sidebarTitle: "Changelog"
subtitle: "Changelog: Version History and Feature Changes | Agent App Factory"
description: "Learn about Agent App Factory's version update history, feature changes, bug fixes, and major improvements. This page details the complete change history starting from version 1.0.0, including core features like the 7-stage pipeline system, Sisyphus scheduler, permission management, context optimization, and failure handling strategies."
tags:
  - "changelog"
  - "version history"
prerequisite: []
order: 250
---

# Changelog

This page records Agent App Factory's version update history, including new features, improvements, bug fixes, and breaking changes.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) specification, and version numbers follow [Semantic Versioning](https://semver.org/).

## [1.0.0] - 2024-01-29

### Added

**Core Features**
- **7-Stage Pipeline System**: Complete automated workflow from idea to runnable application
  - Bootstrap - Structure product idea (input/idea.md)
  - PRD - Generate product requirements document (artifacts/prd/prd.md)
  - UI - Design UI structure and previewable prototype (artifacts/ui/)
  - Tech - Design technical architecture and Prisma data model (artifacts/tech/)
  - Code - Generate frontend and backend code (artifacts/backend/, artifacts/client/)
  - Validation - Validate code quality (artifacts/validation/report.md)
  - Preview - Generate deployment guide (artifacts/preview/README.md)

- **Sisyphus Scheduler**: Core control component of the pipeline
  - Execute each Stage defined in pipeline.yaml in sequence
  - Validate input/output and exit criteria for each stage
  - Maintain pipeline state (.factory/state.json)
  - Perform permission checks to prevent Agent from unauthorized read/write
  - Handle exceptional situations based on failure policy
  - Pause at each checkpoint, waiting for manual confirmation to continue

**CLI Tools**
- `factory init` - Initialize Factory project
- `factory run [stage]` - Run pipeline (from current or specified stage)
- `factory continue` - Continue execution in new session (saves Token)
- `factory status` - View current project status
- `factory list` - List all Factory projects
- `factory reset` - Reset current project state

**Permissions & Security**
- **Capability Boundary Matrix** (capability.matrix.md): Define strict read/write permissions for each Agent
  - Each Agent can only access authorized directories
  - Unauthorized file writes are moved to artifacts/_untrusted/
  - Automatically pause pipeline after failure, waiting for manual intervention

**Context Optimization**
- **Sub-session Execution**: Each stage executes in a new session
  - Avoid context accumulation, save Token
  - Support interrupt recovery
  - Compatible with all AI assistants (Claude Code, OpenCode, Cursor)

**Failure Handling Strategy**
- Automatic retry mechanism: Each stage allows one retry
- Failure archiving: Failed artifacts are moved to artifacts/_failed/
- Rollback mechanism: Roll back to the last successful checkpoint
- Manual intervention: Pause after two consecutive failures

**Quality Assurance**
- **Code Standards** (code-standards.md)
  - TypeScript coding standards and best practices
  - File structure and naming conventions
  - Comment and documentation requirements
  - Git commit message specification (Conventional Commits)

- **Error Code Standards** (error-codes.md)
  - Unified error code structure: [MODULE]_[ERROR_TYPE]_[SPECIFIC]
  - Standard error types: VALIDATION, NOT_FOUND, FORBIDDEN, CONFLICT, INTERNAL_ERROR
  - Frontend and backend error code mapping and user-friendly prompts

**Changelog Management**
- Follow Keep a Changelog format
- Integration with Conventional Commits
- Automated tool support: conventional-changelog-cli, release-it

**Configuration Templates**
- CI/CD configuration (GitHub Actions)
- Git Hooks configuration (Husky)

**Generated Application Features**
- Complete frontend and backend code (Express + Prisma + React Native)
- Unit tests and integration tests (Vitest + Jest)
- API documentation (Swagger/OpenAPI)
- Database seed data
- Docker deployment configuration
- Error handling and log monitoring
- Performance optimization and security checks

### Changed

**MVP Focus**
- Explicitly list non-goals to prevent scope creep
- Limit number of pages to within 3 pages
- Focus on core features, avoid over-engineering

**Responsibility Separation**
- Each Agent is responsible for their own domain only, not crossing boundaries
- PRD does not contain technical details, Tech does not involve UI design
- Code Agent implements strictly according to UI Schema and Tech design

**Verifiability**
- Each stage defines clear exit_criteria
- All features must be testable and runnable locally
- Artifacts must be structured and consumable by downstream

### Tech Stack

**CLI Tools**
- Node.js >= 16.0.0
- Commander.js - Command line framework
- Chalk - Colored terminal output
- Ora - Progress indicator
- Inquirer - Interactive command line
- fs-extra - File system operations
- YAML - YAML parsing

**Generated Applications**
- Backend: Node.js + Express + Prisma + TypeScript + Vitest
- Frontend: React Native + Expo + TypeScript + Jest + React Testing Library
- Deployment: Docker + GitHub Actions

### Dependencies

- `chalk@^4.1.2` - Terminal color styling
- `commander@^11.0.0` - Command line argument parsing
- `fs-extra@^11.1.1` - File system extensions
- `inquirer@^8.2.5` - Interactive command line
- `ora@^5.4.1` - Elegant terminal spinner
- `yaml@^2.3.4` - YAML parsing and serialization

## Version Notes

### Semantic Versioning

This project follows [Semantic Versioning](https://semver.org/) version number format: MAJOR.MINOR.PATCH

- **MAJOR**: Incompatible API changes
- **MINOR**: Backwards-compatible new features
- **PATCH**: Backwards-compatible bug fixes

### Change Types

- **Added**: New features
- **Changed**: Changes to existing features
- **Deprecated**: Features that will be removed
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Security fixes

## Related Resources

- [GitHub Releases](https://github.com/hyz1992/agent-app-factory/releases) - Official release page
- [Project Repository](https://github.com/hyz1992/agent-app-factory) - Source code
- [Issue Tracker](https://github.com/hyz1992/agent-app-factory/issues) - Report issues and suggestions
- [Contributing Guide](https://github.com/hyz1992/agent-app-factory/blob/main/CONTRIBUTING.md) - How to contribute

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2024-01-29

| Feature | File Path | Line Range |
|---------|-----------|------------|
| package.json | [`package.json`](https://github.com/hyz1992/agent-app-factory/blob/main/package.json) | 1-52 |
| CLI Entry | [`cli/bin/factory.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/bin/factory.js) | 1-123 |
| Init Command | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js) | 1-427 |
| Run Command | [`cli/commands/run.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/run.js) | 1-294 |
| Continue Command | [`cli/commands/continue.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/continue.js) | 1-87 |
| Pipeline Definition | [`pipeline.yaml`](https://github.com/hyz1992/agent-app-factory/blob/main/pipeline.yaml) | 1-87 |
| Scheduler Definition | [`agents/orchestrator.checkpoint.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/orchestrator.checkpoint.md) | 1-301 |
| Permission Matrix | [`policies/capability.matrix.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/capability.matrix.md) | 1-44 |
| Failure Policy | [`policies/failure.policy.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/failure.policy.md) | 1-200 |
| Code Standards | [`policies/code-standards.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/code-standards.md) | 1-287 |
| Error Code Standards | [`policies/error-codes.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/error-codes.md) | 1-134 |
| Changelog Specification | [`policies/changelog.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/changelog.md) | 1-87 |

**Key Version Information**:
- `version = "1.0.0"`: Initial release version
- `engines.node = ">=16.0.0"`: Minimum Node.js version requirement

**Dependency Versions**:
- `chalk@^4.1.2`: Terminal color styling
- `commander@^11.0.0`: Command line argument parsing
- `fs-extra@^11.1.1`: File system extensions
- `inquirer@^8.2.5`: Interactive command line
- `ora@^5.4.1`: Elegant terminal spinner
- `yaml@^2.3.4`: YAML parsing and serialization

</details>
