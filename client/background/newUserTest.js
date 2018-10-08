/* global chrome */
//Prompts user to learn more about app if there's no model
//Once you click in a session, it will take you to the about page
//Then you won't get the notifications anymore until the next session
export function makeLearnMoreNotification(
  clickAboutNotification,
  clickedAlready
) {
  if (!clickedAlready) {
    chrome.notifications.create('dashboard.html#about', {
      type: 'basic',
      title: 'Thanks for downloading Wirehead!',
      iconUrl: 'gray.png',
      message:
        "Click here to more about our app! (You'll keep getting these notifications until you give our AI some training data to work with!)"
    })

    chrome.notifications.onClicked.addListener(function handleClick(
      notificationId
    ) {
      if (notificationId === 'dashboard.html#about') {
        clickAboutNotification()
        chrome.tabs.create({url: notificationId})
      }
      chrome.notifications.onButtonClicked.removeListener(handleClick)
    })
  }
}
