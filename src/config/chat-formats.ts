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
    id: 'chatgpt-new',
    nameKey: 'app.formats.chatgptNew.name',
    userPrefixKey: 'app.formats.chatgptNew.userPrefix',
    assistantPrefixKey: 'app.formats.chatgptNew.assistantPrefix',
    descriptionKey: 'app.formats.chatgptNew.description'
  },
  {
    id: 'claude',
    nameKey: 'app.formats.claude.name',
    userPrefixKey: 'app.formats.claude.userPrefix',
    assistantPrefixKey: 'app.formats.claude.assistantPrefix',
    descriptionKey: 'app.formats.claude.description'
  },
  {
    id: 'bard',
    nameKey: 'app.formats.bard.name',
    userPrefixKey: 'app.formats.bard.userPrefix',
    assistantPrefixKey: 'app.formats.bard.assistantPrefix',
    descriptionKey: 'app.formats.bard.description'
  },
  {
    id: 'custom',
    nameKey: 'app.formats.custom.name',
    userPrefixKey: 'app.formats.custom.userPrefix',
    assistantPrefixKey: 'app.formats.custom.assistantPrefix',
    descriptionKey: 'app.formats.custom.description'
  }
]
