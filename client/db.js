//uncomment the commented below to seed the db!
//make sure to re-comment, re-build, and reload into Chrome after you seed!
import Dexie from 'dexie'
//import history from '../script/seed'

const db = new Dexie('wirehead')
db.version(5).stores({
  history: '++id, url, timeStart, timeEnd, timeTotal, label',
  summaryHistory: 'url'
})

//  .then(db.history.bulkAdd(history))

export default db
