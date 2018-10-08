/*global chrome*/

//The meat of the logic
export function dateConverter(newDate) {
  var dateString = ''

  dateString += newDate.getMonth() + 1 + '/'
  dateString += newDate.getDate() + '/'
  dateString += newDate.getFullYear() + ' '
  dateString += newDate.getHours() + ':'
  dateString += newDate.getMinutes() + ':'
  dateString += newDate.getSeconds()

  return dateString
}

export function timeCalculator(times) {
  var time = times / 1000
  var timeUsage
  if (time < 60) {
    timeUsage = Math.floor(time) + ' sec'
  } else if (time >= 60 && time < 3600) {
    timeUsage = Math.floor(time / 60) + ' min'
  } else if (time >= 3600 && time < 86400) {
    timeUsage =
      Math.floor(time / 3600) + ' hr ' + Math.floor((time % 3600) / 60) + 'min'
  }
  return timeUsage
}

export function currentTimeCalculator(times) {
  var time = times/1000
  var smallUsage = ''
  var hugeUsage = ''
  if (time < 60) {
    Math.floor(time) < 10 ? smallUsage = '0' + Math.floor(time) + ' sec' : smallUsage = Math.floor(time) + ' sec'
  } else if (time >= 60 && time < 3600) {
    Math.floor(time / 60) < 10 ? hugeUsage = '00:0' + Math.floor(time / 60) : hugeUsage = '00:' + Math.floor(time / 60)
  } else if (time >= 3600 && time < 86400) {
    if (Math.floor(time / 3600) < 10) {
      hugeUsage += '0' + Math.floor(time / 3600) + ':'
    } else {
      hugeUsage += Math.floor(time / 3600) + ':'
    }
    if (Math.floor((time % 3600) / 60) < 10) {
      hugeUsage += '0' + Math.floor((time % 3600) / 60)
    } else {
      hugeUsage += Math.floor((time % 3600) / 60)
    }
  }
  return smallUsage || hugeUsage
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

//
