import * as d3 from 'd3-format'
import moment from 'moment'

export const humanTime = ms => {
  const min = ms / 60000
  const hr = min / 60
  const day = hr / 24
  const p = d3.precisionFixed(0.1)
  const f = d3.format('.' + p + 'f')
  if (min < 1) {
    return '<1 min'
  } else if (min < 60) {
    return `${Math.round(min)} min${Math.round(min) > 1 ? 's' : ''}`
  } else if (hr < 24) {
    return `${Math.floor(hr)} hr${Math.floor(hr) > 1 ? 's' : ''} ${Math.round(
      min % 60
    )} min${Math.round(min % 60) > 1 ? 's' : ''}`
  } else {
    return `${Math.floor(day)} day${Math.floor(day) > 1 ? 's' : ''} ${f(
      hr % 24
    )} hr${f(hr % 24) === '1.0' ? '' : 's'}`
  }
}

export const eightDaysAgo = () => {
  return new Date(
    moment()
      .subtract(8, 'days')
      .hours(0)
      .minutes(0)
      .seconds(0)
  ).valueOf()
}

export const parseDateRange = dates => {
  const [begin, end] = dates.split(' - ')
  return [
    new Date(moment(begin, 'MM/DD/YYYY')).valueOf(),
    new Date(moment(end, 'MM/DD/YYYY')).valueOf()
  ]
}
