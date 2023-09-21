export const chainInfo = {
  env: "main",
  chainName: "Reapchain Mainnet",
  chainId: "221230",
  chainIdHex: "0x3602E",
  cosmosChainId: "reapchain_221230-1",
  restEndpoint: "https://lcd.reapchain.org",
  rpcEndpoint: "https://rpc.reapchain.org",
  evmEndpoint: "https://eth.reapchain.org",
  stateSyncEndpoint: [
    "https://state-sync-rpc.reapchain.org:443",
    "https://rpc-network.reapchain.org:443",
  ],
  stateSyncP2P: "state-sync-p2p.reapchain.org:27100",
  stateSyncNodeId: "e680439ea3ce99f020cc3250084b2cac61ac0042",
  dashboardUrl: `https://dashboard.reapchain.org/staking`,
  ethAccountExplorerUrl: `https://dashboard.reapchain.org/account`,
};

export const networkInfo = {
  chain_name: chainInfo.chainName,
  coingecko: "",
  api: chainInfo.restEndpoint,
  rpc: chainInfo.rpcEndpoint,
  snapshot_provider: "",
  sdk_version: "0.45.1",
  coin_type: "60",
  min_tx_fee: "31250000000000",
  addr_prefix: "reap",
  logo: "/logos/reapchain_logo.png",
  assets: [
    {
      base: "areap",
      symbol: "reap",
      exponent: "18",
      coingecko_id: "",
      logo: "/logos/reapchain_logo.png",
    },
  ],
};

export const coinoneApi =
  "https://cors-anywhere.herokuapp.com/https://api.coinone.co.kr";
export const coingeckoApi = "https://api.coingecko.com";
export const gateioApi = "https://data.gateapi.io";
