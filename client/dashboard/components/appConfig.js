import React from 'react'
// import {connect} from 'react-redux'
import {
  Header,
  Container,
  Form,
  Divider,
  Button,
  Radio
} from 'semantic-ui-react'
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

  handleSubmit = async event => {
    event.preventDefault()
    await updateOptions(this.state)
    //dispatch signal to chrome runtime!!!!
    // chrome.runtime.sendMessage('lorem ipsum dolor sit amet')
    // console.log('I guess nothing went wrong?')
  }

  handleChangePopups = (e, {value}) =>
    this.setState({allowTrainingPopups: value})
  handleChangeShaming = (e, {value}) => this.setState({allowShaming: value})

  render() {
    console.log(this.state)
    let allowTrainingPopups = this.state.allowTrainingPopups
    let allowShaming = this.state.allowShaming
    return (
      <Container>
        <Header as="h2">Options</Header>
        <Divider hidden />
        <Form onSubmit={this.handleSubmit}>
          <Form.Group grouped>
            Can Wirehead shame you with occasional notifications if you're
            wasting time?
            <Form.Field
              label="Yes"
              control={Radio}
              type="radio"
              value={true}
              checked={allowShaming === true}
              onChange={this.handleChangeShaming}
            />
            <Form.Field
              label="No"
              control={Radio}
              type="radio"
              value={false}
              checked={allowShaming === false}
              onChange={this.handleChangeShaming}
            />
          </Form.Group>
          <Form.Group grouped>
            Can the Wirehead AI prompt you to train it?
            <Form.Field
              label="Yes"
              control={Radio}
              type="radio"
              value={true}
              checked={allowTrainingPopups === true}
              onChange={this.handleChangePopups}
            />
            <Form.Field
              label="No (not recommended for new users!)"
              control={Radio}
              type="radio"
              value={false}
              checked={allowTrainingPopups === false}
              onChange={this.handleChangePopups}
            />
          </Form.Group>
          <Button type="submit">Update</Button>
        </Form>
      </Container>
    )
  }
}

export default AppConfig
