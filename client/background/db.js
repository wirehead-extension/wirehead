import Dexie from 'dexie'

const db = new Dexie('wirehead')
db.version(5).stores({
  history: 'url, origin,start',
  summaryHistory: 'url'
})
export default db
//to update the db schema, increment the second argument of
//the second argument of the below by 1
/*   var request = window.indexedDB.open('wirehead', 4)

  request.onerror = function(err) {
    console.error(err)
  }
  request.onsuccess = function(event) {
    db = event.target.result
    console.log('db created')
  } */
/* 
  //The below initializes our database with *only* history
  //To initialize with more data stores, edit the below &&
  //change the second argument to the window.indexedDB.open()
  //function above
  request.onupgradeneeded = function(event) {
    db = event.target.result
    const historyStore = db.createObjectStore('history', {autoIncrement: true})
    historyStore.createIndex('url', 'url', {unique: false})
    historyStore.createIndex('origin', 'origin', {unique: false})
    historyStore.createIndex('start', 'start', {unique: false})
    const summaryHistoryStore = db.createObjectStore('summaryHistory', {
      keyPath: 'url'
    })
    summaryHistoryStore.createIndex('url', 'url', {unique: true})
  } */
