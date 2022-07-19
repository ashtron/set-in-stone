import React, { useContext, useEffect, useState } from "react"
import { PactViewsContext } from "./Dapp"

export function Pacts() {
    const pacts = useContext(PactViewsContext)._pacts
    console.log(pacts)

    return (
        <div>
            <h3>{pacts.toString()}</h3>
        </div>
    )
}