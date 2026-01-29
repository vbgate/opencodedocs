import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'
import { generateSidebar } from 'vitepress-sidebar'
import { sidebarConfigs } from './sidebar.config'
import tailwindcss from '@tailwindcss/vite'

// https://vitepress.dev/reference/site-config
export default withMermaid(defineConfig({
  title: "OpenCodeDocs",
  description: "Verified Tutorials for Every Library",
  vite: {
    plugins: [
      tailwindcss()
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

    search: {
      provider: 'local',
      options: {
        scopeLabels: {
          root: {
            all: 'All Site',
            project: 'Current Project'
          },
          zh: {
            all: '全站',
            project: '本项目'
          },
          'zh-tw': {
            all: '全站',
            project: '本專案'
          },
          ja: {
            all: '全サイト',
            project: '現在のプロジェクト'
          },
          ko: {
            all: '전체 사이트',
            project: '현재 프로젝트'
          },
          es: {
            all: 'Todo el sitio',
            project: 'Proyecto actual'
          },
          fr: {
            all: 'Tout le site',
            project: 'Projet actuel'
          },
          de: {
            all: 'Gesamte Website',
            project: 'Aktuelles Projekt'
          },
          pt: {
            all: 'Todo o site',
            project: 'Projeto atual'
          },
          ru: {
            all: 'Весь сайт',
            project: 'Текущий проект'
          }
        },
        locales: {
          root: {
            translations: {
              button: {
                buttonText: 'Search',
                buttonAriaLabel: 'Search'
              },
              modal: {
                displayDetails: 'Display detailed list',
                resetButtonTitle: 'Reset search',
                backButtonTitle: 'Close search',
                noResultsText: 'No results for',
                footer: {
                  selectText: 'to select',
                  selectKeyAriaLabel: 'enter',
                  navigateText: 'to navigate',
                  navigateUpKeyAriaLabel: 'up arrow',
                  navigateDownKeyAriaLabel: 'down arrow',
                  closeText: 'to close',
                  closeKeyAriaLabel: 'escape'
                }
              }
            }
          },
          zh: {
            translations: {
              button: {
                buttonText: '搜索',
                buttonAriaLabel: '搜索'
              },
              modal: {
                displayDetails: '显示详细列表',
                resetButtonTitle: '重置搜索',
                backButtonTitle: '关闭搜索',
                noResultsText: '没有结果',
                footer: {
                  selectText: '选择',
                  selectKeyAriaLabel: '输入',
                  navigateText: '导航',
                  navigateUpKeyAriaLabel: '上箭头',
                  navigateDownKeyAriaLabel: '下箭头',
                  closeText: '关闭',
                  closeKeyAriaLabel: 'esc'
                }
              }
            }
          },
          'zh-tw': {
            translations: {
              button: {
                buttonText: '搜尋',
                buttonAriaLabel: '搜尋'
              },
              modal: {
                displayDetails: '顯示詳細列表',
                resetButtonTitle: '重置搜尋',
                backButtonTitle: '關閉搜尋',
                noResultsText: '沒有結果',
                footer: {
                  selectText: '選擇',
                  selectKeyAriaLabel: '輸入',
                  navigateText: '導航',
                  navigateUpKeyAriaLabel: '上箭頭',
                  navigateDownKeyAriaLabel: '下箭頭',
                  closeText: '關閉',
                  closeKeyAriaLabel: 'esc'
                }
              }
            }
          },
          ja: {
            translations: {
              button: {
                buttonText: '検索',
                buttonAriaLabel: '検索'
              },
              modal: {
                displayDetails: '詳細リストを表示',
                resetButtonTitle: '検索をリセット',
                backButtonTitle: '検索を閉じる',
                noResultsText: '結果が見つかりません',
                footer: {
                  selectText: '選択',
                  selectKeyAriaLabel: '入力',
                  navigateText: 'ナビゲート',
                  navigateUpKeyAriaLabel: '上矢印',
                  navigateDownKeyAriaLabel: '下矢印',
                  closeText: '閉じる',
                  closeKeyAriaLabel: 'esc'
                }
              }
            }
          },
          ko: {
            translations: {
              button: {
                buttonText: '검색',
                buttonAriaLabel: '검색'
              },
              modal: {
                displayDetails: '자세한 목록 표시',
                resetButtonTitle: '검색 초기화',
                backButtonTitle: '검색 닫기',
                noResultsText: '결과 없음',
                footer: {
                  selectText: '선택',
                  selectKeyAriaLabel: '입력',
                  navigateText: '탐색',
                  navigateUpKeyAriaLabel: '위 화살표',
                  navigateDownKeyAriaLabel: '아래 화살표',
                  closeText: '닫기',
                  closeKeyAriaLabel: 'esc'
                }
              }
            }
          },
          es: {
            translations: {
              button: {
                buttonText: 'Buscar',
                buttonAriaLabel: 'Buscar'
              },
              modal: {
                displayDetails: 'Mostrar lista detallada',
                resetButtonTitle: 'Restablecer búsqueda',
                backButtonTitle: 'Cerrar búsqueda',
                noResultsText: 'Sin resultados para',
                footer: {
                  selectText: 'para seleccionar',
                  selectKeyAriaLabel: 'entrar',
                  navigateText: 'para navegar',
                  navigateUpKeyAriaLabel: 'flecha arriba',
                  navigateDownKeyAriaLabel: 'flecha abajo',
                  closeText: 'para cerrar',
                  closeKeyAriaLabel: 'esc'
                }
              }
            }
          },
          fr: {
            translations: {
              button: {
                buttonText: 'Rechercher',
                buttonAriaLabel: 'Rechercher'
              },
              modal: {
                displayDetails: 'Afficher la liste détaillée',
                resetButtonTitle: 'Réinitialiser la recherche',
                backButtonTitle: 'Fermer la recherche',
                noResultsText: 'Aucun résultat pour',
                footer: {
                  selectText: 'pour sélectionner',
                  selectKeyAriaLabel: 'entrée',
                  navigateText: 'pour naviguer',
                  navigateUpKeyAriaLabel: 'flèche haut',
                  navigateDownKeyAriaLabel: 'flèche bas',
                  closeText: 'pour fermer',
                  closeKeyAriaLabel: 'esc'
                }
              }
            }
          },
          de: {
            translations: {
              button: {
                buttonText: 'Suchen',
                buttonAriaLabel: 'Suchen'
              },
              modal: {
                displayDetails: 'Detaillierte Liste anzeigen',
                resetButtonTitle: 'Suche zurücksetzen',
                backButtonTitle: 'Suche schließen',
                noResultsText: 'Keine Ergebnisse für',
                footer: {
                  selectText: 'zum Auswählen',
                  selectKeyAriaLabel: 'Eingabe',
                  navigateText: 'zum Navigieren',
                  navigateUpKeyAriaLabel: 'Pfeil hoch',
                  navigateDownKeyAriaLabel: 'Pfeil runter',
                  closeText: 'zum Schließen',
                  closeKeyAriaLabel: 'esc'
                }
              }
            }
          },
          pt: {
            translations: {
              button: {
                buttonText: 'Pesquisar',
                buttonAriaLabel: 'Pesquisar'
              },
              modal: {
                displayDetails: 'Exibir lista detalhada',
                resetButtonTitle: 'Redefinir pesquisa',
                backButtonTitle: 'Fechar pesquisa',
                noResultsText: 'Nenhum resultado para',
                footer: {
                  selectText: 'para selecionar',
                  selectKeyAriaLabel: 'Enter',
                  navigateText: 'para navegar',
                  navigateUpKeyAriaLabel: 'seta para cima',
                  navigateDownKeyAriaLabel: 'seta para baixo',
                  closeText: 'para fechar',
                  closeKeyAriaLabel: 'esc'
                }
              }
            }
          },
          ru: {
            translations: {
              button: {
                buttonText: 'Поиск',
                buttonAriaLabel: 'Поиск'
              },
              modal: {
                displayDetails: 'Показать подробный список',
                resetButtonTitle: 'Сбросить поиск',
                backButtonTitle: 'Закрыть поиск',
                noResultsText: 'Нет результатов для',
                footer: {
                  selectText: 'для выбора',
                  selectKeyAriaLabel: 'Enter',
                  navigateText: 'для навигации',
                  navigateUpKeyAriaLabel: 'стрелка вверх',
                  navigateDownKeyAriaLabel: 'стрелка вниз',
                  closeText: 'для закрытия',
                  closeKeyAriaLabel: 'esc'
                }
              }
            }
          }
        }
      }
    },

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

    lastUpdated: {
      text: 'Last updated'
    },

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
        lastUpdated: {
          text: '最后更新于'
        },
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
        lastUpdated: {
          text: '最後更新於'
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
        lastUpdated: {
          text: '最終更新'
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
        lastUpdated: {
          text: '마지막 업데이트'
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
        lastUpdated: {
          text: 'Última actualización'
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
        lastUpdated: {
          text: 'Dernière mise à jour'
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
        lastUpdated: {
          text: 'Zuletzt aktualisiert'
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
        lastUpdated: {
          text: 'Última atualização'
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
        lastUpdated: {
          text: 'Последнее обновление'
        },
        returnToTopLabel: 'Вернуться наверх',
        sidebarMenuLabel: 'Меню',
        darkModeSwitchLabel: 'Тема',
        lightModeSwitchTitle: 'Переключить на светлую тему',
        darkModeSwitchTitle: 'Переключить на тёмную тему'
      }
    }
  },
  mermaid: {
    // mermaid config
  }
}))
