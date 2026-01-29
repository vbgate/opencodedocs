<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import homeConfigZh from '../../../home-config.json'
import homeConfigEn from '../../../home-config.en.json'
import homeConfigDe from '../../../home-config.de.json'
import homeConfigEs from '../../../home-config.es.json'
import homeConfigFr from '../../../home-config.fr.json'
import homeConfigJa from '../../../home-config.ja.json'
import homeConfigKo from '../../../home-config.ko.json'
import homeConfigPt from '../../../home-config.pt.json'
import homeConfigRu from '../../../home-config.ru.json'
import homeConfigZhTw from '../../../home-config.zh-tw.json'
import ScrollProgress from './ScrollProgress.vue'
import HomeHero from './HomeHero.vue'
import HomeAudience from './HomeAudience.vue'
import HomeFeatures from './HomeFeatures.vue'
import HomeTutorials from './HomeTutorials.vue'
import SiteFooter from './SiteFooter.vue'

const { lang } = useData()

const data = computed(() => {
  const code = lang.value
  if (code === 'zh-TW' || code === 'zh-tw') return homeConfigZhTw
  if (code.startsWith('zh')) return homeConfigZh
  if (code.startsWith('de')) return homeConfigDe
  if (code.startsWith('es')) return homeConfigEs
  if (code.startsWith('fr')) return homeConfigFr
  if (code.startsWith('ja')) return homeConfigJa
  if (code.startsWith('ko')) return homeConfigKo
  if (code.startsWith('pt')) return homeConfigPt
  if (code.startsWith('ru')) return homeConfigRu
  return homeConfigEn
})
</script>

<template>
  <div class="landing-page-wrapper bg-canvas text-neutral-900 dark:bg-[#0A0A0F] dark:text-gray-300 min-h-screen antialiased">
    <ScrollProgress />
    <HomeHero :data="data.hero" />
    <HomeAudience :data="data.audience" />
    <HomeFeatures :data="data.features" />
    <HomeTutorials :data="data.tutorials" />

    <!-- CTA Section -->
    <section class="relative py-24 border-t border-neutral-100 dark:border-white/5 section-bg-base">
      <div class="max-w-3xl mx-auto px-6 text-center">
        <div class="lp-section-title mb-4 lp-text-primary dark:text-white">{{ data.cta_section?.title }}</div>
        <div class="lp-text-secondary dark:text-gray-500 mb-10">{{ data.cta_section?.subtitle }}</div>
        <a :href="data.cta_section?.button_link"
          class="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-brand-600 to-emerald-500 lp-text-contrast font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-brand-500/20 border-0"
          style="border: none;">
          {{ data.cta_section?.button_text }}
          <i class="ph ph-arrow-right"></i>
        </a>
      </div>
    </section>

    <SiteFooter :data="data.footer" />
  </div>
</template>

<style scoped>
.landing-page-wrapper {
  width: 100%;
}
</style>
