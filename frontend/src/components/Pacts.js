import React, { useContext, useEffect, useState } from "react"
import { PactViewsContext } from "./Dapp"
import { Pact } from "./Pact"

import { Link } from "react-router-dom"
import { Button } from "react-bulma-components"

export function Pacts() {
    const pacts = useContext(PactViewsContext)._pacts

    const noPactsMessage =
        <div>
            <h3>You haven't made any pacts yet!</h3>
            
            <Button style={{ marginTop: "1rem" }}>
                <Link to="/pacts/new">Create a Pact</Link>
            </Button>
        </div>
    
    const pactComponents = pacts.map(pact => {
        return (
            <h3 key={pact.id}>
                {<Link to={`/pacts/${pact.id.toNumber() - 1}`}>
                    {pact.description}
                </Link>}
            </h3>
        )
    })

    return (
        <div>
            { pactComponents.length === 0 ? noPactsMessage : pactComponents }
        </div>
    )
}