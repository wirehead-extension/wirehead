/*global chrome*/
/*
The structure of the background scripts is as follows:
*index.js (this file), we have all our event listeners - I think they have to be here
*utils.js is utility functions for use by index.js
*db.js builds the db schema
*bayesClassifier.js is for use by Kevin
*don't hesitate to add new files as needed!
*/
import {
  getBayesModel,
  updateBayesModel,
  getClassifications,
  classifyDocument
} from './bayesClassifier'
import {dateConverter, timeInSecond} from './utils'
import db from '../db'

var currentWindow

//Store the data when a chrome window switched
chrome.windows.onFocusChanged.addListener(function(windowInfo) {
  //Prevent error when all of the windows are focused out which is -1
  //It runs only currentWindow ID has been changed
  if (windowInfo > 0 && windowInfo !== currentWindow) {
    currentWindow = windowInfo
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
      if (tabs[0]) {
        var url = new URL(tabs[0].url)

        // Update time end when focus out of the tab
        db.history
          .toArray()
          .then(result => {
            var idx = result.length - 1
            return result[idx]
          })
          .then(data => {
            db.history.update(data.id, {
              timeEnd: new Date().valueOf(),
              timeTotal: new Date().valueOf() - data.timeStart
            })
          })

        //Post start time data when open the tab
        db.history
          .put({
            url: url.hostname,
            timeStart: new Date().valueOf(),
            timeEnd: undefined,
            timeTotal: 0,
            label: undefined
          })
          .then(i => {
            console.log('wrote ' + i)
          })
          .catch(err => {
            console.error(err)
          })
      }
    })
  }
})

//Initial store the data right after re-load
// chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {

// })

chrome.tabs.onActivated.addListener(function(activeInfo) {
  //get detail information of activated tab
  chrome.tabs.get(activeInfo.tabId, async function(tab) {
    const model = await getBayesModel()
    if (model) {
      updateIcon(tab)
    }
    //this code creates a transaction and uses it to write to the db
    var url = new URL(tab.url)

    //Update time end when focus out of the tab
    db.history
      .toArray()
      .then(result => {
        var idx = result.length - 1
        return result[idx]
      })
      .then(data => {
        db.history.update(data.id, {
          timeEnd: new Date().valueOf(),
          timeTotal: new Date().valueOf() - data.timeStart
        })
      })

    //Post start time data when open the tab
    db.history
      .put({
        url: url.hostname,
        timeStart: new Date().valueOf(),
        timeEnd: undefined,
        timeTotal: 0,
        label: undefined
      })
      .then(i => {
        console.log('wrote ' + i)
      })
      .catch(err => {
        console.error(err)
      })
  })
})

//An Event Listener to store data when URL has been changed
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (tab.active && tab.status === 'complete') {
    var url = new URL(tab.url)
    var currentUrl

    //Update time end when focus out of the tab
    db.history
      .toArray()
      .then(result => {
        var idx = result.length - 1
        currentUrl = result[idx].url
        return result[idx]
      })
      .then(data => {
        if (currentUrl !== url.hostname) {
          db.history.update(data.id, {
            timeEnd: new Date().valueOf(),
            timeTotal: new Date().valueOf() - data.timeStart
          })
        }
      })
      .then(() => {
        if (currentUrl !== url.hostname) {
          db.history
            .put({
              url: url.hostname,
              timeStart: new Date().valueOf(),
              timeEnd: undefined,
              timeTotal: 0,
              label: undefined
            })
            .then(i => {
              console.log('wrote ' + i)
            })
            .catch(err => {
              console.error(err)
            })
        }
      })
  }
})

//An Event Listener to store stop information when close the tab
chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
  var newDate = new Date().valueOf()

  db.history
    .toArray()
    .then(result => {
      var idx = result.length - 1
      return result[idx]
    })
    .then(data => {
      db.history.update(data.id, {
        timeEnd: newDate,
        timeTotal: newDate - data.timeStart
      })
    })
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

//This function updates the icon and badge according to ML prediction
async function updateIcon(tab) {
  //page classification is either "work" or "play"
  const pageClassification = await classifyDocument(tab.title)
  //We format the raw output of machine learning model (const probabilities, decimals)
  const probabilities = await getClassifications(tab.title)
  //as a percentage (certainty)
  let certainty
  if (probabilities) {
    certainty =
      (probabilities[0].value /
        (probabilities[0].value + probabilities[1].value)) *
      100
  }

  if (pageClassification) {
    chrome.browserAction.setIcon(
      pageClassification === 'work'
        ? {path: './green.png'}
        : {path: './red.png'}
    )
  } else {
    chrome.browserAction.setIcon({path: './gray.png'})
  }
  if (certainty) {
    chrome.browserAction.setBadgeText({
      text: String(certainty).slice(0, 2) + '%'
    })
  }
}

//NOTFICATION STUFF IS BELOW

//User will be annoyed with notifications way too often for demo purposes
chrome.alarms.create('alarm', {periodInMinutes: 0.2})

chrome.alarms.onAlarm.addListener(function(alarm) {
  initNotification()
})
// I needed to break notification-making into two functions because querying tabs is asynchronus
function initNotification() {
  //If there's an active page, get the page title and init a notification
  chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    if (tabs[0]) {
      makeNotification()
    }
  })
}
function makeNotification() {
  chrome.notifications.onButtonClicked.removeListener(handleButton)
  chrome.notifications.create({
    type: 'basic',
    title: 'Train the Wirehead AI',
    iconUrl: 'gray.png',
    message: 'Classify this page as work or play --->',
    buttons: [{title: 'This is work'}, {title: 'This is play'}]
  })
  chrome.notifications.onButtonClicked.addListener(handleButton)
}

function handleButton(notificationId, buttonIndex) {
  //Is this page title associated with work or with play?
  let tabName
  chrome.tabs.query({active: true, lastFocusedWindow: true}, async function(
    tabs
  ) {
    tabName = tabs[0].title
    console.log('tabName', tabName)

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
    await updateBayesModel()
    updateIcon(tabs[0])
  })
}
