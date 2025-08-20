export interface ChatFormat {
  id: string
  nameKey: string
  userPrefixKey: string
  assistantPrefixKey: string
  descriptionKey: string
}

export const CHAT_FORMATS: ChatFormat[] = [
  {
    id: 'chatgpt-default',
    nameKey: 'app.formats.chatgptDefault.name',
    userPrefixKey: 'app.formats.chatgptDefault.userPrefix',
    assistantPrefixKey: 'app.formats.chatgptDefault.assistantPrefix',
    descriptionKey: 'app.formats.chatgptDefault.description'
  },
  {
    id: 'custom',
    nameKey: 'app.formats.custom.name',
    userPrefixKey: 'app.formats.custom.userPrefix',
    assistantPrefixKey: 'app.formats.custom.assistantPrefix',
    descriptionKey: 'app.formats.custom.description'
  }
]
