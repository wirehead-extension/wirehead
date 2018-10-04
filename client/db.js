//uncomment the commented below to seed the db!
//make sure to re-comment, re-build, and reload into Chrome after you seed!
import Dexie from 'dexie'
import history from '../script/seed'

const db = new Dexie('wirehead')
db.version(5).stores({
  history: '++id, url, timeStart, timeEnd, timeTotal, label',
  summaryHistory: 'url'
})

db.history.get(1, s => {
  if (!s) {
    db.history.bulkAdd(history)
  }
})

db.history
  .where('timeStart')
  .between(1506834231806.7793, 1506844231806.7793)
  .sortBy('url')
  .then(a => console.log(a))

export default db
