import React from 'react'
import {DatesRangeInput} from 'semantic-ui-calendar-react'
import {Form} from 'semantic-ui-react'
import moment from 'moment'

export default class DateRangePicker extends React.Component {
  state = {
    datesRange: ''
  }

  componentDidMount() {
    this.setState({
      datesRange: `${moment()
        .subtract(8, 'days')
        .format('MM/DD/YYYY')} - ${moment()
        .subtract(1, 'days')
        .format('MM/DD/YYYY')}`
    })
  }

  handleChange = (e, {value}) => {
    this.setState({datesRange: value})
    if (value.split(' - ')[1]) this.props.handleDatesRangeChange(value)
  }

  render() {
    return (
      <Form>
        <DatesRangeInput
          closable
          name="date"
          value={this.state.datesRange}
          onChange={this.handleChange}
          dateFormat="MM/DD/YYYY"
          maxDate={moment().format('MM/DD/YYYY')}
        />
      </Form>
    )
  }
}
