/*global chrome*/
/*
The structure of the background scripts is as follows:
*index.js (this file), we have all our event listeners - I think they have to be here
*utils.js is utility functions for use by index.js
*db builds the db schema
*bayesClassifier.js is for use by Kevin
*don't hesitate to add new files as needed!
*/
import {
  getBayesModel,
  updateBayesModel,
  getClassifications,
  classifyDocument,
  getNumberOfTrainingExamples,
  deleteOldTrainingData
} from './bayesClassifier'
import {dateConverter, timeInSecond, timeCalculator, urlValidation} from './utils'
import db from '../db'

//We remake the bayes model less often when we have  LOTS  of examples
const LOTS_OF_TRAINING_EXAMPLES = 2000
//We cull old traingin examples from db after reaching MAX
const MAX_TRAINING_EXAMPLES = 10000

var currentWindow

//Store the data when a chrome window switched
chrome.windows.onFocusChanged.addListener(function(windowInfo) {
  //Prevent error when all of the windows are focused out which is -1
  //It runs only currentWindow ID has been changed

  if (windowInfo > 0 && windowInfo !== currentWindow) {
    currentWindow = windowInfo
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
      if (tabs[0] && urlValidation(new URL(tabs[0].url))) {
        var url = new URL(tabs[0].url)
        // Update time end when focus out of the tab
        // db.history
        //   .toArray()
        //   .then(result => {
        //     var idx = result.length - 1
        //     return result[idx]
        //   })
        //   .then(data => {
        //     db.history.update(data.id, {
        //       timeEnd: new Date().valueOf(),
        //       timeTotal: new Date().valueOf() - data.timeStart
        //     })
        //   })

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
    // db.history
    //   .toArray()
    //   .then(result => {
    //     var idx = result.length - 1
    //     return result[idx]
    //   })
    //   .then(data => {
    //     db.history.update(data.id, {
    //       timeEnd: new Date().valueOf(),
    //       timeTotal: new Date().valueOf() - data.timeStart
    //     })
    //   })


    //Post start time data when open the tab
    if (urlValidation(new URL(tab.url))) {
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
})

//An Event Listener to store data when URL has been changed
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (tab.active && tab.status === 'complete') {
    var url = new URL(tab.url)
    var currentUrl

    //Update time end when focus out of the tab
    // db.history
    //   .toArray()
    //   .then(result => {
    //     var idx = result.length - 1
    //     currentUrl = result[idx].url
    //     return result[idx]
    //   })
    //   .then(data => {
    //     if (currentUrl !== url.hostname) {
    //       db.history.update(data.id, {
    //         timeEnd: new Date().valueOf(),
    //         timeTotal: new Date().valueOf() - data.timeStart
    //       })
    //     }
    //   })
    //   .then(() => {
        if (currentUrl !== url.hostname && urlValidation(new URL(tab.url))) {
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
      // })
  }
})

//An Event Listener to store stop information when close the tab
chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
  // if (urlValidation(new URL(tabs[0].url))) {
    var newDate = new Date().valueOf()

    // db.history
    //   .toArray()
    //   .then(result => {
    //     var idx = result.length - 1
    //     return result[idx]
    //   })
    //   .then(data => {
    //     db.history.update(data.id, {
    //       timeEnd: newDate,
    //       timeTotal: newDate - data.timeStart
    //     })
    //   })
  // }
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

//This alarm should update the bayes model with new training data about one every day
//but only if we have LOTS_OF_TRAINING_DATA (2000 lines in db)
//which would make updating the model computationaly expensive
//Otherwise, we can just update the model every time we add a single training datum
chrome.alarms.create('train bayes model', {periodInMinutes: 1000})

chrome.alarms.onAlarm.addListener(async function(alarm) {
  if (alarm.name === 'train bayes model') {
    const numberExamples = await getNumberOfTrainingExamples()

    if (numberExamples >= LOTS_OF_TRAINING_EXAMPLES) {
      updateBayesModel()
    }
  }
})

//NOTFICATION STUFF IS BELOW

//I needed to break notification-making into two functions because querying tabs is asynchronus
chrome.alarms.create('initialize notification', {periodInMinutes: 5})

//User will be notified by hour how long they stayed on the website
chrome.alarms.create('timer', {periodInMinutes: 0.1})

chrome.alarms.onAlarm.addListener(function(alarm) {
  if (alarm.name === 'timer') {
    timeNotification()
  } else if (alarm.name === 'initialize notification') {
    initNotification()
  }
})

//Timer keep tracks current time per second & if laptop is turned off
setInterval(()=>{
  timeTracker()
},1000)

// I needed to break notification-making into two functions because querying tabs is asynchronus
function initNotification() {
  //If there's an active page, get the page title and init a notification
  chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    if (tabs[0] && urlValidation(new URL(tabs[0].url))) {
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
  let tabName
  chrome.tabs.query({active: true, lastFocusedWindow: true}, async function(
    tabs
  ) {
    tabName = tabs[0].title

    let label
    if (buttonIndex === 0) {
      label = 'work'
    } else if (buttonIndex === 1) {
      label = 'play'
    }

    db.trainingData.add({
      document: tabName,
      label: label,
      time: new Date().getTime()
    })
    const numberExamples = await getNumberOfTrainingExamples()
    //stop constantly updating the bayes model if we have a lots of training examples, //so as not to make chrome really slow
    if (numberExamples < LOTS_OF_TRAINING_EXAMPLES) {
      await updateBayesModel()
      updateIcon(tabs[0])
    }
    //Delete older training data if we have accumulated a ton
    else if (numberExamples > MAX_TRAINING_EXAMPLES) {
      deleteOldTrainingData()
    }
  })
}

function timeNotification() {
  //If there's an active page, get the page title and init a notification

  chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    if (tabs[0] && urlValidation(new URL(tabs[0].url))) {
      var url = new URL(tabs[0].url).hostname
      db.history.where({url}).toArray().then(result=>{
        var totalSpend = 0

        result.forEach(data=>{
          if (new Date(data.timeStart).getFullYear() === new Date().getFullYear()
          && new Date(data.timeStart).getMonth() === new Date().getMonth()
          && new Date(data.timeStart).getDate() === new Date().getDate()) {
            totalSpend += data.timeTotal
          }
        })

        var hourCalculator = Math.floor(totalSpend/3600000) * 3600000
        console.log('title:',tabs[0].title, 'time: ', new Date(), 'time Spend:', totalSpend)
        if (totalSpend > hourCalculator && totalSpend < hourCalculator + 6000 && totalSpend > 10000) {
          makeTimeNotification(tabs[0].title, totalSpend)
        }
      })
    }
  })
}

function makeTimeNotification(title, time) {
  var timeprint = timeCalculator(time)
  chrome.notifications.create({
    type: 'basic',
    title: 'You spent time on this website',
    iconUrl: 'heartwatch.png',
    message: title.slice(0,30) + ' : \n' + timeprint
  })
}

function timeTracker() {
  chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    if (tabs[0] && urlValidation(new URL(tabs[0].url))) {
      db.history.toArray().then(result=>{
        var idx = result.length-1
        return result[idx]
      })
      .then(data=>{
        if (new Date().valueOf() - (data.timeEnd || new Date().valueOf()) < 30000 && new Date(data.timeStart).getFullYear() === new Date().getFullYear()
        && new Date(data.timeStart).getMonth() === new Date().getMonth()
        && new Date(data.timeStart).getDate() === new Date().getDate()) {
          db.history.update(data.id, {timeEnd: new Date().valueOf(), timeTotal: (new Date().valueOf() - data.timeStart)})
        } else {
          db.history
          .put({url: new URL(tabs[0].url).hostname, timeStart: new Date().valueOf(), timeEnd: undefined, timeTotal: 0, label: undefined})
        }
      })
    }
  })
}
