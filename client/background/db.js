import Dexie from 'dexie'

const db = new Dexie('wirehead')
db.version(5).stores({
  history: '++id, url, origin, start',
  summaryHistory: 'url',
  bayesModel: '++, bayesModel'
})
export default db