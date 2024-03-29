import React, { useContext } from "react"
import styled from "styled-components"

import "bulma/css/bulma.min.css"
import { Navbar, Card, Content, Button } from "react-bulma-components"
import { Link } from "react-router-dom"

import { PactViewsContext } from "./Dapp"

const StyledLink = styled(Link)`
    color: #F8F0E3;
    &:hover {
        color: #f8f8ff;
        text-decoration: underline;
    }
`

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
                        <StyledLink to="/">Home</StyledLink>
                    </Navbar.Item>

                    <Navbar.Item renderAs="div">
                        <StyledLink to="/pacts">My Pacts</StyledLink>
                    </Navbar.Item>

                    <Navbar.Item renderAs="div">
                        <StyledLink to="/pacts/new">Create a Pact</StyledLink>
                    </Navbar.Item>
                </Navbar.Container>

                <Navbar.Container align="right">
                    <Navbar.Item renderAs="div">
                        <div>
                            Connected: { selectedAddress }
                        </div>
                    </Navbar.Item>
                </Navbar.Container>
            </Navbar.Menu>
        </Navbar>
    )
}