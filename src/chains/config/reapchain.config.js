export const chainInfo = {
  env: "test",
  chainName: "reapchain",
  chainId: "2022",
  cosmosChainId: "mercury_2022-3",
  restEndpoint: "https://test-lcd.reapchain.org",
  rpcEndpoint: "https://test-rpc.reapchain.org",
  evmEndpoint: "https://test-eth.reapchain.org",
  stateSyncEndpoint: "https://state-sync-rpc.reapchain.org",
  dashboardUrl: `https://dashboard.reapchain.com/reapchain/staking`,
  ethAccountExplorerUrl: `https://dashboard.reapchain.com/reapchain/account`,
};

export const networkInfo = {
  chain_name: chainInfo.chainName,
  coingecko: "",
  api: chainInfo.restEndpoint,
  rpc: chainInfo.rpcEndpoint,
  snapshot_provider: "",
  sdk_version: "0.45.1",
  coin_type: "60",
  min_tx_fee: "10000000",
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
