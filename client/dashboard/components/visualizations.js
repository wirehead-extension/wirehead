import React from 'react'
import {Route, Switch, withRouter} from 'react-router-dom'
import {Daily, Weekly} from './index'

class Visualizations extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Switch>
          <Route path="/viz/daily" component={Daily} />
          <Route path="/viz/weekly" component={Weekly} />
        </Switch>
      </React.Fragment>
    )
  }
}

// export default connect(mapStateToProps)(Visualizations)
export default withRouter(Visualizations)
