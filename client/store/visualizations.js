/**
 * ACTION TYPES
 */

/**
 * INITIAL STATE
 */
const initialState = {
  data: [
    {
      url: 'Amazon',
      timeStart: new Date('2018-10-03T08:24:00'),
      timeEnd: new Date('2018-10-03T08:34:00'),
      timeTotal: 600,
      label: 'play'
    },
    {
      url: 'Youtube',
      timeStart: new Date('2018-10-03T08:34:00'),
      timeEnd: new Date('2018-10-03T09:00:00'),
      timeTotal: 1560,
      label: 'play'
    },
    {
      url: 'Twitch',
      timeStart: new Date('2018-10-03T09:20:00'),
      timeEnd: new Date('2018-10-03T10:20:00'),
      timeTotal: 3600,
      label: 'play'
    },
    {
      url: 'Github',
      timeStart: new Date('2018-10-03T10:30:00'),
      timeEnd: new Date('2018-10-03T10:45:00'),
      timeTotal: 900,
      label: 'work'
    },
    {
      url: 'Medium',
      timeStart: new Date('2018-10-03T10:45:00'),
      timeEnd: new Date('2018-10-03T11:10:00'),
      timeTotal: 1500,
      label: 'work'
    },
    {
      url: 'Twitter',
      timeStart: new Date('2018-10-03T11:10:00'),
      timeEnd: new Date('2018-10-03T11:20:00'),
      timeTotal: 600,
      label: 'play'
    },
    {
      url: 'MDN',
      timeStart: new Date('2018-10-03T11:20:00'),
      timeEnd: new Date('2018-10-03T12:20:00'),
      timeTotal: 3600,
      label: 'work'
    },
    {
      url: 'Stack Overflow',
      timeStart: new Date('2018-10-03T12:30:00'),
      timeEnd: new Date('2018-10-03T12:40:00'),
      timeTotal: 600,
      label: 'work'
    },
    {
      url: 'Reddit',
      timeStart: new Date('2018-10-03T13:40:00'),
      timeEnd: new Date('2018-10-03T14:00:00'),
      timeTotal: 1200,
      label: 'play'
    },
    {
      url: 'Misc',
      timeStart: new Date('2018-10-03T14:00:00'),
      timeEnd: new Date('2018-10-03T14:05:00'),
      timeTotal: 300,
      label: 'play'
    },
    {
      url: 'Hackernoon',
      timeStart: new Date('2018-10-03T14:45:00'),
      timeEnd: new Date('2018-10-03T15:05:00'),
      timeTotal: 1200,
      label: 'work'
    },
    {
      url: 'Misc',
      timeStart: new Date('2018-10-03T15:05:00'),
      timeEnd: new Date('2018-10-03T15:05:40'),
      timeTotal: 2400,
      label: 'Work'
    }
  ]
}

/**
 * ACTION CREATORS
 */

/**
 * THUNK CREATORS
 */

/**
 * REDUCER
 */
export default function(state = initialState, action) {
  switch (action.type) {
    default:
      return state
  }
}
