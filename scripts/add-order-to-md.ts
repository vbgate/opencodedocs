/**
 * 批量为 md 文件添加 order 字段
 *
 * 功能：
 * - 解析现有 config.mts 中的 sidebar 配置，提取每个文件的顺序
 * - 扫描所有 md 文件
 * - 为每个文件的 frontmatter 添加 order 字段（基于 config.mts 中的顺序）
 * - 已有 order 字段的跳过
 */

import * as fs from 'fs'
import * as path from 'path'

// 从 config.mts 中解析 sidebar 配置
function parseSidebarConfig(configPath: string): Map<string, number> {
  const content = fs.readFileSync(configPath, 'utf-8')
  const orderMap = new Map<string, number>()

  // 匹配 sidebar 中的 link 条目
  // 格式: { text: '...', link: '/xxx/yyy/' }
  const linkRegex = /\{\s*text:\s*['"][^'"]+['"]\s*,\s*link:\s*['"]([^'"]+)['"]\s*\}/g

  // 匹配 items 数组
  const itemsBlockRegex = /items:\s*\[([\s\S]*?)\]/g

  let match
  while ((match = itemsBlockRegex.exec(content)) !== null) {
    const itemsContent = match[1]
    let order = 1

    // 在每个 items 块中提取链接
    let linkMatch
    const tempRegex = /\{\s*text:\s*['"][^'"]+['"]\s*,\s*link:\s*['"]([^'"]+)['"]\s*\}/g
    while ((linkMatch = tempRegex.exec(itemsContent)) !== null) {
      const link = linkMatch[1]
      // 转换链接为文件路径
      // /backnotprop/plannotator/start/getting-started/ -> backnotprop/plannotator/start/getting-started/index.md
      const filePath = link.replace(/^\//, '').replace(/\/$/, '') + '/index.md'

      if (!orderMap.has(filePath)) {
        orderMap.set(filePath, order)
      }
      order++
    }
  }

  return orderMap
}

// 解析 frontmatter
function parseFrontmatter(content: string): { frontmatter: Record<string, unknown>; body: string; hasFrontmatter: boolean } {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n/
  const match = content.match(frontmatterRegex)

  if (match) {
    const frontmatterStr = match[1]
    const body = content.slice(match[0].length)
    const frontmatter: Record<string, unknown> = {}

    // 简单的 YAML 解析
    const lines = frontmatterStr.split('\n')
    for (const line of lines) {
      const colonIdx = line.indexOf(':')
      if (colonIdx > 0) {
        const key = line.slice(0, colonIdx).trim()
        let value: string | string[] = line.slice(colonIdx + 1).trim()

        // 处理引号
        if ((value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1)
        }

        // 处理数组（简单处理，只处理单行数组标记）
        if (value === '') {
          // 可能是多行数组，跳过
          continue
        }

        frontmatter[key] = value
      }
    }

    return { frontmatter, body, hasFrontmatter: true }
  }

  return { frontmatter: {}, body: content, hasFrontmatter: false }
}

// 生成 frontmatter 字符串
function generateFrontmatter(frontmatter: Record<string, unknown>): string {
  const lines: string[] = ['---']

  for (const [key, value] of Object.entries(frontmatter)) {
    if (Array.isArray(value)) {
      lines.push(`${key}:`)
      for (const item of value) {
        lines.push(`  - "${item}"`)
      }
    } else if (typeof value === 'string') {
      // 检查是否需要引号
      if (value.includes(':') || value.includes('#') || value.includes('"') || value.includes("'")) {
        lines.push(`${key}: "${value.replace(/"/g, '\\"')}"`)
      } else {
        lines.push(`${key}: "${value}"`)
      }
    } else {
      lines.push(`${key}: ${value}`)
    }
  }

  lines.push('---')
  return lines.join('\n')
}

// 主函数
async function main() {
  const docsDir = path.join(__dirname, '..', 'docs')
  const configPath = path.join(docsDir, '.vitepress', 'config.mts')

  console.log('📖 Parsing sidebar configuration from config.mts...\n')
  const orderMap = parseSidebarConfig(configPath)
  console.log(`   Found ${orderMap.size} entries in sidebar configuration\n`)

  let modifiedCount = 0
  let skippedCount = 0
  let noOrderCount = 0
  const modifiedFiles: string[] = []

  // 递归扫描目录
  function scanDirectory(dir: string) {
    const items = fs.readdirSync(dir, { withFileTypes: true })

    for (const item of items) {
      const fullPath = path.join(dir, item.name)

      if (item.isDirectory()) {
        if (!item.name.startsWith('.')) {
          scanDirectory(fullPath)
        }
        continue
      }

      // 只处理 .md 文件
      if (!item.name.endsWith('.md')) continue

      // 跳过根目录的 index.md 和 privacy.md
      const relativePath = path.relative(docsDir, fullPath)
      if (relativePath === 'index.md' || relativePath === 'privacy.md') {
        console.log(`⏭️ Skipped (root file): ${relativePath}`)
        skippedCount++
        continue
      }

      // 读取文件
      const content = fs.readFileSync(fullPath, 'utf-8')
      const { frontmatter, body, hasFrontmatter } = parseFrontmatter(content)

      // 检查是否已有 order 字段
      if (frontmatter.order !== undefined) {
        console.log(`⏭️ Skipped (has order): ${relativePath}`)
        skippedCount++
        continue
      }

      // 尝试从 orderMap 获取顺序
      let order = orderMap.get(relativePath)

      // 如果没有找到，尝试根据文件在目录中的位置分配顺序
      if (order === undefined) {
        // 对于分类目录的 index.md，使用分类的顺序
        const parts = relativePath.split('/')
        const categoryOrders: Record<string, number> = {
          start: 1,
          platforms: 2,
          core: 2,
          advanced: 3,
          security: 3,
          faq: 4,
          appendix: 5,
          changelog: 6,
        }

        // 检查是否是分类目录的文件
        for (const [category, catOrder] of Object.entries(categoryOrders)) {
          if (relativePath.includes(`/${category}/`)) {
            // 获取在该分类中的子目录
            const categoryIdx = parts.indexOf(category)
            if (categoryIdx >= 0 && categoryIdx < parts.length - 1) {
              // 使用默认顺序 999（表示未排序）
              order = 999
              break
            }
          }
        }
      }

      if (order === undefined) {
        console.log(`⚠️ No order found: ${relativePath}`)
        noOrderCount++
        // 默认给一个大的顺序值
        order = 999
      }

      // 添加 order 字段
      frontmatter.order = order

      // 重新生成文件内容
      let newContent: string
      if (hasFrontmatter) {
        // 如果原来有 frontmatter，需要更精细地处理以保留原有格式
        // 简单处理：在 frontmatter 末尾添加 order
        const frontmatterEndIdx = content.indexOf('---', 4)
        if (frontmatterEndIdx > 0) {
          const originalFrontmatter = content.slice(4, frontmatterEndIdx)
          const newFrontmatter = originalFrontmatter.trimEnd() + `\norder: ${order}\n`
          newContent = '---\n' + newFrontmatter + '---\n' + body
        } else {
          newContent = generateFrontmatter(frontmatter) + '\n' + body
        }
      } else {
        // 没有 frontmatter，创建新的
        newContent = `---\norder: ${order}\n---\n\n` + content
      }

      fs.writeFileSync(fullPath, newContent, 'utf-8')
      modifiedCount++
      modifiedFiles.push(relativePath)
      console.log(`✅ Added order=${order}: ${relativePath}`)
    }
  }

  console.log('🔍 Scanning docs directory for md files...\n')
  scanDirectory(docsDir)

  console.log('\n📊 Summary:')
  console.log(`   Modified: ${modifiedCount} files`)
  console.log(`   Skipped: ${skippedCount} files`)
  console.log(`   No order in config: ${noOrderCount} files`)
}

main().catch(console.error)
