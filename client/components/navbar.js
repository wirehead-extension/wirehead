import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

<<<<<<< HEAD
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
=======
const Navbar = ({handleClick, isLoggedIn}) => (
  <div>
    <h1>Wirehead</h1>
    <nav>
      {isLoggedIn ? (
        <div>
          {/* The navbar will show these links after you log in */}
          <Link to="/home">Home</Link>
          <a href="#" onClick={handleClick}>
            Logout
          </a>
        </div>
      ) : (
        <div>
          {/* The navbar will show these links before you log in */}
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
        </div>
      )}
    </nav>
    <hr />
  </div>
)

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    isLoggedIn: !!state.user.id
  }
}

const mapDispatch = dispatch => {
  return {
    handleClick() {
      dispatch(logout())
>>>>>>> c7b60d1992f74221cf23ee3b33c660819d6eb247
    }
}

export default Navbar