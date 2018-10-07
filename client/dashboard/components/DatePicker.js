import React from 'react'
import {DateInput} from 'semantic-ui-calendar-react'
import {Form} from 'semantic-ui-react'

export default class DatePicker extends React.Component {
  state = {
    date: ''
  }

  handleChange = (e, {value}) => {
    this.setState({date: value})
    this.props.handleDateChange(value)
  }

  render() {
    return (
      <Form>
        <DateInput
          name="date"
          placeholder="Date"
          value={this.state.date}
          iconPosition="left"
          onChange={this.handleChange}
          dateFormat="MM/DD/YYYY"
        />
      </Form>
    )
  }
}
