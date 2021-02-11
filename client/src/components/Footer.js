import React from 'react';
import { Segment, Container, Grid, List, Header } from 'semantic-ui-react'

const Footer = () => {
    return ( 
        <Segment id="footer" inverted vertical style={{ padding: '5em 0em' }}>
      <Container>
        <Grid divided inverted stackable>
          <Grid.Row>
            <Grid.Column width={3}>
              <Header inverted as='h4' content='About' />
              <List link inverted>
                <List.Item as='a'>Sitemap</List.Item>
                <List.Item as='a'>Contact Us</List.Item>
                <List.Item as='a'>Business</List.Item>
                <List.Item as='a'>Institutional</List.Item>
              </List>
            </Grid.Column>
            <Grid.Column width={3}>
              <Header inverted as='h4' content='Services' />
              <List link inverted>
                <List.Item as='a'>Credit Card</List.Item>
                <List.Item as='a'>Mortgage</List.Item>
                <List.Item as='a'>Loan</List.Item>
                <List.Item as='a'>Kiwi Saver</List.Item>
              </List>
            </Grid.Column>
            <Grid.Column width={7}>
              <Header as='h4' inverted>
                Terms & Conditions
              </Header>
              <p>
                Copyright ©2021 KuickPay all right reserved
              </p>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </Segment>
     );
}
 
export default Footer;