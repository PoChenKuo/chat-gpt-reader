import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    app: {
      title: 'ChatGPT Session Reader',
      subtitle: 'Upload a plain text file to view chat history',
      upload: {
        title: 'Choose a text file or drag it here',
        fileName: 'File uploaded',
        clearFile: 'Clear File',
        dragOver: 'Drop file to upload',
        invalidFile: 'Please select a text file (.txt or .text)',
      },
      config: {
        title: 'Chat Format Configuration',
        selectFormat: 'Select Chat Format',
        customFormat: 'Custom Format',
        userPrefix: 'User Prefix',
        assistantPrefix: 'Assistant Prefix',
        userPrefixPlaceholder: 'e.g., User:',
        assistantPrefixPlaceholder: 'e.g., Assistant:',
        messageVisibility: 'Message Visibility',
        showAssistant: 'Show Assistant Messages',
        showUser: 'Show User Messages',
      },
      chat: {
        title: 'Chat History',
        messages: 'messages',
        user: '👤 User',
        assistant: '🤖 Assistant',
        noFile: 'No chat file uploaded',
        noFileDesc: 'Upload a text file to view the chat history',
        noMessages: 'No messages found',
        noMessagesDesc: 'Try adjusting the chat format to match your file',
      },
      print: {
        title: 'Chat History',
        sourceFile: 'Source File',
        printButton: 'Print',
        noMessages: 'No messages to print',
        popupBlocked: 'Please allow popups to print',
      },
      formats: {
        chatgptDefault: {
          name: 'ChatGPT Default',
          description: 'Standard ChatGPT format',
          userPrefix: 'User:',
          assistantPrefix: 'Assistant:',
        },
        custom: {
          name: 'Custom',
          description: 'Define your own format',
          userPrefix: '',
          assistantPrefix: '',
        },
      },
    },
  },
  'zh-tw': {
    app: {
      title: 'ChatGPT 對話記錄閱讀器',
      subtitle: '上傳純文字檔案以檢視對話記錄',
      upload: {
        title: '選擇文字檔案或拖曳至此處',
        fileName: '檔案已上傳',
        clearFile: '清除檔案',
        dragOver: '放開以上傳檔案',
        invalidFile: '請選擇文字檔案 (.txt 或 .text)',
      },
      config: {
        title: '對話格式設定',
        selectFormat: '選擇對話格式',
        customFormat: '自訂格式',
        userPrefix: '使用者前綴',
        assistantPrefix: '助理前綴',
        userPrefixPlaceholder: '例如：User:',
        assistantPrefixPlaceholder: '例如：Assistant:',
        messageVisibility: '訊息顯示設定',
        showAssistant: '顯示助理訊息',
        showUser: '顯示使用者訊息',
      },
      chat: {
        title: '對話記錄',
        messages: '則訊息',
        user: '👤 使用者',
        // assistant: '🤖 助理',
        assistant: '來自系統：',
        noFile: '尚未上傳對話檔案',
        noFileDesc: '上傳文字檔案以檢視對話記錄',
        noMessages: '找不到訊息',
        noMessagesDesc: '請嘗試調整對話格式以符合您的檔案',
      },
      print: {
        title: '對話記錄',
        sourceFile: '來源檔案',
        printButton: '列印',
        noMessages: '沒有訊息可列印',
        popupBlocked: '請允許彈出視窗以進行列印',
      },
      formats: {
        chatgptDefault: {
          name: 'ChatGPT 預設',
          description: '標準 ChatGPT 格式',
          userPrefix: '你說：',
          assistantPrefix: 'ChatGPT 說：',
        },
        custom: {
          name: '自訂',
          description: '定義您自己的格式',
          userPrefix: '',
          assistantPrefix: '',
        },
      },
    },
  },
}

export const i18n = createI18n({
  legacy: false,
  // locale: 'en',
  // fallbackLocale: 'en',
  locale: 'zh-tw',
  fallbackLocale: 'zh-tw',
  messages,
})

export default i18n
