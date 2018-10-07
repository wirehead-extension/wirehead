import React from 'react'
import {DateInput} from 'semantic-ui-calendar-react'
import {Form} from 'semantic-ui-react'

export default class DatePicker extends React.Component {
  state = {
    date: ''
  }

  render() {
    return (
      <Form>
        <DateInput
          name="date"
          placeholder="Date"
          value={this.state.date}
          iconPosition="left"
          onChange={this.props.handleChange}
        />
      </Form>
    )
  }
}
