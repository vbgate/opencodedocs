import { defineConfig } from 'vitepress'
import { MermaidPlugin } from 'vitepress-plugin-mermaid'
import { generateSidebar } from 'vitepress-sidebar'
import { sidebarConfigs } from './sidebar.config'
import tailwindcss from '@tailwindcss/vite'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "OpenCodeDocs",
  description: "Verified Tutorials for Every Library",
  vite: {
    plugins: [
      tailwindcss(),
      MermaidPlugin()
    ]
  },
  sitemap: {
    hostname: 'https://opencodedocs.com'
  },

  // SEO: 为每个页面生成 hreflang 标签
  transformHead({ pageData }) {
    const head: Array<[string, Record<string, string>]> = []
    const hostname = 'https://opencodedocs.com'
    const locales = ['zh', 'zh-tw', 'ja', 'ko', 'es', 'fr', 'de', 'pt', 'ru']

    // 获取当前页面路径 (去掉 .md 后缀，index.md 转为目录形式)
    let pagePath = pageData.relativePath
      .replace(/\.md$/, '')
      .replace(/index$/, '')

    // 从路径中去掉当前语言前缀，得到纯路径
    // 例如: "zh/about/" → "about/", "zh-tw/vbgate/foo/" → "vbgate/foo/"
    let purePath = pagePath
    for (const locale of locales) {
      if (pagePath.startsWith(locale + '/')) {
        purePath = pagePath.substring(locale.length + 1)
        break
      }
    }

    // 确保路径以 / 结尾（如果不是空）
    if (purePath && !purePath.endsWith('/')) {
      purePath += '/'
    }

    // 添加英文版 (作为 x-default) - 英文版在根目录
    head.push(['link', { rel: 'alternate', hreflang: 'en', href: `${hostname}/${purePath}` }])
    head.push(['link', { rel: 'alternate', hreflang: 'x-default', href: `${hostname}/${purePath}` }])

    // 添加其他语言版本
    for (const locale of locales) {
      head.push(['link', { rel: 'alternate', hreflang: locale, href: `${hostname}/${locale}/${purePath}` }])
    }

    return head
  },
  head: [
    ['meta', { name: 'author', content: 'OpenCodeDocs Team' }],
    ['meta', { name: 'keywords', content: '开源教程, 源码教程, OpenCode, 编程教程, 开发者文档' }],
    ['meta', { property: 'og:site_name', content: 'OpenCodeDocs' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],

  ],
  ignoreDeadLinks: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [],

    search: false,

    // Sidebar 由 vitepress-sidebar 自动生成
    sidebar: generateSidebar(sidebarConfigs),

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vbgate/opencodedocs' }
    ],

    docFooter: {
      prev: 'Previous',
      next: 'Next'
    },

    outline: {
      label: 'On this page'
    },

    lastUpdated: false,

    returnToTopLabel: 'Back to top',
    sidebarMenuLabel: 'Menu',
    darkModeSwitchLabel: 'Theme',
    lightModeSwitchTitle: 'Switch to light mode',
    darkModeSwitchTitle: 'Switch to dark mode'
  },
  locales: {
    root: {
      label: 'English',
      lang: 'en'
    },
    zh: {
      label: '简体中文',
      lang: 'zh',
      link: '/zh/',
      title: 'OpenCodeDocs',
      description: '从项目源码出发，每一步都可追溯、可验证的开源库中文教程。拒绝幻觉，拒绝瞎猜。',
      themeConfig: {
        nav: [
          { text: '加入社群', link: '/zh/community' }
        ],
        docFooter: {
          prev: '上一页',
          next: '下一页'
        },
        outline: false,
        returnToTopLabel: '回到顶部',
        sidebarMenuLabel: '菜单',
        darkModeSwitchLabel: '主题',
        lightModeSwitchTitle: '切换到浅色模式',
        darkModeSwitchTitle: '切换到深色模式'
      }
    },
    'zh-tw': {
      label: '繁體中文',
      lang: 'zh-TW',
      link: '/zh-tw/',
      themeConfig: {
        nav: [],
        docFooter: {
          prev: '上一頁',
          next: '下一頁'
        },
        outline: {
          label: '頁面導航'
        },
        returnToTopLabel: '回到頂部',
        sidebarMenuLabel: '選單',
        darkModeSwitchLabel: '主題',
        lightModeSwitchTitle: '切換到淺色模式',
        darkModeSwitchTitle: '切換到深色模式'
      }
    },
    ja: {
      label: '日本語',
      lang: 'ja',
      link: '/ja/',
      themeConfig: {
        nav: [],
        docFooter: {
          prev: '前のページ',
          next: '次のページ'
        },
        outline: {
          label: 'ページナビゲーション'
        },
        returnToTopLabel: 'トップに戻る',
        sidebarMenuLabel: 'メニュー',
        darkModeSwitchLabel: 'テーマ',
        lightModeSwitchTitle: 'ライトモードに切り替え',
        darkModeSwitchTitle: 'ダークモードに切り替え'
      }
    },
    ko: {
      label: '한국어',
      lang: 'ko',
      link: '/ko/',
      themeConfig: {
        nav: [],
        docFooter: {
          prev: '이전',
          next: '다음'
        },
        outline: {
          label: '페이지 탐색'
        },
        returnToTopLabel: '맨 위로',
        sidebarMenuLabel: '메뉴',
        darkModeSwitchLabel: '테마',
        lightModeSwitchTitle: '라이트 모드로 전환',
        darkModeSwitchTitle: '다크 모드로 전환'
      }
    },
    es: {
      label: 'Español',
      lang: 'es',
      link: '/es/',
      themeConfig: {
        nav: [],
        docFooter: {
          prev: 'Anterior',
          next: 'Siguiente'
        },
        outline: {
          label: 'En esta página'
        },
        returnToTopLabel: 'Volver arriba',
        sidebarMenuLabel: 'Menú',
        darkModeSwitchLabel: 'Tema',
        lightModeSwitchTitle: 'Cambiar a modo claro',
        darkModeSwitchTitle: 'Cambiar a modo oscuro'
      }
    },
    fr: {
      label: 'Français',
      lang: 'fr',
      link: '/fr/',
      themeConfig: {
        nav: [],
        docFooter: {
          prev: 'Précédent',
          next: 'Suivant'
        },
        outline: {
          label: 'Sur cette page'
        },
        returnToTopLabel: 'Retour en haut',
        sidebarMenuLabel: 'Menu',
        darkModeSwitchLabel: 'Thème',
        lightModeSwitchTitle: 'Passer en mode clair',
        darkModeSwitchTitle: 'Passer en mode sombre'
      }
    },
    de: {
      label: 'Deutsch',
      lang: 'de',
      link: '/de/',
      themeConfig: {
        nav: [],
        docFooter: {
          prev: 'Zurück',
          next: 'Weiter'
        },
        outline: {
          label: 'Auf dieser Seite'
        },
        returnToTopLabel: 'Nach oben',
        sidebarMenuLabel: 'Menü',
        darkModeSwitchLabel: 'Thema',
        lightModeSwitchTitle: 'Zum hellen Modus wechseln',
        darkModeSwitchTitle: 'Zum dunklen Modus wechseln'
      }
    },
    pt: {
      label: 'Português',
      lang: 'pt',
      link: '/pt/',
      themeConfig: {
        nav: [],
        docFooter: {
          prev: 'Anterior',
          next: 'Próximo'
        },
        outline: {
          label: 'Nesta página'
        },
        returnToTopLabel: 'Voltar ao topo',
        sidebarMenuLabel: 'Menu',
        darkModeSwitchLabel: 'Tema',
        lightModeSwitchTitle: 'Alternar para modo claro',
        darkModeSwitchTitle: 'Alternar para modo escuro'
      }
    },
    ru: {
      label: 'Русский',
      lang: 'ru',
      link: '/ru/',
      themeConfig: {
        nav: [],
        docFooter: {
          prev: 'Назад',
          next: 'Далее'
        },
        outline: {
          label: 'Содержание'
        },
        returnToTopLabel: 'Вернуться наверх',
        sidebarMenuLabel: 'Меню',
        darkModeSwitchLabel: 'Тема',
        lightModeSwitchTitle: 'Переключить на светлую тему',
        darkModeSwitchTitle: 'Переключить на тёмную тему'
      }
    }
  }
})
