import Dexie from 'dexie'
import history from '../script/seed'
import trainingData from '../script/bayesClassifierTraining'

const db = new Dexie('wirehead')
db.version(5).stores({
  history: '++id, url, timeStart, timeEnd, timeTotal, label',
  summaryHistory: 'url',
  trainingData: '++id, document, label',
  bayesModel: '++id, model'
})

db.history.get(1, s => {
  if (!s) {
    db.history.bulkAdd(history)
    db.trainingData.bulkAdd(trainingData)
  }
})

Dexie.prototype.bla = () => 'aaaaaaaaaaaaaaaaaaaa'

console.log(db.bla())

export default db
