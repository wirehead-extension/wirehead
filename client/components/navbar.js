import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

class Navbar extends React.Component {
    render(){
        return(
            <ul>
                <li>
                    <Link to="/">Visualizations</Link>
                </li>
                <li>
                    <Link to="/siteconfig">Site Config</Link>
                </li>
                <li>
                    <Link to="/appconfig">App Config</Link>
                </li>
            </ul>
        )
      }
}

export default Navbar