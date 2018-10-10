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
      trainingPopupFrequency: null,
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
    await this.setState({
      trainingPopupFrequency: null,
      allowShaming: null
    })
  }

  handleChangePopups = (e, {value}) =>
    this.setState({trainingPopupFrequency: value})
  handleChangeShaming = (e, {value}) => this.setState({allowShaming: value})

  render() {
    let trainingPopupFrequency = this.state.trainingPopupFrequency
    let allowShaming = this.state.allowShaming
    return (
      <Container text>
        {/* Don't render after submit */}
        {allowShaming !== null && trainingPopupFrequency !== null ? (
          <Container>
            <Header as="h2">Options</Header>
            <Divider />
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
              <Divider />
              <Form.Group grouped>
                Can the Wirehead AI prompt you to train it?
                <Form.Field
                  label="Yes"
                  control={Radio}
                  type="radio"
                  value="normal"
                  checked={trainingPopupFrequency === 'normal'}
                  onChange={this.handleChangePopups}
                />
                <Form.Field
                  label="Occasionally"
                  control={Radio}
                  type="radio"
                  value="low"
                  checked={trainingPopupFrequency === 'low'}
                  onChange={this.handleChangePopups}
                />
                <Form.Field
                  label="No (not recommended for new users!)"
                  control={Radio}
                  type="radio"
                  value="never"
                  checked={trainingPopupFrequency === 'never'}
                  onChange={this.handleChangePopups}
                />
              </Form.Group>
              <Divider />
              <Button type="submit">Update</Button>
            </Form>
          </Container>
        ) : (
          <p>Options updated </p>
        )}
      </Container>
    )
  }
}

export default AppConfig
