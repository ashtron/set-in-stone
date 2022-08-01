import React, { useContext, useEffect, useState } from "react"
import styled from "styled-components"

import { PactViewsContext } from "./Dapp"
import { Pact } from "./Pact"
import { NoPactsMessage } from "./NoPactsMessage"

import { Link } from "react-router-dom"
import { Button } from "react-bulma-components"

const StyledLink = styled(Link)`
    color: #313639;
    
    &:hover {
        color: #313639;
        text-decoration: underline;
    }
`

export function Pacts() {
    const pacts = useContext(PactViewsContext)._pacts
    
    const pactComponents = pacts.map(pact => {
        return (
            <h3 key={pact.id}>
                {<StyledLink to={`/pacts/${pact.id.toNumber() - 1}`}>
                    {pact.description}
                </StyledLink>}
            </h3>
        )
    })

    return (
        <div>
            { pactComponents.length === 0 ? <NoPactsMessage /> : pactComponents }
        </div>
    )
}