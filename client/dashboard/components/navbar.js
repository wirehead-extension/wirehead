import React from 'react'
import {Link} from 'react-router-dom'

class Navbar extends React.Component {
  render() {
    return (
      <div>
        <div>
          <Link to="/options">Options</Link>
        </div>
        <div>
          <Link to="/viz/daily">Visualizations</Link>
        </div>
        {/* <li>
          <Link to="/siteconfig">Site Config</Link>
        </li> */}
      </div>
    )
  }
}

export default Navbar
