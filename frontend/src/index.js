import React from "react"
import ReactDOM from "react-dom/client"
import { Dapp } from "./components/Dapp"
import { Pacts } from "./components/Pacts"
import { NewPactForm } from "./components/NewPactForm"

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom"

const root = ReactDOM.createRoot(
  document.getElementById("root")
)
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Dapp />}>
        <Route path="pacts" element={<Pacts />}></Route>
        <Route path="pacts/new" element={<NewPactForm />}></Route>
      </Route>
    </Routes>
  </BrowserRouter>
)