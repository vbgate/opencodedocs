<script setup lang="ts">
import { computed } from 'vue'
import SiteFooter from './SiteFooter.vue'
import homeConfig from '../../../home-config.json'

const props = defineProps<{
  data: any
}>()

// Helper to resolve links relative to base if needed, but here we assume links are correct in JSON
</script>

<template>
  <div class="project-home-container bg-canvas dark:bg-[#09090b] text-neutral-900 dark:text-neutral-50 font-sans min-h-screen flex flex-col vp-raw transition-colors duration-300">
    
    <!-- Header is now handled by Global Navbar -->

    <main class="flex-grow pt-16">
    <!-- Hero Section -->
    <section class="hero-section bg-white dark:bg-[#09090b] border-b border-neutral-200/60 dark:border-white/10 relative overflow-hidden transition-colors duration-300">
      <!-- Background Decorations -->
      <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      
      <div class="section-inner !text-center relative z-10">
        <h1 class="hero-title text-neutral-900 dark:text-white tracking-tight leading-tight max-w-3xl mx-auto">
          {{ data.project.name }} <br>
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600 dark:from-brand-400 dark:to-indigo-400">
            {{ data.project.tagline }}
          </span>
        </h1>
        
        <p class="hero-desc text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-3xl mx-auto transition-colors">
          {{ data.project.description }}
        </p>

        <!-- Action Buttons -->
        <div class="flex flex-wrap items-center justify-center gap-4">
          <!-- Primary Action -->
          <a v-if="data.hero.primary_action"
             :href="data.hero.primary_action.link"
             class="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 !text-white dark:!text-neutral-900 font-semibold rounded-xl shadow-lg shadow-neutral-500/10 dark:shadow-none transition-all hover:-translate-y-0.5">
            <i class="ph-bold ph-rocket-launch"></i>
            {{ data.hero.primary_action.text }}
          </a>
          <!-- GitHub Action -->
          <a v-if="data.project.github_url"
             :href="data.project.github_url"
             target="_blank"
             rel="noopener noreferrer"
             class="inline-flex items-center justify-center gap-2 px-8 py-3.5 border-2 border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600 bg-transparent !text-neutral-700 dark:!text-neutral-300 font-semibold rounded-xl transition-all hover:-translate-y-0.5">
            <i class="ph-bold ph-github-logo"></i>
            GitHub
          </a>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="feature-section bg-canvas dark:bg-[#09090b] transition-colors duration-300">
      <div class="section-inner">
        <div class="mb-20 text-center">
          <div class="feature-section-title text-neutral-900 dark:text-white mb-2">{{ data.features.title }}</div>
          <p class="text-neutral-500 dark:text-neutral-400">{{ data.features.subtitle }}</p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          <div v-for="(feature, idx) in data.features.list" :key="idx">
            <div class="feature-item-title text-neutral-900 dark:text-white mb-2">{{ feature.title }}</div>
            <p class="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">{{ feature.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Documentation Index -->
    <section id="docs" class="doc-section bg-white dark:bg-[#09090b] border-t border-neutral-200 dark:border-white/10 transition-colors duration-300">
      <div class="section-inner">
        <div class="flex items-center justify-between mb-10">
          <div class="doc-section-title text-neutral-900 dark:text-white">{{ data.docs.title }}</div>
          <span class="text-sm text-neutral-500 dark:text-neutral-400">{{ data.docs.subtitle }}</span>
        </div>

        <div class="space-y-8">
          <div v-for="(section, sIdx) in data.docs.sections" :key="sIdx">
             <div class="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-4">{{ section.title }}</div>
             <div class="grid gap-0 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden divide-y divide-neutral-200 dark:divide-neutral-800">
               <a v-for="(item, iIdx) in section.items" :key="iIdx" 
                  :href="item.link" 
                  class="block p-5 bg-white dark:bg-[#111113] hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors group">
                  <div class="flex items-center justify-between">
                    <div>
                      <div class="font-semibold text-neutral-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{{ item.title }}</div>
                      <p class="text-sm text-neutral-500 dark:text-neutral-400 mt-1">{{ item.desc }}</p>
                    </div>
                    <i class="ph-bold ph-arrow-right text-neutral-300 dark:text-neutral-600 group-hover:text-brand-500 dark:group-hover:text-brand-400"></i>
                  </div>
               </a>
             </div>
          </div>
        </div>
      </div>
    </section>

    </main>

    <SiteFooter :data="homeConfig.footer" />
  </div>
</template>

<style scoped>
/* 暴力覆盖样式，确保 1:1 还原 HTML 设计稿的字号和间距 */
.section-inner {
  max-width: 56rem !important; /* 896px (max-w-4xl) */
  margin-left: auto !important;
  margin-right: auto !important;
  padding-left: 1.5rem !important; /* px-6 */
  padding-right: 1.5rem !important;
}

@media (min-width: 1024px) {
  .section-inner {
    padding-left: 2rem !important; /* lg:px-8 */
    padding-right: 2rem !important;
  }
}

.hero-section {
  padding-top: 6rem !important; /* py-24 */
  padding-bottom: 6rem !important;
}
@media (min-width: 1024px) {
  .hero-section {
    padding-top: 8rem !important; /* lg:py-32 */
    padding-bottom: 8rem !important;
  }
}

.feature-section, .doc-section {
  padding-top: 4rem !important; /* py-16 */
  padding-bottom: 4rem !important;
}
@media (min-width: 1024px) {
  .feature-section, .doc-section {
    padding-top: 6rem !important; /* lg:py-24 */
    padding-bottom: 6rem !important;
  }
}


.hero-title {
  font-size: 2.25rem !important; /* text-4xl (36px) */
  font-weight: 800 !important;
  line-height: 1.25 !important; /* leading-tight */
  margin-bottom: 1.5rem !important;
}

@media (min-width: 1024px) {
  .hero-title {
    font-size: 3rem !important; /* text-5xl (48px) */
  }
}

.hero-desc {
  font-size: 1.125rem !important; /* text-lg (18px) */
  line-height: 1.625 !important; /* leading-relaxed */
  margin-bottom: 2.5rem !important;
}

.feature-section-title {
  font-size: 1.5rem !important; /* text-2xl (24px) */
  font-weight: 700 !important;
}

.feature-item-title {
  font-size: 1.125rem !important; /* text-lg (18px) */
  font-weight: 700 !important;
}

.doc-section-title {
  font-size: 1.25rem !important; /* text-xl (20px) */
  font-weight: 700 !important;
}
</style>
