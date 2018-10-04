import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

class VizNavBar extends React.Component {

    render(){
        console.log('vizbars props', this.props)
        if(this.props.location.pathname === '/'){
        return (
            <ul>
                <li>
                    <p>Daily</p>
                </li>
                <li>
                    <Link to="/weekly">Weekly</Link>
                </li>
            </ul>
        )} else if(this.props.location.pathname === '/weekly'){
            return (
                <ul>
                    <li>
                        <Link to="/">Daily</Link>
                    </li>
                    <li>
                        <p>Weekly</p>
                    </li>
                </ul>
            )}
    }
}

export default connect(null)(VizNavBar)
