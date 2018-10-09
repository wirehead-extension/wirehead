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
  deleteOldTrainingData,
  classifyDocumentIfBayesModel
} from './bayesClassifier'
import {initOptions, updateOptions, getOptions} from './options'
import {
  dateConverter,
  timeInSecond,
  timeCalculator,
  urlValidation
} from './utils'
import {makeLearnMoreNotification} from './newUserTest'
import db from '../db'

//session variables so we know whether to prompt the user to learn more
//or maybe per-window. Either way not too annoying
let aboutNotificationClicked = false
const clickAboutNotification = () => {
  aboutNotificationClicked = true
}

// Is chrome in focus? We will check this var before sending notifications
let chromeIsInFocus = true
chrome.windows.onFocusChanged.addListener(function(window) {
  if (window === chrome.windows.WINDOW_ID_NONE) {
    chromeIsInFocus = false
  } else {
    chromeIsInFocus = true
  }
})

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
    chrome.tabs.query({active: true, lastFocusedWindow: true}, async tabs => {
      if (tabs[0] && urlValidation(new URL(tabs[0].url))) {
        //kill training notification on tab switch

        var url = new URL(tabs[0].url)
        // Update time end when focus out of the tab

        //Post start time data when open the tab
        db.history
          ///Put bayes label here
          .put({
            url: url.hostname,
            timeStart: new Date().valueOf(),
            timeEnd: undefined,
            timeTotal: 0,
            label: await classifyDocumentIfBayesModel(tabs[0].title)
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
  killNotification()
  //get detail information of activated tab
  chrome.tabs.get(activeInfo.tabId, async function(tab) {
    const model = await getBayesModel()
    if (model) {
      updateIcon(tab)
    } else {
      makeLearnMoreNotification(
        clickAboutNotification,
        aboutNotificationClicked
      )
    }
    //this code creates a transaction and uses it to write to the db
    var url = new URL(tab.url)

    var a = await db.history.where({label: 'play'}).toArray()
    console.log('///test///', a)

    //Post start time data when open the tab
    if (urlValidation(new URL(tab.url))) {
      db.history
        .put({
          url: url.hostname,
          timeStart: new Date().valueOf(),
          timeEnd: undefined,
          timeTotal: 0,
          label: await classifyDocumentIfBayesModel(tab.title)
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
chrome.tabs.onUpdated.addListener(async function(tabId, changeInfo, tab) {
  killNotification()
  if (tab.active && tab.status === 'complete') {
    var url = new URL(tab.url)
    var currentUrl

    //Update time end when focus out of the tab
    if (currentUrl !== url.hostname && urlValidation(new URL(tab.url))) {
      db.history
        .put({
          url: url.hostname,
          timeStart: new Date().valueOf(),
          timeEnd: undefined,
          timeTotal: 0,
          label: await classifyDocumentIfBayesModel(tab.title)
        })
        .then(i => {
          console.log('wrote ' + i)
        })
        .catch(err => {
          console.error(err)
        })
    }
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
chrome.alarms.create('update bayes model', {periodInMinutes: 1000})

chrome.alarms.onAlarm.addListener(async function(alarm) {
  if (alarm.name === 'update bayes model') {
    const numberExamples = await getNumberOfTrainingExamples()
    if (numberExamples >= LOTS_OF_TRAINING_EXAMPLES) {
      updateBayesModel()
    }
  }
})

//NOTFICATION STUFF IS BELOW

//This initializes alarm that causes notifications to be made
chrome.runtime.onInstalled.addListener(function(details) {
  if (details.reason === 'install') {
    chrome.alarms.create('make notification', {periodInMinutes: 0.2})
  }
})

//User will be notified by hour how long they stayed on the website
chrome.alarms.create('timer', {periodInMinutes: 0.1})

//Timer keep tracks current time & if laptop is turned off
chrome.alarms.create('tracker', {periodInMinutes: 0.1})

chrome.alarms.onAlarm.addListener(async function(alarm) {
  if (alarm.name === 'timer') {
    timeNotification()
  } else if (alarm.name === 'make notification') {
    const options = await getOptions()
    if (options.allowTrainingPopups) {
      chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        if (tabs[0]) {
          makeNotification()
        }
      })
    }
  }
})

//Timer keep tracks current time per second & if laptop is turned off
setInterval(() => {
  timeTracker()
}, 1000)

function makeNotification() {
  if (chromeIsInFocus) {
    chrome.notifications.onClicked.removeListener(redirectToDashboard)
    chrome.notifications.onButtonClicked.removeListener(handleButton)
    chrome.notifications.create('training notification', {
      type: 'basic',
      title: 'Train the Wirehead AI',
      iconUrl: 'gray.png',
      message: 'Classify this page as work or play -->',
      buttons: [{title: 'This is work'}, {title: 'This is play'}]
    })
    chrome.notifications.onButtonClicked.addListener(handleButton)
    chrome.notifications.onClicked.addListener(redirectToDashboard)
  }
}

function redirectToDashboard(notificationId) {
  console.log('hello world!')
  chrome.tabs.create({url: 'dashboard.html'})
}

function killNotification() {
  chrome.notifications.onButtonClicked.removeListener(handleButton)
  chrome.notifications.clear('training notification')
}

//Clicking buttons on notification does a lot of things:
//1. It adds training examples to the db, labeled "work" or "play"
//2. If we don't have a lot of training examples...
//it updates the machine learning model, makes a new prediction, and updates the icon
//3. If we have too many training examples it tells the db to drop 100 lines
function handleButton(notificationId, buttonIndex) {
  chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs) {
    const currentTab = tabs[0]
    let label
    if (buttonIndex === 0) {
      label = 'work'
    } else if (buttonIndex === 1) {
      label = 'play'
    }

    processNewTrainingExample(currentTab, label)
  })
}

//Mostly just adds a new training example to dbx
async function processNewTrainingExample(currentTab, label) {
  db.trainingData.add({
    document: currentTab.title,
    label: label,
    time: new Date().getTime()
  })

  const numberExamples = await getNumberOfTrainingExamples()
  //Slowly decrease frequency of popup (in minutes) as user uses the extension more
  checkForAlarmUpdates(numberExamples)
  //stop constantly updating the bayes model if we have a lots of training examples,
  //so as not to make chrome really slow
  if (numberExamples < LOTS_OF_TRAINING_EXAMPLES) {
    await updateBayesModel()
    updateIcon(currentTab)
  }
  //Delete older training data if we have accumulated a ton
  else if (numberExamples > MAX_TRAINING_EXAMPLES) {
    deleteOldTrainingData()
  }
}

//Once we have a lot of Bayes examples, we can annoy the user for training data less often
function checkForAlarmUpdates(numberExamples) {
  if (numberExamples === 100) {
    updateNotificationFrequency(10)
  } else if (numberExamples === 200) {
    updateNotificationFrequency(20)
  } else if (numberExamples === 500) {
    updateNotificationFrequency(30)
  } else if (numberExamples === 1000) {
    updateNotificationFrequency(60)
  }
}

//This updates the frequency of the alarm that makes notifications (used below)
function updateNotificationFrequency(newPeriod) {
  chrome.alarms.clear('make notification')
  chrome.alarms.create('make notification', {periodInMinutes: newPeriod})
}

function timeNotification() {
  //If there's an active page, get the page title and init a notification

  chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    if (tabs[0] && urlValidation(new URL(tabs[0].url))) {
      var url = new URL(tabs[0].url).hostname
      db.history
        .where({url})
        .toArray()
        .then(result => {
          var totalSpend = 0

          result.forEach(data => {
            if (
              new Date(data.timeStart).getFullYear() ===
                new Date().getFullYear() &&
              new Date(data.timeStart).getMonth() === new Date().getMonth() &&
              new Date(data.timeStart).getDate() === new Date().getDate()
            ) {
              totalSpend += data.timeTotal
            }
          })

          var hourCalculator = Math.floor(totalSpend / 3600000) * 3600000
          // console.log('title:', tabs[0].title, 'time:', totalSpend)
          if (
            totalSpend > hourCalculator &&
            totalSpend < hourCalculator + 6000 &&
            totalSpend > 10000
          ) {
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
    message: title.slice(0, 30) + ' : \n' + timeprint
  })
}

function timeTracker() {
  chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    if (tabs[0] && urlValidation(new URL(tabs[0].url))) {
      db.history
        .toArray()
        .then(result => {
          var idx = result.length - 1
          return result[idx]
        })
        .then(async data => {
          if (
            new Date().valueOf() - (data.timeEnd || new Date().valueOf()) <
              30000 &&
            new Date(data.timeStart).getFullYear() ===
              new Date().getFullYear() &&
            new Date(data.timeStart).getMonth() === new Date().getMonth() &&
            new Date(data.timeStart).getDate() === new Date().getDate()
          ) {
            db.history.update(data.id, {
              timeEnd: new Date().valueOf(),
              timeTotal: new Date().valueOf() - data.timeStart
            })
          } else {
            db.history.put({
              url: new URL(tabs[0].url).hostname,
              timeStart: new Date().valueOf(),
              timeEnd: undefined,
              timeTotal: 0,
              label: await classifyDocumentIfBayesModel(tabs[0].title)
            })
          }
        })
    }
  })
}

chrome.runtime.onMessage.addListener(function(message) {
  if (message.action === 'classify website' && message.label) {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
      if (tabs[0]) {
        processNewTrainingExample(tabs[0], message.label)
      }
    })
  }
})
