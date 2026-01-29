/**
 * 批量创建分类目录 index.md 文件
 *
 * 功能：
 * - 扫描所有分类目录（start/、platforms/、advanced/、faq/、appendix/、changelog/ 等）
 * - 为缺失 index.md 的目录创建文件
 * - 根据目录路径判断语言，自动设置对应的 sidebarTitle
 * - 自动设置 order（start=1, platforms=2, advanced=3, faq=4, appendix=5, changelog=6）
 */

import * as fs from 'fs'
import * as path from 'path'

// 分类目录标题映射表
const categoryTitles: Record<string, Record<string, { title: string; order: number }>> = {
  start: {
    root: { title: 'Start', order: 1 },
    zh: { title: '快速开始', order: 1 },
    'zh-tw': { title: '快速開始', order: 1 },
    ja: { title: 'はじめに', order: 1 },
    ko: { title: '시작하기', order: 1 },
    es: { title: 'Inicio', order: 1 },
    fr: { title: 'Démarrage', order: 1 },
    de: { title: 'Start', order: 1 },
    pt: { title: 'Início', order: 1 },
    ru: { title: 'Начало', order: 1 },
  },
  platforms: {
    root: { title: 'Platforms', order: 2 },
    zh: { title: '平台功能', order: 2 },
    'zh-tw': { title: '平台功能', order: 2 },
    ja: { title: 'プラットフォーム', order: 2 },
    ko: { title: '플랫폼', order: 2 },
    es: { title: 'Plataformas', order: 2 },
    fr: { title: 'Plateformes', order: 2 },
    de: { title: 'Plattformen', order: 2 },
    pt: { title: 'Plataformas', order: 2 },
    ru: { title: 'Платформы', order: 2 },
  },
  core: {
    root: { title: 'Core Features', order: 2 },
    zh: { title: '核心功能', order: 2 },
    'zh-tw': { title: '核心功能', order: 2 },
    ja: { title: 'コア機能', order: 2 },
    ko: { title: '핵심 기능', order: 2 },
    es: { title: 'Funciones principales', order: 2 },
    fr: { title: 'Fonctionnalités principales', order: 2 },
    de: { title: 'Kernfunktionen', order: 2 },
    pt: { title: 'Recursos principais', order: 2 },
    ru: { title: 'Основные функции', order: 2 },
  },
  advanced: {
    root: { title: 'Advanced', order: 3 },
    zh: { title: '高级功能', order: 3 },
    'zh-tw': { title: '進階功能', order: 3 },
    ja: { title: '高度な機能', order: 3 },
    ko: { title: '고급 기능', order: 3 },
    es: { title: 'Avanzado', order: 3 },
    fr: { title: 'Avancé', order: 3 },
    de: { title: 'Erweitert', order: 3 },
    pt: { title: 'Avançado', order: 3 },
    ru: { title: 'Расширенный', order: 3 },
  },
  security: {
    root: { title: 'Security', order: 3 },
    zh: { title: '安全隐私', order: 3 },
    'zh-tw': { title: '安全隱私', order: 3 },
    ja: { title: 'セキュリティ', order: 3 },
    ko: { title: '보안', order: 3 },
    es: { title: 'Seguridad', order: 3 },
    fr: { title: 'Sécurité', order: 3 },
    de: { title: 'Sicherheit', order: 3 },
    pt: { title: 'Segurança', order: 3 },
    ru: { title: 'Безопасность', order: 3 },
  },
  faq: {
    root: { title: 'FAQ', order: 4 },
    zh: { title: '常见问题', order: 4 },
    'zh-tw': { title: '常見問題', order: 4 },
    ja: { title: 'よくある質問', order: 4 },
    ko: { title: '자주 묻는 질문', order: 4 },
    es: { title: 'Preguntas frecuentes', order: 4 },
    fr: { title: 'FAQ', order: 4 },
    de: { title: 'FAQ', order: 4 },
    pt: { title: 'Perguntas frequentes', order: 4 },
    ru: { title: 'Вопросы и ответы', order: 4 },
  },
  appendix: {
    root: { title: 'Appendix', order: 5 },
    zh: { title: '附录', order: 5 },
    'zh-tw': { title: '附錄', order: 5 },
    ja: { title: '付録', order: 5 },
    ko: { title: '부록', order: 5 },
    es: { title: 'Apéndice', order: 5 },
    fr: { title: 'Annexe', order: 5 },
    de: { title: 'Anhang', order: 5 },
    pt: { title: 'Apêndice', order: 5 },
    ru: { title: 'Приложение', order: 5 },
  },
  changelog: {
    root: { title: 'Changelog', order: 6 },
    zh: { title: '更新日志', order: 6 },
    'zh-tw': { title: '更新日誌', order: 6 },
    ja: { title: '変更履歴', order: 6 },
    ko: { title: '변경 이력', order: 6 },
    es: { title: 'Registro de cambios', order: 6 },
    fr: { title: 'Journal des modifications', order: 6 },
    de: { title: 'Änderungsprotokoll', order: 6 },
    pt: { title: 'Registro de alterações', order: 6 },
    ru: { title: 'История изменений', order: 6 },
  },
}

