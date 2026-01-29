<script setup>
/**
 * CodeParticles.vue - 代码粒子背景动画
 * 
 * 使用纯 CSS + SVG 实现飘动的模糊代码片段效果
 * 支持浅色/深色模式
 */
import { ref, onMounted } from 'vue'

// 代码片段样本（模糊显示，仅作装饰）
const codeSnippets = [
  'const config = { source: true }',
  'function derive(code) { ... }',
  'export default defineConfig',
  'import { verify } from "source"',
  '// 基于源码推导',
  'async function parse() {}',
  'type Verified = true',
  'return { trusted: true }',
  'const docs = await generate()',
  '{ "verified": true }',
  'npm install opencode',
  'git clone repo.git',
]

// 生成随机粒子配置
const particles = ref([])

const generateParticles = () => {
  const count = 12
  particles.value = Array.from({ length: count }, (_, i) => ({
    id: i,
    text: codeSnippets[i % codeSnippets.length],
    left: Math.random() * 100,
    delay: Math.random() * 20,
    duration: 25 + Math.random() * 15,
    size: 0.7 + Math.random() * 0.4,
    opacity: 0.03 + Math.random() * 0.05,
  }))
}

onMounted(() => {
  generateParticles()
})
</script>

<template>
  <div class="code-particles">
    <!-- 顶部光晕 -->
    <div class="hero-glow"></div>
    
    <!-- 网格背景 -->
    <div class="grid-bg"></div>
    
    <!-- 代码粒子 -->
    <div
      v-for="p in particles"
      :key="p.id"
      class="particle"
      :style="{
        left: `${p.left}%`,
        animationDelay: `${p.delay}s`,
        animationDuration: `${p.duration}s`,
        fontSize: `${p.size}rem`,
        opacity: p.opacity,
      }"
    >
      {{ p.text }}
    </div>
    
    <!-- 底部渐变遮罩 -->
    <div class="fade-bottom"></div>
  </div>
</template>

<style scoped>
.code-particles {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
  
  /* 浅色模式变量 - 增强光晕 */
  --cp-glow-1: rgba(37, 99, 235, 0.18);
  --cp-glow-2: rgba(124, 58, 237, 0.12);
  --cp-grid: rgba(37, 99, 235, 0.05);
  --cp-particle: #2563EB;
  --cp-fade: #FAFBFC;
}

/* 深色模式 - 增强光晕 */
:root.dark .code-particles {
  --cp-glow-1: rgba(96, 165, 250, 0.35);
  --cp-glow-2: rgba(192, 132, 252, 0.2);
  --cp-grid: rgba(96, 165, 250, 0.04);
  --cp-particle: #60A5FA;
  --cp-fade: #0A0F1A;
}

/* 顶部英雄光晕 - 增强效果 */
.hero-glow {
  position: absolute;
  top: -25%;
  left: 50%;
  transform: translateX(-50%);
  width: 160%;
  height: 90%;
  background: radial-gradient(
    ellipse 60% 50% at 50% 0%,
    var(--cp-glow-1) 0%,
    var(--cp-glow-2) 35%,
    transparent 70%
  );
  filter: blur(80px);
}

/* 网格背景 */
.grid-bg {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(var(--cp-grid) 1px, transparent 1px),
    linear-gradient(90deg, var(--cp-grid) 1px, transparent 1px);
  background-size: 64px 64px;
  mask-image: radial-gradient(ellipse 80% 60% at 50% 30%, black 0%, transparent 70%);
}

/* 代码粒子 */
.particle {
  position: absolute;
  bottom: -50px;
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  color: var(--cp-particle);
  white-space: nowrap;
  filter: blur(1px);
  will-change: transform;
  animation: float-up linear infinite;
}

@keyframes float-up {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 0.04;
  }
  90% {
    opacity: 0.04;
  }
  100% {
    transform: translateY(-120vh) rotate(3deg);
    opacity: 0;
  }
}

/* 底部渐变遮罩 */
.fade-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 200px;
  background: linear-gradient(to top, var(--cp-fade), transparent);
}

/* 减少动画模式 */
@media (prefers-reduced-motion: reduce) {
  .particle {
    animation: none;
    opacity: 0.02 !important;
  }
}
</style>
