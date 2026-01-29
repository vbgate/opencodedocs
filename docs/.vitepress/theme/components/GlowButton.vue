<script setup>
/**
 * GlowButton.vue - 发光按钮组件
 * 
 * 带有动态光晕效果的 CTA 按钮
 */
defineProps({
  href: {
    type: String,
    default: '#',
  },
  variant: {
    type: String,
    default: 'primary', // primary | secondary | ghost
  },
  external: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <a
    :href="href"
    class="glow-button"
    :class="[`glow-button--${variant}`]"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noreferrer' : undefined"
  >
    <span class="glow-button__bg"></span>
    <span class="glow-button__content">
      <slot />
    </span>
  </a>
</template>

<style scoped>
.glow-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.95rem;
  text-decoration: none !important;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.3s ease;
  overflow: hidden;
}

.glow-button:hover {
  transform: translateY(-2px);
}

.glow-button:active {
  transform: translateY(0);
}

/* 背景层 */
.glow-button__bg {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  transition: opacity 0.3s ease;
}

/* 内容层 */
.glow-button__content {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

/* Primary 变体 */
.glow-button--primary {
  color: #fff !important;
}

.glow-button--primary .glow-button__bg {
  background: linear-gradient(135deg, var(--code-purple, #C084FC), var(--code-blue, #60A5FA));
  box-shadow: 
    0 0 20px rgba(96, 165, 250, 0.3),
    0 0 40px rgba(192, 132, 252, 0.2);
}

.glow-button--primary:hover .glow-button__bg {
  box-shadow: 
    0 0 30px rgba(96, 165, 250, 0.4),
    0 0 60px rgba(192, 132, 252, 0.3);
}

/* Secondary 变体 */
.glow-button--secondary {
  color: var(--text-primary, #fff) !important;
}

.glow-button--secondary .glow-button__bg {
  background: var(--bg-elevated, #1F2937);
  border: 1px solid var(--border-default, rgba(96, 165, 250, 0.2));
}

.glow-button--secondary:hover .glow-button__bg {
  border-color: var(--border-strong, rgba(96, 165, 250, 0.35));
  box-shadow: 0 0 20px rgba(96, 165, 250, 0.15);
}

/* Ghost 变体 */
.glow-button--ghost {
  color: var(--code-blue, #60A5FA) !important;
  padding: 0.625rem 1rem;
}

.glow-button--ghost .glow-button__bg {
  background: transparent;
  border: 1px solid var(--border-subtle, rgba(96, 165, 250, 0.12));
}

.glow-button--ghost:hover .glow-button__bg {
  background: rgba(96, 165, 250, 0.08);
  border-color: var(--border-default, rgba(96, 165, 250, 0.2));
}

/* 深度链接样式 */
.glow-button :deep(svg) {
  width: 18px;
  height: 18px;
}
</style>
