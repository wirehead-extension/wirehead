import db from '../db'

//There will only ever be one options object :)

const defaultOptions = {
  allowTrainingPopups: true,
  allowShaming: true
}
//takes an options object
export async function updateOptions(newOptions) {
  await db.transaction('rw', db.options, function*() {
    yield db.options.put(newOptions, 1)
  })
}

export async function getOptions() {
  let options
  await db.transaction('rw', db.options, function*() {
    options = yield db.options.get(1)
  })
  return options ? options : initOptions()
}

export async function initOptions() {
  await db.transaction('rw', db.options, function*() {
    yield db.options.add(defaultOptions, 1)
  })
  return defaultOptions
}
