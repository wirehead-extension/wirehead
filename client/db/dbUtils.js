const msInDay = 24 * 60 * 60000

//function can accept date objects, ms, or (for end date) number of days
function makeDateRange(startDate, endDate) {
  if (typeof startDate === 'number') {
    startDate = new Date(startDate).setHours(0, 0, 0, 0)
  }

  startDate = startDate.valueOf()

  if (typeof endDate === 'object') {
    endDate = endDate.valueOf()
  }
  if (endDate < 365) {
    endDate = startDate + endDate * msInDay
  }
  return [startDate, endDate]
}

//takes in date params and returns a Collection
export function getHistoryRange(db, startDate, endDate) {
  return db.history
    .where('timeStart')
    .between(...makeDateRange(startDate, endDate))
}

//takes in a Collection and params and returns an Array
export async function getDataPage(historyCollection, key, limit, page) {
  const historyArray = await historyCollection.sortBy(key)
  return historyArray.slice((page - 1) * limit, page * limit)
}

//takes a collection and returns an array of objects with keys {url, work, play}
export async function sumBySite(db, startDate, endDate) {
  const historyCollection = getHistoryRange(db, startDate, endDate)
  return sumCollectionBySite(await historyCollection.toArray())
}

function sumCollectionBySite(array) {
  const sitesObject = {}
  array.forEach(s => addOrInc(sitesObject, s.url, s.label, s.timeTotal))
  const allSites = Object.keys(sitesObject)
  return allSites.map(s => ({
    url: s,
    work: sitesObject[s].work,
    play: sitesObject[s].play,
    uncategorized: sitesObject[s].uncategorized
  }))
}

export function topFive(db, startDate, endDate) {
  const array = sumBySite(db, startDate, endDate)
  return array
    .sort(function(a, b) {
      return (
        b.work + b.play + b.uncategorized - a.work - a.play - a.uncategorized
      )
    })
    .slice(0, 5)
}

export async function splitByPeriod(db, period, startDate, endDate) {
  const sitesArray = await getHistoryRange(db, startDate, endDate).toArray()
  endDate = makeDateRange(startDate, endDate)[1]
  let msInPeriod = await getHistoryRange
  const datesSummary = []
  if (period === 'day') msInPeriod = msInDay
  else if (period === 'week') msInPeriod = msInDay * 7
  for (let i = startDate; i < endDate; i += msInPeriod) {
    const periodSummary = await sumCollectionBySite(
      sitesArray.filter(
        item => item.timeStart >= i && item.timeStart < i + msInPeriod
      )
    )
    datesSummary.push({start: i, summary: periodSummary})
  }
  return datesSummary
}

//adds a new site to summary, or increments time on an existing url
function addOrInc(sitesObject, url, label, timeTotal) {
  let work = 0
  let play = 0
  let uncategorized = 0
  label
    ? label === 'work'
      ? (work = timeTotal)
      : (play = timeTotal)
    : (uncategorized = timeTotal)
  if (!sitesObject[url]) sitesObject[url] = {work, play, uncategorized}
  else
    sitesObject[url] = {
      work: sitesObject[url].work + work,
      play: sitesObject[url].play + play,
      uncategorized: sitesObject[url].uncategorized + uncategorized
    }
  return sitesObject
}
