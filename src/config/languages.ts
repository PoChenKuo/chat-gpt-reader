export interface Language {
  code: string
  name: string
  flag: string
}

export const LANGUAGES: Language[] = [
  { code: 'zh-tw', name: '繁體中文', flag: '🇹🇼' },
  { code: 'en', name: 'English', flag: '🇺🇸' }
]
