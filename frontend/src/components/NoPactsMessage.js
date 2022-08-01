import React from "react"
import styled from "styled-components"

import { Link } from "react-router-dom"
import { Button } from "react-bulma-components"

const StyledButton = styled(Button)`
    background-color: #feef6d;
    color: #313639;
    outline: none;
    border: 0;
`

const StyledLink = styled(Link)`
    color: #313639;
`

export function NoPactsMessage() {
    return (
        <div>
            <h3>You haven't made any pacts yet!</h3>
            
            <StyledButton style={{ marginTop: "1rem" }}>
                <StyledLink to="/pacts/new">Create a Pact</StyledLink>
            </StyledButton>
        </div>
    )
}
