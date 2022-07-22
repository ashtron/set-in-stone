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

import { Hero, Container, Box, Button, Field, Label, Form } from "react-bulma-components"
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
    if (selectedAddress) {
      setSetInStone(SetInStone => new ethers.Contract(
        contractAddress.SetInStone,
        SetInStoneArtifact.abi,
        provider.getSigner(0)
      ))
    }
  }, [provider])

  useEffect(() => {
    _initialize(selectedAddress)
  }, [selectedAddress])

  useEffect(() => {
    (async () => {
      setPacts(await _fetchPacts())
    })()
  }, [setInStone])

  if (window.ethereum === undefined) {
    return <NoWalletDetected />
  }

  if (!selectedAddress) {
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
          <nav>
            <Link to="/">Home</Link>{ " | " }
            <Link to="/pacts">My Pacts</Link>{ " | " }
            <Link to="/pacts/new">Create a Pact</Link>
          </nav>

          <Hero size="fullheight">
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
    await setSelectedAddress(await window.ethereum.request({ method: 'eth_requestAccounts' }))

    if (!_checkNetwork()) {
      return
    }

    window.ethereum.on("accountsChanged", ([newAddress]) => {
      if (newAddress === undefined) {
        return _resetState()
      }
      
      _initialize(newAddress)
    })
    
    window.ethereum.on("chainChanged", ([networkId]) => {
      _resetState()
    })
  }

  function _initialize(userAddress) {
    setSelectedAddress(userAddress)

    _initializeEthers()
  }

  async function _initializeEthers() {
    await setProvider(new ethers.providers.Web3Provider(window.ethereum))
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

    setNetworkError('Please connect Metamask to Localhost:8545')

    return false
  }

  async function _createPact(description, address) {
    setInStone.createPact(description, address)
  }

  async function _fetchPacts() {
    if (setInStone && selectedAddress) {
      const bigNumberPactIds = await setInStone.getPactsByAddress(selectedAddress[0])
      const pactIds = bigNumberPactIds.map(id => id.toNumber())
      console.log(pactIds)

      const pacts = []

      for (let i = 0; i < pactIds.length; i++) {
        const pact = await setInStone.getPact(i)
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
