import db from '../db'
import {
  timeCalculator,
  dateConverter,
  timeInSecond
} from '../background/utils'

// db.history.get({url: "chrome://extensions/"}, result => {
//   console.log(result)
// })

var currentTime = 0
var currentUrl
db.history.toArray().then(result=>{
  var idx = result.length-1
  return result[idx]
})
.then(data=>{
  document.querySelector('#current').innerText =
  "URL: " +
  data.url +
  '\n' +
  "Currently opened at " +
  dateConverter(data.timeStart) +
  '\n' +
  "Currently has stayed on this website: " +
  timeCalculator(timeInSecond(new Date())-timeInSecond(data.timeStart))
  currentTime = timeInSecond(new Date())-timeInSecond(data.timeStart)
  currentUrl = data.url
})

db.history.orderBy('url').eachUniqueKey(key=>{
  console.log('keys', key)
  db.history.where({url: key}).toArray().then(result=>{
    var totalSpend = 0
    console.log('result:',result,'key:',key)
    result.forEach(data=>{
      totalSpend += data.timeTotal
    })
    // document.querySelector('#list').innerText = "URL " + key + " is :" + timeCalculator(totalSpend)
    // timeTopFive(result)
    var newDiv = document.createElement('div')
    var objectDiv = document.querySelector('#list')
    objectDiv.insertBefore(newDiv, objectDiv.firstChild)
    newDiv.appendChild(document.createTextNode('URL:' + key + ' /'))
    currentUrl === key ?
    newDiv.appendChild(document.createTextNode(timeCalculator(totalSpend + currentTime)))
    :
    newDiv.appendChild(document.createTextNode(timeCalculator(totalSpend)))
  })
})


function timeTopFive(datas) {
    var totalSpend = 0
    console.log('result:',datas)
    datas.forEach(data=>{
      totalSpend += data.timeTotal
    })

    return totalSpend
  }

  // var timesave
  // var newTab = {
  //   url: datas.currentTabUrl,
  //   time: timeInSecond(newDate) - datas.currentTabTime
  // }
  // datas.totalTime.forEach(data => {
  //   if (data.url === datas.currentTabUrl) {
  //     timesave = data.totalTimeConsume
  //     newTab = undefined
  //   }
  // })

  // var currentTopList = datas.totalTime.map(data => {
  //   var currentRunningTime = 0
  //   if (datas.currentTabUrl === data.url) {
  //     currentRunningTime = timeInSecond(newDate) - datas.currentTabTime + (timesave || 0)
  //   }
  //   return {
  //     url: data.url,
  //     time: currentRunningTime || data.totalTimeConsume
  //   }
  // })

  // if (newTab) {
  //   currentTopList.push(newTab)
  // }

  // return currentTopList
  //   .sort((a, b) => {
  //     return a.time > b.time
  //   })
  //   .slice(-5)
