import type { TFunction } from 'vue-i18n'

export interface ChatMessage {
  role: 'user' | 'service'
  content: string
  timestamp: string
}

export const printChat = (
  messages: ChatMessage[],
  title: string,
  fileName: string | null,
  t: TFunction,
  showUserMessages: boolean,
  showAssistantMessages: boolean
) => {
  if (messages.length === 0) {
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
      <title>${title}</title>
    </head>
    <body>
      <div class="header">
        <h1 class="title">${title}</h1>
        ${fileName ? `<p class="file-info">${t('app.print.sourceFile')}: ${fileName}</p>` : ''}
      </div>
      <div class="messages">
        ${messages
          .map(
            message => `
            <div class="message message-${message.role}">
              ${
                showUserMessages && showAssistantMessages
                  ? `
                <div class="message-header">
                  <span class="message-role">${
                    message.role === 'user' ? t('app.chat.user') : t('app.chat.assistant')
                  }</span>
                  <span class="message-time">${message.timestamp}</span>
                </div>
              `
                  : ''
              }
              <div class="message-content">${message.content}</div>
            </div>
          `
          )
          .join('')}
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
