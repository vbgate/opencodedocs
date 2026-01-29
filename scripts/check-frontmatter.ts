/**
 * 检查 Markdown 文件的 FrontMatter 是否包含四个必选字段
 * 
 * 必选字段：title, sidebarTitle, subtitle, description
 * 
 * 运行方式：npx tsx scripts/check-frontmatter.ts
 */

import * as fs from 'fs'
import * as path from 'path'

const REQUIRED_FIELDS = ['title', 'sidebarTitle', 'subtitle', 'description']

function parseFrontmatter(content: string): Record<string, string> {
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return {}

  const fm: Record<string, string> = {}
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':')
    if (idx > 0) {
      const key = line.slice(0, idx).trim()
      const value = line.slice(idx + 1).trim()
      if (value) {
        fm[key] = value
      }
    }
  }
  return fm
}

function scanDirectory(dir: string): string[] {
  const files: string[] = []

  function scan(currentDir: string) {
    const items = fs.readdirSync(currentDir, { withFileTypes: true })
    for (const item of items) {
      const fullPath = path.join(currentDir, item.name)
      if (item.isDirectory() && !item.name.startsWith('.')) {
        scan(fullPath)
      } else if (item.name.endsWith('.md')) {
        files.push(fullPath)
      }
    }
  }

  scan(dir)
  return files
}

function main() {
  const docsDir = path.join(__dirname, '..', 'docs')

  if (!fs.existsSync(docsDir)) {
    console.error(`目录不存在: ${docsDir}`)
    process.exit(1)
  }

  const files = scanDirectory(docsDir)
  const missing: { file: string; fields: string[] }[] = []
  let passCount = 0

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8')
    const fm = parseFrontmatter(content)
    const missingFields = REQUIRED_FIELDS.filter(f => !fm[f])

    if (missingFields.length > 0) {
      const relativePath = path.relative(path.join(__dirname, '..', 'docs'), file)
      missing.push({ file: relativePath, fields: missingFields })
    } else {
      passCount++
    }
  }

  // 输出结果
  console.log('\n========================================')
  console.log('  FrontMatter 字段检查报告')
  console.log('========================================\n')
  console.log(`总文件数：${files.length}`)
  console.log(`通过：${passCount}`)
  console.log(`缺失字段：${missing.length}\n`)

  if (missing.length > 0) {
    console.log('----------------------------------------')
    console.log('缺失字段的文件：')
    console.log('----------------------------------------\n')

    for (const { file, fields } of missing) {
      console.log(`❌ ${file}`)
      console.log(`   缺失: ${fields.join(', ')}\n`)
    }
  } else {
    console.log('✅ 所有文件都包含必选字段！')
  }

  // 返回退出码
  process.exit(missing.length > 0 ? 1 : 0)
}

main()
