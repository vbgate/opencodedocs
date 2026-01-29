<script lang="ts" setup>
import '@docsearch/css'
import { onKeyStroke } from '@vueuse/core'
import {
  defineAsyncComponent,
  onMounted,
  onUnmounted,
  ref
} from 'vue'
import type { DefaultTheme } from 'vitepress'
import { useData } from 'vitepress'
import VPNavBarSearchButton from 'vitepress/dist/client/theme-default/components/VPNavBarSearchButton.vue'

const VPLocalSearchBox = __VP_LOCAL_SEARCH__
  ? defineAsyncComponent(() => import('./VPLocalSearchBox.vue'))
  : () => null

const VPAlgoliaSearchBox = __ALGOLIA__
  ? defineAsyncComponent(() => import('vitepress/dist/client/theme-default/components/VPAlgoliaSearchBox.vue'))
  : () => null

const { theme } = useData()

const loaded = ref(false)
const actuallyLoaded = ref(false)

const preconnect = () => {
  const id = 'VPAlgoliaPreconnect'

  const rIC = window.requestIdleCallback || setTimeout
  rIC(() => {
    const preconnect = document.createElement('link')
    preconnect.id = id
    preconnect.rel = 'preconnect'
    preconnect.href = `https://${
      ((theme.value.search?.options as DefaultTheme.AlgoliaSearchOptions) ??
        theme.value.algolia)!.appId
    }-dsn.algolia.net`
    preconnect.crossOrigin = ''
    document.head.appendChild(preconnect)
  })
}

onMounted(() => {
  if (!__ALGOLIA__) {
    return
  }

  preconnect()

  const handleSearchHotKey = (event: KeyboardEvent) => {
    if (
      (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) ||
      (!isEditingContent(event) && event.key === '/')
    ) {
      event.preventDefault()
      load()
      remove()
    }
  }

  const remove = () => {
    window.removeEventListener('keydown', handleSearchHotKey)
  }

  window.addEventListener('keydown', handleSearchHotKey)

  onUnmounted(remove)
})

function load() {
  if (!loaded.value) {
    loaded.value = true
    setTimeout(poll, 16)
  }
}

function poll() {
  const e = new Event('keydown') as any

  e.key = 'k'
  e.metaKey = true

  window.dispatchEvent(e)

  setTimeout(() => {
    if (!document.querySelector('.DocSearch-Modal')) {
      poll()
    }
  }, 16)
}

function isEditingContent(event: KeyboardEvent): boolean {
  const element = event.target as HTMLElement
  const tagName = element.tagName

  return (
    element.isContentEditable ||
    tagName === 'INPUT' ||
    tagName === 'SELECT' ||
    tagName === 'TEXTAREA'
  )
}

const showSearch = ref(false)

if (__VP_LOCAL_SEARCH__) {
  onKeyStroke('k', (event) => {
    if (event.ctrlKey || event.metaKey) {
      event.preventDefault()
      showSearch.value = true
    }
  })

  onKeyStroke('/', (event) => {
    if (!isEditingContent(event)) {
      event.preventDefault()
      showSearch.value = true
    }
  })
}

const provider = __ALGOLIA__ ? 'algolia' : __VP_LOCAL_SEARCH__ ? 'local' : ''
</script>

<template>
  <div class="VPNavBarSearch">
    <template v-if="provider === 'local'">
      <VPLocalSearchBox
        v-if="showSearch"
        @close="showSearch = false"
      />

      <div id="local-search">
        <VPNavBarSearchButton @click="showSearch = true" />
      </div>
    </template>

    <template v-else-if="provider === 'algolia'">
      <VPAlgoliaSearchBox
        v-if="loaded"
        :algolia="theme.search?.options ?? theme.algolia"
        @vue:beforeMount="actuallyLoaded = true"
      />

      <div v-if="!actuallyLoaded" id="docsearch">
        <VPNavBarSearchButton @click="load" />
      </div>
    </template>
  </div>
</template>

<style>
.VPNavBarSearch {
  display: flex;
  align-items: center;
}

@media (min-width: 768px) {
  .VPNavBarSearch {
    flex-grow: 1;
    padding-left: 24px;
  }
}

@media (min-width: 960px) {
  .VPNavBarSearch {
    padding-left: 32px;
  }
}

.dark .DocSearch-Footer {
  border-top:1px solid var(--vp-c-divider);
}

.DocSearch-Form {
  border:1px solid var(--vp-c-brand-1);
  background-color: var(--vp-c-white);
}

.dark .DocSearch-Form {
  background-color: var(--vp-c-default-soft);
}

.DocSearch-Screen-Icon > svg {
  margin: auto;
}
</style>
