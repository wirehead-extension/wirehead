//get dates from the number below by calling new Date(milliseconds)
const playSites = [
  'facebook.com',
  'instagram.com',
  'nytimes.com',
  'bloomberg.com',
  'vox.com',
  'etsy.com',
  'amazon.com',
  'shoes.com',
  'capitalone.com',
  'chase.com',
  'fivethirtyeight.com',
  'askjeeves.com',
  'imdb.com',
  'people.com',
  'usatoday.com',
  'porsche.com',
  'foxnews.com',
  'cnn.com',
  'yelp.com',
  'theatlantic.com',
  'party.com',
  'twitter.com'
]

const workSites = [
  'code.visualstudio.com/',
  'developer.chrome.com/',
  'developer.mozilla.org/',
  'github.com/',
  'dexie.org/',
  'developer.twitter.com',
  'ubuntuforums.org/',
  'stackoverflow.com',
  'waffle.io/',
  'elm-lang.org/',
  'fullstackacademy.com/'
]

//we only use workWhichSites and playWhichSites below
const playRelativeFrequencies = playSites.map(() =>
  Math.sin(Math.random() * 1.1752011)
)
const workRelativeFrequencies = workSites.map(() =>
  Math.sin(Math.random() * 1.1752011)
)
const totalPlay = playRelativeFrequencies.reduce((a, b) => a + b, 0)
const totalWork = workRelativeFrequencies.reduce((a, b) => a + b, 0)
const playWhichSites = []
const workWhichSites = []
playRelativeFrequencies.map(n => n / totalPlay).reduce((acc, freq) => {
  playWhichSites.push(acc + freq)
  return acc + freq
}, 0)
workRelativeFrequencies.map(n => n / totalWork).reduce((acc, freq) => {
  workWhichSites.push(acc + freq)
  return acc + freq
}, 0)

//probabilities and constants
const workPlaySwitch = (doing, probability) => {
  if (Math.random() < probability) {
    return doing === 'work' ? 'play' : 'work'
  } else return doing
}

const generateTimeOfflineLength = () =>
  Math.sin(Math.random() * 1.1752011) * 60 * 60 * 6 * 1000

const generateTimeOnSiteLength = () =>
  Math.sin(Math.sin(Math.random() * 1.1752011)) * 10 * 60 * 1000 + 500

const date = new Date()
date.setDate(date.getDate() - 367)
const yearStart = date.valueOf() + 5 * 60 * 60 * 1000
const fullDay = 60 * 60 * 24 * 1000
const workingDay = 60 * 60 * 18 * 1000

const doesSessionEnd = () => Math.random() < 0.01

//site name generators
const randomSite = () =>
  (
    (Math.random() + 1)
      .toString(36)
      .substring(Math.floor(Math.random() * 7) + 2)
      .match(/[a-zA-Z]/g) || ['w', 'e', 'b']
  ).join('') + '.com'

const generateWorkSite = () =>
  Math.random() < 0.1
    ? randomSite()
    : workSites[workWhichSites.findIndex(n => n > Math.random())]

const generatePlaySite = () =>
  Math.random() < 0.1
    ? randomSite()
    : playSites[playWhichSites.findIndex(n => n > Math.random())]

const generateSite = doing =>
  doing === 'work' ? generateWorkSite() : generatePlaySite()

const history = []

for (let i = 0; i < 367; i++) {
  const dayStart = yearStart + fullDay * i
  let currentTime = dayStart + generateTimeOfflineLength()
  const workPlaySwitchProbability = Math.sin(Math.random()) * 0.2
  let whatDoing = Math.random() > 0.5 ? 'work' : 'play'
  while (currentTime < dayStart + workingDay) {
    if (doesSessionEnd()) {
      currentTime += generateTimeOfflineLength()
    } else {
      const site = generateSite(whatDoing)
      const endTime = currentTime + generateTimeOnSiteLength()
      const totalTime = endTime - currentTime
      history.push({
        timeStart: currentTime,
        timeEnd: endTime,
        timeTotal: totalTime,
        url: site,
        label: whatDoing
      })
      currentTime = endTime
      whatDoing = workPlaySwitch(whatDoing, workPlaySwitchProbability)
    }
  }
}

export default history