// 已知的语言目录
const languageDirs = ['zh', 'zh-tw', 'ja', 'ko', 'es', 'fr', 'de', 'pt', 'ru']

// 项目列表（从 docs 目录扫描）
const projects = [
  'backnotprop/plannotator',
  'joshuadavidthomas/opencode-agent-skills',
  'NoeFabris/opencode-antigravity-auth',
  'Opencode-DCP/opencode-dynamic-context-pruning',
  'numman-ali/openskills',
  'supermemoryai/opencode-supermemory',
  'vbgate/opencode-mystatus',
  'lbjlaq/Antigravity-Manager',
]

// 确定语言代码
function getLanguage(relativePath: string): string {
  const firstPart = relativePath.split('/')[0]
  if (languageDirs.includes(firstPart)) {
    return firstPart
  }
  return 'root'
}

// 获取分类目录名
function getCategoryName(dirPath: string): string | null {
  const parts = dirPath.split('/')
  // 分类目录是项目路径后的第一级目录
  // 例如：docs/backnotprop/plannotator/start -> start
  // 例如：docs/zh/backnotprop/plannotator/start -> start

  for (const project of projects) {
    const projectParts = project.split('/')
    // 找到项目路径在 dirPath 中的位置
    const idx = parts.findIndex((p, i) =>
      parts.slice(i, i + projectParts.length).join('/') === project
    )
    if (idx !== -1) {
      // 项目路径之后的目录就是分类目录
      const categoryIdx = idx + projectParts.length
      if (categoryIdx < parts.length) {
        return parts[categoryIdx]
      }
    }
  }
  return null
}

// 检查目录是否是分类目录（只在项目根目录下一级）
function isCategoryDir(docsDir: string, dirPath: string): boolean {
  const relativePath = path.relative(docsDir, dirPath)
  const category = getCategoryName(relativePath)
  return category !== null && Object.keys(categoryTitles).includes(category)
}

// 创建 index.md 内容
function createIndexContent(category: string, lang: string): string {
  const config = categoryTitles[category]?.[lang] || categoryTitles[category]?.['root']
  if (!config) {
    return ''
  }

  return `---
sidebarTitle: "${config.title}"
order: ${config.order}
---

# ${config.title}
`
}

// 主函数
async function main() {
  const docsDir = path.join(__dirname, '..', 'docs')
  let createdCount = 0
  let skippedCount = 0
  const createdFiles: string[] = []

  // 递归扫描目录
  function scanDirectory(dir: string) {
    const items = fs.readdirSync(dir, { withFileTypes: true })

    for (const item of items) {
      if (!item.isDirectory()) continue
      if (item.name.startsWith('.')) continue

      const fullPath = path.join(dir, item.name)
      const relativePath = path.relative(docsDir, fullPath)

      // 检查是否是分类目录
      const category = getCategoryName(relativePath)
      if (category && Object.keys(categoryTitles).includes(category)) {
        const indexPath = path.join(fullPath, 'index.md')

        if (!fs.existsSync(indexPath)) {
          // 创建 index.md
          const lang = getLanguage(relativePath)
          const content = createIndexContent(category, lang)

          if (content) {
            fs.writeFileSync(indexPath, content, 'utf-8')
            createdCount++
            createdFiles.push(relativePath + '/index.md')
            console.log(`✅ Created: ${relativePath}/index.md`)
          }
        } else {
          skippedCount++
          console.log(`⏭️ Skipped (exists): ${relativePath}/index.md`)
        }
      }

      // 递归扫描子目录
      scanDirectory(fullPath)
    }
  }

  console.log('🔍 Scanning docs directory for category folders...\n')
  scanDirectory(docsDir)

  console.log('\n📊 Summary:')
  console.log(`   Created: ${createdCount} files`)
  console.log(`   Skipped: ${skippedCount} files`)

  if (createdFiles.length > 0) {
    console.log('\n📝 Created files:')
    createdFiles.forEach(f => console.log(`   - ${f}`))
  }
}

main().catch(console.error)
