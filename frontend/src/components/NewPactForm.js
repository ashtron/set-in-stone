import React from "react"
import "bulma/css/bulma.min.css"
import { Hero, Container, Box, Button, Field, Label, Form } from "react-bulma-components"

export function NewPactForm() {
    return (
        <div>
            <Hero size="fullheight">
                <Hero.Body textAlign="center">
                    <Container>
                        <Box>
                            <Form.Field>
                                <Form.Label>Description</Form.Label>
                                <Form.Control>
                                    <Form.Input type="text" placeholder="We solemnly swear that..." />
                                </Form.Control>
                            </Form.Field>

                            <Form.Field>
                                <Form.Label>Taker Address</Form.Label>
                                <Form.Control>
                                    <Form.Input type="text" placeholder="0x9bEa9..." />
                                </Form.Control>
                            </Form.Field>

                            <Button color="grey-light">Submit</Button>
                        </Box>
                    </Container>
                </Hero.Body>
            </Hero>
        </div>
    )
}