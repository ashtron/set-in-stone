import React, { useContext } from "react"
import styled from "styled-components"
import { useParams, Link } from "react-router-dom"
import "bulma/css/bulma.min.css"

import { PactViewsContext } from "./Dapp"
import { Card, Content, Button } from "react-bulma-components"

const AcceptButton = styled(Button)`
    background-color: #feef6d;
    color: #313639;
    outline: none;
    border: 0;
    margin-right: 12px;
`

const RejectButton = styled(Button)`
    background-color: #ec7b24;
    color: #f8f8ff;
    outline: none;
    border: 0;

    &:hover { color: #f8f8ff }
`

const StyledLink = styled(Link)`
    color: #313639;
`

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
                        <AcceptButton onClick={() => { confirmPact(id) }}>Accept Pact</AcceptButton>
                        <RejectButton onClick={() => { rejectPact(id) }}>Reject Pact</RejectButton>
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
                <Card.Header.Title><StyledLink to="/pacts">Back</StyledLink></Card.Header.Title>
                <Card.Header.Icon style={{ fontWeight: "bold", cursor: "auto" }}>{id}</Card.Header.Icon>
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