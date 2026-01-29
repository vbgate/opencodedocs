<script setup lang="ts">
import { useData, useRoute, useRouter, inBrowser } from 'vitepress'
import { computed, provide, useSlots, watch } from 'vue'
import VPBackdrop from 'vitepress/dist/client/theme-default/components/VPBackdrop.vue'
import VPContent from 'vitepress/dist/client/theme-default/components/VPContent.vue'
import VPFooter from 'vitepress/dist/client/theme-default/components/VPFooter.vue'
import VPLocalNav from 'vitepress/dist/client/theme-default/components/VPLocalNav.vue'
import VPSidebar from 'vitepress/dist/client/theme-default/components/VPSidebar.vue'
import VPSkipLink from 'vitepress/dist/client/theme-default/components/VPSkipLink.vue'
import { useCloseSidebarOnEscape, useSidebar } from 'vitepress/dist/client/theme-default/composables/sidebar'
import VPNav from './components/VPNav.vue'
import AdSlot from './components/AdSlot.vue'

const {
  isOpen: isSidebarOpen,
  open: openSidebar,
  close: closeSidebar
} = useSidebar()

const route = useRoute()
watch(() => route.path, closeSidebar)

useCloseSidebarOnEscape(isSidebarOpen, closeSidebar)

const { frontmatter } = useData()

const slots = useSlots()
const heroImageSlotExists = computed(() => !!slots['home-hero-image'])

provide('hero-image-slot-exists', heroImageSlotExists)





const { lang } = useData()
const router = useRouter()

// 逻辑重构 (Refactored Logic)
if (inBrowser) {
  setTimeout(() => {
    const path = window.location.pathname
    
    // 1. 非根目录：记录当前语言到 Cookie (Record lang on non-root pages)
    if (path !== '/' && path !== '/index.html') {
      document.cookie = `nf_lang=${lang.value}; expires=Mon, 1 Jan 2030 00:00:00 UTC; path=/`
      return
    }

    // 2. 根目录：执行重定向 (Root path: Execute redirect)
    // 优先级: Cookie > Browser Language
    try {
      let targetLang = ''
      const cookieMatch = document.cookie.match(/nf_lang=([^;]+)/)
      
      if (cookieMatch) {
         targetLang = cookieMatch[1]
         console.log('[OpenCodeDocs] Found cookie lang:', targetLang)
      } else {
         const userLang = navigator.language.toLowerCase()
         console.log('[OpenCodeDocs] Detect browser lang:', userLang)
         
         if (userLang.includes('zh')) {
            // 简繁体处理
            targetLang = (userLang.includes('tw') || userLang.includes('hk')) ? 'zh-tw' : 'zh'
         } else if (userLang.startsWith('ja')) targetLang = 'ja'
         else if (userLang.startsWith('ko')) targetLang = 'ko'
         else if (userLang.startsWith('es')) targetLang = 'es'
         else if (userLang.startsWith('fr')) targetLang = 'fr'
         else if (userLang.startsWith('de')) targetLang = 'de'
         else if (userLang.startsWith('pt')) targetLang = 'pt'
         else if (userLang.startsWith('ru')) targetLang = 'ru'
      }

      // 执行跳转 (Execute Redirect)
      // 只有当目标语言存在，且不是 'en' (默认页) 时才跳转
      if (targetLang && targetLang !== 'en') {
         const targetPath = `/${targetLang}/`
         console.log('[OpenCodeDocs] Redirecting to:', targetPath)
         window.location.replace(targetPath)
      } else {
         console.log('[OpenCodeDocs] Stay on English homepage')
      }

    } catch (e) {
      console.error('Redirect error:', e)
    }
  }, 0)
  
  // 3. 监听语言切换 (Watch lang switch)
  // 当用户在页面内手动切换语言时，更新 Cookie
  watch(() => lang.value, (newLang) => {
      document.cookie = `nf_lang=${newLang}; expires=Mon, 1 Jan 2030 00:00:00 UTC; path=/`
  })
}
</script>

<template>
  <div v-if="frontmatter.layout !== false" class="Layout" :class="frontmatter.pageClass">
    <slot name="layout-top" />
    <VPSkipLink />
    <VPBackdrop class="backdrop" :show="isSidebarOpen" @click="closeSidebar" />
    <VPNav>
      <template #nav-bar-title-before><slot name="nav-bar-title-before" /></template>
      <template #nav-bar-title-after><slot name="nav-bar-title-after" /></template>
      <template #nav-bar-content-before><slot name="nav-bar-content-before" /></template>
      <template #nav-bar-content-after><slot name="nav-bar-content-after" /></template>
      <template #nav-screen-content-before><slot name="nav-screen-content-before" /></template>
      <template #nav-screen-content-after><slot name="nav-screen-content-after" /></template>
    </VPNav>
    <VPLocalNav :open="isSidebarOpen" @open-menu="openSidebar" />

    <VPSidebar :open="isSidebarOpen">
      <template #sidebar-nav-before><slot name="sidebar-nav-before" /></template>
      <template #sidebar-nav-after><slot name="sidebar-nav-after" /></template>
    </VPSidebar>

    <VPContent>
      <template #page-top><slot name="page-top" /></template>
      <template #page-bottom><slot name="page-bottom" /></template>

      <template #not-found><slot name="not-found" /></template>
      <template #home-hero-before><slot name="home-hero-before" /></template>
      <template #home-hero-info-before><slot name="home-hero-info-before" /></template>
      <template #home-hero-info><slot name="home-hero-info" /></template>
      <template #home-hero-info-after><slot name="home-hero-info-after" /></template>
      <template #home-hero-actions-after><slot name="home-hero-actions-after" /></template>
      <template #home-hero-image><slot name="home-hero-image" /></template>
      <template #home-hero-after><slot name="home-hero-after" /></template>
      <template #home-features-before><slot name="home-features-before" /></template>
      <template #home-features-after><slot name="home-features-after" /></template>

      <template #doc-footer-before><slot name="doc-footer-before" /></template>
      <template #doc-before><slot name="doc-before" /></template>
      <template #doc-after>
        <slot name="doc-after" />
        <AdSlot />
      </template>
      <template #doc-top><slot name="doc-top" /></template>
      <template #doc-bottom><slot name="doc-bottom" /></template>

      <template #aside-top><slot name="aside-top" /></template>
      <template #aside-bottom><slot name="aside-bottom" /></template>
      <template #aside-outline-before><slot name="aside-outline-before" /></template>
      <template #aside-outline-after><slot name="aside-outline-after" /></template>
      <template #aside-ads-before><slot name="aside-ads-before" /></template>
      <template #aside-ads-after><slot name="aside-ads-after" /></template>
    </VPContent>

    <VPFooter />
    <slot name="layout-bottom" />
  </div>
  <Content v-else />
</template>

<style scoped>
.Layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
