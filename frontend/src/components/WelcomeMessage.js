import React from "react"
import styled from "styled-components"

import { Button } from "react-bulma-components"

import { Link } from "react-router-dom"

const StyledCreatePactButton = styled(Button)`
    background-color: #feef6d;
    color: #313639;
    outline: none;
    border: 0;
    margin-left: 12px;
`

const StyledLink = styled(Link)`
    color: #313639;
`

export function WelcomeMessage() {
    return (
        <div>
            <p>Welcome!</p>

            <div style={{ marginTop: "12px" }}>
                <Button><StyledLink to="/pacts">My Pacts</StyledLink></Button>
                <StyledCreatePactButton><StyledLink to="/pacts/new">New Pact</StyledLink></StyledCreatePactButton>
            </div>
        </div>
    )
}