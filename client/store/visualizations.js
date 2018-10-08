import db from '../db'

/**
 * ACTION TYPES
 */

const GOT_DATA = 'GOT_DATA'

/**
 * INITIAL STATE
 */
const initialState = []

/**
 * ACTION CREATORS
 */

const gotData = data => ({type: GOT_DATA, data})

/**
 * THUNK CREATORS
 */

export const fetchData = (periodStart, periodEnd, preprocessingParameter) => {
  return async dispatch => {
    if (preprocessingParameter === 'sumBySite') {
      dispatch(gotData(await db.getTotalSummary(periodStart, periodEnd)))
    } else if (preprocessingParameter === 'sumByDayBySite') {
      dispatch(gotData(await db.getDailySummary(periodStart, periodEnd)))
    } else if (preprocessingParameter === 'detail') {
      dispatch(gotData(await db.getFullHistory(periodStart, periodEnd)))
    } else if (preprocessingParameter === 'sumByWeekBySite') {
      dispatch(gotData(await db.getWeeklySummary(periodStart, periodEnd)))
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
