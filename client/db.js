import Dexie from 'dexie'

const db = new Dexie('wirehead')
db.version(5).stores({
  history: '++id, url, timeStart, timeEnd, timeTotal, label',
  summaryHistory: 'url'
})
export default db
