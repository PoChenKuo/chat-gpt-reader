<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  fileName: string
}

interface Emits {
  (e: 'fileSelected', file: File | null): void
  (e: 'clearFile'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const { t } = useI18n()

const isDragOver = ref(false)

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = true
}

const handleDragEnter = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = true
}

const handleDragLeave = () => {
  isDragOver.value = false
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = false
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    emit('fileSelected', files[0])
  }
}

const handleFileInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (files && files.length > 0) {
    emit('fileSelected', files[0])
  }
}

const clearFile = () => {
  emit('clearFile')
}

// Reset drag over state if fileName changes (e.g., file cleared by parent)
watch(() => props.fileName, () => {
  isDragOver.value = false
})
</script>

<template>
  <div class="file-upload-section">
    <h4>{{ t('app.upload.title') }}</h4>
    <div class="file-upload">
      <label for="fileInput" class="file-label">
        <div class="upload-area" :class="{ 'drag-over': isDragOver }" @dragover="handleDragOver"
          @dragenter="handleDragEnter" @dragleave="handleDragLeave" @drop="handleDrop">
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
      <input id="fileInput" type="file" accept=".txt,.text" @change="handleFileInput" class="file-input" />
      <button v-if="fileName" @click="clearFile" class="clear-btn">
        {{ t('app.upload.clearFile') }}
      </button>
    </div>
  </div>
</template>

<style scoped>
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
</style>
