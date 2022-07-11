export type LocalizedJsonTable = {
  Id: number
  EnName: string
  RuName: string
}[]

export const localizedJsonTableToObjects = (json: LocalizedJsonTable) => {
  const result = {
    ['ru']: {} as Record<number, string>,
    ['en']: {} as Record<number, string>,
  } as const
  for (const { Id, EnName, RuName } of json) {
    result.ru[Id] = RuName
    result.en[Id] = EnName
  }
  return result
}

export const addStringBeforeKeys = (
  object: Record<string | number, any>,
  string: string,
) => {
  const newObject = {} as Record<string | number, any>
  for (const [key, value] of Object.entries(object)) {
    newObject[string + key] = value
  }
  return newObject
}
