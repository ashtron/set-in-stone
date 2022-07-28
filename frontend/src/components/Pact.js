import React, { useContext } from "react"
import { useParams } from "react-router-dom"
import "bulma/css/bulma.min.css"

import { PactViewsContext } from "./Dapp"
import { Card, Content, Button } from "react-bulma-components"

export function Pact() {
    const { id } = useParams()
    const pacts = useContext(PactViewsContext)._pacts
    
    const pact = pacts.find(pact => {
        return pact.id.toNumber() === parseInt(id) + 1
    })

    const confirmPact = useContext(PactViewsContext).confirmPact
    const rejectPact = useContext(PactViewsContext).rejectPact
    const selectedAddress = useContext(PactViewsContext).selectedAddress[0].toLowerCase()

    function getFooter() {
        if (pact.status === 0) {
            if (pact.taker.toLowerCase() === selectedAddress.toLowerCase()) {
                return (
                    <div>
                        <Button onClick={() => { confirmPact(id) }}>Accept Pact</Button>
                        <Button onClick={() => { rejectPact(id) }}>Reject Pact</Button>
                    </div>
                )
            } else {
                return "Pending"
            }  
        } else if (pact.status === 1) {
            return "Confirmed"
        } else if (pact.status === 2) {
            return "Rejected"
        }
    }

    return (
        <Card>
            <Card.Header>
                <Card.Header.Title>{id}</Card.Header.Title>
            </Card.Header>
            <Card.Content>
                <Content>
                    <p>
                        {pact.description}
                    </p>
                </Content>
            </Card.Content>
            <Card.Footer>
                <Card.Footer.Item>
                    <p>Initiator: {pact.initiator}</p>
                </Card.Footer.Item>
            </Card.Footer>
            <Card.Footer>
                <Card.Footer.Item>
                    <p>Taker: {pact.taker}</p>
                </Card.Footer.Item>
            </Card.Footer>
            <Card.Footer>
                <Card.Footer.Item>
                    { getFooter() }
                </Card.Footer.Item>
            </Card.Footer>
        </Card>
    )
}