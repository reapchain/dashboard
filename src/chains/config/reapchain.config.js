export const chainInfo = {
  env: "test",
  chainName: "reapchain",
  chainId: "2023",
  chainIdHex: "0x7e6",
  cosmosChainId: "mercury_2023-1",
  restEndpoint: "https://test-lcd.reapchain.org",
  rpcEndpoint: "https://test-rpc.reapchain.org",
  evmEndpoint: "https://test-eth.reapchain.org",
  stateSyncEndpoint: [
    "https://test-state-sync-rpc.reapchain.org:443",
    "https://test-rpc-network.reapchain.org:443",
  ],
  stateSyncP2P: "13.125.20.241:27102",
  stateSyncNodeId: "05ec7232feb9f0e8af8c2b5e98411043176995b0",
  dashboardUrl: `https://test-dashboard.reapchain.org/staking`,
  ethAccountExplorerUrl: `https://test-dashboard.reapchain.org/account`,
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
