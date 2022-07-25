import React, { useContext, useEffect, useState } from "react"
import { PactViewsContext } from "./Dapp"
import { Pact } from "./Pact"

import { Link } from "react-router-dom"

export function Pacts() {
    const pacts = useContext(PactViewsContext)._pacts
    console.log(pacts)

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
            {pactComponents}
        </div>
    )
}