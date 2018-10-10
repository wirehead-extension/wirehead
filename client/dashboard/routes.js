import React, {Component} from 'react'
import {Switch, Route, withRouter} from 'react-router-dom'
import {Visualizations, SiteConfig, AppConfig, About} from './components'

/**
 * COMPONENT
 */
class Routes extends Component {
  render() {
    return (      
      <div id="graphContainer">
        <div id="subLeftWrapper" />
        <div id="subDiv">
          <Switch>
            <Route path="/about" component={About} />
            <Route path="/viz/:type" component={Visualizations} />
            {/* <Route path="/siteconfig" component={SiteConfig} /> */}
            <Route path="/options" component={AppConfig} />
          </Switch>
        </div>
        <div id="subRightWrapper" />
      </div>
    )
  }
}

export default withRouter(Routes)
