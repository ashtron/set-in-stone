import React, { useState, useEffect } from "react"
import { ethers } from "ethers"

import SetInStoneArtifact from "../contracts/SetInStone.json"
import contractAddress from "../contracts/contract-address.json"

import { NoWalletDetected } from "./NoWalletDetected"
import { ConnectWallet } from "./ConnectWallet"
import { MainNavbar } from "./MainNavbar"

import { Hero, Container, Box } from "react-bulma-components"
import { Outlet, Link, Navigate, useLocation } from "react-router-dom"

import "../css/mystyles.css"
import { NoPactsMessage } from "./NoPactsMessage"
import { WelcomeMessage } from "./WelcomeMessage"

const HARDHAT_NETWORK_ID = "1337"
const ERROR_CODE_TX_REJECTED_BY_USER = 4001

export const PactViewsContext = React.createContext()

export function Dapp() {
  const [selectedAddress, setSelectedAddress] = useState("")
  const [provider, setProvider] = useState("")
  const [setInStone, setSetInStone] = useState("")
  const [pacts, setPacts] = useState([])

  const location = useLocation()

  useEffect(() => {
    if (provider !== "") {
      setSetInStone(SetInStone => new ethers.Contract(
        contractAddress.SetInStone,
        SetInStoneArtifact.abi,
        provider.getSigner(0)
      ))
    }
  }, [provider])

  useEffect(() => {
    if (setInStone !== "") {
      (async () => {
        setSelectedAddress(await window.ethereum.request({ method: 'eth_requestAccounts' }))
      })()
    }
  }, [setInStone])

  useEffect(() => {
    if (selectedAddress !== "") {
      (async () => {
        _setEventListeners()
        
        setPacts(await _fetchPacts())
      })()
    }
  }, [selectedAddress])

  if (window.ethereum === undefined) {
    return <NoWalletDetected />
  }

  if (!provider) {
    return (
      <ConnectWallet 
        connectWallet={() => _connectWallet()}
      />
    )
  }

  return (
      <div>
        <PactViewsContext.Provider value={{
          createPact: _createPact,
          _pacts: pacts,
          confirmPact: _confirmPact,
          selectedAddress: selectedAddress,
          rejectPact: _rejectPact
        }}>
          <Hero size="fullheight">
            <MainNavbar />
            <Hero.Body textAlign="center">
              <Container
                breakpoint="desktop"
                max="true"
              >
                <Box>
                  { location.pathname === "/" ? <WelcomeMessage /> : "" }
                  <Outlet />
                </Box>
              </Container>
            </Hero.Body>
          </Hero>
        </PactViewsContext.Provider>
      </div>
    )

  async function _connectWallet() {
    if (typeof window.ethereum !== "undefined") {
      const injectedProvider = new ethers.providers.Web3Provider(window.ethereum)
      await setProvider(injectedProvider)
    }
    
    if (!_checkNetwork()) {
      return
    }

    window.ethereum.on("accountsChanged", (newAddress) => {
      setSelectedAddress(newAddress)
    })
  }

  function _getRpcErrorMessage(error) {
    if (error.data) {
      return error.data.message
    }

    return error.message
  }

  function _checkNetwork() {
    if (window.ethereum.networkVersion === HARDHAT_NETWORK_ID) {
      return true
    }

    return false
  }

  async function _createPact(description, address) {
    setInStone.createPact(description, address)
  }

  async function _setEventListeners() {
    ["PactCreated", "PactConfirmed", "PactRejected"].forEach(event => {
      setInStone.on(event, async (initiator, taker, description) => {
        if ((initiator.toLowerCase() === selectedAddress[0]) || (taker.toLowerCase() === selectedAddress[0])) {
          setPacts(await _fetchPacts())
        }
      })
    })
  }

  async function _fetchPacts() {
    if (setInStone && selectedAddress) {
      const bigNumberPactIds = await setInStone.getPactIdsByAddress(selectedAddress[0])
      const pactIds = bigNumberPactIds.map(id => id.toNumber())

      const pacts = []

      for (let i = 0; i < pactIds.length; i++) {
        const pact = await setInStone.getPact(pactIds[i])
        pacts.push(pact)
      }
      
      return pacts
    } 

    return []
  }

  async function _confirmPact(id) {
    setInStone.confirmPact(id)
  }

  async function _rejectPact(id) {
    setInStone.rejectPact(id)
  }
}
