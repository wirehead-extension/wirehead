chrome.storage.sync.set({
  timeHistory:[]
})

chrome.tabs.onActivated.addListener(
  function(activeInfo) {
    var newDate = new Date();

    var dateString = "Today's date is: ";

    dateString += (newDate.getMonth() + 1) + "/";
    dateString += newDate.getDate() + "/";
    dateString += newDate.getFullYear() + " ";
    dateString += newDate.getHours() + ":";
    dateString += newDate.getMinutes() + ":";
    dateString += newDate.getSeconds();

    var current = newDate.getSeconds() + newDate.getMinutes() * 60 + newDate.getHours() * 3600 + newDate.getDate() * 86400

    chrome.tabs.get(activeInfo.tabId, function(tab) {
      var mainUrl = ""
      if(tab.url.indexOf(".com") > -1) {
        mainUrl = tab.url.slice(0, tab.url.indexOf(".com") + 4)
      } else if(tab.url.indexOf(".org") > -1) {
        mainUrl = tab.url.slice(0, tab.url.indexOf(".org") + 4)
      } else if(tab.url.indexOf(".io") > -1) {
        mainUrl = tab.url.slice(0, tab.url.indexOf(".io") + 3)
      } else if(tab.url.indexOf(".net") > -1) {
        mainUrl = tab.url.slice(0, tab.url.indexOf(".net") + 4)
      } else {
        mainUrl = tab.url
      }
      chrome.storage.sync.get(datas=> {
        chrome.storage.sync.set({
          currentTabId: activeInfo.tabId,
          timeHistory: [
            ...datas.timeHistory, {
              tabId: activeInfo.tabId,
              url: mainUrl,
              time: dateString,
              timeCal: current,
              timeEnd: 0
            }].sort((a,b) => {
              return a.timeCal < b.timeCal
            })
          });
        })
      })
  }
)

chrome.tabs.onRemoved.addListener(
  function(removeInfo) {
    var endDate = new Date();

    var currentEnd = endDate.getSeconds() + endDate.getMinutes() * 60 + endDate.getHours() * 3600 + endDate.getDate() * 86400

    chrome.storage.sync.get(datas => {
      var afterClosedTab = datas.timeHistory.map(data => {
        if (data.tabId === removeInfo) {
          data.timeEnd = (currentEnd - data.timeCal)
          return data
        } else {
          return data
        }
      })
      alert(afterClosedTab[0].timeEnd)
      chrome.storage.sync.set({
        afterClosedTab
      })
    })
  }
)
