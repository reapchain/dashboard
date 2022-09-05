// export const chainInfo = {
//   env: "develop",
//   chainName: "reapchain",
//   chainId: "2022",
//   cosmosChainId: "mercury_2022-3",
//   restEndPoint: "https://endpoint.reapchain.com:1317",
//   rpcEndPoint: "https://endpoint.reapchain.com:27100",
//   evmRpcEndPoint: "https://endpoint.reapchain.com:27400",
//   dashboardUrl: `https://dashboard.reapchain.com/reapchain/staking`,
// };

export const chainInfo = {
  env: "develop",
  chainName: "reapchain",
  chainId: "2022",
  cosmosChainId: "mercury_2022-3",
  restEndPoint: "http://192.168.100.44:1317",
  rpcEndPoint: "http://192.168.100.44:27100",
  evmRpcEndPoint: "http://192.168.100.44:27400",
  dashboardUrl: `https://dashboard.reapchain.com/reapchain/staking`,
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
export const gateioApi = "https://data.gateapi.io";
