import React from 'react'
import {Route, Switch} from 'react-router-dom'
import {Daily, Weekly, VizNavBar} from './index'
import { connect } from 'react-redux'
import * as d3 from 'd3'
import { tsv, csv, json } from 'd3-fetch'
// import dataSet from './data.tsv'


const dataSet = require('dsv-loader!./data.tsv')

class Visualizations extends React.Component {

    render(){
        return (
            <div>
                <Route path="/" component={VizNavBar} />
                <Switch>
                    <Route exact path="/" component={Daily} />
                    <Route path="/weekly" component={Weekly} />
                </Switch>
            </div>
        )
    }
}

// export default connect(mapStateToProps)(Visualizations)
export default Visualizations