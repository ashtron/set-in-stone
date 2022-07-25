import React, { useState, useEffect } from "react"
import { ethers } from "ethers"

import SetInStoneArtifact from "../contracts/SetInStone.json"
import contractAddress from "../contracts/contract-address.json"

import { NoWalletDetected } from "./NoWalletDetected"
import { ConnectWallet } from "./ConnectWallet"
import { Loading } from "./Loading"
import { Transfer } from "./Transfer"
import { TransactionErrorMessage } from "./TransactionErrorMessage"
import { WaitingForTransactionMessage } from "./WaitingForTransactionMessage"
import { NoTokensMessage } from "./NoTokensMessage"
import { NewPactForm } from "./NewPactForm"

import { Hero, Container, Box, Button, Field, Label, Form, Navbar } from "react-bulma-components"
import { Link, Outlet } from "react-router-dom"

const HARDHAT_NETWORK_ID = "1337"

const ERROR_CODE_TX_REJECTED_BY_USER = 4001

export const PactViewsContext = React.createContext()

export function Dapp() {
  const [selectedAddress, setSelectedAddress] = useState("")
  const [balance, setBalance] = useState("")
  const [networkError, setNetworkError] = useState("")
  const [provider, setProvider] = useState("")
  const [setInStone, setSetInStone] = useState("")
  const [pacts, setPacts] = useState([])

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
      console.log(provider);
      (async () => {
        setSelectedAddress(await window.ethereum.request({ method: 'eth_requestAccounts' }))
      })()
    }
  }, [setInStone])

  useEffect(() => {
    if (selectedAddress !== "") {
      console.log(selectedAddress);
      (async () => {
        setPacts(await _fetchPacts())
      })()
    }
  }, [selectedAddress])

  useEffect(() => {
    console.log("Provider:", provider)
    console.log("setInStone:", setInStone)
    console.log("selectedAddress:", selectedAddress)
  }, [selectedAddress])

  if (window.ethereum === undefined) {
    return <NoWalletDetected />
  }

  if (!provider) {
    return (
      <ConnectWallet 
        connectWallet={() => _connectWallet()} 
        networkError={networkError}
      />
    )
  }

  return (
      <div>
        <PactViewsContext.Provider value={{
          createPact: _createPact,
          _pacts: pacts,
          confirmPact: _confirmPact,
          selectedAddress: selectedAddress
        }}>
          <Hero size="fullheight">
            <Navbar>
              <Link to="/">Home</Link>{ " | " }
              <Link to="/pacts">My Pacts</Link>{ " | " }
              <Link to="/pacts/new">Create a Pact</Link>
            </Navbar>
            <Hero.Body textAlign="center">
              <Container>
                <Box>
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
      // await setSelectedAddress(await window.ethereum.request({ method: "eth_requestAccounts" }))
      // console.log("Provider:", provider)

      // await setSetInStone(new ethers.Contract(
      //   contractAddress.SetInStone,
      //   SetInStoneArtifact.abi,
      //   provider.getSigner(0)
      // ))

      // await setPacts(await _fetchPacts())
      // console.log(pacts)
    }
    
    if (!_checkNetwork()) {
      return
    }

    window.ethereum.on("accountsChanged", ([newAddress]) => {
      // if (newAddress === undefined) {
      //   return _resetState()
      // }
      
      // _initialize(newAddress)

      console.log("account changed!")
    })
    
  //   window.ethereum.on("chainChanged", ([networkId]) => {
  //     _resetState()
  //   })
  }

  function _getRpcErrorMessage(error) {
    if (error.data) {
      return error.data.message
    }

    return error.message
  }

  function _resetState() {
    setSelectedAddress("")
    setBalance("")
    setNetworkError("")
  }

  function _checkNetwork() {
    console.log("window.ethereum.networkVersion:", window.ethereum.networkVersion)
    if (window.ethereum.networkVersion === HARDHAT_NETWORK_ID) {
      return true
    }

    setNetworkError("Please connect Metamask to Localhost:8545")

    return false
  }

  async function _createPact(description, address) {
    setInStone.createPact(description, address)
  }

  async function _fetchPacts() {
    if (setInStone && selectedAddress) {
      const bigNumberPactIds = await setInStone.getPactsByAddress(selectedAddress[0])
      const pactIds = bigNumberPactIds.map(id => id.toNumber())
      console.log("pactIds:", pactIds)

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
}
