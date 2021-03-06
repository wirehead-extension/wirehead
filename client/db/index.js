import Dexie from 'dexie'
//import history from '../../script/seed'
//import trainingData from '../../script/bayesClassifierTraining'
import {getHistoryRange, splitByPeriod, sumBySite, topFive} from './dbUtils'

const db = new Dexie('wirehead')
db.version(5).stores({
  history: '++id, url, timeStart, timeEnd, timeTotal, label',
  trainingData: '++id, document, label',
  bayesModel: '++id, model',
  options: ', allowTrainingPopups, allowShaming'
})

/* db.history.count().then(s=>{
  if (s < 1) {
    db.history.bulkAdd(history)
    //db.trainingData.bulkAdd(trainingData)
  }
}) */

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

Dexie.prototype.todayTopFive = function() {
  return topFive(this, new Date().setHours(0, 0, 0, 0), 1)
}

export default db
