/* global chrome */
//Prompts user to learn more about app if there's no model
//Once you click in a session, it will take you to the about page
//Then you won't get the notifications anymore until the next session

export function makeLearnMoreNotification(clickedAlready) {
  if (!clickedAlready) {
    chrome.notifications.create('dashboard.html#about', {
      type: 'basic',
      title: 'Thanks for downloading Wirehead!',
      iconUrl: 'gray.png',
      message: 'Click here to learn more about our app!'
    })
  }
}
