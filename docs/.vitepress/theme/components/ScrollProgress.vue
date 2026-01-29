<script setup>
/**
 * ScrollProgress.vue - 滚动进度条
 * 
 * 显示页面滚动进度的顶部固定进度条
 */
import { ref, onMounted, onUnmounted } from 'vue'

const progress = ref(0)

const updateProgress = () => {
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  progress.value = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
}

onMounted(() => {
  window.addEventListener('scroll', updateProgress, { passive: true })
  updateProgress()
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateProgress)
})
</script>

<template>
  <div class="scroll-progress-container">
    <div 
      class="scroll-progress-bar"
      :style="{ transform: `scaleX(${progress / 100})` }"
    ></div>
  </div>
</template>

<style scoped>
.scroll-progress-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  z-index: 100;
  background: transparent;
  pointer-events: none;
}

.scroll-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #3B82F6, #10B981);
  transform-origin: left center;
  will-change: transform;
}
</style>
