import db from '../db'

//There will only ever be one options object

const defaultOptions = {
  trainingPopupFrequency: 'normal',
  allowShaming: true
}
//takes an options object
export async function updateOptions(newOptions) {
  let result
  await db.transaction('rw', db.options, function*() {
    result = yield db.options.put(newOptions, 0)
  })
  //Let background know that options have been updated
  chrome.runtime.sendMessage({action: 'options updated'})
}

export async function getOptions() {
  let options
  await db.transaction('rw', db.options, function*() {
    options = yield db.options.get(0)
  })
  return options ? options : initOptions()
}

export async function initOptions() {
  await db.transaction('rw', db.options, function*() {
    yield db.options.add(defaultOptions, 0)
  })
  return defaultOptions
}
