<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import ChatFormatSelector from './ChatFormatSelector.vue'
import LanguageSelector from './LanguageSelector.vue'
import FileUpload from './FileUpload.vue'
import MessageVisibilityToggles from './MessageVisibilityToggles.vue'

interface Props {
  isOpen: boolean
  fileName: string
  formatConfig: {
    userPrefix: string
    assistantPrefix: string
  }
  showAssistantMessages: boolean
  showUserMessages: boolean
  showResourceHint: boolean
}

interface Emits {
  (e: 'update:isOpen', value: boolean): void
  (e: 'update:formatConfig', value: { userPrefix: string; assistantPrefix: string }): void
  (e: 'update:showAssistantMessages', value: boolean): void
  (e: 'update:showUserMessages', value: boolean): void
  (e: 'update:showResourceHint', value: boolean): void
  (e: 'fileUpload', file: File | null): void
  (e: 'clearFile'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const { t } = useI18n()

const closeTray = () => {
  emit('update:isOpen', false)
}
</script>

<template>
  <div class="config-tray" :class="{ 'open': isOpen }">
    <div class="config-content">
      <div class="config-header">
        <h3>{{ t('app.config.title') }}</h3>
        <button class="close-config" @click="closeTray">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <FileUpload :file-name="fileName" @file-selected="emit('fileUpload', $event)" @clear-file="emit('clearFile')" />

      <LanguageSelector />
      <ChatFormatSelector :model-value="formatConfig" @update:model-value="emit('update:formatConfig', $event)" />

      <MessageVisibilityToggles :show-assistant-messages="showAssistantMessages" :show-user-messages="showUserMessages"
        :show-resource-hint="showResourceHint"
        @update:show-assistant-messages="emit('update:showAssistantMessages', $event)"
        @update:show-user-messages="emit('update:showUserMessages', $event)"
        @update:show-resource-hint="emit('update:showResourceHint', $event)" />
    </div>
  </div>
</template>

<style scoped>
/* Configuration Tray */
.config-tray {
  position: fixed;
  left: -350px;
  top: 0;
  width: 350px;
  height: 100vh;
  background: white;
  box-shadow: 4px 0 12px rgba(0, 0, 0, 0.15);
  z-index: 999;
  transition: left 0.3s ease;
  overflow-y: auto;
}

.config-tray.open {
  left: 0;
}

.config-content {
  padding: 2rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.config-header {
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.config-header h3 {
  margin: 0;
  color: #1f2937;
  font-size: 1.25rem;
}

.close-config {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  color: #6b7280;
  transition: color 0.2s ease;
}

.close-config:hover {
  color: #374151;
  background: #f3f4f6;
}

.close-config svg {
  width: 20px;
  height: 20px;
}
</style>
