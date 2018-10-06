import trainingData from './training-data'

let data = trainingData.map(site => ({
  document: `${site.input.urlTokens
    .replace(/[.,|\/#!$%\^&\*;:{}=\-_`~()]/g, ' ')
    .replace(/\s\s+/g, ' ')} ${site.input.title
    .replace(/[.,|\/#!$%\^&\*;:{}=\-_`~()]/g, ' ')
    .replace(/\s\s+/g, ' ')}`,
  label: site.output,
  time: new Date().getTime()
}))

export default data
