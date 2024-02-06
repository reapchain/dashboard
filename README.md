<div align="center">

![Reapchain Dashboard](./public/reapchain_logo.png)

<h1>Reapchain Dashboard</h1>

**From the dashboard, you can explore blocks, send coin, and delegate everything.**

<!-- [![version](https://img.shields.io/github/tag/reapchain/dashboard)](https://github.com/reapchain/dashboard/releases/latest) -->

[![GitHub](https://img.shields.io/github/license/reapchain/dashboard.svg)](https://github.com/reapchain/dashboard/blob/main/LICENSE)
[![Deploy](https://github.com/reapchain/dashboard/actions/workflows/main.yml/badge.svg)](https://github.com/reapchain/dashboard/actions/workflows/main.yml)

</div>

# Description:

The Reapchain Dashboard is a web application that supports most of the activities supported by Reapchain.

It supports the following features:

- View status and summary information of Reapchain network
- Lite Explorer to view block and transaction information
- Connection with Keplr wallet or Metamask wallet
- Reap transfer
- View account information and witness list and information
- Staking-related functions such as delegation, redelegation, and unbonding

This project referenced the project below.

- [Ping Dashboard](https://ping.pub/)
- [ping-pub explorer github](https://github.com/ping-pub/explorer)

# Installation:

1. Install packages

```
npm install
```

or

```
npm install --legacy-peer-deps
```

2. Add Config file as follows

```
path: env/reapchain.config.js

// sample
export const chainInfo = {
  env: "",
  chainName: "",
  chainId: "",
  chainIdHex: "",
  cosmosChainId: "",
  restEndpoint: "",
  rpcEndpoint: "",
  evmEndpoint: "",
  stateSyncEndpoint: ["", ""],
  stateSyncP2P: "",
  stateSyncNodeId: "",
  dashboardUrl: ``,
  ethAccountExplorerUrl: ``,
};

export const networkInfo = {
  chain_name: chainInfo.chainName,
  coingecko: "",
  api: chainInfo.restEndpoint,
  rpc: chainInfo.rpcEndpoint,
  snapshot_provider: "",
  sdk_version: "",
  coin_type: "",
  min_tx_fee: "",
  addr_prefix: "",
  logo: "",
  assets: [
    {
      base: "",
      symbol: "",
      exponent: "",
      coingecko_id: "",
      logo: "",
    },
  ],
};

export const coinoneApi = "";
export const coingeckoApi = "";
export const gateioApi = "";


```

3. Running with npm

```
npm run start
```

4. Building for web servers, like nginx

```
npm run build
cp -r ./dist/* <ROOT_OF_WEB_SERVER>
```
