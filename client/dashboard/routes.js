import React, {Component} from 'react'
import {Switch, Route} from 'react-router-dom'
import {Visualizations, SiteConfig, AppConfig} from './components'

/**
 * COMPONENT
 */
class Routes extends Component {


  render() {

    return (
      <Switch>
        <Route exact path="/" component={Visualizations}  />
        <Route path="/weekly" component={Visualizations} />
        <Route path="/siteconfig" component={SiteConfig} />
        <Route path="/appconfig" component={AppConfig} />
      </Switch>
    )
  }
}

export default Routes
