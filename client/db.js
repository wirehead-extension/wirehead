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

function makeNotification() {
  chrome.notifications.create('dashboard.html#about', {
    type: 'basic',
    title: 'Thanks for downloading Wirehead!',
    iconUrl: 'gray.png',
    message: 'Learn more about our app!',
    requireInteraction: true
  })

  chrome.notifications.onClicked.addListener(function handleClick(
    notificationId
  ) {
    chrome.tabs.create({url: notificationId})
    chrome.notifications.onButtonClicked.removeListener(handleClick)
  })
}
function initNotification() {
  //If there's an active page, get the page title and init a notification
  chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    if (tabs[0]) {
      makeNotification(tabs[0].title)
    }
  })
}

db.bayesModel.get(100000, m => {
  if (!m) {
    initNotification()
  }
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
