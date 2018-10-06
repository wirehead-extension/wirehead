import db from '../db'

//There will only ever be one options object :)

const defaultOptions = {
  trainingPopupFrequency: 0.1,
  allowTrainingPopups: true,
  allowShaming: true,
  id: 0
}
//takes a string and a number/bool
export async function updateOptions(optionToUpdate, newValue) {
  let options = await getOptions()
  options[optionToUpdate] = newValue
  console.log('options after put request', options)
  await db.transaction('rw', db.options, function*() {
    yield db.options.put(options)
  })
}

export async function getOptions() {
  let options
  await db.transaction('rw', db.options, function*() {
    options = yield db.options.get(0)
  })
  console.log('options after db call in get options', options)
  return options ? options : initOptions()
}

export async function initOptions() {
  console.log('init-ing')
  await db.transaction('rw', db.options, function*() {
    yield db.options.add(defaultOptions)
  })
  return defaultOptions
}
