/*global chrome*/
import BayesClassifier from 'bayes-classifier'
var db
var wireheadHistory
var wireheadModel

console.log(new BayesClassifier())

//to update the db schema, increment the second argument of
//the second argument of the below by 1
var request = window.indexedDB.open('wirehead', 5)

request.onerror = function(err) {
  console.error(err)
}
request.onsuccess = function(event) {
  db = event.target.result
  if (db.objectStoreNames.history) {
    wireheadHistory = db.objectStoreNames.history
    //request.onupgradeneeded(event);
  }
  if (db.objectStoreNames.model) {
    wireheadModel = db.objectStoreNames.model
    //request.onupgradeneeded(event);
  }
  console.log('db created')
}

//The below initializes our database with *only* history
//To initialize with more data stores, edit the below &&
//change the second argument to the window.indexedDB.open()
//function above
request.onupgradeneeded = function(event) {
  db = event.target.result

  const modelStore = db.createObjectStore('model', {autoIncrement: true})
  modelStore.createIndex('model', 'model', {unique: false})

  const historyStore = db.createObjectStore('history', {autoIncrement: true})
  historyStore.createIndex('url', 'url', {unique: false})
  historyStore.createIndex('origin', 'origin', {unique: false})
  historyStore.createIndex('start', 'start', {unique: false})
  const summaryHistoryStore = db.createObjectStore('summaryHistory', {
    keyPath: 'url'
  })
  summaryHistoryStore.createIndex('url', 'url', {unique: true})
}

console.log('db is...', db)
///////<<<JUST GOING TO COPY THIS MORE OR LESS>>>
var modelWriteTransaction = db.transaction('model', 'readwrite')
modelWriteTransaction.oncomplete = function(event) {
  console.log('woohoo', event)
}
modelWriteTransaction.onerror = function(event) {
  console.error(event)
}
var modelStore = modelWriteTransaction.objectStore('model')
var addRequestModel = modelStore.add({model: 'hello worold!'})
addRequestModel.onsuccess = function(event) {
  console.log('success')
}

//The meat of the logic
chrome.storage.sync.set({
  timeHistory: [],
  timeEnded: [],
  totalTime: []
})

chrome.windows.onFocusChanged.addListener(function(windowInfo) {
  // if(windowInfo < 0) {
  //   break
  // }

  chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    currentTabRecoder(tabs)
  })
})

chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
  currentTabRecoder(tabs)
})

chrome.tabs.onActivated.addListener(function(activeInfo) {
  var newDate = new Date()

  var dateString = dateConverter(newDate)

  var current = timeInSecond(newDate)
  chrome.tabs.get(activeInfo.tabId, function(tab) {
    //this code creates a transaction and uses it to write to the db
    var historyWriteTransaction = db.transaction(['history'], 'readwrite')
    historyWriteTransaction.oncomplete = function(event) {
      console.log('woohoo')
    }
    historyWriteTransaction.onerror = function(event) {
      console.error(event)
    }
    var historyStore = historyWriteTransaction.objectStore('history')
    var addRequest = historyStore.add({url: tab.url, start: new Date()})
    addRequest.onsuccess = function(event) {
      //console.log(event)
      console.log(event.target)
      //console.log(event.target.result)
    }

    var mainUrl = urlCutter(tab.url)

    chrome.storage.sync.get(datas => {
      chrome.storage.sync.set({
        currentTabId: activeInfo.tabId,
        currentTabTime: current,
        currentTabOpen: dateString,
        currentTabUrl: mainUrl,
        currentTabTitle: tab.title,
        timeHistory: [
          ...datas.timeHistory,
          {
            tabId: activeInfo.tabId,
            title: tab.title,
            url: mainUrl,
            time: dateString,
            timeCal: current
          }
        ],
        // .sort((a,b) => {
        //   return a.timeCal < b.timeCal
        // }),
        timeEnded: [...datas.timeEnded],
        totalTime: [...datas.totalTime]
      })
    })
  })
  timerEnding(current)
})

