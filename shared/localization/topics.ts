import {
  addStringBeforeKeys,
  LocalizedJsonTable,
  localizedJsonTableToObjects,
} from './helpers'
import { locales } from './locales'
import topicsJson from './topics.json'

const { en: enTopics, ru: ruTopics } = localizedJsonTableToObjects(
  topicsJson as LocalizedJsonTable,
)

export const topics = {
  [locales.EN]: enTopics,
  [locales.RU]: ruTopics,
}

export const enTopicsMessages = addStringBeforeKeys(enTopics, 'topic.')
export const ruTopicsMessages = addStringBeforeKeys(ruTopics, 'topic.')
