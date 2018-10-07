import Dexie from 'dexie'
import history from '../../script/seed'
import trainingData from '../../script/bayesClassifierTraining'
import {getHistoryRange, splitByPeriod, sumBySite} from './dbUtils'

const db = new Dexie('wirehead')
db.version(5).stores({
  history: '++id, url, timeStart, timeEnd, timeTotal, label',
  summaryHistory: 'url',
  trainingData: '++id, document, label',
  bayesModel: '++id, model',
  options: '++, trainingPopupFrequency, allowTrainingPopups, allowShaming'
})

//TODO: before entering production, remove the seed functionality!
db.history.get(1, s => {
  if (!s) {
    db.history.bulkAdd(history)
    db.trainingData.bulkAdd(trainingData)
  }
})

Dexie.prototype.getFullHistory = function(startDate, endDate) {
  return getHistoryRange(this, startDate, endDate).toArray()
}

Dexie.prototype.getDailySummary = function(startDate, endDate) {
  return splitByPeriod(this, 'day', startDate, endDate)
}

Dexie.prototype.getWeeklySummary = function(startDate, endDate) {
  return splitByPeriod(this, 'week', startDate, endDate)
}

Dexie.prototype.getTotalSummary = function(startDate, endDate) {
  return sumBySite(this, startDate, endDate)
}

export default db
