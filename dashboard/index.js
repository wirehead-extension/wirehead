import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
// import {Router} from 'react-router-dom'
// import history from './history'
// import store from './store'
import Dashboard from './dashboard'

// establishes socket connection
// import './socket'

ReactDOM.render(
  <Provider>
    {/* <Router history={history}> */}
      <Dashboard />
    {/* </Router> */}
  </Provider>,
  document.getElementById('dashboard')
)
