<script setup lang="ts">

defineProps<{
  data: any
}>()

const getIconColor = (color: string) => {
  // 设计稿: text-brand-400 (在深色背景下)
  // Light: text-brand-600
  const map: Record<string, string> = {
    brand: 'text-brand-600 dark:text-brand-400',
    emerald: 'text-emerald-600 dark:text-emerald-400',
    amber: 'text-amber-500 dark:text-amber-400'
  }
  return map[color] || 'text-brand-600 dark:text-brand-400'
}

const getBgColor = (color: string) => {
  // 设计稿: bg-brand-500/10 border-brand-500/20 (深色)
  // Light: bg-brand-50 border-brand-100
  const map: Record<string, string> = {
    brand: 'bg-brand-50 border-brand-100 dark:bg-brand-500/10 dark:border-brand-500/20',
    emerald: 'bg-emerald-50 border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20',
    amber: 'bg-amber-50 border-amber-100 dark:bg-amber-500/10 dark:border-amber-500/20'
  }
  return map[color] || 'bg-brand-50 border-brand-100 dark:bg-brand-500/10 dark:border-brand-500/20'
}
</script>

<template>
  <section class="relative py-24 border-t border-neutral-100 dark:border-white/5 section-bg-base">
    <div class="max-w-5xl mx-auto px-6">
      <div class="text-center mb-16">
        <div class="lp-subsection-title mb-4 lp-text-primary dark:text-white">{{ data.title }}</div>
        <div class="lp-text-secondary dark:text-gray-500">{{ data.subtitle }}</div>
      </div>

      <div class="grid md:grid-cols-3 gap-8">
        <div v-for="(item, i) in data.list" :key="i" class="text-center p-6 bg-white dark:bg-transparent rounded-2xl border border-neutral-100 dark:border-none shadow-sm dark:shadow-none">
          <div :class="['inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5 border', getBgColor(item.color)]">
            <i :class="['ph-duotone text-2xl', item.icon, getIconColor(item.color)]"></i>
          </div>
          <div class="font-semibold mb-2 lp-text-primary dark:text-white">{{ item.title }}</div>
          <div class="text-sm lp-text-secondary dark:text-gray-500 leading-relaxed">
            {{ item.desc }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
