/*global chrome */

var dbKey
var ultimateOriginKey

//lets the background know when a page has been started; I think this is only
//useful for debugging
chrome.runtime.sendMessage(
  {
    action: 'tab-start'
  },
  function(res) {
    dbKey = res.dbKey
    ultimateOriginKey = res.ultimateOriginKey
    console.log('response received')
  }
)

//sends the origin when a user visits a site by clicking a link
window.addEventListener('click', function(event) {
  if (event.target.closest('a')) {
    chrome.runtime.sendMessage({
      action: 'follow-link',
      link: event.target.closest('a').href,
      origin: window.location,
      originKey: dbKey,
      ultimateOriginKey
    })
  }
})

//listens for all messages sent by the background scripts
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log('message received from server by page', request)
})
