import React from 'react'
import {Link} from 'react-router-dom'

class VizNavBar extends React.Component {
  render() {
    return (
      <ul>
        <li>
          <Link to="/viz/daily">Daily</Link>
        </li>
        <li>
          <Link to="/viz/weekly">Weekly</Link>
        </li>
      </ul>
    )
  }
}

export default VizNavBar
