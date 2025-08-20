<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import ChatFormatSelector from './components/ChatFormatSelector.vue'
import LanguageSelector from './components/LanguageSelector.vue'

// Configuration tray state
const isConfigOpen = ref(true) // Open by default

// Message visibility toggles
const showAssistantMessages = ref(true)
const showUserMessages = ref(true)

interface ChatMessage {
  role: 'user' | 'service'
  content: string
  timestamp: string
}

const { t } = useI18n()

const fileContent = ref<string>('')
const fileName = ref<string>('')
const isDragOver = ref(false)
const formatConfig = ref({
  userPrefix: 'User:',
  assistantPrefix: 'Assistant:'
})

const chatMessages = computed(() => {
  if (!fileContent.value) return []

  const messages: ChatMessage[] = []
  const lines = fileContent.value.split('\n')
  let currentRole: 'user' | 'service' | null = null
  let currentContent: string[] = []

  for (const line of lines) {
    const trimmedLine = line.trim()

    if (trimmedLine.startsWith(formatConfig.value.userPrefix)) {
      // Save previous message if exists
      if (currentRole && currentContent.length > 0) {
        messages.push({
          role: currentRole,
          content: currentContent.join('\n').trim(),
          timestamp: new Date().toLocaleString()
        })
      }

      // Start new user message
      currentRole = 'user'
      currentContent = [trimmedLine.substring(formatConfig.value.userPrefix.length).trim()]
    } else if (trimmedLine.startsWith(formatConfig.value.assistantPrefix)) {
      // Save previous message if exists
      if (currentRole && currentContent.length > 0) {
        messages.push({
          role: currentRole,
          content: currentContent.join('\n').trim(),
          timestamp: new Date().toLocaleString()
        })
      }

      // Start new service message
      currentRole = 'service'
      currentContent = [trimmedLine.substring(formatConfig.value.assistantPrefix.length).trim()]
    } else if (currentRole && trimmedLine) {
      // Continue current message
      currentContent.push(trimmedLine)
    }
  }

  // Add the last message
  if (currentRole && currentContent.length > 0) {
    messages.push({
      role: currentRole,
      content: currentContent.join('\n').trim(),
      timestamp: new Date().toLocaleString()
    })
  }

  return messages
})

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file) {
    processFile(file)
  }
}

const processFile = (file: File) => {
  if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.text')) {
    fileName.value = file.name
    const reader = new FileReader()
    reader.onload = (e) => {
      fileContent.value = e.target?.result as string
    }
    reader.readAsText(file)
  } else {
    alert(t('app.upload.invalidFile'))
  }
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  event.stopPropagation()
  isDragOver.value = true
}

const handleDragEnter = (event: DragEvent) => {
  event.preventDefault()
  event.stopPropagation()
  isDragOver.value = true
}

const handleDragLeave = (event: DragEvent) => {
  event.preventDefault()
  event.stopPropagation()
  isDragOver.value = false
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  event.stopPropagation()

  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    const file = files[0]
    processFile(file)
  }
}

const clearFile = () => {
  fileContent.value = ''
  fileName.value = ''
  const fileInput = document.getElementById('fileInput') as HTMLInputElement
  if (fileInput) fileInput.value = ''
}

const toggleConfig = () => {
  isConfigOpen.value = !isConfigOpen.value
}

