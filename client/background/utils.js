/*global chrome*/

//The meat of the logic
export function dateConverter(newDate) {
  var dateString = ''
  var am = ''

  dateString += newDate.getMonth() + 1 + '/'
  dateString += newDate.getDate() + '/'
  dateString += newDate.getFullYear() + ' '
  if (newDate.getHours() < 13) {
    dateString += newDate.getHours() + ':'
    am = ' AM'
  } else {
    dateString += (newDate.getHours() - 12) + ':'
    am = ' PM'
  }
  dateString += newDate.getMinutes() + ':'
  if (newDate.getSeconds() < 10) {
    dateString += '0' + newDate.getSeconds() + am
  } else {
    dateString += newDate.getSeconds() + am
  }

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
      Math.floor(time / 3600) + ' hr ' + Math.floor((time % 3600) / 60) + ' min'
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

export function urlValidation(url) {
  if ((url.protocol === 'http:' || url.protocol === 'https:') && !url.href.startsWith('http://localhost:')) {
    return true
  } else {
    return false
  }
}

export function titleCutter(title) {
  if (title.length > 19) {
    return title.slice(0,19) + '...'
  } else {
    return title
  }
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
