<script setup lang="ts">
import { onMounted, ref } from 'vue'

const props = defineProps<{
  data: any
}>()

// Typing effect logic
const typeWriterElement = ref<HTMLElement | null>(null)
let textIndex = 0
let charIndex = 0
let isDeleting = false

const typeWriter = () => {
  if (!typeWriterElement.value) return 
  const texts = props.data.typewriter_texts || []
  if (texts.length === 0) return

  const currentPhrase = texts[textIndex]

  if (!isDeleting && charIndex <= currentPhrase.length) {
    typeWriterElement.value.innerHTML = currentPhrase.substring(0, charIndex)
    charIndex++
    if (charIndex > currentPhrase.length) {
      isDeleting = true
      setTimeout(typeWriter, 2000)
    } else {
      setTimeout(typeWriter, 150)
    }
  } else if (isDeleting && charIndex >= 0) {
    typeWriterElement.value.innerHTML = currentPhrase.substring(0, charIndex)
    charIndex--
    if (charIndex < 0) {
      isDeleting = false
      charIndex = 0
      textIndex = (textIndex + 1) % texts.length
      setTimeout(typeWriter, 500)
    } else {
      setTimeout(typeWriter, 80)
    }
  }
}

onMounted(() => {
  setTimeout(typeWriter, 800)
})
</script>

<template>
  <section class="hero-bg min-h-screen flex items-center pt-16 relative overflow-hidden">
    <!-- 背景光效 (还原原型) -->
    <div
      class="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-brand-500/20 rounded-full blur-[120px] -z-10 opacity-50 pointer-events-none">
    </div>
    <div
      class="absolute bottom-0 right-0 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[120px] -z-10 opacity-30 pointer-events-none">
    </div>
    <div class="absolute inset-0 grid-bg -z-20"></div>

    <div class="relative max-w-7xl mx-auto px-6 py-20 lg:py-32 w-full">
      <div class="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

        <!-- Left: Content -->
        <div class="max-w-2xl">
          <div class="fade-up inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 dark:bg-brand-500/10 dark:border-brand-500/20 dark:text-brand-400 text-sm font-medium mb-6">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 dark:bg-brand-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 dark:bg-brand-500"></span>
            </span>
            {{ data.badge }}
          </div>

          <div class="lp-hero-title fade-up fade-up-delay-1 mb-6 lp-text-primary dark:text-white leading-[1.1] tracking-tight font-extrabold">
            {{ data.title_prefix }}<br>
            {{ data.title_main }}<br>
            <span class="bg-gradient-to-r from-brand-500 via-brand-600 to-emerald-500 bg-clip-text text-transparent">
              <span ref="typeWriterElement"></span><span class="typing-cursor"></span>
            </span>
          </div>

          <div class="lp-strong-text fade-up fade-up-delay-2 text-lg text-neutral-600 dark:text-gray-400 leading-relaxed mb-10 max-w-lg" v-html="data.description"></div>

          <div class="fade-up fade-up-delay-3 flex flex-wrap gap-4">
            <a :href="data.primary_action.link"
              class="group lp-btn-primary">
              {{ data.primary_action.text }}
              <i class="ph-bold ph-arrow-right group-hover:translate-x-1 transition-transform"></i>
            </a>
            <a :href="data.secondary_action.link" target="_blank"
              class="lp-btn-secondary">
              <i class="ph ph-github-logo text-xl"></i>
              {{ data.secondary_action.text }}
            </a>
          </div>
        </div>

        <!-- 右侧：对话演示窗口 -->
        <div class="fade-up fade-up-delay-3 hidden lg:block">
          <div class="code-window rounded-2xl overflow-hidden max-w-md mx-auto relative z-10">
            <!-- 窗口标题栏 -->
            <div class="flex items-center justify-between px-4 py-3 border-b border-neutral-200/50 bg-white/50 dark:border-white/5 dark:bg-black/30 backdrop-blur-sm">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-[#FF5F56] border border-black/5"></span>
                <span class="w-3 h-3 rounded-full bg-[#FFBD2E] border border-black/5"></span>
                <span class="w-3 h-3 rounded-full bg-[#27C93F] border border-black/5"></span>
              </div>
              <span class="text-xs text-neutral-400 dark:text-gray-500 font-medium">{{ data.chat_demo.title }}</span>
              <div class="flex items-center gap-2">
                <span class="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/30 rounded text-xs font-medium">
                  <i class="ph-fill ph-circle text-[8px] animate-pulse"></i> {{ data.chat_demo.ui?.online_text || 'Online' }}
                </span>
              </div>
            </div>

            <!-- 对话内容 -->
            <div class="p-5 space-y-4 bg-dots min-h-[300px]">
              <template v-for="(msg, index) in data.chat_demo.messages" :key="index">
                <!-- 用户消息 -->
                <div v-if="msg.role === 'user'" class="flex justify-end">
                  <div class="bg-brand-600 text-white dark:bg-brand-500/20 dark:border-brand-500/30 dark:text-gray-200 border border-transparent dark:border rounded-2xl rounded-br-md px-4 py-3 max-w-[85%] shadow-sm shadow-brand-500/20">
                    <p class="text-sm">{{ msg.text }}</p>
                  </div>
                </div>

                <!-- AI 回复 -->
                <div v-else class="flex justify-start">
                  <div class="bg-white dark:bg-white/5 border border-neutral-100 dark:border-white/10 rounded-2xl rounded-bl-md px-4 py-3 max-w-[85%] shadow-sm">
                    <p class="text-sm text-neutral-700 dark:text-gray-300" :class="{ 'mb-2': msg.status }">{{ msg.text }}</p>
                    
                    <!-- 任务完成状态 -->
                    <div v-if="msg.status" class="flex items-center gap-2">
                      <span class="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium rounded border border-emerald-100 dark:border-emerald-500/30 glow-badge">
                        <i class="ph-fill ph-seal-check text-[10px]"></i> {{ data.chat_demo.ui?.completed_text || 'Completed' }}
                      </span>
                      <span class="text-xs text-neutral-400 dark:text-gray-500" v-if="msg.meta">{{ msg.meta }}</span>
                    </div>
                  </div>
                </div>
              </template>
            </div>

            <!-- 底部输入框 -->
            <div class="px-4 py-3 bg-white/50 dark:bg-black/30 border-t border-neutral-200/50 dark:border-white/5 backdrop-blur-sm">
              <div class="flex items-center gap-3 px-4 py-2.5 bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded-xl shadow-sm">
                <input type="text" :placeholder="data.chat_demo.ui?.input_placeholder || 'Tell AI what to do...'"
                  class="flex-1 bg-transparent text-sm text-neutral-600 dark:text-gray-300 placeholder:text-neutral-400 dark:placeholder:text-gray-600 outline-none" disabled>
                <button
                  class="w-8 h-8 !bg-blue-600 hover:bg-blue-500 dark:!bg-blue-500 dark:hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors shadow-sm shadow-blue-500/20">
                  <i class="ph ph-paper-plane-tilt text-white"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-bg::before {
  /* 使用伪元素实现背景渐变，与 Tailwind 隔离 */
  display: block;
}
</style>
