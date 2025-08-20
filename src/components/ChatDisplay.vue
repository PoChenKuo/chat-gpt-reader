<script setup lang="ts">
import { useI18n } from 'vue-i18n'

interface ChatMessage {
  role: 'user' | 'service'
  content: string
  timestamp: string
}

interface Props {
  chatMessages: ChatMessage[]
  showUserMessages: boolean
  showAssistantMessages: boolean
  fileName: string
}

const props = defineProps<Props>()
const { t } = useI18n()

const printChat = () => {
  if (props.chatMessages.length === 0) {
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
        ${props.fileName ? `<p class="file-info">${t('app.print.sourceFile')}: ${props.fileName}</p>` : ''}
      </div>
      <div class="messages">
        ${props.chatMessages
      .filter(message =>
        (message.role === 'user' && props.showUserMessages) ||
        (message.role === 'service' && props.showAssistantMessages)
      )
      .map(message => `
            <div class="message message-${message.role}">
              ${props.showUserMessages && props.showAssistantMessages ? `
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
  <section v-else-if="!fileName" class="empty-state">
    <div class="empty-content">
      <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
      <h3>{{ t('app.chat.noFile') }}</h3>
      <p>{{ t('app.chat.noFileDesc') }}</p>
    </div>
  </section>

  <!-- No Messages Found -->
  <section v-else-if="fileName && chatMessages.length === 0" class="no-messages">
    <div class="no-messages-content">
      <svg class="no-messages-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="8" y1="12" x2="16" y2="12"></line>
      </svg>
      <h3>{{ t('app.chat.noMessages') }}</h3>
      <p>{{ t('app.chat.noMessagesDesc') }}</p>
    </div>
  </section>
</template>

<style scoped>
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

.chat-container.single-side .message {
  max-width: 100%;
}

.message {
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 70%;
  word-wrap: break-word;
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
</style>
