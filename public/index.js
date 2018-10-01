var newDate = new Date();
var current = newDate.getSeconds() + newDate.getMinutes() * 60 + newDate.getHours() * 3600 + newDate.getDate() * 86400

var dateString = ''

dateString += (newDate.getMonth() + 1) + "/";
dateString += newDate.getDate() + "/";
dateString += newDate.getFullYear() + " ";
dateString += newDate.getHours() + ":";
dateString += newDate.getMinutes() + ":";
dateString += newDate.getSeconds();

chrome.storage.sync.get(function (datas) {

  var currentInfo
  if (datas.timeHistory[0]) {
    datas.timeHistory.forEach(data => {
      if(data.tabId === datas.currentTabId) {
        currentInfo = {
          title: data.title,
          url: data.url
        }
      }
    })
    datas.totalTime.forEach(data => {
      if(data.url === currentInfo.url) {
        currentInfo = {...currentInfo,
          current: (data.totalTimeConsume + current - datas.currentTabTime)
        }
      }
    })
    document.querySelector('#current').innerText = currentInfo.title + " " + currentInfo.current + " SEC" + "///////"
  }


  datas.timeEnded.map((data, idx) => {
    if (idx < 10) {
      var newDiv = document.createElement('div')
      var objectDiv = document.querySelector('#usage')
      var timeUsage
      objectDiv.insertBefore(newDiv, objectDiv.firstChild)
      if (data.timeCal < 60) {
        timeUsage = data.timeCal + ' sec'
      } else if (data.timeCal >= 60 && data.timeCal < 3600) {
        timeUsage = Math.floor((data.timeCal)/60) + ' min'
      } else if (data.timeCal >= 3600 && data.timeCal < 86400) {
        timeUsage = Math.floor((data.timeCal)/3600) + ' hrs' + Math.floor(((data.timeCal) % 3600)/60) + 'min'
      }

      newDiv.appendChild(document.createTextNode(idx+1))
      newDiv.appendChild(document.createTextNode(data.title))
      newDiv.appendChild(document.createTextNode(data.url + " /"))
      newDiv.appendChild(document.createTextNode(data.time + " " + dateString + " /"))
      newDiv.appendChild(document.createTextNode(timeUsage + " /"))
      // alert(datas.currentTabId)
      // newDiv.appendChild(document.createTextNode(datas.timeEnded[2].time + "///time end data///"))
      // if(data.timeEnd) {
      //   newDiv.appendChild(document.createTextNode(data.timeEnd))
      // } else {
      //   newDiv.appendChild(document.createTextNode("not closed"))
      // }
    }
  })
  datas.totalTime.map((data, idx) => {
    var newDiv = document.createElement('div')
    var objectDiv = document.querySelector('#list')
    objectDiv.insertBefore(newDiv, objectDiv.firstChild)
    newDiv.appendChild(document.createTextNode(idx+1))
    newDiv.appendChild(document.createTextNode(data.url + " /"))
    newDiv.appendChild(document.createTextNode(data.totalTimeConsume + " sec"))
  })
})
