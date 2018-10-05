import React, {Component} from 'react'
import {Switch, Route, withRouter} from 'react-router-dom'
import {Visualizations, SiteConfig, AppConfig} from './components'

/**
 * COMPONENT
 */
class Routes extends Component {
  render() {
    return (
      <Switch>
        <Route path="/viz/:type" component={Visualizations} />
        <Route path="/siteconfig" component={SiteConfig} />
        <Route path="/appconfig" component={AppConfig} />
      </Switch>
    )
  }
}

export default withRouter(Routes)
