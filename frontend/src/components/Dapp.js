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

export const CreatePactContext = React.createContext()

export function Dapp() {
  const [selectedAddress, setSelectedAddress] = useState("")
  const [balance, setBalance] = useState("")
  const [networkError, setNetworkError] = useState("")
  const [provider, setProvider] = useState("")
  const [setInStone, setSetInStone] = useState("")

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
    if (selectedAddress) {
      _initialize(selectedAddress)
    }
  }, [selectedAddress])

  if (window.ethereum === undefined) {
    return <NoWalletDetected />
  }

  if (!selectedAddress) {
    return (
      <ConnectWallet 
        connectWallet={() => _connectWallet()} 
        networkError={networkError}
        // dismiss={() => _dismissNetworkError()}
      />
    )
  }

  return (
      <div>
        <CreatePactContext.Provider value={_createPact}>
          <nav>
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
        </CreatePactContext.Provider>
      </div>
    )

  // componentWillUnmount() {
  //   We poll the user's balance, so we have to stop doing that when Dapp
  //   gets unmounted
  //   _stopPollingData()
  // }

  async function _connectWallet() {
    setSelectedAddress(await window.ethereum.request({ method: 'eth_requestAccounts' }))
    console.log("selectedAddress:", await window.ethereum.request({ method: 'eth_requestAccounts' }))

    if (!_checkNetwork()) {
      return
    }

    // _initialize(selectedAddress)

    window.ethereum.on("accountsChanged", ([newAddress]) => {
      // _stopPollingData()

      if (newAddress === undefined) {
        return _resetState()
      }
      
      _initialize(newAddress)
    })
    
    window.ethereum.on("chainChanged", ([networkId]) => {
      // _stopPollingData()
      _resetState()
    })
  }

  function _initialize(userAddress) {
    setSelectedAddress(userAddress)

    _initializeEthers()
    // _getTokenData()
    // _startPollingData()
  }

  async function _initializeEthers() {
    await setProvider(new ethers.providers.Web3Provider(window.ethereum))
    console.log("provider:", provider)

    // setSetInStone(SetInStone => new ethers.Contract(
    //   contractAddress.SetInStone,
    //   SetInStoneArtifact.abi,
    //   provider.getSigner(0)
    // ))
  }

  function _startPollingData() {
    // _pollDataInterval = setInterval(() => _updateBalance(), 1000)

    // We run it once immediately so we don't have to wait for it
    // _updateBalance()
  }

 function _stopPollingData() {
    // clearInterval(_pollDataInterval)
    // _pollDataInterval = undefined
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
}
