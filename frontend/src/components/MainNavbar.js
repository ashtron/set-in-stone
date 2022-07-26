import React, { useContext } from "react"

import "bulma/css/bulma.min.css"
import { Navbar, Card, Content, Button } from "react-bulma-components"
import { Link } from "react-router-dom"

import { PactViewsContext } from "./Dapp"

export function MainNavbar() {
    const selectedAddress = useContext(PactViewsContext).selectedAddress

    return (
        <Navbar>
            <Navbar.Brand>
                <Navbar.Item>
                    <img src="https://cdn1.iconfinder.com/data/icons/10-000-bc-flat-stone-age/512/stone_tablet-512.png" alt="logo" />
                </Navbar.Item>
            </Navbar.Brand>

            <Navbar.Menu>
                <Navbar.Container>
                    <Navbar.Item renderAs="div">
                        <Link to="/">Home</Link>
                    </Navbar.Item>

                    <Navbar.Item renderAs="div">
                        <Link to="/pacts">My Pacts</Link>
                    </Navbar.Item>

                    <Navbar.Item renderAs="div">
                        <Link to="/pacts/new">Create a Pact</Link>
                    </Navbar.Item>
                </Navbar.Container>

                <Navbar.Container align="right">
                    <Navbar.Item>
                        Connected: { selectedAddress }
                    </Navbar.Item>
                </Navbar.Container>
            </Navbar.Menu>
        </Navbar>
    )
}