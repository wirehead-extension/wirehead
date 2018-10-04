import trainingData from './training-data'

const data = trainingData.map(site => ({
  document: `${site.input.urlTokens
    .replace(/[.,|\/#!$%\^&\*;:{}=\-_`~()]/g, ' ')
    .replace(/\s\s+/g, ' ')} ${site.input.title
    .replace(/[.,|\/#!$%\^&\*;:{}=\-_`~()]/g, ' ')
    .replace(/\s\s+/g, ' ')}`,
  label: site.output
}))

export default data
