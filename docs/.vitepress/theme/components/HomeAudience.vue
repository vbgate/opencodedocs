<script setup lang="ts">

defineProps<{
  data: any
}>()
</script>

<template>
  <section class="relative py-24 border-t border-neutral-100 dark:border-white/5 section-bg-base">
    <div class="max-w-6xl mx-auto px-6">
      <div class="text-center mb-16">
        <div class="lp-section-title mb-4 lp-text-primary dark:text-white" v-html="data.title"></div>
        <div class="lp-text-secondary dark:text-gray-500 text-lg">{{ data.subtitle }}</div>
      </div>

      <div class="grid md:grid-cols-2 gap-8">
        <!-- Beginner Card -->
        <div class="group relative flex flex-col justify-between bg-white dark:bg-[#0A0A0F] border border-neutral-200 dark:border-white/10 rounded-3xl p-8 lg:p-10 overflow-hidden hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all duration-500 hover:-translate-y-1 cursor-pointer hover:shadow-card">
          <!-- Dynamic Backgrounds -->
          <div class="absolute inset-0 card-glow-panic pointer-events-none"></div>
          <div class="absolute inset-0 card-glow-success pointer-events-none"></div>

          <!-- Terminal Simulator -->
          <div class="absolute top-6 right-6 w-56 font-mono text-[10px] sm:text-xs leading-relaxed pointer-events-none select-none opacity-40 group-hover:opacity-100 transition-opacity duration-300 terminal-text">
              <div class="text-red-500/80 dark:text-red-400/80 group-hover:hidden font-medium">
                  <p v-for="(line, i) in data.beginner.terminal.panic" :key="'p'+i" :class="{'animate-pulse mt-1': i === data.beginner.terminal.panic.length-1}">{{ line }}</p>
              </div>
              <div class="hidden group-hover:block text-emerald-600 dark:text-emerald-400 font-medium">
                   <p v-for="(line, i) in data.beginner.terminal.success" :key="'s'+i" :class="{'animate-pulse mt-1 text-emerald-500 dark:text-emerald-300': i === data.beginner.terminal.success.length-1}">{{ line }}</p>
              </div>
          </div>
          
          <div class="relative z-10">
            <div class="inline-flex items-center gap-2 px-3 py-1 bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded-lg text-neutral-500 dark:text-gray-300 text-sm font-medium mb-6 transition-colors group-hover:bg-emerald-50 dark:group-hover:bg-emerald-500/10 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:border-emerald-200 dark:group-hover:border-emerald-500/20">
              <i class="ph-fill ph-lightning"></i> {{ data.beginner.badge }}
            </div>
            <div class="lp-card-title mb-4 leading-tight lp-text-primary dark:text-white group-hover:text-neutral-900 dark:group-hover:text-white transition-colors" v-html="data.beginner.title"></div>
            <div class="lp-text-secondary dark:text-gray-400 leading-relaxed mb-8 group-hover:text-neutral-600 dark:group-hover:text-gray-300 transition-colors" v-html="data.beginner.description"></div>
            <div class="flex flex-wrap gap-3 mb-8">
              <span v-for="(tag, i) in data.beginner.tags" :key="i" class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded-lg text-sm text-neutral-500 dark:text-gray-300 group-hover:border-emerald-200 dark:group-hover:border-emerald-500/30 group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors">
                <i :class="['ph-fill', tag.icon, 'text-brand-500 dark:text-gray-400 group-hover:text-emerald-500 dark:group-hover:text-emerald-400']"></i> {{ tag.text }}
              </span>
            </div>
          </div>
          <div class="fade-up-delay-1 flex items-center gap-2 text-brand-600 dark:text-gray-500 font-medium group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors relative z-10">
            {{ data.beginner.cta }} <i class="ph-bold ph-arrow-right group-hover:translate-x-1 transition-transform"></i>
          </div>
        </div>

        <!-- Advanced Card -->
        <div class="group relative flex flex-col justify-between bg-white dark:bg-[#0A0A0F] border border-neutral-200 dark:border-white/10 rounded-3xl p-8 lg:p-10 overflow-hidden hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all duration-500 hover:-translate-y-1 cursor-pointer hover:shadow-card">
          <div class="absolute inset-0 xray-grid pointer-events-none"></div>
          
           <svg class="absolute top-0 right-0 w-full h-full pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity duration-700" viewBox="0 0 400 400" fill="none">
               <path d="M400 0 L200 200 L400 400" stroke="#10B981" stroke-width="1" class="group-hover:stroke-2 transition-all"/>
               <circle cx="200" cy="200" r="4" fill="#10B981" class="group-hover:animate-ping"/>
           </svg>

          <div class="relative z-10">
            <div class="inline-flex items-center gap-2 px-3 py-1 bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded-lg text-neutral-500 dark:text-gray-300 text-sm font-medium mb-6 transition-colors group-hover:bg-emerald-50 dark:group-hover:bg-emerald-500/10 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:border-emerald-200 dark:group-hover:border-emerald-500/20">
              <i class="ph-fill ph-wrench"></i> {{ data.advanced.badge }}
            </div>
            <div class="lp-card-title mb-4 leading-tight lp-text-primary dark:text-white transition-colors" v-html="data.advanced.title"></div>
            <div class="lp-text-secondary dark:text-gray-400 leading-relaxed mb-8 group-hover:text-neutral-600 dark:group-hover:text-gray-300 transition-colors" v-html="data.advanced.description"></div>
            <div class="flex flex-wrap gap-3 mb-8">
              <span v-for="(tag, i) in data.advanced.tags" :key="i" class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded-lg text-sm text-neutral-500 dark:text-gray-300 group-hover:border-emerald-200 dark:group-hover:border-emerald-500/30 group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors">
                <i :class="['ph-fill', tag.icon, 'text-emerald-500 dark:text-gray-400 group-hover:text-emerald-500 dark:group-hover:text-emerald-400']"></i> {{ tag.text }}
              </span>
            </div>
          </div>
          <div class="flex items-center gap-2 text-emerald-600 dark:text-gray-500 font-medium group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors relative z-10">
            {{ data.advanced.cta }} <i class="ph-bold ph-arrow-right group-hover:translate-x-1 transition-transform"></i>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* === Card-Native Interactive Styles === */
