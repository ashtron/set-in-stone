import React from "react"

import { Hero, Container, Button, Card, Content } from "react-bulma-components"

export function ConnectWallet({ connectWallet }) {
  return (
    <Hero size="fullheight">
      <Hero.Body textAlign="center">
        <Container
          breakpoint="desktop"
          max="true"
        >
          <Card>
            <Card.Content>
              <Content>
                  <p>Please connect MetaMask to...</p>
                  <Button onClick={connectWallet}>Connect Wallet</Button>
              </Content>
            </Card.Content>
          </Card>
        </Container>
      </Hero.Body>
    </Hero>
  )
}
