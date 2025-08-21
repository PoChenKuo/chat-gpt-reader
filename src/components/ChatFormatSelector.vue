<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { CHAT_FORMATS } from '@/config/chat-formats'

// --- Props and Emits ---
interface Props {
  modelValue: {
    userPrefix: string
    assistantPrefix: string
  }
}

interface Emits {
  (e: 'update:modelValue', value: { userPrefix: string; assistantPrefix: string }): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// --- State ---
const { t, locale } = useI18n()
const selectedFormatId = ref('')
const customUserPrefix = ref('')
const customAssistantPrefix = ref('')

// --- Computed Properties ---
const chatFormats = computed(() => {
  return CHAT_FORMATS.map(format => ({
    ...format,
    name: t(format.nameKey),
    userPrefix: t(format.userPrefixKey),
    assistantPrefix: t(format.assistantPrefixKey),
    description: t(format.descriptionKey)
  }))
})

const selectedFormat = computed(() => {
  return chatFormats.value.find(format => format.id === selectedFormatId.value) || chatFormats.value[0]
})

const isCustomFormat = computed(() => selectedFormatId.value === 'custom')

// --- Methods ---
const updateModelValue = () => {
  const userPrefix = isCustomFormat.value ? customUserPrefix.value : selectedFormat.value.userPrefix
  const assistantPrefix = isCustomFormat.value ? customAssistantPrefix.value : selectedFormat.value.assistantPrefix
  emit('update:modelValue', { userPrefix, assistantPrefix })
}

const updateCustomPrefixes = (userPrefix: string, assistantPrefix: string) => {
  customUserPrefix.value = userPrefix
  customAssistantPrefix.value = assistantPrefix
}

// --- Watchers ---
watch(selectedFormatId, (newFormatId) => {
  const format = chatFormats.value.find(f => f.id === newFormatId)
  if (format) {
    updateCustomPrefixes(format.userPrefix, format.assistantPrefix)
  }
  updateModelValue()
})

watch(() => props.modelValue, (newValue) => {
  const matchingFormat = chatFormats.value.find(format =>
    format.userPrefix === newValue.userPrefix &&
    format.assistantPrefix === newValue.assistantPrefix
  )

  if (matchingFormat) {
    selectedFormatId.value = matchingFormat.id
  } else {
    selectedFormatId.value = 'custom'
    updateCustomPrefixes(newValue.userPrefix, newValue.assistantPrefix)
  }
}, { immediate: true })

watch(locale, () => {
  updateModelValue()
})

watch([customUserPrefix, customAssistantPrefix], () => {
  if (isCustomFormat.value) {
    updateModelValue()
  }
})
selectedFormatId.value = 'chatgpt-default'
</script>

<template>
  <div class="chat-format-selector">
    <div class="format-selection">
      <label for="formatSelect" class="format-label">
        {{ t('app.config.selectFormat') }}
      </label>
      <select id="formatSelect" v-model="selectedFormatId" class="format-select">
        <option v-for="format in chatFormats" :key="format.id" :value="format.id" class="format-option">
          {{ format.name }} - {{ format.description }}
        </option>
      </select>
    </div>

    <div v-if="isCustomFormat" class="custom-format">
      <h4>{{ t('app.config.customFormat') }}</h4>
      <div class="custom-inputs">
        <div class="input-group">
          <label for="userPrefix">{{ t('app.config.userPrefix') }}</label>
          <input id="userPrefix" v-model="customUserPrefix" type="text"
            :placeholder="t('app.config.userPrefixPlaceholder')" class="custom-input" />
        </div>
        <div class="input-group">
          <label for="assistantPrefix">{{ t('app.config.assistantPrefix') }}</label>
          <input id="assistantPrefix" v-model="customAssistantPrefix" type="text"
            :placeholder="t('app.config.assistantPrefixPlaceholder')" class="custom-input" />
        </div>
      </div>
    </div>

    <div v-else class="format-preview">
      <h4>{{ t('app.config.selectFormat') }}: {{ selectedFormat.name }}</h4>
      <div class="preview-content">
        <p><strong>{{ t('app.config.userPrefix') }}:</strong> {{ selectedFormat.userPrefix }}</p>
        <p><strong>{{ t('app.config.assistantPrefix') }}:</strong> {{ selectedFormat.assistantPrefix }}</p>
        <p class="description">{{ selectedFormat.description }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-format-selector {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.format-selection {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.format-label {
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
}

.format-select {
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  font-size: 1rem;
  background: white;
  transition: border-color 0.3s ease;
}

.format-select:focus {
  outline: none;
  border-color: #667eea;
}

.format-option {
  padding: 0.5rem;
}

.custom-format,
.format-preview {
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
}

.custom-format h4,
.format-preview h4 {
  margin: 0 0 1rem 0;
  color: #1f2937;
  font-size: 1.1rem;
}

.custom-inputs {
  display: grid;
  /* grid-template-columns: 1fr 1fr; */
  grid-template-columns: 1fr;
  gap: 1rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-group label {
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
}

.custom-input {
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.custom-input:focus {
  outline: none;
  border-color: #667eea;
}

.preview-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.preview-content p {
  margin: 0;
  color: #374151;
}

.preview-content strong {
  color: #1f2937;
}

.description {
  font-style: italic;
  color: #6b7280 !important;
  font-size: 0.875rem;
}
</style>
