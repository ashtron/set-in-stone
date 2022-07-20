import React, { useContext } from "react"
import { useParams } from "react-router-dom"
import "bulma/css/bulma.min.css"

import { PactViewsContext } from "./Dapp"
import { Card, Content } from "react-bulma-components"

export function Pact() {
    const { id } = useParams()
    const pact = useContext(PactViewsContext)._pacts[id]

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
        </Card>
    )
}