import React, { useState, useContext } from "react"
import { PactViewsContext } from "./Dapp"

import "bulma/css/bulma.min.css"
import { Button, Field, Label, Form } from "react-bulma-components"

export function NewPactForm() {
    const createPact = useContext(PactViewsContext).createPact

    const [description, setDescription] = useState("")
    const [address, setAddress] = useState("")

    function handleDescriptionChange(event) {
        setDescription(event.target.value)
    }

    function handleAddressChange(event) {
        setAddress(event.target.value)
    }

    return (
        <div>
            <Form.Field>
                <Form.Label>Description</Form.Label>
                <Form.Control>
                    <Form.Input
                        type="text"
                        placeholder="We solemnly swear that..."
                        onChange={handleDescriptionChange}
                    />
                </Form.Control>
            </Form.Field>

            <Form.Field>
                <Form.Label>Taker Address</Form.Label>
                <Form.Control>
                    <Form.Input
                        type="text"
                        placeholder="0x9bEa9..."
                        onChange={handleAddressChange}
                    />
                </Form.Control>
            </Form.Field>

            <Button color="primary" onClick={() => {
                createPact(description, address)
            }}>Submit</Button>
        </div>
    )
}