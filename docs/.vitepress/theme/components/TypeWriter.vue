<script setup>
/**
 * TypeWriter.vue - 打字机效果组件
 * 
 * 支持多段文字、自定义速度、光标闪烁
 */
import { ref, onMounted, computed, watch } from 'vue'

const props = defineProps({
  // 要打印的文字（支持数组实现多行）
  text: {
    type: [String, Array],
    required: true,
  },
  // 每个字符的打字延迟（毫秒）
  speed: {
    type: Number,
    default: 80,
  },
  // 开始前的延迟
  startDelay: {
    type: Number,
    default: 500,
  },
  // 是否显示光标
  showCursor: {
    type: Boolean,
    default: true,
  },
  // 打字完成后是否保持光标
  keepCursor: {
    type: Boolean,
    default: false,
  },
  // 是否循环播放
  loop: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['complete'])

const displayText = ref('')
const isTyping = ref(false)
const showCursorState = ref(true)

const textArray = computed(() => {
  return Array.isArray(props.text) ? props.text : [props.text]
})

const fullText = computed(() => textArray.value.join('\n'))

let timeoutId = null

const typeText = async () => {
  isTyping.value = true
  displayText.value = ''
  
  await new Promise(r => setTimeout(r, props.startDelay))
  
  for (let i = 0; i <= fullText.value.length; i++) {
    displayText.value = fullText.value.slice(0, i)
    await new Promise(r => {
      timeoutId = setTimeout(r, props.speed)
    })
  }
  
  isTyping.value = false
  
  if (!props.keepCursor) {
    setTimeout(() => {
      showCursorState.value = false
    }, 1000)
  }
  
  emit('complete')
  
  if (props.loop) {
    await new Promise(r => setTimeout(r, 3000))
    typeText()
  }
}

onMounted(() => {
  typeText()
})

// 清理
import { onUnmounted } from 'vue'
onUnmounted(() => {
  if (timeoutId) clearTimeout(timeoutId)
})
</script>

<template>
  <span class="typewriter">
    <span class="typed-text">{{ displayText }}</span>
    <span 
      v-if="showCursor && showCursorState" 
      class="cursor"
      :class="{ typing: isTyping }"
    >|</span>
  </span>
</template>

<style scoped>
.typewriter {
  display: inline;
}

.typed-text {
  white-space: pre-wrap;
}

.cursor {
  display: inline-block;
  margin-left: 2px;
  font-weight: 400;
  color: var(--code-blue, #60A5FA);
  animation: blink 1s step-end infinite;
}

.cursor.typing {
  animation: none;
  opacity: 1;
}

@keyframes blink {
  0%, 50% {
    opacity: 1;
  }
  51%, 100% {
    opacity: 0;
  }
}
</style>
