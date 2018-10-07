import db from '../db'

//There will only ever be one options object :)

const defaultOptions = {
  allowTrainingPopups: true,
  allowShaming: true
}
//takes an options object
export async function updateOptions(newOptions) {
  console.log('update options is being called')
  let result
  console.log('newOptions', newOptions)
  await db.transaction('rw', db.options, function*() {
    result = yield db.options.put(newOptions, 0)
  })
  console.log(result, 'result')
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
