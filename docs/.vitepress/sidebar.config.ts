/**
 * VitePress Sidebar 自动生成配置
 *
 * 功能：
 * - 自动扫描 docs 目录生成 sidebar 配置
 * - 支持多语言（10 种语言）
 * - 使用 frontmatter 中的 title/sidebarTitle 作为菜单标题
 * - 使用 frontmatter 中的 order 字段控制排序
 * - 自动检测目录是否存在，只为存在的目录生成配置
 */

import * as fs from 'fs'
import * as path from 'path'
import { generateSidebar, VitePressSidebarOptions } from 'vitepress-sidebar'

// 项目列表
const projects = [
  'backnotprop/plannotator',
  'moltbot/moltbot',
  'code-yeongyu/oh-my-opencode',
  'joshuadavidthomas/opencode-agent-skills',
  'kdcokenny/opencode-notify',
  'NoeFabris/opencode-antigravity-auth',
  'Opencode-DCP/opencode-dynamic-context-pruning',
  'numman-ali/openskills',
  'supermemoryai/opencode-supermemory',
  'vbgate/opencode-mystatus',
  'lbjlaq/Antigravity-Manager',
  'franlol/opencode-md-table-formatter',
  'hyz1992/agent-app-factory',
  'vercel-labs/agent-skills',
]

// 语言配置
const locales = [
  { lang: 'root', prefix: '' },
  { lang: 'zh', prefix: 'zh' },
  { lang: 'zh-tw', prefix: 'zh-tw' },
  { lang: 'ja', prefix: 'ja' },
  { lang: 'ko', prefix: 'ko' },
  { lang: 'es', prefix: 'es' },
  { lang: 'fr', prefix: 'fr' },
  { lang: 'de', prefix: 'de' },
  { lang: 'pt', prefix: 'pt' },
  { lang: 'ru', prefix: 'ru' },
]

// 项目主页标题（多语言）
const projectHomeText: Record<string, string> = {
  root: '🏠 Project Home',
  zh: '🏠 项目主页',
  'zh-tw': '🏠 專案首頁',
  ja: '🏠 プロジェクトホーム',
  ko: '🏠 프로젝트 홈',
  es: '🏠 Inicio del Proyecto',
  fr: '🏠 Accueil du Projet',
  de: '🏠 Projekt-Startseite',
  pt: '🏠 Página Inicial do Projeto',
  ru: '🏠 Главная проекта',
}

// 获取 docs 目录路径
const docsDir = path.resolve(__dirname, '..')

// 检查目录是否存在
function directoryExists(dirPath: string): boolean {
  try {
    return fs.statSync(dirPath).isDirectory()
  } catch {
    return false
  }
}

// 生成所有 sidebar 配置
export function generateAllSidebars(): VitePressSidebarOptions[] {
  const configs: VitePressSidebarOptions[] = []

  for (const locale of locales) {
    for (const project of projects) {
      const scanPath = locale.prefix ? `${locale.prefix}/${project}` : project
      const fullPath = path.join(docsDir, scanPath)

      // 只为实际存在的目录生成配置
      if (!directoryExists(fullPath)) {
        continue
      }

      const resolvePath = locale.prefix ? `/${locale.prefix}/${project}/` : `/${project}/`

      configs.push({
        // 文档根目录
        documentRootPath: 'docs',
        // 扫描起始路径
        scanStartPath: scanPath,
        // URL 解析路径
        resolvePath: resolvePath,
        // 根组文本（项目主页）
        rootGroupText: projectHomeText[locale.lang] || '🏠 Project Home',
        // 根组链接（使用相对路径 './' 指向当前项目根目录）
        rootGroupLink: './',

        // 标题获取方式
        useTitleFromFrontmatter: true,
        frontmatterTitleFieldName: 'sidebarTitle',
        useTitleFromFileHeading: true,
        useFolderTitleFromIndexFile: true,
        useFolderLinkFromIndexFile: true,

        // 排序方式
        sortMenusByFrontmatterOrder: true,
        frontmatterOrderDefaultValue: 999,

        // 折叠设置
        collapsed: false,
        collapseDepth: 2,

        // 样式处理
        hyphenToSpace: true,
        underscoreToSpace: true,
        capitalizeFirst: true,

        // 排除文件
        excludeFiles: ['index.md'],
        excludeFilesByFrontmatterFieldName: 'exclude',

        // 调试模式（开发时可启用）
        // debugPrint: true,
      })
    }
  }

  return configs
}

export const sidebarConfigs = generateAllSidebars()