.card-glow-panic {
  background: radial-gradient(circle at 70% 30%, rgba(239, 68, 68, 0.15) 0%, transparent 60%);
  opacity: 1;
  transition: opacity 0.4s ease;
}

.group:hover .card-glow-panic {
  opacity: 0;
}

.card-glow-success {
  background: radial-gradient(circle at 70% 30%, rgba(16, 185, 129, 0.2) 0%, transparent 60%);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.group:hover .card-glow-success {
  opacity: 1;
}

/* Terminal Typing Effect */
.terminal-text p {
  overflow: hidden;
  white-space: nowrap;
  border-right: 2px solid transparent;
}

.group:hover .terminal-text p:nth-child(1) {
  animation: typing 0.5s steps(20) forwards;
  width: 0;
  animation-fill-mode: forwards;
}

.group:hover .terminal-text p:nth-child(2) {
  animation: typing 0.5s steps(20) 0.5s forwards;
  width: 0;
  opacity: 0;
  animation-fill-mode: forwards;
}

.group:hover .terminal-text p:nth-child(3) {
  animation: typing 0.5s steps(20) 1s forwards;
  width: 0;
  opacity: 0;
  animation-fill-mode: forwards;
}

.group:hover .terminal-text p:nth-child(4) { /* 兼容原有逻辑，虽原型只有3行 */
  animation: typing 0.5s steps(20) 1.5s forwards;
  width: 0;
  opacity: 0;
  animation-fill-mode: forwards;
}

@keyframes typing {
  from {
    width: 0;
    opacity: 1;
  }

  to {
    width: 100%;
    opacity: 1;
  }
}

/* X-Ray Grid */
.xray-grid {
  background-image:
    linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
  mask-image: radial-gradient(circle at 80% 20%, transparent 0%, black 100%);
  /* Default hidden/obscured */
  transition: all 0.6s ease;
  opacity: 0.3;
}

.group:hover .xray-grid {
  mask-image: radial-gradient(circle at 80% 20%, black 40%, transparent 100%);
  /* Reveal */
  opacity: 0.8;
  transform: scale(1.1);
}

/* 深色模式适配覆盖 */
.dark .xray-grid {
    /* 原型 HTML 没有显式定义 .dark .xray-grid，统一用一套即可，或者根据视觉微调 */
    opacity: 0.3;
}
.dark .group:hover .xray-grid {
    opacity: 0.8;
}


</style>
