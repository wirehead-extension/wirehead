/*global chrome*/
/*
The structure of the background scripts is as follows:
*index.js (this file), we have all our event listeners - I think they have to be here
*eventPage.js is utility functions for use by index.js (might be worth renaming)
*db.js builds the db schema
*bayesClassifier.js is for use by Kevin
*don't hesitate to add new files as needed!
*/
import {updateBayesModel, getClassifications} from './bayesClassifier'
import {
  timerEnding,
  urlCutter,
  dateConverter,
  timeInSecond,
  currentTabRecoder,
  activeTabRecoder,
  timeAddUp
} from './utils'
import db from '../db'

chrome.storage.sync.set({
  timeHistory: [],
  timeEnded: [],
  totalTime: []
})

console.log('db', db)

//Store the data when a chrome window switched
chrome.windows.onFocusChanged.addListener(function(windowInfo) {
  //Prevent error when all of the windows are focused out
  //When it focused out, outcome of windowInfo = -1
  if (windowInfo > 0) {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
      currentTabRecoder(tabs)
    })
  }
})

//Initial store the data right after re-load
chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
  currentTabRecoder(tabs)
})

chrome.tabs.onActivated.addListener(function(activeInfo) {
  chrome.browserAction.setIcon(
    Math.random() > 0.5 ? {path: './green.png'} : {path: './red.png'}
  )
  var newDate = new Date()

  var dateString = dateConverter(newDate)

  var current = timeInSecond(newDate)
  //get detail information of activated tab
  chrome.tabs.get(activeInfo.tabId, function(tab) {
    //this code creates a transaction and uses it to write to the db
    db.history
      .put({url: tab.url, start: new Date()})
      .then(i => {
        console.log('wrote ' + i)
      })
      .catch(err => {
        console.error(err)
      })

    var mainUrl = urlCutter(tab.url)
    //call stored data
    chrome.storage.sync.get(datas => {
      //store current tab details
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

//An Event Listener store data when create a new Tab
chrome.tabs.onCreated.addListener(function(tab) {
  var newDate = new Date()
  var current = timeInSecond(newDate)
  var dateString = dateConverter(newDate)
  var mainUrl = urlCutter(tab.url)

  chrome.storage.sync.get(datas => {
    var newValue = {
      id: tab.id,
      title: tab.title,
      url: mainUrl,
      time: dateString,
      timeCal: current
    }

    chrome.storage.sync.set({
      currentTabId: tab.id,
      currentTabTime: current,
      currentTabUrl: mainUrl,
      currentTabOpen: dateString,
      currentTabTitle: tab.title,
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
    // timeAddUp(newValue)
  })
})

//An Event Listener to store data when URL has been changed
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
  if (changeInfo.url || changeInfo.title) {
    var newDate = new Date()
    var current = timeInSecond(newDate)
    var dateString = dateConverter(newDate)
    var mainUrl
    var title
    if (changeInfo.url) {
      mainUrl = urlCutter(changeInfo.url)
    }
    if (changeInfo.title) {
      title = changeInfo.title
    }

    chrome.storage.sync.get(datas => {
      var timeInfo
      datas.timeHistory.forEach(data => {
        if (data.tabId === tabId) {
          timeInfo = data.timeCal
        }
      })

      var newValue = {
        id: tabId,
        title: title,
        url: mainUrl,
        time: dateString,
        timeCal: current - datas.currentTabTime
      }

      chrome.storage.sync.set({
        currentTabId: tabId,
        currentTabTime: current,
        currentTabUrl: mainUrl,
        currentTabOpen: dateString,
        currentTabTitle: title,
        timeHistory: [
          ...datas.timeHistory,
          {
            tabId: tabId,
            title: title,
            url: mainUrl,
            time: dateString,
            timeCal: current - timeInfo
          }
        ],
        timeEnded: [...datas.timeEnded, newValue],
        totalTime: [...datas.totalTime]
      })
      timeAddUp(newValue)
    })
  }
})

//listens for all events emitted by page content scripts
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

  //console.log('req', request, 'sender', sender)
})

//NOTFICATION STUFF IS BELOW

//User will be annoyed with notifications way too often for demo purposes
chrome.alarms.create('alarm', {periodInMinutes: 0.1})

chrome.alarms.onAlarm.addListener(function(alarm) {
  initNotification()
})
//I needed to break notification-making into two functions because querying tabs is asynchronus
function initNotification() {
  //If there's an active page, get the page title and init a notification
  chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    if (tabs) {
      makeNotification(tabs[0].title)
    }
  })
}
function makeNotification(tabName) {
  chrome.notifications.create({
    type: 'basic',
    title: 'Train the Wirehead AI',
    iconUrl: 'gray.png',
    message: 'Classify this page as work or play --->',
    buttons: [{title: 'This is work'}, {title: 'This is play'}]
  })
  chrome.notifications.onButtonClicked.addListener(function handleButton(
    notificationId,
    buttonIndex
  ) {
    chrome.notifications.onButtonClicked.removeListener(handleButton)

    //Is this page title associated with work or with play?
    let label
    if (buttonIndex === 0) {
      label = 'work'
    } else if (buttonIndex === 1) {
      label = 'play'
    }

    db.trainingData.add({
      document: tabName,
      label: label
    })
    //provisional, for demonstration only (we don't want to update bayes model so often-- maybe once a day)
    //might slow down your computer if you have a lot of stuff in 'trainingdata' db
    updateBayesModel()
    getClassifications('github')
  })
}
