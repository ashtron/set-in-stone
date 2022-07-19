import React, { useContext, useEffect, useState } from "react"
import { PactViewsContext } from "./Dapp"

export function Pacts() {
    const pacts = useContext(PactViewsContext)._pacts
    const pactComponents = pacts.map(pact => {
        return (
            <h3>{pact.description} I: {pact.initiator} T: {pact.taker} Confirmed? { pact.status === 1 ? "yes" : "no" }</h3>
        )
    })

    return (
        <div>
            {pactComponents}
        </div>
    )
}