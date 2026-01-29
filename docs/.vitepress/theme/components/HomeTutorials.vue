<script setup lang="ts">

defineProps<{
  data: any
}>()
</script>

<template>
  <section id="tutorials" class="relative py-24 border-t border-neutral-100 dark:border-white/5 bg-white dark:bg-[#0A0A0F]">
    <div class="max-w-7xl mx-auto px-6">
      <div class="mb-12">
        <div class="lp-subsection-title mb-2 text-neutral-900 dark:text-white">{{ data.title }} <i class="ph ph-arrow-down"></i></div>
        <div class="lp-text-secondary dark:text-gray-500">{{ data.subtitle }}</div>
      </div>

      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <div v-for="(item, i) in data.list" :key="i" class="project-card group relative bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/5 rounded-2xl p-5 hover:border-brand-300 dark:hover:border-brand-500/30 hover:shadow-card transition-all duration-300">
          <!-- Star Count Badge -->
          <div v-if="item.meta?.stars" class="absolute top-5 right-5 flex items-center gap-1 px-2 py-1 rounded-md bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-xs font-medium text-neutral-600 dark:text-gray-400 filter backdrop-blur-sm z-20">
            <i class="ph-fill ph-star text-amber-400"></i>
            {{ item.meta.stars }}
          </div>

          <!-- 全卡片点击链接 -->
          <a :href="item.link" class="absolute inset-0 z-0" :aria-label="'查看 ' + item.title"></a>
          
          <div class="relative z-10 pointer-events-none">
            <div class="font-semibold text-lg lp-text-primary dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors mb-2 pr-12">{{ item.title }}</div>
            <div class="text-sm lp-text-secondary dark:text-gray-500 mb-8 line-clamp-2 min-h-[2.5rem]">{{ item.desc }}</div>
            
            <div class="flex items-center justify-end mt-auto">
              <!-- 右侧：GitHub (原型样式: 纯 Logo) -->
              <a :href="item.repo" target="_blank" class="pointer-events-auto text-neutral-400 dark:text-gray-500 hover:text-neutral-900 dark:hover:text-white transition-colors">
                <i class="ph ph-github-logo text-lg"></i>
              </a>
            </div>
          </div>
        </div>

        <!-- Apply Project Card (Dynamic from config) -->
        <div class="project-card group cta-card relative rounded-2xl p-5 transition-all cursor-pointer">
          <!-- 全卡片点击链接：跳转到 Issues -->
          <a :href="data.apply_card?.link || 'https://github.com/vbgate/opencodedocs/issues'" target="_blank" class="absolute inset-0 z-0" :aria-label="data.apply_card?.title"></a>
          
          <div class="relative z-10 pointer-events-none">
            <div class="font-semibold group-hover:text-brand-400 transition-colors mb-2">{{ data.apply_card?.title || '申请收录你的项目' }}</div>
            <div class="text-sm lp-text-secondary dark:text-gray-500 mb-4 min-h-[2.5rem]">
               <!-- 使用 Emerald 绿色并修复文案显示 -->
              <span class="text-emerald-600 dark:text-emerald-400 font-bold">1.</span> {{ data.apply_card?.steps?.[0] || '提交 Issue' }} → 
              <span class="text-emerald-600 dark:text-emerald-400 font-bold">2.</span> {{ data.apply_card?.steps?.[1] || '团队审核' }} → 
              <span class="text-emerald-600 dark:text-emerald-400 font-bold">3.</span> {{ data.apply_card?.steps?.[2] || '教程上线' }}
            </div>
            
            <div class="flex items-center justify-between mt-auto">
              <div class="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 font-medium">
                {{ data.apply_card?.cta_text || '立即申请' }} <i class="ph ph-arrow-right"></i>
              </div>
              <a :href="data.apply_card?.repo_link || 'https://github.com/vbgate/opencodedocs'" target="_blank" class="pointer-events-auto text-neutral-500 dark:text-gray-500 hover:text-white transition-colors">
                <i class="ph ph-github-logo text-lg"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
