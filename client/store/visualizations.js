import db from './db'

/**
 * ACTION TYPES
 */

const GOT_DATA = 'GOT_DATA'

/**
 * INITIAL STATE
 */
const initialState = {}

/**
 * ACTION CREATORS
 */

const gotData = data => ({type: GOT_DATA, data})

/**
 * THUNK CREATORS
 */

export const fetchData = (periodStart, periodEnd, preprocessingParameter) => {
  return async dispatch => {
    const data = await db.history
      .where('periodStart')
      .inAnyRange([periodStart, periodEnd])
    if (preprocessingParameter === 'sumBySite') {
      const sites = {}
      data.each(site => {
        if (!sites[site]) {
          sites[site] = {}
          sites[site][site.label] = site.timeTotal
        } else {
          sites[site][site.label]
            ? (sites[site][site.label] += site.timeTotal)
            : (sites[site][site.label] = site.timeTotal)
        }
      })
      dispatch(gotData(sites))
    } else if (preprocessingParameter === 'detail') {
      dispatch(gotData(data))
    }
  }
}

/**
 * REDUCER
 */
export default function(state = initialState, action) {
  switch (action.type) {
    case GOT_DATA:
      return action.data
    default:
      return state
  }
}
