var newDate = new Date()
var current =
  newDate.getSeconds() +
  newDate.getMinutes() * 60 +
  newDate.getHours() * 3600 +
  newDate.getDate() * 86400

var dateString = ''

dateString += newDate.getMonth() + 1 + '/'
dateString += newDate.getDate() + '/'
dateString += newDate.getFullYear() + ' '
dateString += newDate.getHours() + ':'
dateString += newDate.getMinutes() + ':'
dateString += newDate.getSeconds()

chrome.storage.sync.get(function(datas) {
  var timesave
  datas.totalTime.forEach(data => {
    if (data.url === datas.currentTabUrl) {
      timesave = data.totalTimeConsume
    }
  })

  document.querySelector('#current').innerText =
    datas.currentTabTitle +
    '\n' +
    'Currently opened at' +
    datas.currentTabOpen.substring(17) +
    '\n' +
    timeCalculator(current - datas.currentTabTime + (timesave || 0))

  // datas.timeEnded.map((data, idx) => {
  //   if (idx < 10) {
  //     var newDiv = document.createElement('div')
  //     var objectDiv = document.querySelector('#usage')
  //     var timeUsage = timeCalculator(data.timeCal)
  //     objectDiv.insertBefore(newDiv, objectDiv.firstChild)

  //     newDiv.appendChild(document.createTextNode(idx+1))
  //     newDiv.appendChild(document.createTextNode(data.title))
  //     newDiv.appendChild(document.createTextNode(data.url + " /"))
  //     newDiv.appendChild(document.createTextNode(data.time + " " + dateString + " /"))
  //     newDiv.appendChild(document.createTextNode(timeUsage + " /"))
  //   }
  // })
  // datas.totalTime.map((data, idx) => {
  //   var currentRunningTime = 0

  //   if(datas.currentTabUrl === data.url) {
  //     currentRunningTime = current - datas.currentTabTime + (timesave || 0)
  //   }
  //   var newDiv = document.createElement('div')
  //   var objectDiv = document.querySelector('#list')
  //   objectDiv.insertBefore(newDiv, objectDiv.firstChild)
  //   newDiv.appendChild(document.createTextNode(idx+1))
  //   newDiv.appendChild(document.createTextNode(data.url + " /"))
  //   newDiv.appendChild(document.createTextNode(timeCalculator(currentRunningTime ||  data.totalTimeConsume)))
  // })
  timeTopFive(datas).map((data, idx) => {
    var newDiv = document.createElement('div')
    var objectDiv = document.querySelector('#list')
    objectDiv.insertBefore(newDiv, objectDiv.firstChild)
    newDiv.appendChild(document.createTextNode(idx + 1))
    newDiv.appendChild(document.createTextNode(data.url + ' /'))
    newDiv.appendChild(document.createTextNode(timeCalculator(data.time)))
  })
})

function timeCalculator(time) {
  var timeUsage
  if (time < 60) {
    timeUsage = time + ' sec'
  } else if (time >= 60 && time < 3600) {
    timeUsage = Math.floor(time / 60) + ' min'
  } else if (time >= 3600 && time < 86400) {
    timeUsage =
      Math.floor(time / 3600) + ' hrs' + Math.floor((time % 3600) / 60) + 'min'
  }
  return timeUsage
}

function timeTopFive(datas) {
  var timesave
  var newTab = {
    url: datas.currentTabUrl,
    time: current - datas.currentTabTime
  }
  datas.totalTime.forEach(data => {
    if (data.url === datas.currentTabUrl) {
      timesave = data.totalTimeConsume
      newTab = undefined
    }
  })

  var currentTopList = datas.totalTime.map(data => {
    var currentRunningTime = 0
    if (datas.currentTabUrl === data.url) {
      currentRunningTime = current - datas.currentTabTime + (timesave || 0)
    }
    return {
      url: data.url,
      time: currentRunningTime || data.totalTimeConsume
    }
  })

  if (newTab) {
    currentTopList.push(newTab)
  }

  return currentTopList
    .sort((a, b) => {
      return a.time > b.time
    })
    .slice(-5)
}
