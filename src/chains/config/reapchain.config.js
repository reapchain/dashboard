// export const chainInfo = {
//   env: "main",
//   chainName: "reapchain",
//   chainId: "221230",
//   chainIdHex: "0x3602E",
//   cosmosChainId: "reapchain_221230-1",
//   restEndpoint: "https://lcd.reapchain.org",
//   rpcEndpoint: "https://rpc.reapchain.org",
//   evmEndpoint: "https://eth.reapchain.org",
//   stateSyncEndpoint: [
//     "https://state-sync-rpc.reapchain.org:443",
//     "https://rpc-network.reapchain.org:443",
//   ],
//   stateSyncP2P: "state-sync-p2p.reapchain.org:27100",
//   stateSyncNodeId: "e680439ea3ce99f020cc3250084b2cac61ac0042",
//   // snapshotInterval: 1200,
//   // snapshotKeepRecent: 10,
//   dashboardUrl: `https://dashboard.reapchain.org/validators`,
//   ethAccountExplorerUrl: `https://dashboard.reapchain.org/account`,
// };

// export const chainInfo = {
//   env: "test",
//   chainName: "Reapchain Testnet",
//   chainId: "221231",
//   chainIdHex: "0x3602F",
//   cosmosChainId: "reapchain_221231-1",
//   restEndpoint: "https://test-lcd.reapchain.org",
//   rpcEndpoint: "https://test-rpc.reapchain.org",
//   evmEndpoint: "https://test-eth.reapchain.org",
//   stateSyncEndpoint: [
//     "https://test-state-sync-rpc.reapchain.org:443",
//     "https://test-rpc-network.reapchain.org:443",
//   ],
//   stateSyncP2P: "13.125.20.241:27102",
//   stateSyncNodeId: "05ec7232feb9f0e8af8c2b5e98411043176995b0",
//   dashboardUrl: `https://test-dashboard.reapchain.org/staking`,
//   ethAccountExplorerUrl: `https://test-dashboard.reapchain.org/account`,
// };

export const chainInfo = {
  env: "bridge-test",
  chainName: "Reapchain Testnet",
  chainId: "221231",
  chainIdHex: "0x3602F",
  cosmosChainId: "reapchain_221231-1",
  restEndpoint: "http://43.201.57.7:1317",
  rpcEndpoint: "http://43.201.57.7:27000",
  evmEndpoint: "http://43.201.57.7:27400",
  stateSyncEndpoint: [
    "https://test-state-sync-rpc.reapchain.org:443",
    "https://test-rpc-network.reapchain.org:443",
  ],
  stateSyncP2P: "13.125.20.241:27102",
  stateSyncNodeId: "05ec7232feb9f0e8af8c2b5e98411043176995b0",
  dashboardUrl: `https://test-dashboard.reapchain.org/staking`,
  ethAccountExplorerUrl: `https://test-dashboard.reapchain.org/account`,
};

// export const chainInfo = {
//   env: "local",
//   chainName: "Reapchain Local",
//   chainId: "221231",
//   chainIdHex: "0x3602F",
//   cosmosChainId: "reapchain_221231-1",
//   restEndpoint: "http://192.168.100.4:1317",
//   rpcEndpoint: "http://192.168.100.4:27000",
//   evmEndpoint: "http://192.168.100.4:27400",
//   stateSyncEndpoint: [
//     "https://test-state-sync-rpc.reapchain.org:443",
//     "https://test-rpc-network.reapchain.org:443",
//   ],
//   stateSyncP2P: "13.125.20.241:27102",
//   stateSyncNodeId: "05ec7232feb9f0e8af8c2b5e98411043176995b0",
//   dashboardUrl: `https://test-dashboard.reapchain.org/staking`,
//   ethAccountExplorerUrl: `https://test-dashboard.reapchain.org/account`,
// };

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
