/*global chrome */

var random = Math.random()
var dbKey
var sourcePage
var tabId

chrome.runtime.sendMessage({
  action: 'tab-start',
  key: random
})

window.addEventListener('click', function(event) {
  if (event.target.closest('a')) {
    chrome.runtime.sendMessage({
      action: 'follow-link',
      link: event.target.closest('a').href,
      origin: window.location.href,
      originKey: tabId
    })
  }
})

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (
    request.hasOwnProperty('action') &&
    request.action === 'broadcastDbLocation' &&
    request.tabId === window.location.tabId &&
    request.key === random
  ) {
    sendResponse()
    setDbLocation(request.dbLocation)
    return false
  }
})

function setDbLocation(data) {
  dbKey = data.dbKey
  sourcePage = data.sourcePage
}
