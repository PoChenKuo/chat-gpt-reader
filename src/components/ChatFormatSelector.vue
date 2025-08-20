<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'



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

const { t, locale } = useI18n()

// Chat formats that respond to language changes
const chatFormats = computed(() => {
  // Force reactivity by accessing locale.value

  return [
    {
      id: 'chatgpt-default',
      name: t('app.formats.chatgptDefault.name'),
      userPrefix: t('app.formats.chatgptDefault.userPrefix'),
      assistantPrefix: t('app.formats.chatgptDefault.assistantPrefix'),
      description: t('app.formats.chatgptDefault.description')
    },
    {
      id: 'chatgpt-new',
      name: t('app.formats.chatgptNew.name'),
      userPrefix: t('app.formats.chatgptNew.userPrefix'),
      assistantPrefix: t('app.formats.chatgptNew.assistantPrefix'),
      description: t('app.formats.chatgptNew.description')
    },
    {
      id: 'claude',
      name: t('app.formats.claude.name'),
      userPrefix: t('app.formats.claude.userPrefix'),
      assistantPrefix: t('app.formats.claude.assistantPrefix'),
      description: t('app.formats.claude.description')
    },
    {
      id: 'bard',
      name: t('app.formats.bard.name'),
      userPrefix: t('app.formats.bard.userPrefix'),
      assistantPrefix: t('app.formats.bard.assistantPrefix'),
      description: t('app.formats.bard.description')
    },
    {
      id: 'custom',
      name: t('app.formats.custom.name'),
      userPrefix: t('app.formats.custom.userPrefix'),
      assistantPrefix: t('app.formats.custom.assistantPrefix'),
      description: t('app.formats.custom.description')
    }
  ]
})

const selectedFormatId = ref('chatgpt-default')
const customUserPrefix = ref('')
const customAssistantPrefix = ref('')

const selectedFormat = computed(() => {
  return chatFormats.value.find(format => format.id === selectedFormatId.value) || chatFormats.value[0]
})

const isCustomFormat = computed(() => selectedFormatId.value === 'custom')

const userPrefix = computed({
  get: () => {
    if (isCustomFormat.value) {
      return customUserPrefix.value
    }
    return selectedFormat.value.userPrefix
  },
  set: (value: string) => {
    if (isCustomFormat.value) {
      customUserPrefix.value = value
    }
  }
})

const assistantPrefix = computed({
  get: () => {
    if (isCustomFormat.value) {
      return customAssistantPrefix.value
    }
    return selectedFormat.value.assistantPrefix
  },
  set: (value: string) => {
    if (isCustomFormat.value) {
      customAssistantPrefix.value = value
    }
  }
})

const updateModelValue = () => {
  emit('update:modelValue', {
    userPrefix: userPrefix.value,
    assistantPrefix: assistantPrefix.value
  })
}

const updateCustomPrefixes = (userPrefix: string, assistantPrefix: string) => {
  customUserPrefix.value = userPrefix
  customAssistantPrefix.value = assistantPrefix
}

// Watch for format changes
watch(selectedFormatId, (newFormatId) => {
  const format = chatFormats.value.find(f => f.id === newFormatId)
  if (format && format.id !== 'custom') {
    updateCustomPrefixes(format.userPrefix, format.assistantPrefix)
  }
  updateModelValue()
})

// Initialize with current model value
watch(() => props.modelValue, (newValue) => {
  // Find if current values match any predefined format
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

// Watch for locale changes to update format display
watch(locale, () => {
  // Force recomputation of chat formats when language changes
  // The computed property will automatically update the display
  updateModelValue()
})

// New watcher for custom prefixes
watch([customUserPrefix, customAssistantPrefix], () => {
  if (isCustomFormat.value) {
    updateModelValue()
  }
})
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
