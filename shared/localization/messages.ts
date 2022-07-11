import enMessages from './en.json'
import { locales } from './locales'
import ruMessages from './ru.json'
import { enTopicsMessages, ruTopicsMessages } from './topics'

export const messages = {
  [locales.EN]: { ...enMessages, ...enTopicsMessages },
  [locales.RU]: { ...ruMessages, ...ruTopicsMessages },
}
