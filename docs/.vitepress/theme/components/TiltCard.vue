<script setup>
/**
 * TiltCard.vue - 3D 倾斜效果卡片容器
 * 
 * 鼠标悬停时产生微倾斜效果，类似 Apple 风格
 */
import { ref, computed } from 'vue'

const props = defineProps({
  maxTilt: {
    type: Number,
    default: 8, // 最大倾斜角度
  },
  scale: {
    type: Number,
    default: 1.02, // 悬停时的缩放
  },
  glare: {
    type: Boolean,
    default: true, // 是否显示光泽效果
  },
})

const cardRef = ref(null)
const isHovering = ref(false)
const rotateX = ref(0)
const rotateY = ref(0)
const glareX = ref(50)
const glareY = ref(50)

const handleMouseMove = (e) => {
  if (!cardRef.value) return
  
  const rect = cardRef.value.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2
  
  const mouseX = e.clientX - centerX
  const mouseY = e.clientY - centerY
  
  // 计算倾斜角度
  rotateY.value = (mouseX / (rect.width / 2)) * props.maxTilt
  rotateX.value = -(mouseY / (rect.height / 2)) * props.maxTilt
  
  // 计算光泽位置
  glareX.value = ((e.clientX - rect.left) / rect.width) * 100
  glareY.value = ((e.clientY - rect.top) / rect.height) * 100
}

const handleMouseEnter = () => {
  isHovering.value = true
}

const handleMouseLeave = () => {
  isHovering.value = false
  rotateX.value = 0
  rotateY.value = 0
}

const cardStyle = computed(() => ({
  transform: isHovering.value 
    ? `perspective(1000px) rotateX(${rotateX.value}deg) rotateY(${rotateY.value}deg) scale(${props.scale})`
    : 'perspective(1000px) rotateX(0) rotateY(0) scale(1)',
}))

const glareStyle = computed(() => ({
  background: `radial-gradient(circle at ${glareX.value}% ${glareY.value}%, rgba(255, 255, 255, 0.15) 0%, transparent 60%)`,
  opacity: isHovering.value ? 1 : 0,
}))
</script>

<template>
  <div
    ref="cardRef"
    class="tilt-card"
    :style="cardStyle"
    @mousemove="handleMouseMove"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <slot />
    <div v-if="glare" class="tilt-glare" :style="glareStyle"></div>
  </div>
</template>

<style scoped>
.tilt-card {
  position: relative;
  transition: transform 0.15s ease-out;
  transform-style: preserve-3d;
  will-change: transform;
}

.tilt-glare {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  transition: opacity 0.3s ease;
  z-index: 10;
}
</style>
