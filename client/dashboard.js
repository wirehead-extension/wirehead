import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {Router} from 'react-router-dom'
import history from './history'
import store from './store'
import App from './app'

<<<<<<< HEAD:client/dashboard.js
=======
// establishes socket connection
// import './socket'
>>>>>>> c7b60d1992f74221cf23ee3b33c660819d6eb247:client/index.js

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById('dashboard')
)
