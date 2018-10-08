import db from '../db'
import {
  timeCalculator,
  currentTimeCalculator,
  dateConverter,
  urlValidation,
} from '../background/utils'
import { DH_CHECK_P_NOT_PRIME } from 'constants';

//Current Page Information
var currentTime = 0
var currentUrl

db.history.toArray().then(result=>{
  var idx = result.length-1
  return result[idx]
})
.then(data=>{
  currentTime = new Date().valueOf()-data.timeStart
  currentUrl = data.url

  chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs =>{
    document.querySelector('#current-title').innerText = tabs[0].title.slice(0,28)
    document.querySelector('#current-time').innerText = dateConverter(new Date())
    if (urlValidation(new URL(tabs[0].url))) {
      document.querySelector('#current').innerText = currentTimeCalculator(new Date().valueOf()-data.timeStart)
    } else {
      document.querySelector('.ui.slide.masked.reveal.image.teal.inverted.segment').remove()
    }
  })
})


//Monitoring top 5 high total time of usage
var collect = []
var todayTotal = 0

db.history.orderBy('url').eachUniqueKey(key=>{
  console.log('keys', key)
  db.history.where({url: key}).toArray().then(result=>{
    var totalSpend = 0
    console.log('result:',result,'key:',key)
    result.forEach(data=>{
      if (new Date(data.timeStart).getFullYear() === new Date().getFullYear()
      && new Date(data.timeStart).getMonth() === new Date().getMonth()
      && new Date(data.timeStart).getDate() === new Date().getDate()) {
        totalSpend += data.timeTotal
        todayTotal += data.timeTotal
      }
    })

    var time = currentTime - result[result.length-1].timeTotal
    currentUrl === key ? totalSpend += time  : totalSpend

    currentUrl === key ? document.querySelector('#current-total').innerText = currentTimeCalculator(totalSpend) : ''

    collect.push({url: key, time: totalSpend})
  })
}).then(()=>{

  var test = collect.sort((a,b)=>{
    return a.time - b.time
  }).slice(-5)

  test.forEach(elem=>{
    if (elem.time > 999) {
      var newDiv = document.createElement('ul')
      var objectDiv = document.querySelector('#list')
      objectDiv.insertBefore(newDiv, objectDiv.firstChild)
      newDiv.appendChild(document.createTextNode('URL:' + elem.url + ' /'))
      currentUrl === elem.url ?
      newDiv.appendChild(document.createTextNode(timeCalculator(elem.time)))
      :
      newDiv.appendChild(document.createTextNode(timeCalculator(elem.time)))

      document.querySelector('#total').innerText = "Today's Total: " + timeCalculator(todayTotal)
    }
  })
})

