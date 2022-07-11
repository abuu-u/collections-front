export const locales = {
  EN: 'en',
  RU: 'ru',
} as const

export type Locales = typeof locales[keyof typeof locales]
