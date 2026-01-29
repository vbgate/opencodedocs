---
title: "问题排查: 故障修复 | Agent Skills"
sidebarTitle: "部署/技能故障怎么办"
subtitle: "问题排查: 故障修复"
description: "解决 Agent Skills 的网络错误、技能未激活、规则验证失败等故障。掌握快速诊断方法和修复步骤，高效排查常见问题。"
tags:
  - "FAQ"
  - "故障排查"
  - "调试"
  - "网络配置"
order: 90
prerequisite:
  - "start-getting-started"
  - "start-installation"
---

# 常见问题排查

## 学完你能做什么

- 快速诊断并解决部署时的网络错误
- 修复技能未激活的问题
- 处理规则验证失败的错误
- 识别框架检测不准确的原因

## 部署相关问题

### Network Egress Error（网络错误）

**问题**：部署到 Vercel 时出现网络错误，提示无法访问外部网络。

**原因**：在 claude.ai 环境中，默认限制了网络访问权限。`vercel-deploy-claimable` 技能需要访问 `*.vercel.com` 域名才能上传文件。

**解决方案**：

::: tip 在 claude.ai 中配置网络权限

1. 访问 [https://claude.ai/settings/capabilities](https://claude.ai/settings/capabilities)
2. 在 "Allowed Domains" 中添加 `*.vercel.com`
3. 保存设置后重新部署

:::

**验证方法**：

```bash
# 测试网络连接（不执行部署）
curl -I https://claude-skills-deploy.vercel.com/api/deploy
```

**你应该看到**：
```bash
HTTP/2 200
```

### 部署失败：无法提取 preview URL

**问题**：部署脚本运行完成，但提示 "Error: Could not extract preview URL from response"。

**原因**：部署 API 返回了错误响应（包含 `"error"` 字段），但脚本先检查的是 URL 提取失败。

根据源码 [`deploy.sh:224-229`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh#L224-L229)：

```bash
# Check for error in response
if echo "$RESPONSE" | grep -q '"error"'; then
    ERROR_MSG=$(echo "$RESPONSE" | grep -o '"error":"[^"]*"' | cut -d'"' -f4)
    echo "Error: $ERROR_MSG" >&2
    exit 1
fi
```

**解决方案**：

1. 查看完整错误响应：
```bash
# 在项目根目录再次执行部署，留意错误信息
bash skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh .
```

2. 常见错误类型：

| 错误消息            | 可能原因     | 解决方案                                    |
|--- | --- | ---|
| "File too large"    | 项目体积超限 | 排除不必要的文件（如 `*.log`、`*.test.ts`） |
| "Invalid framework" | 框架识别失败 | 添加 `package.json` 或手动指定框架          |
| "Network timeout"   | 网络超时     | 检查网络连接，重试部署                      |

**预防措施**：

部署脚本会自动排除 `node_modules` 和 `.git`（见源码 [`deploy.sh:210`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh#L210)），但你可以进一步优化：

```bash
# 修改 deploy.sh，添加更多排除项
tar -czf "$TARBALL" -C "$PROJECT_PATH" \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='*.log' \
  --exclude='coverage' \
  --exclude='.next' \
  .
```

### 框架检测不准确

**问题**：部署时检测到的框架与实际不符，或者返回 `null`。

**原因**：框架检测依赖 `package.json` 中的依赖列表。如果缺少依赖或项目类型特殊，检测可能失败。

根据源码 [`deploy.sh:12-156`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh#L12-L156)，检测逻辑：

1. 读取 `package.json`
2. 检查特定依赖包名称
3. 按优先级顺序匹配（Blitz → Next.js → Gatsby → ...）

**解决方案**：

| 场景                          | 解决方法                                                                                                                                                                                                              |
|--- | ---|
| `package.json` 存在但检测失败 | 检查依赖是否在 `dependencies` 或 `devDependencies` 中                                                                                                                                                                 |
| 纯静态 HTML 项目              | 确保根目录有 `index.html`，脚本会自动重命名单个 HTML 文件（见源码 [`deploy.sh:198-205`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh#L198-L205)） |
| 框架不在支持列表              | 直接部署（framework 为 null），Vercel 会自动检测                                                                                                                                                                      |

**手动检查框架检测**：

```bash
# 模拟框架检测（需要 bash 环境）
grep -E '"(next|gatsby|vite|astro)"' package.json
```

## 技能激活问题

### 技能未激活

**问题**：在 Claude 中使用相关提示词（如 "Deploy my app"），但技能没有被激活。

**原因**：技能激活依赖提示词中的关键词匹配。如果关键词不明确或技能未正确加载，AI 无法识别应使用的技能。

**解决方案**：

::: warning 检查清单

1. **验证技能已安装**：
   ```bash
   # Claude Desktop 用户
   ls ~/.claude/skills/ | grep agent-skills

   # claude.ai 用户
   检查项目知识库是否包含 agent-skills
   ```

2. **使用明确的关键词**：
   - ✅ 可用：`Deploy my app to Vercel`
   - ✅ 可用：`Review this React component for performance`
   - ✅ 可用：`Check accessibility of my site`
   - ❌ 不可用：`帮我部署`（缺少关键词）

3. **重新加载技能**：
   - Claude Desktop：退出并重新启动
   - claude.ai：刷新页面或重新添加技能到项目

:::

**检查技能描述**：

每个技能的 `SKILL.md` 文件开头包含描述，说明触发关键词。例如：

- `vercel-deploy`：关键词包括 "Deploy"、"deploy"、"production"
- `react-best-practices`：关键词包括 "React"、"component"、"performance"

### Web 设计指南无法拉取规则

**问题**：使用 `web-design-guidelines` 技能时，提示无法从 GitHub 拉取规则。

**原因**：该技能需要访问 GitHub 仓库获取最新规则，但 claude.ai 默认限制网络访问。

**解决方案**：

1. 在 [https://claude.ai/settings/capabilities](https://claude.ai/settings/capabilities) 中添加：
   - `raw.githubusercontent.com`
   - `github.com`

2. 验证网络访问：
```bash
# 测试规则源是否可访问
curl -I https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md
```

**备用方案**：如果网络受限，手动下载规则文件并放在本地，修改技能定义指向本地路径。

## 规则验证问题

### VALIDATION_ERROR

**问题**：运行 `pnpm validate` 时报错，提示规则验证失败。

**原因**：规则文件格式不符合规范，缺少必填字段或示例代码。

根据源码 [`validate.ts:21-66`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/validate.ts#L21-L66)，验证规则包括：

1. **title 非空**：规则必须有标题
2. **explanation 非空**：规则必须有说明
3. **examples 非空**：至少包含一个代码示例
4. **impact 级别合法**：必须是 `CRITICAL`/`HIGH`/`MEDIUM-HIGH`/`MEDIUM`/`LOW-MEDIUM`/`LOW` 之一
5. **示例代码完整**：至少包含 "Incorrect/Correct" 对比

**解决方案**：

::: tip 验证错误示例及修复

| 错误消息                                         | 原因                     | 修复方法                                                      |
|--- | --- | ---|
| `Missing or empty title`                         | frontmatter 缺少 `title` | 在规则文件顶部添加：<br>`---`<br>`title: "规则标题"`<br>`---` |
| `Missing or empty explanation`                   | 缺少规则说明             | 在 frontmatter 中添加 `explanation` 字段                      |
| `Missing examples`                               | 没有代码示例             | 添加 `**Incorrect:**` 和 `**Correct:**` 代码块                |
| `Invalid impact level`                           | impact 值错误            | 检查 frontmatter 中的 `impact` 是否为合法枚举值               |
| `Missing bad/incorrect or good/correct examples` | 示例标签不匹配           | 确保示例标签包含 "Incorrect" 或 "Correct"                     |

:::

**完整示范**：

```markdown
---
title: "My Rule"
impact: "CRITICAL"
explanation: "规则说明文字"
---

## My Rule

**Incorrect:**
\`\`\`typescript
// 错误示例
\`\`\`

**Correct:**
\`\`\`typescript
// 正确示例
\`\`\`
```

**运行验证**：

```bash
cd packages/react-best-practices-build
pnpm validate
```

**你应该看到**：
```
Validating rule files...
Rules directory: ../../skills/react-best-practices/rules
✓ All 57 rule files are valid
```

### 规则文件解析失败

**问题**：验证时提示 `Failed to parse: ...`，通常是由于 Markdown 格式错误。

**原因**：frontmatter YAML 格式错误、标题层级不规范或代码块语法错误。

**解决方案**：

1. **检查 frontmatter**：
   - 使用三个横线 `---` 包裹
   - 冒号后必须有空格
   - 字符串值建议用双引号

2. **检查标题层级**：
   - 规则标题使用 `##`（H2）
   - 示例标签使用 `**Incorrect:**` 和 `**Correct:**`

3. **检查代码块**：
   - 使用三个反引号 \`\`\` 包裹代码
   - 指定语言类型（如 `typescript`）

**常见错误示例**：

```markdown
# ❌ 错误：frontmatter 冒号后缺少空格
---
title:"my rule"
---

# ✅ 正确
---
title: "my rule"
---

# ❌ 错误：示例标签缺少冒号
**Incorrect**
\`\`\`typescript
code
\`\`\`

# ✅ 正确
**Incorrect:**
\`\`\`typescript
code
\`\`\`
```

## 文件权限问题

### 无法写入 ~/.claude/skills/

**问题**：执行安装命令时提示权限错误。

**原因**：`~/.claude` 目录不存在或当前用户无写入权限。

**解决方案**：

```bash
# 手动创建目录
mkdir -p ~/.claude/skills

# 复制技能包
cp -r agent-skills/* ~/.claude/skills/

# 验证权限
ls -la ~/.claude/skills/
```

**你应该看到**：
```
drwxr-xr-x  user group  size  date  react-best-practices/
drwxr-xr-x  user group  size  date  web-design-guidelines/
drwxr-xr-x  user group  size  date  vercel-deploy-claimable/
```

### Windows 用户路径问题

**问题**：在 Windows 执行部署脚本时路径格式错误。

**原因**：Windows 使用反斜杠 `\` 作为路径分隔符，而 Bash 脚本期望正斜杠 `/`。

**解决方案**：

::: code-group

```bash [Git Bash / WSL]
# 转换路径格式
INPUT_PATH=$(pwd | sed 's/\\/\//g')
bash deploy.sh "$INPUT_PATH"
```

```powershell [PowerShell]
# 使用 PowerShell 转换路径
$INPUT_PATH = $PWD.Path -replace '\\', '/'
bash deploy.sh "$INPUT_PATH"
```

:::

**最佳实践**：在 Windows 上使用 Git Bash 或 WSL 执行部署脚本。

## 性能问题

### 构建速度慢

**问题**：运行 `pnpm build` 时速度较慢，尤其是规则数量多时。

**原因**：构建工具逐个解析规则文件（见 [`build.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/build.ts)），未使用并行处理。

**解决方案**：

1. **跳过不需要的步骤**：
```bash
# 仅构建，不验证
pnpm build

# 仅验证，不构建
pnpm validate
```

2. **清理缓存**：
```bash
rm -rf node_modules/.cache
pnpm build
```

3. **硬件优化**：
   - 使用 SSD 存储
   - 确保 Node.js 版本 >= 20

### 部署上传慢

**问题**：上传 tarball 到 Vercel 时速度很慢。

**原因**：项目体积大或网络带宽不足。

**解决方案**：

1. **减小项目体积**：
```bash
# 检查 tarball 大小
ls -lh .tgz

# 如果超过 50MB，考虑优化
```

2. **优化排除规则**：

修改 [`deploy.sh:210`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh#L210)，添加排除项：

```bash
tar -czf "$TARBALL" -C "$PROJECT_PATH" \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='*.log' \
  --exclude='.vscode' \
  --exclude='dist' \
  --exclude='build' \
  .
```

## 本课小结

Agent Skills 的常见问题主要集中在：

1. **网络权限**：在 claude.ai 中需要配置允许访问的域名
2. **技能激活**：使用明确的关键词触发技能
3. **规则验证**：遵循 `_template.md` 模板确保格式正确
4. **框架检测**：确保 `package.json` 包含正确依赖

遇到问题时，优先查看错误信息和源码中的错误处理逻辑（如 `validate.ts` 和 `deploy.sh`）。

## 获取帮助

如果以上方法无法解决问题：

1. **查看源码**：
   - 部署脚本：[`skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh)
   - 验证脚本：[`packages/react-best-practices-build/src/validate.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/validate.ts)
   - 技能定义：[`AGENTS.md`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md)

2. **GitHub Issues**：在 [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills/issues) 提交问题

3. **社区讨论**：在相关技术论坛（如 Twitter、Discord）寻求帮助

## 下一课预告

> 下一课我们将学习 **[使用最佳实践](../best-practices/)**。
>
> 你将学到：
> - 如何高效触发技能的关键词选择
> - 上下文管理技巧
> - 多技能协作场景
> - 性能优化建议

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-25

| 功能           | 文件路径                                                                                                                                                                         | 行号    |
|--- | --- | ---|
| 网络错误处理   | [`skills/claude.ai/vercel-deploy-claimable/SKILL.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/SKILL.md#L100-L113)         | 100-113 |
| 规则验证逻辑   | [`packages/react-best-practices-build/src/validate.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/validate.ts)               | 21-66   |
| 框架检测逻辑   | [`skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh) | 12-156  |
| 部署错误处理   | [`skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh) | 224-239 |
| 静态 HTML 处理 | [`skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh) | 192-205 |

**关键常量**：
- `DEPLOY_ENDPOINT = "https://claude-skills-deploy.vercel.com/api/deploy"`：部署 API 端点

**关键函数**：
- `detect_framework()`：从 package.json 检测框架类型
- `validateRule()`：验证规则文件格式完整性
- `cleanup()`：清理临时文件

**错误码**：
- `VALIDATION_ERROR`：规则验证失败
- `INPUT_INVALID`：部署输入无效（不是目录或 .tgz）
- `API_ERROR`：部署 API 返回错误

</details>
