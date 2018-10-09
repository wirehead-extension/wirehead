import React from 'react'
import {DateInput} from 'semantic-ui-calendar-react'
import {Form} from 'semantic-ui-react'
import moment from 'moment'

export default class DatePicker extends React.Component {
  state = {
    date: ''
  }

  componentDidMount() {
    this.setState({date: moment().format('DD-MM-YYYY')})
  }

  handleChange = (e, {value}) => {
    this.setState({date: value})
    this.props.handleDateChange(value)
  }

  render() {
    return (
      <Form>
        <DateInput
          inline
          name="date"
          value={this.state.date}
          onChange={this.handleChange}
        />
      </Form>
    )
  }
}
