import db from '../db'
import {
  timeCalculator,
  dateConverter,
} from '../background/utils'

//Current Page Information
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
  dateConverter(new Date(data.timeStart)) +
  '\n' +
  "Currently has stayed on this website: " +
  timeCalculator(new Date().valueOf()-data.timeStart)
  currentTime = new Date().valueOf()-data.timeStart
  currentUrl = data.url
})

//Monitoring top 5 high total time of usage
var collect = []
db.history.orderBy('url').eachUniqueKey(key=>{
  console.log('keys', key)
  db.history.where({url: key}).toArray().then(result=>{
    var totalSpend = 0
    console.log('result:',result,'key:',key)
    result.forEach(data=>{
      totalSpend += data.timeTotal
    })
    currentUrl === key ? totalSpend += currentTime : totalSpend

    collect.push({url: key, time: totalSpend})
  })
}).then(()=>{
  var test = collect.sort((a,b)=>{
    return Math.floor(a.time) > Math.floor(b.time)
  }).slice(-5)
  test.forEach(elem=>{
    var newDiv = document.createElement('ul')
    var objectDiv = document.querySelector('#list')
    objectDiv.insertBefore(newDiv, objectDiv.firstChild)
    newDiv.appendChild(document.createTextNode('URL:' + elem.url + ' /'))
    currentUrl === elem.url ?
    newDiv.appendChild(document.createTextNode(timeCalculator(elem.time)))
    :
    newDiv.appendChild(document.createTextNode(timeCalculator(elem.time)))
  })
})
