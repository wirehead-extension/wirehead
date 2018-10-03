/*global chrome*/

//The meat of the logic
//For use when a tab is dis-activated to store the spent time
export function timerEnding(initialTab) {
  var newDate = new Date()
  var current = timeInSecond(newDate)

  var dateString = dateConverter(newDate)

  chrome.storage.sync.get(datas => {
    chrome.tabs.query({active: false}, tabs => {
      tabs.forEach(tab => {
        if (tab.id === datas.currentTabId) {
          var timeInfo
          datas.timeHistory.forEach(data => {
            if (data.tabId === tab.id) {
              timeInfo = data.timeCal
            }
          })

          var mainUrl = urlCutter(tab.url)

          var newValue = {
            id: tab.id,
            title: tab.title,
            url: mainUrl,
            time: dateString,
            timeCal: current - (timeInfo || initialTab)
          }
          chrome.storage.sync.set({
            ...datas,
            timeEnded: [...datas.timeEnded, newValue],
            totalTime: [...datas.totalTime]
          })
          timeAddUp(newValue)
        }
      })
    })
  })
}

// this function works for time add-up for same url in the database
export function timeAddUp(addTime) {
  chrome.storage.sync.get(datas => {
    var calculatedTime = {
      url: addTime.url,
      totalTimeConsume: addTime.timeCal
    }
    datas.totalTime.forEach(data => {
      if (data.url === addTime.url) {
        calculatedTime = {
          url: addTime.url,
          totalTimeConsume: data.totalTimeConsume + addTime.timeCal
        }
      }
    })
    var addedTime = datas.totalTime.filter(data => {
      return data.url !== addTime.url && data.url
    })
    chrome.storage.sync.set({
      timeEnded: [...datas.timeEnded],
      totalTime: [...addedTime, calculatedTime].sort((a, b) => {
        return a.totalTimeConsume > b.totalTimeConsume
      })
    })
  })
}

export function urlCutter(url) {
  var mainUrl = ''
  if (url.indexOf('.com') > -1) {
    mainUrl = url.slice(0, url.indexOf('.com') + 4)
  } else if (url.indexOf('.org') > -1) {
    mainUrl = url.slice(0, url.indexOf('.org') + 4)
  } else if (url.indexOf('.io') > -1) {
    mainUrl = url.slice(0, url.indexOf('.io') + 3)
  } else if (url.indexOf('.net') > -1) {
    mainUrl = url.slice(0, url.indexOf('.net') + 4)
  } else {
    mainUrl = url
  }
  return mainUrl
}

export function dateConverter(newDate) {
  var dateString = "Today's date is: "

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

//Function of store data when re-load the chrome extension
export function currentTabRecoder(tabs) {
  var newDate = new Date()
  console.log(tabs[0])
  chrome.storage.sync.get(datas => {
    chrome.storage.sync.set({
      currentTabId: tabs[0].id,
      currentTabTime: timeInSecond(newDate),
      currentTabOpen: dateConverter(newDate),
      currentTabUrl: urlCutter(tabs[0].url),
      currentTabTitle: tabs[0].title,
      timeHistory: [
        ...datas.timeHistory,
        {
          tabId: tabs[0].id,
          title: tabs[0].title,
          url: urlCutter(tabs[0].url),
          time: dateConverter(newDate),
          timeCal: timeInSecond(newDate)
        }
      ],
      // .sort((a,b) => {
      //   return a.timeCal < b.timeCal
      // }),
      timeEnded: [...datas.timeEnded],
      totalTime: [
        ...datas.totalTime,
        {
          url: urlCutter(tabs[0].url),
          totalTimeConsume: 0
        }
      ]
      // totalTime: [...datas.totalTime]
    })
  })
  timerEnding(timeInSecond(newDate))
}

//Function for store the data when switch into another window
export function activeTabRecoder(tabId) {
  var newDate = new Date()

  var dateString = dateConverter(newDate)

  var current = timeInSecond(newDate)
  chrome.tabs.get(tabId, function(tab) {
    var mainUrl = urlCutter(tab.url)

    chrome.storage.sync.get(datas => {
      // alert("activeTab" + tab.title)
      chrome.storage.sync.set({
        currentTabId: tab.id,
        currentTabTime: current,
        currentTabOpen: dateString,
        currentTabUrl: mainUrl,
        currentTabTitle: tab.title,
        timeHistory: [
          ...datas.timeHistory,
          {
            tabId: tabId,
            title: tab.title,
            url: mainUrl,
            time: dateString,
            timeCal: current
          }
        ],
        timeEnded: [
          ...datas.timeEnded,
          {
            id: tab.id,
            title: tab.title,
            url: mainUrl,
            time: dateString,
            timeCal: current
          }
        ],
        totalTime: [...datas.totalTime]
      })

      timeAddUp({
        id: tab.id,
        title: tab.title,
        url: mainUrl,
        time: dateString,
        timeCal: current
      })
    })
  })
}

//Stuff here is to block websites
// :^)
//Just need to reference the list of sites we're going to block

// chrome.webRequest.onBeforeRequest.addListener(
//   function(details) {
//     return {
//       cancel: blockedSites.some(site => details.url.indexOf(site.name) !== -1)
//     }
//   },
//   {
//     urls: ['<all_urls>']
//   },
//   ['blocking']
// )