const printChat = () => {
  if (chatMessages.value.length === 0) {
    alert(t('app.print.noMessages'))
    return
  }

  // Create a print-friendly version of the chat
  const printWindow = window.open('', '_blank')
  if (!printWindow) {
    alert(t('app.print.popupBlocked'))
    return
  }

  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${t('app.print.title')}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          background: white;
          color: #333;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 15px;
        }
        .title {
          font-size: 24px;
          font-weight: bold;
          color: #1f2937;
          margin: 0 0 10px 0;
        }
        .file-info {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
        }
        .message {
          margin-bottom: 20px;
          padding: 15px;
          border-radius: 8px;
          max-width: 100%;
          word-wrap: break-word;
          page-break-inside: avoid;
        }
        .message-user {
          background: #3b82f6;
          color: white;
          margin-left: 50px;
          border-radius: 18px 18px 4px 18px;
        }
        .message-service {
          background: #f3f4f6;
          color: #374151;
          margin-right: 50px;
          border-radius: 18px 18px 18px 4px;
        }
        .message-header {
          margin-bottom: 8px;
        }
        .message-role {
          font-weight: bold;
          font-size: 12px;
          opacity: 0.8;
        }
        .message-time {
          font-size: 10px;
          opacity: 0.7;
          margin-left: 10px;
        }
        .message-content {
          line-height: 1.5;
          white-space: pre-wrap;
        }
        @media print {
          body { margin: 0; }
          .message { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1 class="title">${t('app.print.title')}</h1>
        ${fileName.value ? `<p class="file-info">${t('app.print.sourceFile')}: ${fileName.value}</p>` : ''}
      </div>
      <div class="messages">
        ${chatMessages.value
      .filter(message =>
        (message.role === 'user' && showUserMessages.value) ||
        (message.role === 'service' && showAssistantMessages.value)
      )
      .map(message => `
            <div class="message message-${message.role}">
              ${showUserMessages.value && showAssistantMessages.value ? `
                <div class="message-header">
                  <span class="message-role">${message.role === 'user' ? t('app.chat.user') : t('app.chat.assistant')}</span>
                  <span class="message-time">${message.timestamp}</span>
                </div>
              ` : ''}
              <div class="message-content">${message.content}</div>
            </div>
          `).join('')}
      </div>
    </body>
    </html>
  `

  printWindow.document.write(printContent)
  printWindow.document.close()

  // Wait for content to load, then print
  printWindow.onload = () => {
    printWindow.print()
    printWindow.close()
  }
}
</script>

<template>
  <div class="chat-reader">
    <!-- Configuration Toggle Button -->
    <button class="config-toggle" @click="toggleConfig" :class="{ 'active': isConfigOpen }">
      <svg class="config-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="3"></circle>
        <path
          d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z">
        </path>
      </svg>
    </button>

    <!-- Configuration Tray -->
    <div class="config-tray" :class="{ 'open': isConfigOpen }">
      <div class="config-content">
        <div class="config-header">
          <h3>{{ t('app.config.title') }}</h3>
          <button class="close-config" @click="toggleConfig">
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
            <input id="fileInput" type="file" accept=".txt,.text" @change="handleFileUpload" class="file-input" />
            <button v-if="fileName" @click="clearFile" class="clear-btn">
              {{ t('app.upload.clearFile') }}
            </button>
          </div>
        </div>

        <LanguageSelector />
        <ChatFormatSelector v-model="formatConfig" />

        <!-- Message Visibility Toggles -->
        <div class="visibility-toggles">
          <h4>{{ t('app.config.messageVisibility') }}</h4>
          <div class="toggle-group">
            <div class="toggle-item">
              <label class="toggle-label">
                <input type="checkbox" v-model="showAssistantMessages" class="toggle-input" />
                <span class="toggle-slider"></span>
                <span class="toggle-text">{{ t('app.config.showAssistant') }}</span>
              </label>
            </div>
            <div class="toggle-item">
              <label class="toggle-label">
                <input type="checkbox" v-model="showUserMessages" class="toggle-input" />
                <span class="toggle-slider"></span>
                <span class="toggle-text">{{ t('app.config.showUser') }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <header class="header">
      <h1>{{ t('app.title') }}</h1>
      <p>{{ t('app.subtitle') }}</p>
    </header>

    <main class="main">
      <!-- Chat Display -->
      <section v-if="chatMessages.length > 0" class="chat-section">
        <div class="chat-header">
          <h3>{{ t('app.chat.title') }} ({{ chatMessages.length }} {{ t('app.chat.messages') }})</h3>
          <button @click="printChat" class="print-btn" :title="t('app.print.printButton')">
            <svg class="print-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6,9 6,2 18,2 18,9"></polyline>
              <path d="M6,18H4a2,2,0,0,1-2-2V11a2,2,0,0,1,2-2H20a2,2,0,0,1,2,2v5a2,2,0,0,1-2,2H18"></path>
              <polyline points="6,14 6,18 18,18 18,14"></polyline>
            </svg>
            {{ t('app.print.printButton') }}
          </button>
        </div>
        <div class="chat-container" :class="{ 'single-side': !showUserMessages || !showAssistantMessages }">
          <div v-for="(message, index) in chatMessages" :key="index"
            v-show="(message.role === 'user' && showUserMessages) || (message.role === 'service' && showAssistantMessages)"
            :class="['message', `message-${message.role}`]">
            <div class="message-header" v-show="showUserMessages && showAssistantMessages">
              <span class="message-role">
                {{ message.role === 'user' ? t('app.chat.user') : t('app.chat.assistant') }}
              </span>
              <span class="message-time">{{ message.timestamp }}</span>
            </div>
            <div class="message-content">
              {{ message.content }}
            </div>
          </div>
        </div>
      </section>

      <!-- Empty State -->
      <section v-else-if="!fileContent" class="empty-state">
        <div class="empty-content">
          <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <h3>{{ t('app.chat.noFile') }}</h3>
          <p>{{ t('app.chat.noFileDesc') }}</p>
        </div>
      </section>

      <!-- No Messages Found -->
      <section v-else-if="fileContent && chatMessages.length === 0" class="no-messages">
        <div class="no-messages-content">
          <svg class="no-messages-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
          <h3>{{ t('app.chat.noMessages') }}</h3>
          <p>{{ t('app.chat.noMessagesDesc') }}</p>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.chat-reader {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  position: relative;
}

/* Configuration Toggle Button */
.config-toggle {
  position: fixed;
  left: -25px;
  top: 30px;
  transform: translateY(-50%);
  z-index: 1000;
  background: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.config-toggle:hover {
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.config-toggle.active {
  background: #3b82f6;
  color: white;
  left: -60px;
}

.config-icon {
  width: 24px;
  height: 24px;
}

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

.header {
  text-align: center;
  padding: 2rem 1rem;
  color: white;
}

.header h1 {
  margin: 0 0 0.5rem 0;
  font-size: 2.5rem;
  font-weight: 700;
}

.header p {
  margin: 0;
  font-size: 1.1rem;
  opacity: 0.9;
}

.main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem 2rem;
}

.upload-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.file-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.file-label {
  cursor: pointer;
  width: 100%;
}

.upload-area {
  border: 2px dashed #667eea;
  border-radius: 8px;
  padding: 3rem 2rem;
  text-align: center;
  transition: all 0.3s ease;
  background: #f8fafc;
}

.upload-area:hover {
  border-color: #764ba2;
  background: #f1f5f9;
}

.upload-area.drag-over {
  border-color: #22c55e;
  background: #f0fdf4;
  transform: scale(1.02);
  box-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
}

.upload-area span {
  color: #374151;
}

.upload-icon {
  width: 48px;
  height: 48px;
  color: #667eea;
  margin-bottom: 1rem;
}

.file-name {
  font-weight: 600;
  color: #667eea;
}

.drag-over-text {
  font-weight: 600;
  color: #22c55e;
  font-size: 1.1rem;
}

.file-input {
  display: none;
}

.clear-btn {
  background: #ef4444;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

.clear-btn:hover {
  background: #dc2626;
}



.chat-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.chat-header h3 {
  margin: 0;
  color: #1f2937;
  font-size: 1.25rem;
}

.print-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.print-btn:hover {
  background: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.print-btn:active {
  transform: translateY(0);
}

.print-icon {
  width: 18px;
  height: 18px;
}

.chat-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.message {
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 70%;
  word-wrap: break-word;
}

.chat-container.single-side .message {
  max-width: 100%;
}

.message-user {
  background: #3b82f6;
  color: white;
  border-radius: 18px 18px 4px 18px;
  margin-left: auto;
  margin-right: 0;
}

.message-service {
  background: #f3f4f6;
  color: #374151;
  border-radius: 18px 18px 18px 4px;
  margin-right: auto;
  margin-left: 0;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.message-role {
  font-weight: 600;
  font-size: 0.875rem;
}

.message-user .message-role {
  color: rgba(255, 255, 255, 0.9);
}

.message-service .message-role {
  color: #6b7280;
}

.message-time {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
}

.message-service .message-time {
  color: #9ca3af;
}

.message-content {
  line-height: 1.6;
  white-space: pre-wrap;
}

.message-user .message-content {
  color: white;
}

.message-service .message-content {
  color: #374151;
}

.empty-state,
.no-messages {
  background: white;
  border-radius: 12px;
  padding: 4rem 2rem;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.empty-content,
.no-messages-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.empty-icon,
.no-messages-icon {
  width: 64px;
  height: 64px;
  color: #9ca3af;
}

.empty-state h3,
.no-messages h3 {
  margin: 0;
  color: #374151;
  font-size: 1.25rem;
}

.empty-state p,
.no-messages p {
  margin: 0;
  color: #6b7280;
}

@media (max-width: 768px) {
  .header h1 {
    font-size: 2rem;
  }

  .message-user,
  .message-service {
    margin-left: 0;
    margin-right: 0;
  }

  .main {
    padding: 0 0.5rem 1rem;
  }

  .upload-section,
  .config-section,
  .chat-section {
    padding: 1.5rem;
  }
}
</style>
