import db from '../db'
import {
  timeCalculator,
  currentTimeCalculator,
  dateConverter,
  urlValidation,
  titleCutter
} from '../background/utils'
import {DH_CHECK_P_NOT_PRIME} from 'constants'

//Current Page Information
var currentTime = 0
var currentUrl

db.history
  .where('timeStart')
  .between(new Date().setHours(0, 0, 0, 0), new Date().valueOf())
  .toArray()
  .then(result => {
    var idx = result.length - 1
    return result[idx]
  })
  .then(data => {
    currentTime = new Date().valueOf() - data.timeStart
    currentUrl = data.url

    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
      if (tabs[0].favIconUrl) {
        document.querySelector('#favIcon').src = tabs[0].favIconUrl
      }
      document.querySelector('#current-title').innerText = titleCutter(
        tabs[0].title
      )
      document.querySelector('#current-time').innerText = dateConverter(
        new Date()
      )
      if (urlValidation(tabs[0] && new URL(tabs[0].url))) {
        document.querySelector('#current').innerText = currentTimeCalculator(
          new Date().valueOf() - data.timeStart
        )
      } else {
        document
          .querySelector('.ui.slide.masked.reveal.image.black.inverted.segment')
          .classList.remove('black')
      }
    })
  })

//Monitoring top 5 high total time of usage
var collect = []
let collection = {}
var todayTotal = 0

db.history
  .where('timeStart')
  .between(new Date().setHours(0, 0, 0, 0), new Date().valueOf())
  .toArray()
  .then(async result => {
    result.forEach(data => {
      if (collection[data.url]) {
        collection[data.url] += data.timeTotal
        todayTotal += data.timeTotal
      } else {
        collection[data.url] = data.timeTotal
        todayTotal += data.timeTotal
      }
    })

    var time = currentTime - result[result.length - 1].timeTotal
    collection[currentUrl] += time

    document.querySelector('#current-total').innerText = currentTimeCalculator(
      collection[currentUrl]
    )

    for (let url in collection) {
      const obj = {}
      obj.url = url
      obj.time = collection[url]
      collect.push(obj)
    }
  })
  .then(() => {
    var test = collect
      .sort((a, b) => {
        return a.time - b.time
      })
      .slice(-5)
    let count = test.length
    test.forEach(elem => {
      if (elem.time > 999) {
        var newDiv = document.createElement('ul')
        var objectDiv = document.querySelector('#list')
        objectDiv.insertBefore(newDiv, objectDiv.firstChild)
        newDiv.appendChild(
          document.createTextNode(count + ' : ' + titleCutter(elem.url) + ' / ')
        )
        newDiv.appendChild(document.createTextNode(timeCalculator(elem.time)))
        count--
        document.querySelector('#total').innerText =
          'Today: ' + timeCalculator(todayTotal)
      }
    })
  })
