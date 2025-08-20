<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import ChatFormatSelector from './ChatFormatSelector.vue'
import LanguageSelector from './LanguageSelector.vue'

interface Props {
  isOpen: boolean
  fileName: string
  isDragOver: boolean
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
  (e: 'fileUpload', event: Event): void
  (e: 'fileDrop', event: DragEvent): void
  (e: 'dragOver', event: DragEvent): void
  (e: 'dragEnter', event: DragEvent): void
  (e: 'dragLeave', event: DragEvent): void
  (e: 'clearFile'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const { t } = useI18n()

const closeTray = () => {
  emit('update:isOpen', false)
}

const handleAssistantToggle = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:showAssistantMessages', target.checked)
}

const handleUserToggle = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:showUserMessages', target.checked)
}

const handleHintToggle = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:showResourceHint', target.checked)
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

      <!-- File Upload Section -->
      <div class="file-upload-section">
        <h4>{{ t('app.upload.title') }}</h4>
        <div class="file-upload">
          <label for="fileInput" class="file-label">
            <div class="upload-area" :class="{ 'drag-over': isDragOver }" @dragover="emit('dragOver', $event)"
              @dragenter="emit('dragEnter', $event)" @dragleave="emit('dragLeave', $event)"
              @drop="emit('fileDrop', $event)">
              <svg class="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7,10 12,15 17,10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <span v-if="!fileName && !isDragOver">{{ t('app.upload.title') }}</span>
              <span v-else-if="isDragOver" class="drag-over-text">{{ t('app.upload.dragOver') }}</span>
              <span v-else class="file-name">{{ fileName }}</span>
            </div>
          </label>
          <input id="fileInput" type="file" accept=".txt,.text" @change="emit('fileUpload', $event)"
            class="file-input" />
          <button v-if="fileName" @click="emit('clearFile')" class="clear-btn">
            {{ t('app.upload.clearFile') }}
          </button>
        </div>
      </div>

      <LanguageSelector />
      <ChatFormatSelector :model-value="formatConfig" @update:model-value="emit('update:formatConfig', $event)" />

      <!-- Message Visibility Toggles -->
      <div class="visibility-toggles">
        <h4>{{ t('app.config.messageVisibility') }}</h4>
        <div class="toggle-group">
          <div class="toggle-item">
            <label class="toggle-label">
              <input type="checkbox" :checked="showAssistantMessages" @change="handleAssistantToggle"
                class="toggle-input" />
              <span class="toggle-slider"></span>
              <span class="toggle-text">{{ t('app.config.showAssistant') }}</span>
            </label>
          </div>
          <div class="toggle-item">
            <label class="toggle-label">
              <input type="checkbox" :checked="showUserMessages" @change="handleUserToggle" class="toggle-input" />
              <span class="toggle-slider"></span>
              <span class="toggle-text">{{ t('app.config.showUser') }}</span>
            </label>
          </div>
          <div class="toggle-item">
            <label class="toggle-label">
              <input type="checkbox" :checked="showResourceHint" @change="handleHintToggle" class="toggle-input" />
              <span class="toggle-slider"></span>
              <span class="toggle-text">Show Resource Hint</span>
            </label>
          </div>
          <br />


        </div>
      </div>
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

/* File Upload Section in Config Tray */
.file-upload-section {
  margin-bottom: 1rem;
}

.file-upload-section h4 {
  margin: 0 0 1rem 0;
  color: #1f2937;
  font-size: 1rem;
}

.file-upload {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.file-label {
  cursor: pointer;
  width: 100%;
}

.upload-area {
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
  background: #f9fafb;
  color: #6b7280;
  font-size: 0.875rem;
}

.upload-area:hover {
  border-color: #9ca3af;
  background: #f3f4f6;
}

.upload-area.drag-over {
  border-color: #22c55e;
  background: #f0fdf4;
  color: #22c55e;
}

.upload-icon {
  width: 32px;
  height: 32px;
  margin-bottom: 0.5rem;
  color: currentColor;
}

.drag-over-text {
  font-weight: 600;
  color: #22c55e;
}

.file-name {
  font-weight: 600;
  color: #374151;
}

.file-input {
  display: none;
}

.clear-btn {
  padding: 0.5rem 1rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

.clear-btn:hover {
  background: #dc2626;
}

/* Message Visibility Toggles */
.visibility-toggles {
  margin-top: 1rem;
}

.visibility-toggles h4 {
  margin: 0 0 1rem 0;
  color: #1f2937;
  font-size: 1rem;
}

.toggle-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.toggle-item {
  display: flex;
  align-items: center;
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  user-select: none;
}

.toggle-input {
  display: none;
}

.toggle-slider {
  position: relative;
  width: 44px;
  height: 24px;
  background: #d1d5db;
  border-radius: 12px;
  transition: background 0.3s ease;
}

.toggle-slider::before {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  transition: transform 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.toggle-input:checked+.toggle-slider {
  background: #3b82f6;
}

.toggle-input:checked+.toggle-slider::before {
  transform: translateX(20px);
}

.toggle-text {
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}
</style>