function timerEnding(initialTab) {
  var newDate = new Date()
  var current = timeInSecond(newDate)

  var dateString = dateConverter(newDate)

  chrome.storage.sync.get(datas => {
    // chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    //   // alert(tabs[0].id)
    //   alert(current)
    //   var mainUrl = urlCutter(tabs[0].url)
    //   var newValue = {
    //     id: tabs[0].id,
    //     title: tabs[0].title,
    //     url: mainUrl,
    //     time: dateString,
    //     timeCal: current
    //   }
    //   chrome.storage.sync.set({
    //     ...datas,
    //     timeEnded: [...datas.timeEnded, newValue],
    //     totalTime: [...datas.totalTime]
    //   })
    //   timeAddUp(newValue)
    // })

    chrome.tabs.query({active: false}, tabs => {
      tabs.forEach(tab => {
        if (tab.id === datas.currentTabId) {
          var timeInfo
          datas.timeHistory.forEach(data => {
            if (data.tabId === tab.id) {
              timeInfo = data.timeCal
            }
          })

          var mainUrl = urlCutter(tab.url)

          var newValue = {
            id: tab.id,
            title: tab.title,
            url: mainUrl,
            time: dateString,
            timeCal: current - (timeInfo || initialTab)
          }
          chrome.storage.sync.set({
            ...datas,
            timeEnded: [...datas.timeEnded, newValue],
            totalTime: [...datas.totalTime]
          })
          timeAddUp(newValue)
        }
      })
    })
  })
}

function timeAddUp(addTime) {
  chrome.storage.sync.get(datas => {
    var calculatedTime = {
      url: addTime.url,
      totalTimeConsume: addTime.timeCal
    }
    datas.totalTime.forEach(data => {
      if (data.url === addTime.url) {
        calculatedTime = {
          url: addTime.url,
          totalTimeConsume: data.totalTimeConsume + addTime.timeCal
        }
      }
    })
    var addedTime = datas.totalTime.filter(data => {
      return data.url !== addTime.url && data.url
    })
    chrome.storage.sync.set({
      timeEnded: [...datas.timeEnded],
      totalTime: [...addedTime, calculatedTime].sort((a, b) => {
        return a.totalTimeConsume > b.totalTimeConsume
      })
    })
  })
}

function urlCutter(url) {
  var mainUrl = ''
  if (url.indexOf('.com') > -1) {
    mainUrl = url.slice(0, url.indexOf('.com') + 4)
  } else if (url.indexOf('.org') > -1) {
    mainUrl = url.slice(0, url.indexOf('.org') + 4)
  } else if (url.indexOf('.io') > -1) {
    mainUrl = url.slice(0, url.indexOf('.io') + 3)
  } else if (url.indexOf('.net') > -1) {
    mainUrl = url.slice(0, url.indexOf('.net') + 4)
  } else {
    mainUrl = url
  }
  return mainUrl
}

function dateConverter(newDate) {
  var dateString = "Today's date is: "

  dateString += newDate.getMonth() + 1 + '/'
  dateString += newDate.getDate() + '/'
  dateString += newDate.getFullYear() + ' '
  dateString += newDate.getHours() + ':'
  dateString += newDate.getMinutes() + ':'
  dateString += newDate.getSeconds()

  return dateString
}

function timeInSecond(newDate) {
  return (
    newDate.getSeconds() +
    newDate.getMinutes() * 60 +
    newDate.getHours() * 3600 +
    newDate.getDate() * 86400
  )
}

