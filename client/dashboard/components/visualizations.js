import React from 'react'
import {Route, Switch, withRouter} from 'react-router-dom'
import {Daily, Weekly, VizNavBar} from './index'

class Visualizations extends React.Component {
  render() {
    return (
      <div>
        <VizNavBar />
        <Switch>
          <Route path="/viz/daily" component={Daily} />
          <Route path="/viz/weekly" component={Weekly} />
        </Switch>
      </div>
    )
  }
}

// export default connect(mapStateToProps)(Visualizations)
export default withRouter(Visualizations)
