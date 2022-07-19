import React, { useState } from "react"
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

const HARDHAT_NETWORK_ID = '1337'

const ERROR_CODE_TX_REJECTED_BY_USER = 4001

const CreatePactContext = React.createContext()

export function Dapp() {
  const [selectedAddress, setSelectedAddress] = useState("")
  const [balance, setBalance] = useState("")
  const [networkError, setNetworkError] = useState("")

  if (window.ethereum === undefined) {
    return <NoWalletDetected />
  }

  if (!this.state.selectedAddress) {
    return (
      <ConnectWallet 
        connectWallet={() => this._connectWallet()} 
        networkError={this.state.networkError}
        dismiss={() => this._dismissNetworkError()}
      />
    )
  }

  return (
      <div>
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
      </div>

      // <div>
        // <nav>
        //   <Link to="/pacts">Pacts</Link>
        // </nav>
      //   <Outlet />
      // </div>

      // <div>
        // <NewPactForm createPact={ this._createPact }/>
      // </div>
    )
  // }

  // componentWillUnmount() {
  //   We poll the user's balance, so we have to stop doing that when Dapp
  //   gets unmounted
  //   this._stopPollingData()
  // }

  async function _connectWallet() {
    const [selectedAddress] = await window.ethereum.request({ method: 'eth_requestAccounts' })

    if (!this._checkNetwork()) {
      return
    }

    this._initialize(selectedAddress)

    window.ethereum.on("accountsChanged", ([newAddress]) => {
      // this._stopPollingData()

      if (newAddress === undefined) {
        return this._resetState()
      }
      
      this._initialize(newAddress)
    })
    
    window.ethereum.on("chainChanged", ([networkId]) => {
      // this._stopPollingData()
      this._resetState()
    })
  }

  function _initialize(userAddress) {
    setSelectedAddress(userAddress)

    _initializeEthers()
    // this._getTokenData()
    // this._startPollingData()
  }

  async function _initializeEthers() {
    this._provider = new ethers.providers.Web3Provider(window.ethereum)

    this._setInStone = new ethers.Contract(
      contractAddress.SetInStone,
      SetInStoneArtifact.abi,
      this._provider.getSigner(0)
    )
  }

  function _startPollingData() {
    this._pollDataInterval = setInterval(() => this._updateBalance(), 1000)

    // We run it once immediately so we don't have to wait for it
    this._updateBalance()
  }

 function _stopPollingData() {
    clearInterval(this._pollDataInterval)
    this._pollDataInterval = undefined
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
    this._setInStone.createPact(description, address)
  }
}
