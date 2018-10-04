/*global chrome*/
/*
The structure of the background scripts is as follows:
*index.js (this file), we have all our event listeners - I think they have to be here
*eventPage.js is utility functions for use by index.js (might be worth renaming)
*db.js builds the db schema
*bayesClassifier.js is for use by Kevin
*don't hesitate to add new files as needed!
*/
import classifier from './bayesClassifier'
import {updateBayesModel, getBayesModel} from './bayesUtils'
import {
  dateConverter,
  timeInSecond,
  activeTabRecoder,
} from './utils'
import db from '../db'

//Store the data when a chrome window switched
chrome.windows.onFocusChanged.addListener(function(windowInfo) {
  //Prevent error when all of the windows are focused out
  //When it focused out, outcome of windowInfo = -1
  // if (windowInfo > 0) {
  //   chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
  //     // activeTabRecoder(tabs[0].id)
  //     // console.log(tabs[0])
  //     var url = new URL(tabs[0].url)

  //     db.history.toArray().then(result=>{
  //       var idx = result.length-1
  //       return result[idx]
  //     })
  //     .then(data=>{
  //       db.history.update(data.id, {origin: new Date(), timeTotal: ((new Date() - data.start)/1000)})
  //     })

  //     //Post start time data when open the tab
  //     db.history
  //     .put({url: url.hostname, start: new Date(), origin: undefined, timeTotal: 0, title: tabs[0].title})
  //     .then(i => {
  //       console.log('wrote ' + i)
  //     })
  //     .catch(err => {
  //       console.error(err)
  //     })
  //   })
  // }
})

//Initial store the data right after re-load
chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {

})

chrome.tabs.onActivated.addListener(function(activeInfo) {
  chrome.browserAction.setIcon(
    Math.random() > 0.5 ? {path: './green.png'} : {path: './red.png'}
  )

  //get detail information of activated tab
  chrome.tabs.get(activeInfo.tabId, function(tab) {
    //this code creates a transaction and uses it to write to the db
    var url = new URL(tab.url)

    //Update database when revisit the site
    // db.history.orderBy('url').eachUniqueKey(key=>{
    //   db.history.where({url: key}).toArray().then(result=>{
    //     var idx = result.length-1
    //     if(result[idx].url === url.hostname && !result[idx].origin) {
    //       id = result[idx].id
    //       timeGap = (newDate - result[idx].start)/1000
    //     }
    //   })
    // })
    // .then(()=>{
    //   db.history.update(id, {origin: newDate, timeTotal: timeGap})
    // })
    // .catch(err => {
    //   console.error(err)
    // })

    //Update time end when focus out of the tab
    db.history.toArray().then(result=>{
      var idx = result.length-1
      return result[idx]
    })
    .then(data=>{
      db.history.update(data.id, {timeEnd: new Date(), timeTotal: ((new Date() - data.timeStart)/1000)})
    })

    //Post start time data when open the tab
    db.history
    .put({url: url.hostname, timeStart: new Date(), timeEnd: undefined, timeTotal: 0, label: undefined})
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
  if(tab.active && tab.status === 'complete') {
    // var newDate = new Date();
    var url = new URL(tab.url);

    //Update time end when focus out of the tab
    db.history.toArray().then(result=>{
      var idx = result.length-1
      return result[idx]
    })
    .then(data=>{
      db.history.update(data.id, {timeEnd: new Date(), timeTotal: ((new Date() - data.timeStart)/1000)})
    })

    //Post start time data when open the tab
    db.history
    .put({url: url.hostname, timeStart: new Date(), timeEnd: undefined, timeTotal: 0, label: undefined})
    .then(i => {
      console.log('wrote ' + i)
    })
    .catch(err => {
      console.error(err)
    })
  }
})

//An Event Listener to store stop information when close the tab
chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
  var newDate = new Date();

  db.history.toArray().then(result=>{
    var idx = result.length-1
    return result[idx]
  })
  .then(data=>{
    db.history.update(data.id, {timeEnd: newDate, timeTotal: ((newDate - data.timeStart)/1000)})
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
