import React from 'react'
import {connect} from 'react-redux'
import {Header, Container, Form, Divider} from 'semantic-ui-react'
import {getOptions, updateOptions} from '../../background/options.js'

class AppConfig extends React.Component {
  constructor() {
    super()
    this.state = {
      allowTrainingPopups: null,
      allowShaming: null
    }
  }

  async componentDidMount() {
    const currentOptions = await getOptions()
    this.setState(currentOptions)
  }

  handleSubmit = event => {
    event.preventDefault()
    updateOptions(this.getState())
    //dispatch signal to chrome runtime!!!!
  }

  handleChange = (e, {value}) => this.setState({value})

  render() {
    console.log(this.state)
    return (
      <Container>
        <Header as="h1">Options</Header>
        <Form onSubmit={this.handleSubmit} onChange={this.handleChange}>
          <Form.Group grouped>
            <Header as="h5">
              Can Wirehead shame you if you're wasting a lot of time?
            </Header>

            <Form.Field
              label="Sure"
              control="input"
              type="radio"
              name="htmlRadios"
              value={true}
            />
            <Form.Field
              label="No"
              control="input"
              type="radio"
              name="htmlRadios"
              value={false}
            />
          </Form.Group>
          <Divider hidden />
          <Form.Group grouped>
            <Header as="h5">Can the Wirehead AI prompt you to train it?</Header>
            <Form.Field
              label="Yes"
              control="input"
              type="radio"
              name="htmlRadios"
              value={true}
            />
            <Form.Field
              label="No (not recommended for new users!)"
              control="input"
              type="radio"
              name="htmlRadios"
              value={false}
            />
          </Form.Group>
          <Button type="submit" />
        </Form>
      </Container>
    )
  }
}

export default AppConfig
