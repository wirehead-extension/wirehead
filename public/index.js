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
  datas.timeHistory.forEach(data => {
    if(data.tabId === datas.currentTabId) {
      currentInfo = data.time
    }
  })

  document.querySelector('#current').innerText = currentInfo + "///////"

  datas.timeHistory.map((data, idx) => {
    // if (data.timeEnd > 0) {
    //   alert(data.timeEnd)
    // }
    if (idx < 10) {
      var newDiv = document.createElement('div')
      var objectDiv = document.querySelector('#usage')
      objectDiv.insertBefore(newDiv, objectDiv.firstChild)
      if (current-data.timeCal < 60) {
        timeUsage = current-data.timeCal + ' sec'
      } else if (current-data.timeCal >= 60 && current-data.timeCal < 3600) {
        timeUsage = Math.floor((current-data.timeCal)/60) + ' min'
      } else if (current-data.timeCal >= 3600 && current-data.timeCal < 86400) {
        timeUsage = Math.floor((current-data.timeCal)/3600) + ' hrs' + Math.floor(((current-data.timeCal) % 3600)/60) + 'min'
      }

      newDiv.appendChild(document.createTextNode(idx+1))
      newDiv.appendChild(document.createTextNode(data.url + " /"))
      newDiv.appendChild(document.createTextNode(data.time + " " + dateString + " /"))
      newDiv.appendChild(document.createTextNode(timeUsage))
    }
  })
})
