<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import ConfigToggle from './components/ConfigToggle.vue'
import ConfigurationTray from './components/ConfigurationTray.vue'
import ChatDisplay from './components/ChatDisplay.vue'

// Configuration tray state
const isConfigOpen = ref(true) // Open by default

// Message visibility toggles
const showAssistantMessages = ref(true)
const showUserMessages = ref(true)
const showResourceHint = ref(true)

interface ChatMessage {
  role: 'user' | 'service'
  content: string
  timestamp: string | null
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
          timestamp: null
          // timestamp:  //new Date().toLocaleString()
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
          timestamp: null
          // new Date().toLocaleString()
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


</script>

<template>
  <div class="chat-reader">
    <!-- Configuration Toggle Button -->
    <ConfigToggle :is-open="isConfigOpen" @toggle="toggleConfig" />

    <!-- Configuration Tray -->
    <ConfigurationTray :is-open="isConfigOpen" :file-name="fileName" :is-drag-over="isDragOver"
      :format-config="formatConfig" :show-assistant-messages="showAssistantMessages"
      :show-resource-hint="showResourceHint" :show-user-messages="showUserMessages"
      @update:is-open="isConfigOpen = $event" @update:format-config="formatConfig = $event"
      @update:show-assistant-messages="showAssistantMessages = $event"
      @update:show-user-messages="showUserMessages = $event" @update:show-resource-hint="showResourceHint = $event"
      @file-upload="handleFileUpload" @file-drop="handleDrop" @drag-over="handleDragOver" @drag-enter="handleDragEnter"
      @drag-leave="handleDragLeave" @clear-file="clearFile" />

    <header class="header">
      <h1>{{ t('app.title') }}</h1>
      <p>{{ t('app.subtitle') }}</p>
    </header>

    <main class="main">
      <ChatDisplay :chat-messages="chatMessages" :show-user-messages="showUserMessages"
        :show-assistant-messages="showAssistantMessages" :show-resource-hint="showResourceHint" :file-name="fileName" />
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



@media (max-width: 768px) {
  .header h1 {
    font-size: 2rem;
  }

  .main {
    padding: 0 0.5rem 1rem;
  }
}
</style>