function currentTabRecoder(tabs) {
  var newDate = new Date()
  console.log(tabs[0])
  chrome.storage.sync.get(datas => {
    chrome.storage.sync.set({
      currentTabId: tabs[0].id,
      currentTabTime: timeInSecond(newDate),
      currentTabOpen: dateConverter(newDate),
      currentTabUrl: urlCutter(tabs[0].url),
      currentTabTitle: tabs[0].title,
      timeHistory: [
        ...datas.timeHistory,
        {
          tabId: tabs[0].id,
          title: tabs[0].title,
          url: urlCutter(tabs[0].url),
          time: dateConverter(newDate),
          timeCal: timeInSecond(newDate)
        }
      ],
      // .sort((a,b) => {
      //   return a.timeCal < b.timeCal
      // }),
      timeEnded: [...datas.timeEnded],
      totalTime: [
        ...datas.totalTime,
        {
          url: urlCutter(tabs[0].url),
          totalTimeConsume: 0
        }
      ]
      // totalTime: [...datas.totalTime]
    })
  })
  timerEnding(timeInSecond(newDate))
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
  // alert(urlCutter(changeInfo.url))
  // var mainUrl = ""
  // if(changeInfo.url.indexOf(".com") > -1) {
  //   mainUrl = changeInfo.url.slice(0, changeInfo.url.indexOf(".com") + 4)
  // } else if(changeInfo.url.indexOf(".org") > -1) {
  //   mainUrl = changeInfo.url.slice(0, changeInfo.url.indexOf(".org") + 4)
  // } else if(changeInfo.url.indexOf(".io") > -1) {
  //   mainUrl = changeInfo.url.slice(0, changeInfo.url.indexOf(".io") + 3)
  // } else if(changeInfo.url.indexOf(".net") > -1) {
  //   mainUrl = changeInfo.url.slice(0, changeInfo.url.indexOf(".net") + 4)
  // } else {
  //   mainUrl = changeInfo.url
  // }
  chrome.storage.sync.get(datas => {
    // if(datas.currentTabUrl !== mainUrl) {
    // alert(datas.currentTabUrl)
    // }
  })
})

chrome.tabs.onCreated.addListener(function(tab) {
  var newDate = new Date()
  var current = timeInSecond(newDate)
  var dateString = dateConverter(newDate)
  var mainUrl = urlCutter(tab.url)

  chrome.storage.sync.get(datas => {
    chrome.storage.sync.set({
      currentTabId: tab.id,
      currentTabTime: current,
      currentTabUrl: mainUrl,
      timeHistory: [
        ...datas.timeHistory,
        {
          tabId: tab.id,
          title: tab.title,
          url: mainUrl,
          time: dateString,
          timeCal: current
        }
      ],
      timeEnded: [...datas.timeEnded],
      totalTime: [...datas.totalTime]
    })
  })
})

// chrome.tabs.onRemoved.addListener(
//   function(removeInfo) {
//     alert(removeInfo.tabId)
//     // chrome.tabs.get(removeInfo.tabId, function(tab) {
//     //   chrome.storage.sync.get(datas=>{
//     //     alert(removeInfo.url)
//     //     chrome.storage.sync.set({
//     //       ...datas
//     //     })
//     //   })
//     // })
//   }

//   // function(removeInfo) {
//   //   var endDate = new Date();

//   //   var currentEnd = endDate.getSeconds() + endDate.getMinutes() * 60 + endDate.getHours() * 3600 + endDate.getDate() * 86400

//   //   chrome.storage.sync.get(['timeHistory'],(datas) => {
//   //     chrome.storage.sync.set({
//   //       timeHistory: datas.timeHistory.map(data => {
//   //         if (data.tabId === removeInfo) {
//   //           timeEnd = (currentEnd - data.timeCal)
//   //           return {...data, timeEnd}
//   //         } else {
//   //           return data
//   //         }
//   //       })
//   //     })
//   //   })
//   // }
// )

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action) {
    if (request.action === 'follow-link') {
      sendResponse({dbKey: 1, ultimateOriginKey: 1})
      /* chrome.runtime.sendMessage(sender.id, {
        action: 'sendDbLocation',
        location: request.origin,
        data: {dbKey: 1, ultimateOriginKey: 1}
      }) */
    }
  }

  console.log('req', request, 'sender', sender)
})

//Stuff here is to block websites
// :^)
//Just need to reference the list of sites we're going to block

// chrome.webRequest.onBeforeRequest.addListener(
//   function(details) {
//     return {
//       cancel: blockedSites.some(site => details.url.indexOf(site.name) !== -1)
//     }
//   },
//   {
//     urls: ['<all_urls>']
//   },
//   ['blocking']
// )

//Test of naive bayes
// const BayesClassifier = require('bayes-classifier')
// var classifier = new BayesClassifier()

// const workDocuments = ['work github remote api', 'vr cryptocurrency networking']
// const playDocuments = [
//   'video games fortnite Youtube meme',
//   'facebook minecraft compilation'
// ]
// classifier.addDocuments(workDocuments, 'work')
// classifier.addDocuments(playDocuments, 'play')
// classifier.train()

// console.log(classifier.classify('vr blockchain cryptocurrency github'))
// console.log(classifier.getClassifications('facebook meme page'))
//listens for all events emitted by page content scripts
