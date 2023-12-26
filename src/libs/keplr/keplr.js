import { chainInfo } from "/env/reapchain.config";

const chainId = chainInfo.cosmosChainId;

export const initKeplr = async () => {
  if (!window.getOfflineSigner || !window.keplr) {
    alert("Please install keplr extension");
    return null;
  } else {
    if (window.keplr.experimentalSuggestChain) {
      try {
        await window.keplr.experimentalSuggestChain(chainConfig_local);
      } catch (error) {
        console.log(error);
        alert("Failed to suggest the chain");
        return null;
      }
    } else {
      alert("Please use the recent version of keplr extension");
    }
  }
};

export const connectKeplrWallet = async () => {
  await initKeplr();

  if (!window.getOfflineSignerOnlyAmino || !window.keplr) {
    const error = "Please install Keplr extension";
    console.error(error);
    return null;
  }

  await window.keplr.enable(chainId);

  const offlineSigner = getOfflineSignerOnlyAmino(chainId);
  const accounts = await offlineSigner.getAccounts();

  if (accounts.length > 0) {
    const keyInfo = await keplr.getKey(chainId);
    if (keyInfo) {
      return keyInfo;
    }
  }

  return null;
};

export const getKeplr = async () => {
  if (window.keplr) {
    return window.keplr;
  }

  if (document.readyState === "complete") {
    return window.keplr;
  }

  return new Promise((resolve) => {
    const documentStateChange = (event) => {
      if (event.target && event.target.readyState === "complete") {
        resolve(window.keplr);
        document.removeEventListener("readystatechange", documentStateChange);
      }
    };

    document.addEventListener("readystatechange", documentStateChange);
  });
};

export const getAccounts = async () => {
  if (!window.getOfflineSigner || !window.keplr) {
    return [];
  }

  await window.keplr.enable(chainId);
  const offlineSigner = window.getOfflineSigner(chainId);
  const accounts = await offlineSigner.getAccounts();

  return {
    address: accounts[0].address,
    algo: accounts[0].algo,
    pubkey: {
      "@type": "/ethermint.crypto.v1.ethsecp256k1.PubKey",
      key: Buffer.from(accounts[0].pubkey).toString("base64") || "",
    },
  };
};

export const getOfflineSigner = () => {
  if (!window.getOfflineSigner || !window.keplr) {
    return null;
  }
  const offlineSigner = window.getOfflineSigner(chainId);
  return offlineSigner;
};

export const onloadKeplr = async () => {
  window.onload = async () => {
    initKeplr();
  };
};

const chainConfig_local = {
  rpc: chainInfo.rpcEndpoint,
  rpcConfig: undefined,
  rest: chainInfo.restEndpoint,
  restConfig: undefined,
  chainId: chainInfo.cosmosChainId,
  chainName: chainInfo.chainName,
  stakeCurrency: {
    coinDenom: "reap",
    coinMinimalDenom: "areap",
    coinDecimals: 18,
    coinGeckoId: "reap",
  },
  walletUrl: chainInfo.dashboardUrl,
  walletUrlForStaking: chainInfo.dashboardUrl,
  bip44: {
    coinType: 60,
  },
  bech32Config: {
    bech32PrefixAccAddr: "reap",
    bech32PrefixAccPub: "reappub",
    bech32PrefixValAddr: "reapvaloper",
    bech32PrefixValPub: "reapvaloperpub",
    bech32PrefixConsAddr: "reapvalcons",
    bech32PrefixConsPub: "reapvalconspub",
  },
  currencies: [
    {
      coinDenom: "REAP",
      coinMinimalDenom: "areap",
      coinDecimals: 18,
    },
  ],
  feeCurrencies: [
    {
      coinDenom: "REAP",
      coinMinimalDenom: "areap",
      coinDecimals: 18,
      gasPriceStep: {
        low: 120000000,
        average: 125000000,
        high: 130000000,
      },
    },
  ],
  features: ["ibc-transfer", "ibc-go", "eth-address-gen", "eth-key-sign"],
  beta: true,
};
