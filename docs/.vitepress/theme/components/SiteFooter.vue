<script setup lang="ts">

defineProps<{
  data: any
}>()
</script>

<template>
  <footer class="bg-neutral-50 dark:bg-[#0A0A0F] border-t border-neutral-200 dark:border-white/5 text-neutral-500 dark:text-gray-500 py-12">
    <div class="max-w-7xl mx-auto px-6">
      <div class="flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-gradient-to-br from-brand-500 to-emerald-500 rounded-lg flex items-center justify-center shadow-md">
            <i class="ph-bold ph-code text-white text-sm"></i>
          </div>
          <span class="font-semibold text-neutral-900 dark:text-white">{{ data?.title ?? 'OpenCodeDocs' }}</span>
        </div>

        <div class="flex items-center gap-6 text-sm">
          <template v-if="data?.links">
            <a v-for="(link, i) in data.links" :key="i" :href="link.link" :target="link.link.startsWith('http') ? '_blank' : '_self'" class="hover:text-brand-600 dark:hover:text-white transition-colors">
              <i v-if="link.icon" :class="['ph text-lg', link.icon]"></i>
              <span v-else>{{ link.text }}</span>
            </a>
          </template>
        </div>

        <div class="text-sm text-neutral-500 dark:text-gray-600">{{ data?.copyright ?? '© OpenCodeDocs' }}</div>
      </div>
    </div>
  </footer>
</template>
