import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {HashRouter as Router} from 'react-router-dom'
import history from '../history'
import store from '../store'
import App from './app'
import '../semantic/dist/semantic.min.css'

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <div id="bodyWrapper">
        <div id="leftWrapper" />
        <App />
        <div id="rightWrapper" />
      </div>
    </Router>
  </Provider>,
  document.getElementById('app')
)
