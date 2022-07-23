#!/bin/bash

code . &&
ttab npx hardhat node &&
ttab npx hardhat --network localhost run scripts/deploy.js &&
ttab -d frontend npm start