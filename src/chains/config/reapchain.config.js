export const chainInfo = {
  env: "local",
  chainName: "reapchain_local",
  chainId: "2022",
  cosmosChainId: "mercury_2022-2",
  restEndPoint: "http://13.125.20.241:1317",
  rpcEndPoint: "http://13.125.20.241:27100",
  evmRpcEndPoint: "http://13.125.20.241:27400",
  dashboardUrl: "https://dashboard.reapchain.com",
};

export const networkInfo = {
  chain_name: chainInfo.chainName,
  coingecko: "",
  api: chainInfo.restEndPoint,
  rpc: chainInfo.rpcEndPoint,
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
