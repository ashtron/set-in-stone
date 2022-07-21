import React, { useContext } from "react"
import { useParams } from "react-router-dom"
import "bulma/css/bulma.min.css"

import { PactViewsContext } from "./Dapp"
import { Card, Content, Button } from "react-bulma-components"

export function Pact() {
    const { id } = useParams()
    const pact = useContext(PactViewsContext)._pacts[id]
    const confirmPact = useContext(PactViewsContext).confirmPact
    console.log(pact)

    return (
        <Card>
            <Card.Header>
                <Card.Header.Title>{id}</Card.Header.Title>
            </Card.Header>
            <Card.Content>
                <Content>
                    {pact.description}
                </Content>
            </Card.Content>
            <Card.Footer>
                <Card.Footer.Item>
                    { pact.status === 0 ? <Button onClick={() => { confirmPact(id) }}>Accept Pact</Button> : "" }
                </Card.Footer.Item>
            </Card.Footer>
        </Card>
    )
}