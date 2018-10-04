import Dexie from 'dexie'

const db = new Dexie('wirehead')
db.version(5).stores({
  history: '++id, url, origin, start, end, timeTotal, title',
  summaryHistory: 'url'
})
export default db
