//Prompts user to learn more about app if there's no model
function makeLearnMoreNotification() {
  chrome.notifications.create('dashboard.html#about', {
    type: 'basic',
    title: 'Thanks for downloading Wirehead!',
    iconUrl: 'gray.png',
    message:
      "Click here to more about our app! (You'll keep getting these notifications until you give our AI some training data to work with!)",
    requireInteraction: true
  })

  chrome.notifications.onClicked.addListener(function handleClick(
    notificationId
  ) {
    chrome.tabs.create({url: notificationId})
    chrome.notifications.onButtonClicked.removeListener(handleClick)
  })
}

export function initLearnMoreNotification(tab) {
  if (tab) makeLearnMoreNotification()
}
