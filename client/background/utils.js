/*global chrome*/

//The meat of the logic
export function dateConverter(newDate) {
  var dateString = ""

  dateString += newDate.getMonth() + 1 + '/'
  dateString += newDate.getDate() + '/'
  dateString += newDate.getFullYear() + ' '
  dateString += newDate.getHours() + ':'
  dateString += newDate.getMinutes() + ':'
  dateString += newDate.getSeconds()

  return dateString
}

export function timeInSecond(newDate) {
  return (
    newDate.getSeconds() +
    newDate.getMinutes() * 60 +
    newDate.getHours() * 3600 +
    newDate.getDate() * 86400
  )
}

//Function for store the data when switch into another window
export function activeTabRecoder(tabId) {
  var newDate = new Date()
  var dateString = dateConverter(newDate)

  var current = timeInSecond(newDate)
  chrome.tabs.get(tabId, function(tab) {
    var url = new URL(tab.url)

    chrome.storage.sync.set({
      currentTabId: tab.id,
      currentTabTime: current,
      currentTabOpen: dateString,
      currentTabUrl: url.hostname,
      currentTabTitle: tab.title,
    })
  })
}

export function timeCalculator(time) {
  var timeUsage
  if (time < 60) {
    timeUsage = Math.floor(time) + ' sec'
  } else if (time >= 60 && time < 3600) {
    timeUsage = Math.floor(time / 60) + ' min'
  } else if (time >= 3600 && time < 86400) {
    timeUsage =
      Math.floor(time / 3600) + ' hrs' + Math.floor((time % 3600) / 60) + 'min'
  }
  return timeUsage
}
