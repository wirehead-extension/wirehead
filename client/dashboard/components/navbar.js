import React from 'react'
import {Link} from 'react-router-dom'
import {Menu} from 'semantic-ui-react'
import {VizNavBar} from './'

class Navbar extends React.Component {
  render() {
    return (
      <Menu attached="top" stackable>
        <Menu.Header as="h1">Wirehead</Menu.Header>
        <Menu.Menu position="right">
          <Menu.Item as={Link} to="/about">
            About
          </Menu.Item>
          <Menu.Item as={Link} to="/options">
            Options
          </Menu.Item>
          <VizNavBar />
        </Menu.Menu>
      </Menu>
    )
  }
}

export default Navbar
