import React from 'react'
import {Link} from 'react-router-dom'
import {Dropdown} from 'semantic-ui-react'

class VizNavBar extends React.Component {
  render() {
    return (
      <Dropdown item text="Visualizations">
        <Dropdown.Menu>
          <Dropdown.Item as={Link} to="/viz/daily">
            Daily
          </Dropdown.Item>
          <Dropdown.Item as={Link} to="/viz/weekly">
            Weekly
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    )
  }
}

export default VizNavBar
