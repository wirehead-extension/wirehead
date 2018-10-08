import db from '../db'
import {
  timeCalculator,
  currentTimeCalculator,
  dateConverter
} from '../background/utils'

//Current Page Information
var currentTime = 0
var currentUrl

db.history
  .toArray()
  .then(result => {
    var idx = result.length - 1
    return result[idx]
  })
  .then(data => {
    document.querySelector('#current-title').innerText =
      'Current site: ' + data.url
    document.querySelector('#current').innerText =
      "You've been here for: " +
      currentTimeCalculator(new Date().valueOf() - data.timeStart)
    currentTime = new Date().valueOf() - data.timeStart
    currentUrl = data.url
  })

//Monitoring top 5 high total time of usage
var collect = []
var todayTotal = 0

db.history
  .orderBy('url')
  .eachUniqueKey(key => {
    console.log('keys', key)
    db.history
      .where({url: key})
      .toArray()
      .then(result => {
        var totalSpend = 0
        console.log('result:', result, 'key:', key)
        result.forEach(data => {
          if (
            new Date(data.timeStart).getFullYear() ===
              new Date().getFullYear() &&
            new Date(data.timeStart).getMonth() === new Date().getMonth() &&
            new Date(data.timeStart).getDate() === new Date().getDate()
          ) {
            totalSpend += data.timeTotal
            todayTotal += data.timeTotal
          }
        })

        var time = currentTime - result[result.length - 1].timeTotal
        currentUrl === key ? (totalSpend += time) : totalSpend

        currentUrl === key
          ? (document.querySelector('#current-total').innerText =
              'Total time on this site: ' + currentTimeCalculator(totalSpend))
          : ''

        collect.push({url: key, time: totalSpend})
      })
  })
  .then(() => {
    var test = collect
      .sort((a, b) => {
        return a.time - b.time
      })
      .slice(-5)

    test.forEach(elem => {
      if (elem.time > 999) {
        var newDiv = document.createElement('ul')
        var objectDiv = document.querySelector('#list')
        objectDiv.insertBefore(newDiv, objectDiv.firstChild)
        newDiv.appendChild(document.createTextNode('URL:' + elem.url + ' /'))
        currentUrl === elem.url
          ? newDiv.appendChild(
              document.createTextNode(timeCalculator(elem.time))
            )
          : newDiv.appendChild(
              document.createTextNode(timeCalculator(elem.time))
            )

        document.querySelector('#total').innerText =
          'Total Time: ' + timeCalculator(todayTotal)
      }
    })
  })
