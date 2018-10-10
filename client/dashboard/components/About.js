import React from 'react'
import {Container, Divider, Header} from 'semantic-ui-react'

const About = () => {
  return (
    <Container text>
      <Header as="h1">Welcome to Wirehead</Header>
      <Divider />
      <p>
        Wirehead is smart, but it's only as smart as you teach it to be.
        Everybody is different: you may be a journalist, in which case you're
        probably working when you visit the New York Times; we're developers,
        which means we probably should be spending more time on Github. This
        means we have to bother you.
      </p>
      <p>
        After you first download Wirehead, you'll be seeing a lot of
        notifications, asking you whether you're working right now.
        <em> Don't worry!</em>
        Pretty soon, our AI will learn your ways, and then we'll only have to
        bother you every once in a while. We'll never stop bothering you
        completely, because Wirehead's motto is to always be learning, always be
        improving.
      </p>
      <p>
        Now visit a real webpage and take a look at the Wirehead icon! Is it
        gray? That means you haven't given our model anything to work with. Make
        sure to respond to some popups soon. Is it green? That means Wirehead
        thinks you're working right now. It might be wrong! If it's wrong, click
        on the popup and let it know. Is it red? That means Wirehead thinks
        you're wasting time. Wirehead is never 100% confident in its
        predictions, but it can get close. Wirehead will tell you how confident
        it is - check the percentage under the icon.
      </p>
    </Container>
  )
}

export default About
