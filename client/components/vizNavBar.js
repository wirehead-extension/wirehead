import React from 'react'
import { Link } from 'react-router-dom'

class VizNavBar extends React.Component {

    render(){
        return (
            <ul>
                <li>
                    <Link to="/">Daily</Link>
                </li>
                <li>
                    <Link to="/weekly">Weekly</Link>
                </li>
            </ul>
        )
    }
}

// export default connect(mapStateToProps)(Visualizations)
export default VizNavBar